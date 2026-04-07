import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function SwamimalaiLevel3() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Nucleation — how the first solid crystals form in liquid metal',
      concept: `When molten bronze cools below its liquidus temperature, it does not solidify instantly. Instead, tiny clusters of atoms must arrange themselves into a crystal pattern — this is called **nucleation**. These initial clusters (nuclei) are incredibly small, typically just a few nanometres across.

Nucleation requires overcoming an **energy barrier**. Forming a crystal surface costs energy (surface energy), but the volume of the crystal releases energy (since solid is more stable than liquid below the melting point). For very small nuclei, the surface cost dominates and the nucleus redissolves. Only nuclei above a **critical radius** survive and grow.

In the code below, you will calculate the critical nucleus radius and the energy barrier for nucleation as a function of undercooling (how far below the melting point the liquid has cooled). Greater undercooling means a lower energy barrier and more nuclei form, resulting in a finer grain structure.

*Undercooling (or supercooling) is the temperature difference between the actual temperature of the liquid and its equilibrium freezing point. More undercooling = more driving force for solidification.*`,
      analogy: 'Imagine trying to start a campfire with tiny twigs. A single twig catches fire but burns out before it can ignite its neighbours — it is below the "critical size." A bundle of twigs is large enough to sustain the fire — above the critical size. Nucleation is the same: a crystal nucleus must be large enough that its growth energy exceeds its surface energy cost.',
      storyConnection: 'Swamimalai casters control nucleation by controlling the cooling rate. Pouring into a preheated mould gives slow cooling, few nuclei, and large grains (good for machining). Pouring into a cold mould gives fast cooling, many nuclei, and fine grains (harder and stronger). The choice depends on whether the sculpture needs to be chiselled afterward.',
      checkQuestion: 'If greater undercooling produces more nuclei and finer grains, why don\'t casters always use maximum undercooling?',
      checkAnswer: 'Too much undercooling (pouring into a very cold mould) causes problems: the metal solidifies before filling the mould completely, thermal shock cracks the mould, and the casting develops internal stresses. The caster must balance fine grain structure against mould-filling ability — a classic engineering trade-off.',
      codeIntro: 'Calculate the critical nucleus radius and energy barrier as a function of undercooling.',
      code: `import numpy as np

# Classical nucleation theory for bronze solidification

# Physical constants for copper-tin bronze
gamma = 0.18        # surface energy (J/m^2)
delta_H = 1.3e9     # latent heat per unit volume (J/m^3)
T_melt = 1223       # melting point (K) = 950 C for bronze

def critical_radius(undercooling_K):
    """Critical nucleus radius in metres"""
    if undercooling_K <= 0:
        return float('inf')
    return 2 * gamma * T_melt / (delta_H * undercooling_K)

def activation_energy(undercooling_K):
    """Nucleation energy barrier in joules"""
    if undercooling_K <= 0:
        return float('inf')
    r_star = critical_radius(undercooling_K)
    return (16 * np.pi * gamma ** 3 * T_melt ** 2) / (3 * delta_H ** 2 * undercooling_K ** 2)

print("=== Classical Nucleation Theory for Bronze ===")
print()
header = "Undercooling(K)  Critical Radius(nm)  Energy Barrier(eV)  Nucleation Rate"
print(header)
print("-" * len(header))

for dT in [1, 5, 10, 20, 50, 100, 150, 200, 300]:
    r_star = critical_radius(dT) * 1e9  # convert to nm
    E_star = activation_energy(dT)
    E_eV = E_star / 1.602e-19  # convert to eV
    # Qualitative nucleation rate
    if E_eV > 1000:
        rate = "Negligible"
    elif E_eV > 100:
        rate = "Rare"
    elif E_eV > 10:
        rate = "Moderate"
    else:
        rate = "Abundant"
    print(f"{dT:>14}    {r_star:>17.1f}    {E_eV:>16.1f}    {rate}")

print()
print("Key insight: at just 10 K undercooling, nuclei need to be")
print("~30 nm across. At 200 K undercooling, only ~1.5 nm.")
print("Smaller critical radius = easier nucleation = more grains.")
print()

# Grain size vs cooling rate
print("=== Estimated Grain Size vs Cooling Rate ===")
cooling_rates = [0.1, 1, 10, 50, 100, 500, 1000]
for rate in cooling_rates:
    # Simplified: grain size ~ (cooling_rate)^(-0.5)
    grain_um = 2000 / np.sqrt(rate)
    quality = "Coarse" if grain_um > 500 else "Medium" if grain_um > 100 else "Fine" if grain_um > 30 else "Very fine"
    print(f"  {rate:>6.0f} C/s  -->  ~{grain_um:>6.0f} um grains  ({quality})")`,
      challenge: 'Add heterogeneous nucleation — when crystals form on mould walls or impurities instead of spontaneously in the liquid. The energy barrier is reduced by a factor (1-cos(theta))^2 * (2+cos(theta)) / 4, where theta is the contact angle. For theta = 60 degrees, by what factor is the barrier reduced?',
      successHint: 'You just applied classical nucleation theory — the same framework used to understand cloud formation, crystal growth in semiconductors, and even the formation of the first galaxies after the Big Bang. Nucleation is universal.',
    },
    {
      title: 'Grain growth — how crystals compete and coarsen',
      concept: `After nucleation, the tiny crystal nuclei grow by adding atoms from the surrounding liquid. But they do not grow uniformly — each grain grows outward until it collides with neighbouring grains. The boundaries where grains meet are called **grain boundaries**, and they profoundly affect the metal's properties.

After solidification is complete, the grains continue to evolve if the metal is held at high temperature. Large grains grow at the expense of small ones — a process called **grain coarsening** or **Ostwald ripening**. This happens because grain boundaries carry energy, and the system minimizes total energy by reducing the total boundary area (fewer, larger grains).

In the code below, you will simulate grain growth using a simple model: grains start as many small nuclei and gradually merge over time. The average grain size follows a **power law**: d squared is proportional to time (the "parabolic grain growth law").

*Grain boundaries are where the crystal orientation changes. They are weaker than the grain interior, so more grain boundaries (finer grains) means more obstacles to crack propagation — which means the metal is stronger.*`,
      analogy: 'Imagine soap bubbles in a sink. Small bubbles are absorbed by large ones because large bubbles have lower surface energy per unit volume. Over time, you end up with fewer, larger bubbles. Metal grains behave the same way — the big grains "eat" the small ones.',
      storyConnection: 'After casting, some Swamimalai sculptures are annealed (heated to 600-700 degrees C for several hours) to relieve internal stresses. But annealing also causes grain growth — holding the metal at high temperature for too long makes the grains coarser and the metal softer. The caster must balance stress relief against grain coarsening.',
      checkQuestion: 'If fine grains make bronze stronger, why would a caster ever want coarse grains?',
      checkAnswer: 'Coarse grains are softer and more ductile — easier to work with hand tools. For a sculpture that needs extensive chiselling and filing after casting, coarse grains are actually preferable. The caster chooses the grain structure based on post-casting requirements, not just strength.',
      codeIntro: 'Simulate grain growth kinetics and the relationship between grain size and mechanical properties.',
      code: `import numpy as np

# Grain growth simulation
# Parabolic law: d^2 - d0^2 = k * t

def grain_size_vs_time(d0_um, k, times_s):
    """Calculate grain diameter over time using parabolic law.
    d0_um: initial grain size in micrometres
    k: growth rate constant (um^2/s), depends on temperature
    """
    d_squared = d0_um ** 2 + k * times_s
    return np.sqrt(d_squared)

# Growth rate constants at different temperatures
# k increases exponentially with temperature (Arrhenius)
def growth_rate(temp_C, k0=1e8, Q=150000, R=8.314):
    """Arrhenius equation for grain growth rate"""
    temp_K = temp_C + 273.15
    return k0 * np.exp(-Q / (R * temp_K))

print("=== Grain Growth Rate vs Temperature ===")
print()
header = "Temp (C)    k (um^2/s)    Time to double 50um grain"
print(header)
print("-" * len(header))

for temp in [400, 500, 600, 700, 800, 900]:
    k = growth_rate(temp)
    # Time to grow from 50 um to 100 um: 100^2 - 50^2 = k*t
    t_double = (100**2 - 50**2) / k if k > 0 else float('inf')
    hours = t_double / 3600
    print(f"{temp:>7}    {k:>12.4f}    {hours:>10.1f} hours")

print()
print("=== Grain Size vs Annealing Time at 700 C ===")
k_700 = growth_rate(700)
d0 = 30  # initial grain size after casting (um)
times_hours = np.array([0, 0.5, 1, 2, 4, 8, 16, 24])
times_s = times_hours * 3600

print(f"Initial grain size: {d0} um")
print(f"Growth rate at 700 C: {k_700:.4f} um^2/s")
print()

header2 = "Time (h)   Grain Size (um)   Hardness (HV)   Yield Str (MPa)"
print(header2)
print("-" * len(header2))

for t_h, t_s in zip(times_hours, times_s):
    d = grain_size_vs_time(d0, k_700, t_s)
    # Hall-Petch: yield strength increases with finer grains
    # sigma = sigma_0 + k_hp / sqrt(d)
    sigma_0 = 80  # base yield strength (MPa)
    k_hp = 600    # Hall-Petch coefficient
    strength = sigma_0 + k_hp / np.sqrt(d)
    hardness = strength * 0.35  # approximate HV from yield strength
    print(f"{t_h:>7.1f}    {d:>13.0f}     {hardness:>11.0f}     {strength:>13.0f}")

print()
print("Grain growth weakens the metal: doubling grain size")
print("noticeably reduces hardness via the Hall-Petch effect.")`,
      challenge: 'Add a plot-like ASCII visualization of grain size vs time. Also, calculate the "optimal anneal" — the time at 700 degrees C that reduces internal stress (proportional to time) by 80% without growing grains beyond 80 micrometres.',
      successHint: 'The Hall-Petch relationship (strength is proportional to 1/sqrt(grain_size)) is one of the most important equations in physical metallurgy. It explains why nanostructured metals can be incredibly strong, and it guides the heat treatment of every steel beam, turbine blade, and surgical implant.',
    },
    {
      title: 'Solidification microstructure — dendrites and their shapes',
      concept: `When an alloy like bronze solidifies, the crystals do not grow as simple cubes or spheres. Instead, they form beautiful branching tree-like structures called **dendrites** (from the Greek "dendron" = tree). Dendrites form because the growing crystal rejects tin atoms at its surface, creating a tin-rich layer in front of the crystal. The crystal then grows fastest where this layer is thinnest — at tips and bumps — creating the branching pattern.

The spacing between dendrite arms (the **dendrite arm spacing**, DAS) is directly related to the cooling rate. Fast cooling = fine DAS (tightly spaced branches) = better mechanical properties. Slow cooling = coarse DAS = weaker but more ductile.

In the code below, you will model dendrite arm spacing as a function of cooling rate and explore how this affects the final properties of the casting.

*Dendrite arm spacing is measured in micrometres and is one of the most important quality indicators in castings. Aerospace components require DAS below 20 um; automotive parts allow up to 60 um.*`,
      analogy: 'Imagine frost forming on a window pane. The ice crystals grow outward in branching, feathery patterns because they grow fastest where the cold air reaches them most easily — at the tips of existing branches. Dendrites in metal form by the exact same mechanism, except the "cold" is undercooling and the "frost" is solid metal.',
      storyConnection: 'If you could look inside a Swamimalai bronze casting under a microscope, you would see a forest of dendrites. The casters cannot see them, but they know their effects intuitively: a casting that cooled slowly (thick sections) is softer and easier to chisel than one that cooled quickly (thin sections). The dendrite structure is the hidden reason.',
      checkQuestion: 'Two bronze castings are identical except one cooled in 10 minutes and the other in 2 hours. Which has finer dendrites and better strength?',
      checkAnswer: 'The one that cooled in 10 minutes has finer dendrites (smaller dendrite arm spacing) because fast cooling creates more nucleation sites and less time for arms to coarsen. Finer dendrites mean shorter diffusion paths, more uniform composition, and higher strength.',
      codeIntro: 'Model dendrite arm spacing and its effect on casting quality.',
      code: `import numpy as np

# Dendrite Arm Spacing (DAS) model
# DAS = A * (cooling_rate) ^ (-n)
# Typical: A = 50, n = 0.33 for copper alloys

def dendrite_spacing(cooling_rate_Cs, A=50, n=0.33):
    """Calculate secondary dendrite arm spacing in micrometres.
    cooling_rate_Cs: cooling rate in C/s
    """
    return A * cooling_rate_Cs ** (-n)

# Cooling rates for different casting conditions
conditions = [
    ("Sand mould (slow)",      0.5),
    ("Investment mould",       2.0),
    ("Permanent mould",        10.0),
    ("Swamimalai lost-wax",    3.0),
    ("Die casting",            50.0),
    ("Centrifugal casting",    20.0),
    ("Rapid solidification",   1000.0),
]

print("=== Dendrite Arm Spacing vs Cooling Rate ===")
print()
header = "Casting Method            Rate(C/s)   DAS(um)   Quality"
print(header)
print("-" * len(header))

for name, rate in conditions:
    das = dendrite_spacing(rate)
    quality = "Premium" if das < 20 else "Good" if das < 40 else "Standard" if das < 60 else "Coarse"
    print(f"{name:<26} {rate:>8.1f}   {das:>7.1f}   {quality}")

print()
print("=== DAS vs Mechanical Properties (10% Sn Bronze) ===")
print()

header2 = "DAS(um)  Tensile(MPa)  Elongation(%)  Fatigue Limit(MPa)"
print(header2)
print("-" * len(header2))

for das in [10, 20, 30, 40, 50, 60, 80, 100]:
    # Empirical correlations (simplified)
    tensile = 350 - 2.0 * das
    elongation = 5 + 0.15 * das
    fatigue = 0.4 * tensile
    print(f"{das:>5}    {tensile:>10.0f}    {elongation:>11.1f}    {fatigue:>16.0f}")

print()
print("Finer dendrites = higher strength but lower ductility.")
print("The Swamimalai process gives DAS ~35 um: a good balance")
print("between strength for structural integrity and ductility")
print("for post-casting chiselling and finishing.")`,
      challenge: 'Model the "columnar to equiaxed transition" (CET): near the mould wall, dendrites grow inward as columns; in the centre, they nucleate randomly as equiaxed grains. Simulate a cross-section by assigning columnar (DAS = 25 um) to the outer 20% and equiaxed (DAS = 45 um) to the inner 80%.',
      successHint: 'Dendrite analysis is used in every casting quality laboratory in the world. When an aerospace component fails, the first thing investigators do is examine the dendrite structure under a microscope. You just modelled the same relationships they use.',
    },
    {
      title: 'Segregation — when tin refuses to stay evenly mixed',
      concept: `When bronze solidifies, the first crystals to form are richer in copper than the overall alloy composition. This is because copper has a higher melting point and solidifies preferentially. The tin gets "rejected" into the remaining liquid, which becomes increasingly tin-rich. The result is **segregation** — an uneven distribution of tin throughout the casting.

There are two types: **microsegregation** (tin variation within a single dendrite, from core to edge) and **macrosegregation** (tin variation across the entire casting, from surface to centre). Both degrade the casting quality: tin-rich regions are brittle, copper-rich regions are soft.

In the code below, you will model the Scheil equation, which predicts the composition of the solidifying metal as a function of how much has already solidified. This is one of the most important equations in casting metallurgy.

*The Scheil equation assumes no diffusion in the solid but complete mixing in the liquid. It predicts the "worst case" segregation and is widely used in foundry practice.*`,
      analogy: 'Imagine making a smoothie and pouring it into an ice cube tray. As the first cubes freeze, the ice is mostly water — the sugar and flavour concentrate in the remaining liquid. The last cubes to freeze are extremely sugary. This is exactly what happens with tin in bronze: the first metal to solidify is tin-poor, and the last is tin-rich.',
      storyConnection: 'Experienced Swamimalai casters know that thin sections of a sculpture (fingers, decorative details) solidify first and have different properties than thick sections (the body). They compensate by designing the pouring system so that thin sections are filled last with the hottest, most fluid metal, reducing segregation in critical areas.',
      checkQuestion: 'If a bronze with 10% tin starts solidifying, and the first crystals contain only 6% tin, where did the extra tin go?',
      checkAnswer: 'The extra 4% tin was rejected into the remaining liquid. As solidification continues, the liquid becomes progressively richer in tin. The last liquid to solidify might contain 20-25% tin — enough to form a brittle intermetallic phase. This is why the centre of thick casting sections is often the weakest point.',
      codeIntro: 'Model compositional segregation during bronze solidification using the Scheil equation.',
      code: `import numpy as np

# Scheil equation for segregation during solidification
# C_solid = k * C_0 * (1 - f_solid)^(k-1)
# where:
#   C_solid = composition of solid forming at fraction f_solid
#   C_0 = initial (overall) composition
#   k = partition coefficient (ratio of solid to liquid composition)
#   f_solid = fraction solidified (0 to 1)

def scheil_solid(f_solid, C_0, k):
    """Composition of solid at fraction solidified"""
    return k * C_0 * (1 - f_solid) ** (k - 1)

def scheil_liquid(f_solid, C_0, k):
    """Composition of remaining liquid at fraction solidified"""
    return C_0 * (1 - f_solid) ** (k - 1)

# Parameters for Cu-Sn system
C_0 = 10.0  # overall tin content (wt%)
k = 0.15    # partition coefficient for Sn in Cu

print("=== Scheil Segregation Model for 10% Sn Bronze ===")
print(f"Initial composition: {C_0}% Sn")
print(f"Partition coefficient k = {k}")
print()

header = "Fraction Solid   Solid Comp(% Sn)   Liquid Comp(% Sn)   Ratio"
print(header)
print("-" * len(header))

fractions = [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.95, 0.99]

for fs in fractions:
    if fs >= 1.0:
        continue
    c_solid = scheil_solid(fs, C_0, k)
    c_liquid = scheil_liquid(fs, C_0, k)
    ratio = c_liquid / C_0
    print(f"{fs:>13.2f}    {c_solid:>14.1f}      {c_liquid:>15.1f}     {ratio:>5.1f}x")

print()
print("=== Segregation Severity Index ===")
# Compare different alloys
alloys = [
    ("Bronze (10% Sn)", 10.0, 0.15),
    ("Brass (30% Zn)", 30.0, 0.75),
    ("Al-Si (7% Si)", 7.0, 0.13),
    ("Steel (0.4% C)", 0.4, 0.34),
]

print()
header2 = "Alloy                First Solid  Last Liquid  Severity"
print(header2)
print("-" * len(header2))

for name, c0, kp in alloys:
    first = scheil_solid(0.01, c0, kp)
    last = scheil_liquid(0.95, c0, kp)
    severity = last / first
    print(f"{name:<22} {first:>9.2f}%    {last:>9.1f}%    {severity:>6.1f}x")`,
      challenge: 'Add a homogenization calculation: if the casting is annealed at 700 degrees C, tin diffuses and evens out. Model the time needed for diffusion using the characteristic diffusion time: t = L^2 / D, where L is the dendrite arm spacing and D is the diffusion coefficient for Sn in Cu at 700 degrees C (about 1e-13 m^2/s).',
      successHint: 'The Scheil equation is used in every foundry and casting simulation software worldwide. Modern computational tools like Thermo-Calc and DICTRA build on this exact foundation to predict segregation in complex multi-component alloys.',
    },
    {
      title: 'Porosity — the hidden enemy of cast bronze',
      concept: `Cast bronze almost always contains **porosity** — tiny holes or voids inside the metal. There are two main causes: **shrinkage porosity** (metal contracts as it solidifies, creating voids in the last regions to freeze) and **gas porosity** (dissolved gases come out of solution during solidification, forming bubbles).

Bronze shrinks about **4-6%** by volume when it solidifies. If fresh liquid metal cannot flow in to compensate (called "feeding"), voids form. These voids are concentrated in the centre of thick sections — the last places to solidify — and they dramatically weaken the casting.

In the code below, you will model both types of porosity and calculate their effect on mechanical properties. Even 1% porosity can reduce the tensile strength by 10-20%.

*Porosity is the biggest quality challenge in casting. Modern X-ray and CT scanning can detect internal voids without cutting the casting apart, but the Swamimalai casters had to rely on sound (tapping) and weight checks.*`,
      analogy: 'Think of a water balloon freezing from the outside in. The outer shell freezes first, then the water inside freezes and expands, but the ice shell traps it. The pressure builds until the ice cracks or a void forms inside. Cast metal does the opposite — it shrinks rather than expands — but the result is similar: voids form in the centre because the outer shell solidifies first and blocks feeding.',
      storyConnection: 'Swamimalai casters attach extra wax channels (called risers) to thick sections of the sculpture during mould preparation. These risers become reservoirs of liquid metal that feed the casting as it shrinks during solidification. The size and placement of risers is one of the most critical skills passed down through generations.',
      checkQuestion: 'A bronze casting has 2% porosity by volume. If a fully dense casting would have a tensile strength of 300 MPa, what is the approximate strength with 2% porosity?',
      checkAnswer: 'A common approximation: strength drops by about 8% for each 1% porosity (for small porosity levels). So 2% porosity reduces strength by about 16%, giving 300 x 0.84 = 252 MPa. In practice, the effect depends on pore shape and location — sharp-edged pores are worse than round ones because they concentrate stress.',
      codeIntro: 'Model shrinkage and gas porosity in bronze castings.',
      code: `import numpy as np

# Porosity model for bronze castings

def shrinkage_porosity(section_thickness_mm, riser_distance_mm,
                       solidification_shrinkage=0.05):
    """Estimate shrinkage porosity percentage.
    Porosity increases with section thickness and distance from riser.
    """
    # Feeding effectiveness decreases with distance
    feeding_factor = np.exp(-riser_distance_mm / (10 * section_thickness_mm))
    unfed_shrinkage = solidification_shrinkage * (1 - feeding_factor)
    return unfed_shrinkage * 100  # as percentage

def gas_porosity(pour_temp_C, melt_time_min, degas_treatment=False):
    """Estimate gas porosity from hydrogen pickup.
    Longer melt times = more dissolved hydrogen = more porosity.
    """
    base_gas = 0.001 * melt_time_min  # hydrogen pickup with time
    temp_factor = (pour_temp_C - 900) / 200  # higher temp = more gas
    degas_factor = 0.2 if degas_treatment else 1.0
    return base_gas * temp_factor * degas_factor * 100

print("=== Shrinkage Porosity vs Section Geometry ===")
print()
header = "Thickness(mm)  Riser Dist(mm)  Porosity(%)  Rating"
print(header)
print("-" * len(header))

for thick in [5, 10, 20, 30, 50]:
    for dist in [10, 30, 60, 100]:
        poros = shrinkage_porosity(thick, dist)
        rating = "Good" if poros < 0.5 else "Accept" if poros < 2 else "Reject"
        if dist == 10 or thick == 20:  # show subset
            print(f"{thick:>11}    {dist:>12}    {poros:>9.2f}    {rating}")

print()
print("=== Gas Porosity vs Processing Conditions ===")
print()
header2 = "Pour Temp(C)  Melt Time(min)  Degassed?  Gas Poros(%)"
print(header2)
print("-" * len(header2))

for temp in [950, 1000, 1050, 1100]:
    for time in [15, 30, 60]:
        for degas in [False, True]:
            poros = gas_porosity(temp, time, degas)
            if time == 30 or degas:
                tag = "Yes" if degas else "No"
                print(f"{temp:>10}    {time:>12}    {tag:>7}    {poros:>9.3f}")

print()
print("=== Effect of Porosity on Mechanical Properties ===")
print()
base_strength = 300  # MPa for fully dense bronze
for poros_pct in [0, 0.5, 1.0, 2.0, 3.0, 5.0]:
    # Empirical: sigma = sigma_0 * exp(-b * porosity)
    strength = base_strength * np.exp(-0.07 * poros_pct * 100 / 10)
    reduction = (1 - strength / base_strength) * 100
    print(f"  {poros_pct:>4.1f}% porosity: {strength:>6.0f} MPa ({reduction:>4.1f}% reduction)")`,
      challenge: 'Design an optimal riser system: for a sculpture with a 40 mm thick body section, calculate the minimum riser diameter and height needed to supply enough liquid metal to compensate for 5% shrinkage. The riser must solidify after the casting (so it must be at least as thick as the casting section).',
      successHint: 'Porosity prediction is the core of modern casting simulation software (MAGMA, ProCAST, SOLIDCast). Foundries run these simulations before every pour to optimize riser placement and minimize defects. You just built a simplified version of what those tools do.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Nucleation, microstructure, and solidification science</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises use Python to model nucleation, grain growth, dendrite formation, and casting defects.
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
