import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function PenicillinLevel2() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Logistic growth with carrying capacity — how bacteria fill a petri dish',
      concept: `Bacteria don't grow forever. In a petri dish with limited nutrients, a colony follows **logistic growth** — fast at first, then slowing as resources run out.

The logistic equation is: **dN/dt = r × N × (1 - N/K)**

Where N is the population size, r is the intrinsic growth rate, and K is the **carrying capacity** — the maximum population the environment can sustain.

When N is small compared to K, the term (1 - N/K) is close to 1, so growth is nearly exponential: dN/dt ≈ r × N. But as N approaches K, the term shrinks toward 0, and growth stalls. The population plateaus at K.

This is exactly what Fleming observed: his Staphylococcus colonies grew rapidly on fresh agar, then levelled off. The clear zone around the Penicillium mould wasn't just killing bacteria — it was reducing the effective carrying capacity to zero in that region.

📚 *The logistic model is the simplest realistic population model. It captures the key insight: unlimited growth is impossible. Every population hits a ceiling imposed by its environment.*`,
      analogy: 'Imagine a party in a small room. The first few guests arrive and spread out easily — that\'s exponential growth. As the room fills, it gets harder to move, find food, or have a conversation. Eventually, no more people can fit — that\'s the carrying capacity. The room doesn\'t get bigger just because more people want in.',
      storyConnection: 'Fleming\'s 1928 observation depended on bacterial growth dynamics. The Staphylococcus had to grow enough to form visible colonies (the logistic curve\'s steep middle section), but the Penicillium mould created a zone where K dropped to zero — a "dead zone" where no amount of bacterial growth rate could overcome the antibiotic.',
      checkQuestion: 'A bacterial culture has r = 0.5 per hour and K = 10,000,000. When N = 5,000,000 (half of K), what is the growth rate dN/dt?',
      checkAnswer: 'dN/dt = 0.5 × 5,000,000 × (1 - 5,000,000/10,000,000) = 0.5 × 5,000,000 × 0.5 = 1,250,000 per hour. This is the maximum growth rate — it occurs at exactly N = K/2. Before this point, N is small so the product r×N is small. After this point, (1 - N/K) is small. The fastest growth happens at half capacity.',
      codeIntro: 'Simulate logistic bacterial growth and visualise how antibiotics shift the carrying capacity.',
      code: `import numpy as np

def logistic_growth(N0, r, K, hours, dt=0.1):
    """Simulate logistic growth using Euler's method."""
    steps = int(hours / dt)
    time = np.zeros(steps)
    pop = np.zeros(steps)
    pop[0] = N0
    for i in range(1, steps):
        time[i] = i * dt
        dNdt = r * pop[i-1] * (1 - pop[i-1] / K)
        pop[i] = max(pop[i-1] + dNdt * dt, 0)
    return time, pop

# Growth parameters for Staphylococcus aureus
r = 0.8        # per hour (doubling time ~52 min)
K = 1e9        # carrying capacity (cells per mL)
N0 = 1000      # initial inoculum

print("=== Bacterial Logistic Growth ===")
print(f"Initial population: {N0:,.0f} cells")
print(f"Growth rate: {r} per hour")
print(f"Carrying capacity: {K:,.0f} cells\\\n")

time, pop = logistic_growth(N0, r, K, 30)

# Sample key time points
print(f"{'Hour':>6} {'Population':>15} {'Growth Rate':>15} {'% of K':>8}")
print("-" * 46)
for h in [0, 2, 5, 8, 10, 12, 15, 20, 25, 30]:
    idx = int(h / 0.1)
    if idx < len(pop):
        N = pop[idx]
        rate = r * N * (1 - N / K)
        print(f"{h:>5.0f}h {N:>14,.0f} {rate:>14,.0f} {N/K*100:>7.1f}%")

# Effect of antibiotic: reduce K
print("\\\n=== Antibiotic Effect on Carrying Capacity ===")
print("Penicillin reduces effective K by killing dividing cells\\\n")

for antibiotic_factor in [1.0, 0.5, 0.1, 0.01, 0.001]:
    K_eff = K * antibiotic_factor
    _, pop_ab = logistic_growth(N0, r, K_eff, 30)
    final = pop_ab[-1]
    print(f"K_effective = {K_eff:>12,.0f} ({antibiotic_factor:>5.1%} of normal) "
          f"-> Final pop: {final:>12,.0f}")

print("\\\nAt MIC, K_effective drops low enough that the immune system")
print("can clear the remaining bacteria. That's the therapeutic goal.")`,
      challenge: 'Add a "lag phase" to the model — real bacteria take 1-2 hours to activate their metabolic machinery before growing. Modify the simulation so growth rate is 0 for the first 1.5 hours, then switches to r = 0.8. How does this change the time to reach 50% of K?',
      successHint: 'The logistic equation appears everywhere: bacterial growth, tumour progression, technology adoption, social media virality, even fish populations in lakes. Mastering it gives you a universal tool for modelling any system with limited resources.',
    },
    {
      title: 'Pharmacokinetics — absorption, distribution, metabolism, excretion',
      concept: `When you swallow a penicillin tablet, the drug doesn't instantly reach the infection. It follows a journey with four stages — **ADME**:

**Absorption**: the drug dissolves in the gut and enters the bloodstream. The rate depends on the drug's solubility and the gut's surface area.

**Distribution**: blood carries the drug throughout the body. Some tissues absorb more drug than others — the **volume of distribution** (Vd) measures how widely the drug spreads.

**Metabolism**: the liver chemically transforms the drug (often deactivating it). The rate follows first-order kinetics: a fixed fraction is metabolised per unit time.

**Excretion**: the kidneys filter the drug (and its metabolites) from the blood into urine.

The net effect: drug concentration in the blood **rises** (absorption > elimination), **peaks**, then **falls** (elimination > absorption). The shape of this curve determines whether the drug works.

📚 *The plasma concentration-time curve is the most important graph in pharmacology. It determines dosing: how much drug to give, how often, and for how long.*`,
      analogy: 'Imagine filling a bathtub with water (absorption) while the drain is open (elimination). At first, water flows in faster than it drains — the level rises. Eventually, the tap slows (absorption complete) and the drain takes over — the level falls. The peak water level is your peak drug concentration. The goal is to keep the level in a "therapeutic zone" — above the minimum effective level but below the toxic level.',
      storyConnection: 'Early penicillin therapy failed when given orally — stomach acid destroyed the drug before absorption. Howard Florey\'s team at Oxford solved this by injecting penicillin directly (bypassing absorption), but the kidneys excreted it so fast that they had to re-extract penicillin from patients\' urine and re-inject it. Understanding ADME was the key to making penicillin practical.',
      checkQuestion: 'A patient receives 500 mg of amoxicillin orally. Bioavailability is 80%. What dose actually reaches the bloodstream?',
      checkAnswer: '500 × 0.80 = 400 mg. The remaining 100 mg is destroyed in the gut (acid degradation, incomplete absorption) or metabolised in the liver before reaching systemic circulation (first-pass metabolism). This is why oral doses are higher than IV doses — you must compensate for losses during absorption.',
      codeIntro: 'Model the ADME pharmacokinetic profile — track drug concentration through absorption and elimination.',
      code: `import numpy as np

def pk_one_compartment(dose_mg, bioavail, ka, ke, vd, hours, dt=0.05):
    """
    One-compartment PK model with first-order absorption and elimination.
    ka = absorption rate constant (per hour)
    ke = elimination rate constant (per hour)
    vd = volume of distribution (litres)
    """
    steps = int(hours / dt)
    time = np.zeros(steps)
    gut = np.zeros(steps)      # drug remaining in gut
    plasma = np.zeros(steps)   # plasma concentration (mg/L)

    gut[0] = dose_mg * bioavail  # amount available for absorption

    for i in range(1, steps):
        time[i] = i * dt
        absorbed = ka * gut[i-1] * dt
        eliminated = ke * plasma[i-1] * vd * dt

        gut[i] = gut[i-1] - absorbed
        plasma_amount = plasma[i-1] * vd + absorbed - eliminated
        plasma[i] = max(plasma_amount / vd, 0)

    return time, plasma, gut

# Amoxicillin PK parameters
dose = 500        # mg
bioavail = 0.80   # 80% oral bioavailability
ka = 1.5          # absorption rate (per hour)
ke = 0.7          # elimination rate (per hour) — t½ ≈ 1 hour
vd = 20           # volume of distribution (litres)

time, conc, gut = pk_one_compartment(dose, bioavail, ka, ke, vd, 12)

print("=== Amoxicillin Pharmacokinetic Profile ===")
print(f"Dose: {dose} mg oral | Bioavailability: {bioavail:.0%}")
print(f"Ka: {ka}/hr | Ke: {ke}/hr | Vd: {vd} L")
print(f"Half-life: {0.693/ke:.1f} hours\\\n")

print(f"{'Hour':>6} {'Plasma (mg/L)':>14} {'Gut (mg)':>10} {'Status':>20}")
print("-" * 52)

mic = 2.0  # MIC for typical S. aureus (mg/L)

for h_target in [0, 0.5, 1.0, 1.5, 2.0, 3.0, 4.0, 6.0, 8.0, 10.0, 12.0]:
    idx = min(int(h_target / 0.05), len(conc) - 1)
    c = conc[idx]
    g = gut[idx]
    status = "ABOVE MIC" if c > mic else "below MIC"
    print(f"{h_target:>5.1f}h {c:>12.2f} {g:>9.1f} {status:>20}")

# Find key PK parameters
peak_idx = np.argmax(conc)
cmax = conc[peak_idx]
tmax = time[peak_idx]
# Time above MIC
above_mic = np.sum(conc > mic) * 0.05

print(f"\\\nPeak concentration (Cmax): {cmax:.2f} mg/L at {tmax:.1f} hours")
print(f"Time above MIC ({mic} mg/L): {above_mic:.1f} hours")
print(f"Target: >40% of dosing interval above MIC for efficacy")
print(f"Achieved: {above_mic/8*100:.0f}% of 8-hour interval")`,
      challenge: 'Model a multi-dose regimen: 500 mg every 8 hours for 3 days. At each new dose, add another bolus to the gut compartment. Does the drug accumulate? Plot the "steady state" trough and peak levels. This is how pharmacists calculate dosing schedules.',
      successHint: 'Pharmacokinetics is the science behind every drug dosing label. The one-compartment model you just built is taught in every pharmacy school. Understanding ADME means you can reason about why drugs are taken at specific intervals and doses — not arbitrary, but calculated from these exact equations.',
    },
    {
      title: 'MIC determination — finding the minimum inhibitory concentration',
      concept: `The **Minimum Inhibitory Concentration (MIC)** is the lowest antibiotic concentration that prevents visible bacterial growth. It's the single most important number in antibiotic therapy — it determines whether a drug will work against a specific pathogen.

MIC is measured by **broth microdilution**: you prepare a series of tubes with doubling concentrations of the antibiotic (0.25, 0.5, 1, 2, 4, 8, 16, 32 mg/L), add the same number of bacteria to each, incubate overnight, and check which tubes are clear (no growth) vs turbid (growth).

The MIC is the concentration of the first clear tube. Below the MIC, bacteria survive and multiply. At or above the MIC, growth is suppressed.

**Breakpoints** are the MIC thresholds that classify bacteria as Susceptible (S), Intermediate (I), or Resistant (R). These are set by committees (CLSI, EUCAST) based on PK data and clinical outcomes.

📚 *MIC uses a doubling dilution series because bacterial response to antibiotics is logarithmic — a 2× increase in concentration has the same proportional effect regardless of the starting point. This is why we use log₂ scales.*`,
      analogy: 'Imagine testing how much salt you need to add to water to prevent ice from forming. You test 1 g, 2 g, 4 g, 8 g per litre. The minimum amount that prevents freezing is your "MIC" for salt vs ice. Below that amount, ice still forms. At or above it, the water stays liquid. The MIC for an antibiotic works the same way — it\'s the minimum "dose" that prevents bacterial "growth."',
      storyConnection: 'Fleming discovered penicillin\'s antibacterial effect qualitatively — he saw a clear zone. But it was Florey and Chain at Oxford who quantified the MIC, determining exactly how much penicillin was needed to inhibit Staphylococcus. This quantification was the step that turned a laboratory curiosity into a life-saving medicine — you can\'t dose a patient without knowing the MIC.',
      checkQuestion: 'In a broth dilution series, tubes at 0.5, 1, 2, 4, 8, and 16 mg/L show: turbid, turbid, turbid, clear, clear, clear. What is the MIC?',
      checkAnswer: 'MIC = 4 mg/L — the lowest concentration showing no visible growth. At 2 mg/L, some bacteria survived and multiplied (turbid). At 4 mg/L, the antibiotic suppressed all growth. The breakpoint tables then tell you whether 4 mg/L is achievable in the patient\'s blood — if the drug\'s Cmax exceeds 4 mg/L, the infection is treatable.',
      codeIntro: 'Simulate a broth microdilution MIC assay and classify bacteria as susceptible, intermediate, or resistant.',
      code: `import numpy as np

np.random.seed(42)

def mic_assay(bacterium, antibiotic, true_mic, n_replicates=3):
    """
    Simulate a broth microdilution MIC assay.
    Doubling dilutions from 0.0625 to 256 mg/L.
    Returns observed MIC (with experimental variability).
    """
    concentrations = [0.0625 * 2**i for i in range(13)]  # 0.0625 to 256
    results = []

    for conc in concentrations:
        # At each concentration, bacteria either grow or don't
        # Near the true MIC, there's stochastic variability
        kill_prob = 1 / (1 + np.exp(-3 * (np.log2(conc) - np.log2(true_mic))))

        replicate_results = []
        for _ in range(n_replicates):
            grew = np.random.random() > kill_prob
            replicate_results.append(grew)

        results.append({
            "conc": conc,
            "growth": replicate_results,
            "any_growth": any(replicate_results),
        })

    # MIC = lowest concentration with no growth in any replicate
    mic_observed = None
    for r in results:
        if not r["any_growth"]:
            mic_observed = r["conc"]
            break

    return concentrations, results, mic_observed

# Test panel: common pathogens vs penicillin-class antibiotics
panel = [
    ("S. aureus (susceptible)", "Penicillin G", 0.125),
    ("S. aureus (MRSA)", "Penicillin G", 64),
    ("S. pneumoniae", "Amoxicillin", 0.5),
    ("E. coli", "Ampicillin", 4),
    ("E. coli (ESBL+)", "Ampicillin", 128),
    ("H. influenzae", "Amoxicillin", 1),
]

# CLSI breakpoints (simplified)
breakpoints = {
    "Penicillin G": {"S": 0.125, "R": 2},
    "Amoxicillin": {"S": 2, "R": 8},
    "Ampicillin": {"S": 8, "R": 32},
}

print("=== MIC Determination Panel ===")
print(f"{'Organism':<30} {'Antibiotic':<16} {'True MIC':>9} {'Obs MIC':>9} {'Class':>6}")
print("-" * 72)

for organism, abx, true_mic in panel:
    _, _, obs_mic = mic_assay(organism, abx, true_mic)
    bp = breakpoints[abx]
    if obs_mic and obs_mic <= bp["S"]:
        classification = "S"
    elif obs_mic and obs_mic >= bp["R"]:
        classification = "R"
    else:
        classification = "I"

    mic_str = f"{obs_mic:.3f}" if obs_mic and obs_mic < 1 else f"{obs_mic:.1f}" if obs_mic else ">256"
    print(f"{organism:<30} {abx:<16} {true_mic:>8.3f} {mic_str:>9} {classification:>6}")

print()
print("S = Susceptible (standard dosing will work)")
print("I = Intermediate (high-dose or alternative route may work)")
print("R = Resistant (drug will NOT work at achievable concentrations)")

# Distribution of MICs across isolates
print("\\\n=== MIC Distribution (50 S. aureus isolates) ===")
isolate_mics = np.random.lognormal(mean=np.log(0.5), sigma=1.2, size=50)
isolate_mics = np.clip(isolate_mics, 0.0625, 256)
bins = [0.0625 * 2**i for i in range(14)]
print(f"{'MIC Range':>16} {'Count':>6} {'Bar'}")
for i in range(len(bins)-1):
    count = np.sum((isolate_mics >= bins[i]) & (isolate_mics < bins[i+1]))
    bar = "#" * int(count)
    print(f"{bins[i]:>7.3f}-{bins[i+1]:<7.3f} {count:>4}  {bar}")`,
      challenge: 'Some bacteria show "heteroresistance" — most cells in a population are susceptible, but a small subpopulation is resistant. Modify the simulation so that 1% of bacteria have a 64× higher MIC. How does this affect the observed MIC? (Hint: it may not — the 1% subpopulation is invisible until the susceptible majority is killed.)',
      successHint: 'MIC testing is performed millions of times daily in hospital microbiology labs worldwide. The broth microdilution method you just simulated is the gold standard. Understanding MIC — and its limitations — is essential for anyone working in infectious disease, pharmacology, or public health.',
    },
    {
      title: 'Mutation rate calculation — the Luria-Delbruck experiment',
      concept: `How fast do bacteria mutate? This matters enormously for antibiotic resistance. If mutations are rare (1 in 10 billion), resistance evolves slowly. If common (1 in 1 million), it evolves in days.

In 1943, Luria and Delbruck designed a brilliant experiment. They grew many small bacterial cultures from a single cell each, then exposed them to a lethal agent. If mutations happen **randomly during growth** (before exposure), different cultures will have wildly different numbers of resistant mutants — cultures where the mutation happened early have many, those where it happened late have few. This creates a highly **skewed distribution** (most cultures have zero, a few have hundreds).

The mutation rate **mu** can be estimated from this distribution using the **fluctuation test**:

**mu ≈ -ln(P₀) / N**

Where P₀ is the fraction of cultures with ZERO resistant mutants, and N is the final population size.

📚 *The Luria-Delbruck experiment proved that mutations are spontaneous and random — they occur before selection, not in response to it. This was a landmark in genetics and earned Luria and Delbruck the Nobel Prize.*`,
      analogy: 'Imagine 20 people each flipping a coin 1,000 times and counting heads in a row. Most will get short streaks (3-5 heads). But occasionally someone gets a freak streak of 12 heads — not because they\'re special, but because of random chance. The Luria-Delbruck experiment works the same way: most cultures have few mutants, but a lucky early mutation in one culture produces a "jackpot" — hundreds of resistant cells.',
      storyConnection: 'The mutations that created penicillin-resistant Staphylococcus were already occurring before penicillin was used clinically. Fleming himself warned in his 1945 Nobel Prize speech that misuse of penicillin would select for these pre-existing resistant mutants. The Luria-Delbruck model explains exactly why: the mutants are there, waiting. Antibiotics don\'t create resistance — they reveal it.',
      checkQuestion: 'In a fluctuation test with 40 cultures, 15 have zero resistant mutants. The final population size is 10^8. Estimate the mutation rate.',
      checkAnswer: 'P₀ = 15/40 = 0.375. mu = -ln(0.375) / 10^8 = 0.98 / 10^8 ≈ 9.8 × 10^-9 per cell per division. This means roughly 1 in 100 million cell divisions produces a resistant mutant. In a patient with 10^12 bacteria, that\'s about 10,000 resistant cells — enough to cause treatment failure if the susceptible population is killed.',
      codeIntro: 'Simulate the Luria-Delbruck fluctuation test and estimate mutation rates.',
      code: `import numpy as np

np.random.seed(42)

def luria_delbruck_simulation(n_cultures, N_final, mutation_rate, n_experiments=1):
    """
    Simulate the Luria-Delbruck fluctuation test.
    Each culture grows from 1 cell to N_final.
    At each division, there's a probability mu of mutation.
    Mutant cells and their descendants survive the selection.
    """
    all_results = []

    for _ in range(n_experiments):
        mutant_counts = []

        for _ in range(n_cultures):
            mutants = 0
            # Approximate: at each generation, each cell can mutate
            # Number of generations = log2(N_final)
            generations = int(np.log2(N_final))

            for gen in range(generations):
                cells_at_gen = 2 ** gen
                # Number of new mutants this generation
                new_mutants = np.random.binomial(cells_at_gen, mutation_rate)
                # Each mutant produces 2^(remaining generations) descendants
                remaining = generations - gen - 1
                mutants += new_mutants * (2 ** remaining)

            mutant_counts.append(mutants)

        all_results.append(mutant_counts)

    return all_results

# Run fluctuation test
n_cultures = 40
N_final = 10**8
true_mu = 2.5e-9  # per cell per division

print("=== Luria-Delbruck Fluctuation Test Simulation ===")
print(f"Cultures: {n_cultures} | Final pop: {N_final:.0e} | True mu: {true_mu:.1e}\\\n")

results = luria_delbruck_simulation(n_cultures, N_final, true_mu)[0]
results_arr = np.array(results)

# Distribution of mutant counts
print(f"{'Mutant Count':>14} {'# Cultures':>12}")
print("-" * 28)
bins = [0, 1, 5, 10, 50, 100, 500, 1000, 5000, float('inf')]
for i in range(len(bins) - 1):
    lo, hi = bins[i], bins[i+1]
    count = np.sum((results_arr >= lo) & (results_arr < hi))
    label = f"{int(lo)}-{int(hi)-1}" if hi != float('inf') else f"{int(lo)}+"
    bar = "#" * count
    print(f"{label:>14} {count:>10}  {bar}")

# Estimate mutation rate using P0 method
p0 = np.sum(results_arr == 0) / n_cultures
if p0 > 0:
    mu_estimate = -np.log(p0) / N_final
else:
    mu_estimate = float('nan')

print(f"\\\n=== Mutation Rate Estimation ===")
print(f"Cultures with 0 mutants (P0): {np.sum(results_arr == 0)}/{n_cultures} = {p0:.3f}")
print(f"Estimated mu (P0 method): {mu_estimate:.2e}")
print(f"True mu:                  {true_mu:.2e}")
print(f"Estimation error: {abs(mu_estimate - true_mu) / true_mu * 100:.0f}%")

# Compare with Poisson (incorrect) model
print(f"\\\n=== Why Poisson is Wrong ===")
mean_mutants = np.mean(results_arr)
var_mutants = np.var(results_arr)
print(f"Mean mutant count: {mean_mutants:.1f}")
print(f"Variance: {var_mutants:.1f}")
print(f"Variance/Mean ratio: {var_mutants/mean_mutants:.1f}")
print(f"(Poisson predicts ratio = 1; Luria-Delbruck gives ratio >> 1)")
print(f"The high variance proves mutations are random, not induced.)")`,
      challenge: 'Run the simulation with different mutation rates (10^-7, 10^-8, 10^-9, 10^-10) and see how the variance-to-mean ratio changes. At what mutation rate does resistance become inevitable in a patient with 10^12 bacteria? (Hint: if mu × N > 1, at least one resistant mutant is expected.)',
      successHint: 'The Luria-Delbruck fluctuation test is one of the most elegant experiments in biology. It proved that mutations are random, pre-existing events — not directed responses to environmental pressure. This insight, combined with mutation rate estimation, is the foundation of resistance prediction: if you know mu and N, you can calculate the probability that resistance exists.',
    },
    {
      title: 'Population genetics of resistance — selection, drift, and fitness cost',
      concept: `A resistant mutant is born. What happens next? That depends on **population genetics** — the forces that determine whether a rare allele (resistance gene) spreads through the population or disappears.

Three forces act on the resistant mutant:

**Selection**: In the presence of antibiotic, resistant bacteria survive and susceptible ones die. The selection coefficient **s** measures the advantage: s = 1 means 100% advantage (all susceptible die). In the absence of antibiotic, resistance often has a **fitness cost** — resistant bacteria grow 5-20% slower than susceptible ones (negative s).

**Genetic drift**: In small populations, random chance can eliminate or fix a rare allele regardless of its fitness. Drift is inversely proportional to population size N — powerful in small populations, negligible in large ones.

**Migration**: Resistant bacteria can be transferred between patients (horizontal transmission) or between species (horizontal gene transfer via plasmids).

📚 *The fate of a new mutation depends on the balance between selection (which favours the fit) and drift (which is random). In large populations under strong selection, the fittest wins. In small populations with weak selection, luck matters more than fitness.*`,
      analogy: 'Imagine a game of musical chairs where some players are faster (susceptible bacteria in drug-free conditions) and others have protective helmets (resistant bacteria during antibiotic exposure). Without antibiotics, the fast players win — resistance is a disadvantage. With antibiotics, the helmets save lives — resistance is an advantage. Population genetics asks: over many rounds, which strategy dominates?',
      storyConnection: 'The first penicillin-resistant Staphylococcus was reported in 1942 — just two years after clinical use began. The resistant gene (blaZ, encoding beta-lactamase) spread from <5% of hospital isolates in 1942 to >90% by the 1960s. This is natural selection on a massive scale, playing out in hospitals instead of forests, over years instead of millennia.',
      checkQuestion: 'If resistance has a fitness cost of 5% (resistant bacteria grow 5% slower) and antibiotic is removed, will resistance disappear?',
      checkAnswer: 'Slowly — but not necessarily completely. With s = -0.05, the resistant frequency drops by ~5% per generation. After 100 generations (~5 days for bacteria), resistance drops significantly. BUT compensatory mutations that eliminate the fitness cost evolve quickly, allowing resistant bacteria to compete equally even without antibiotic. This is why "antibiotic holidays" rarely eliminate resistance.',
      codeIntro: 'Model the population genetics of resistance — selection, drift, and fitness cost in a bacterial population.',
      code: `import numpy as np

np.random.seed(42)

def wright_fisher(N, p0, s, generations):
    """
    Wright-Fisher model of allele frequency change.
    N = population size
    p0 = initial frequency of resistant allele
    s = selection coefficient (positive = resistance advantageous)
    """
    freqs = [p0]
    p = p0

    for gen in range(generations):
        # Selection: adjust fitness
        w_R = 1 + s        # fitness of resistant
        w_S = 1             # fitness of susceptible
        w_bar = p * w_R + (1 - p) * w_S  # mean fitness

        # Expected frequency after selection
        p_after_sel = p * w_R / w_bar

        # Drift: binomial sampling (finite population)
        n_resistant = np.random.binomial(N, p_after_sel)
        p = n_resistant / N

        freqs.append(p)

        if p == 0 or p == 1:
            # Allele fixed or lost — fill remaining
            freqs.extend([p] * (generations - gen - 1))
            break

    return freqs

# Scenario 1: Antibiotic present (resistance advantageous)
print("=== Scenario 1: Antibiotic Present (s = +0.3) ===")
N = 10000
p0 = 0.001  # 0.1% resistant initially
generations = 200

freqs = wright_fisher(N, p0, s=0.3, generations=generations)
print(f"Starting frequency: {p0:.3f}")
print(f"{'Gen':>5} {'Freq':>8} {'Resistant':>10} {'Susceptible':>12}")
print("-" * 37)
for g in [0, 10, 20, 30, 50, 75, 100, 150, 200]:
    if g < len(freqs):
        f = freqs[g]
        print(f"{g:>5} {f:>7.3f} {int(f*N):>10} {int((1-f)*N):>12}")

# Scenario 2: Antibiotic removed (resistance costly)
print("\\\n=== Scenario 2: Antibiotic Removed (s = -0.05) ===")
p0_high = freqs[min(100, len(freqs)-1)]  # start from Scenario 1
freqs2 = wright_fisher(N, p0_high, s=-0.05, generations=300)
print(f"Starting frequency: {p0_high:.3f}")
for g in [0, 25, 50, 100, 150, 200, 300]:
    if g < len(freqs2):
        f = freqs2[g]
        print(f"Gen {g:>4}: freq = {f:.3f}")

# Multiple runs to show stochasticity
print("\\\n=== Stochastic Variation (10 runs, small pop N=500) ===")
outcomes = {"Fixed (R=1.0)": 0, "Lost (R=0.0)": 0, "Polymorphic": 0}
for run in range(10):
    np.random.seed(run)
    f = wright_fisher(500, 0.01, s=0.1, generations=500)
    final = f[-1]
    if final >= 0.999:
        outcomes["Fixed (R=1.0)"] += 1
    elif final <= 0.001:
        outcomes["Lost (R=0.0)"] += 1
    else:
        outcomes["Polymorphic"] += 1
    print(f"  Run {run+1:>2}: final freq = {final:.3f}")

print(f"\\\nOutcomes: {outcomes}")
print("Even with positive selection, drift can eliminate resistance in small pops.")`,
      challenge: 'Model "compensatory evolution": after resistance fixes, introduce a second mutation that eliminates the fitness cost (changes s from -0.05 to 0.0 in the drug-free phase). Run 100 simulations and compare how often resistance persists with vs without compensatory mutations. This explains why resistance is so hard to reverse.',
      successHint: 'Population genetics is the mathematical framework for understanding evolution — including the evolution of drug resistance. The Wright-Fisher model you just implemented is taught in every genetics graduate programme. It explains why resistance spreads under antibiotic pressure, why it persists when pressure is removed, and why small-population effects (hospital wards, clinics) can produce unpredictable outcomes.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Quantitative microbiology and pharmacology</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 2 dives into logistic growth, pharmacokinetics, MIC determination, mutation rates, and population genetics of resistance.
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
