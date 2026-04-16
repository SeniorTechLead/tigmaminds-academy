import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function PambanLevel3() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Fatigue — how bridges fail from repetitive small loads',
      concept: `A bridge member can fail at a stress **far below** its yield strength if the stress is applied and removed millions of times. This is **fatigue** — the progressive formation and growth of cracks under cyclic loading. Every train crossing the Pamban Bridge applies one stress cycle to each member. Over 100 years, that is millions of cycles.

The **S-N curve** (stress vs number of cycles to failure) shows that at lower stress, the material survives more cycles. Below a threshold called the **endurance limit** (about 50% of ultimate strength for steel), the material can theoretically survive infinite cycles.

In the code below, you will model the S-N curve for bridge steel and calculate the fatigue life of Pamban Bridge members under different loading conditions.

*Fatigue caused an estimated 50-90% of all structural failures in the 20th century. The Aloha Airlines flight 243 fuselage failure (1988), the de Havilland Comet crashes (1954), and countless bridge collapses were all caused by fatigue cracking.*`,
      analogy: 'Bend a paper clip back and forth. The first bend is easy. After 5-10 bends, you feel it getting warm and stiff. After 20-30 bends, it snaps. The paper clip failed at a fraction of the force needed to break it in one pull. Each bend created and grew a tiny crack until the crack was big enough to cause complete failure.',
      storyConnection: 'The Pamban Bridge has been carrying trains since 1914 — over 100 years of cyclic loading. The original riveted connections are fatigue-prone because the rivet holes create stress concentrations where cracks initiate. Modern inspection programmes use ultrasonic testing to detect fatigue cracks before they reach critical size.',
      checkQuestion: 'A bridge member experiences a stress range of 100 MPa per train crossing, and 20 trains cross per day. The S-N curve says it can survive 5 million cycles at 100 MPa. How many years before fatigue failure?',
      checkAnswer: '20 trains/day x 365 days/year = 7300 cycles/year. 5,000,000 / 7300 = 685 years. This is a long fatigue life — the stress is well managed. But if the stress range increased to 150 MPa (heavier trains), the S-N curve might give only 500,000 cycles = 68 years. Small stress increases cause large fatigue life reductions.',
      codeIntro: 'Model fatigue life using S-N curves for bridge steel.',
      code: `import numpy as np

def sn_curve(stress_range_mpa, ultimate_mpa=400, endurance_factor=0.5, exponent=-0.1):
    """Basquin's law for S-N curve: N = C * (S)^m
    Returns number of cycles to failure.
    """
    endurance = ultimate_mpa * endurance_factor
    if stress_range_mpa <= endurance:
        return float('inf')  # infinite life below endurance limit
    # Basquin: log(N) = a + b * log(S)
    a = 20  # calibration constant
    b = -6  # slope of S-N curve (typical for steel)
    log_N = a + b * np.log10(stress_range_mpa)
    return 10 ** log_N

def fatigue_life_years(stress_range_mpa, cycles_per_day):
    N = sn_curve(stress_range_mpa)
    if N == float('inf'):
        return float('inf')
    cycles_per_year = cycles_per_day * 365
    return N / cycles_per_year

# S-N curve for bridge steel
print("=== S-N Curve for Structural Steel ===")
print(f"Ultimate strength: 400 MPa | Endurance limit: ~200 MPa")
print()

header = "Stress Range(MPa)  Cycles to Failure    Life @20 trains/day"
print(header)
print("-" * len(header))

for stress in [50, 80, 100, 120, 150, 180, 200, 220, 250, 300]:
    N = sn_curve(stress)
    life = fatigue_life_years(stress, 20)
    if N == float('inf'):
        print(f"{stress:>16}    Infinite             Infinite")
    else:
        life_str = f"{life:.0f} years" if life < 10000 else "Practically infinite"
        print(f"{stress:>16}    {N:>12.0f}         {life_str}")

# Pamban Bridge fatigue assessment
print()
print("=== Pamban Bridge Fatigue Assessment ===")
print()

members = [
    ("Top chord (max)",     120, "High traffic section"),
    ("Bottom chord",        100, "Main tension member"),
    ("Diagonal brace",       80, "Moderate stress range"),
    ("Cross beam",          140, "High local stress"),
    ("Rivet connection",    160, "Stress concentration factor"),
]

trains_per_day = 12  # current traffic

header2 = "Member                  Stress(MPa)  Cycles Left  Life(years)  Status"
print(header2)
print("-" * len(header2))

years_in_service = 110  # since 1914

for name, stress, note in members:
    N_total = sn_curve(stress)
    if N_total == float('inf'):
        remaining = "Infinite"
        status = "OK"
    else:
        cycles_used = years_in_service * trains_per_day * 365
        remaining_cycles = N_total - cycles_used
        remaining_years = remaining_cycles / (trains_per_day * 365)
        remaining = f"{remaining_cycles:,.0f}"
        status = "OK" if remaining_years > 50 else "MONITOR" if remaining_years > 20 else "CRITICAL"

    life = fatigue_life_years(stress, trains_per_day)
    life_str = f"{life:.0f}" if life != float('inf') else "inf"
    print(f"{name:<24} {stress:>9}    {remaining:>12}  {life_str:>10}    {status}")

print()
print("Rivet connections are the most fatigue-critical because")
print("rivet holes create stress concentrations (2-3x local stress).")`,
      challenge: 'Add Miner\'s rule for variable amplitude loading: some days have 5 trains, some have 20. If the damage fraction at each stress level is n_i/N_i, failure occurs when the sum equals 1. Calculate the fatigue life with a realistic traffic distribution rather than a fixed 12 trains/day.',
      successHint: 'You just performed a fatigue assessment — one of the most critical analyses for any structure or machine subject to repeated loading. The same S-N approach is used for aircraft, automobiles, pressure vessels, and medical implants. Fatigue is the silent failure mode that catches engineers who only check static strength.',
    },
    {
      title: 'Corrosion rate — salt spray and the life of steel in the sea',
      concept: `Steel corrodes (rusts) when exposed to water and oxygen. The reaction is: 4Fe + 3O2 + 6H2O -> 4Fe(OH)3 (rust). Salt water accelerates corrosion dramatically — a bridge in salt spray corrodes 5-10 times faster than one inland.

Corrosion reduces the **effective thickness** of steel members. A member that starts 10 mm thick and corrodes at 0.1 mm/year on each side will lose 2 mm in 10 years — a 20% reduction in cross-section and therefore a 20% reduction in load-carrying capacity.

In the code below, you will model corrosion rates for the Pamban Bridge under different conditions and calculate the remaining structural capacity over time. This is why the Pamban Bridge requires constant maintenance and periodic member replacement.

*Corrosion costs the global economy over $2.5 trillion per year — about 3.4% of global GDP. Bridge corrosion alone costs billions annually. The Pamban Bridge, in one of the most corrosive environments on Earth (tropical salt spray), is a poster child for corrosion engineering.*`,
      analogy: 'Imagine a chocolate bar left in a warm room. The outer layer melts first (corrosion attacks the surface). Over time, more chocolate melts inward. If you started with a thick bar, you still have plenty left after an hour. If it was thin, it might be gone. Corrosion "melts" steel the same way — from the surface inward — and the thinner the steel, the sooner it fails.',
      storyConnection: 'The Pamban Bridge is in a uniquely hostile environment: tropical heat, constant salt spray, tidal wetting and drying cycles, and biological fouling (barnacles and algae that trap moisture against the steel). The original 1914 bridge members had to be replaced multiple times due to severe corrosion. The current bridge uses better coatings and cathodic protection.',
      checkQuestion: 'If a steel plate corrodes at 0.15 mm/year on each face and starts at 12 mm thick, after how many years will it lose 30% of its thickness?',
      checkAnswer: '30% of 12 mm = 3.6 mm total loss. Corroding from both faces at 0.15 mm/year each = 0.30 mm/year total. Time = 3.6 / 0.30 = 12 years. After just 12 years, the member has lost 30% of its capacity. This is why marine bridge maintenance schedules are measured in years, not decades.',
      codeIntro: 'Model corrosion rates and remaining structural capacity for the Pamban Bridge.',
      code: `import numpy as np

def corrosion_loss_mm(years, environment, has_coating=False, has_cathodic=False):
    """Calculate cumulative corrosion loss in mm (per surface).

    Based on empirical corrosion rates for structural steel.
    """
    base_rates = {
        "rural_inland": 0.02,     # mm/year
        "urban": 0.04,
        "industrial": 0.08,
        "coastal_mild": 0.10,
        "coastal_tropical": 0.15,
        "marine_splash": 0.25,    # worst zone: tidal splash
        "submerged_seawater": 0.12,
    }

    rate = base_rates.get(environment, 0.05)

    if has_coating:
        # Coating protects for ~15 years, then degrades
        effective_years = max(0, years - 15)
        loss = rate * effective_years + 0.01 * min(years, 15)
    elif has_cathodic:
        loss = rate * 0.1 * years  # 90% reduction
    else:
        loss = rate * years

    return loss

print("=== Steel Corrosion Rates by Environment ===")
print("(Loss per surface per year, unprotected mild steel)")
print()

environments = [
    "rural_inland", "urban", "industrial",
    "coastal_mild", "coastal_tropical",
    "marine_splash", "submerged_seawater",
]

header = "Environment             Rate(mm/yr)  Loss in 25yr  Loss in 50yr"
print(header)
print("-" * len(header))

for env in environments:
    loss_25 = corrosion_loss_mm(25, env)
    loss_50 = corrosion_loss_mm(50, env)
    rate = corrosion_loss_mm(1, env)
    print(f"{env:<24} {rate:>9.3f}    {loss_25:>9.2f}mm   {loss_50:>9.2f}mm")

# Pamban Bridge member capacity over time
print()
print("=== Pamban Bridge: Remaining Capacity Over Time ===")
print("(Marine splash zone, various protection levels)")
print()

initial_thickness = 12  # mm

header2 = "Years   Unprotected   Coated   Cathodic   Remaining Capacity(%)"
print(header2)
print("-" * len(header2))

for years in [0, 5, 10, 15, 20, 25, 30, 40, 50, 75, 100]:
    loss_none = corrosion_loss_mm(years, "marine_splash") * 2  # both faces
    loss_coat = corrosion_loss_mm(years, "marine_splash", has_coating=True) * 2
    loss_cp = corrosion_loss_mm(years, "marine_splash", has_cathodic=True) * 2

    remaining_none = max(0, (initial_thickness - loss_none) / initial_thickness * 100)
    remaining_coat = max(0, (initial_thickness - loss_coat) / initial_thickness * 100)
    remaining_cp = max(0, (initial_thickness - loss_cp) / initial_thickness * 100)

    print(f"{years:>4}    {loss_none:>8.1f}mm   {loss_coat:>6.1f}mm  {loss_cp:>6.1f}mm  "
          f"  {remaining_none:>5.0f}%  {remaining_coat:>5.0f}%  {remaining_cp:>5.0f}%")

print()
print("Without protection, 50% thickness is lost in ~24 years.")
print("With cathodic protection, the bridge can last >100 years.")
print("This is why the Pamban Bridge uses sacrificial zinc anodes.")`,
      challenge: 'Calculate the total cost of three strategies over 100 years: (1) no protection, replace members when 50% corroded; (2) paint coating, repaint every 15 years; (3) cathodic protection, replace anodes every 5 years. Which strategy has the lowest lifetime cost?',
      successHint: 'You just performed a corrosion life assessment — one of the most important analyses for any steel structure in a marine or industrial environment. The same models are used for ships, offshore platforms, pipelines, and storage tanks. Corrosion management is a multi-billion-dollar industry.',
    },
    {
      title: 'Maintenance scheduling — optimizing inspection intervals',
      concept: `Bridges need regular inspection and maintenance. Inspect too often and you waste money. Inspect too rarely and you risk catastrophic failure. The optimal inspection interval balances **inspection cost** against **failure risk** — a classic reliability engineering problem.

The key concept is the **hazard rate** — the probability of failure per unit time, given survival to that point. For bridge members, the hazard rate increases with age (as corrosion and fatigue accumulate). The optimal inspection interval is where the marginal cost of one more inspection equals the marginal risk reduction.

In the code below, you will build a maintenance scheduling optimizer for the Pamban Bridge that determines when to inspect, repair, and replace each member type based on its degradation rate and consequence of failure.

*Reliability-centred maintenance (RCM) was developed by the US airline industry in the 1960s and is now used for bridges, power plants, railways, and military equipment. It uses probabilistic models to set inspection intervals based on risk, not arbitrary time periods.*`,
      analogy: 'Think of car maintenance. You change oil every 5000 km (cheap preventive maintenance) but only overhaul the engine at 200000 km (expensive but rarely needed). You check tyre pressure weekly (free) but replace tyres every 50000 km. Each component has its own optimal maintenance schedule based on how fast it degrades and how bad the consequence of failure is.',
      storyConnection: 'Indian Railways maintains the Pamban Bridge with regular underwater inspections of pier foundations, ultrasonic testing of steel members for fatigue cracks, and thickness measurements for corrosion monitoring. The schedule has been optimized over decades of experience — a critical pier gets inspected monthly, while a less critical diagonal member gets an annual check.',
      checkQuestion: 'If a fatigue crack grows from 1 mm to critical size (50 mm) over 5 years, how often should you inspect to catch it before failure?',
      checkAnswer: 'You need at least two inspections during the crack growth period: one to detect the crack and one to confirm it. With 5 years of growth, inspecting every 2 years gives at least 2 inspections. Adding a safety factor of 2 (inspect twice as often as minimum), the interval is 1 year. This is the "half-life" inspection method — inspect at half the estimated time to failure.',
      codeIntro: 'Build a maintenance schedule optimizer for the Pamban Bridge.',
      code: `import numpy as np

class BridgeMember:
    def __init__(self, name, failure_consequence, degradation_rate,
                 inspection_cost, repair_cost, replace_cost):
        self.name = name
        self.consequence = failure_consequence  # 1-10 scale
        self.degrad_rate = degradation_rate      # fraction per year
        self.inspect_cost = inspection_cost
        self.repair_cost = repair_cost
        self.replace_cost = replace_cost

    def failure_probability(self, years_since_last, age_years):
        """Probability of failure given time since last inspection."""
        base_prob = 1 - np.exp(-self.degrad_rate * years_since_last)
        age_factor = 1 + 0.02 * max(0, age_years - 50)
        return min(0.99, base_prob * age_factor)

    def risk(self, years_since_last, age_years):
        """Risk = probability x consequence."""
        return self.failure_probability(years_since_last, age_years) * self.consequence

    def optimal_interval(self, age_years, max_risk=0.5):
        """Find inspection interval that keeps risk below threshold."""
        for months in range(1, 121):
            years = months / 12
            if self.risk(years, age_years) > max_risk:
                return max(1, months - 1)
        return 120  # 10 years max

# Pamban Bridge members
members = [
    BridgeMember("Main girder",       10, 0.02, 500,  5000, 200000),
    BridgeMember("Cross beam",         7, 0.03, 300,  3000,  50000),
    BridgeMember("Bascule mechanism",  9, 0.04, 1000, 8000, 500000),
    BridgeMember("Pier foundation",   10, 0.01, 2000, 20000, 1000000),
    BridgeMember("Rail bearings",      6, 0.05, 200,  1000,  10000),
    BridgeMember("Diagonal braces",    5, 0.025, 200, 2000,  30000),
    BridgeMember("Paint coating",      3, 0.08, 100,  5000,  5000),
    BridgeMember("Deck plates",        7, 0.035, 300, 4000,  80000),
]

bridge_age = 110  # years since 1914

print("=== Pamban Bridge Maintenance Schedule Optimizer ===")
print(f"Bridge age: {bridge_age} years")
print(f"Maximum acceptable risk index: 0.5")
print()

header = "Member               Consequence  Degrad Rate  Optimal Interval  Annual Cost"
print(header)
print("-" * len(header))

total_annual_cost = 0

for m in sorted(members, key=lambda x: -x.consequence):
    interval_months = m.optimal_interval(bridge_age)
    inspections_per_year = 12 / interval_months
    annual_inspect_cost = m.inspect_cost * inspections_per_year

    # Estimate repair probability per inspection
    repair_prob = m.failure_probability(interval_months / 12, bridge_age) * 0.5
    annual_repair_cost = m.repair_cost * repair_prob * inspections_per_year

    annual_cost = annual_inspect_cost + annual_repair_cost
    total_annual_cost += annual_cost

    print(f"{m.name:<21} {m.consequence:>9}    {m.degrad_rate:>9.3f}    "
          f"{interval_months:>11} months  \{annual_cost:>10,.0f}")

print(f"\
Total annual maintenance budget: \{total_annual_cost:,.0f}")

# Risk profile over time without inspection
print()
print("=== Risk Accumulation Without Inspection ===")
print()
header2 = "Years Since Inspection   Main Girder Risk   Bascule Risk   Rail Bearing"
print(header2)
print("-" * len(header2))

for years in [0.5, 1, 2, 3, 5, 7, 10]:
    risks = []
    for m in [members[0], members[2], members[4]]:
        r = m.risk(years, bridge_age)
        risks.append(r)
    print(f"{years:>22.1f}    {risks[0]:>14.3f}    {risks[1]:>12.3f}    {risks[2]:>11.3f}")`,
      challenge: 'Add a "condition-based maintenance" option: instead of fixed intervals, inspect when a sensor reading (vibration, corrosion probe) exceeds a threshold. Compare the total cost of time-based vs condition-based maintenance over 20 years.',
      successHint: 'You just built a reliability-centred maintenance system — the standard approach used by airlines, nuclear power plants, railways, and military organizations worldwide. Optimal maintenance scheduling saves lives and billions of dollars annually by preventing both unnecessary inspections and unexpected failures.',
    },
    {
      title: 'Thermal stress — expansion joints and the Indian summer',
      concept: `The Pamban Bridge spans temperatures from about 15 degrees C (winter night) to 50 degrees C (summer afternoon on the steel surface). A 56-metre steel span experiences: **delta_L = L x alpha x delta_T = 56 x 12e-6 x 35 = 0.024 m = 24 mm** of length change between winter and summer.

If this expansion is blocked (by rigid connections), it creates **thermal stress**: sigma = E x alpha x delta_T = 200,000 x 12e-6 x 35 = 84 MPa. This is a third of the yield strength — enough to cause problems when combined with traffic loads. **Expansion joints** and **sliding bearings** allow the bridge to grow and shrink freely, eliminating thermal stress.

In the code below, you will model the thermal expansion of the Pamban Bridge across daily and seasonal temperature cycles and design the expansion joint system to accommodate these movements.

*Expansion joints are one of the most critical — and most maintenance-intensive — components of any bridge. Joint failures cause bumps, leaks, and corrosion damage. Modern bridge design tries to minimise the number of joints while accommodating thermal movement.*`,
      analogy: 'Imagine a long metal ruler in the sun. It grows slightly longer as it heats up. If both ends are clamped, the ruler buckles or the clamps break. If one end is free to slide, the ruler simply gets a tiny bit longer with no stress. Expansion joints are the "free end" that lets the bridge grow without stress.',
      storyConnection: 'The Pamban Bridge has expansion joints at every pier — sliding steel plates that allow the girders to move freely as they expand and contract. In the tropical heat, the rail gap at each joint can vary by 15-20 mm between night and midday. Track workers check these gaps regularly to ensure the rails remain properly aligned for train safety.',
      checkQuestion: 'The Pamban Bridge has 143 spans of 56 metres each. If each span expands 24 mm in summer, what is the total expansion of the entire bridge?',
      checkAnswer: '143 x 24 mm = 3432 mm = 3.4 metres! The entire 2-km bridge grows by over 3 metres in summer. This is why every span must have its own expansion joint — the cumulative movement is enormous.',
      codeIntro: 'Model thermal expansion and design expansion joints for the Pamban Bridge.',
      code: `import numpy as np

def thermal_expansion_mm(length_m, temp_change_C, alpha=12e-6):
    """Calculate thermal expansion in mm.
    alpha: coefficient of thermal expansion (12e-6 /C for steel)
    """
    return length_m * alpha * temp_change_C * 1000

def thermal_stress_mpa(temp_change_C, E_GPa=200, alpha=12e-6):
    """Stress if expansion is fully restrained."""
    return E_GPa * 1000 * alpha * temp_change_C

# Pamban Bridge parameters
span = 56  # m
n_spans = 143
alpha_steel = 12e-6  # /C

# Temperature conditions at Pamban
temps = {
    "Winter night":    15,
    "Winter day":      28,
    "Spring morning":  25,
    "Summer afternoon": 45,
    "Steel surface max": 55,  # dark steel in direct sun
    "Installation temp": 30,  # reference temperature
}

ref_temp = temps["Installation temp"]

print("=== Pamban Bridge Thermal Expansion ===")
print(f"Span: {span}m x {n_spans} spans | Steel alpha: {alpha_steel} /C")
print(f"Reference (installation) temperature: {ref_temp} C")
print()

header = "Condition            Temp(C)  Delta_T  Per Span(mm)  Total Bridge(mm)"
print(header)
print("-" * len(header))

for name, temp in temps.items():
    dt = temp - ref_temp
    per_span = thermal_expansion_mm(span, dt)
    total = per_span * n_spans
    print(f"{name:<21} {temp:>5}    {dt:>+5}    {per_span:>+10.1f}    {total:>+14.0f}")

print()
print("=== Expansion Joint Design ===")
print()

# Maximum movement range
max_hot = temps["Steel surface max"] - ref_temp
max_cold = ref_temp - temps["Winter night"]
max_expansion = thermal_expansion_mm(span, max_hot)
max_contraction = thermal_expansion_mm(span, max_cold)
total_range = max_expansion + max_contraction

print(f"Maximum expansion: +{max_expansion:.1f} mm")
print(f"Maximum contraction: -{max_contraction:.1f} mm")
print(f"Total joint movement range: {total_range:.1f} mm")
print(f"Design gap (with 50% safety): {total_range * 1.5:.0f} mm")

# Thermal stress if joints fail
print()
print("=== Stress if Expansion Joints Are Locked ===")
print()

header2 = "Temperature    Delta_T    Stress(MPa)    % of Yield(250)"
print(header2)
print("-" * len(header2))

for dt in [5, 10, 15, 20, 25, 30, 35, 40]:
    stress = thermal_stress_mpa(dt)
    pct_yield = stress / 250 * 100
    risk = "OK" if pct_yield < 30 else "HIGH" if pct_yield < 60 else "CRITICAL"
    print(f"{dt:>+10} C    {dt:>+5}    {stress:>10.0f}    {pct_yield:>12.0f}%    {risk}")

print()
print("A seized expansion joint at DeltaT=35 C creates 84 MPa of stress")
print("-- more than a fully loaded train. This is why joint maintenance")
print("is as important as structural maintenance on the Pamban Bridge.")`,
      challenge: 'Model the daily thermal cycle: temperature varies sinusoidally from 25 degrees C (6am) to 50 degrees C (2pm). Calculate the expansion at each hour and the rate of expansion (mm/hour). At what time of day is the expansion rate highest? This determines when rail inspectors should check joint gaps.',
      successHint: 'Thermal expansion management is critical for every long structure: bridges, railways, pipelines, and spacecraft. The International Space Station experiences temperature swings of 250 degrees C between sunlight and shadow — its thermal expansion joints are among the most sophisticated ever designed.',
    },
    {
      title: 'Seismic analysis — earthquake forces on the Pamban Bridge',
      concept: `Although southern India has lower seismic risk than the Himalayan region, the Pamban Bridge is still designed to resist moderate earthquakes. Seismic forces are proportional to the mass of the structure: **F_seismic = m x a**, where a is the ground acceleration (typically 0.1-0.4g for moderate to severe earthquakes).

The seismic response depends on the bridge's **natural period** — structures with periods matching the dominant earthquake frequencies experience the largest forces (resonance). Short, stiff bridges (high frequency) respond differently from long, flexible bridges (low frequency).

In the code below, you will perform a simplified seismic analysis of the Pamban Bridge, calculating the forces on piers and checking their capacity to resist horizontal earthquake loading.

*The Indian seismic code (IS 1893) divides India into four zones. Pamban is in Zone III (moderate risk). The design seismic acceleration for Zone III is about 0.16g — every pier must resist a horizontal force equal to 16% of the structure's weight.*`,
      analogy: 'Imagine shaking a table with a stack of books on it. Light books barely move (low inertia). Heavy books slide and fall (high inertia). The force on each book = its mass x the table acceleration. Similarly, each bridge pier feels a seismic force proportional to the weight it supports times the ground acceleration.',
      storyConnection: 'The 2004 Indian Ocean tsunami devastated the coast near Rameswaram, and while the Pamban Bridge survived, it highlighted the need for seismic and tsunami resilience. The bridge underwent a seismic assessment and strengthening programme, with improved pier foundations and connections designed to resist both earthquake shaking and tsunami wave forces.',
      checkQuestion: 'A pier supports 500 tons of bridge deck. If the seismic acceleration is 0.16g, what is the horizontal seismic force on the pier?',
      checkAnswer: 'F = m x a = 500,000 kg x 0.16 x 9.81 m/s squared = 784,800 N = 785 kN. This is a significant horizontal force that the pier must resist through its foundation. For comparison, a major cyclone wind load on the same pier might be 200-400 kN — the earthquake is potentially more demanding.',
      codeIntro: 'Perform a seismic analysis of the Pamban Bridge piers.',
      code: `import numpy as np

def seismic_force(mass_kg, zone_factor, importance_factor=1.5,
                  response_reduction=3.0, soil_factor=1.0):
    """Calculate horizontal seismic force per IS 1893.
    zone_factor: Z (0.10 for Zone II, 0.16 for Zone III, 0.24 for IV)
    importance_factor: I (1.5 for bridges)
    response_reduction: R (3.0 for unreinforced masonry, 5.0 for ductile frames)
    """
    Ah = (zone_factor * importance_factor) / (2 * response_reduction) * soil_factor
    # Ah should not exceed a maximum
    Ah = min(Ah, zone_factor * importance_factor / 2)
    F = mass_kg * 9.81 * Ah
    return F, Ah

def response_spectrum(period_s, zone_factor, soil_type="medium"):
    """Design response spectrum acceleration (Sa/g) per IS 1893."""
    if soil_type == "rock":
        if period_s < 0.10:
            Sa_g = 1 + 15 * period_s
        elif period_s < 0.40:
            Sa_g = 2.5
        else:
            Sa_g = 1.0 / period_s
    elif soil_type == "medium":
        if period_s < 0.10:
            Sa_g = 1 + 15 * period_s
        elif period_s < 0.55:
            Sa_g = 2.5
        else:
            Sa_g = 1.36 / period_s
    else:  # soft
        if period_s < 0.10:
            Sa_g = 1 + 15 * period_s
        elif period_s < 0.67:
            Sa_g = 2.5
        else:
            Sa_g = 1.67 / period_s

    return Sa_g * zone_factor / 2

# Pamban Bridge seismic analysis
print("=== Pamban Bridge Seismic Analysis ===")
print("Location: Zone III (Z = 0.16)")
print("Importance factor: 1.5 (lifeline bridge)")
print()

# Pier data
piers = [
    {"name": "Standard pier", "mass_support_kg": 400000, "height_m": 12, "width_m": 3},
    {"name": "Deep water pier", "mass_support_kg": 500000, "height_m": 15, "width_m": 4},
    {"name": "Bascule pier", "mass_support_kg": 600000, "height_m": 14, "width_m": 5},
]

Z = 0.16
I = 1.5
R = 3.0

header = "Pier Type           Mass(ton)  Seismic F(kN)  Overturning M(kN*m)  Status"
print(header)
print("-" * len(header))

for p in piers:
    F, Ah = seismic_force(p["mass_support_kg"], Z, I, R)
    # Overturning moment = F * height / 2 (approx)
    M_overturn = F * p["height_m"] / 2

    # Stabilizing moment = pier self-weight * width / 2
    pier_self_weight = p["width_m"] * p["width_m"] * p["height_m"] * 2400 * 9.81
    M_stable = pier_self_weight * p["width_m"] / 2

    fos = M_stable / M_overturn if M_overturn > 0 else float('inf')
    status = "SAFE" if fos > 1.5 else "MARGINAL" if fos > 1.0 else "UNSAFE"

    print(f"{p['name']:<20} {p['mass_support_kg']/1000:>7.0f}    {F/1000:>11.0f}    "
          f"{M_overturn/1000:>17.0f}    {status} (FOS={fos:.2f})")

# Response spectrum
print()
print("=== Design Response Spectrum (Zone III, Medium Soil) ===")
print()

header2 = "Period(s)   Sa/g     Spectral Accel(m/s2)"
print(header2)
print("-" * len(header2))

for T in [0.05, 0.1, 0.2, 0.3, 0.5, 0.7, 1.0, 1.5, 2.0, 3.0]:
    Sa = response_spectrum(T, Z, "medium")
    accel = Sa * 9.81
    bar = "#" * int(Sa * 50)
    print(f"{T:>8.2f}    {Sa:>5.3f}    {accel:>18.3f}    {bar}")

print()
print("Peak acceleration at T = 0.1-0.55s matches the bridge's")
print("natural period range -- this is the most critical zone.")`,
      challenge: 'Add a tsunami load analysis: a 3-metre tsunami wave hitting the piers creates a horizontal force F = 0.5 * rho_water * g * h^2 * Cd * b (hydrostatic + drag). Compare tsunami forces to seismic forces. Which is the dominant hazard for the Pamban Bridge?',
      successHint: 'You just performed a seismic assessment following the Indian Standards code. The same approach is used for every structure in earthquake-prone regions worldwide. Seismic design is one of the most important areas of structural engineering, protecting billions of people from earthquake damage.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Fatigue, corrosion, and maintenance engineering</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises model fatigue life, corrosion, maintenance scheduling, and seismic analysis.
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
