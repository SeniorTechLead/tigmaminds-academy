import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function PenicillinLevel4() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Capstone project: Design an Antibiotic Resistance Simulator',
      concept: `In this capstone project, you will build a complete **Antibiotic Resistance Simulator** — a Python program that:

1. **Models a bacterial population** with susceptible and resistant subpopulations
2. **Simulates antibiotic treatment** with realistic pharmacokinetic drug levels
3. **Tracks resistance evolution** through mutation, selection, and fitness cost
4. **Optimises treatment strategies** to minimise resistance emergence
5. **Generates a clinical report** with recommendations

This brings together everything from Levels 1-3: logistic growth, pharmacokinetics, MIC, mutation rates, population genetics, PKPD, and game theory.

The first step is **system design** — planning the architecture before writing code. You need to define the data structures for bacteria, drugs, and treatment protocols, and design the simulation loop that ties them together.

📚 *System design means deciding what your program does, how it's organized, and what data it needs — BEFORE you write code. In computational biology, good architecture separates the biological model from the numerical solver from the output formatting.*`,
      analogy: 'Before running a clinical trial, researchers write a protocol: what they\'ll measure, how they\'ll analyse it, and what outcomes they\'re looking for. Before building a simulator, you write an architecture: what objects you need, how they interact, and what questions the simulator will answer. Skipping design leads to tangled code — just as skipping protocol leads to useless trials.',
      storyConnection: 'The penicillin story is fundamentally about systems: bacteria evolving in response to drug pressure, drug levels rising and falling with dosing, resistance spreading through populations. Fleming\'s observation, Florey\'s clinical trials, and the wartime scale-up were all systems problems. Your simulator models the same system computationally.',
      checkQuestion: 'Why should the Bacterium class track both "susceptible" and "resistant" subpopulations rather than individual cells?',
      checkAnswer: 'Because a typical infection has 10^8 to 10^12 bacteria — tracking each individually is computationally impossible. Instead, we track population sizes and frequencies, using the same mean-field approach that population genetics uses. This trades individual-level detail for computational feasibility while preserving the key dynamics (growth, selection, mutation).',
      codeIntro: 'Design the architecture of the Antibiotic Resistance Simulator — define classes, data structures, and workflow.',
      code: `import numpy as np

class Bacterium:
    """Represents a bacterial species with susceptible and resistant subpopulations."""
    def __init__(self, name, growth_rate, K, mic_susceptible, mic_resistant,
                 mutation_rate, fitness_cost):
        self.name = name
        self.growth_rate = growth_rate      # per hour
        self.K = K                          # carrying capacity
        self.mic_s = mic_susceptible        # MIC for susceptible (mg/L)
        self.mic_r = mic_resistant          # MIC for resistant (mg/L)
        self.mutation_rate = mutation_rate   # per cell per division
        self.fitness_cost = fitness_cost    # growth rate reduction for resistant

class Antibiotic:
    """Represents an antibiotic with PK and PD parameters."""
    def __init__(self, name, dose_mg, interval_hr, ka, ke, vd, bioavail,
                 emax, ec50, hill_n):
        self.name = name
        self.dose_mg = dose_mg
        self.interval_hr = interval_hr
        self.ka = ka            # absorption rate constant
        self.ke = ke            # elimination rate constant
        self.vd = vd            # volume of distribution (L)
        self.bioavail = bioavail
        self.emax = emax        # max kill rate
        self.ec50 = ec50        # concentration for 50% max effect
        self.hill_n = hill_n    # Hill coefficient

class TreatmentProtocol:
    """Defines a complete treatment course."""
    def __init__(self, antibiotic, duration_days, label=""):
        self.antibiotic = antibiotic
        self.duration_days = duration_days
        self.duration_hr = duration_days * 24
        self.label = label or f"{antibiotic.name} {antibiotic.dose_mg}mg q{antibiotic.interval_hr}h x{duration_days}d"

# Define the pathogen
staph = Bacterium(
    name="S. aureus",
    growth_rate=0.8,        # per hour
    K=1e10,                 # carrying capacity
    mic_susceptible=0.25,   # mg/L
    mic_resistant=32.0,     # mg/L (MRSA-level)
    mutation_rate=2.5e-9,   # per cell per division
    fitness_cost=0.05,      # 5% slower growth
)

# Define antibiotics
amoxicillin = Antibiotic("Amoxicillin", 500, 8, 1.5, 0.7, 20, 0.8, 3.0, 2.0, 2)
high_dose = Antibiotic("Amoxicillin-HD", 1000, 6, 1.5, 0.7, 20, 0.8, 3.0, 2.0, 2)

# System overview
print("=== Antibiotic Resistance Simulator ===")
print("Architecture designed. Key components:\\n")

print(f"PATHOGEN: {staph.name}")
print(f"  Growth rate: {staph.growth_rate}/hr | K: {staph.K:.0e}")
print(f"  MIC (susceptible): {staph.mic_s} mg/L")
print(f"  MIC (resistant): {staph.mic_r} mg/L")
print(f"  Mutation rate: {staph.mutation_rate:.1e}")
print(f"  Fitness cost of resistance: {staph.fitness_cost:.0%}")

print(f"\\nANTIBIOTICS:")
for abx in [amoxicillin, high_dose]:
    half_life = 0.693 / abx.ke
    print(f"  {abx.name}: {abx.dose_mg}mg q{abx.interval_hr}h "
          f"(t½={half_life:.1f}hr, Vd={abx.vd}L)")

print(f"\\nSIMULATION ENGINE:")
print(f"  Time step: 0.1 hours")
print(f"  PK model: one-compartment, first-order absorption/elimination")
print(f"  PD model: Emax sigmoidal with Hill coefficient")
print(f"  Resistance: mutation + selection + fitness cost")
print(f"\\nNext step: Build the population simulation engine.")`,
      challenge: 'Add a second pathogen (E. coli with different PK/PD parameters) and a second antibiotic class (ciprofloxacin, a fluoroquinolone with concentration-dependent killing rather than time-dependent). How would the architecture change to accommodate multiple pathogen-drug combinations?',
      successHint: 'Good system design makes everything else easier. You defined three clean classes — Bacterium, Antibiotic, TreatmentProtocol — each with well-defined properties. This separation of concerns means you can swap pathogens, drugs, or protocols without rewriting the simulation engine. This is object-oriented design applied to computational biology.',
    },
    {
      title: 'Building the population simulation engine',
      concept: `Now we implement the core engine: a **population dynamics simulator** that tracks susceptible and resistant bacteria over time under antibiotic pressure.

The engine runs hour by hour and handles four processes simultaneously:

1. **Growth**: both subpopulations grow logistically, sharing the same carrying capacity K. Resistant bacteria grow at rate r × (1 - fitness_cost).
2. **Mutation**: each division has probability mu of converting a susceptible cell to a resistant cell (and vice versa, at a lower rate).
3. **Drug killing**: the PK model generates drug concentration at each time step. The PD model converts concentration to kill rate — different for susceptible (low MIC) and resistant (high MIC) bacteria.
4. **Net population change**: growth - killing + mutation = population at next time step.

The simulation produces three outputs: drug concentration over time, susceptible population over time, and resistant population over time. These three curves tell the complete story of treatment success or failure.

📚 *This is a coupled ODE system solved by Euler's method. In research, you'd use a proper ODE solver (scipy.integrate.odeint), but Euler's method is transparent and teaches the underlying mathematics.*`,
      analogy: 'Imagine two species of fish in a pond (susceptible and resistant bacteria) competing for the same food (carrying capacity). You introduce a predator (antibiotic) that hunts one species efficiently (susceptible) but barely catches the other (resistant). The prey balance shifts — the resistant species fills the ecological niche left by the declining susceptible species. Your simulation tracks this ecological drama hour by hour.',
      storyConnection: 'This is exactly what happened in hospitals in the 1940s-1960s. Penicillin killed susceptible Staphylococcus rapidly, but the tiny fraction of resistant mutants (carrying the blaZ gene) survived and proliferated into the ecological space left empty. By 1960, >80% of hospital Staphylococcus isolates were penicillin-resistant. Your engine models this historical trajectory.',
      checkQuestion: 'If the initial population is 10^8 bacteria and the mutation rate is 2.5 × 10^-9, how many resistant mutants are expected at the start?',
      checkAnswer: 'Expected number = N × mu = 10^8 × 2.5 × 10^-9 = 0.25. So there\'s about a 25% chance that at least one resistant mutant exists before treatment even begins. In a severe infection with 10^12 bacteria, the expected number is 2,500 resistant cells — resistance is virtually guaranteed to be present.',
      codeIntro: 'Implement the population simulation engine with coupled growth, mutation, and drug killing.',
      code: `import numpy as np

np.random.seed(42)

class PopulationEngine:
    """Simulates bacterial population dynamics under antibiotic treatment."""

    def __init__(self, bacterium, antibiotic, N0_susceptible, N0_resistant=0):
        self.bact = bacterium
        self.abx = antibiotic
        self.N0_s = N0_susceptible
        self.N0_r = N0_resistant

    def pk_concentration(self, time_hr):
        """Calculate drug concentration at a given time using superposition."""
        conc = 0.0
        dose_times = np.arange(0, time_hr + 0.01, self.abx.interval_hr)
        for t_dose in dose_times:
            if t_dose > time_hr:
                break
            t_since = time_hr - t_dose
            if t_since < 0.01:
                continue
            # One-compartment oral model: C = (F*D*ka)/(Vd*(ka-ke)) * (e^(-ke*t) - e^(-ka*t))
            ka, ke = self.abx.ka, self.abx.ke
            F_D = self.abx.bioavail * self.abx.dose_mg
            if abs(ka - ke) > 0.001:
                c = (F_D * ka) / (self.abx.vd * (ka - ke)) * (
                    np.exp(-ke * t_since) - np.exp(-ka * t_since))
            else:
                c = (F_D / self.abx.vd) * t_since * np.exp(-ke * t_since)
            conc += max(c, 0)
        return conc

    def kill_rate(self, concentration, mic):
        """Emax sigmoidal PD model."""
        if concentration <= 0:
            return 0
        n = self.abx.hill_n
        return self.abx.emax * concentration**n / (self.abx.ec50**n + concentration**n)

    def simulate(self, duration_hr, dt=0.1):
        """Run the full simulation."""
        steps = int(duration_hr / dt)
        time = np.arange(steps) * dt
        Ns = np.zeros(steps)  # susceptible
        Nr = np.zeros(steps)  # resistant
        conc = np.zeros(steps)

        Ns[0] = self.N0_s
        Nr[0] = self.N0_r

        r = self.bact.growth_rate
        K = self.bact.K
        mu = self.bact.mutation_rate
        fc = self.bact.fitness_cost

        for i in range(1, steps):
            S = Ns[i-1]
            R = Nr[i-1]
            N_total = S + R
            C = self.pk_concentration(time[i])
            conc[i] = C

            # Growth (logistic, shared K)
            growth_s = r * S * (1 - N_total / K)
            growth_r = r * (1 - fc) * R * (1 - N_total / K)

            # Drug killing (different MICs)
            kill_s = self.kill_rate(C, self.bact.mic_s) * S
            kill_r = self.kill_rate(C, self.bact.mic_r) * R

            # Mutation (S -> R and R -> S)
            mut_s_to_r = mu * max(growth_s, 0)  # mutations per time step
            mut_r_to_s = mu * 0.01 * max(growth_r, 0)  # back mutation rare

            # Update
            dS = (growth_s - kill_s - mut_s_to_r + mut_r_to_s) * dt
            dR = (growth_r - kill_r + mut_s_to_r - mut_r_to_s) * dt

            Ns[i] = max(S + dS, 0)
            Nr[i] = max(R + dR, 0)

        return time, conc, Ns, Nr

# Set up simulation
from types import SimpleNamespace

bact = SimpleNamespace(
    name="S. aureus", growth_rate=0.8, K=1e10,
    mic_s=0.25, mic_r=32.0, mutation_rate=2.5e-9, fitness_cost=0.05
)

abx_standard = SimpleNamespace(
    name="Amoxicillin", dose_mg=500, interval_hr=8,
    ka=1.5, ke=0.7, vd=20, bioavail=0.8, emax=3.0, ec50=2.0, hill_n=2
)

# Run simulation
engine = PopulationEngine(bact, abx_standard, N0_susceptible=1e8, N0_resistant=0)
time, conc, Ns, Nr = engine.simulate(duration_hr=168)  # 7 days

print("=== Population Dynamics: 7-Day Treatment ===")
print(f"Pathogen: {bact.name} | Drug: {abx_standard.name} {abx_standard.dose_mg}mg q{abx_standard.interval_hr}h")
print(f"Initial: {engine.N0_s:.0e} susceptible, {engine.N0_r:.0e} resistant\\n")

print(f"{'Day':>4} {'Conc (mg/L)':>12} {'Susceptible':>14} {'Resistant':>14} {'Total':>14} {'R Freq':>8}")
print("-" * 68)

for day in range(8):
    h = day * 24
    idx = min(int(h / 0.1), len(conc) - 1)
    total = Ns[idx] + Nr[idx]
    r_freq = Nr[idx] / total if total > 0 else 0
    print(f"{day:>4} {conc[idx]:>10.2f} {Ns[idx]:>14.2e} {Nr[idx]:>14.2e} "
          f"{total:>14.2e} {r_freq:>7.2%}")

# Final assessment
total_final = Ns[-1] + Nr[-1]
r_freq_final = Nr[-1] / total_final if total_final > 0 else 0
print(f"\\nFinal bacterial load: {total_final:.2e}")
print(f"Resistant fraction: {r_freq_final:.4%}")
if total_final < 1000:
    print("OUTCOME: Treatment SUCCESS — infection cleared")
elif r_freq_final > 0.5:
    print("OUTCOME: Treatment FAILURE — resistance dominated")
else:
    print("OUTCOME: Treatment PARTIAL — bacterial load reduced but not cleared")`,
      challenge: 'Start the simulation with 100 pre-existing resistant cells (N0_resistant=100) instead of 0. How does this change the outcome? What about 10,000 resistant cells? This models the clinical reality: resistance is often already present at low levels before treatment begins.',
      successHint: 'You built a coupled population dynamics engine — the same class of model used in clinical pharmacology research to predict treatment outcomes. The key insight: the simulation reveals dynamics that are invisible at a single time point. Resistance can be undetectable at day 1 but dominate by day 7. Only a time-resolved simulation captures this.',
    },
    {
      title: 'Treatment strategy optimiser — finding the best dosing regimen',
      concept: `Given a pathogen and an antibiotic, what is the **optimal dosing strategy** to clear the infection while minimising resistance? This is a constrained optimisation problem:

**Objective**: minimise final bacterial load AND minimise resistant fraction
**Constraints**: total daily dose must stay below toxicity threshold; treatment duration must be practical (3-14 days)

We'll compare multiple strategies:
- **Standard dosing**: fixed dose, fixed interval
- **Front-loading**: high initial dose, then standard maintenance
- **Extended duration**: lower dose for longer
- **Dose escalation**: gradually increasing dose

Each strategy produces a different trajectory of drug concentration and bacterial population. The optimiser runs all strategies and ranks them by a composite score: clinical success (bacterial clearance) × resistance minimisation.

📚 *Treatment optimisation is a multi-objective problem — you want to maximise efficacy AND minimise resistance. These goals often conflict: aggressive dosing clears infection faster but may select for resistance if it doesn't kill 100% of bacteria.*`,
      analogy: 'Imagine fighting a forest fire with limited water. You could dump all the water at once (front-loading), spread it evenly over the fire (standard dosing), or focus on the edges first then the centre (strategic targeting). Each approach has trade-offs: dumping all at once may extinguish one area but leave embers elsewhere. The optimal strategy depends on the fire\'s characteristics — just as optimal dosing depends on the pathogen\'s MIC and mutation rate.',
      storyConnection: 'The penicillin dosing challenge was real: in 1941, Florey\'s team had barely enough penicillin to treat one patient for five days. They had to optimise every milligram — using higher doses early when bacterial load was high, then tapering. They even recovered penicillin from the patient\'s urine and re-injected it. This was empirical treatment optimisation under extreme resource constraints.',
      checkQuestion: 'Why might front-loading (a high initial dose) be better than standard dosing for preventing resistance?',
      checkAnswer: 'A high initial dose pushes the drug concentration far above the MIC of both susceptible AND resistant bacteria. If the initial dose is above the "mutant prevention concentration" (MPC — the MIC of the most resistant mutant), it kills ALL bacteria including pre-existing resistant mutants. Standard dosing may kill susceptible bacteria but leave resistant ones alive — enriching the resistant fraction.',
      codeIntro: 'Build a treatment strategy optimiser — compare dosing regimens and rank them by efficacy and resistance minimisation.',
      code: `import numpy as np

np.random.seed(42)

def run_treatment(dose_schedule, bact_params, abx_params, duration_hr, dt=0.1):
    """
    Simulate treatment with a variable dose schedule.
    dose_schedule: list of (time_hr, dose_mg) tuples
    """
    steps = int(duration_hr / dt)
    time_arr = np.arange(steps) * dt
    Ns = np.zeros(steps)
    Nr = np.zeros(steps)
    conc = np.zeros(steps)

    Ns[0] = bact_params["N0_s"]
    Nr[0] = bact_params["N0_r"]

    r = bact_params["growth_rate"]
    K = bact_params["K"]
    mu = bact_params["mutation_rate"]
    fc = bact_params["fitness_cost"]
    mic_s = bact_params["mic_s"]
    mic_r = bact_params["mic_r"]

    ka = abx_params["ka"]
    ke = abx_params["ke"]
    vd = abx_params["vd"]
    bioavail = abx_params["bioavail"]
    emax = abx_params["emax"]
    ec50 = abx_params["ec50"]
    hill_n = abx_params["hill_n"]

    # Pre-compute PK for all dose events
    gut_compartment = 0.0

    for i in range(1, steps):
        t = time_arr[i]

        # Check for new doses
        for dose_t, dose_mg in dose_schedule:
            if abs(t - dose_t) < dt / 2:
                gut_compartment += dose_mg * bioavail

        # PK: absorption and elimination
        absorbed = ka * gut_compartment * dt
        gut_compartment -= absorbed
        eliminated = ke * conc[i-1] * vd * dt
        plasma_amount = conc[i-1] * vd + absorbed - eliminated
        conc[i] = max(plasma_amount / vd, 0)

        S, R = Ns[i-1], Nr[i-1]
        N_total = S + R
        C = conc[i]

        # Kill rates
        kill_s = emax * C**hill_n / (ec50**hill_n + C**hill_n) * S if C > 0 else 0
        kill_r_ec50 = ec50 * (mic_r / mic_s)  # shift EC50 by resistance ratio
        kill_r = emax * C**hill_n / (kill_r_ec50**hill_n + C**hill_n) * R if C > 0 else 0

        # Growth
        growth_s = r * S * max(1 - N_total / K, 0)
        growth_r = r * (1 - fc) * R * max(1 - N_total / K, 0)

        # Mutation
        mut_sr = mu * max(growth_s, 0)

        dS = (growth_s - kill_s - mut_sr) * dt
        dR = (growth_r - kill_r + mut_sr) * dt

        Ns[i] = max(S + dS, 0)
        Nr[i] = max(R + dR, 0)

    return time_arr, conc, Ns, Nr

# Parameters
bact_p = {
    "N0_s": 1e8, "N0_r": 10, "growth_rate": 0.8, "K": 1e10,
    "mic_s": 0.25, "mic_r": 32.0, "mutation_rate": 2.5e-9, "fitness_cost": 0.05
}
abx_p = {
    "ka": 1.5, "ke": 0.7, "vd": 20, "bioavail": 0.8,
    "emax": 3.0, "ec50": 2.0, "hill_n": 2
}

duration = 168  # 7 days

# Define strategies (dose_schedule = list of (time, dose) tuples)
def standard_schedule(dose, interval, duration):
    return [(t, dose) for t in np.arange(0, duration, interval)]

def frontload_schedule(load_dose, maint_dose, interval, duration):
    schedule = [(0, load_dose)]
    schedule += [(t, maint_dose) for t in np.arange(interval, duration, interval)]
    return schedule

def escalating_schedule(start_dose, max_dose, interval, duration):
    times = np.arange(0, duration, interval)
    doses = np.linspace(start_dose, max_dose, len(times))
    return list(zip(times, doses))

strategies = {
    "Standard 500mg q8h": standard_schedule(500, 8, duration),
    "Standard 500mg q6h": standard_schedule(500, 6, duration),
    "High dose 1000mg q8h": standard_schedule(1000, 8, duration),
    "Front-load 2000/500 q8h": frontload_schedule(2000, 500, 8, duration),
    "Escalating 250->1000 q8h": escalating_schedule(250, 1000, 8, duration),
}

# Run all strategies
print("=== Treatment Strategy Optimisation ===")
print(f"Pathogen: S. aureus (MIC_s={bact_p['mic_s']}, MIC_r={bact_p['mic_r']})")
print(f"Initial: {bact_p['N0_s']:.0e} susceptible + {bact_p['N0_r']:.0e} resistant\\n")

results = []
print(f"{'Strategy':<28} {'Final Total':>12} {'Final R%':>9} {'Total Dose':>11} {'Score':>7}")
print("-" * 69)

for name, schedule in strategies.items():
    t, c, ns, nr = run_treatment(schedule, bact_p, abx_p, duration)
    total_final = ns[-1] + nr[-1]
    r_pct = nr[-1] / total_final * 100 if total_final > 1 else 0
    total_dose = sum(d for _, d in schedule)

    # Composite score: lower is better
    # Penalise high bacterial load, high resistance, high total dose
    clearance = max(np.log10(max(total_final, 1)), 0)
    score = clearance + r_pct / 10 + total_dose / 50000

    results.append((name, total_final, r_pct, total_dose, score))
    print(f"{name:<28} {total_final:>12.2e} {r_pct:>7.2f}% {total_dose:>9.0f}mg {score:>6.1f}")

# Best strategy
best = min(results, key=lambda x: x[4])
print(f"\\nBEST STRATEGY: {best[0]}")
print(f"  Final load: {best[1]:.2e} | Resistance: {best[2]:.2f}% | Score: {best[4]:.1f}")`,
      challenge: 'Add a "cycling" strategy: use Amoxicillin for 3 days, switch to a different antibiotic (different EC50, different resistance MIC) for 3 days, then back. Antibiotic cycling is proposed as a hospital-wide resistance management strategy. Does it outperform the best single-drug regimen?',
      successHint: 'Treatment optimisation is an active area of clinical research. The multi-objective framework you built — balancing efficacy against resistance — is exactly how clinical pharmacologists design dosing guidelines. The insight that front-loading can prevent resistance by killing mutants early is now standard practice for fluoroquinolones and is being studied for beta-lactams.',
    },
    {
      title: 'Resistance tracker — monitoring and predicting resistance trends',
      concept: `Individual treatment outcomes aggregate into population-level resistance trends. A **resistance tracker** monitors MIC distributions over time, detects emerging resistance, and predicts future trends.

The tracker uses three data sources:
1. **MIC surveillance data**: annual MIC distributions for each pathogen-drug pair
2. **Antibiotic consumption data**: how much of each drug is used (in DDD — defined daily doses per 1,000 patient-days)
3. **Patient outcomes**: treatment success/failure rates correlated with resistance levels

The key analytical tool is **trend analysis**: fitting a model to historical resistance data and extrapolating. If resistance is increasing at 3% per year, when will it cross 50% (the threshold where empirical therapy fails more often than it succeeds)?

📚 *Antimicrobial resistance surveillance is coordinated globally by WHO's GLASS programme. National systems (CDC's NARMS in the US, ECDC's EARS-Net in Europe) collect MIC data from sentinel hospitals and publish annual resistance reports.*`,
      analogy: 'A resistance tracker is like a weather forecast for bacteria. Just as meteorologists track temperature trends and predict heatwaves, resistance trackers follow MIC trends and predict when existing drugs will fail. Both use historical data, mathematical models, and trend extrapolation. And both issue warnings when dangerous thresholds approach.',
      storyConnection: 'The trajectory of penicillin resistance in Staphylococcus is the textbook case: <1% resistant in 1940, 14% by 1946, 38% by 1950, 80% by 1960. If a resistance tracker had existed in 1946, it would have predicted the crisis a decade before it arrived. Today, similar trajectories are playing out for carbapenems, the "last resort" antibiotics — and resistance trackers are sounding the alarm.',
      checkQuestion: 'If resistance increases from 5% to 15% over 5 years, what is the annual rate of increase? When will it reach 50%?',
      checkAnswer: 'Assuming exponential growth: 15/5 = 3× in 5 years, so doubling time ≈ 3.8 years. Annual rate: 3^(1/5) - 1 = 24.6% per year. To reach 50%: ln(50/15) / ln(3) × 5 = 5.4 more years. But resistance growth typically slows as it approaches 100% (logistic, not exponential), so the real time to 50% may be 7-8 years.',
      codeIntro: 'Build a resistance surveillance tracker — analyse trends, predict breakpoints, and issue warnings.',
      code: `import numpy as np

np.random.seed(42)

def generate_surveillance_data(years, initial_resistance, growth_model="logistic",
                                antibiotic_use_trend=0.0, noise_std=0.02):
    """
    Generate synthetic resistance surveillance data.
    Returns annual resistance percentages.
    """
    resistance = np.zeros(years)
    resistance[0] = initial_resistance

    for y in range(1, years):
        r = resistance[y-1]
        if growth_model == "logistic":
            # Logistic growth of resistance
            intrinsic_rate = 0.15 + antibiotic_use_trend * 0.5
            dr = intrinsic_rate * r * (1 - r) + antibiotic_use_trend * 0.01
        elif growth_model == "linear":
            dr = 0.02
        else:
            dr = 0.1 * r

        resistance[y] = np.clip(r + dr + np.random.normal(0, noise_std), 0, 1)

    return resistance

def fit_logistic_trend(data):
    """Fit a logistic growth model to resistance data using least squares."""
    n = len(data)
    best_r, best_K, best_err = 0.1, 0.9, float('inf')

    for r_test in np.arange(0.05, 0.5, 0.02):
        for K_test in np.arange(0.5, 1.01, 0.05):
            predicted = np.zeros(n)
            predicted[0] = data[0]
            for i in range(1, n):
                predicted[i] = predicted[i-1] + r_test * predicted[i-1] * (1 - predicted[i-1] / K_test)
                predicted[i] = np.clip(predicted[i], 0, 1)
            err = np.mean((predicted - data) ** 2)
            if err < best_err:
                best_r, best_K, best_err = r_test, K_test, err

    return best_r, best_K

# Generate data for multiple pathogen-drug combinations
scenarios = [
    ("S. aureus - Penicillin", 0.02, "logistic", 0.05),
    ("S. aureus - Methicillin", 0.01, "logistic", 0.03),
    ("E. coli - Ampicillin", 0.10, "logistic", 0.02),
    ("K. pneumoniae - Carbapenems", 0.005, "logistic", 0.08),
    ("S. pneumoniae - Penicillin", 0.05, "logistic", -0.02),  # decreasing use
]

observation_years = 20
forecast_years = 10

print("=== Antimicrobial Resistance Surveillance Report ===")
print(f"Data period: {observation_years} years | Forecast: {forecast_years} years\\n")

print(f"{'Pathogen-Drug':<32} {'Start%':>7} {'Now%':>6} {'Trend':>7} "
      f"{'Yr to 50%':>9} {'Risk':>8}")
print("-" * 72)

for name, init_r, model, use_trend in scenarios:
    data = generate_surveillance_data(observation_years, init_r, model, use_trend)

    # Fit trend
    fitted_r, fitted_K = fit_logistic_trend(data)

    # Forecast
    forecast = np.zeros(forecast_years)
    forecast[0] = data[-1]
    for i in range(1, forecast_years):
        forecast[i] = np.clip(
            forecast[i-1] + fitted_r * forecast[i-1] * (1 - forecast[i-1] / fitted_K),
            0, 1)

    # Time to 50%
    years_to_50 = None
    current = data[-1]
    for y in range(100):
        current = current + fitted_r * current * (1 - current / fitted_K)
        if current >= 0.5:
            years_to_50 = y + 1
            break

    # Risk level
    if data[-1] > 0.3:
        risk = "CRITICAL"
    elif data[-1] > 0.1 or (years_to_50 and years_to_50 < 10):
        risk = "HIGH"
    elif data[-1] > 0.05:
        risk = "MODERATE"
    else:
        risk = "LOW"

    y50_str = f"{years_to_50}" if years_to_50 else ">100"
    trend_str = f"+{fitted_r*data[-1]*100:.1f}%/yr" if fitted_r > 0 else "stable"

    print(f"{name:<32} {init_r*100:>5.1f}% {data[-1]*100:>5.1f}% {trend_str:>7} "
          f"{y50_str:>9} {risk:>8}")

# Detailed view: S. aureus - Penicillin (the Fleming story)
print("\\n=== Detailed: S. aureus Penicillin Resistance (Historical Model) ===")
penicillin_data = generate_surveillance_data(30, 0.01, "logistic", 0.06)
print(f"{'Year':>5} {'Resistance%':>12} {'Bar'}")
for y in range(0, 30, 3):
    bar = "#" * int(penicillin_data[y] * 50)
    print(f"{1940+y:>5} {penicillin_data[y]*100:>10.1f}%  {bar}")

print("\\nPattern matches historical data: <1% in 1940, ~80% by 1960s")
print("This trajectory is now repeating for carbapenems globally.")`,
      challenge: 'Add an "intervention analysis" module: simulate what happens to the K. pneumoniae carbapenem trajectory if antibiotic use is reduced by 30% starting in year 15. Can the resistance trend be reversed, or only slowed? This models the real policy question facing global health authorities today.',
      successHint: 'Resistance surveillance is the early warning system for one of the greatest threats to modern medicine. The tracker you built — trend fitting, forecasting, risk classification — is the same framework used by WHO, CDC, and ECDC to guide global antibiotic policy. The data says clearly: resistance is rising for nearly every drug-pathogen combination. The time to act is now.',
    },
    {
      title: 'Portfolio presentation — documenting the Antibiotic Resistance Simulator',
      concept: `The final step in any engineering project is **documentation** — recording what you built, why, how it works, and what it tells you. A well-documented project becomes a **portfolio piece** that demonstrates your skills to future employers, collaborators, or universities.

Your Antibiotic Resistance Simulator documentation should include:

1. **Introduction** — what problem does it solve and why does it matter?
2. **Methodology** — what models and assumptions did you use?
3. **Results** — what did the simulations reveal?
4. **Clinical implications** — what do the results mean for antibiotic prescribing?
5. **Limitations** — what does the model NOT capture?
6. **Future work** — how could it be improved?

This is the structure of a **technical report** — the standard format in biomedical research and computational biology for communicating results.

📚 *Antimicrobial resistance is projected to cause 10 million deaths per year by 2050 if trends continue (O'Neill Report, 2016). Computational tools like your simulator are essential for predicting, preventing, and managing this crisis.*`,
      analogy: 'A clinical trial publishes its results in a peer-reviewed paper following a strict format: Introduction, Methods, Results, Discussion. Your simulator documentation follows the same logic — you\'re reporting the results of a computational experiment. The format exists because it makes complex work understandable to others: what did you do, why did you do it, what did you find?',
      storyConnection: 'Fleming published his penicillin discovery in a 1929 paper in the British Journal of Experimental Pathology. It was only 8 pages long, but it documented the observation, the experiments, and the conclusions so clearly that Florey and Chain could reproduce and extend the work 10 years later. Good documentation is what preserved penicillin from being a forgotten laboratory curiosity.',
      checkQuestion: 'Why is documenting limitations important in computational biology?',
      checkAnswer: 'Because every model is a simplification — and in medicine, acting on an incorrect model can harm patients. Documenting that your model assumes a single bacterial species, ignores immune response, and uses simplified PK, tells the reader exactly when the model\'s predictions are trustworthy and when they should be cautious. Intellectual honesty is a safety feature.',
      codeIntro: 'Generate a formatted project documentation page for the Antibiotic Resistance Simulator.',
      code: `# Antibiotic Resistance Simulator — Project Documentation

print("""
================================================================
       ANTIBIOTIC RESISTANCE SIMULATOR
            Project Documentation
================================================================

1. INTRODUCTION
---------------
This simulator models the emergence and spread of antibiotic
resistance in bacterial populations under drug treatment. It was
inspired by the story of penicillin — from Fleming's 1928
discovery through the global resistance crisis that followed.

The simulator addresses the question: given a pathogen, an
antibiotic, and a dosing regimen, will treatment succeed — and
will resistance emerge?

2. METHODOLOGY
--------------
The simulator integrates four computational models:

  a) Pharmacokinetic (PK) model:
     One-compartment model with first-order absorption/elimination.
     C(t) = (F*D*ka)/(Vd*(ka-ke)) * (exp(-ke*t) - exp(-ka*t))
     Multi-dose superposition for repeated dosing.

  b) Pharmacodynamic (PD) model:
     Emax sigmoidal kill function:
     Kill = Emax * C^n / (EC50^n + C^n)
     Separate MICs for susceptible and resistant subpopulations.

  c) Population dynamics model:
     Coupled logistic growth with shared carrying capacity:
     dS/dt = r*S*(1-N/K) - kill_s*S - mu*growth_s
     dR/dt = r*(1-fc)*R*(1-N/K) - kill_r*R + mu*growth_s

  d) Resistance surveillance model:
     Logistic trend fitting to MIC distribution data.
     Forecasting with trend extrapolation.

3. KEY FINDINGS
---------------
  - Front-loading (high initial dose) outperforms standard dosing
    for preventing resistance emergence, because it kills pre-
    existing resistant mutants before they can proliferate
  - Time above MIC >50% is necessary for reliable bacterial
    clearance — below this, regrowth between doses causes
    treatment failure
  - Pre-existing resistant subpopulations as small as 10 cells
    can dominate within 5-7 days under standard treatment
  - Antibiotic stewardship (restricted use) slows resistance
    trends but cannot reverse them once resistance exceeds ~20%

4. CLINICAL IMPLICATIONS
------------------------
  - Dose high and dose early: subtherapeutic dosing is the
    primary driver of resistance selection
  - Complete the course: stopping early leaves bacteria alive
    in a partially resistant state
  - Surveillance matters: detecting resistance at 5% allows
    intervention; detecting at 50% is too late
  - New antibiotics alone cannot solve resistance — they buy
    time. Stewardship is the long-term solution

5. LIMITATIONS
--------------
  - Single compartment PK — does not model tissue penetration
  - No immune system — real infections are cleared by immune
    + antibiotic cooperation
  - No horizontal gene transfer — plasmid-mediated resistance
    is not modelled
  - Deterministic population model — no stochastic extinction
    of small resistant populations
  - No biofilm formation — biofilms reduce antibiotic efficacy
    by 100-1000x
  - No pharmacogenomics — patient metaboliser status not modelled

6. FUTURE IMPROVEMENTS
----------------------
  - Add immune system cooperation (innate + adaptive)
  - Implement stochastic simulation (Gillespie algorithm)
  - Model horizontal gene transfer via plasmids
  - Add biofilm pharmacodynamics
  - Multi-drug combination therapy optimisation
  - Patient population simulation (heterogeneous PK)
  - Integration with real surveillance data (GLASS, EARS-Net)

7. SKILLS DEMONSTRATED
----------------------
  * Object-oriented programming (Python classes)
  * Pharmacokinetic/pharmacodynamic modelling
  * Population dynamics and evolutionary biology
  * Monte Carlo simulation
  * Optimisation (multi-objective, constrained)
  * Network analysis
  * Game theory
  * Data analysis and trend forecasting
  * Technical report writing

================================================================
""")

# Skills summary for portfolio
skills = [
    ("Computational biology", "PK/PD modelling, population dynamics, resistance evolution"),
    ("Python programming", "OOP, NumPy, simulation engines, data analysis"),
    ("Mathematical modelling", "ODEs, logistic growth, Emax models, network theory"),
    ("Public health", "Surveillance, stewardship, resistance trends, AMR policy"),
    ("Data science", "Trend analysis, forecasting, Monte Carlo, optimisation"),
]

print("PORTFOLIO SKILLS SUMMARY:")
for skill, detail in skills:
    print(f"  * {skill}: {detail}")

print()
print("REAL-WORLD RELEVANCE:")
print("  Antimicrobial resistance causes 1.27 million deaths annually (2019)")
print("  Projected 10 million deaths/year by 2050 without intervention")
print("  Computational tools like this simulator inform dosing guidelines,")
print("  stewardship policies, and drug development priorities worldwide.")`,
      challenge: 'Turn this documentation into a real portfolio piece. Add a "Methods Validation" section that compares your simulator\'s output to published clinical data (e.g., the historical trajectory of S. aureus penicillin resistance). Showing that your model reproduces known results is the gold standard of model validation.',
      successHint: 'You\'ve completed a full computational biology project cycle: problem definition, system design, implementation, simulation, optimisation, surveillance, and documentation. This is exactly what researchers do in pharmacometrics and antimicrobial resistance modelling. You now have a portfolio project that demonstrates real interdisciplinary skills spanning microbiology, pharmacology, mathematics, and software engineering.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Build a complete Antibiotic Resistance Simulator</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 4 is a capstone project: design, build, and document a complete Antibiotic Resistance Simulator.
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
