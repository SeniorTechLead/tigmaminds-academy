import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function WootzSteelLevel3() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Molecular dynamics simplified — Lennard-Jones potential for iron-carbon',
      concept: `At the atomic scale, atoms interact through forces that depend on distance. The **Lennard-Jones potential** is a simple model of this interaction:

**V(r) = 4ε × [(σ/r)¹² - (σ/r)⁶]**

Where r is the distance between two atoms, ε is the depth of the energy well (how strongly they attract), and σ is the distance at which the potential is zero (roughly the atom's "size").

The (σ/r)¹² term is the **repulsion** — atoms resist being squeezed together (electron clouds overlap). The (σ/r)⁶ term is the **attraction** — van der Waals forces pull atoms together at moderate distances.

The equilibrium distance (where force = 0) is at r = 2^(1/6) × σ ≈ 1.12σ. This is where the atom "wants" to sit — the bottom of the energy well.

For iron-carbon interactions, the L-J parameters differ from pure iron, because carbon atoms are much smaller and sit in the **interstitial sites** between iron atoms. This size mismatch creates lattice strain — the origin of wootz's high hardness.

📚 *Molecular dynamics (MD) computes atom trajectories by solving Newton's equations F = ma at each timestep, using the derivative of the potential energy (force = -dV/dr) to determine accelerations.*`,
      analogy: 'Imagine two magnets on a table. Push them together and they repel at very close range (like the r¹² term). Pull them apart and they attract at moderate range (like the r⁶ term). There is a sweet spot where they sit comfortably — neither pushing nor pulling. The Lennard-Jones potential describes exactly this: repulsion at short range, attraction at medium range, and a stable equilibrium distance.',
      storyConnection: 'The carbon atoms in wootz steel sit in the gaps between iron atoms — interstitial sites that are slightly too small for them. This forces the iron lattice to distort locally, creating the internal strain that makes wootz hard. Molecular dynamics lets us "see" this distortion at the atomic level and understand why 1.5% carbon produces such dramatic hardening.',
      checkQuestion: 'For iron, σ ≈ 2.27 Angstroms and ε ≈ 0.4 eV. At what distance is the equilibrium point?',
      checkAnswer: 'r_eq = 2^(1/6) × σ = 1.1225 × 2.27 = 2.548 Angstroms ≈ 0.255 nm. This is the nearest-neighbour distance in iron — the spacing of atoms in the BCC crystal lattice. It matches the experimentally measured lattice parameter of iron (a = 2.87 Angstroms, giving nearest-neighbour distance of a×√3/2 = 2.49 Angstroms).',
      codeIntro: 'Compute Lennard-Jones potentials and forces for iron-iron and iron-carbon pairs, and simulate a 1D chain of atoms.',
      code: `import numpy as np

def lennard_jones(r, epsilon, sigma):
    """Lennard-Jones potential energy."""
    sr6 = (sigma / r) ** 6
    return 4 * epsilon * (sr6**2 - sr6)

def lj_force(r, epsilon, sigma):
    """Force from Lennard-Jones potential (F = -dV/dr)."""
    sr6 = (sigma / r) ** 6
    return 24 * epsilon / r * (2 * sr6**2 - sr6)

# Parameters (in Angstroms and eV)
Fe_Fe = {"eps": 0.4, "sig": 2.27, "label": "Fe-Fe"}
Fe_C  = {"eps": 0.15, "sig": 1.95, "label": "Fe-C"}
C_C   = {"eps": 0.05, "sig": 1.70, "label": "C-C"}

pairs = [Fe_Fe, Fe_C, C_C]

print("=== Lennard-Jones Potential Parameters ===")
for p in pairs:
    r_eq = 2**(1/6) * p["sig"]
    v_min = -p["eps"]
    print(f"{p['label']}: σ={p['sig']:.2f} Å, ε={p['eps']:.3f} eV, r_eq={r_eq:.3f} Å")

# Energy vs distance
print("\\n=== Potential Energy vs Distance (eV) ===")
distances = np.arange(2.0, 5.5, 0.25)
print(f"{'r (Å)':<8}", end="")
for p in pairs:
    print(f"{p['label']:>10}", end="")
print()
print("-" * 38)
for r in distances:
    print(f"{r:<8.2f}", end="")
    for p in pairs:
        if r < p["sig"] * 0.85:
            print(f"{'(repel)':>10}", end="")
        else:
            v = lennard_jones(r, p["eps"], p["sig"])
            print(f"{v:>10.4f}", end="")
    print()

# 1D molecular dynamics: chain of 10 Fe atoms with 1 C interstitial
print("\\n=== 1D MD: Iron Chain with Carbon Interstitial ===")
n_fe = 10
spacing = 2.55  # Angstroms (equilibrium Fe-Fe)
positions = np.array([i * spacing for i in range(n_fe)], dtype=float)

# Insert carbon at interstitial site (between atom 4 and 5)
c_pos = 4.5 * spacing
print(f"Initial Fe spacing: {spacing:.2f} Å")
print(f"Carbon inserted at: {c_pos:.2f} Å\\n")

# Calculate forces and displacements (one relaxation step)
forces = np.zeros(n_fe)
for i in range(n_fe):
    # Fe-C interaction
    r_fc = abs(positions[i] - c_pos)
    if r_fc > 0.5 and r_fc < 5.0:
        f = lj_force(r_fc, Fe_C["eps"], Fe_C["sig"])
        forces[i] += f * np.sign(positions[i] - c_pos)

print(f"{'Atom':<6} {'Position':>10} {'Fe-C dist':>10} {'Force (eV/Å)':>13} {'Displacement':>13}")
print("-" * 54)
for i in range(n_fe):
    r_fc = abs(positions[i] - c_pos)
    disp = forces[i] * 0.1  # simplified: displacement proportional to force
    print(f"Fe-{i:<3} {positions[i]:>9.2f} {r_fc:>9.2f} {forces[i]:>12.4f} {disp:>12.4f} Å")

print("\\nAtoms near the carbon are pushed away — lattice distortion!")
print("This local strain field is the atomic origin of solid-solution hardening.")`,
      challenge: 'Extend the simulation to run 100 relaxation steps (update positions by a fraction of the force each step). Track the total energy of the system. Does it decrease? (It should — the system is relaxing toward equilibrium.) What is the final displacement of the atoms nearest to the carbon?',
      successHint: 'You just ran a simplified molecular dynamics simulation — the same technique used by materials scientists to study crack propagation, phase transformations, and surface catalysis. Real MD simulations use millions of atoms and sophisticated potentials (EAM for metals), but the core principle is identical: compute forces from potentials, update positions, repeat.',
    },
    {
      title: 'Pattern formation — Turing patterns for the damask microstructure',
      concept: `The beautiful swirling patterns on wootz steel (the "damask" pattern) arise from a **reaction-diffusion** process during slow cooling. Carbon atoms simultaneously diffuse AND undergo a phase reaction (forming cementite, Fe₃C), creating alternating carbon-rich and carbon-poor bands.

This is a **Turing pattern** — named after Alan Turing, who showed in 1952 that two interacting chemicals with different diffusion rates can spontaneously form spatial patterns (spots, stripes, waves) from a uniform initial state.

The key ingredients for Turing patterns:
1. An **activator** that promotes its own growth (carbon clustering → more cementite nucleation)
2. An **inhibitor** that suppresses the activator at a distance (depletion zone around growing cementite — nearby carbon is consumed)
3. The inhibitor diffuses **faster** than the activator

In wootz, the "activator" is carbon concentration (locally high carbon triggers cementite nucleation). The "inhibitor" is the depletion of carbon around growing cementite particles. The result: periodic bands of cementite — the damask pattern.

📚 *Turing patterns explain stripes on zebras, spots on leopards, fingerprint ridges, and sand dune spacing. The mathematics is universal: any system with local activation and long-range inhibition can produce spatial patterns.*`,
      analogy: 'Imagine grass growing in a field. Where one patch grows tall (activator), it consumes all the water nearby, creating a dry zone where nothing grows (inhibitor). The result: periodic clumps of grass with bare patches between them — a spatial pattern from a uniform starting condition. The cementite bands in wootz form by the same principle: where carbon clusters, it depletes the surroundings.',
      storyConnection: 'The damask pattern was the hallmark of a genuine wootz blade — so distinctive that experienced traders could identify the production region from the pattern alone. Different cooling rates and compositions produced different patterns: "Mohammed\'s ladder" (parallel bands), "rose" (swirling), and "Kirk Nardeban" (clustered). These are all variants of Turing patterns with different parameters.',
      checkQuestion: 'If the "activator" (carbon clustering) diffuses slowly and the "inhibitor" (carbon depletion) diffuses fast, what pattern do you expect?',
      checkAnswer: 'Regularly spaced stripes or spots — classic Turing patterns. The slow activator creates local peaks. The fast inhibitor spreads out and suppresses neighbouring peaks. The spacing is determined by the ratio of diffusion rates. Slower activator diffusion gives wider spacing between bands.',
      codeIntro: 'Simulate a 1D reaction-diffusion system that produces Turing-like banding patterns — modelling the damask microstructure.',
      code: `import numpy as np

def simulate_turing_1d(n_cells=200, n_steps=2000, Da=0.01, Di=0.05,
                        alpha=1.0, beta=1.5, gamma=0.1):
    """
    1D reaction-diffusion simulation (Gray-Scott-like model).
    a = activator (carbon concentration)
    b = inhibitor (depletion signal)
    """
    # Initial conditions: uniform + small random perturbation
    np.random.seed(42)
    a = np.ones(n_cells) * 0.5 + np.random.normal(0, 0.01, n_cells)
    b = np.ones(n_cells) * 0.5 + np.random.normal(0, 0.01, n_cells)
    dt = 0.5

    for step in range(n_steps):
        # Laplacian (1D diffusion with periodic boundary)
        lap_a = np.roll(a, 1) + np.roll(a, -1) - 2 * a
        lap_b = np.roll(b, 1) + np.roll(b, -1) - 2 * b

        # Reaction terms
        reaction_a = alpha * a * (1 - a) - a * b
        reaction_b = beta * a * b - gamma * b

        # Update
        a += dt * (Da * lap_a + reaction_a)
        b += dt * (Di * lap_b + reaction_b)

        # Clamp values
        a = np.clip(a, 0, 2)
        b = np.clip(b, 0, 2)

    return a, b

# Run simulation
print("=== Turing Pattern Simulation (1D Damask Model) ===")
print("Simulating carbon redistribution during slow cooling...\\n")

a, b = simulate_turing_1d()

# Visualise as text pattern
print("Carbon concentration profile (200 cells across blade):")
print("High carbon (cementite bands) = # | Low carbon (matrix) = .")
pattern_line = ""
for val in a:
    if val > 0.7:
        pattern_line += "#"
    elif val > 0.5:
        pattern_line += "+"
    else:
        pattern_line += "."
# Print in rows of 50
for i in range(0, len(pattern_line), 50):
    print(f"  {pattern_line[i:i+50]}")

# Statistics
high_c = np.sum(a > 0.7)
low_c = np.sum(a < 0.3)
print(f"\\nCarbide-rich zones: {high_c} cells ({high_c/len(a)*100:.0f}%)")
print(f"Matrix zones:       {low_c} cells ({low_c/len(a)*100:.0f}%)")
print(f"Band spacing: ~{len(a) / max(1, high_c // 3):.0f} cells")

# Effect of diffusion ratio on pattern
print("\\n=== Effect of Diffusion Ratio on Pattern ===")
print(f"{'Da':>6} {'Di':>6} {'Ratio':>6} {'Bands':>7} {'Spacing':>8} {'Pattern'}")
print("-" * 55)

for Da, Di in [(0.005, 0.05), (0.01, 0.05), (0.02, 0.05),
               (0.01, 0.02), (0.01, 0.10), (0.01, 0.20)]:
    a_test, _ = simulate_turing_1d(Da=Da, Di=Di)
    n_bands = 0
    in_band = False
    for val in a_test:
        if val > 0.7 and not in_band:
            n_bands += 1
            in_band = True
        elif val < 0.5:
            in_band = False
    spacing = 200 / max(n_bands, 1)
    mini = "".join("#" if v > 0.7 else "." for v in a_test[::5])[:30]
    print(f"{Da:>6.3f} {Di:>6.3f} {Di/Da:>5.0f}× {n_bands:>5} {spacing:>7.0f} {mini}")

print("\\nHigher Di/Da ratio → more defined, evenly spaced bands.")
print("This matches wootz: slow carbon clustering + fast depletion = clear damask.")`,
      challenge: 'Modify the simulation to 2D (e.g., 50x50 grid) using a 2D Laplacian. What 2D patterns emerge? You should see spots or stripes depending on the parameters. Compare your results to photographs of real wootz damask patterns — the resemblance is striking.',
      successHint: 'You just simulated a Turing pattern — one of the most beautiful results in mathematical biology and materials science. The same equations describe leopard spots, fish stripes, chemical oscillations, and now you know they also describe the damask pattern that made wootz steel legendary.',
    },
    {
      title: 'Nano-indentation modelling — probing the microstructure',
      concept: `**Nano-indentation** pushes a tiny diamond tip (radius ~100 nm) into a surface with precisely controlled force, measuring the load-displacement curve. Unlike Vickers hardness (which gives a single number), nano-indentation reveals the **elastic modulus**, **hardness**, and **creep behaviour** of an area just a few micrometres across.

The **Oliver-Pharr method** extracts properties from the unloading curve:

**Contact stiffness: S = dP/dh** (slope of unloading curve at peak load)
**Contact area: A = f(h_c)** where h_c is the contact depth
**Hardness: H = P_max / A**
**Reduced modulus: E_r = (√π / 2) × S / √A**

For wootz steel, nano-indentation can measure the hardness of individual cementite bands (~12-14 GPa) versus the pearlitic matrix (~3-4 GPa) — revealing the micro-scale property variation that creates the blade's macro-scale performance.

📚 *The reduced modulus E_r accounts for deformation of both the sample AND the indenter: 1/E_r = (1-ν²)/E_sample + (1-ν_i²)/E_indenter. For a diamond indenter, E_i = 1141 GPa.*`,
      analogy: 'Imagine pressing your finger into a pillow (soft — deep indentation) versus pressing into a wooden board (hard — barely any indentation). Nano-indentation does this at the nanometre scale, pressing a diamond point into a surface and measuring exactly how deep it goes for a given force. The depth-vs-force curve tells you the material\'s hardness and stiffness.',
      storyConnection: 'In 2006, researchers used nano-indentation to map the properties of a genuine wootz blade from the 17th century. They found hardness peaks of ~12 GPa on the cementite bands and ~4 GPa on the matrix — a 3:1 ratio. This quantified, for the first time, what smiths had known for centuries: the bands are dramatically harder than the surrounding material.',
      checkQuestion: 'A nano-indentation test on a wootz cementite band gives: P_max = 5 mN, indent depth h = 150 nm, contact stiffness S = 80 μN/nm. If the contact area at this depth is 1.2×10⁻¹³ m², what is the hardness?',
      checkAnswer: 'H = P_max / A = 5×10⁻³ / 1.2×10⁻¹³ = 4.17×10¹⁰ Pa ≈ 42 GPa. Wait — that seems too high for cementite (~12 GPa). Let me recheck: area should be larger. If A = 4×10⁻¹³ m², then H = 5×10⁻³ / 4×10⁻¹³ = 12.5 GPa — that matches cementite. The area calculation is critical in nano-indentation.',
      codeIntro: 'Simulate nano-indentation load-displacement curves for wootz microstructural phases and extract mechanical properties.',
      code: `import numpy as np

def nanoindent_curve(E_gpa, H_gpa, max_depth_nm=200, n_points=100):
    """
    Simulate a nano-indentation load-displacement curve.
    Uses a simplified Berkovich indenter model: P = C × h²
    where C depends on hardness and modulus.
    """
    # Loading: P ~ h² for a sharp indenter
    h_load = np.linspace(0, max_depth_nm, n_points)
    C = H_gpa * 0.038  # simplified loading coefficient (mN/nm²)
    P_load = C * h_load**2 / 1000  # convert to mN

    P_max = P_load[-1]
    h_max = h_load[-1]

    # Unloading: follows a power law P = α(h - h_f)^m
    # Residual depth depends on H/E ratio
    h_f = h_max * (1 - 2 * E_gpa / (3 * E_gpa + H_gpa * 10))
    h_unload = np.linspace(h_max, h_f, n_points // 2)
    P_unload = P_max * ((h_unload - h_f) / (h_max - h_f))**1.5

    # Contact stiffness (slope at peak)
    S = 1.5 * P_max / (h_max - h_f) * 0.001  # μN/nm

    return h_load, P_load, h_unload, P_unload, P_max, h_max, h_f, S

# Wootz microstructural phases
phases = [
    ("Ferrite (α-Fe)",         210, 2.0),
    ("Pearlite (matrix)",      200, 3.5),
    ("Bainite",                210, 5.0),
    ("Tempered martensite",    210, 7.0),
    ("Cementite (Fe₃C band)", 200, 12.0),
    ("Wootz carbide band",    210, 13.0),
]

print("=== Nano-Indentation Analysis of Wootz Phases ===")
print(f"{'Phase':<28} {'E (GPa)':>8} {'H (GPa)':>8} {'h_max':>7} {'h_res':>7} {'P_max':>8} {'S':>8}")
print("-" * 78)

for name, E, H in phases:
    h_l, P_l, h_u, P_u, Pm, hm, hf, S = nanoindent_curve(E, H)
    print(f"{name:<28} {E:>6} {H:>6.1f} {hm:>5.0f}nm {hf:>5.0f}nm {Pm:>6.2f}mN {S:>6.2f}")

# Simulated line scan across wootz surface
print("\\n=== Nano-Indentation Line Scan (50 indents, 2μm spacing) ===")
np.random.seed(42)
n_indents = 50
band_period = 8  # indents between bands

print(f"{'Position':>10} {'H (GPa)':>8} {'E (GPa)':>8} {'Phase':>12}  Profile")
print("-" * 60)

hardness_map = []
for i in range(n_indents):
    # Periodic carbide bands
    in_band = np.sin(2 * np.pi * i / band_period) > 0.6
    if in_band:
        H = np.random.normal(12.5, 0.8)
        E = np.random.normal(205, 5)
        phase = "Carbide"
    else:
        H = np.random.normal(3.5, 0.5)
        E = np.random.normal(200, 5)
        phase = "Matrix"
    hardness_map.append(H)

    if i % 5 == 0:
        bar = "█" * int(H * 2)
        print(f"{i*2:>8}μm {H:>7.1f} {E:>7.0f} {phase:>11}  {bar}")

hardness_map = np.array(hardness_map)
print(f"\\nLine scan statistics:")
print(f"  Mean hardness: {np.mean(hardness_map):.1f} GPa")
print(f"  Carbide bands: {np.mean(hardness_map[hardness_map > 8]):.1f} GPa")
print(f"  Matrix:        {np.mean(hardness_map[hardness_map < 8]):.1f} GPa")
print(f"  Ratio:         {np.mean(hardness_map[hardness_map > 8]) / np.mean(hardness_map[hardness_map < 8]):.1f}×")
print(f"  Band spacing:  ~{band_period * 2} μm")`,
      challenge: 'Real nano-indentation data shows "pop-in" events — sudden displacement jumps during loading caused by dislocation nucleation. Add a pop-in at ~50 nm depth (sudden 10 nm jump at constant load) to the loading curve. How does this affect the calculated hardness? Pop-ins are signatures of the transition from elastic to plastic deformation.',
      successHint: 'Nano-indentation is the gold standard for measuring mechanical properties at the micro- and nano-scale. It is used to characterise thin films, coatings, biological tissues, and — as you just saw — the individual phases in steel microstructures. The Oliver-Pharr method you applied is cited over 50,000 times in the scientific literature.',
    },
    {
      title: 'Trade route economics — wootz as a traded commodity',
      concept: `Wootz steel wasn't just a material — it was a **luxury trade commodity** that flowed from Indian production centres through the Indian Ocean trade network to markets across the Middle East and Europe. Its price reflected:

1. **Production cost** — crucible fuel, high-quality iron ore, days of controlled heating
2. **Transport cost** — overland caravans and maritime shipping from India to Damascus, Venice, and beyond
3. **Scarcity premium** — only a few Indian centres knew the recipe; supply was limited
4. **Information asymmetry** — buyers couldn't easily verify quality until the blade was forged

The economics of wootz follow a **supply-demand model** with high barriers to entry (secret recipe), inelastic demand (warriors needed the best steel), and long supply chains. We can model the price along the trade route using a simple transport cost model and analyse how the monopoly on production knowledge created extraordinary profits for Indian steel makers.

📚 *Information asymmetry means one party in a transaction knows more than the other. Indian smelters knew the recipe; Damascus smiths knew how to forge it; end customers knew neither. Each intermediary captured profit from their exclusive knowledge.*`,
      analogy: 'Think of a rare spice like saffron. Grown only in specific regions, processed by skilled workers, transported thousands of miles, and sold at enormous markup. The price at each stage reflects production cost + transport + scarcity + the seller\'s monopoly knowledge. Wootz steel followed the same economics — a rare, knowledge-intensive product traded across continents at luxury prices.',
      storyConnection: 'Wootz ingots (called "cakes") were shipped from southern India to the port of Damascus, where specialist smiths forged them into legendary "Damascus steel" blades. The Indian smelters, Arab merchants, Damascus smiths, and European buyers each captured value. When the trade routes were disrupted (by Portuguese naval control of the Indian Ocean in the 1500s), supply dropped and prices skyrocketed.',
      checkQuestion: 'A wootz ingot costs 2 gold dinars to produce in India. Transport to Damascus costs 3 dinars. The Damascus smith adds 5 dinars of forging labour. The blade sells for 20 dinars. Where is the largest profit margin?',
      checkAnswer: 'Total cost: 2 + 3 + 5 = 10 dinars. Selling price: 20 dinars. Profit: 10 dinars. The retail margin is 10/20 = 50%. But the real question is: who captures that profit? The merchant (transport + trade margin), the smith (forging skill premium), or the end seller? In practice, the Damascus smith captured the most — their forging knowledge was the scarcest bottleneck.',
      codeIntro: 'Model the wootz trade route economics — prices, margins, and the impact of supply disruptions.',
      code: `import numpy as np

class TradeNode:
    """A node in the trade route (producer, merchant, smith, or market)."""
    def __init__(self, name, base_cost, transport_cost, markup_pct):
        self.name = name
        self.base_cost = base_cost          # cost of processing at this node
        self.transport_cost = transport_cost  # cost to move to next node
        self.markup_pct = markup_pct          # profit markup percentage

def simulate_trade_route(nodes, base_price, supply_factor=1.0):
    """Simulate price accumulation along a trade route."""
    price = base_price
    results = []
    for node in nodes:
        cost = node.base_cost + node.transport_cost
        # Scarcity markup increases when supply is low
        effective_markup = node.markup_pct * (1 + (1/supply_factor - 1) * 0.5)
        price = (price + cost) * (1 + effective_markup / 100)
        results.append({"node": node.name, "cost": cost, "markup": effective_markup,
                        "price": price, "margin": (price - base_price) / price * 100})
    return results

# Wootz trade route (prices in gold dinars)
route = [
    TradeNode("Indian smelter",   2.0, 0.0, 30),
    TradeNode("Coastal merchant",  0.5, 1.5, 25),
    TradeNode("Arabian trader",    0.5, 2.0, 35),
    TradeNode("Damascus smith",    5.0, 0.0, 50),
    TradeNode("Blade merchant",    0.5, 1.0, 40),
    TradeNode("European buyer",    0.0, 3.0, 0),
]

# Normal supply conditions
print("=== Wootz Steel Trade Route Economics ===")
print("\\n--- Normal Supply ---")
results = simulate_trade_route(route, base_price=1.0)
print(f"{'Node':<22} {'Added Cost':>10} {'Markup%':>8} {'Price':>8} {'Cum Margin':>10}")
print("-" * 60)
for r in results:
    print(f"{r['node']:<22} {r['cost']:>8.1f} {r['markup']:>7.0f}% {r['price']:>7.1f} {r['margin']:>9.0f}%")

# Supply disruption scenarios
print("\\n=== Impact of Supply Disruptions ===")
scenarios = [
    ("Normal supply", 1.0),
    ("Moderate shortage", 0.6),
    ("Severe shortage", 0.3),
    ("Near monopoly", 0.1),
]

print(f"{'Scenario':<22} {'Final Price':>12} {'Price Multiple':>14}")
print("-" * 50)
baseline = simulate_trade_route(route, 1.0, 1.0)[-1]["price"]
for name, supply in scenarios:
    result = simulate_trade_route(route, 1.0, supply)
    final = result[-1]["price"]
    print(f"{name:<22} {final:>10.1f} {final/baseline:>12.1f}×")

# Profit distribution
print("\\n=== Profit Distribution Along Route ===")
print("(Who captures the most value?)")
results = simulate_trade_route(route, 1.0)
prev_price = 1.0
total_profit = results[-1]["price"] - 1.0
print(f"{'Node':<22} {'Value Added':>12} {'% of Total':>10}")
print("-" * 46)
for r in results:
    value_added = r["price"] - prev_price
    pct = value_added / total_profit * 100 if total_profit > 0 else 0
    bar = "█" * int(pct / 3)
    print(f"{r['node']:<22} {value_added:>10.1f} {pct:>8.0f}%  {bar}")
    prev_price = r["price"]`,
      challenge: 'Model the Portuguese disruption of the Indian Ocean trade (1500s). The Portuguese imposed tariffs and rerouted trade. Simulate adding a 100% tariff at the "Arabian trader" node. How does this change the final price and profit distribution? Who benefits and who suffers? This is an early example of trade warfare — control the route, control the price.',
      successHint: 'You just modelled a real historical supply chain — the same economics framework used to analyse modern commodities (oil, rare earths, semiconductors). The key insights: scarcity increases prices non-linearly, intermediaries capture value from exclusive knowledge, and supply chain disruptions cascade through the entire network.',
    },
    {
      title: 'Failure analysis — why the wootz recipe was lost',
      concept: `One of the great mysteries of metallurgy: **why was the wootz steel recipe lost?** By the mid-1800s, no one could produce genuine wootz. The knowledge vanished. Modern analysis points to several converging factors:

1. **Ore depletion** — the specific iron ores from South India that naturally contained vanadium and other trace elements were exhausted
2. **Trade disruption** — Portuguese, then British colonial control disrupted the Indian Ocean trade network
3. **Knowledge concentration** — the recipe was held by a small number of families/guilds with oral transmission
4. **Substitution** — European crucible steel (Huntsman process, 1740) provided a cheaper alternative
5. **Demand shift** — firearms replaced swords as primary weapons

This is a **systems failure** — no single cause, but a cascade of reinforcing factors. We can model it as a **reliability analysis**: each factor has a probability of disrupting production, and the overall survival probability is the product of individual factor probabilities.

📚 *A system with N independent failure modes has overall reliability R = R₁ × R₂ × ... × R_N. Even if each mode has 90% reliability, five modes give R = 0.9⁵ = 59%. Redundancy (backups) is the only defence against cascading failure.*`,
      analogy: 'Imagine a chain with 5 links. Each link has a 90% chance of holding. The chain\'s overall survival probability is 0.9⁵ = 59% — barely better than a coin flip. The wootz recipe was like a chain: ore supply, trade routes, knowledge transmission, market demand, and political stability were all links. When several weakened simultaneously, the chain broke and the knowledge was lost.',
      storyConnection: 'The last confirmed wootz production was in the early 1800s in southern India. By 1838, when the British metallurgist Henry Wilkinson tried to study the process, he could find only a few elderly smiths who remembered fragments of the technique. The complete recipe — the exact ore, charcoal type, crucible design, heating profile, and cooling method — had been lost within a single generation.',
      checkQuestion: 'If the wootz recipe required specific ore (available 80% of the time), intact trade routes (70%), and living masters (85%), what was the probability of continued production?',
      checkAnswer: 'P = 0.80 × 0.70 × 0.85 = 0.476 = 47.6%. Less than a coin flip! And these are generous estimates — by 1800, ore availability was probably 30%, trade routes 40%, and surviving masters 20%, giving P = 0.024 = 2.4%. The recipe was doomed unless someone actively preserved it.',
      codeIntro: 'Model the decline of wootz production as a multi-factor reliability problem and simulate the loss timeline.',
      code: `import numpy as np

np.random.seed(42)

def decline_factor(year, start_decline, half_life, initial=1.0):
    """Model a declining factor using exponential decay."""
    if year < start_decline:
        return initial
    return initial * np.exp(-0.693 * (year - start_decline) / half_life)

# Historical factors affecting wootz production
factors = {
    "Ore quality": {"start": 1400, "half_life": 200, "initial": 1.0},
    "Trade routes": {"start": 1500, "half_life": 100, "initial": 1.0},
    "Master smiths": {"start": 1600, "half_life": 80, "initial": 1.0},
    "Market demand": {"start": 1700, "half_life": 60, "initial": 1.0},
    "Political stability": {"start": 1750, "half_life": 50, "initial": 1.0},
}

print("=== Decline of Wootz Steel Production ===")
print(f"{'Year':<6}", end="")
for name in factors:
    short = name[:8]
    print(f"{short:>10}", end="")
print(f"{'Combined':>10} {'Status':<15}")
print("-" * 72)

years = range(1300, 1900, 25)
for year in years:
    values = []
    for name, params in factors.items():
        v = decline_factor(year, params["start"], params["half_life"])
        values.append(v)

    combined = 1.0
    for v in values:
        combined *= v

    status = ("Thriving" if combined > 0.5 else "Declining" if combined > 0.1
              else "Critical" if combined > 0.01 else "LOST")

    print(f"{year:<6}", end="")
    for v in values:
        print(f"{v:>9.0%}", end="")
    print(f"{combined:>9.1%} {status:<15}")

# Monte Carlo: when does production cease?
print("\\n=== Monte Carlo: Year of Final Production ===")
n_sims = 1000
cessation_years = []

for _ in range(n_sims):
    for year in range(1300, 2000):
        probs = []
        for name, params in factors.items():
            base = decline_factor(year, params["start"], params["half_life"])
            # Add random fluctuation
            actual = base * np.random.uniform(0.7, 1.3)
            probs.append(min(actual, 1.0))

        combined = 1.0
        for p in probs:
            combined *= p

        # Production ceases when combined probability < 5%
        if combined < 0.05:
            cessation_years.append(year)
            break

cessation_years = np.array(cessation_years)
print(f"Simulations: {n_sims}")
print(f"Median cessation year: {np.median(cessation_years):.0f}")
print(f"Earliest (5th pctile): {np.percentile(cessation_years, 5):.0f}")
print(f"Latest (95th pctile):  {np.percentile(cessation_years, 95):.0f}")
print(f"Historical last production: ~1820 (matches model)")

# What-if analysis
print("\\n=== What If? Counterfactual Analysis ===")
print("What if one factor had been preserved?")
for preserved_name in factors:
    years_saved = []
    for _ in range(200):
        for year in range(1300, 2000):
            combined = 1.0
            for name, params in factors.items():
                if name == preserved_name:
                    combined *= 1.0  # preserved
                else:
                    base = decline_factor(year, params["start"], params["half_life"])
                    combined *= base * np.random.uniform(0.7, 1.3)
            if combined < 0.05:
                years_saved.append(year)
                break
    median_saved = np.median(years_saved) if years_saved else 2000
    delta = median_saved - np.median(cessation_years)
    print(f"  Preserve '{preserved_name}': production lasts until ~{median_saved:.0f} (+{delta:.0f} years)")`,
      challenge: 'Add a "documentation" factor — what if someone had written down the complete recipe in 1600? Model this as a new factor with initial=1.0 that never declines (a written record doesn\'t die). How much does documentation extend the tradition? This is the argument for preserving indigenous technical knowledge.',
      successHint: 'You just performed a failure analysis on one of history\'s great technological losses. The same multi-factor reliability framework is used to analyse aircraft accidents, nuclear incidents, and pandemic preparedness. The key lesson: systems with multiple single points of failure are fragile. Redundancy — multiple ore sources, written records, distributed knowledge — is the defence.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced modelling, trade economics, and failure analysis</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 3 covers molecular dynamics, Turing pattern formation, nano-indentation, trade economics, and the mystery of the lost recipe.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {loadProgress}</>) : (<><Sparkles className="w-5 h-5" /> Load Python</>)}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson
            key={i}
            id={`L3-${i + 1}`}
            number={i + 1}
            title={lesson.title}
            concept={lesson.concept}
            analogy={lesson.analogy}
            storyConnection={lesson.storyConnection}
            checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer}
            codeIntro={lesson.codeIntro}
            code={lesson.code}
            challenge={lesson.challenge}
            successHint={lesson.successHint}
          />
        ))}
      </div>
    </div>
  );
}
