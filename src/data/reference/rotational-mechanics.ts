import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'rotational-mechanics',
  title: 'Rotational Mechanics',
  category: 'physics',
  tags: ['math', 'engineering'],
  keywords: ['torque', 'angular momentum', 'moment of inertia', 'centripetal', 'angular velocity', 'gyroscope'],
  icon: '⚙️',
  tagline: 'Why wheels changed everything, figure skaters spin faster with arms in, and gears trade speed for force.',
  relatedStories: ['wheel-of-dharma', 'potters-first-bowl', 'kite-festival'],
  understand: [
    {
      title: 'Why Wheels Changed Everything',
      beginnerContent:
        '**The problem the wheel solved:**\n\n' +
        'Before the wheel, moving heavy objects meant dragging them across the ground. Dragging means fighting **sliding friction** — every bump and groove on the two surfaces interlocks, resisting motion. The wheel replaced sliding with **rolling friction**, which is dramatically smaller.\n\n' +
        'When a wheel rolls, only a tiny patch touches the ground at any instant, and that patch does not slide — it just presses down and lifts off. The result: a wheeled cart requires roughly **20 to 50 times less force** to move than dragging the same load.\n\n' +
        '| Type of friction | Coefficient (typical) | Force to move 500 kg |\n' +
        '|-----------------|----------------------|---------------------|\n' +
        '| Sliding (wood on ground) | 0.3 – 0.5 | 1,470 – 2,450 N |\n' +
        '| Rolling (wooden wheel on road) | 0.01 – 0.05 | 49 – 245 N |\n' +
        '| Rolling (rubber tyre on tarmac) | 0.005 – 0.01 | 25 – 49 N |\n' +
        '| Rolling (steel wheel on steel rail) | 0.001 – 0.002 | 5 – 10 N |\n\n' +
        'A child can pull a 500 kg cart on smooth ground — but could never drag it without wheels.\n\n' +
        '**Analogy:** Imagine dragging a heavy suitcase across an airport floor versus pulling one with wheels. That relief you feel when you tilt the suitcase onto its wheels is the entire history of civilisation\'s relationship with the wheel.\n\n' +
        '**Why it matters beyond transport:**\n\n' +
        '| Invention | What it rotates | What it enabled |\n' +
        '|-----------|----------------|----------------|\n' +
        '| Potter\'s wheel (~3500 BC) | Clay on a disc | Mass production of pottery |\n' +
        '| Waterwheel (~300 BC) | Paddles in a river | Grinding grain without manual labour |\n' +
        '| Spinning wheel (~1000 AD) | Spindle for thread | Faster textile production |\n' +
        '| Turbine (1884) | Bladed rotor | Electricity generation |\n' +
        '| Hard drive (1956) | Magnetic platter | Digital data storage |\n\n' +
        'Nearly every machine that converts energy into motion uses rotation somewhere in its design. In Assam, traditional **jaapi** weavers spin bamboo strips on a rotating frame, and the **dheki** (foot-operated rice husker) uses a pivoting beam — both ancient rotational tools still in daily use.',
      intermediateContent:
        '**Quantifying the advantage — rolling vs sliding friction:**\n\n' +
        'The coefficient of rolling friction (μ_r) is typically 0.001–0.01, compared to sliding friction μ_s ≈ 0.2–0.8.\n\n' +
        '| Surface combination | μ_sliding | μ_rolling | Reduction factor |\n' +
        '|--------------------|----------|----------|------------------|\n' +
        '| Wood on wood | 0.40 | 0.05 | 8× |\n' +
        '| Rubber on concrete | 0.70 | 0.01 | 70× |\n' +
        '| Steel on steel | 0.60 | 0.002 | 300× |\n' +
        '| With ball bearings | — | 0.001 | 600× |\n\n' +
        '**Worked example — cart on different surfaces:**\n\n' +
        'For a 1000 kg cart, the force needed to pull it:\n\n' +
        '- Sliding: F = μ_s × mg = 0.5 × 1000 × 9.81 = **4,905 N**\n' +
        '- Rolling on smooth road (μ_r = 0.005): F = 0.005 × 1000 × 9.81 = **49 N** — a 100× reduction\n' +
        '- Rolling on soft ground (μ_r = 0.05): F = **245 N** — much harder\n\n' +
        'This is why ancient civilisations built roads — reducing μ_r by compacting and smoothing the surface.\n\n' +
        '**Why larger wheels roll more easily:**\n\n' +
        'Rolling friction arises from deformation: as a wheel rolls, the surface ahead of the contact patch deforms slightly, creating an asymmetric pressure distribution that resists motion. Larger wheels spread this deformation over a larger area, reducing the effect.\n\n' +
        '| Wheel diameter | μ_r on soft ground | Force for 500 kg cart |\n' +
        '|---------------|-------------------|----------------------|\n' +
        '| 0.3 m (small) | 0.08 | 392 N |\n' +
        '| 0.6 m (medium) | 0.05 | 245 N |\n' +
        '| 1.0 m (large) | 0.03 | 147 N |\n\n' +
        'This is why ox-carts in Assam\'s Barpeta district traditionally use large wooden wheels — they handle soft, muddy paths during the monsoon far better than small wheels would.\n\n' +
        '**Energy lost to rolling friction:** E = μ_r × mg × d. A car (1500 kg, μ_r = 0.01) travelling 100 km: E = 0.01 × 1500 × 9.81 × 100,000 = **14.7 MJ ≈ 4.1 kWh**.',
      advancedContent:
        '**Hertzian contact theory — the mathematics of rolling:**\n\n' +
        'The mechanics of rolling contact was first rigorously analysed by **Hertz (1882)**, who showed that two elastic bodies in contact form an elliptical contact patch with pressure distribution p(r) = p₀√(1 − r²/a²).\n\n' +
        'The half-width of the contact patch for a wheel of radius R on a flat surface under load F:\n\n' +
        '`a = (3FR / 4E*)^(1/3)`\n\n' +
        'where E* is the combined elastic modulus.\n\n' +
        '| Application | R (m) | Load (kN) | E* (GPa) | Patch half-width a |\n' +
        '|------------|-------|----------|---------|-------------------|\n' +
        '| Bicycle tyre | 0.35 | 0.4 | 3 | ~8 mm |\n' +
        '| Car tyre | 0.30 | 4 | 5 | ~15 mm |\n' +
        '| Railway wheel | 0.50 | 50 | 100 | 3.4 mm |\n' +
        '| Ball bearing | 0.005 | 1 | 200 | 0.15 mm |\n\n' +
        'A railway wheel supports enormous loads through a tiny 3.4 mm patch — explaining why rail is the most energy-efficient ground transport.\n\n' +
        '**Traction control and slip:**\n\n' +
        'Friction peaks at a slip ratio s ≈ 0.05–0.15 (slight wheel slip) and drops at higher slip (spinning wheels). Anti-lock braking systems (ABS) pulse the brakes to maintain each wheel near peak-friction slip.\n\n' +
        '| Slip ratio | Friction coefficient | Condition |\n' +
        '|-----------|---------------------|----------|\n' +
        '| 0 | 0 (static) | Pure rolling |\n' +
        '| 0.05–0.15 | 0.7–0.9 (peak) | Optimal braking |\n' +
        '| 0.3–0.5 | 0.5–0.6 | Partial skid |\n' +
        '| 1.0 | 0.4–0.5 | Locked wheel |\n\n' +
        'The **tribology** of wheel-rail contact involves complex elastohydrodynamic lubrication, wear mechanisms (adhesive, abrasive, fatigue), and surface engineering. Indian Railways spends ~₹2,000 crore annually on rail and wheel maintenance. The NFR (Northeast Frontier Railway), headquartered in Guwahati, manages some of the most challenging terrain in the network — the steep gradients of the Lumding-Badarpur section require specially hardened wheel profiles to handle the extreme contact stresses on curves.',
      interactive: {
        type: 'did-you-know',
        props: {
          facts: [
            'The oldest known wheel was found in Slovenia and dates to about 3200 BC — over 5,000 years ago.',
            'Ball bearings reduce friction even further by replacing sliding contact with rolling contact between tiny steel balls. A bicycle wheel with good bearings can spin freely for minutes.',
            'The potter\'s wheel was probably invented before the transport wheel — humans figured out spinning clay before they thought of spinning a cart.',
            'The Konark Sun Temple in Odisha features 24 massive stone chariot wheels, each over 3 metres in diameter — they are so precisely carved that they function as sundials.',
          ],
        },
      },
    },
    {
      title: 'Torque — The Twisting Force',
      diagram: 'RotTorqueDiagram',
      beginnerContent:
        '**What torque is — the rotational version of force:**\n\n' +
        'Force pushes or pulls in a straight line. Torque twists around an axis. The formula is simple:\n\n' +
        '`Torque = Force × Distance from axis`\n\n' +
        '**Analogy:** Think of torque like leverage. Pushing a door near the hinge is like trying to crack open a walnut with your fingers. Pushing at the handle (far from the hinge) is like using a nutcracker — same effort, enormously more effect.\n\n' +
        '**Try it yourself:** Open a door by pushing right next to the hinge. It is nearly impossible, even though you are applying the same force. Now push at the handle — effortless.\n\n' +
        '| Scenario | Force (N) | Distance from axis (m) | Torque (N·m) |\n' +
        '|----------|----------|----------------------|-------------|\n' +
        '| Door push at handle | 5 | 0.8 | 4.0 |\n' +
        '| Door push near hinge | 5 | 0.1 | 0.5 |\n' +
        '| Wrench on bolt | 50 | 0.3 | 15.0 |\n' +
        '| Bicycle pedal | 80 | 0.17 | 13.6 |\n' +
        '| Car engine (typical) | — | — | 200–400 |\n\n' +
        'The same principle explains why:\n' +
        '- A **longer wrench** makes loosening a stuck bolt easier\n' +
        '- Bicycle pedals attach at the end of crank arms, not directly to the axle\n' +
        '- A large steering wheel is easier to turn than a small one\n' +
        '- Traditional **dheki** rice huskers in Assam use a long beam — the farmer steps on the far end, maximising torque to lift and drop the heavy pounding head\n\n' +
        'Torque is measured in **Newton-metres (N·m)**. Your hand turning a doorknob produces about 1–2 N·m. A car engine produces 200–400 N·m.',
      intermediateContent:
        '**The full torque formula:**\n\n' +
        '`τ = rF sin θ`\n\n' +
        'where r is the lever arm, F is the applied force, and θ is the angle between them. Maximum torque occurs when the force is perpendicular (θ = 90°, sin 90° = 1).\n\n' +
        '**Worked example 1 — wrench at different angles:**\n\n' +
        '| Angle θ | sin θ | Torque (0.3 m wrench, 50 N) |\n' +
        '|---------|-------|----------------------------|\n' +
        '| 90° (perpendicular) | 1.000 | 15.0 N·m |\n' +
        '| 60° | 0.866 | 13.0 N·m |\n' +
        '| 45° | 0.707 | 10.6 N·m |\n' +
        '| 30° | 0.500 | 7.5 N·m |\n' +
        '| 0° (along wrench) | 0.000 | 0 N·m |\n\n' +
        'Pulling along the wrench handle produces zero torque — only the perpendicular component matters.\n\n' +
        '**Worked example 2 — the see-saw (torque balance):**\n\n' +
        'A 30 kg child sits 2 m from the pivot. Where must a 60 kg adult sit to balance?\n\n' +
        'Balance condition: τ₁ = τ₂, so m₁g × d₁ = m₂g × d₂\n\n' +
        '30 × 9.81 × 2 = 60 × 9.81 × d₂ → d₂ = **1 m**\n\n' +
        '**Worked example 3 — power from torque:**\n\n' +
        'A 2.0L engine produces 200 N·m at 4000 RPM:\n\n' +
        'Power = τ × ω = 200 × (4000 × 2π/60) = **83,776 W ≈ 112 hp**\n\n' +
        '| Engine type | Torque (N·m) | RPM | Power (hp) |\n' +
        '|------------|-------------|-----|------------|\n' +
        '| Diesel truck | 800 | 1500 | 168 |\n' +
        '| Petrol sedan | 200 | 4000 | 112 |\n' +
        '| F1 race car | 250 | 12000 | 418 |\n' +
        '| Electric motor (Tesla) | 660 | 5000 | 462 |\n\n' +
        'The formula **P = τω** explains why high-torque, low-RPM diesel engines and low-torque, high-RPM petrol engines can produce similar power outputs. Electric motors are special — they deliver maximum torque from 0 RPM, which is why EVs accelerate so quickly off the line.',
      advancedContent:
        '**Torque as a pseudovector — the cross product:**\n\n' +
        'Torque is fundamentally a **pseudovector** (axial vector): τ = r × F, pointing along the rotation axis by the right-hand rule. In three dimensions, the angular momentum equation **dL/dt = τ** is the rotational analogue of Newton\'s second law F = dp/dt.\n\n' +
        '| Linear quantity | Rotational analogue | Relationship |\n' +
        '|----------------|--------------------|--------------|\n' +
        '| Force F | Torque τ = r × F | τ causes angular acceleration |\n' +
        '| Momentum p = mv | Angular momentum L = Iω | L resists changes in rotation |\n' +
        '| F = ma | τ = Iα | Same structure, different domain |\n' +
        '| Power P = Fv | Power P = τω | Work per unit time |\n' +
        '| KE = ½mv² | KE = ½Iω² | Energy stored in motion |\n\n' +
        'For a rigid body, L = Iω, where I is the **moment of inertia tensor** (a 3×3 symmetric matrix). The **principal axes** are eigenvectors of I; rotation about a principal axis requires no torque to maintain.\n\n' +
        'Rotation about a non-principal axis causes **torque-free precession** — this is why a thrown rugby ball wobbles.\n\n' +
        '**Euler\'s equations** for rigid-body rotation:\n\n' +
        '`I₁(dω₁/dt) − (I₂ − I₃)ω₂ω₃ = τ₁` (and cyclic permutations)\n\n' +
        'The **tennis racket theorem** (Dzhanibekov effect, discovered on the ISS) shows that rotation about the intermediate principal axis is unstable — a wing nut flipped in microgravity spontaneously reverses its rotation direction.\n\n' +
        '| Axis | Stability | Example |\n' +
        '|------|----------|--------|\n' +
        '| Maximum I (longest axis) | Stable | Spinning a pen end-over-end |\n' +
        '| Minimum I (shortest axis) | Stable | Spinning a coin on a table |\n' +
        '| Intermediate I | **Unstable** | Flipping a phone — it wobbles |\n\n' +
        '**Torque ripple** in electric motors (from discrete coil switching) is minimised by skewing stator slots, using fractional-slot windings, or sinusoidal current control — critical for smooth EV drivetrains.',
    },
    {
      title: 'Angular Momentum — Why Spinning Things Stay Upright',
      diagram: 'RotGyroscopeDiagram',
      beginnerContent:
        '**The core idea — spinning things resist tipping:**\n\n' +
        'A stationary bicycle falls over instantly. A moving bicycle stays upright almost magically. The key is **angular momentum** — the rotational equivalent of regular (linear) momentum.\n\n' +
        'A spinning object resists changes to its axis of rotation. The faster it spins and the more mass it has far from the axis, the stronger this resistance.\n\n' +
        '| Object | Why it stays stable | What provides angular momentum |\n' +
        '|--------|-------------------|-------------------------------|\n' +
        '| Spinning top | Resists tipping over | Fast spin of heavy rim |\n' +
        '| Bicycle wheels | Keeps bike upright | Spinning wheels + forward motion |\n' +
        '| Gyroscope | Holds orientation even when tilted | Heavy disc spinning at high speed |\n' +
        '| Spiraling football | Flies straight through the air | Spin applied by the throw |\n' +
        '| Rifle bullet | Flies accurately over long distances | Spin from rifled barrel grooves |\n\n' +
        '**Analogy:** Angular momentum is like stubbornness. A stationary object has no opinion about which way it faces — push it and it tips. A spinning object has very strong opinions — try to tip it and it fights back. The faster the spin, the more stubborn it becomes.\n\n' +
        '**Conservation of angular momentum:**\n\n' +
        'Angular momentum cannot change unless an external torque acts. This leads to one of the most beautiful effects in physics:\n\n' +
        '| Scenario | What happens | Why |\n' +
        '|----------|------------|-----|\n' +
        '| Skater pulls arms in | Spin speeds up dramatically | Less spread-out mass, so must spin faster |\n' +
        '| Diver tucks into a ball | Somersaults become rapid | Same principle as the skater |\n' +
        '| Cat falls and lands on feet | Twists body to rotate | Uses angular momentum conservation to self-right |\n\n' +
        'Spacecraft use spinning **reaction wheels** (small flywheels inside the craft) to change orientation without using fuel. By spinning a wheel one way, the spacecraft rotates the other way — conservation in action. India\'s **Chandrayaan-3** lunar lander used reaction wheels during its precise descent to the Moon\'s south pole.',
      intermediateContent:
        '**The formula and worked examples:**\n\n' +
        '`L = Iω` (angular momentum = moment of inertia × angular velocity)\n\n' +
        '**Worked example 1 — bicycle wheel:**\n\n' +
        'A bicycle wheel (m = 2 kg, r = 0.35 m) spinning at 200 RPM:\n\n' +
        '- I = ½mr² = 0.5 × 2 × 0.35² = **0.1225 kg·m²**\n' +
        '- ω = 200 × 2π/60 = **20.9 rad/s**\n' +
        '- L = Iω = 0.1225 × 20.9 = **2.56 kg·m²/s**\n\n' +
        '**Worked example 2 — figure skater (conservation):**\n\n' +
        'Since L is conserved (no external torque), if I decreases, ω must increase:\n\n' +
        '| Position | I (kg·m²) | ω (rev/s) | L (kg·m²/s) |\n' +
        '|----------|----------|----------|-------------|\n' +
        '| Arms out (start) | 4.0 | 2.0 | 8.0 |\n' +
        '| Arms half-in | 2.5 | 3.2 | 8.0 |\n' +
        '| Arms fully tucked | 1.5 | 5.3 | 8.0 |\n\n' +
        'The skater nearly triples their spin rate without any extra effort — pure physics.\n\n' +
        '**Worked example 3 — gyroscopic precession:**\n\n' +
        'When a torque τ is applied perpendicular to L, the spin axis **precesses** (rotates slowly around the vertical):\n\n' +
        '`Ω = τ/L = mgr/(Iω)`\n\n' +
        'A spinning top (I = 0.001 kg·m², ω = 100 rad/s, m = 0.2 kg, r = 0.03 m):\n\n' +
        'Ω = (0.2 × 9.81 × 0.03) / (0.001 × 100) = **0.59 rad/s** — one full precession circle every **10.7 seconds**.\n\n' +
        '| Parameter changed | Effect on precession rate |\n' +
        '|------------------|-------------------------|\n' +
        '| Double the spin speed ω | Precession halves (slower wobble) |\n' +
        '| Double the mass m | Precession doubles (faster wobble) |\n' +
        '| Double the moment of inertia I | Precession halves |\n' +
        '| Tilt further from vertical | Greater torque, faster precession |\n\n' +
        'This is why a toy gyroscope seems to defy gravity — it doesn\'t fall; it precesses.',
      advancedContent:
        '**Angular momentum at every scale — from atoms to galaxies:**\n\n' +
        'At the **quantum level**, angular momentum is quantised:\n\n' +
        '- Orbital: L = √(l(l+1))ℏ with l = 0, 1, 2, ...\n' +
        '- z-component: L_z = mℏ with m = −l, ..., +l\n' +
        '- Electron spin: S = √(s(s+1))ℏ with s = ½, giving only two z-projections: ±ℏ/2\n\n' +
        '| Quantum number | What it determines | Allowed values |\n' +
        '|---------------|-------------------|----------------|\n' +
        '| l (orbital) | Shape of electron cloud | 0, 1, 2, ..., (n−1) |\n' +
        '| m (magnetic) | Orientation in magnetic field | −l to +l |\n' +
        '| s (spin) | Intrinsic angular momentum | ½ for electrons |\n' +
        '| m_s (spin projection) | Spin up or down | +½ or −½ |\n\n' +
        'This quantisation produces the structure of the periodic table, fine structure of spectral lines, and behaviour of magnets.\n\n' +
        '**At cosmic scales — neutron star spin-up:**\n\n' +
        'Conservation of angular momentum explains why neutron stars spin at incredible rates:\n\n' +
        '| Stage | Radius | Rotation period | ω |\n' +
        '|-------|--------|----------------|----|\n' +
        '| Sun-like star | 700,000 km | ~25 days | 2.9 × 10⁻⁶ rad/s |\n' +
        '| Collapsing core | ~1,000 km | ~1 hour | 1.7 × 10⁻³ rad/s |\n' +
        '| Neutron star | ~10 km | ~1 ms | ~4,500 rad/s (716 Hz) |\n\n' +
        'The core shrinks by a factor of ~10⁵, so ω increases by ~(10⁵)² = **10¹⁰** — conservation at its most dramatic.\n\n' +
        '**Coriolis effect — angular momentum in a rotating frame:**\n\n' +
        'In the Northern Hemisphere, moving air masses are deflected to the right, creating cyclonic rotation in hurricanes and driving global weather patterns. The Rossby number Ro = v/(fL) determines whether Coriolis effects matter:\n\n' +
        '| System | Ro | Coriolis matters? |\n' +
        '|--------|-----|------------------|\n' +
        '| Bathtub vortex | >> 1 | No |\n' +
        '| Tornado | ~1 | Marginally |\n' +
        '| Hurricane | << 1 | Dominant |\n' +
        '| Ocean current | << 1 | Dominant |\n\n' +
        'The **Chandrasekhar limit** (1.4 solar masses) — above which electron degeneracy pressure cannot support a white dwarf — involves a balance between gravitational and quantum angular momentum (Pauli exclusion) effects.',
    },
    {
      title: 'Gears — Trading Speed for Force',
      diagram: 'RotGearsDiagram',
      beginnerContent:
        '**The gear trade-off — speed vs force:**\n\n' +
        'Two toothed wheels mesh together. When one turns, the other turns in the opposite direction. The magic is in the **size difference**.\n\n' +
        'If a small gear with 10 teeth drives a large gear with 20 teeth, the large gear turns at **half the speed but with twice the torque**. You have traded speed for force.\n\n' +
        '| Gear setup | Speed change | Torque change | Best for |\n' +
        '|-----------|-------------|--------------|----------|\n' +
        '| Small drives large (2:1) | Halved | Doubled | Climbing hills, heavy loads |\n' +
        '| Large drives small (1:2) | Doubled | Halved | Speed on flat ground |\n' +
        '| Same size (1:1) | Unchanged | Unchanged | Reversing direction |\n\n' +
        '**Real-world example — bicycle gears:**\n\n' +
        '| Gear | Front sprocket | Rear sprocket | Effect |\n' +
        '|------|--------------|--------------|--------|\n' +
        '| Low (hill climbing) | Small (28T) | Large (34T) | Slow but powerful — easy pedalling uphill |\n' +
        '| Medium (cruising) | Middle (38T) | Medium (18T) | Balanced speed and effort |\n' +
        '| High (flat speed) | Large (48T) | Small (11T) | Fast but hard — maximum speed on flat roads |\n\n' +
        'The **gear ratio** tells you the trade-off. A 2:1 ratio means the output shaft turns at half the speed but with double the torque.\n\n' +
        'Gears are everywhere: clocks, car transmissions, electric drills, food mixers, and even inside your wristwatch. The clock in the **Kamakhya Temple** bell tower uses gears with a ratio of hundreds-to-one, converting the slow fall of a weight into the fast tick of a second hand.\n\n' +
        '**Analogy:** Gears are like different hiking strategies. Low gear is like taking small, easy steps up a steep hill — slow but you don\'t get tired. High gear is like taking giant leaps on flat ground — fast but exhausting on a slope.',
      intermediateContent:
        '**The gear ratio formula and worked examples:**\n\n' +
        '`GR = N_driven / N_driving = ω_driving / ω_driven = τ_driven / τ_driving`\n\n' +
        '**Worked example 1 — simple gear pair:**\n\n' +
        'A 20-tooth gear driving a 60-tooth gear:\n' +
        'GR = 60/20 = **3:1**. The driven gear turns at 1/3 the speed but with 3× the torque.\n\n' +
        '**Worked example 2 — bicycle speed calculation:**\n\n' +
        'Front chainring: 44 teeth. Rear cog: 11 teeth. GR = 44/11 = **4:1**.\n\n' +
        '| Step | Calculation | Result |\n' +
        '|------|-----------|--------|\n' +
        '| Wheel revolutions per pedal turn | GR = 4:1 | 4 revolutions |\n' +
        '| Distance per wheel revolution | Circumference = π × 0.67 m | 2.1 m |\n' +
        '| Distance per pedal turn | 4 × 2.1 | 8.4 m |\n' +
        '| Speed at 80 RPM cadence | 80 × 8.4 / 60 | **11.2 m/s = 40.3 km/h** |\n\n' +
        '**Worked example 3 — car transmission:**\n\n' +
        '| Gear | Gearbox ratio | Final drive | Overall ratio | Purpose |\n' +
        '|------|-------------|------------|--------------|--------|\n' +
        '| 1st | 3.5:1 | 3.5:1 | 12.25:1 | Maximum torque for starting |\n' +
        '| 3rd | 1.5:1 | 3.5:1 | 5.25:1 | City driving |\n' +
        '| 5th | 0.8:1 | 3.5:1 | 2.80:1 | Highway cruising |\n' +
        '| Reverse | 3.2:1 | 3.5:1 | 11.2:1 | High torque, low speed |\n\n' +
        '**Efficiency:**\n\n' +
        'Power is conserved in ideal gears: P_in = P_out, so τ₁ω₁ = τ₂ω₂.\n\n' +
        'Real gears lose ~2–5% per mesh to friction:\n\n' +
        '| Gear stages | Efficiency per stage | Overall efficiency |\n' +
        '|------------|--------------------|-----------------|\n' +
        '| 1 stage | 98% | 98.0% |\n' +
        '| 2 stages | 98% | 96.0% |\n' +
        '| 3 stages | 98% | 94.1% |\n' +
        '| 5 stages | 98% | 90.4% |',
      advancedContent:
        '**Gear tooth geometry — the involute profile:**\n\n' +
        'Gear teeth follow the **involute curve** — a curve traced by the end of a taut string unwinding from a circle. Involute gears maintain a constant velocity ratio regardless of slight changes in centre distance, making them tolerant of manufacturing imperfections.\n\n' +
        '| Gear type | Tooth shape | Contact ratio | Noise level | Application |\n' +
        '|-----------|-----------|--------------|------------|------------|\n' +
        '| Spur | Straight | 1.5–1.8 | High | Simple machines, clocks |\n' +
        '| Helical | Angled | 2–3 | Low | Car transmissions |\n' +
        '| Bevel | Conical | 1.5–2 | Medium | Right-angle drives |\n' +
        '| Worm | Screw + wheel | 1 | Very low | High ratio in small space |\n' +
        '| Planetary | Sun + planets + ring | 2–4 | Low | Automatic transmissions |\n\n' +
        '**Planetary (epicyclic) gear sets:**\n\n' +
        'A central sun gear, planet gears on a carrier, and an outer ring gear provide high ratios in compact packages.\n\n' +
        'Holding the ring gear gives: GR = 1 + N_ring/N_sun\n\n' +
        'Modern automatic transmissions (like ZF\'s 8-speed) stack multiple planetary sets and selectively lock components to achieve 8+ distinct ratios.\n\n' +
        '**Harmonic drives** (strain wave gearing) achieve ratios of 30:1 to 320:1 in a single stage with zero backlash, using a flexible spline that is slightly smaller than a rigid circular spline — essential for robot joints and space mechanisms. ISRO uses harmonic drives in the robotic arms planned for the Gaganyaan mission.\n\n' +
        '| Drive type | Ratio range | Backlash | Efficiency | Key use |\n' +
        '|-----------|------------|---------|-----------|--------|\n' +
        '| Spur gear pair | 1:1 – 10:1 | Moderate | 95–98% | General machinery |\n' +
        '| Planetary set | 3:1 – 12:1 | Low | 90–97% | Auto transmissions |\n' +
        '| Harmonic drive | 30:1 – 320:1 | Zero | 70–85% | Robot joints, space |\n' +
        '| Cycloidal drive | 6:1 – 120:1 | Very low | 85–93% | Heavy robotics |\n\n' +
        'The theoretical efficiency of an involute gear pair: η = 1 − πμ(1/N₁ + 1/N₂), where μ is the friction coefficient (~0.05 for lubricated steel).',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each gear setup to its effect',
          pairs: [
            ['Small drives large (2:1)', 'Output is slower but has double the torque — good for climbing hills'],
            ['Large drives small (1:2)', 'Output is faster but has half the torque — good for speed on flat ground'],
            ['Same size gears (1:1)', 'Speed and torque stay the same — used to reverse direction of rotation'],
            ['Worm gear', 'Very high gear ratio in compact space — used in guitar tuning pegs'],
          ],
        },
      },
    },
    {
      title: 'Moment of Inertia — Why Figure Skaters Spin Faster with Arms In',
      beginnerContent:
        '**Mass vs moment of inertia — where the mass is matters:**\n\n' +
        'In linear motion, **mass** determines how hard it is to accelerate an object. In rotation, the equivalent is **moment of inertia** — and it depends not just on how much mass there is, but on **how far that mass is from the axis of rotation**.\n\n' +
        'Mass far from the axis contributes much more than the same mass close to the axis.\n\n' +
        '**Analogy:** Imagine spinning a heavy rope. Hold it at the centre and spin it — easy. Hold it at one end and spin it — much harder. The mass is the same, but its distance from your hand (the axis) makes all the difference.\n\n' +
        '| Object | Mass far from axis? | Moment of inertia | Easy to spin? |\n' +
        '|--------|-------------------|------------------|---------------|\n' +
        '| Figure skater, arms OUT | Yes | High | Slow spin |\n' +
        '| Figure skater, arms IN | No | Low | Fast spin |\n' +
        '| Hollow ball | Yes (all mass on surface) | High | Harder to spin |\n' +
        '| Solid ball (same mass) | No (mass spread throughout) | Lower | Easier to spin |\n' +
        '| Long barbell | Yes (weights at ends) | Very high | Very hard to spin |\n\n' +
        '**The figure skater effect — conservation of angular momentum:**\n\n' +
        'Angular momentum (L = I × ω) is conserved — it cannot change unless an external torque acts.\n\n' +
        '| Skater position | What happens to I | What happens to ω | Effort needed |\n' +
        '|----------------|-----------------|------------------|---------------|\n' +
        '| Arms spread wide | I is large | ω is slow | None — just holds position |\n' +
        '| Pulls arms to chest | I decreases | ω increases automatically | None — pure physics |\n' +
        '| Extends arms again | I increases | ω decreases automatically | None |\n\n' +
        'No extra push is required — pulling your arms in is enough. The same principle explains why a diver tucks into a ball for fast somersaults, then extends to slow the rotation before entering the water.\n\n' +
        'In Assam\'s **Bihu dance**, performers spinning with outstretched gamosa (towels) rotate slowly and gracefully. When they pull the gamosa close, the spin visibly quickens — angular momentum conservation on the dance floor.',
      intermediateContent:
        '**Moment of inertia formulas for common shapes:**\n\n' +
        '| Shape | Axis | Formula | Example (m=2 kg, r=0.3 m) |\n' +
        '|-------|------|---------|---------------------------|\n' +
        '| Solid disc/cylinder | Through centre | I = ½mr² | 0.09 kg·m² |\n' +
        '| Hollow cylinder | Through centre | I = mr² | 0.18 kg·m² |\n' +
        '| Solid sphere | Through centre | I = (2/5)mr² | 0.072 kg·m² |\n' +
        '| Hollow sphere | Through centre | I = (2/3)mr² | 0.12 kg·m² |\n' +
        '| Thin rod | About centre | I = (1/12)mL² | 0.015 kg·m² (L=0.3m) |\n' +
        '| Thin rod | About end | I = (1/3)mL² | 0.06 kg·m² (L=0.3m) |\n\n' +
        '**The parallel axis theorem:**\n\n' +
        '`I = I_cm + md²` (shift axis by distance d from centre of mass)\n\n' +
        '**Worked example:** A 2 kg, 1 m rod:\n' +
        '- About its centre: I_cm = (1/12)(2)(1²) = **0.167 kg·m²**\n' +
        '- About one end (d = 0.5 m): I = 0.167 + 2 × 0.5² = **0.667 kg·m²** — 4× larger\n\n' +
        '**Worked example — figure skater (quantitative):**\n\n' +
        '| Position | I (kg·m²) | ω (rev/s) | L = Iω (kg·m²/s) | KE = ½Iω² (J) |\n' +
        '|----------|----------|----------|------------------|----------------|\n' +
        '| Arms out | 4.0 | 2.0 | 50.3 | 158 |\n' +
        '| Arms in | 1.5 | 5.3 | 50.3 | 421 |\n\n' +
        'Notice: L stays constant (conserved), but KE increases. Where does the extra energy come from? From the **muscular work** the skater does pulling their arms inward against centrifugal tendency.\n\n' +
        '**Rotational kinetic energy:**\n\n' +
        '`KE = ½Iω²`\n\n' +
        'A solid flywheel (m = 100 kg, r = 0.5 m) spinning at 3000 RPM (314 rad/s):\n' +
        '- I = 0.5 × 100 × 0.25 = 12.5 kg·m²\n' +
        '- KE = 0.5 × 12.5 × 314² = **616 kJ** (enough to power a 1 kW device for 10 minutes)\n\n' +
        '**Rolling race — which shape wins?**\n\n' +
        '| Shape | Total KE | % in rotation | Rolls down ramp... |\n' +
        '|-------|---------|--------------|--------------------|\n' +
        '| Solid sphere | (7/10)mv² | 28.6% | Fastest |\n' +
        '| Solid cylinder | (3/4)mv² | 33.3% | Second |\n' +
        '| Hollow sphere | (5/6)mv² | 40.0% | Third |\n' +
        '| Hollow cylinder | mv² | 50.0% | Slowest |\n\n' +
        'Objects with more rotational inertia (relative to mass) divert more energy into spinning and roll slower.',
      advancedContent:
        '**The moment of inertia tensor — full 3D treatment:**\n\n' +
        'The moment of inertia tensor **I** is a rank-2 tensor with components:\n\n' +
        '`I_ij = ∫ρ(r)(r²δ_ij − r_ir_j)dV`\n\n' +
        'The off-diagonal elements (products of inertia) couple rotation about different axes. Diagonalising I yields the principal moments I₁, I₂, I₃ and the principal axes.\n\n' +
        '| Object | I₁ | I₂ | I₃ | Symmetry |\n' +
        '|--------|-----|-----|-----|----------|\n' +
        '| Sphere | I | I | I | All axes equal |\n' +
        '| Cylinder | ½mr² | ½mr² | (1/12)m(3r²+h²) | Two axes equal |\n' +
        '| Rectangular plate | (1/12)m·b² | (1/12)m·a² | (1/12)m(a²+b²) | All different |\n\n' +
        '**The Dzhanibekov effect (tennis racket theorem):**\n\n' +
        'For an asymmetric rigid body in torque-free rotation, Euler\'s equations predict:\n\n' +
        '| Rotation axis | Principal moment | Stability |\n' +
        '|--------------|-----------------|----------|\n' +
        '| Maximum I₃ | Largest | **Stable** |\n' +
        '| Minimum I₁ | Smallest | **Stable** |\n' +
        '| Intermediate I₂ | Middle | **Unstable** — spontaneous flipping |\n\n' +
        'The energy surface E = (L₁²/2I₁ + L₂²/2I₂ + L₃²/2I₃) intersected with the angular momentum sphere L² = const determines the possible motions — the intermediate-axis instability appears as a separatrix.\n\n' +
        '**Quantum rotational spectroscopy:**\n\n' +
        'Rotational energy levels of molecules are quantised: E_J = BJ(J+1), where B = ℏ²/(2I) is the rotational constant.\n\n' +
        '| Molecule | B (GHz) | Bond length r (Å) | Method |\n' +
        '|----------|---------|------------------|--------|\n' +
        '| CO | 57.90 | 1.128 | Microwave spectroscopy |\n' +
        '| HCl | 312.99 | 1.275 | Microwave spectroscopy |\n' +
        '| N₂ | 59.65 | 1.098 | Raman spectroscopy |\n\n' +
        'These are among the most precisely known quantities in chemistry — measured to 5+ significant figures from rotational spectra alone.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'A figure skater needs to push harder to spin faster when pulling their arms in.', answer: false, explanation: 'No extra effort is needed. Conservation of angular momentum automatically increases the spin speed when moment of inertia decreases.' },
            { text: 'A hollow cylinder has a higher moment of inertia than a solid cylinder of the same mass and radius.', answer: true, explanation: 'In a hollow cylinder, all the mass is at the maximum distance from the axis, maximising the moment of inertia.' },
            { text: 'A long wrench makes a bolt easier to turn because it increases the moment of inertia.', answer: false, explanation: 'A longer wrench increases the lever arm, which increases torque (not moment of inertia). More torque means more twisting force on the bolt.' },
            { text: 'A solid sphere rolls down a ramp faster than a hollow sphere of the same mass and radius.', answer: true, explanation: 'The solid sphere has a lower moment of inertia relative to its mass, so less energy goes into rotation and more into translation — it reaches the bottom first.' },
          ],
        },
      },
    },
    {
      title: 'Flywheels — Storing Energy in a Spinning Wheel',
      beginnerContent:
        '**The flywheel idea — save energy in spin, release it later:**\n\n' +
        'A flywheel is a heavy wheel that stores energy as rotational kinetic energy. Spin it up, and it keeps spinning for a long time because its high moment of inertia resists changes in speed.\n\n' +
        '**Analogy:** A flywheel is like a savings account for energy. You deposit energy by spinning it up (like saving money). It holds that energy with very little loss (like earning interest). You withdraw energy when you need it (like making a purchase). The heavier the flywheel and the faster it spins, the larger the account balance.\n\n' +
        '**Historical flywheels — ancient to modern:**\n\n' +
        '| Flywheel | How it works | Era |\n' +
        '|----------|------------|-----|\n' +
        '| Potter\'s wheel | Kick to spin up, steady speed while shaping clay | 3500 BC |\n' +
        '| Spinning wheel | Foot pedal stores energy, smooth thread production | ~1000 AD |\n' +
        '| Steam engine flywheel | Smooths jerky piston power into steady rotation | 1770s |\n' +
        '| Car engine flywheel | Smooths pulses from cylinder firings | 1880s |\n' +
        '| Regenerative bus | Captures braking energy, saves 30% fuel | 2000s |\n' +
        '| NASA flywheel battery | 60,000 RPM in vacuum, powers ISS in shadow | 2010s |\n\n' +
        'The **potter\'s wheel** — one of humanity\'s earliest precision machines — is still used in Assam\'s Sarthebari and Nalbari districts, where traditional **kumhar** potters kick a heavy stone flywheel to maintain steady speed while shaping brass and bell-metal vessels.\n\n' +
        '**Why flywheels beat chemical batteries in some applications:**\n\n' +
        '| Property | Flywheel | Lithium-ion battery |\n' +
        '|----------|---------|--------------------|\n' +
        '| Charge/discharge cycles | Millions (no degradation) | 500–2,000 (degrades) |\n' +
        '| Charge time | Seconds to minutes | Hours |\n' +
        '| Toxic materials | None | Lithium, cobalt |\n' +
        '| Power density | Very high (fast energy release) | Moderate |\n' +
        '| Energy density | Low (less total energy per kg) | High |\n' +
        '| Lifespan | 20+ years | 5–10 years |',
      intermediateContent:
        '**Flywheel energy — the formula and worked examples:**\n\n' +
        '`E = ½Iω²`\n\n' +
        '**Worked example — industrial flywheel:**\n\n' +
        'A solid disc flywheel (m = 200 kg, r = 0.6 m) at 5000 RPM:\n\n' +
        '| Step | Calculation | Result |\n' +
        '|------|-----------|--------|\n' +
        '| Moment of inertia | I = ½mr² = 0.5 × 200 × 0.36 | 36 kg·m² |\n' +
        '| Angular velocity | ω = 5000 × 2π/60 | 523.6 rad/s |\n' +
        '| Stored energy | E = ½ × 36 × 523.6² | **4.94 MJ ≈ 1.37 kWh** |\n' +
        '| Specific energy | E/m = 4.94 × 10⁶/200 | 24.7 kJ/kg |\n\n' +
        '**Material limits — what determines maximum energy storage:**\n\n' +
        'The maximum specific energy is limited by material strength: `E/m ≤ σ/ρ` (tensile strength / density).\n\n' +
        '| Material | σ (MPa) | ρ (kg/m³) | Max E/m (kJ/kg) | Relative |\n' +
        '|----------|---------|----------|----------------|----------|\n' +
        '| Cast iron | 200 | 7200 | 28 | 1× |\n' +
        '| Steel (high-strength) | 1500 | 7800 | 192 | 7× |\n' +
        '| Titanium alloy | 1100 | 4500 | 244 | 9× |\n' +
        '| Carbon fibre composite | 3500 | 1600 | 2,188 | 78× |\n' +
        '| Lithium-ion battery | — | — | ~500 | 18× |\n\n' +
        'Carbon fibre flywheels can rival batteries in energy per kg — and they never degrade.\n\n' +
        '**Smoothing engine power — the coefficient of fluctuation:**\n\n' +
        'The coefficient of fluctuation δ = (ω_max − ω_min)/ω_avg determines smoothness:\n\n' +
        '| Application | δ (allowed) | Flywheel mass (typical) |\n' +
        '|------------|-----------|------------------------|\n' +
        '| Engine (4-cylinder) | 0.02 | 10–15 kg |\n' +
        '| Punch press | 0.05 | 50–200 kg |\n' +
        '| Textile spinning | 0.01 | 5–10 kg |\n' +
        '| Generator | 0.005 | 100–500 kg |',
      advancedContent:
        '**Modern flywheel energy storage systems (FESS):**\n\n' +
        'State-of-the-art FESS use **carbon-fibre composite rotors** spinning at 20,000–60,000 RPM in a vacuum chamber on magnetic bearings (to eliminate friction), coupled to a motor-generator.\n\n' +
        '| System | Speed (RPM) | Energy | Efficiency | Application |\n' +
        '|--------|-----------|--------|-----------|------------|\n' +
        '| Beacon Power (grid) | 16,000 | 25 kWh each | 85% | Frequency regulation |\n' +
        '| GKN Hybrid Power (F1) | 45,000 | 0.4 MJ | 90% | KERS energy recovery |\n' +
        '| NASA G2 (ISS prototype) | 60,000 | 1 kWh | 93% | Spacecraft power |\n' +
        '| Stornetic (grid) | 45,000 | 5 kWh | 95% | Peak shaving |\n\n' +
        'The Beacon Power Stephentown facility (2011) uses 200 flywheels storing 5 MW × 15 min = 1.25 MWh, providing grid frequency regulation — responding in **milliseconds** to supply-demand imbalances.\n\n' +
        '**Tip speed — the ultimate limit:**\n\n' +
        'The maximum tip speed: v_tip = ωr = √(2σ_hoop/ρ)\n\n' +
        '| Material | σ_hoop (GPa) | ρ (kg/m³) | v_tip (m/s) | vs speed of sound |\n' +
        '|----------|------------|---------|-----------|------------------|\n' +
        '| Steel | 1.5 | 7800 | 620 | 1.8× |\n' +
        '| Titanium | 1.1 | 4500 | 700 | 2× |\n' +
        '| Carbon fibre | 3.5 | 1600 | 2,091 | 6× |\n\n' +
        'Failure at these speeds releases enormous kinetic energy, requiring armoured containment vessels.\n\n' +
        '**Magnetic bearings** use active electromagnetic suspension (PID-controlled, with position sensors and feedback coils) or passive permanent-magnet/superconductor levitation. The University of Texas **LaunchPoint** system demonstrated a 2.5 kWh, 40,000 RPM prototype with <0.01% energy loss per hour using high-temperature superconductor bearings at 77 K (liquid nitrogen).\n\n' +
        'India\'s **ISRO** has explored flywheel energy storage for satellite attitude control, where flywheels serve double duty — storing energy during sunlight passes and providing reaction torque for orientation changes — eliminating the need for separate reaction wheels and batteries.',
    },
    {
      title: 'Centripetal Force — The Force That Makes Things Go in Circles',
      beginnerContent:
        '**What centripetal force actually is:**\n\n' +
        'When you swing a stone on a string in a circle, the stone is constantly trying to fly off in a straight line (Newton\'s First Law — inertia). The string provides a **centripetal force** — a force directed inward, toward the centre of the circle — that continuously redirects the stone\'s motion into a curve.\n\n' +
        '**Critical misconception:** Cut the string, and the stone flies off in a **straight line tangent** to the circle, NOT outward. There is no outward force — only an inward one that keeps curving the path.\n\n' +
        'Centripetal force is not a new type of force — it is a **role** that any force can play:\n\n' +
        '| Scenario | What provides the centripetal force |\n' +
        '|----------|-----------------------------------|\n' +
        '| Moon orbiting Earth | Gravity |\n' +
        '| Car turning a corner | Friction between tyres and road |\n' +
        '| Stone on a string | Tension in the string |\n' +
        '| Roller coaster loop | Normal force from the track + gravity |\n' +
        '| Clothes in washing machine spin | Drum wall pushing inward |\n' +
        '| Electron orbiting nucleus | Electromagnetic attraction |\n\n' +
        '**The formula — why speed matters so much:**\n\n' +
        '`F = mv²/r`\n\n' +
        'Notice that speed is **squared** — doubling your speed requires **four times** the centripetal force.\n\n' +
        '| Speed (km/h) | Speed (m/s) | Force for 1000 kg car, 50 m curve |\n' +
        '|-------------|-----------|----------------------------------|\n' +
        '| 30 | 8.3 | 1,389 N |\n' +
        '| 60 | 16.7 | 5,556 N |\n' +
        '| 90 | 25.0 | **12,500 N** |\n' +
        '| 120 | 33.3 | **22,222 N** |\n\n' +
        'This is why taking a curve too fast is so dangerous — the required force quadruples when you double speed. If friction cannot provide enough centripetal force, the car skids. The winding roads through the hills of **Haflong** and **Dima Hasao** in Assam have sharp curves with speed warnings — ignoring them means the tyres cannot generate enough friction to keep the vehicle on the road.',
      intermediateContent:
        '**Worked examples with centripetal force:**\n\n' +
        '`F = mv²/r = mω²r`\n\n' +
        '**Worked example 1 — car on a curve (will it skid?):**\n\n' +
        'A 1500 kg car, 50 m radius curve, μ = 0.7:\n\n' +
        '| Speed | Centripetal force needed | Friction available | Safe? |\n' +
        '|-------|------------------------|-------------------|-------|\n' +
        '| 40 km/h (11.1 m/s) | 3,704 N | 10,297 N | Yes ✓ |\n' +
        '| 60 km/h (16.7 m/s) | 8,339 N | 10,297 N | Yes ✓ (barely) |\n' +
        '| 80 km/h (22.2 m/s) | 14,815 N | 10,297 N | **No — skids** |\n\n' +
        'Maximum safe speed: v = √(μgr) = √(0.7 × 9.81 × 50) = **18.5 m/s = 66.7 km/h**\n\n' +
        'On wet roads (μ ≈ 0.4): v_max = √(0.4 × 9.81 × 50) = **14.0 m/s = 50.4 km/h** — significantly slower.\n\n' +
        '**Worked example 2 — banked curves:**\n\n' +
        'On a banked curve (angle θ), the normal force component provides centripetal force even without friction:\n\n' +
        '`tan θ = v²/(rg)`\n\n' +
        '| Speed (km/h) | Radius (m) | Required bank angle |\n' +
        '|-------------|-----------|--------------------|\n' +
        '| 60 | 100 | 15.6° |\n' +
        '| 100 | 200 | 21.5° |\n' +
        '| 200 | 500 | 31.9° |\n' +
        '| 300 (F1 car) | 200 | 73.6° |\n\n' +
        '**Worked example 3 — washing machine spin cycle:**\n\n' +
        'Drum at 800 RPM, r = 0.25 m:\n\n' +
        'Centripetal acceleration: a = ω²r = (800 × 2π/60)² × 0.25 = **1,755 m/s² ≈ 179g**\n\n' +
        'This is why water is forced out so effectively — the clothes experience nearly 180 times their own weight pushing them against the drum wall.\n\n' +
        '**Worked example 4 — satellite orbit:**\n\n' +
        'Gravity provides centripetal force: GMm/r² = mv²/r → v = √(GM/r)\n\n' +
        '| Orbit | Altitude | Orbital speed | Period |\n' +
        '|-------|---------|--------------|--------|\n' +
        '| ISS | 408 km | 7.66 km/s | 92 min |\n' +
        '| GPS satellite | 20,200 km | 3.87 km/s | 12 hr |\n' +
        '| Geostationary | 35,786 km | 3.07 km/s | 24 hr |\n' +
        '| Moon | 384,400 km | 1.02 km/s | 27.3 days |',
      advancedContent:
        '**Fictitious forces in rotating reference frames:**\n\n' +
        'In a rotating reference frame, two **fictitious forces** appear:\n\n' +
        '| Force | Formula | Direction | Effect |\n' +
        '|-------|---------|----------|--------|\n' +
        '| Centrifugal | F_cf = mω²r | Outward (radial) | Water rises in spinning bucket |\n' +
        '| Coriolis | F_Cor = −2m(ω × v) | ⊥ to velocity | Deflects moving objects |\n\n' +
        'The centrifugal force explains why the Earth bulges at the equator (equatorial radius is 21 km larger than polar).\n\n' +
        '**Coriolis effect — weather and beyond:**\n\n' +
        'In the Northern Hemisphere, moving objects deflect to the right. The Coriolis parameter f = 2ω sin φ (where φ is latitude) determines the strength.\n\n' +
        '| Latitude | f (10⁻⁴ s⁻¹) | Coriolis effect |\n' +
        '|----------|-------------|----------------|\n' +
        '| 0° (equator) | 0 | None |\n' +
        '| 26° (Guwahati) | 0.64 | Moderate |\n' +
        '| 45° (mid-latitude) | 1.03 | Strong |\n' +
        '| 90° (pole) | 1.46 | Maximum |\n\n' +
        'The **Rossby number** Ro = v/(fL) determines whether Coriolis effects dominate:\n\n' +
        '| System | Typical Ro | Coriolis matters? |\n' +
        '|--------|-----------|------------------|\n' +
        '| Bathtub vortex | ~10⁴ | No |\n' +
        '| Tornado | ~10 | Marginally |\n' +
        '| Hurricane | ~0.1 | Yes — dominant |\n' +
        '| Ocean gyre | ~0.01 | Yes — dominant |\n' +
        '| Brahmaputra river flow | ~10² | Negligible |\n\n' +
        'Cyclones in the **Bay of Bengal** that affect Assam\'s monsoon are directly shaped by the Coriolis effect — the counterclockwise rotation of these low-pressure systems is entirely a consequence of Earth\'s angular momentum.\n\n' +
        '**Cyclotron motion in magnetic fields:**\n\n' +
        'The Lorentz force provides centripetal force: qvB = mv²/r\n\n' +
        '| Particle | Cyclotron frequency | Applications |\n' +
        '|----------|-------------------|-------------|\n' +
        '| Proton in 1T field | 15.2 MHz | MRI scanners |\n' +
        '| Electron in 1T field | 28.0 GHz | Electron cyclotron resonance |\n' +
        '| Proton at 7 TeV (LHC) | 11.245 kHz | Particle physics research |\n\n' +
        '**Synchrotron radiation** — electromagnetic radiation emitted by charges undergoing centripetal acceleration — produces brilliant X-ray beams used in materials science, biology, and medicine. India\'s **Indus-2** synchrotron at RRCAT, Indore operates at 2.5 GeV.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each scenario to the force providing centripetal force',
          pairs: [
            ['Moon orbiting Earth', 'Gravity between Earth and the Moon'],
            ['Car turning a corner', 'Friction between tyres and road surface'],
            ['Stone on a string', 'Tension in the string pulling inward'],
            ['Roller coaster loop', 'Normal force from the track pushing inward, supplemented by gravity'],
          ],
        },
      },
    },
    {
      title: 'From Potter\'s Wheel to Hard Drive — Spinning in Everyday Life',
      beginnerContent:
        '**Rotation is everywhere — the most universal motion in engineering:**\n\n' +
        'It is hard to find a machine that does not use rotational motion. From ancient tools to modern technology, spinning is fundamental.\n\n' +
        '| Era | Invention | What it does | Impact |\n' +
        '|-----|----------|-------------|--------|\n' +
        '| 3500 BC | Potter\'s wheel | Shapes clay symmetrically | First precision machine |\n' +
        '| 300 BC | Waterwheel | Grinds grain using river power | Freed humans from manual grinding |\n' +
        '| 600 AD | Windmill | Grinds grain using wind | Enabled agriculture in dry regions |\n' +
        '| 1884 | Steam turbine | Converts heat to rotation | Launched the electrical age |\n' +
        '| 1888 | Electric motor | Converts electricity to rotation | Powers most modern machines |\n' +
        '| 1956 | Hard drive | Stores data on spinning platters | Digital information revolution |\n\n' +
        '**In your home right now — hidden rotation:**\n\n' +
        '| Device | Rotating part | Typical speed |\n' +
        '|--------|-------------|---------------|\n' +
        '| Ceiling fan | Blades | 200–350 RPM |\n' +
        '| Washing machine (spin) | Drum | 800–1400 RPM |\n' +
        '| Food mixer | Blades | 1,000–25,000 RPM |\n' +
        '| Computer hard drive | Platters | 5,400–15,000 RPM |\n' +
        '| Refrigerator compressor | Motor | 2,000–4,000 RPM |\n' +
        '| Vacuum cleaner motor | Impeller | 20,000–100,000 RPM |\n\n' +
        'A modern computer hard drive spins at 7,200 RPM — that is **120 rotations every second**, with the read/write head floating just 10 nanometres above the spinning surface, never touching it.\n\n' +
        '**Analogy for the precision:** If the hard drive platter were a football field (100 m long), the read/write head would be flying at full speed, less than 1 mm above the grass — and reading the serial numbers on individual blades of grass as they flash past.\n\n' +
        'In Assam, the **Sualkuchi silk** industry still uses spinning wheels and looms with rotating parts — a direct descendant of the spinning wheel technology that revolutionised textile production a thousand years ago. The traditional **eri** and **muga** silk reeling process rotates cocoons in water to unwind the single continuous thread — the same rotational principle, applied for centuries.',
      intermediateContent:
        '**Hard drive physics — a marvel of rotational engineering:**\n\n' +
        'A hard drive spinning at 7,200 RPM:\n\n' +
        '| Parameter | Calculation | Result |\n' +
        '|-----------|-----------|--------|\n' +
        '| Angular velocity | 7200 × 2π/60 | 754 rad/s |\n' +
        '| Edge speed (3.5" platter, r=0.044 m) | ωr = 754 × 0.044 | 33.2 m/s (119.5 km/h) |\n' +
        '| Head flying height | — | 10 nm |\n' +
        '| If platter = football field | Scale factor: 10 nm × (100/0.088) | Head at ~11 μm above grass |\n\n' +
        '**Centrifugal stress at the rim:**\n\n' +
        'σ = ρω²r²/2. For an aluminium platter (ρ = 2700 kg/m³):\n\n' +
        'σ = 2700 × 754² × 0.044²/2 = **1.49 MPa** — well within aluminium\'s yield strength of ~270 MPa.\n\n' +
        '**Extreme rotational scenarios:**\n\n' +
        '| System | Speed | Centripetal acceleration | Force on human |\n' +
        '|--------|-------|------------------------|--------------|\n' +
        '| Washing machine spin (1400 RPM) | 36.7 m/s | 5,382 m/s² | 549g |\n' +
        '| F1 car, 100 m corner at 250 km/h | 69.4 m/s | 48.2 m/s² | 4.9g |\n' +
        '| Fighter jet tight turn | 250 m/s | ~90 m/s² | 9g |\n' +
        '| Astronaut centrifuge training | 12.5 m/s | ~120 m/s² | 12g |\n\n' +
        'F1 drivers need exceptional neck strength to withstand 4.9g lateral acceleration in corners — their head and helmet weigh effectively 35 kg.\n\n' +
        '**Energy conversion through rotation:**\n\n' +
        '| Conversion | Device | Efficiency |\n' +
        '|-----------|--------|------------|\n' +
        '| Wind → rotation → electricity | Wind turbine + generator | 35–45% |\n' +
        '| Water → rotation → electricity | Hydroelectric turbine | 85–95% |\n' +
        '| Steam → rotation → electricity | Steam turbine | 35–45% |\n' +
        '| Electricity → rotation → motion | Electric motor | 85–95% |\n' +
        '| Fuel → rotation → motion | Petrol engine | 25–35% |\n\n' +
        'Assam\'s **NHPC Kopili Hydroelectric** project converts the kinetic energy of the Kopili River into electrical energy through massive Francis turbines spinning at 250 RPM — rotational mechanics powering 275 MW for the northeast grid.',
      advancedContent:
        '**Spin at every scale — from quantum to cosmic:**\n\n' +
        '| Scale | System | Angular frequency | Key physics |\n' +
        '|-------|--------|-----------------|------------|\n' +
        '| Subatomic | Electron spin | Intrinsic (no ω) | Quantum spin-½ |\n' +
        '| Molecular | CO rotation | 115 GHz (J=1→0) | Quantised levels |\n' +
        '| Human | Bicycle wheel | ~20 rad/s | Classical mechanics |\n' +
        '| Planetary | Earth rotation | 7.3 × 10⁻⁵ rad/s | Coriolis, weather |\n' +
        '| Stellar | Millisecond pulsar | ~4,500 rad/s | Relativistic effects |\n' +
        '| Galactic | Milky Way rotation | 8.5 × 10⁻¹⁶ rad/s | Dark matter evidence |\n\n' +
        '**Spin qubits in quantum computing:**\n\n' +
        'Individual electron spins in semiconductor quantum dots use quantised angular momentum as the basis for quantum information. The spin-½ system, with states |↑⟩ and |↓⟩ forming a **Bloch sphere**, is the fundamental qubit.\n\n' +
        '**NMR and MRI — medical imaging from nuclear spin:**\n\n' +
        'Nuclear magnetic resonance exploits the precession of nuclear spins in a magnetic field at the Larmor frequency: **ω_L = γB**\n\n' +
        '| Nucleus | γ (MHz/T) | Use |\n' +
        '|---------|---------|-----|\n' +
        '| ¹H (hydrogen) | 42.58 | Standard MRI (water in tissue) |\n' +
        '| ¹³C (carbon) | 10.71 | Metabolic imaging |\n' +
        '| ²³Na (sodium) | 11.26 | Cell viability studies |\n' +
        '| ³¹P (phosphorus) | 17.24 | Energy metabolism (ATP) |\n\n' +
        'By applying radiofrequency pulses at the Larmor frequency, nuclear spins are tipped out of equilibrium. Their return to equilibrium generates signals whose timing (T₁, T₂ relaxation) varies with tissue type — producing the exquisite soft-tissue contrast that makes MRI invaluable in medicine.\n\n' +
        '**Millisecond pulsars — nature\'s most precise clocks:**\n\n' +
        'Neutron stars spun up to ~700 Hz by accreting matter from a companion star are the most stable natural clocks in the universe, with period derivatives as small as 10⁻²⁰ s/s — rivalling atomic clocks and enabling tests of general relativity in strong gravitational fields.\n\n' +
        '| Pulsar | Frequency (Hz) | Period stability | Discovery |\n' +
        '|--------|---------------|-----------------|----------|\n' +
        '| PSR B1937+21 | 641.9 | 10⁻¹⁹ s/s | 1982 |\n' +
        '| PSR J1748-2446ad | 716.4 | ~10⁻²⁰ s/s | 2006 (fastest known) |\n' +
        '| PSR J0437-4715 | 173.7 | 10⁻²⁰ s/s | Used for gravitational wave detection |',
      interactive: {
        type: 'did-you-know',
        props: {
          facts: [
            'A Formula 1 engine can spin at up to 15,000 RPM — that is 250 revolutions per second. The pistons travel up and down 500 times per second.',
            'The Earth itself is a giant spinning object. At the equator, you are moving at about 1,670 km/h due to Earth\'s rotation — you just do not feel it because everything around you is moving at the same speed.',
            'Neutron stars, the collapsed cores of dead massive stars, can spin at up to 716 rotations per second — faster than a kitchen blender.',
            'India\'s GMRT (Giant Metrewave Radio Telescope) near Pune has discovered several millisecond pulsars — the fastest-spinning objects in the known universe.',
          ],
        },
      },
    },
  ],
};
