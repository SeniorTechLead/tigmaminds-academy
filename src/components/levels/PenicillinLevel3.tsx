import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function PenicillinLevel3() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Stochastic SIR model with individual variation',
      concept: `The classic SIR model (Susceptible-Infected-Recovered) treats populations as continuous flows. But real epidemics are **stochastic** — each infection event is a random encounter between a specific susceptible person and a specific infected person. In small populations (a hospital ward, a school), this randomness matters enormously.

The **stochastic SIR model** replaces the smooth differential equations with **random events**. At each time step, the number of new infections is drawn from a binomial distribution: each susceptible person has a probability beta × I/N of becoming infected. Each infected person has a probability gamma of recovering.

We add **individual variation** by giving each person a different susceptibility (some are immunocompromised, some are healthy) and each infected person a different infectiousness (superspreaders vs low shedders). This heterogeneity dramatically changes outbreak dynamics — a few superspreaders can drive an epidemic that would otherwise die out.

📚 *Stochastic models are essential for small populations because the "law of large numbers" doesn't apply. In a ward of 30 patients, one random event (a superspreader admission) can change the entire outbreak trajectory.*`,
      analogy: 'The deterministic SIR model is like predicting a coin-flip average over 10,000 flips — reliably 50%. The stochastic model is like predicting the next 10 flips — wildly variable. In a large city, the deterministic model works well. In a hospital ward with 20 patients, you need the stochastic version because every individual event matters.',
      storyConnection: 'Before penicillin, hospital-acquired Staphylococcus infections spread through wards via stochastic person-to-person transmission. A single colonised nurse could infect multiple patients (superspreader). Penicillin didn\'t just cure individuals — it reduced the infectious pool, lowering the probability of transmission events and breaking outbreak chains.',
      checkQuestion: 'In a ward of 20 patients, 1 is infected and beta = 0.3 per day. What is the expected number of new infections on day 1?',
      checkAnswer: 'Each of the 19 susceptible patients has probability beta × I/N = 0.3 × 1/20 = 0.015 of being infected. Expected new infections = 19 × 0.015 = 0.285. So most likely zero new infections on day 1 — but there\'s a ~25% chance of at least one. This is why stochastic models matter: the deterministic model says 0.285 infections (meaningless), the stochastic model says "probably 0, maybe 1."',
      codeIntro: 'Build a stochastic SIR model with individual variation in susceptibility and infectiousness.',
      code: `import numpy as np

np.random.seed(42)

def stochastic_sir(N, I0, beta, gamma, days, n_runs=100,
                   susceptibility_var=0.0, infectiousness_var=0.0):
    """
    Stochastic SIR model with individual heterogeneity.
    susceptibility_var: variance in individual susceptibility (0 = homogeneous)
    infectiousness_var: variance in individual infectiousness (0 = homogeneous)
    """
    all_runs = []

    for run in range(n_runs):
        # Individual properties
        suscept = np.clip(np.random.normal(1.0, susceptibility_var, N), 0.1, 3.0)
        infect = np.clip(np.random.normal(1.0, infectiousness_var, N), 0.1, 5.0)

        # State: 0=S, 1=I, 2=R
        state = np.zeros(N, dtype=int)
        initial_infected = np.random.choice(N, I0, replace=False)
        state[initial_infected] = 1

        S_t, I_t, R_t = [N - I0], [I0], [0]

        for day in range(days):
            new_state = state.copy()
            infected_idx = np.where(state == 1)[0]
            suscept_idx = np.where(state == 0)[0]

            # Total force of infection
            total_infectiousness = np.sum(infect[infected_idx]) if len(infected_idx) > 0 else 0
            force = beta * total_infectiousness / N

            # New infections (each susceptible has individual probability)
            for s in suscept_idx:
                prob = 1 - np.exp(-force * suscept[s])
                if np.random.random() < prob:
                    new_state[s] = 1

            # Recoveries
            for inf in infected_idx:
                if np.random.random() < gamma:
                    new_state[inf] = 2

            state = new_state
            S_t.append(np.sum(state == 0))
            I_t.append(np.sum(state == 1))
            R_t.append(np.sum(state == 2))

        all_runs.append({"S": S_t, "I": I_t, "R": R_t,
                         "peak_I": max(I_t), "total_infected": R_t[-1] + I_t[-1]})

    return all_runs

# Hospital ward scenario
N = 30
I0 = 1
beta = 0.4
gamma = 0.1  # ~10 day infection duration

print("=== Stochastic SIR: Hospital Ward (N=30) ===")
print(f"beta={beta}, gamma={gamma}, R0={beta/gamma:.1f}\\n")

# Homogeneous population
runs_homo = stochastic_sir(N, I0, beta, gamma, 60, n_runs=50)
peaks_homo = [r["peak_I"] for r in runs_homo]
totals_homo = [r["total_infected"] for r in runs_homo]

print("--- Homogeneous Population ---")
print(f"Median peak infected: {np.median(peaks_homo):.0f}")
print(f"Median total infected: {np.median(totals_homo):.0f}")
print(f"Outbreaks that fizzled (<5 total): {sum(1 for t in totals_homo if t < 5)}/{len(totals_homo)}")

# Heterogeneous (superspreaders)
runs_hetero = stochastic_sir(N, I0, beta, gamma, 60, n_runs=50,
                              susceptibility_var=0.5, infectiousness_var=1.0)
peaks_hetero = [r["peak_I"] for r in runs_hetero]
totals_hetero = [r["total_infected"] for r in runs_hetero]

print("\\n--- Heterogeneous (Superspreaders) ---")
print(f"Median peak infected: {np.median(peaks_hetero):.0f}")
print(f"Median total infected: {np.median(totals_hetero):.0f}")
print(f"Outbreaks that fizzled (<5 total): {sum(1 for t in totals_hetero if t < 5)}/{len(totals_hetero)}")

# Show one sample trajectory
sample = runs_hetero[0]
print(f"\\n--- Sample Trajectory (heterogeneous) ---")
print(f"{'Day':>4} {'S':>4} {'I':>4} {'R':>4}")
for d in range(0, 61, 5):
    print(f"{d:>4} {sample['S'][d]:>4} {sample['I'][d]:>4} {sample['R'][d]:>4}")`,
      challenge: 'Add an "antibiotic intervention" parameter: on day 10, infected patients receive penicillin, which reduces their infection duration from 10 days to 3 days (gamma changes from 0.1 to 0.33 for treated patients). How much does early treatment reduce the total outbreak size?',
      successHint: 'Stochastic SIR models are the standard tool for modelling hospital outbreaks, including MRSA. The key insight: heterogeneity (superspreaders, variable susceptibility) creates outcomes that deterministic models miss entirely. This is why infection control focuses on identifying and isolating high-risk individuals rather than treating everyone identically.',
    },
    {
      title: 'Game theory of antibiotic stewardship — the tragedy of the commons',
      concept: `Every time a doctor prescribes an antibiotic, they face a dilemma. For **this patient**, the antibiotic helps — it clears the infection. But across **all patients**, overuse drives resistance, making the antibiotic less effective for future patients.

This is the **tragedy of the commons** — each individual acts rationally for themselves, but the collective outcome is catastrophic. The "commons" here is antibiotic effectiveness — a shared resource that is depleted by use.

**Game theory** formalises this dilemma. Two hospitals (players) each choose a strategy: **Stewardship** (restrict antibiotic use, accept slightly worse short-term outcomes) or **Overuse** (prescribe freely, maximise immediate patient outcomes). The payoff matrix shows that Overuse is individually rational but collectively devastating — a **Nash equilibrium** trap.

The solution requires **mechanism design** — changing the game's rules so that the individually rational choice aligns with the collective good. This includes: antibiotic cycling, restriction policies, and financial incentives for stewardship.

📚 *A Nash equilibrium is a state where no player can improve their outcome by changing strategy alone. In the antibiotic commons, the Nash equilibrium is mutual overuse — even though mutual stewardship would be better for everyone.*`,
      analogy: 'Imagine a shared grazing field. Each farmer benefits from adding more cattle — more milk, more profit. But if every farmer adds cattle, the field is overgrazed and ALL cattle starve. Each farmer\'s rational individual choice (add cattle) leads to collective ruin. Antibiotics work the same way: each prescription is another cow on the commons.',
      storyConnection: 'Fleming predicted this exact problem in his 1945 Nobel lecture: "The time may come when penicillin can be bought by anyone in the shops. Then there is the danger that the ignorant man may easily underdose himself and, by exposing his microbes to non-lethal quantities of the drug, make them resistant." He described the tragedy of the commons 23 years before Garrett Hardin coined the term.',
      checkQuestion: 'Hospital A practises stewardship but Hospital B overuses. Resistant bacteria from B spread to A\'s patients. What happens to A\'s outcomes?',
      checkAnswer: 'A\'s stewardship is undermined — they face resistant infections without having caused them. This is the "free rider" problem: B gets the benefits of aggressive treatment while A bears the resistance cost. This is why antibiotic stewardship must be coordinated across institutions — unilateral action is penalised.',
      codeIntro: 'Model the antibiotic stewardship dilemma using game theory — payoff matrices, Nash equilibria, and iterated games.',
      code: `import numpy as np

np.random.seed(42)

def antibiotic_game(n_rounds, strategy_A, strategy_B, resistance_rate=0.02):
    """
    Iterated antibiotic stewardship game between two hospitals.
    Each round: hospitals choose Steward (S) or Overuse (O).
    Resistance accumulates and affects future payoffs.
    """
    resistance = 0.05  # baseline resistance rate
    history_A, history_B = [], []
    payoffs_A, payoffs_B = [], []
    resistance_history = [resistance]

    # Payoff matrix (per round, before resistance penalty)
    # Payoffs: (A_payoff, B_payoff)
    payoff_matrix = {
        ("S", "S"): (8, 8),    # both steward: good long-term, moderate short-term
        ("S", "O"): (5, 10),   # A stewards, B overuses: A loses, B gains
        ("O", "S"): (10, 5),   # A overuses, B stewards
        ("O", "O"): (7, 7),    # both overuse: decent short-term
    }

    for round_num in range(n_rounds):
        # Get strategies
        a = strategy_A(history_A, history_B, resistance)
        b = strategy_B(history_B, history_A, resistance)

        # Base payoffs
        base_a, base_b = payoff_matrix[(a, b)]

        # Resistance penalty (increases over time with overuse)
        penalty = resistance * 30  # resistance makes treatments fail
        actual_a = base_a - penalty
        actual_b = base_b - penalty

        # Update resistance
        if a == "O":
            resistance += resistance_rate * (1 - resistance)
        if b == "O":
            resistance += resistance_rate * (1 - resistance)
        # Small natural decline
        resistance *= 0.995

        history_A.append(a)
        history_B.append(b)
        payoffs_A.append(actual_a)
        payoffs_B.append(actual_b)
        resistance_history.append(resistance)

    return payoffs_A, payoffs_B, resistance_history, history_A, history_B

# Strategy definitions
def always_steward(my_hist, opp_hist, resistance):
    return "S"

def always_overuse(my_hist, opp_hist, resistance):
    return "O"

def tit_for_tat(my_hist, opp_hist, resistance):
    """Copy opponent's last move. Start with stewardship."""
    if not opp_hist:
        return "S"
    return opp_hist[-1]

def resistance_aware(my_hist, opp_hist, resistance):
    """Overuse when resistance is low, steward when high."""
    return "O" if resistance < 0.15 else "S"

# Run tournaments
strategies = [
    ("Always Steward", always_steward),
    ("Always Overuse", always_overuse),
    ("Tit-for-Tat", tit_for_tat),
    ("Resistance-Aware", resistance_aware),
]

n_rounds = 100
print("=== Antibiotic Stewardship Game Theory ===")
print(f"{n_rounds} rounds per matchup\\n")

print(f"{'Match':<40} {'A Total':>8} {'B Total':>8} {'Final R%':>9}")
print("-" * 67)

for i, (name_a, strat_a) in enumerate(strategies):
    for j, (name_b, strat_b) in enumerate(strategies):
        if j < i:
            continue
        pa, pb, res, _, _ = antibiotic_game(n_rounds, strat_a, strat_b)
        match_name = f"{name_a} vs {name_b}"
        print(f"{match_name:<40} {sum(pa):>7.0f} {sum(pb):>7.0f} {res[-1]*100:>7.1f}%")

# Detailed look at the key matchup
print("\\n=== Detailed: Tit-for-Tat vs Resistance-Aware ===")
pa, pb, res, ha, hb = antibiotic_game(n_rounds, tit_for_tat, resistance_aware)
print(f"{'Round':>6} {'A':>4} {'B':>4} {'A Pay':>7} {'B Pay':>7} {'Resist%':>8}")
for r in [0, 10, 20, 30, 50, 70, 90, 99]:
    print(f"{r:>6} {ha[r]:>4} {hb[r]:>4} {pa[r]:>6.1f} {pb[r]:>6.1f} {res[r]*100:>7.1f}%")

print(f"\\nTotal A: {sum(pa):.0f} | Total B: {sum(pb):.0f}")
print(f"Lesson: cooperation (mutual stewardship) beats defection long-term")`,
      challenge: 'Add a "policy" mechanism: if resistance exceeds 20%, both hospitals are forced to steward for the next 10 rounds (regulatory intervention). How does this external constraint change outcomes? This models real-world antibiotic restriction policies imposed by public health authorities.',
      successHint: 'The antibiotic stewardship game is a real-world tragedy of the commons playing out in hospitals globally. Game theory doesn\'t just describe the problem — it identifies solutions: mechanism design, repeated interactions, and reputation effects can shift the Nash equilibrium from mutual defection to mutual cooperation. This is active research in health economics.',
    },
    {
      title: 'Bioreactor scale-up engineering — from flask to factory',
      concept: `Fleming\'s Penicillium mould produced micrograms of penicillin. Treating one patient required litres of dilute broth. The challenge that won the war wasn\'t discovering penicillin — it was **scaling up production** from laboratory flasks to industrial bioreactors.

Scale-up is governed by **dimensional analysis** and **similarity principles**. A lab flask (1 litre) and a factory bioreactor (100,000 litres) must maintain the same:

- **Oxygen transfer rate (OTR)**: penicillin-producing fungi need oxygen. OTR depends on agitation speed, bubble size, and the volumetric mass transfer coefficient **kLa**.
- **Mixing time**: nutrients and oxygen must reach every cell. Mixing time increases with reactor volume — a 100,000 L reactor takes minutes to mix, not seconds.
- **Shear stress**: agitation provides oxygen and mixing, but too much shear kills the fungal hyphae. The balance between oxygen supply and shear damage is the central engineering challenge.

The key scaling relationship: if you keep the **power per unit volume (P/V)** constant during scale-up, oxygen transfer is roughly maintained — but mixing time increases as V^(2/3).

📚 *Scale-up is the most common reason drugs fail between lab and market. A process that works at 1 litre often fails at 10,000 litres because physical parameters (mixing, heat transfer, oxygen supply) don't scale linearly.*`,
      analogy: 'Stirring a cup of tea is easy — one quick swirl mixes everything. Now imagine stirring a swimming pool with a giant spoon. You\'d need enormous power, and the far corners would still be poorly mixed. That\'s the scale-up problem: what works at small scale fails at large scale because mixing, heat transfer, and mass transfer don\'t scale linearly with volume.',
      storyConnection: 'The US government\'s wartime penicillin programme (1943-1945) was the largest biotechnology scale-up in history. Pfizer pioneered deep-tank fermentation — 75,000 L bioreactors that produced enough penicillin for D-Day. The engineering challenge was maintaining oxygen supply to the fungus at massive scale. Too little oxygen = no penicillin. Too much agitation = dead fungus.',
      checkQuestion: 'A lab flask produces 50 mg/L of penicillin. A factory reactor at the same concentration would need 100,000 L. How much penicillin is that?',
      checkAnswer: '50 mg/L × 100,000 L = 5,000,000 mg = 5 kg per batch. A typical treatment course requires about 10 g of penicillin, so one batch treats 500 patients. During WWII, Pfizer\'s reactors ran continuously, producing enough for millions of doses per month — the difference between a laboratory curiosity and a war-winning medicine.',
      codeIntro: 'Model bioreactor scale-up — calculate how oxygen transfer, mixing, and shear change with reactor volume.',
      code: `import numpy as np

def bioreactor_parameters(volume_L, P_per_V=2000, vessel_type="stirred_tank"):
    """
    Calculate bioreactor parameters for a given volume.
    P_per_V: power input per unit volume (W/m³) — kept constant during scale-up
    """
    V_m3 = volume_L / 1000  # convert to m³

    # Vessel geometry (standard proportions)
    D_tank = (4 * V_m3 / (np.pi * 3)) ** (1/3)  # diameter (H/D = 3)
    H_tank = 3 * D_tank
    D_impeller = D_tank / 3

    # Power
    P_total = P_per_V * V_m3  # total power (W)

    # Impeller tip speed (shear indicator)
    # P = Np × rho × N³ × D⁵ (power number equation)
    # Assume Np = 5 (Rushton turbine), rho = 1000 kg/m³
    Np = 5.0
    rho = 1000
    N_rps = (P_total / (Np * rho * D_impeller**5)) ** (1/3)  # revolutions per second
    tip_speed = np.pi * D_impeller * N_rps  # m/s

    # Volumetric oxygen transfer coefficient (kLa)
    # Empirical correlation: kLa = C × (P/V)^0.4 × (Us)^0.5
    Us = 0.01  # superficial gas velocity (m/s), typical for fermentation
    kLa = 0.002 * (P_per_V ** 0.4) * (Us ** 0.5) * 3600  # per hour

    # Mixing time (empirical: t_mix ~ V^(2/3) / (N × D²))
    t_mix = 5.0 * V_m3 ** (2/3) / (N_rps * D_impeller**2)

    # Oxygen transfer rate
    C_star = 7.0  # mg/L (saturation at 30°C)
    C_crit = 1.5  # mg/L (critical for Penicillium)
    OTR = kLa * (C_star - C_crit)  # mg/L/hr

    return {
        "volume_L": volume_L,
        "D_tank_m": D_tank,
        "H_tank_m": H_tank,
        "P_total_kW": P_total / 1000,
        "N_rpm": N_rps * 60,
        "tip_speed_ms": tip_speed,
        "kLa_per_hr": kLa,
        "OTR_mg_L_hr": OTR,
        "mixing_time_s": t_mix,
    }

# Scale-up comparison
volumes = [1, 10, 100, 1000, 10000, 100000]

print("=== Bioreactor Scale-Up Analysis ===")
print(f"Constant P/V = 2000 W/m³ across all scales\\n")

print(f"{'Volume':>10} {'Power':>8} {'RPM':>6} {'Tip Spd':>8} "
      f"{'kLa':>6} {'OTR':>8} {'Mix Time':>10}")
print(f"{'(L)':>10} {'(kW)':>8} {'':>6} {'(m/s)':>8} "
      f"{'(/hr)':>6} {'(mg/L/h)':>8} {'(sec)':>10}")
print("-" * 60)

for V in volumes:
    p = bioreactor_parameters(V)
    print(f"{V:>10,} {p['P_total_kW']:>7.2f} {p['N_rpm']:>5.0f} "
          f"{p['tip_speed_ms']:>7.2f} {p['kLa_per_hr']:>5.0f} "
          f"{p['OTR_mg_L_hr']:>7.1f} {p['mixing_time_s']:>9.1f}")

# Penicillin yield model
print("\\n=== Penicillin Yield vs Scale ===")
print(f"{'Volume':>10} {'Yield (mg/L)':>13} {'Total (g)':>10} {'Patients/batch':>15}")
for V in volumes:
    p = bioreactor_parameters(V)
    # Yield limited by oxygen at large scale (mixing limits O2 delivery)
    base_yield = 50  # mg/L at optimal conditions
    mixing_penalty = min(1.0, 30 / max(p["mixing_time_s"], 1))
    shear_penalty = min(1.0, 3.0 / max(p["tip_speed_ms"], 0.1))
    actual_yield = base_yield * mixing_penalty * shear_penalty
    total_g = actual_yield * V / 1000
    patients = total_g / 10  # 10g per treatment course
    print(f"{V:>10,} {actual_yield:>11.1f} {total_g:>9.1f} {patients:>13.0f}")`,
      challenge: 'Modern penicillin fermentation uses fed-batch culture — nutrients are added continuously to extend the production phase. Modify the model to add a "feed_rate" parameter that increases effective volume (and yield) by 50% over 7 days. How does this change the total output?',
      successHint: 'Bioreactor scale-up is the bridge between laboratory discovery and industrial production. The same engineering principles apply to every fermented product: beer, insulin, vaccines, biofuels. Understanding that physical parameters don\'t scale linearly is the key insight — and the reason bioprocess engineering is a critical discipline.',
    },
    {
      title: 'PKPD modelling — linking drug concentration to bacterial killing',
      concept: `Pharmacokinetics (PK) tells you the drug concentration over time. Pharmacodynamics (PD) tells you what the drug does at each concentration. **PKPD modelling** links them: given a dosing regimen, predict bacterial killing over time.

For beta-lactams like penicillin, efficacy depends on **time above MIC** (the fraction of the dosing interval where drug concentration exceeds the MIC). The kill rate follows a **sigmoidal Emax model**:

**Kill rate = Emax × C^n / (EC50^n + C^n)**

Where Emax is the maximum kill rate, C is the drug concentration, EC50 is the concentration producing half-maximal effect, and n is the Hill coefficient (steepness of the curve).

Bacteria also have a **regrowth rate** when drug levels drop below MIC. The net population change is:

**dN/dt = growth_rate × N × (1 - N/K) - kill_rate × N**

PKPD models are used to optimise dosing: higher doses, more frequent doses, or continuous infusion — each produces a different concentration-time profile and a different killing pattern.

📚 *For penicillins, the PKPD target is: time above MIC > 40-50% of the dosing interval. Below this, bacteria regrow between doses. Above this, the infection is reliably cleared.*`,
      analogy: 'Imagine watering a fire. PK tells you how fast the water flows (concentration). PD tells you how effectively water extinguishes flame at each flow rate (effect). PKPD links them: given this hose and this nozzle setting over this time, will the fire go out? If you spray intermittently (pulsed dosing), the fire reignites between sprays. If you spray continuously (continuous infusion), it stays out.',
      storyConnection: 'The early Oxford penicillin trials in 1941 demonstrated PKPD principles directly. Albert Alexander, a policeman with a Staphylococcal infection, improved dramatically on penicillin but died when the supply ran out. The drug concentration dropped below MIC, the bacteria regrew, and the infection returned. His death proved that sustained time above MIC was essential — the PKPD principle that now governs all beta-lactam dosing.',
      checkQuestion: 'A patient receives amoxicillin 500 mg every 8 hours. The MIC of the pathogen is 4 mg/L. If the drug is above 4 mg/L for only 3 hours per dose, what percentage of the interval is above MIC?',
      checkAnswer: '3/8 = 37.5%. This is below the 40-50% target for beta-lactams — the infection may not clear. Options: increase dose (raises Cmax, extends time above MIC), decrease interval (give every 6 hours instead of 8), or use continuous infusion (maintains constant level above MIC).',
      codeIntro: 'Build a PKPD model that links amoxicillin dosing to bacterial population dynamics.',
      code: `import numpy as np

np.random.seed(42)

def pk_profile(dose, ka, ke, vd, bioavail, duration, dt=0.1):
    """One-compartment PK model — returns concentration array."""
    steps = int(duration / dt)
    conc = np.zeros(steps)
    gut = dose * bioavail

    for i in range(1, steps):
        absorbed = ka * gut * dt
        eliminated = ke * conc[i-1] * vd * dt
        gut -= absorbed
        conc[i] = max((conc[i-1] * vd + absorbed - eliminated) / vd, 0)

    return conc

def pkpd_simulation(doses_mg, interval_hr, total_hr, mic, pk_params, pd_params):
    """
    Full PKPD simulation: PK drives drug levels, PD drives bacterial killing.
    """
    dt = 0.1
    steps = int(total_hr / dt)
    time = np.arange(steps) * dt
    conc = np.zeros(steps)
    bacteria = np.zeros(steps)
    bacteria[0] = pd_params["N0"]

    # Build multi-dose PK profile
    for dose_time in np.arange(0, total_hr, interval_hr):
        dose_step = int(dose_time / dt)
        single_pk = pk_profile(doses_mg, pk_params["ka"], pk_params["ke"],
                               pk_params["vd"], pk_params["bioavail"],
                               total_hr - dose_time, dt)
        conc[dose_step:dose_step + len(single_pk)] += single_pk[:steps - dose_step]

    # PD: bacterial dynamics
    Emax = pd_params["Emax"]
    EC50 = pd_params["EC50"]
    n_hill = pd_params["n_hill"]
    growth_rate = pd_params["growth_rate"]
    K = pd_params["K"]

    for i in range(1, steps):
        N = bacteria[i-1]
        C = conc[i]

        # Emax sigmoidal kill model
        kill = Emax * C**n_hill / (EC50**n_hill + C**n_hill) if C > 0 else 0

        # Net growth = logistic growth - drug killing
        dN = (growth_rate * N * (1 - N/K) - kill * N) * dt
        bacteria[i] = max(N + dN, 1)  # minimum 1 CFU

    return time, conc, bacteria

# Parameters
pk = {"ka": 1.5, "ke": 0.7, "vd": 20, "bioavail": 0.8}
pd = {"N0": 1e8, "K": 1e10, "growth_rate": 0.8, "Emax": 3.0, "EC50": 2.0, "n_hill": 2}
mic = 2.0

# Compare dosing regimens
regimens = [
    ("500mg q8h", 500, 8),
    ("500mg q6h", 500, 6),
    ("1000mg q8h", 1000, 8),
    ("250mg q4h", 250, 4),
]

total_hr = 72  # 3 days

print("=== PKPD Simulation: Dosing Regimen Comparison ===")
print(f"Pathogen MIC: {mic} mg/L | Initial burden: {pd['N0']:.0e} CFU\\n")

print(f"{'Regimen':<16} {'%T>MIC':>7} {'Cmax':>7} {'Cmin':>7} "
      f"{'Log kill 24h':>12} {'Log kill 72h':>12}")
print("-" * 63)

for name, dose, interval in regimens:
    time, conc, bact = pkpd_simulation(dose, interval, total_hr, mic, pk, pd)
    dt = 0.1

    # Calculate %T>MIC (steady state: last 24 hours)
    ss_start = int(48 / dt)
    ss_conc = conc[ss_start:]
    pct_above = np.sum(ss_conc > mic) / len(ss_conc) * 100

    # Peak and trough (steady state)
    cmax = np.max(ss_conc)
    cmin = np.min(ss_conc)

    # Log kill
    log_kill_24 = np.log10(bact[0]) - np.log10(max(bact[int(24/dt)], 1))
    log_kill_72 = np.log10(bact[0]) - np.log10(max(bact[-1], 1))

    print(f"{name:<16} {pct_above:>5.0f}% {cmax:>6.1f} {cmin:>6.2f} "
          f"{log_kill_24:>10.1f} {log_kill_72:>10.1f}")

# Detailed trajectory for best regimen
print("\\n=== Detailed Trajectory: 500mg q6h ===")
time, conc, bact = pkpd_simulation(500, 6, total_hr, mic, pk, pd)
print(f"{'Hour':>5} {'Conc (mg/L)':>12} {'Bacteria':>14} {'Log CFU':>8} {'Status':>12}")
print("-" * 53)
for h in [0, 2, 6, 12, 24, 36, 48, 60, 72]:
    idx = int(h / 0.1)
    if idx < len(conc):
        status = "KILLING" if conc[idx] > mic else "REGROWTH"
        print(f"{h:>5} {conc[idx]:>10.2f} {bact[idx]:>14.0f} {np.log10(max(bact[idx],1)):>7.1f} {status:>12}")`,
      challenge: 'Model continuous infusion: instead of bolus doses, deliver 2000 mg over 24 hours as a constant rate (83.3 mg/hr IV). Compare the %T>MIC and bacterial kill at 72 hours vs the best intermittent regimen. Continuous infusion is now recommended for critically ill patients — your model shows why.',
      successHint: 'PKPD modelling is how pharmaceutical companies design clinical trials, how pharmacists optimise dosing, and how guidelines committees set dosing recommendations. The model you built — linking drug concentration to bacterial dynamics via a sigmoidal kill curve — is the standard framework taught in clinical pharmacology. You now understand WHY amoxicillin is dosed every 8 hours, not every 12 or every 4.',
    },
    {
      title: 'Hospital infection network modelling — mapping transmission pathways',
      concept: `Hospital-acquired infections (HAIs) don't spread randomly — they follow **network pathways**. A nurse moves between patients; a shared bathroom connects rooms; a contaminated ventilator infects the next user. Mapping these pathways as a **network graph** reveals the highest-risk connections and the most effective interventions.

In the network model, **nodes** are patients, staff, and locations. **Edges** are contact events (nurse visits patient, patient uses shared equipment). Each edge has a **transmission probability** based on contact duration, pathogen load, and hygiene practices.

Key network metrics include:
- **Degree**: how many contacts a node has (high-degree nodes are superspreaders)
- **Betweenness centrality**: how many shortest paths pass through a node (high betweenness = critical bridge in the transmission chain)
- **Clustering coefficient**: how interconnected a node's contacts are (high clustering = the infection stays in a local cluster)

The goal: identify the **critical nodes** whose isolation would most effectively break transmission chains — the network equivalent of finding the keystone in an arch.

📚 *Network epidemiology combines graph theory with infectious disease modelling. It explains why some outbreaks explode (connected networks) and others fizzle (fragmented networks) — and where to intervene.*`,
      analogy: 'Think of a hospital ward as a social network — like Facebook, but for bacteria. Patients are "friends" if they share a nurse, a bathroom, or equipment. An infection spreads along "friendships." Isolating a highly connected node (a nurse who contacts every patient) is like removing a major hub — it fragments the network and stops the spread.',
      storyConnection: 'MRSA (methicillin-resistant Staphylococcus aureus) emerged because penicillin resistance led to methicillin use, which selected for methicillin resistance. MRSA spreads primarily in hospitals via healthcare worker hands — a classic network transmission pathway. Understanding the network structure of hospital contact patterns was the key insight that led to hand-hygiene campaigns and contact precautions.',
      checkQuestion: 'A hospital has 3 nurses. Nurse A contacts 15 patients, Nurse B contacts 8 patients, and Nurse C contacts 4 patients. Which nurse should be prioritised for infection control training?',
      checkAnswer: 'Nurse A — they have the highest degree (most contacts) and are therefore the most likely transmission vector. But betweenness centrality matters too: if Nurse B is the only link between two wings of the hospital, isolating Nurse B might fragment the network more effectively than isolating Nurse A. Network analysis reveals these non-obvious priorities.',
      codeIntro: 'Build a hospital contact network and simulate infection spread — identify critical nodes for intervention.',
      code: `import numpy as np

np.random.seed(42)

class HospitalNetwork:
    """Models a hospital ward contact network."""

    def __init__(self, n_patients, n_nurses, n_shared_spaces):
        self.n_patients = n_patients
        self.n_nurses = n_nurses
        self.n_shared = n_shared_spaces
        self.n_nodes = n_patients + n_nurses + n_shared_spaces

        # Node types
        self.types = (["patient"] * n_patients +
                      ["nurse"] * n_nurses +
                      ["space"] * n_shared_spaces)

        # Build adjacency matrix
        self.adj = np.zeros((self.n_nodes, self.n_nodes))
        self._build_network()

    def _build_network(self):
        # Assign patients to nurses (each nurse manages ~5-8 patients)
        patients_per_nurse = self.n_patients // self.n_nurses + 1
        for nurse_idx in range(self.n_nurses):
            nurse_node = self.n_patients + nurse_idx
            start = nurse_idx * patients_per_nurse
            end = min(start + patients_per_nurse, self.n_patients)
            for p in range(start, end):
                contact_prob = np.random.uniform(0.3, 0.8)
                self.adj[nurse_node, p] = contact_prob
                self.adj[p, nurse_node] = contact_prob

        # Shared spaces (bathroom, lounge) connect random patients
        for space_idx in range(self.n_shared):
            space_node = self.n_patients + self.n_nurses + space_idx
            n_users = np.random.randint(3, self.n_patients // 2)
            users = np.random.choice(self.n_patients, n_users, replace=False)
            for u in users:
                prob = np.random.uniform(0.05, 0.2)
                self.adj[space_node, u] = prob
                self.adj[u, space_node] = prob

    def degree(self, node):
        return np.sum(self.adj[node] > 0)

    def betweenness_approx(self, node):
        """Approximate betweenness: fraction of node pairs this node bridges."""
        count = 0
        total = 0
        neighbors = np.where(self.adj[node] > 0)[0]
        for i in neighbors:
            for j in neighbors:
                if i < j:
                    total += 1
                    if self.adj[i, j] == 0:  # not directly connected
                        count += 1
        return count / max(total, 1)

    def simulate_outbreak(self, seed_node, days=30, hand_hygiene=0.0):
        """Simulate infection spread. hand_hygiene reduces all transmission probs."""
        infected = {seed_node}
        recovered = set()
        daily_cases = [1]

        for day in range(days):
            new_infected = set()
            newly_recovered = set()

            for inf_node in infected:
                # Attempt transmission to contacts
                for contact in range(self.n_nodes):
                    if contact in infected or contact in recovered:
                        continue
                    base_prob = self.adj[inf_node, contact]
                    actual_prob = base_prob * (1 - hand_hygiene)
                    if actual_prob > 0 and np.random.random() < actual_prob:
                        new_infected.add(contact)

                # Recovery (10% per day)
                if np.random.random() < 0.1:
                    newly_recovered.add(inf_node)

            infected = (infected | new_infected) - newly_recovered
            recovered = recovered | newly_recovered
            daily_cases.append(len(infected))

        return max(daily_cases), len(recovered) + len(infected)

# Build hospital network
net = HospitalNetwork(n_patients=24, n_nurses=4, n_shared_spaces=2)

print("=== Hospital Contact Network Analysis ===")
print(f"Nodes: {net.n_nodes} (24 patients, 4 nurses, 2 shared spaces)\\n")

# Network statistics
print(f"{'Node':>5} {'Type':<10} {'Degree':>7} {'Betweenness':>12}")
print("-" * 36)
high_risk = []
for i in range(net.n_nodes):
    d = net.degree(i)
    b = net.betweenness_approx(i)
    if d > 3:
        high_risk.append((i, net.types[i], d, b))
        print(f"{i:>5} {net.types[i]:<10} {d:>5.0f} {b:>10.2f}")

# Simulate outbreaks with different interventions
print("\\n=== Outbreak Simulation (100 runs each) ===")
scenarios = [
    ("No intervention", 0.0),
    ("50% hand hygiene", 0.5),
    ("80% hand hygiene", 0.8),
    ("95% hand hygiene", 0.95),
]

for name, hygiene in scenarios:
    peaks = []
    totals = []
    for _ in range(100):
        seed = np.random.randint(0, net.n_patients)
        peak, total = net.simulate_outbreak(seed, days=30, hand_hygiene=hygiene)
        peaks.append(peak)
        totals.append(total)
    print(f"{name:<20} Median peak: {np.median(peaks):>4.0f}  "
          f"Median total: {np.median(totals):>4.0f}  "
          f"Outbreaks >10: {sum(1 for t in totals if t > 10):>3}/100")`,
      challenge: 'Implement "contact precautions" by removing edges to the highest-degree nurse (setting all their transmission probabilities to 0.05). Compare outbreak sizes with vs without this targeted intervention. This models the real-world strategy of assigning dedicated nurses to isolated patients.',
      successHint: 'Network epidemiology is how modern hospitals design infection control programmes. The insight that a few high-connectivity nodes (nurses, shared equipment) drive most transmission has revolutionised hospital hygiene. The same network analysis applies to social media misinformation, computer virus spread, and financial contagion.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced modelling and systems analysis</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 3 covers stochastic epidemiology, game theory, bioreactor engineering, PKPD modelling, and hospital network analysis.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
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
