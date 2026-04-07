import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function PrayerFlagsLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Why do prayer flags fade? — UV light and molecular bonds',
      concept: `Prayer flags (*lung ta*) in Sikkim are traditionally five colors: blue, white, red, green, yellow — representing sky, wind, fire, water, and earth. Over months of exposure, their vibrant colors fade to pale pastels, then white.

This fading is **UV photodegradation** — ultraviolet light from the sun breaks the chemical bonds in dye molecules:

1. A UV photon (λ < 400 nm) carries enough energy to break a C-C or C-N bond
2. The bond breaks, creating **free radicals** (atoms with unpaired electrons)
3. Free radicals attack neighboring molecules, starting a **chain reaction**
4. Dye molecules are destroyed, losing their ability to absorb visible light
5. The fabric appears white (no dye = no absorption = all light reflected)

Energy of a photon: **E = hc/λ**
- UV-B (280-315 nm): 380-428 kJ/mol — enough to break most organic bonds
- UV-A (315-400 nm): 299-380 kJ/mol — breaks weaker bonds
- Visible (400-700 nm): 170-299 kJ/mol — usually too weak to break bonds

Bond energies: C-C = 346 kJ/mol, C-N = 305 kJ/mol, C=C = 614 kJ/mol

📚 *We will use Python to calculate photon energies and compare them with bond energies.*`,
      analogy: 'UV photodegradation is like a wrecking ball hitting a building. Each UV photon is a tiny wrecking ball. It strikes a dye molecule and breaks one bond (knocks out one brick). After enough hits, the molecule collapses — it can no longer hold its shape and loses its color. Visible light photons are like tennis balls — they bounce off without causing damage.',
      storyConnection: 'In Tibetan Buddhist tradition, the fading of prayer flags is not decay — it is a feature. As the flags dissolve, they release prayers into the wind. The science of photodegradation is the mechanism by which this spiritual release occurs. UV light is the carrier of prayers from fabric to sky.',
      checkQuestion: 'If a UV-B photon at 300 nm has energy 399 kJ/mol and a C-N bond requires 305 kJ/mol to break, does one photon have enough energy?',
      checkAnswer: 'Yes! 399 > 305, so a single 300 nm photon carries more than enough energy to break a C-N bond. The excess energy (399 - 305 = 94 kJ/mol) becomes kinetic energy of the fragments — they fly apart, which is how free radicals form. However, not every photon that hits a bond breaks it — orientation, absorption probability, and energy transfer efficiency all matter.',
      codeIntro: 'Calculate photon energies across the UV-visible spectrum and compare with common bond energies.',
      code: `# Photon energy vs bond energy: why prayer flags fade

import math

h = 6.626e-34   # Planck's constant (J·s)
c = 3e8          # speed of light (m/s)
Na = 6.022e23    # Avogadro's number

def photon_energy_kJ_per_mol(wavelength_nm):
    """Energy of one mole of photons at given wavelength."""
    lam = wavelength_nm * 1e-9
    E_per_photon = h * c / lam  # Joules
    E_per_mol = E_per_photon * Na / 1000  # kJ/mol
    return E_per_mol

# Bond energies (kJ/mol)
bonds = {
    "C-C (single)":   346,
    "C=C (double)":   614,
    "C-N":            305,
    "C-O":            358,
    "C-H":            413,
    "N-H":            391,
    "O-H":            463,
    "C=O":            799,
}

# Photon energies at key wavelengths
wavelengths = {
    "UV-C (254 nm)":  254,
    "UV-B (300 nm)":  300,
    "UV-A (350 nm)":  350,
    "Violet (400 nm)": 400,
    "Blue (450 nm)":  450,
    "Green (520 nm)": 520,
    "Red (650 nm)":   650,
}

print("=== Photon Energies ===")
print(f"{'Light Type':<20} {'λ (nm)':>8} {'Energy (kJ/mol)':>16}")
print("-" * 46)
for name, lam in wavelengths.items():
    E = photon_energy_kJ_per_mol(lam)
    print(f"{name:<20} {lam:>8} {E:>16.0f}")

print(f"\\\n=== Bond Energies (minimum to break) ===")
for bond, energy in sorted(bonds.items(), key=lambda x: x[1]):
    print(f"  {bond:<15} {energy:>6} kJ/mol")

print(f"\\\n=== Can This Light Break This Bond? ===")
print(f"{'':15}", end="")
for bond in ["C-N", "C-C", "C-H", "C=C"]:
    print(f"{bond:>8}", end="")
print()

for light, lam in wavelengths.items():
    E = photon_energy_kJ_per_mol(lam)
    print(f"{light:15}", end="")
    for bond in ["C-N", "C-C", "C-H", "C=C"]:
        can_break = "YES" if E > bonds[bond] else "no"
        print(f"{can_break:>8}", end="")
    print()

print(f"\\\nKey finding: UV-A and UV-B break the weakest bonds in dyes (C-N, C-C)")
print(f"Visible light cannot break any bonds — this is why it does not cause fading")
print(f"Prayer flags fade because of UV, not because of visible light!")`,
      challenge: 'At what wavelength does a photon have exactly the energy to break a C-N bond (305 kJ/mol)? This is the "critical wavelength" for dye degradation.',
      successHint: 'You have connected quantum mechanics (photon energy) with molecular chemistry (bond energy). The comparison table is the fundamental explanation for why UV causes degradation and visible light does not. Every material scientist starts with this analysis.',
    },
    {
      title: 'Color and absorption — why flags are red, blue, green',
      concept: `A dye appears colored because it **absorbs** certain wavelengths of visible light and **reflects** or **transmits** the rest:

- **Red dye**: absorbs blue/green light (~450-550 nm), reflects red
- **Blue dye**: absorbs orange/red light (~580-700 nm), reflects blue
- **Green dye**: absorbs red and blue, reflects green
- **Yellow dye**: absorbs violet/blue (~380-480 nm), reflects yellow
- **White fabric**: absorbs nothing in visible range, reflects all

The key molecular feature for visible absorption is a **chromophore** — a group of atoms with conjugated bonds that creates a small HOMO-LUMO gap.

Common textile dye chromophores:
- **Azo group** (-N=N-): absorbs in visible range, used in most synthetic dyes
- **Anthraquinone**: absorbs blue/green, appears red/orange
- **Indigo**: absorbs orange, appears blue
- **Phthalocyanine**: absorbs red, appears blue/green

When UV breaks the chromophore (especially the -N=N- bond), the molecule can no longer absorb visible light → color disappears.

📚 *We will model absorption spectra and predict what color a dye appears based on what it absorbs.*`,
      analogy: 'A dye is like a filter on a flashlight. White light (all colors) shines on the fabric. The dye "filter" blocks (absorbs) some colors and lets others pass (reflect). A red filter blocks blue and green, letting red through. Break the filter (UV damage), and all colors pass through — you see white.',
      storyConnection: 'The five colors of prayer flags have deep symbolism, but they also have chemistry. Blue flags contain dyes with chromophores that absorb red light. When UV destroys those chromophores, the blue disappears. The spiritual act of fading is, chemically, the breaking of azo bonds and the loss of conjugation.',
      checkQuestion: 'If a yellow dye absorbs violet light (400 nm), what happens to the dye\'s color when you view it under a lamp that emits only red light (650 nm)?',
      checkAnswer: 'The yellow dye absorbs violet, which is not present in the red lamp. So the dye absorbs nothing and reflects (or transmits) the red light. The fabric appears red under the red lamp. The "color" of a dye depends on both the dye\'s absorption AND the illumination. This is why colors look different under fluorescent vs. incandescent light.',
      codeIntro: 'Simulate absorption spectra for the five prayer flag dyes and predict their perceived colors.',
      code: `# Prayer flag dye absorption and color

import math

# Visible spectrum wavelengths (nm)
wavelengths_vis = list(range(380, 701, 5))

# Simplified absorption spectra for each flag dye
# Each spectrum is a sum of Gaussians
def gaussian(x, center, width, height):
    return height * math.exp(-0.5 * ((x - center) / width)**2)

dyes = {
    "Blue (sky)": {
        "peaks": [(600, 50, 0.9), (650, 40, 0.7)],  # absorbs red/orange
        "color_rgb": (30, 80, 200)
    },
    "White (wind)": {
        "peaks": [],  # absorbs nothing
        "color_rgb": (240, 240, 240)
    },
    "Red (fire)": {
        "peaks": [(480, 50, 0.85), (520, 40, 0.6)],  # absorbs blue/green
        "color_rgb": (200, 30, 30)
    },
    "Green (water)": {
        "peaks": [(420, 35, 0.7), (650, 45, 0.65)],  # absorbs violet and red
        "color_rgb": (30, 160, 50)
    },
    "Yellow (earth)": {
        "peaks": [(420, 40, 0.9), (450, 35, 0.5)],  # absorbs violet/blue
        "color_rgb": (220, 200, 30)
    },
}

print("=== Prayer Flag Dye Analysis ===\\\n")
print("Dye color is determined by what light is ABSORBED (removed)\\\n")

for dye_name, data in dyes.items():
    # Calculate absorption spectrum
    absorptions = []
    for wl in wavelengths_vis:
        total_abs = 0
        for center, width, height in data["peaks"]:
            total_abs += gaussian(wl, center, width, height)
        absorptions.append(min(1.0, total_abs))

    # What light is reflected? (complement of absorbed)
    reflected = [1 - a for a in absorptions]

    # Find peak absorption
    if absorptions:
        max_abs = max(absorptions)
        max_wl = wavelengths_vis[absorptions.index(max_abs)]
    else:
        max_abs = 0
        max_wl = 0

    # Average reflectance in color bands
    bands = {
        "Violet(380-450)": (380, 450),
        "Blue(450-490)": (450, 490),
        "Green(490-560)": (490, 560),
        "Yellow(560-590)": (560, 590),
        "Orange(590-630)": (590, 630),
        "Red(630-700)": (630, 700),
    }

    print(f"{dye_name}:")
    if max_wl:
        print(f"  Peak absorption: {max_wl} nm (absorbs this color)")
    else:
        print(f"  No absorption (white)")

    print(f"  Reflected light by band:")
    for band_name, (lo, hi) in bands.items():
        indices = [i for i, wl in enumerate(wavelengths_vis) if lo <= wl < hi]
        if indices:
            avg_ref = sum(reflected[i] for i in indices) / len(indices)
            bar = "█" * int(avg_ref * 20) + "░" * (20 - int(avg_ref * 20))
            print(f"    {band_name:18s} [{bar}] {avg_ref*100:.0f}%")
    print()

# Degradation effect
print("=== UV Degradation Effect ===")
print("As UV breaks chromophore bonds:")
print("  Absorption peaks get SHORTER (less light absorbed)")
print("  Reflected light INCREASES across all bands")
print("  Perceived color fades toward WHITE")
print()
print("Degradation rate by color (faster = fades faster):")
degradation_rates = [
    ("Yellow", "Fast — simple chromophore, easily broken"),
    ("Red", "Medium — moderate bond strength"),
    ("Green", "Medium — two chromophore systems"),
    ("Blue", "Slow — stable phthalocyanine-type chromophore"),
    ("White", "N/A — no dye to degrade"),
]
for color, rate in degradation_rates:
    print(f"  {color:8s}: {rate}")`,
      challenge: 'If UV destroys 50% of the blue dye\'s chromophore, what color does the flag appear? (Hint: calculate the new absorption at 50% intensity and determine the reflected spectrum.)',
      successHint: 'You have learned that color is determined by selective absorption, not reflection. The connection between chromophore structure and perceived color is the foundation of dye chemistry — and explains exactly why prayer flags fade the way they do.',
    },
    {
      title: 'Weathering factors — sun, wind, rain, and time',
      concept: `Prayer flag degradation is not just about UV. Multiple **weathering factors** act simultaneously:

1. **UV photodegradation** (~40% of total degradation): breaks molecular bonds
2. **Mechanical fatigue from wind** (~25%): flexing weakens fibers
3. **Moisture** (~20%): water swells fibers, enabling hydrolysis
4. **Temperature cycling** (~10%): expansion/contraction creates microcracks
5. **Biological** (~5%): mold, lichen, bacteria digest organic fibers

These factors are **synergistic** — their combined effect is greater than the sum of individual effects:
- UV weakens fibers → wind tears them more easily
- Rain provides water for hydrolysis → UV-weakened bonds break faster
- Temperature cycling opens microcracks → rain penetrates deeper

The total degradation rate:
**R_total = R_UV + R_wind + R_moisture + R_thermal + R_UV×R_moisture×k_synergy**

Sikkim\'s environment is particularly harsh:
- High altitude = intense UV (thinner atmosphere)
- Monsoon = months of continuous moisture
- Mountain winds = constant mechanical stress
- Large diurnal temperature swings

📚 *We will model each factor separately and then combine them to predict total prayer flag lifetime.*`,
      analogy: 'Weathering is like attacking a castle from all sides simultaneously. UV is the battering ram (breaks the gate). Wind is the siege engine (shakes the walls). Rain is the sapping crew (undermines the foundation). Alone, each does some damage. Together, the castle falls much faster than any single attack would predict. That is synergy.',
      storyConnection: 'Prayer flags in Sikkim face some of the harshest weathering conditions on Earth. At 3,000-5,000 m altitude, UV is 30-50% more intense than at sea level. Monsoon rains last 4 months. Mountain winds are relentless. The flags that survive a full year in these conditions are testament to the durability of the traditional cotton and dyes.',
      checkQuestion: 'Why do prayer flags at higher altitudes fade faster than those at lower altitudes?',
      checkAnswer: 'Higher altitude = thinner atmosphere = less UV filtering. For every 1,000 m of elevation, UV intensity increases by about 10-12%. At 4,000 m (typical prayer flag location), UV is 40-50% more intense than sea level. Additionally, higher altitude means colder temperatures (more freeze-thaw cycling) and stronger winds (more mechanical fatigue). All weathering factors intensify with altitude.',
      codeIntro: 'Model individual weathering factors and their synergistic interaction to predict prayer flag lifetime.',
      code: `# Multi-factor weathering model for prayer flags

# Degradation model: quality(t) = 100 * exp(-R_total * t)
# R_total includes individual rates + synergy terms

import math

# Individual degradation rate constants (per month)
R_uv_base = 0.08     # UV photodegradation
R_wind_base = 0.04   # Mechanical fatigue
R_moisture_base = 0.03  # Hydrolysis/swelling
R_thermal_base = 0.015  # Thermal cycling
R_bio_base = 0.008    # Biological

# Synergy multipliers
synergy_uv_moisture = 1.5  # UV + moisture is 50% worse than sum
synergy_wind_moisture = 1.3  # wet fabric tears easier

# Environmental conditions at different altitudes
locations = {
    "Gangtok (1650m)": {
        "uv_factor": 1.0, "wind_factor": 0.7, "moisture_factor": 1.0,
        "thermal_factor": 0.8, "bio_factor": 1.0
    },
    "Pelling (2150m)": {
        "uv_factor": 1.15, "wind_factor": 0.9, "moisture_factor": 0.9,
        "thermal_factor": 0.9, "bio_factor": 0.8
    },
    "Dzongri (4020m)": {
        "uv_factor": 1.45, "wind_factor": 1.5, "moisture_factor": 0.7,
        "thermal_factor": 1.3, "bio_factor": 0.3
    },
    "Goecha La (4940m)": {
        "uv_factor": 1.55, "wind_factor": 1.8, "moisture_factor": 0.5,
        "thermal_factor": 1.5, "bio_factor": 0.1
    },
}

print("=== Prayer Flag Weathering Model ===\\\n")
print(f"{'Location':<25} {'UV':>6} {'Wind':>6} {'Moist':>6} {'Therm':>6} {'Bio':>6} {'Total':>8} {'Life(mo)':>9}")
print("-" * 80)

lifetimes = {}
for loc, factors in locations.items():
    r_uv = R_uv_base * factors["uv_factor"]
    r_wind = R_wind_base * factors["wind_factor"]
    r_moist = R_moisture_base * factors["moisture_factor"]
    r_therm = R_thermal_base * factors["thermal_factor"]
    r_bio = R_bio_base * factors["bio_factor"]

    # Synergy terms
    syn_uv_m = r_uv * r_moist * synergy_uv_moisture
    syn_w_m = r_wind * r_moist * synergy_wind_moisture

    r_total = r_uv + r_wind + r_moist + r_therm + r_bio + syn_uv_m + syn_w_m

    # Lifetime: time until quality drops to 20% (barely visible colors)
    # 100 * exp(-R*t) = 20 → t = -ln(0.2)/R
    lifetime = -math.log(0.2) / r_total

    lifetimes[loc] = lifetime
    print(f"{loc:<25} {r_uv:.3f} {r_wind:.3f} {r_moist:.3f} {r_therm:.3f} {r_bio:.3f} {r_total:>8.3f} {lifetime:>8.1f}")

print()

# Breakdown for Dzongri
print("=== Contribution Breakdown — Dzongri (4020m) ===")
f = locations["Dzongri (4020m)"]
r_uv = R_uv_base * f["uv_factor"]
r_wind = R_wind_base * f["wind_factor"]
r_moist = R_moisture_base * f["moisture_factor"]
r_therm = R_thermal_base * f["thermal_factor"]
r_bio = R_bio_base * f["bio_factor"]
syn = r_uv * r_moist * synergy_uv_moisture + r_wind * r_moist * synergy_wind_moisture
r_total = r_uv + r_wind + r_moist + r_therm + r_bio + syn

components = [
    ("UV photodegradation", r_uv),
    ("Wind fatigue", r_wind),
    ("Moisture/hydrolysis", r_moist),
    ("Thermal cycling", r_therm),
    ("Biological", r_bio),
    ("Synergy effects", syn),
]

for name, rate in components:
    pct = rate / r_total * 100
    bar = "█" * int(pct / 2)
    print(f"  {name:<22} {pct:5.1f}% {bar}")

print(f"\\\nAt Dzongri, flags last ~{lifetimes['Dzongri (4020m)']:.0f} months")
print(f"At Gangtok, flags last ~{lifetimes['Gangtok (1650m)']:.0f} months")
print(f"Altitude difference: {lifetimes['Gangtok (1650m)']/lifetimes['Dzongri (4020m)']:.1f}x longer at lower altitude")`,
      challenge: 'What if you use UV-resistant synthetic fabric (reduce R_UV by 80%)? How much longer do flags last at Dzongri? Is it worth the cultural trade-off of using non-traditional materials?',
      successHint: 'You have built a multi-factor degradation model with synergistic interactions. The breakdown shows that UV and wind dominate, but synergy effects are significant — especially UV-moisture coupling. This is why Sikkim\'s monsoon season accelerates fading dramatically.',
    },
    {
      title: 'Fiber strength — why flags tear before they completely fade',
      concept: `Prayer flags do not just fade — they physically tear apart. This is **mechanical fatigue**, where repeated stress cycles weaken a material until it fails.

Cotton fiber strength:
- **Tensile strength**: 300-500 MPa (megapascals) when new
- **After UV exposure**: drops 30-60% in 6 months
- **When wet**: drops 5-10% immediately (water swells and weakens cellulose)
- **After freeze-thaw**: drops 5-15% per 100 cycles

The **S-N curve** (stress vs. number of cycles) describes fatigue life:
- At high stress: fails in few cycles
- At low stress: survives many cycles
- Below **fatigue limit**: theoretically survives infinite cycles

Wind applies cyclic stress to prayer flags:
- Average wind speed in Sikkim mountains: 15-30 km/h
- Gusts: up to 80+ km/h
- Each flutter is one stress cycle
- A flag flutters ~10 times per minute in moderate wind
- That is ~14,000 cycles per day, ~5 million per year!

The combination of UV weakening + wind cycling is devastating: UV reduces the fatigue strength, so each flutter does more damage.

📚 *We will model fiber strength degradation and predict time to failure.*`,
      analogy: 'Mechanical fatigue is like bending a paperclip back and forth. The first bend is easy. After 10 bends, you feel resistance. After 50-100 bends, the metal breaks. Each bend creates tiny cracks that grow. UV damage is like pre-scratching the paperclip — it takes fewer bends to break.',
      storyConnection: 'Prayer flags in Sikkim are designed to flutter — the motion spreads prayers on the wind. But each flutter is a stress cycle that brings the flag closer to tearing. The beautiful fluttering motion is simultaneously the flag\'s purpose and its destruction. When a flag finally tears free and blows away, it has completed its mission.',
      checkQuestion: 'If a prayer flag flutters 14,000 times per day and its fatigue limit is 10 million cycles, how many months until it fails? (Assume no UV weakening.)',
      checkAnswer: '10,000,000 / 14,000 = 714 days = ~24 months. But UV weakening reduces the fatigue limit over time — perhaps halving it in 6 months. So the real failure time is much shorter: maybe 8-12 months. This matches the observed replacement cycle of prayer flags in Sikkim.',
      codeIntro: 'Model fiber strength degradation from UV exposure and mechanical fatigue to predict flag lifetime.',
      code: `# Fiber strength and mechanical fatigue model

import math

# Cotton fiber properties
initial_strength = 400  # MPa (new fabric)
fatigue_limit_fraction = 0.35  # fatigue limit = 35% of tensile strength

# UV degradation of fiber strength (exponential decay)
k_uv_strength = 0.05  # per month

# Wind stress parameters
wind_speed_avg = 20    # km/h
flutter_frequency = 10  # flutters per minute in moderate wind
stress_per_flutter = 15  # MPa (depends on wind speed and flag size)

# Fatigue parameters (S-N curve: N = C / S^m)
C = 1e20  # material constant
m = 8     # fatigue exponent (cotton)

# Simulation over 24 months
months = range(0, 25)

print("=== Prayer Flag Fiber Degradation ===\\\n")
print(f"{'Month':>6} {'Strength(MPa)':>14} {'Fatigue Limit':>14} {'Cycles':>12} {'Status'}")
print("-" * 62)

total_cycles = 0
failed = False
failure_month = None

for month in months:
    # UV-degraded strength
    strength = initial_strength * math.exp(-k_uv_strength * month)
    fatigue_limit = strength * fatigue_limit_fraction

    # Monthly flutter cycles
    daily_cycles = flutter_frequency * 60 * 16  # 16 active wind hours
    monthly_cycles = daily_cycles * 30
    total_cycles += monthly_cycles

    # Fatigue life at current stress level
    if stress_per_flutter > 0:
        N_failure = C / (stress_per_flutter ** m)
    else:
        N_failure = float('inf')

    # Check failure condition
    if not failed:
        damage_fraction = total_cycles / N_failure
        if damage_fraction >= 1.0 or strength < stress_per_flutter * 2:
            failed = True
            failure_month = month
            status = "*** FAILURE ***"
        elif damage_fraction > 0.7:
            status = "WARNING - fraying"
        elif damage_fraction > 0.4:
            status = "Visible wear"
        else:
            status = "Good"
    else:
        status = "Failed"

    print(f"{month:>6} {strength:>14.1f} {fatigue_limit:>14.1f} {total_cycles/1e6:>10.1f}M {status}")

print(f"\\\nFlag structural failure at month {failure_month}")
print(f"Total flutter cycles: {total_cycles/1e6:.0f} million")

# Factor analysis
print(f"\\\n=== What Kills the Flag First? ===")

# UV alone (no wind)
strength_12mo = initial_strength * math.exp(-k_uv_strength * 12)
print(f"UV only (12 months): strength drops from {initial_strength} to {strength_12mo:.0f} MPa ({strength_12mo/initial_strength*100:.0f}%)")

# Wind alone (no UV)
cycles_12mo = flutter_frequency * 60 * 16 * 365
fatigue_life_no_uv = C / (stress_per_flutter ** m)
damage_no_uv = cycles_12mo / fatigue_life_no_uv
print(f"Wind only (12 months): {cycles_12mo/1e6:.0f}M cycles, damage fraction: {damage_no_uv:.2f}")

# Combined
print(f"Combined: failure at month {failure_month} — UV weakening + wind fatigue synergize")
print(f"UV reduces strength → same wind stress does MORE damage → earlier failure")`,
      challenge: 'Double the wind speed to 40 km/h (and stress per flutter to 30 MPa). How many months earlier does the flag fail? What about using a stronger fabric (800 MPa initial strength)?',
      successHint: 'You have modeled the interaction between UV degradation and mechanical fatigue — a key concept in materials science. The synergy between these two processes is why prayer flags last months instead of years. This same analysis applies to outdoor clothing, solar panel frames, and aircraft composites.',
    },
    {
      title: 'Moisture and hydrolysis — the monsoon\'s role in flag decay',
      concept: `Water is not just a passive bystander in flag degradation. **Hydrolysis** is a chemical reaction where water breaks molecular bonds:

R-CO-OR\' + H₂O → R-COOH + R\'-OH (ester hydrolysis)
Cellulose-O-Cellulose + H₂O → 2 × Cellulose-OH (cellulose chain scission)

Cotton is 90% **cellulose** — a polymer of glucose units linked by glycosidic bonds. Water attacks these bonds, especially when:
1. **UV has already created weak points** (partial bond damage)
2. **pH is acidic** (acid rain accelerates hydrolysis)
3. **Temperature is elevated** (monsoon warmth + wet = fast hydrolysis)
4. **Enzymes are present** (microbial cellulases digest cellulose)

Sikkim\'s monsoon provides 2,000-4,000 mm of rain over 4 months. During this period, flags are wet almost continuously, creating ideal hydrolysis conditions.

The effect on fiber properties:
- **Degree of polymerization (DP)** of cellulose drops from ~3,000 to ~500 over 6 months
- Lower DP = shorter polymer chains = weaker fiber
- Below DP ~200, the fiber disintegrates into powder

📚 *We will model cellulose hydrolysis kinetics and its effect on fiber strength.*`,
      analogy: 'Cellulose hydrolysis is like cutting a rope that is made of many shorter ropes tied end to end. Each water molecule "unties" one knot (breaks one glycosidic bond). After enough knots are untied, the rope falls apart into short pieces that cannot hold anything. The wetter the rope (more water = more cutting), the faster it fails.',
      storyConnection: 'The monsoon season in Sikkim is when prayer flags degrade most rapidly. Four months of continuous rain means four months of continuous hydrolysis. The flags that were strung in spring emerge from the monsoon drastically weakened — bleached, frayed, and ready to return to the wind. The monsoon is the great accelerator of the prayer flag cycle.',
      checkQuestion: 'Why does cotton lose only 5-10% of its strength when wet but recover fully when dried?',
      checkAnswer: 'Short-term wetting causes physical swelling (water molecules push cellulose chains apart), which weakens hydrogen bonds between chains. This is reversible — when dried, the chains re-form hydrogen bonds and strength returns. Hydrolysis, on the other hand, is irreversible — it breaks covalent glycosidic bonds permanently. The 5-10% wet strength loss is physical; the long-term degradation is chemical.',
      codeIntro: 'Model cellulose hydrolysis during Sikkim\'s monsoon season and predict fiber strength loss.',
      code: `# Cellulose hydrolysis model for prayer flag cotton

import math

# Cellulose properties
DP_initial = 3000     # degree of polymerization (glucose units per chain)
DP_disintegration = 200  # below this, fiber crumbles

# Hydrolysis rate constant (depends on conditions)
k_dry = 0.001        # per month (minimal hydrolysis without water)
k_wet = 0.015        # per month (continuous rain)
k_wet_uv = 0.025     # per month (wet + UV-damaged cellulose)

# Sikkim monthly conditions
months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
# Rainfall (mm) — monsoon June-September
rainfall = [20, 25, 45, 100, 250, 500, 700, 600, 400, 100, 25, 15]
# Wetness fraction (0-1: fraction of time the flag is wet)
wetness = [0.05, 0.05, 0.1, 0.2, 0.4, 0.8, 0.95, 0.9, 0.7, 0.2, 0.05, 0.03]
# UV intensity factor (1.0 = average)
uv_factor = [0.7, 0.8, 0.9, 1.0, 0.9, 0.6, 0.4, 0.5, 0.7, 0.9, 0.8, 0.7]

print("=== Cellulose Hydrolysis During Sikkim Year ===\\\n")
print(f"{'Month':>5} {'Rain(mm)':>10} {'Wetness':>8} {'UV':>5} {'k_eff':>8} {'DP':>8} {'Strength%':>10}")
print("-" * 62)

DP = DP_initial
dp_history = [DP]

for i in range(12):
    # Effective hydrolysis rate: blend of wet and dry rates
    w = wetness[i]
    uv = uv_factor[i]
    k_eff = (1 - w) * k_dry + w * (k_wet + uv * 0.01)

    # UV-moisture synergy
    k_eff += w * uv * 0.005  # extra degradation when both present

    # DP decreases: 1/DP(t) = 1/DP(0) + k*t
    # (random chain scission model)
    DP = 1 / (1/DP + k_eff)
    dp_history.append(DP)

    # Strength roughly proportional to DP (above disintegration threshold)
    if DP > DP_disintegration:
        strength_pct = (DP / DP_initial) * 100
    else:
        strength_pct = 0

    status = "" if strength_pct > 50 else " ⚠ WEAK" if strength_pct > 20 else " ✗ FAILING"
    print(f"{months[i]:>5} {rainfall[i]:>10} {wetness[i]:>8.2f} {uv_factor[i]:>5.1f} {k_eff:>8.4f} {DP:>8.0f} {strength_pct:>9.1f}%{status}")

# Second year
print(f"\\\n--- Continuing into Year 2 ---")
for i in range(12):
    w = wetness[i]
    uv = uv_factor[i]
    k_eff = (1 - w) * k_dry + w * (k_wet + uv * 0.01) + w * uv * 0.005
    DP = 1 / (1/DP + k_eff)
    dp_history.append(DP)
    strength_pct = max(0, (DP / DP_initial) * 100)
    if i % 3 == 0:
        print(f"{months[i]:>5} (Year 2) {'':>25} {DP:>8.0f} {strength_pct:>9.1f}%")

print(f"\\\n=== Summary ===")
print(f"Initial DP: {DP_initial}")
print(f"After 1 year: {dp_history[12]:.0f} ({dp_history[12]/DP_initial*100:.0f}% of original)")
print(f"After 2 years: {dp_history[24]:.0f} ({dp_history[24]/DP_initial*100:.0f}% of original)")
print(f"Disintegration DP: {DP_disintegration}")
print(f"\\\nThe monsoon months (Jun-Sep) cause {((dp_history[5]-dp_history[9])/dp_history[5]*100):.0f}% of annual DP loss")
print(f"One monsoon season does more damage than 8 months of dry weather!")`,
      challenge: 'What if the flag is coated with a water-repellent treatment that reduces wetness by 60%? How many extra months of life does the flag gain?',
      successHint: 'You have modeled cellulose hydrolysis with seasonal environmental variation. The monsoon\'s outsized role in flag degradation is clearly quantified — 4 months of rain does more damage than 8 months of sun. This explains why flags strung in October (post-monsoon) last much longer than those strung in May (pre-monsoon).',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Materials degradation basics with Python</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L1-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint} />
        ))}
      </div>
    </div>
  );
}
