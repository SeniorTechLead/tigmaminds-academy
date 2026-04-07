import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function EmbalmingLevel2() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Fick\'s law of diffusion — how natron draws water from tissue',
      concept: `**Fick's first law** describes the rate at which a substance moves from high concentration to low concentration:

**J = -D × (dC/dx)**

Where J is the flux (amount per area per time), D is the diffusion coefficient, and dC/dx is the concentration gradient. The negative sign means flow goes from high to low concentration.

In embalming, natron (a natural salt mix of sodium carbonate and bicarbonate) creates a massive concentration gradient: the salt is nearly dry, the tissue is ~70% water. Water molecules diffuse out of the tissue into the natron, desiccating the body.

The rate depends on **tissue thickness** — thin tissues (skin) dry quickly, thick tissues (muscle) take weeks. This is why embalmers removed internal organs first: they reduced the maximum diffusion distance from the body's centre to its surface.

📚 *Diffusion is a universal transport mechanism — it drives oxygen into your lungs, nutrients into cells, and salt into meat during brining. The same equation governs all of these.*`,
      analogy: 'Place a wet sponge next to a pile of dry rice. The rice absorbs water from the sponge — water moves from where there is lots of it (the sponge) to where there is little (the dry rice). The thicker the sponge, the longer it takes to dry the centre. Natron works exactly like the rice — pulling water out of tissue by diffusion.',
      storyConnection: 'Egyptian embalmers packed bodies in natron for exactly 40 days — a number recorded in both the Edwin Smith Papyrus and Herodotus\'s account. Fick\'s law explains why: 40 days is roughly how long it takes for diffusion to desiccate tissue to the ~15% moisture level needed to halt decomposition, given typical human body dimensions.',
      checkQuestion: 'If diffusion dries a 2 cm thick tissue layer in 10 days, how long would a 4 cm layer take (assuming diffusion time scales with thickness squared)?',
      checkAnswer: 'Diffusion time scales as thickness squared: t ~ L². If 2 cm takes 10 days, then 4 cm takes 10 × (4/2)² = 10 × 4 = 40 days. This square-law relationship is why organ removal was essential — it reduced the effective thickness that natron had to penetrate.',
      codeIntro: 'Model water transport through tissue layers using Fick\'s law and calculate desiccation times.',
      code: `import numpy as np

def fick_diffusion_1d(thickness_cm, D_cm2_per_day, initial_water_pct, target_water_pct, dt=0.01):
    """
    1D diffusion model for tissue desiccation.
    Simulates water content dropping over time as natron
    draws moisture from both surfaces.
    """
    nx = 50  # spatial grid points
    dx = thickness_cm / nx
    water = np.ones(nx) * initial_water_pct

    # Boundary conditions: surfaces in contact with natron (dry)
    surface_water = 5.0  # natron keeps surface at ~5%

    days = 0
    while np.mean(water) > target_water_pct and days < 200:
        new_water = water.copy()
        for i in range(nx):
            left = surface_water if i == 0 else water[i - 1]
            right = surface_water if i == nx - 1 else water[i + 1]
            flux = D_cm2_per_day * (left - 2 * water[i] + right) / dx**2
            new_water[i] = water[i] + flux * dt
            new_water[i] = max(new_water[i], surface_water)
        water = new_water
        days += dt

    return days, water

# Tissue types with different properties
tissues = [
    {"name": "Skin (epidermis)",   "thick_cm": 0.2, "D": 0.8,  "water": 65},
    {"name": "Subcutaneous fat",   "thick_cm": 1.5, "D": 0.3,  "water": 20},
    {"name": "Skeletal muscle",    "thick_cm": 3.0, "D": 0.5,  "water": 75},
    {"name": "Liver (if left in)", "thick_cm": 8.0, "D": 0.6,  "water": 70},
    {"name": "Bone marrow",        "thick_cm": 1.0, "D": 0.15, "water": 80},
]

target = 15.0  # target moisture for preservation

print("=== Tissue Desiccation by Natron (Fick's Law) ===")
print(f"Target moisture: {target}%")
print(f"{'Tissue':<24} {'Thick (cm)':>10} {'D (cm²/d)':>10} {'Init H₂O%':>10} {'Days':>8}")
print("-" * 64)

for t in tissues:
    days, final_water = fick_diffusion_1d(
        t["thick_cm"], t["D"], t["water"], target
    )
    centre_moisture = final_water[len(final_water) // 2]
    print(f"{t['name']:<24} {t['thick_cm']:>8.1f} {t['D']:>9.2f} {t['water']:>8.0f}% {days:>7.1f}")

print()
print("Key insight: thick, wet tissues (muscle, liver) take MUCH")
print("longer — this is why embalmers removed organs first.")
print("Diffusion time scales as thickness² (Fick's second law).")

# Verify the square law
print("\\\n=== Thickness² Scaling Verification ===")
for thick in [1.0, 2.0, 4.0, 8.0]:
    days, _ = fick_diffusion_1d(thick, 0.5, 75, target)
    ratio = days / (thick**2)
    print(f"Thickness {thick:>4.1f} cm -> {days:>6.1f} days  (days/L² = {ratio:.2f})")`,
      challenge: 'Ancient embalmers sometimes used heated natron to speed desiccation. Increasing temperature raises the diffusion coefficient D. Model how doubling D (from 0.5 to 1.0 cm²/day) changes the desiccation time for muscle tissue. By what factor does the time decrease?',
      successHint: 'Fick\'s law governs diffusion in every context: drug delivery through skin patches, salt curing of meat, semiconductor doping, and oxygen transport in lungs. The square-law scaling (time ~ thickness²) is one of the most important relationships in transport physics.',
    },
    {
      title: 'Enzyme kinetics — Michaelis-Menten and the race against autolysis',
      concept: `After death, the body\'s own enzymes begin **autolysis** — self-digestion. Proteases break down proteins, lipases break down fats, and nucleases break down DNA. This is the primary enemy of preservation.

Enzyme activity follows the **Michaelis-Menten equation**:

**v = V_max × [S] / (K_m + [S])**

Where v is the reaction rate, V_max is the maximum rate, [S] is substrate concentration, and K_m is the Michaelis constant (the substrate concentration at which v = V_max/2).

The embalmers' strategy was to **denature** (unfold and disable) these enzymes by: (1) removing water (enzymes need water to function), (2) raising salt concentration (disrupts enzyme structure), and (3) applying resins and oils (blocks enzyme access to tissue).

📚 *K_m tells you how "hungry" an enzyme is: a low K_m means the enzyme works efficiently even at low substrate concentrations. A high K_m means it needs lots of substrate to reach full speed.*`,
      analogy: 'Imagine a factory assembly line. V_max is the maximum speed when every worker has parts to assemble. K_m is the parts-per-worker level at which the line runs at half speed. If you remove the parts (dehydrate the tissue), the assembly line slows to a crawl. If you break the machines (denature enzymes with salt), it stops entirely.',
      storyConnection: 'The 40-day natron treatment wasn\'t arbitrary — it was a race against autolysis. Enzymes begin digesting tissue within hours of death. The embalmers had to dehydrate tissue fast enough to halt enzyme activity before the enzymes destroyed the body from within. The speed of desiccation vs the speed of autolysis determined preservation quality.',
      checkQuestion: 'An enzyme has V_max = 100 units/s and K_m = 5 mM. What is the rate when substrate concentration [S] = 5 mM? What about when [S] = 50 mM?',
      checkAnswer: 'At [S] = 5 mM: v = 100 × 5/(5+5) = 50 units/s (exactly half of V_max, by definition of K_m). At [S] = 50 mM: v = 100 × 50/(5+50) = 90.9 units/s (nearly at V_max). The enzyme is almost saturated at 10× K_m.',
      codeIntro: 'Model enzyme-driven autolysis and how desiccation halts it using Michaelis-Menten kinetics.',
      code: `import numpy as np

def michaelis_menten(substrate, vmax, km):
    """Michaelis-Menten reaction rate."""
    return vmax * substrate / (km + substrate)

def autolysis_simulation(initial_protein, water_content_curve, hours=120):
    """
    Simulate protein breakdown by endogenous proteases.
    Enzyme activity depends on water content — as tissue dries,
    enzymes lose activity.
    """
    protein = initial_protein  # mg/g tissue
    vmax_base = 2.0   # mg protein digested per hour at full hydration
    km = 15.0          # mg/g substrate for half-max rate

    history = {"time": [], "protein": [], "rate": [], "water": []}

    for h in range(hours):
        water = water_content_curve(h)
        # Enzyme activity scales with water content
        # Below 30% water, enzymes lose activity rapidly
        water_factor = min(1.0, (water / 30)**2) if water > 5 else 0
        vmax_effective = vmax_base * water_factor

        rate = michaelis_menten(protein, vmax_effective, km)
        protein = max(0, protein - rate)

        history["time"].append(h)
        history["protein"].append(protein)
        history["rate"].append(rate)
        history["water"].append(water)

    return history

# Scenario 1: No treatment (body left in open air)
def no_treatment(h):
    return max(40, 70 - 0.3 * h)  # slow natural drying

# Scenario 2: Natron applied immediately
def natron_immediate(h):
    return max(10, 70 * np.exp(-0.03 * h))  # exponential drying

# Scenario 3: Natron applied after 24-hour delay
def natron_delayed(h):
    if h < 24:
        return max(50, 70 - 0.5 * h)
    return max(10, 60 * np.exp(-0.03 * (h - 24)))

scenarios = [
    ("No treatment", no_treatment),
    ("Natron — immediate", natron_immediate),
    ("Natron — 24hr delay", natron_delayed),
]

print("=== Autolysis vs Desiccation Race ===")
print("Tracking protein remaining in muscle tissue over 120 hours\\\n")

for name, water_fn in scenarios:
    result = autolysis_simulation(100.0, water_fn, hours=120)
    final_protein = result["protein"][-1]
    preservation = final_protein / 100 * 100

    # Find when enzyme rate drops below 0.1 (effectively halted)
    halt_time = 120
    for i, r in enumerate(result["rate"]):
        if r < 0.1:
            halt_time = result["time"][i]
            break

    print(f"{name}:")
    print(f"  Protein remaining at 120h: {final_protein:.1f}% of original")
    print(f"  Enzyme activity halted at: {halt_time} hours")
    print(f"  Preservation quality: {'GOOD' if preservation > 70 else 'MODERATE' if preservation > 40 else 'POOR'}")
    # Show key timepoints
    for t_idx in [0, 12, 24, 48, 96]:
        if t_idx < len(result["time"]):
            print(f"    t={t_idx:>3}h: water={result['water'][t_idx]:.0f}%, "
                  f"protein={result['protein'][t_idx]:.1f}%, "
                  f"rate={result['rate'][t_idx]:.2f}")
    print()`,
      challenge: 'Add a fourth scenario: organ removal + immediate natron. Model the organ cavity as reaching low moisture 2x faster than intact muscle. How much protein is preserved compared to natron alone? This explains why evisceration was the single most important step in embalming.',
      successHint: 'Michaelis-Menten kinetics is the foundation of biochemistry — it describes how every enzyme in your body works, from digestive proteases to DNA polymerase. You just used it to model a 3,000-year-old preservation technique. The same equation is used to design drugs, engineer industrial enzymes, and understand metabolic diseases.',
    },
    {
      title: 'Resin chemistry — terpene structures and antibacterial mechanisms',
      concept: `Egyptian embalmers coated mummified bodies with **resins** — tree saps from conifers, pistachios, and balsam trees. Chemical analysis of mummy resins reveals a complex mixture of **terpenes**: molecules built from 5-carbon isoprene units.

Key resin components include:
- **Monoterpenes** (C₁₀): alpha-pinene, limonene — volatile, initially antibacterial
- **Sesquiterpenes** (C₁₅): cedrene, guaiazulene — moderate volatility, anti-fungal
- **Diterpenes** (C₂₀): abietic acid, pimaric acid — low volatility, long-term sealant
- **Triterpenes** (C₃₀): masticadienonic acid — non-volatile, structural

The antibacterial mechanism works through **membrane disruption**: terpenes are hydrophobic and insert into bacterial cell membranes, creating holes that leak the cell contents. Different terpene sizes target different bacteria, so the mixture provides broad-spectrum protection.

📚 *Terpenes follow the "isoprene rule" — they're built from multiples of the 5-carbon isoprene unit (C₅H₈). Monoterpenes = 2 units, sesquiterpenes = 3, diterpenes = 4, and so on.*`,
      analogy: 'A resin coating is like layers of protection on a wooden deck: the first coat soaks in (volatile terpenes penetrate tissue), the second coat seals the surface (semi-volatile terpenes form a barrier), and the top coat hardens to a shell (non-volatile terpenes polymerise into a waterproof layer). Each layer serves a different purpose.',
      storyConnection: 'GC-MS analysis of resins from Tutankhamun\'s mummy identified pistacia resin (from Pistacia lentiscus), conifer resin (likely cedar of Lebanon), and beeswax. The resin recipe varied by dynasty and social class — royalty received the most complex mixtures with imported ingredients, while commoners received simpler local resins.',
      checkQuestion: 'Why would a mixture of monoterpenes AND diterpenes provide better preservation than either alone?',
      checkAnswer: 'Monoterpenes are volatile — they evaporate within months, providing strong initial antibacterial protection but no long-term seal. Diterpenes are non-volatile — they polymerise into a permanent barrier but take time to harden. The combination gives both immediate protection AND permanent sealing: a time-release preservation system.',
      codeIntro: 'Analyse terpene composition, volatility decay, and antibacterial effectiveness over time.',
      code: `import numpy as np

# Terpene classes found in Egyptian mummy resins
terpenes = [
    {"name": "alpha-Pinene",      "class": "Monoterpene",   "C": 10, "MW": 136,
     "half_life_days": 30,   "antibac_score": 8.5, "seal_score": 1.0},
    {"name": "Limonene",          "class": "Monoterpene",   "C": 10, "MW": 136,
     "half_life_days": 45,   "antibac_score": 7.0, "seal_score": 1.5},
    {"name": "Cedrene",           "class": "Sesquiterpene", "C": 15, "MW": 204,
     "half_life_days": 180,  "antibac_score": 6.0, "seal_score": 4.0},
    {"name": "Guaiazulene",       "class": "Sesquiterpene", "C": 15, "MW": 198,
     "half_life_days": 200,  "antibac_score": 5.5, "seal_score": 3.5},
    {"name": "Abietic acid",      "class": "Diterpene",     "C": 20, "MW": 302,
     "half_life_days": 3000, "antibac_score": 3.0, "seal_score": 8.0},
    {"name": "Pimaric acid",      "class": "Diterpene",     "C": 20, "MW": 302,
     "half_life_days": 2500, "antibac_score": 3.5, "seal_score": 7.5},
    {"name": "Masticadienonic acid","class": "Triterpene",   "C": 30, "MW": 454,
     "half_life_days": 10000,"antibac_score": 1.5, "seal_score": 9.5},
]

print("=== Egyptian Resin Terpene Analysis ===")
print(f"{'Compound':<25} {'Class':<15} {'C':>3} {'MW':>5} {'t½ (d)':>8} {'AntiBac':>8} {'Seal':>6}")
print("-" * 72)
for t in terpenes:
    print(f"{t['name']:<25} {t['class']:<15} {t['C']:>3} {t['MW']:>5} "
          f"{t['half_life_days']:>7} {t['antibac_score']:>7.1f} {t['seal_score']:>5.1f}")

# Model effectiveness over time
print("\\\n=== Resin Mixture Effectiveness Over Time ===")
time_points = [0, 30, 90, 365, 1000, 10000, 100000]  # days

print(f"{'Time':<12}", end="")
for t in time_points:
    label = f"{t}d" if t < 365 else f"{t//365}yr"
    print(f"{label:>8}", end="")
print()
print("-" * 68)

for metric_name, metric_key in [("Antibacterial", "antibac_score"), ("Sealing", "seal_score")]:
    print(f"{metric_name:<12}", end="")
    for day in time_points:
        total_score = 0
        for t in terpenes:
            # Remaining fraction after evaporation/degradation
            remaining = np.exp(-0.693 * day / t["half_life_days"])
            total_score += t[metric_key] * remaining
        # Normalise to percentage of initial
        initial = sum(t[metric_key] for t in terpenes)
        pct = total_score / initial * 100
        print(f"{pct:>7.1f}%", end="")
    print()

# Isoprene rule verification
print("\\\n=== Isoprene Rule Verification ===")
print("All terpenes are built from 5-carbon isoprene (C5H8) units:")
for t in terpenes:
    units = t["C"] // 5
    print(f"  {t['name']:<25} C{t['C']:>2} = {units} isoprene units  "
          f"({t['class']})")`,
      challenge: 'Egyptian embalmers sometimes mixed resins with beeswax (melting point 62-65°C). Model beeswax as a sealing agent with antibac_score=0.5, seal_score=9.0, and half_life_days=50000. How does adding beeswax change the long-term sealing profile? Why would this be especially important in the hot Egyptian climate?',
      successHint: 'Terpene chemistry is the basis of modern essential oils, pharmaceutical coatings, and food preservatives. The Egyptian embalmers empirically discovered what modern chemistry confirms: broad-spectrum mixtures with varying volatilities provide the best long-term antibacterial protection — the same principle behind modern antibiotic combination therapy.',
    },
    {
      title: 'Canopic jar analysis — organ decomposition rates',
      concept: `The four canopic jars held the stomach, intestines, lungs, and liver — the organs most prone to rapid decomposition. Each organ decomposes at a different rate, depending on its **enzyme content**, **bacterial load**, **water content**, and **surface-area-to-volume ratio**.

Decomposition follows approximately **exponential decay** in the early stages:

**M(t) = M₀ × e^(-k × t)**

Where M is remaining tissue mass, M₀ is initial mass, k is the decay constant, and t is time. The decay constant k depends on temperature, moisture, and enzyme activity.

The organs were removed, individually treated with natron, and placed in canopic jars to be preserved separately. This was both practical (removing them reduced the body\'s overall decomposition rate) and religious (the organs were needed in the afterlife).

📚 *Exponential decay appears whenever the rate of loss is proportional to the amount remaining. More tissue = more enzymes = faster breakdown. As tissue decreases, breakdown slows — but never quite stops.*`,
      analogy: 'A melting ice cube follows a similar pattern: a large cube melts fast (lots of surface area relative to its shrinking volume), then slower as it gets smaller. Organs decompose in a similar exponential fashion — rapid breakdown initially, slowing as the substrate is consumed.',
      storyConnection: 'Herodotus recorded that the intestines were the first organ removed, and modern chemistry explains why: the intestines contain the body\'s highest concentration of digestive enzymes and bacteria. A delay of even a few hours before evisceration led to visible decomposition of the abdominal cavity.',
      checkQuestion: 'If the intestines have a decomposition half-life of 12 hours at body temperature, what fraction remains after 48 hours?',
      checkAnswer: '48 hours = 4 half-lives. Remaining fraction = (1/2)^4 = 1/16 = 6.25%. After just 2 days, over 93% of the intestinal tissue would be degraded if untreated. This is why speed was critical in the embalming process.',
      codeIntro: 'Model organ-specific decomposition rates and calculate the critical treatment windows.',
      code: `import numpy as np

def organ_decomposition(mass_g, decay_constant, hours, treatment_hour=None,
                        treatment_factor=0.05):
    """
    Model organ decomposition over time.
    If treated with natron at treatment_hour, decay rate drops dramatically.
    """
    masses = []
    current = mass_g
    for h in range(hours):
        k = decay_constant
        if treatment_hour is not None and h >= treatment_hour:
            k *= treatment_factor  # natron reduces decay rate by ~95%
        current *= np.exp(-k)
        masses.append(current)
    return masses

# Organ data (average adult)
organs = [
    {"name": "Intestines",  "mass_g": 1200, "k_per_hr": 0.058, "enzyme": "Very high",
     "bacteria": "10¹² CFU",  "reason": "Digestive enzymes + gut bacteria"},
    {"name": "Stomach",     "mass_g": 150,  "k_per_hr": 0.045, "enzyme": "High",
     "bacteria": "10⁴ CFU",   "reason": "HCl + pepsin self-digestion"},
    {"name": "Liver",       "mass_g": 1500, "k_per_hr": 0.035, "enzyme": "High",
     "bacteria": "Low",       "reason": "Rich in autolytic enzymes"},
    {"name": "Lungs",       "mass_g": 1000, "k_per_hr": 0.025, "enzyme": "Moderate",
     "bacteria": "Variable",  "reason": "Thin membranes, large surface area"},
]

hours = 96  # 4 days

print("=== Canopic Jar Organ Decomposition Analysis ===")
print(f"{'Organ':<14} {'Mass (g)':>8} {'k (/hr)':>8} {'t½ (hr)':>8} {'Enzyme Load':<12} {'Bacterial Load'}")
print("-" * 72)
for o in organs:
    half_life = 0.693 / o["k_per_hr"]
    print(f"{o['name']:<14} {o['mass_g']:>7} {o['k_per_hr']:>7.3f} {half_life:>7.1f} "
          f"{o['enzyme']:<12} {o['bacteria']}")

# Compare treatment timing
print("\\\n=== Effect of Treatment Timing on Preservation ===")
print(f"{'Organ':<14} {'No treat':>10} {'At 2hr':>10} {'At 6hr':>10} {'At 12hr':>10} {'At 24hr':>10}")
print("-" * 64)

for o in organs:
    results = []
    # No treatment
    masses = organ_decomposition(o["mass_g"], o["k_per_hr"], hours)
    results.append(masses[-1] / o["mass_g"] * 100)
    # Treatment at different times
    for treat_time in [2, 6, 12, 24]:
        masses = organ_decomposition(o["mass_g"], o["k_per_hr"], hours,
                                     treatment_hour=treat_time)
        results.append(masses[-1] / o["mass_g"] * 100)
    print(f"{o['name']:<14} " + " ".join(f"{r:>8.1f}%" for r in results))

print()
print("Critical window: intestines must be treated within 2-6 hours")
print("for acceptable preservation. Liver and lungs allow more time.")

# Total body decomposition with vs without evisceration
print("\\\n=== Body Preservation: Eviscerated vs Intact ===")
body_mass = 70000  # grams
organ_mass = sum(o["mass_g"] for o in organs)
k_body_intact = 0.015     # body decomposes slower (organs sealed inside)
k_body_evisc = 0.005      # eviscerated body dries faster

for label, k in [("Intact body", k_body_intact), ("Eviscerated + natron", k_body_evisc)]:
    mass_40d = body_mass * np.exp(-k * 40 * 24)
    pct = mass_40d / body_mass * 100
    print(f"{label:<28} Mass at 40 days: {pct:.1f}% remaining")`,
      challenge: 'The ancient Egyptians wrapped each organ in linen soaked with natron-resin before placing it in the canopic jar. Model this as an additional treatment that reduces the decay constant by another 80% on top of natron alone. How much tissue remains after 40 days with this double treatment vs natron alone?',
      successHint: 'Exponential decay models appear everywhere in science: radioactive decay, drug metabolism, population decline, chemical reactions, and — as you just modeled — biological decomposition. Understanding the decay constant k and half-life gives you a universal tool for predicting how fast anything breaks down.',
    },
    {
      title: 'GC-MS data interpretation — identifying ancient chemicals',
      concept: `**Gas Chromatography-Mass Spectrometry (GC-MS)** is the primary analytical tool for identifying chemicals in mummy samples. It works in two stages:

1. **Gas Chromatography (GC)**: The sample is vaporised and carried through a long, thin column by an inert gas. Different molecules travel through the column at different speeds based on their size, polarity, and boiling point. Each compound exits at a characteristic **retention time**.

2. **Mass Spectrometry (MS)**: As each compound exits the column, it's ionised and its fragments are sorted by mass-to-charge ratio (m/z). The fragmentation pattern is a molecular fingerprint — unique to each compound.

Together, GC (separates by retention time) and MS (identifies by fragmentation) can identify individual compounds in complex ancient residues — even after 3,000 years of degradation.

📚 *Retention time depends on molecular properties: heavier, less volatile molecules take longer to pass through the column. Two molecules with the same retention time can be distinguished by their mass spectra.*`,
      analogy: 'Imagine a footrace where runners of different sizes run through a tube filled with honey. Small, light runners (small molecules) pass through quickly. Large, heavy runners (large molecules) get slowed down and arrive later. That is gas chromatography — separating molecules by how fast they pass through a column. At the finish line, each runner is identified by their fingerprint — that is mass spectrometry.',
      storyConnection: 'In 2014, researchers used GC-MS on a 5,600-year-old linen wrapping from Mostagedda, Egypt — the oldest known embalming evidence. They identified a mixture of plant oil, plant gum, conifer resin, and an aromatic plant extract. These results pushed the origin of Egyptian embalming back 1,500 years earlier than previously thought.',
      checkQuestion: 'Two compounds have identical retention times on GC but different mass spectra. Can GC-MS distinguish them?',
      checkAnswer: 'Yes — that is exactly why GC-MS combines both techniques. GC alone would fail (same retention time = co-elution), but the MS stage identifies each compound by its unique fragmentation pattern. This is the power of hyphenated techniques: two complementary methods compensate for each other\'s weaknesses.',
      codeIntro: 'Simulate GC-MS analysis of a mummy resin sample — generate chromatograms and identify compounds.',
      code: `import numpy as np

np.random.seed(42)

# Reference library of compounds found in mummy resins
reference_db = [
    {"name": "alpha-Pinene",       "rt_min": 8.2,  "mz_base": 136, "fragments": [93, 77, 121, 91],    "class": "Conifer resin"},
    {"name": "Limonene",           "rt_min": 10.5, "mz_base": 136, "fragments": [68, 93, 107, 79],    "class": "Citrus/plant oil"},
    {"name": "Guaiacol",           "rt_min": 14.3, "mz_base": 124, "fragments": [109, 81, 53],         "class": "Smoke/pyrolysis"},
    {"name": "Abietic acid",       "rt_min": 28.7, "mz_base": 302, "fragments": [239, 185, 241, 143], "class": "Conifer resin"},
    {"name": "Dehydroabietic acid","rt_min": 30.1, "mz_base": 300, "fragments": [239, 185, 240, 141], "class": "Conifer resin (aged)"},
    {"name": "Palmitic acid",      "rt_min": 22.4, "mz_base": 256, "fragments": [213, 129, 73, 185],  "class": "Animal/plant fat"},
    {"name": "Stearic acid",       "rt_min": 26.1, "mz_base": 284, "fragments": [241, 185, 129, 73],  "class": "Animal/plant fat"},
    {"name": "Masticadienonic acid","rt_min": 35.8, "mz_base": 454, "fragments": [393, 189, 175, 121],"class": "Pistacia resin"},
    {"name": "Oleanolic acid",     "rt_min": 38.2, "mz_base": 456, "fragments": [203, 189, 133, 248], "class": "Plant triterpene"},
    {"name": "Beeswax ester",      "rt_min": 42.5, "mz_base": 648, "fragments": [257, 239, 396, 283], "class": "Beeswax"},
]

# Simulate a mummy resin sample (not all compounds present)
present_compounds = [0, 3, 4, 5, 6, 7, 9]  # indices into reference_db

print("=== Simulated GC-MS Analysis of Mummy Resin ===")
print("Sample: Chest cavity resin, 18th Dynasty (~1350 BCE)\\\n")

# Generate chromatogram
print("--- Gas Chromatogram (Total Ion Current) ---")
print(f"{'RT (min)':<10} {'Intensity':>10} {'Peak ID'}")
print("-" * 40)

detected = []
for idx in present_compounds:
    ref = reference_db[idx]
    # Add noise to retention time
    rt_observed = ref["rt_min"] + np.random.normal(0, 0.1)
    intensity = np.random.uniform(5000, 50000)
    detected.append({"rt": rt_observed, "intensity": intensity, "ref_idx": idx})
    print(f"{rt_observed:>8.1f} {intensity:>10.0f}   Peak {len(detected)}")

# Mass spectrum identification
print("\\\n--- Mass Spectral Identification ---")
print(f"{'Peak':>5} {'RT':>6} {'Base m/z':>9} {'Key Fragments':<24} {'Match':<28} {'Source'}")
print("-" * 88)

for i, det in enumerate(detected):
    ref = reference_db[det["ref_idx"]]
    # Simulate matching score (cosine similarity with library)
    match_score = np.random.uniform(85, 99)
    frags_str = ", ".join(str(f) for f in ref["fragments"][:3])
    print(f"{i+1:>5} {det['rt']:>5.1f} {ref['mz_base']:>8} {frags_str:<24} "
          f"{ref['name']:<28} {ref['class']}")

# Summary interpretation
print("\\\n=== Chemical Interpretation ===")
classes_found = set(reference_db[idx]["class"] for idx in present_compounds)
print(f"Compound classes identified: {len(classes_found)}")
for cls in sorted(classes_found):
    compounds = [reference_db[idx]["name"] for idx in present_compounds
                 if reference_db[idx]["class"] == cls]
    print(f"  {cls}: {', '.join(compounds)}")

print()
print("Interpretation: This resin mixture contains conifer resin (cedar),")
print("animal/plant fats (likely castor oil), Pistacia resin (imported),")
print("and beeswax — consistent with a high-status 18th Dynasty burial.")
print("The presence of dehydroabietic acid (an oxidation product of abietic")
print("acid) confirms the sample has undergone ~3,300 years of aging.")`,
      challenge: 'If dehydroabietic acid is the oxidation product of abietic acid, the ratio of dehydroabietic/abietic acid increases with age. Add a model where this ratio starts at 0 (fresh resin) and increases over centuries. Given a measured ratio of 3.2, estimate the sample\'s age. This is a simplified version of how archaeochemists date resin samples.',
      successHint: 'GC-MS is the workhorse of analytical chemistry — used in forensic crime labs, drug testing, environmental monitoring, food safety, and archaeological science. You just interpreted a chromatogram and mass spectrum — the same skills used by chemists worldwide to identify unknown substances.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Biochemistry, diffusion physics, and analytical chemistry</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 2 explores Fick's law, enzyme kinetics, resin chemistry, organ decomposition, and GC-MS analysis.
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
