import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'fluid-mechanics',
  title: 'Fluid Mechanics',
  category: 'physics',
  tags: ['math', 'engineering'],
  keywords: ['bernoulli', 'viscosity', 'reynolds number', 'pressure', 'buoyancy', 'archimedes', 'navier-stokes', 'laminar', 'turbulent'],
  icon: '💧',
  tagline: "Why boats float, planes fly, and the Brahmaputra carves its path.",
  relatedStories: ['the-little-boat', 'ferrymans-riddle', 'lotus-float', 'siang-river'],
  understand: [
    // ── Section 1: Pressure in Fluids ──────────────────────────
    {
      title: 'Pressure in Fluids',
      diagram: 'PressureDepthDiagram',
      beginnerContent:
        'Imagine standing at the bottom of a swimming pool. You feel a squeezing sensation on your eardrums. That squeeze is **pressure** — the force the water pushes on every square centimetre of your body.\n\n' +
        '**Pressure = Force / Area**, measured in Pascals (Pa), where 1 Pa = 1 N/m².\n\n' +
        'Think of it like this: a woman in stiletto heels exerts *more* pressure on the floor than an elephant, because all her weight is concentrated on two tiny heel tips. The elephant spreads its weight across four huge feet.\n\n' +
        '| Scenario | Force (N) | Area (m²) | Pressure (Pa) |\n' +
        '|----------|-----------|-----------|---------------|\n' +
        '| Elephant standing (4,000 kg) | 39,240 | 0.12 (4 feet) | 327,000 |\n' +
        '| Woman in stilettos (60 kg) | 589 | 0.0001 (2 heels) | **5,890,000** |\n' +
        '| Lying flat on ground (70 kg) | 687 | 0.5 | 1,374 |\n\n' +
        'In a fluid at rest, pressure depends on **depth**: the deeper you go, the more fluid sits above you, and the heavier that column becomes. The formula is:\n\n' +
        '> **P = ρgh** (density x gravity x depth)\n\n' +
        'Water has a density of about 1,000 kg/m³. At 10 metres depth: P = 1,000 x 9.81 x 10 = **98,100 Pa** — nearly one whole atmosphere of extra pressure on top of the air pressure above the surface. This is why your ears hurt when you dive to the bottom of a deep pool.\n\n' +
        '**Pascal\'s principle** says: pressure applied to an enclosed fluid transmits equally in all directions. Squeeze a sealed water balloon at one point, and the pressure increases *everywhere* inside — not just where you squeezed. This is the foundation of every hydraulic system, from car brakes to the excavators building roads across Assam.\n\n' +
        '**Why does the Brahmaputra\'s embankment need to be thickest at the base?** Because the water pressure at the bottom is far greater than at the top (h is largest there). A 5-metre-deep section pushes with 49,050 Pa — five times more than the 1-metre level.',
      intermediateContent:
        '**The complete hydrostatic pressure formula** includes atmospheric pressure:\n\n' +
        '> **P = P_atm + ρgh**\n\n' +
        '| Depth in fresh water | Gauge pressure (ρgh) | Absolute pressure (P_atm + ρgh) | In atmospheres |\n' +
        '|---------------------|---------------------|-------------------------------|----------------|\n' +
        '| 0 m (surface) | 0 Pa | 101,325 Pa | 1.0 atm |\n' +
        '| 5 m | 49,050 Pa | 150,375 Pa | 1.5 atm |\n' +
        '| 10 m | 98,100 Pa | 199,425 Pa | 2.0 atm |\n' +
        '| 30 m (recreational dive limit) | 294,300 Pa | 395,625 Pa | 3.9 atm |\n' +
        '| 100 m | 981,000 Pa | 1,082,325 Pa | 10.7 atm |\n\n' +
        'Every 10 m of water adds roughly 1 atmosphere. Scuba divers must equalise ear pressure because the eardrum has air on one side and water on the other — the pressure difference can rupture it.\n\n' +
        '**Worked example — hydraulic press:**\n\n' +
        'A small piston has area A₁ = 5 cm² and a large piston has area A₂ = 200 cm². You push with 50 N on the small piston.\n\n' +
        '| Step | Calculation | Result |\n' +
        '|------|------------|--------|\n' +
        '| Pressure created | P = F₁/A₁ = 50 / 5×10⁻⁴ | 100,000 Pa |\n' +
        '| Force on large piston | F₂ = P × A₂ = 100,000 × 200×10⁻⁴ | **2,000 N** |\n' +
        '| Force multiplication | F₂/F₁ = A₂/A₁ = 200/5 | **40×** |\n' +
        '| Distance trade-off | d₁ = d₂ × (A₂/A₁) = 0.01 × 40 | 0.40 m |\n' +
        '| Work in | 50 × 0.40 | 20 J |\n' +
        '| Work out | 2,000 × 0.01 | 20 J ✓ |\n\n' +
        'Energy is conserved: you get 40× the force but must push 40× further. **Gauge pressure** (P − P_atm) is what instruments read: a car tyre at "32 psi" means 32 psi *above* atmospheric (absolute = 32 + 14.7 = **46.7 psi**).',
      advancedContent:
        '**Navier-Stokes equations** — the complete description of pressure in a moving fluid:\n\n' +
        '> ρ(∂**v**/∂t + **v**·∇**v**) = −∇P + μ∇²**v** + ρ**g**\n\n' +
        'This combines momentum conservation with viscous forces. These equations have no general closed-form solution and are one of the **Millennium Prize Problems** ($1 million for proving existence and smoothness of solutions in 3D).\n\n' +
        '| Term | Physical meaning | Contribution |\n' +
        '|------|-----------------|-------------|\n' +
        '| ρ(∂**v**/∂t) | Local acceleration | Unsteady flow changes |\n' +
        '| ρ(**v**·∇**v**) | Convective acceleration | Fluid speeding up as it moves |\n' +
        '| −∇P | Pressure gradient force | Fluid flows from high to low P |\n' +
        '| μ∇²**v** | Viscous diffusion | Internal friction between layers |\n' +
        '| ρ**g** | Body force | Gravity pulling fluid down |\n\n' +
        'The **Reynolds number** Re = ρvL/μ determines flow regime:\n\n' +
        '| Re range (pipe flow) | Flow type | Character |\n' +
        '|---------------------|-----------|----------|\n' +
        '| Re < 2,300 | Laminar | Smooth, orderly layers |\n' +
        '| 2,300 < Re < 4,000 | Transitional | Intermittent turbulent bursts |\n' +
        '| Re > 4,000 | Turbulent | Chaotic, mixing eddies |\n\n' +
        'Turbulence remains one of the last great unsolved problems in classical physics — Feynman called it "the most important unsolved problem of classical physics."\n\n' +
        '**Hydrostatic paradox:** The pressure at the bottom of a container depends only on depth, not on the total volume of fluid. A tall thin tube and a wide lake at the same depth have identical bottom pressure. At the bottom of the Mariana Trench (10,900 m), the pressure reaches ~1,100 atm (110 MPa), compressing water to ~5% greater density than at the surface.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'Water pressure at a given depth depends on the shape of the container.', answer: false, explanation: 'The hydrostatic paradox: pressure depends only on depth (P = ρgh), not on container shape or total water volume.' },
            { text: 'At 10 m depth in fresh water, the gauge pressure is approximately 1 atmosphere (≈ 98,100 Pa).', answer: true, explanation: 'P = ρgh = 1000 × 9.81 × 10 = 98,100 Pa, which is roughly 1 atm.' },
            { text: 'A flow with Reynolds number Re = 5,000 in a pipe is laminar.', answer: false, explanation: 'Re > 4,000 indicates turbulent flow. Laminar flow occurs when Re < 2,300.' },
            { text: 'Viscous diffusion represents internal friction between fluid layers.', answer: true, explanation: 'The μ∇²v term in the Navier-Stokes equation models how momentum diffuses between adjacent fluid layers due to viscosity.' },
          ],
        },
      },
    },

    // ── Section 2: Buoyancy ────────────────────────────────────
    {
      title: 'Buoyancy & Archimedes\' Principle',
      diagram: 'BuoyancyDiagram',
      beginnerContent:
        'Over 2,200 years ago, Archimedes discovered a law so elegant it still governs every boat on the Brahmaputra today:\n\n' +
        '> **Any object in a fluid experiences an upward force equal to the weight of fluid it displaces.**\n\n' +
        'Imagine lowering a 1-litre block into water. It shoves aside 1 litre of water (weight ~9.81 N). The water shoves back with a 9.81 N upward push — the **buoyant force**. If the block weighs less than 9.81 N, it floats. If more, it sinks.\n\n' +
        '| Object | Density (kg/m³) | Compared to water (1,000) | Floats or sinks? |\n' +
        '|--------|----------------|--------------------------|------------------|\n' +
        '| Cork | 120 | 8× lighter | Floats (barely submerged) |\n' +
        '| Bamboo | 350 | 3× lighter | Floats (35% submerged) |\n' +
        '| Ice | 917 | Slightly lighter | Floats (91.7% submerged) |\n' +
        '| Water | 1,000 | — | Neutrally buoyant |\n' +
        '| Brick | 2,000 | 2× heavier | Sinks |\n' +
        '| Steel | 7,800 | 7.8× heavier | Sinks |\n\n' +
        '**But steel ships float!** The trick is shape. A ship\'s hull is hollow, enclosing a huge volume of air. The *average* density of the hull (steel + air inside) is less than water, so the ship displaces enough water to support its entire weight.\n\n' +
        'If you crumpled the same steel into a solid ball, it would sink instantly. Shape is everything.\n\n' +
        '**On the Brahmaputra:** Traditional country boats, bamboo rafts, and ferries all rely on displacement. During annual floods — when the river swells to widths of 10 km — understanding buoyancy becomes a matter of survival. Floating houses in lower Assam are engineered through generations of practical knowledge to stay above the waterline. The same principles govern modern floating solar panels being deployed on *beels* and reservoirs across Northeast India.',
      intermediateContent:
        '**Archimedes\' formula:**\n\n' +
        '> **F_buoyant = ρ_fluid × V_displaced × g**\n\n' +
        'For a floating object, buoyant force = weight, so:\n\n' +
        '> V_submerged / V_total = ρ_object / ρ_fluid\n\n' +
        '| Object in water | ρ_object (kg/m³) | Fraction submerged | % visible above water |\n' +
        '|----------------|-----------------|-------------------|----------------------|\n' +
        '| Cork | 120 | 0.12 | 88% |\n' +
        '| Bamboo raft | 350 | 0.35 | 65% |\n' +
        '| Wooden boat (avg) | 600 | 0.60 | 40% |\n' +
        '| Ice (iceberg) | 917 | 0.917 | **8.3%** |\n' +
        '| Ship (steel + air) | 833 | 0.813 | 18.7% |\n\n' +
        '**Worked example — will the Brahmaputra ferry float safely?**\n\n' +
        'A ferry has hull volume = 120 m³ and total mass = 85,000 kg.\n\n' +
        '| Step | Calculation | Result |\n' +
        '|------|------------|--------|\n' +
        '| Average density | ρ_avg = 85,000 / 120 | 708 kg/m³ |\n' +
        '| Compared to river water | 708 / 1,000 | 0.708 |\n' +
        '| Fraction submerged | 70.8% | Floats with 29.2% above water ✓ |\n' +
        '| Max load before sinking | ρ_water × V × g = 1,000 × 120 × 9.81 | 1,177,200 N = **120 tonnes** |\n' +
        '| Remaining capacity | 120,000 − 85,000 | **35,000 kg** of cargo/passengers |\n\n' +
        '**Submarines** control buoyancy by filling ballast tanks with water (to dive, increasing average density above 1,025 kg/m³) or compressed air (to surface, decreasing average density below 1,025 kg/m³).\n\n' +
        '**Salt water vs fresh water:** Seawater (ρ = 1,025 kg/m³) provides more buoyancy than the Brahmaputra\'s fresh water (ρ ≈ 1,000 kg/m³). A ship\'s **Plimsoll line** marks safe load levels for different water densities — the same vessel sits lower in a river than in the ocean.',
      advancedContent:
        '**Metacentric height (GM)** determines whether a ship stays upright or capsizes.\n\n' +
        'When a ship tilts (heels), the centre of buoyancy **B** shifts to the side with more submerged volume. The **metacentre M** is where the vertical line through the new B intersects the original vertical.\n\n' +
        '| Condition | GM value | What happens |\n' +
        '|-----------|---------|-------------|\n' +
        '| M above G | GM > 0 (positive) | Restoring torque — ship returns upright (stable) |\n' +
        '| M at G | GM = 0 | Neutral — ship stays at any angle |\n' +
        '| M below G | GM < 0 (negative) | Capsizing torque — ship rolls over |\n\n' +
        '| Ship type | Typical GM (m) | Stability character |\n' +
        '|-----------|---------------|--------------------|\n' +
        '| Cargo ship (loaded) | 0.3–1.5 | Moderate — slow roll |\n' +
        '| Passenger ferry | 1.0–2.0 | Higher for safety |\n' +
        '| Sailing yacht | 0.5–1.2 | Ballast keel provides righting moment |\n' +
        '| Country boat (Brahmaputra) | 0.1–0.3 | Low — prone to capsizing in rough water |\n\n' +
        'The righting moment for small angles: **τ = Δ × GM × sin θ**, where Δ is displacement weight. The **GZ curve** (righting lever vs heel angle) reveals the full stability picture — the angle where GZ returns to zero is the point of no return.\n\n' +
        'The **added mass** effect: an accelerating body in fluid behaves as if it has extra mass equal to the mass of fluid displaced (for a sphere). This is why it\'s harder to wave your hand quickly through water than through air — you\'re accelerating both your hand *and* the water around it. This effect is described precisely by potential flow theory and is critical for naval architecture, offshore platform design, and the **Rayleigh-Plesset equation** governing bubble dynamics.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'A solid steel ball floats in water because steel is used to make ships.', answer: false, explanation: 'Solid steel (7,800 kg/m³) is much denser than water (1,000 kg/m³) and sinks. Ships float because their hollow hull has a low average density (steel + air).' },
            { text: 'An iceberg has about 90% of its volume hidden below the water surface.', answer: true, explanation: 'Ice density is 917 kg/m³, water is 1,000 kg/m³. Fraction submerged = 917/1000 = 91.7%, so only ~8.3% is visible.' },
            { text: 'A ship floats higher in the salty ocean than in the fresh Brahmaputra.', answer: true, explanation: 'Seawater (1,025 kg/m³) is denser than fresh water (1,000 kg/m³), so it provides more buoyant force per unit volume — the ship doesn\'t need to displace as much to support its weight.' },
            { text: 'If you add cargo to a floating boat, the buoyant force stays the same.', answer: false, explanation: 'Adding cargo increases the weight, so the boat sinks deeper, displacing more water. The buoyant force increases to match the new, heavier weight — until the boat sinks entirely.' },
          ],
        },
      },
    },

    // ── Section 3: Bernoulli\'s Principle ──────────────────────
    {
      title: 'Bernoulli\'s Principle & Flow',
      diagram: 'BernoulliDiagram',
      beginnerContent:
        'In 1738, Daniel Bernoulli discovered something counterintuitive: **when a fluid speeds up, its pressure drops.**\n\n' +
        'This is captured by Bernoulli\'s equation:\n\n' +
        '> **P + ½ρv² + ρgh = constant** (along a streamline)\n\n' +
        'Where P is pressure, ρ is density, v is velocity, and h is height. When v goes up, P must come down to keep the total constant.\n\n' +
        '**Analogy:** Think of a river narrowing through a gorge. The water *speeds up* in the narrow section (same amount of water, less space). By Bernoulli\'s principle, the pressure *drops* in that fast section. This is exactly what happens when the Brahmaputra squeezes through narrow channels near Guwahati — the water accelerates, pressure drops, and the turbulent energy erodes the banks.\n\n' +
        '**Where you see Bernoulli\'s principle every day:**\n\n' +
        '| Phenomenon | Fast flow (low pressure) | Slow flow (high pressure) | Result |\n' +
        '|------------|------------------------|--------------------------|--------|\n' +
        '| Airplane wing | Air over curved top | Air under flat bottom | Lift pushes wing up |\n' +
        '| Shower curtain | Fast air inside shower | Still air outside | Curtain billows inward |\n' +
        '| Cricket swing | Air over rough side (slower) | Air over smooth side (faster) | Ball curves toward rough side |\n' +
        '| River gorge | Fast water in narrows | Slow water in wide sections | Erosion in the narrows |\n' +
        '| Two boats side by side | Fast water between hulls | Slow water on outer sides | Boats pulled toward each other |\n\n' +
        '**The continuity equation** explains *why* fluid speeds up in narrow spaces. Since fluid can\'t pile up or vanish:\n\n' +
        '> **A₁v₁ = A₂v₂** (area × velocity = constant)\n\n' +
        'Half the area means double the speed. This is why you can spray water further by putting your thumb over the garden hose — you narrow the opening, and the water accelerates.',
      intermediateContent:
        '**Worked example — water in a narrowing pipe:**\n\n' +
        'Water flows through a horizontal pipe that narrows from 10 cm to 5 cm diameter. Entry velocity v₁ = 2 m/s.\n\n' +
        '| Step | Calculation | Result |\n' +
        '|------|------------|--------|\n' +
        '| Area ratio | A₁/A₂ = (d₁/d₂)² = (10/5)² | 4 |\n' +
        '| Exit velocity | v₂ = v₁ × (A₁/A₂) = 2 × 4 | **8 m/s** |\n' +
        '| Pressure drop | P₁ − P₂ = ½ρ(v₂² − v₁²) = 0.5 × 1000 × (64 − 4) | **30,000 Pa = 30 kPa** |\n\n' +
        'A **Venturi meter** uses exactly this — measuring the pressure drop in a narrow section to calculate flow rate.\n\n' +
        '**Worked example — airplane wing lift:**\n\n' +
        '| Parameter | Value |\n' +
        '|-----------|-------|\n' +
        '| Air speed over top of wing | 250 m/s |\n' +
        '| Air speed under wing | 230 m/s |\n' +
        '| Air density at cruise altitude | 0.4 kg/m³ |\n' +
        '| Wing area | 540 m² |\n\n' +
        '| Step | Calculation | Result |\n' +
        '|------|------------|--------|\n' +
        '| Pressure difference | ΔP = ½ρ(v_top² − v_bottom²) = 0.5 × 0.4 × (250² − 230²) | 0.5 × 0.4 × 9,600 = **1,920 Pa** |\n' +
        '| Lift force | F = ΔP × A = 1,920 × 540 | **1,036,800 N ≈ 106 tonnes** |\n\n' +
        'That is enough to hold a fully loaded Boeing 747 in the air.\n\n' +
        '**Flow rate and the continuity equation:**\n\n' +
        '| Quantity | Symbol | Formula | Unit |\n' +
        '|----------|--------|---------|------|\n' +
        '| Volume flow rate | Q | A × v | m³/s |\n' +
        '| Mass flow rate | ṁ | ρ × A × v | kg/s |\n' +
        '| Continuity | — | A₁v₁ = A₂v₂ | — |\n' +
        '| Bernoulli | — | P + ½ρv² + ρgh = const | Pa |\n\n' +
        'The Brahmaputra at Guwahati: width ~1.2 km, average depth ~10 m, flow speed ~2 m/s. Volume flow rate ≈ 1,200 × 10 × 2 = **24,000 m³/s** — among the highest of any river on Earth.',
      advancedContent:
        'Bernoulli\'s equation applies only along a streamline in **steady, inviscid, incompressible** flow. Real-world extensions:\n\n' +
        '| Condition | Modified equation | Key change |\n' +
        '|-----------|------------------|------------|\n' +
        '| Compressible (high Mach) | h + v²/2 = const (h = specific enthalpy) | P/ρ^γ = const (isentropic) |\n' +
        '| Unsteady flow | Add ρ∫(∂v/∂t)ds term | Time-dependent acceleration |\n' +
        '| Viscous losses | P₁ + ½ρv₁² = P₂ + ½ρv₂² + h_loss | Energy dissipated as heat |\n' +
        '| Rotational flow | Use Euler equations (general) | Bernoulli only valid on streamlines |\n\n' +
        '**Lift — the full picture:**\n\n' +
        'The Bernoulli explanation of lift (faster over top = lower pressure) is a simplification. The complete theory uses the **Kutta-Joukowski theorem**:\n\n' +
        '> **L\' = ρv∞Γ** (lift per unit span)\n\n' +
        'where Γ is the **circulation** — the line integral of velocity around the airfoil. Circulation arises from the **Kutta condition**: flow must leave the trailing edge smoothly. This explains why:\n' +
        '- Sharp trailing edges are essential\n' +
        '- Angle of attack creates lift even for *symmetric* airfoils\n' +
        '- Stall occurs when the boundary layer separates at high angles\n\n' +
        '**CFD (Computational Fluid Dynamics)** solves the full Navier-Stokes equations numerically:\n\n' +
        '| Method | What it resolves | Typical use | Cost |\n' +
        '|--------|-----------------|-------------|------|\n' +
        '| RANS (k-ε, k-ω SST) | Time-averaged flow | Industrial aerodynamics | Low |\n' +
        '| LES (Large Eddy Simulation) | Large turbulent structures | Research, combustion | Medium |\n' +
        '| DNS (Direct Numerical Simulation) | All scales of turbulence | Fundamental research only | Extreme |\n\n' +
        'A RANS simulation of a car might use ~10 million cells; DNS of the same flow would need ~10¹⁸ cells — far beyond any computer. Turbulence modelling remains the central challenge of fluid mechanics.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each Bernoulli phenomenon to its explanation',
          pairs: [
            ['Airplane lift', 'Air flows faster over the curved top of the wing, creating lower pressure above than below — net upward force'],
            ['Shower curtain billowing inward', 'Fast-moving air inside the shower has lower pressure than the still air outside'],
            ['Cricket ball swing', 'Rough side creates different airflow speed than smooth side — pressure difference curves the ball'],
            ['Venturi meter', 'Fluid speeds up in a narrow section, pressure drops — measuring the drop reveals flow rate'],
            ['River gorge erosion', 'Water accelerates through the narrow channel, pressure drops, causing cavitation that erodes rock'],
          ],
        },
      },
    },

    // ── Section 4: Viscosity and Drag ──────────────────────────
    {
      title: 'Viscosity & Drag Forces',
      beginnerContent:
        'Viscosity is a fluid\'s internal resistance to flow — its **"thickness."** Honey has a viscosity roughly 10,000 times that of water, which is why it pours slowly. At the molecular level, viscosity comes from friction between layers of fluid sliding past each other.\n\n' +
        '**Temperature changes everything:**\n\n' +
        '| Fluid | Viscosity at 20°C (Pa·s) | Viscosity at 80°C (Pa·s) | Change |\n' +
        '|-------|--------------------------|--------------------------|--------|\n' +
        '| Water | 1.0 × 10⁻³ | 0.35 × 10⁻³ | 3× thinner when hot |\n' +
        '| Honey | ~10 | ~0.5 | 20× thinner when hot |\n' +
        '| Motor oil (10W-40) | ~0.2 | ~0.01 | 20× thinner when hot |\n' +
        '| Air | 1.8 × 10⁻⁵ | 2.1 × 10⁻⁵ | Slightly *thicker* when hot |\n\n' +
        'Notice: gases get *more* viscous when heated (molecules move faster, collide more), but liquids get *less* viscous (molecules overcome attractions more easily).\n\n' +
        '**Drag** is the resistive force a fluid exerts on an object moving through it. There are two main types:\n\n' +
        '| Type | Dominant when... | Everyday example |\n' +
        '|------|-----------------|------------------|\n' +
        '| **Viscous drag** | Slow, small objects | Silt settling in the Brahmaputra |\n' +
        '| **Pressure drag** | Fast, large objects | A boat pushing through water |\n\n' +
        'Drag generally increases with the **square** of velocity. Doubling your speed quadruples the drag. This is why cycling at 30 km/h feels enormously harder than at 15 km/h, and why cars burn disproportionately more fuel at highway speeds.\n\n' +
        '**Terminal velocity** occurs when drag equals weight and an object stops accelerating:\n' +
        '- Skydiver (belly-down): ~55 m/s (200 km/h)\n' +
        '- Raindrop: ~9 m/s (32 km/h) — fast, but not fast enough to hurt\n' +
        '- Fine Brahmaputra silt particle: ~0.001 m/s — takes hours to settle 1 metre',
      intermediateContent:
        '**The drag equation:**\n\n' +
        '> **F_D = ½ρv²C_DA**\n\n' +
        'where ρ = fluid density, v = velocity, C_D = drag coefficient, A = frontal area.\n\n' +
        '| Object | C_D | Typical A (m²) | Shape |\n' +
        '|--------|-----|----------------|-------|\n' +
        '| Flat plate (⊥ to flow) | 1.28 | — | Worst |\n' +
        '| Sphere | 0.47 | πr² | Bad |\n' +
        '| Cylinder | 0.82 | d × L | Bad |\n' +
        '| Car (sedan) | 0.30 | 2.2 | OK |\n' +
        '| Sports car | 0.25 | 1.8 | Good |\n' +
        '| Tesla Model S | 0.208 | 2.3 | Very good |\n' +
        '| Teardrop shape | 0.04 | — | Ideal |\n\n' +
        '**Worked example — drag on a car at different speeds:**\n\n' +
        'Car: C_D = 0.30, A = 2.2 m², air density ρ = 1.225 kg/m³.\n\n' +
        '| Speed | v (m/s) | F_D = ½ρv²C_DA (N) | Power = F_D × v (W) | Power (hp) |\n' +
        '|-------|---------|---------------------|---------------------|------------|\n' +
        '| 60 km/h | 16.7 | 112 | 1,870 | 2.5 |\n' +
        '| 100 km/h | 27.8 | 312 | 8,674 | 11.6 |\n' +
        '| 140 km/h | 38.9 | 611 | 23,768 | 31.9 |\n' +
        '| 200 km/h | 55.6 | 1,248 | 69,389 | **93.0** |\n\n' +
        'Power to overcome drag scales as **v³** — 2× the speed = 8× the power! This is why fuel economy drops so sharply above 100 km/h.\n\n' +
        '**Worked example — terminal velocity of a raindrop:**\n\n' +
        'Raindrop: radius r = 1 mm, mass m ≈ 4.2 × 10⁻⁶ kg, C_D ≈ 0.47.\n\n' +
        'v_t = √(2mg / (ρ_air × C_D × πr²)) = √(2 × 4.2×10⁻⁶ × 9.81 / (1.225 × 0.47 × π × 10⁻⁶)) ≈ **6.5 m/s** (23 km/h).',
      advancedContent:
        'At very low Reynolds numbers (Re << 1), viscous forces dominate and drag becomes **linear** in velocity:\n\n' +
        '> **Stokes\' law: F_D = 6πμrv**\n\n' +
        'Terminal velocity of a sphere in the Stokes regime:\n\n' +
        '> **v_t = 2r²(ρ_s − ρ_f)g / (9μ)**\n\n' +
        'This is proportional to r² — smaller particles settle *much* more slowly.\n\n' +
        '| Particle | Radius | Terminal velocity in water | Settling time for 1 m |\n' +
        '|----------|--------|--------------------------|----------------------|\n' +
        '| Sand grain | 0.5 mm | ~20 cm/s | 5 seconds |\n' +
        '| Fine silt (Brahmaputra) | 10 μm | ~0.01 cm/s | 2.8 hours |\n' +
        '| Clay particle | 1 μm | ~0.0001 cm/s | 12 days |\n' +
        '| Bacterium | 0.5 μm | ~0.00003 cm/s | 39 days |\n\n' +
        'This explains why the Brahmaputra\'s fine silt stays suspended for weeks, turning the river its characteristic muddy brown — while coarser sand deposits quickly as sandbars (*chapori*).\n\n' +
        '**The drag crisis** occurs at Re ≈ 2-5 × 10⁵:\n\n' +
        '| Before drag crisis | After drag crisis |\n' +
        '|-------------------|------------------|\n' +
        '| Laminar boundary layer | Turbulent boundary layer |\n' +
        '| Early flow separation | Delayed separation |\n' +
        '| Wide wake, high C_D (~0.5) | Narrow wake, low C_D (~0.2) |\n\n' +
        'Golf ball dimples deliberately trip the boundary layer into turbulence at lower Re, triggering the drag crisis earlier and reducing drag by ~50%. Without dimples, a golf ball would travel only half as far.\n\n' +
        'The **Blasius solution** gives laminar boundary layer thickness: δ ∝ √(x/Re). Turbulent skin friction follows the **law of the wall**: u⁺ = (1/κ)ln(y⁺) + B, where κ ≈ 0.41 (von Karman constant).',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each drag concept to its description',
          pairs: [
            ['Stokes\' law (F = 6πμrv)', 'Drag on tiny, slow objects (Re << 1) — silt settling in rivers'],
            ['Drag equation (F = ½ρv²C_DA)', 'Drag on everyday objects — cars, boats, sports balls'],
            ['Terminal velocity', 'Speed where drag force equals weight — object stops accelerating'],
            ['Drag crisis', 'Sudden C_D drop when boundary layer transitions from laminar to turbulent'],
            ['Reynolds number (Re)', 'Ratio of inertial to viscous forces — determines flow regime'],
          ],
        },
      },
    },

    // ── Section 5: Hydraulics ──────────────────────────────────
    {
      title: 'Hydraulic Systems',
      diagram: 'HydraulicPressDiagram',
      beginnerContent:
        'Hydraulic systems turn Pascal\'s principle into practical muscle. The idea is beautifully simple:\n\n' +
        '1. Push a **small piston** with a small force\n' +
        '2. Fluid transmits the pressure equally everywhere\n' +
        '3. A **large piston** on the other end receives a much larger force\n\n' +
        '> **Force multiplication = Area of large piston / Area of small piston**\n\n' +
        'If the large piston has 10× the area, you get 10× the force. But you must push 10× further — energy is always conserved.\n\n' +
        '| Hydraulic system | Force multiplication | How it helps |\n' +
        '|-----------------|---------------------|-------------|\n' +
        '| Car brakes | ~50× | A gentle foot press creates thousands of N at each wheel |\n' +
        '| Hydraulic jack | ~100× | One hand lifts a 2-tonne car |\n' +
        '| Excavator arm | ~200× | Scoops tonnes of earth effortlessly |\n' +
        '| Hydraulic press | ~500× | Crushes metal or forms car body panels |\n\n' +
        '**Everyday example — car brakes:**\n\n' +
        'When you step on the brake pedal, a small **master cylinder** pushes brake fluid through pipes to larger **slave cylinders** at each wheel. Your moderate foot push (maybe 100 N) becomes thousands of Newtons of clamping force on the brake discs — enough to stop a 1,500 kg car from 100 km/h.\n\n' +
        '**Across India\'s construction sites**, hydraulic excavators dig foundations, clear land, and lift heavy loads. A single hydraulic excavator exerts forces over 200,000 N — all from Pascal\'s principle, discovered in 1653. The flood-control embankments along the Brahmaputra are built and maintained using these same hydraulic machines.',
      intermediateContent:
        '**Worked example — hydraulic jack:**\n\n' +
        'Small piston: A₁ = 2 cm². Large piston: A₂ = 100 cm². You push with 10 N.\n\n' +
        '| Step | Calculation | Result |\n' +
        '|------|------------|--------|\n' +
        '| Pressure created | P = F₁/A₁ = 10 / (2 × 10⁻⁴) | 50,000 Pa = 50 kPa |\n' +
        '| Force on large piston | F₂ = P × A₂ = 50,000 × (100 × 10⁻⁴) | **500 N** (50× amplification) |\n' +
        '| Distance trade-off | d₁ = d₂ × (A₂/A₁) = 0.01 × 50 | 0.50 m |\n' +
        '| Work in | 10 × 0.50 | 5 J |\n' +
        '| Work out | 500 × 0.01 | 5 J ✓ (energy conserved) |\n\n' +
        '**Worked example — car braking system:**\n\n' +
        '| Component | Area | Role |\n' +
        '|-----------|------|------|\n' +
        '| Master cylinder | A = 3 cm² | Converts foot force to pressure |\n' +
        '| Each wheel cylinder | A = 12 cm² | Converts pressure back to force |\n\n' +
        '| Step | Calculation | Result |\n' +
        '|------|------------|--------|\n' +
        '| Foot force | — | 100 N |\n' +
        '| Pressure in system | P = 100 / (3 × 10⁻⁴) | 333,333 Pa = 333 kPa |\n' +
        '| Force at each wheel | F = 333,333 × (12 × 10⁻⁴) | **400 N** |\n' +
        '| After lever mechanism | 400 × ~12.5 (mechanical advantage) | **~5,000 N** clamping per wheel |\n' +
        '| Total braking force (4 wheels) | 5,000 × 4 | **20,000 N** |\n\n' +
        '**Why brake fluid matters:**\n\n' +
        '| Property | Requirement | Why |\n' +
        '|----------|------------|-----|\n' +
        '| Incompressibility | High bulk modulus | Spongy brakes if fluid compresses |\n' +
        '| High boiling point | ~260°C (DOT 4) | Vapour bubbles = brake failure |\n' +
        '| Low viscosity | Flows freely at −40°C | Brakes must work in Himalayan winter |\n' +
        '| Non-corrosive | Protects rubber seals | System lasts 5+ years |',
      advancedContent:
        '**Real-world hydraulic engineering** must account for losses and non-ideal behaviour:\n\n' +
        '| Factor | Effect | Quantitative impact |\n' +
        '|--------|--------|--------------------|\n' +
        '| Bulk modulus of oil (~1.5 GPa) | Fluid compresses slightly under pressure | At 30 MPa: 2% compression → spongy feel |\n' +
        '| Air bubbles (bulk modulus 0.14 MPa) | Dramatically reduces system stiffness | Even 1% air → pedal travel doubles |\n' +
        '| Seal friction | Energy lost to friction | 5–15% efficiency loss |\n' +
        '| Pipe pressure drop | Viscous losses in long lines | Significant in large excavators |\n\n' +
        '**Hagen-Poiseuille equation** for laminar flow in hydraulic lines:\n\n' +
        '> **Q = πr⁴ΔP / (8μL)**\n\n' +
        'The r⁴ dependence is critical: halving the pipe radius reduces flow rate by **16×**. This governs hydraulic tubing sizing.\n\n' +
        '| Parameter | Typical value (excavator) |\n' +
        '|-----------|-------------------------|\n' +
        '| Operating pressure | 30–40 MPa |\n' +
        '| Flow rate | 200–400 L/min |\n' +
        '| Pump power | 100–250 kW |\n' +
        '| Hydraulic oil viscosity | ~30 cSt at 40°C |\n' +
        '| System efficiency | 70–85% |\n\n' +
        '**Electrohydraulic servo valves** (Moog valves) use electrical signals to precisely control hydraulic flow, enabling feedback-controlled positioning accurate to **micrometres**. Applications: aircraft flight control surfaces, industrial robots, earthquake shake tables, and telescope positioning.\n\n' +
        '**Hydraulics vs pneumatics:**\n\n' +
        '| Property | Hydraulics (oil) | Pneumatics (air) |\n' +
        '|----------|-----------------|------------------|\n' +
        '| Pressure range | 10–40 MPa | 0.5–1 MPa |\n' +
        '| Compressibility | Negligible | Significant |\n' +
        '| Force output | Very high | Moderate |\n' +
        '| Position control | Precise (μm) | Imprecise (mm) |\n' +
        '| Speed | Moderate | Fast |\n' +
        '| Cushioning | None (rigid) | Natural (air compresses) |\n' +
        '| Leakage | Messy (oil spill) | Clean (just air) |',
      interactive: {
        type: 'did-you-know',
        props: {
          facts: [
            'A hydraulic excavator exerts over 200,000 N of force — all derived from Pascal\'s principle, discovered in 1653. The same machines build and maintain the Brahmaputra flood embankments protecting millions in Assam.',
            'Even 1% air trapped in brake fluid dramatically reduces braking performance. Air\'s bulk modulus (0.14 MPa) is 10,000× lower than hydraulic oil\'s (1,500 MPa), so the pedal compresses the bubble instead of pushing the brakes.',
            'The Hagen-Poiseuille equation shows flow rate depends on the 4th power of pipe radius — halving the pipe diameter reduces flow by 16×. This is why clogged arteries are so dangerous: a 50% blockage reduces blood flow by 94%.',
            'Modern electrohydraulic servo valves achieve positioning accuracy of micrometres — used in aircraft flight control, earthquake shake tables, and space telescope pointing mechanisms.',
          ],
        },
      },
    },
  ],
};
