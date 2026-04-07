import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function MesopotamiaLevel2() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Advanced osmosis — the van\'t Hoff equation and osmotic pressure',
      concept: `When salt dissolves in soil water, it creates **osmotic pressure** that fights against plant roots trying to absorb moisture. The higher the salt concentration, the harder plants must work — and beyond a threshold, they simply cannot drink at all.

The **van't Hoff equation** quantifies this:

**\u03C0 = iCRT**

Where \u03C0 is osmotic pressure (atm), i is the van't Hoff factor (number of ions per formula unit — NaCl splits into 2), C is molar concentration (mol/L), R is the gas constant (0.0821 L\u00B7atm/mol\u00B7K), and T is temperature (K).

For NaCl at 0.1 mol/L and 25\u00B0C: \u03C0 = 2 \u00D7 0.1 \u00D7 0.0821 \u00D7 298 = 4.89 atm. That is nearly 5 atmospheres of pressure that a plant root must overcome — equivalent to the pressure 50 metres underwater.

When soil salinity exceeds about 4 dS/m (deciSiemens per metre, the standard unit), most crops begin to fail. Barley — the staple of ancient Mesopotamia — tolerates up to 8 dS/m, which is why it replaced wheat as salinisation advanced.

\uD83D\uDCDA *Osmotic pressure is the "pull" that dissolved solutes exert on water. It explains why you can't drink seawater (your cells would lose water to the saltier fluid outside) and why salty soil kills crops (roots can't pull water from salty soil).*`,
      analogy: 'Imagine two tanks of water connected by a membrane with tiny holes. If one tank has salty water and the other has fresh water, fresh water flows toward the salty side — trying to dilute it. Osmotic pressure is the force driving that flow. A plant root is the membrane — and if the soil is too salty, water flows OUT of the root instead of in. The plant dehydrates in wet soil.',
      storyConnection: 'Southern Mesopotamia\'s irrigation canals carried water from the Euphrates across flat, poorly drained plains. As water evaporated in the brutal heat, salts concentrated in the soil. Sumerian tablets from 2400 BCE record the shift from wheat to barley — a direct response to rising osmotic pressure in the root zone. By 1700 BCE, even barley failed in many areas.',
      checkQuestion: 'Seawater has a NaCl concentration of about 0.6 mol/L. What is its osmotic pressure at 25\u00B0C?',
      checkAnswer: '\u03C0 = iCRT = 2 \u00D7 0.6 \u00D7 0.0821 \u00D7 298 = 29.3 atm. That is nearly 30 atmospheres — far beyond what any crop root can overcome. Even at one-tenth seawater concentration, most crops struggle. This is why salinisation is an agricultural death sentence.',
      codeIntro: 'Calculate osmotic pressure across a range of salinities and identify crop tolerance thresholds.',
      code: `import numpy as np

# Van't Hoff equation: pi = iCRT
R = 0.0821  # L·atm/(mol·K)
T = 298     # 25°C in Kelvin

# Common salts in Mesopotamian soil
salts = [
    {"name": "NaCl (halite)",      "i": 2, "molar_mass": 58.44},
    {"name": "CaSO4 (gypsum)",     "i": 2, "molar_mass": 136.14},
    {"name": "Na2SO4 (thenardite)", "i": 3, "molar_mass": 142.04},
    {"name": "MgCl2 (bischofite)", "i": 3, "molar_mass": 95.21},
    {"name": "Na2CO3 (natron)",    "i": 3, "molar_mass": 105.99},
]

concentrations_mol = np.array([0.01, 0.05, 0.1, 0.2, 0.4, 0.6, 1.0])

print("=== Osmotic Pressure vs Salt Concentration (atm) ===")
header = f"{'Salt':<24}" + "".join(f"{c:>7.2f}M" for c in concentrations_mol)
print(header)
print("-" * len(header))

for salt in salts:
    pressures = salt["i"] * concentrations_mol * R * T
    row = f"{salt['name']:<24}" + "".join(f"{p:>7.1f}" for p in pressures)
    print(row)

# Crop tolerance thresholds (in dS/m and equivalent osmotic pressure)
print("\\\n=== Crop Salt Tolerance Thresholds ===")
crops = [
    ("Wheat (modern)", 6.0, "Sensitive"),
    ("Barley",         8.0, "Tolerant"),
    ("Date palm",     4.0, "Moderate"),
    ("Cotton",        7.7, "Tolerant"),
    ("Rice",          3.0, "Sensitive"),
    ("Emmer wheat (ancient)", 4.0, "Sensitive"),
]

print(f"{'Crop':<24} {'Threshold dS/m':>14} {'~Osmotic (atm)':>14} {'Rating':<12}")
print("-" * 66)
for crop, threshold, rating in crops:
    # Approximate: 1 dS/m ~ 0.36 atm osmotic pressure
    osm_atm = threshold * 0.36
    print(f"{crop:<24} {threshold:>12.1f} {osm_atm:>12.1f} {rating:<12}")

# Mesopotamian timeline: salt accumulation over centuries
print("\\\n=== Simulated Salt Buildup in Southern Mesopotamia ===")
years = np.arange(0, 2001, 200)
# Salt accumulates roughly linearly without drainage
initial_ec = 1.0  # dS/m
annual_increase = 0.005  # dS/m per year (from irrigation without drainage)
ec_values = initial_ec + annual_increase * years
for y, ec in zip(years, ec_values):
    status = "wheat OK" if ec < 6 else "barley only" if ec < 8 else "crop failure"
    bar = "#" * int(ec * 3)
    print(f"  {y:>5} BCE equiv: EC = {ec:>5.1f} dS/m  {bar:<30} [{status}]")`,
      challenge: 'The van\'t Hoff equation assumes ideal dilute solutions. At high concentrations, real solutions deviate. Modify the code to add an "activity coefficient" \u03B3 (gamma) that reduces effective concentration: \u03C0_real = \u03B3 \u00D7 iCRT, where \u03B3 = 1.0 at low C and drops to ~0.7 at 1.0 M. How does this change the pressure estimates at high salinity?',
      successHint: 'The van\'t Hoff equation is the same equation used in reverse osmosis desalination — the technology that turns seawater into drinking water. To push water THROUGH a membrane against osmotic pressure, you must apply MORE than \u03C0 atm of external pressure. Understanding osmosis is understanding both why Mesopotamia failed and how modern desalination works.',
    },
    {
      title: 'Soil chemistry — cation exchange capacity and nutrient retention',
      concept: `Soil isn't just dirt — it's a **chemical reactor**. Clay particles in soil have negative surface charges that attract and hold positively charged ions (**cations**) like Ca\u00B2\u207A, Mg\u00B2\u207A, K\u207A, and Na\u207A. This is called **cation exchange capacity** (CEC), measured in meq/100g (milliequivalents per 100 grams of soil).

High CEC soils hold more nutrients and resist salinisation better because they can "buffer" against sudden salt influxes. Low CEC soils (sandy) let salts wash through quickly but also lose nutrients.

The key reaction is **cation exchange**: when salty irrigation water floods the soil, Na\u207A ions displace Ca\u00B2\u207A on the clay surfaces:

**Clay-Ca + 2Na\u207A \u2192 Clay-Na\u2082 + Ca\u00B2\u207A**

This is devastating: Ca\u00B2\u207A holds clay particles together in stable aggregates. When Na\u207A replaces it, clay disperses, pores collapse, and the soil becomes impermeable — a condition called **sodicity**. The soil seals itself, making drainage impossible.

\uD83D\uDCDA *CEC is the soil's "ion wallet" — it determines how many nutrient cations the soil can hold. Sandy soils have CEC of 5-10; clay soils 30-60; organic soils up to 200 meq/100g.*`,
      analogy: 'Imagine a parking lot (the clay surface) with spaces for cars (cations). Calcium ions are big trucks that take up a space firmly. Sodium ions are small motorcycles — they fit in the spaces but don\'t hold things together. When too many motorcycles (Na\u207A) replace trucks (Ca\u00B2\u207A), the parking lot structure falls apart. That\'s sodicity — the soil loses its structure.',
      storyConnection: 'Mesopotamian alluvial soils from the Tigris-Euphrates floodplain were rich in montmorillonite clay — high CEC, excellent for agriculture. But the same high CEC that made them fertile also made them vulnerable to sodium accumulation. Once Na\u207A dominated the exchange sites, the soil became waterlogged and impermeable. Archaeological soil cores from ancient Sumerian fields show exactly this sodium-calcium swap.',
      checkQuestion: 'A soil has CEC of 40 meq/100g. If 60% of exchange sites are occupied by Na\u207A, what is the Exchangeable Sodium Percentage (ESP)?',
      checkAnswer: 'ESP = (Na on exchange sites / CEC) \u00D7 100 = 60%. Soils with ESP > 15% are classified as "sodic" — the structure is degraded. At 60%, this soil is severely sodic: impermeable, waterlogged, and virtually useless for agriculture without intensive gypsum treatment.',
      codeIntro: 'Model cation exchange reactions as salty irrigation water displaces calcium from clay surfaces.',
      code: `import numpy as np

def cation_exchange(cec, initial_ca_pct, irrigation_na_meq, n_irrigations):
    """
    Model cation exchange over repeated irrigation events.
    Na+ in irrigation water displaces Ca2+ from clay surfaces.
    """
    ca_meq = cec * initial_ca_pct / 100  # Ca on exchange sites
    na_meq = cec * (1 - initial_ca_pct / 100)  # Na on exchange sites
    history = [{"irr": 0, "ca_pct": initial_ca_pct,
                "na_pct": 100 - initial_ca_pct, "esp": 100 - initial_ca_pct}]

    for irr in range(1, n_irrigations + 1):
        # Each irrigation adds Na+ and displaces some Ca2+
        # Exchange rate depends on concentration difference
        exchange_rate = 0.03  # fraction of sites exchanged per event
        na_added = irrigation_na_meq * exchange_rate
        ca_displaced = min(na_added * 0.5, ca_meq * 0.02)  # Ca2+ needs 2 charges

        ca_meq = max(0, ca_meq - ca_displaced)
        na_meq = min(cec, na_meq + ca_displaced)

        ca_pct = ca_meq / cec * 100
        na_pct = na_meq / cec * 100
        esp = na_pct

        if irr % 10 == 0 or irr == 1:
            history.append({"irr": irr, "ca_pct": ca_pct,
                            "na_pct": na_pct, "esp": esp})

    return history

# Mesopotamian soil parameters
cec = 45  # meq/100g — typical for alluvial clay
initial_ca = 85  # % of exchange sites occupied by Ca2+

# Compare different irrigation water qualities
print("=== Cation Exchange Under Irrigation ===")
print(f"Soil CEC: {cec} meq/100g | Initial Ca: {initial_ca}%\\\n")

water_qualities = [
    ("Low-salt river water", 2),
    ("Moderate canal water", 8),
    ("High-salt reused water", 20),
    ("Brackish groundwater", 40),
]

for name, na_meq in water_qualities:
    history = cation_exchange(cec, initial_ca, na_meq, 200)
    print(f"{name} (Na = {na_meq} meq/L):")
    print(f"  {'Irrigation':<12} {'Ca%':>6} {'Na%':>6} {'ESP':>6} {'Status':<16}")
    print(f"  {'-'*48}")
    for h in history:
        status = ("Healthy" if h["esp"] < 15 else
                  "Degrading" if h["esp"] < 30 else "Sodic")
        print(f"  {h['irr']:<12} {h['ca_pct']:>5.1f} {h['na_pct']:>5.1f} "
              f"{h['esp']:>5.1f} {status:<16}")
    print()

# Soil structure vs ESP
print("=== Soil Structure Degradation ===")
esp_values = np.arange(0, 65, 5)
print(f"{'ESP (%)':>8} {'Infiltration':>14} {'Permeability':>14} {'Crop Yield':>12}")
print("-" * 50)
for esp in esp_values:
    infiltration = max(5, 100 * np.exp(-0.04 * esp))  # mm/hr
    permeability = max(0.1, 50 * np.exp(-0.05 * esp))  # mm/hr
    crop_yield = max(0, 100 * (1 - (esp / 50)**2))  # % of max
    print(f"{esp:>7.0f} {infiltration:>12.1f}mm/h {permeability:>12.1f}mm/h {crop_yield:>10.0f}%")`,
      challenge: 'Gypsum (CaSO\u2084) is the standard remedy for sodic soils — it adds Ca\u00B2\u207A to displace Na\u207A back off the exchange sites. Add a "gypsum treatment" step after every 50 irrigations that restores 20% of the Ca on exchange sites. Does it prevent sodicity long-term, or only delay it?',
      successHint: 'Cation exchange chemistry governs soil fertility worldwide. The same reactions that destroyed Sumerian agriculture are happening today in irrigated farmland across Australia, Pakistan, and California. Understanding CEC and ESP is essential for any soil scientist or agricultural engineer.',
    },
    {
      title: 'Evapotranspiration modelling — the Penman-Monteith equation',
      concept: `**Evapotranspiration** (ET) is the combined water loss from soil evaporation and plant transpiration. It determines how much irrigation water a crop actually needs — and how much salt gets left behind when that water evaporates.

The **Penman-Monteith equation** is the gold standard for estimating ET:

**ET\u2080 = [0.408\u0394(R_n - G) + \u03B3(900/(T+273))u\u2082(e_s - e_a)] / [\u0394 + \u03B3(1 + 0.34u\u2082)]**

Where ET\u2080 is reference evapotranspiration (mm/day), \u0394 is the slope of the saturation vapour pressure curve, R_n is net radiation, G is soil heat flux, \u03B3 is the psychrometric constant, T is mean temperature, u\u2082 is wind speed at 2 m, and (e_s - e_a) is the vapour pressure deficit.

In hot, arid Mesopotamia, ET was extremely high — 8-12 mm/day in summer. This means every square metre of irrigated field lost 8-12 litres of water daily to the atmosphere, leaving ALL dissolved salts behind in the soil.

\uD83D\uDCDA *The Penman-Monteith equation combines energy balance (how much solar energy is available to evaporate water) with aerodynamic factors (how quickly wind removes humid air from the crop surface). It was adopted by the FAO as the universal standard in 1990.*`,
      analogy: 'Imagine hanging wet laundry on a clothesline. On a hot, sunny, windy, dry day, clothes dry fast — high ET. On a cool, cloudy, calm, humid day, they stay wet — low ET. The Penman-Monteith equation captures all four factors: temperature (energy), sunlight (radiation), wind (aerodynamic transport), and humidity (vapour pressure deficit).',
      storyConnection: 'Mesopotamian farmers had no equation, but they understood ET intuitively. They irrigated at night to reduce evaporation, planted date palms to shade smaller crops, and oriented canals to minimise surface area exposed to wind. Despite these strategies, the relentless Mesopotamian sun drove ET rates that inevitably concentrated salts faster than rainfall could flush them.',
      checkQuestion: 'If ET is 10 mm/day and irrigation water contains 1 g/L of salt, how much salt accumulates in 1 m\u00B2 of soil per day?',
      checkAnswer: '10 mm/day = 10 L/m\u00B2/day of water evaporated. If the water contained 1 g/L, then 10 g of salt is left behind per m\u00B2 per day. Over a 200-day growing season, that\'s 2 kg/m\u00B2 = 20 tonnes per hectare per year. Without drainage to flush it out, the salt accumulates relentlessly.',
      codeIntro: 'Implement a simplified Penman-Monteith model and compare ET rates across Mesopotamian seasons.',
      code: `import numpy as np

def penman_monteith_daily(temp_c, rh_pct, wind_ms, radiation_mj):
    """
    Simplified FAO Penman-Monteith reference ET (mm/day).
    temp_c: mean daily temperature (°C)
    rh_pct: relative humidity (%)
    wind_ms: wind speed at 2m (m/s)
    radiation_mj: net radiation (MJ/m²/day)
    """
    T = temp_c
    # Saturation vapour pressure
    e_s = 0.6108 * np.exp(17.27 * T / (T + 237.3))
    # Actual vapour pressure
    e_a = e_s * rh_pct / 100
    # Slope of saturation vapour pressure curve
    delta = 4098 * e_s / (T + 237.3)**2
    # Psychrometric constant (for standard atmosphere)
    gamma = 0.0665
    # Soil heat flux (approx 0 for daily)
    G = 0
    # FAO Penman-Monteith
    num = 0.408 * delta * (radiation_mj - G) + gamma * (900 / (T + 273)) * wind_ms * (e_s - e_a)
    den = delta + gamma * (1 + 0.34 * wind_ms)
    et0 = max(0, num / den)
    return et0

# Mesopotamian climate by month (approximate for southern Iraq)
months = [
    {"name": "Jan",  "temp": 10, "rh": 70, "wind": 2.5, "rad": 8},
    {"name": "Feb",  "temp": 12, "rh": 60, "wind": 3.0, "rad": 11},
    {"name": "Mar",  "temp": 17, "rh": 50, "wind": 3.5, "rad": 15},
    {"name": "Apr",  "temp": 23, "rh": 40, "wind": 3.5, "rad": 19},
    {"name": "May",  "temp": 30, "rh": 25, "wind": 3.5, "rad": 23},
    {"name": "Jun",  "temp": 35, "rh": 15, "wind": 4.0, "rad": 25},
    {"name": "Jul",  "temp": 37, "rh": 12, "wind": 4.0, "rad": 25},
    {"name": "Aug",  "temp": 37, "rh": 13, "wind": 3.5, "rad": 23},
    {"name": "Sep",  "temp": 33, "rh": 18, "wind": 3.0, "rad": 19},
    {"name": "Oct",  "temp": 26, "rh": 30, "wind": 2.5, "rad": 14},
    {"name": "Nov",  "temp": 18, "rh": 50, "wind": 2.5, "rad": 9},
    {"name": "Dec",  "temp": 12, "rh": 65, "wind": 2.5, "rad": 7},
]

print("=== Penman-Monteith ET₀ for Southern Mesopotamia ===")
print(f"{'Month':<6} {'Temp°C':>7} {'RH%':>5} {'Wind':>6} {'Rad':>5} {'ET₀ mm/d':>9} {'ET₀ mm/mo':>10}")
print("-" * 50)

annual_et = 0
for m in months:
    et0 = penman_monteith_daily(m["temp"], m["rh"], m["wind"], m["rad"])
    days = 30
    monthly_et = et0 * days
    annual_et += monthly_et
    bar = "█" * int(et0)
    print(f"{m['name']:<6} {m['temp']:>5} {m['rh']:>5} {m['wind']:>5.1f} {m['rad']:>5} "
          f"{et0:>7.1f} {monthly_et:>9.0f}  {bar}")

print(f"\\\nAnnual ET₀: {annual_et:.0f} mm = {annual_et/1000:.1f} m of water per m² per year")
print(f"Annual rainfall in southern Mesopotamia: ~150 mm")
print(f"Deficit: {annual_et - 150:.0f} mm — ALL must come from irrigation")

# Salt accumulation model
print("\\\n=== Salt Accumulation from Irrigation ===")
salt_conc = 0.5  # g/L in canal water
print(f"Irrigation water salinity: {salt_conc} g/L")
print(f"{'Month':<6} {'ET mm/d':>8} {'Salt deposited g/m²/d':>22} {'Monthly kg/ha':>14}")
print("-" * 52)
annual_salt = 0
for m in months:
    et0 = penman_monteith_daily(m["temp"], m["rh"], m["wind"], m["rad"])
    salt_per_day = et0 * salt_conc  # g/m²/day
    salt_monthly = salt_per_day * 30 / 1000 * 10000  # kg/ha/month
    annual_salt += salt_monthly
    print(f"{m['name']:<6} {et0:>6.1f} {salt_per_day:>20.1f} {salt_monthly:>12.0f}")

print(f"\\\nAnnual salt deposition: {annual_salt:.0f} kg/ha = {annual_salt/1000:.1f} tonnes/ha")
print("Without drainage, this salt stays permanently in the root zone.")`,
      challenge: 'Crop ET is lower than reference ET by a "crop coefficient" (K_c): ET_crop = K_c \u00D7 ET\u2080. For barley, K_c varies from 0.3 (seedling) to 1.15 (mid-season) to 0.25 (harvest). Modify the model to show actual barley water demand by month, assuming planting in November and harvest in April. How does this change the salt accumulation estimate?',
      successHint: 'The Penman-Monteith equation is used by every irrigation engineer, hydrologist, and climate modeller in the world. FAO uses it to estimate global crop water requirements. You now understand the physics behind water demand — the same physics that drove Mesopotamian salinisation and that governs every irrigated farm on Earth today.',
    },
    {
      title: 'Drainage engineering — the Hooghoudt equation',
      concept: `The ultimate defence against salinisation is **drainage** — removing salty water from the root zone before salts accumulate. The **Hooghoudt equation** calculates the drain spacing needed to maintain the water table below a safe depth:

**q = (8K\u2082dh + 4K\u2081h\u00B2) / L\u00B2**

Where q is the drainage rate (m/day), K\u2081 is hydraulic conductivity above the drains, K\u2082 is below the drains, d is the "equivalent depth" to the impermeable layer, h is the water table height above the drains, and L is the spacing between drains.

The critical insight: **drain spacing L is the control variable**. Too wide and the water table rises, bringing salts into the root zone. Too narrow and the cost is prohibitive. The Hooghoudt equation finds the optimal spacing.

Ancient Mesopotamians had no subsurface drainage — this technology only became widespread in the 19th century. Had they been able to install tile drains 1.5 m below the surface at 20-30 m spacing, the salinisation crisis might have been averted entirely.

\uD83D\uDCDA *The Hooghoudt equation is a steady-state solution to the groundwater flow equation. "Steady state" means the drainage rate equals the recharge rate — the water table isn't rising or falling.*`,
      analogy: 'Imagine a bathtub with the tap running (irrigation) and the drain open (subsurface drainage). If the tap flows faster than the drain, the water level rises. The Hooghoudt equation tells you how big the drain needs to be (and where to put it) so the water level stays below a target height. In a field, the "water level" is the water table, and "below target" means below the root zone.',
      storyConnection: 'Sumerian and Akkadian texts describe "white earth" — fields abandoned because of salt crusting. These fields had no engineered drainage. Modern Iraq\'s Muthanna province installed subsurface drainage in the 1970s using the Hooghoudt equation, reclaiming land that had been salt-damaged since the Bronze Age. The equation solved a 4,000-year-old problem.',
      checkQuestion: 'If you double the drain spacing L, what happens to the drainage rate q? (Look at the equation: q is proportional to 1/L\u00B2.)',
      checkAnswer: 'q drops to one-quarter. Doubling the spacing reduces drainage by 4\u00D7 — the relationship is quadratic, not linear. This means drain spacing is extremely sensitive: a small increase in spacing causes a large decrease in drainage. Getting the spacing right is critical.',
      codeIntro: 'Calculate optimal drain spacing for Mesopotamian soil conditions using the Hooghoudt equation.',
      code: `import numpy as np

def hooghoudt_drainage(K1, K2, d, h, L):
    """
    Hooghoudt equation for steady-state drainage rate.
    K1: hydraulic conductivity above drains (m/day)
    K2: hydraulic conductivity below drains (m/day)
    d: equivalent depth to impermeable layer (m)
    h: water table height above drain level (m)
    L: drain spacing (m)
    Returns: drainage rate q (mm/day)
    """
    q = (8 * K2 * d * h + 4 * K1 * h**2) / L**2
    return q * 1000  # convert m/day to mm/day

def required_spacing(K1, K2, d, h, target_q_mm):
    """Find drain spacing that achieves target drainage rate."""
    target_q = target_q_mm / 1000  # mm/day to m/day
    L_squared = (8 * K2 * d * h + 4 * K1 * h**2) / target_q
    return np.sqrt(L_squared)

# Mesopotamian soil types
soils = [
    {"name": "Sandy loam",   "K1": 1.0,  "K2": 0.5,  "d": 3.0},
    {"name": "Silt loam",    "K1": 0.3,  "K2": 0.15, "d": 2.5},
    {"name": "Clay loam",    "K1": 0.08, "K2": 0.04, "d": 2.0},
    {"name": "Heavy clay",   "K1": 0.02, "K2": 0.01, "d": 1.5},
    {"name": "Alluvial (Mesopotamia)", "K1": 0.15, "K2": 0.08, "d": 2.5},
]

h = 0.6  # water table 0.6m above drains (target: keep below 1.2m depth)

print("=== Drainage Rate vs Drain Spacing ===")
print(f"Water table height above drains: {h} m\\\n")

spacings = [10, 15, 20, 30, 50, 75, 100]
header = f"{'Soil Type':<26}" + "".join(f"{s:>6}m" for s in spacings)
print(header)
print("-" * len(header))

for soil in soils:
    rates = [hooghoudt_drainage(soil["K1"], soil["K2"], soil["d"], h, L)
             for L in spacings]
    row = f"{soil['name']:<26}" + "".join(f"{r:>6.1f}" for r in rates)
    print(row)

# Required spacing for target drainage
print("\\\n=== Required Drain Spacing for Target Drainage ===")
target_rates = [2.0, 4.0, 6.0, 8.0]  # mm/day
print(f"{'Soil Type':<26}" + "".join(f"{t:>6.0f}mm/d" for t in target_rates))
print("-" * 52)

for soil in soils:
    spacings_req = [required_spacing(soil["K1"], soil["K2"], soil["d"], h, t)
                    for t in target_rates]
    row = f"{soil['name']:<26}" + "".join(f"{s:>6.0f}m" for s in spacings_req)
    print(row)

# Cost analysis
print("\\\n=== Drainage Cost per Hectare ===")
cost_per_m = 15  # cost per metre of drain pipe installed
print(f"Drain pipe cost: {cost_per_m} units/m\\\n")
meso_soil = soils[4]  # Mesopotamian alluvial
for target_q in target_rates:
    L = required_spacing(meso_soil["K1"], meso_soil["K2"], meso_soil["d"], h, target_q)
    drains_per_ha = 100 / L  # number of parallel drains in 100m
    total_length = drains_per_ha * 100  # each drain is 100m long
    cost = total_length * cost_per_m
    print(f"  Target {target_q:.0f} mm/day: spacing {L:.0f}m, "
          f"{drains_per_ha:.1f} drains/ha, cost {cost:.0f} units/ha")`,
      challenge: 'The Hooghoudt equation assumes steady state — but real drainage is transient. After a flood irrigation event, the water table rises and then slowly falls. Modify the code to simulate a transient scenario: start with h = 1.2 m (flooded), drain spacing 25 m, and calculate how many days it takes for h to drop below 0.3 m. (Hint: use Euler\'s method: h_new = h_old - q\u00D7dt/porosity.)',
      successHint: 'The Hooghoudt equation is the workhorse of agricultural drainage engineering worldwide. Every drainage system in Egypt, Pakistan, and the American West was designed using this equation or its derivatives. You now understand why Mesopotamia failed — they had no technology to remove salt — and how modern drainage engineering solves the problem.',
    },
    {
      title: 'Cuneiform data analysis — extracting trends from ancient records',
      concept: `Thousands of cuneiform tablets from Mesopotamia record agricultural data: crop yields, field sizes, irrigation schedules, barley-to-wheat ratios, and labour allocations. These are the **oldest quantitative datasets in human history** — and they tell the story of salinisation in hard numbers.

**Data analysis** means: cleaning the data (handling missing values, converting units), identifying trends (is yield increasing or decreasing over time?), calculating statistics (mean, variance, correlation), and drawing conclusions.

The key dataset: the **Ur III archives** (2112-2004 BCE) record barley yields across southern Mesopotamia in "gur per iku" (1 gur \u2248 300 litres, 1 iku \u2248 3,600 m\u00B2). By converting to modern units and plotting yield over time, we can see the decline that preceded Ur III\'s collapse.

The barley/wheat ratio is equally telling: in 3500 BCE, equal amounts of wheat and barley were grown. By 2500 BCE, it was 85% barley. By 1700 BCE, even barley yields had crashed. This ratio is a direct proxy for soil salinity — wheat fails before barley.

\uD83D\uDCDA *Time series analysis looks for patterns in data collected over time: trends (long-term direction), seasonality (regular cycles), and anomalies (unusual events). It's used in economics, climate science, epidemiology, and archaeology.*`,
      analogy: 'Imagine tracking your exam scores over four years of school. If they gradually decline despite studying more, something systemic is wrong — maybe the material is getting harder, or you\'re sleeping less. Cuneiform yield records are Mesopotamia\'s "exam scores" — and the declining trend reveals the systemic problem of salinisation.',
      storyConnection: 'The tablet BM 85196 from the British Museum records field inspections in Lagash around 2100 BCE. It lists field-by-field yields, with notes about "white earth" (salt crusting) and "tired fields" (exhausted soil). These are the field notes of ancient agricultural inspectors — the first environmental monitoring reports in history.',
      checkQuestion: 'If barley yield drops from 2,500 litres/hectare to 1,500 litres/hectare over 200 years, what is the average annual decline rate?',
      checkAnswer: 'Decline = 2,500 - 1,500 = 1,000 litres/ha over 200 years = 5 litres/ha/year. As a percentage: 5/2,500 = 0.2% per year. This seems tiny — but compounded over centuries, it means total agricultural collapse. Slow, steady decline is the hardest crisis to detect and respond to.',
      codeIntro: 'Analyse simulated cuneiform agricultural records to identify salinisation trends over centuries.',
      code: `import numpy as np

np.random.seed(42)

# Simulate cuneiform agricultural records spanning 2000 years
# Based on real archaeological data patterns from southern Mesopotamia
start_year = -3500  # 3500 BCE
end_year = -1500    # 1500 BCE
n_records = 200     # surviving tablet records

years = np.sort(np.random.randint(start_year, end_year, n_records))

# Barley yield: starts high, declines due to salinisation
base_yield = 2800  # litres/hectare at 3500 BCE
salt_decline_rate = 0.0004  # fractional decline per year
noise_std = 300  # year-to-year variation

barley_yields = []
wheat_fractions = []
for y in years:
    elapsed = y - start_year
    # Yield declines exponentially with salt accumulation
    salt_factor = np.exp(-salt_decline_rate * elapsed)
    yield_val = base_yield * salt_factor + np.random.normal(0, noise_std)
    barley_yields.append(max(200, yield_val))
    # Wheat fraction declines faster (wheat is less salt-tolerant)
    wheat_frac = max(0, 50 * np.exp(-0.001 * elapsed) + np.random.normal(0, 5))
    wheat_fractions.append(min(100, max(0, wheat_frac)))

barley_yields = np.array(barley_yields)
wheat_fractions = np.array(wheat_fractions)

# Bin data by century for trend analysis
print("=== Mesopotamian Agricultural Data Analysis ===")
print(f"Records analysed: {n_records} cuneiform tablets\\\n")

centuries = np.arange(start_year, end_year, 200)
print(f"{'Period':<16} {'N records':>9} {'Mean Yield':>11} {'Wheat %':>9} {'Status':<16}")
print("-" * 63)

for c_start in centuries:
    c_end = c_start + 200
    mask = (years >= c_start) & (years < c_end)
    if np.sum(mask) < 2:
        continue
    mean_yield = np.mean(barley_yields[mask])
    std_yield = np.std(barley_yields[mask])
    mean_wheat = np.mean(wheat_fractions[mask])
    n = np.sum(mask)

    status = ("Productive" if mean_yield > 2000 else
              "Declining" if mean_yield > 1200 else
              "Critical" if mean_yield > 600 else "Collapsed")

    label = f"{abs(c_start)}-{abs(c_end)} BCE"
    print(f"{label:<16} {n:>7} {mean_yield:>9.0f} L/ha {mean_wheat:>7.0f}% {status:<16}")

# Linear regression for trend
print("\\\n=== Trend Analysis (Linear Regression) ===")
x = years - years[0]  # years since start
coeffs = np.polyfit(x, barley_yields, 1)
slope = coeffs[0]
intercept = coeffs[1]
predicted = np.polyval(coeffs, x)
residuals = barley_yields - predicted
r_squared = 1 - np.sum(residuals**2) / np.sum((barley_yields - np.mean(barley_yields))**2)

print(f"Yield trend: {slope:.2f} litres/ha per year")
print(f"R² = {r_squared:.3f} (fraction of variance explained by time)")
print(f"At this rate, yield reaches zero around {start_year + int(-intercept/slope)} BCE")

# Correlation between wheat fraction and yield
corr = np.corrcoef(wheat_fractions, barley_yields)[0, 1]
print(f"\\\nCorrelation: wheat fraction vs barley yield = {corr:.3f}")
print("(Both decline together — driven by the same cause: salinisation)")

# Detect inflection point
print("\\\n=== Detecting the Crisis Onset ===")
window = 20
for i in range(window, len(barley_yields) - window):
    before = np.mean(barley_yields[i-window:i])
    after = np.mean(barley_yields[i:i+window])
    if before - after > 400:
        print(f"Sharp decline detected around {years[i]} BCE")
        print(f"  Before: {before:.0f} L/ha | After: {after:.0f} L/ha")
        print(f"  Drop: {before - after:.0f} L/ha ({(before-after)/before*100:.0f}%)")
        break`,
      challenge: 'Add a "drought detection" algorithm: find years where yield drops more than 2 standard deviations below the local trend. These anomalies might represent drought years, canal failures, or warfare. How many "crisis years" do you detect in 2,000 years of records? Does the frequency of crises increase as salinisation worsens?',
      successHint: 'You just performed time-series analysis on the oldest quantitative dataset in history. The techniques — trend detection, correlation analysis, anomaly detection, regression — are identical to those used in modern climate science, epidemiology, and financial analysis. The data is cuneiform; the mathematics is universal.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Soil science, osmosis, drainage, and ancient data</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 2 dives into osmotic pressure, cation exchange chemistry, evapotranspiration modelling, drainage engineering, and cuneiform data analysis.
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
