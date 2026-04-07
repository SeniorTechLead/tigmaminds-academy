import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function SundarbansLevel2() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Reverse osmosis — forcing water against its natural direction',
      concept: `In natural osmosis, water flows from low solute to high solute. **Reverse osmosis (RO)** flips this: by applying pressure *greater* than the osmotic pressure, we force water from the salty side to the fresh side, leaving salt behind.

The minimum pressure needed equals the osmotic pressure of the feed water. For seawater at 0.6 M NaCl, that is about 27 atm. Real RO plants operate at 50-80 atm to achieve practical flow rates. The excess pressure above the osmotic threshold is called **net driving pressure** and determines how fast water permeates the membrane.

In the code below, you will calculate the net driving pressure and water flux through an RO membrane at different operating pressures, and see why there is a diminishing return — doubling the pressure does not double the output.`,
      analogy: 'Imagine squeezing a wet sponge through a fine mesh. The mesh lets water through but holds back the sponge material. The harder you squeeze (more pressure), the more water comes out — but at some point, squeezing harder barely helps because the mesh itself limits flow. That limiting factor is the membrane\'s permeability.',
      storyConnection: 'Sundarbans communities have limited access to fresh water despite being surrounded by water. Some villages now use small-scale RO units powered by solar panels to desalinate brackish river water. The same principle the mangrove root uses passively, these machines achieve mechanically — filtering salt from water using pressure across a membrane.',
      checkQuestion: 'If seawater has an osmotic pressure of 27 atm and an RO plant operates at 60 atm, what is the net driving pressure?',
      checkAnswer: 'Net driving pressure = Applied pressure - Osmotic pressure = 60 - 27 = 33 atm. This 33 atm is the "useful" pressure that actually pushes water through the membrane. The first 27 atm just overcomes osmosis — it produces zero output.',
      codeIntro: 'Calculate water flux through an RO membrane at different operating pressures.',
      code: `import numpy as np

# Reverse osmosis water flux calculator
# J = A * (P_applied - P_osmotic)
# J = water flux (L/m2/h)
# A = membrane permeability (L/m2/h/atm)

# Membrane properties
A_permeability = 3.5  # typical RO membrane (L/m2/h/atm)

# Osmotic pressure calculation
R = 0.0821  # L atm/(mol K)
T = 298     # 25 C
i = 2       # NaCl

feed_molarity = 0.6  # seawater
P_osmotic = i * feed_molarity * R * T

print("=== Reverse Osmosis Performance ===")
print(f"Feed: seawater at {feed_molarity} M NaCl")
print(f"Osmotic pressure: {P_osmotic:.1f} atm")
print(f"Membrane permeability: {A_permeability} L/m2/h/atm")
print()

# Performance at different applied pressures
pressures = [20, 25, 27, 30, 40, 50, 60, 70, 80]

print(f"{'Applied (atm)':>14} {'Net Drive (atm)':>16} {'Flux (L/m2/h)':>14} {'Status':<15}")
print("-" * 62)

for P in pressures:
    net = P - P_osmotic
    if net <= 0:
        flux = 0
        status = "Below threshold"
    else:
        flux = A_permeability * net
        status = "Producing water"
    print(f"{P:>14} {net:>14.1f} {flux:>12.1f} {status:<15}")

# Cost analysis: energy per cubic metre
print()
print("=== Energy Cost of Desalination ===")
print(f"{'Pressure (atm)':>14} {'Flux (L/m2/h)':>14} {'kWh/m3':>10}")
print("-" * 40)

for P in [40, 50, 60, 70, 80]:
    net = P - P_osmotic
    flux = A_permeability * net
    # Energy = pressure * volume / pump_efficiency
    # 1 atm*L = 101.325 J, convert to kWh/m3
    energy_kwh = P * 101.325 / (0.85 * 3600)  # per litre, 85% pump efficiency
    energy_per_m3 = energy_kwh * 1000
    print(f"{P:>14} {flux:>12.1f} {energy_per_m3:>8.1f}")`,
      challenge: 'What if the feed water is brackish (0.2 M) instead of full seawater? Recalculate the osmotic pressure and see how much less energy is needed. This is why Sundarbans RO units work better during monsoon season when river water dilutes the estuary.',
      successHint: 'You just modeled a real desalination plant. The net driving pressure concept applies to all membrane processes — kidney dialysis, water purification, even gas separation in industrial plants. Understanding the threshold pressure is key to designing efficient systems.',
    },
    {
      title: 'Membrane selectivity — why some ions pass and others don\'t',
      concept: `Not all membranes reject all solutes equally. **Selectivity** describes how well a membrane distinguishes between different dissolved species. A membrane might reject 99% of sodium chloride but only 60% of boric acid — because boron molecules are smaller and uncharged.

Selectivity depends on three factors: **size exclusion** (the membrane's pores are too small for large molecules), **charge repulsion** (charged membranes repel ions of the same charge), and **chemical affinity** (some molecules dissolve into the membrane material and pass through).

The **selectivity coefficient** (alpha) between two solutes A and B is: **alpha = R_A / R_B**, where R is the rejection rate. If alpha > 1, the membrane preferentially rejects A over B.

In the code below, you will model how different membrane types reject various ions and molecules found in Sundarbans water.`,
      analogy: 'Think of a bouncer at a club with a strict dress code. Some people (large ions) are clearly rejected — they are too big. Some (charged particles) are turned away because of their "charge." But a few small, neutral people (like boron) slip through unnoticed. No bouncer is perfect, and no membrane is perfectly selective.',
      storyConnection: 'Mangrove roots are remarkably selective membranes. They reject sodium and chloride efficiently but allow potassium (an essential nutrient) to pass more readily. This selectivity is not accidental — millions of years of evolution have optimized the root membrane proteins (aquaporins) to discriminate between harmful salt and beneficial nutrients.',
      checkQuestion: 'A membrane rejects 98% of NaCl but only 70% of boron. What is the selectivity coefficient of NaCl over boron?',
      checkAnswer: 'alpha = R_NaCl / R_boron = 98 / 70 = 1.4. The membrane is 1.4 times more selective against NaCl than boron. This is a real problem in desalination — boron in drinking water can harm crops, and it is harder to remove than salt.',
      codeIntro: 'Model membrane selectivity for different ions and molecules in Sundarbans estuary water.',
      code: `import numpy as np

# Membrane selectivity model
# Different solutes have different rejection rates

# Typical RO membrane rejection rates
solutes = [
    {"name": "Sodium (Na+)", "size_pm": 102, "charge": 1, "rejection": 98.5},
    {"name": "Chloride (Cl-)", "size_pm": 181, "charge": -1, "rejection": 98.0},
    {"name": "Calcium (Ca2+)", "size_pm": 100, "charge": 2, "rejection": 99.2},
    {"name": "Sulfate (SO4 2-)", "size_pm": 258, "charge": -2, "rejection": 99.5},
    {"name": "Magnesium (Mg2+)", "size_pm": 72, "charge": 2, "rejection": 98.8},
    {"name": "Potassium (K+)", "size_pm": 138, "charge": 1, "rejection": 97.0},
    {"name": "Boron (B(OH)3)", "size_pm": 192, "charge": 0, "rejection": 65.0},
    {"name": "Silica (SiO2)", "size_pm": 310, "charge": 0, "rejection": 95.0},
    {"name": "Urea (organic)", "size_pm": 340, "charge": 0, "rejection": 40.0},
]

print("=== Membrane Selectivity Analysis ===")
print(f"{'Solute':<22} {'Size (pm)':>10} {'Charge':>8} {'Rejection %':>12}")
print("-" * 54)

for s in solutes:
    charge_str = str(s["charge"]) if s["charge"] <= 0 else "+" + str(s["charge"])
    print(f"{s['name']:<22} {s['size_pm']:>10} {charge_str:>8} {s['rejection']:>10.1f}%")

# Selectivity coefficients relative to NaCl
print()
print("=== Selectivity Relative to NaCl ===")
nacl_avg = (98.5 + 98.0) / 2  # average of Na+ and Cl-

for s in solutes:
    alpha = nacl_avg / s["rejection"] if s["rejection"] > 0 else float('inf')
    difficulty = "Easy" if s["rejection"] > 95 else "Moderate" if s["rejection"] > 70 else "Difficult"
    print(f"{s['name']:<22} alpha = {alpha:.2f}  [{difficulty}]")

# Effect of charge on rejection
print()
print("=== Charge Effect Summary ===")
for charge_val in [2, 1, 0]:
    subset = [s for s in solutes if s["charge"] == charge_val or s["charge"] == -charge_val]
    avg_rej = np.mean([s["rejection"] for s in subset])
    label = "Divalent" if abs(charge_val) == 2 else "Monovalent" if abs(charge_val) == 1 else "Neutral"
    print(f"{label} ions: avg rejection = {avg_rej:.1f}%")

print()
print("Higher charge = better rejection (charge repulsion helps).")
print("Neutral molecules rely on size alone — harder to block.")`,
      challenge: 'Mangrove roots selectively allow potassium through (needed for photosynthesis) while blocking sodium (toxic in excess). Add aquaporin-style selectivity: K+ at 80% rejection, Na+ at 97%. Calculate the K+/Na+ ratio in the permeate compared to seawater. This selective permeability is the mangrove\'s secret weapon.',
      successHint: 'Membrane selectivity is a billion-dollar engineering challenge. Water treatment plants, pharmaceutical purification, and blood dialysis machines all depend on membranes that can selectively pass some molecules while blocking others. You just modeled the core physics behind all of these.',
    },
    {
      title: 'Recovery rate — how much fresh water can we extract?',
      concept: `You cannot extract all the fresh water from a saltwater feed. As water is removed, the remaining brine becomes more concentrated, and the osmotic pressure rises. Eventually, the osmotic pressure equals the applied pressure and water flux drops to zero.

The **recovery rate** is the fraction of feed water converted to fresh water: **Recovery = V_permeate / V_feed * 100%**. Higher recovery means less waste — but also means the brine gets more concentrated, requiring more pressure and risking membrane scaling (mineral deposits).

Typical seawater RO plants achieve **40-50% recovery**. Brackish water plants can reach **75-90%** because the starting salinity is lower.

In the code below, you will simulate how osmotic pressure and flux change as recovery increases, finding the maximum practical recovery for different feed waters.`,
      analogy: 'Think of squeezing juice from an orange. The first squeeze gets lots of juice easily. The second squeeze gets less. The third gets barely a trickle — the pulp is nearly dry and resists further squeezing. Water recovery works the same way: the more you extract, the harder the remaining water becomes to separate from salt.',
      storyConnection: 'In the Sundarbans, mangrove roots face a similar recovery limit. They cannot extract all the fresh water from the soil around their roots — if they did, the remaining soil water would become hypersaline (much saltier than seawater), creating a toxic zone around the root. The tree naturally limits its extraction rate to maintain a sustainable salt balance.',
      checkQuestion: 'If an RO system processes 100 L of seawater (35 g/L salt) at 50% recovery, what is the salt concentration in the reject brine?',
      checkAnswer: 'At 50% recovery: 50 L becomes fresh water, 50 L becomes brine. All 3,500 g of salt (100 L * 35 g/L) ends up in the 50 L brine. Brine concentration = 3500 / 50 = 70 g/L — double the seawater salinity. This concentrated brine is an environmental challenge to dispose of.',
      codeIntro: 'Simulate how osmotic pressure and flux change as water recovery increases.',
      code: `import numpy as np

# Recovery rate simulation
# As water is extracted, brine gets more concentrated

def simulate_recovery(feed_salinity_gL, applied_pressure_atm, membrane_A=3.5):
    """Simulate RO performance at increasing recovery rates"""
    recoveries = np.arange(0, 95, 1)
    results = []

    for rec_pct in recoveries:
        rec = rec_pct / 100
        if rec >= 0.99:
            break

        # Brine concentration increases as water is removed
        # C_brine = C_feed / (1 - recovery)
        brine_salinity = feed_salinity_gL / (1 - rec)

        # Convert to molarity (NaCl MW = 58.44)
        brine_M = brine_salinity / 58.44

        # Osmotic pressure of brine
        P_osmotic = 2 * brine_M * 0.0821 * 298

        # Net driving pressure
        net_P = applied_pressure_atm - P_osmotic
        flux = max(0, membrane_A * net_P)

        results.append({
            "recovery": rec_pct,
            "brine_gL": brine_salinity,
            "P_osmotic": P_osmotic,
            "net_P": net_P,
            "flux": flux,
        })

        if flux <= 0:
            break

    return results

# Seawater desalination
print("=== Seawater RO at 60 atm ===")
results = simulate_recovery(35, 60)

print(f"{'Recovery %':>10} {'Brine (g/L)':>12} {'P_osm (atm)':>12} {'Flux':>10}")
print("-" * 46)

for r in results:
    if r["recovery"] % 10 == 0:
        print(f"{r['recovery']:>10} {r['brine_gL']:>10.1f} {r['P_osmotic']:>10.1f} {r['flux']:>8.1f}")

max_rec = max(r["recovery"] for r in results if r["flux"] > 0)
print(f"\\nMaximum recovery at 60 atm: {max_rec}%")

# Compare: brackish water
print()
print("=== Brackish Water RO at 20 atm ===")
results_b = simulate_recovery(5, 20)

print(f"{'Recovery %':>10} {'Brine (g/L)':>12} {'P_osm (atm)':>12} {'Flux':>10}")
print("-" * 46)

for r in results_b:
    if r["recovery"] % 10 == 0:
        print(f"{r['recovery']:>10} {r['brine_gL']:>10.1f} {r['P_osmotic']:>10.1f} {r['flux']:>8.1f}")

max_rec_b = max(r["recovery"] for r in results_b if r["flux"] > 0)
print(f"\\nMaximum recovery at 20 atm: {max_rec_b}%")
print()
print("Brackish water allows much higher recovery than seawater!")`,
      challenge: 'Increase the applied pressure to 80 atm for seawater. How much higher can recovery go? Calculate the energy cost per cubic metre at 50% vs 70% recovery. Is the extra water worth the extra energy? This trade-off is central to desalination plant economics.',
      successHint: 'Recovery optimization is critical in real desalination plants. Higher recovery means less seawater intake and less brine discharge — both environmentally important. But it costs more energy. You just modeled the same trade-off analysis that plant engineers perform.',
    },
    {
      title: 'Desalination math — designing a system for a Sundarbans village',
      concept: `Let us put it all together: designing a small desalination system for a Sundarbans village. We need to specify the feed water quality, desired output, membrane area, operating pressure, and energy source.

The design equations are: (1) **Water production = Flux * Membrane area * Hours/day**, (2) **Flux = Permeability * Net driving pressure**, (3) **Energy = Pressure * Volume / Pump efficiency**, (4) **Solar panel area = Energy / (Solar irradiance * Panel efficiency)**.

A village of 200 people needs about **10,000 litres per day** (50 L per person for drinking, cooking, and basic hygiene). In the code below, you will size every component of the system — membranes, pump, solar panels, and storage tank.`,
      analogy: 'Designing a desalination system is like planning a road trip. You need to know the destination (water demand), fuel efficiency (membrane performance), tank size (storage), and engine power (pump and solar panels). Miss any one calculation and the trip fails.',
      storyConnection: 'Several Sundarbans islands have already installed solar-powered RO units. The brackish water (5-15 g/L salt, much less than open seawater) makes small-scale RO practical. These systems produce 1,000-5,000 litres per day, serving small communities. The technology that mangroves evolved over millions of years, humans are now replicating with membranes and solar panels.',
      checkQuestion: 'If a membrane produces 20 L/m2/h and you need 10,000 L/day operating 8 hours, how much membrane area is needed?',
      checkAnswer: 'Area = 10,000 / (20 * 8) = 62.5 m2. That is about the floor area of a large room. In practice, this is achieved by rolling the membrane into spiral-wound modules — each module contains 20-40 m2 of membrane in a tube the size of a fire extinguisher.',
      codeIntro: 'Design a complete solar-powered desalination system for a Sundarbans village.',
      code: `# Village desalination system designer

def design_ro_system(
    population,
    litres_per_person=50,
    feed_salinity_gL=10,     # brackish Sundarbans water
    target_salinity_gL=0.5,  # WHO drinking water limit
    applied_pressure_atm=15,
    membrane_A=4.0,          # L/m2/h/atm
    operating_hours=8,       # solar daylight hours
    pump_efficiency=0.80,
    solar_irradiance=5.0,    # kWh/m2/day (tropical)
    panel_efficiency=0.18,
):
    # Water demand
    daily_demand_L = population * litres_per_person

    # Osmotic pressure of feed
    feed_M = feed_salinity_gL / 58.44
    P_osmotic = 2 * feed_M * 0.0821 * 298

    # Net driving pressure and flux
    net_P = applied_pressure_atm - P_osmotic
    flux = membrane_A * net_P  # L/m2/h

    # Membrane area needed
    membrane_area = daily_demand_L / (flux * operating_hours)

    # Number of 8-inch modules (each ~37 m2)
    modules = int(np.ceil(membrane_area / 37))

    # Energy calculation
    # Pump work = P * V / efficiency
    # Convert atm*L to kWh: 1 atm*L = 101.325 J
    recovery = 0.7  # 70% for brackish water
    feed_volume = daily_demand_L / recovery
    energy_j = applied_pressure_atm * feed_volume * 101.325 / pump_efficiency
    energy_kwh = energy_j / 3.6e6

    # Solar panel area
    panel_area = energy_kwh / (solar_irradiance * panel_efficiency)

    return {
        "demand_L": daily_demand_L,
        "P_osmotic": P_osmotic,
        "net_P": net_P,
        "flux": flux,
        "membrane_m2": membrane_area,
        "modules": modules,
        "feed_volume_L": feed_volume,
        "energy_kwh": energy_kwh,
        "panel_area_m2": panel_area,
    }

import numpy as np

# Design for a 200-person village
d = design_ro_system(200)

print("=== Sundarbans Village RO System Design ===")
print(f"Population: 200 | Demand: {d['demand_L']:,} L/day")
print()
print("--- Membrane Sizing ---")
print(f"Osmotic pressure of feed: {d['P_osmotic']:.1f} atm")
print(f"Net driving pressure:     {d['net_P']:.1f} atm")
print(f"Water flux:               {d['flux']:.1f} L/m2/h")
print(f"Membrane area needed:     {d['membrane_m2']:.1f} m2")
print(f"Standard modules (8-in):  {d['modules']}")
print()
print("--- Energy & Solar ---")
print(f"Feed water volume:        {d['feed_volume_L']:,.0f} L/day")
print(f"Energy required:          {d['energy_kwh']:.1f} kWh/day")
print(f"Solar panel area:         {d['panel_area_m2']:.1f} m2")
print(f"  (about {d['panel_area_m2']/1.6:.0f} standard panels)")
print()

# Cost estimate
membrane_cost = d["modules"] * 800  # USD per module
panel_cost = d["panel_area_m2"] * 150  # USD per m2
pump_cost = 2000
total = membrane_cost + panel_cost + pump_cost

print("--- Rough Cost Estimate (USD) ---")
print(f"Membranes: {membrane_cost:>10,}")
print(f"Solar panels: {panel_cost:>7,.0f}")
print(f"Pump system: {pump_cost:>8,}")
print(f"Total: {total:>15,}")
print(f"Per person: {total/200:>12,.0f}")`,
      challenge: 'Redesign the system for monsoon season when the feed salinity drops to 3 g/L. How much does the membrane area, energy, and cost change? Then try a larger village of 500 people. At what point does a centralized system become more economical than individual household filters?',
      successHint: 'You just performed a complete engineering design calculation — the same workflow that water engineers follow when building real desalination plants. The key skill is connecting physics (osmotic pressure), engineering (membrane performance), and economics (cost per person) into a coherent design.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Reverse osmosis and desalination engineering</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises use Python to model reverse osmosis, membrane selectivity, and desalination system design.
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
