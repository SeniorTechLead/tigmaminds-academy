import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function RubberTripuraLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Monomers and polymers — small units, big chains',
      concept: `A **monomer** is a small molecule that can bond with others to form long chains. A **polymer** is the resulting chain of many (poly-) monomers.

Natural rubber is made of **isoprene** monomers (C₅H₈). Each isoprene unit has a carbon-carbon double bond that opens up to link with neighbours:

\`n × C₅H₈ → (C₅H₈)ₙ\`

A single rubber chain might contain 5,000-10,000 isoprene units, making it a molecule with 25,000-50,000 carbon atoms.

Key vocabulary:
- **Degree of polymerisation (n)**: number of monomer units in one chain
- **Molecular weight**: n × monomer weight
- **Chain length**: roughly n × 0.5 nm (the length of one isoprene unit)

📚 *We will use Python variables, multiplication, and formatted printing to calculate polymer properties from monomer data.*`,
      analogy: 'A monomer is like a single paper clip. You can link paper clips into a chain — that chain is a polymer. One paper clip is not useful, but a chain of 5,000 paper clips is flexible, strong, and useful in ways a single clip is not.',
      storyConnection: 'Tripura is one of India\'s major rubber-producing states. The rubber trees (Hevea brasiliensis) in Tripura\'s plantations produce latex — a milky fluid containing isoprene monomers that naturally polymerise into rubber chains.',
      checkQuestion: 'If a rubber chain has 8,000 isoprene units and each unit weighs 68 g/mol, what is the molecular weight of the chain?',
      checkAnswer: 'Molecular weight = 8,000 × 68 = 544,000 g/mol. That is over half a million — a single rubber molecule is enormous compared to simple molecules like water (18 g/mol).',
      codeIntro: 'Calculate the properties of a rubber polymer chain from its monomer data.',
      code: `# Rubber polymer calculator
monomer_name = "isoprene"
monomer_formula = "C5H8"
monomer_mw = 68.12  # g/mol (molecular weight)
monomer_length = 0.50  # nm (approximate length of one unit)

# Typical chain lengths in natural rubber
chain_lengths = [1000, 3000, 5000, 8000, 10000]

print(f"Monomer: {monomer_name} ({monomer_formula})")
print(f"Monomer molecular weight: {monomer_mw} g/mol")
print(f"Monomer length: {monomer_length} nm")
print()
print(f"{'Chain (n)':>10} | {'MW (g/mol)':>12} | {'Length (nm)':>11} | {'Length (um)':>11}")
print("-" * 55)

for n in chain_lengths:
    mw = n * monomer_mw
    length_nm = n * monomer_length
    length_um = length_nm / 1000
    print(f"{n:>10,} | {mw:>12,.0f} | {length_nm:>11,.0f} | {length_um:>11.1f}")

print()
# Compare to everyday scales
longest = max(chain_lengths) * monomer_length / 1000
print(f"Longest chain: {longest:.1f} micrometres")
print(f"A human hair is ~70 um thick")
print(f"So a rubber chain is about {longest/70:.1f}x the width of a hair")
print()
print("One rubber molecule stretches across 70 hair widths!")
print("But it is only a few atoms wide — incredibly thin and long.")`,
      challenge: 'Synthetic rubber (styrene-butadiene) uses two different monomers. If 25% are styrene (104 g/mol) and 75% are butadiene (54 g/mol), what is the average molecular weight per unit?',
      successHint: 'Polymers get their extraordinary properties from sheer length. A chain of 10,000 units can tangle, stretch, and spring back — properties that no small molecule can have.',
    },
    {
      title: 'Polymerisation — how monomers link together',
      concept: `**Addition polymerisation** is the process by which isoprene monomers link together. Each monomer has a C=C double bond. During polymerisation:

1. The double bond "opens up" (one bond breaks)
2. The freed bond connects to the next monomer
3. The chain grows one unit at a time

The rate of polymerisation depends on:
- **Temperature**: higher → faster (but may degrade quality)
- **Initiator concentration**: more initiator → more chains started
- **Monomer concentration**: more monomer → faster growth

In Tripura\'s rubber trees, polymerisation happens naturally inside the latex vessels of the bark. The tree produces an enzyme (rubber transferase) that catalyses the reaction.

📚 *We will model chain growth as a sequential process using a \`while\` loop and track how the chain length increases over time.*`,
      analogy: 'Polymerisation is like a conga line forming at a party. One person grabs another, then another, then another. The line gets longer one person at a time. Eventually you have a chain of thousands — flexible, tangled, and hard to break apart.',
      storyConnection: 'When rubber tappers in Tripura make a diagonal cut in the bark of a Hevea tree, latex flows out. This latex already contains polymerised rubber — the tree has done the chemistry. The tappers collect what nature produces.',
      checkQuestion: 'If a growing chain adds one monomer every 0.001 seconds, how long does it take to build a chain of 5,000 units?',
      checkAnswer: '5,000 × 0.001 = 5 seconds. Polymerisation is remarkably fast. In those 5 seconds, a single chain grows from nothing to a molecule 2.5 micrometres long.',
      codeIntro: 'Simulate the growth of a rubber polymer chain over time.',
      code: `import math

# Chain growth simulation
addition_rate = 1000  # monomers per second (typical for natural rubber)
monomer_mw = 68.12    # g/mol per unit

print("POLYMER CHAIN GROWTH SIMULATION")
print("=" * 55)
print(f"{'Time (s)':>9} | {'Chain length':>12} | {'MW (g/mol)':>12} | {'Length (nm)':>11}")
print("-" * 55)

chain = 0
time_step = 0.5  # seconds
total_time = 10  # seconds

t = 0
while t <= total_time:
    chain = int(addition_rate * t)
    mw = chain * monomer_mw
    length = chain * 0.5  # nm per unit

    if chain > 0:
        bar = "#" * min(int(chain / 200), 30)
    else:
        bar = ""
    print(f"{t:9.1f} | {chain:>12,} | {mw:>12,.0f} | {length:>11,.0f} {bar}")
    t += time_step

print()

# Effect of temperature on rate
print("TEMPERATURE EFFECT ON POLYMERISATION RATE")
print("-" * 45)
base_rate = 1000  # monomers/s at 25°C
Ea = 50000        # activation energy (J/mol)
R = 8.314         # gas constant

temps = [15, 20, 25, 30, 35, 40]
for T_celsius in temps:
    T = T_celsius + 273.15
    T_ref = 298.15  # 25°C
    # Arrhenius: rate = base * exp(-Ea/R * (1/T - 1/T_ref))
    rate = base_rate * math.exp(-Ea / R * (1/T - 1/T_ref))
    time_5000 = 5000 / rate
    print(f"  {T_celsius}°C: rate = {rate:,.0f} monomers/s, "
          f"time for 5000-unit chain: {time_5000:.1f}s")

print()
print("Tripura's tropical climate (25-35°C) is ideal for rubber trees.")
print("The warm temperature naturally accelerates polymerisation.")`,
      challenge: 'What if polymerisation stops randomly (chain termination)? Model this by adding a 0.01% chance of stopping at each step. What is the average chain length over 100 trials?',
      successHint: 'Polymerisation rate depends on temperature — this is why rubber trees thrive in tropical Tripura, not in cold climates. Chemistry and geography are linked.',
    },
    {
      title: 'Vulcanisation — cross-linking with sulphur',
      concept: `Raw natural rubber is **soft and sticky** when warm, and **brittle** when cold. Charles Goodyear discovered in 1839 that heating rubber with **sulphur** transforms it into a durable, elastic material. This is **vulcanisation**.

Sulphur atoms form **cross-links** between rubber chains:
- Chain₁ — S — S — Chain₂

These bridges prevent chains from sliding past each other, giving vulcanised rubber:
- **Elasticity**: it snaps back after stretching
- **Durability**: it does not melt in heat or crack in cold
- **Strength**: it resists tearing and abrasion

The degree of cross-linking determines the rubber type:
- **Few cross-links** (1-3%): soft, elastic (rubber bands, gloves)
- **Moderate** (3-10%): firm, springy (tyres, shoe soles)
- **Many** (30-50%): hard, rigid (ebonite, bowling balls)

📚 *We will calculate cross-link density and its effect on rubber properties using simple arithmetic.*`,
      analogy: 'Imagine a bowl of cooked spaghetti — the strands slide over each other easily (raw rubber). Now imagine connecting some strands with toothpicks — the mass holds its shape but is still flexible (vulcanised rubber). More toothpicks = stiffer material.',
      storyConnection: 'Tripura exports raw rubber (latex) that is later vulcanised in factories. The sulphur cross-linking transforms Tripura\'s agricultural product into tyres, medical gloves, and thousands of other products. Without vulcanisation, rubber would be nearly useless.',
      checkQuestion: 'If a rubber has 5,000 monomers per chain and cross-links every 200 monomers, how many cross-links does each chain participate in?',
      checkAnswer: '5,000 / 200 = 25 cross-links per chain. Each cross-link connects two chains, so this one chain is bonded to up to 25 neighbouring chains — creating a vast interconnected network.',
      codeIntro: 'Calculate how sulphur cross-linking changes rubber properties.',
      code: `# Vulcanisation: cross-linking calculator
chain_length = 5000       # monomers per chain
monomer_mw = 68.12        # g/mol
sulphur_mw = 32.07        # g/mol per S atom
crosslink_S_atoms = 2     # average S atoms per cross-link

# Different levels of vulcanisation
print("VULCANISATION LEVELS")
print("=" * 70)
print(f"{'Type':<14} | {'S %':>5} | {'X-links/chain':>13} | {'Spacing':>8} | {'Application'}")
print("-" * 70)

vulc_levels = [
    ("Unvulcanised", 0, "Sticky, useless"),
    ("Soft rubber",  1.5, "Rubber bands, gloves"),
    ("Medium",       5, "Shoe soles, gaskets"),
    ("Tyre rubber",  8, "Car and truck tyres"),
    ("Hard rubber",  30, "Bowling balls, combs"),
    ("Ebonite",      50, "Electrical insulation"),
]

for name, s_pct, application in vulc_levels:
    if s_pct > 0:
        # Calculate cross-links
        total_mw = chain_length * monomer_mw
        s_mass = total_mw * s_pct / 100
        s_atoms = s_mass / sulphur_mw
        crosslinks = s_atoms / crosslink_S_atoms
        spacing = chain_length / crosslinks if crosslinks > 0 else 0
        print(f"{name:<14} | {s_pct:>4.1f}% | {crosslinks:>13.0f} | {spacing:>7.0f}  | {application}")
    else:
        print(f"{name:<14} | {s_pct:>4.1f}% | {'none':>13} | {'n/a':>8} | {application}")

print()
# Elasticity model: more cross-links = stiffer
print("STIFFNESS vs CROSS-LINK DENSITY")
print("-" * 40)
for s_pct in [1, 3, 5, 10, 20, 40]:
    total_mw = chain_length * monomer_mw
    crosslinks = (total_mw * s_pct / 100 / sulphur_mw) / crosslink_S_atoms
    # Modulus roughly proportional to cross-link density
    modulus = crosslinks * 0.01  # arbitrary units
    bar = "*" * int(modulus)
    print(f"  S={s_pct:>2d}%: modulus ≈ {modulus:>6.1f} {bar}")`,
      challenge: 'If you add too much sulphur (>50%), the rubber becomes completely rigid. At what sulphur percentage does the cross-link spacing drop below 10 monomers?',
      successHint: 'Vulcanisation is chemistry that changed the world. Without it, there would be no tyres, no waterproof boots, no medical gloves. Tripura\'s rubber industry exists because of this one reaction.',
    },
    {
      title: 'Elasticity — why rubber stretches and snaps back',
      concept: `Rubber\'s elasticity comes from **entropy**. In their natural state, rubber chains are coiled and tangled (high entropy — many possible configurations). When stretched, chains straighten out (low entropy — fewer configurations).

The **Second Law of Thermodynamics** says systems tend toward higher entropy. So stretched rubber "wants" to return to its tangled state — this is the restoring force.

The force to stretch rubber: \`F = nkT × (λ - 1/λ²)\`

where:
- n = number of chain segments per unit volume
- k = Boltzmann constant
- T = temperature (Kelvin)
- λ = stretch ratio (stretched length / original length)

Notice: force **increases with temperature**! This is opposite to most materials (metals weaken when hot). Rubber gets stiffer when heated because thermal energy drives the chains back to their tangled state.

📚 *We will compute the stretch-force relationship and discover why rubber is unique among materials.*`,
      analogy: 'Take a handful of tangled earphone wires. Pull them straight — they want to retangle. That "wanting to retangle" is entropy, and it is the same force that makes rubber snap back. The tangled state has more ways to exist than the straight state.',
      storyConnection: 'Tripura\'s rubber goes into products that rely on elasticity — tyres that absorb bumps, bands that hold things tight, seals that spring back. The entropy-driven elasticity is what makes rubber irreplaceable in these applications.',
      checkQuestion: 'If you heat a stretched rubber band, does it contract or expand?',
      checkAnswer: 'It CONTRACTS. Higher temperature means more thermal energy, which drives the chains more forcefully toward their tangled (contracted) state. This is the opposite of metals, which expand when heated. Try it with a hair dryer and a rubber band!',
      codeIntro: 'Model the elastic force of rubber as a function of stretch ratio and temperature.',
      code: `# Rubber elasticity: entropic force model
# F = n * k * T * (lambda - 1/lambda^2)

k_B = 1.381e-23   # Boltzmann constant (J/K)
n = 1e26           # chains per m^3 (typical for vulcanised rubber)

# Stretch ratio: lambda = stretched / original
stretches = [1.0, 1.5, 2.0, 2.5, 3.0, 4.0, 5.0, 6.0]
T = 300  # Kelvin (room temperature)

print(f"RUBBER ELASTIC FORCE (T = {T}K)")
print("=" * 50)
print(f"{'Stretch':>8} | {'Force (N/m²)':>14} | {'Force (MPa)':>12}")
print("-" * 50)

for lam in stretches:
    F = n * k_B * T * (lam - 1 / lam**2)
    print(f"{lam:>7.1f}x | {F:>14.0f} | {F/1e6:>12.3f}")

print()
# Temperature effect
print("TEMPERATURE EFFECT (at 3x stretch)")
print("-" * 40)
lam = 3.0
for T_c in [-20, 0, 25, 50, 80, 120]:
    T_k = T_c + 273.15
    F = n * k_B * T_k * (lam - 1 / lam**2)
    print(f"  {T_c:>4d}°C: Force = {F/1e6:.3f} MPa")

print()
print("KEY INSIGHT: rubber gets STIFFER with higher temperature!")
print("This is unique — metals get SOFTER when heated.")
print("Reason: elasticity comes from entropy, not energy.")`,
      challenge: 'Compare rubber (entropic elasticity) to steel (energetic elasticity). Steel follows F = E × (λ-1) where E = 200 GPa. Plot both on the same graph for λ from 1.0 to 1.01.',
      successHint: 'Rubber elasticity is driven by entropy — one of the deepest principles in physics. Understanding this explains why rubber behaves so differently from metals, ceramics, and other materials.',
    },
    {
      title: 'Natural vs synthetic rubber — Tripura\'s economic question',
      concept: `Natural rubber (from trees like Tripura\'s Hevea) and synthetic rubber (from petroleum) compete in the global market:

**Natural rubber (NR)**:
- Excellent elasticity and resilience
- Good tear resistance
- Biodegradable
- But: susceptible to UV, ozone, and oil damage

**Styrene-Butadiene Rubber (SBR)** — most common synthetic:
- Better abrasion resistance
- More consistent quality
- Cheaper (depends on oil prices)
- But: poorer elasticity than NR

The global split: ~55% synthetic, ~45% natural. But for aeroplane tyres, surgical gloves, and condoms, natural rubber is irreplaceable.

📚 *We will compare properties numerically and calculate when natural rubber is the better economic choice.*`,
      analogy: 'Natural vs synthetic rubber is like handmade vs factory-made furniture. The factory version is consistent and often cheaper, but the handmade version has qualities (warmth, uniqueness, sustainability) that machines cannot replicate. Both have their place.',
      storyConnection: 'Tripura\'s rubber farmers face competition from synthetic rubber produced in petrochemical plants. Understanding the comparative advantages helps us appreciate why natural rubber remains valuable — and why Tripura\'s plantations are worth protecting.',
      checkQuestion: 'Why is natural rubber still used for aircraft tyres when synthetic rubber is cheaper?',
      checkAnswer: 'Aircraft tyres need extreme heat resistance (landing generates 200°C+), exceptional elasticity (to absorb landing impact), and tear resistance (high-speed contact with rough runways). Natural rubber outperforms synthetic in all three properties at once. No synthetic rubber matches this combination.',
      codeIntro: 'Compare natural and synthetic rubber properties and calculate economic breakeven points.',
      code: `# Natural vs Synthetic rubber comparison

properties = {
    "Tensile strength (MPa)":    {"NR": 25, "SBR": 18, "higher_better": True},
    "Elongation at break (%)":   {"NR": 650, "SBR": 500, "higher_better": True},
    "Resilience (%)":            {"NR": 75, "SBR": 55, "higher_better": True},
    "Abrasion resistance":       {"NR": 65, "SBR": 80, "higher_better": True},
    "Heat resistance (°C)":      {"NR": 100, "SBR": 120, "higher_better": True},
    "Oil resistance":            {"NR": 20, "SBR": 30, "higher_better": True},
    "Ozone resistance":          {"NR": 25, "SBR": 60, "higher_better": True},
    "Cost (INR/kg)":             {"NR": 180, "SBR": 140, "higher_better": False},
}

print("NATURAL RUBBER (NR) vs SYNTHETIC (SBR)")
print("=" * 65)
print(f"{'Property':<28} | {'NR':>6} | {'SBR':>6} | Winner")
print("-" * 65)

nr_wins = 0
sbr_wins = 0

for prop, vals in properties.items():
    nr = vals["NR"]
    sbr = vals["SBR"]
    if vals["higher_better"]:
        winner = "NR" if nr > sbr else "SBR"
    else:
        winner = "NR" if nr < sbr else "SBR"

    if winner == "NR":
        nr_wins += 1
    else:
        sbr_wins += 1
    print(f"{prop:<28} | {nr:>6} | {sbr:>6} | {winner}")

print(f"\\\nNR wins: {nr_wins} categories, SBR wins: {sbr_wins} categories")

# Economic analysis
print("\\\nECONOMIC COMPARISON")
print("-" * 55)
nr_price = 180    # INR/kg
sbr_price = 140   # INR/kg
nr_lifetime_multiplier = 1.3  # NR products last 30% longer

print(f"NR price: ₹{nr_price}/kg")
print(f"SBR price: ₹{sbr_price}/kg")
print(f"NR lifetime advantage: {(nr_lifetime_multiplier-1)*100:.0f}% longer")
print(f"NR cost per lifetime-kg: ₹{nr_price/nr_lifetime_multiplier:.0f}/effective-kg")
print(f"SBR cost per lifetime-kg: ₹{sbr_price}/effective-kg")
print()

if nr_price / nr_lifetime_multiplier < sbr_price:
    print("NR is actually CHEAPER per unit of service life!")
else:
    print("SBR is cheaper even accounting for NR's longer life.")

print(f"\\\nTripura produced ~85,000 tonnes of natural rubber in 2023.")
print(f"At ₹{nr_price}/kg, that is ₹{85000 * 1000 * nr_price / 1e9:.1f} billion in revenue.")
print("Natural rubber is not just agriculture — it is high-value chemistry.")`,
      challenge: 'Oil prices affect SBR cost (SBR is petroleum-derived). If oil doubles, SBR price rises 40%. At what oil price does NR become cheaper per kg?',
      successHint: 'The natural vs synthetic debate is not just chemistry — it is economics, ecology, and livelihoods. Tripura\'s rubber farmers participate in a global market shaped by polymer science.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Polymer Chemistry & Materials Science</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L1-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint} />
        ))}
      </div>
    </div>
  );
}
