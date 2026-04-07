import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function NagarjunaLevel1() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Water pressure — why depth matters',
      concept: `Water at the bottom of a dam experiences enormous **pressure** from the weight of all the water above it. Pressure increases linearly with depth according to: **P = rho * g * h**, where rho is water density (1000 kg/m^3), g is gravitational acceleration (9.81 m/s^2), and h is the depth in metres.

At the surface, the water pressure is zero (atmospheric pressure aside). At 10 metres depth, the pressure is 1000 * 9.81 * 10 = 98,100 Pa = about 1 atmosphere. At the bottom of Nagarjuna Sagar Dam (124 metres), the pressure is a crushing 1,217,000 Pa = about 12 atmospheres.

This pressure is what drives the turbines: water at high pressure rushes through pipes and spins the turbine blades. The deeper the water, the higher the pressure, and the more energy can be extracted. This is why dams are built tall — every extra metre of height means more pressure and more power.

📚 *Pascal (Pa) is the unit of pressure: 1 Pa = 1 Newton per square metre. Atmospheric pressure at sea level is about 101,325 Pa. Water pressure at 10 m depth equals one atmosphere.*`,
      analogy: 'Imagine a stack of books on a table. The bottom book feels the weight of all the books above it. The higher the stack, the more the bottom book is compressed. Water works the same way — the water at the bottom of a deep lake feels the weight of all the water above, creating pressure. Every 10 metres of water adds the equivalent of one atmosphere of pressure.',
      storyConnection: 'Nagarjuna Sagar Dam on the Krishna River in Telangana holds back a reservoir 124 metres deep. The dam wall must withstand the enormous pressure at the base — over 12 atmospheres. Engineers designed the dam with a thick, curved base specifically to resist this force. The same pressure drives water through the turbines to generate 816 MW of electricity.',
      checkQuestion: 'A swimmer dives to 5 metres depth. What water pressure do they experience? How does this compare to atmospheric pressure?',
      checkAnswer: 'P = 1000 * 9.81 * 5 = 49,050 Pa. Atmospheric pressure is about 101,325 Pa. So the water pressure at 5 m is about 48% of an atmosphere. The swimmer feels roughly 1.5 atmospheres total (1 from air + 0.5 from water).',
      codeIntro: 'Calculate water pressure at different depths and visualize how it increases with depth.',
      code: `# Water pressure vs depth

rho_water = 1000  # kg/m^3 (density of water)
g = 9.81          # m/s^2 (gravitational acceleration)
atm = 101325      # Pa (atmospheric pressure)

def water_pressure(depth_m):
    """Calculate water pressure at a given depth in Pascals"""
    return rho_water * g * depth_m

print("=== Water Pressure Calculator ===")
print(f"{'Depth (m)':<12} {'Pressure (Pa)':>14} {'Atmospheres':>13} {'Context'}")
print("-" * 65)

depths = [
    (0, "Surface"),
    (1, "Shallow pool"),
    (5, "Deep end of pool"),
    (10, "Scuba diving"),
    (30, "Recreational dive limit"),
    (50, "Nagarjuna mid-depth"),
    (100, "Deep reservoir"),
    (124, "Nagarjuna Sagar base"),
    (200, "Hoover Dam depth"),
    (1000, "Deep ocean"),
]

for depth, context in depths:
    p = water_pressure(depth)
    atmospheres = p / atm
    print(f"{depth:<12} {p:>14,.0f} {atmospheres:>11.1f} {context}")

print()
# Force on the dam wall
print("=== Force on Dam Wall ===")
dam_height = 124  # metres
dam_width = 1     # per metre of width

# Total force = integral of pressure over depth = 0.5 * rho * g * h^2 * width
total_force = 0.5 * rho_water * g * dam_height ** 2 * dam_width
total_force_tonnes = total_force / g / 1000

print(f"Dam height: {dam_height} m")
print(f"Force per metre of width: {total_force:,.0f} N")
print(f"  = {total_force_tonnes:,.0f} tonnes per metre of width")
print(f"  = {total_force/1e6:,.1f} MN (meganewtons)")
print()

# Nagarjuna Sagar is 1450 m wide
dam_total_width = 1450
total_dam_force = total_force * dam_total_width
print(f"Total force on Nagarjuna Sagar ({dam_total_width} m wide):")
print(f"  {total_dam_force:,.0f} N = {total_dam_force/1e9:.1f} GN (giganewtons)")
print(f"  = {total_dam_force/g/1e6:.0f} thousand tonnes")`,
      challenge: 'If the reservoir level drops from 124 m to 80 m during a drought, by what percentage does the base pressure decrease? By what percentage does the total force on the dam decrease? (Hint: force depends on h^2, not h.) This is why low reservoir levels mean less power generation.',
      successHint: 'You just applied the hydrostatic pressure equation P = rho * g * h — one of the most important equations in fluid mechanics. Every dam, submarine, diving bell, and hydraulic system is designed using this calculation.',
    },
    {
      title: "Pascal's law — pressure transmits equally in all directions",
      concept: `**Pascal's law** states that pressure applied to a confined fluid is transmitted equally and undiminished in all directions. This means the pressure at the bottom of a dam pushes equally against the dam wall, the riverbed, and the gates — it does not just push "down."

This principle is the basis of all **hydraulic systems**: a small force applied to a small piston creates pressure that, when transmitted to a large piston, produces a large force. The force multiplication ratio equals the area ratio of the two pistons: F2/F1 = A2/A1.

In a dam, Pascal's law means that the water pushes horizontally against the dam wall with the same pressure it pushes vertically against the bottom. The dam must resist this horizontal force — which is why dams are thick at the base and often curved (arch dams use the curve to redirect the force into the canyon walls).

📚 *Pascal's law: P = F/A. In a hydraulic system, P is the same everywhere: F1/A1 = F2/A2. This means F2 = F1 * (A2/A1) — force is multiplied by the area ratio. Energy is conserved: the large piston moves a shorter distance.*`,
      analogy: 'Squeeze a water balloon. Your fingers press on one spot, but the balloon bulges equally in all directions. The pressure from your fingers transmits through the water and pushes equally on every part of the balloon surface. That is Pascal law in action.',
      storyConnection: 'The engineers who designed Nagarjuna Sagar Dam had to account for Pascal law: the water pushes horizontally against the dam with tremendous force. The dam is a gravity dam — its own massive weight (concrete and masonry) resists the horizontal water pressure. The cross-section is triangular: thin at the top (low pressure), thick at the base (high pressure).',
      checkQuestion: 'A hydraulic lift has a small piston of area 10 cm^2 and a large piston of area 500 cm^2. If you push the small piston with 100 N, what force does the large piston exert?',
      checkAnswer: 'Force ratio = area ratio = 500/10 = 50. Large piston force = 100 * 50 = 5000 N. You multiplied the force by 50. But the large piston only moves 1/50th the distance of the small piston — energy is conserved.',
      codeIntro: 'Model hydraulic force multiplication and dam wall pressure distribution.',
      code: `# Pascal's Law — hydraulic force multiplication

def hydraulic_system(f_input, a_input, a_output):
    """Calculate output force and displacement ratio for a hydraulic system."""
    pressure = f_input / a_input  # Pa
    f_output = pressure * a_output
    displacement_ratio = a_input / a_output  # output moves less
    return {
        "pressure": pressure,
        "f_output": f_output,
        "force_multiplier": a_output / a_input,
        "displacement_ratio": displacement_ratio,
    }

print("=== Hydraulic Force Multiplication ===")
print()

# Example hydraulic systems
systems = [
    ("Car brake", 5, 0.5e-4, 20e-4),        # small pedal to large caliper
    ("Hydraulic jack", 200, 5e-4, 100e-4),    # lifting a car
    ("Dam sluice gate", 1000, 0.01, 2.0),     # controlling water flow
    ("Excavator arm", 5000, 0.005, 0.2),      # digging force
]

for name, f_in, a_in, a_out in systems:
    result = hydraulic_system(f_in, a_in, a_out)
    print(f"--- {name} ---")
    print(f"  Input: {f_in:.0f} N on {a_in*1e4:.1f} cm^2")
    print(f"  Output: {result['f_output']:.0f} N on {a_out*1e4:.1f} cm^2")
    print(f"  Force multiplied: {result['force_multiplier']:.0f}x")
    print(f"  Pressure: {result['pressure']:,.0f} Pa")
    print()

# Dam wall pressure distribution
print("=== Nagarjuna Sagar Dam Pressure Profile ===")
dam_height = 124
rho = 1000
g = 9.81

print(f"{'Depth (m)':<12} {'Pressure (kPa)':>15} {'Force/m^2 (kN)':>15} {'Bar graph'}")
print("-" * 60)

for depth in range(0, dam_height + 1, 10):
    pressure = rho * g * depth
    p_kpa = pressure / 1000
    bar_len = int(p_kpa / 30)
    bar = "█" * bar_len
    print(f"{depth:<12} {p_kpa:>13.1f} {p_kpa:>13.1f} {bar}")

# Calculate where the resultant force acts
# For triangular pressure distribution, resultant acts at 2/3 depth
resultant_depth = 2.0 / 3.0 * dam_height
print(f"\\nResultant force acts at {resultant_depth:.0f} m depth")
print(f"  (2/3 of dam height — because pressure distribution is triangular)")`,
      challenge: 'Design a hydraulic system that can lift a 2000 kg car (force needed = 2000 * 9.81 = 19,620 N) using a hand pump where you push with 100 N. What must the piston area ratio be? If the small piston has area 2 cm^2, what is the large piston area?',
      successHint: 'Pascal law is the foundation of all hydraulic machinery: car brakes, construction equipment, aircraft control surfaces, and dam sluice gates. Every time you press your car brake pedal, you are using Pascal law to multiply your foot force into enough stopping power to halt a 2-tonne vehicle.',
    },
    {
      title: 'Pressure at depth — the hydrostatic equation in practice',
      concept: `The **hydrostatic equation** P = P0 + rho * g * h gives the absolute pressure at any depth, where P0 is the surface pressure (usually atmospheric). This equation assumes the fluid is incompressible and at rest — both good approximations for water in a reservoir.

For dam engineering, the key quantities are: (1) **gauge pressure** = rho * g * h (pressure above atmospheric), (2) **absolute pressure** = atmospheric + gauge, and (3) **total hydrostatic force** on a surface = integral of pressure over area.

For a vertical rectangular surface (like a dam wall), the total horizontal force per unit width is F = 0.5 * rho * g * h^2. This force acts at a depth of 2h/3 from the surface (the center of pressure). These two numbers — total force and its point of application — are what structural engineers need to design the dam.

📚 *Gauge pressure is measured relative to atmospheric pressure (the gauge on a tire reads 0 when the tire is at atmospheric pressure). Absolute pressure includes atmospheric pressure. Gauge = Absolute - Atmospheric.*`,
      analogy: 'Think of filling a tall glass with water. The pressure on the bottom of the glass increases as you fill it — more water above means more weight pressing down. If you poke a hole at the bottom, water shoots out forcefully. Poke a hole halfway up, and it shoots out with half the force. The height of water above the hole determines the pressure.',
      storyConnection: 'The spillway gates at Nagarjuna Sagar Dam must withstand the full hydrostatic pressure when the reservoir is full. During monsoon floods, the gates are opened to release excess water. The force on each gate is thousands of tonnes — the hydraulic actuators that open and close them must be immensely powerful, and they are designed using the exact calculations you will perform.',
      checkQuestion: 'A dam has a rectangular sluice gate 3 m wide and 4 m tall, with the top of the gate at 20 m depth. What is the pressure at the top and bottom of the gate?',
      checkAnswer: 'Top: P = 1000 * 9.81 * 20 = 196,200 Pa. Bottom: P = 1000 * 9.81 * 24 = 235,440 Pa. The pressure is not uniform across the gate — it is 20% higher at the bottom than the top. This non-uniformity is why the center of pressure is below the geometric center.',
      codeIntro: 'Calculate forces and pressures on dam structures at various depths.',
      code: `import numpy as np

# Hydrostatic calculations for dam engineering

rho = 1000  # kg/m^3
g = 9.81    # m/s^2

def gate_force(width, height, top_depth):
    """
    Calculate total force and center of pressure on a rectangular gate.
    Gate is width x height, with its top edge at top_depth below surface.
    """
    bottom_depth = top_depth + height

    # Total force = integral of pressure over gate area
    # F = rho * g * width * integral from top_depth to bottom_depth of h dh
    # F = rho * g * width * (bottom^2 - top^2) / 2
    F = rho * g * width * (bottom_depth**2 - top_depth**2) / 2

    # Center of pressure (measured from surface)
    # h_cp = (bottom^3 - top^3) / (3 * (bottom^2 - top^2) / 2)
    numerator = (bottom_depth**3 - top_depth**3) / 3
    denominator = (bottom_depth**2 - top_depth**2) / 2
    h_cp = numerator / denominator

    # Average pressure
    p_avg = F / (width * height)

    return {
        "force_N": F,
        "force_tonnes": F / g / 1000,
        "center_of_pressure_m": h_cp,
        "p_top": rho * g * top_depth,
        "p_bottom": rho * g * bottom_depth,
        "p_average": p_avg,
    }

# Nagarjuna Sagar spillway gates
print("=== Spillway Gate Force Calculations ===")
print()

gates = [
    ("Surface gate", 12, 6, 0),
    ("Mid-level outlet", 4, 3, 50),
    ("Deep outlet", 3, 2, 100),
    ("Base outlet", 2.5, 2, 120),
]

for name, width, height, top_depth in gates:
    result = gate_force(width, height, top_depth)
    print(f"--- {name} ---")
    print(f"  Size: {width} m x {height} m at depth {top_depth} m")
    print(f"  Pressure at top: {result['p_top']/1000:,.1f} kPa")
    print(f"  Pressure at bottom: {result['p_bottom']/1000:,.1f} kPa")
    print(f"  Total force: {result['force_N']/1e6:,.2f} MN ({result['force_tonnes']:,.0f} tonnes)")
    print(f"  Center of pressure: {result['center_of_pressure_m']:.1f} m from surface")
    print()

# Pressure profile through the dam
print("=== Pressure Profile Through Nagarjuna Sagar ===")
dam_height = 124
depths = np.linspace(0, dam_height, 25)

print(f"{'Depth':>8} {'Gauge P':>12} {'Abs P':>12} {'Force/m':>12}")
print("-" * 46)

atm = 101325
for d in depths:
    gauge = rho * g * d
    absolute = atm + gauge
    # Force per metre width from surface to this depth
    force_per_m = 0.5 * rho * g * d**2
    print(f"{d:>6.0f} m {gauge/1000:>10.1f} kPa {absolute/1000:>10.1f} kPa {force_per_m/1e6:>10.2f} MN")`,
      challenge: 'A circular pipe at the base of the dam has diameter 3 m at 120 m depth. What is the total force on the pipe end cap (a circle)? (Hint: for a circle at uniform depth, F = P * A = rho * g * h * pi * r^2.) Compare this to the force on a square gate of the same area.',
      successHint: 'These hydrostatic calculations are performed for every dam, lock, submarine hull, and underwater structure in the world. The equations you used — force integration over submerged surfaces — are the core of hydraulic engineering.',
    },
    {
      title: 'Reservoir volume — how much water does the dam hold?',
      concept: `A dam reservoir is not a simple rectangular box — it fills a river valley with complex topography. The **volume** of water depends on the shape of the valley and the water level. Engineers create a **stage-storage curve**: a graph of water volume versus water level (stage).

For a simplified V-shaped valley, the reservoir width increases linearly with depth. If the valley width at the top is W and the length is L, the volume is approximately V = 0.5 * W * h * L (a triangular cross-section). Real reservoirs use detailed topographic surveys.

Nagarjuna Sagar holds about **11.5 billion cubic metres** (11.5 km^3) of water. This is enough to irrigate 1 million hectares of farmland — transforming the arid Deccan Plateau into productive agricultural land. The volume calculation determines how much water is available for irrigation, drinking water, and power generation.

📚 *Stage-storage relationship: as the water level rises, the reservoir area and volume increase. The relationship is nonlinear — a small rise in level at high water adds more volume than the same rise at low water, because the reservoir is wider at the top.*`,
      analogy: 'Think of filling a bowl. A small amount of water fills only the narrow bottom — a large surface area is exposed only when the bowl is nearly full. The same is true of a reservoir: the first few metres of depth add little volume (the valley is narrow at the bottom), but the last few metres add a lot (the valley is wide at the top).',
      storyConnection: 'Nagarjuna Sagar Dam was completed in 1967 and created one of the largest artificial lakes in the world. The reservoir extends 150 km upstream along the Krishna River valley. Managing the water level requires constant calculation: how much water is flowing in (monsoon rainfall), how much is flowing out (irrigation, power generation, evaporation), and how much is stored.',
      checkQuestion: 'A V-shaped valley is 500 m wide at the top, 150 m deep, and 10 km long. Approximately what volume of water can the reservoir hold?',
      checkAnswer: 'V = 0.5 * 500 * 150 * 10000 = 375,000,000 m^3 = 375 million cubic metres. This is about 3% of Nagarjuna Sagar actual capacity — which is a much larger valley.',
      codeIntro: 'Model reservoir volume as a function of water level for different valley shapes.',
      code: `import numpy as np

# Reservoir volume calculations

def reservoir_volume_v_valley(width_top, depth, length):
    """Volume of a V-shaped valley reservoir (triangular cross-section)."""
    return 0.5 * width_top * depth * length

def reservoir_volume_u_valley(width_top, width_bottom, depth, length):
    """Volume of a U-shaped valley (trapezoidal cross-section)."""
    avg_width = (width_top + width_bottom) / 2
    return avg_width * depth * length

def stage_storage_curve(valley_func, max_depth, length, steps=50):
    """Generate stage-storage data: volume vs water level."""
    levels = np.linspace(0, max_depth, steps)
    volumes = []
    for h in levels:
        vol = valley_func(h, length)
        volumes.append(vol)
    return levels, np.array(volumes)

# Define valley shapes
def v_valley(h, L, top_width=800):
    """V-shaped: width increases linearly from 0 at bottom to top_width at max depth."""
    max_h = 124
    w = top_width * h / max_h
    return 0.5 * w * h * L

def u_valley(h, L, top_width=800, bottom_width=100):
    """U-shaped: width increases from bottom_width to top_width."""
    max_h = 124
    w_at_h = bottom_width + (top_width - bottom_width) * h / max_h
    avg_w = (bottom_width + w_at_h) / 2
    return avg_w * h * L

# Nagarjuna Sagar parameters (simplified)
max_depth = 124  # m
length = 150000  # 150 km in metres

print("=== Nagarjuna Sagar Reservoir Volume ===")
print(f"Dam height: {max_depth} m | Valley length: {length/1000:.0f} km")
print()

print(f"{'Level (m)':<12} {'V-Valley (Mm3)':>15} {'U-Valley (Mm3)':>15} {'% Full':>8}")
print("-" * 52)

for h in range(0, max_depth + 1, 10):
    vol_v = v_valley(h, length) / 1e6  # convert to million m^3
    vol_u = u_valley(h, length) / 1e6
    pct = h / max_depth * 100
    print(f"{h:<12} {vol_v:>13,.0f} {vol_u:>13,.0f} {pct:>6.0f}%")

# Full reservoir volumes
full_v = v_valley(max_depth, length) / 1e9
full_u = u_valley(max_depth, length) / 1e9
print(f"\\nFull reservoir: V-valley = {full_v:.1f} km^3, U-valley = {full_u:.1f} km^3")
print(f"Actual Nagarjuna Sagar capacity: ~11.5 km^3")

print()
# Water budget
print("=== Annual Water Budget ===")
inflow_km3 = 20.0   # average annual Krishna River flow
evaporation_rate = 0.002  # m/day
surface_area_km2 = 285    # reservoir surface area

daily_evap = evaporation_rate * surface_area_km2 * 1e6  # m^3/day
annual_evap = daily_evap * 365 / 1e9  # km^3

irrigation_km3 = 8.0
power_km3 = 5.0  # water through turbines (returned downstream)

print(f"Inflow (Krishna River): {inflow_km3:.1f} km^3/year")
print(f"Evaporation: {annual_evap:.1f} km^3/year")
print(f"Irrigation withdrawal: {irrigation_km3:.1f} km^3/year")
print(f"Power generation: {power_km3:.1f} km^3/year (returned downstream)")
print(f"Net storage change: {inflow_km3 - annual_evap - irrigation_km3:+.1f} km^3/year")`,
      challenge: 'During a severe drought, inflow drops to 10 km^3/year but irrigation demand stays at 8 km^3. How many years before the reservoir drops to 50% capacity? (Hint: net loss per year = evaporation + irrigation - inflow. Start from full capacity of 11.5 km^3.)',
      successHint: 'Reservoir management is one of the most important civil engineering challenges. Water managers use stage-storage curves daily to balance competing demands: irrigation, drinking water, power generation, flood control, and environmental flows. You just built the fundamental calculation tool they use.',
    },
    {
      title: 'Dam types — gravity, arch, and buttress designs compared',
      concept: `Not all dams are the same. The three main types are **gravity dams** (massive concrete structures that resist water pressure with their own weight), **arch dams** (thin curved walls that redirect pressure into the canyon walls), and **buttress dams** (flat walls supported by triangular braces).

Each type has different structural properties: gravity dams use the most material but work in any valley shape. Arch dams use the least material but require a narrow valley with strong rock walls. Buttress dams are a compromise — less material than gravity but more versatile than arch.

The key engineering parameter is the **factor of safety** — the ratio of resisting force to driving force. A factor of safety of 2.0 means the dam can resist twice the expected maximum water pressure. Regulations typically require factors of 1.5 to 3.0 depending on the dam type and consequences of failure.

📚 *Factor of safety = resisting forces / driving forces. A value > 1 means the dam is stable. Values of 1.5 to 3.0 are used in practice to account for uncertainties in materials, construction quality, and extreme events (earthquakes, record floods).*`,
      analogy: 'A gravity dam is like a heavy bookend — it stays in place because it is heavy enough that the books cannot push it over. An arch dam is like a person bracing in a doorframe — they push sideways against the frame, and the frame pushes back. A buttress dam is like a leaning shelf with diagonal braces — the braces transfer the horizontal force to the ground.',
      storyConnection: 'Nagarjuna Sagar is a gravity dam — one of the largest masonry dams in the world. Its sheer mass (concrete and stone) resists the water pressure. The dam is 124 m high, 1,450 m long, and contains about 4.8 million cubic metres of masonry. The triangular cross-section (thin at top, thick at base) matches the triangular pressure distribution of the water.',
      checkQuestion: 'A gravity dam has a base width of 80 m and height of 100 m. The concrete density is 2400 kg/m^3. What is the weight per metre of dam length?',
      checkAnswer: 'Cross-section area (triangle) = 0.5 * 80 * 100 = 4000 m^2. Weight per metre = 4000 * 2400 * 9.81 = 94,176,000 N = 94.2 MN per metre. This weight must exceed the horizontal water force for stability.',
      codeIntro: 'Compare different dam types and calculate their factors of safety.',
      code: `import numpy as np

# Dam type comparison and stability analysis

rho_water = 1000   # kg/m^3
rho_concrete = 2400  # kg/m^3
g = 9.81

def gravity_dam_stability(height, base_width, dam_length=1):
    """Analyze stability of a gravity dam (triangular cross-section)."""
    # Water force (horizontal, triangular pressure distribution)
    F_water = 0.5 * rho_water * g * height**2 * dam_length
    h_water = height / 3  # acts at 1/3 from base

    # Dam weight (triangular cross-section)
    area = 0.5 * base_width * height
    W_dam = area * rho_concrete * g * dam_length
    x_weight = base_width / 3  # centroid of triangle from heel

    # Overturning: moments about the toe (downstream edge)
    M_driving = F_water * h_water  # water tries to overturn
    M_resisting = W_dam * (base_width - x_weight)  # weight resists

    # Sliding: friction at base
    friction_coeff = 0.7  # concrete on rock
    F_friction = friction_coeff * W_dam
    FoS_sliding = F_friction / F_water
    FoS_overturning = M_resisting / M_driving

    return {
        "F_water_MN": F_water / 1e6,
        "W_dam_MN": W_dam / 1e6,
        "FoS_sliding": FoS_sliding,
        "FoS_overturning": FoS_overturning,
        "volume_m3": area * dam_length,
    }

# Compare dam designs
print("=== Dam Design Comparison ===")
print("All dams: 100 m height, per metre of length")
print()

height = 100

designs = [
    ("Narrow gravity", 60),
    ("Standard gravity", 75),
    ("Wide gravity", 90),
    ("Nagarjuna-like", 80),
]

print(f"{'Design':<20} {'Base (m)':>9} {'Water F':>10} {'Weight':>10} "
      f"{'FoS Slide':>10} {'FoS Overt':>10}")
print("-" * 71)

for name, base in designs:
    result = gravity_dam_stability(height, base)
    print(f"{name:<20} {base:>9} {result['F_water_MN']:>8.1f} MN "
          f"{result['W_dam_MN']:>8.1f} MN {result['FoS_sliding']:>10.2f} "
          f"{result['FoS_overturning']:>10.2f}")

print()
# How base width affects safety factor
print("=== Base Width vs Factor of Safety ===")
print(f"{'Base Width (m)':<16} {'FoS Sliding':>12} {'FoS Overturning':>16} {'Status'}")
print("-" * 50)

for base in range(40, 110, 5):
    result = gravity_dam_stability(100, base)
    status = "SAFE" if min(result["FoS_sliding"], result["FoS_overturning"]) >= 1.5 else "MARGINAL" if min(result["FoS_sliding"], result["FoS_overturning"]) >= 1.0 else "UNSAFE"
    print(f"{base:<16} {result['FoS_sliding']:>12.2f} {result['FoS_overturning']:>16.2f} {status}")

# Find minimum base width for FoS >= 1.5
print()
for base in range(40, 150):
    result = gravity_dam_stability(100, base)
    if min(result["FoS_sliding"], result["FoS_overturning"]) >= 1.5:
        volume = result["volume_m3"]
        print(f"Minimum base for FoS >= 1.5: {base} m")
        print(f"  Concrete volume: {volume:,.0f} m^3 per metre of length")
        print(f"  For 1000 m dam: {volume * 1000 / 1e6:.1f} million m^3")
        break`,
      challenge: 'An earthquake applies an additional horizontal force equal to 10% of the dam weight. Recalculate the factor of safety for a 100 m dam with 80 m base. How much wider must the base be to maintain FoS >= 1.5 during an earthquake?',
      successHint: 'Factor of safety analysis is the core of structural engineering. Every bridge, building, dam, and aircraft is designed with a safety factor. You just performed the same stability analysis that engineers use when designing dams that protect millions of people.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Water pressure and dam engineering</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises use Python to calculate water pressure, hydraulic forces, and dam stability.
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
