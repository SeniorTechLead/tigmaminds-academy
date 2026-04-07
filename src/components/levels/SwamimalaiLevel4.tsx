import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function SwamimalaiLevel4() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Furnace energy simulator — modelling heat input and losses',
      concept: `A Swamimalai charcoal furnace must deliver enough heat to melt bronze at 950 degrees C, but most of the energy is lost — through the furnace walls, up the chimney, and into heating the mould. A realistic furnace model must account for all these losses to predict how much charcoal is needed and how long the melt takes.

The energy balance is: **Q_charcoal = Q_metal + Q_mould + Q_wall_loss + Q_exhaust**. The charcoal combustion rate determines the heat input, and the various loss mechanisms determine how much reaches the metal. Typical charcoal furnace efficiency is only 10-20%.

In this capstone exercise, you will build a complete furnace simulator that tracks temperature over time, accounting for heat input from combustion and losses to the surroundings. This integrates thermodynamics, heat transfer, and energy balance — all concepts from earlier levels.

*Energy balance is the foundation of all thermal engineering: what goes in must equal what comes out plus what is stored. No energy is created or destroyed — it just moves between the metal, the furnace structure, and the environment.*`,
      analogy: 'Imagine filling a bathtub with the drain open. The tap (charcoal combustion) adds water (heat). The drain (wall losses, exhaust) removes water. The water level (temperature) rises only if the tap flow exceeds the drain flow. Eventually, the tub reaches a steady level where inflow equals outflow — the maximum furnace temperature.',
      storyConnection: 'Swamimalai furnace tenders are masters of airflow control. By adjusting bellows speed and charcoal placement, they regulate the combustion rate. They know that fanning faster does not always help — too much air cools the furnace as much as it feeds the fire. They intuitively optimise the energy balance.',
      checkQuestion: 'If a furnace burns 2 kg/hour of charcoal (energy: 29 MJ/kg) and loses 80% of the heat, how much useful heat reaches the metal per hour?',
      checkAnswer: 'Total heat = 2 kg/h x 29 MJ/kg = 58 MJ/h. Useful heat = 58 x 0.20 = 11.6 MJ/h. This is enough to melt about 35 kg of bronze per hour (heating from 25 to 950 degrees C plus latent heat requires about 330 kJ per kg).',
      codeIntro: 'Build a complete furnace energy balance simulator.',
      code: `import numpy as np

class FurnaceSimulator:
    def __init__(self, bronze_mass_kg, charcoal_rate_kg_h,
                 efficiency=0.15, mould_mass_kg=None):
        self.bronze_mass = bronze_mass_kg
        self.charcoal_rate = charcoal_rate_kg_h
        self.efficiency = efficiency
        self.mould_mass = mould_mass_kg or bronze_mass_kg * 2

        # Material properties
        self.bronze_cp = 380       # J/(kg*K) specific heat
        self.bronze_Lf = 190000    # J/kg heat of fusion
        self.bronze_melt = 950     # C melting point
        self.mould_cp = 900        # J/(kg*K) clay specific heat
        self.charcoal_energy = 29e6  # J/kg energy content

    def simulate(self, dt_seconds=60, max_hours=6):
        steps = int(max_hours * 3600 / dt_seconds)
        time_h = []
        metal_temp = []
        mould_temp = []
        charcoal_used = []

        t_metal = 25.0    # starting temperature C
        t_mould = 25.0
        total_charcoal = 0
        latent_absorbed = 0
        melting = False
        melted = False

        for step in range(steps):
            t = step * dt_seconds / 3600  # time in hours
            time_h.append(t)
            metal_temp.append(t_metal)
            mould_temp.append(t_mould)

            # Heat input
            q_in = self.charcoal_rate * self.charcoal_energy * self.efficiency
            q_in_step = q_in * dt_seconds / 3600  # J per step

            # Split heat between metal and mould (proportional to mass*cp)
            metal_capacity = self.bronze_mass * self.bronze_cp
            mould_capacity = self.mould_mass * self.mould_cp
            total_capacity = metal_capacity + mould_capacity
            q_metal = q_in_step * metal_capacity / total_capacity
            q_mould = q_in_step * mould_capacity / total_capacity

            # Update mould temperature
            t_mould += q_mould / (self.mould_mass * self.mould_cp)

            # Update metal temperature (with phase change)
            if not melting and not melted and t_metal < self.bronze_melt:
                t_metal += q_metal / (self.bronze_mass * self.bronze_cp)
                if t_metal >= self.bronze_melt:
                    t_metal = self.bronze_melt
                    melting = True
            elif melting:
                latent_absorbed += q_metal
                total_latent = self.bronze_mass * self.bronze_Lf
                if latent_absorbed >= total_latent:
                    melting = False
                    melted = True
                    leftover = latent_absorbed - total_latent
                    t_metal += leftover / (self.bronze_mass * self.bronze_cp)
            else:
                t_metal += q_metal / (self.bronze_mass * self.bronze_cp)

            total_charcoal += self.charcoal_rate * dt_seconds / 3600
            charcoal_used.append(total_charcoal)

        return time_h, metal_temp, mould_temp, charcoal_used

# Run simulation
sim = FurnaceSimulator(bronze_mass_kg=5, charcoal_rate_kg_h=3, efficiency=0.15)
time_h, metal_t, mould_t, charcoal = sim.simulate(dt_seconds=30, max_hours=4)

print("=== Swamimalai Furnace Simulator ===")
print(f"Bronze: {sim.bronze_mass} kg | Charcoal rate: {sim.charcoal_rate} kg/h")
print(f"Furnace efficiency: {sim.efficiency*100:.0f}%")
print()

header = "Time(h)  Metal(C)  Mould(C)  Charcoal(kg)  Status"
print(header)
print("-" * len(header))

for i in range(0, len(time_h), 20):
    t = time_h[i]
    mt = metal_t[i]
    moudt = mould_t[i]
    ch = charcoal[i]
    status = "Heating" if mt < 950 else "Melting" if mt == 950 else "Superheating"
    print(f"{t:>6.1f}   {mt:>7.0f}    {moudt:>6.0f}     {ch:>10.1f}    {status}")

print()
total_ch = charcoal[-1]
print(f"Total charcoal consumed: {total_ch:.1f} kg")
print(f"Charcoal-to-bronze ratio: {total_ch/sim.bronze_mass:.1f}:1")`,
      challenge: 'Add heat losses through the furnace wall: model them as Q_loss = h * A * (T_furnace - T_ambient), where h = 10 W/(m^2*K) and A = 0.5 m^2. This will reduce the maximum achievable temperature and increase charcoal consumption.',
      successHint: 'You just built a thermal process simulator — the same type of tool used in foundries, steel mills, glass factories, and chemical plants worldwide. The energy balance approach applies to any thermal process.',
    },
    {
      title: 'Mould filling simulation — fluid flow into complex shapes',
      concept: `When molten bronze is poured into the mould, it must flow through narrow channels and fill every detail of the cavity before it solidifies. If the metal cools too much during filling, it solidifies prematurely and the casting is incomplete (a defect called a **misrun**).

The key physics is a race between **filling time** (how long it takes metal to reach every corner) and **solidification time** (how long before the metal freezes). The filling time depends on the driving pressure (height of the metal column), the channel geometry, and the metal viscosity. The solidification time depends on the wall thickness and the mould temperature.

In this exercise, you will simulate mould filling as a step-by-step process, tracking the metal front position, temperature drop, and remaining fluidity. This combines fluid mechanics, heat transfer, and the phase diagram concepts from earlier levels.

*Fluidity is how far a metal can flow before it solidifies. It depends on the alloy composition, superheat, and channel geometry. High fluidity = better mould filling = fewer defects.*`,
      analogy: 'Imagine pouring honey into an ice cube tray. The honey flows easily at first but slows down as it cools (it gets thicker). If the tray is cold enough, the honey might stop flowing before filling all the compartments. Molten bronze behaves similarly — it has a "fluidity limit" determined by how quickly it cools.',
      storyConnection: 'Swamimalai casters pour from the top through a network of channels (gates and runners) that distribute metal throughout the mould. The gate system is designed so that thin sections (fingers, ornaments) are filled first while the metal is hottest, and thick sections fill last through the risers. Getting this wrong means a statue missing its fingers.',
      checkQuestion: 'If bronze fluidity is 50 cm at 1050 degrees C superheat, and a mould passage is 40 cm long, will the metal reach the end?',
      checkAnswer: 'Yes, because 50 cm fluidity exceeds the 40 cm passage. But the margin is only 10 cm. If the pour temperature drops by even 30 degrees C (reducing fluidity to about 40 cm), the metal barely makes it. This is why casters superheat the metal well above the melting point — it provides a fluidity margin.',
      codeIntro: 'Simulate the mould-filling process for a lost-wax bronze casting.',
      code: `import numpy as np

class MouldFillSimulator:
    def __init__(self, pour_temp_C, mould_temp_C, channel_sections):
        self.pour_temp = pour_temp_C
        self.mould_temp = mould_temp_C
        self.channels = channel_sections
        self.bronze_melt = 950
        self.heat_loss_rate = 2.5  # C per cm of flow

    def simulate_fill(self):
        results = []
        current_temp = self.pour_temp
        total_distance = 0
        filled_ok = True

        for section in self.channels:
            name = section["name"]
            length_cm = section["length_cm"]
            width_mm = section["width_mm"]

            # Temperature drop through this section
            # Narrower channels lose heat faster
            width_factor = 10.0 / max(width_mm, 1)
            temp_drop = self.heat_loss_rate * length_cm * width_factor

            entry_temp = current_temp
            exit_temp = current_temp - temp_drop
            total_distance += length_cm

            # Check if metal is still liquid
            fluidity_remaining = max(0, (exit_temp - self.bronze_melt) / self.heat_loss_rate)
            status = "FILLED" if exit_temp > self.bronze_melt else "MISRUN"

            if exit_temp <= self.bronze_melt:
                filled_ok = False
                # Calculate how far metal actually flowed
                actual_flow = length_cm * (entry_temp - self.bronze_melt) / temp_drop
                actual_flow = min(actual_flow, length_cm)
            else:
                actual_flow = length_cm

            results.append({
                "name": name,
                "length": length_cm,
                "width": width_mm,
                "entry_temp": entry_temp,
                "exit_temp": max(exit_temp, self.bronze_melt),
                "actual_flow": actual_flow,
                "status": status,
            })

            current_temp = exit_temp

        return results, filled_ok

# Define a Nataraja sculpture mould channel system
channels = [
    {"name": "Main sprue",       "length_cm": 15, "width_mm": 20},
    {"name": "Primary runner",   "length_cm": 10, "width_mm": 15},
    {"name": "Body cavity",      "length_cm": 20, "width_mm": 8},
    {"name": "Arm runner",       "length_cm": 12, "width_mm": 6},
    {"name": "Hand detail",      "length_cm": 8,  "width_mm": 3},
    {"name": "Finger tips",      "length_cm": 5,  "width_mm": 2},
]

# Test different pour temperatures
print("=== Mould Filling Simulation: Nataraja Statue ===")
print()

for pour_temp in [1000, 1050, 1100]:
    sim = MouldFillSimulator(pour_temp, 700, channels)
    results, ok = sim.simulate_fill()

    verdict = "COMPLETE" if ok else "INCOMPLETE"
    print(f"--- Pour temperature: {pour_temp} C  [{verdict}] ---")
    header = "Section            Length  Width  Entry(C)  Exit(C)  Status"
    print(header)

    for r in results:
        print(f"  {r['name']:<18} {r['length']:>4}cm  {r['width']:>3}mm  "
              f"{r['entry_temp']:>6.0f}    {r['exit_temp']:>5.0f}    {r['status']}")
    print()

print("Higher pour temperature gives more fluidity margin.")
print("The finger tips are the critical section — thinnest and")
print("furthest from the pour point.")`,
      challenge: 'Add a mould preheat parameter test: simulate filling at 1050 degrees C pour temperature with mould preheats of 200, 400, 600, and 700 degrees C. The heat loss rate should decrease linearly with higher mould temperature (less temperature difference means slower cooling). Find the minimum preheat that allows complete filling.',
      successHint: 'You just built a casting flow simulation. Commercial software like MAGMA and Flow-3D does exactly this with full 3D fluid dynamics, but the core concept is the same: track the metal temperature as it flows and predict whether it solidifies before filling.',
    },
    {
      title: 'Solidification time predictor — Chvorinov\'s rule',
      concept: `How long does it take for a bronze casting to solidify? The answer depends on the geometry — specifically, the **volume-to-surface-area ratio**. This relationship was quantified by Czech engineer Nicolas Chvorinov: **t = B x (V/A) squared**, where t is solidification time, V/A is the volume-to-surface-area ratio (called the "modulus"), and B is a constant that depends on the metal and mould material.

This rule has a profound implication: a thick section solidifies much slower than a thin section. A sphere (the most compact shape) takes the longest to solidify for a given volume, while a thin plate solidifies fastest.

In this exercise, you will use Chvorinov's rule to predict solidification times for different parts of a sculpture, then design a riser system that ensures each section is fed with liquid metal throughout its solidification.

*The riser must solidify AFTER the section it feeds. By Chvorinov's rule, this means the riser must have a larger V/A ratio (i.e., be thicker) than the casting section. This is why risers are typically cylindrical — cylinders have a good V/A ratio.*`,
      analogy: 'Imagine ice cubes of different sizes in a warm room. The small cube melts in 10 minutes, the medium cube in 40 minutes, and the large cube in over an hour. The solidification of castings follows the same pattern in reverse: large sections take much longer to freeze because they have less surface area relative to their volume for heat to escape.',
      storyConnection: 'When a Swamimalai master plans a large sculpture, he mentally calculates which sections will solidify first and last. He places risers (extra reservoirs) at thick sections so they have a supply of liquid metal throughout solidification. The placement of these risers — which are cut off and ground away after casting — is one of the most closely guarded skills in the tradition.',
      checkQuestion: 'A casting section has V/A = 2 cm. The riser must solidify after the section. What is the minimum V/A ratio for the riser?',
      checkAnswer: 'Since solidification time is proportional to (V/A) squared, the riser V/A must be at least equal to the section V/A (2 cm). In practice, a safety factor of 1.2 is applied, so the riser V/A should be at least 2.4 cm. For a cylindrical riser, this determines the minimum diameter and height.',
      codeIntro: 'Apply Chvorinov\'s rule to predict solidification times and design risers.',
      code: `import numpy as np

# Chvorinov's rule: t = B * (V/A)^2
# B depends on metal and mould properties

def chvorinov_constant(metal_props, mould_props):
    """Calculate B in Chvorinov's rule (seconds/cm^2)"""
    rho = metal_props["density"]      # kg/m^3
    Lf = metal_props["latent_heat"]   # J/kg
    T_pour = metal_props["pour_temp"]
    T_melt = metal_props["melt_temp"]
    cp = metal_props["specific_heat"]
    superheat = cp * (T_pour - T_melt)
    effective_heat = rho * (Lf + superheat)

    k_mould = mould_props["conductivity"]
    rho_m = mould_props["density"]
    cp_m = mould_props["specific_heat"]
    T_mould = mould_props["temperature"]

    diffusivity = k_mould / (rho_m * cp_m)
    dT = T_melt - T_mould

    B = (np.pi / 4) * (effective_heat / (dT * np.sqrt(k_mould * rho_m * cp_m * np.pi))) ** 2
    return B / 1e4  # convert to s/cm^2

bronze = {
    "density": 8800, "latent_heat": 190000, "specific_heat": 380,
    "pour_temp": 1050, "melt_temp": 950,
}
clay_mould = {
    "conductivity": 0.8, "density": 1800, "specific_heat": 900,
    "temperature": 700,
}

B = chvorinov_constant(bronze, clay_mould)

# Calculate V/A for common shapes
def plate_modulus(thickness_cm, width_cm, length_cm):
    V = thickness_cm * width_cm * length_cm
    A = 2 * (thickness_cm * width_cm + thickness_cm * length_cm + width_cm * length_cm)
    return V / A

def cylinder_modulus(radius_cm, height_cm):
    V = np.pi * radius_cm ** 2 * height_cm
    A = 2 * np.pi * radius_cm * (radius_cm + height_cm)
    return V / A

def sphere_modulus(radius_cm):
    V = (4/3) * np.pi * radius_cm ** 3
    A = 4 * np.pi * radius_cm ** 2
    return V / A

print("=== Chvorinov's Rule: Solidification Time Predictor ===")
print(f"Chvorinov constant B = {B:.1f} s/cm^2")
print()

# Sculpture sections
sections = [
    ("Finger (plate)", plate_modulus(0.3, 1.0, 4.0)),
    ("Hand (plate)", plate_modulus(0.5, 3.0, 4.0)),
    ("Arm (cylinder)", cylinder_modulus(1.5, 15.0)),
    ("Torso (cylinder)", cylinder_modulus(4.0, 20.0)),
    ("Head (sphere)", sphere_modulus(5.0)),
    ("Base (plate)", plate_modulus(3.0, 15.0, 15.0)),
]

header = "Section              V/A (cm)  Solidif Time(s)  Time(min)  Order"
print(header)
print("-" * len(header))

# Sort by solidification time
sorted_sections = sorted(sections, key=lambda x: x[1])

for i, (name, modulus) in enumerate(sorted_sections):
    t_solid = B * modulus ** 2
    print(f"{name:<22} {modulus:>6.2f}    {t_solid:>13.0f}    {t_solid/60:>7.1f}    {i+1}")

print()
print("=== Riser Design (safety factor 1.2) ===")
print()
# Design riser for the last section to solidify
for name, modulus in sorted_sections[-3:]:
    riser_modulus = modulus * 1.2
    # Find cylinder dimensions: r = h, so modulus = r*h/(2r+2h) = r/4
    riser_r = riser_modulus * 4
    riser_t = B * riser_modulus ** 2
    print(f"  Riser for {name}: diameter = {2*riser_r:.1f} cm, "
          f"solidifies in {riser_t/60:.1f} min")`,
      challenge: 'Add a "directional solidification" check: verify that each section solidifies before the section feeding it (from thin extremities inward toward risers). If any section solidifies before its feeder path, flag it as a potential shrinkage defect location.',
      successHint: 'Chvorinov\'s rule is taught in every metallurgy and materials science program in the world. Combined with riser design rules, it forms the foundation of casting engineering. You just applied it to predict the solidification sequence of a complete sculpture.',
    },
    {
      title: 'Quality inspection — defect detection and acceptance criteria',
      concept: `After a bronze casting is broken from its mould, it must be inspected for defects. Common defects include: **porosity** (internal voids), **misruns** (incomplete filling), **hot tears** (cracks from shrinkage stress), **inclusions** (trapped mould material), and **surface roughness**. Each defect has different causes and different effects on the casting's integrity.

Modern foundries use **non-destructive testing** (NDT): X-ray radiography to find internal voids, ultrasonic testing to detect cracks, dye penetrant inspection for surface cracks, and dimensional measurement for shape accuracy. For artistic castings, visual inspection against the original wax model is also critical.

In this capstone exercise, you will build a comprehensive casting quality analyser that takes inputs from all previous levels — composition, cooling rate, porosity, grain size — and generates a quality report with pass/fail criteria.

*Non-destructive testing means inspecting without damaging the part. It is essential for expensive castings where you cannot cut one open to check the inside — you need every piece to be good.*`,
      analogy: 'Think of a medical checkup. The doctor does not just check one thing — they measure blood pressure, heart rate, blood chemistry, and more. Each measurement has a "normal range." Similarly, a casting inspection checks multiple properties, each against its own acceptance criteria. The casting passes only if ALL measurements are within specification.',
      storyConnection: 'Swamimalai masters inspect their castings by tapping with a small hammer and listening to the ring. A clean, resonant ring means dense, defect-free bronze. A dull thud suggests porosity or cracks. They also check weight (underweight means internal voids), surface texture (grainy means coarse solidification), and dimensional accuracy against the original wax model.',
      checkQuestion: 'A casting has good surface finish and correct dimensions but rings with a dull sound when tapped. What defect is most likely?',
      checkAnswer: 'Internal porosity or a hidden crack. The dull sound occurs because internal voids or cracks dampen the vibration. This is the same principle as ultrasonic testing — sound waves interact with internal defects. The Swamimalai tap test is an ancient form of acoustic NDT.',
      codeIntro: 'Build a comprehensive casting quality inspection and reporting system.',
      code: `import numpy as np

class CastingInspector:
    def __init__(self, alloy_spec):
        self.spec = alloy_spec
        self.results = {}
        self.defects = []

    def check_composition(self, tin_pct, lead_pct, impurities_pct):
        ok = (self.spec["tin_min"] <= tin_pct <= self.spec["tin_max"]
              and lead_pct <= self.spec["lead_max"]
              and impurities_pct <= self.spec["impurity_max"])
        self.results["composition"] = {
            "tin": tin_pct, "lead": lead_pct,
            "impurities": impurities_pct, "pass": ok
        }
        if not ok:
            self.defects.append("Composition out of spec")
        return ok

    def check_porosity(self, measured_density, theoretical_density):
        porosity_pct = (1 - measured_density / theoretical_density) * 100
        ok = porosity_pct <= self.spec["max_porosity_pct"]
        self.results["porosity"] = {
            "measured": porosity_pct, "limit": self.spec["max_porosity_pct"],
            "pass": ok
        }
        if not ok:
            self.defects.append("Porosity exceeds limit")
        return ok

    def check_hardness(self, hardness_hv):
        ok = self.spec["hardness_min"] <= hardness_hv <= self.spec["hardness_max"]
        self.results["hardness"] = {
            "measured": hardness_hv,
            "range": (self.spec["hardness_min"], self.spec["hardness_max"]),
            "pass": ok
        }
        if not ok:
            self.defects.append("Hardness out of range")
        return ok

    def check_dimensions(self, deviations_mm):
        max_dev = max(abs(d) for d in deviations_mm)
        ok = max_dev <= self.spec["max_deviation_mm"]
        self.results["dimensions"] = {
            "max_deviation": max_dev,
            "limit": self.spec["max_deviation_mm"], "pass": ok
        }
        if not ok:
            self.defects.append("Dimensional deviation too large")
        return ok

    def check_surface(self, roughness_um):
        ok = roughness_um <= self.spec["max_roughness_um"]
        self.results["surface"] = {
            "roughness": roughness_um,
            "limit": self.spec["max_roughness_um"], "pass": ok
        }
        if not ok:
            self.defects.append("Surface too rough")
        return ok

    def generate_report(self):
        print("=" * 55)
        print("    CASTING QUALITY INSPECTION REPORT")
        print("=" * 55)
        all_pass = len(self.defects) == 0
        for test_name, data in self.results.items():
            status = "PASS" if data["pass"] else "FAIL"
            print(f"  {test_name.upper():<16} [{status}]")
            for key, val in data.items():
                if key != "pass":
                    print(f"    {key}: {val}")
        print("-" * 55)
        verdict = "ACCEPTED" if all_pass else "REJECTED"
        print(f"  OVERALL VERDICT: {verdict}")
        if self.defects:
            print(f"  Defects found: {len(self.defects)}")
            for d in self.defects:
                print(f"    - {d}")
        print("=" * 55)
        return all_pass

# Define specification for Swamimalai sculpture bronze
spec = {
    "tin_min": 8, "tin_max": 12,
    "lead_max": 1.0, "impurity_max": 0.5,
    "max_porosity_pct": 2.0,
    "hardness_min": 80, "hardness_max": 150,
    "max_deviation_mm": 2.0,
    "max_roughness_um": 25,
}

# Inspect three castings
castings = [
    {"name": "Nataraja #47 (Good casting)",
     "tin": 10.2, "lead": 0.3, "impurities": 0.1,
     "density": 8650, "hardness": 115,
     "deviations": [0.5, -0.8, 1.1, -0.3, 0.7],
     "roughness": 12},
    {"name": "Ganesha #23 (Porosity issue)",
     "tin": 9.8, "lead": 0.5, "impurities": 0.2,
     "density": 8300, "hardness": 95,
     "deviations": [0.3, -0.5, 0.9, -0.2, 0.4],
     "roughness": 15},
    {"name": "Lakshmi #12 (Multiple issues)",
     "tin": 13.5, "lead": 1.5, "impurities": 0.8,
     "density": 8100, "hardness": 165,
     "deviations": [1.5, -2.5, 3.1, -1.8, 2.2],
     "roughness": 35},
]

for casting in castings:
    print(f"\\nInspecting: {casting['name']}")
    inspector = CastingInspector(spec)
    inspector.check_composition(casting["tin"], casting["lead"], casting["impurities"])
    inspector.check_porosity(casting["density"], 8800)
    inspector.check_hardness(casting["hardness"])
    inspector.check_dimensions(casting["deviations"])
    inspector.check_surface(casting["roughness"])
    inspector.generate_report()`,
      challenge: 'Add an acoustic test: given the casting mass and a measured resonant frequency, calculate the "acoustic quality factor." Compare it to the theoretical frequency for a defect-free casting of the same geometry. A deviation of more than 5% indicates internal defects.',
      successHint: 'You just built a quality management system — the same type of software used in aerospace, automotive, and medical device manufacturing. Every casting, forging, and machined part goes through a similar multi-parameter inspection process before it can be used.',
    },
    {
      title: 'Complete lost-wax casting simulator — from alloy to finished piece',
      concept: `In this final exercise, you will integrate everything from all four levels into a single end-to-end casting simulator. Starting from the alloy composition, it will: calculate the melting point, simulate furnace heating, model mould filling, predict solidification using Chvorinov's rule, estimate the microstructure (grain size, dendrite spacing), calculate porosity, and run a quality inspection.

This is a true capstone: every function calls on concepts you learned earlier. The simulator takes a set of process parameters (alloy composition, pour temperature, cooling rate, mould geometry) and predicts the final casting quality. Change any parameter and the entire chain of consequences propagates through the model.

This is how real casting simulation works — thousands of interconnected physics models, each feeding into the next. You have built a simplified but complete version.

*Systems engineering is the discipline of designing complex systems where everything is connected. Changing one parameter (say, tin content) affects melting point, fluidity, solidification time, grain structure, hardness, and final quality. A good simulator captures all these connections.*`,
      analogy: 'Think of a Rube Goldberg machine where each step triggers the next. The alloy composition sets the melting point, which sets the furnace time, which affects superheat, which affects fluidity, which determines whether the mould fills, which determines the quality. Miss any link in the chain and the prediction is wrong.',
      storyConnection: 'A Swamimalai master holds all of this knowledge in his head — the interconnected web of composition, temperature, timing, and quality. When he adjusts the tin content by 1%, he instinctively knows it will change the melting point, the fluidity, the surface colour, and the finishing difficulty. This simulator makes that implicit knowledge explicit and quantitative.',
      checkQuestion: 'If you increase the pour temperature by 50 degrees C, what downstream effects propagate through the process?',
      checkAnswer: 'Higher pour temperature means: more superheat, better fluidity (fills thin sections more easily), longer solidification time (coarser dendrites), higher charcoal consumption, more dissolved gas (higher gas porosity risk), and greater thermal shock on the mould. It is a trade-off: better filling but coarser microstructure and more gas.',
      codeIntro: 'Run a complete end-to-end lost-wax casting simulation.',
      code: `import numpy as np

def full_casting_simulation(tin_pct, pour_temp_C, cooling_rate_Cs,
                            mould_preheat_C, section_thickness_cm,
                            charcoal_rate_kgh, bronze_mass_kg):
    """Complete lost-wax casting simulation from alloy to quality report."""

    report = {"parameters": {}, "predictions": {}, "quality": {}}

    # Store input parameters
    report["parameters"] = {
        "tin_pct": tin_pct, "pour_temp": pour_temp_C,
        "cooling_rate": cooling_rate_Cs, "mould_preheat": mould_preheat_C,
        "thickness": section_thickness_cm, "mass": bronze_mass_kg,
    }

    # 1. Alloy properties from composition
    melt_point = 1085 - 10.5 * tin_pct
    hardness_base = 45 + 6.5 * tin_pct
    superheat = pour_temp_C - melt_point

    # 2. Fluidity estimate
    fluidity_cm = 20 + 0.5 * superheat - 0.3 * tin_pct

    # 3. Dendrite arm spacing
    das_um = 50 * cooling_rate_Cs ** (-0.33)

    # 4. Grain size
    grain_um = 1.5 * das_um

    # 5. Solidification time (Chvorinov's)
    modulus_cm = section_thickness_cm / 6  # simplified for plate
    B = 150  # s/cm^2 approximate
    solidif_time_s = B * modulus_cm ** 2

    # 6. Porosity estimate
    shrinkage_poros = 0.05 * (1 - np.exp(-section_thickness_cm / 5))
    gas_poros = 0.001 * superheat / 50  # higher superheat = more gas
    total_poros = (shrinkage_poros + gas_poros) * 100

    # 7. Mechanical properties
    strength_mpa = 200 + 5 * tin_pct + 600 / np.sqrt(grain_um)
    strength_mpa *= (1 - 0.07 * total_poros)
    hardness_hv = strength_mpa * 0.35

    # 8. Energy budget
    energy_heat = bronze_mass_kg * 0.38 * (melt_point - 25)  # kJ
    energy_melt = bronze_mass_kg * 190  # kJ
    energy_super = bronze_mass_kg * 0.38 * superheat  # kJ
    total_energy = energy_heat + energy_melt + energy_super
    charcoal_kg = total_energy / (29000 * 0.15)

    report["predictions"] = {
        "melting_point_C": melt_point,
        "superheat_C": superheat,
        "fluidity_cm": fluidity_cm,
        "DAS_um": das_um,
        "grain_size_um": grain_um,
        "solidif_time_min": solidif_time_s / 60,
        "porosity_pct": total_poros,
        "strength_MPa": strength_mpa,
        "hardness_HV": hardness_hv,
        "charcoal_kg": charcoal_kg,
    }

    # 9. Quality assessment
    checks = {
        "fluidity": fluidity_cm > 30,
        "porosity": total_poros < 2.0,
        "hardness": 80 < hardness_hv < 160,
        "strength": strength_mpa > 200,
    }
    report["quality"] = checks

    return report

# Run three scenarios
scenarios = [
    {"name": "Traditional Swamimalai recipe",
     "tin": 10, "pour": 1050, "cool": 3, "preheat": 700,
     "thick": 0.6, "charcoal": 3, "mass": 5},
    {"name": "High-tin bell metal",
     "tin": 22, "pour": 1000, "cool": 5, "preheat": 600,
     "thick": 1.0, "charcoal": 4, "mass": 8},
    {"name": "Fast-cooled thin sculpture",
     "tin": 8, "pour": 1100, "cool": 15, "preheat": 700,
     "thick": 0.3, "charcoal": 2, "mass": 2},
]

for scenario in scenarios:
    print(f"\\n{'='*55}")
    print(f"  SCENARIO: {scenario['name']}")
    print(f"{'='*55}")

    r = full_casting_simulation(
        scenario["tin"], scenario["pour"], scenario["cool"],
        scenario["preheat"], scenario["thick"],
        scenario["charcoal"], scenario["mass"]
    )

    print("\\n  INPUT PARAMETERS:")
    for k, v in r["parameters"].items():
        print(f"    {k}: {v}")

    print("\\n  PREDICTIONS:")
    for k, v in r["predictions"].items():
        if isinstance(v, float):
            print(f"    {k}: {v:.1f}")
        else:
            print(f"    {k}: {v}")

    print("\\n  QUALITY CHECKS:")
    all_pass = True
    for k, v in r["quality"].items():
        status = "PASS" if v else "FAIL"
        if not v:
            all_pass = False
        print(f"    {k}: {status}")

    verdict = "ACCEPTED" if all_pass else "NEEDS REVIEW"
    print(f"\\n  VERDICT: {verdict}")`,
      challenge: 'Add an optimization loop: try 100 random combinations of tin percentage (8-12%), pour temperature (1000-1100 degrees C), and cooling rate (1-10 degrees C/s). Find the combination that maximizes strength while keeping all quality checks passing. Print the top 5 results.',
      successHint: 'You have built a complete digital twin of the Swamimalai lost-wax casting process. This is exactly what modern Industry 4.0 foundries do — they simulate the entire process digitally before committing expensive materials to a physical pour. You have bridged 4000 years of traditional knowledge with computational engineering.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Simulate the complete lost-wax casting process</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These capstone exercises build a complete casting process simulator from furnace to quality inspection.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {loadProgress}</>) : (<><Sparkles className="w-5 h-5" /> Load Python</>)}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson
            key={i}
            id={`L4-${i + 1}`}
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
