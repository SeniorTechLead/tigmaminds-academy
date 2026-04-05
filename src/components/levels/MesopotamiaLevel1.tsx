import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function MesopotamiaLevel1() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Osmosis and salt transport — how irrigation poisons the soil',
      concept: `When river water floods a field, it seeps into the soil carrying dissolved salts — typically **2-5 grams per litre** in the Tigris and Euphrates. The water evaporates or is taken up by plants, but the salt stays behind. Every irrigation cycle deposits another thin layer of salt.

This is **osmosis in reverse**. In a healthy soil, water moves from regions of low salt concentration (soil) to high concentration (plant roots), feeding the plant. But as salt accumulates, the soil becomes MORE concentrated than the roots. Water now moves OUT of the roots and back into the soil — the plant literally dehydrates in wet ground.

The rate of salt accumulation depends on three factors:
1. **Salt concentration of irrigation water** (mg/L or ppm)
2. **Irrigation volume** (how much water is applied per hectare per year)
3. **Leaching fraction** — the proportion of water that drains BELOW the root zone, carrying salt with it

If the leaching fraction is zero (no drainage), **100% of the salt stays**. Mesopotamian fields had flat terrain and high water tables, so drainage was poor — a recipe for salt buildup.

📚 *Modern soil scientists measure salinity in electrical conductivity (EC, measured in dS/m). Fresh water is about 0.5 dS/m. Most crops fail above 8 dS/m. Mesopotamian soils eventually reached 15-20 dS/m — three times the lethal threshold.*`,
      analogy: 'Boil a pot of salted water. As the water evaporates, taste what remains — it gets saltier and saltier. The salt never leaves with the steam. Your pot is a Mesopotamian field: the river water is the salted water, the sun is the stove, and after 2,000 years of "boiling," the field is encrusted with salt.',
      storyConnection: 'Mesopotamian farmers noticed the problem early. Cuneiform tablets from 2400 BCE describe "white crusts" on fields and recommend switching from wheat to barley — barley tolerates roughly twice as much salt. But this was a band-aid on a systemic problem: the irrigation system had no drainage, so salt had nowhere to go.',
      checkQuestion: 'A field receives 10,000 m³ of water per hectare per year, with 3 g/L of dissolved salt. If the leaching fraction is 10% (only 10% drains away), how much salt accumulates per hectare per year?',
      checkAnswer: 'Total salt input: 10,000 m³ × 3,000 g/m³ = 30,000 kg. Salt removed by drainage: 10% × 30,000 = 3,000 kg. Net accumulation: 30,000 - 3,000 = 27,000 kg = 27 tonnes per hectare per year. Over 100 years, that is 2,700 tonnes of salt in the topsoil of a single hectare.',
      codeIntro: 'Model how salt accumulates in irrigated soil over centuries — the slow poisoning of Mesopotamian farmland.',
      code: `import numpy as np

# Salt accumulation model for irrigated land
def salt_accumulation(years, water_m3_per_ha, salt_g_per_L,
                      leaching_fraction, soil_depth_m=1.0):
    """
    Model salt buildup in the root zone over time.
    Returns salt concentration in the top soil layer (kg/m³).
    """
    soil_volume_m3 = 10000 * soil_depth_m  # 1 hectare × depth
    salt_kg = np.zeros(years + 1)
    ec_dsm = np.zeros(years + 1)  # electrical conductivity

    for y in range(1, years + 1):
        # Salt deposited this year (g → kg)
        deposited = water_m3_per_ha * salt_g_per_L  # grams
        removed = deposited * leaching_fraction
        net_kg = (deposited - removed) / 1000
        salt_kg[y] = salt_kg[y - 1] + net_kg
        # Convert to EC: roughly 1 dS/m per 640 mg/L in soil solution
        soil_solution_mg_L = (salt_kg[y] * 1e6) / soil_volume_m3
        ec_dsm[y] = soil_solution_mg_L / 640

    return salt_kg, ec_dsm

# Mesopotamian conditions
years = 2000
water = 12000       # m³ per hectare per year (flood irrigation)
salt_conc = 3.5     # g/L in Euphrates water
leach = 0.05        # only 5% drainage — flat terrain, high water table

salt_kg, ec = salt_accumulation(years, water, salt_conc, leach)

print("=== Salt Accumulation in Mesopotamian Fields ===")
print(f"Irrigation water: {water:,} m³/ha/year at {salt_conc} g/L")
print(f"Leaching fraction: {leach*100:.0f}% (very poor drainage)")
print(f"\\n{'Year':>6} {'Salt (tonnes/ha)':>18} {'EC (dS/m)':>12} {'Status'}")
print("-" * 55)

thresholds = [
    (2, "Fresh soil — any crop grows"),
    (4, "Sensitive crops stressed (beans, onions)"),
    (8, "Wheat fails — switch to barley"),
    (12, "Barley struggles"),
    (16, "Most crops dead"),
    (25, "Biologically dead soil"),
]

for y in [0, 50, 100, 200, 500, 800, 1000, 1500, 2000]:
    status = ""
    for thresh, desc in thresholds:
        if ec[y] >= thresh:
            status = desc
    if ec[y] < 2:
        status = "Fresh soil — any crop grows"
    print(f"{y:>6} {salt_kg[y]/1000:>16.1f} {ec[y]:>12.1f}   {status}")

# Demonstrate the effect of leaching fraction
print(f"\\n=== What If Drainage Were Better? ===")
print(f"{'Leaching %':>12} {'Salt after 500 yr (t/ha)':>25} {'EC':>8}")
print("-" * 48)

for lf in [0.0, 0.05, 0.10, 0.20, 0.30, 0.50]:
    s, e = salt_accumulation(500, water, salt_conc, lf)
    label = " ← Mesopotamia" if lf == 0.05 else ""
    print(f"{lf*100:>10.0f}% {s[500]/1000:>23.1f} {e[500]:>8.1f}{label}")

print(f"\\nWith 30% leaching, the soil stays usable after 500 years.")
print(f"Mesopotamia's flat terrain gave only ~5% leaching.")
print(f"This single factor — drainage — determined the fate of a civilization.")`,
      challenge: 'Modify the model to include a "fallow period" — every 5th year, no irrigation, and winter rains leach 10% of accumulated salt. Does fallowing save the soil, or merely delay the collapse? Mesopotamian records show they did practice fallowing — was it enough?',
      successHint: 'You modelled the slow chemical poisoning of an entire civilization. The mathematics is simple — addition and subtraction — but the timescale (centuries) made it invisible to any single generation. This is the archetype of a "slow disaster," and modern salinisation follows the exact same curve.',
    },
    {
      title: 'The water cycle — why irrigation breaks the natural balance',
      concept: `In a natural river system, water follows a balanced cycle: **precipitation** falls on mountains, flows downhill as rivers, and reaches the sea. Salts dissolved from rocks are carried to the ocean, which is why the sea is salty — it is the planet's salt sink.

Irrigation **short-circuits** this cycle. Instead of flowing to the sea, river water is diverted onto fields. The water evaporates (returning to the atmosphere), but the salt that was headed for the ocean is now stranded in the soil. The natural salt-removal mechanism — flow to the sea — is broken.

A water balance equation for an irrigated field:

**P + I = ET + D + ΔS**

Where **P** = precipitation, **I** = irrigation, **ET** = evapotranspiration, **D** = drainage, and **ΔS** = change in soil water storage.

In Mesopotamia: P was low (~150 mm/year), I was high (~1,200 mm/year), ET was very high (hot, dry climate), and D was nearly zero (flat land, no drainage infrastructure). This means almost all the water left by evaporation — leaving 100% of the salt behind.

📚 *The Aral Sea disaster (1960-present) is the same physics at continental scale. The Soviet Union diverted the Amu Darya and Syr Darya rivers for cotton irrigation. The sea lost 90% of its volume, and the exposed seabed — coated in salt and pesticides — created toxic dust storms across Central Asia.*`,
      analogy: 'Think of a bathtub with the tap running (river inflow) and the drain open (flow to sea). The water level stays stable. Now plug the drain (divert the river) and pour the water onto the bathroom floor instead (irrigation). The floor gets soaked, and when the water evaporates, it leaves mineral stains everywhere. That is exactly what happened to Mesopotamia — the drain was plugged.',
      storyConnection: 'The Tigris and Euphrates originate in the mountains of eastern Turkey, dissolving limestone and gypsum along the way. By the time the water reaches southern Iraq, it carries 3-5 grams of salt per litre. In the natural system, this salt would reach the Persian Gulf. Irrigation intercepted it, and for 4,000 years, the salt accumulated in the breadbasket of the ancient world.',
      checkQuestion: 'If the Euphrates delivers 30 billion m³/year to southern Mesopotamia at 4 g/L salt, how much salt per year was being diverted from its natural destination (the sea) into farmland?',
      checkAnswer: '30 × 10⁹ m³ × 4 g/L = 30 × 10⁹ × 4,000 g/m³ = 120 × 10¹² g = 120 million tonnes of salt per year diverted onto fields instead of reaching the Persian Gulf. Over centuries, this is an unimaginable quantity.',
      codeIntro: 'Simulate the water balance of a Mesopotamian field — track where every drop of water goes and where the salt ends up.',
      code: `import numpy as np

def water_balance(years, precip_mm, irrigation_mm, et_rate,
                  drainage_fraction, salt_g_per_L):
    """
    Annual water balance for an irrigated field.
    All values in mm/year (1 mm over 1 ha = 10 m³).
    """
    results = []
    cum_salt_kg_ha = 0

    for y in range(1, years + 1):
        total_input = precip_mm + irrigation_mm   # mm
        et_mm = total_input * et_rate             # evapotranspiration
        drainage_mm = total_input * drainage_fraction
        storage_change = total_input - et_mm - drainage_mm

        # Salt calculation (1 mm/ha = 10 m³/ha)
        salt_in = irrigation_mm * 10 * salt_g_per_L / 1000  # kg/ha
        salt_out = drainage_mm * 10 * salt_g_per_L / 1000
        cum_salt_kg_ha += (salt_in - salt_out)

        results.append({
            'year': y, 'input': total_input, 'et': et_mm,
            'drain': drainage_mm, 'ds': storage_change,
            'salt_in': salt_in, 'salt_out': salt_out,
            'cum_salt': cum_salt_kg_ha
        })
    return results

# === Mesopotamian water balance ===
print("=== Water Balance: Mesopotamian Irrigated Field ===\\n")

results = water_balance(
    years=500,
    precip_mm=150,         # arid climate
    irrigation_mm=1200,    # heavy flood irrigation
    et_rate=0.88,          # 88% lost to evaporation
    drainage_fraction=0.05,# 5% drainage (flat terrain)
    salt_g_per_L=4.0       # Euphrates salt content
)

print(f"{'Component':<25} {'mm/year':>10} {'% of input':>10}")
print("-" * 47)
r = results[0]
print(f"{'Precipitation':<25} {150:>10} {150/r['input']*100:>9.1f}%")
print(f"{'Irrigation':<25} {1200:>10} {1200/r['input']*100:>9.1f}%")
print(f"{'Total input':<25} {r['input']:>10.0f} {'100.0':>9}%")
print(f"{'Evapotranspiration':<25} {r['et']:>10.0f} {r['et']/r['input']*100:>9.1f}%")
print(f"{'Drainage':<25} {r['drain']:>10.0f} {r['drain']/r['input']*100:>9.1f}%")
print(f"{'Storage change':<25} {r['ds']:>10.0f} {r['ds']/r['input']*100:>9.1f}%")

print(f"\\n{'Year':>6} {'Salt in (t/ha)':>15} {'Salt out':>10} {'Cumulative':>12}")
print("-" * 46)
for y_idx in [0, 49, 99, 199, 299, 499]:
    r = results[y_idx]
    print(f"{r['year']:>6} {r['salt_in']:>13.1f} {r['salt_out']:>10.1f} {r['cum_salt']/1000:>10.1f} t")

# === Compare natural vs irrigated salt transport ===
print(f"\\n=== Where Does the Salt Go? ===")
print(f"\\nNatural cycle (no irrigation):")
river_flow_km3 = 30      # Euphrates annual flow
salt_to_sea = river_flow_km3 * 1e9 * 4 / 1e9  # million tonnes
print(f"  River flow: {river_flow_km3} km³/year")
print(f"  Salt delivered to Persian Gulf: {salt_to_sea:.0f} million tonnes/year")
print(f"  Soil salinity: STABLE (salt passes through)")

print(f"\\nIrrigated cycle (Mesopotamia):")
irrigated_ha = 2_000_000
diversion_pct = 0.6
salt_diverted = salt_to_sea * diversion_pct
print(f"  Irrigated area: {irrigated_ha:,} hectares")
print(f"  River water diverted: {diversion_pct*100:.0f}%")
print(f"  Salt diverted to fields: {salt_diverted:.0f} million tonnes/year")
print(f"  Salt reaching the sea: {salt_to_sea - salt_diverted:.0f} million tonnes/year")
print(f"  Soil salinity: RISING — {salt_diverted:.0f}M tonnes/year with no exit")

# === Modern parallel: Aral Sea ===
print(f"\\n=== Modern Parallel: The Aral Sea ===")
aral_data = [
    (1960, 68000, 1090, "Pre-diversion — 4th largest lake"),
    (1970, 60000, 1000, "Soviet cotton irrigation begins"),
    (1990, 33800, 500,  "Fishing industry collapses"),
    (2007, 17160, 100,  "South Aral nearly gone"),
    (2020, 8600,  50,   "Toxic salt flats, dust storms"),
]
print(f"\\n{'Year':>6} {'Area (km²)':>12} {'Volume (km³)':>13} {'Status'}")
print("-" * 60)
for yr, area, vol, status in aral_data:
    print(f"{yr:>6} {area:>12,} {vol:>13,} {status}")

print(f"\\nSame physics, same result — 4,000 years apart.")
print(f"The water cycle does not forgive having its drain plugged.")`,
      challenge: 'Add a "modern drainage system" to the model — tile drains that remove 30% of water below the root zone. How many years can the field sustain crops? What happens to the drainage water (hint: it is very salty — this is the "drain water disposal" problem that California faces today)?',
      successHint: 'You traced the full water cycle from mountain to field to atmosphere and showed exactly where it breaks. The water balance equation is used by every irrigation engineer on Earth — it is the fundamental tool for preventing salinisation. Mesopotamia could not do this math; we can, yet the Aral Sea happened anyway.',
    },
    {
      title: 'Crop yield vs soil salinity — the FAO threshold curve',
      concept: `Not all crops respond to salt the same way. The **FAO salinity-yield model** (developed by Maas and Hoffman, 1977) describes how crop yield declines as soil salinity rises:

**Y = 100 - b × (EC - a)** for EC > a, and **Y = 100** for EC ≤ a

Where **Y** is relative yield (%), **EC** is soil electrical conductivity (dS/m), **a** is the salinity threshold (below which the crop is unaffected), and **b** is the yield decline slope (% per dS/m above threshold).

Different crops have dramatically different thresholds:
- **Wheat**: threshold = 6.0 dS/m, slope = 7.1 %/dS/m (moderately tolerant)
- **Barley**: threshold = 8.0 dS/m, slope = 5.0 %/dS/m (tolerant)
- **Date palm**: threshold = 4.0 dS/m, slope = 3.6 %/dS/m (tolerant to moderate)
- **Beans**: threshold = 1.0 dS/m, slope = 19.0 %/dS/m (very sensitive)

This explains the Mesopotamian agricultural sequence: as soil salinity rose, farmers abandoned sensitive crops first and shifted to tolerant ones. Cuneiform records document the switch from wheat to barley around 2400 BCE.

📚 *The FAO model is linear — a simplification. Real yield decline follows an S-curve. But the linear model is accurate enough for management decisions and matches field data within 10-15%. It remains the standard tool used by irrigation engineers worldwide.*`,
      analogy: 'Think of salt tolerance like noise tolerance. You can study with low background noise (threshold). Above a certain level, your concentration drops steadily (slope). Some people can tolerate more noise (barley). Others lose focus at the slightest sound (beans). The crop does not "decide" to fail — its cellular machinery physically cannot move water against the osmotic gradient.',
      storyConnection: 'Cuneiform tablets from the temple of Bau in Lagash (2400 BCE) record the ratio of wheat to barley in temple offerings. In early records, wheat dominates. By 2100 BCE, barley has almost entirely replaced wheat. By 1700 BCE, yields of even barley had fallen to a third of their original levels. This is the FAO curve playing out over millennia — documented in the oldest writing system on Earth.',
      checkQuestion: 'Soil EC is 10 dS/m. Calculate relative yield for wheat (a=6.0, b=7.1) and barley (a=8.0, b=5.0). Which crop would a Mesopotamian farmer choose?',
      checkAnswer: 'Wheat: Y = 100 - 7.1 × (10 - 6.0) = 100 - 28.4 = 71.6%. Barley: Y = 100 - 5.0 × (10 - 8.0) = 100 - 10 = 90%. Barley yields 90% vs wheat at 72%. The farmer would choose barley — exactly what the cuneiform records show happened.',
      codeIntro: 'Model the FAO salinity-yield curve for Mesopotamian crops and simulate the historical shift from wheat to barley.',
      code: `import numpy as np

def fao_yield(ec, threshold, slope):
    """
    FAO salinity-yield model (Maas & Hoffman 1977).
    Returns relative yield (0-100%).
    """
    if ec <= threshold:
        return 100.0
    y = 100.0 - slope * (ec - threshold)
    return max(y, 0.0)

# Crop parameters: (name, threshold dS/m, slope %/dS/m)
crops = [
    ("Beans",      1.0, 19.0),
    ("Onion",      1.2, 16.0),
    ("Lettuce",    1.3, 13.0),
    ("Wheat",      6.0,  7.1),
    ("Date palm",  4.0,  3.6),
    ("Barley",     8.0,  5.0),
    ("Cotton",     7.7,  5.2),
    ("Sugar beet", 7.0,  5.9),
]

print("=== FAO Salinity-Yield Curves ===\\n")
print(f"{'Crop':<12}", end="")
for ec in range(0, 21, 2):
    print(f" {ec:>5} dS/m", end="")
print()
print("-" * 122)

for name, thresh, slope in crops:
    print(f"{name:<12}", end="")
    for ec in range(0, 21, 2):
        y = fao_yield(ec, thresh, slope)
        marker = f"{y:>6.0f}%" if y > 0 else "  DEAD"
        print(f" {marker:>8}", end="")
    print()

# === Mesopotamian agricultural history ===
print(f"\\n=== Mesopotamian Agricultural Collapse ===")
print(f"Simulating rising salinity over 2,000 years\\n")

# Salinity rises roughly 0.005 dS/m per year in poorly drained land
years = np.arange(-3500, -1500, 50)  # 3500 BCE to 1500 BCE
ec_over_time = 2.0 + (years - years[0]) * 0.006  # starts at 2, rises

print(f"{'Year BCE':>10} {'EC dS/m':>8} {'Wheat %':>9} {'Barley %':>10} {'Best crop'}")
print("-" * 52)

for i, yr in enumerate(years):
    ec = ec_over_time[i]
    w = fao_yield(ec, 6.0, 7.1)
    b = fao_yield(ec, 8.0, 5.0)
    best = "Wheat" if w >= b and w > 0 else "Barley" if b > 0 else "NONE"
    print(f"{abs(yr):>10.0f} {ec:>8.1f} {w:>8.1f}% {b:>9.1f}% {best:>10}")

# === The critical transition ===
print(f"\\n=== Key Transitions ===")

# Find when wheat drops below barley
for ec_test in np.arange(0, 20, 0.1):
    w = fao_yield(ec_test, 6.0, 7.1)
    b = fao_yield(ec_test, 8.0, 5.0)
    if b > w and w > 0:
        print(f"Wheat-to-barley switch: EC = {ec_test:.1f} dS/m")
        year_switch = -3500 + (ec_test - 2.0) / 0.006 * 1
        break

# Find when barley hits zero
for ec_test in np.arange(8, 30, 0.1):
    b = fao_yield(ec_test, 8.0, 5.0)
    if b <= 0:
        print(f"Barley collapse: EC = {ec_test:.1f} dS/m")
        break

# Find when all crops die
for ec_test in np.arange(0, 30, 0.1):
    alive = any(fao_yield(ec_test, t, s) > 0 for _, t, s in crops)
    if not alive:
        print(f"All crops dead: EC = {ec_test:.1f} dS/m")
        break

# === Caloric consequences ===
print(f"\\n=== Caloric Impact on a City ===")
city_pop = 50000
cal_per_person = 2000
ha_available = 10000
barley_yield_kg_ha = 1500  # ancient yield at full health
cal_per_kg = 3200          # barley calories

print(f"City population: {city_pop:,}")
print(f"Farmland: {ha_available:,} hectares")
print(f"Barley yield at full health: {barley_yield_kg_ha} kg/ha")

for ec in [4, 8, 10, 12, 15]:
    rel = fao_yield(ec, 8.0, 5.0) / 100
    actual_yield = barley_yield_kg_ha * rel
    total_cal = actual_yield * ha_available * cal_per_kg
    people_fed = total_cal / (cal_per_person * 365)
    surplus = people_fed - city_pop
    status = "SURPLUS" if surplus > 0 else "FAMINE"
    print(f"  EC {ec:>2} dS/m: yield {actual_yield:>6.0f} kg/ha, "
          f"feeds {people_fed:>6,.0f} — {status} ({surplus:>+7,.0f})")`,
      challenge: 'Add date palms to the caloric model. Date palms are moderately salt-tolerant and produce roughly 6,000 kcal/kg. At what salinity does a mixed barley-and-date economy fail? This dual-crop strategy is exactly what southern Mesopotamian cities adopted.',
      successHint: 'You built the same mathematical tool that the FAO uses to advise farmers worldwide. The Maas-Hoffman model has been applied to over 100 crop species in 150 countries. The data from Mesopotamian cuneiform tablets — the oldest agricultural records on Earth — fits the model almost exactly, confirming that the physics of salt stress has not changed in 5,000 years.',
    },
    {
      title: 'Comparing irrigation methods — flood vs drip vs sprinkler',
      concept: `Not all irrigation is equally destructive. The key variable is **water use efficiency** — how much of the applied water actually reaches plant roots vs how much evaporates or runs off.

**Flood irrigation** (Mesopotamia's method): water is released across a flat field. Efficiency is **30-50%** — more than half the water evaporates or pools uselessly. Salt deposition is maximum because a large surface area is wet and evaporating.

**Sprinkler irrigation**: water is sprayed through the air. Efficiency is **60-75%**. Some water evaporates in flight (especially in hot climates), and droplets that land on leaves evaporate without reaching roots. Salt deposition is moderate.

**Drip irrigation**: water is delivered directly to the root zone through small emitters. Efficiency is **85-95%**. Minimal surface wetting means minimal evaporation. Salt is pushed to the edges of the wetted zone, away from roots. This is the most salt-efficient method.

The **salt accumulation rate** is approximately proportional to **(1 - efficiency)**. If you need to deliver 5,000 m³ of water to crop roots, flood irrigation must apply 12,500 m³ (at 40% efficiency), while drip applies only 5,500 m³ (at 90%). The extra 7,000 m³ in flood irrigation evaporates — depositing all its salt.

📚 *Israel pioneered drip irrigation in the 1960s, partly because the Negev Desert has the same salinisation risks as ancient Mesopotamia. Israeli engineers explicitly studied Mesopotamian soil failures when designing modern irrigation systems.*`,
      analogy: 'Compare three ways to water a houseplant: (1) Dump a bucket of water over the whole pot — most splashes out or pools on the surface and evaporates (flood). (2) Use a spray bottle — some mist drifts away, some lands on leaves and evaporates (sprinkler). (3) Use a syringe to inject water directly at the roots — almost nothing is wasted (drip). The plant gets the same water; the mess is completely different.',
      storyConnection: 'Mesopotamia had only one option: flood irrigation from canals. The technology for sprinkler or drip systems did not exist. But the principle was understood — Babylonian texts describe digging drainage ditches to remove salty water, essentially an attempt to increase the leaching fraction. The engineering was right; the scale was insufficient.',
      checkQuestion: 'You need to deliver 6,000 m³/ha of water to roots. Calculate total water applied for flood (40% eff), sprinkler (70% eff), and drip (90% eff). If water contains 3 g/L salt, how much salt does each method deposit?',
      checkAnswer: 'Flood: 6,000/0.40 = 15,000 m³ applied, 9,000 m³ evaporated → 27,000 kg salt. Sprinkler: 6,000/0.70 = 8,571 m³ applied, 2,571 m³ evaporated → 7,714 kg salt. Drip: 6,000/0.90 = 6,667 m³ applied, 667 m³ evaporated → 2,000 kg salt. Drip deposits 13.5× less salt than flood.',
      codeIntro: 'Compare irrigation methods — calculate water waste, salt deposition, and long-term soil health for each technology.',
      code: `import numpy as np

def irrigation_comparison(crop_water_need, salt_g_per_L, years,
                          soil_depth_m=1.0):
    """
    Compare flood, sprinkler, and drip irrigation over time.
    crop_water_need: m³/ha/year that roots actually need.
    """
    methods = {
        'Flood (Mesopotamia)': {'efficiency': 0.40, 'leach': 0.05},
        'Sprinkler':           {'efficiency': 0.70, 'leach': 0.15},
        'Drip':                {'efficiency': 0.90, 'leach': 0.30},
        'Drip + tile drains':  {'efficiency': 0.90, 'leach': 0.50},
    }

    results = {}
    for name, params in methods.items():
        eff = params['efficiency']
        leach = params['leach']
        applied = crop_water_need / eff
        evap = applied * (1 - eff - leach)
        drain = applied * leach

        salt_in = applied * salt_g_per_L / 1000        # kg/ha/year
        salt_drained = drain * salt_g_per_L * 1.5 / 1000  # concentrated
        net_salt_yr = max(salt_in - salt_drained, 0)

        cum_salt = np.array([net_salt_yr * y for y in range(years + 1)])
        soil_vol = 10000 * soil_depth_m
        ec = (cum_salt * 1e6 / soil_vol) / 640

        results[name] = {
            'applied': applied, 'evap': evap, 'drain': drain,
            'salt_per_yr': net_salt_yr, 'cum_salt': cum_salt,
            'ec': ec, 'efficiency': eff
        }
    return results

# Run comparison
crop_need = 5000  # m³/ha/year (typical cereal crop)
salt = 3.5        # g/L
years = 500

res = irrigation_comparison(crop_need, salt, years)

print("=== Irrigation Method Comparison ===")
print(f"Crop water requirement: {crop_need:,} m³/ha/year")
print(f"Water salt content: {salt} g/L\\n")

print(f"{'Method':<25} {'Applied':>8} {'Evap':>8} {'Drain':>8} "
      f"{'Eff %':>6} {'Salt/yr':>9}")
print(f"{'':25} {'m³/ha':>8} {'m³/ha':>8} {'m³/ha':>8} {'':>6} {'kg/ha':>9}")
print("-" * 67)

for name, r in res.items():
    print(f"{name:<25} {r['applied']:>8,.0f} {r['evap']:>8,.0f} "
          f"{r['drain']:>8,.0f} {r['efficiency']*100:>5.0f}% "
          f"{r['salt_per_yr']:>8,.0f}")

# Salt over time for each method
print(f"\\n=== Soil Salinity Over Time (EC in dS/m) ===")
print(f"{'Year':>6}", end="")
for name in res:
    short = name[:15]
    print(f" {short:>15}", end="")
print()
print("-" * 68)

for y in [0, 25, 50, 100, 200, 300, 500]:
    print(f"{y:>6}", end="")
    for name, r in res.items():
        ec = r['ec'][y]
        flag = " !" if ec > 8 else ""
        print(f" {ec:>13.1f}{flag}", end="")
    print()

print(f"\\n(!) = exceeds barley salt tolerance (8 dS/m)")

# Years until wheat fails, barley fails
print(f"\\n=== Years Until Crop Failure ===")
print(f"{'Method':<25} {'Wheat fails':>12} {'Barley fails':>13}")
print("-" * 52)

for name, r in res.items():
    wheat_fail = "never"
    barley_fail = "never"
    for y in range(years + 1):
        if r['ec'][y] > 6.0 and wheat_fail == "never":
            wheat_fail = f"year {y}"
        if r['ec'][y] > 8.0 and barley_fail == "never":
            barley_fail = f"year {y}"
    print(f"{name:<25} {wheat_fail:>12} {barley_fail:>13}")

# Water cost comparison
print(f"\\n=== Water Cost: Litres Wasted Per kg of Grain ===")
barley_yield = 1500  # kg/ha at full health
for name, r in res.items():
    wasted = r['evap']  # m³ wasted per ha
    litres_wasted = wasted * 1000 / barley_yield
    print(f"  {name:<25} {litres_wasted:>6,.0f} L wasted per kg grain")

print(f"\\nMesopotamia used ~3× more water than drip irrigation would.")
print(f"That extra water carried the salt that ended the civilization.")`,
      challenge: 'Add a "subsurface drip" method with 95% efficiency and 40% leaching (drainage pipes directly below drip lines). How many centuries can it sustain crops? Then calculate the cost: if drip infrastructure costs $2,000/ha to install and lasts 20 years, what is the cost per tonne of grain saved from salinisation?',
      successHint: 'You compared technologies separated by 5,000 years and showed that the physics is identical — only the engineering changed. Drip irrigation does not "solve" salinisation; it slows it by a factor of 10-20. The salt still has to go somewhere. This is why modern irrigation always includes drainage planning — something Mesopotamia could not do at scale.',
    },
    {
      title: 'The historical collapse — modelling 2,000 years of yield decline',
      concept: `We have an extraordinary dataset: **cuneiform records** from Mesopotamian temples spanning roughly 3500-1500 BCE. These records document grain yields, land areas, crop types, and even soil quality observations — the oldest quantitative agricultural data on Earth.

The data tells a consistent story across multiple city-states:
- **3500-3000 BCE**: yields of **2,500 kg/ha** (high for ancient agriculture), wheat dominant
- **3000-2500 BCE**: yields decline to **1,800 kg/ha**, wheat-to-barley transition begins
- **2500-2000 BCE**: yields fall to **1,100 kg/ha**, barley now dominant, "white earth" noted
- **2000-1700 BCE**: yields collapse to **600 kg/ha**, widespread land abandonment
- **1700-1500 BCE**: southern Mesopotamia largely depopulated; political power shifts north to Babylon (on less-salinised land)

The decline is not linear — it follows an **exponential decay** modified by occasional recovery (fallow periods, canal rebuilding). The mathematical form is:

**Y(t) = Y₀ × e^(-λt) + recovery_events**

Where **λ** is the degradation rate constant, approximately **0.0007 per year** in southern Mesopotamia.

📚 *This is the same exponential decay seen in radioactive materials, battery discharge, and population decline under stress. The mathematics of irreversible degradation is universal — whether the system is nuclear, electrical, or agricultural.*`,
      analogy: 'Imagine a bank account (the soil) that earns no interest (no natural salt removal) but has regular withdrawals (salt deposits). Each year the balance drops a little. For the first few decades you barely notice — you are still rich. But the withdrawals compound, and eventually the account hits zero. There is no sudden crash — just a slow, relentless drain that is invisible until it is too late.',
      storyConnection: 'The city of Girsu (modern Telloh) exemplifies the collapse. Temple records from 2400 BCE show a thriving agricultural centre. By 2100 BCE, the same temple records describe "salt earth" and falling yields. By 1800 BCE, Girsu was abandoned. The city did not fall to invasion — it fell to chemistry. The soil could no longer feed its people.',
      checkQuestion: 'If yield decays exponentially at rate λ = 0.0007/year from an initial 2,500 kg/ha, what is the yield after 500 years? After 1,000 years?',
      checkAnswer: 'After 500 years: Y = 2,500 × e^(-0.0007 × 500) = 2,500 × e^(-0.35) = 2,500 × 0.705 = 1,762 kg/ha. After 1,000 years: Y = 2,500 × e^(-0.70) = 2,500 × 0.497 = 1,242 kg/ha. The loss accelerates — the first 500 years lose 738 kg/ha, the next 500 lose 520 more.',
      codeIntro: 'Reconstruct the agricultural collapse of Mesopotamia from cuneiform data — model 2,000 years of declining yields.',
      code: `import numpy as np

# Historical data from cuneiform records (approximate averages)
# Sources: Jacobsen & Adams 1958, Powell 1985, Postgate 1992
historical = [
    (-3500, 2500, "wheat", "Fresh soil, new irrigation"),
    (-3300, 2400, "wheat", "Sustained high yields"),
    (-3100, 2200, "wheat", "Slight decline begins"),
    (-2900, 2000, "wheat/barley", "Salt symptoms noted"),
    (-2700, 1800, "barley>wheat", "Barley becoming dominant"),
    (-2500, 1500, "barley", "Wheat largely abandoned"),
    (-2400, 1300, "barley", "'White earth' in Lagash records"),
    (-2100, 1100, "barley", "Ur III period — yields falling"),
    (-1900, 900,  "barley", "Land abandonment begins"),
    (-1800, 700,  "barley", "Widespread abandonment"),
    (-1700, 600,  "barley", "Southern cities depopulating"),
    (-1500, 400,  "barley/dates", "South largely abandoned"),
]

print("=== Mesopotamian Agricultural Collapse ===")
print(f"Data from cuneiform temple records, 3500-1500 BCE\\n")

print(f"{'Year BCE':>10} {'Yield kg/ha':>12} {'Dominant crop':<15} {'Notes'}")
print("-" * 70)
for yr, yld, crop, note in historical:
    print(f"{abs(yr):>10} {yld:>12,} {crop:<15} {note}")

# Fit exponential decay model
years_data = np.array([h[0] for h in historical])
yields_data = np.array([h[1] for h in historical])

# Y = Y0 * exp(-lambda * (t - t0))
t0 = years_data[0]
Y0 = yields_data[0]

# Least squares fit for lambda
from_t0 = years_data - t0  # time elapsed since start
log_ratio = np.log(yields_data / Y0)
# Linear regression: log(Y/Y0) = -lambda * t
lambda_fit = -np.sum(log_ratio * from_t0) / np.sum(from_t0**2)

print(f"\\n=== Exponential Decay Model ===")
print(f"Y(t) = {Y0} × exp(-{lambda_fit:.6f} × t)")
print(f"Decay rate: {lambda_fit:.6f} per year")
print(f"Half-life: {np.log(2)/lambda_fit:.0f} years")

# Compare model vs data
print(f"\\n{'Year BCE':>10} {'Actual':>8} {'Model':>8} {'Error':>8}")
print("-" * 38)
for yr, actual, _, _ in historical:
    t = yr - t0
    predicted = Y0 * np.exp(-lambda_fit * t)
    error = actual - predicted
    print(f"{abs(yr):>10} {actual:>8} {predicted:>8.0f} {error:>+7.0f}")

# Population carrying capacity
print(f"\\n=== Population Consequences ===")
print(f"Assumptions: 250 kg grain/person/year, 0.5 ha farmland/person\\n")

grain_per_person = 250  # kg/year minimum
ha_per_person = 0.5

print(f"{'Year BCE':>10} {'Yield':>8} {'Surplus per':>12} {'Status'}")
print(f"{'':>10} {'kg/ha':>8} {'person kg':>12}")
print("-" * 48)

for yr, yld, _, _ in historical:
    per_person = yld * ha_per_person
    surplus = per_person - grain_per_person
    if surplus > 200:
        status = "Prosperous — supports priests, soldiers, artisans"
    elif surplus > 0:
        status = "Subsistence — no surplus for non-farmers"
    else:
        status = f"FAMINE — deficit of {abs(surplus):.0f} kg/person"
    print(f"{abs(yr):>10} {yld:>8,} {surplus:>+11.0f} {status}")

# Political consequences
print(f"\\n=== Political Consequences ===")
events = [
    (-3500, "Uruk period: surplus feeds world's first cities"),
    (-2900, "Early Dynastic: city-states compete for best farmland"),
    (-2400, "Sargon of Akkad conquers — partly driven by land pressure"),
    (-2100, "Ur III: massive canal-building (trying to fix salinisation)"),
    (-1900, "Isin-Larsa: wars over remaining productive land"),
    (-1750, "Hammurabi: power shifts NORTH to Babylon (less salt)"),
    (-1500, "Southern cities abandoned — political center moves north"),
]

for yr, event in events:
    # Find closest yield
    closest = min(historical, key=lambda h: abs(h[0] - yr))
    print(f"  {abs(yr)} BCE (yield ~{closest[1]} kg/ha): {event}")

print(f"\\nThe political history of Mesopotamia tracks the salinity curve.")
print(f"Power moved north as southern soils died — chemistry drove geopolitics.")`,
      challenge: 'The model assumes monotonic decline, but real yields fluctuated — good rain years temporarily leached salt, and canal rebuilding helped. Add random recovery events (every 50-100 years, yield recovers 15-20%) and see if the overall trend still leads to collapse. This tests whether the decline was inevitable or could have been reversed.',
      successHint: 'You reconstructed one of history\'s slowest catastrophes from the oldest quantitative data on Earth. The exponential decay model — the same mathematics used for radioactive decay, drug metabolism, and cooling curves — fits cuneiform agricultural records from 5,000 years ago. The physics of degradation is timeless.',
    },
    {
      title: 'Modern parallels — salinisation rates around the world today',
      concept: `Salinisation is not ancient history. The **FAO estimates that 1.5 billion hectares** worldwide are affected by soil salinity, and **10 million hectares** of irrigated land are abandoned every year — a rate eerily similar to Mesopotamia's collapse.

Major modern salinisation hotspots:
- **Pakistan (Indus Valley)**: 6.3 million hectares affected. The Indus carries 3-4 g/L salt, almost identical to the Euphrates. Waterlogging and salt have reduced yields by 25-40% in Sindh province.
- **Australia (Murray-Darling Basin)**: 5.7 million hectares. Clearing deep-rooted native vegetation raised water tables, bringing fossil salt to the surface — "dryland salinity."
- **California (Central Valley)**: 1.8 million hectares at risk. Drainage-impaired soils in the western San Joaquin Valley accumulate selenium and salt. The Westlands Water District loses productivity annually.
- **Aral Sea region (Uzbekistan/Kazakhstan)**: 4.0 million hectares. Soviet-era cotton irrigation without drainage — the most dramatic modern parallel to Mesopotamia.

The common thread: **irrigation without adequate drainage** in arid climates. The physics is identical to Mesopotamia — only the scale and speed differ.

📚 *The global cost of salinisation is estimated at $27 billion per year in lost crop production. This exceeds the GDP of many nations. Yet drainage infrastructure receives a tiny fraction of irrigation investment — we are repeating the Mesopotamian mistake at planetary scale.*`,
      analogy: 'Mesopotamia was a pilot study that ran for 4,000 years and produced a clear result: irrigation without drainage kills soil. Modern irrigated regions are running the same experiment with the same parameters. The pilot study says we will get the same result. The only question is whether we read the pilot study results — which are written in cuneiform on clay tablets in museum basements.',
      storyConnection: 'The Euphrates carried 3-5 g/L of dissolved salt. The Indus carries 3-4 g/L. The Murray River carries 0.5-1.0 g/L (lower, but Australia has poorer drainage). The Colorado River, which feeds California\'s Imperial Valley, carries 1-2 g/L. Every one of these rivers is writing the same story that the Tigris and Euphrates wrote — just at different speeds.',
      checkQuestion: 'Pakistan irrigates 18 million hectares from the Indus (3.5 g/L salt) using mostly flood irrigation (40% efficiency). Estimate total salt deposited on Pakistani farmland per year.',
      checkAnswer: 'Assume 10,000 m³/ha irrigation. Total water: 18M × 10,000 = 180 billion m³. Salt input: 180 × 10⁹ × 3.5 g/L = 630 million tonnes. At 40% efficiency, ~60% evaporates. If leaching is 10%, about 50% of salt stays: ~315 million tonnes per year deposited on Pakistani soil.',
      codeIntro: 'Compare modern salinisation rates with ancient Mesopotamia — are we learning from history, or repeating it?',
      code: `import numpy as np

# Modern irrigated regions vs Mesopotamia
regions = [
    {
        'name': 'Mesopotamia (historical)',
        'area_mha': 2.0,
        'salt_g_per_L': 4.0,
        'irrigation_mm': 1200,
        'efficiency': 0.40,
        'leach_frac': 0.05,
        'start_year': -3500,
        'current_ec': 20.0,
        'status': 'Collapsed ~1500 BCE'
    },
    {
        'name': 'Pakistan (Indus)',
        'area_mha': 18.0,
        'salt_g_per_L': 3.5,
        'irrigation_mm': 1000,
        'efficiency': 0.45,
        'leach_frac': 0.08,
        'start_year': 1930,
        'current_ec': 6.5,
        'status': '6.3M ha affected, rising'
    },
    {
        'name': 'Australia (Murray-Darling)',
        'area_mha': 1.5,
        'salt_g_per_L': 0.8,
        'irrigation_mm': 600,
        'efficiency': 0.65,
        'leach_frac': 0.10,
        'start_year': 1950,
        'current_ec': 4.2,
        'status': 'Dryland + irrigation salinity'
    },
    {
        'name': 'California (Central Valley)',
        'area_mha': 1.8,
        'salt_g_per_L': 1.5,
        'irrigation_mm': 800,
        'efficiency': 0.75,
        'leach_frac': 0.20,
        'start_year': 1940,
        'current_ec': 3.8,
        'status': 'Western SJV impaired'
    },
    {
        'name': 'Uzbekistan (Aral Sea)',
        'area_mha': 4.0,
        'salt_g_per_L': 3.0,
        'irrigation_mm': 1100,
        'efficiency': 0.35,
        'leach_frac': 0.05,
        'start_year': 1960,
        'current_ec': 8.5,
        'status': 'Severe — Aral Sea destroyed'
    },
    {
        'name': 'Egypt (Nile Delta)',
        'area_mha': 3.5,
        'salt_g_per_L': 1.0,
        'irrigation_mm': 1000,
        'efficiency': 0.55,
        'leach_frac': 0.15,
        'start_year': 1970,
        'current_ec': 3.5,
        'status': 'Post-Aswan Dam salinisation'
    },
]

def calc_salt_rate(r):
    """Calculate net salt accumulation in tonnes/ha/year."""
    applied_m3 = r['irrigation_mm'] * 10  # mm to m³/ha
    salt_in = applied_m3 * r['salt_g_per_L'] / 1000  # kg/ha
    salt_out = applied_m3 * r['leach_frac'] * r['salt_g_per_L'] / 1000
    return (salt_in - salt_out) / 1000  # tonnes/ha/year

print("=== Global Salinisation: Modern Regions vs Mesopotamia ===\\n")

print(f"{'Region':<28} {'Area Mha':>9} {'Salt g/L':>9} {'Eff %':>6} "
      f"{'Salt t/ha/yr':>12}")
print("-" * 67)

for r in regions:
    rate = calc_salt_rate(r)
    print(f"{r['name']:<28} {r['area_mha']:>9.1f} {r['salt_g_per_L']:>9.1f} "
          f"{r['efficiency']*100:>5.0f}% {rate:>11.1f}")

# Project future salinisation
print(f"\\n=== Projected Soil EC (dS/m) Over Next 200 Years ===")
print(f"{'Region':<28}", end="")
for y in [2025, 2050, 2100, 2150, 2225]:
    print(f" {y:>7}", end="")
print()
print("-" * 68)

for r in regions:
    if r['name'].startswith('Mesopotamia'):
        continue
    rate = calc_salt_rate(r)
    soil_vol = 10000 * 1.0  # 1 ha, 1 m depth
    salt_per_yr_kg = rate * 1000
    print(f"{r['name']:<28}", end="")
    for target_year in [2025, 2050, 2100, 2150, 2225]:
        years_from_start = target_year - r['start_year']
        cum_salt = salt_per_yr_kg * years_from_start
        ec = (cum_salt * 1e6 / soil_vol) / 640
        # Cap at current known + projection
        flag = "*" if ec > 8 else " "
        print(f" {ec:>6.1f}{flag}", end="")
    print()

print(f"\\n(*) = exceeds barley tolerance — potential collapse zone")

# Total global impact
print(f"\\n=== Global Scale ===")
total_salt = sum(calc_salt_rate(r) * r['area_mha'] * 1e6
                 for r in regions if not r['name'].startswith('Meso'))
print(f"Total salt deposited on modern farmland: "
      f"{total_salt/1e6:,.0f} million tonnes/year")
print(f"Total irrigated area at risk: "
      f"{sum(r['area_mha'] for r in regions if not r['name'].startswith('Meso')):.1f}"
      f" million hectares")

# Economic cost
print(f"\\n=== Economic Cost ===")
price_per_tonne_grain = 250  # USD
for r in regions:
    if r['name'].startswith('Meso'):
        continue
    rate = calc_salt_rate(r)
    # Estimate yield loss from current EC
    from_barley = max(0, 100 - 5.0 * max(0, r['current_ec'] - 8.0))
    from_wheat = max(0, 100 - 7.1 * max(0, r['current_ec'] - 6.0))
    avg_loss = (100 - max(from_barley, from_wheat)) / 100
    potential_yield = 3000  # kg/ha modern cereal
    lost_tonnes = avg_loss * potential_yield / 1000 * r['area_mha'] * 1e6
    cost = lost_tonnes * price_per_tonne_grain
    if cost > 0:
        cost_b = cost / 1e9
        print(f"  {r['name']:<28} lost yield: {lost_tonnes/1e6:>5.1f}M tonnes"
              f" = {cost_b:>4.1f} billion USD/year")

# The verdict
print(f"\\n=== The Verdict ===")
print(f"Mesopotamia collapsed after ~2,000 years of flood irrigation.")
print(f"Modern timelines (at current rates):")
for r in regions:
    if r['name'].startswith('Meso'):
        continue
    rate = calc_salt_rate(r)
    if rate > 0:
        soil_vol = 10000
        salt_per_yr_kg = rate * 1000
        # Years to reach EC 8 from current
        current_salt = r['current_ec'] * 640 * soil_vol / 1e6
        target_salt = 8.0 * 640 * soil_vol / 1e6
        if target_salt > current_salt and salt_per_yr_kg > 0:
            years_to_8 = (target_salt - current_salt) * 1000 / salt_per_yr_kg
            print(f"  {r['name']:<28} ~{years_to_8:>4.0f} years to barley threshold")
        else:
            print(f"  {r['name']:<28} ALREADY past barley threshold")

print(f"\\nWe have the cuneiform data. We have the FAO models.")
print(f"The question is not whether we know — it is whether we act.")`,
      challenge: 'Add India (35 million hectares irrigated, Ganges at 0.5 g/L, efficiency 50%) and China (55 million hectares, Yellow River at 1.2 g/L, efficiency 60%) to the comparison. These are the two largest irrigated countries on Earth. How do their timelines compare? What would switching to drip irrigation cost vs the cost of eventual soil loss?',
      successHint: 'You built a global salinisation dashboard comparing modern irrigation with a 5,000-year-old case study. The numbers are sobering: several modern regions are on the same trajectory as Mesopotamia, just earlier on the curve. This is exactly how the FAO and World Bank model irrigation sustainability — same equations, same warnings, same physics.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Irrigation science, salinisation, and agricultural collapse through code</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises use Python to model salt accumulation, water balance, crop yield curves, irrigation methods, historical yield collapse, and modern salinisation parallels.
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
