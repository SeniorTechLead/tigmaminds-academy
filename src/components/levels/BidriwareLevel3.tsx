import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function BidriwareLevel3() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Galvanic series — predicting corrosion in real environments',
      concept: `The **galvanic series** ranks metals by their actual corrosion potential in a specific environment (usually seawater). Unlike the standard electrode potential series (measured under ideal lab conditions), the galvanic series accounts for real-world factors like oxide films, dissolved oxygen, and salt concentration.

Some metals behave differently in practice than their E0 would suggest. Titanium, for example, has a very negative E0 (-1.63 V) but is extremely corrosion-resistant in seawater because it forms a tough, self-healing oxide film (**passivation**). Stainless steel similarly passivates, making it far more noble than plain iron despite similar base chemistry.

For Bidriware preservation, the galvanic series tells us which environments are safe (dry indoor air — minimal electrolyte) and which are dangerous (humid coastal air with salt — aggressive electrolyte). The zinc-silver potential difference is always present, but corrosion only occurs when an electrolyte completes the circuit.

📚 *Passivation: some reactive metals form a thin, dense, adherent oxide layer that protects the underlying metal from further corrosion. Aluminum, titanium, chromium, and stainless steel all passivate. The oxide layer is typically only nanometres thick but enormously effective.*`,
      analogy: 'Imagine a knight in armor (passivated metal). The armor (oxide layer) protects the person inside (base metal) even though the person is vulnerable without it. If the armor is scratched (oxide damaged), it magically repairs itself (self-healing passivation). But in extremely corrosive environments (strong acid = dragon fire), even the armor fails.',
      storyConnection: 'The black oxide layer on Bidriware zinc is a form of passivation. Once formed, it protects the zinc from further corrosion. This is why the darkening step is not just cosmetic — it is a protective treatment. Without it, the zinc would continue to corrode unevenly. The traditional Bidar soil treatment creates a particularly stable and adherent oxide.',
      checkQuestion: 'Aluminum has E0 = -1.66 V (very reactive) but kitchen aluminum foil does not corrode in air. Why?',
      checkAnswer: 'Aluminum instantly forms a thin, dense Al2O3 oxide layer (3-5 nm) when exposed to air. This passive film is chemically inert and self-healing — if scratched, it reforms in milliseconds. The passivation effectively makes aluminum behave like a noble metal in normal conditions.',
      codeIntro: 'Model passivation and predict corrosion rates with and without protective oxide layers.',
      code: `import numpy as np

# Galvanic series and passivation modeling

# Galvanic series in seawater (practical potentials, V vs SCE)
galvanic_seawater = {
    "Magnesium": -1.60, "Zinc": -1.03, "Aluminum (bare)": -0.76,
    "Mild steel": -0.61, "Cast iron": -0.61, "Lead": -0.50,
    "Tin": -0.42, "Brass": -0.30, "Copper": -0.22,
    "Bronze": -0.24, "Stainless 304 (active)": -0.46,
    "Stainless 304 (passive)": -0.08, "Titanium": -0.05,
    "Silver": -0.13, "Gold": 0.18, "Platinum": 0.22,
}

print("=== Galvanic Series in Seawater ===")
print(f"{'Metal':<30} {'Potential (V)':>13} {'Character'}")
print("-" * 55)

sorted_metals = sorted(galvanic_seawater.items(), key=lambda x: x[1])
for name, E in sorted_metals:
    if E < -0.8:
        char = "Anodic (corrodes)"
    elif E < -0.3:
        char = "Moderately anodic"
    elif E < 0:
        char = "Mildly cathodic"
    else:
        char = "Noble (protected)"
    print(f"{name:<30} {E:>+12.2f} {char}")

print()
# Passivation model
print("=== Passivation: Oxide Growth Model ===")
# Oxide thickness follows logarithmic law: d = A * ln(1 + B*t)
# A and B depend on metal and environment

def oxide_thickness(time_hours, A, B):
    """Logarithmic oxide growth (nm)."""
    return A * np.log(1 + B * time_hours)

metals_oxide = {
    "Aluminum (passive)": (3.0, 0.5),    # grows quickly, then stabilizes
    "Titanium (passive)": (4.0, 0.3),
    "Zinc (darkened)": (50.0, 0.1),       # thicker but less protective
    "Iron (rust)": (100.0, 0.2),          # grows continuously
    "Stainless steel": (2.0, 0.8),        # thin but very stable
}

times = [0.01, 0.1, 1, 10, 100, 1000, 8760]  # hours (up to 1 year)

print(f"{'Metal':<25}", end="")
for t in [1, 100, 8760]:
    print(f" {t:>7}h", end="")
print(" (oxide thickness in nm)")
print("-" * 55)

for name, (A, B) in metals_oxide.items():
    print(f"{name:<25}", end="")
    for t in [1, 100, 8760]:
        d = oxide_thickness(t, A, B)
        print(f" {d:>7.1f}", end="")
    print()

print()
# Corrosion rate with and without passivation
print("=== Corrosion Rate: Passivated vs Bare ===")

def corrosion_rate(E_diff, oxide_resistance, electrolyte_conductivity=1.0):
    """Simplified corrosion rate (mm/year)."""
    # Higher E_diff = more driving force
    # Higher oxide resistance = more protection
    # Higher conductivity = faster corrosion
    base = 0.5 * E_diff * electrolyte_conductivity
    return base / (1 + oxide_resistance)

print(f"{'Scenario':<35} {'Rate (mm/yr)':>13} {'Years to 1mm':>13}")
print("-" * 63)

scenarios = [
    ("Zn-Ag in dry air", 1.56, 100, 0.01),
    ("Zn-Ag in humid air", 1.56, 50, 0.1),
    ("Zn-Ag darkened, dry air", 1.56, 500, 0.01),
    ("Zn-Ag darkened, humid air", 1.56, 200, 0.1),
    ("Zn-Ag in seawater", 1.56, 10, 1.0),
    ("Fe-Cu in seawater", 0.78, 5, 1.0),
    ("Steel-Ti in seawater", 0.56, 50, 1.0),
]

for name, E_diff, oxide_r, cond in scenarios:
    rate = corrosion_rate(E_diff, oxide_r, cond)
    years = 1.0 / rate if rate > 0 else 9999
    print(f"{name:<35} {rate:>11.4f} {years:>11.0f}")

print()
print("The darkening treatment increases oxide resistance by ~10x,")
print("extending Bidriware lifespan from decades to centuries.")`,
      challenge: 'Why does stainless steel have two entries in the galvanic series — active (-0.46V) and passive (-0.08V)? Research what breaks the passive film on stainless steel. (Hint: chloride ions from salt can penetrate the oxide, causing "pitting corrosion.")',
      successHint: 'Galvanic series and passivation are the core tools of corrosion engineering. Every bridge, ship, pipeline, and implant is designed using these principles. The passivation of titanium, for example, is why it is used for hip replacements — the oxide layer makes it biocompatible inside the human body.',
    },
    {
      title: 'Electroplating calculations — thickness, time, and current efficiency',
      concept: `**Electroplating** uses electrical current to deposit a thin layer of metal onto a surface. The process is the reverse of galvanic corrosion — instead of the anode dissolving spontaneously, an external power supply forces the reaction.

The key parameters are: **current density** (amps per unit area, typically 1-10 A/dm^2), **plating time**, and **current efficiency** (what fraction of the current actually deposits metal vs producing side reactions like hydrogen gas). Efficiency is typically 90-98% for silver and 85-95% for zinc.

The deposit thickness is: **d = (M * j * t * eta) / (n * F * rho)**, where j is current density (A/m^2), t is time (s), eta is current efficiency, and rho is deposit density (g/cm^3).

📚 *Current efficiency = (actual mass deposited / theoretical mass) * 100%. Side reactions (hydrogen evolution, oxygen evolution) consume current without depositing useful metal. Lower pH, higher current density, and impure electrolytes reduce efficiency.*`,
      analogy: 'Electroplating is like spray-painting with atoms. The current "sprays" metal atoms from the anode through the solution onto the cathode (your workpiece). Current density is like the spray pressure — too low and coverage is patchy, too high and the finish is rough. Time determines thickness — longer spray means thicker coating.',
      storyConnection: 'While traditional Bidriware uses mechanical silver inlay (hammering wire into grooves), electroplating could deposit a perfectly uniform silver layer. However, electroplated silver lacks the depth and texture of hammered inlay — a tradeoff between manufacturing efficiency and artistic quality that the best Bidriware workshops have chosen to resolve in favor of tradition.',
      checkQuestion: 'To plate 5 micrometres of silver (density 10.49 g/cm^3) on 200 cm^2 at 95% efficiency with current density 2 A/dm^2, how long does it take?',
      checkAnswer: 'Mass = volume * density = (200 * 5e-4) * 10.49 = 1.049 g. Current = 2 A/dm^2 * (200/100) dm^2 = 4 A. Time = (1.049 * 1 * 96485) / (107.87 * 4 * 0.95) = 101230 / 410 = 247 s = 4.1 minutes.',
      codeIntro: 'Design an electroplating process for silver coating with thickness and cost optimization.',
      code: `import numpy as np

# Electroplating design calculations

F = 96485  # C/mol

def plating_design(target_thickness_um, area_cm2, metal_props,
                   current_density_A_dm2, efficiency=0.95):
    """Complete electroplating calculation."""
    M = metal_props["M"]
    n = metal_props["n"]
    rho = metal_props["density"]
    cost_kg = metal_props["cost_kg"]

    # Convert units
    area_dm2 = area_cm2 / 100
    thickness_cm = target_thickness_um * 1e-4

    # Mass to deposit
    volume_cm3 = area_cm2 * thickness_cm
    mass_g = volume_cm3 * rho

    # Current
    current_A = current_density_A_dm2 * area_dm2

    # Time
    time_s = (mass_g * n * F) / (M * current_A * efficiency)

    # Energy
    cell_voltage = 1.5  # typical for silver plating
    energy_wh = cell_voltage * current_A * time_s / 3600

    # Cost
    metal_cost = mass_g * cost_kg / 1000
    energy_cost = energy_wh * 0.10 / 1000  # $0.10/kWh

    return {
        "mass_g": mass_g, "current_A": current_A,
        "time_min": time_s / 60, "energy_wh": energy_wh,
        "metal_cost": metal_cost, "energy_cost": energy_cost,
        "total_cost": metal_cost + energy_cost,
    }

silver = {"M": 107.87, "n": 1, "density": 10.49, "cost_kg": 800}
gold = {"M": 196.97, "n": 3, "density": 19.32, "cost_kg": 60000}
nickel = {"M": 58.69, "n": 2, "density": 8.91, "cost_kg": 15}

print("=== Electroplating Design Calculator ===")
print("Surface area: 200 cm^2 (typical Bidriware vase)")
print()

area = 200  # cm^2

# Compare thicknesses for silver
print("--- Silver plating at 2 A/dm^2, 95% efficiency ---")
print(f"{'Thickness':>10} {'Mass':>8} {'Time':>8} {'Metal $':>8} {'Energy $':>9} {'Total $':>8}")
print("-" * 54)

for thick in [1, 2, 5, 10, 20, 50]:
    r = plating_design(thick, area, silver, 2.0)
    print(f"{thick:>8} um {r['mass_g']:>6.2f}g {r['time_min']:>6.1f}m "
          f"{r['metal_cost']:>6.2f} {r['energy_cost']:>7.4f} {r['total_cost']:>6.2f}")

print()
# Compare metals at 10 um
print("--- 10 um coating comparison ---")
print(f"{'Metal':<10} {'Mass':>8} {'Time':>8} {'Cost':>8}")
print("-" * 36)

for name, props in [("Silver", silver), ("Gold", gold), ("Nickel", nickel)]:
    r = plating_design(10, area, props, 2.0)
    print(f"{name:<10} {r['mass_g']:>6.2f}g {r['time_min']:>6.1f}m {r['total_cost']:>6.2f}")

print()
# Current density optimization
print("=== Current Density vs Quality ===")
print(f"{'j (A/dm2)':<12} {'Time (min)':>10} {'Deposit quality'}")
print("-" * 45)

for j in [0.5, 1.0, 2.0, 3.0, 5.0, 10.0, 20.0]:
    r = plating_design(10, area, silver, j)
    if j < 1:
        quality = "excellent (slow, uniform)"
    elif j < 3:
        quality = "good (standard)"
    elif j < 8:
        quality = "fair (slightly rough)"
    else:
        quality = "poor (rough, porous)"
    print(f"{j:<12.1f} {r['time_min']:>10.1f} {quality}")`,
      challenge: 'Design a gold-plating process for a luxury Bidriware piece: 0.5 micrometre gold on 200 cm^2. What is the gold cost? How does it compare to traditional gold leaf application? (Gold leaf is about 0.1 um thick and costs about $5 per 100 cm^2.)',
      successHint: 'Electroplating design is used in electronics manufacturing (gold contacts on connectors), automotive (chrome bumpers), aerospace (nickel coatings on turbine blades), and jewelry (gold and silver plating). You just designed the same process used in factories worldwide.',
    },
    {
      title: 'Pourbaix diagrams — mapping corrosion conditions',
      concept: `A **Pourbaix diagram** (potential-pH diagram) maps the thermodynamically stable forms of a metal as a function of electrode potential (vertical axis) and pH (horizontal axis). It shows regions where the metal is: (1) **immune** (stable as metal), (2) **corroding** (dissolving as ions), or (3) **passive** (protected by an oxide layer).

For zinc: at low pH and moderate potential, zinc dissolves as Zn^2+ (corrosion). At high pH, it dissolves as ZnO2^2- (also corrosion). In between, ZnO forms (passivation). Below a certain potential, metallic zinc is stable (immunity). The diagram tells you exactly which conditions are safe and which cause corrosion.

Pourbaix diagrams are essential for corrosion engineering: they tell you whether a protective coating will work, whether cathodic protection is needed, and how pH changes affect corrosion rates. For Bidriware, the diagram shows that keeping pH near neutral (6-8) and the environment dry puts zinc in the passive region — the safest condition.

📚 *Reading a Pourbaix diagram: the vertical axis is potential (higher = more oxidizing conditions). The horizontal axis is pH (left = acidic, right = alkaline). Lines separate stable regions. The water stability region (between H2 and O2 evolution lines) shows the conditions possible in aqueous solutions.*`,
      analogy: 'A Pourbaix diagram is like a weather map for corrosion. Just as a weather map shows regions of sun, rain, and snow based on temperature and humidity, a Pourbaix diagram shows regions of immunity, corrosion, and passivation based on potential and pH. You want to keep your metal in the "sunny" (immune or passive) region.',
      storyConnection: 'A Bidriware conservator must understand the Pourbaix diagram for zinc to preserve antique pieces. Cleaning solutions must have the right pH — too acidic and the zinc corrodes; too alkaline and it also dissolves (zinc is amphoteric). The ideal cleaning solution is near neutral pH with a mild reducing agent to keep the zinc in the passive or immune region.',
      checkQuestion: 'Zinc is amphoteric — it dissolves in both acid (as Zn^2+) and base (as ZnO2^2-). At what pH range is zinc passivated (protected by ZnO)?',
      checkAnswer: 'Approximately pH 8-12. Below pH 8, zinc dissolves as Zn^2+. Above pH 12, it dissolves as zincate ZnO2^2-. Between 8 and 12, a protective ZnO layer forms. This is why slightly alkaline conditions are best for zinc preservation.',
      codeIntro: 'Construct a simplified Pourbaix diagram for zinc and identify safe storage conditions.',
      code: `import numpy as np

# Simplified Pourbaix diagram for zinc

R = 8.314
T = 298.15
F_const = 96485
n = 2

def nernst_line(E0, n_e, n_H, pH, conc=1e-6):
    """Calculate Nernst potential as function of pH.
    For reaction involving n_H protons and n_e electrons.
    """
    return E0 - (0.05916 * n_H / n_e) * pH - (0.05916 / n_e) * np.log10(conc)

# Key equilibrium lines for zinc Pourbaix diagram
pH_range = np.linspace(-2, 16, 100)

# Line 1: Zn/Zn2+ (immunity/corrosion boundary)
# Zn -> Zn2+ + 2e-
E_zn_zn2 = -0.762 - (0.05916/2) * np.log10(1e-6) * np.ones_like(pH_range)

# Line 2: Zn2+/ZnO (corrosion/passivation boundary)
# Zn2+ + H2O -> ZnO + 2H+ (occurs at ~pH 8 for [Zn2+]=1e-6 M)
pH_zno = 8.0  # approximate
E_zno = -0.762 + 0.05916 * (pH_range - pH_zno) * 0  # horizontal at this pH

# Water stability lines
E_hydrogen = 0 - 0.05916 * pH_range  # H2O/H2
E_oxygen = 1.229 - 0.05916 * pH_range  # O2/H2O

print("=== Zinc Pourbaix Diagram (text representation) ===")
print()
print("Potential (V) vs pH")
print()

# Create a text-based representation
pH_points = [0, 2, 4, 6, 7, 8, 10, 12, 14]
E_points = [0.5, 0, -0.5, -0.76, -1.0, -1.2, -1.5]

print(f"{'E (V)':>8} |", end="")
for pH in pH_points:
    print(f" pH{pH:>2}", end="")
print()
print("-" * 55)

for E in E_points:
    print(f"{E:>+7.2f}  |", end="")
    for pH in pH_points:
        # Determine region
        E_imm = -0.762 - (0.05916/2) * np.log10(1e-6)  # ~ -0.94 V
        if E < E_imm:
            region = " Imm"  # Immunity
        elif pH < 8:
            region = " Cor"  # Corrosion (Zn2+)
        elif pH > 12:
            region = " Cor"  # Corrosion (ZnO2^2-)
        elif E > -0.5:
            region = " Pas"  # Passivation (ZnO)
        else:
            region = " Pas"
        print(f"{region:>5}", end="")
    print()

print()
print("Imm = Immunity (Zn metal stable)")
print("Cor = Corrosion (Zn dissolves as ions)")
print("Pas = Passivation (ZnO protective layer)")

print()
print("=== Bidriware Storage Recommendations ===")
environments = [
    ("Museum case (pH 7, dry)", 7, -0.3, "Passive"),
    ("Humid room (pH 7)", 7, -0.2, "Passive"),
    ("Acid rain exposure (pH 4)", 4, -0.1, "CORRODING"),
    ("Alkaline cleaner (pH 13)", 13, -0.3, "CORRODING"),
    ("Seawater (pH 8.1)", 8.1, -0.1, "Borderline"),
    ("Neutral rinse (pH 7)", 7, -0.4, "Passive"),
]

print(f"{'Environment':<30} {'pH':>4} {'Potential':>10} {'Status':<12}")
print("-" * 58)
for name, pH, E, status in environments:
    safe = "SAFE" if "Passive" in status or "Immun" in status else "DANGER"
    print(f"{name:<30} {pH:>4} {E:>+9.2f} V {status:<12} [{safe}]")

print()
print("Keep Bidriware at pH 6-10 and low humidity for longest life.")`,
      challenge: 'Construct a simplified Pourbaix diagram for silver. Silver has only two regions: Ag metal (immune) and Ag+ (corroding) — it does not form a protective oxide in most conditions. At what potential does silver start to corrode? How does this explain silver natural tarnish resistance?',
      successHint: 'Pourbaix diagrams are the "maps" of corrosion engineering. Every pipeline, bridge, ship, and implant is designed with Pourbaix diagram consultation. The International Space Station uses Pourbaix diagrams to manage corrosion of its aluminum structure in the unique space environment.',
    },
    {
      title: 'Passivation kinetics — how protective layers form and fail',
      concept: `Passivation is not just a thermodynamic phenomenon (will an oxide form?) but also a **kinetic** one (how fast does it form, how thick does it grow, and when does it break down?). The kinetics determine whether a metal is practically corrosion-resistant or only theoretically so.

Oxide growth typically follows a **logarithmic law** at low temperatures: d = A * ln(1 + B*t), meaning the oxide grows quickly at first, then progressively slower as the thickening film blocks further oxygen access. At high temperatures, growth follows a **parabolic law**: d^2 = k*t.

**Passive film breakdown** (the onset of corrosion) occurs when aggressive ions (especially chloride Cl^-) penetrate or disrupt the oxide layer. The breakdown potential is the voltage above which the passive film fails. For stainless steel, chloride-induced **pitting corrosion** is the most common failure mode.

📚 *Logarithmic growth: d = A*ln(1 + Bt) — self-limiting, produces thin but stable films. Parabolic growth: d^2 = kt — oxide grows continuously, becomes thick. Linear growth: d = kt — oxide is porous and non-protective (like iron rust).*`,
      analogy: 'Passivation is like applying sunscreen. The first layer of sunscreen (thin oxide) provides excellent protection. But if you scratch it off (film breakdown) or swim in the ocean (aggressive chloride ions), you get sunburned (corrosion). The key is maintaining the protective layer.',
      storyConnection: 'The traditional Bidriware darkening creates a thick, well-adhered oxide/sulfide layer on the zinc. This layer is the artwork protective "sunscreen." Museum conservators periodically apply microcrystalline wax to Bidriware pieces — this creates a second barrier that prevents moisture and aggressive ions from reaching the oxide layer, extending the piece lifespan by centuries.',
      checkQuestion: 'An oxide layer grows logarithmically with A=5 nm and B=0.1/hour. How thick is it after 1 hour? After 1000 hours? After 10,000 hours?',
      checkAnswer: 'After 1 hour: 5*ln(1.1) = 0.48 nm. After 1000 hours: 5*ln(101) = 23.1 nm. After 10,000 hours: 5*ln(1001) = 34.5 nm. The film grows very slowly after the initial period — the growth rate at 10,000 hours is tiny.',
      codeIntro: 'Model oxide growth kinetics and simulate passive film breakdown under aggressive conditions.',
      code: `import numpy as np

# Passivation kinetics — oxide growth and breakdown

def logarithmic_growth(t, A, B):
    """Thin film regime: self-limiting growth."""
    return A * np.log(1 + B * t)

def parabolic_growth(t, k):
    """High temperature: continuous growth."""
    return np.sqrt(k * t)

def linear_growth(t, k):
    """Non-protective oxide: constant rate."""
    return k * t

# Compare growth laws
print("=== Oxide Growth Law Comparison ===")
print("(thickness in nm after given time)")
print()

times = [0.1, 1, 10, 100, 1000, 10000]  # hours

print(f"{'Time (h)':<12}", end="")
for law in ["Logarithmic", "Parabolic", "Linear"]:
    print(f" {law:>13}", end="")
print()
print("-" * 52)

for t in times:
    d_log = logarithmic_growth(t, 3.0, 0.5)
    d_par = parabolic_growth(t, 0.01)
    d_lin = linear_growth(t, 0.005)
    print(f"{t:<12.1f} {d_log:>11.2f} nm {d_par:>11.2f} nm {d_lin:>11.2f} nm")

print()
# Bidriware oxide model
print("=== Bidriware Zinc Oxide Layer ===")
print("Darkening treatment creates initial thick oxide")
print()

# Initial treatment creates ~500 nm oxide instantly
initial_oxide = 500  # nm from darkening treatment

# Then natural logarithmic growth in air
A_nat = 2.0  # nm
B_nat = 0.01  # per hour

years = [0, 0.1, 1, 5, 10, 50, 100, 500]
print(f"{'Years':<10} {'Total oxide (nm)':>16} {'Growth rate':>14}")
print("-" * 42)

for y in years:
    hours = y * 8760
    natural_growth = logarithmic_growth(hours, A_nat, B_nat) if hours > 0 else 0
    total = initial_oxide + natural_growth
    rate = A_nat * B_nat / (1 + B_nat * max(hours, 0.01)) if hours > 0 else 0
    print(f"{y:<10} {total:>14.0f} {rate:>12.4f} nm/h")

print()
# Breakdown simulation
print("=== Passive Film Breakdown ===")
print("Effect of chloride concentration on breakdown potential")
print()

def breakdown_potential(cl_concentration_M, E_pit_0=-0.2, A_pit=0.06):
    """Simplified pitting potential vs chloride concentration."""
    if cl_concentration_M <= 0:
        return E_pit_0
    return E_pit_0 - A_pit * np.log10(cl_concentration_M)

print(f"{'[Cl-] (M)':<12} {'Breakdown E':>12} {'Environment'}")
print("-" * 50)

for cl, env in [(0.001, "freshwater"), (0.01, "brackish"), (0.1, "mild salt"),
                (0.5, "seawater"), (1.0, "concentrated"), (3.0, "brine")]:
    E_pit = breakdown_potential(cl)
    safe = "oxide stable" if E_pit < -0.4 else "risk of pitting"
    print(f"{cl:<12.3f} {E_pit:>+11.3f} V {env:<16} [{safe}]")

print()
print("Higher chloride = lower breakdown potential = easier pitting")
print("This is why coastal Bidriware needs extra protection (wax coating)")`,
      challenge: 'A museum wants to guarantee a Bidriware piece survives 1000 years. If the oxide layer must remain above 200 nm to be protective, and erosion removes 0.5 nm/year, will the darkened oxide (initial 500 nm + logarithmic growth) last 1000 years? Model it year by year.',
      successHint: 'Passivation kinetics govern the lifetime of every metallic structure. Aircraft aluminum, stainless steel implants, nuclear reactor containment, and architectural bronze all rely on understanding how passive films grow, heal, and break down. You just modeled the same physics that determines whether a bridge lasts 50 years or 200.',
    },
    {
      title: 'Corrosion rate prediction — from lab to lifespan',
      concept: `Predicting the corrosion rate of a real structure requires combining electrochemistry (driving force), kinetics (reaction speed), mass transport (how fast ions move), and environment (temperature, humidity, pollutants). The standard corrosion rate unit is **mm/year** or **mpy** (mils per year, where 1 mil = 0.001 inch).

The **Tafel equation** relates current density to overpotential: i = i0 * exp(eta / beta), where i0 is the exchange current density, eta is the overpotential (deviation from equilibrium), and beta is the Tafel slope. The corrosion current density i_corr occurs where the anodic and cathodic Tafel lines intersect.

From i_corr, the corrosion rate is: **CR (mm/yr) = 3.27 * i_corr * M / (n * rho)**, where i_corr is in microA/cm^2, M is molar mass, n is valence, and rho is density.

📚 *Tafel analysis: plot log(current) vs potential. The anodic branch (metal dissolving) and cathodic branch (oxygen or hydrogen reduction) form two straight lines. Their intersection gives the corrosion potential E_corr and corrosion current i_corr — the two most important parameters in corrosion science.*`,
      analogy: 'Tafel analysis is like finding where two hills meet in a valley. One hill represents the dissolving tendency of the metal (anodic). The other represents the reduction tendency of the environment (cathodic). The valley floor (their intersection) is the natural corrosion rate — the balance point between the two opposing reactions.',
      storyConnection: 'A corrosion engineer studying Bidriware preservation would measure i_corr for the zinc-silver couple in different environments using Tafel analysis. This gives a quantitative prediction: "In this museum humidity, the zinc will lose 0.001 mm per year, so in 500 years it will lose 0.5 mm — acceptable." Without such predictions, conservation is guesswork.',
      checkQuestion: 'If the corrosion current density of zinc in humid air is 5 microA/cm^2, what is the corrosion rate in mm/year? (M=65.38, n=2, rho=7.13 g/cm^3)',
      checkAnswer: 'CR = 3.27 * 5 * 65.38 / (2 * 7.13) = 3.27 * 326.9 / 14.26 = 1069 / 14.26 = 74.9 * 10^-3 = 0.075 mm/year. At this rate, 1 mm of zinc would be consumed in about 13 years.',
      codeIntro: 'Calculate corrosion rates from electrochemical data and predict structural lifetimes.',
      code: `import numpy as np

# Corrosion rate prediction

def tafel_current(E, E_corr, i_corr, beta_a, beta_c):
    """Total current from mixed potential theory (Butler-Volmer)."""
    eta = E - E_corr
    i_anodic = i_corr * np.exp(2.303 * eta / beta_a)
    i_cathodic = -i_corr * np.exp(-2.303 * eta / beta_c)
    return i_anodic + i_cathodic

def corrosion_rate_mm_yr(i_corr_uA_cm2, M, n, rho):
    """Convert corrosion current to penetration rate."""
    return 3.27e-3 * i_corr_uA_cm2 * M / (n * rho)

def lifetime_years(thickness_mm, rate_mm_yr, max_loss_fraction=0.1):
    """Time until max_loss_fraction of thickness is consumed."""
    max_loss = thickness_mm * max_loss_fraction
    return max_loss / rate_mm_yr if rate_mm_yr > 0 else float('inf')

# Corrosion rates for different metals in different environments
print("=== Corrosion Rates in Different Environments ===")
print()

metals = {
    "Zinc": {"M": 65.38, "n": 2, "rho": 7.13},
    "Iron": {"M": 55.85, "n": 2, "rho": 7.87},
    "Copper": {"M": 63.55, "n": 2, "rho": 8.96},
    "Silver": {"M": 107.87, "n": 1, "rho": 10.49},
}

# i_corr in uA/cm^2 for each metal in each environment
environments = {
    "Dry indoor": {"Zinc": 0.1, "Iron": 0.5, "Copper": 0.01, "Silver": 0.001},
    "Humid indoor": {"Zinc": 2, "Iron": 10, "Copper": 0.1, "Silver": 0.01},
    "Urban outdoor": {"Zinc": 10, "Iron": 50, "Copper": 1, "Silver": 0.1},
    "Marine": {"Zinc": 30, "Iron": 100, "Copper": 5, "Silver": 0.5},
}

for env_name, currents in environments.items():
    print(f"--- {env_name} ---")
    print(f"{'Metal':<10} {'i_corr':>10} {'Rate':>12} {'1mm lifetime':>13}")
    print("-" * 47)
    for metal, i_corr in currents.items():
        props = metals[metal]
        rate = corrosion_rate_mm_yr(i_corr, props["M"], props["n"], props["rho"])
        life = 1.0 / rate if rate > 0 else float('inf')
        life_str = str(int(life)) + " yr" if life < 1e6 else "forever"
        print(f"{metal:<10} {i_corr:>8.2f} uA {rate:>10.5f} mm/yr {life_str:>13}")
    print()

# Bidriware lifespan analysis
print("=== Bidriware Lifespan Prediction ===")
zinc_thickness = 3.0  # mm (typical wall thickness)
silver_thickness = 0.5  # mm (inlay depth)

for env in ["Dry indoor", "Humid indoor"]:
    i_corr_zn = environments[env]["Zinc"]
    rate_zn = corrosion_rate_mm_yr(i_corr_zn, 65.38, 2, 7.13)

    life_10pct = lifetime_years(zinc_thickness, rate_zn, 0.10)
    life_50pct = lifetime_years(zinc_thickness, rate_zn, 0.50)

    print(f"{env}:")
    print(f"  Zinc corrosion rate: {rate_zn:.5f} mm/yr")
    print(f"  10% loss ({zinc_thickness*0.1:.1f} mm): {life_10pct:.0f} years")
    print(f"  50% loss ({zinc_thickness*0.5:.1f} mm): {life_50pct:.0f} years")
    print()

print("Bidriware kept in dry indoor conditions can last millennia.")
print("This explains why 600-year-old pieces are still intact.")`,
      challenge: 'A Bidriware piece is moved from a museum (dry indoor) to a collector home near the coast (marine-influenced). By how many times does the corrosion rate increase? How many years of museum-equivalent corrosion does one year of coastal exposure cause?',
      successHint: 'Corrosion rate prediction determines the inspection schedule for every bridge, pipeline, pressure vessel, and aircraft in the world. The techniques you just used — Tafel analysis, corrosion rate calculation, lifetime prediction — are the daily tools of corrosion engineers whose work keeps critical infrastructure safe.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Researcher
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Passivation, electroplating, and corrosion prediction</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises model galvanic corrosion, passivation, Pourbaix diagrams, and corrosion prediction.
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
