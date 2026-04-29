import type { ReferenceGuide } from '../reference';
import { practiceFibonacci, practiceTessellations, practiceFractals, practiceSymmetry } from '../practice-patterns';

export const guide: ReferenceGuide = {
  slug: 'patterns-in-nature',
  title: 'Patterns in Nature',
  category: 'math',
  icon: '🔢',
  tagline: 'Fibonacci spirals, tessellations, fractals, and the hidden math in flowers and honeycombs.',
  relatedStories: ['basket-weavers-song', 'the-magic-japi-hat'],
  understand: [
    // ─────────────────────────────────────────────────────────────
    // 1. Mathematics is the language of nature
    // ─────────────────────────────────────────────────────────────
    {
      title: 'Mathematics Is the Language of Nature',
      beginnerContent:
        '**Tara picks up a sunflower from the garden.** "Look closely," her grandmother had said, "and you will see something strange." Sure enough — the seeds in the dark centre form *spirals*. And not just one set of spirals: two interlocking families, one curving clockwise, one anticlockwise.\n\n' +
        '[diagram:TaraSunflowerDiagram]\n\n' +
        'Tara counts. Twenty-one going one way. Thirty-four going the other. Both come from the same magical sequence — the **Fibonacci numbers** (we\'ll meet them in the next section). She didn\'t plan to find this. The flower didn\'t plan to grow this way. So why is it there?\n\n' +
        '**Why is the universe so mathematical?** Look around: snail shells, pinecones, snowflakes, honeycombs, river deltas, lightning bolts, lung branches, galaxy spirals — all follow precise mathematical patterns. Some highlights:\n\n' +
        '| Pattern in nature | Mathematical structure |\n' +
        '|-------------------|------------------------|\n' +
        '| Sunflower spirals, pinecones | Fibonacci numbers, golden angle |\n' +
        '| Honeycomb cells | Hexagonal tessellation |\n' +
        '| Snail and nautilus shells | Logarithmic (golden) spiral |\n' +
        '| Snowflakes | Six-fold rotational symmetry |\n' +
        '| Fern leaves, river networks | Fractals (self-similar at every scale) |\n' +
        '| Butterfly wings | Bilateral (mirror) symmetry |\n' +
        '| Mud flat cracks, dragonfly wing veins | Voronoi diagrams |\n\n' +
        '**The reason isn\'t magic — it\'s *efficiency*.** Nature doesn\'t "know" maths. But the laws of physics and chemistry penalise waste. A bee that builds with hexagons saves wax. A plant that arranges leaves at the golden angle catches more sunlight per area. A coastline carved by waves repeats the same shape at every scale because the same erosion processes act at every scale. The patterns we *see* are the survivors of countless processes that select for whatever solves the problem with the least material, time, or energy.\n\n' +
        '**Check yourself.** Why is a soap bubble round, not square? *(Surface tension minimises area for a given volume; a sphere is the unique shape that does this. The bubble doesn\'t pick — physics does.)*',
      intermediateContent:
        '**The honeycomb conjecture — proved in 1999.** For thousands of years, people noticed bees built hexagons. Pappus of Alexandria conjectured around 300 CE that hexagons were the most efficient way to partition a plane into equal-area cells. The full proof did not arrive until **Thomas Hales (1999)**.\n\n' +
        '*Statement.* For a region divided into equal-area cells, the regular hexagonal partition has the shortest total perimeter of any partition.\n\n' +
        '*Numerical comparison for area A.*\n\n' +
        '| Cell shape | Perimeter for area A | Excess vs hexagon |\n' +
        '|-----------|---------------------|--------------------|\n' +
        '| Regular hexagon | 3.722 √A | 0% |\n' +
        '| Square | 4.000 √A | +7.4% |\n' +
        '| Equilateral triangle | 4.559 √A | +22.5% |\n' +
        '| Circle (impossible to tile, listed for reference) | 3.545 √A | -4.7% — but circles leave gaps |\n\n' +
        'Why bees converge: 7% less perimeter means 7% less wax. Across thousands of cells in a hive, that\'s significant survival advantage.',
      advancedContent:
        '**D\'Arcy Thompson (1917) — On Growth and Form.** A landmark book arguing biological shapes are the products of *physical forces*, not just heredity. Bones grow in trajectories of stress. Cell walls form along surfaces of constant curvature. Organisms are not designed; they *emerge* from the same equations that govern fluid dynamics, heat flow, and surface tension.\n\n' +
        '**Reaction-diffusion (Turing patterns, 1952).** Alan Turing showed that two interacting chemicals — one **activator**, one **inhibitor** — diffusing at different rates can spontaneously form spots, stripes, and spirals. The minimal equations are:\n\n' +
        '`∂u/∂t = D_u ∇²u + f(u, v)`\n`∂v/∂t = D_v ∇²v + g(u, v)`\n\n' +
        'When `D_v > D_u` (the inhibitor diffuses faster than the activator), uniform states become unstable; the system settles into striped or spotted patterns. Real examples:\n\n' +
        '- Spots on a leopard, stripes on a zebra, lines on an angelfish — different boundary conditions, same equations.\n' +
        '- The Belousov-Zhabotinsky reaction in a petri dish produces chemical spirals indistinguishable from those on a seashell.\n' +
        '- 2017: researchers verified that the spacing of fingerprints, ridges in the mouse palate, and even hair follicles are governed by Turing-like systems.',
      },

    // ─────────────────────────────────────────────────────────────
    // 2. The Fibonacci Sequence
    // ─────────────────────────────────────────────────────────────
    {
      title: 'The Fibonacci Sequence',
      beginnerContent:
        '**Tara walks through the garden, looking at flowers.** Lily — three petals. Buttercup — five. Delphinium — eight. Marigold — thirteen. Daisy — twenty-one. *Why these particular numbers?*\n\n' +
        '[diagram:PetalCountingDiagram]\n\n' +
        '**The rule that builds the sequence.** Start with 0 and 1. Every next number is the sum of the previous two:\n\n' +
        '| Position | Calculation | Value |\n' +
        '|----------|-------------|-------|\n' +
        '| F₁ | given | 0 |\n' +
        '| F₂ | given | 1 |\n' +
        '| F₃ | 0 + 1 | 1 |\n' +
        '| F₄ | 1 + 1 | 2 |\n' +
        '| F₅ | 1 + 2 | 3 |\n' +
        '| F₆ | 2 + 3 | 5 |\n' +
        '| F₇ | 3 + 5 | 8 |\n' +
        '| F₈ | 5 + 8 | 13 |\n' +
        '| F₉ | 8 + 13 | 21 |\n' +
        '| F₁₀ | 13 + 21 | 34 |\n' +
        '| F₁₁ | 21 + 34 | 55 |\n' +
        '| F₁₂ | 34 + 55 | 89 |\n\n' +
        'These numbers — 1, 2, 3, 5, 8, 13, 21, 34, 55 — are exactly the petal counts in Tara\'s garden walk.\n\n' +
        '[diagram:FibonacciSpiralDiagram]\n\n' +
        '**Why does nature pick Fibonacci?** A growing plant adds new leaves, petals, or seeds one at a time. To get maximum sunlight (or growing room) per leaf, each new one should sit *as far away as possible from all existing ones*. Mathematically, this happens when each new addition is rotated by the **golden angle** (~137.5°) from the last — and that angle naturally produces Fibonacci spirals when leaves or seeds pack into a tight head. The flower didn\'t do mathematics. The flowers without efficient packing got out-grown long ago.\n\n' +
        '**Where Fibonacci shows up beyond petals.**\n\n' +
        '| Place | Fibonacci appears as |\n' +
        '|-------|---------------------|\n' +
        '| Sunflower seed head | 21 spirals one way, 34 the other (consecutive Fibonacci) |\n' +
        '| Pinecone | 5 spirals + 8 spirals, or 8 + 13 |\n' +
        '| Pineapple skin | 8 + 13 + 21 spirals (three families) |\n' +
        '| Bamboo branching | Successive node spacings often follow F(n)/F(n+1) ratio |\n' +
        '| Branching of trees | Many species show binary fractal branching with Fibonacci leaf counts at each level |\n' +
        '| Bee family tree | A male bee has 1 parent (mother only); a female has 2; counting back generations gives 1, 2, 3, 5, 8, 13... |\n\n' +
        '**Check yourself.** What\'s F₁₃? *(Add F₁₂ + F₁₁ = 89 + 55 = **144**.)*',
      intermediateContent:
        '**The ratio approaches φ.** Each pair of consecutive Fibonacci numbers gives a ratio that converges to a fixed value:\n\n' +
        '| Ratio | Decimal | |Difference from φ| |\n' +
        '|-------|---------|---------------------|\n' +
        '| 2/1 | 2.000 | 0.382 |\n' +
        '| 3/2 | 1.500 | 0.118 |\n' +
        '| 5/3 | 1.667 | 0.049 |\n' +
        '| 8/5 | 1.600 | 0.018 |\n' +
        '| 13/8 | 1.625 | 0.007 |\n' +
        '| 21/13 | 1.615 | 0.003 |\n' +
        '| 34/21 | 1.619 | 0.001 |\n' +
        '| 55/34 | 1.6176 | 0.0004 |\n' +
        '| 89/55 | 1.61818 | 0.00014 |\n' +
        '| 144/89 | 1.61798 | 0.00006 |\n\n' +
        'The limit is the **golden ratio**, `φ = (1 + √5) / 2 ≈ 1.6180339887...`.\n\n' +
        '**The golden angle and phyllotaxis.** The angle at which new leaves should sprout to maximise spacing is `360° / φ² ≈ 137.5°`. Plants approximate this angle remarkably accurately. Other angles like 90°, 120°, 180° all produce eventual spoke-like overlaps; only an irrational fraction of a turn distributes new positions evenly forever, and φ — being the *most* irrational number (see advanced) — works best.',
      advancedContent:
        '**Binet\'s formula — closed form for Fibonacci.**\n\n' +
        '`F(n) = (φⁿ − ψⁿ) / √5,    where φ = (1+√5)/2, ψ = (1−√5)/2`\n\n' +
        'Computing F(100) directly via iteration takes 99 additions. Binet\'s formula gives it in one expression (modulo floating-point precision). The proof: the sequence satisfies the linear recurrence `F(n) = F(n−1) + F(n−2)`, whose characteristic equation x² = x + 1 has roots φ and ψ. Any solution is a linear combination — Binet\'s constants make F(0) = 0, F(1) = 1.\n\n' +
        '**Why φ is the "most irrational" number.** Continued fraction representation:\n\n' +
        '`φ = 1 + 1/(1 + 1/(1 + 1/(1 + ...)))`\n\n' +
        'All the partial denominators are 1 — the slowest possible convergence. Every other irrational has at least one larger partial denominator, leading to occasional very-good rational approximations. φ has no such "rational shortcuts," which is *exactly* what plants need: a rotation angle that never lands on a previous position.\n\n' +
        '**Pisano period.** F(n) mod m is always eventually periodic. For m = 10, the period is 60. For m = 100, it\'s 300. For prime m, the period divides m − 1 (if 5 is a quadratic residue mod m) or m + 1 (otherwise). This gives a fast way to compute F(n) mod m for huge n.\n\n' +
        '**Zeckendorf\'s theorem.** Every positive integer has a *unique* representation as a sum of non-consecutive Fibonacci numbers. Examples: 30 = 21 + 8 + 1, 100 = 89 + 8 + 3. This is used in efficient encoding (Fibonacci coding) for storing variable-length integers.',
      practice: practiceFibonacci,
    },

    // ─────────────────────────────────────────────────────────────
    // 3. The Golden Ratio and Spirals
    // ─────────────────────────────────────────────────────────────
    {
      title: 'The Golden Ratio and Spirals',
      beginnerContent:
        '**Tara is at the chalkboard.** She draws a small square (side 1). Beside it, another (side 1). Above them, a square of side 2. To the left, side 3. Below, 5. Right, 8. Each new square has its side equal to the *sum* of the two before — the Fibonacci numbers again.\n\n' +
        '[diagram:GoldenSpiralDrawingDiagram]\n\n' +
        'Then she draws a smooth quarter-circle inside each square, connecting them. The result is the **golden spiral** — the shape of a nautilus shell, a hurricane, a galaxy.\n\n' +
        '[diagram:GoldenRatioNatureDiagram]\n\n' +
        '**The golden ratio.** The ratio of consecutive Fibonacci numbers approaches `φ = (1 + √5) / 2 ≈ 1.618`. Equivalently, φ is the only positive number where\n\n' +
        '`a / b = (a + b) / a`\n\n' +
        'i.e., the ratio of the bigger part to the smaller equals the ratio of the whole to the bigger.\n\n' +
        '**The golden spiral grows by φ every quarter turn.** That self-similarity — the fact that zooming in or out gives the same shape — is why these spirals appear at vastly different scales:\n\n' +
        '| Scale | Spiral example |\n' +
        '|-------|---------------|\n' +
        '| Microscopic | DNA (twisted ladder), some protein structures |\n' +
        '| Centimetres | Nautilus shells, snail shells, fern fiddleheads |\n' +
        '| Metres | Sunflower seed heads, japi hat weave patterns |\n' +
        '| Kilometres | Hurricanes (in satellite photos) |\n' +
        '| Light-years | Spiral galaxies (Milky Way, Andromeda) |\n\n' +
        'Same equation, vastly different sizes. That is the power of self-similar geometry.\n\n' +
        '**A note of caution.** The "golden ratio appears everywhere in nature and art" claim is often *exaggerated* in popular books. Most nautilus shells have a growth ratio of about 1.33 per quarter turn, not φ ≈ 1.618. The Parthenon\'s façade is *close* to a golden rectangle but not exactly. Real biology often *approximates* φ rather than nailing it. The mathematical principle is real and beautiful; the religious devotion to seeing φ everywhere is overblown.\n\n' +
        '**Check yourself.** What is φ²? *(Hint: φ² = φ + 1, since a/b = (a+b)/a rearranges to φ² = φ + 1. So φ² ≈ 2.618.)*',
      intermediateContent:
        '**Logarithmic spirals.** A spiral with the equation `r = a · e^(bθ)` (in polar coordinates) keeps the same shape at every size. The golden spiral is the special case where each quarter turn (θ = π/2) multiplies r by φ:\n\n' +
        '`e^(b · π/2) = φ`,  so  `b = 2 ln(φ) / π ≈ 0.3063`\n\n' +
        '**Self-similarity.** Pick any logarithmic spiral. Cut a small piece. Magnify it. The result is geometrically identical to the original. This invariance under scaling is what makes logarithmic spirals so common in growth processes — from ammonite fossils to Romanesco broccoli.\n\n' +
        '**Why other organisms grow in this shape.** A snail building its shell adds new material at the outer edge while keeping the same proportions. A hurricane sucks in air at constant angular rate while the radius grows exponentially. Both processes are mathematically described by `r ∝ e^(bθ)` for some b — leading inevitably to a logarithmic spiral.',
      advancedContent:
        '**φ in continued fractions — the slowest convergent.** φ = [1; 1, 1, 1, ...] (all ones). For any irrational number α, the convergents pₙ/qₙ of its continued fraction satisfy `|α − pₙ/qₙ| < 1/(qₙ qₙ₊₁)`. Larger partial denominators mean better rational approximations; smaller ones (and the smallest is 1) mean the *worst* rational approximations. So φ is the *hardest* number to approximate by fractions — exactly what biology needs for non-repeating leaf placement.\n\n' +
        '**Penrose tilings and quasicrystals.** In 1974, Roger Penrose found two tile shapes (a "kite" and "dart," or two rhombi) that tile the plane only in *aperiodic* patterns — never repeating, but never leaving gaps. These tilings have:\n\n' +
        '- 5-fold rotational symmetry (forbidden in classical crystals!).\n' +
        '- A scaling symmetry related to φ.\n' +
        '- The frequency ratio of the two tile types is exactly φ.\n\n' +
        'In 1982, **Daniel Shechtman** discovered that some metallic alloys have diffraction patterns showing 5-fold symmetry. He was ridiculed for years (Linus Pauling called him "a quasi-scientist"), but his discovery was vindicated and he won the **2011 Nobel Prize in Chemistry**. Quasicrystals are real, exist in nature (a meteorite found in the Koryak Mountains in 2009), and have golden-ratio spacings between atomic planes.',
    },

    // ─────────────────────────────────────────────────────────────
    // 4. Tessellations
    // ─────────────────────────────────────────────────────────────
    {
      title: 'Tessellations — Tiling Without Gaps',
      beginnerContent:
        '**Bipin holds up a small chunk of honeycomb from his uncle\'s apiary.** All hexagons. No squares. No circles. No gaps. Why is *every* honeycomb cell a hexagon, never a triangle, square, or octagon?\n\n' +
        '[diagram:HoneycombHexagonDiagram]\n\n' +
        '**A tessellation is a way to cover a flat surface with shapes — no gaps, no overlaps.** It turns out only **three regular polygons** can tessellate on their own. To see why, look at the *interior angle* of each shape:\n\n' +
        '| Polygon | Interior angle | 360° / angle | Tessellates? |\n' +
        '|---------|----------------|---------------|--------------|\n' +
        '| Equilateral triangle | 60° | 6 | Yes — 6 around each vertex |\n' +
        '| Square | 90° | 4 | Yes — 4 around each vertex |\n' +
        '| Regular pentagon | 108° | 3.33 | **No** — leaves gaps |\n' +
        '| Regular hexagon | 120° | 3 | Yes — 3 around each vertex |\n' +
        '| Regular octagon | 135° | 2.67 | No |\n\n' +
        'The rule: a regular polygon tessellates if and only if `360° / (interior angle)` is a whole number — meaning a whole number of polygons can fit around each vertex.\n\n' +
        '[diagram:TessellationDiagram]\n\n' +
        '**Why hexagons win for honeycomb.** Among the three that tile, the hexagon has the highest area-to-perimeter ratio:\n\n' +
        '| Shape | Perimeter for area A | Material needed |\n' +
        '|-------|---------------------|-----------------|\n' +
        '| Hexagon | 3.72 √A | least |\n' +
        '| Square | 4.00 √A | 7% more |\n' +
        '| Triangle | 4.56 √A | 23% more |\n\n' +
        'For bees, less perimeter = less wax to build = more energy left over. For basalt columns cooling slowly, hexagons crack along lines of equal stress. For bubble rafts pushed together by surface tension, hexagons emerge naturally. **The pattern is everywhere because the optimum is everywhere.**\n\n' +
        '**Where you have seen tessellation.**\n\n' +
        '| Real-world example | Tile shape |\n' +
        '|--------------------|-----------|\n' +
        '| Honeycomb | Hexagons |\n' +
        '| Snake belly scales | Hexagons (approx.) |\n' +
        '| Giant\'s Causeway, Ireland — basalt columns | Hexagons |\n' +
        '| Bathroom floor tiles | Squares (most common) |\n' +
        '| Triangular roof trusses, structural bracing | Triangles (rigid) |\n' +
        '| Assamese bamboo basket weaves | Often hexagonal or triangular |\n\n' +
        '**Check yourself.** Could regular pentagons tile a wall? *(No — 360 ÷ 108 = 3.33, not a whole number, so they leave gaps.)*',
      intermediateContent:
        '**Semi-regular (Archimedean) tessellations** use *more than one* type of regular polygon, with the same arrangement at every vertex. There are exactly **8 distinct semi-regular tessellations**, each named by the polygons meeting at a vertex:\n\n' +
        '| Vertex configuration | Description |\n' +
        '|----------------------|-------------|\n' +
        '| (3,12,12) | A triangle and two 12-gons |\n' +
        '| (3,4,6,4) | Triangle, square, hexagon, square |\n' +
        '| (3,6,3,6) | Alternating triangles and hexagons |\n' +
        '| (3,3,3,3,6) | Four triangles and a hexagon |\n' +
        '| (3,3,3,4,4) | Three triangles and two squares |\n' +
        '| (3,3,4,3,4) | Different triangle/square arrangement |\n' +
        '| (4,6,12) | Square, hexagon, 12-gon |\n' +
        '| (4,8,8) | Square between two octagons |\n\n' +
        'Each requires the angles at every vertex to sum to 360°. (e.g. 3 + 4 + 6 + 4: 60 + 90 + 120 + 90 = 360 ✓.)\n\n' +
        '**Three-dimensional tessellations — space-filling.** Cubes fill space (most obvious). The truncated octahedron is the only Archimedean solid that tiles 3D space alone. The hexagonal prism (a hexagon extended into 3D) is what bees actually build — flat hexagonal cells stacked back-to-back. Lord Kelvin once conjectured the most efficient 3D foam used a particular truncated-octahedron shape — disproved in 1993 by **Weaire and Phelan**, whose better foam structure was used as the architectural inspiration for the Beijing Olympics aquatic centre.',
      advancedContent:
        '**The pentagon problem.** Although *regular* pentagons cannot tile, *irregular* pentagons can. Counting how many distinct convex pentagonal tilings exist took **97 years** to settle.\n\n' +
        '| Year | Discovery |\n' +
        '|------|-----------|\n' +
        '| 1918 | Karl Reinhardt found 5 types |\n' +
        '| 1968 | R. B. Kershner added 3 more (8 total) |\n' +
        '| 1975–1977 | M. Rice and R. James added 5 more (13 total) |\n' +
        '| 1985 | R. Stein added one (14 total) |\n' +
        '| 2015 | Mann, McLoud, von Derau (computer-assisted) — 15th type |\n' +
        '| 2017 | Michaël Rao proved the list is **complete** — no 16th type exists |\n\n' +
        'The 2015 discovery used a brute-force computer search over a parametrised family. The 2017 proof reduced the problem to checking ~371 cases — each verified by computer. A century-old question, finally closed.\n\n' +
        '**Penrose tilings (1974).** Two tile shapes (a "kite" and "dart") tile the plane *aperiodically* — they fill the plane but the pattern never repeats. They have 5-fold symmetry, which classical crystallography forbade. The discovery led directly to the recognition of quasicrystals (see the Golden Ratio section).\n\n' +
        '**The new aperiodic monotile (2023).** For 50 years, the open question was: can a *single* tile shape force aperiodicity? In March 2023, David Smith and three collaborators announced "the hat" — a 13-sided tile that tiles the plane only aperiodically. Months later they refined to "the spectre," which works without requiring reflections. A 50-year problem solved by a hobbyist and three professionals.',
      practice: practiceTessellations,
    },

    // ─────────────────────────────────────────────────────────────
    // 5. Fractals
    // ─────────────────────────────────────────────────────────────
    {
      title: 'Fractals — Infinite Patterns at Every Scale',
      beginnerContent:
        '**Tara picks up a fern.** She holds it close. The leaf is divided into many fronds. Each frond looks just like a tiny version of the whole leaf. She picks one frond and looks closer — it has its own sub-fronds, each looking like a smaller version of *that* frond.\n\n' +
        '[diagram:FernFractalDiagram]\n\n' +
        '**A fractal is a pattern that repeats at every scale.** Zoom in — you see the same shape, smaller. Zoom in again — the same shape, smaller still. Mathematicians call this property **self-similarity**.\n\n' +
        '[diagram:FractalTreeDiagram]\n\n' +
        '**Why are fractals everywhere in nature?** Because many natural processes work the same way at every scale.\n\n' +
        '| Natural fractal | The repeating process |\n' +
        '|-----------------|----------------------|\n' +
        '| River network | Big river splits into tributaries; each tributary splits into smaller streams; same branching rule |\n' +
        '| Coastline | Waves erode at every scale — large bays, small inlets, tiny pebble-edge nooks |\n' +
        '| Tree branches | Trunk → branches → twigs → leaf veins, each splitting in similar proportions |\n' +
        '| Lung airways | Trachea → bronchi → bronchioles → alveoli — 23 levels of branching |\n' +
        '| Lightning | A discharge picks the easiest path; that path itself has branches that pick easier paths, recursively |\n' +
        '| Romanesco broccoli | Each "cone" on the head is itself a smaller cone-shaped head |\n\n' +
        '**The amazing thing.** Natural shapes that look impossibly complex — a coastline, a fern, a network of blood vessels — can be generated by extremely simple rules, applied over and over. *Apply rule. Apply rule to result. Apply rule again. Watch a complicated thing emerge from a tiny seed.*\n\n' +
        '**Check yourself.** Why do lungs use fractal branching? *(More branches = more surface area for gas exchange in the same volume. A fractal lung packs the surface area of half a tennis court into your chest.)*',
      intermediateContent:
        '**The fractal dimension D.** A line is one-dimensional. A square is two-dimensional. A fractal often falls *between* — it\'s "more than a line, less than a surface." The fractal dimension quantifies how completely a fractal fills space.\n\n' +
        '*The basic formula.* If shrinking the pattern by factor s requires N copies to reconstitute the original:\n\n' +
        '`D = log(N) / log(s)`\n\n' +
        '**Examples.**\n\n' +
        '| Fractal | Each iteration | N copies | Scale s | D |\n' +
        '|---------|----------------|----------|---------|---|\n' +
        '| Line segment | bisect | 2 | 2 | 1.000 |\n' +
        '| Square | quarter | 4 | 2 | 2.000 |\n' +
        '| Koch snowflake edge | each segment → 4 segments at 1/3 length | 4 | 3 | log 4 / log 3 ≈ **1.262** |\n' +
        '| Sierpinski triangle | each triangle → 3 triangles at 1/2 size | 3 | 2 | log 3 / log 2 ≈ **1.585** |\n' +
        '| Cantor set | each segment → 2 at 1/3 length | 2 | 3 | log 2 / log 3 ≈ **0.631** |\n\n' +
        '**Britain\'s coastline has D ≈ 1.25.** It is more than a smooth line (D=1) but far from filling a 2D area. This was Mandelbrot\'s 1967 paper, "How long is the coast of Britain?" — the answer is "it depends on your ruler size, and the dependence is fractal."',
      advancedContent:
        '**The Mandelbrot set.** Define a sequence in the complex plane: `z₀ = 0`, `zₙ₊₁ = zₙ² + c`, where c is a complex number. The Mandelbrot set is the set of c values for which this sequence stays *bounded* (doesn\'t escape to infinity).\n\n' +
        'The boundary of the Mandelbrot set has **fractal dimension exactly 2** — it is so convoluted it fills any 2D neighbourhood it touches. Its boundary contains infinite detail at every magnification. Some discoveries:\n\n' +
        '- The set is *connected* (Douady & Hubbard, 1985) — there is a single piece, no islands.\n' +
        '- A point c is in the Mandelbrot set if and only if the corresponding **Julia set** (defined by the same recursion with c fixed) is connected.\n' +
        '- The set\'s boundary contains miniature copies of itself, infinitely deep, at every position.\n\n' +
        '**Real-world fractal applications.**\n\n' +
        '| Application | Use of fractal geometry |\n' +
        '|-------------|-------------------------|\n' +
        '| JPEG2000 image compression | Wavelet-based; decomposes images into self-similar components, achieves better compression than JPEG |\n' +
        '| Phone antennas | Fractal antennas (Koch, Sierpinski) receive multiple frequency bands with one element — used in mobile phones for cellular, Wi-Fi, GPS |\n' +
        '| CGI mountains and terrain | Diamond-square algorithm generates fractal landscapes used in games and films |\n' +
        '| Cancer detection | Tumour boundaries have higher fractal dimension than healthy tissue; used in MRI analysis |\n' +
        '| Stock market analysis | Price movements show fractal scaling; Mandelbrot\'s "multifractal" model fits returns better than Gaussian |\n' +
        '| Heart rate variability | A healthy heart shows fractal-like rhythm fluctuations; loss of fractal scaling is a marker of cardiac disease |\n\n' +
        '**Heisenberg uncertainty meets fractals.** A signal compressed in time is spread out in frequency, and vice versa. Wavelet transforms — a multi-resolution fractal-style decomposition — give the right tradeoff for non-stationary signals (speech, ECG, seismic), beating both pure time and pure frequency views.',
      practice: practiceFractals,
    },

    // ─────────────────────────────────────────────────────────────
    // 6. Symmetry
    // ─────────────────────────────────────────────────────────────
    {
      title: 'Symmetry in Biology',
      beginnerContent:
        '**Tara holds up a butterfly with paper wings she folded last week.** She drew the right wing first, then folded the paper down the middle and traced the same shape on the left. *Mirror symmetry*. Beside her on the desk: a starfish she found at the beach. It has *no* mirror axis — but it looks the same after a fifth-turn rotation. Different kind of symmetry.\n\n' +
        '[diagram:ButterflySymmetryDiagram]\n\n' +
        '**Two main kinds of symmetry in living things.**\n\n' +
        '| Type | Description | Examples |\n' +
        '|------|-------------|----------|\n' +
        '| **Bilateral** (mirror) | One mirror axis; left and right halves are reflections | Butterflies, fish, mammals, your face (almost) |\n' +
        '| **Radial** | Looks the same after rotating around a centre | Starfish (5-fold), flowers, jellyfish, sea anemones |\n\n' +
        '[diagram:SymmetryDiagram]\n\n' +
        '**Why bilateral for moving creatures?** Animals that move forward — fish, birds, mammals — almost always have bilateral symmetry. Two eyes balanced for depth perception. Two ears for sound localisation. A balanced left and right side for stable locomotion. Evolution favours mirror symmetry when the front-back axis is meaningful.\n\n' +
        '**Why radial for sit-and-wait creatures?** Animals that sit still — sea anemones, jellyfish, starfish — face threats and food from all directions. Radial symmetry means there is no "wrong" angle to be approached from. Plants are similar: a flower needs to attract pollinators from any angle, so flower petals usually radiate from a centre.\n\n' +
        '**At the molecular and atomic level, symmetry rules.**\n\n' +
        '| Structure | Symmetry |\n' +
        '|-----------|----------|\n' +
        '| Snowflake | 6-fold — every snowflake has 6 arms because of how water molecules bond at 120° angles |\n' +
        '| Salt crystal | Cubic — sodium and chloride ions alternate in a cube |\n' +
        '| DNA double helix | 2-fold rotational along its length |\n' +
        '| Virus capsids | Often icosahedral — 20 triangular faces, the most efficient closed shell |\n' +
        '| Soap bubble cluster | 120° angles where three films meet — the most stable arrangement |\n\n' +
        '**Check yourself.** A snowflake always has six arms. Why never five or seven? *(Water molecules are V-shaped, with hydrogen bonds at ~109° angles. Ice crystals form a hexagonal lattice — that\'s baked into the chemistry, not a choice.)*',
      intermediateContent:
        '**Symmetry as a mathematical group.** In maths, the set of all transformations that leave a shape unchanged form a *group* — an algebraic structure with a composition operation, an identity, and inverses.\n\n' +
        '| Object | Symmetry group | # of operations |\n' +
        '|--------|----------------|------------------|\n' +
        '| A non-symmetric shape | Trivial group {identity} | 1 |\n' +
        '| Bilateral (e.g., butterfly) | Z₂ = {identity, reflection} | 2 |\n' +
        '| Equilateral triangle | D₃ = 3 rotations + 3 reflections | 6 |\n' +
        '| Square | D₄ = 4 rotations + 4 reflections | 8 |\n' +
        '| Regular hexagon (snowflake) | D₆ | 12 |\n' +
        '| Starfish | D₅ = 5 rotations + 5 reflections | 10 |\n' +
        '| Circle | O(2) — continuous group | infinite |\n\n' +
        '**Chirality — the broken symmetry of life.** Your hands are mirror images. They are *not* the same — you can\'t superimpose left over right. Chemists call this property *chirality* (from Greek for "hand"). Many biological molecules are chiral. Crucially, life on Earth uses only one of each pair:\n\n' +
        '- Amino acids are (almost always) **left-handed** (L-form).\n' +
        '- Sugars in DNA are (almost always) **right-handed** (D-form).\n\n' +
        'The right-handed thalidomide molecule was a sedative; its mirror image caused severe birth defects. Pharmacologists now have to keep careful track of which "hand" of each drug they\'re making — a profound symmetry consequence.',
      advancedContent:
        '**Noether\'s theorem (1918) — symmetry is conservation.** Emmy Noether proved that every continuous symmetry of the laws of physics corresponds to a conservation law:\n\n' +
        '| Symmetry of physical law | Conserved quantity |\n' +
        '|---------------------------|--------------------|\n' +
        '| Translation in time (laws don\'t change tomorrow) | Energy |\n' +
        '| Translation in space (laws are the same here and there) | Linear momentum |\n' +
        '| Rotation in space (no preferred direction) | Angular momentum |\n' +
        '| Internal phase (gauge) symmetry | Electric charge |\n\n' +
        'This is one of the deepest insights in physics. Conservation of energy is *the same statement* as the time-invariance of physical law. A theorem about abstract symmetry maps directly onto every physical conservation law we know.\n\n' +
        '**The Standard Model symmetry group.** All known fundamental forces (except gravity) emerge from the gauge group **SU(3) × SU(2) × U(1)**. Each factor is a continuous symmetry; each generates a force:\n\n' +
        '| Group | Force | Bosons |\n' +
        '|-------|-------|--------|\n' +
        '| SU(3) | Strong force | 8 gluons |\n' +
        '| SU(2) | Weak force | W±, Z |\n' +
        '| U(1) | Electromagnetic | photon |\n\n' +
        '**Symmetry breaking.** Many systems have governing equations with high symmetry but *settle* into states with lower symmetry. A pencil balanced on its tip has rotational symmetry; once it falls, that symmetry is broken. The Higgs mechanism is exactly this — the universe\'s ground state breaks an SU(2) symmetry, giving particles mass. Without that broken symmetry, every particle would be massless and neither atoms nor stars would form.',
      practice: practiceSymmetry,
    },

    // ─────────────────────────────────────────────────────────────
    // 7. Voronoi (kept lighter — already in advanced territory)
    // ─────────────────────────────────────────────────────────────
    {
      title: 'Voronoi Patterns and Efficiency',
      beginnerContent:
        '**Look at the cracks in dried mud.** They form polygons that look almost honeycomb-like, but more irregular. Look at a giraffe\'s spotted coat. Look at a dragonfly wing. All of these show **Voronoi patterns** — the natural geometry of "every point belongs to its nearest neighbour."\n\n' +
        '**The recipe for a Voronoi diagram.**\n\n' +
        '| Step | What to do |\n' +
        '|------|-----------|\n' +
        '| 1 | Sprinkle some dots ("seeds") on a flat surface — could be drying mud cracks, pigment cells in a developing giraffe, water pumps in a town |\n' +
        '| 2 | For every point on the surface, find which seed it is *closest* to |\n' +
        '| 3 | Group all points that share the same nearest seed into one cell |\n' +
        '| 4 | The boundaries between cells form the Voronoi diagram |\n\n' +
        'Each cell contains everywhere that\'s closest to one particular seed. The boundaries are equidistant from neighbouring seeds.\n\n' +
        '**Why nature finds Voronoi patterns.**\n\n' +
        '| Phenomenon | The "seeds" | The "competition" |\n' +
        '|-----------|--------------|--------------------|\n' +
        '| Giraffe spots | Pigment-producing cells | Pigment spreads outward; meeting another\'s pigment forms a boundary |\n' +
        '| Mud cracks | Initial weak points where drying tension peaks | Crack propagates from each weak point; cracks meet in straight lines |\n' +
        '| Foam bubbles | Bubble centres | Surface tension pulls each film toward the nearest "spine" |\n' +
        '| Dragonfly wing veins | Mechanical stress concentrators | Veins form along stress-equidistant lines |\n' +
        '| City service areas | Hospitals, fire stations | Each home is served by its nearest one |\n\n' +
        '**A historical case.** In 1854, Dr. **John Snow** mapped cholera deaths in London\'s Soho district. He plotted each death as a dot, and water pumps as bigger dots. The deaths clustered around the Broad Street pump — what we\'d now call its Voronoi cell. Snow had the pump handle removed; the outbreak ended. This was the foundation of epidemiology, and it was a Voronoi diagram in everything but the name.',
      intermediateContent:
        '**Constructing a Voronoi diagram.** Given n seed points, draw the perpendicular bisector between every pair of *adjacent* seeds. The cell around each seed is bounded by these bisectors. By Euler\'s formula, an n-seed Voronoi diagram has at most 2n − 5 vertices and 3n − 6 edges.\n\n' +
        '**The Delaunay triangulation — Voronoi\'s twin.** Connect each pair of seeds whose Voronoi cells share an edge. The resulting triangulation has the property of *maximising the minimum angle* — it avoids needle-thin triangles. This makes it the gold standard for finite-element meshes in engineering simulations: better-conditioned numerics, faster convergence.\n\n' +
        '**Fortune\'s sweep-line algorithm (1986).** Computes the Voronoi diagram of n points in O(n log n) time — provably optimal. The trick: imagine sweeping a horizontal line from top to bottom. The boundary of the "completed" region (closer to a known seed than to the sweep line) is a parabola arc; as the sweep line moves, arcs appear, grow, and merge. The events form a discrete sequence handled by a priority queue.',
      advancedContent:
        '**Generalised Voronoi diagrams** drop the "Euclidean distance" assumption.\n\n' +
        '| Variant | Distance metric | Application |\n' +
        '|---------|-----------------|-------------|\n' +
        '| Manhattan Voronoi | |Δx| + |Δy| | Routing on a grid (city blocks, circuit boards) |\n' +
        '| Weighted Voronoi | weighted Euclidean | Cells with bigger seeds (more nutrients, more population) take more space |\n' +
        '| Power diagram | (distance² − weight) | Computational geometry for sphere packing |\n' +
        '| Apollonius diagram | distance / radius | Cells around objects of different sizes |\n' +
        '| Minkowski Voronoi | non-isotropic metric | Anisotropic crystal growth, ocean currents |\n\n' +
        '**Voronoi in robotics.** A *generalised Voronoi diagram* drawn around obstacles gives the path *equidistant* from all obstacles — the safest route through cluttered space. Robot path-planners use this to navigate warehouses, factories, and (in a recent twist) Mars rover terrain.\n\n' +
        '**Voronoi in cosmology.** Galaxy distribution in the universe is mapped by Voronoi tessellation. Each galaxy seeds a cell; the cell volumes describe the local density. Voids (large empty regions) appear as oversized cells; clusters as networks of small ones. This is the basis for the *cosmic web* visualisations.',
    },

    // ─────────────────────────────────────────────────────────────
    // 8. Why Patterns Matter
    // ─────────────────────────────────────────────────────────────
    {
      title: 'Why Patterns Matter',
      beginnerContent:
        '**The same spiral on a galaxy and a snail isn\'t a coincidence — it\'s a deep clue.** Whenever the same pattern shows up in totally different places, it tells you the same mathematical principle is at work. Understanding patterns connects subjects that schools usually teach as separate: maths, biology, physics, engineering, art.\n\n' +
        '**Patterns turning into engineering.** Engineers steal nature\'s solutions all the time. The field has a name: **biomimetics**.\n\n' +
        '| Natural pattern | Engineering use |\n' +
        '|-----------------|-----------------|\n' +
        '| Sunflower phyllotaxis | Solar farms with golden-angle layouts boost capture by 20–50% |\n' +
        '| Termite mound ventilation (fractal channels) | Buildings (Eastgate Centre, Harare) cooled with 90% less energy |\n' +
        '| Sharkskin riblets | Aircraft and ship hulls with 8–10% drag reduction |\n' +
        '| Lotus-leaf nanostructure | Self-cleaning paint, water-repellent fabrics |\n' +
        '| Honeycomb hexagons | Airplane wing cores, cardboard packaging — high strength, low weight |\n' +
        '| Fractal antennas | Multi-band radios, your smartphone, satellites |\n' +
        '| Burdock burrs | Velcro (1948, Mestral) |\n' +
        '| Geckos\' microscopic foot hairs | Adhesives that stick without glue, used in robot grippers |\n\n' +
        '**Why the same patterns recur — physics, not magic.**\n\n' +
        '| Pattern | The underlying physics |\n' +
        '|---------|-------------------------|\n' +
        '| Hexagons | Minimal-perimeter packing under uniform pressure |\n' +
        '| Fibonacci spacing | Most-irrational rotation = least overlap = best spacing |\n' +
        '| Logarithmic spirals | Constant-shape growth = exponential radius |\n' +
        '| Fractals | Same erosion / branching process at every scale |\n' +
        '| Bilateral symmetry | Selection pressure for forward-moving organisms |\n' +
        '| Voronoi | Nearest-neighbour competition for finite resources |\n\n' +
        '**Check yourself.** Why might a city planner use Voronoi diagrams? *(To assign each home to its nearest fire station / hospital / school / metro stop, optimising service area.)*',
      intermediateContent:
        '**Solar phyllotaxis — sunflower-inspired layouts.** A flat array of solar cells faces only one sun direction. A *golden-angle* arrangement on a curved or 3D surface mimics a sunflower head, ensuring no cell permanently shadows another as the sun moves through the sky.\n\n' +
        '*Real result.* The Aora Solar concentrator in Israel uses golden-angle reflector arrangements; concentrator-photovoltaic prototypes show 20–50% more energy capture than flat arrays of the same area. The maths is the same as for a sunflower.\n\n' +
        '**Fractal antennas — multi-band reception.** Antenna length is normally tied to the wavelength being received. A fractal antenna, with self-similar structure at multiple scales, *naturally* resonates at multiple wavelengths. A Sierpinski-triangle antenna receives every band whose wavelength matches one of its iteration scales. Modern phones use a Hilbert-curve or Koch-curve antenna to handle 4G, 5G, Wi-Fi, GPS, Bluetooth — all from one element.',
      advancedContent:
        '**Eastgate Centre, Harare — termite-mound architecture.** Architect Mick Pearce designed this 1996 office block using an HVAC system inspired by **Macrotermes michaelseni** termite mounds. Termites maintain ~31°C inside their mounds despite outside swings of 0–40°C, by:\n\n' +
        '1. A network of fractal-like ventilation chimneys.\n' +
        '2. Lateral channels that create temperature-driven convection (warm air rises out, drawing cool air in).\n' +
        '3. Active opening/closing of vents (in termites, by workers; in the building, by automated dampers).\n\n' +
        'Eastgate uses *no air conditioning*. Energy use is 90% lower than comparable buildings. Construction cost was 10% less because no chillers were needed.\n\n' +
        '**Sharkskin riblets — drag reduction.** A shark\'s skin is covered in tiny grooved scales (denticles), aligned along the direction of swimming, with a riblet height of ~30 μm. The riblets:\n\n' +
        '- Reduce skin friction by 8–10% (counterintuitive — they *add* surface area but reduce overall drag).\n' +
        '- Disrupt cross-flow vortices in the turbulent boundary layer.\n' +
        '- Prevent biofouling (bacteria and barnacles can\'t settle in the grooves).\n\n' +
        'Speedo\'s "Fastskin" swimsuits banned in 2010 used this principle. Aircraft skin coatings inspired by sharks reduce fuel use by 1–2% on long flights, saving tens of thousands of tonnes of CO₂ annually.',
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

    // ─────────────────────────────────────────────────────────────
    // 9 & 10: Animal navigation sections — keep as-is (existing depth)
    // ─────────────────────────────────────────────────────────────
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
  ],
};
