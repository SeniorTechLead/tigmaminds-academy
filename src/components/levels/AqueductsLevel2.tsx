import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function AqueductsLevel2() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Darcy-Weisbach pipe friction — why water slows down in conduits',
      concept: `Water flowing through a pipe or channel loses energy to **friction** against the walls. The **Darcy-Weisbach equation** tells you exactly how much:

**h_f = f × (L/D) × (v²/2g)**

Where h_f is the head loss (metres of water), f is the friction factor (dimensionless), L is the pipe length, D is the pipe diameter, v is the flow velocity, and g is gravity.

The friction factor f depends on the pipe's **roughness** and the **Reynolds number** (whether the flow is smooth/laminar or turbulent). Rough stone channels have high f; smooth lead or ceramic pipes have low f.

Head loss matters because every metre of friction loss is a metre of elevation the aqueduct must provide. A 50 km aqueduct with high friction might need 10 m more elevation than one with smooth pipes — that's 10 m more height the engineers must find in the terrain.

📚 *Head loss is expressed in metres because it represents the height of a column of water that would produce the same pressure. Losing 5 m of head is equivalent to losing the pressure from a 5 m tall water tower.*`,
      analogy: 'Imagine sliding a heavy box across a rough floor. The rougher the floor, the more force you need — and the more energy you lose to friction. Water in a pipe is the same: the rougher the pipe walls, the more pressure is lost pushing water through. A smooth pipe is like a polished floor — the box (water) glides easily.',
      storyConnection: 'Roman engineers lined their aqueduct channels with opus signinum — a waterproof plaster made of lime and crushed terracotta. This served two purposes: it sealed the channel against leaks AND it reduced surface roughness, lowering friction losses. The smoother the lining, the less gradient the aqueduct needed — saving enormous construction effort over 50+ km routes.',
      checkQuestion: 'Two pipes carry water over 1 km. Pipe A has a friction factor of 0.03 and diameter 0.5 m. Pipe B has f = 0.01 and diameter 0.5 m. Both carry water at 1 m/s. Which has more head loss?',
      checkAnswer: 'h_f = f × (L/D) × v²/(2g). Pipe A: 0.03 × (1000/0.5) × 1²/(2×9.81) = 3.06 m. Pipe B: 0.01 × (1000/0.5) × 1²/(2×9.81) = 1.02 m. Pipe A loses 3× more head — it needs 3× more gradient to deliver the same flow. Roughness matters enormously over long distances.',
      codeIntro: 'Calculate friction losses for different aqueduct lining materials and channel dimensions.',
      code: `import numpy as np

def darcy_weisbach(f, length, diameter, velocity, g=9.81):
    """Head loss (m) from Darcy-Weisbach equation."""
    return f * (length / diameter) * (velocity**2 / (2 * g))

def reynolds_number(velocity, diameter, viscosity=1e-6):
    """Reynolds number for pipe flow."""
    return velocity * diameter / viscosity

def friction_factor_turbulent(roughness, diameter, Re):
    """Colebrook-White approximation (Swamee-Jain)."""
    if Re < 2300:
        return 64 / Re  # laminar
    term = roughness / (3.7 * diameter) + 5.74 / Re**0.9
    return 0.25 / (np.log10(term))**2

# Aqueduct channel materials
linings = [
    {"name": "Bare rock (rough)",  "roughness": 5e-3},
    {"name": "Cut stone blocks",   "roughness": 1.5e-3},
    {"name": "Opus signinum",      "roughness": 0.5e-3},
    {"name": "Polished marble",    "roughness": 0.1e-3},
    {"name": "Lead pipe",          "roughness": 0.05e-3},
    {"name": "Modern PVC pipe",    "roughness": 0.007e-3},
]

length_m = 50000   # 50 km — typical Roman aqueduct
diameter = 0.8     # equivalent diameter of channel
velocity = 0.7     # m/s — typical aqueduct flow speed

print("=== Darcy-Weisbach Friction Analysis ===")
print(f"Aqueduct length: {length_m/1000:.0f} km | Channel Ø: {diameter} m | Velocity: {velocity} m/s")
print(f"{'Lining':<22} {'Roughness':>10} {'f':>8} {'Head Loss':>10} {'Gradient':>10}")
print("-" * 62)

Re = reynolds_number(velocity, diameter)
print(f"(Reynolds number: {Re:.0f} — {'turbulent' if Re > 2300 else 'laminar'} flow)")
print()

for mat in linings:
    f = friction_factor_turbulent(mat["roughness"], diameter, Re)
    h_loss = darcy_weisbach(f, length_m, diameter, velocity)
    gradient = h_loss / length_m * 1000  # m per km
    print(f"{mat['name']:<22} {mat['roughness']:>8.4f}m {f:>7.4f} {h_loss:>8.1f} m {gradient:>8.2f} m/km")

# What gradient did the Romans actually use?
print("\
=== Historical Comparison ===")
aqueducts = [
    ("Aqua Appia (312 BC)", 16.4, 0.67),
    ("Aqua Marcia (144 BC)", 91.3, 2.94),
    ("Aqua Claudia (52 AD)", 68.7, 3.15),
    ("Pont du Gard supply", 50.0, 0.34),
]
for name, length_km, gradient_m_per_km in aqueducts:
    total_drop = gradient_m_per_km * length_km
    print(f"{name:<26} Length: {length_km:>5.1f} km  Gradient: {gradient_m_per_km:.2f} m/km  Total drop: {total_drop:.0f} m")`,
      challenge: 'The Pont du Gard had an extraordinary gradient of just 0.34 m/km — a drop of only 34 cm per kilometre. Calculate what friction factor and lining quality this requires. Could they achieve this with rough stone, or did they need the smoothest opus signinum? (Hint: rearrange Darcy-Weisbach to solve for f.)',
      successHint: 'The Darcy-Weisbach equation is the fundamental tool for sizing pipes and channels in hydraulic engineering. Every municipal water system, hydroelectric plant, and irrigation network is designed using this equation — the same physics the Romans used empirically.',
    },
    {
      title: 'Inverted siphon design — pressure vessel analysis across valleys',
      concept: `When a Roman aqueduct encountered a valley too deep for a bridge, the engineers used an **inverted siphon** — a U-shaped pipe that descends into the valley and climbs back up the other side. Water flows down under gravity, building up **hydrostatic pressure** at the bottom:

**P = ρgh**

Where ρ is water density (1000 kg/m³), g is gravity (9.81 m/s²), and h is the height of the water column above.

At the bottom of a 50 m deep siphon, the pressure is 1000 × 9.81 × 50 = 490,500 Pa ≈ 5 atmospheres. The pipe must withstand this pressure without bursting.

The Romans used lead pipes or stone-block pressure conduits for siphons. The **hoop stress** in a cylindrical pipe under internal pressure is:

**σ = P × r / t**

Where r is the pipe radius and t is the wall thickness. If hoop stress exceeds the material's tensile strength, the pipe bursts.

📚 *An inverted siphon works because of Pascal's principle: pressure in a connected fluid is the same at the same elevation. Water "wants" to reach the same level on both sides — so it will climb up the far side of the valley, minus friction losses.*`,
      analogy: 'Hold a U-shaped tube of water. The water level is equal on both sides — that is Pascal\'s principle. Now imagine the U is 50 metres deep. The water at the bottom is under enormous pressure from the weight of water above it — like being 50 m underwater. The pipe at the bottom must be strong enough to contain that pressure.',
      storyConnection: 'The siphon at Aspendos in Turkey dropped 15 m into a valley using stone pressure pipes. The Lyon aqueducts in Roman Gaul had siphons crossing valleys over 100 m deep, with lead pipes carrying water at pressures exceeding 10 atmospheres. These were among the most audacious engineering feats of the ancient world.',
      checkQuestion: 'A siphon crosses a 40 m deep valley. What is the water pressure at the bottom? If the lead pipe has radius 0.15 m and wall thickness 0.01 m, what is the hoop stress?',
      checkAnswer: 'P = ρgh = 1000 × 9.81 × 40 = 392,400 Pa ≈ 3.9 atm. Hoop stress σ = P × r / t = 392,400 × 0.15 / 0.01 = 5,886,000 Pa ≈ 5.9 MPa. Lead\'s tensile strength is ~12-17 MPa, so the safety factor is about 2-3×. The pipe holds — but just barely for deeper valleys.',
      codeIntro: 'Analyse inverted siphon designs — pressure, hoop stress, and pipe sizing for different valley depths.',
      code: `import numpy as np

def hydrostatic_pressure(depth, rho=1000, g=9.81):
    """Pressure at a given depth (Pa)."""
    return rho * g * depth

def hoop_stress(pressure, radius, thickness):
    """Hoop (circumferential) stress in a thin-walled cylinder (Pa)."""
    return pressure * radius / thickness

def required_thickness(pressure, radius, allowable_stress):
    """Minimum wall thickness for a given pressure and material."""
    return pressure * radius / allowable_stress

# Pipe materials available to Roman engineers
materials = [
    {"name": "Lead pipe",       "tensile_mpa": 15, "density": 11340},
    {"name": "Bronze pipe",     "tensile_mpa": 200, "density": 8800},
    {"name": "Stone conduit",   "tensile_mpa": 5,  "density": 2500},
    {"name": "Ceramic pipe",    "tensile_mpa": 30, "density": 2200},
    {"name": "Modern steel",    "tensile_mpa": 400, "density": 7850},
]

valley_depths = np.array([10, 20, 40, 60, 80, 100, 150])
pipe_radius = 0.15  # 30 cm diameter pipe
safety_factor = 3

print("=== Inverted Siphon Pressure Analysis ===")
print(f"Pipe inner radius: {pipe_radius*100:.0f} cm | Safety factor: {safety_factor}")
print()

# Pressure vs depth
print("Valley Depth vs Pressure:")
for d in valley_depths:
    p = hydrostatic_pressure(d)
    print(f"  {d:>4} m depth → {p/1000:>6.1f} kPa ({p/101325:>5.1f} atm)")

# Required wall thickness for each material
print(f"\
=== Required Pipe Wall Thickness (mm) ===")
print(f"{'Material':<18}" + "".join(f"{d:>7}m" for d in valley_depths))
print("-" * 68)

for mat in materials:
    allowable = mat["tensile_mpa"] * 1e6 / safety_factor
    row = f"{mat['name']:<18}"
    for d in valley_depths:
        p = hydrostatic_pressure(d)
        t = required_thickness(p, pipe_radius, allowable) * 1000  # to mm
        row += f"{t:>7.1f}"
    print(row)

# Mass per metre comparison
print(f"\
=== Pipe Mass per Metre (kg/m) at 40 m depth ===")
p_40 = hydrostatic_pressure(40)
for mat in materials:
    allowable = mat["tensile_mpa"] * 1e6 / safety_factor
    t = required_thickness(p_40, pipe_radius, allowable)
    outer_r = pipe_radius + t
    volume_per_m = np.pi * (outer_r**2 - pipe_radius**2) * 1
    mass = volume_per_m * mat["density"]
    print(f"  {mat['name']:<18} Wall: {t*1000:>5.1f} mm  Mass: {mass:>6.1f} kg/m")`,
      challenge: 'The Lyon siphon at Beaunant crossed a 123 m valley using 9 parallel lead pipes (to handle the flow volume). Calculate the total mass of lead required for a 1 km siphon at that depth. How many ox-carts would be needed to transport it? (One ox-cart carries about 500 kg.) This logistics challenge is why siphons were so expensive.',
      successHint: 'Pressure vessel analysis — calculating hoop stress, required thickness, and safety factors — is the foundation of designing everything from water pipes to rocket fuel tanks to submarine hulls. The physics is identical whether the vessel is a Roman lead pipe or a SpaceX Starship propellant tank.',
    },
    {
      title: 'Arch bridge force analysis — how the Pont du Gard stands',
      concept: `A semicircular arch converts the **vertical load** of water and stone into **compressive forces** that flow along the arch curve down to the foundations. The key principle: a well-designed arch is in pure compression — no tension anywhere.

At any point along the arch, the force has two components: **thrust** (horizontal) and **weight** (vertical). The resultant follows the arch curve. If the arch is shaped correctly (a **catenary** for self-weight, a **parabola** for uniform distributed load), the force line stays within the stone — and stone is excellent in compression.

The horizontal thrust at the base is:

**H = w × L² / (8 × h)**

Where w is the distributed load (N/m), L is the span, and h is the arch rise. A flat arch (small h) has enormous horizontal thrust; a tall arch (large h) has less.

📚 *Compression is pushing — stone can handle enormous compression (granite: 170 MPa). Tension is pulling — stone has almost zero tensile strength (~3 MPa). The genius of the arch is that it converts all loads into compression.*`,
      analogy: 'Squeeze a walnut between your palms — that\'s compression, and the shell resists it easily. Now try to pull the walnut apart — that\'s tension, and the shell cracks instantly. An arch ensures that every stone is being squeezed (compressed), never pulled (tensioned). That\'s why stone arches can stand for 2,000 years — they play to stone\'s strength.',
      storyConnection: 'The Pont du Gard is a three-tier aqueduct bridge with arches spanning up to 24.5 metres. Each arch transfers the weight of the water channel and the upper tiers down to the foundations through pure compression. The horizontal thrust from adjacent arches cancels out, leaving only vertical load on the piers. This is why the bridge stands after 2,000 years with no mortar in its lower tiers — gravity alone holds it together.',
      checkQuestion: 'An arch spans 20 m with a rise of 10 m and carries a distributed load of 50 kN/m. What is the horizontal thrust at the base?',
      checkAnswer: 'H = w × L² / (8h) = 50,000 × 20² / (8 × 10) = 50,000 × 400 / 80 = 250,000 N = 250 kN. Each foundation must resist 250 kN of horizontal push. If the rise were only 5 m (flatter arch), thrust doubles to 500 kN — flat arches push much harder sideways.',
      codeIntro: 'Analyse arch forces for the Pont du Gard — thrust, compression, and stability for each tier.',
      code: `import numpy as np

def arch_thrust(load_per_m, span, rise):
    """Horizontal thrust at base of a parabolic arch (N)."""
    return load_per_m * span**2 / (8 * rise)

def arch_compression_at_base(thrust, vertical_load):
    """Resultant compressive force at the arch springing (N)."""
    return np.sqrt(thrust**2 + vertical_load**2)

def arch_compression_at_crown(thrust):
    """At the crown, the force is purely horizontal = thrust."""
    return thrust

# Pont du Gard tiers
tiers = [
    {"name": "Bottom tier",  "span": 24.5, "rise": 12.0, "piers": 6,  "height": 21.9},
    {"name": "Middle tier",  "span": 19.5, "rise": 8.5,  "piers": 11, "height": 19.5},
    {"name": "Top tier",     "span": 4.6,  "rise": 2.3,  "piers": 35, "height": 7.4},
]

stone_density = 2400  # kg/m³
width = 6.4           # bridge width (m)
g = 9.81

print("=== Pont du Gard Arch Force Analysis ===")
print(f"Stone density: {stone_density} kg/m³ | Width: {width} m\
")

total_weight_above = 0

# Analyse from top tier down
for tier in reversed(tiers):
    # Self-weight of this tier (approximate)
    tier_volume = tier["span"] * tier["piers"] * tier["height"] * width * 0.4
    tier_weight = tier_volume * stone_density * g  # N
    total_weight_above += tier_weight

    # Load per metre on the arch
    load_per_m = total_weight_above / (tier["span"] * tier["piers"])

    # Forces
    H = arch_thrust(load_per_m, tier["span"], tier["rise"])
    V = load_per_m * tier["span"] / 2  # vertical reaction per arch
    R = arch_compression_at_base(H, V)
    C_crown = arch_compression_at_crown(H)

    # Stress at base (assuming pier cross-section)
    pier_area = width * 3.0  # approximate pier width 3m
    stress_kpa = R / (pier_area * 1000)

    print(f"{tier['name']}:")
    print(f"  Span: {tier['span']} m | Rise: {tier['rise']} m | Rise/Span: {tier['rise']/tier['span']:.2f}")
    print(f"  Horizontal thrust:   {H/1000:>8.0f} kN")
    print(f"  Vertical reaction:   {V/1000:>8.0f} kN")
    print(f"  Base compression:    {R/1000:>8.0f} kN")
    print(f"  Crown compression:   {C_crown/1000:>8.0f} kN")
    print(f"  Pier stress:         {stress_kpa:>8.0f} kPa ({stress_kpa/1000:.1f} MPa)")
    print()

# Why rise/span ratio matters
print("=== Effect of Rise/Span Ratio on Thrust ===")
span = 24.5
load = 80000  # N/m (representative)
for ratio in [0.2, 0.3, 0.4, 0.5, 0.6]:
    rise = span * ratio
    H = arch_thrust(load, span, rise)
    print(f"  Rise/Span = {ratio:.1f} (rise = {rise:>5.1f} m)  Thrust: {H/1000:>8.0f} kN")`,
      challenge: 'What happens if one pier settles 5 cm more than its neighbour? The arch must deform to accommodate — and deformation in a rigid stone arch means cracking. Calculate the bending moment induced by a 5 cm differential settlement in a 24.5 m arch. This is why Roman engineers were so careful about foundations — uneven settlement is the arch\'s greatest enemy.',
      successHint: 'Arch analysis is the basis of bridge engineering. The same principles — thrust lines, compression paths, rise-to-span ratios — apply to modern arch bridges, tunnels, and domes. The Sydney Harbour Bridge, the Hoover Dam spillway tunnels, and the dome of the Pantheon all use arch mechanics.',
    },
    {
      title: 'Water quality modelling — residence time and bacterial growth',
      concept: `Roman aqueducts didn't just deliver water — they had to deliver **safe** water. Water sitting too long in a channel grows bacteria. Water flowing too fast erodes the channel lining. The critical parameter is **residence time** — how long water spends in the system:

**t_res = V / Q**

Where V is the total volume of water in the aqueduct and Q is the volumetric flow rate.

Bacteria grow exponentially: **N(t) = N₀ × 2^(t/τ)** where τ is the doubling time (about 20 minutes for E. coli at 37°C, but much slower in cool aqueduct water — roughly 4-8 hours).

If residence time exceeds several doubling periods, bacterial counts can reach dangerous levels. The Romans mitigated this with: (1) fast flow (short residence time), (2) settling basins (piscinae) that removed sediment where bacteria attach, and (3) open channels where UV from sunlight killed surface bacteria.

📚 *Residence time is a universal concept: it appears in chemical reactors, lungs (how long air stays), lakes (how long water stays), and even economics (how long money circulates before being saved).*`,
      analogy: 'Think of a queue at a shop. If 100 people are in the shop and 10 leave per minute, the average time spent inside is 100/10 = 10 minutes. That\'s the residence time. A short queue (small volume, fast flow) means fresh water. A long, slow queue (large volume, slow flow) means stale water with time for bacteria to multiply.',
      storyConnection: 'Frontinus, Rome\'s water commissioner in 97 AD, documented that some aqueducts delivered noticeably better-tasting water than others. The Aqua Marcia — a long, fast-flowing aqueduct from mountain springs — was prized for its cold, fresh taste. The shorter, slower Aqua Alsietina from a lake was considered barely drinkable. Residence time and source quality explained the difference.',
      checkQuestion: 'An aqueduct has a channel volume of 5,000 m³ and delivers 500 m³/hour. What is the residence time? If bacteria double every 6 hours, how many doublings occur during transit?',
      checkAnswer: 'Residence time = 5000/500 = 10 hours. Doublings = 10/6 ≈ 1.67. So bacteria increase by 2^1.67 ≈ 3.2× during transit. If the source water has 100 bacteria per mL, the delivered water has about 320 per mL — still within Roman-era acceptable limits, but getting risky.',
      codeIntro: 'Model water quality through an aqueduct system — residence time, bacterial growth, and settling.',
      code: `import numpy as np

def residence_time_hours(volume_m3, flow_rate_m3_per_hour):
    """Time water spends in the system."""
    return volume_m3 / flow_rate_m3_per_hour

def bacterial_growth(initial_count, time_hours, doubling_time_hours):
    """Exponential bacterial growth."""
    return initial_count * 2**(time_hours / doubling_time_hours)

def uv_kill_fraction(exposure_hours, channel_open=True):
    """Fraction of surface bacteria killed by sunlight (open channel only)."""
    if not channel_open:
        return 0.0
    return min(0.95, 0.3 * exposure_hours)  # caps at 95%

# Roman aqueduct parameters
aqueducts = [
    {"name": "Aqua Marcia",    "length_km": 91, "slope_m_per_km": 2.94,
     "width": 1.2, "depth": 0.8, "open": True,  "source_bacteria": 50},
    {"name": "Aqua Claudia",   "length_km": 69, "slope_m_per_km": 3.15,
     "width": 1.0, "depth": 0.7, "open": True,  "source_bacteria": 80},
    {"name": "Aqua Alsietina", "length_km": 33, "slope_m_per_km": 1.10,
     "width": 0.7, "depth": 0.5, "open": True,  "source_bacteria": 500},
    {"name": "Hypothetical closed pipe", "length_km": 50, "slope_m_per_km": 2.0,
     "width": 0.6, "depth": 0.6, "open": False, "source_bacteria": 80},
]

# Manning's equation for open channel velocity
def manning_velocity(slope_m_per_m, hydraulic_radius, n=0.015):
    """Velocity from Manning's equation (m/s)."""
    return (1/n) * hydraulic_radius**(2/3) * slope_m_per_m**0.5

print("=== Aqueduct Water Quality Analysis ===")
print(f"{'Aqueduct':<28} {'Velocity':>8} {'Res.Time':>9} {'Bacteria*':>10} {'Quality':>8}")
print("-" * 65)

doubling_time = 6.0  # hours (cool water, ~15°C)

for aq in aqueducts:
    # Channel cross-section
    area = aq["width"] * aq["depth"]
    perimeter = aq["width"] + 2 * aq["depth"]
    R_h = area / perimeter

    # Flow velocity and rate
    slope = aq["slope_m_per_km"] / 1000
    v = manning_velocity(slope, R_h)
    Q = v * area * 3600  # m³/hour

    # Volume and residence time
    volume = area * aq["length_km"] * 1000
    t_res = residence_time_hours(volume, Q)

    # Bacterial growth
    bacteria_end = bacterial_growth(aq["source_bacteria"], t_res, doubling_time)

    # UV reduction (open channels only)
    daylight_fraction = 0.5  # assume 12 hrs daylight
    uv_kill = uv_kill_fraction(t_res * daylight_fraction, aq["open"])
    bacteria_final = bacteria_end * (1 - uv_kill)

    # Quality rating
    if bacteria_final < 200:
        quality = "GOOD"
    elif bacteria_final < 1000:
        quality = "FAIR"
    else:
        quality = "POOR"

    print(f"{aq['name']:<28} {v:>6.2f}m/s {t_res:>7.1f}hr {bacteria_final:>8.0f}/mL {quality:>8}")

print("\
* Bacteria per mL at delivery point")
print("Modern WHO guideline: 0 E.coli per 100 mL (much stricter than Roman standards)")
print("Roman 'acceptable': < 1000 per mL (based on taste and turbidity)")`,
      challenge: 'Add a settling basin (piscina) midway through the aqueduct. Assume the basin removes 70% of bacteria (they settle with sediment) but adds 2 hours of residence time. Does the basin improve or worsen final water quality? The answer depends on the bacterial doubling rate — a basin helps when doubling time is long, hurts when it is short.',
      successHint: 'Residence time analysis is fundamental to chemical engineering, environmental science, and public health. Every water treatment plant, wastewater system, and pharmaceutical reactor is designed around residence time. You just applied the same analysis to a 2,000-year-old system — and the physics hasn\'t changed.',
    },
    {
      title: 'Frontinus\'s flow audit — measuring and detecting water theft',
      concept: `Sextus Julius Frontinus became Rome's water commissioner (curator aquarum) in 97 AD and immediately discovered that the aqueduct system was riddled with **illegal taps** — people puncturing the pipes to steal water. He developed the first systematic **flow audit methodology**:

1. **Measure supply**: calculate the flow entering the system from the source
2. **Measure delivery**: measure flow arriving at each distribution point
3. **Calculate losses**: supply - delivery = losses (leaks + theft)
4. **Investigate discrepancies**: large losses in specific sections indicate theft or damage

Frontinus used the **quinariae** — a unit based on the cross-sectional area of a standard pipe (about 0.47 cm² = a pipe of 2.3 cm diameter). He catalogued every legal tap by size and calculated the total authorised draw. Any difference between measured flow and authorised draw was theft.

His method is the ancestor of modern **water balance auditing** — the same technique water utilities use today to detect leaks and unauthorised connections.

📚 *A flow audit is essentially a conservation-of-mass check: water in = water out + losses. If water in > water out + known losses, someone is taking water illegally.*`,
      analogy: 'Imagine tracking money in a bank. You know how much comes in (deposits) and how much goes out through ATMs (authorised withdrawals). If the vault is losing more money than the ATMs dispense, someone is stealing. Frontinus did the same thing with water: he tracked every input and output, and the discrepancy revealed the thieves.',
      storyConnection: 'Frontinus discovered that corrupt pipe-workers (aquarii) were being bribed to install illegal taps. Some wealthy Romans had pipes far larger than their permit allowed. Frontinus standardised pipe sizes, stamped them with official marks, and required regular inspections. His reforms recovered enough water to supply an additional 10,000 people — without building a single new aqueduct.',
      checkQuestion: 'An aqueduct delivers 50,000 quinariae at its source. Legal taps draw 35,000 quinariae. Measured delivery to fountains is 30,000 quinariae. What are the losses?',
      checkAnswer: 'Total losses = 50,000 - 30,000 = 20,000 quinariae (40%). Of this, 35,000 - 30,000 = 5,000 quinariae are being drawn legally but not reaching fountains (pipe leaks). The remaining 50,000 - 35,000 = 15,000 quinariae are "unaccounted for" — stolen through illegal taps. Frontinus found loss rates of 20-40% were common before his reforms.',
      codeIntro: 'Build a flow audit tool that detects leaks and theft in an aqueduct distribution network.',
      code: `import numpy as np

np.random.seed(42)

class AqueductSection:
    """Represents a section of aqueduct between two measurement points."""
    def __init__(self, name, length_km, legal_taps_quin, leak_rate_pct, theft_quin):
        self.name = name
        self.length_km = length_km
        self.legal_taps = legal_taps_quin
        self.leak_rate = leak_rate_pct / 100
        self.theft = theft_quin

def flow_audit(source_flow, sections):
    """Perform Frontinus-style flow audit."""
    results = []
    remaining = source_flow

    for s in sections:
        flow_in = remaining
        legal_draw = s.legal_taps
        leaks = flow_in * s.leak_rate
        theft = s.theft
        flow_out = flow_in - legal_draw - leaks - theft
        loss_pct = (leaks + theft) / flow_in * 100

        results.append({
            "name": s.name,
            "flow_in": flow_in,
            "legal_draw": legal_draw,
            "leaks": leaks,
            "theft": theft,
            "flow_out": flow_out,
            "loss_pct": loss_pct,
        })
        remaining = flow_out

    return results

# Aqua Claudia distribution network (simplified)
source = 47000  # quinariae at source

sections = [
    AqueductSection("Mountain channel",  30, 500,  2, 0),
    AqueductSection("Suburban conduit",  15, 3000, 3, 2000),
    AqueductSection("Porta Maggiore",     2, 5000, 1, 500),
    AqueductSection("Caelian Hill dist", 5,  8000, 5, 4000),
    AqueductSection("Palatine dist",      3, 6000, 4, 3500),
    AqueductSection("Forum fountains",    2, 10000, 2, 1000),
]

results = flow_audit(source, sections)

print("=== Frontinus Flow Audit: Aqua Claudia ===")
print(f"Source supply: {source:,} quinariae\
")
print(f"{'Section':<22} {'Flow In':>8} {'Legal':>7} {'Leaks':>7} {'Theft':>7} {'Loss%':>6}")
print("-" * 59)

total_legal = 0
total_leaks = 0
total_theft = 0

for r in results:
    print(f"{r['name']:<22} {r['flow_in']:>7.0f} {r['legal_draw']:>6.0f} "
          f"{r['leaks']:>6.0f} {r['theft']:>6.0f} {r['loss_pct']:>5.1f}%")
    total_legal += r["legal_draw"]
    total_leaks += r["leaks"]
    total_theft += r["theft"]

delivered = results[-1]["flow_out"]
print(f"\
{'TOTALS':<22} {'':>8} {total_legal:>6.0f} {total_leaks:>6.0f} {total_theft:>6.0f}")
print(f"\
Delivered to end: {delivered:,.0f} quinariae ({delivered/source*100:.1f}%)")
print(f"Total leaks: {total_leaks:,.0f} quinariae ({total_leaks/source*100:.1f}%)")
print(f"Total theft: {total_theft:,.0f} quinariae ({total_theft/source*100:.1f}%)")
print(f"System efficiency: {(total_legal + delivered)/source*100:.1f}%")

# Priority investigation
print("\
=== Priority Sections for Investigation ===")
sorted_by_loss = sorted(results, key=lambda r: r["theft"], reverse=True)
for r in sorted_by_loss[:3]:
    print(f"  {r['name']}: {r['theft']:.0f} quinariae theft detected — investigate!")`,
      challenge: 'Frontinus\'s measurements were imprecise — he could only estimate flow to within about 10%. Add measurement uncertainty (random error of +/-10%) to both input and output measurements. How does this uncertainty affect your ability to detect theft? At what theft level does it become indistinguishable from measurement error? This is the fundamental challenge of all auditing systems.',
      successHint: 'Flow auditing is how modern water utilities detect leaks and theft — a global problem costing billions annually. London\'s water system loses about 25% to leaks. Some developing-world cities lose over 50%. Frontinus\'s 2,000-year-old methodology is still the starting point for every modern water audit.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Hydraulic engineering and aqueduct analysis</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 2 dives into pipe friction, siphon pressure, arch forces, water quality, and flow auditing.
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
