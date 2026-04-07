import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function BankuraLevel2() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Chemical reactions in clay — what happens at the molecular level',
      concept: `Clay is primarily **kaolinite** (Al2Si2O5(OH)4). During firing, a sequence of chemical reactions transforms soft, water-soluble clay into hard, permanent ceramic. The key reactions occur at specific temperatures:

**100-250 C**: Free and adsorbed water evaporates. **350-600 C**: Chemically bound hydroxyl groups are driven off (dehydroxylation): Al2Si2O5(OH)4 -> Al2Si2O7 + 2H2O. The clay loses about 14% of its weight as water. **573 C**: Quartz inversion (alpha to beta quartz). **900-1000 C**: Sintering begins — particles fuse into a continuous solid. **1100+ C**: Mullite formation (3Al2O3 * 2SiO2) — the strongest ceramic phase.

Each reaction has a specific energy requirement (endothermic — absorbs heat) or releases energy (exothermic). The firing schedule must supply enough energy at each stage.`,
      analogy: 'Firing clay is like baking a cake through distinct stages. First, moisture evaporates (drying). Then, chemical changes create new structures (rising). Finally, the surface sets permanently (browning). You cannot rush any stage — the chemistry needs time at the right temperature.',
      storyConnection: 'Bankura potters recognize each stage by sensory cues: steam escaping (water loss), a subtle smell (organic burnout), colour changes (iron oxide reactions), and the "ring" when tapped (sintering complete). A well-fired Bankura horse gives a clear, bell-like ring when tapped — a sign that sintering has created a continuous, strong ceramic structure.',
      checkQuestion: 'Kaolinite dehydroxylation: Al2Si2O5(OH)4 -> Al2Si2O7 + 2H2O. If you start with 100 kg of kaolinite (MW = 258 g/mol), how much water is lost?',
      checkAnswer: 'Water lost = 2 * 18 / 258 * 100 = 13.95 kg. About 14% of the clay weight is lost as water vapour. For a kiln holding 50 kg of pottery, that is 7 kg of steam that must escape without building up pressure — which is why ramp rates must be slow during this phase.',
      codeIntro: 'Model the chemical reactions at each temperature and calculate energy requirements.',
      code: `import numpy as np

# Clay chemistry during firing

class ClayReaction:
    def __init__(self, name, T_start, T_end, energy_kJ_per_kg,
                 weight_loss_pct, is_endothermic=True):
        self.name = name
        self.T_start = T_start
        self.T_end = T_end
        self.energy = energy_kJ_per_kg
        self.weight_loss = weight_loss_pct
        self.endothermic = is_endothermic

reactions = [
    ClayReaction("Free water evaporation", 25, 120, 300, 5.0),
    ClayReaction("Adsorbed water loss", 120, 250, 150, 3.0),
    ClayReaction("Organic matter burnout", 250, 450, -200, 2.0, False),
    ClayReaction("Dehydroxylation", 450, 600, 500, 14.0),
    ClayReaction("Quartz inversion (573C)", 560, 580, 15, 0),
    ClayReaction("Sintering begins", 800, 900, 100, 0),
    ClayReaction("Full sintering", 900, 1000, 200, 0),
    ClayReaction("Mullite formation", 1050, 1200, 300, 0),
]

clay_mass = 50  # kg (total pottery load)

print("=== Clay Chemistry During Firing ===")
print(f"Initial clay mass: {clay_mass} kg")
print()
print(f"{'Reaction':<28} {'T range':>10} {'Energy':>10} {'Mass loss':>10} {'Type':<12}")
print("-" * 72)

remaining_mass = clay_mass
total_energy = 0

for r in reactions:
    E = r.energy * remaining_mass / 1000  # total MJ
    mass_loss = remaining_mass * r.weight_loss / 100
    rtype = "Endothermic" if r.endothermic else "Exothermic"
    sign = "+" if r.endothermic else "-"

    print(f"{r.name:<28} {r.T_start:>3}-{r.T_end:>4} C {sign}{abs(E):>7.1f} MJ "
          f"{mass_loss:>7.1f} kg {rtype:<12}")

    remaining_mass -= mass_loss
    total_energy += E if r.endothermic else -E

print(f"\\n{'TOTALS':<28} {'':>10} {total_energy:>8.1f} MJ "
      f"{clay_mass - remaining_mass:>7.1f} kg")
print(f"Final mass: {remaining_mass:.1f} kg ({remaining_mass/clay_mass*100:.0f}% of original)")

# Property changes with temperature
print()
print("=== Clay Properties vs Temperature ===")
print(f"{'Temp (C)':>10} {'Porosity %':>12} {'Strength MPa':>14} {'Colour':<16}")
print("-" * 54)

temps = [25, 200, 400, 573, 700, 850, 900, 1000, 1100]
for T in temps:
    # Simplified property models
    if T < 200:
        porosity, strength, colour = 35, 1, "Grey (wet)"
    elif T < 500:
        porosity, strength, colour = 30, 2, "Tan"
    elif T < 700:
        porosity, strength, colour = 25, 5, "Pink"
    elif T < 850:
        porosity, strength, colour = 20, 10, "Light red"
    elif T < 950:
        porosity, strength, colour = 12, 25, "Red (terracotta)"
    elif T < 1050:
        porosity, strength, colour = 8, 35, "Dark red"
    else:
        porosity, strength, colour = 3, 50, "Brown/dark"

    print(f"{T:>10} {porosity:>10}% {strength:>12} {colour:<16}")

# Water vapour pressure risk
print()
print("=== Steam Pressure Risk During Heating ===")
print("If ramp is too fast, steam cannot escape and pressure builds")
print()

for ramp in [50, 80, 120, 200]:
    # Time through water loss zone (25-250 C)
    time_h = 225 / ramp
    steam_rate = clay_mass * 0.08 / time_h  # kg/hour of steam
    print(f"  Ramp {ramp:>3} C/h: water zone in {time_h:.1f}h, "
          f"steam rate {steam_rate:.1f} kg/h "
          f"{'SAFE' if steam_rate < 3 else 'RISKY' if steam_rate < 5 else 'DANGEROUS'}")`,
      challenge: 'Calculate the energy balance for the entire firing: how much energy goes to chemical reactions vs how much goes to simply heating the mass (Q = mcT)? Which dominates? This explains why firing is so fuel-intensive.',
      successHint: 'Clay chemistry follows the same principles as all materials processing: metallurgy, glass-making, cement production, and semiconductor fabrication. Temperature-dependent phase transformations are universal — understanding them lets you control the properties of any material.',
    },
    {
      title: 'Sintering mechanics — particles fusing into solid ceramic',
      concept: `**Sintering** is the process by which individual clay particles bond together into a continuous solid. At temperatures above 800 C, the surfaces of silica and alumina particles begin to soften and flow. Where particles touch, a **neck** forms — a bridge of material connecting the two particles.

The driving force for sintering is surface energy: the system minimises total surface area by fusing particles together (fewer separate surfaces). The sintering rate depends on temperature (exponentially) and particle size (smaller particles sinter faster).

The **Arrhenius equation** describes the temperature dependence: **rate = A * exp(-E_a / (R*T))**, where E_a is the activation energy. This exponential dependence means that a 50 C increase in peak temperature can double the sintering rate.`,
      analogy: 'Imagine pressing two pieces of soft candy together. At room temperature, they barely stick. Warm them slightly and they bond easily. Heat them more and they flow together completely. Sintering is the same process at much higher temperatures — clay particles are the "candies" and the kiln provides the heat to make them flow.',
      storyConnection: 'Bankura potters judge sintering completion by the "tap test": a well-sintered piece gives a clear ring, while an under-sintered piece sounds dull. This is because sintering creates a continuous path for sound waves — gaps between un-sintered particles damp the vibration. The tap test is a remarkably effective non-destructive quality check.',
      checkQuestion: 'If sintering rate doubles for every 50 C increase, how many times faster is sintering at 1000 C than at 800 C?',
      checkAnswer: 'Temperature increase = 200 C. Number of doublings = 200/50 = 4. Rate increase = 2^4 = 16 times faster. This explains why a 2-hour hold at 1000 C achieves the same sintering as a 32-hour hold at 800 C. Peak temperature matters enormously.',
      codeIntro: 'Model the sintering process using Arrhenius kinetics and track densification over time.',
      code: `import numpy as np

# Sintering model using Arrhenius kinetics

R_gas = 8.314  # J/(mol*K)

def sintering_rate(T_celsius, E_activation=200000, A_prefactor=1e12):
    """Arrhenius rate of sintering"""
    T_kelvin = T_celsius + 273.15
    return A_prefactor * np.exp(-E_activation / (R_gas * T_kelvin))

def simulate_sintering(temp_profile, dt_hours=0.1):
    """Simulate sintering given a temperature-time profile"""
    porosity = 35.0  # initial porosity (%)
    density_relative = 65.0  # initial relative density (%)
    history = []

    for T in temp_profile:
        rate = sintering_rate(T)
        # Porosity decreases at a rate proportional to sintering rate
        dpor = -rate * porosity * dt_hours * 1e-8
        porosity = max(2.0, porosity + dpor)
        density_relative = 100 - porosity

        history.append({"T": T, "porosity": porosity,
                       "density": density_relative})

    return history

# Sintering rate vs temperature
print("=== Sintering Rate vs Temperature (Arrhenius) ===")
print(f"{'Temp (C)':>10} {'Rate (rel)':>12} {'Doublings from 800':>20}")
print("-" * 44)

rate_800 = sintering_rate(800)
for T in [600, 700, 750, 800, 850, 900, 950, 1000, 1050, 1100]:
    rate = sintering_rate(T)
    relative = rate / rate_800
    doublings = np.log2(relative) if relative > 0 else 0
    print(f"{T:>10} {relative:>10.2f}x {doublings:>18.1f}")

# Simulate a complete firing
print()
print("=== Sintering During a 900 C Firing ===")

# Build temperature profile (degrees per step)
dt = 0.1  # hours
profile = []
# Ramp up: 0 to 12 hours, 25 to 900 C
for t in np.arange(0, 12, dt):
    T = 25 + (900 - 25) * t / 12
    profile.append(T)
# Soak: 12 to 14 hours at 900 C
for t in np.arange(0, 2, dt):
    profile.append(900)
# Cool: 14 to 30 hours
for t in np.arange(0, 16, dt):
    T = 900 - (900 - 50) * t / 16
    profile.append(T)

history = simulate_sintering(profile, dt)

print(f"{'Hour':>5} {'Temp (C)':>10} {'Porosity %':>12} {'Density %':>12}")
print("-" * 40)

for i in range(0, len(history), int(2/dt)):
    hour = i * dt
    h = history[i]
    print(f"{hour:>5.1f} {h['T']:>8.0f} {h['porosity']:>10.1f} {h['density']:>10.1f}")

# Compare different peak temperatures
print()
print("=== Effect of Peak Temperature (2-hour soak) ===")
print(f"{'Peak T':>8} {'Final porosity':>16} {'Density':>10} {'Quality':<14}")
print("-" * 50)

for peak_T in [750, 800, 850, 900, 950, 1000, 1050, 1100]:
    prof = []
    for t in np.arange(0, 10, dt):
        prof.append(25 + (peak_T - 25) * t / 10)
    for t in np.arange(0, 2, dt):
        prof.append(peak_T)
    for t in np.arange(0, 10, dt):
        prof.append(peak_T - (peak_T - 50) * t / 10)

    h = simulate_sintering(prof, dt)
    final_por = h[-1]["porosity"]
    final_den = h[-1]["density"]
    quality = "Under-fired" if final_por > 20 else "Good" if final_por > 8 else "Excellent" if final_por > 3 else "Over-fired"
    print(f"{peak_T:>8} {final_por:>14.1f}% {final_den:>8.1f}% {quality:<14}")

# Particle size effect
print()
print("=== Particle Size Effect on Sintering ===")
print("Finer particles sinter faster (more surface energy)")

for particle_um in [50, 20, 10, 5, 2]:
    # Rate scales inversely with particle size^2
    size_factor = (10 / particle_um)**2
    effective_rate = sintering_rate(900) * size_factor
    print(f"  {particle_um:>3} um particles: {size_factor:>5.1f}x faster sintering")`,
      challenge: 'Simulate a "flash firing" technique: heat to 1100 C in 4 hours instead of 12 (3x faster). Compare the final porosity. Does the higher peak compensate for the shorter time? What are the risks of fast firing? (Hint: thermal stress from Level 1.)',
      successHint: 'Sintering is one of the most important processes in materials manufacturing. Metal powder parts (sintered steel), ceramic tiles, dental crowns, and even 3D-printed metal parts all use sintering. The Arrhenius kinetics you modelled are universal — the same equation governs reaction rates in chemistry, biology, and electronics.',
    },
    {
      title: 'Quartz inversion — the critical 573 C transition',
      concept: `At exactly **573 C**, crystalline quartz (SiO2) undergoes a sudden phase change: **alpha-quartz** transforms to **beta-quartz**. This involves a 0.7% volume expansion. On cooling, the reverse occurs — beta to alpha with 0.7% contraction.

This might seem small, but 0.7% expansion creates enormous internal stress if different parts of the pottery are at different temperatures. If the surface has passed through 573 C but the interior has not, the surface has expanded while the interior has not — creating a tensile stress that can fracture the piece.

The solution: slow the ramp rate to **30 C/hour or less** through the 550-600 C zone, giving the entire piece time to pass through the transition uniformly.`,
      analogy: 'Imagine a crowd of people in a narrow corridor. At a doorway (573 C), everyone must make a 90-degree turn (phase change). If the crowd moves slowly, everyone turns smoothly. If the crowd pushes fast, people at the front turn but those behind haven\'t yet — the resulting pile-up (stress concentration) can be catastrophic.',
      storyConnection: 'Bankura potters call the 573 C zone "the danger point." They maintain a slow, steady fire through this range and listen for the dreaded "tick" sound — a crack forming. An experienced potter can hear a crack starting and immediately slow the fire to prevent it from propagating. The quartz inversion is the single most common cause of firing failures.',
      checkQuestion: 'If quartz expands 0.7% at 573 C and a pottery piece is 30 cm long, how much does it grow?',
      checkAnswer: '30 cm * 0.007 = 0.21 cm = 2.1 mm. This 2.1 mm expansion happens suddenly at one temperature. If the surface has expanded but the interior (only 1 cm deeper) has not, the surface is 2.1 mm "too long" for the interior — creating enormous tensile stress on the interior.',
      codeIntro: 'Model the quartz inversion transition and calculate the stress it creates in different pottery sizes.',
      code: `import numpy as np

# Quartz inversion model at 573 C

T_inversion = 573  # C
expansion_fraction = 0.007  # 0.7% volume expansion
linear_expansion = expansion_fraction / 3  # linear = volume/3

# Stress from quartz inversion
def quartz_stress(dT_across_piece, E_GPa=5.0, alpha_quartz=0.0023):
    """
    Stress when one part has inverted and the other hasn't.
    alpha_quartz = linear expansion at inversion (~0.23%)
    """
    strain = alpha_quartz  # one side expanded, other hasn't
    # Fraction of piece that has inverted
    fraction_inverted = min(1, max(0, dT_across_piece / 5))  # 5C transition width
    effective_strain = strain * fraction_inverted * (1 - fraction_inverted) * 4  # max at 50%
    stress = E_GPa * 1000 * effective_strain  # MPa
    return stress

# Temperature gradient during passage through 573 C
print("=== Quartz Inversion Stress Analysis ===")
print(f"Inversion temperature: {T_inversion} C")
print(f"Volume expansion: {expansion_fraction*100}%")
print(f"Linear expansion: {linear_expansion*100:.2f}%")
print()

# For different piece thicknesses and ramp rates
clay_k = 0.8
clay_rho = 1800
clay_c = 900
clay_strength = 5  # MPa at 573 C

print(f"{'Thickness':>10} {'Ramp (C/h)':>12} {'dT across':>10} {'Stress':>10} {'Risk':<10}")
print("-" * 54)

for thick_cm in [1, 2, 4, 6, 8, 10]:
    for ramp in [30, 50, 80, 120]:
        thick = thick_cm / 100
        L = thick / 2
        alpha_thermal = clay_k / (clay_rho * clay_c)
        dT = ramp / 3600 * L**2 / (2 * alpha_thermal)
        stress = quartz_stress(dT)
        risk = "LOW" if stress < clay_strength * 0.3 else "MODERATE" if stress < clay_strength * 0.6 else "HIGH" if stress < clay_strength else "CRACK!"
        if ramp == 80:  # show all at one ramp rate
            print(f"{thick_cm:>8} cm {ramp:>10} {dT:>8.1f} C {stress:>8.2f} {risk:<10}")

print()

# Safe ramp rate for each thickness
print("=== Maximum Safe Ramp Rate Through 573 C ===")
print(f"{'Thickness (cm)':>16} {'Max rate (C/h)':>14} {'Time 550-600 C':>16}")
print("-" * 48)

for thick_cm in [1, 2, 3, 4, 6, 8, 10, 15]:
    thick = thick_cm / 100
    L = thick / 2
    alpha_thermal = clay_k / (clay_rho * clay_c)

    for rate in range(200, 5, -5):
        dT = rate / 3600 * L**2 / (2 * alpha_thermal)
        stress = quartz_stress(dT)
        if stress < clay_strength * 0.3:  # safe margin
            time_50C = 50 / rate  # hours to traverse 50 C zone
            print(f"{thick_cm:>16} {rate:>12} {time_50C:>14.1f} h")
            break

# Cooling is equally dangerous
print()
print("=== Cooling Through 573 C (Equally Critical!) ===")
print("On cooling, beta-quartz contracts back to alpha-quartz")
print("The surface cools and contracts first, putting interior in tension")
print()

for thick_cm in [2, 4, 6, 10]:
    thick = thick_cm / 100
    L = thick / 2
    alpha_thermal = clay_k / (clay_rho * clay_c)
    for rate in range(200, 5, -5):
        dT = rate / 3600 * L**2 / (2 * alpha_thermal)
        stress = quartz_stress(dT)
        if stress < clay_strength * 0.3:
            print(f"  {thick_cm} cm piece: max cooling rate = {rate} C/h through 573 C")
            break

print()
print("Cooling is actually MORE dangerous than heating —")
print("the clay is more brittle after sintering, and contraction")
print("creates tensile stress (which ceramics resist poorly).")`,
      challenge: 'Some potters add "grog" (pre-fired ground clay) to their clay body. Grog has already passed through quartz inversion and will not expand again. If the clay body contains 30% grog, how does this reduce the effective expansion? Calculate the new stress levels. This is why Bankura potters reuse broken pieces as grog.',
      successHint: 'Phase transitions with volume changes occur throughout materials science: water freezing (9% expansion — breaks pipes), steel quenching (martensite transformation), and concrete setting (ettringite formation). The principle is always the same: sudden volume changes create internal stress, and managing the rate of change is the key to success.',
    },
    {
      title: 'Water absorption test — quality control for fired terracotta',
      concept: `The **water absorption test** is the primary quality metric for fired ceramics. A well-fired piece absorbs very little water (porosity is low because sintering closed the pores). The test is simple: weigh the dry piece, soak it in water for 24 hours, weigh it again. Water absorption = (wet_weight - dry_weight) / dry_weight * 100%.

Standards: terracotta (15-25%), earthenware (5-15%), stoneware (1-5%), porcelain (<0.5%). Bankura terracotta typically targets 10-20% — low enough for durability but high enough to maintain the characteristic earthy, breathable quality.

Water absorption correlates strongly with: compressive strength (lower absorption = stronger), frost resistance (lower = better), and durability (lower = longer lasting).`,
      analogy: 'Think of a kitchen sponge (high absorption) vs a ceramic plate (low absorption). The sponge is full of interconnected pores that suck in water. The plate has few pores — its surface is mostly sealed. Firing closes pores, transforming sponge-like unfired clay into plate-like ceramic. The absorption test measures how completely this transformation occurred.',
      storyConnection: 'Before shipping Bankura horses to galleries or export markets, potters perform the water absorption test. Horses that absorb more than 20% are classified as "decorative only" (indoor use). Those below 15% are rated for outdoor use. Below 10% is premium quality — these survive decades of monsoon rain without degradation. Buyers increasingly demand test certificates as quality proof.',
      checkQuestion: 'A terracotta horse weighs 2,400 g dry and 2,760 g after 24-hour water soak. What is the water absorption? What quality grade?',
      checkAnswer: 'Absorption = (2760 - 2400) / 2400 * 100 = 360/2400 * 100 = 15.0%. This is at the boundary between "outdoor quality" (below 15%) and "decorative" (above 15%). The potter might re-fire this piece at a slightly higher temperature to push absorption below 15%.',
      codeIntro: 'Simulate water absorption testing and build a quality control system for Bankura terracotta.',
      code: `import numpy as np

# Water absorption quality control system

class WaterAbsorptionTest:
    def __init__(self, dry_weight_g, wet_weight_g, piece_name=""):
        self.dry = dry_weight_g
        self.wet = wet_weight_g
        self.name = piece_name
        self.absorption = (wet_weight_g - dry_weight_g) / dry_weight_g * 100

    def grade(self):
        if self.absorption < 5:
            return "Premium (stoneware-like)"
        elif self.absorption < 10:
            return "A: Outdoor, all weather"
        elif self.absorption < 15:
            return "B: Outdoor, sheltered"
        elif self.absorption < 20:
            return "C: Indoor/covered"
        elif self.absorption < 25:
            return "D: Decorative only"
        else:
            return "REJECT: Under-fired"

    def properties(self):
        """Estimate physical properties from absorption"""
        # Empirical correlations
        strength = 40 - 1.5 * self.absorption  # MPa (approximate)
        frost_cycles = max(0, int(500 - 20 * self.absorption))
        lifespan_years = max(5, int(100 - 3 * self.absorption))
        return strength, frost_cycles, lifespan_years

# Test a batch of pottery
np.random.seed(42)

# Simulate a kiln load: pieces at different positions get different firing
n_pieces = 20
piece_names = [f"Horse-{i+1:02d}" for i in range(n_pieces)]

# Firing temperature varies by position (edges cooler)
position_factor = np.random.normal(1.0, 0.1, n_pieces)
base_absorption = 12  # target at perfect firing

tests = []
for i in range(n_pieces):
    dry_w = np.random.uniform(1500, 4000)
    # Absorption inversely related to temperature (position factor)
    absorption_pct = base_absorption / position_factor[i]
    wet_w = dry_w * (1 + absorption_pct / 100)
    test = WaterAbsorptionTest(dry_w, wet_w, piece_names[i])
    tests.append(test)

print("=== Bankura Quality Control: Water Absorption Test ===")
print(f"Batch size: {n_pieces} pieces")
print()
print(f"{'Piece':<14} {'Dry (g)':>8} {'Wet (g)':>8} {'Absorption':>10} {'Grade':<24}")
print("-" * 66)

grade_counts = {}
for t in sorted(tests, key=lambda x: x.absorption):
    grade = t.grade()
    grade_counts[grade] = grade_counts.get(grade, 0) + 1
    print(f"{t.name:<14} {t.dry:>6.0f} {t.wet:>6.0f} {t.absorption:>8.1f}% {grade:<24}")

# Batch statistics
absorptions = [t.absorption for t in tests]
print()
print("=== Batch Statistics ===")
print(f"Mean absorption:   {np.mean(absorptions):.1f}%")
print(f"Std deviation:     {np.std(absorptions):.1f}%")
print(f"Min/Max:           {np.min(absorptions):.1f}% / {np.max(absorptions):.1f}%")
print()

print("Grade distribution:")
for grade, count in sorted(grade_counts.items()):
    pct = count / n_pieces * 100
    bar = "#" * int(pct / 2)
    print(f"  {grade:<28} {count:>3} ({pct:>4.0f}%) {bar}")

# Property estimates
print()
print("=== Estimated Properties ===")
print(f"{'Absorption':>12} {'Strength':>10} {'Frost cycles':>14} {'Lifespan':>10}")
print("-" * 48)

for abs_pct in [5, 8, 10, 12, 15, 18, 22, 28]:
    t = WaterAbsorptionTest(1000, 1000*(1+abs_pct/100))
    s, fc, life = t.properties()
    print(f"{abs_pct:>10}% {s:>8.0f} MPa {fc:>12} {life:>8} years")

# Economic impact of quality
print()
print("=== Economic Impact ===")
prices = {"Premium": 5000, "A": 3000, "B": 1500, "C": 800, "D": 400, "REJECT": 0}

total_revenue = 0
for t in tests:
    grade_letter = t.grade()[0]
    for key in prices:
        if key.startswith(grade_letter):
            total_revenue += prices[key]
            break

max_revenue = n_pieces * prices["Premium"]
print(f"Actual revenue:  Rs {total_revenue:,}")
print(f"If all Premium:  Rs {max_revenue:,}")
print(f"Quality gap:     Rs {max_revenue - total_revenue:,} ({(1-total_revenue/max_revenue)*100:.0f}%)")`,
      challenge: 'The potter fires the next batch at 50 C higher peak temperature. Simulate this: shift all absorption values down by 3%. How does the grade distribution change? Calculate the revenue improvement. Is the extra fuel cost (about Rs 500 per batch) worth it?',
      successHint: 'Quality control through standardised testing is the foundation of every manufacturing industry. The absorption test you just implemented is actually an international standard (ASTM C373). Understanding the correlation between process parameters (firing temperature) and product quality (absorption) is the essence of manufacturing engineering.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Chemical reactions, sintering, and quartz inversion</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises use Python to model clay chemistry, sintering kinetics, and quality control for Bankura terracotta.
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
