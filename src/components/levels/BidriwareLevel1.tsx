import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function BidriwareLevel1() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Atoms and elements — the building blocks of metals',
      concept: `Everything around you is made of **atoms** — tiny particles so small that a line of 10 million atoms is only 1 millimetre long. Each atom has a **nucleus** (protons + neutrons) surrounded by a cloud of **electrons**. The number of protons defines the **element**: hydrogen has 1, carbon has 6, iron has 26, silver has 47, zinc has 30.

The **periodic table** organizes all 118 known elements by their properties. Metals are on the left and center (about 80% of all elements). They share common properties: they conduct electricity, are malleable (can be hammered into shapes), are ductile (can be drawn into wires), and have a metallic luster.

Bidriware uses two key elements: **zinc** (Zn, element 30) for the base alloy and **silver** (Ag, element 47) for the inlay. Understanding how these atoms behave — how they bond, react, and interact — is the foundation of materials science and electrochemistry.

📚 *Atomic number = number of protons. Atomic mass = protons + neutrons. Electrons orbit in shells: the first shell holds 2, the second holds 8, the third holds 18. The outermost electrons (valence electrons) determine chemical behavior.*`,
      analogy: 'Think of atoms like LEGO bricks. Each color of brick is a different element. You can snap them together in different ways to build different structures (molecules and materials). The shape of each brick (how many connecting points it has) determines what it can bond with — just as the number of valence electrons determines how an atom bonds.',
      storyConnection: 'Bidriware craftsmen in Bidar, Karnataka, have worked with zinc and silver for over 600 years. They discovered through experience that zinc is easy to cast but tarnishes dark, while silver stays bright forever. Modern chemistry explains why: zinc atoms readily give up electrons (oxidize), turning dark, while silver atoms hold their electrons tightly, maintaining their luster.',
      checkQuestion: 'Zinc has atomic number 30. How many protons does it have? How many electrons? If its electron configuration is 2-8-18-2, how many valence electrons does it have?',
      checkAnswer: '30 protons and 30 electrons (neutral atom). The outermost shell has 2 electrons — these are the valence electrons. These 2 electrons are easily lost, which is why zinc is reactive and readily forms Zn^2+ ions.',
      codeIntro: 'Explore the periodic table and compare properties of metals used in Bidriware.',
      code: `# Atoms and elements — periodic table exploration

# Key elements in Bidriware
elements = {
    "Zn": {"name": "Zinc", "number": 30, "mass": 65.38, "config": "2-8-18-2",
            "valence": 2, "melting": 420, "density": 7.13, "conductivity": 16.6},
    "Ag": {"name": "Silver", "number": 47, "mass": 107.87, "config": "2-8-18-18-1",
            "valence": 1, "melting": 962, "density": 10.49, "conductivity": 63.0},
    "Cu": {"name": "Copper", "number": 29, "mass": 63.55, "config": "2-8-18-1",
            "valence": 1, "melting": 1085, "density": 8.96, "conductivity": 59.6},
    "Fe": {"name": "Iron", "number": 26, "mass": 55.85, "config": "2-8-14-2",
            "valence": 2, "melting": 1538, "density": 7.87, "conductivity": 10.0},
    "Au": {"name": "Gold", "number": 79, "mass": 196.97, "config": "2-8-18-32-18-1",
            "valence": 1, "melting": 1064, "density": 19.32, "conductivity": 45.2},
    "Sn": {"name": "Tin", "number": 50, "mass": 118.71, "config": "2-8-18-18-4",
            "valence": 4, "melting": 232, "density": 7.29, "conductivity": 8.7},
}

print("=== Bidriware Elements ===")
print(f"{'Symbol':<8} {'Name':<10} {'Z':>4} {'Mass':>8} {'Valence':>8} "
      f"{'Melt (C)':>9} {'Density':>8}")
print("-" * 57)

for sym, el in elements.items():
    print(f"{sym:<8} {el['name']:<10} {el['number']:>4} {el['mass']:>8.2f} "
          f"{el['valence']:>8} {el['melting']:>7} C {el['density']:>7.2f}")

print()
# Why zinc is the base metal for Bidriware
print("=== Why Zinc for Bidriware? ===")
zn = elements["Zn"]
ag = elements["Ag"]

print(f"Zinc melting point: {zn['melting']} C — low enough for simple furnaces")
print(f"Silver melting point: {ag['melting']} C — much higher, harder to cast")
print(f"Zinc density: {zn['density']} g/cm3 — lighter than silver ({ag['density']})")
print()

# Electron shells visualization
print("=== Electron Shell Structure ===")
for sym in ["Zn", "Ag"]:
    el = elements[sym]
    shells = el["config"].split("-")
    print(f"\\n{el['name']} (Z={el['number']}): {el['config']}")
    for i, count in enumerate(shells):
        n = int(count)
        max_cap = 2 * (i + 1) ** 2  # max electrons per shell
        fill = "#" * n + "." * (max_cap - n)
        print(f"  Shell {i+1} (max {max_cap:>2}): [{fill[:20]}] {n}/{max_cap}")

# Atomic radius comparison
print()
print("=== Size Comparison ===")
radii = {"Zn": 134, "Ag": 144, "Cu": 128, "Fe": 126, "Au": 144, "Sn": 145}
for sym in ["Zn", "Ag", "Cu", "Fe"]:
    r = radii[sym]
    bar = "O" * (r // 5)
    print(f"  {elements[sym]['name']:<10} {r} pm  {bar}")`,
      challenge: 'Calculate how many zinc atoms fit in 1 cubic centimetre. (Hint: density = 7.13 g/cm^3, atomic mass = 65.38 g/mol, Avogadro number = 6.022e23 atoms/mol.) Then calculate for silver. Which metal packs more atoms per cm^3?',
      successHint: 'Understanding atomic structure is the gateway to all of chemistry and materials science. Every material property — strength, conductivity, color, reactivity — traces back to how atoms are arranged and how their electrons behave.',
    },
    {
      title: 'Metals vs non-metals — what makes a metal metallic?',
      concept: `Metals have distinctive properties that set them apart from non-metals: they **conduct electricity**, are **malleable** (can be hammered flat without breaking), are **ductile** (can be drawn into wires), and reflect light with a characteristic **luster**. But what causes these properties?

The answer lies in the **metallic bond** — a special type of bonding where valence electrons are shared across ALL atoms in the metal, not just between two atoms. These delocalized electrons form an "electron sea" that flows freely through the metal. This electron sea is responsible for electrical conductivity (electrons carry current), malleability (atoms can slide past each other without breaking bonds), and luster (free electrons interact with light).

Non-metals like oxygen, nitrogen, and carbon hold their electrons tightly in localized bonds. They do not conduct electricity (except graphite, a special form of carbon) and are typically brittle when solid.

📚 *Metallic bonding: positive metal ions are held together by a "sea" of delocalized valence electrons. The electrons are not attached to any particular atom — they flow freely throughout the material. This is fundamentally different from ionic bonds (electron transfer) and covalent bonds (electron sharing between two atoms).*`,
      analogy: 'Imagine a crowd of people (atoms) in a stadium, all passing beach balls (electrons) around. No one person owns any particular ball — they all share them. The free-flowing balls connect everyone together (metallic bond). If you push one side of the crowd, the whole group shifts smoothly (malleability). The beach balls flying around create a shimmer (luster). That is the metallic bond.',
      storyConnection: 'The Bidriware craftsman relies on metallic properties daily. Zinc is malleable — it can be hammered and engraved without cracking. Silver is ductile — it can be drawn into thin wires for the inlay work. Both metals have luster — though zinc tarnishes dark (a key feature of the art) while silver remains bright, creating the striking black-and-silver contrast of Bidriware.',
      checkQuestion: 'Diamond (pure carbon) is an excellent conductor of heat but a terrible conductor of electricity. Why?',
      checkAnswer: 'In diamond, all four of carbon valence electrons are locked in covalent bonds with neighboring atoms — none are free to carry electrical current. But the rigid bond network transmits vibrations (heat) very efficiently. Metals conduct both heat AND electricity because they have free electrons that carry both.',
      codeIntro: 'Compare metallic properties and calculate electrical conductivity from the electron sea model.',
      code: `# Metals vs non-metals — property comparison

# Electrical conductivity (MS/m = megasiemens per metre)
materials = [
    ("Silver (Ag)", 63.0, "metal", True, True),
    ("Copper (Cu)", 59.6, "metal", True, True),
    ("Gold (Au)", 45.2, "metal", True, True),
    ("Zinc (Zn)", 16.6, "metal", True, True),
    ("Iron (Fe)", 10.0, "metal", True, True),
    ("Tin (Sn)", 8.7, "metal", True, True),
    ("Lead (Pb)", 4.8, "metal", True, True),
    ("Graphite (C)", 0.3, "non-metal", False, False),
    ("Silicon (Si)", 0.001, "metalloid", False, True),
    ("Glass (SiO2)", 1e-10, "non-metal", False, False),
    ("Rubber", 1e-13, "non-metal", False, False),
]

print("=== Conductivity Comparison ===")
print(f"{'Material':<20} {'Conductivity':>13} {'Type':<10} {'Malleable':>10} {'Lustrous':>9}")
print("-" * 64)

for name, cond, mat_type, malleable, lustrous in materials:
    if cond >= 1:
        cond_str = str(round(cond, 1)) + " MS/m"
    elif cond >= 0.001:
        cond_str = str(round(cond * 1000, 1)) + " kS/m"
    else:
        cond_str = str(cond) + " S/m"
    print(f"{name:<20} {cond_str:>13} {mat_type:<10} "
          f"{'Yes' if malleable else 'No':>10} {'Yes' if lustrous else 'No':>9}")

print()
# Free electron model
print("=== Free Electron Density in Metals ===")
# n = (density * Avogadro * valence) / atomic_mass
avogadro = 6.022e23

metals_data = [
    ("Zinc", 7.13, 65.38, 2),
    ("Silver", 10.49, 107.87, 1),
    ("Copper", 8.96, 63.55, 1),
    ("Iron", 7.87, 55.85, 2),
    ("Gold", 19.32, 196.97, 1),
]

print(f"{'Metal':<10} {'Free e-/cm3':>15} {'e-/atom':>10}")
print("-" * 37)

for name, density, mass, valence in metals_data:
    n_atoms = density * avogadro / mass  # atoms/cm^3
    n_electrons = n_atoms * valence
    print(f"{name:<10} {n_electrons:>15.2e} {valence:>10}")

print()
# Why silver tarnishes less than zinc
print("=== Reactivity Series (simplified) ===")
reactivity = [
    ("Potassium (K)", "Very reactive", "Reacts with water"),
    ("Sodium (Na)", "Very reactive", "Reacts with water"),
    ("Zinc (Zn)", "Moderate", "Reacts with acid, tarnishes in air"),
    ("Iron (Fe)", "Moderate", "Rusts in moist air"),
    ("Tin (Sn)", "Low-moderate", "Slow tarnishing"),
    ("Copper (Cu)", "Low", "Green patina over years"),
    ("Silver (Ag)", "Very low", "Slight tarnish with sulfur"),
    ("Gold (Au)", "Almost none", "Does not tarnish"),
    ("Platinum (Pt)", "Almost none", "Does not tarnish"),
]

print(f"{'Metal':<20} {'Reactivity':<15} {'Behavior'}")
print("-" * 60)
for name, level, behavior in reactivity:
    print(f"{name:<20} {level:<15} {behavior}")

print()
print("Zinc tarnishes dark (reacts with air) -> BLACK base")
print("Silver stays bright (very low reactivity) -> SHINING inlay")
print("This contrast IS Bidriware.")`,
      challenge: 'Why is silver a better electrical conductor than zinc, even though zinc has 2 free electrons per atom vs silver 1? (Hint: it is not just about the number of electrons — it is about how easily they move. Research "electron mobility" and "mean free path.")',
      successHint: 'The metallic bond and electron sea model explain why metals are essential to technology: electrical wiring (copper), structural steel (iron), electronics (gold contacts), and decorative arts (silver inlay). Understanding metallic bonding is understanding the materials that built civilization.',
    },
    {
      title: 'Alloys — mixing metals for better properties',
      concept: `An **alloy** is a mixture of two or more metals (or a metal and a non-metal). Alloys often have properties superior to either pure component: stronger, harder, more corrosion-resistant, or with a lower melting point. Steel (iron + carbon) is stronger than pure iron. Bronze (copper + tin) is harder than pure copper.

The Bidriware base is not pure zinc — it is a **zinc-copper alloy** with approximately 90-94% zinc and 6-10% copper. The copper raises the melting point slightly, improves hardness, and makes the alloy easier to cast and engrave.

Alloys work because the different-sized atoms disrupt the regular crystal lattice of the base metal. This **lattice distortion** blocks the movement of defects called **dislocations** — which is the mechanism by which metals deform. Fewer moving dislocations = harder material.

📚 *Two types of alloys: substitutional (the alloying atom replaces the base atom in the lattice — requires similar atomic radii) and interstitial (the alloying atom fits in the gaps between base atoms — requires a much smaller atom, like carbon in steel).*`,
      analogy: 'Imagine a floor tiled with identical circular coins (pure metal). They can slide over each other easily. Now replace some coins with slightly larger or smaller ones. The floor becomes bumpy and uneven — the coins cannot slide as easily. That is how alloying works: different-sized atoms create "bumps" that make the material harder.',
      storyConnection: 'Bidriware craftsmen discovered centuries ago that pure zinc is too soft for detailed engraving — the chisel slips and the lines are mushy. Adding a small percentage of copper (6-10%) makes the alloy hard enough for crisp, detailed engraving while keeping the melting point low enough for traditional casting methods.',
      checkQuestion: 'Bidriware alloy is 92% zinc (density 7.13) and 8% copper (density 8.96). What is the approximate density of the alloy?',
      checkAnswer: 'Approximate density = 0.92 * 7.13 + 0.08 * 8.96 = 6.56 + 0.72 = 7.28 g/cm^3. This is a linear approximation (rule of mixtures) — the actual density may differ slightly due to atomic packing effects.',
      codeIntro: 'Calculate alloy properties and explore how composition affects material behavior.',
      code: `# Alloys — mixing metals for better properties

def rule_of_mixtures(prop_a, prop_b, fraction_a):
    """Estimate alloy property using linear rule of mixtures."""
    return prop_a * fraction_a + prop_b * (1 - fraction_a)

# Bidriware alloy: zinc + copper
zn_props = {
    "density": 7.13,       # g/cm^3
    "melting": 420,         # C
    "hardness": 2.5,        # Mohs scale
    "conductivity": 16.6,   # MS/m
    "cost_per_kg": 2.50,    # USD
}

cu_props = {
    "density": 8.96,
    "melting": 1085,
    "hardness": 3.0,
    "conductivity": 59.6,
    "cost_per_kg": 8.00,
}

print("=== Bidriware Alloy Properties vs Composition ===")
print()
print(f"{'Zn %':>6} {'Cu %':>6} {'Density':>8} {'Melt C':>8} {'Hardness':>9} "
      f"{'Cond':>8} {'Cost/kg':>8}")
print("-" * 56)

for zn_pct in range(100, 79, -2):
    cu_pct = 100 - zn_pct
    frac_zn = zn_pct / 100

    density = rule_of_mixtures(zn_props["density"], cu_props["density"], frac_zn)
    # Melting point of alloy is typically LOWER than either component (eutectic)
    # Simplified: slight depression from linear
    melt_linear = rule_of_mixtures(zn_props["melting"], cu_props["melting"], frac_zn)
    melt = melt_linear * 0.95  # eutectic depression
    hardness = rule_of_mixtures(zn_props["hardness"], cu_props["hardness"], frac_zn)
    # Hardness gets a boost from alloying (solid solution hardening)
    hardness *= (1 + 0.3 * (cu_pct / 100) * (zn_pct / 100))
    cond = rule_of_mixtures(zn_props["conductivity"], cu_props["conductivity"], frac_zn)
    cost = rule_of_mixtures(zn_props["cost_per_kg"], cu_props["cost_per_kg"], frac_zn)

    marker = " <-- Bidriware" if 90 <= zn_pct <= 94 else ""
    print(f"{zn_pct:>5}% {cu_pct:>5}% {density:>8.2f} {melt:>6.0f} {hardness:>9.2f} "
          f"{cond:>8.1f} \{cost:>6.2f}{marker}")

print()
# Famous alloys
print("=== Famous Alloys ===")
alloys = [
    ("Bidriware", "90% Zn + 10% Cu", "Silver inlay crafts"),
    ("Brass", "60% Cu + 40% Zn", "Musical instruments, plumbing"),
    ("Bronze", "88% Cu + 12% Sn", "Bells, statues, bearings"),
    ("Steel", "99% Fe + 1% C", "Construction, tools"),
    ("Stainless Steel", "Fe + 18% Cr + 8% Ni", "Kitchen, medical"),
    ("Sterling Silver", "92.5% Ag + 7.5% Cu", "Jewelry, silverware"),
    ("Solder", "60% Sn + 40% Pb", "Electronics assembly"),
]

print(f"{'Alloy':<18} {'Composition':<25} {'Use'}")
print("-" * 65)
for name, comp, use in alloys:
    print(f"{name:<18} {comp:<25} {use}")`,
      challenge: 'Calculate the density and cost of sterling silver (92.5% silver, 7.5% copper). Then compare: how much does 1 kg of Bidriware alloy cost vs 1 kg of sterling silver? This enormous price difference is why Bidriware uses zinc as the base — it achieves beauty at a fraction of silver cost.',
      successHint: 'Alloy design is one of the most important branches of materials science. Every airplane (aluminum alloys), every bridge (steel alloys), every electronic device (solder alloys), and every piece of jewelry (gold or silver alloys) depends on carefully engineered alloy compositions.',
    },
    {
      title: 'Oxidation — why metals tarnish and corrode',
      concept: `**Oxidation** is the loss of electrons by an atom. When zinc is exposed to air, zinc atoms on the surface give up 2 electrons each to oxygen atoms: Zn -> Zn^2+ + 2e^-. The zinc ions combine with oxygen to form **zinc oxide (ZnO)**, a dark gray compound. This is why zinc tarnishes — the surface oxidizes.

The reverse process — gaining electrons — is called **reduction**. Oxidation and reduction always occur together (one atom loses electrons, another gains them), which is why these reactions are called **redox reactions**.

Silver is much harder to oxidize than zinc — it sits lower on the **reactivity series**. Silver does not react with oxygen in air. It can slowly tarnish with hydrogen sulfide (H2S, the smell of rotten eggs), forming black silver sulfide (Ag2S), but this takes months or years. This difference in reactivity is what makes the Bidriware contrast work: zinc turns black, silver stays bright.

📚 *Oxidation = loss of electrons (OIL: Oxidation Is Loss). Reduction = gain of electrons (RIG: Reduction Is Gain). In any redox reaction, one species is oxidized (loses electrons) and another is reduced (gains them). The total electrons lost must equal the total gained.*`,
      analogy: 'Think of oxidation like losing your wallet (electrons). The metal "gets poorer" — it becomes a positive ion because it lost negative charges. Zinc is like someone who easily gives away their wallet (reactive — easily oxidized). Gold is like someone who guards their wallet with their life (unreactive — almost never oxidized).',
      storyConnection: 'The final step in making Bidriware is darkening the zinc surface. Craftsmen apply a paste of ammonium chloride and copper sulfate (or traditionally, a mud paste from Bidar fort soil) that accelerates the oxidation of zinc. The zinc surface turns jet black while the silver inlay, being unreactive, remains gleaming. This chemical contrast IS the art.',
      checkQuestion: 'In the reaction 2Zn + O2 -> 2ZnO, which element is oxidized and which is reduced? How many electrons are transferred?',
      checkAnswer: 'Zinc is oxidized (Zn goes from 0 to +2, losing 2 electrons each). Oxygen is reduced (O goes from 0 to -2, gaining 2 electrons each). Total: 4 electrons transferred (2 per zinc atom, 2 zinc atoms).',
      codeIntro: 'Model oxidation reactions and calculate how quickly different metals tarnish.',
      code: `# Oxidation and tarnishing of metals

# Standard electrode potentials (volts vs SHE)
# More negative = more easily oxidized
electrode_potentials = {
    "K":  -2.924,  # potassium
    "Na": -2.714,  # sodium
    "Al": -1.662,  # aluminum
    "Zn": -0.762,  # zinc
    "Fe": -0.440,  # iron
    "Ni": -0.257,  # nickel
    "Sn": -0.136,  # tin
    "Pb": -0.126,  # lead
    "H":   0.000,  # hydrogen (reference)
    "Cu":  0.340,  # copper
    "Ag":  0.799,  # silver
    "Pt":  1.200,  # platinum
    "Au":  1.500,  # gold
}

print("=== Electrode Potential (Reactivity Series) ===")
print("More negative = more easily oxidized = more reactive")
print()
print(f"{'Metal':<6} {'E0 (V)':>8} {'Reactivity':<15} {'Bar'}")
print("-" * 55)

sorted_metals = sorted(electrode_potentials.items(), key=lambda x: x[1])
for metal, E0 in sorted_metals:
    bar_pos = int((E0 + 3) * 8)  # scale to fit display
    bar = " " * max(0, bar_pos) + "█"
    if E0 < -1:
        react = "Very reactive"
    elif E0 < 0:
        react = "Moderate"
    elif E0 < 0.5:
        react = "Low"
    else:
        react = "Noble (inert)"
    print(f"{metal:<6} {E0:>+8.3f} {react:<15} {bar}")

print()
# Bidriware contrast
print("=== Why Bidriware Works ===")
E_zn = electrode_potentials["Zn"]
E_ag = electrode_potentials["Ag"]
delta_E = E_ag - E_zn

print(f"Zinc E0 = {E_zn:+.3f} V (easily oxidized -> turns black)")
print(f"Silver E0 = {E_ag:+.3f} V (resists oxidation -> stays bright)")
print(f"Potential difference: {delta_E:.3f} V")
print(f"This {delta_E:.1f} V gap means zinc oxidizes MUCH more")
print(f"easily than silver — the basis of the Bidriware contrast.")

print()
# Tarnishing rate model
print("=== Tarnishing Rate Model ===")
print("Oxide layer thickness over time (simplified parabolic growth)")
print()

# Parabolic oxidation: thickness^2 = k * time
# k depends on metal reactivity
k_values = {
    "Zinc": 1e-4,     # fast tarnishing
    "Iron": 5e-5,     # moderate (rust)
    "Copper": 1e-6,   # slow (patina)
    "Silver": 1e-8,   # very slow
    "Gold": 1e-12,    # essentially zero
}

import numpy as np
times_days = [1, 7, 30, 90, 365]

print(f"{'Metal':<10}", end="")
for t in times_days:
    print(f" {t:>6}d", end="")
print(" (oxide thickness in micrometres)")
print("-" * 50)

for metal, k in k_values.items():
    print(f"{metal:<10}", end="")
    for t in times_days:
        t_seconds = t * 86400
        thickness_m = np.sqrt(k * t_seconds)
        thickness_um = thickness_m * 1e6
        print(f" {thickness_um:>6.2f}", end="")
    print()

print()
print("After 1 year: zinc has a thick dark oxide layer.")
print("Silver barely shows any change. This permanence is why")
print("Bidriware pieces from the 1600s still look stunning today.")`,
      challenge: 'The oxidation rate doubles for every 10 degrees C increase in temperature (Arrhenius approximation). At 30 degrees C, zinc tarnishes in about 1 week. How fast would it tarnish at 50 degrees C? At 100 degrees C? This is why the chemical darkening process uses heated solutions.',
      successHint: 'Oxidation (corrosion) costs the global economy over $2 trillion per year. Understanding and controlling oxidation is essential for infrastructure (bridges, pipelines), transportation (cars, aircraft), electronics (connectors), and art conservation (preserving Bidriware). You just modeled the process that governs it all.',
    },
    {
      title: 'The Bidriware process — chemistry of darkening and inlay',
      concept: `The Bidriware process has five chemical stages: (1) **casting** the zinc-copper alloy, (2) **engraving** patterns into the surface, (3) **inlaying** silver wire into the engraved grooves, (4) **filing and smoothing** the surface, and (5) **chemical darkening** of the zinc while the silver stays bright.

The darkening step uses a paste traditionally made from **Bidar fort soil** mixed with ammonium chloride (NH4Cl). The soil contains copper sulfate (CuSO4), which drives a **displacement reaction**: Zn + CuSO4 -> ZnSO4 + Cu. The deposited copper then reacts with other chemicals to form a black patina.

Modern Bidriware artisans sometimes use a simpler recipe: a solution of copper sulfate and salt (NaCl) applied with heat. The chemistry is the same — zinc atoms in the alloy surface are replaced by copper atoms, and the resulting mixed-metal surface oxidizes to a uniform deep black.

📚 *A displacement reaction occurs when a more reactive metal replaces a less reactive metal in a solution: Zn(s) + Cu^2+(aq) -> Zn^2+(aq) + Cu(s). Zinc (more reactive) displaces copper (less reactive) from the solution. The driving force is the difference in electrode potentials.*`,
      analogy: 'Imagine a game of musical chairs where stronger players take seats from weaker ones. Zinc is the strong player — it kicks copper out of the solution and takes its place. The copper atoms deposit on the surface (lose their "chair" in solution) while zinc atoms dissolve (leave their "chair" on the surface).',
      storyConnection: 'The famous "Bidar soil" used in traditional darkening comes from the walls of Bidar Fort, which was built with laterite blocks containing natural copper compounds. Over centuries, rainwater leached copper salts into the soil. When applied to the zinc alloy, these copper salts drive the displacement reaction that darkens the surface. The chemistry of a medieval fort literally creates the art.',
      checkQuestion: 'In the reaction Zn + CuSO4 -> ZnSO4 + Cu, which metal is oxidized? Which is reduced? What is the driving voltage?',
      checkAnswer: 'Zinc is oxidized (Zn -> Zn^2+ + 2e-, loses electrons). Copper is reduced (Cu^2+ + 2e- -> Cu, gains electrons). Driving voltage = E0(Cu) - E0(Zn) = 0.340 - (-0.762) = 1.102 V. This large positive voltage means the reaction proceeds spontaneously and vigorously.',
      codeIntro: 'Model the Bidriware darkening chemistry and calculate reaction energetics.',
      code: `# Bidriware darkening chemistry

# Electrode potentials
E0 = {"Zn": -0.762, "Cu": 0.340, "Ag": 0.799, "Fe": -0.440}

def cell_voltage(metal_oxidized, metal_reduced):
    """Calculate the voltage driving a displacement reaction."""
    return E0[metal_reduced] - E0[metal_oxidized]

def will_react(metal_solid, metal_in_solution):
    """Will the solid metal displace the metal from solution?"""
    voltage = cell_voltage(metal_solid, metal_in_solution)
    return voltage > 0, voltage

print("=== Displacement Reactions ===")
print("Will the solid metal displace the ion from solution?")
print()
print(f"{'Solid':<8} {'Ion':<8} {'Voltage':>8} {'Reaction?':<12} {'Equation'}")
print("-" * 65)

pairs = [
    ("Zn", "Cu", "Zn + CuSO4 -> ZnSO4 + Cu"),
    ("Zn", "Ag", "Zn + 2AgNO3 -> Zn(NO3)2 + 2Ag"),
    ("Zn", "Fe", "Zn + FeSO4 -> ZnSO4 + Fe"),
    ("Fe", "Cu", "Fe + CuSO4 -> FeSO4 + Cu"),
    ("Cu", "Zn", "Cu + ZnSO4 -> no reaction"),
    ("Ag", "Cu", "Ag + CuSO4 -> no reaction"),
    ("Cu", "Ag", "Cu + 2AgNO3 -> Cu(NO3)2 + 2Ag"),
]

for solid, ion, equation in pairs:
    reacts, voltage = will_react(solid, ion)
    status = "YES" if reacts else "NO"
    print(f"{solid:<8} {ion}2+{'':<4} {voltage:>+7.3f}V {status:<12} {equation}")

print()
# Bidriware darkening process simulation
print("=== Bidriware Darkening Simulation ===")
print("Step-by-step chemical process:")
print()

import numpy as np

# Surface composition over time during darkening
# Start: 92% Zn, 8% Cu at surface
# CuSO4 solution replaces surface Zn with Cu
time_minutes = np.array([0, 2, 5, 10, 15, 20, 30])

# Exponential replacement: Zn dissolves, Cu deposits
rate = 0.08  # per minute
zn_surface = 92 * np.exp(-rate * time_minutes)
cu_surface = 8 + (92 - zn_surface)  # Cu replaces Zn
zn_solution = 92 - zn_surface  # Zn goes into solution

print(f"{'Time (min)':<12} {'Surface Zn%':>12} {'Surface Cu%':>12} {'Zn in soln%':>13} {'Color'}")
print("-" * 55)

for t, zn_s, cu_s, zn_sol in zip(time_minutes, zn_surface, cu_surface, zn_solution):
    if cu_s < 20:
        color = "gray"
    elif cu_s < 50:
        color = "dark gray"
    elif cu_s < 80:
        color = "near black"
    else:
        color = "JET BLACK"
    print(f"{t:<12} {zn_s:>12.1f} {cu_s:>12.1f} {zn_sol:>13.1f} {color}")

print()
print("=== Silver Inlay During Darkening ===")
print(f"Silver E0 = {E0['Ag']:+.3f} V")
print(f"Zinc E0 = {E0['Zn']:+.3f} V")
print(f"Copper E0 = {E0['Cu']:+.3f} V")
print()
voltage_ag_cu = cell_voltage("Ag", "Cu")
print(f"Can CuSO4 displace silver? Voltage = {voltage_ag_cu:+.3f} V -> {'YES' if voltage_ag_cu > 0 else 'NO'}")
print("Silver is MORE noble than copper — the darkening solution")
print("cannot attack it. The silver inlay remains pristine!")`,
      challenge: 'What if you accidentally used iron sulfate (FeSO4) instead of copper sulfate? Would iron deposit on the zinc surface? What color would it turn? Check the electrode potentials to verify. (Hint: E0(Fe) = -0.440 V, E0(Zn) = -0.762 V.)',
      successHint: 'Displacement reactions are the basis of electroplating, metal refining, battery chemistry, and corrosion science. The Bidriware darkening process is a beautiful example of electrochemistry in action — a reaction that has been used by artisans for 600 years, now understood through modern chemistry.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Atoms, metals, alloys, and oxidation</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises use Python to explore atomic structure, metallic bonding, alloys, and oxidation chemistry.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {loadProgress}</>) : (<><Sparkles className="w-5 h-5" /> Load Python</>)}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson
            key={i}
            id={`L1-${i + 1}`}
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
