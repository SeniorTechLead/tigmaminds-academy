import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function ManhattanLevel1() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'E = mc² — calculating the energy in matter',
      concept: `Einstein's most famous equation says that **mass and energy are the same thing**, related by the speed of light squared:

**E = mc²**

The speed of light (c) is 300,000,000 m/s. Squared, that's **9 × 10¹⁶** — an enormous number. This means even a tiny amount of mass contains a staggering amount of energy.

How much energy is in 1 kilogram of matter? E = 1 × (3×10⁸)² = **9 × 10¹⁶ joules** — equivalent to about **21 kilotons of TNT** or the energy released by the Hiroshima bomb. All from one kilogram.

In nuclear fission, about **0.1%** of the uranium mass is converted to energy. That seems tiny — but 0.1% of 9 × 10¹⁶ is still 9 × 10¹³ joules — roughly the output of a power plant for a full day.

For comparison, burning 1 kg of coal converts about **0.00000003%** of its mass to energy. Nuclear reactions are roughly **ten million times** more energetic per kilogram than chemical reactions.

📚 *E = mc² doesn't just apply to nuclear reactions. It applies to ALL energy. When you burn wood, a tiny amount of mass "disappears" — converted to heat and light. The amount is so small (~10⁻¹⁰ kg per joule) that it's unmeasurable with ordinary scales. Nuclear reactions just convert millions of times more mass.*`,
      analogy: 'Imagine a piggy bank containing a million dollars in coins. You can spend the coins one at a time (chemical energy — tiny amounts of mass converted). Or you can smash the piggy bank and scatter all the coins at once (nuclear energy — a significant fraction of mass converted). Same bank, vastly different withdrawal rates.',
      storyConnection: 'The Manhattan Project scientists calculated that 1 kg of fissile uranium-235 would release energy equivalent to 20,000 tonnes of TNT. This calculation — directly from E = mc² — told them a single bomb smaller than a basketball could destroy an entire city. The physics was simple; the implications were staggering.',
      checkQuestion: 'How much energy (in joules) is contained in the mass of a single grain of rice (~25 mg)?',
      checkAnswer: 'E = 0.000025 kg × (3×10⁸)² = 0.000025 × 9×10¹⁶ = 2.25 × 10¹² joules = 2.25 terajoules. That\'s enough energy to power a house for about 70 years. The energy is there — we just can\'t access it (you\'d need to convert ALL the mass to energy, which requires matter-antimatter annihilation).',
      codeIntro: 'Calculate mass-energy equivalence for different materials and compare nuclear vs chemical energy.',
      code: `import numpy as np

c = 3e8  # speed of light (m/s)
c_squared = c ** 2  # 9 × 10¹⁶ m²/s²

def mass_to_energy(mass_kg):
    """E = mc² — total energy content of a given mass."""
    return mass_kg * c_squared

def energy_comparison(mass_kg, conversion_efficiency):
    """
    Energy actually released at a given conversion efficiency.
    Nuclear fission: ~0.1% efficiency
    Chemical burning: ~0.0000001% efficiency
    """
    return mass_kg * c_squared * conversion_efficiency

# How much energy is in everyday objects?
print("=== E = mc² — Energy Content of Matter ===")
print(f"Speed of light: {c:.0e} m/s")
print(f"c² = {c_squared:.0e} m²/s²")
print()

objects = [
    ("Grain of rice", 0.000025),
    ("Penny (coin)", 0.0025),
    ("Apple", 0.2),
    ("Textbook", 1.0),
    ("Human body", 70),
    ("Car", 1500),
    ("Saturn V rocket", 2970000),
]

print(f"{'Object':<20} {'Mass (kg)':>12} {'Energy (joules)':>16} {'TNT equivalent':>16}")
print("-" * 66)

for name, mass in objects:
    energy = mass_to_energy(mass)
    tnt_tonnes = energy / 4.184e9  # 1 tonne TNT = 4.184 GJ
    if tnt_tonnes > 1e6:
        tnt_str = f"{tnt_tonnes/1e6:.0f} Mt"
    elif tnt_tonnes > 1e3:
        tnt_str = f"{tnt_tonnes/1e3:.0f} kt"
    else:
        tnt_str = f"{tnt_tonnes:.0f} t"
    print(f"{name:<20} {mass:>10.4f} {energy:>14.2e} {tnt_str:>16}")

# Nuclear vs chemical comparison
print(f"\\n=== Nuclear vs Chemical Energy (per kg of fuel) ===")
reactions = [
    ("Wood burning", 1.0, 1.6e7, 0.0000000002),
    ("Coal burning", 1.0, 2.4e7, 0.0000000003),
    ("TNT explosion", 1.0, 4.2e6, 0.00000000005),
    ("Uranium fission", 1.0, 8.2e13, 0.001),
    ("Deuterium fusion", 1.0, 3.4e14, 0.004),
    ("Matter-antimatter", 1.0, 9e16, 1.0),
]

print(f"{'Reaction':<22} {'Energy/kg':>12} {'Efficiency':>12} {'vs Coal':>10}")
print("-" * 58)

coal_energy = 2.4e7
for name, mass, energy, eff in reactions:
    ratio = energy / coal_energy
    print(f"{name:<22} {energy:>10.2e} J {eff:>10.4%} {ratio:>8.0f}×")

# The Hiroshima bomb
print(f"\\n=== Hiroshima Bomb (Little Boy) ===")
u235_mass = 64  # kg of uranium-235
fission_fraction = 0.013  # only 1.3% actually fissioned
fissioned_mass = u235_mass * fission_fraction
mass_converted = fissioned_mass * 0.001  # 0.1% of fissioned mass → energy
energy_j = mass_converted * c_squared
energy_kt = energy_j / 4.184e12

print(f"U-235 in bomb: {u235_mass} kg")
print(f"Actually fissioned: {fissioned_mass:.1f} kg ({fission_fraction*100:.1f}%)")
print(f"Mass converted to energy: {mass_converted*1000:.1f} grams")
print(f"Energy released: {energy_j:.2e} J = {energy_kt:.0f} kilotons of TNT")
print(f"\\nLess than ONE GRAM of matter was converted to energy.")
print(f"That gram destroyed a city.")`,
      challenge: 'The Sun converts 4 million tonnes of mass to energy every second (via nuclear fusion). Calculate its power output in watts. Then calculate how long the Sun can sustain this rate before losing 10% of its mass (2×10²⁹ kg). Is the Sun in danger of "running out"?',
      successHint: 'E = mc² is the most famous equation in physics — and you just applied it quantitatively. The key insight: matter IS energy, compressed by the enormous factor of c². Chemical reactions tap a billionth of this energy. Nuclear reactions tap a thousandth. The rest remains locked in matter — for now.',
    },
    {
      title: 'Chain reactions — exponential neutron multiplication',
      concept: `When a uranium-235 nucleus splits (fissions), it releases 2-3 **neutrons**. Each of those neutrons can strike another U-235 nucleus, causing it to fission and release 2-3 MORE neutrons. This is a **chain reaction**.

If the multiplication factor **k** (neutrons produced per fission that go on to cause another fission) is greater than 1, the reaction grows exponentially:

**Generation 1**: 1 fission → 2.5 neutrons → 2.5 fissions
**Generation 2**: 2.5 → 6.25
**Generation 3**: 6.25 → 15.6
**Generation n**: 2.5ⁿ fissions

After 80 generations (about 1 microsecond in a bomb): 2.5⁸⁰ ≈ **10³²** fissions. That's more than enough to convert a kilogram of uranium to energy.

The critical parameter is **k-effective**: the average number of neutrons from each fission that cause another fission. If k > 1: supercritical (explosion). If k = 1: critical (steady reactor). If k < 1: subcritical (reaction dies).

📚 *A nuclear reactor maintains k = 1.0000 (exactly). Control rods absorb neutrons to keep k from exceeding 1. A nuclear bomb is designed to achieve k >> 1 for as long as possible — the opposite of control.*`,
      analogy: 'Imagine a room full of mousetraps, each loaded with two ping-pong balls. Toss one ball in — it triggers one trap, which launches 2 balls, each triggering another trap, launching 2 more each. After 10 "generations": 1,024 balls flying. After 20: over a million. That\'s a chain reaction — and it happens in microseconds with neutrons.',
      storyConnection: 'Enrico Fermi achieved the first controlled chain reaction on December 2, 1942, under the squash court at the University of Chicago. The "safety system" was a man on a platform with an axe, ready to cut a rope that would drop a neutron-absorbing cadmium rod into the pile if k exceeded 1. It worked — barely.',
      checkQuestion: 'If k = 2 (each fission causes 2 more) and the chain starts with 1 neutron, how many fissions occur in generation 20?',
      checkAnswer: '2²⁰ = 1,048,576. In generation 40: 2⁴⁰ ≈ 1.1 trillion. In generation 80: 2⁸⁰ ≈ 1.2 × 10²⁴. This exponential growth is why nuclear weapons release their energy in microseconds — the chain reaction doubles every ~10 nanoseconds.',
      codeIntro: 'Simulate a nuclear chain reaction — track neutron populations in subcritical, critical, and supercritical scenarios.',
      code: `import numpy as np

def chain_reaction(k_effective, generations, initial_neutrons=1):
    """
    Simulate a nuclear chain reaction.
    k_effective: neutrons per fission that cause another fission
    generations: number of fission generations
    """
    neutrons = initial_neutrons
    history = [neutrons]

    for gen in range(generations):
        neutrons *= k_effective
        history.append(neutrons)

    return history

# Compare subcritical, critical, and supercritical
print("=== Nuclear Chain Reaction Simulation ===")
print()

scenarios = [
    ("Subcritical (k=0.9)", 0.9),
    ("Critical (k=1.0)", 1.0),
    ("Barely supercritical (k=1.01)", 1.01),
    ("Reactor startup (k=1.001)", 1.001),
    ("Supercritical (k=1.5)", 1.5),
    ("Bomb (k=2.5)", 2.5),
]

print(f"{'Scenario':<30} {'Gen 10':>12} {'Gen 20':>12} {'Gen 40':>12} {'Gen 80':>12}")
print("-" * 80)

for name, k in scenarios:
    history = chain_reaction(k, 80)
    g10 = history[10] if len(history) > 10 else history[-1]
    g20 = history[20] if len(history) > 20 else history[-1]
    g40 = history[40] if len(history) > 40 else history[-1]
    g80 = history[80] if len(history) > 80 else history[-1]
    print(f"{name:<30} {g10:>12.2e} {g20:>12.2e} {g40:>12.2e} {g80:>12.2e}")

# Time scale
print(f"\\n=== Time Scale ===")
generation_time_ns = 10  # nanoseconds per generation (approximate)
print(f"One generation: ~{generation_time_ns} nanoseconds")
print(f"80 generations: {80 * generation_time_ns} ns = {80 * generation_time_ns / 1000:.1f} microseconds")
print(f"A nuclear explosion completes in about 1 microsecond.")

# Energy release
print(f"\\n=== Energy Released ===")
energy_per_fission_MeV = 200  # MeV per fission
energy_per_fission_J = energy_per_fission_MeV * 1.6e-13  # joules

for name, k in [("Reactor (k=1.0, controlled)", 1.0), ("Bomb (k=2.5)", 2.5)]:
    total_fissions = sum(chain_reaction(k, 80))
    total_energy_J = total_fissions * energy_per_fission_J
    total_energy_kt = total_energy_J / 4.184e12

    if total_energy_kt > 1e6:
        energy_str = f"{total_energy_kt:.2e} kt"
    elif total_energy_kt > 1:
        energy_str = f"{total_energy_kt:.0f} kt"
    else:
        energy_str = f"{total_energy_kt*1e6:.0f} joules"

    print(f"{name}: {total_fissions:.2e} fissions → {energy_str}")

# Critical mass calculation
print(f"\\n=== Critical Mass ===")
print(f"For a SPHERE of pure U-235:")
print(f"  k depends on: size, shape, density, and purity")
print(f"  Larger sphere → fewer neutrons escape → higher k")
print(f"  Critical mass ≈ 52 kg for a bare sphere (about 17 cm diameter)")
print(f"  With a neutron reflector: ≈ 15 kg (about 11 cm diameter)")

# Why sphere?
print(f"\\n=== Why a Sphere? ===")
shapes = [
    ("Sphere", 4.84, 1.00),         # SA/V for unit volume
    ("Cube", 6.00, 1.24),
    ("Cylinder (L=D)", 5.54, 1.14),
    ("Thin disk", 12.57, 2.60),
]

print(f"{'Shape':<20} {'SA/V ratio':>12} {'Relative':>10}")
print("-" * 44)
for name, sav, rel in shapes:
    print(f"{name:<20} {sav:>10.2f} {rel:>8.2f}×")

print(f"\\nA sphere has the SMALLEST surface-area-to-volume ratio.")
print(f"Since neutrons escape through the surface, a sphere")
print(f"minimises escape → maximises k → requires least material.")`,
      challenge: 'A reactor maintains k = 1.0000, but a control rod accidentally withdraws, increasing k to 1.003. How many generations until the neutron population doubles? (Solve: 1.003ⁿ = 2 → n = ln(2)/ln(1.003) ≈ 231 generations ≈ 2.3 microseconds.) Why is even this tiny deviation dangerous? (Because it leads to uncontrolled power increase within milliseconds.)',
      successHint: 'You simulated nuclear chain reactions — the same physics that powers nuclear reactors, nuclear weapons, and stars. The key parameter (k-effective) determines whether you get a controlled reactor (k=1), a fizzle (k<1), or an explosion (k>>1). The entire field of nuclear engineering is about controlling k.',
    },
    {
      title: 'Isotope separation — the hardest part of the bomb',
      concept: `Natural uranium is **99.3% uranium-238** and only **0.7% uranium-235**. Only U-235 fissions easily — U-238 absorbs neutrons without splitting. To make a bomb (or reactor fuel), you need to **separate** these two isotopes and concentrate the U-235.

The problem: U-235 and U-238 are **chemically identical**. They have the same number of electrons, the same chemical bonds, and the same reactions. The ONLY difference is mass: U-235 has 3 fewer neutrons, making it **1.3% lighter**.

Separating materials that differ by only 1.3% in mass is extraordinarily difficult. The Manhattan Project used three methods simultaneously:

1. **Gaseous diffusion**: convert uranium to a gas (UF₆), pump it through a porous barrier. Lighter U-235 molecules diffuse slightly faster. Each pass provides only a tiny enrichment — you need **thousands of passes** in series.

2. **Electromagnetic separation** (calutrons): ionize the uranium and shoot it through a magnetic field. Lighter U-235 ions curve more tightly. Separate the two beams at the end.

3. **Thermal diffusion**: hot uranium gas rises faster if it's lighter. Columns of hot and cold fluid separate the isotopes by convection.

📚 *Enrichment is measured in percentage of U-235. Natural uranium: 0.7%. Reactor fuel: 3-5%. Weapons-grade: 90%+. Going from 0.7% to 90% requires enormous energy and infrastructure — the Oak Ridge enrichment plant consumed more electricity than New York City.*`,
      analogy: 'Imagine separating white sugar from confectioner\'s sugar (powdered sugar). They\'re chemically identical — both are sucrose. They differ only in particle size. You could use a sieve: the finer powder passes through, the larger crystals don\'t. But if the size difference were only 1.3%, you\'d need an incredibly fine sieve — and you\'d have to sieve thousands of times to get a pure sample. That\'s isotope separation.',
      storyConnection: 'The enrichment plants at Oak Ridge, Tennessee employed 75,000 workers and consumed more electricity than New York City. Most workers didn\'t know what they were making. The massive scale was necessary because each separation step provides only a tiny improvement — thousands of steps are needed in series.',
      checkQuestion: 'If each gaseous diffusion stage enriches U-235 by a factor of 1.0043 (a 0.43% improvement), how many stages are needed to go from 0.7% to 90% U-235?',
      checkAnswer: 'We need 0.007 × 1.0043ⁿ = 0.90. So 1.0043ⁿ = 128.6. Taking ln: n × ln(1.0043) = ln(128.6). n = 4.857 / 0.00429 ≈ 1,132 stages. Over a thousand stages in series — which is why the Oak Ridge plant was enormous.',
      codeIntro: 'Model uranium enrichment — calculate how many separation stages are needed and the energy cost.',
      code: `import numpy as np

def gaseous_diffusion_stages(natural_pct=0.7, target_pct=90.0,
                              separation_factor=1.0043):
    """
    Calculate the number of gaseous diffusion stages needed.
    Each stage enriches U-235 by the separation factor.
    """
    current = natural_pct / 100
    target = target_pct / 100
    stages = 0

    enrichment_history = [current * 100]

    while current < target:
        # Enrichment formula (simplified)
        current = current * separation_factor / (current * separation_factor + (1-current))
        stages += 1
        if stages % 100 == 0:
            enrichment_history.append(current * 100)

    enrichment_history.append(current * 100)
    return stages, enrichment_history

# Calculate stages for different targets
print("=== Uranium Enrichment Calculator ===")
print(f"Starting: natural uranium (0.7% U-235)")
print(f"Separation factor per stage: 1.0043")
print()

targets = [
    ("Reactor fuel (low enriched)", 3.5),
    ("Research reactor", 20.0),
    ("Naval reactor", 60.0),
    ("Weapons grade", 90.0),
    ("Super weapons grade", 95.0),
]

print(f"{'Target':<35} {'Enrichment %':>13} {'Stages':>8}")
print("-" * 58)

for name, target in targets:
    stages, _ = gaseous_diffusion_stages(target_pct=target)
    print(f"{name:<35} {target:>11.1f}% {stages:>8,}")

# Energy cost
print(f"\\n=== Energy Cost of Enrichment ===")
# SWU (Separative Work Unit) model
def swu_needed(product_pct, feed_pct=0.7, tails_pct=0.3, product_kg=1):
    """
    Calculate Separative Work Units needed.
    SWU is the standard measure of enrichment effort.
    """
    def V(x):
        """Value function for enrichment."""
        x = x / 100
        if x <= 0 or x >= 1:
            return 0
        return (2 * x - 1) * np.log(x / (1 - x))

    xp = product_pct / 100  # product enrichment
    xf = feed_pct / 100     # feed enrichment
    xt = tails_pct / 100    # tails enrichment

    # Feed and tails needed per kg of product
    feed_kg = product_kg * (xp - xt) / (xf - xt)
    tails_kg = feed_kg - product_kg

    # SWU = P×V(xp) + W×V(xt) - F×V(xf)
    swu = product_kg * V(product_pct) + tails_kg * V(tails_pct * 100) - feed_kg * V(feed_pct)

    return swu, feed_kg

print(f"To produce 1 kg of enriched uranium:")
print(f"{'Product enrichment':>20} {'SWU needed':>12} {'Natural U needed':>18} {'Energy (MWh)':>14}")
print("-" * 66)

for pct in [3.5, 5, 20, 60, 90]:
    swu, feed = swu_needed(pct)
    energy_mwh = swu * 50  # ~50 kWh per SWU for gaseous diffusion
    energy_mwh /= 1000
    print(f"{pct:>18.1f}% {swu:>10.0f} {feed:>15.0f} kg {energy_mwh:>12.0f}")

# Manhattan Project scale
print(f"\\n=== Manhattan Project — Oak Ridge ===")
heu_needed_kg = 64  # kg of HEU for Little Boy
swu_per_kg, feed_per_kg = swu_needed(90)
total_swu = swu_per_kg * heu_needed_kg
total_feed = feed_per_kg * heu_needed_kg
total_energy_gwh = total_swu * 50 / 1e6

print(f"HEU needed: {heu_needed_kg} kg at 90% enrichment")
print(f"Natural uranium feed: {total_feed:,.0f} kg ({total_feed/1000:.0f} tonnes)")
print(f"Total SWU: {total_swu:,.0f}")
print(f"Energy consumed: ~{total_energy_gwh:.0f} GWh")
print(f"That's the annual electricity consumption of a city of ~1 million people")
print(f"dedicated ENTIRELY to enriching 64 kg of uranium.")

# Why this matters for nonproliferation
print(f"\\n=== Nonproliferation Implications ===")
print(f"The hardest part of making a nuclear weapon is NOT the physics —")
print(f"it's the ENRICHMENT. Any physics student can design a gun-type bomb.")
print(f"But building a gaseous diffusion plant requires:")
print(f"  • 1,000+ cascaded separation stages")
print(f"  • Enormous electrical power (GWh)")
print(f"  • Specialized materials (corrosion-resistant alloys for UF₆)")
print(f"  • Years of operation")
print(f"This is why nuclear nonproliferation focuses on monitoring")
print(f"enrichment activities — they're the bottleneck for weapons production.")`,
      challenge: 'Modern centrifuges have a separation factor of about 1.3 per stage (compared to 1.0043 for gaseous diffusion). How many centrifuge stages are needed for 90% enrichment? How does this change the energy calculation? (Far fewer stages needed — which is why centrifuge technology is so concerning for nonproliferation.)',
      successHint: 'You modeled uranium enrichment — one of the most closely guarded industrial processes in the world. The mathematics (exponential enrichment over many stages, energy costs, feed requirements) is the basis of nuclear nonproliferation policy. Monitoring enrichment activities is how the IAEA prevents nuclear proliferation.',
    },
    {
      title: 'Critical mass — the geometry of chain reactions',
      concept: `A chain reaction is self-sustaining only if enough neutrons stay inside the material to cause further fissions. Many neutrons **escape** through the surface before hitting another uranium nucleus. Whether the reaction sustains itself depends on the **ratio of volume to surface area**.

Neutrons are produced throughout the **volume** of the material (proportional to r³ for a sphere). Neutrons escape through the **surface** (proportional to r²). As the sphere gets larger, volume grows faster than surface area — more neutrons are produced than escape — and eventually the chain reaction becomes self-sustaining.

The **critical mass** is the minimum mass at which k-effective = 1.0 (self-sustaining). For a sphere of pure U-235, this is about **52 kg** (diameter ~17 cm). With a **neutron reflector** (a shell of dense material that bounces escaping neutrons back), it drops to about **15 kg**.

Why a sphere? Because a sphere has the **smallest surface-area-to-volume ratio** of any shape. Less surface = fewer neutrons escaping = lower critical mass. Any other shape (cube, cylinder, flat plate) requires more material for the same effect.

📚 *The "demon core" — a 6.2 kg plutonium sphere — killed two physicists in 1945-46 during criticality experiments at Los Alamos. In both accidents, the sphere briefly went supercritical when a neutron reflector was accidentally positioned too close.*`,
      analogy: 'Imagine a crowd of people in a room, each holding a ball. Everyone throws their ball in a random direction. In a small room, most balls hit the walls (escape). In a large room, most balls hit another person (cause a "fission"). The critical mass is the room size at which, on average, each ball-thrower\'s ball hits exactly one other person.',
      storyConnection: 'The bomb designers at Los Alamos had to assemble a supercritical mass FAST — before the chain reaction could generate enough energy to blow the material apart (which would stop the reaction). The gun-type bomb fired one piece of uranium into another at high speed. The implosion bomb compressed plutonium from all sides simultaneously, increasing its density and reducing the critical mass.',
      checkQuestion: 'Why does a sphere of uranium that\'s slightly below critical mass NOT sustain a chain reaction, even though fissions are occurring?',
      checkAnswer: 'Because each fission produces neutrons, but too many escape through the surface before hitting another U-235 nucleus. On average, each fission causes less than one subsequent fission (k < 1). The reaction produces some energy but quickly dies out — like a fire that can\'t sustain itself because the wood is too spread out.',
      codeIntro: 'Calculate critical mass for different shapes, materials, and reflector configurations.',
      code: `import numpy as np

def surface_area_to_volume(shape, mass_kg, density_kg_m3):
    """Calculate SA/V ratio for different shapes at a given mass."""
    volume = mass_kg / density_kg_m3

    if shape == "sphere":
        r = (3 * volume / (4 * np.pi)) ** (1/3)
        sa = 4 * np.pi * r**2
    elif shape == "cube":
        side = volume ** (1/3)
        sa = 6 * side**2
    elif shape == "cylinder_equal":  # height = diameter
        r = (volume / (2 * np.pi)) ** (1/3)
        h = 2 * r
        sa = 2 * np.pi * r**2 + 2 * np.pi * r * h
    elif shape == "thin_disk":  # height = diameter/10
        r = (10 * volume / np.pi) ** (1/3)
        h = r / 5
        sa = 2 * np.pi * r**2 + 2 * np.pi * r * h

    return sa / volume, sa, volume

def critical_mass_model(density, mean_free_path, neutrons_per_fission=2.5):
    """
    Simplified model of critical mass.
    Critical when: volume/surface × (neutrons-1) × cross_section > 1
    """
    # For a sphere: V/SA = r/3
    # Critical radius: r_crit ~ 3 × mean_free_path / (neutrons_per_fission - 1)
    r_crit = 3 * mean_free_path / (neutrons_per_fission - 1)
    v_crit = (4/3) * np.pi * r_crit**3
    m_crit = v_crit * density
    return m_crit, r_crit

# Material properties
materials = [
    ("Uranium-235", 19050, 0.065),    # density kg/m³, mean free path m
    ("Plutonium-239", 19816, 0.055),
    ("Uranium-233", 18950, 0.057),
]

print("=== Critical Mass Calculator ===")
print(f"\\n{'Material':<20} {'Density':>8} {'Crit Mass':>12} {'Diameter':>10}")
print("-" * 52)

for name, density, mfp in materials:
    mass, radius = critical_mass_model(density, mfp)
    diameter = radius * 2 * 100  # cm
    print(f"{name:<20} {density:>6} kg/m³ {mass:>8.1f} kg {diameter:>8.1f} cm")

# Effect of shape on critical mass
print(f"\\n=== Effect of Shape (U-235, bare) ===")
u235_density = 19050
u235_crit_sphere = 52  # kg (known value)

shapes = ["sphere", "cube", "cylinder_equal", "thin_disk"]
print(f"{'Shape':<20} {'SA/V (1/m)':>12} {'Relative SA/V':>14} {'Est Crit Mass':>14}")
print("-" * 62)

# Use sphere as reference
_, _, sphere_vol = surface_area_to_volume("sphere", u235_crit_sphere, u235_density)
sphere_sav, _, _ = surface_area_to_volume("sphere", u235_crit_sphere, u235_density)

for shape in shapes:
    sav, _, _ = surface_area_to_volume(shape, u235_crit_sphere, u235_density)
    ratio = sav / sphere_sav
    # Critical mass scales with (SA/V)³ for this simplified model
    est_crit = u235_crit_sphere * ratio**1.5
    print(f"{shape:<20} {sav:>10.1f} {ratio:>12.2f}× {est_crit:>12.1f} kg")

# Effect of reflector
print(f"\\n=== Effect of Neutron Reflector ===")
print(f"A dense shell around the core bounces escaping neutrons back.")
reflectors = [
    ("Bare (no reflector)", 1.0),
    ("Natural uranium shell", 0.6),
    ("Beryllium shell", 0.4),
    ("Tungsten shell", 0.35),
    ("Thick steel shell", 0.5),
]

print(f"{'Reflector':<24} {'Factor':>8} {'U-235 Crit Mass':>16}")
print("-" * 50)
for name, factor in reflectors:
    crit = u235_crit_sphere * factor
    diameter = 2 * (3 * crit / (4 * np.pi * u235_density) / 1000) ** (1/3) * 100
    print(f"{name:<24} {factor:>6.2f}× {crit:>12.1f} kg ({diameter:.0f} cm)")

# Compression (implosion)
print(f"\\n=== Effect of Compression (Implosion Design) ===")
print(f"Compressing the material increases density → decreases critical mass")
for compression in [1.0, 1.5, 2.0, 2.5, 3.0]:
    new_density = u235_density * compression
    # Critical mass scales as 1/density²
    new_crit = u235_crit_sphere / compression**2
    print(f"  Compression {compression:.1f}×: density = {new_density:.0f} kg/m³, "
          f"crit mass = {new_crit:.1f} kg")`,
      challenge: 'The "demon core" (6.2 kg of plutonium) was subcritical by itself but went supercritical when surrounded by a neutron reflector. Calculate: at what reflector efficiency (fraction of escaping neutrons bounced back) does 6.2 kg of Pu-239 (bare critical mass ~10 kg) become critical? This is the calculation that determines safety margins in nuclear facilities.',
      successHint: 'You calculated critical masses and explored the geometry of chain reactions — the same physics used by nuclear engineers to design reactors, physicists to design experiments, and IAEA inspectors to assess weapons capabilities. The surface-area-to-volume ratio is the key — the same principle that governs drug dissolution, heat exchange, and chemical reactor design.',
    },
    {
      title: 'The Trinity test — simulating the first nuclear explosion',
      concept: `On July 16, 1945, at 5:29 AM, the world's first nuclear device was detonated at the Trinity test site in New Mexico. The explosion released approximately **21 kilotons of TNT equivalent** energy.

We can model the fireball's expansion using the **Taylor-Sedov blast wave solution** (derived independently by G.I. Taylor and L.I. Sedov). Taylor famously used declassified photographs of the Trinity test to calculate the bomb's yield — just from the fireball's radius at different times.

The key relationship: **R = C × (E × t² / ρ)^(1/5)**

Where R is the fireball radius, E is the energy released, t is time, ρ is the ambient air density, and C is a constant (~1.0).

This equation tells you that if you know the fireball's radius at a known time (from a photograph with a time stamp), you can solve for E — the bomb's energy. Taylor published this calculation in 1950, and it matched the classified yield to within 10%.

📚 *Taylor's derivation was a triumph of dimensional analysis: he showed that only ONE combination of E, t, and ρ gives a quantity with dimensions of length. The physics dictates the answer before any detailed calculation.*`,
      analogy: 'Drop a stone in water and measure how far the ripples travel after 1 second. Bigger stone → more energy → faster/further ripples. By measuring the ripple radius and the time, you can calculate the stone\'s energy. Taylor did exactly this with the Trinity fireball — measuring "ripple radius" from photographs.',
      storyConnection: 'Test director Kenneth Bainbridge turned to Oppenheimer after the explosion and said: "Now we are all sons of bitches." Oppenheimer recalled a line from the Bhagavad Gita: "Now I am become Death, the destroyer of worlds." The steel tower that held the device was vaporized. The sand beneath was fused into green glass called trinitite.',
      checkQuestion: 'Taylor estimated the Trinity yield from a photo showing a fireball radius of 100 metres at 0.006 seconds. Given R = (E×t²/ρ)^(1/5) and ρ = 1.2 kg/m³, what was his estimate of E?',
      checkAnswer: 'R⁵ = E × t² / ρ. So E = R⁵ × ρ / t² = 100⁵ × 1.2 / 0.006² = 10¹⁰ × 1.2 / 3.6×10⁻⁵ = 3.3 × 10¹⁴ joules ≈ 80 kt. Taylor\'s actual published estimate was ~22 kt (he used a more refined model). The order of magnitude is correct from this simple calculation.',
      codeIntro: 'Model the Trinity blast — calculate fireball expansion, energy release, and yield estimation from photographs.',
      code: `import numpy as np

def fireball_radius(energy_J, time_s, air_density=1.2):
    """
    Taylor-Sedov blast wave solution.
    R = (E × t² / ρ) ^ (1/5)
    """
    return (energy_J * time_s**2 / air_density) ** 0.2

def estimate_yield(radius_m, time_s, air_density=1.2):
    """
    Estimate energy from fireball radius and time.
    E = R⁵ × ρ / t²
    """
    return radius_m**5 * air_density / time_s**2

# Trinity test: known yield = 21 kilotons
kt_to_joules = 4.184e12  # 1 kiloton = 4.184 × 10¹² joules
trinity_yield_J = 21 * kt_to_joules

print("=== Trinity Test — Fireball Expansion ===")
print(f"Energy: 21 kt = {trinity_yield_J:.2e} J")
print()

# Calculate fireball radius at different times
print(f"{'Time (ms)':>10} {'Time (s)':>10} {'Radius (m)':>12} {'Radius (ft)':>12}")
print("-" * 46)

times_ms = [0.1, 0.5, 1, 2, 4, 6, 10, 16, 25, 62, 100]

for t_ms in times_ms:
    t_s = t_ms / 1000
    r = fireball_radius(trinity_yield_J, t_s)
    r_ft = r * 3.281
    print(f"{t_ms:>8.1f} {t_s:>8.4f} {r:>10.1f} {r_ft:>10.0f}")

# Taylor's method: estimate yield from a photograph
print(f"\\n=== Taylor's Yield Estimation ===")
print(f"Using declassified photographs of the Trinity test:")

# Simulated photo measurements (close to historical values)
photos = [
    (0.1, 11),    # 0.1 ms, ~11 m radius
    (1.0, 34),    # 1 ms, ~34 m
    (3.26, 59),   # 3.26 ms, ~59 m
    (6.0, 75),    # 6 ms, ~75 m
    (15.0, 100),  # 15 ms, ~100 m
    (62.0, 150),  # 62 ms, ~150 m
]

print(f"\\n{'Time (ms)':>10} {'Radius (m)':>12} {'Est Yield (kt)':>16} {'Error':>8}")
print("-" * 48)

for t_ms, r_m in photos:
    t_s = t_ms / 1000
    est_energy = estimate_yield(r_m, t_s)
    est_kt = est_energy / kt_to_joules
    error_pct = (est_kt - 21) / 21 * 100
    print(f"{t_ms:>8.1f} {r_m:>10.0f} {est_kt:>14.1f} {error_pct:>+7.0f}%")

print(f"\\nTaylor's published estimate: ~22 kt (actual: 21 kt)")
print(f"He got within 5% using ONLY photographs and dimensional analysis.")

# Compare nuclear yields
print(f"\\n=== Nuclear Weapon Yields ===")
weapons = [
    ("Davy Crockett (smallest)", 0.02),
    ("Hiroshima (Little Boy)", 15),
    ("Trinity test", 21),
    ("Nagasaki (Fat Man)", 21),
    ("W80 cruise missile", 150),
    ("W88 (Trident SLBM)", 475),
    ("B83 (largest US)", 1200),
    ("Tsar Bomba (largest ever)", 50000),
]

print(f"\\n{'Weapon':<35} {'Yield (kt)':>10} {'Fireball R at 1s':>18}")
print("-" * 65)

for name, yield_kt in weapons:
    energy_J = yield_kt * kt_to_joules
    r = fireball_radius(energy_J, 1.0)
    print(f"{name:<35} {yield_kt:>8.0f} {r:>14.0f} m")

# Ethics consideration
print(f"\\n=== The Human Cost ===")
print(f"Hiroshima (Aug 6, 1945): ~80,000 killed immediately, ~60,000 more by year-end")
print(f"Nagasaki (Aug 9, 1945): ~40,000 killed immediately, ~30,000 more by year-end")
print(f"Total: ~200,000+ deaths, mostly civilians")
print(f"\\nMany Manhattan Project scientists petitioned against using the bomb")
print(f"on cities. The petition never reached President Truman.")
print(f"\\n'The physicists have known sin, and this is a knowledge which")
print(f" they cannot lose.' — J. Robert Oppenheimer, 1947")`,
      challenge: 'If a nuclear weapon were detonated at altitude (10 km up instead of at ground level), how would the fireball behave differently? (Air density at 10 km is about 1/3 of sea level. Use the Taylor-Sedov equation to calculate the fireball radius at different air densities.) This is why high-altitude detonations produce larger fireballs but less ground damage.',
      successHint: 'You applied the Taylor-Sedov blast wave solution — one of the most elegant results in physics. Taylor derived the bomb\'s yield from nothing but photographs, dimensional analysis, and the physics of shock waves. This same physics is used to study supernovae, volcanic eruptions, and industrial explosions. The mathematics doesn\'t choose sides — it merely describes reality.',
    },
    {
      title: 'Nuclear ethics — the science of decision-making under uncertainty',
      concept: `The Manhattan Project posed one of the hardest ethical questions in history: **should we build a weapon that can destroy cities?** The scientists involved were not naive — many agonized over the implications.

The decision framework they faced has parallels throughout science and engineering:
- **The precautionary principle**: if the consequences are catastrophic, should you act even without certainty? (They didn't know if Germany was building a bomb, but the consequence of being second was unthinkable.)
- **Dual use**: every technology can be used for good or harm. Nuclear physics enables both reactors (clean energy) and weapons (mass destruction). Should you develop it knowing both uses?
- **Informed consent**: the scientists chose to work on the project. The people of Hiroshima and Nagasaki did not choose to be bombed. Who bears responsibility?
- **The petition**: Leo Szilard circulated a petition among Manhattan Project scientists urging a demonstration of the bomb before using it on a city. 70 scientists signed. The petition never reached the president.

These are not physics questions — they are **ethical** questions. But they arise from physics, and understanding the science is necessary (though not sufficient) for making good decisions.

📚 *The Bulletin of the Atomic Scientists, founded by Manhattan Project physicists, maintains the Doomsday Clock — a symbolic measure of how close humanity stands to self-destruction. As of 2024, it stands at 90 seconds to midnight — the closest ever.*`,
      analogy: 'A doctor develops a powerful new painkiller. It relieves suffering brilliantly. It\'s also highly addictive and has killed thousands in overdoses. Should the doctor have developed it? Should it be banned? Should it be available with restrictions? There\'s no simple answer — because the same molecule saves AND destroys lives. Nuclear energy poses the identical dilemma at civilizational scale.',
      storyConnection: 'After the war, many scientists who built the bomb became its strongest opponents. Einstein campaigned for nuclear disarmament. Oppenheimer opposed the hydrogen bomb and was stripped of his security clearance. Szilard spent the rest of his life advocating for arms control. They understood the science better than anyone — and that understanding made them the most passionate advocates for restraint.',
      checkQuestion: 'Nuclear power generates 10% of the world\'s electricity with zero carbon emissions. Nuclear weapons threaten human civilization. The physics is the same. Is nuclear physics "good" or "bad"?',
      checkAnswer: 'Neither. Physics is a description of nature — it has no morality. The equation E = mc² doesn\'t care whether the energy powers a city or destroys one. The ethics belong to the PEOPLE who apply the physics. This is the hardest lesson of the Manhattan Project: science gives us power, but not wisdom about how to use it.',
      codeIntro: 'Model ethical decision-making — explore the consequences of different choices using decision theory.',
      code: `import numpy as np

# Decision matrix for the Manhattan Project
print("=== Manhattan Project Decision Analysis ===")
print()
print("The US faced a decision in 1942 with incomplete information.")
print("We can model it as a decision matrix:\\n")

# Decision options
options = [
    "Build the bomb (full program)",
    "Research only (no weapons development)",
    "International control (share with allies)",
    "Don't pursue nuclear research",
]

# Possible world states
states = [
    "Germany builds bomb first",
    "Germany fails to build bomb",
    "No nation builds bomb",
]

# Consequence matrix (simplified utility scores)
# Higher = better outcome for the US
consequences = {
    "Build the bomb (full program)": {
        "Germany builds bomb first": 60,   # US has bomb too, MAD situation
        "Germany fails to build bomb": 80,  # US has monopoly (problematic but safe)
        "No nation builds bomb": 50,        # US has weapon nobody needed
    },
    "Research only (no weapons development)": {
        "Germany builds bomb first": 10,   # Germany has bomb, US doesn't — catastrophic
        "Germany fails to build bomb": 70,  # No one has weapons — good
        "No nation builds bomb": 90,        # Best outcome — peaceful knowledge
    },
    "International control (share with allies)": {
        "Germany builds bomb first": 30,   # Allied response possible but slow
        "Germany fails to build bomb": 85,  # Shared knowledge, no monopoly
        "No nation builds bomb": 95,        # International cooperation
    },
    "Don't pursue nuclear research": {
        "Germany builds bomb first": 5,    # Worst case — Germany dominates
        "Germany fails to build bomb": 75,  # Peace, but missed scientific advances
        "No nation builds bomb": 100,       # Perfect outcome — nuclear physics stays academic
    },
}

# Prior probabilities (what decision-makers estimated in 1942)
priors = {
    "Germany builds bomb first": 0.30,   # US overestimated this
    "Germany fails to build bomb": 0.50,  # Actually most likely
    "No nation builds bomb": 0.20,        # Seemed unlikely given the physics
}

# Expected value calculation
print(f"{'Option':<45} ", end="")
for state in states:
    print(f" {state[:15]:>16}", end="")
print(f"{'Expected Value':>16}")
print("-" * 110)

for option in options:
    print(f"{option:<45}", end="")
    expected = 0
    for state in states:
        score = consequences[option][state]
        prob = priors[state]
        expected += score * prob
        print(f" {score:>16}", end="")
    print(f" {expected:>14.1f}")

print(f"\\nPrior probabilities: ", end="")
for state, prob in priors.items():
    print(f"{prob:.0%} ", end="")
print()

# The decision that was actually made
print(f"\\nActual decision: Build the bomb (full program)")
print(f"Expected value: {sum(consequences['Build the bomb (full program)'][s] * priors[s] for s in states):.1f}")
print()

# What if they had known Germany's program was failing?
print("=== With Perfect Information ===")
print("Germany's program was actually far behind — they never came close.")
revised_priors = {
    "Germany builds bomb first": 0.01,
    "Germany fails to build bomb": 0.89,
    "No nation builds bomb": 0.10,
}

print(f"\\nRevised probabilities:")
for option in options:
    expected = sum(consequences[option][s] * revised_priors[s] for s in states)
    print(f"  {option:<45} EV = {expected:.1f}")

print(f"\\nWith hindsight, 'International control' or 'Research only'")
print(f"would have been better choices. But decisions must be made")
print(f"with the information available AT THE TIME.")

# The ongoing dilemma
print(f"\\n=== Nuclear Power vs Nuclear Weapons ===")
nuclear_data = [
    ("Nuclear power (2024)", "~440 reactors", "10% of world electricity", "Zero CO₂"),
    ("Nuclear weapons (2024)", "~12,500 warheads", "9 nations", "Existential threat"),
    ("Nuclear medicine", "~40M procedures/yr", "Diagnosis & treatment", "Saves millions"),
    ("Nuclear waste", "~300,000 tonnes", "Storage for 100,000+ years", "Unsolved"),
]

print(f"\\n{'Application':<25} {'Scale':>18} {'Benefit/Risk':>24} {'Status':>16}")
print("-" * 85)
for app, scale, benefit, status in nuclear_data:
    print(f"{app:<25} {scale:>18} {benefit:>24} {status:>16}")

print(f"\\n'The release of atomic energy has not created a new problem.")
print(f" It has merely made more urgent the necessity of solving an")
print(f" existing one.' — Albert Einstein, 1946")`,
      challenge: 'Add a "minimax" decision criterion: instead of maximizing expected value, choose the option where the WORST case outcome is the best (minimize maximum regret). Does minimax recommend a different option than expected value? This is the "play it safe" approach — and it\'s what drove the actual decision to build the bomb.',
      successHint: 'You applied decision theory to one of the most consequential choices in human history. The tools (decision matrices, expected value, prior probabilities) are the same ones used in medical ethics, environmental policy, business strategy, and AI safety. The lesson: good decisions require both rigorous analysis AND moral judgment. Mathematics gives you the analysis. Wisdom provides the judgment.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Nuclear physics and ethics through code</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises use Python to model mass-energy equivalence, chain reactions, isotope separation, blast physics, and ethical decision-making.
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
