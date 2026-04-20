import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'simple-machines',
  title: 'Simple Machines & Mechanical Advantage',
  category: 'physics',
  icon: '⚙️',
  tagline: 'Levers, pulleys, and inclined planes — the physics behind every tool humans ever built.',
  relatedStories: ['bridge-that-grew', 'friendship-bridge', 'honey-hunters-lesson'],
  understand: [
    // ── Section 1: The Six Simple Machines ─────────────────────
    {
      title: 'The Six Simple Machines',
      diagram: 'WorkForceDiagram',
      beginnerContent:
        'Every complex machine — from a bicycle to a crane — is built from combinations of just **six simple machines**. Each one lets you trade one thing for another: usually a smaller force over a larger distance, or vice versa. The total work (force x distance) stays the same, but the *way* you apply it changes.\n\n' +
        '| Simple Machine | What it does | Everyday example |\n' +
        '|----------------|-------------|------------------|\n' +
        '| **Lever** | Pivots around a fulcrum to multiply force or speed | Crowbar, seesaw, fishing rod |\n' +
        '| **Pulley** | Redirects or multiplies force via a rope and wheel | Flagpole, well bucket, crane |\n' +
        '| **Wheel & Axle** | Turns a large wheel to rotate a small axle with more force | Doorknob, steering wheel, screwdriver |\n' +
        '| **Inclined Plane** | Spreads a vertical lift over a longer, gentler slope | Wheelchair ramp, mountain road, loading dock |\n' +
        '| **Wedge** | Converts a push into a sideways split | Axe blade, knife, chisel, doorstop |\n' +
        '| **Screw** | Wraps an inclined plane around a cylinder for powerful clamping | Jar lid, bolt, car jack, corkscrew |\n\n' +
        '**Think of it this way:** Imagine you need to lift a 100 kg barrel onto a truck bed 1 metre high. You could deadlift it straight up (huge force, short distance). Or you could roll it up a 5-metre ramp (one-fifth the force, five times the distance). Either way you do the same total work — but the ramp makes it *possible* for one person.\n\n' +
        'The **lever** is a rigid bar that pivots on a fixed point called the **fulcrum**. There are three classes:\n\n' +
        '| Class | Fulcrum position | Trade-off | Examples |\n' +
        '|-------|-----------------|-----------|----------|\n' +
        '| **1st class** | Between effort and load | Can multiply force OR speed | Crowbar, seesaw, scissors |\n' +
        '| **2nd class** | Load between fulcrum and effort | Always multiplies force | Wheelbarrow, nutcracker, bottle opener |\n' +
        '| **3rd class** | Effort between fulcrum and load | Always multiplies speed/distance | Tweezers, fishing rod, your forearm |\n\n' +
        '**Check yourself:** A wheelbarrow is a 2nd-class lever. Where is the fulcrum? (The wheel.) Where is the load? (The tray.) Where is the effort? (Your hands on the handles.) Because the load is between the fulcrum and your hands, you lift with less force than the load weighs.\n\n' +
        'The **pulley** is a wheel with a grooved rim. A single fixed pulley only changes direction (MA = 1) — you pull down, the bucket goes up. But combine multiple pulleys into a **block and tackle**, and each additional supporting rope segment multiplies your force. Four rope segments supporting the load means you pull with only 1/4 the weight — but you pull 4 times as much rope.\n\n' +
        'The **screw** is perhaps the least obvious: it is an inclined plane wrapped around a cylinder. Each turn advances the screw by a tiny distance called the **pitch**. Because you apply force over the large circumference of each turn but the screw only moves by the small pitch, the force multiplication is enormous — which is why screws hold things together so tightly and why a car jack can lift 2 tonnes with one hand.',
      intermediateContent:
        '**Quantifying MA for each machine:**\n\n' +
        '| Machine | MA Formula | Worked Example | Result |\n' +
        '|---------|-----------|----------------|--------|\n' +
        '| Lever | Effort arm / Load arm | Crowbar: 1.7 m effort arm, 0.3 m load arm | MA = 1.7/0.3 = **5.67** |\n' +
        '| Inclined plane | Ramp length / Height | 6 m ramp, 1.5 m rise | MA = 6/1.5 = **4** |\n' +
        '| Screw | Circumference / Pitch | 12 mm dia screw, 2 mm pitch | MA = pi x 12/2 = **18.8** |\n' +
        '| Pulley | Number of supporting rope segments | 4-pulley block and tackle | MA = **4** |\n' +
        '| Wheel & axle | Wheel radius / Axle radius | Steering wheel R=18 cm, axle r=3 cm | MA = 18/3 = **6** |\n' +
        '| Wedge | Length / Width at base | Axe blade: 20 cm long, 6 cm wide | MA = 20/6 = **3.3** |\n\n' +
        '**Worked example — lifting a generator onto a truck:**\n\n' +
        'A 200 kg generator must go 1.2 m up. Weight = 200 x 9.81 = 1,962 N.\n\n' +
        '- **Straight lift:** You must exert at least 1,962 N — nearly impossible for one person.\n' +
        '- **6 m ramp (MA = 5):** Force needed = 1,962 / 5 = **392 N** — one person can do this.\n' +
        '- **Block and tackle with 4 ropes (MA = 4):** Force = 1,962 / 4 = **491 N**, but you pull 4 x 1.2 = 4.8 m of rope.\n\n' +
        'In every case: Work = Force x Distance = ~2,354 J (plus friction losses).',
      advancedContent:
        '**Efficiency and self-locking in screws:**\n\n' +
        'The efficiency of a screw or worm gear is:\n\n' +
        '`eta = tan(alpha) / tan(alpha + phi)`\n\n' +
        'where alpha is the helix angle and phi is the friction angle (arctan mu). A screw is **self-locking** (will not back-drive under load) when eta < 50%, i.e., when alpha < phi. This is essential for car jacks and clamps — remove the effort and the load stays put.\n\n' +
        '| Device | Helix angle | mu | Friction angle | Efficiency | Self-locking? |\n' +
        '|--------|------------|-----|----------------|------------|---------------|\n' +
        '| Wood screw | 5 deg | 0.4 | 21.8 deg | ~18% | Yes |\n' +
        '| Car jack screw | 8 deg | 0.15 | 8.5 deg | ~32% | Yes |\n' +
        '| Ball screw (CNC) | 45 deg | 0.003 | 0.17 deg | ~95% | No |\n' +
        '| Worm gear (conveyor) | 10 deg | 0.1 | 5.7 deg | ~55% | Borderline |\n\n' +
        'At the nanoscale, molecular machines like **ATP synthase** (a rotary motor in every living cell) operate in a regime where macroscopic friction concepts break down. ATP synthase achieves near-perfect efficiency (~80-100%) by exploiting thermal fluctuations — a Brownian ratchet. Each 120-degree rotation of the gamma subunit synthesises one ATP molecule, powered by the proton-motive force across the mitochondrial membrane.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each simple machine to its everyday example',
          pairs: [
            ['Lever', 'A crowbar prying open a crate (1st-class lever)'],
            ['Pulley', 'A flagpole — pulling the rope down raises the flag up'],
            ['Inclined plane', 'A wheelchair ramp — less force over a longer distance'],
            ['Wedge', 'An axe blade — splits wood by converting downward force sideways'],
            ['Screw', 'A jar lid — converts rotation into tight linear clamping'],
            ['Wheel and axle', 'A doorknob — turning the large knob rotates the small axle'],
          ],
        },
      },
    },

    // ── Section 2: Mechanical Advantage ────────────────────────
    {
      title: 'Mechanical Advantage & the Work Trade-Off',
      beginnerContent:
        '**Mechanical advantage (MA)** is the factor by which a machine multiplies your input force:\n\n' +
        '**MA = Output Force / Input Force**\n\n' +
        'For many simple machines, you can also calculate MA from the machine\'s geometry — without measuring forces at all:\n\n' +
        '| Machine | Geometric MA formula | What you measure |\n' +
        '|---------|---------------------|------------------|\n' +
        '| Lever | Distance from effort to fulcrum / distance from load to fulcrum | Arm lengths |\n' +
        '| Pulley | Number of rope segments supporting the load | Count the ropes |\n' +
        '| Inclined plane | Length of slope / vertical height | Ramp dimensions |\n' +
        '| Screw | Circumference of one turn / pitch (advance per turn) | Thread spacing |\n' +
        '| Wheel & axle | Radius of wheel / radius of axle | Measure radii |\n\n' +
        '**The golden rule of simple machines:** You can NEVER get more work out than you put in. If a lever gives you 3x the force, you must push 3x the distance. If a pulley system has MA = 4, you pull 4 metres of rope to lift the load 1 metre. The total work (force x distance) on both sides is identical — this is conservation of energy.\n\n' +
        '**Analogy:** Think of a simple machine like a currency exchange. You walk into the bank with 100 one-rupee coins and exchange them for one 100-rupee note. You haven\'t gained money — you\'ve just changed the *form*. A lever changes small-force-over-big-distance into big-force-over-small-distance. Same total "value" (work), different denomination.\n\n' +
        '**Worked example — a lever:**\n\n' +
        'A 3-metre lever has its fulcrum 0.5 m from the load end. The effort arm is 2.5 m, the load arm is 0.5 m.\n\n' +
        '- MA = 2.5 / 0.5 = **5**\n' +
        '- A 500 N load needs only 500 / 5 = **100 N** of effort\n' +
        '- But you push your end down 5 cm for every 1 cm the load rises\n\n' +
        '**IMA vs AMA:** The geometric calculation gives the **Ideal Mechanical Advantage (IMA)** — assuming zero friction. The **Actual Mechanical Advantage (AMA)** is measured from real forces and is always lower. The ratio AMA/IMA gives you the machine\'s **efficiency**.',
      intermediateContent:
        '**IMA vs AMA — a complete worked example:**\n\n' +
        'A screw jack is used to lift a car for a tyre change.\n\n' +
        '| Given | Value |\n' +
        '|-------|-------|\n' +
        '| Handle length (L) | 30 cm = 0.3 m |\n' +
        '| Screw pitch (p) | 3 mm = 0.003 m |\n' +
        '| Load (car corner) | 4,000 N |\n' +
        '| Effort applied | 50 N |\n\n' +
        '**Step 1 — IMA (from geometry):**\n' +
        'IMA = 2 x pi x L / p = 2 x 3.14159 x 0.3 / 0.003 = **628**\n\n' +
        '**Step 2 — AMA (from measured forces):**\n' +
        'AMA = Output Force / Input Force = 4,000 / 50 = **80**\n\n' +
        '**Step 3 — Efficiency:**\n' +
        'eta = AMA / IMA x 100% = 80 / 628 x 100% = **12.7%**\n\n' +
        'Over 87% of your effort goes to friction! But this is a *feature*, not a bug — the friction makes the jack self-locking. Remove your hand and the car stays up.\n\n' +
        '**Comparison of machine efficiencies:**\n\n' +
        '| Machine | Typical IMA | Typical efficiency | Why |\n' +
        '|---------|------------|-------------------|-----|\n' +
        '| Lever (oiled pivot) | 2-10 | 90-98% | Single contact point, minimal friction |\n' +
        '| Pulley (block & tackle) | 2-6 | 70-85% | Rope stiffness + bearing friction |\n' +
        '| Inclined plane | 2-10 | 50-90% | Depends on surface roughness |\n' +
        '| Screw jack | 100-600 | 10-35% | Large thread contact area |\n' +
        '| Bicycle gear system | 0.5-4 | 95-99% | Roller chain is very efficient |',
      advancedContent:
        '**Velocity ratio analysis in compound gear trains:**\n\n' +
        'In a compound gear train, the overall gear ratio is the product of individual stage ratios. A 3-stage train with ratios 3:1, 4:1, and 2:1 gives an overall ratio of 24:1 — the output shaft turns 24x slower but with 24x the torque (minus friction losses).\n\n' +
        '| Stage | Input gear | Output gear | Ratio | Running efficiency |\n' +
        '|-------|-----------|-------------|-------|-------------------|\n' +
        '| 1 | 20 teeth | 60 teeth | 3:1 | 97% |\n' +
        '| 2 | 15 teeth | 60 teeth | 4:1 | 97% |\n' +
        '| 3 | 20 teeth | 40 teeth | 2:1 | 97% |\n' +
        '| **Overall** | | | **24:1** | **0.97^3 = 91.3%** |\n\n' +
        'Each additional stage multiplies by its own efficiency factor (always < 1), so adding stages always reduces overall efficiency even while increasing MA. This is why engineers minimise the number of transmission stages — the **Rube Goldberg principle** in reverse.\n\n' +
        'The **virtual work principle** provides an elegant alternative to force analysis: for a system in equilibrium, the total virtual work done by all forces through any virtual displacement is zero. For a lever: F_effort x delta_effort = F_load x delta_load. This generalises to arbitrary mechanisms via **Lagrangian mechanics**, where the constraint forces (normal forces, tensions) do no virtual work and drop out of the equations entirely.',
      interactive: {
        type: 'did-you-know',
        props: {
          facts: [
            'A bicycle chain drive is one of the most efficient machines ever built — over 98% of pedal energy reaches the rear wheel.',
            'The Great Pyramid of Giza (2.3 million stone blocks, each ~2,500 kg) was built using inclined planes — ramps made of mud brick and rubble.',
            'A single M10 bolt (10 mm diameter, 1.5 mm pitch) has an IMA of about 21 — one finger-tight turn can clamp with over 200 N of force.',
            'Your jaw is a 3rd-class lever — the effort (masseter muscle) is between the fulcrum (jaw joint) and the load (food at your molars). This gives speed, not force — but your masseter is the strongest muscle by weight in your body, compensating with raw power.',
          ],
        },
      },
    },

    // ── Section 3: Compound Machines ──────────────────────────
    {
      title: 'Compound Machines',
      diagram: 'HydraulicPressDiagram',
      beginnerContent:
        'A **compound machine** combines two or more simple machines. The overall MA is the product of the individual MAs.\n\n' +
        '| Compound machine | Simple machines inside | How they combine |\n' +
        '|-----------------|----------------------|------------------|\n' +
        '| Scissors | Two 1st-class levers + wedge blades | Lever multiplies force, wedge cuts |\n' +
        '| Bicycle | Wheel & axle + lever (pedals) + pulley (chain) + screws (bolts) | Chain transfers pedal force to wheel |\n' +
        '| Can opener | Lever (handle) + wheel & axle (turning knob) + wedge (blade) | Knob turns, blade pierces and cuts |\n' +
        '| Wheelbarrow | 2nd-class lever + wheel & axle | Lever lifts, wheel reduces rolling friction |\n' +
        '| Fishing rod & reel | 3rd-class lever (rod) + wheel & axle (reel) | Rod casts far, reel winds line |\n\n' +
        '**The bicycle — an engineering masterpiece:**\n\n' +
        'When you push down on a pedal, your foot acts on a lever (the crank arm) attached to the front sprocket (wheel & axle). The chain transfers force to the rear sprocket (another wheel & axle), which turns the rear wheel. By shifting gears, you change the MA:\n\n' +
        '- **Climbing a hill:** Small front sprocket + large rear sprocket = high MA. Less speed, more force on the wheel.\n' +
        '- **Flat road cruising:** Large front sprocket + small rear sprocket = low MA. Less force, more speed.\n\n' +
        '**Your body is a compound machine too.** Your arm is a 3rd-class lever: the biceps (effort) attaches between the elbow (fulcrum) and the hand (load). This gives MA < 1 — your biceps must exert *more* force than the weight you hold. Why? Because the trade-off gives you *speed and range of motion*. A small contraction of the biceps sweeps your hand through a large arc — essential for throwing, catching, and tool use.\n\n' +
        '| Body lever | Class | Fulcrum | Effort | Load | MA |\n' +
        '|-----------|-------|---------|--------|------|----|\n' +
        '| Forearm (lifting) | 3rd | Elbow | Biceps | Hand/object | ~0.1 |\n' +
        '| Jaw (biting) | 3rd | Jaw joint | Masseter muscle | Teeth | ~0.3 |\n' +
        '| Foot (standing on tiptoe) | 2nd | Toes | Calf muscle | Body weight | ~2 |\n' +
        '| Head (nodding) | 1st | Atlas vertebra | Neck muscles | Face/front of skull | ~1 |',
      intermediateContent:
        '**Bicycle gear ratio calculations:**\n\n' +
        'Gear ratio = front chainring teeth / rear sprocket teeth.\n\n' +
        '| Gear | Front teeth | Rear teeth | Ratio | Distance per pedal turn* | Best for |\n' +
        '|------|------------|-----------|-------|------------------------|----------|\n' +
        '| Low (climbing) | 28 | 32 | 0.875:1 | 1.92 m | Steep hills |\n' +
        '| Mid (commuting) | 38 | 18 | 2.11:1 | 4.65 m | Flat roads |\n' +
        '| High (speed) | 48 | 16 | 3:1 | 6.60 m | Downhill/sprint |\n\n' +
        '*Assuming 700 mm wheel diameter. Distance = pi x 0.7 x gear ratio.*\n\n' +
        'In low gear, one pedal revolution moves the bike only 1.92 m but delivers 3.4x more torque than high gear — essential for climbing. A typical 21-speed bike (3 front x 7 rear) gives 21 combinations, though adjacent ratios overlap, yielding about 14 meaningfully distinct gear ratios.\n\n' +
        '**Worked example — forearm as a 3rd-class lever:**\n\n' +
        'You hold a 5 kg weight in your hand. The biceps attaches 5 cm from the elbow; the hand is 35 cm from the elbow.\n\n' +
        '- Load = 5 x 9.81 = 49 N at 35 cm\n' +
        '- For equilibrium: F_biceps x 5 cm = 49 N x 35 cm\n' +
        '- F_biceps = 49 x 35 / 5 = **343 N** (7x the weight!)\n' +
        '- MA = 5/35 = **0.14** — the muscle works at a huge mechanical disadvantage\n' +
        '- But velocity advantage = 35/5 = **7** — your hand moves 7x faster than the muscle contracts',
      advancedContent:
        '**Degrees of freedom (DOF) and mechanism design:**\n\n' +
        'The **Gruebler-Kutzbach equation** for planar mechanisms:\n\n' +
        '`DOF = 3(n - 1) - 2j1 - j2`\n\n' +
        'where n = number of links, j1 = full joints (pin/slider, constrain 2 DOF), j2 = half joints (cam/gear contact, constrain 1 DOF).\n\n' +
        '| Mechanism | Links (n) | Full joints (j1) | DOF | Meaning |\n' +
        '|-----------|----------|-----------------|-----|--------|\n' +
        '| 4-bar linkage | 4 | 4 | 3(3) - 2(4) = **1** | Single input drives entire motion |\n' +
        '| Slider-crank (engine) | 4 | 4 | **1** | Piston position determines everything |\n' +
        '| 5-bar linkage | 5 | 5 | 3(4) - 2(5) = **2** | Needs 2 inputs — used in parallel robots |\n' +
        '| Scissors lift | 6 | 7 | 3(5) - 2(7) = **1** | One hydraulic cylinder controls height |\n\n' +
        'A DOF of 1 means the mechanism\'s entire motion is determined by a single input angle or displacement. This principle governs robotic arm design: a 6-DOF robot arm can reach any position and orientation in 3D space, requiring exactly 6 independently controlled joints.\n\n' +
        '**Hydraulic systems** (shown in the diagram) multiply force using Pascal\'s principle: pressure applied anywhere in a confined fluid transmits equally in all directions. A hydraulic press with a small piston (area A1) and large piston (area A2) gives MA = A2/A1. A typical car brake system: master cylinder area = 3 cm^2, caliper piston area = 30 cm^2, so MA = 10. Your 100 N pedal force becomes 1,000 N of clamping force — multiplied further by the lever ratio of the brake pedal itself.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Identify the simple machines inside these compound machines',
          pairs: [
            ['Scissors', 'Two 1st-class levers + wedge-shaped blades'],
            ['Bicycle', 'Wheel & axle + levers (pedals) + pulley (chain/sprocket)'],
            ['Wheelbarrow', '2nd-class lever + wheel & axle'],
            ['Manual can opener', 'Lever (handle) + wheel & axle (knob) + wedge (blade)'],
            ['Human forearm', '3rd-class lever — biceps effort between elbow and hand'],
            ['Corkscrew', 'Screw + lever (handle arms) + wheel & axle (spiral)'],
          ],
        },
      },
    },

    // ── Section 4: Efficiency and Friction ────────────────────
    {
      title: 'Efficiency and Friction',
      beginnerContent:
        'No real machine is 100% efficient. Some input energy always becomes **heat** through friction. Efficiency tells you what fraction of your effort actually does useful work:\n\n' +
        '**Efficiency = (Useful Output Work / Total Input Work) x 100%**\n\n' +
        '| Machine | Typical efficiency | Where the energy goes |\n' +
        '|---------|-------------------|----------------------|\n' +
        '| Well-oiled lever | 90-98% | Small friction loss at fulcrum |\n' +
        '| Block-and-tackle pulley | 70-85% | Rope stiffness + pulley bearing friction |\n' +
        '| Bicycle chain drive | 95-99% | Minimal — roller chain is superb |\n' +
        '| Screw jack | 15-30% | Large thread contact area — deliberate! |\n' +
        '| Human muscle | ~25% | 75% becomes body heat |\n\n' +
        '**Wait — low efficiency can be a GOOD thing?** Yes! A screw jack\'s low efficiency means most of your input energy converts to friction heat. That friction is what makes the jack **self-locking**: remove your hand and the car stays up. If the jack were 100% efficient, the car\'s weight would immediately back-drive the screw and crash down. Clamps, vices, and worm gears all exploit deliberate inefficiency for safety.\n\n' +
        '**Friction is not always the enemy.** Without friction:\n' +
        '- You could not walk (feet would slide)\n' +
        '- Cars could not stop (brakes are friction machines)\n' +
        '- You could not write (pen would skate across paper)\n' +
        '- Nails and screws would slide right out\n\n' +
        '**Analogy:** Friction is like the brakes on a bicycle. You don\'t want them always on (that wastes energy), but you absolutely need them to exist (or you can\'t stop). Engineering is about putting friction where you want it and removing it where you don\'t.\n\n' +
        'Engineers manage friction through **lubrication** (oil, grease), **bearings** (ball bearings replace sliding friction with rolling friction — reducing it by up to 100x), and **material selection** (Teflon has one of the lowest friction coefficients of any solid).',
      intermediateContent:
        '**The coefficient of friction (mu):**\n\n' +
        '`Friction force = mu x Normal force`\n\n' +
        '| Surface pair | Static mu_s | Kinetic mu_k | Notes |\n' +
        '|-------------|------------|-------------|-------|\n' +
        '| Rubber on dry concrete | 0.80 | 0.65 | Why tyres grip |\n' +
        '| Steel on steel (dry) | 0.60 | 0.40 | Machine parts |\n' +
        '| Steel on steel (oiled) | 0.15 | 0.10 | Lubricated bearings |\n' +
        '| Wood on wood | 0.40 | 0.30 | Furniture sliding |\n' +
        '| Ice on ice | 0.03 | 0.01 | Why skating works |\n' +
        '| Teflon on steel | 0.04 | 0.04 | Non-stick coatings |\n\n' +
        'Static friction (preventing motion) is always greater than kinetic friction (during sliding). This is why it takes more force to *start* pushing a box than to *keep* it moving.\n\n' +
        '**Worked example — pushing a box on a floor:**\n\n' +
        'A 50 kg crate sits on a concrete floor. mu_s = 0.6, mu_k = 0.4.\n\n' +
        '- Normal force: N = mg = 50 x 9.81 = 490.5 N\n' +
        '- Force to START moving: F = mu_s x N = 0.6 x 490.5 = **294 N**\n' +
        '- Force to KEEP moving: F = mu_k x N = 0.4 x 490.5 = **196 N**\n' +
        '- If you push with 250 N, the box stays still (250 < 294). Static friction matches your push exactly at 250 N.\n' +
        '- Once a friend helps you exceed 294 N and the box starts moving, you only need 196 N to keep it sliding.\n\n' +
        '**Rolling vs sliding friction:**\n\n' +
        'A car tyre on asphalt has rolling friction mu_r ~ 0.01 — roughly 1/80th of the sliding friction. This is why the invention of the wheel was so transformative: it replaced sliding with rolling, cutting friction by orders of magnitude.',
      advancedContent:
        '**Tribology — the science of friction, wear, and lubrication:**\n\n' +
        'About **23% of the world\'s energy** is consumed overcoming friction. Reducing global friction by just 10% would save the equivalent output of ~1,000 nuclear power plants.\n\n' +
        '| Friction regime | mu range | Mechanism | Example |\n' +
        '|----------------|---------|-----------|--------|\n' +
        '| Dry sliding | 0.3-1.0 | Asperity shearing, adhesion | Brake pads |\n' +
        '| Boundary lubrication | 0.05-0.15 | Molecular film, partial contact | Engine start-up |\n' +
        '| Hydrodynamic lubrication | 0.001-0.01 | Full fluid film separation | Running engine bearings |\n' +
        '| Superlubricity | < 0.01 | Incommensurate lattice contact | Graphene sheets |\n\n' +
        '**Superlubricity** (mu < 0.01) has been achieved in graphene and MoS2 systems at the nanoscale. When two crystalline surfaces are rotated to incommensurate angles, their atomic lattices never align simultaneously, so stick-slip friction vanishes.\n\n' +
        '**Bio-inspired lubrication** copies nature\'s solutions:\n' +
        '- **Cartilage** in human joints achieves mu ~ 0.001 (10x better than ice on ice) through a hydrated polymer brush mechanism\n' +
        '- **Gecko adhesion** uses van der Waals forces from millions of microscopic setae — no chemical adhesive needed. Being developed for climbing robots and surgical patches\n' +
        '- **Shark skin** denticles reduce hydrodynamic drag by 5-10% — applied to swimsuits and ship hulls',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each friction regime to its characteristics',
          pairs: [
            ['Dry sliding (μ = 0.3–1.0)', 'Asperity shearing and adhesion — used in brake pads'],
            ['Boundary lubrication (μ = 0.05–0.15)', 'Molecular film with partial contact — occurs during engine start-up'],
            ['Hydrodynamic lubrication (μ = 0.001–0.01)', 'Full fluid film separates surfaces — running engine bearings'],
            ['Superlubricity (μ < 0.01)', 'Incommensurate crystal lattices prevent stick-slip — graphene sheets'],
            ['Cartilage in human joints (μ ≈ 0.001)', 'Hydrated polymer brush mechanism — 10× better than ice on ice'],
          ],
        },
      },
    },

    // ── Section 5: Simple Machines in Daily Life ──────────
    {
      title: 'Simple Machines in Daily Life',
      beginnerContent:
        'The communities of Northeast India have engineered with simple machines for centuries — often with deep intuitive understanding of mechanical advantage, even without the formal terminology.\n\n' +
        '**The Dheki (rice-pounding mortar):**\n\n' +
        'Found in nearly every traditional Assamese household, the **dheki** is a first-class lever — a long wooden beam pivoting on a fulcrum placed closer to the heavy pounding head than to the foot-operated end.\n\n' +
        '| Part | Role in the lever |\n' +
        '|------|------------------|\n' +
        '| Wooden beam | The lever arm (rigid bar) |\n' +
        '| Support post | The fulcrum (pivot point) |\n' +
        '| Foot end (long side) | Where effort is applied — you step down |\n' +
        '| Pounding head (short side) | Where the load (rice) receives the impact |\n\n' +
        '**Here is the clever part:** The dheki\'s MA is *less than 1* — the foot end is longer than the pounding end. That seems wrong — why would you want *less* force? Because the dheki trades force for **speed**. Your foot presses slowly, and the heavy pounding head slams down *fast*, using velocity plus its own weight to hull rice. Impact force depends on v^2, so speed matters more than static force for pounding.\n\n' +
        '**Living root bridges of Meghalaya:**\n\n' +
        'The Khasi and Jaintia people train aerial roots of *Ficus elastica* trees across rivers to form living bridges. The construction process uses multiple simple machines:\n\n' +
        '| Simple machine used | How it\'s used in root bridge building |\n' +
        '|--------------------|--------------------------------------|\n' +
        '| **Levers** (bamboo poles) | Bend and guide young, flexible roots |\n' +
        '| **Wedges** (split bamboo) | Split bamboo for scaffolding frameworks |\n' +
        '| **Inclined planes** (angled supports) | Train roots along diagonal paths to reach the far bank |\n' +
        '| **Rope/pulley systems** | Haul materials across the growing span |\n\n' +
        'Some root bridges are over **500 years old** and support 50+ people simultaneously. They strengthen with age as roots thicken under load — the opposite of manufactured bridges, which weaken over time.\n\n' +
        '**Honey hunting in the hill states:**\n\n' +
        'Traditional honey hunters descend cliff faces using bamboo ladders (inclined planes/levers), while helpers above use a rope-and-bamboo-pole **pulley system** to lower and raise collection baskets. The system gives MA of 2-3 — critical when hauling 20-30 kg honeycomb baskets up vertical rock faces.\n\n' +
        '**The Dhenki-sal (oil press):**\n\n' +
        'A long bamboo lever arm crushes mustard seeds to extract oil. The operator\'s body weight at the far end of the lever multiplies into a crushing force at the short end. Families across the Brahmaputra valley have used this for generations — a direct, practical application of lever MA.',
      intermediateContent:
        '**Dheki biomechanics — a quantitative analysis:**\n\n' +
        '| Parameter | Value |\n' +
        '|-----------|-------|\n' +
        '| Total beam length | 4 m |\n' +
        '| Fulcrum position | 1 m from pounding end |\n' +
        '| Effort arm | 3 m |\n' +
        '| Load arm | 1 m |\n' +
        '| MA (force) | 1/3 = 0.33 — force is *reduced* |\n' +
        '| Velocity ratio | 3:1 — pounding head moves 3x faster |\n' +
        '| Pounding head mass | ~8 kg |\n' +
        '| Foot press speed | ~0.3 m/s (slow step) |\n' +
        '| Head impact speed | ~0.9 m/s (3x faster) |\n\n' +
        'Kinetic energy at impact: KE = 1/2 x 8 x 0.9^2 = **3.24 J**\n\n' +
        'Compare with a slow, heavy press at 0.3 m/s: KE = 1/2 x 8 x 0.3^2 = 0.36 J. The speed trade-off gives **9x more impact energy** — because KE depends on v^2, not v. The dheki is optimised for impact, not static force. This is the same principle behind a hammer (light handle, heavy head, fast swing).\n\n' +
        '**Root bridge structural analysis:**\n\n' +
        'Researchers at the Technical University of Munich instrumented root bridges with strain gauges and found:\n\n' +
        '| Property | Root bridge | Steel bridge (same span) |\n' +
        '|----------|-----------|------------------------|\n' +
        '| Load distribution | Remarkably uniform across root bundles | Concentrated in primary members |\n' +
        '| Response to overload | Roots thicken over time (thigmotropism) | No self-repair |\n' +
        '| Lifespan | 500+ years (self-maintaining) | 50-100 years (with maintenance) |\n' +
        '| Material source | Grows on-site | Mined, smelted, transported |\n' +
        '| Carbon footprint | Net negative (absorbs CO2) | High (steel production) |',
      advancedContent:
        '**Adaptive structural engineering — lessons from root bridges:**\n\n' +
        'Root bridges exhibit **thigmotropism** — a growth response to mechanical stress. Roots grow thicker where stress is greatest, naturally reinforcing load paths. This is analogous to Wolff\'s law in bone biology: bone remodels along lines of stress.\n\n' +
        '| Adaptive mechanism | Biological basis | Engineering analogue |\n' +
        '|-------------------|-----------------|---------------------|\n' +
        '| Thigmotropic thickening | Auxin redistribution under mechanical stress | Topology optimisation (FEA) |\n' +
        '| Root fusion (anastomosis) | Grafting between crossing roots | Welded joints |\n' +
        '| Aerial root recruitment | New roots grow toward stress points | Redundancy in critical structures |\n' +
        '| Self-repair after damage | Wound callus formation | Self-healing concrete (under research) |\n\n' +
        'Modern **biomimetic engineering** draws directly from these principles:\n\n' +
        '- **4D printing:** Materials that change shape after printing, inspired by the self-organising growth of root bridges. Hydrogels that swell along programmed axes can "grow" into load-bearing shapes.\n' +
        '- **Topology optimisation:** FEA software iteratively removes material from low-stress regions and adds it to high-stress regions — mimicking how roots thicken under load. The result looks organic and often resembles biological structures.\n' +
        '- **Living Building Materials (LBMs):** Researchers at the University of Colorado have embedded *Synechococcus* cyanobacteria in sand-gelatin matrices to create self-healing "living concrete" — bricks that can repair their own cracks and even reproduce.\n\n' +
        '**Bamboo as an engineering material:**\n\n' +
        'Bamboo (used in the dheki, dhenki-sal, scaffolding, and honey-hunting ladders) has remarkable mechanical properties:\n\n' +
        '| Property | Bamboo | Mild steel | Concrete |\n' +
        '|----------|--------|-----------|----------|\n' +
        '| Tensile strength | 140-230 MPa | 400 MPa | 2-5 MPa |\n' +
        '| Compressive strength | 50-100 MPa | 250 MPa | 20-40 MPa |\n' +
        '| Density | 600-800 kg/m^3 | 7,850 kg/m^3 | 2,400 kg/m^3 |\n' +
        '| Specific strength (strength/density) | **175-290 kN.m/kg** | 51 kN.m/kg | 8-17 kN.m/kg |\n' +
        '| Growth to harvest | 3-5 years | Mining + smelting | Mining + firing |\n\n' +
        'Bamboo\'s specific strength (strength per unit weight) is **3-6x better than steel**. It is essentially nature\'s carbon-fiber composite: cellulose fibers (high tensile strength) embedded in a lignin matrix (compression resistance), arranged in a graded density structure — denser at the outer wall, lighter at the centre. This is the same design principle used in modern functionally graded materials (FGMs).',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each NE Indian tool to its simple machine principle',
          pairs: [
            ['Dheki (rice mortar)', 'First-class lever — trades force for speed at the pounding head'],
            ['Root bridge construction', 'Uses levers, wedges, inclined planes, and pulley principles'],
            ['Honey-hunting rope system', 'Compound pulley — raises and lowers baskets on cliff faces (MA 2-3)'],
            ['Dhenki-sal (oil press)', 'Lever with MA > 1 — multiplies body weight into crushing force'],
            ['Bamboo scaffolding', 'Inclined planes + levers — high specific strength material'],
          ],
        },
      },
    },
  ],
};
