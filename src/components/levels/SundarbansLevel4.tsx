import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function SundarbansLevel4() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Water treatment plant — intake and pre-treatment simulation',
      concept: `A complete water treatment system starts with **pre-treatment**: removing suspended solids, organic matter, and large particles before the water reaches the RO membranes. Without pre-treatment, membranes clog rapidly (fouling).

The **Silt Density Index (SDI)** measures water quality before the membrane. SDI < 3 is acceptable for RO; SDI > 5 means aggressive pre-treatment is needed. Pre-treatment steps include: coagulation/flocculation (chemicals clump particles), sedimentation (gravity settles clumps), and media filtration (sand/gravel catches remaining particles).

In the code below, you will simulate the entire pre-treatment chain, tracking how each step reduces turbidity, SDI, and organic content.`,
      analogy: 'Pre-treatment is like washing vegetables before cooking. You rinse off the dirt (sedimentation), scrub off stubborn spots (filtration), and maybe soak in vinegar (chemical treatment). Skipping these steps does not just make the food dirty — it can damage your cooking equipment (membrane fouling).',
      storyConnection: 'Sundarbans water is heavily loaded with silt from the Ganges-Brahmaputra delta — some of the most sediment-rich water on Earth. Any desalination system here must handle turbidity levels that would destroy an unprotected membrane in hours. The mangrove itself pre-filters water through its root mat and soil, which traps sediment before water reaches the root cell membranes.',
      checkQuestion: 'If raw Sundarbans water has turbidity of 200 NTU, coagulation reduces it by 80%, sedimentation by 70% of the remainder, and sand filtration by 90% of the remainder, what is the final turbidity?',
      checkAnswer: 'After coagulation: 200 * 0.2 = 40 NTU. After sedimentation: 40 * 0.3 = 12 NTU. After sand filtration: 12 * 0.1 = 1.2 NTU. Three stages reduced 200 NTU to 1.2 NTU — a 99.4% reduction. This is low enough for RO membranes.',
      codeIntro: 'Simulate a complete pre-treatment chain for Sundarbans brackish water.',
      code: `import numpy as np

# Water treatment pre-treatment simulation

class WaterQuality:
    def __init__(self, turbidity_NTU, SDI, TOC_mgL, salinity_gL,
                 bacteria_cfu, volume_L):
        self.turbidity = turbidity_NTU
        self.SDI = SDI
        self.TOC = TOC_mgL      # total organic carbon
        self.salinity = salinity_gL
        self.bacteria = bacteria_cfu
        self.volume = volume_L

    def report(self, stage_name):
        print(f"  Turbidity: {self.turbidity:>8.1f} NTU")
        print(f"  SDI:       {self.SDI:>8.1f}")
        print(f"  TOC:       {self.TOC:>8.1f} mg/L")
        print(f"  Salinity:  {self.salinity:>8.1f} g/L")
        print(f"  Bacteria:  {self.bacteria:>8.0f} CFU/mL")
        print(f"  Volume:    {self.volume:>8.0f} L")

def coagulation(water, dose_mgL=30):
    """Coagulation with ferric chloride"""
    w = WaterQuality(
        turbidity_NTU=water.turbidity * 0.20,
        SDI=water.SDI * 0.40,
        TOC_mgL=water.TOC * 0.50,
        salinity_gL=water.salinity,
        bacteria_cfu=water.bacteria * 0.60,
        volume_L=water.volume * 0.98,  # small volume loss
    )
    return w

def sedimentation(water, detention_hours=2):
    """Gravity sedimentation basin"""
    efficiency = min(0.90, detention_hours * 0.35)
    w = WaterQuality(
        turbidity_NTU=water.turbidity * (1 - efficiency * 0.8),
        SDI=water.SDI * (1 - efficiency * 0.6),
        TOC_mgL=water.TOC * 0.85,
        salinity_gL=water.salinity,
        bacteria_cfu=water.bacteria * 0.70,
        volume_L=water.volume * 0.95,  # sludge removal
    )
    return w

def sand_filtration(water):
    """Dual-media sand/anthracite filter"""
    w = WaterQuality(
        turbidity_NTU=water.turbidity * 0.10,
        SDI=water.SDI * 0.30,
        TOC_mgL=water.TOC * 0.70,
        salinity_gL=water.salinity,
        bacteria_cfu=water.bacteria * 0.10,
        volume_L=water.volume * 0.97,
    )
    return w

def cartridge_filter(water):
    """5-micron cartridge filter (final polish)"""
    w = WaterQuality(
        turbidity_NTU=max(0.1, water.turbidity * 0.20),
        SDI=max(1.0, water.SDI * 0.50),
        TOC_mgL=water.TOC * 0.90,
        salinity_gL=water.salinity,
        bacteria_cfu=water.bacteria * 0.30,
        volume_L=water.volume * 0.99,
    )
    return w

# Raw Sundarbans water
raw = WaterQuality(
    turbidity_NTU=250,
    SDI=25,
    TOC_mgL=12,
    salinity_gL=15,
    bacteria_cfu=50000,
    volume_L=10000,
)

print("=== Water Treatment Pre-Treatment Chain ===")
print("\\n[Stage 0] Raw Sundarbans Water")
raw.report("Raw")

stages = [
    ("Coagulation/Flocculation", coagulation),
    ("Sedimentation Basin", sedimentation),
    ("Sand Filtration", sand_filtration),
    ("Cartridge Filter", cartridge_filter),
]

water = raw
for i, (name, func) in enumerate(stages, 1):
    water = func(water)
    print(f"\\n[Stage {i}] After {name}")
    water.report(name)

# Check if water is RO-ready
print()
print("=== RO Feed Water Quality Check ===")
checks = [
    ("Turbidity < 1 NTU", water.turbidity < 1),
    ("SDI < 3", water.SDI < 3),
    ("TOC < 3 mg/L", water.TOC < 3),
]
all_pass = True
for desc, passed in checks:
    status = "PASS" if passed else "FAIL"
    print(f"  {desc}: {status}")
    if not passed:
        all_pass = False

print(f"\\nWater is {'READY' if all_pass else 'NOT READY'} for RO membranes.")
print(f"Volume recovered: {water.volume/raw.volume*100:.1f}% of intake")`,
      challenge: 'Raw water quality varies with monsoon/dry season. Try turbidity of 500 NTU (monsoon flood) and 50 NTU (dry season). Does the same treatment chain work for both? What adjustments would you make for monsoon conditions?',
      successHint: 'You just simulated a real water treatment plant. Every municipal water system follows this same logic: measure quality at each stage, verify against limits, and only proceed when the water meets the next stage\'s requirements. This systematic approach prevents costly membrane damage.',
    },
    {
      title: 'RO membrane array — parallel and series configurations',
      concept: `A single RO membrane module cannot produce enough water for a village. Multiple modules are arranged in **arrays**: modules in **parallel** increase total flow (capacity), while modules in **series** increase salt rejection (quality).

In a typical 2-stage array, the first stage operates at moderate recovery (40-50%). The concentrate (brine) from the first stage feeds the second stage, which extracts more water. This **concentrate staging** increases overall recovery from 40% to 70-75%.

The design equations are: **Total flow = N_parallel * Flow_per_module** and **Total rejection = 1 - (1-r)^N_series** for series staging.`,
      analogy: 'Think of lanes on a highway. Adding parallel lanes increases traffic capacity (more cars per hour). Making the highway longer (series) does not increase capacity but ensures every car completes the full journey. A membrane array uses both strategies: parallel for volume, series for quality.',
      storyConnection: 'A Sundarbans village RO system typically uses 2-4 membrane modules in a compact array. The first module handles the bulk of desalination; a second module treats the concentrate to recover additional water. This two-stage design reduces brine waste — important in an ecosystem where concentrated brine discharge could harm the mangrove habitat.',
      checkQuestion: 'If one module produces 500 L/h and rejects 98% of salt, what do 3 modules in parallel produce? What is the rejection of 2 modules in series?',
      checkAnswer: 'Parallel: 3 * 500 = 1,500 L/h (triple the flow, same rejection). Series: rejection = 1 - (1-0.98)^2 = 1 - 0.0004 = 99.96% (higher purity, same flow per path).',
      codeIntro: 'Design and simulate an RO membrane array with parallel and series configurations.',
      code: `import numpy as np

class ROModule:
    def __init__(self, name, area_m2=37, permeability=3.5, rejection=0.985):
        self.name = name
        self.area = area_m2
        self.A = permeability  # L/m2/h/atm
        self.rejection = rejection

    def process(self, feed_salinity_gL, pressure_atm, feed_flow_Lh):
        """Process water through this module"""
        M = feed_salinity_gL / 58.44
        P_osmotic = 2 * M * 0.0821 * 298
        net_P = max(0, pressure_atm - P_osmotic)
        flux = self.A * net_P
        permeate_flow = min(flux * self.area, feed_flow_Lh * 0.5)
        permeate_salt = feed_salinity_gL * (1 - self.rejection)
        concentrate_flow = feed_flow_Lh - permeate_flow
        if concentrate_flow > 0:
            concentrate_salt = (feed_salinity_gL * feed_flow_Lh -
                               permeate_salt * permeate_flow) / concentrate_flow
        else:
            concentrate_salt = feed_salinity_gL
        return {
            "permeate_flow": permeate_flow,
            "permeate_salt": permeate_salt,
            "concentrate_flow": concentrate_flow,
            "concentrate_salt": concentrate_salt,
            "recovery": permeate_flow / feed_flow_Lh * 100,
        }

# System design
feed_salinity = 15.0  # g/L (Sundarbans brackish)
pressure = 20         # atm
feed_flow = 2000      # L/h

print("=== Single Module Performance ===")
mod = ROModule("Module-1")
result = mod.process(feed_salinity, pressure, feed_flow)
print(f"Feed: {feed_salinity} g/L at {feed_flow} L/h, {pressure} atm")
print(f"Permeate: {result['permeate_flow']:.0f} L/h at {result['permeate_salt']:.3f} g/L")
print(f"Concentrate: {result['concentrate_flow']:.0f} L/h at {result['concentrate_salt']:.1f} g/L")
print(f"Recovery: {result['recovery']:.1f}%")

# Parallel array: 3 modules
print()
print("=== 3 Modules in Parallel ===")
total_permeate = 0
total_salt_mass = 0
per_module_flow = feed_flow / 3

for i in range(3):
    m = ROModule(f"P-{i+1}")
    r = m.process(feed_salinity, pressure, per_module_flow)
    total_permeate += r["permeate_flow"]
    total_salt_mass += r["permeate_salt"] * r["permeate_flow"]

avg_salt = total_salt_mass / total_permeate if total_permeate > 0 else 0
print(f"Total permeate: {total_permeate:.0f} L/h")
print(f"Average permeate salt: {avg_salt:.3f} g/L")
print(f"System recovery: {total_permeate/feed_flow*100:.1f}%")

# Two-stage concentrate staging
print()
print("=== 2-Stage Concentrate Staging ===")
stage1 = ROModule("Stage-1", area_m2=37 * 3)  # 3 modules
r1 = stage1.process(feed_salinity, pressure, feed_flow)
print(f"Stage 1: {r1['permeate_flow']:.0f} L/h permeate, "
      f"{r1['concentrate_flow']:.0f} L/h concentrate at {r1['concentrate_salt']:.1f} g/L")

stage2 = ROModule("Stage-2", area_m2=37 * 2)  # 2 modules
r2 = stage2.process(r1["concentrate_salt"], pressure + 5, r1["concentrate_flow"])
print(f"Stage 2: {r2['permeate_flow']:.0f} L/h permeate, "
      f"{r2['concentrate_flow']:.0f} L/h concentrate at {r2['concentrate_salt']:.1f} g/L")

total_perm = r1["permeate_flow"] + r2["permeate_flow"]
total_recovery = total_perm / feed_flow * 100
blended_salt = (r1["permeate_salt"] * r1["permeate_flow"] +
                r2["permeate_salt"] * r2["permeate_flow"]) / total_perm
print(f"\\nTotal: {total_perm:.0f} L/h at {blended_salt:.3f} g/L")
print(f"System recovery: {total_recovery:.1f}% (vs {r1['recovery']:.1f}% single-stage)")`,
      challenge: 'Add a third stage to treat Stage 2 concentrate. What recovery can you achieve? At what point does the brine become too concentrated for practical membrane operation? Calculate the brine disposal volume for 2-stage vs 3-stage designs.',
      successHint: 'Membrane array design is a core skill in water engineering. The same staging concepts apply to chemical plants, refineries, and pharmaceutical manufacturing — anywhere you need to separate mixtures at scale.',
    },
    {
      title: 'Energy recovery and system efficiency',
      concept: `The concentrate (brine) leaving an RO system is still at high pressure. An **energy recovery device (ERD)** captures this pressure energy and transfers it to incoming feed water, dramatically reducing the pump\'s energy consumption.

Modern ERDs recover **95-98%** of the brine's hydraulic energy. This single innovation reduced desalination energy from 8-10 kWh/m3 in the 1990s to 2-3 kWh/m3 today — the biggest single improvement in desalination history.

The energy balance is: **Net energy = Pump energy - Recovered energy**. Specific energy consumption (SEC) = Net energy / Permeate volume.`,
      analogy: 'An ERD is like regenerative braking in an electric car. When you brake, instead of wasting kinetic energy as heat, the motor runs in reverse and charges the battery. Similarly, instead of wasting the brine\'s pressure energy through a valve, the ERD captures it and reuses it to pressurize incoming feed water.',
      storyConnection: 'Small Sundarbans RO units typically cannot afford expensive ERDs, so they waste the brine pressure energy. This makes their specific energy consumption 5-8 kWh/m3 — two to three times higher than a large plant with ERDs. Solar-powered units partially compensate by using free solar energy, but the panels must be larger to make up for the inefficiency.',
      checkQuestion: 'If a pump pressurizes 100 L/h to 60 atm and the brine exits at 58 atm (2 atm pressure drop across membranes), what fraction of pump energy can theoretically be recovered?',
      checkAnswer: 'Recovery fraction = 58/60 = 96.7%. Almost all the pump energy is in the brine. An ERD recovering 95% of this means net energy recovery = 0.967 * 0.95 = 91.8% of the brine stream energy. This is why ERDs are transformative.',
      codeIntro: 'Simulate the energy balance of an RO system with and without energy recovery.',
      code: `import numpy as np

def ro_energy_balance(
    feed_flow_Lh,
    feed_pressure_atm,
    recovery_pct,
    membrane_dP_atm=2,    # pressure drop across membrane
    pump_efficiency=0.85,
    erd_efficiency=0.0,    # 0 = no ERD
):
    """Calculate energy balance for an RO system"""
    recovery = recovery_pct / 100
    permeate_flow = feed_flow_Lh * recovery
    brine_flow = feed_flow_Lh * (1 - recovery)
    brine_pressure = feed_pressure_atm - membrane_dP_atm

    # Pump energy (atm * L/h -> kW)
    # 1 atm*L = 101.325 J
    pump_power_w = (feed_pressure_atm * feed_flow_Lh * 101.325) / (pump_efficiency * 3600)

    # Energy recovered from brine
    erd_power_w = (brine_pressure * brine_flow * 101.325 * erd_efficiency) / 3600

    net_power_w = pump_power_w - erd_power_w

    # Specific energy (kWh per m3 of permeate)
    sec = net_power_w / (permeate_flow / 1000)  # W / (m3/h) = Wh/m3

    return {
        "pump_kw": pump_power_w / 1000,
        "erd_kw": erd_power_w / 1000,
        "net_kw": net_power_w / 1000,
        "sec_kwh_m3": sec / 1000,
        "permeate_m3h": permeate_flow / 1000,
        "brine_m3h": brine_flow / 1000,
    }

# System parameters
feed = 5000  # L/h
pressure = 60  # atm (seawater)
recovery = 45  # %

print("=== Energy Balance: Without ERD ===")
no_erd = ro_energy_balance(feed, pressure, recovery, erd_efficiency=0.0)
print(f"Pump power:     {no_erd['pump_kw']:.2f} kW")
print(f"ERD recovery:   {no_erd['erd_kw']:.2f} kW")
print(f"Net power:      {no_erd['net_kw']:.2f} kW")
print(f"SEC:            {no_erd['sec_kwh_m3']:.2f} kWh/m3")
print(f"Permeate:       {no_erd['permeate_m3h']:.2f} m3/h")

print()
print("=== Energy Balance: With 95% ERD ===")
with_erd = ro_energy_balance(feed, pressure, recovery, erd_efficiency=0.95)
print(f"Pump power:     {with_erd['pump_kw']:.2f} kW")
print(f"ERD recovery:   {with_erd['erd_kw']:.2f} kW")
print(f"Net power:      {with_erd['net_kw']:.2f} kW")
print(f"SEC:            {with_erd['sec_kwh_m3']:.2f} kWh/m3")

savings = (1 - with_erd['sec_kwh_m3'] / no_erd['sec_kwh_m3']) * 100
print(f"\\nEnergy savings with ERD: {savings:.0f}%")

# Compare across different system sizes
print()
print("=== System Size vs Efficiency ===")
print(f"{'Flow (L/h)':>12} {'No ERD':>10} {'With ERD':>10} {'Savings':>10}")
print(f"{'':>12} {'(kWh/m3)':>10} {'(kWh/m3)':>10} {'(%)':>10}")
print("-" * 44)

for flow in [100, 500, 1000, 5000, 20000]:
    ne = ro_energy_balance(flow, pressure, recovery, erd_efficiency=0)
    we = ro_energy_balance(flow, pressure, recovery, erd_efficiency=0.95)
    sav = (1 - we['sec_kwh_m3'] / ne['sec_kwh_m3']) * 100
    print(f"{flow:>12} {ne['sec_kwh_m3']:>8.2f} {we['sec_kwh_m3']:>8.2f} {sav:>8.0f}%")

# Daily cost comparison
print()
kwh_cost = 0.10  # USD per kWh
daily_m3 = 10  # village demand
cost_no = no_erd['sec_kwh_m3'] * daily_m3 * kwh_cost
cost_erd = with_erd['sec_kwh_m3'] * daily_m3 * kwh_cost
annual_save = (cost_no - cost_erd) * 365
print(f"Daily energy cost (no ERD):  " + f"USD {cost_no:.2f}")
print(f"Daily energy cost (with ERD): " + f"USD {cost_erd:.2f}")
print(f"Annual savings: " + f"USD {annual_save:.0f}")`,
      challenge: 'An ERD costs about $5,000 for a small system. Given the annual energy savings you calculated, what is the payback period? Is it worth it for a small Sundarbans village system vs a large municipal plant?',
      successHint: 'Energy recovery transformed the economics of desalination. The same principle — capturing waste energy and reusing it — applies to industrial processes, HVAC systems, and even computing (waste heat recovery). Always ask: where is energy being wasted, and can it be captured?',
    },
    {
      title: 'Brine management and environmental impact',
      concept: `For every litre of fresh water produced, 1-2 litres of concentrated brine are generated. This brine typically has **twice the salinity** of the feed water, plus concentrated chemicals from pre-treatment. Discharging this into the Sundarbans ecosystem could devastate the mangrove habitat.

Brine management options include: **dilution** (mixing with a large volume of seawater before discharge), **evaporation ponds** (solar evaporation to crystallize salt), **zero liquid discharge (ZLD)** (evaporating all water and recovering solid salt), and **brine mining** (extracting valuable minerals like magnesium and lithium).

The environmental impact depends on the **dilution ratio**: if brine at 70 g/L is discharged into water at 35 g/L, the mixing zone where salinity exceeds 40 g/L can extend hundreds of metres from the outfall.`,
      analogy: 'Brine discharge is like exhaust from a car. The car (RO plant) does useful work, but produces waste (brine) that harms the surroundings. You can install a catalytic converter (treatment), dilute the exhaust with fresh air (dilution), or design a zero-emission vehicle (ZLD). Each option has different costs and effectiveness.',
      storyConnection: 'The Sundarbans is a UNESCO World Heritage Site and the world\'s largest mangrove forest. Discharging concentrated brine here could kill mangrove seedlings (which are more salt-sensitive than mature trees), harm fish nurseries, and alter the delicate salinity balance that supports the entire ecosystem. Any desalination system here must have a responsible brine management plan.',
      checkQuestion: 'An RO system produces 5 m3/day of brine at 70 g/L. If you need to dilute it to 40 g/L using seawater at 35 g/L, how much seawater is needed?',
      checkAnswer: 'Mass balance: 5 * 70 + V * 35 = (5 + V) * 40. So 350 + 35V = 200 + 40V. Thus 5V = 150, V = 30 m3. You need 30 m3 of seawater to dilute 5 m3 of brine — a 6:1 ratio. This is a lot of seawater and still results in elevated salinity.',
      codeIntro: 'Model brine dispersion in a Sundarbans tidal channel and evaluate management options.',
      code: `import numpy as np

# Brine management simulation

def brine_dilution_zone(brine_flow_m3h, brine_salinity_gL,
                        ambient_salinity_gL, channel_flow_m3h,
                        channel_width_m, threshold_gL):
    """Model brine mixing in a tidal channel"""
    # Initial dilution at discharge point
    initial_dilution = channel_flow_m3h / brine_flow_m3h
    mixed_salinity = (brine_salinity_gL * brine_flow_m3h +
                      ambient_salinity_gL * channel_flow_m3h) / (brine_flow_m3h + channel_flow_m3h)

    # Plume dispersion (simplified Gaussian model)
    distances = np.arange(0, 500, 10)  # metres from outfall
    dispersion_coeff = 0.1  # m2/s (tidal mixing)
    flow_speed = channel_flow_m3h / (channel_width_m * 2 * 3600)  # m/s

    results = []
    for d in distances:
        if flow_speed > 0:
            travel_time = d / flow_speed
            spread = np.sqrt(2 * dispersion_coeff * travel_time) if travel_time > 0 else 0.1
        else:
            spread = 0.1

        dilution_factor = max(1, d / 10)
        local_salinity = ambient_salinity_gL + (brine_salinity_gL - ambient_salinity_gL) / dilution_factor
        results.append({"distance": d, "salinity": local_salinity, "spread": spread})

    # Find distance where salinity drops below threshold
    safe_distance = 0
    for r in results:
        if r["salinity"] > threshold_gL:
            safe_distance = r["distance"]

    return results, safe_distance, mixed_salinity

# Sundarbans scenario
brine_flow = 0.5   # m3/h
brine_salt = 30.0   # g/L (brackish water brine, not seawater)
ambient = 15.0      # g/L (Sundarbans average)
channel_flow = 100  # m3/h
channel_width = 20  # m
threshold = 20.0    # g/L (10% above ambient as safety limit)

results, safe_dist, mixed = brine_dilution_zone(
    brine_flow, brine_salt, ambient, channel_flow, channel_width, threshold)

print("=== Brine Dispersion Model ===")
print(f"Brine: {brine_flow} m3/h at {brine_salt} g/L")
print(f"Channel: {channel_flow} m3/h at {ambient} g/L")
print(f"Safety threshold: {threshold} g/L")
print()

print(f"{'Distance (m)':>12} {'Salinity (g/L)':>14} {'Status':<10}")
print("-" * 38)
for r in results[::5]:  # every 50m
    status = "EXCEED" if r["salinity"] > threshold else "OK"
    print(f"{r['distance']:>12} {r['salinity']:>12.1f} {status:<10}")

print(f"\\nSafe distance from outfall: {safe_dist} m")

# Compare management options
print()
print("=== Brine Management Options ===")
daily_brine_m3 = brine_flow * 8  # 8 operating hours

options = [
    ("Direct discharge", 0, "Cheapest, highest impact"),
    ("Dilution mixing (10:1)", daily_brine_m3 * 0.5, "Moderate cost, lower impact"),
    ("Evaporation pond", daily_brine_m3 * 2, "Land-intensive, zero discharge"),
    ("Zero Liquid Discharge", daily_brine_m3 * 15, "Expensive, zero waste"),
]

print(f"Daily brine volume: {daily_brine_m3:.1f} m3")
print()
print(f"{'Option':<28} {'Cost ($/m3)':>12} {'Notes':<30}")
print("-" * 72)

costs = [0, 0.50, 2.00, 15.00]
for (name, extra_water, notes), cost in zip(options, costs):
    daily_cost = cost * daily_brine_m3
    print(f"{name:<28} {cost:>10.2f} {notes:<30}")

# Salt recovery potential
print()
salt_recovered_kg = daily_brine_m3 * brine_salt  # kg
print(f"Salt recoverable from brine: {salt_recovered_kg:.0f} kg/day")
print(f"At USD 0.10/kg, revenue: " + f"USD {salt_recovered_kg * 0.10:.1f}/day")
print("Brine mining can offset disposal costs!")`,
      challenge: 'Model a worst-case scenario: discharge during low tide (channel flow drops to 20 m3/h) and neap tide (minimal mixing). How far does the high-salinity plume extend? Design a discharge schedule that only releases brine during high-flow periods to minimize impact.',
      successHint: 'Environmental impact assessment is a required part of every real desalination project. The same dispersion modeling you just did is used for wastewater outfalls, industrial discharge, and even atmospheric pollution. Responsible engineering always accounts for waste.',
    },
    {
      title: 'Complete system simulation — 24-hour operation cycle',
      concept: `A real water treatment system does not run at steady state. Solar power varies with sun angle, tidal salinity fluctuates, water demand peaks at morning and evening, and membrane performance degrades during the day as fouling accumulates.

A complete simulation models these **time-varying inputs** hour by hour: solar irradiance determines available power, salinity determines required pressure, demand determines required production rate, and the controller adjusts operating parameters to balance all three.

In the code below, you will simulate a full 24-hour cycle of a solar-powered Sundarbans desalination system, tracking energy, water production, storage tank level, and membrane performance.`,
      analogy: 'Running a desalination plant is like managing a restaurant. Lunch rush (peak demand) needs maximum kitchen output. Early morning is prep time (tank filling). Late evening is cleanup (membrane flushing). The chef (controller) must balance ingredient availability (solar energy), customer flow (demand), and kitchen equipment limits (membrane capacity) throughout the day.',
      storyConnection: 'In the Sundarbans, the twice-daily tides create a unique challenge: salinity can swing from 5 g/L at low tide (freshwater inflow from rivers) to 25 g/L at high tide (seawater intrusion) within six hours. A smart RO system would ramp up production during low tide (lower salinity = less energy needed) and throttle back during high tide — working with nature rather than against it.',
      checkQuestion: 'If solar panels produce power from 7 AM to 5 PM (10 hours) but the village needs water 24 hours a day, what minimum storage tank size is needed?',
      checkAnswer: 'If daily demand is 10 m3 and production hours are 10, the system produces 1 m3/h. The 14 non-production hours need 14/24 * 10 = 5.83 m3 from storage. Add 20% buffer: tank = 7 m3. Alternatively, produce all 10 m3 in 10 hours (1 m3/h) and store enough for overnight use.',
      codeIntro: 'Simulate a complete 24-hour operation cycle of a solar-powered Sundarbans RO system.',
      code: `import numpy as np

# 24-hour system simulation

def solar_irradiance(hour):
    """Solar power availability (kW/m2) by hour"""
    if hour < 6 or hour > 18:
        return 0.0
    # Bell curve centered at noon
    return 0.9 * np.exp(-((hour - 12) / 3.5) ** 2)

def tidal_salinity(hour):
    """Sundarbans salinity (g/L) varying with 12.4-hour tidal cycle"""
    # Two high tides per day
    base = 12.0
    amplitude = 8.0
    return base + amplitude * np.sin(2 * np.pi * hour / 12.4)

def village_demand(hour):
    """Water demand (L/h) by hour"""
    # Peaks at 7 AM and 6 PM
    base = 200
    morning = 400 * np.exp(-((hour - 7) / 1.5) ** 2)
    evening = 350 * np.exp(-((hour - 18) / 1.5) ** 2)
    return base + morning + evening

# System parameters
panel_area_m2 = 30       # solar panel area
panel_eff = 0.18         # panel efficiency
membrane_area_m2 = 20    # total membrane area
membrane_A = 3.5         # L/m2/h/atm
max_pressure_atm = 25    # maximum pump pressure
tank_capacity_L = 8000   # storage tank
tank_level_L = 4000      # starting level (50% full)

print("=== 24-Hour System Simulation ===")
print(f"{'Hour':>4} {'Solar':>7} {'Salt':>7} {'Demand':>7} {'Produced':>9} {'Tank':>7} {'Status':<12}")
print(f"{'':>4} {'(kW)':>7} {'(g/L)':>7} {'(L/h)':>7} {'(L/h)':>9} {'(L)':>7}")
print("-" * 60)

total_produced = 0
total_demand = 0
total_energy = 0
min_tank = tank_level_L
hours_short = 0

for hour in range(24):
    # Inputs
    irr = solar_irradiance(hour)
    salt = tidal_salinity(hour)
    demand = village_demand(hour)

    # Available power
    solar_kw = irr * panel_area_m2 * panel_eff

    # Required pressure (based on salinity)
    M = max(0.01, salt / 58.44)
    P_osmotic = 2 * M * 0.0821 * 298
    P_operating = min(P_osmotic * 1.8, max_pressure_atm)

    # Power needed for pump (kW)
    # Will calculate max flow from available power
    if solar_kw > 0 and P_operating > P_osmotic:
        net_P = P_operating - P_osmotic
        flux = membrane_A * net_P
        max_production = flux * membrane_area_m2

        # Power limit: can we afford this production?
        pump_power_needed = P_operating * max_production * 101.325 / (0.85 * 3.6e6)
        if pump_power_needed > solar_kw:
            # Scale down production to match power
            max_production = solar_kw * 0.85 * 3.6e6 / (P_operating * 101.325)
        produced = max(0, max_production)
    else:
        produced = 0
        pump_power_needed = 0

    # Update tank
    tank_level_L += produced - demand
    tank_level_L = min(tank_level_L, tank_capacity_L)

    status = "OK"
    if tank_level_L < 500:
        status = "LOW TANK!"
        hours_short += 1
    if tank_level_L <= 0:
        status = "EMPTY!"
        tank_level_L = 0

    min_tank = min(min_tank, tank_level_L)
    total_produced += produced
    total_demand += demand
    total_energy += solar_kw

    print(f"{hour:>4} {solar_kw:>6.2f} {salt:>6.1f} {demand:>6.0f} {produced:>8.0f} {tank_level_L:>6.0f} {status:<12}")

print()
print("=== Daily Summary ===")
print(f"Total produced:  {total_produced:,.0f} L")
print(f"Total demand:    {total_demand:,.0f} L")
print(f"Balance:         {total_produced - total_demand:+,.0f} L")
print(f"Min tank level:  {min_tank:,.0f} L")
print(f"Hours short:     {hours_short}")
print(f"Solar energy:    {total_energy:.1f} kWh")

if total_produced >= total_demand:
    print("\\nSystem MEETS daily demand!")
else:
    deficit = total_demand - total_produced
    print(f"\\nSystem SHORT by {deficit:.0f} L/day.")
    extra_panels = deficit * 0.003 / panel_eff  # rough estimate
    print(f"Need ~{extra_panels:.0f} m2 more solar panels.")`,
      challenge: 'Modify the simulation for monsoon conditions: reduce solar irradiance by 50% (cloud cover) but reduce salinity by 60% (freshwater flooding). Does the system still meet demand? What about a cyclone day with zero solar and maximum salinity? Design a battery backup to handle 2 days without sun.',
      successHint: 'You just built a full dynamic system simulation — the same approach used to design power grids, water distribution networks, and manufacturing plants. The key insight: real systems must handle time-varying inputs, not just steady-state conditions. Designing for the worst hour, not the average, is what separates reliable engineering from theoretical calculations.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Capstone
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Build a complete water treatment simulation</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises build a complete water treatment simulation from intake to distribution, integrating all concepts from Levels 1-3.
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
