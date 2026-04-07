import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function BankuraLevel3() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Oxidising vs reducing atmospheres — controlling the kiln\'s air',
      concept: `The amount of oxygen in a kiln dramatically affects the final colour and properties of the pottery. An **oxidising atmosphere** (excess air) allows iron oxides to fully oxidise to Fe2O3 (red/orange). A **reducing atmosphere** (limited air) forces iron oxides to lose oxygen, forming FeO (black/grey) or even metallic iron.

The reactions: Oxidising: 4Fe3O4 + O2 -> 6Fe2O3 (magnetite to hematite, grey to red). Reducing: Fe2O3 + CO -> 2FeO + CO2 (hematite to wustite, red to black). Carbon monoxide (CO) from incomplete combustion is the reducing agent.

Potters control atmosphere by adjusting air flow: open dampers = more air = oxidising. Close dampers = less air = reducing. This is why the same clay can produce red, black, or grey pottery depending on the firing atmosphere.`,
      analogy: 'Think of a campfire. Blazing bright with plenty of air (oxidising) — clean flames, minimal smoke. Smothered with a lid (reducing) — smoky, sooty, incomplete combustion. The pottery in the kiln "breathes" this atmosphere, and its chemistry changes accordingly.',
      storyConnection: 'The iconic red colour of Bankura terracotta comes from iron-rich laterite clay fired in an oxidising atmosphere. Some Bankura potters also produce black pottery by closing the kiln\'s air vents during the final hour of firing — starving the fire of oxygen and creating a reducing atmosphere. The same clay, the same temperature, but a completely different colour.',
      checkQuestion: 'If clay contains 5% iron oxide by weight and is fired in an oxidising atmosphere, what oxide forms? What colour? If fired in a reducing atmosphere?',
      checkAnswer: 'Oxidising: Fe2O3 (hematite) forms — colour is red/terracotta. Reducing: FeO (wustite) or Fe3O4 (magnetite) forms — colour is black/grey. The iron content is the same; only the oxidation state changes. This is why atmosphere control is as important as temperature control.',
      codeIntro: 'Model the chemistry of kiln atmospheres and predict pottery colour from iron oxide speciation.',
      code: `import numpy as np

# Kiln atmosphere chemistry model

class KilnAtmosphere:
    def __init__(self, O2_percent, CO_percent, CO2_percent, T_celsius):
        self.O2 = O2_percent
        self.CO = CO_percent
        self.CO2 = CO2_percent
        self.T = T_celsius

    def atmosphere_type(self):
        if self.O2 > 3:
            return "Strongly oxidising"
        elif self.O2 > 1:
            return "Mildly oxidising"
        elif self.CO > self.CO2 * 0.5:
            return "Strongly reducing"
        elif self.CO > 0.5:
            return "Mildly reducing"
        else:
            return "Neutral"

    def iron_oxide_speciation(self, fe_total_pct):
        """Predict iron oxide species based on atmosphere"""
        if self.O2 > 3:
            fe2o3 = fe_total_pct * 0.95  # mostly hematite
            fe3o4 = fe_total_pct * 0.04
            feo = fe_total_pct * 0.01
        elif self.O2 > 1:
            fe2o3 = fe_total_pct * 0.80
            fe3o4 = fe_total_pct * 0.15
            feo = fe_total_pct * 0.05
        elif self.CO > 2:
            fe2o3 = fe_total_pct * 0.05
            fe3o4 = fe_total_pct * 0.30
            feo = fe_total_pct * 0.65
        else:
            fe2o3 = fe_total_pct * 0.30
            fe3o4 = fe_total_pct * 0.50
            feo = fe_total_pct * 0.20
        return fe2o3, fe3o4, feo

    def predict_colour(self, fe_total_pct):
        fe2o3, fe3o4, feo = self.iron_oxide_speciation(fe_total_pct)
        if fe2o3 > fe_total_pct * 0.7:
            return "Red/terracotta"
        elif fe3o4 > fe_total_pct * 0.4:
            return "Dark grey/black"
        elif feo > fe_total_pct * 0.5:
            return "Black"
        else:
            return "Brown/mottled"

# Bankura clay: 6% total iron oxide
fe_content = 6.0

# Different atmosphere scenarios
atmospheres = [
    KilnAtmosphere(10, 0.1, 5, 900),   # wide open dampers
    KilnAtmosphere(5, 0.5, 8, 900),    # normal firing
    KilnAtmosphere(2, 1.0, 10, 900),   # slightly restricted
    KilnAtmosphere(0.5, 3.0, 12, 900), # dampers mostly closed
    KilnAtmosphere(0.1, 8.0, 8, 900),  # heavy reduction
]

print("=== Kiln Atmosphere and Pottery Colour ===")
print(f"Clay iron content: {fe_content}%")
print()
print(f"{'O2 %':>5} {'CO %':>5} {'Type':<22} {'Fe2O3':>6} {'Fe3O4':>6} {'FeO':>5} {'Colour':<16}")
print("-" * 68)

for atm in atmospheres:
    fe2o3, fe3o4, feo = atm.iron_oxide_speciation(fe_content)
    colour = atm.predict_colour(fe_content)
    print(f"{atm.O2:>5.1f} {atm.CO:>5.1f} {atm.atmosphere_type():<22} "
          f"{fe2o3:>4.1f}% {fe3o4:>4.1f}% {feo:>3.1f}% {colour:<16}")

# Firing schedule with atmosphere changes
print()
print("=== Traditional Bankura Firing: Atmosphere Timeline ===")
print("(Potters adjust dampers during the firing)")
print()

phases = [
    ("Water smoking (0-3h)", 25, 250, 8, 0.2, "Oxidising: ensure clean burn"),
    ("Ramp up (3-8h)", 250, 700, 5, 0.5, "Oxidising: burn organics"),
    ("High fire (8-12h)", 700, 900, 4, 0.8, "Oxidising: develop red colour"),
    ("Reduction (12-13h)", 900, 900, 0.2, 5.0, "Reducing: darken surface"),
    ("Re-oxidise (13-14h)", 900, 900, 6, 0.3, "Oxidising: lock in colour"),
    ("Cool (14-30h)", 900, 50, 10, 0.1, "Oxidising: prevent carbon"),
]

print(f"{'Phase':<30} {'T range':>10} {'O2%':>5} {'CO%':>5} {'Purpose':<28}")
print("-" * 80)

for name, T1, T2, o2, co, purpose in phases:
    print(f"{name:<30} {T1:>3}-{T2:>4} C {o2:>4.1f} {co:>4.1f} {purpose:<28}")

# Effect of iron content
print()
print("=== Iron Content vs Colour (oxidising atmosphere) ===")
print(f"{'Fe %':>6} {'Colour':<20} {'Intensity':<12}")
print("-" * 40)

for fe in [0.5, 1, 2, 3, 4, 6, 8, 10, 15]:
    atm_ox = KilnAtmosphere(5, 0.5, 8, 900)
    colour = atm_ox.predict_colour(fe)
    intensity = "Very pale" if fe < 2 else "Light" if fe < 4 else "Medium" if fe < 8 else "Strong" if fe < 12 else "Very dark"
    print(f"{fe:>6.1f} {colour:<20} {intensity:<12}")`,
      challenge: 'Design a "raku" firing technique where the pot is pulled from the kiln at 900 C and placed in sawdust (creating an intensely reducing atmosphere). Model the rapid reduction on the surface while the interior remains oxidised. What colour gradient results?',
      successHint: 'Atmosphere control is used in every high-temperature process: steel making (basic oxygen furnace), glass production (float glass), electronics (silicon wafer oxidation), and even food processing (modified atmosphere packaging). The chemistry of oxidation and reduction is universal.',
    },
    {
      title: 'Iron oxide colour chemistry — the science of terracotta red',
      concept: `The distinctive red of Bankura terracotta comes from **hematite** (alpha-Fe2O3). The colour depends on particle size, crystal structure, and the presence of other minerals. Fine-grained hematite is bright red; coarse-grained is dark red/purple. Mixed with silica, it can appear orange.

Other iron oxides produce different colours: **goethite** (FeOOH) is yellow/ochre (dehydrates to hematite above 300 C), **magnetite** (Fe3O4) is black, **wustite** (FeO) is black/grey, and **lepidocrocite** (gamma-FeOOH) is orange.

The colour is also affected by the clay matrix: alumina-rich clays produce warmer reds, silica-rich clays produce cooler/browner tones, and calcium-rich clays can produce cream or buff colours because calcium interferes with iron colour development.`,
      analogy: 'Iron oxide colour chemistry is like mixing paint. The "pigment" (iron oxide) comes in different "shades" (hematite=red, magnetite=black, goethite=yellow). The "medium" (clay matrix) affects the final appearance. And the "drying conditions" (kiln atmosphere) change the chemistry of the pigment itself.',
      storyConnection: 'Different Bankura villages produce slightly different reds because their local clays have different iron contents and mineral compositions. Panchmura clay (high iron, low calcium) gives the classic bright terracotta red. Bishnupur clay (moderate iron, some calcium) produces a warmer, more orange tone. Potters blend clays to achieve specific colour targets.',
      checkQuestion: 'A clay contains 8% iron as goethite (FeOOH). When fired above 300 C, goethite converts to hematite. What colour change occurs?',
      checkAnswer: 'Goethite is yellow/brown. It decomposes: 2FeOOH -> Fe2O3 + H2O. The hematite (Fe2O3) formed is red. So the piece changes from yellow/brown to red during firing. This colour change is a useful indicator that the kiln has passed 300 C.',
      codeIntro: 'Model the iron oxide colour chemistry and predict pottery colour from clay composition.',
      code: `import numpy as np

# Iron oxide colour prediction model

class ClayComposition:
    def __init__(self, name, fe2o3_pct, al2o3_pct, sio2_pct, cao_pct, mgo_pct):
        self.name = name
        self.fe2o3 = fe2o3_pct
        self.al2o3 = al2o3_pct
        self.sio2 = sio2_pct
        self.cao = cao_pct
        self.mgo = mgo_pct

    def fired_colour(self, T_peak, atmosphere="oxidising"):
        """Predict colour from composition and firing conditions"""
        # Iron determines base colour
        if atmosphere == "oxidising":
            if self.fe2o3 > 8:
                base = "Dark red"
            elif self.fe2o3 > 5:
                base = "Medium red"
            elif self.fe2o3 > 3:
                base = "Light red"
            elif self.fe2o3 > 1:
                base = "Buff/pink"
            else:
                base = "White/cream"
        else:
            base = "Grey/black"

        # Calcium lightens and yellowens
        if self.cao > 5:
            modifier = " (cream tint)"
        elif self.cao > 2:
            modifier = " (warm tone)"
        else:
            modifier = ""

        # Temperature affects depth
        if T_peak > 1000:
            depth = "deep "
        elif T_peak > 850:
            depth = ""
        else:
            depth = "pale "

        return depth + base + modifier

    def rgb_estimate(self, T_peak, atmosphere="oxidising"):
        """Rough RGB colour estimate"""
        if atmosphere != "oxidising":
            return (80, 75, 70)  # grey/black
        fe = self.fe2o3
        r = min(255, int(180 + fe * 5 + T_peak * 0.02))
        g = min(255, int(120 - fe * 3 + self.cao * 10))
        b = min(255, int(80 - fe * 5 + self.cao * 5))
        return (min(r, 255), max(g, 50), max(b, 30))

# Different Bankura-area clays
clays = [
    ClayComposition("Panchmura (classic)", 7.5, 25, 55, 0.5, 0.3),
    ClayComposition("Bishnupur (warm)", 5.0, 22, 60, 3.0, 1.0),
    ClayComposition("Sonamukhi (pale)", 3.0, 28, 58, 1.0, 0.5),
    ClayComposition("Laterite-rich", 12.0, 20, 50, 0.3, 0.2),
    ClayComposition("River clay (dark)", 9.0, 18, 55, 2.0, 1.5),
    ClayComposition("Kaolin-blend (white)", 1.0, 35, 52, 0.2, 0.1),
]

print("=== Clay Composition and Fired Colour ===")
print()
print(f"{'Clay Name':<24} {'Fe2O3':>6} {'Al2O3':>6} {'CaO':>5} {'Colour (900C ox)':>24}")
print("-" * 68)

for clay in clays:
    colour = clay.fired_colour(900, "oxidising")
    rgb = clay.rgb_estimate(900)
    print(f"{clay.name:<24} {clay.fe2o3:>4.1f}% {clay.al2o3:>4.0f}% {clay.cao:>3.1f}% "
          f"{colour:>24} RGB({rgb[0]},{rgb[1]},{rgb[2]})")

# Temperature effect on colour
print()
print("=== Temperature Effect on Colour (Panchmura clay) ===")
panchmura = clays[0]

print(f"{'Temp (C)':>10} {'Colour':<28} {'RGB':<16}")
print("-" * 56)

for T in [600, 700, 800, 850, 900, 950, 1000, 1050, 1100]:
    colour = panchmura.fired_colour(T)
    rgb = panchmura.rgb_estimate(T)
    print(f"{T:>10} {colour:<28} ({rgb[0]:>3},{rgb[1]:>3},{rgb[2]:>3})")

# Blending clays for target colour
print()
print("=== Clay Blending for Target Colour ===")
print("Mixing Panchmura (red) with Kaolin (white) to adjust intensity")
print()
print(f"{'Panchmura %':>12} {'Kaolin %':>10} {'Fe2O3':>6} {'Colour':>20}")
print("-" * 50)

for pct_p in [100, 80, 60, 40, 20, 0]:
    pct_k = 100 - pct_p
    fe_blend = panchmura.fe2o3 * pct_p / 100 + clays[-1].fe2o3 * pct_k / 100
    al_blend = panchmura.al2o3 * pct_p / 100 + clays[-1].al2o3 * pct_k / 100
    si_blend = panchmura.sio2 * pct_p / 100 + clays[-1].sio2 * pct_k / 100
    ca_blend = panchmura.cao * pct_p / 100 + clays[-1].cao * pct_k / 100
    blend = ClayComposition("Blend", fe_blend, al_blend, si_blend, ca_blend, 0.3)
    colour = blend.fired_colour(900)
    print(f"{pct_p:>12} {pct_k:>10} {fe_blend:>4.1f}% {colour:>20}")`,
      challenge: 'A gallery requests "warm orange" terracotta (not the classic red). Design a clay blend that achieves this: higher calcium content shifts the colour from red to orange. What blend of Panchmura and Bishnupur clay gives the best orange? Verify with the colour prediction model.',
      successHint: 'Colour chemistry in ceramics is the same science used in paint manufacturing, cosmetics formulation, glass colouring, and even food colouring. Understanding how metal oxides produce colours under different conditions is valuable across many industries.',
    },
    {
      title: 'Kiln atmosphere dynamics — oxygen profiles during firing',
      concept: `The kiln atmosphere changes continuously during firing as fuel burns and air enters through dampers. The oxygen level is governed by a mass balance: **dO2/dt = (O2_in * air_flow - O2_consumed_by_combustion) / kiln_volume**.

Wood combustion consumes oxygen: **C + O2 -> CO2** (complete) or **2C + O2 -> 2CO** (incomplete, reducing). The ratio of air supplied to the theoretically needed air is called the **excess air ratio** (lambda). Lambda > 1 means oxidising, lambda < 1 means reducing.

Measuring and controlling the oxygen level in real-time allows precise atmosphere management. Modern kilns use oxygen sensors; traditional potters read smoke colour (clear = oxidising, thick grey = reducing) and flame character (blue = oxidising, yellow/orange = reducing).`,
      analogy: 'Managing kiln atmosphere is like adjusting a gas stove. Blue flame (plenty of air, complete combustion) = oxidising. Yellow flame (restricted air, incomplete combustion) = reducing. The potter\'s damper is like the stove\'s air control ring.',
      storyConnection: 'Master Bankura potters can produce a striking "flashed" effect: parts of the piece that face the fire directly get intense oxygen and turn bright red, while parts in the shadow get less oxygen and turn darker. This natural variation gives each piece a unique character — no two are identical.',
      checkQuestion: 'Wood requires 5.7 kg of air per kg for complete combustion. If a kiln uses 10 kg/h of wood and receives 40 kg/h of air, what is the excess air ratio?',
      checkAnswer: 'Theoretical air = 10 * 5.7 = 57 kg/h. Excess air ratio = 40/57 = 0.70. Lambda < 1 means reducing atmosphere. The kiln needs 57 kg/h of air for complete combustion but only gets 40 — some carbon will form CO instead of CO2.',
      codeIntro: 'Simulate kiln atmosphere dynamics including oxygen consumption, CO production, and atmosphere transitions.',
      code: `import numpy as np

# Kiln atmosphere dynamics simulation

def kiln_atmosphere_sim(
    kiln_vol_m3,
    fuel_rate_kg_h,       # wood consumption
    air_flow_kg_h,        # air supply
    T_kiln_C,
    duration_hours,
    dt_hours=0.01,
):
    """Simulate O2, CO, CO2 levels in kiln over time"""
    # Air composition
    O2_air = 0.21  # 21% O2 in air
    air_density = 1.225  # kg/m3 at STP

    # Wood combustion: C + O2 -> CO2 (complete)
    # or 2C + O2 -> 2CO (incomplete)
    # 1 kg wood (50% carbon) needs 5.7 kg air for complete combustion
    stoich_air = 5.7  # kg air per kg wood

    # Initial kiln atmosphere
    O2 = 0.21  # volume fraction
    CO = 0.0
    CO2 = 0.0
    N2 = 0.79

    history = []
    t = 0

    while t < duration_hours:
        # Excess air ratio
        lam = air_flow_kg_h / (fuel_rate_kg_h * stoich_air) if fuel_rate_kg_h > 0 else 99

        # O2 consumed by combustion
        carbon_rate = fuel_rate_kg_h * 0.50 / 12  # mol C per hour
        O2_needed = carbon_rate  # mol O2 per hour (for CO2)

        # Available O2
        O2_available = air_flow_kg_h * O2_air / 32  # mol O2/h from air

        if O2_available >= O2_needed:
            # Oxidising: all carbon -> CO2
            O2_consumed = O2_needed
            CO2_produced = carbon_rate
            CO_produced = 0
        else:
            # Reducing: some carbon -> CO
            O2_consumed = O2_available
            CO2_produced = O2_available  # 1 mol O2 -> 1 mol CO2
            CO_produced = 2 * (carbon_rate - O2_available)  # excess C -> CO

        # Update gas composition (simplified, assuming well-mixed)
        total_mol = kiln_vol_m3 * 1000 / 22.4  # approximate total moles
        O2 = max(0, (O2 * total_mol + (O2_available - O2_consumed) * dt_hours) / total_mol)
        CO2 = max(0, CO2 + CO2_produced * dt_hours / total_mol)
        CO = max(0, CO + CO_produced * dt_hours / total_mol - CO * 0.1 * dt_hours)

        if int(t / dt_hours) % int(0.5 / dt_hours) == 0:
            atm = "Oxidising" if lam > 1.1 else "Neutral" if lam > 0.95 else "Reducing"
            history.append({
                "t": t, "O2_pct": O2 * 100, "CO_pct": CO * 100,
                "CO2_pct": CO2 * 100, "lambda": lam, "atm": atm
            })

        t += dt_hours

    return history

# Scenario: Traditional Bankura firing
kiln_vol = 2.0  # m3

print("=== Kiln Atmosphere During Traditional Firing ===")
print()

# Firing phases with different fuel and air rates
phases = [
    ("Light fire (0-3h)", 5, 40, 3),     # low fuel, lots of air
    ("Building heat (3-6h)", 10, 50, 3),  # more fuel
    ("Full fire (6-10h)", 15, 60, 4),     # heavy fuel, good air
    ("Reduction phase (10-11h)", 15, 20, 1),  # close dampers!
    ("Re-oxidise (11-12h)", 8, 60, 1),    # open dampers, reduce fuel
    ("Cooling (12-16h)", 2, 30, 4),       # dying fire, open kiln
]

print(f"{'Phase':<28} {'Fuel':>6} {'Air':>6} {'Lambda':>8} {'O2 %':>6} {'CO %':>6} {'Atm':<12}")
print("-" * 74)

for name, fuel, air, dur in phases:
    hist = kiln_atmosphere_sim(kiln_vol, fuel, air, 900, dur)
    final = hist[-1] if hist else {"O2_pct": 21, "CO_pct": 0, "lambda": 99, "atm": "N/A"}
    lam = air / (fuel * 5.7) if fuel > 0 else 99
    print(f"{name:<28} {fuel:>4} kg/h {air:>4} {lam:>6.2f} "
          f"{final['O2_pct']:>4.1f} {final['CO_pct']:>4.1f} {final['atm']:<12}")

# Continuous simulation of the full firing
print()
print("=== Hour-by-Hour Atmosphere Profile ===")

# Build a fuel/air profile for 16 hours
full_hist = []
for name, fuel, air, dur in phases:
    segment = kiln_atmosphere_sim(kiln_vol, fuel, air, 900, dur)
    full_hist.extend(segment)

print(f"{'Hour':>5} {'O2 %':>6} {'CO %':>6} {'CO2 %':>6} {'Lambda':>8} {'Atmosphere':<14}")
print("-" * 48)

t_offset = 0
for name, fuel, air, dur in phases:
    segment = kiln_atmosphere_sim(kiln_vol, fuel, air, 900, dur)
    for h in segment:
        if int((h["t"] + t_offset) * 2) % 2 == 0 and h["t"] < 0.01:
            actual_t = h["t"] + t_offset
            print(f"{actual_t:>5.1f} {h['O2_pct']:>4.1f} {h['CO_pct']:>4.1f} "
                  f"{h['CO2_pct']:>4.1f} {h['lambda']:>6.2f} {h['atm']:<14}")
    t_offset += dur

# Smoke colour guide
print()
print("=== Potter's Smoke Reading Guide ===")
print("  Clear/invisible:   O2 > 5% — strongly oxidising")
print("  Light haze:        O2 2-5% — mildly oxidising")
print("  Grey smoke:        O2 < 2% — neutral to mildly reducing")
print("  Thick grey/black:  CO > 2% — strongly reducing")
print("  Flames at chimney: CO > 5% — dangerously reducing")`,
      challenge: 'Design a "controlled reduction" schedule that maintains exactly 0.5% O2 and 1% CO for 2 hours. What fuel rate and air flow combination achieves this? How sensitive is the atmosphere to a 10% change in air flow? This precision is what separates master potters from beginners.',
      successHint: 'Atmosphere control in high-temperature processing is critical in steelmaking (basic oxygen process), glass production, semiconductor manufacturing (oxidation furnaces), and food processing (modified atmosphere). The mass balance and combustion chemistry you just modelled are the same tools used in all these industries.',
    },
    {
      title: 'Computational thermodynamics — phase diagrams for clay minerals',
      concept: `A **phase diagram** shows which mineral phases are stable at different temperatures and compositions. For clay, the key diagram is the **SiO2-Al2O3 binary system**, which predicts what minerals form during firing.

Key phases: **kaolinite** (below 550 C), **metakaolin** (550-925 C, amorphous), **spinel** (925-1050 C), **mullite** (above 1050 C), and **cristobalite** (above 1100 C in silica-rich compositions). The phase boundaries shift with composition and the presence of fluxing agents (like feldspar, calcium, or iron).

In the code below, you will build a simplified phase diagram calculator that predicts which minerals are present at any temperature for a given clay composition.`,
      analogy: 'A phase diagram is like a weather map for materials. Just as a weather map shows where it rains, snows, or is sunny based on temperature and humidity, a phase diagram shows which minerals form based on temperature and composition. Cross a boundary line and the "weather" changes — a new phase appears.',
      storyConnection: 'The Bankura potter does not know phase diagrams, but they know the results: fire too low and the piece is weak (still metakaolin, no mullite). Fire to the right temperature and it is strong (mullite has formed). Fire too high and it warps or vitrifies (too much glass phase). The phase diagram explains all these traditional observations.',
      checkQuestion: 'Kaolinite transforms to metakaolin at 550 C. Metakaolin transforms to mullite at 1050 C. If a Bankura potter fires to 900 C, which phase is the clay in?',
      checkAnswer: 'At 900 C, the clay has passed through kaolinite decomposition (550 C) and is in the metakaolin/spinel phase. Mullite has not yet formed (needs 1050 C). The pottery is sintered but not fully ceramic — it has good strength but is not as hard as stoneware. This is the classic terracotta range.',
      codeIntro: 'Build a phase diagram calculator for Bankura clay compositions and predict mineral assemblages.',
      code: `import numpy as np

# Simplified phase diagram for clay minerals

class ClayPhaseCalculator:
    def __init__(self, sio2_pct, al2o3_pct, fe2o3_pct, cao_pct, flux_pct):
        self.sio2 = sio2_pct
        self.al2o3 = al2o3_pct
        self.fe2o3 = fe2o3_pct
        self.cao = cao_pct
        self.flux = flux_pct

    def phases_at_temperature(self, T_C):
        """Return mineral phases present at given temperature"""
        phases = {}

        if T_C < 100:
            phases["Kaolinite"] = 80
            phases["Quartz"] = 15
            phases["Free water"] = 5
        elif T_C < 300:
            phases["Kaolinite"] = 82
            phases["Quartz"] = 15
            phases["Adsorbed water"] = 3
        elif T_C < 573:
            phases["Kaolinite (dehydrating)"] = 78
            phases["Alpha-quartz"] = 17
            phases["Amorphous silica"] = 5
        elif T_C < 600:
            phases["Metakaolin"] = 60
            phases["Beta-quartz"] = 17  # quartz inversion!
            phases["Amorphous"] = 23
        elif T_C < 925:
            phases["Metakaolin"] = 55
            phases["Beta-quartz"] = 15
            phases["Amorphous glass"] = 25 + min(self.flux, 10)
            phases["Iron oxides"] = self.fe2o3
        elif T_C < 1050:
            phases["Spinel (Al-Si)"] = 40
            phases["Cristobalite"] = 10
            phases["Amorphous glass"] = 35 + min(self.flux * 2, 20)
            phases["Iron oxides"] = self.fe2o3
        elif T_C < 1200:
            phases["Mullite"] = 35
            phases["Cristobalite"] = 15
            phases["Glass phase"] = 40 + min(self.flux * 3, 25)
            phases["Iron oxides"] = self.fe2o3
        else:
            phases["Mullite"] = 30
            phases["Glass phase"] = 55 + min(self.flux * 2, 15)
            phases["Cristobalite"] = self.sio2 * 0.1

        return phases

    def properties_at_temperature(self, T_C):
        """Estimate material properties from phase assemblage"""
        phases = self.phases_at_temperature(T_C)
        glass = phases.get("Glass phase", 0) + phases.get("Amorphous glass", 0)
        mullite = phases.get("Mullite", 0)

        strength = 2 + mullite * 0.8 + glass * 0.3  # MPa
        porosity = max(2, 35 - glass * 0.5 - mullite * 0.3)
        hardness = 2 + mullite * 0.1 + glass * 0.05  # Mohs scale

        return {"strength": strength, "porosity": porosity, "hardness": hardness}

# Bankura clay analysis
bankura = ClayPhaseCalculator(55, 25, 7, 0.5, 3)

print("=== Phase Assemblage vs Temperature ===")
print(f"Composition: SiO2={bankura.sio2}%, Al2O3={bankura.al2o3}%, "
      f"Fe2O3={bankura.fe2o3}%, Flux={bankura.flux}%")
print()

for T in [25, 200, 500, 573, 700, 900, 1000, 1100, 1200]:
    phases = bankura.phases_at_temperature(T)
    props = bankura.properties_at_temperature(T)
    print(f"--- {T} C ---")
    for phase, pct in sorted(phases.items(), key=lambda x: -x[1]):
        if pct > 1:
            print(f"  {phase:<28} {pct:>4.0f}%")
    print(f"  [Strength: {props['strength']:.0f} MPa | Porosity: {props['porosity']:.0f}% | "
          f"Hardness: {props['hardness']:.1f} Mohs]")
    print()

# Compare different clay compositions
print("=== Composition Comparison at 900 C ===")
compositions = [
    ("Bankura standard", 55, 25, 7, 0.5, 3),
    ("High alumina", 48, 35, 4, 0.3, 2),
    ("High flux (feldspar)", 55, 22, 5, 1, 12),
    ("Iron-rich laterite", 50, 20, 12, 0.5, 3),
    ("Porcelain-type", 45, 38, 1, 0.2, 8),
]

print(f"{'Composition':<22} {'Strength':>10} {'Porosity':>10} {'Hardness':>10}")
print("-" * 54)

for name, si, al, fe, ca, fl in compositions:
    calc = ClayPhaseCalculator(si, al, fe, ca, fl)
    props = calc.properties_at_temperature(900)
    print(f"{name:<22} {props['strength']:>8.0f} MPa {props['porosity']:>8.0f}% "
          f"{props['hardness']:>8.1f}")`,
      challenge: 'Add feldspar (a flux mineral) at 0%, 5%, 10%, and 15% to Bankura clay. How does the glass phase percentage change at 900 C? At what flux content does the porosity drop below 5%? High flux lowers the temperature needed for densification — useful for fuel savings, but too much makes the piece deform.',
      successHint: 'Phase diagrams are the fundamental tool of materials science. Metallurgists use iron-carbon phase diagrams to design steel. Geologists use mineral phase diagrams to understand rock formation. Semiconductor engineers use silicon-oxygen diagrams to control chip fabrication. You just applied the same tool to ceramic art.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Innovator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Kiln atmosphere, colour chemistry, and phase diagrams</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises use Python to model kiln atmosphere chemistry, iron oxide colour prediction, and mineral phase assemblages.
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
