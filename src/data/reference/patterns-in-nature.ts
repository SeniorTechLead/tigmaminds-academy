import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'patterns-in-nature',
  title: 'Patterns in Nature',
  category: 'math',
  icon: '🔢',
  tagline: 'Fibonacci spirals, tessellations, fractals, and the hidden math in flowers and honeycombs.',
  relatedStories: ['basket-weavers-song', 'the-magic-japi-hat'],
  understand: [
    {
      title: 'Mathematics Is the Language of Nature',
      beginnerContent:
        'Long before humans invented mathematics, nature was already using it. The spiral of a snail shell, the branching of a tree, the hexagons of a honeycomb, the symmetry of a snowflake — all follow precise mathematical rules. This is not a coincidence. These patterns emerge because they solve physical problems efficiently. A honeycomb uses hexagons because hexagons tessellate (tile a surface with no gaps) while enclosing the maximum area with the minimum amount of wax. A spiral shell grows in a way that maintains its shape at every size. Nature does not "know" mathematics, but the laws of physics and chemistry naturally produce structures that mathematicians can describe with elegant equations.',
      intermediateContent:
        'The hexagonal honeycomb conjecture — that hexagons are the most efficient way to partition a plane into equal areas with minimum perimeter — was conjectured by ancient Greeks but only proven mathematically by Thomas Hales in 1999. The proof shows that for area A, a regular hexagon has perimeter p = √(24A/√3) ≈ 3.722√A, while a square of the same area has perimeter 4√A ≈ 4.000√A. That 7.4% material saving is why bees, basalt columns, and bubble rafts all converge on hexagons. Nature optimizes because physics penalizes waste: a soap film minimizes surface tension energy, producing the same hexagonal pattern.',
      advancedContent:
        'D\'Arcy Thompson\'s 1917 masterwork "On Growth and Form" argued that biological shapes arise from physical forces, not just genetics. Modern research confirms this: reaction-diffusion equations (Turing patterns) produce spots, stripes, and spirals from simple chemical interactions. The Belousov-Zhabotinsky reaction demonstrates this in a petri dish — oscillating chemical concentrations create spiral waves identical to those on seashells. At the frontier, researchers use topology and group theory to classify all possible biological symmetries, connecting developmental biology to abstract algebra.',
    },
    {
      title: 'The Fibonacci Sequence',
      diagram: 'FibonacciSpiralDiagram',
      beginnerContent:
        'The Fibonacci sequence starts with 0 and 1, and each subsequent number is the sum of the two before it: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, and so on. This simple rule produces a sequence that appears throughout nature with remarkable consistency. Count the petals on a flower: lilies have 3, buttercups have 5, delphiniums have 8, marigolds have 13, daisies often have 21, 34, or 55. Count the spirals on a sunflower head or a pinecone: they almost always come in consecutive Fibonacci numbers (for example, 34 spirals one way and 55 the other). The reason is that Fibonacci spacing is the most efficient way to pack seeds or leaves, maximising exposure to sunlight and rain while minimising overlap.',
      intermediateContent:
        'The ratio of consecutive Fibonacci numbers converges to φ = (1 + √5)/2 ≈ 1.6180339887... The convergence rate can be computed: |F(n+1)/F(n) − φ| ≈ 1/(φ^(2n)·√5). By F(12) = 144, the ratio F(13)/F(12) = 233/144 = 1.61805... differs from φ by only 0.00001. The angle that maximizes packing efficiency in phyllotaxis (leaf/seed arrangement) is 360°/φ² ≈ 137.5°, called the golden angle. Seeds placed at successive golden angles never perfectly align, ensuring each seed gets maximum space and sunlight.',
      advancedContent:
        'Fibonacci numbers have deep algebraic properties: F(n) = (φⁿ − ψⁿ)/√5 (Binet\'s formula, where ψ = (1−√5)/2 ≈ −0.618). This closed-form means you can compute F(100) directly without adding 99 terms. The Fibonacci sequence modulo m is always periodic (Pisano period); for example, F(n) mod 10 repeats every 60 terms. In modern computer science, Fibonacci heaps achieve O(1) amortized time for decrease-key operations, powering Dijkstra\'s shortest-path algorithm. Zeckendorf\'s theorem states every positive integer has a unique representation as a sum of non-consecutive Fibonacci numbers.',
    },
    {
      title: 'The Golden Ratio and Spirals',
      beginnerContent:
        'As you go further along the Fibonacci sequence, the ratio between consecutive numbers converges on a special value: approximately 1.618, known as the golden ratio (represented by the Greek letter phi). If you draw squares with Fibonacci side lengths and connect their corners with a smooth curve, you get a logarithmic spiral — the same spiral found in nautilus shells, hurricanes, spiral galaxies, and the arrangement of seeds in a sunflower head. The traditional japi hat of Assam, woven from bamboo and palm leaves, often features a conical spiral pattern that follows similar mathematical principles. The weavers may not calculate ratios, but their hands follow patterns refined over generations that naturally produce efficient, beautiful spirals.',
      intermediateContent:
        'A logarithmic spiral has the equation r = ae^(bθ) in polar coordinates. The golden spiral is a special case where the growth factor per quarter turn equals φ: after rotating 90°, the radius increases by φ ≈ 1.618. The self-similarity property means any portion of the spiral is geometrically identical to the whole — zoom in or out and the shape is the same. Measure a nautilus shell: the ratio of successive chamber widths should approximate φ. In practice, most nautilus shells have ratios closer to 1.33, so the "golden spiral in nature" claim is often overstated — but the mathematical principle remains beautiful.',
      advancedContent:
        'The golden ratio is the "most irrational" number in a precise sense: its continued fraction representation is [1; 1, 1, 1, ...] — all 1s — making it the slowest to converge among all continued fractions. This is why golden-angle phyllotaxis avoids resonances: rational angles create spoke-like patterns (parastichy), but φ never gets close to any rational number, distributing points most uniformly. In quasicrystals (discovered by Dan Shechtman, 2011 Nobel Prize), atoms arrange in Penrose-tiling patterns with 5-fold symmetry — forbidden in classical crystallography — using golden-ratio spacings.',
    },
    {
      title: 'Tessellations — Tiling Without Gaps',
      diagram: 'TessellationDiagram',
      beginnerContent:
        'A tessellation is a pattern of shapes that fit together perfectly to cover a surface with no gaps and no overlaps. Only three regular polygons can tessellate on their own: equilateral triangles, squares, and regular hexagons. Nature overwhelmingly favors hexagons. Honeybees build their combs with hexagonal cells. The scales on a snake\'s belly approximate hexagons. Basalt columns (like the Giant\'s Causeway in Ireland) crack into hexagonal pillars as lava cools. The reason is mathematical: among shapes that tessellate, hexagons have the highest area-to-perimeter ratio — they enclose the most space with the least material. Basket weavers in Assam use tessellation principles intuitively, interlocking strips of bamboo in repeating patterns that create strong, flexible surfaces.',
      intermediateContent:
        'Only three regular polygons tessellate: equilateral triangles (interior angle 60°, six around each vertex: 6×60° = 360°), squares (90°, four around: 4×90° = 360°), and hexagons (120°, three around: 3×120° = 360°). A regular polygon tessellates if and only if 360° is divisible by its interior angle. Pentagon interior angle = 108°, and 360/108 = 3.33... — not an integer, so pentagons leave gaps. Semi-regular (Archimedean) tessellations use two or more regular polygon types — there are exactly 8 distinct semi-regular tessellations, each with a different vertex configuration like (3,3,3,3,6) or (3,4,6,4).',
      advancedContent:
        'In 2015, a team led by Casey Mann discovered the 15th (and last) type of convex pentagon that can tile the plane — completing a search begun in 1918. The proof that no 16th type exists was confirmed by computer-assisted exhaustive analysis. Penrose tilings (1974) use two tile shapes to create aperiodic tessellations — patterns that fill the plane but never repeat. These tiles follow matching rules that force non-periodicity, and their diffraction patterns show sharp peaks like crystals but with forbidden 5-fold symmetry. Penrose tilings are physical models of quasicrystalline materials.',
    },
    {
      title: 'Fractals — Infinite Patterns at Every Scale',
      diagram: 'FractalTreeDiagram',
      beginnerContent:
        'A fractal is a pattern that repeats at every scale — zoom in, and you see the same structure repeated smaller and smaller. The most famous example is a fern leaf: each frond is a miniature copy of the entire leaf, and each sub-frond is a miniature copy of the frond. Rivers viewed from space show fractal branching patterns — the main river branches into tributaries, which branch into smaller streams, which branch into tiny rivulets, all following the same pattern. Lightning bolts, blood vessels, tree branches, coastlines, and mountain ranges all show fractal geometry. The remarkable thing is that extremely complex-looking natural shapes can be generated by very simple mathematical rules repeated over and over.',
      intermediateContent:
        'The fractal dimension D quantifies the "roughness" of a fractal. For a Koch snowflake, each iteration replaces 1 segment with 4 segments each 1/3 the length: D = log(4)/log(3) ≈ 1.26. This means the Koch curve is "more than a line" (D=1) but "less than a surface" (D=2). The Sierpinski triangle has D = log(3)/log(2) ≈ 1.585. Coastlines have fractal dimensions between 1.0 and 1.5 — Britain\'s coast is about D ≈ 1.25. You can estimate D by measuring the length at different ruler sizes and plotting log(length) vs log(ruler) — the slope gives 1−D.',
      advancedContent:
        'The Mandelbrot set, defined by iterating z → z² + c in the complex plane, is the most famous fractal. Points c where the iteration stays bounded form the set; the boundary has infinite detail at every magnification. Its boundary has fractal dimension exactly 2 — it is so convoluted that it is as complex as a filled area. Julia sets (related fractals for fixed c) are either connected or totally disconnected (Cantor dust), with the Mandelbrot set serving as a "map" of which Julia sets are connected. Fractal geometry underpins JPEG2000 image compression, antenna design (fractal antennas receive multiple frequencies), and terrain generation in video games.',
    },
    {
      title: 'Symmetry in Biology',
      diagram: 'SymmetryDiagram',
      beginnerContent:
        'Symmetry is one of the most visible patterns in nature. Most animals have bilateral symmetry — their left side is a mirror image of their right side. This makes sense for creatures that move forward: bilateral symmetry gives balanced weight distribution and pairs of limbs, eyes, and ears that work together. Starfish and jellyfish have radial symmetry — they look the same from multiple angles around a central point, which suits their lifestyle of not having a clear "front" or "back." Flowers show stunning radial symmetry, often with petals arranged in Fibonacci numbers. Even at the molecular level, symmetry rules: DNA is a double helix, crystals form from repeating symmetrical unit cells, and snowflakes always have six-fold symmetry because of the angle at which water molecules bond.',
      intermediateContent:
        'Mathematically, symmetry operations form algebraic structures called groups. Bilateral symmetry is the group Z₂ = {identity, reflection}. The symmetry group of a regular hexagon (like a snowflake) is D₆, with 12 elements: 6 rotations (0°, 60°, 120°, 180°, 240°, 300°) and 6 reflections. Starfish have D₅ symmetry (10 elements). The human body\'s approximate bilateral symmetry breaks down internally — your heart is on the left, your liver on the right — a phenomenon called chirality. About 1 in 10,000 people have situs inversus, where all organs are mirrored.',
      advancedContent:
        'The deepest connection between symmetry and physics is Noether\'s theorem (1918): every continuous symmetry of the laws of physics corresponds to a conservation law. Translational symmetry → conservation of momentum. Rotational symmetry → conservation of angular momentum. Time symmetry → conservation of energy. In particle physics, the symmetry group SU(3) × SU(2) × U(1) describes all known fundamental forces except gravity. Symmetry breaking — when a system\'s ground state has less symmetry than its governing equations — explains why the Higgs field gives particles mass and why magnets have preferred directions.',
    },
    {
      title: 'Voronoi Patterns and Efficiency',
      beginnerContent:
        'Voronoi patterns divide a surface into regions where every point within a region is closer to that region\'s center than to any other center. Crack a dried mud flat and the cracks form a Voronoi pattern. Look at a giraffe\'s coat: the brown patches are Voronoi cells formed by pigment spreading outward from evenly spaced points during development. The cells in a dragonfly\'s wing are arranged in a Voronoi-like pattern that optimises strength while minimising weight. Soap bubbles pressed together form Voronoi boundaries at the points where three bubbles meet. These patterns appear everywhere because they represent nature\'s solution to a common problem: how to divide space efficiently given a set of starting points. Mathematicians and computer scientists use Voronoi diagrams to solve real-world problems from urban planning to robot navigation.',
      intermediateContent:
        'To construct a Voronoi diagram: given n seed points, draw the perpendicular bisector between every pair of adjacent seeds. The region around each seed is bounded by these bisectors. For n points, the diagram has at most 2n−5 vertices and 3n−6 edges (by Euler\'s formula). The dual of a Voronoi diagram is the Delaunay triangulation — connecting seeds whose Voronoi cells share an edge — which maximizes the minimum angle of all triangles, making it ideal for finite element meshes in engineering simulations.',
      advancedContent:
        'Voronoi diagrams have O(n log n) construction algorithms (Fortune\'s sweep line). Applications span diverse fields: in epidemiology, John Snow\'s 1854 cholera map was essentially a Voronoi diagram around water pumps, identifying the Broad Street pump as the infection source. In astrophysics, Voronoi tessellation estimates galaxy density from point distributions. In robotics, generalized Voronoi diagrams create optimal paths equidistant from all obstacles. Weighted Voronoi diagrams (where seeds have different "sizes") model biological cell growth — larger cells with more nutrients grow faster, pushing their boundaries outward.',
    },
    {
      title: 'Why Patterns Matter',
      beginnerContent:
        'Recognising patterns in nature is not just beautiful — it is scientifically powerful. When you notice that the same spiral appears in a galaxy and a seashell, it tells you something deep: the same mathematical principles operate at vastly different scales. Fibonacci patterns in plants led to better solar panel designs that capture more sunlight. Fractal geometry helps us model coastlines, predict weather, and compress digital images. Honeycomb-inspired hexagonal structures are used in aerospace engineering because they combine lightness with strength. Understanding these patterns connects mathematics to biology, physics, engineering, and art — reminding us that the boundaries between subjects are human inventions, while nature is one interconnected whole.',
      intermediateContent:
        'Fibonacci-inspired solar panel layouts can increase energy capture by 20-50% compared to flat panels. The key insight: arranging small solar cells at golden-angle intervals on a curved surface mimics a sunflower head, ensuring no cell permanently shadows another as the sun moves. Fractal antennas (using Koch or Sierpinski geometries) can receive multiple frequency bands with a single element — your smartphone likely contains one. The formula for a fractal antenna\'s resonant frequencies depends on the fractal\'s iteration level and scaling ratio.',
      advancedContent:
        'The emerging field of biomimetics systematically extracts engineering principles from natural patterns. The Eastgate Centre in Harare, Zimbabwe, uses termite-mound-inspired ventilation (fractal-like air channels) to maintain comfortable temperatures without air conditioning, reducing energy use by 90%. Sharkskin-inspired surfaces with microscopic riblet patterns reduce drag by 8-10% on aircraft and ships. Lotus-leaf-inspired superhydrophobic coatings use hierarchical (fractal-like) micro/nano textures to create self-cleaning surfaces. Each example translates a mathematical pattern in nature into an engineered advantage.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each pattern type to its example in nature',
          pairs: [
            ['Fibonacci sequence', 'Sunflower seed spirals always come in consecutive Fibonacci numbers'],
            ['Tessellation', 'Honeycomb cells tile a surface with no gaps using hexagons'],
            ['Fractal', 'A coastline shows the same jagged shape whether viewed from space or up close'],
            ['Symmetry', 'A butterfly\'s left wing is a mirror image of its right wing'],
          ],
        },
      },
    },
    {
      id: 'fish-migration',
      title: 'Fish Migration — Navigating Rivers and Oceans',
      beginnerContent:
        'Many fish species make incredible journeys — swimming hundreds or thousands of kilometres between where they feed and where they breed. The **hilsa** fish of South Asia swims upstream from the Bay of Bengal into freshwater rivers to spawn. Atlantic salmon cross entire oceans, then return to the exact stream where they were born.\n\n' +
        'How do they navigate? Fish use multiple cues: **smell** (they can detect the unique chemical signature of their home river), **Earth\'s magnetic field** (they have magnetite crystals in their bodies that act like a compass), **water temperature gradients**, and **ocean currents**. It\'s like having GPS, a thermometer, and a nose all working together.\n\n' +
        'Swimming upstream is incredibly hard. Fish must fight against the current, and the energy cost is enormous. The hilsa stops eating during its migration — it runs entirely on stored body fat. A fish that weighs 2 kg at the start of its journey may weigh only 1.2 kg when it arrives. Every gram of fat is fuel.',
      intermediateContent:
        'The physics of fish swimming involves **thrust vs drag**. A fish generates thrust by oscillating its tail (the caudal fin), creating vortices that push water backward. Newton\'s third law: the water pushes the fish forward. The drag force opposes motion and depends on the fish\'s shape, speed, and the fluid\'s viscosity: F_drag = ½ρv²C_dA, where ρ is water density, v is speed, C_d is the drag coefficient, and A is the cross-sectional area.\n\n' +
        'Fish that migrate long distances have evolved streamlined, fusiform body shapes that minimise C_d. The hilsa\'s elongated, laterally compressed body has a drag coefficient around 0.04 — compared to 1.0 for a flat plate. River fish must also contend with turbulent flow. They exploit **Kármán vortex streets** — alternating vortices shed by rocks — to reduce their own energy expenditure by "slaloming" through the wake.',
      advancedContent:
        'Fish navigation involves **true bicoordinate magnetic maps**. Experiments with sea turtles and salmon show they can detect both the **inclination** (dip angle) and **intensity** of Earth\'s magnetic field, which vary predictably with latitude and longitude. This gives them a two-coordinate positioning system analogous to GPS. The sensory mechanism involves chains of magnetite (Fe₃O₄) nanoparticles in the olfactory epithelium, coupled to mechanosensitive ion channels. The signal-to-noise ratio is estimated at 10⁻⁵ Tesla — a thousand times weaker than a refrigerator magnet, yet sufficient for basin-scale navigation.',
    },
    {
      id: 'homing-navigation',
      title: 'Homing Navigation — How Animals Find Their Way Home',
      beginnerContent:
        'Homing pigeons can fly 1,000 kilometres and return to their loft with astonishing accuracy. Monarch butterflies migrate 4,000 km from Canada to a specific forest in Mexico. Sea turtles cross entire oceans and return to the exact beach where they hatched. How?\n\n' +
        'Animals use a combination of navigation tools: **Magnetoreception** — sensing Earth\'s magnetic field using tiny iron-containing crystals in their bodies. **Sun compass** — tracking the sun\'s position (adjusted for time of day using an internal clock). **Star compass** — some birds navigate by star patterns at night. **Olfactory maps** — pigeons can smell their way home using gradients of atmospheric chemicals. **Landmarks** — once close to home, visual memory takes over.\n\n' +
        'Think of it like this: the magnetic field gets you to the right city, the sun compass gets you to the right neighbourhood, smell gets you to the right street, and landmarks get you to your front door.',
      intermediateContent:
        'The **magnetic map hypothesis** proposes that animals encode position using two components of Earth\'s field: **total intensity** (which varies roughly north-south) and **inclination angle** (the angle the field makes with the surface, which also varies geographically). Together, these two values form a bicoordinate grid — like latitude and longitude. Experiments displacing pigeons to unfamiliar locations show they orient homeward within minutes, even when visual and olfactory cues are removed.\n\n' +
        'The **sun compass** requires an internal circadian clock. If you shift a pigeon\'s day-night cycle by 6 hours (keep it in artificial light), then release it — it flies 90° off course. This proves it\'s using the sun\'s position + time to calculate direction. GPS works on a similar principle: triangulating position from signals with known timing.',
      advancedContent:
        'Two competing mechanisms for magnetoreception: (1) **Magnetite-based** — chains of biogenic Fe₃O₄ nanoparticles in the upper beak (pigeons) or ethmoid sinus act as microscopic compass needles, mechanically activating ion channels. (2) **Radical pair mechanism** — the cryptochrome protein in the retina undergoes a light-dependent reaction producing radical pairs whose singlet-triplet interconversion rates are affected by weak magnetic fields. Evidence: birds are disoriented by oscillating RF fields (1-100 MHz) that disrupt radical pair chemistry but not magnetite — suggesting the radical pair mechanism dominates for compass orientation, while magnetite may provide the intensity-based map.',
    },
  ]
};
