import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'materials-and-chemistry',
  title: 'Materials & Chemistry',
  category: 'materials-science',
  icon: '🧪',
  tagline: 'Silk proteins, clay minerals, bamboo composites — the chemistry of everyday materials.',
  relatedStories: ['why-the-muga-silk-is-golden', 'eri-silk', 'little-potter', 'grandmothers-pitha', 'holi-tea-gardens', 'paper-umbrella'],
  understand: [
    {
      title: 'What Are Materials?',
      beginnerContent: 'Everything you can touch is made of materials — the wood of a table, the cotton of a shirt, the glass of a window, the steel of a bridge. Materials science is the study of why different substances behave differently and how we can choose or design the right material for a job.\n\nMaterials are broadly classified into categories: metals (iron, copper, gold), ceramics (clay, glass, cement), polymers (plastics, rubber, silk), and composites (plywood, fibreglass, reinforced concrete — combinations of two or more materials that perform better together than alone). Bamboo is a natural composite: strong cellulose fibres embedded in a softer lignin matrix, giving it a strength-to-weight ratio that rivals steel. Every material you encounter was chosen because its properties — strength, flexibility, weight, cost, durability — matched the need.',
      intermediateContent:
        'Materials properties are quantified by precise measurements. **Young’s modulus** E = stress/strain measures stiffness: steel has E ≈ 200 GPa, bamboo about 10–20 GPa, and rubber about 0.01 GPa. **Tensile strength** is the maximum stress before fracture: spider silk reaches 1.3 GPa, Muga silk about 0.5 GPa, and mild steel about 0.4 GPa. The **stress–strain curve** reveals a material’s character: the elastic region (deformation reverses when force is removed), yield point (permanent deformation begins), and fracture point. **Hardness** is tested via the Mohs scale (qualitative, 1–10), Vickers test (diamond pyramid indent), or Brinell test (steel ball indent). **Toughness** — the total energy absorbed before fracture — is the area under the stress–strain curve. Silk excels here because it stretches 15–30% before breaking, absorbing enormous energy per unit mass.',
      advancedContent:
        'At the atomic scale, material failure begins at **dislocations** — line defects in the crystal lattice where planes of atoms are displaced. Metals deform by dislocation glide along slip planes; strengthening strategies (alloying, work-hardening, grain refinement) all work by impeding dislocation motion. **Fracture mechanics** analyses crack propagation: the stress intensity factor K = σ√(πa) determines whether a crack of length a in a material under stress σ will grow; fracture occurs when K reaches the critical value K_IC (fracture toughness). **Composite materials** combine phases to exploit each’s strengths — carbon-fibre-reinforced polymer (CFRP) achieves specific strength five times that of steel. Silk’s nanostructure is a natural composite: crystalline beta-sheet domains (stiff, strong) embedded in amorphous matrix regions (flexible), studied by atomic force microscopy and molecular dynamics simulations to inspire next-generation biomimetic materials.',
    },
    {
      title: 'Atoms and Chemical Bonds',
      beginnerContent: 'All materials are made of atoms, and the way atoms bond to each other determines everything about how a material behaves. There are three main types of chemical bonds. Ionic bonds form when one atom gives electrons to another (like sodium and chlorine forming table salt) — the resulting crystals are hard and brittle with high melting points. Covalent bonds form when atoms share electrons (like carbon atoms in diamond sharing four electrons each) — these bonds are extremely strong. Metallic bonds involve a "sea" of shared electrons flowing freely between metal atoms — this is why metals conduct electricity and can be bent without breaking.\n\nThe same element can form wildly different materials depending on how its atoms are arranged. Carbon atoms bonded in flat sheets make graphite (soft, slippery, used in pencils). The same carbon atoms bonded in a three-dimensional lattice make diamond (the hardest natural substance on Earth). Structure determines properties.',
    },
    {
      title: 'Why Materials Behave Differently',
      beginnerContent: 'A silk thread and a steel beam are both strong, but in completely different ways. Silk stretches before it breaks (high tensile strength and elasticity). Steel resists bending (high stiffness). Wood is strong along the grain but splits easily across it (a property called anisotropy). Glass is hard but shatters (brittle).\n\nThese differences come from molecular structure. In silk, long protein chains coil and unfold under stress, absorbing energy like a spring. In steel, metal atoms are packed in tight crystal grids that resist deformation — but if you push hard enough, layers of atoms slide over each other, which is why steel bends rather than shatters. In wood, cellulose fibres run parallel like bundles of rope, so pulling along the grain is resisted by thousands of fibres working together, while pulling across the grain only needs to separate them sideways. Understanding the relationship between atomic structure and material behaviour is the core insight of materials science.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each material property to its meaning',
          pairs: [
            ['Tensile strength', 'How much pulling force a material can withstand before breaking'],
            ['Elasticity', 'Ability to stretch and return to original shape'],
            ['Brittleness', 'Tendency to crack or shatter without bending first'],
            ['Conductivity', 'How well a material allows heat or electricity to pass through it'],
            ['Anisotropy', 'Having different strength in different directions (like wood grain)'],
          ],
        },
      },
    },
    {
      title: 'The Chemistry of Silk',
      beginnerContent: 'Muga silk from Assam is the only naturally golden silk in the world. Its colour comes from carotenoid pigments in the silk protein, deposited by the Antheraea assamensis moth during spinning. Remarkably, the golden colour intensifies with each wash — the opposite of most dyes, because washing removes surface impurities that dull the sheen.\n\nSilk is a protein fibre — chains of amino acids (primarily glycine, alanine, and serine) folded into a structure that alternates between tightly packed crystalline regions and looser amorphous regions. The crystalline regions give silk its extraordinary tensile strength (comparable to steel wire of the same diameter), while the amorphous regions give it flexibility and elasticity. This combination makes silk one of the toughest natural fibres known — spider dragline silk can absorb more energy per unit weight before breaking than almost any synthetic material. Engineers study silk\'s molecular architecture to design new synthetic fibres and even medical sutures.',
      diagram: 'SilkStructureDiagram',
    },
    {
      title: 'Ceramics — From River Clay to Space Shuttles',
      beginnerContent: 'Ceramics are materials made by heating minerals — usually clay — to high temperatures, permanently changing their structure. When a potter in Assam shapes wet river clay and fires it in a kiln, the heat drives off water and causes the silicate minerals in the clay to fuse into a rigid, interlocking network of crystals. The result is hard, heat-resistant, and waterproof — properties the raw clay never had.\n\nThe same principle applies to advanced ceramics used in modern technology. Silicon carbide ceramics coat the leading edges of spacecraft to withstand the 1,600 degree Celsius heat of re-entry. Alumina ceramics insulate spark plugs. Zirconia ceramics are used in artificial hip joints because they are biocompatible, incredibly hard, and resist wear for decades. Glass is also a ceramic — but one where the atoms are frozen in a disordered (amorphous) arrangement rather than a crystal, which is why glass is transparent (the disordered structure does not scatter light the way crystal boundaries do).',
    },
    {
      title: 'Food Chemistry — Cooking as a Chemical Lab',
      beginnerContent: 'Cooking is chemistry. The Maillard reaction — when sugars and amino acids react above 140 degrees Celsius — creates the brown crust on pitha, the flavour of roasted tea, the aroma of grilled fish, and the golden surface of a perfectly toasted roti. It produces hundreds of new flavour and aroma compounds that did not exist in the raw ingredients. This is not the same as caramelisation (which involves only sugar) — the Maillard reaction requires both sugar and protein.\n\nFermentation is chemistry powered by microbes. Yeast converts sugar to alcohol and carbon dioxide (making bread rise and creating rice beer). Bacteria convert lactose to lactic acid (making yogurt from milk and giving it a tangy taste). Acetobacter bacteria convert alcohol to acetic acid (making vinegar). These are among humanity\'s oldest biotechnologies — fermented foods have been made for at least 9,000 years, long before anyone knew what microbes were. Today, the same principles drive industries from pharmaceuticals (many drugs are produced by engineered microbes) to biofuels.',
    },
    {
      title: 'Natural vs Synthetic — Trade-offs',
      beginnerContent: 'Natural dyes (turmeric for yellow, indigo for blue, lac for red) come from plants and insects. Synthetic dyes come from petroleum chemistry. Natural dyes are biodegradable and non-toxic but often fade faster and require mordants (chemical fixatives) to bind to fabric. Synthetic dyes are vivid, consistent, and permanent but can pollute waterways during manufacturing — textile dyeing is one of the largest sources of industrial water pollution worldwide.\n\nThe same trade-off appears across material choices. Bamboo is renewable, lightweight, and strong but vulnerable to insects and moisture without treatment. Concrete is durable and fireproof but energy-intensive to produce and responsible for about 8 percent of global carbon dioxide emissions. Cotton is comfortable and breathable but requires enormous amounts of water to grow. Polyester is cheap and durable but sheds microplastic fibres with every wash. There is rarely a simple answer — understanding chemistry helps you evaluate the real trade-offs and make informed choices rather than relying on marketing labels.',
    },
    {
      title: 'Phase Diagrams',
      diagram: 'PhaseDiagramSteelDiagram',
      beginnerContent:
        'What happens when you heat a piece of steel? At room temperature, the iron atoms are arranged ' +
        'in a specific crystal pattern called **ferrite** (body-centred cubic). As you heat it past ' +
        '727°C, the atoms rearrange into a different pattern called **austenite** (face-centred cubic). ' +
        'If you cool it slowly, it changes back. If you cool it rapidly (quenching in water), the atoms ' +
        'get "trapped" in a strained arrangement called **martensite** — which is extremely hard but ' +
        'brittle. This is why blacksmiths quench hot steel in water to make hard blades.\n\n' +
        'A **phase diagram** is a map that shows which structure (phase) a material will have at any ' +
        'given combination of **temperature** and **composition**. For steel, the horizontal axis shows ' +
        'the percentage of carbon mixed with iron, and the vertical axis shows temperature. Different ' +
        'regions of the map correspond to different phases — ferrite, austenite, cementite (iron ' +
        'carbide), and mixtures of these.\n\n' +
        'Phase diagrams are not just for metals. Water has a phase diagram showing where it exists as ' +
        'ice, liquid, or steam depending on temperature and pressure. The **triple point** is the exact ' +
        'condition where all three phases coexist simultaneously. Chocolate has a phase diagram too — ' +
        'tempering chocolate involves carefully controlling temperature to get the right crystal form ' +
        '(Form V) that gives a glossy finish and satisfying snap.\n\n' +
        'Engineers use phase diagrams to design materials with specific properties. Want a steel that ' +
        'is hard? Add more carbon and quench it. Want one that is ductile and easy to shape? Use low ' +
        'carbon and cool slowly. The phase diagram tells you exactly what you will get.',
      intermediateContent:
        'The **iron-carbon phase diagram** is the most important in metallurgy. Key features: the ' +
        '**eutectoid point** at 0.76% C and 727°C, where austenite transforms to **pearlite** (alternating ' +
        'layers of ferrite and cementite). Below 0.76% C: hypoeutectoid steel — proeutectoid ferrite ' +
        'forms first, then remaining austenite transforms to pearlite. Above 0.76% C: hypereutectoid — ' +
        'proeutectoid cementite forms first. The **eutectic point** at 4.3% C and 1,147°C is where ' +
        'liquid transforms directly to a solid mixture. The **lever rule** calculates phase fractions: ' +
        'at composition C₀ between phases at Cα and Cβ, the fraction of β phase = (C₀ - Cα)/(Cβ - Cα). ' +
        'TTT (Time-Temperature-Transformation) diagrams add cooling rate as a variable, showing how ' +
        'different cooling rates produce pearlite, bainite, or martensite.',
      advancedContent:
        'Phase diagrams are derived from **Gibbs free energy** minimization: at equilibrium, the system ' +
        'adopts the phase(s) with the lowest total G = H - TS. The **Gibbs phase rule** F = C - P + 2 ' +
        'determines degrees of freedom F given C components and P phases. Binary phase diagrams are ' +
        'computed using the CALPHAD method, which models excess Gibbs energy of mixing with Redlich-Kister ' +
        'polynomials fitted to experimental data. Modern computational thermodynamics (Thermo-Calc, ' +
        'FactSage) extends this to multicomponent systems with dozens of elements. Phase-field modeling ' +
        'simulates microstructure evolution during solidification and phase transformations by solving ' +
        'coupled Cahn-Hilliard and Allen-Cahn equations on computational grids.',
    },
    {
      id: 'lost-wax-casting',
      title: 'Lost-Wax Casting — Turning Wax into Metal',
      beginnerContent:
        'Lost-wax casting (also called *cire perdue*) is one of humanity\'s oldest metalworking techniques — at least 5,000 years old. The basic idea is brilliant: you sculpt a detailed model in **wax**, encase it in a heat-resistant mould, melt out the wax, and pour molten metal into the space left behind. The wax is "lost" — sacrificed — to create the metal object.\n\n' +
        'Here\'s the step-by-step: (1) Sculpt the object in wax. (2) Coat the wax in layers of clay or ceramic slurry, building up a hard shell. (3) Heat the mould to melt and drain the wax (this is the "lost wax" step). (4) Pour molten metal (bronze, brass, gold, silver) into the empty cavity. (5) Break away the mould to reveal the metal casting. (6) Polish and finish.\n\n' +
        'The technique is still used today for jet engine turbine blades, dental crowns, jewellery, and the bronze Nataraja statues of Swamimalai in Tamil Nadu — where fifth-generation families use essentially the same method as their ancestors.\n\n' +
        '**Check yourself:** Why do you think the technique uses wax specifically, rather than wood or plastic? (Because wax melts at a low temperature — around 60-80°C — and flows out completely, leaving a perfectly clean cavity. It\'s also soft enough to carve fine detail.)',
      intermediateContent:
        'The metallurgy involves several **phase transitions**. Wax undergoes solid → liquid at ~65°C (melting). The mould clay undergoes dehydration at 100-300°C, then sintering at 700-900°C (clay particles fuse into ceramic). The metal — typically bronze (88% Cu, 12% Sn) — melts at ~950°C and must be poured at ~1050-1100°C (superheated to ensure it flows into fine details before solidifying).\n\n' +
        'The **cooling rate** determines grain structure. Slow cooling produces large grains (softer, more ductile). Fast cooling produces small grains (harder, stronger). Temple bronze statues are designed for beauty, not strength — slow cooling in the mould produces a fine surface finish. Turbine blades are cooled in precisely controlled ways to produce single-crystal structures with no grain boundaries at all.',
      advancedContent:
        'Investment casting (the industrial version of lost-wax) produces turbine blades with internal cooling channels impossible to machine. The wax pattern includes ceramic cores that create hollow passages in the final metal. Single-crystal casting uses a helical grain selector at the base of the mould — only one crystal orientation survives the spiral, producing a blade with zero grain boundaries. This eliminates grain-boundary creep, allowing operating temperatures within 30°C of the alloy\'s melting point (1300°C for nickel superalloys). The directional solidification rate is controlled to ~0.1 mm/s in a Bridgman furnace with a thermal gradient of 30-50°C/cm.',
    },
    {
      id: 'solar-concentration',
      title: 'Solar Concentration — Focusing Sunlight for Energy',
      beginnerContent:
        'A magnifying glass can focus sunlight to a point hot enough to light paper on fire. **Solar concentration** uses the same principle at a much larger scale — curved mirrors focus sunlight to heat water, cook food, or generate electricity.\n\n' +
        'The key shape is the **parabola**. A parabolic mirror has the special property that all incoming parallel rays (sunlight) reflect to a single point called the **focus**. Place a pot at the focus, and it heats up intensely — not because you\'re adding energy, but because you\'re concentrating energy from a large area onto a small one.\n\n' +
        'The **concentration ratio** is the area of the mirror divided by the area of the receiver. A 2-metre diameter parabolic dish with a 10 cm receiver has a concentration ratio of about 400:1. That means the receiver gets 400 times the intensity of normal sunlight — enough to reach temperatures over 500°C.\n\n' +
        'Auroville\'s Solar Kitchen in Tamil Nadu uses a large parabolic concentrator to cook lunch for 1,000 people daily, using no fuel at all.',
      intermediateContent:
        'Three main concentrator geometries: (1) **Parabolic trough** — a long curved mirror focusing light onto a tube at its focal line. Used in solar thermal power plants (e.g., Andasol, Spain: 510,000 mirrors generating 150 MW). Concentration ratio: 30-100. (2) **Parabolic dish** — focuses to a point. Highest concentration ratio: 1,000-3,000. Used for Stirling engines and solar cooking. (3) **Power tower** (heliostat field) — hundreds of flat mirrors track the sun and reflect light to a central receiver on a tall tower. Ivanpah, California: 347,000 mirrors, 392 MW.\n\n' +
        'The maximum temperature achievable is limited by the **Stefan-Boltzmann law**: P = σAT⁴. As the receiver heats up, it radiates energy back at a rate proportional to T⁴. Equilibrium is reached when absorbed solar power equals radiated power. With concentration ratio C and solar flux S: T_max = (C·S/σ)^(1/4). For C=1000, T_max ≈ 3,400 K (theoretical). In practice, convective losses and imperfect mirrors limit this to ~1,500°C.',
      advancedContent:
        'Concentrated Solar Power (CSP) with thermal storage solves the intermittency problem. Molten salt (60% NaNO₃ + 40% KNO₃) is heated to 565°C by concentrated sunlight and stored in insulated tanks. The salt stays liquid above 220°C and stores energy at ~1 kWh/m³/°C — a 30,000 m³ tank stores ~6 hours of generation. Gemasolar in Spain achieves 24-hour operation using this approach. The thermodynamic efficiency of the Rankine steam cycle driven by CSP is η = 1 - T_cold/T_hot (Carnot limit). At T_hot=838K and T_cold=308K, η_Carnot=63%. Real-world cycle efficiency is 35-42% due to irreversibilities. Combining CSP with supercritical CO₂ Brayton cycles (operating at 700°C+) promises efficiencies above 50%.',
    },
  ],
};
