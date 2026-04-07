import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function BidriwareLevel4() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Build an electrochemical cell simulator',
      concept: `In this capstone, you will build a complete electrochemical cell simulator that models voltage, current, concentration changes, and energy output over time. The simulator combines the Nernst equation (voltage vs concentration), Faraday law (mass deposited vs charge), and ohmic losses (voltage drop from internal resistance) into a unified battery discharge model.

The cell voltage during discharge is: **V = E_nernst - I*R_internal - eta_activation**, where E_nernst changes with concentration (Nernst equation), I*R is the ohmic drop, and eta_activation is the activation overpotential (energy needed to start the reaction). As the cell discharges, products accumulate, reactants are depleted, and the voltage gradually drops until it reaches a cutoff.

This model describes every battery from a simple zinc-copper Daniell cell to the lithium-ion cell in your phone. The mathematics are the same — only the specific materials, concentrations, and parameters differ.

📚 *A complete battery model must account for: thermodynamics (Nernst equation for OCV), kinetics (Butler-Volmer for activation losses), transport (concentration gradients in electrolyte), and ohmic losses (resistance of electrodes, electrolyte, connections).*`,
      analogy: 'Building a battery simulator is like modeling a water tank system. The tank level (concentration) determines the pressure (voltage). The pipe diameter (internal resistance) limits the flow (current). As water flows out, the level drops and pressure decreases until the tank is empty (battery dead). Your simulator tracks all these coupled effects.',
      storyConnection: 'The Bidriware zinc-silver combination is, chemically speaking, a battery. Your simulator could predict how much electrical energy a Bidriware vase could theoretically produce if its zinc and silver were connected through an external circuit. This is a fun thought experiment — and the same simulator applies to real batteries that power billions of devices.',
      checkQuestion: 'A Daniell cell has E0=1.1V, internal resistance 2 ohms, and delivers 0.3A. What is the terminal voltage?',
      checkAnswer: 'V = E0 - I*R = 1.1 - 0.3*2 = 1.1 - 0.6 = 0.5V. Nearly half the voltage is lost to internal resistance! This is why low internal resistance is critical for battery performance.',
      codeIntro: 'Build a battery discharge simulator with Nernst equation and ohmic losses.',
      code: `import numpy as np

class BatterySimulator:
    """Simulate an electrochemical cell discharge."""

    def __init__(self, E0, n_electrons, anode_M, cathode_M,
                 volume_L=0.1, R_internal=1.0):
        self.E0 = E0
        self.n = n_electrons
        self.anode_M = anode_M
        self.cathode_M = cathode_M
        self.V = volume_L
        self.R = R_internal
        self.F = 96485

    def nernst_voltage(self, c_anode_ion, c_cathode_ion):
        """Cell voltage from Nernst equation."""
        if c_cathode_ion <= 1e-10:
            return 0
        Q = max(c_anode_ion, 1e-10) / c_cathode_ion
        return self.E0 - (0.05916 / self.n) * np.log10(Q)

    def discharge(self, current_A, c_cathode_init=1.0,
                  c_anode_init=0.001, dt=10, cutoff_V=0.3):
        """Simulate discharge at constant current."""
        c_cat = c_cathode_init
        c_an = c_anode_init
        time = 0
        results = []

        while True:
            E_nernst = self.nernst_voltage(c_an, c_cat)
            V_terminal = E_nernst - current_A * self.R
            if V_terminal < cutoff_V or c_cat < 1e-6:
                break

            power_W = V_terminal * current_A
            # Concentration change: dn/dt = I/(n*F)
            dn = current_A * dt / (self.n * self.F)  # moles consumed
            dc = dn / self.V  # concentration change

            c_cat -= dc  # cathode ion consumed
            c_an += dc   # anode ion produced
            time += dt

            results.append({
                "time_s": time, "E_nernst": E_nernst,
                "V_terminal": V_terminal, "power_W": power_W,
                "c_cathode": c_cat, "c_anode": c_an,
            })

        return results

# Daniell cell (Zn-Cu)
cell = BatterySimulator(E0=1.102, n_electrons=2,
                         anode_M=65.38, cathode_M=63.55,
                         volume_L=0.5, R_internal=2.0)

print("=== Daniell Cell Discharge Simulation ===")
print(f"E0 = {cell.E0} V | R_internal = {cell.R} ohm")
print()

for current in [0.1, 0.3, 0.5]:
    results = cell.discharge(current)
    if results:
        total_time = results[-1]["time_s"]
        total_energy = sum(r["power_W"] * 10 / 3600 for r in results)  # Wh
        avg_V = np.mean([r["V_terminal"] for r in results])

        print(f"--- Current: {current} A ---")
        print(f"  Runtime: {total_time/60:.1f} min")
        print(f"  Energy delivered: {total_energy:.2f} Wh")
        print(f"  Avg terminal voltage: {avg_V:.3f} V")
        print(f"  Final Cu2+ conc: {results[-1]['c_cathode']:.4f} M")

        # Show discharge curve (sampled)
        step = max(1, len(results) // 8)
        print(f"  {'Time':>8} {'Nernst':>8} {'Terminal':>9} {'Cu2+':>8}")
        for r in results[::step]:
            print(f"  {r['time_s']/60:>6.1f}m {r['E_nernst']:>8.3f} "
                  f"{r['V_terminal']:>8.3f}V {r['c_cathode']:>8.4f}")
    print()

# Compare with Zn-Ag cell
print("=== Zinc-Silver Cell (Bidriware Battery) ===")
ag_cell = BatterySimulator(E0=1.561, n_electrons=2,
                            anode_M=65.38, cathode_M=107.87,
                            volume_L=0.5, R_internal=1.5)

results_ag = ag_cell.discharge(0.3)
if results_ag:
    energy_ag = sum(r["power_W"] * 10 / 3600 for r in results_ag)
    print(f"Zn-Ag E0 = 1.561 V")
    print(f"Runtime at 0.3A: {results_ag[-1]['time_s']/60:.1f} min")
    print(f"Energy: {energy_ag:.2f} Wh")
    print(f"Avg voltage: {np.mean([r['V_terminal'] for r in results_ag]):.3f} V")`,
      challenge: 'Simulate a "Bidriware battery" using the actual silver mass in a vase (about 5 grams = 0.046 moles, dissolved in 100 mL as 0.46 M AgNO3). How long could it power an LED (20 mA, 2V minimum)? This tells you the theoretical energy stored in the artwork material.',
      successHint: 'You built a battery simulator from first principles. Tesla, Samsung, and every battery company uses similar models (with more detail) to design and optimize lithium-ion cells. The Nernst + ohmic loss + Faraday framework you implemented is the foundation of all battery modeling.',
    },
    {
      title: 'Corrosion prediction engine — modeling metal lifetime',
      concept: `Building on the corrosion rate calculations from Level 3, you will now create a comprehensive **corrosion prediction engine** that takes environmental conditions (temperature, humidity, pH, pollutant levels) and material properties as inputs, and outputs a predicted corrosion rate and structural lifetime.

The engine combines: (1) **Arrhenius temperature dependence** (corrosion rate doubles every 10 degrees C), (2) **humidity threshold** (corrosion is negligible below ~60% relative humidity), (3) **pollutant effects** (SO2, Cl^-, NOx increase corrosion), and (4) **galvanic coupling** (bimetallic contact accelerates corrosion of the less noble metal).

This is exactly the kind of model used by infrastructure engineers to schedule bridge inspections, plan pipeline replacements, and determine the service life of offshore oil platforms.

📚 *The Arrhenius equation: rate = A * exp(-Ea/(RT)), where Ea is the activation energy. For most corrosion reactions, doubling the temperature roughly doubles the rate. Combined with humidity and pollutant factors, this gives a practical corrosion rate prediction.*`,
      analogy: 'A corrosion prediction engine is like a weather forecast for metal health. Just as a weather model combines temperature, humidity, wind, and barometric pressure to predict tomorrow weather, your corrosion model combines temperature, humidity, pH, and pollutants to predict how fast a metal will corrode.',
      storyConnection: 'Museum curators responsible for Bidriware collections could use your corrosion engine to optimize storage conditions. By inputting the museum climate data (temperature, humidity, air quality), the engine predicts the corrosion rate and recommends whether additional protection (wax coating, dehumidifier) is needed. This turns art conservation from intuition into engineering.',
      checkQuestion: 'If corrosion rate doubles every 10 degrees C, and the rate at 20 degrees C is 0.01 mm/year, what is it at 40 degrees C?',
      checkAnswer: '40 - 20 = 20 degrees difference = 2 doublings. Rate = 0.01 * 2^2 = 0.04 mm/year. At 60 degrees C: 0.01 * 2^4 = 0.16 mm/year.',
      codeIntro: 'Build a corrosion prediction engine for Bidriware preservation planning.',
      code: `import numpy as np

class CorrosionEngine:
    """Predict corrosion rate from environmental conditions."""

    def __init__(self, metal, base_rate_mm_yr=0.01, base_temp=20):
        self.metal = metal
        self.base_rate = base_rate_mm_yr
        self.base_temp = base_temp

    def temperature_factor(self, temp_C):
        """Arrhenius: rate doubles every 10C."""
        return 2 ** ((temp_C - self.base_temp) / 10)

    def humidity_factor(self, rh_pct):
        """Below 60% RH: negligible corrosion. Above: rapid increase."""
        if rh_pct < 40:
            return 0.01
        elif rh_pct < 60:
            return 0.1 * (rh_pct - 40) / 20
        else:
            return 0.1 + 0.9 * ((rh_pct - 60) / 40) ** 2

    def pollutant_factor(self, so2_ppb=0, cl_ugm3=0):
        """SO2 and chloride increase corrosion rate."""
        f_so2 = 1 + so2_ppb / 50
        f_cl = 1 + cl_ugm3 / 100
        return f_so2 * f_cl

    def galvanic_factor(self, coupled_metal_E0=None, own_E0=-0.762):
        """Galvanic coupling increases corrosion of less noble metal."""
        if coupled_metal_E0 is None:
            return 1.0
        delta_E = abs(coupled_metal_E0 - own_E0)
        return 1 + 2 * delta_E  # simplified

    def predict(self, temp_C, rh_pct, so2_ppb=0, cl_ugm3=0,
                coupled_E0=None):
        """Predict corrosion rate in mm/year."""
        rate = self.base_rate
        rate *= self.temperature_factor(temp_C)
        rate *= self.humidity_factor(rh_pct)
        rate *= self.pollutant_factor(so2_ppb, cl_ugm3)
        rate *= self.galvanic_factor(coupled_E0)
        return rate

# Create engine for zinc (Bidriware base)
zinc_engine = CorrosionEngine("Zinc", base_rate_mm_yr=0.005)

# Test different environments
print("=== Corrosion Prediction for Bidriware Zinc ===")
print()

environments = [
    ("Museum (ideal)", 21, 45, 2, 0, None),
    ("Museum (humid)", 21, 65, 5, 0, None),
    ("Home (temperate)", 22, 55, 10, 5, None),
    ("Home (tropical)", 30, 75, 15, 20, None),
    ("Outdoor (urban)", 25, 70, 50, 30, None),
    ("Outdoor (coastal)", 25, 80, 10, 200, None),
    ("Zn near Ag inlay", 21, 55, 5, 0, 0.799),
]

print(f"{'Environment':<25} {'Rate (mm/yr)':>13} {'1mm life':>10} {'Risk':<10}")
print("-" * 60)

for name, T, RH, so2, cl, coupled in environments:
    rate = zinc_engine.predict(T, RH, so2, cl, coupled)
    life = 1.0 / rate if rate > 0 else 99999
    risk = "LOW" if rate < 0.005 else "MODERATE" if rate < 0.05 else "HIGH"
    print(f"{name:<25} {rate:>11.5f} {life:>8.0f} yr {risk}")

print()
# Sensitivity analysis
print("=== Sensitivity: Which Factor Matters Most? ===")
base_conditions = (21, 50, 5, 0, None)
base_rate = zinc_engine.predict(*base_conditions)

factors = [
    ("Temperature +10C", (31, 50, 5, 0, None)),
    ("Humidity +20%", (21, 70, 5, 0, None)),
    ("SO2 x10", (21, 50, 50, 0, None)),
    ("Chloride +100", (21, 50, 5, 100, None)),
    ("Galvanic (Ag)", (21, 50, 5, 0, 0.799)),
]

print(f"Baseline rate: {base_rate:.6f} mm/yr")
print()
print(f"{'Change':<25} {'New rate':>12} {'Multiplier':>11}")
print("-" * 50)
for name, conditions in factors:
    new_rate = zinc_engine.predict(*conditions)
    mult = new_rate / base_rate
    print(f"{name:<25} {new_rate:>10.6f} {mult:>9.1f}x")

print()
print("Humidity is often the dominant factor for indoor corrosion.")
print("Control humidity first, then worry about pollutants.")`,
      challenge: 'Add a seasonal model: temperature and humidity vary month by month. Calculate the annual average corrosion rate for a Bidriware piece stored in a home in Hyderabad (hot humid summers, mild dry winters). Compare with a home in London (cool and damp year-round).',
      successHint: 'Corrosion prediction engines are used by every major infrastructure operator in the world. Pipeline companies use them to schedule inspections and replacements. Bridge authorities use them to plan maintenance. Your engine implements the same multi-factor approach used in professional corrosion management software.',
    },
    {
      title: 'Electroplating process optimizer',
      concept: `Building a practical electroplating system requires optimizing multiple competing objectives: **thickness uniformity** (even coating everywhere), **deposition rate** (fast production), **deposit quality** (smooth, dense, adherent), and **cost** (minimize material, energy, and waste). These objectives conflict — higher current density means faster plating but rougher deposits.

The **throwing power** of a plating bath determines how uniform the coating is on complex shapes. High throwing power means even thickness on flat surfaces and in recesses. Low throwing power means the coating is thick on edges and thin in recesses. Silver plating baths have moderate throwing power.

Your optimizer will calculate the optimal current density, plating time, and bath composition for a given Bidriware piece, balancing production speed against quality requirements.

📚 *Throwing power depends on the electrolyte conductivity, polarization behavior, and geometry. The Wagner number Wa = (dE/di) / (kappa * L) compares the electrode kinetics to the electrolyte resistance. High Wa = good throwing power = uniform coating.*`,
      analogy: 'Optimizing electroplating is like optimizing a spray-painting process. Too close and the paint is thick in the center, thin at edges. Too far and coverage is even but slow. The wrong paint viscosity gives drips or orange peel texture. Finding the sweet spot requires balancing distance, speed, pressure, and viscosity simultaneously.',
      storyConnection: 'A modern Bidriware workshop considering electroplating to supplement traditional techniques would need exactly this optimization. The challenge: silver must be deposited uniformly into engraved grooves that are deeper in some places than others. Poor throwing power would leave the deep grooves under-plated while over-plating the flat surfaces.',
      checkQuestion: 'At current density 3 A/dm^2, silver plates at 0.2 um/min with 95% efficiency. At 6 A/dm^2, it plates at 0.35 um/min with 85% efficiency. Which is more efficient for a 10 um coating?',
      checkAnswer: 'At 3 A/dm^2: time = 10/0.2 = 50 min. Charge = 3*0.5*50 = 75 Ah/dm^2 (accounting for 95% efficiency). At 6 A/dm^2: time = 10/0.35 = 28.6 min. Charge = 6*0.286*28.6 = 49 Ah/dm^2. The higher current is faster AND uses less total charge despite lower efficiency, because it needs much less time.',
      codeIntro: 'Build an electroplating optimizer that balances speed, quality, and cost.',
      code: `import numpy as np

class PlatingOptimizer:
    """Optimize electroplating parameters for Bidriware silver coating."""

    def __init__(self, metal_M=107.87, metal_n=1, metal_density=10.49,
                 metal_cost_kg=800):
        self.M = metal_M
        self.n = metal_n
        self.rho = metal_density
        self.cost_kg = metal_cost_kg
        self.F = 96485

    def plating_rate(self, j_A_dm2):
        """Deposition rate in um/min at given current density."""
        # Convert j to A/m^2
        j_Am2 = j_A_dm2 * 100
        # Rate = j * M / (n * F * rho) in m/s, convert to um/min
        rate_ms = j_Am2 * self.M / (self.n * self.F * self.rho * 1e6)
        return rate_ms * 1e6 * 60  # um/min

    def efficiency(self, j_A_dm2):
        """Current efficiency decreases at high current density."""
        # Model: efficiency drops above optimal range
        if j_A_dm2 < 1:
            return 0.90
        elif j_A_dm2 < 5:
            return 0.95
        elif j_A_dm2 < 10:
            return 0.95 - 0.02 * (j_A_dm2 - 5)
        else:
            return 0.85 - 0.03 * (j_A_dm2 - 10)

    def quality_score(self, j_A_dm2):
        """Surface quality (1-10) decreases at extreme current densities."""
        if j_A_dm2 < 0.5:
            return 6  # too slow, uneven nucleation
        elif j_A_dm2 < 2:
            return 9  # excellent
        elif j_A_dm2 < 5:
            return 8  # good
        elif j_A_dm2 < 10:
            return 6  # rough
        else:
            return 3  # very rough, burning

    def optimize(self, target_thickness_um, area_dm2, cell_voltage=1.5,
                 energy_cost_kwh=0.10):
        """Find optimal current density."""
        best_score = -1
        best_j = 0
        results = []

        for j_10x in range(5, 150):
            j = j_10x / 10  # 0.5 to 15 A/dm^2
            eta = self.efficiency(j)
            rate = self.plating_rate(j) * eta
            if rate <= 0:
                continue

            time_min = target_thickness_um / rate
            current = j * area_dm2
            charge_Ah = current * time_min / 60

            # Costs
            mass_g = (target_thickness_um * 1e-4 * area_dm2 * 100 * self.rho)
            metal_cost = mass_g * self.cost_kg / 1000
            energy_kwh = cell_voltage * current * time_min / 60 / 1000
            energy_cost = energy_kwh * energy_cost_kwh
            total_cost = metal_cost + energy_cost

            quality = self.quality_score(j)

            # Combined score: quality * speed_factor / cost_factor
            speed_factor = 1 / (1 + time_min / 60)  # favor shorter times
            cost_factor = total_cost / metal_cost  # normalize by minimum cost
            score = quality * speed_factor / cost_factor

            results.append({
                "j": j, "rate": rate, "time_min": time_min,
                "eta": eta, "quality": quality, "total_cost": total_cost,
                "score": score,
            })

            if score > best_score:
                best_score = score
                best_j = j

        return results, best_j

opt = PlatingOptimizer()

print("=== Silver Plating Optimization ===")
print("Target: 10 um silver on 2 dm^2 (Bidriware vase)")
print()

results, best_j = opt.optimize(10, 2.0)

print(f"{'j (A/dm2)':<11} {'Rate':>10} {'Time':>8} {'Eff':>6} "
      f"{'Quality':>8} {'Cost':>8} {'Score':>7}")
print("-" * 60)

for r in results[::3]:  # show every 3rd result
    marker = " ***" if abs(r["j"] - best_j) < 0.2 else ""
    print(f"{r['j']:<11.1f} {r['rate']:>8.3f} um/m {r['time_min']:>6.1f}m "
          f"{r['eta']:>5.0%} {r['quality']:>8}/10 {r['total_cost']:>6.2f} "
          f"{r['score']:>6.2f}{marker}")

print(f"\\nOptimal current density: {best_j:.1f} A/dm^2")

# Production planning
print()
print("=== Daily Production Plan ===")
pieces_per_day = 20
area_per_piece = 2.0  # dm^2

total_area = pieces_per_day * area_per_piece
opt_result = [r for r in results if abs(r["j"] - best_j) < 0.2][0]

print(f"Pieces per day: {pieces_per_day}")
print(f"Time per piece: {opt_result['time_min']:.1f} minutes")
print(f"Current per piece: {best_j * area_per_piece:.1f} A")
print(f"Daily plating time: {pieces_per_day * opt_result['time_min'] / 60:.1f} hours")
print(f"Daily cost: {opt_result['total_cost'] * pieces_per_day:.2f}")
print(f"Daily silver used: {10e-4 * area_per_piece * 100 * 10.49 * pieces_per_day:.0f} g")`,
      challenge: 'The engraved grooves on a Bidriware piece are 0.3 mm deep but the flat surface needs only 10 um. Design a two-step plating process: first fill the grooves at low current density (good throwing power), then plate the flat surface at higher current density (faster). Calculate total time and cost.',
      successHint: 'Process optimization is the heart of manufacturing engineering. Every factory, every production line, and every chemical plant runs on optimized parameters. The multi-objective optimization you performed — balancing speed, quality, and cost — is exactly what industrial engineers do to maximize productivity.',
    },
    {
      title: 'Complete Bidriware materials simulator',
      concept: `In this final capstone, you integrate everything into a complete materials simulation for a Bidriware piece: alloy composition, casting temperature, silver inlay mass, darkening chemistry, corrosion prediction over centuries, and conservation planning. The simulator answers the ultimate question: given a set of materials and environmental conditions, how long will this artwork last?

The simulation tracks multiple coupled processes: (1) initial oxide formation during darkening, (2) slow ongoing corrosion of zinc in ambient conditions, (3) galvanic acceleration near silver inlay, (4) protective effect of wax coating (when applied), and (5) environmental variations (seasonal temperature and humidity cycles).

This kind of multi-physics, multi-timescale simulation is at the frontier of materials science — combining electrochemistry, kinetics, and environmental science to predict material behavior over centuries.

📚 *Multi-physics simulation: when multiple physical processes interact (electrochemistry + heat transfer + mass transport + mechanical stress), they must be solved simultaneously because each affects the others. This is computationally challenging but essential for realistic predictions.*`,
      analogy: 'A complete materials simulator is like a flight simulator for metal. Just as a flight simulator combines aerodynamics, engine performance, weather, and pilot actions to predict what happens to the aircraft, your materials simulator combines electrochemistry, kinetics, environment, and conservation actions to predict what happens to the artwork over centuries.',
      storyConnection: 'Imagine a museum curator in the year 2500 examining a Bidriware vase made today. Your simulator can predict what condition that vase will be in: how much zinc has corroded, whether the silver inlay is still secure, whether the black patina is intact. This long-term prediction guides today conservation decisions — what museum conditions to maintain, how often to apply protective wax, and whether to display the piece or keep it in storage.',
      checkQuestion: 'If a Bidriware vase has 3 mm zinc wall thickness and the corrosion rate in museum conditions is 0.002 mm/year, how long until 10% of the zinc is consumed? Is this acceptable?',
      checkAnswer: '10% of 3 mm = 0.3 mm. Time = 0.3 / 0.002 = 150 years. This is acceptable for a museum piece — and the actual rate is likely much lower with proper climate control and periodic waxing, pushing the safe lifespan to 500+ years.',
      codeIntro: 'Build a complete Bidriware materials simulation spanning centuries.',
      code: `import numpy as np

class BidriwareSimulator:
    """Complete materials lifecycle simulation for a Bidriware piece."""

    def __init__(self, zinc_thickness_mm=3.0, silver_mass_g=5.0,
                 surface_area_cm2=200, initial_oxide_nm=500):
        self.zn_thick = zinc_thickness_mm
        self.ag_mass = silver_mass_g
        self.area = surface_area_cm2
        self.oxide = initial_oxide_nm
        self.wax_age = 0  # years since last wax application

    def annual_corrosion(self, temp_C, rh_pct, has_wax=True):
        """Annual zinc corrosion in mm."""
        # Base rate
        rate = 0.001  # mm/yr in ideal conditions

        # Temperature effect (Arrhenius)
        rate *= 2 ** ((temp_C - 20) / 10)

        # Humidity effect
        if rh_pct < 40:
            rate *= 0.05
        elif rh_pct < 60:
            rate *= 0.1 + 0.4 * (rh_pct - 40) / 20
        else:
            rate *= 0.5 + 0.5 * ((rh_pct - 60) / 40)

        # Galvanic effect near silver (localized)
        rate *= 1.3  # 30% increase due to Ag contact

        # Wax protection
        if has_wax and self.wax_age < 10:
            wax_factor = 0.1 + 0.09 * self.wax_age  # wax degrades over time
            rate *= wax_factor

        # Oxide protection (thicker oxide = better protection)
        rate *= 500 / max(self.oxide, 100)

        return rate

    def simulate(self, years, temp_C=21, rh_pct=50,
                 wax_interval=10, wax_start=True):
        """Simulate degradation over given number of years."""
        zn_remaining = self.zn_thick
        self.wax_age = 0 if wax_start else 999
        results = []

        for year in range(years):
            # Apply wax if scheduled
            if wax_interval > 0 and year % wax_interval == 0:
                self.wax_age = 0
                has_wax = True
            else:
                has_wax = self.wax_age < 15
                self.wax_age += 1

            # Annual corrosion
            corr = self.annual_corrosion(temp_C, rh_pct, has_wax)
            zn_remaining -= corr

            # Oxide grows slowly
            self.oxide += 0.5 * np.log(1 + year * 0.01)

            if year % max(1, years // 20) == 0 or zn_remaining <= 0:
                results.append({
                    "year": year,
                    "zn_remaining_mm": max(0, zn_remaining),
                    "zn_lost_pct": (self.zn_thick - max(0, zn_remaining)) / self.zn_thick * 100,
                    "oxide_nm": self.oxide,
                    "corr_rate": corr,
                    "has_wax": has_wax,
                })

            if zn_remaining <= 0:
                break

        return results

sim = BidriwareSimulator()

print("=" * 60)
print("    BIDRIWARE LIFECYCLE SIMULATION")
print("=" * 60)
print()

# Scenario 1: Museum with regular care
print("--- Scenario 1: Museum (21C, 50% RH, wax every 10 years) ---")
results = sim.simulate(1000, temp_C=21, rh_pct=50, wax_interval=10)

print(f"{'Year':>6} {'Zn left':>10} {'Lost %':>8} {'Rate':>12} {'Wax':>5}")
print("-" * 43)
for r in results:
    print(f"{r['year']:>6} {r['zn_remaining_mm']:>8.3f}mm {r['zn_lost_pct']:>6.1f}% "
          f"{r['corr_rate']*1000:>9.3f} um/yr {'Yes' if r['has_wax'] else 'No':>5}")

print()

# Scenario 2: Neglected (no wax, higher humidity)
sim2 = BidriwareSimulator()
print("--- Scenario 2: Neglected home (25C, 70% RH, no wax) ---")
results2 = sim2.simulate(500, temp_C=25, rh_pct=70, wax_interval=0)

print(f"{'Year':>6} {'Zn left':>10} {'Lost %':>8} {'Rate':>12}")
print("-" * 38)
for r in results2:
    print(f"{r['year']:>6} {r['zn_remaining_mm']:>8.3f}mm {r['zn_lost_pct']:>6.1f}% "
          f"{r['corr_rate']*1000:>9.3f} um/yr")

print()
# Summary comparison
print("=== Conservation Impact ===")
for label, res in [("Museum (careful)", results), ("Neglected", results2)]:
    yr100 = next((r for r in res if r["year"] >= 100), res[-1])
    yr500 = next((r for r in res if r["year"] >= 500), res[-1])
    print(f"{label}:")
    print(f"  After 100 years: {yr100['zn_lost_pct']:.1f}% zinc lost")
    print(f"  After 500 years: {yr500['zn_lost_pct']:.1f}% zinc lost")
    final = res[-1]
    if final["zn_remaining_mm"] <= 0:
        print(f"  Zinc fully consumed by year {final['year']}")
    else:
        print(f"  After {final['year']} years: {final['zn_lost_pct']:.1f}% lost")
    print()

print("Proper conservation extends Bidriware lifespan by centuries.")
print("The 600-year-old pieces in museums prove this is achievable.")`,
      challenge: 'Add climate change to the simulation: temperature increases 0.03 degrees C per year and humidity increases 0.1% per year. How does this affect the 1000-year prediction? At what point does climate change make the museum conditions inadequate without upgrading the climate control system?',
      successHint: 'You have built a complete materials lifecycle model — the same approach used for predicting the lifespan of nuclear waste containers (10,000+ year predictions), aerospace components, and cultural heritage objects. The combination of electrochemistry, kinetics, and environmental modeling is the state of the art in materials durability science.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Capstone
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Simulate electrochemical cells and corrosion prediction</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These capstone exercises build complete electrochemical and corrosion simulation systems.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
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
