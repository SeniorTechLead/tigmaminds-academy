import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function AqueductsLevel1() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Gradient and gravity — how water flows without pumps',
      concept: `Water flows downhill. This seems obvious, but the Romans built an entire civilisation on this principle. The key is the **gradient** — how steep the downhill slope is.

The gradient of a Roman aqueduct was approximately **1 metre of drop per 1,000 metres of length** — a 0.1% slope. So gentle you couldn't see it with the naked eye. But enough to keep water flowing at a walking pace for 90 kilometres.

The flow velocity depends on the gradient through **Manning's equation**:

**v = (1/n) × R^(2/3) × S^(1/2)**

Where v is velocity, n is the roughness coefficient (smooth stone ≈ 0.013), R is the hydraulic radius (cross-section area / wetted perimeter), and S is the slope (gradient).

The engineering challenge: maintain this precise gradient over 90 km of varied terrain — across valleys, around hills, through mountains — using only plumb lines and a 6-metre wooden levelling tool called a **chorobates**.

📚 *Manning's equation (1889) quantifies what the Romans knew empirically: smoother channels, steeper slopes, and larger cross-sections all increase flow velocity. It's still the standard equation for open-channel flow design.*`,
      analogy: 'Imagine a toy train on a very slightly tilted track — so slightly tilted that you can\'t tell by looking. But the train rolls slowly, steadily, for kilometres. The aqueduct is the track; water is the train; gravity provides the push. No motor, no fuel — just a precise slope.',
      storyConnection: 'The Aqua Marcia — Rome\'s longest aqueduct at 91 km — had a total drop of about 90 metres from its mountain source to the city. The water took roughly 24 hours to travel the full length, flowing at about 1 metre per second. Patient, steady, unstoppable — powered by gravity alone.',
      checkQuestion: 'If an aqueduct has a gradient of 1/1000 (1 m drop per 1000 m) and is 60 km long, what is the total height difference between source and city?',
      checkAnswer: '60,000 m × 1/1000 = 60 m. The source is 60 metres above the city. This 60 m of height provides all the energy to move the water — no pumps needed.',
      codeIntro: 'Calculate flow velocities, gradients, and delivery rates for Roman aqueducts using Manning\'s equation.',
      code: `import numpy as np

def manning_velocity(slope, hydraulic_radius, roughness=0.013):
    """
    Manning's equation for open-channel flow velocity.
    v = (1/n) × R^(2/3) × S^(1/2)
    """
    return (1/roughness) * hydraulic_radius**(2/3) * slope**0.5

def channel_flow(width_m, depth_m, slope, roughness=0.013):
    """
    Calculate flow for a rectangular channel.
    """
    area = width_m * depth_m
    wetted_perimeter = width_m + 2 * depth_m
    hydraulic_radius = area / wetted_perimeter
    velocity = manning_velocity(slope, hydraulic_radius, roughness)
    flow_rate = velocity * area  # m³/s
    flow_rate_L_day = flow_rate * 86400 * 1000  # litres per day
    return velocity, flow_rate, flow_rate_L_day

# Rome's major aqueducts
aqueducts = [
    {"name": "Aqua Appia (312 BCE)", "length_km": 16.4, "drop_m": 10,
     "width": 0.6, "depth": 0.5},
    {"name": "Aqua Marcia (144 BCE)", "length_km": 91.3, "drop_m": 90,
     "width": 0.9, "depth": 0.7},
    {"name": "Aqua Claudia (52 CE)", "length_km": 68.7, "drop_m": 67,
     "width": 1.0, "depth": 0.8},
    {"name": "Aqua Traiana (109 CE)", "length_km": 58.0, "drop_m": 55,
     "width": 0.8, "depth": 0.6},
]

print("=== Roman Aqueduct Flow Calculator ===")
print(f"{'Aqueduct':<28} {'Length':>7} {'Gradient':>10} {'Velocity':>10} {'Flow (M L/day)':>16}")
print("-" * 73)

total_flow = 0
for aq in aqueducts:
    slope = aq["drop_m"] / (aq["length_km"] * 1000)
    vel, flow, flow_ld = channel_flow(aq["width"], aq["depth"], slope)
    total_flow += flow_ld
    print(f"{aq['name']:<28} {aq['length_km']:>5.1f}km {slope:>8.5f} "
          f"{vel:>8.2f} m/s {flow_ld/1e6:>14.1f}")

print(f"\
Total delivery: {total_flow/1e6:.0f} million litres/day")
print(f"Per capita (1M population): {total_flow/1e6:.0f} litres/person/day")
print(f"Modern comparison: NYC delivers ~5,300 M litres/day for 8M people")
print(f"              = ~660 litres/person/day")

# How gradient affects flow
print(f"\
=== Effect of Gradient on Flow Velocity ===")
print(f"Channel: 0.8m × 0.6m, stone-lined (n=0.013)")
print(f"{'Gradient':>12} {'Velocity (m/s)':>15} {'Flow (L/s)':>12} {'Description':>16}")
print("-" * 57)

for grad in [0.00005, 0.0001, 0.0005, 0.001, 0.005, 0.01, 0.05]:
    vel, flow, _ = channel_flow(0.8, 0.6, grad)
    desc = "Too slow" if vel < 0.3 else "Optimal" if vel < 1.5 else "Too fast" if vel < 3 else "Erosion risk"
    print(f"{grad:>10.5f} {vel:>13.2f} {flow*1000:>10.0f} {desc:>16}")

# Transit time
print(f"\
=== Water Transit Times ===")
for aq in aqueducts:
    slope = aq["drop_m"] / (aq["length_km"] * 1000)
    vel, _, _ = channel_flow(aq["width"], aq["depth"], slope)
    transit_hours = aq["length_km"] * 1000 / vel / 3600
    print(f"  {aq['name']:<28} {transit_hours:.1f} hours")`,
      challenge: 'Modern pipes use pressurized flow (Manning\'s equation doesn\'t apply). If a modern pipe delivers water at 2 m/s through a 0.5 m diameter pipe, what is the flow rate in litres/day? Compare with the Aqua Marcia. Which delivers more? (The pipe delivers ~34 million L/day vs the aqueduct\'s ~30 million — but the aqueduct uses zero energy.)',
      successHint: 'You applied Manning\'s equation — the standard for open-channel flow design used by every civil engineer who works on canals, drainage systems, and irrigation. The same equation governs river flow, storm drains, and wastewater treatment plants. The Romans solved it empirically; you solved it with code.',
    },
    {
      title: 'Hydrostatic pressure — water at depth',
      concept: `Water pressure increases with depth according to a simple formula:

**P = ρ × g × h**

Where ρ is water density (1000 kg/m³), g is gravity (9.81 m/s²), and h is depth. Every 10 metres of depth adds approximately **1 atmosphere** (101,325 Pa) of pressure.

This means Gatun Lake at 26 m depth exerts about **2.5 atmospheres** of pressure at the bottom — enough to push water through the aqueduct culverts at considerable velocity.

The Romans used this principle in **inverted siphons**: sealed pipes that carried water down one side of a valley and up the other. The pressure from the descending column of water pushes the water up the far side — no pumps needed. The water loses a small amount of height due to friction, but it crosses the valley without a bridge.

📚 *Hydrostatic pressure is "hydro" (water) + "static" (not moving). Even still water exerts pressure proportional to depth. This is why submarines need thick hulls and why your ears hurt when you dive deep.*`,
      analogy: 'Stack textbooks on your hand. More books = more pressure. Water works the same way: deeper water means more water "stacked" above you, pressing down harder. 10 metres of water is like stacking about 10 tonnes of textbooks on every square metre.',
      storyConnection: 'Roman siphon pipes were made of lead — the word "plumbing" comes from the Latin "plumbum" (lead). At the bottom of a deep valley, the pressure inside the pipe could reach several atmospheres. The lead pipes had to be thick enough to withstand this pressure without bursting — an early example of pressure vessel engineering.',
      checkQuestion: 'A Roman siphon crosses a valley 40 metres deep. What pressure must the pipe withstand at the bottom?',
      checkAnswer: 'P = 1000 × 9.81 × 40 = 392,400 Pa ≈ 3.9 atmospheres. Plus atmospheric pressure on top = about 5 atmospheres total. The pipe walls need to be thick enough to handle this — which is why siphons were expensive and only used where bridges were impractical.',
      codeIntro: 'Calculate hydrostatic pressures in the Roman water system — from lake to siphon to fountain.',
      code: `import numpy as np

def hydrostatic_pressure(depth_m, density=1000):
    """P = ρgh — pressure at depth."""
    return density * 9.81 * depth_m

def pipe_velocity(height_diff_m, length_m, diameter_m, friction_factor=0.02):
    """
    Flow velocity in a siphon pipe using Darcy-Weisbach equation.
    Accounts for friction losses.
    """
    g = 9.81
    # Darcy-Weisbach: v = sqrt(2g × h_net / (1 + f×L/D))
    net_head = height_diff_m  # available head after losses
    denominator = 1 + friction_factor * length_m / diameter_m
    return np.sqrt(2 * g * net_head / denominator)

# Pressure at different points in the aqueduct system
print("=== Hydrostatic Pressure in Roman Water System ===")
print(f"{'Location':<35} {'Depth (m)':>10} {'Pressure (kPa)':>16} {'Atmospheres':>12}")
print("-" * 75)

locations = [
    ("Mountain spring (source)", 0),
    ("Channel surface (flowing)", 0.5),
    ("Siphon top (entering valley)", 5),
    ("Siphon bottom (valley floor)", 40),
    ("Siphon top (exiting valley)", 5),
    ("Castellum (distribution tank)", 2),
    ("Public fountain spout", 1),
    ("Private connection pipe", 3),
]

for name, depth in locations:
    p = hydrostatic_pressure(depth)
    atm = p / 101325
    print(f"{name:<35} {depth:>8.1f} {p/1000:>14.1f} {atm:>10.2f}")

# Siphon analysis
print(f"\
=== Inverted Siphon Analysis ===")
siphons = [
    ("Shallow valley", 15, 200, 0.3),
    ("Medium valley", 30, 400, 0.3),
    ("Deep valley (Aspendos-type)", 50, 600, 0.25),
    ("Extreme (Lugdunum/Lyon)", 90, 1200, 0.2),
]

print(f"{'Siphon':<30} {'Depth':>6} {'Length':>7} {'Pressure':>10} {'Velocity':>10} {'Flow L/s':>9}")
print("-" * 74)

for name, depth, length, diameter in siphons:
    p = hydrostatic_pressure(depth)
    vel = pipe_velocity(2, length, diameter)  # 2m net head loss
    flow = vel * np.pi * (diameter/2)**2 * 1000  # litres/s
    print(f"{name:<30} {depth:>4}m {length:>5}m {p/1000:>8.0f}kPa {vel:>8.2f}m/s {flow:>7.0f}")

# Lead pipe stress
print(f"\
=== Lead Pipe Wall Thickness ===")
print(f"Lead tensile strength: ~12 MPa")
lead_strength = 12e6  # Pa

for depth in [15, 30, 50, 90]:
    pressure = hydrostatic_pressure(depth) + 101325  # gauge + atmospheric
    # Thin-wall pressure vessel: t = P × r / σ
    for diameter in [0.2, 0.3]:
        radius = diameter / 2
        wall_thickness = pressure * radius / lead_strength
        pipe_weight = 2 * np.pi * radius * wall_thickness * 11340 * 1  # kg per metre
        print(f"  Depth {depth}m, ∅{diameter*100:.0f}cm: wall = {wall_thickness*1000:.1f}mm, "
              f"weight = {pipe_weight:.0f} kg/m")

# Fountain pressure
print(f"\
=== Public Fountain Performance ===")
print(f"Water tank 8m above fountain level:")
tank_height = 8
fountain_pipe_length = 50  # metres
fountain_nozzle = 0.02  # 2 cm diameter

vel = pipe_velocity(tank_height, fountain_pipe_length, fountain_nozzle)
flow_ls = vel * np.pi * (fountain_nozzle/2)**2 * 1000
spout_height = vel**2 / (2 * 9.81)  # how high water shoots

print(f"  Flow velocity: {vel:.1f} m/s")
print(f"  Flow rate: {flow_ls:.2f} litres/second")
print(f"  Spout height: {spout_height:.1f} m")
print(f"  Daily output: {flow_ls * 86400:.0f} litres")`,
      challenge: 'The Pont du Gard bridge carried an aqueduct 50 m above the Gardon River. If the aqueduct had used an inverted siphon instead of a bridge, what would the pipe pressure be at the river level? Why did the Romans build the expensive bridge instead of a cheaper siphon? (Pressure = 50m × ρg ≈ 5 atm. Lead pipes at this pressure would need to be very thick and heavy. The bridge, though expensive, lasted longer and required less maintenance.)',
      successHint: 'You applied hydrostatic pressure and pipe flow equations — the same physics used to design every water supply system, hydraulic press, and submarine in the world. The key formula P = ρgh is one of the simplest and most powerful in fluid mechanics.',
    },
    {
      title: 'Distribution networks — splitting flow between 1,300 fountains',
      concept: `When the aqueduct water reached Rome, it entered a **castellum divisorium** — a distribution tank that split the flow into three channels: public fountains, public baths, and private subscribers.

Rome had over **1,300 public fountains**, placed so that no citizen had to walk more than **80 metres** to reach fresh water. This is a **network design problem**: given a finite water supply, how do you distribute it so that every fountain has adequate pressure and flow?

The challenge: water pressure drops along each pipe due to **friction losses**. Pipes that are too long or too narrow deliver water at low pressure. The solution: a **branching network** — main pipes split into smaller branches, which split into even smaller ones — like a tree or a river delta.

**Kirchhoff's law** (applied to fluid networks): at every junction, the total flow IN equals the total flow OUT. Conservation of mass — water doesn't appear or disappear.

📚 *The same mathematics used for water networks is used for electrical circuits (Kirchhoff's laws), computer networks (packet routing), and blood circulation (the body's "plumbing" network).*`,
      analogy: 'A river delta: the main river splits into channels, each channel splits into smaller ones, until hundreds of tiny streams reach the sea. Each junction follows conservation: water in = water out. A Roman water network works the same way — one aqueduct splits into hundreds of fountain feeds.',
      storyConnection: 'Frontinus, Rome\'s water commissioner (97 CE), discovered that 40% of the water supply was being stolen — illegal taps installed by corrupt workers. He standardized pipe sizes, audited the system, and prosecuted the thieves. He was history\'s first infrastructure auditor.',
      checkQuestion: 'An aqueduct delivers 1,000 litres per second. If this is split equally among 1,300 fountains, how much does each fountain receive?',
      checkAnswer: '1,000 / 1,300 = 0.77 litres per second per fountain. That\'s about 66,500 litres per day per fountain — enough for hundreds of people to fill water jugs. The fountains ran continuously, so this flow was available 24/7.',
      codeIntro: 'Model a Roman water distribution network — split flow, calculate pressure drops, and detect theft.',
      code: `import numpy as np

class WaterNetwork:
    """Simple model of a Roman water distribution network."""

    def __init__(self, supply_flow_ls):
        self.supply = supply_flow_ls  # litres per second
        self.nodes = {}
        self.pipes = []

    def add_node(self, name, demand_ls=0):
        self.nodes[name] = {"demand": demand_ls, "pressure": 0}

    def add_pipe(self, from_node, to_node, length_m, diameter_m):
        self.pipes.append({
            "from": from_node, "to": to_node,
            "length": length_m, "diameter": diameter_m,
        })

    def calculate_friction_loss(self, flow_ls, length_m, diameter_m):
        """Darcy-Weisbach friction loss in kPa."""
        flow_m3s = flow_ls / 1000
        area = np.pi * (diameter_m/2)**2
        velocity = flow_m3s / area
        f = 0.02  # friction factor (approximate)
        loss_pa = f * length_m / diameter_m * 0.5 * 1000 * velocity**2
        return loss_pa / 1000  # kPa

    def analyze(self, head_pressure_kpa):
        """Simple sequential pressure analysis."""
        print(f"Supply: {self.supply:.0f} L/s at {head_pressure_kpa:.0f} kPa")
        print()

        remaining_flow = self.supply
        current_pressure = head_pressure_kpa

        for pipe in self.pipes:
            loss = self.calculate_friction_loss(remaining_flow, pipe["length"], pipe["diameter"])
            current_pressure -= loss
            demand = self.nodes[pipe["to"]]["demand"]
            remaining_flow -= demand

            print(f"  {pipe['from']:<15} → {pipe['to']:<15} "
                  f"Loss: {loss:>5.1f}kPa  Pressure: {current_pressure:>6.1f}kPa  "
                  f"Flow: {remaining_flow:>6.0f}L/s")

# Build a simplified Roman network
network = WaterNetwork(supply_flow_ls=800)

# Main trunk line
network.add_node("Castellum", demand=0)
network.add_node("Forum district", demand=200)
network.add_node("Bath district", demand=250)
network.add_node("Residential N", demand=150)
network.add_node("Residential S", demand=120)
network.add_node("Palatine Hill", demand=80)

# Pipes (progressively smaller diameter)
network.add_pipe("Castellum", "Forum district", 500, 0.5)
network.add_pipe("Forum district", "Bath district", 800, 0.4)
network.add_pipe("Bath district", "Residential N", 600, 0.3)
network.add_pipe("Residential N", "Residential S", 400, 0.25)
network.add_pipe("Residential S", "Palatine Hill", 300, 0.2)

print("=== Roman Water Distribution Network ===")
network.analyze(head_pressure_kpa=80)

# Theft detection
print(f"\
=== Frontinus's Water Audit ===")
official_supply = 800  # L/s
actual_delivery = sum(n["demand"] for n in network.nodes.values())
theft = official_supply - actual_delivery

print(f"Official supply: {official_supply} L/s")
print(f"Metered delivery: {actual_delivery} L/s")
print(f"Unaccounted water: {theft} L/s ({theft/official_supply*100:.0f}%)")
print(f"Frontinus found 40% theft — {official_supply * 0.4:.0f} L/s stolen!")

# Water equity analysis
print(f"\
=== Water Access Equity ===")
districts = [
    ("Palatine Hill (wealthy)", 80, 20000, "Private connections"),
    ("Forum (commercial)", 200, 50000, "100+ public fountains"),
    ("Subura (poor)", 100, 80000, "50 public fountains"),
    ("Trans-Tiber", 60, 40000, "30 public fountains"),
]

print(f"{'District':<28} {'Flow (L/s)':>10} {'Population':>12} {'L/person/day':>14}")
print("-" * 66)

for name, flow, pop, desc in districts:
    per_capita = flow * 86400 / pop
    print(f"{name:<28} {flow:>8} {pop:>10,} {per_capita:>12.0f}")

print(f"\
The wealthy Palatine received {80*86400/20000:.0f} L/person/day")
print(f"The poor Subura received {100*86400/80000:.0f} L/person/day")
print(f"Water inequality existed even in ancient Rome.")`,
      challenge: 'Add a "leak detection" feature: if the total outflow from a junction doesn\'t match the inflow, there\'s a leak (or theft). Calculate the "water balance" at each junction and flag discrepancies greater than 5%. This is how modern water utilities detect leaks — the same principle Frontinus used in 97 CE.',
      successHint: 'You built a water distribution network model — the same type of analysis used by water utilities worldwide. The principles (conservation of mass at junctions, friction losses in pipes, pressure management) are identical whether the pipes are Roman lead or modern PVC. Frontinus\'s engineering is still relevant 1,900 years later.',
    },
    {
      title: 'Surveying — achieving 0.1% gradient over 90 km',
      concept: `The Aqua Marcia aqueduct maintained a gradient of about 1 m per kilometre — a 0.1% slope — over **91 kilometres**. At this slope, a 1-metre error in levelling over 1 km would double the gradient (too fast) or stop the flow entirely (no slope).

The Romans achieved this precision using a **chorobates** — a 6-metre-long wooden bench with plumb lines at each end and a water-filled groove along the top. By sighting along the groove (which self-levels due to gravity), surveyors could establish a horizontal line with accuracy of a few millimetres per metre.

The process: set up the chorobates at one point, sight to a marker at the next point (typically 50-100 metres away), record the height difference, and move forward. Repeat for 91 km. Errors accumulate over the full length, so surveyors had to work with extraordinary care.

Modern surveying uses **laser levels** (accurate to ±1 mm per 30 m) and **GPS** (accurate to ±10 mm). The Romans achieved comparable precision with water and string — a remarkable engineering achievement.

📚 *Surveying is the science of measuring positions and heights on the Earth's surface. It's the foundation of all construction — you can't build anything straight, level, or properly aligned without surveying first.*`,
      analogy: 'Imagine drawing a perfectly straight line on a football field using only a piece of string and a spirit level. Every 10 metres, you level the string, mark the ground, and move forward. After 100 metres, your cumulative error might be a few centimetres. Now imagine doing this for 91 KILOMETRES through mountains and valleys. That\'s what Roman surveyors did.',
      storyConnection: 'The chorobates was described by Vitruvius in his architectural treatise (1st century BCE). He explained that the water groove was a backup — used when wind made the plumb lines unreliable. This shows Roman engineering pragmatism: they had multiple methods for the same measurement, using whichever was more reliable in current conditions.',
      checkQuestion: 'If the surveying error is ±5 mm per measurement, and measurements are taken every 50 metres, what is the maximum cumulative error over 91 km?',
      checkAnswer: 'Number of measurements: 91,000 / 50 = 1,820. If errors are random (equally likely + or -), the cumulative error grows as √n × error_per_measurement = √1820 × 5 mm = 213 mm ≈ 21 cm. Over 91 km, the error is about 21 cm — small enough that the aqueduct still works (the total drop is 90 metres, so 21 cm is only 0.2% of the total).',
      codeIntro: 'Simulate Roman surveying — model cumulative errors and their effect on aqueduct gradient.',
      code: `import numpy as np

np.random.seed(42)

def simulate_survey(total_length_m, measurement_interval_m,
                    error_std_mm, target_gradient):
    """
    Simulate a Roman aqueduct survey with random measurement errors.
    Returns the surveyed profile vs the intended profile.
    """
    n_measurements = int(total_length_m / measurement_interval_m)
    distances = np.arange(0, total_length_m + measurement_interval_m,
                          measurement_interval_m)

    # Intended profile (perfect straight line)
    intended_heights = -target_gradient * distances + 100  # start at 100m

    # Surveyed profile (with cumulative random errors)
    errors = np.random.normal(0, error_std_mm/1000, n_measurements + 1)
    cumulative_errors = np.cumsum(errors)
    surveyed_heights = intended_heights + cumulative_errors

    return distances, intended_heights, surveyed_heights, cumulative_errors

# Simulate the Aqua Marcia survey
total_length = 91000  # 91 km
gradient = 90 / 91000  # 90m drop over 91 km

dist, intended, surveyed, errors = simulate_survey(
    total_length, measurement_interval_m=50,
    error_std_mm=5, target_gradient=gradient
)

print("=== Roman Aqueduct Survey Simulation ===")
print(f"Total length: {total_length/1000:.0f} km")
print(f"Target gradient: {gradient*1000:.2f} m/km")
print(f"Measurement interval: 50 m")
print(f"Error per measurement: ±5 mm (std)")
print()

# Report at key distances
print(f"{'Distance':>10} {'Intended (m)':>13} {'Surveyed (m)':>14} {'Error (cm)':>12}")
print("-" * 51)
for km in [0, 5, 10, 20, 30, 50, 70, 91]:
    idx = km * 1000 // 50
    if idx < len(dist):
        print(f"{km:>8} km {intended[idx]:>11.2f} {surveyed[idx]:>12.2f} "
              f"{errors[idx]*100:>10.1f}")

max_error = np.max(np.abs(errors)) * 100
print(f"\
Maximum cumulative error: {max_error:.1f} cm")
print(f"This is {max_error/9000*100:.2f}% of the total 90m drop")

# Check if gradient is always positive (water flows)
local_gradients = np.diff(surveyed) / 50  # gradient between measurements
negative_sections = np.sum(local_gradients > 0)  # positive height change = water flows uphill
total_sections = len(local_gradients)

print(f"\
=== Gradient Check ===")
print(f"Sections where water flows uphill: {negative_sections} of {total_sections}")
print(f"({negative_sections/total_sections*100:.1f}% — these would create pools)")

if negative_sections > 0:
    print(f"The surveyor would need to re-level these sections!")
else:
    print(f"All sections slope downhill — the aqueduct works!")

# Compare error sources
print(f"\
=== Error Sources in Roman Surveying ===")
sources = [
    ("Chorobates leveling", 2, "Water level reading precision"),
    ("Marker placement", 3, "Positioning the target stake"),
    ("Ground settlement", 5, "Ground shifts after construction"),
    ("Temperature effects", 1, "Thermal expansion of the chorobates"),
    ("Wind effects", 4, "Plumb line deflection in wind"),
]

total_error_sq = 0
for name, err, desc in sources:
    total_error_sq += err**2
    print(f"  {name:<25} ±{err}mm — {desc}")

combined = np.sqrt(total_error_sq)
print(f"  {'Combined (RSS)':<25} ±{combined:.1f}mm per measurement")

# Modern comparison
print(f"\
=== Modern vs Roman Surveying ===")
comparisons = [
    ("Roman chorobates", 5, "6m wooden bench with plumb lines and water groove"),
    ("Spirit level (1880)", 1, "Bubble level on a telescope"),
    ("Optical level (1920)", 0.5, "Telescope with crosshairs and stadia rod"),
    ("Laser level (1990)", 0.1, "Rotating laser with detector"),
    ("GPS (static, 2020)", 0.01, "Satellite-based positioning"),
]

print(f"{'Method':<25} {'Error (mm)':>10} {'Technology'}")
print("-" * 70)
for name, err, tech in comparisons:
    print(f"{name:<25} ±{err:>8.2f} {tech}")`,
      challenge: 'Run the simulation 100 times (different random seeds) and calculate: in what percentage of simulations does the aqueduct have zero uphill sections? This gives the "probability of success" for a Roman survey — and explains why surveyors were so meticulous.',
      successHint: 'You modeled the statistics of cumulative measurement errors — the same mathematics used in GPS accuracy analysis, manufacturing tolerance stacking, and navigation dead reckoning. The key insight: random errors grow as √n (not n), which is why even imprecise measurements can achieve accurate results over long distances.',
    },
    {
      title: 'Arch engineering — how the Pont du Gard stays up',
      concept: `The **Pont du Gard** in southern France is one of the most spectacular Roman engineering achievements: a three-tiered stone arch bridge that carries an aqueduct 50 metres above the Gardon River valley.

Each arch is a **semicircle** made of wedge-shaped stones called **voussoirs**. The key property: every stone in the arch is in **compression** (being squeezed between its neighbours). No stone is in tension (being pulled apart). Since stone is strong in compression but weak in tension, this means the arch can support enormous loads.

The arch pushes **downward and outward**. The downward force is easy — it goes into the foundations. The outward force (thrust) must be resisted by the mass of the pier (the thick column between arches) or by adjacent arches pushing back.

The **thrust** depends on: the arch span (wider = more thrust), the arch height (flatter = more thrust), and the load (heavier = more thrust). For a semicircular arch: **T = w × L / (2π)** approximately, where w is the total weight and L is the span.

📚 *The Romans didn't know trigonometry or force vectors. They built arches by trial and error, using wooden scaffolding (centering) to hold the stones in place until the keystone was inserted and the arch became self-supporting.*`,
      analogy: 'Stand between two people and have them push you from both sides. You\'re being compressed — squeezed between them. You don\'t fall because the forces balance. Now imagine a row of people all pushing sideways, with the last person at each end leaning against a wall. Everyone stays up because everyone is in compression. That\'s an arch — stone people pushing against each other.',
      storyConnection: 'The Pont du Gard was built around 19 BCE and carries the Nîmes aqueduct across the Gardon valley. It was built WITHOUT mortar — the stones are held in place purely by their own weight and precision cutting. Some stones weigh 6 tonnes. The bridge has survived 2,000 years of floods, earthquakes, and human activity.',
      checkQuestion: 'The Pont du Gard is 50 metres tall and was built without mortar. What holds the stones together?',
      checkAnswer: 'Gravity and geometry. Each stone is precisely cut to fit tightly against its neighbours. The weight of the stones above presses down, increasing the friction between the stones. The arch shape converts all forces to compression, which stone handles well. No glue needed — the physics does the work.',
      codeIntro: 'Model the forces in a Roman arch — calculate thrust, compression, and the load limits.',
      code: `import numpy as np

def semicircular_arch(span_m, stone_density=2400, arch_thickness_m=1.0):
    """
    Calculate forces in a semicircular arch.
    """
    radius = span_m / 2
    arch_height = radius  # semicircle height = radius

    # Arch length (half circumference)
    arch_length = np.pi * radius

    # Arch cross-section area
    arch_area = arch_thickness_m * arch_thickness_m  # simplified square section

    # Weight of the arch
    arch_volume = arch_length * arch_area
    arch_weight = arch_volume * stone_density * 9.81  # newtons

    # Horizontal thrust at the base (for a semicircular arch)
    # T = w × R / (π × arch_height) approximately
    thrust = arch_weight * radius / (np.pi * arch_height)

    # Vertical reaction at each support
    vertical = arch_weight / 2

    # Total force at the base (resultant of vertical + horizontal)
    base_force = np.sqrt(thrust**2 + vertical**2)

    # Angle of resultant from vertical
    angle = np.degrees(np.arctan(thrust / vertical))

    return {
        "span": span_m,
        "height": arch_height,
        "weight": arch_weight,
        "thrust": thrust,
        "vertical": vertical,
        "base_force": base_force,
        "angle": angle,
    }

# Analyze the Pont du Gard's arches
print("=== Pont du Gard — Arch Analysis ===")
print("Three tiers of arches:\
")

tiers = [
    ("Bottom tier", 24.5, 6),    # span 24.5m, 6 arches
    ("Middle tier", 19.5, 11),   # span 19.5m, 11 arches
    ("Top tier", 4.6, 35),       # span 4.6m, 35 arches
]

for name, span, count in tiers:
    result = semicircular_arch(span, arch_thickness_m=1.2)
    print(f"{name}: {count} arches, span {span}m each")
    print(f"  Weight per arch: {result['weight']/1000:.0f} kN ({result['weight']/9810:.0f} tonnes)")
    print(f"  Horizontal thrust: {result['thrust']/1000:.0f} kN")
    print(f"  Base force: {result['base_force']/1000:.0f} kN at {result['angle']:.0f}° from vertical")
    print()

# How the piers resist thrust
print("=== Pier Design ===")
pier_height = 20  # metres (bottom tier pier)
pier_width = 6    # metres
pier_depth = 6    # metres
pier_volume = pier_height * pier_width * pier_depth
pier_weight = pier_volume * 2400 * 9.81  # newtons

# Thrust from arch on each side
arch_result = semicircular_arch(24.5, arch_thickness_m=1.2)
net_thrust = 0  # arches on both sides cancel if equal

print(f"Pier dimensions: {pier_width}m × {pier_depth}m × {pier_height}m")
print(f"Pier weight: {pier_weight/1000:.0f} kN ({pier_weight/9810:.0f} tonnes)")
print(f"Arch thrust (each side): {arch_result['thrust']/1000:.0f} kN")
print(f"Net horizontal thrust: {net_thrust:.0f} kN (arches balance each other)")
print(f"\
The piers work because adjacent arches push in OPPOSITE directions,")
print(f"cancelling each other's horizontal thrust. Only the end piers need")
print(f"to resist unbalanced thrust — which is why they're built into the hillside.")

# Load capacity
print(f"\
=== Load Capacity ===")
limestone_compressive_strength = 40  # MPa = 40,000 kPa

# Stress at the base of the bottom arch
contact_area = 1.2 * 1.2  # m² (arch cross-section at the base)
stress = arch_result['base_force'] / (contact_area * 1e6)  # MPa
safety_factor = limestone_compressive_strength / stress

print(f"Arch base force: {arch_result['base_force']/1000:.0f} kN")
print(f"Contact area: {contact_area:.2f} m²")
print(f"Stress at base: {stress:.1f} MPa")
print(f"Limestone strength: {limestone_compressive_strength} MPa")
print(f"Safety factor: {safety_factor:.0f}× (the arch is {safety_factor:.0f} times stronger than needed)")
print(f"\
This is why Roman arches last millennia — they operate at a")
print(f"tiny fraction of their material's capacity.")

# Effect of span on thrust
print(f"\
=== How Span Affects Thrust ===")
print(f"{'Span (m)':>10} {'Thrust (kN)':>12} {'Base angle':>12} {'Weight (kN)':>12}")
print("-" * 48)

for span in [3, 5, 10, 15, 20, 25, 30]:
    r = semicircular_arch(span)
    print(f"{span:>8} {r['thrust']/1000:>10.0f} {r['angle']:>10.0f}° {r['weight']/1000:>10.0f}")

print(f"\
Doubling the span more than doubles the thrust —")
print(f"this is why very wide arches require very heavy piers.")`,
      challenge: 'The Romans also built pointed arches (in later periods). A pointed arch with the same span has less horizontal thrust than a semicircular one. Model a pointed arch where the height is 1.5× the radius (instead of equal to the radius). How does this change the thrust? This is the key innovation of Gothic cathedrals.',
      successHint: 'You analyzed the structural mechanics of Roman arches — the same analysis used for every bridge, tunnel, and arch structure today. The key insight: arches convert bending (which creates tension) into pure compression (which stone handles perfectly). This single idea made Roman architecture possible.',
    },
    {
      title: 'The continuous flow principle — why Roman fountains never stopped',
      concept: `Rome's 1,300+ fountains ran **continuously** — water poured from the spouts 24 hours a day, 7 days a week, 365 days a year. There were no taps, no valves, no on/off switches.

This seems wasteful. But it served critical engineering purposes:

1. **Prevents stagnation**: standing water breeds mosquitoes and bacteria. Moving water stays fresh.
2. **Maintains pressure**: continuous flow prevents air pockets from forming in the pipes, which would block flow.
3. **Flushes sewers**: fountain overflow drained into the sewers, flushing waste through the underground system and into the Tiber.
4. **Prevents sediment buildup**: moving water carries sediment through the system; still water lets it settle and clog the channels.

The overflow wasn't waste — it was a **feature**. The entire water system — from mountain spring to fountain to sewer to river — was one continuous flow, powered by gravity from start to finish.

Modern water systems use pressurized pipes with taps — but they still need constant circulation to prevent bacterial growth (Legionella grows in stagnant warm water). The Romans solved this problem by simply never stopping the flow.

📚 *The Trevi Fountain in modern Rome is still fed by the Aqua Virgo aqueduct, built in 19 BCE — delivering the same mountain spring water through essentially the same channel for over 2,000 years.*`,
      analogy: 'A river never stops flowing. It doesn\'t have taps. If you dammed it, the water behind the dam would become stagnant, grow algae, and breed mosquitoes. The Roman fountains were like tiny river outlets — keeping the water moving prevented all the problems of stagnation.',
      storyConnection: 'When the Goths cut Rome\'s aqueducts during the 6th-century sieges, the fountains stopped. Within decades, the city\'s population collapsed from over a million to fewer than 30,000. The city literally could not survive without flowing water. The aqueducts weren\'t just convenience — they were life support.',
      checkQuestion: 'A fountain delivers 0.5 litres per second continuously. How many litres per day? How many litres per year?',
      checkAnswer: '0.5 × 86,400 = 43,200 litres per day. × 365 = 15,768,000 litres per year — about 15.8 million litres from a single fountain. With 1,300 fountains, Rome\'s public fountains alone delivered about 20 billion litres per year.',
      codeIntro: 'Model the continuous flow system — track water from source to fountain to sewer, and analyze the benefits.',
      code: `import numpy as np

def water_quality_model(flow_rate_ls, pipe_volume_L, temperature_C, days):
    """
    Model water quality in a pipe as a function of flow rate.
    Stagnant water grows bacteria; moving water stays fresh.
    """
    # Residence time = pipe volume / flow rate
    if flow_rate_ls > 0:
        residence_time_hours = pipe_volume_L / (flow_rate_ls * 3600)
    else:
        residence_time_hours = float('inf')

    # Bacterial growth (simplified Legionella model)
    # Doubling time depends on temperature (fastest at 37°C)
    optimal_temp = 37
    temp_factor = np.exp(-((temperature_C - optimal_temp) / 15) ** 2)
    base_doubling_hours = 4  # hours at optimal temperature
    doubling_hours = base_doubling_hours / max(temp_factor, 0.01)

    # Colony count over time
    initial_bacteria = 10  # per litre
    daily_counts = []

    for day in range(days):
        if residence_time_hours < doubling_hours:
            # Water replaced before bacteria can double — stays clean
            count = initial_bacteria * 2 ** (residence_time_hours / doubling_hours)
        else:
            # Stagnant water — bacteria grow unchecked
            hours = day * 24
            count = initial_bacteria * 2 ** (hours / doubling_hours)

        daily_counts.append(min(count, 1e9))  # cap at 1 billion

    return daily_counts, residence_time_hours

# Compare flowing vs stagnant water
print("=== Water Quality: Flowing vs Stagnant ===")
print(f"Pipe volume: 1000 litres, Temperature: 20°C\
")

scenarios = [
    ("Continuous flow (0.5 L/s)", 0.5),
    ("Slow flow (0.1 L/s)", 0.1),
    ("Intermittent (0.01 L/s)", 0.01),
    ("Stagnant (0 L/s)", 0),
]

print(f"{'Scenario':<30} {'Residence (hr)':>14} {'Day 1':>10} {'Day 3':>10} {'Day 7':>10}")
print("-" * 76)

for name, flow in scenarios:
    counts, residence = water_quality_model(flow, 1000, 20, 7)
    res_str = f"{residence:.1f}" if residence < 1000 else "∞"
    print(f"{name:<30} {res_str:>12} hr "
          f"{counts[0]:>8.0f} {counts[2]:>8.0f} {counts[6]:>8.0f} bacteria/L")

# The 80-metre rule
print(f"\
=== The 80-Metre Rule ===")
print(f"No Roman citizen had to walk more than 80 metres to a fountain.")

city_area_km2 = 14  # Rome's area within the walls
city_area_m2 = city_area_km2 * 1e6
coverage_per_fountain = np.pi * 80**2  # circular coverage area
fountains_needed = city_area_m2 / coverage_per_fountain

print(f"City area: {city_area_km2} km²")
print(f"Coverage per fountain (80m radius): {coverage_per_fountain:.0f} m²")
print(f"Minimum fountains for full coverage: {fountains_needed:.0f}")
print(f"Actual fountains in Rome: >1,300")
print(f"Overlap factor: {1300/fountains_needed:.1f}× (significant redundancy)")

# Sewer flushing calculation
print(f"\
=== Sewer Flushing ===")
fountain_overflow_pct = 30  # 30% of fountain water overflows to sewers
total_fountain_flow = 1300 * 0.5  # L/s (average per fountain)
sewer_flushing_flow = total_fountain_flow * fountain_overflow_pct / 100

sewer_length_km = 100  # estimated sewer network length
sewer_volume_m3 = sewer_length_km * 1000 * 2 * 1.5  # 2m × 1.5m cross section
flushing_time_hours = sewer_volume_m3 * 1000 / (sewer_flushing_flow * 3600)

print(f"Total fountain flow: {total_fountain_flow:.0f} L/s")
print(f"Overflow to sewers: {sewer_flushing_flow:.0f} L/s ({fountain_overflow_pct}%)")
print(f"Sewer volume: {sewer_volume_m3:,.0f} m³")
print(f"Complete flush cycle: {flushing_time_hours:.0f} hours")
print(f"The entire sewer system is flushed {24/flushing_time_hours:.1f}× per day!")

# Water budget
print(f"\
=== Rome's Daily Water Budget ===")
total_supply = 800000  # estimated L/s across all 11 aqueducts × time
supply_per_day = 1000000000  # ~1 billion litres/day

categories = [
    ("Public fountains (drinking)", 35),
    ("Public baths", 30),
    ("Private connections", 15),
    ("Sewer flushing (overflow)", 10),
    ("Gardens & agriculture", 5),
    ("Losses & theft", 5),
]

print(f"Total supply: ~{supply_per_day/1e6:.0f} million litres/day\
")
print(f"{'Category':<30} {'Share':>6} {'Volume (ML/day)':>16}")
print("-" * 54)
for cat, pct in categories:
    vol = supply_per_day * pct / 100 / 1e6
    print(f"{cat:<30} {pct:>4}% {vol:>14.0f}")`,
      challenge: 'Modern buildings sometimes have Legionella outbreaks in stagnant warm water pipes (e.g., during COVID lockdowns when buildings were empty). Calculate: if a building has 500 litres of water in its pipes at 35°C and the water sits for 14 days, how many bacteria per litre? Compare with the WHO safety threshold of 1,000 per litre. The Romans\' continuous-flow approach avoided this entirely.',
      successHint: 'You analyzed the engineering rationale for continuous-flow water systems — connecting fluid dynamics, microbiology, and urban planning. The same principles govern modern water treatment: maintain flow, prevent stagnation, monitor quality. Rome\'s 2,000-year-old system anticipated problems that modern cities still struggle with.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Hydraulic engineering through code</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises use Python to model water flow, hydrostatic pressure, distribution networks, surveying, and arch mechanics.
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
