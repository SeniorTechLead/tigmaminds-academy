import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function PenicillinLevel1() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Exponential growth — the mathematics of bacterial populations',
      concept: `A single bacterium divides into two every **20 minutes**. This seems harmless. But exponential growth is deceptive — it starts slowly and then explodes.

After 1 hour: 8 bacteria (2³). After 6 hours: 262,144 (2¹⁸). After 12 hours: **68 billion** (2³⁶). After 24 hours: **4.7 sextillion** — more bacteria than stars in the observable universe.

The formula: **N(t) = N₀ × 2^(t/d)**

Where N₀ is the starting count, t is time, and d is the doubling time (20 minutes for a typical bacterium).

The key feature of exponential growth: by the time the problem looks big, it's already **too late** to control easily. At 6 hours, 262,144 bacteria seem manageable. But in just 6 more hours, there will be 68 BILLION. Waiting "a little longer" to act has catastrophic consequences.

📚 *Exponential growth appears everywhere: compound interest, viral social media posts, nuclear chain reactions, and the early phase of any epidemic. Understanding it is one of the most important mathematical skills.*`,
      analogy: 'A lily pad doubles in size every day. On day 1, it covers 1 cm² of a pond. On day 30, it covers the entire pond. On what day did it cover HALF the pond? Day 29 — just one day before filling it completely. This is why exponential growth is so dangerous: it looks manageable until the very last moment.',
      storyConnection: 'Fleming left his petri dish of Staphylococcus bacteria on the bench for two weeks during his holiday. In that time, the bacteria grew exponentially — from a thin smear to a thick lawn covering the dish. The Penicillium mold that contaminated the dish killed bacteria in a clear ring around itself, making the discovery visible against this exponential growth.',
      checkQuestion: 'Starting from 1 bacterium, how many are there after 10 hours (30 doubling periods)?',
      checkAnswer: '2³⁰ = 1,073,741,824 — about 1 billion. From ONE cell to ONE BILLION in just 10 hours. This is why food poisoning can develop quickly — a tiny contamination becomes a massive infection in hours.',
      codeIntro: 'Model bacterial exponential growth and visualize why it becomes dangerous so quickly.',
      code: `import numpy as np

def bacterial_growth(N0, doubling_time_min, total_time_min):
    """
    Exponential growth model.
    N(t) = N0 × 2^(t/d)
    """
    times = np.arange(0, total_time_min + 1, doubling_time_min)
    populations = N0 * 2 ** (times / doubling_time_min)
    return times, populations

# Single bacterium, 20-minute doubling time, 24 hours
times, pops = bacterial_growth(N0=1, doubling_time_min=20,
                                total_time_min=24*60)

print("=== Bacterial Exponential Growth ===")
print(f"Starting: 1 bacterium | Doubling time: 20 min")
print(f"\
{'Time':>8} {'Population':>20} {'Doublings':>10}")
print("-" * 40)

for t, n in zip(times, pops):
    if t % 60 == 0:  # every hour
        hours = t / 60
        doublings = t / 20
        if n < 1e6:
            pop_str = f"{int(n):,}"
        elif n < 1e12:
            pop_str = f"{n:.2e}"
        else:
            pop_str = f"{n:.2e}"
        print(f"{hours:>6.0f} hr {pop_str:>20} {doublings:>8.0f}")

# The deceptive nature of exponential growth
print(f"\
=== The Deception ===")
half_day = 12 * 60 // 20  # doublings in 12 hours
full_day = 24 * 60 // 20  # doublings in 24 hours
pop_12h = 2 ** half_day
pop_24h = 2 ** full_day

print(f"After 12 hours: {pop_12h:.2e} bacteria")
print(f"After 24 hours: {pop_24h:.2e} bacteria")
print(f"The SECOND 12 hours produced {pop_24h/pop_12h:.2e}× more bacteria")
print(f"than the FIRST 12 hours combined!")

# Compare with linear growth
print(f"\
=== Exponential vs Linear Growth ===")
print(f"{'Time':>6} {'Exponential':>15} {'Linear (+1000/hr)':>18}")
print("-" * 41)
for hours in [1, 4, 8, 12, 24]:
    exp = 2 ** (hours * 3)  # 3 doublings per hour
    lin = 1 + 1000 * hours
    print(f"{hours:>4} hr {exp:>15,} {lin:>18,}")

print(f"\
At 24 hours, exponential = {2**(24*3):.2e}")
print(f"            linear     = {1+1000*24:,}")
print(f"Ratio: {2**(24*3)/(1+1000*24):.2e}× difference!")`,
      challenge: 'Some bacteria (like Mycobacterium tuberculosis) divide every 24 hours instead of every 20 minutes. Starting from 1 bacterium, how many are there after 30 days? Compare with a fast-growing bacterium. Why is TB harder to detect early? (It takes much longer to reach symptomatic numbers.)',
      successHint: 'You modeled exponential growth — the most important mathematical pattern in biology, economics, and epidemiology. The formula N = N₀ × 2^(t/d) governs bacterial infections, compound interest, Moore\'s law in computing, and the early phase of every pandemic.',
    },
    {
      title: 'The zone of inhibition — measuring antibiotic effectiveness',
      concept: `Fleming noticed a **clear zone** around the Penicillium mold — an area where bacteria couldn't grow. This is called the **zone of inhibition**, and its size measures the antibiotic's effectiveness.

The test (still used today) is simple: spread bacteria on an agar plate, place a disk soaked in antibiotic on the surface, incubate overnight. The antibiotic diffuses outward from the disk. Where the concentration exceeds the **minimum inhibitory concentration (MIC)**, bacteria die. The result: a clear circle in an otherwise cloudy lawn of bacteria.

The zone size depends on:
- **Antibiotic concentration** in the disk
- **Diffusion rate** (how fast the antibiotic spreads through the agar)
- **MIC** of the bacterium (how much antibiotic is needed to kill it)

Resistant bacteria have a higher MIC — they need more antibiotic to die — so their zone of inhibition is **smaller** (or nonexistent).

📚 *MIC (Minimum Inhibitory Concentration) is the lowest concentration of antibiotic that prevents visible bacterial growth. Lower MIC = more effective antibiotic. Higher MIC = more resistant bacterium.*`,
      analogy: 'Drop a stone in a pond. Ripples spread outward, getting weaker with distance. Close to the stone, the ripples are strong (high antibiotic concentration = bacteria die). Far away, they\'re too weak to notice (concentration below MIC = bacteria survive). The radius where ripples "stop" is the zone of inhibition.',
      storyConnection: 'Fleming saw the zone of inhibition as a curiosity — interesting but not useful, because he couldn\'t purify the active substance. It was Florey and Chain, 13 years later, who realized the zone\'s size predicted the drug\'s clinical effectiveness and developed purification methods to make penicillin a practical medicine.',
      checkQuestion: 'Bacterium A has a zone of inhibition of 30 mm. Bacterium B has a zone of 10 mm. Which is more resistant to the antibiotic?',
      checkAnswer: 'Bacterium B — it has a smaller zone, meaning the antibiotic had to be at higher concentration (closer to the disk) to kill it. The smaller the zone, the more resistant the bacterium. No zone at all = fully resistant.',
      codeIntro: 'Model antibiotic diffusion from a disk and predict the zone of inhibition for different bacterial MICs.',
      code: `import numpy as np

def antibiotic_concentration(distance_mm, disk_conc_ug_ml=256,
                              diffusion_coeff=0.5):
    """
    Antibiotic concentration at a given distance from the disk.
    Follows an exponential decay with distance (simplified diffusion).
    """
    return disk_conc_ug_ml * np.exp(-distance_mm * diffusion_coeff / 10)

def zone_of_inhibition(disk_conc, mic, diffusion_coeff=0.5):
    """
    Calculate the zone of inhibition radius.
    Zone ends where concentration drops below MIC.
    """
    if mic >= disk_conc:
        return 0  # completely resistant
    # Solve: disk_conc × exp(-d × k/10) = mic
    # d = -10/k × ln(mic/disk_conc)
    zone = -10 / diffusion_coeff * np.log(mic / disk_conc)
    return max(zone, 0)

# Disk loaded with 256 μg/mL penicillin
disk_conc = 256

# Different bacteria with different MICs
bacteria = [
    ("Streptococcus (sensitive)", 0.01),
    ("Staphylococcus (sensitive)", 0.1),
    ("E. coli (moderate)", 4.0),
    ("Staph (some resistance)", 16.0),
    ("MRSA (resistant)", 128.0),
    ("Fully resistant strain", 512.0),
]

print("=== Zone of Inhibition Calculator ===")
print(f"Antibiotic disk: {disk_conc} μg/mL penicillin")
print(f"\
{'Bacterium':<30} {'MIC (μg/mL)':>12} {'Zone (mm)':>10} {'Status':>14}")
print("-" * 68)

for name, mic in bacteria:
    zone = zone_of_inhibition(disk_conc, mic)
    if zone == 0:
        status = "RESISTANT"
    elif zone < 14:
        status = "Resistant"
    elif zone < 20:
        status = "Intermediate"
    else:
        status = "Susceptible"
    print(f"{name:<30} {mic:>10.2f} {zone:>8.1f} {status:>14}")

# Show concentration gradient
print(f"\
=== Concentration vs Distance from Disk ===")
print(f"{'Distance (mm)':>14} {'Conc (μg/mL)':>14} {'Kills Strep?':>14} {'Kills MRSA?':>14}")
print("-" * 58)

for d in [0, 5, 10, 15, 20, 25, 30, 35, 40]:
    conc = antibiotic_concentration(d, disk_conc)
    kills_strep = "YES" if conc > 0.01 else "No"
    kills_mrsa = "YES" if conc > 128 else "No"
    print(f"{d:>12} mm {conc:>12.2f} {kills_strep:>14} {kills_mrsa:>14}")

# Clinical interpretation
print(f"\
=== Clinical Interpretation ===")
print(f"Sensitive (zone ≥ 20mm): standard dose will cure the infection")
print(f"Intermediate (14-19mm): higher dose might work")
print(f"Resistant (zone < 14mm): this antibiotic won't work — need an alternative")`,
      challenge: 'If a new antibiotic has a disk concentration of 1024 μg/mL (4× stronger), calculate the new zones of inhibition for each bacterium. Does the stronger antibiotic overcome MRSA resistance? (It increases the zone but may still not be enough if MIC is very high.)',
      successHint: 'You modeled the zone of inhibition test — the same test used in every hospital microbiology lab to choose the right antibiotic for each patient\'s infection. The mathematics (exponential diffusion, MIC threshold) is the same in real clinical testing.',
    },
    {
      title: 'Natural selection — simulating antibiotic resistance evolution',
      concept: `In a population of 1 billion bacteria, most are sensitive to penicillin. But a few — maybe 1 in a million — carry a random **mutation** that gives them slight resistance (perhaps a modified transpeptidase enzyme that penicillin can't bind to as well).

Under normal conditions, this mutation is neutral — the resistant bacterium grows at the same rate as its neighbours. But when you add penicillin, everything changes: the 999,999,999 sensitive bacteria die. The 1,000 resistant ones survive.

Now those 1,000 resistant bacteria have an entire nutrient-rich environment to themselves. They divide every 20 minutes. In 10 hours, there are 1 billion again — but now **ALL of them are resistant**.

This is **natural selection**: the environment (penicillin) selects for organisms with a trait (resistance) that was previously rare and unimportant. The mutation didn't arise BECAUSE of the antibiotic — it was already there. The antibiotic just eliminated the competition.

📚 *Darwin's key insight: evolution doesn't create mutations. It SELECTS among mutations that already exist. The antibiotic is the selective pressure; the mutation is the random variation.*`,
      analogy: 'Imagine 100 students taking a test. 99 score normally. 1 student happens to be immune to test anxiety (a random trait). Now the school changes the rules: students who score below 80% are expelled (selective pressure). The anxiety-immune student scores 95% while others panic and fail. Next year\'s class: everyone is anxiety-immune. The trait was already there — the pressure just selected for it.',
      storyConnection: 'Fleming himself predicted resistance in his 1945 Nobel Prize speech: "It is not difficult to make microbes resistant to penicillin in the laboratory by exposing them to concentrations not sufficient to kill them." He was right — by the 1950s, hospital infections were becoming resistant. Today, antibiotic resistance kills 1.27 million people per year.',
      checkQuestion: 'You stop your antibiotic course on day 3 (you feel better) instead of finishing the full 7-day course. Why is this dangerous?',
      checkAnswer: 'By day 3, the antibiotic has killed the most sensitive bacteria — you feel better because there are fewer of them. But the most resistant ones are still alive. By stopping, you give those resistant survivors a nutrient-rich environment with no competition. They multiply, and the next infection is harder to treat.',
      codeIntro: 'Simulate natural selection in a bacterial population under antibiotic pressure.',
      code: `import numpy as np

np.random.seed(42)

def simulate_resistance(
    population_size=1000000,
    mutation_rate=1e-6,       # probability of resistance mutation per division
    antibiotic_kill_rate=0.99, # kills 99% of sensitive bacteria per day
    resistant_kill_rate=0.10,  # kills only 10% of resistant bacteria per day
    growth_rate=8.0,           # doublings per day
    days=14,
    treatment_start=3,
    treatment_end=14,          # full course
):
    """Simulate bacterial population with sensitive and resistant subpopulations."""
    sensitive = population_size
    resistant = int(population_size * mutation_rate * 100)  # ~100 pre-existing
    carrying_capacity = population_size * 10

    log = []

    for day in range(days):
        # Growth (logistic)
        total = sensitive + resistant
        growth_factor = 2 ** growth_rate * (1 - total / carrying_capacity)
        growth_factor = max(growth_factor, 0)

        sensitive = int(sensitive * growth_factor)
        resistant = int(resistant * growth_factor)

        # New mutations
        new_mutants = int(sensitive * mutation_rate)
        sensitive -= new_mutants
        resistant += new_mutants

        # Antibiotic treatment
        if treatment_start <= day < treatment_end:
            sensitive = int(sensitive * (1 - antibiotic_kill_rate))
            resistant = int(resistant * (1 - resistant_kill_rate))

        total = sensitive + resistant
        pct_resistant = resistant / max(total, 1) * 100

        log.append({
            "day": day,
            "sensitive": sensitive,
            "resistant": resistant,
            "total": total,
            "pct_resistant": pct_resistant,
            "treating": treatment_start <= day < treatment_end,
        })

    return log

# Scenario 1: Full course (7 days)
print("=== Scenario 1: Full 7-Day Antibiotic Course ===")
full_course = simulate_resistance(treatment_start=3, treatment_end=10)

print(f"{'Day':>4} {'Total':>12} {'Sensitive':>12} {'Resistant':>10} {'% Resist':>9} {'Treatment':>10}")
print("-" * 59)
for entry in full_course:
    treat = "YES" if entry["treating"] else "—"
    print(f"{entry['day']:>4} {entry['total']:>12,} {entry['sensitive']:>12,} "
          f"{entry['resistant']:>10,} {entry['pct_resistant']:>7.1f}% {treat:>10}")

# Scenario 2: Incomplete course (3 days)
print(f"\
=== Scenario 2: Stopped After 3 Days ('I feel better') ===")
incomplete = simulate_resistance(treatment_start=3, treatment_end=6)

for entry in incomplete:
    treat = "YES" if entry["treating"] else "—"
    print(f"{entry['day']:>4} {entry['total']:>12,} {entry['sensitive']:>12,} "
          f"{entry['resistant']:>10,} {entry['pct_resistant']:>7.1f}% {treat:>10}")

# Compare outcomes
full_final = full_course[-1]
incomplete_final = incomplete[-1]
print(f"\
=== Comparison ===")
print(f"Full course:     {full_final['total']:>10,} bacteria, "
      f"{full_final['pct_resistant']:.0f}% resistant")
print(f"Stopped early:   {incomplete_final['total']:>10,} bacteria, "
      f"{incomplete_final['pct_resistant']:.0f}% resistant")
print(f"\
Stopping early: population rebounds with RESISTANT bacteria.")
print(f"Next time you need antibiotics, the old ones won't work.")`,
      challenge: 'Add a third scenario: "Sublethal dose" — treatment that kills only 50% of sensitive bacteria per day instead of 99%. This simulates taking too low a dose. Does it accelerate resistance even faster than stopping early? (Yes — sublethal doses are the worst: they kill slowly, giving resistant mutants maximum time to multiply.)',
      successHint: 'You simulated evolution by natural selection — in fast-forward. The same process that took millions of years to create species diversity happens in days with bacteria because they reproduce so fast. Understanding this is essential for medicine, agriculture (pesticide resistance), and conservation.',
    },
    {
      title: 'Dose-response curves — how much antibiotic is enough?',
      concept: `How much penicillin do you need to cure an infection? Too little and the bacteria survive (and develop resistance). Too much and you get side effects. The answer is the **dose-response curve** — a graph that shows how bacterial survival changes with antibiotic concentration.

The dose-response curve is typically **sigmoidal** (S-shaped). At low doses, most bacteria survive. At the **EC50** (the dose that kills 50% of bacteria), survival drops steeply. Above the **MIC** (minimum inhibitory concentration), virtually all bacteria die.

The key parameters:
- **MIC**: minimum concentration that stops growth
- **EC50**: concentration that kills 50% of bacteria
- **MBC** (minimum bactericidal concentration): concentration that kills 99.9%

The clinical dose is set above the MBC to ensure complete eradication — with a **safety margin** to account for variation between patients.

📚 *Pharmacokinetics studies how drugs are absorbed, distributed, metabolized, and excreted by the body. The drug concentration in your blood rises after you take a pill, peaks, then gradually falls as your liver metabolizes it. Dosing interval is chosen to keep concentration above MIC throughout treatment.*`,
      analogy: 'Think of volume on a speaker. At volume 1, you can barely hear it — most of the music is "lost." At volume 5, you hear about half the song clearly. At volume 10, you hear everything. The dose-response curve is the same shape: at low antibiotic dose, most bacteria "survive"; at medium dose, about half die; at high dose, essentially all die.',
      storyConnection: 'Florey\'s first patient, Albert Alexander, improved dramatically on penicillin but died when the drug ran out after 5 days. The dose was too low and the duration too short — the remaining bacteria (likely the most resistant ones) rebounded. This tragic outcome drove the race to mass-produce penicillin at doses high enough to complete the cure.',
      checkQuestion: 'A drug has MIC = 4 μg/mL and MBC = 16 μg/mL. A patient\'s blood level peaks at 10 μg/mL. Will the drug cure the infection?',
      checkAnswer: 'Maybe, but it\'s risky. 10 μg/mL is above the MIC (bacteria stop growing) but below the MBC (99.9% kill). Some bacteria may survive. A higher dose (above 16 μg/mL) would be more effective. Or: the doctor might extend the treatment duration to compensate for the suboptimal peak concentration.',
      codeIntro: 'Model dose-response curves for antibiotics and calculate clinical dosing parameters.',
      code: `import numpy as np

def dose_response(concentration, ec50, hill_coefficient=2):
    """
    Sigmoidal dose-response curve (Hill equation).
    Returns the fraction of bacteria killed.

    ec50: concentration that kills 50%
    hill_coefficient: steepness of the curve (typically 1-4)
    """
    if concentration <= 0:
        return 0
    return concentration**hill_coefficient / (ec50**hill_coefficient + concentration**hill_coefficient)

def pharmacokinetics(dose_mg, bioavailability=0.6, volume_L=40,
                     half_life_hours=1.0, time_hours_max=8, dt=0.1):
    """
    Model drug concentration in blood over time.
    Assumes oral dosing with first-order absorption and elimination.
    """
    # Peak concentration
    C_max = dose_mg * bioavailability / volume_L * 1000  # μg/mL

    times = np.arange(0, time_hours_max, dt)
    concentrations = C_max * np.exp(-0.693 * times / half_life_hours)

    return times, concentrations

# Dose-response for penicillin against different bacteria
print("=== Dose-Response Curves ===")
bacteria_types = [
    ("Streptococcus (sensitive)", 0.05, 2),
    ("Staphylococcus (moderate)", 1.0, 2),
    ("E. coli", 8.0, 1.5),
    ("Resistant Staph", 32.0, 2),
]

concentrations = [0.01, 0.05, 0.1, 0.5, 1, 2, 4, 8, 16, 32, 64, 128]

print(f"{'Conc (μg/mL)':>13}", end="")
for name, _, _ in bacteria_types:
    print(f" {name[:15]:>16}", end="")
print()
print("-" * 79)

for conc in concentrations:
    print(f"{conc:>11.2f}", end="")
    for name, ec50, hill in bacteria_types:
        kill_pct = dose_response(conc, ec50, hill) * 100
        print(f" {kill_pct:>14.0f}%", end="")
    print()

# Pharmacokinetics: drug concentration over time
print(f"\
=== Blood Concentration After 500mg Oral Dose ===")
times, concs = pharmacokinetics(500, half_life_hours=1.0)

print(f"{'Time (hr)':>10} {'Conc (μg/mL)':>14} {'Above MIC(1)?':>14} {'Above MIC(8)?':>14}")
print("-" * 54)

for t, c in zip(times, concs):
    if t % 0.5 < 0.1:
        above_1 = "YES" if c > 1 else "No"
        above_8 = "YES" if c > 8 else "No"
        print(f"{t:>8.1f} {c:>12.1f} {above_1:>14} {above_8:>14}")

# Time above MIC
time_above_mic_1 = sum(1 for c in concs if c > 1) * 0.1
time_above_mic_8 = sum(1 for c in concs if c > 8) * 0.1
print(f"\
Time above MIC=1: {time_above_mic_1:.1f} hours")
print(f"Time above MIC=8: {time_above_mic_8:.1f} hours")
print(f"\
Dosing interval should ensure concentration stays above")
print(f"MIC for most of the interval. For MIC=1: dose every ~{time_above_mic_1:.0f}h.")
print(f"For MIC=8: need higher dose or more frequent dosing.")

# Multiple doses
print(f"\
=== Multiple Doses (500mg every 4 hours) ===")
total_time = 24
dt = 0.1
times_multi = np.arange(0, total_time, dt)
concs_multi = np.zeros_like(times_multi)

for dose_time in range(0, total_time, 4):
    for i, t in enumerate(times_multi):
        if t >= dose_time:
            elapsed = t - dose_time
            C_max = 500 * 0.6 / 40 * 1000
            concs_multi[i] += C_max * np.exp(-0.693 * elapsed / 1.0)

print(f"{'Hour':>5} {'Conc (μg/mL)':>14}")
print("-" * 21)
for i, t in enumerate(times_multi):
    if t % 2 < dt:
        print(f"{t:>4.0f} {concs_multi[i]:>12.1f}")

min_conc = min(concs_multi[int(4/dt):])  # trough after first dose
print(f"\
Trough concentration: {min_conc:.1f} μg/mL")
print(f"Stays above MIC=1? {'YES' if min_conc > 1 else 'NO'}")
print(f"Stays above MIC=8? {'YES' if min_conc > 8 else 'NO'}")`,
      challenge: 'A patient has a kidney problem that slows drug elimination (half-life doubles from 1 hour to 2 hours). How does this change the blood concentration profile? Is the same dose still safe, or could it accumulate to toxic levels? (This is why doctors adjust doses for patients with kidney disease.)',
      successHint: 'You modeled pharmacokinetics and pharmacodynamics — the twin pillars of drug dosing. Every antibiotic prescription is based on these calculations: how much drug reaches the infection site, how long it stays above the MIC, and how often to re-dose. You just did what a clinical pharmacologist does.',
    },
    {
      title: 'Scaling up — from bedpans to factories',
      concept: `Fleming discovered penicillin in 1928. The first patient was treated in 1941. Mass production for D-Day began in 1944. Why the 16-year gap? Because producing enough penicillin for one patient required **2,000 litres of mold culture**.

**Scale-up** — going from laboratory bench to industrial production — is one of the hardest problems in biotechnology. What works in a petri dish often fails in a 10,000-litre fermentation tank because:

1. **Heat dissipation** changes (large volumes retain heat that small volumes lose)
2. **Mixing** is harder (stirring a beaker is easy; stirring a swimming pool is engineering)
3. **Oxygen supply** becomes limiting (the mold needs oxygen, but it can only absorb it at the surface — larger tanks have less surface area per volume)
4. **Contamination risk** increases (more volume = more chances for unwanted organisms to enter)

The Peoria breakthroughs — corn steep liquor (10× yield) and the cantaloupe mold strain (200× yield) — were scale-up solutions: they increased production per litre, reducing the number of litres needed.

📚 *Scale-up follows the square-cube law: doubling tank diameter increases volume 8× but surface area only 4×. This means oxygen transfer, heat dissipation, and nutrient distribution all change unfavorably with size.*`,
      analogy: 'Baking one cake is easy. Baking 10,000 identical cakes is a completely different problem: you need industrial ovens, precise ingredient measurement, quality control, and packaging — none of which existed in your kitchen. The recipe is the same, but the engineering is entirely different. Scale-up is this transition.',
      storyConnection: 'Florey\'s team at Oxford grew Penicillium in bedpans, biscuit tins, and bathtubs — whatever they could find. Even so, they ran out after treating one patient for 5 days. The US scale-up program at Peoria transformed this cottage operation into industrial production: 2.3 million doses per month by D-Day. The recipe didn\'t change; the engineering did.',
      checkQuestion: 'If one 1-litre flask produces 100 mg of penicillin, and you need 2 grams per patient per day, how many flasks do you need per patient per day?',
      checkAnswer: '2,000 mg / 100 mg = 20 flasks per patient per day. For 10,000 patients: 200,000 flasks. This is why scaling up was essential — you can\'t run a war with 200,000 laboratory flasks.',
      codeIntro: 'Model the scale-up challenge — how fermentation tank size affects penicillin yield.',
      code: `import numpy as np

def penicillin_yield(volume_L, strain_factor=1.0, medium_factor=1.0):
    """
    Model penicillin yield from a fermentation tank.
    Accounts for surface-area-to-volume ratio effects.
    """
    # Base yield per litre (laboratory scale)
    base_yield_mg_L = 50  # mg per litre

    # Surface-area-to-volume effect (oxygen transfer)
    # SA/V ratio decreases with increasing volume
    # For a cylinder: SA/V ~ 1/sqrt(volume)
    sa_v_factor = min(1.0, 1.0 / np.sqrt(volume_L / 1))

    # Mixing efficiency decreases with scale
    mixing_factor = min(1.0, 1.0 / (volume_L / 100) ** 0.1)

    # Contamination risk increases with scale
    contamination_factor = max(0.5, 1.0 - np.log10(volume_L) * 0.05)

    # Total yield
    yield_per_L = (base_yield_mg_L * sa_v_factor * mixing_factor *
                    contamination_factor * strain_factor * medium_factor)
    total_yield_mg = yield_per_L * volume_L

    return yield_per_L, total_yield_mg

# Compare different scale-up stages
print("=== Penicillin Production Scale-Up ===")
print(f"{'Stage':<30} {'Volume':>8} {'Yield/L':>9} {'Total':>10} {'Doses/day':>10}")
print("-" * 69)

stages = [
    ("Fleming's petri dish", 0.01, 1.0, 1.0),
    ("Oxford bedpan", 2, 1.0, 1.0),
    ("Oxford bathtub", 100, 1.0, 1.0),
    ("Peoria (corn steep liquor)", 100, 1.0, 10.0),
    ("Peoria (cantaloupe strain)", 100, 200.0, 10.0),
    ("Industrial fermenter", 10000, 200.0, 10.0),
    ("Modern bioreactor", 100000, 200.0, 10.0),
]

dose_mg = 2000  # 2 grams per patient per day

for name, vol, strain, medium in stages:
    yield_L, total = penicillin_yield(vol, strain, medium)
    doses = total / dose_mg
    print(f"{name:<30} {vol:>6.0f} L {yield_L:>7.1f} mg/L {total:>8.0f} mg {doses:>8.1f}")

# The three breakthroughs
print(f"\
=== Key Breakthroughs ===")

# 1. Corn steep liquor
base = penicillin_yield(100, 1.0, 1.0)
corn = penicillin_yield(100, 1.0, 10.0)
print(f"1. Corn steep liquor: yield ×{corn[0]/base[0]:.0f}")

# 2. Cantaloupe mold strain
cant = penicillin_yield(100, 200.0, 10.0)
print(f"2. Cantaloupe strain: yield ×{cant[0]/corn[0]:.0f}")

# 3. Industrial scale
ind = penicillin_yield(10000, 200.0, 10.0)
print(f"3. Industrial scale: total production ×{ind[1]/cant[1]:.0f}")

# D-Day requirement
print(f"\
=== D-Day Production Target ===")
soldiers_needing_treatment = 10000  # per month
doses_per_soldier = 14  # 14-day course
total_doses_month = soldiers_needing_treatment * doses_per_soldier
total_mg_month = total_doses_month * dose_mg

print(f"Soldiers needing antibiotics: {soldiers_needing_treatment:,}/month")
print(f"Total doses needed: {total_doses_month:,}/month")
print(f"Total penicillin needed: {total_mg_month/1e6:.0f} kg/month")

# How many fermenters needed?
_, yield_per_tank = penicillin_yield(10000, 200.0, 10.0)
batches_per_month = 30 / 7  # one batch per week
tanks_needed = total_mg_month / (yield_per_tank * batches_per_month)
print(f"\
With 10,000L fermenters producing {yield_per_tank/1000:.0f} g/batch:")
print(f"Batches per month: {batches_per_month:.0f}")
print(f"Fermenters needed: {tanks_needed:.0f}")
print(f"By D-Day, US industry had ~20 pharmaceutical companies")
print(f"operating {int(tanks_needed * 1.5):.0f}+ fermenters — 2.3 million doses/month")`,
      challenge: 'Modern bioreactors use genetic engineering to make bacteria PRODUCE penicillin directly (not mold). If a genetically engineered E. coli produces 500 mg/L (10× the mold), how does this change the industrial calculation? How many fermenters would you need for the same D-Day production?',
      successHint: 'You modeled the biotechnology scale-up problem — one of the most important challenges in pharmaceutical manufacturing. The same issues (surface area, mixing, contamination) apply to vaccine production, biofuel manufacturing, and cell therapy. The scale-up from lab to factory is where most biotech startups fail.',
    },
    {
      title: 'The resistance crisis — modelling the global threat',
      concept: `Antibiotic resistance is not a future threat — it's a **current crisis**. The WHO estimates that resistant infections kill **1.27 million people per year** worldwide — more than HIV/AIDS or malaria. By 2050, this could rise to **10 million per year** if current trends continue.

The core problem: bacteria evolve resistance faster than we develop new antibiotics. The last truly novel class of antibiotics was discovered in **1987**. Since then, all new antibiotics have been modifications of existing classes — and bacteria are developing resistance to each one.

The mathematics is stark: a new antibiotic takes **10-15 years and $1-2 billion** to develop. Bacteria can develop resistance in **months to years**. The economic incentive is also broken: a new antibiotic that's used sparingly (to slow resistance) generates less revenue than a new diabetes drug that's used daily for life.

📚 *The "antibiotic pipeline" — the set of new antibiotics in development — is dangerously thin. Only a few truly novel classes are being researched, and most face years of testing before reaching patients.*`,
      analogy: 'Imagine a chess game where you can develop new pieces (expensive, slow) but your opponent can copy and counter each piece within a few moves (fast, free). Eventually, you run out of new pieces before your opponent runs out of counters. This is the antibiotic resistance arms race.',
      storyConnection: 'Fleming predicted this exact scenario in 1945: "The thoughtless person playing with penicillin treatment is morally responsible for the death of the man who succumbs to infection with the penicillin-resistant organism." Eighty years later, his warning has come true on a global scale.',
      checkQuestion: 'Why doesn\'t the pharmaceutical industry invest more in new antibiotics?',
      checkAnswer: 'Perverse economics: a good antibiotic is used as rarely as possible (to slow resistance), generating low revenue. A diabetes drug is used daily for life, generating continuous revenue. The drugs we need MOST are the ones that make LEAST money. This market failure is one of the biggest challenges in public health.',
      codeIntro: 'Model the global trajectory of antibiotic resistance and test different intervention strategies.',
      code: `import numpy as np

np.random.seed(42)

def resistance_model(
    years=30,
    starting_resistant_pct=15,   # current % of infections that are resistant
    new_antibiotic_interval=15,  # years between new antibiotic classes
    resistance_growth_rate=0.03, # annual % increase in resistance
    intervention_effect=0,       # reduction in growth rate from interventions
):
    """
    Model the global trajectory of antibiotic resistance.
    """
    resistant_pct = starting_resistant_pct
    log = []

    for year in range(years + 1):
        # Resistance grows annually
        effective_rate = resistance_growth_rate * (1 - intervention_effect)
        resistant_pct = min(100, resistant_pct * (1 + effective_rate))

        # New antibiotic class resets some resistance
        if year > 0 and year % new_antibiotic_interval == 0:
            resistant_pct *= 0.7  # new drug reduces resistance by 30%

        # Deaths from resistant infections (estimated)
        world_infections = 700_000_000  # ~700M infections/year globally
        resistant_infections = world_infections * resistant_pct / 100
        resistant_deaths = resistant_infections * 0.002  # 0.2% fatality for resistant

        log.append({
            "year": 2024 + year,
            "resistant_pct": resistant_pct,
            "deaths": resistant_deaths,
        })

    return log

# Scenario 1: Business as usual (no new interventions)
print("=== Global Antibiotic Resistance Projections ===")
print(f"\
Scenario 1: Business as Usual")
bau = resistance_model(intervention_effect=0)

print(f"{'Year':>6} {'Resistant %':>12} {'Annual Deaths':>15}")
print("-" * 35)
for entry in bau:
    if (entry["year"] - 2024) % 5 == 0:
        print(f"{entry['year']:>6} {entry['resistant_pct']:>10.1f}% {entry['deaths']:>13,.0f}")

# Scenario 2: Moderate intervention
print(f"\
Scenario 2: Moderate Intervention (stewardship + R&D)")
moderate = resistance_model(intervention_effect=0.3, new_antibiotic_interval=10)

print(f"{'Year':>6} {'Resistant %':>12} {'Annual Deaths':>15}")
print("-" * 35)
for entry in moderate:
    if (entry["year"] - 2024) % 5 == 0:
        print(f"{entry['year']:>6} {entry['resistant_pct']:>10.1f}% {entry['deaths']:>13,.0f}")

# Scenario 3: Aggressive intervention
print(f"\
Scenario 3: Aggressive Intervention (global coordination)")
aggressive = resistance_model(intervention_effect=0.6, new_antibiotic_interval=7)

print(f"{'Year':>6} {'Resistant %':>12} {'Annual Deaths':>15}")
print("-" * 35)
for entry in aggressive:
    if (entry["year"] - 2024) % 5 == 0:
        print(f"{entry['year']:>6} {entry['resistant_pct']:>10.1f}% {entry['deaths']:>13,.0f}")

# Comparison
print(f"\
=== 2050 Comparison ===")
bau_2050 = bau[-1]
mod_2050 = moderate[-1]
agg_2050 = aggressive[-1]

print(f"{'Scenario':<40} {'Resistant %':>12} {'Annual Deaths':>15}")
print("-" * 69)
print(f"{'Business as usual':<40} {bau_2050['resistant_pct']:>10.1f}% {bau_2050['deaths']:>13,.0f}")
print(f"{'Moderate intervention':<40} {mod_2050['resistant_pct']:>10.1f}% {mod_2050['deaths']:>13,.0f}")
print(f"{'Aggressive intervention':<40} {agg_2050['resistant_pct']:>10.1f}% {agg_2050['deaths']:>13,.0f}")
lives_saved = bau_2050["deaths"] - agg_2050["deaths"]
print(f"\
Lives saved by aggressive intervention: {lives_saved:,.0f} per year")

# What interventions work?
print(f"\
=== Intervention Strategies ===")
strategies = [
    ("Complete prescribed courses", 0.05),
    ("Reduce agricultural antibiotics", 0.08),
    ("Hospital stewardship programs", 0.10),
    ("Rapid diagnostic testing", 0.07),
    ("New antibiotic development", 0.10),
    ("Global surveillance networks", 0.05),
    ("Vaccine development (reduce need)", 0.15),
]

print(f"{'Strategy':<40} {'Impact on growth rate':>20}")
print("-" * 62)
cumulative = 0
for name, effect in strategies:
    cumulative += effect
    print(f"{name:<40} {'−'}{effect*100:.0f}%{' ':>10}")

print(f"{'COMBINED':.<40} {'−'}{cumulative*100:.0f}%{' ':>10}")
print(f"\
Combined: {cumulative*100:.0f}% reduction in resistance growth rate")
print(f"No single strategy is enough. ALL of them together barely keep pace.")`,
      challenge: 'Add a "phage therapy" strategy — using viruses that kill specific bacteria, bypassing antibiotic resistance entirely. Model it as reducing the effective resistant percentage by 20% (phages work on resistant bacteria that antibiotics can\'t kill). How does this change the 2050 projection?',
      successHint: 'You modeled one of the most important public health crises of the 21st century. The mathematics is clear: without intervention, antibiotic resistance will kill more people than cancer by 2050. But the projections also show that coordinated action — multiple strategies applied together — can dramatically reduce this toll.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Microbiology and population dynamics through code</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises use Python to model bacterial growth, antibiotic effectiveness, and the evolution of resistance.
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
