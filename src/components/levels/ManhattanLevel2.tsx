import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function ManhattanLevel2() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Nuclear binding energy curve — why iron is the most stable nucleus',
      concept: `Every atomic nucleus is held together by the **strong nuclear force**. The **binding energy** is the energy required to pull the nucleus apart into individual protons and neutrons. The more binding energy per nucleon, the more stable the nucleus.

When you plot binding energy per nucleon against mass number (A), you get the famous **binding energy curve**. It rises steeply for light nuclei, peaks near iron-56 (A ~ 56), and gradually declines for heavier nuclei.

This curve explains both **fission** and **fusion**: nuclei heavier than iron can release energy by splitting (fission), while nuclei lighter than iron can release energy by merging (fusion). The Manhattan Project exploited fission — splitting uranium-235 and plutonium-239, which sit far to the right of the iron peak.

The energy released per fission event is approximately: **E = (BE_products - BE_reactants)**, where BE is the total binding energy. For U-235 fission, this is about **200 MeV per atom** — roughly 80 million times more energy than burning one atom of carbon.

📚 *The semi-empirical mass formula (Bethe-Weizsäcker formula) models binding energy as: BE = a_v·A - a_s·A^(2/3) - a_c·Z²/A^(1/3) - a_a·(A-2Z)²/A + δ(A,Z). Each term captures a different physical effect: volume, surface tension, Coulomb repulsion, asymmetry, and pairing.*`,
      analogy: 'Imagine a ball sitting in a valley between two hills. The deeper the valley, the more energy it takes to push the ball out — and the more stable the ball is. Iron-56 sits at the deepest point of the nuclear valley. Uranium sits on a high shelf to the right — a small nudge (one neutron) sends it rolling downhill, releasing all that stored energy as the nucleus splits.',
      storyConnection: 'The Manhattan Project scientists needed to know exactly how much energy each fission event released. The binding energy curve told them: U-235 fission products (barium-141 + krypton-92) are closer to the iron peak, so the difference in binding energy — about 200 MeV per atom — becomes the explosion\'s energy. This is what made the atomic bomb feasible: each kilogram of U-235 contains energy equivalent to 18,000 tonnes of TNT.',
      checkQuestion: 'Iron-56 has a binding energy of 8.79 MeV per nucleon. Uranium-235 has 7.59 MeV per nucleon. If U-235 splits into two fragments near A=118, each with ~8.5 MeV/nucleon, how much energy is released per fission?',
      checkAnswer: 'Products: 235 nucleons × 8.5 MeV = 1,997.5 MeV total. Reactant: 235 × 7.59 = 1,783.7 MeV total. Energy released: 1,997.5 - 1,783.7 ≈ 214 MeV. The actual value is about 200 MeV — our estimate is close. This 200 MeV per atom, multiplied by Avogadro\'s number of atoms in a kilogram, gives the staggering energy density of nuclear fuel.',
      codeIntro: 'Model the semi-empirical mass formula to compute binding energies and plot the binding energy curve.',
      code: `import numpy as np

# Semi-empirical mass formula (Bethe-Weizsacker) coefficients
a_v = 15.56   # volume term (MeV)
a_s = 17.23   # surface term
a_c = 0.697   # Coulomb term
a_a = 23.29   # asymmetry term
a_p = 12.0    # pairing term

def binding_energy_per_nucleon(Z, A):
    """
    Calculate binding energy per nucleon using the
    semi-empirical mass formula.
    Z = number of protons, A = mass number (protons + neutrons)
    """
    N = A - Z
    # Volume: each nucleon attracts neighbours
    vol = a_v * A
    # Surface: nucleons at the surface have fewer neighbours
    surf = a_s * A**(2/3)
    # Coulomb: proton-proton electrical repulsion
    coul = a_c * Z * (Z - 1) / A**(1/3)
    # Asymmetry: nuclei prefer equal Z and N
    asym = a_a * (A - 2*Z)**2 / A
    # Pairing: even-even nuclei are more stable
    if Z % 2 == 0 and N % 2 == 0:
        pair = a_p / A**0.5
    elif Z % 2 == 1 and N % 2 == 1:
        pair = -a_p / A**0.5
    else:
        pair = 0

    BE = vol - surf - coul - asym + pair
    return max(BE / A, 0)

# Build the binding energy curve — most stable isotope for each A
print("=== Binding Energy Curve (selected nuclei) ===")
print(f"{'Nucleus':<12} {'Z':>4} {'A':>4} {'BE/A (MeV)':>11} {'Stability':>12}")
print("-" * 45)

key_nuclei = [
    ("He-4",    2,   4),
    ("C-12",    6,  12),
    ("O-16",    8,  16),
    ("Si-28",  14,  28),
    ("Fe-56",  26,  56),
    ("Ni-62",  28,  62),
    ("Sr-88",  38,  88),
    ("Ba-141", 56, 141),
    ("Pb-208", 82, 208),
    ("U-235",  92, 235),
    ("U-238",  92, 238),
    ("Pu-239", 94, 239),
]

be_values = {}
for name, Z, A in key_nuclei:
    be = binding_energy_per_nucleon(Z, A)
    be_values[name] = be
    stability = "MOST STABLE" if name == "Fe-56" else "FISSILE" if name in ("U-235", "Pu-239") else ""
    print(f"{name:<12} {Z:>4} {A:>4} {be:>9.3f} {stability:>12}")

# Energy released in U-235 fission
print("\\n=== U-235 Fission Energy Calculation ===")
be_u235 = be_values["U-235"] * 235
# Typical fission: U-235 -> Ba-141 + Kr-92 + 2 neutrons
be_ba = binding_energy_per_nucleon(56, 141) * 141
be_kr = binding_energy_per_nucleon(36, 92) * 92
energy_released = be_ba + be_kr - be_u235
print(f"BE(U-235):     {be_u235:.1f} MeV (total)")
print(f"BE(Ba-141):    {be_ba:.1f} MeV")
print(f"BE(Kr-92):     {be_kr:.1f} MeV")
print(f"Energy released per fission: {energy_released:.1f} MeV")
print(f"Actual measured value:        ~200 MeV")

# Compare to chemical energy
print("\\n=== Nuclear vs Chemical Energy ===")
fission_ev = energy_released * 1e6  # convert MeV to eV
chemical_ev = 4.0  # C + O2 -> CO2 releases ~4 eV
ratio = fission_ev / chemical_ev
print(f"Fission per atom:   {fission_ev:.0f} eV")
print(f"Combustion per atom: {chemical_ev:.1f} eV")
print(f"Ratio: nuclear/chemical = {ratio:.0f}×")
print(f"=> 1 kg U-235 ~ {ratio/1e6:.0f} tonnes of coal")`,
      challenge: 'Calculate the binding energy per nucleon for all elements from Z=1 to Z=100 (using the most stable isotope approximation A ≈ 2Z for light nuclei, A ≈ 2.5Z for heavy nuclei). Find the exact peak — is it iron-56 or nickel-62? (Spoiler: Ni-62 actually has the highest BE/A, but Fe-56 is more commonly cited because it is the endpoint of stellar nucleosynthesis.)',
      successHint: 'The binding energy curve is the Rosetta Stone of nuclear physics. It tells you which reactions release energy (moving toward the peak) and which require energy (moving away). Every nuclear reactor and every nuclear weapon is an application of this curve — moving nuclei closer to iron.',
    },
    {
      title: 'Neutron cross-sections and mean free path — the probability of fission',
      concept: `When a neutron travels through a material, it can interact with nuclei in several ways: it can **scatter** (bounce off), be **absorbed** (captured without fission), or cause **fission** (split the nucleus). The probability of each interaction is measured by the **cross-section** (σ), measured in **barns** (1 barn = 10⁻²⁴ cm²).

A larger cross-section means a higher probability of interaction. U-235 has a **fission cross-section** of about 585 barns for slow (thermal) neutrons but only ~1.2 barns for fast neutrons. This is why most reactors use a **moderator** (water, graphite) to slow neutrons down — slow neutrons are far more likely to cause fission.

The **mean free path** (λ) is the average distance a neutron travels before interacting: **λ = 1 / (n × σ)**, where n is the number density of target nuclei and σ is the cross-section. For U-235 metal, the fission mean free path for thermal neutrons is only a few centimetres.

📚 *Cross-sections depend strongly on neutron energy. The "1/v law" states that thermal cross-sections are roughly proportional to 1/velocity — slower neutrons are more effective at causing fission because they spend more time near each nucleus.*`,
      analogy: 'Imagine throwing a ball through a forest. Each tree has a certain "catchable area" — how big it looks from where you throw. A forest of thick trees (large cross-section) catches most balls quickly. A sparse forest of thin trees (small cross-section) lets most balls fly through. The mean free path is how far you expect the ball to travel before hitting a tree.',
      storyConnection: 'The Manhattan Project\'s central challenge was making enough U-235 undergo fission before the bomb blew itself apart. The cross-section told them how likely each neutron was to cause fission, and the mean free path told them how far neutrons would travel. These numbers determined the critical mass — the minimum amount of material needed for a self-sustaining chain reaction.',
      checkQuestion: 'U-235 has a fission cross-section of 585 barns for thermal neutrons and 1.2 barns for fast neutrons. If you have a choice between a thermal and a fast neutron, which is ~500× more likely to cause fission?',
      checkAnswer: 'The thermal neutron — 585/1.2 ≈ 488× more likely. This is why nuclear reactors use moderators to slow neutrons. The bomb designs, however, used fast neutrons because there\'s no time for moderation — the assembly is together for only microseconds. Fast-neutron designs compensate with more fissile material.',
      codeIntro: 'Calculate neutron cross-sections, mean free paths, and interaction probabilities for nuclear materials.',
      code: `import numpy as np

# Constants
barn = 1e-24  # cm^2
N_A = 6.022e23  # Avogadro's number

def number_density(density_g_cc, atomic_mass):
    """Number of atoms per cm^3."""
    return density_g_cc * N_A / atomic_mass

def mean_free_path(n_density, sigma_barns):
    """Mean free path in cm."""
    sigma_cm2 = sigma_barns * barn
    return 1.0 / (n_density * sigma_cm2)

def interaction_prob(thickness_cm, n_density, sigma_barns):
    """Probability of interaction in a slab of given thickness."""
    lam = mean_free_path(n_density, sigma_barns)
    return 1 - np.exp(-thickness_cm / lam)

# Nuclear materials
materials = [
    {"name": "U-235",  "density": 19.1, "A": 235, "sigma_f_thermal": 585,
     "sigma_f_fast": 1.24, "sigma_scatter": 10, "sigma_capture": 99},
    {"name": "U-238",  "density": 19.1, "A": 238, "sigma_f_thermal": 0.00002,
     "sigma_f_fast": 0.31, "sigma_scatter": 9, "sigma_capture": 2.7},
    {"name": "Pu-239", "density": 19.8, "A": 239, "sigma_f_thermal": 748,
     "sigma_f_fast": 1.80, "sigma_scatter": 8, "sigma_capture": 271},
]

print("=== Neutron Cross-Sections and Mean Free Path ===")
print(f"{'Material':<10} {'n (cm^-3)':>14} {'σ_f therm':>10} {'σ_f fast':>9} {'λ_therm (cm)':>13} {'λ_fast (cm)':>12}")
print("-" * 70)

for m in materials:
    n = number_density(m["density"], m["A"])
    lam_therm = mean_free_path(n, m["sigma_f_thermal"]) if m["sigma_f_thermal"] > 0 else float('inf')
    lam_fast = mean_free_path(n, m["sigma_f_fast"]) if m["sigma_f_fast"] > 0 else float('inf')
    print(f"{m['name']:<10} {n:>12.3e} {m['sigma_f_thermal']:>8.1f} b {m['sigma_f_fast']:>7.2f} b "
          f"{lam_therm:>11.2f} {lam_fast:>10.1f}")

# Fission probability vs slab thickness
print("\\n=== Fission Probability vs Slab Thickness (U-235, thermal) ===")
n_u235 = number_density(19.1, 235)
print(f"{'Thickness (cm)':<16} {'P(fission)':>12} {'P(escape)':>12}")
print("-" * 42)
for t in [0.1, 0.5, 1.0, 2.0, 5.0, 10.0, 20.0]:
    p = interaction_prob(t, n_u235, 585)
    print(f"{t:>14.1f} {p:>10.4f} {1-p:>10.4f}")

# Why U-238 is almost useless for fission
print("\\n=== Why U-238 Cannot Sustain a Chain Reaction ===")
n_u238 = number_density(19.1, 238)
lam_fission_238 = mean_free_path(n_u238, 0.00002)
lam_capture_238 = mean_free_path(n_u238, 2.7)
print(f"U-238 fission mean free path:  {lam_fission_238:.0f} cm ({lam_fission_238/100:.0f} m)")
print(f"U-238 capture mean free path:  {lam_capture_238:.1f} cm")
print(f"A neutron is captured {lam_fission_238/lam_capture_238:.0f}× more often than it causes fission.")
print("=> U-238 absorbs neutrons without fissioning — it poisons the chain reaction.")
print("=> This is why enrichment (increasing U-235 fraction) is essential.")`,
      challenge: 'The total cross-section is the sum of fission + capture + scatter. Calculate the total mean free path for a neutron in natural uranium (0.7% U-235 + 99.3% U-238) and compare it to enriched uranium (90% U-235). How does enrichment change the ratio of fission to capture events?',
      successHint: 'Cross-sections and mean free paths are the fundamental language of nuclear engineering. Every reactor design, every shielding calculation, every criticality analysis starts with these numbers. You now understand WHY U-235 is special (huge thermal fission cross-section) and WHY enrichment is necessary (U-238 captures neutrons without fissioning).',
    },
    {
      title: 'Isotope enrichment cascades — the gaseous diffusion mathematics',
      concept: `Natural uranium is 99.3% U-238 and only 0.7% U-235. For a bomb, you need >80% U-235. For a reactor, 3-5%. How do you separate isotopes that are chemically identical and differ in mass by only 1.3%?

**Gaseous diffusion** converts uranium to UF₆ gas and pumps it through porous barriers. Lighter UF₆ molecules (containing U-235) diffuse through the barrier slightly faster than heavier ones (containing U-238). The **separation factor** per stage is:

**α = √(M₂/M₁) = √(352/349) ≈ 1.0043**

where M₁ = mass of ²³⁵UF₆ = 349 and M₂ = mass of ²³⁸UF₆ = 352. Each stage enriches the U-235 fraction by only 0.43%. To go from 0.7% to 90%, you need **thousands** of stages connected in a **cascade**.

The number of stages required is: **N = ln(product_ratio / feed_ratio) / ln(α)**

📚 *Graham's law of effusion: the rate at which a gas escapes through a small hole is inversely proportional to the square root of its molecular mass. This is the physics behind gaseous diffusion enrichment.*`,
      analogy: 'Imagine sorting a mixture of slightly different-sized marbles by rolling them down a slope with a mesh screen. The smaller marbles have a slightly higher chance of falling through each screen. One screen barely separates them — you need hundreds of screens in series, each one slightly enriching the "small marble" fraction. That\'s a cascade.',
      storyConnection: 'The Manhattan Project built the K-25 gaseous diffusion plant at Oak Ridge, Tennessee — at the time, the largest building in the world. It contained thousands of diffusion stages in a U-shaped building half a mile long. The engineering challenge was staggering: every seal had to be perfect (UF₆ is corrosive), and the total power consumption rivalled a small city. All of this to shift the U-235 concentration from 0.7% to weapons-grade.',
      checkQuestion: 'If each gaseous diffusion stage has α = 1.0043, how many stages are needed to enrich from 0.7% U-235 to 3.5% (reactor grade)?',
      checkAnswer: 'Using N = ln(enrichment_ratio) / ln(α): enrichment_ratio uses the "value function" but a simplified estimate: N ≈ ln(3.5/0.7 × (100-0.7)/(100-3.5)) / ln(1.0043) ≈ ln(5.14) / 0.00429 ≈ 1.637/0.00429 ≈ 381 stages. For weapons-grade (90%), you need over 3,000 stages.',
      codeIntro: 'Model a gaseous diffusion cascade and calculate the number of stages needed for different enrichment levels.',
      code: `import numpy as np

# Gaseous diffusion parameters
M_UF6_235 = 235.04 + 6 * 19.0  # mass of 235-UF6
M_UF6_238 = 238.05 + 6 * 19.0  # mass of 238-UF6
alpha = np.sqrt(M_UF6_238 / M_UF6_235)  # separation factor per stage

print("=== Gaseous Diffusion Enrichment Cascade ===")
print(f"Mass of 235-UF6: {M_UF6_235:.2f} amu")
print(f"Mass of 238-UF6: {M_UF6_238:.2f} amu")
print(f"Separation factor (alpha): {alpha:.6f}")
print(f"Enrichment per stage: {(alpha - 1) * 100:.3f}%")

def stages_needed(x_feed, x_product, alpha):
    """
    Estimate stages using the Fenske equation (ideal cascade).
    x_feed, x_product are mole fractions of U-235.
    """
    ratio_product = x_product / (1 - x_product)
    ratio_feed = x_feed / (1 - x_feed)
    return np.log(ratio_product / ratio_feed) / np.log(alpha)

# Natural uranium feed
x_feed = 0.007  # 0.7% U-235

targets = [
    ("LEU reactor fuel",       0.035),
    ("HEU research reactor",   0.20),
    ("Naval reactor fuel",     0.60),
    ("Weapons grade",          0.90),
    ("Supergrade",             0.95),
]

print(f"\\n{'Target':<26} {'U-235 %':>8} {'Stages':>8} {'Cascade length*':>16}")
print("-" * 60)
for name, x_target in targets:
    n = stages_needed(x_feed, x_target, alpha)
    # Assume each stage is 0.5m of equipment
    cascade_m = n * 0.5
    print(f"{name:<26} {x_target*100:>6.1f}% {n:>7.0f} {cascade_m:>12.0f} m")

print("\\n* Cascade length assumes 0.5 m per stage")

# Cascade enrichment profile — tracking composition through stages
print("\\n=== Enrichment Profile Through Cascade (to 90%) ===")
n_stages = int(stages_needed(x_feed, 0.90, alpha))
x = x_feed
print(f"{'Stage':>8} {'U-235 %':>10} {'Enrichment':>12}")
print("-" * 32)
milestones = set([0, 100, 500, 1000, 1500, 2000, 2500, n_stages])
for stage in range(n_stages + 1):
    if stage in milestones or stage % 500 == 0:
        print(f"{stage:>8} {x*100:>8.3f}% {x/x_feed:>10.1f}x")
    # Apply one stage of enrichment
    x = alpha * x / (1 + (alpha - 1) * x)

# Separative Work Units (SWU) — the industry measure of enrichment effort
print("\\n=== Separative Work Units (SWU) ===")
def value_function(x):
    """Standard SWU value function V(x) = (2x - 1) * ln(x/(1-x))"""
    return (2*x - 1) * np.log(x / (1 - x))

def swu_required(x_p, x_f, x_t, product_kg):
    """
    SWU to produce product_kg of enriched uranium.
    x_p = product enrichment, x_f = feed, x_t = tails (depleted)
    """
    # Feed and tails quantities per kg of product
    feed_kg = product_kg * (x_p - x_t) / (x_f - x_t)
    tails_kg = feed_kg - product_kg
    swu = product_kg * value_function(x_p) + tails_kg * value_function(x_t) - feed_kg * value_function(x_f)
    return swu, feed_kg

x_tails = 0.003  # depleted uranium tails at 0.3%
for name, x_p in targets:
    swu, feed = swu_required(x_p, x_feed, x_tails, 1.0)
    print(f"{name:<26} SWU/kg: {swu:>8.0f}  Feed needed: {feed:>8.0f} kg nat. U")`,
      challenge: 'Modern centrifuge enrichment has α ≈ 1.3 per stage (vs 1.0043 for diffusion). Recalculate the number of stages needed. How many centrifuge stages to reach weapons grade? This explains why centrifuge technology is a proliferation concern — it makes enrichment dramatically easier.',
      successHint: 'You now understand the mathematics of isotope separation — the single most difficult and expensive step in building a nuclear weapon. The difficulty of enrichment is the primary barrier to nuclear proliferation. Every arms control treaty focuses on monitoring enrichment facilities, because mastering this mathematics is the gateway to weapons capability.',
    },
    {
      title: 'Implosion lens design — converging shock waves',
      concept: `The "Fat Man" bomb used at Nagasaki employed **implosion** — compressing a subcritical sphere of plutonium to supercritical density. The challenge: how do you convert the **diverging** wavefront from many explosive detonation points into a perfectly **converging** spherical wavefront?

The answer is **explosive lenses**. Just as glass lenses refract light by using materials with different speeds of light, explosive lenses refract shock waves by using explosives with different **detonation velocities**. A fast explosive on the outside and a slow explosive on the inside create a curved interface that converts a flat wavefront into a converging spherical one.

The geometry follows from **Snell's law for shock waves**: sin(θ₁)/v₁ = sin(θ₂)/v₂, where v₁ and v₂ are the detonation velocities of the fast and slow explosives. The interface shape must satisfy this relationship at every point.

📚 *A detonation wave is a supersonic combustion wave that propagates through an explosive. Its velocity is a property of the explosive: TNT detonates at 6,900 m/s, Composition B at 7,900 m/s, and Baratol at 4,870 m/s.*`,
      analogy: 'Imagine ocean waves approaching a curved beach. The part of the wave in shallow water slows down while the part in deep water keeps moving fast. This bends the wave — the same physics as a glass lens bending light. An explosive lens works identically: the slow explosive "bends" the shock wave inward, focusing it to a point like a magnifying glass focuses sunlight.',
      storyConnection: 'The implosion design was the Manhattan Project\'s greatest engineering challenge. George Kistiakowsky\'s team at Los Alamos spent over a year perfecting the explosive lens geometry. Early tests showed asymmetric implosions that would squirt the plutonium out one side instead of compressing it. The lenses had to produce a spherical wavefront converging to within 5% uniformity — machined from castable explosives to millimetre tolerances.',
      checkQuestion: 'If the fast explosive has velocity v₁ = 7,900 m/s and the slow explosive has v₂ = 4,870 m/s, what is the critical angle at which total internal reflection occurs (shock wave cannot cross the interface)?',
      checkAnswer: 'sin(θ_c) = v₂/v₁ = 4,870/7,900 = 0.6165, so θ_c = arcsin(0.6165) = 38.1°. At angles greater than 38.1°, the shock wave reflects instead of refracting. The lens geometry must ensure all rays hit the interface below this critical angle.',
      codeIntro: 'Model explosive lens geometry using Snell\'s law for shock waves and calculate the converging wavefront.',
      code: `import numpy as np

# Explosive properties
v_fast = 7900  # m/s — Composition B
v_slow = 4870  # m/s — Baratol
ratio = v_slow / v_fast

print("=== Explosive Lens Design ===")
print(f"Fast explosive: {v_fast} m/s (Comp B)")
print(f"Slow explosive: {v_slow} m/s (Baratol)")
print(f"Velocity ratio: {ratio:.4f}")

# Critical angle (total internal reflection)
theta_c = np.arcsin(ratio)
print(f"Critical angle: {np.degrees(theta_c):.1f}°")

# Snell's law for shock waves
def snells_angle(theta_in, v1, v2):
    """Apply Snell's law: sin(theta_out)/v2 = sin(theta_in)/v1"""
    sin_out = v2 / v1 * np.sin(theta_in)
    if abs(sin_out) > 1:
        return None  # total internal reflection
    return np.arcsin(sin_out)

# Calculate lens interface profile
# For a flat detonation front to become spherical,
# the interface must be a specific curve
print("\\n=== Lens Interface Profile ===")
R_sphere = 0.30  # target convergence radius (m)
n_points = 20

print(f"{'Radial pos (cm)':<18} {'Interface angle':>16} {'Refracted angle':>16} {'Arrival time (μs)':>18}")
print("-" * 70)

radii = np.linspace(0.01, R_sphere * 0.95, n_points)
arrival_times = []

for r in radii:
    # Angle of incidence at lens surface for a flat front
    # hitting a conical interface
    interface_angle = np.arctan(r / (R_sphere * 0.5))

    # Refracted angle
    refracted = snells_angle(interface_angle, v_fast, v_slow)
    if refracted is None:
        continue

    # Time for wave to travel through fast explosive to interface
    d_fast = np.sqrt(r**2 + (R_sphere * 0.5)**2)
    t_fast = d_fast / v_fast

    # Time through slow explosive to convergence point
    d_slow = R_sphere - r * 0.3  # simplified geometry
    t_slow = d_slow / v_slow

    t_total = (t_fast + t_slow) * 1e6  # microseconds
    arrival_times.append(t_total)

    if len(arrival_times) % 4 == 1 or r == radii[0]:
        print(f"{r*100:>14.1f} {np.degrees(interface_angle):>14.1f}° "
              f"{np.degrees(refracted):>14.1f}° {t_total:>16.3f}")

# Uniformity analysis
if arrival_times:
    times = np.array(arrival_times)
    mean_t = np.mean(times)
    spread = np.max(times) - np.min(times)
    uniformity = (1 - spread / mean_t) * 100
    print(f"\\nMean arrival time: {mean_t:.3f} μs")
    print(f"Time spread: {spread:.3f} μs")
    print(f"Wavefront uniformity: {uniformity:.1f}%")
    print(f"Required for implosion: >95% uniformity")

# Number of lenses needed for spherical coverage
print("\\n=== Lens Array Design ===")
for n_lenses in [20, 32, 60, 92]:
    solid_angle = 4 * np.pi / n_lenses
    half_angle = np.arccos(1 - solid_angle / (2 * np.pi))
    lens_diameter = 2 * R_sphere * np.sin(half_angle)
    gap_pct = (1 - n_lenses * np.pi * (lens_diameter/2)**2 / (4 * np.pi * R_sphere**2)) * 100
    print(f"{n_lenses} lenses: diameter {lens_diameter*100:.1f} cm each, "
          f"coverage gap {max(gap_pct, 0):.1f}%")

print("\\nFat Man used 32 explosive lenses arranged in a truncated icosahedron")
print("(soccer ball geometry) — the same as a C60 buckyball molecule.")`,
      challenge: 'What happens if the velocity ratio changes by 1% (manufacturing defect in the explosive)? Recalculate the arrival time spread. This sensitivity analysis explains why explosive lens manufacturing required unprecedented quality control — any variation in explosive composition ruined the implosion symmetry.',
      successHint: 'You just applied Snell\'s law — the same optics principle that governs eyeglasses and telescopes — to shock wave physics. This crossover between optics and detonation physics is a beautiful example of how fundamental principles (Snell\'s law) apply across completely different physical systems.',
    },
    {
      title: 'Radiation dosimetry — sieverts, exposure, and biological damage',
      concept: `Radiation deposits energy in biological tissue, breaking molecular bonds and damaging DNA. The key quantities are:

**Absorbed dose (gray, Gy)**: energy deposited per kilogram of tissue. 1 Gy = 1 J/kg.

**Equivalent dose (sievert, Sv)**: absorbed dose × **quality factor** Q, which accounts for the fact that different radiation types cause different amounts of biological damage. Alpha particles (Q=20) cause 20× more damage per gray than gamma rays (Q=1).

**H = D × Q** (equivalent dose in sieverts)

For acute exposure: 1 Sv causes radiation sickness. 4-5 Sv is lethal for 50% of people (LD50). 10 Sv is universally fatal. For chronic exposure, the cancer risk increases by approximately **5% per Sv** of cumulative dose.

The **inverse square law** governs dose from a point source: **D ∝ 1/r²**. Doubling your distance from the source reduces your dose by 4×.

📚 *Background radiation from natural sources (cosmic rays, radon, food) gives every person about 2-3 mSv per year. A chest X-ray adds about 0.02 mSv. A CT scan adds about 10 mSv.*`,
      analogy: 'Imagine standing near a campfire. The heat you feel is like radiation dose — it depends on how close you are (inverse square law), how long you stay (exposure time), and the type of fire (quality factor). A gentle campfire (gamma rays) at close range may feel the same as a blast furnace (alpha particles) at a distance. Both can burn you, but the blast furnace does more damage per unit of heat.',
      storyConnection: 'The Manhattan Project scientists initially had poor understanding of radiation hazards. Harry Daghlian and Louis Slotin died from criticality accidents — receiving lethal doses of neutron radiation in seconds. After the Hiroshima and Nagasaki bombings, the effects of radiation on survivors (the hibakusha) provided tragic but critical data on dose-response relationships. These studies established the dosimetry framework still used today.',
      checkQuestion: 'A worker receives 0.5 Gy of gamma radiation (Q=1) and 0.01 Gy of alpha radiation (Q=20). What is the total equivalent dose in sieverts?',
      checkAnswer: 'H_gamma = 0.5 × 1 = 0.5 Sv. H_alpha = 0.01 × 20 = 0.2 Sv. Total: 0.7 Sv. This is enough to cause mild radiation sickness (nausea, fatigue). Even though the alpha dose was 50× smaller in grays, it contributed nearly half the biological damage because of alpha particles\' high quality factor.',
      codeIntro: 'Calculate radiation doses, model the inverse square law, and assess health risks from exposure.',
      code: `import numpy as np

# Quality factors for different radiation types
quality_factors = {
    "gamma":    1,
    "beta":     1,
    "neutron_slow": 5,
    "neutron_fast": 20,
    "alpha":    20,
    "proton":   5,
}

def equivalent_dose(absorbed_gy, radiation_type):
    """Convert absorbed dose (Gy) to equivalent dose (Sv)."""
    Q = quality_factors[radiation_type]
    return absorbed_gy * Q

def dose_at_distance(source_activity_gbq, energy_mev, distance_m, time_hours, rad_type="gamma"):
    """
    Estimate dose from a point source.
    Uses simplified dose rate constant.
    """
    # Dose rate constant ~ 0.13 μSv·m²/(GBq·h) per MeV (gamma approximation)
    k = 0.13 * energy_mev
    dose_rate = k * source_activity_gbq / distance_m**2  # μSv/h
    return dose_rate * time_hours / 1000  # convert to mSv

print("=== Radiation Quality Factors ===")
print(f"{'Radiation type':<18} {'Q factor':>10} {'0.1 Gy → Sv':>14}")
print("-" * 44)
for rad, q in quality_factors.items():
    sv = equivalent_dose(0.1, rad)
    print(f"{rad:<18} {q:>10} {sv:>12.2f} Sv")

# Dose vs distance (inverse square law)
print("\\n=== Inverse Square Law — Dose vs Distance ===")
print("Source: 100 GBq Co-60 (1.25 MeV gamma), 1 hour exposure")
source_gbq = 100
energy = 1.25
print(f"{'Distance (m)':<14} {'Dose rate (mSv/h)':>18} {'1h dose (mSv)':>14} {'Annual limit?':>14}")
print("-" * 62)

for d in [0.1, 0.25, 0.5, 1.0, 2.0, 5.0, 10.0, 50.0]:
    dose_mSv = dose_at_distance(source_gbq, energy, d, 1.0)
    annual = "EXCEEDS 20 mSv" if dose_mSv > 20 else "OK"
    print(f"{d:>12.1f} {dose_mSv:>16.2f} {dose_mSv:>12.2f} {annual:>14}")

# Acute exposure effects
print("\\n=== Acute Radiation Syndrome (whole-body dose) ===")
dose_effects = [
    (0.25,  "No symptoms — below detection threshold"),
    (0.5,   "Mild blood count changes, no symptoms"),
    (1.0,   "Radiation sickness: nausea, fatigue, reduced blood counts"),
    (2.0,   "Severe sickness, 5% mortality without treatment"),
    (4.0,   "LD50 — 50% mortality within 30 days without treatment"),
    (6.0,   "LD90 — 90% mortality, death within 2 weeks"),
    (10.0,  "100% fatal within 1-2 weeks (GI syndrome)"),
    (50.0,  "Immediate incapacitation, death within days (CNS syndrome)"),
]

for dose_sv, effect in dose_effects:
    print(f"  {dose_sv:>5.1f} Sv: {effect}")

# Hiroshima dose estimates at various distances
print("\\n=== Estimated Doses at Hiroshima (15 kT, air burst 580 m) ===")
distances_km = [0.5, 1.0, 1.5, 2.0, 3.0, 5.0]
for d_km in distances_km:
    # Simplified model: dose falls roughly as 1/r^2 with atmospheric absorption
    # Reference: ~6 Gy at 1 km for 15 kT
    dose_gy = 6.0 * (1.0 / d_km)**2 * np.exp(-0.3 * (d_km - 1.0))
    dose_sv = dose_gy * 1.2  # mixed gamma + neutron, average Q ~ 1.2
    survival = "Fatal" if dose_sv > 4 else "Severe sickness" if dose_sv > 1 else "Mild effects" if dose_sv > 0.25 else "Below threshold"
    print(f"  {d_km:.1f} km: {dose_sv:>7.2f} Sv — {survival}")`,
      challenge: 'Calculate the cumulative cancer risk for a population exposed to varying doses. The linear no-threshold (LNT) model predicts cancer risk = 5% per Sv of cumulative dose. For 100,000 people each receiving 0.1 Sv, how many excess cancers are predicted? Compare this to the baseline cancer rate (~25% lifetime risk). This is the calculation used to estimate Hiroshima and Nagasaki cancer deaths.',
      successHint: 'Dosimetry connects physics to biology — translating energy deposition into human health consequences. The framework you just used (absorbed dose, quality factor, equivalent dose) is the international standard for radiation protection, developed directly from the Manhattan Project\'s legacy. Understanding these numbers is essential for anyone working with nuclear technology — and for every citizen evaluating nuclear policy.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Nuclear physics and engineering analysis</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 2 dives into binding energy, neutron cross-sections, isotope enrichment, implosion physics, and radiation dosimetry.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {loadProgress}</>) : (<><Sparkles className="w-5 h-5" /> Load Python</>)}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson
            key={i}
            id={`L2-${i + 1}`}
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
