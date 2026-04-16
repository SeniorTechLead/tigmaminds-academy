import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function RiverBraidLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: "Capstone Design: River Channel Evolution Model — from hydrology to morphology prediction",
      concept: "The capstone integrates all Level 3 skills into a complete, deployable system. from hydrology to morphology prediction. This stage handles data ingestion, processing, model application, and output generation with quality metrics at each step.\n\nThe implementation follows software engineering best practices: modular design, error handling, and comprehensive documentation. Each function has a clear interface, and the pipeline produces both results and quality assessments.",
      analogy: "Building this capstone is like constructing a complete laboratory instrument: each component must work reliably on its own and integrate seamlessly with the rest. The whole is greater than the sum of its parts because the pipeline produces insights that no individual stage can generate alone.",
      storyConnection: "The braided river in the story constantly shifted its channels — sometimes gently, sometimes catastrophically in floods. Our model captures that dynamic behavior: predicting where the river will flow next, which banks will erode, and how the ecosystem responds to change.",
      checkQuestion: "What is the most critical quality check at this stage?",
      checkAnswer: "Every stage must validate its inputs and flag anomalies. A pipeline that silently produces wrong results is worse than one that crashes — at least a crash tells you something is wrong. The quality check at this stage is to compare output distributions against expected ranges and flag any value that falls outside 3 standard deviations of historical norms.",
      codeIntro: "Build this pipeline stage with quality metrics.",
      code: `import numpy as np

np.random.seed(42)

# === Stage 1: Capstone --- Hydrological Input Module ===

# Build the discharge time series that drives the entire river model.
# Includes seasonal monsoon cycle, interannual variability, and climate trends.

class HydrologyModel:
    """Generate realistic daily discharge for a monsoon-fed braided river."""

    def __init__(self, mean_annual_Q=5000, monsoon_peak_ratio=8, base_flow=800):
        self.mean_Q = mean_annual_Q
        self.peak_ratio = monsoon_peak_ratio
        self.base = base_flow

    def daily_discharge(self, year, num_years=1, climate_trend=0.02):
        """
        Generate daily Q for a given year.
        climate_trend: fractional increase in peak per year (climate change).
        """
        days = 365
        t = np.arange(days)
        # Monsoon pulse: peaks around day 200 (mid-July), rises from May
        monsoon_center = 200
        monsoon_width = 45
        monsoon_shape = np.exp(-0.5 * ((t - monsoon_center) / monsoon_width)**2)

        # Climate-adjusted peak
        peak = self.mean_Q * self.peak_ratio * (1 + climate_trend * year)

        # Daily discharge = base + monsoon + noise
        Q = self.base + peak * monsoon_shape
        noise = np.random.normal(0, self.base * 0.3, days)
        Q = np.clip(Q + noise, self.base * 0.5, peak * 1.5)
        return Q

    def annual_stats(self, Q):
        return {
            "mean": np.mean(Q),
            "peak": np.max(Q),
            "min": np.min(Q),
            "total_volume_km3": np.sum(Q) * 86400 / 1e9,
            "days_above_flood": np.sum(Q > self.mean_Q * 5),
        }

# Generate and validate
model = HydrologyModel(mean_annual_Q=5000, monsoon_peak_ratio=8, base_flow=800)

print("=== Stage 1: Hydrological Input Module ===")
print("\
Generating discharge time series for a monsoon-fed braided river.\
")

# Show multi-year statistics
print(f"{'Year':<8} {'Mean Q':<12} {'Peak Q':<12} {'Min Q':<12} {'Volume (km3)':<14} {'Flood Days'}")
print("-" * 62)
all_peaks = []
for yr in range(10):
    Q = model.daily_discharge(yr)
    stats = model.annual_stats(Q)
    all_peaks.append(stats["peak"])
    print(f"{yr+1:<8} {stats['mean']:<12.0f} {stats['peak']:<12.0f} {stats['min']:<12.0f} {stats['total_volume_km3']:<14.1f} {stats['days_above_flood']}")

# Monthly breakdown for year 1
print("\
--- Monthly Discharge Profile (Year 1) ---\
")
Q_yr1 = model.daily_discharge(0)
months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
day = 0
print(f"{'Month':<8} {'Avg Q (m3/s)':<14} {'Peak Q':<12} {'Profile'}")
print("-" * 55)
for m, dm in zip(months, days_in_month):
    month_Q = Q_yr1[day:day+dm]
    avg = np.mean(month_Q)
    pk = np.max(month_Q)
    bar = "#" * int(avg / 1000)
    print(f"{m:<8} {avg:<14.0f} {pk:<12.0f} {bar}")
    day += dm

# Validate: check for realistic properties
print("\
--- Quality Checks ---\
")
Q_test = model.daily_discharge(0)
checks = [
    ("Peak/Base ratio > 5", np.max(Q_test) / np.min(Q_test) > 5, f"{np.max(Q_test)/np.min(Q_test):.1f}"),
    ("Monsoon peak in Jun-Sep", np.argmax(Q_test) > 150 and np.argmax(Q_test) < 280, f"day {np.argmax(Q_test)}"),
    ("No negative flows", np.all(Q_test > 0), f"min = {np.min(Q_test):.0f}"),
    ("Climate trend visible", all_peaks[-1] > all_peaks[0], f"{all_peaks[0]:.0f} -> {all_peaks[-1]:.0f}"),
]
for label, passed, detail in checks:
    status = "PASS" if passed else "FAIL"
    print(f"  [{status}] {label}: {detail}")

print("\
Stage 1 complete: hydrology module ready to drive channel model.")`,
      challenge: "Add a validation step that compares this stage output against an independent data source.",
      successHint: "This stage is complete and ready to feed into the next pipeline stage.",
    },
    {
      title: "Stage 2: Sediment budget calculator with source tracking",
      concept: "Stage 2 of the capstone builds on the previous stages. Stage 2: Sediment budget calculator with source tracking. This stage handles data ingestion, processing, model application, and output generation with quality metrics at each step.\n\nThe implementation follows software engineering best practices: modular design, error handling, and comprehensive documentation. Each function has a clear interface, and the pipeline produces both results and quality assessments.",
      analogy: "This stage is like adding a new sensor to an instrument: each component must work reliably on its own and integrate seamlessly with the rest. The whole is greater than the sum of its parts because the pipeline produces insights that no individual stage can generate alone.",
      storyConnection: "The braided river in the story constantly shifted its channels — sometimes gently, sometimes catastrophically in floods. Our model captures that dynamic behavior: predicting where the river will flow next, which banks will erode, and how the ecosystem responds to change.",
      checkQuestion: "What is the most critical quality check at this stage?",
      checkAnswer: "Every stage must validate its inputs and flag anomalies. A pipeline that silently produces wrong results is worse than one that crashes — at least a crash tells you something is wrong. The quality check at this stage is to compare output distributions against expected ranges and flag any value that falls outside 3 standard deviations of historical norms.",
      codeIntro: "Build this pipeline stage with quality metrics.",
      code: `import numpy as np

np.random.seed(42)

# === Stage 2: Sediment Budget Calculator with Source Tracking ===

class SedimentBudget:
    """Track sediment inputs, outputs, and storage for a river reach."""

    def __init__(self, reach_length_km=50):
        self.length = reach_length_km
        self.sources = {}
        self.sinks = {}

    def add_source(self, name, annual_load_kt, grain_size_mm, variability=0.2):
        """Add a sediment source (kt = kilotonnes/year)."""
        self.sources[name] = {
            "load": annual_load_kt,
            "D50": grain_size_mm,
            "var": variability
        }

    def add_sink(self, name, annual_trap_kt, efficiency=0.8):
        """Add a sediment sink (e.g., floodplain deposition, dam)."""
        self.sinks[name] = {"trap": annual_trap_kt, "eff": efficiency}

    def compute_budget(self, year=0, climate_factor=1.0):
        """Compute annual sediment budget with random variation."""
        inputs = {}
        total_in = 0
        for name, src in self.sources.items():
            noise = np.random.normal(1.0, src["var"])
            load = src["load"] * noise * climate_factor
            inputs[name] = max(0, load)
            total_in += inputs[name]

        outputs = {}
        total_out = 0
        for name, sink in self.sinks.items():
            trapped = min(sink["trap"] * sink["eff"], total_in * 0.3)
            outputs[name] = trapped
            total_out += trapped

        # Remaining sediment passes through
        throughput = total_in - total_out
        storage_change = np.random.normal(0, total_in * 0.05)  # in-reach deposition/erosion
        outputs["Downstream export"] = throughput - storage_change

        return {
            "inputs": inputs,
            "total_input": total_in,
            "outputs": outputs,
            "total_output": total_out + throughput - storage_change,
            "storage_change": storage_change,
        }

# Build a realistic sediment budget for a braided river system
budget = SedimentBudget(reach_length_km=50)

# Sources
budget.add_source("Upstream main channel", 800, 0.5, variability=0.3)
budget.add_source("Tributary 1 (hills)", 200, 2.0, variability=0.4)
budget.add_source("Tributary 2 (plains)", 100, 0.3, variability=0.2)
budget.add_source("Bank erosion", 150, 0.8, variability=0.5)
budget.add_source("Hillslope landslides", 80, 5.0, variability=0.8)

# Sinks
budget.add_sink("Floodplain deposition", 200, efficiency=0.7)
budget.add_sink("Bar deposition", 100, efficiency=0.5)

print("=== Stage 2: Sediment Budget Calculator ===")
print("\
Tracking sediment through a 50 km braided river reach.\
")

# Single year detailed view
result = budget.compute_budget()
print("--- Annual Sediment Budget (Year 1) ---\
")
print("INPUTS:")
for name, load in result["inputs"].items():
    bar = "#" * int(load / 30)
    pct = load / result["total_input"] * 100
    print(f"  {name:<30} {load:>8.0f} kt  ({pct:>5.1f}%)  {bar}")
print(f"  {'TOTAL INPUT':<30} {result['total_input']:>8.0f} kt")

print("\
OUTPUTS:")
for name, trap in result["outputs"].items():
    print(f"  {name:<30} {trap:>8.0f} kt")

print(f"\
  In-reach storage change:     {result['storage_change']:>+8.0f} kt", end="")
print(f"  ({'aggradation' if result['storage_change'] > 0 else 'degradation'})")

# Multi-year simulation
print("\
\
--- 20-Year Sediment Budget Trends ---\
")
print(f"{'Year':<8} {'Total In (kt)':<16} {'Floodplain':<14} {'Downstream':<14} {'Storage':<12} {'Balance'}")
print("-" * 70)
cumulative_storage = 0
for yr in range(20):
    # Climate trend: more intense monsoons -> more sediment
    climate = 1.0 + yr * 0.01
    r = budget.compute_budget(year=yr, climate_factor=climate)
    cumulative_storage += r["storage_change"]
    balance = "AGGRADING" if r["storage_change"] > 20 else "DEGRADING" if r["storage_change"] < -20 else "stable"
    fp_dep = r["outputs"].get("Floodplain deposition", 0)
    ds_exp = r["outputs"].get("Downstream export", 0)
    print(f"{yr+1:<8} {r['total_input']:<16.0f} {fp_dep:<14.0f} {ds_exp:<14.0f} {r['storage_change']:<+12.0f} {balance}")

print(f"\
  Cumulative storage change over 20 years: {cumulative_storage:+.0f} kt")
print(f"  Average annual change: {cumulative_storage/20:+.0f} kt/year")
if cumulative_storage > 0:
    print(f"  The reach is net AGGRADING (building up) -> channels may become more braided")
else:
    print(f"  The reach is net DEGRADING (cutting down) -> channels may simplify")

print("\
Stage 2 complete: sediment budget module ready.")`,
      challenge: "Add a validation step that compares this stage output against an independent data source.",
      successHint: "This stage is complete and ready to feed into the next pipeline stage.",
    },
    {
      title: "Stage 3: Channel migration simulator with Monte Carlo uncertainty",
      concept: "Stage 3 of the capstone builds on the previous stages. Stage 3: Channel migration simulator with Monte Carlo uncertainty. This stage handles data ingestion, processing, model application, and output generation with quality metrics at each step.\n\nThe implementation follows software engineering best practices: modular design, error handling, and comprehensive documentation. Each function has a clear interface, and the pipeline produces both results and quality assessments.",
      analogy: "This stage is like adding a new sensor to an instrument: each component must work reliably on its own and integrate seamlessly with the rest. The whole is greater than the sum of its parts because the pipeline produces insights that no individual stage can generate alone.",
      storyConnection: "The braided river in the story constantly shifted its channels — sometimes gently, sometimes catastrophically in floods. Our model captures that dynamic behavior: predicting where the river will flow next, which banks will erode, and how the ecosystem responds to change.",
      checkQuestion: "What is the most critical quality check at this stage?",
      checkAnswer: "Every stage must validate its inputs and flag anomalies. A pipeline that silently produces wrong results is worse than one that crashes — at least a crash tells you something is wrong. The quality check at this stage is to compare output distributions against expected ranges and flag any value that falls outside 3 standard deviations of historical norms.",
      codeIntro: "Build this pipeline stage with quality metrics.",
      code: `import numpy as np

np.random.seed(42)

# === Stage 3: Channel Migration with Monte Carlo Uncertainty ===

def simulate_migration(years, mean_rate, rate_std, flood_prob=0.2, flood_mult=3.0):
    """
    Simulate lateral channel migration with random floods.
    Returns array of cumulative lateral position (meters).
    """
    positions = np.zeros(years + 1)
    for yr in range(years):
        # Base migration rate with uncertainty
        rate = np.random.normal(mean_rate, rate_std)
        # Random direction bias (slight preference for one side)
        direction = np.random.choice([-1, 1], p=[0.4, 0.6])
        # Flood years: amplified migration
        if np.random.random() < flood_prob:
            rate *= flood_mult
        positions[yr + 1] = positions[yr] + rate * direction
    return positions

# Run Monte Carlo: many simulations to quantify uncertainty
num_simulations = 200
years = 30
mean_rate = 15  # meters/year average lateral migration
rate_std = 8

print("=== Stage 3: Monte Carlo Channel Migration Simulator ===")
print(f"\
Running {num_simulations} simulations of {years}-year channel migration.")
print(f"Mean migration rate: {mean_rate} m/yr, Std: {rate_std} m/yr")
print(f"Flood probability: 20%/yr, Flood amplification: 3x\
")

# Run all simulations
all_results = np.zeros((num_simulations, years + 1))
for i in range(num_simulations):
    all_results[i] = simulate_migration(years, mean_rate, rate_std)

# Final positions
final_positions = all_results[:, -1]
max_excursions = np.max(np.abs(all_results), axis=1)

# Statistics at key time points
print("--- Channel Position Statistics Over Time ---\
")
print(f"{'Year':<8} {'Median (m)':<14} {'Mean (m)':<14} {'Std (m)':<12} {'5th %ile':<12} {'95th %ile'}")
print("-" * 62)
for yr in [1, 5, 10, 15, 20, 25, 30]:
    positions = all_results[:, yr]
    print(f"{yr:<8} {np.median(positions):<14.0f} {np.mean(positions):<14.0f} {np.std(positions):<12.0f} {np.percentile(positions, 5):<12.0f} {np.percentile(positions, 95):.0f}")

# Risk assessment: probability of exceeding certain distances
print("\
\
--- Risk Assessment: Probability of Migration Beyond Threshold ---\
")
print(f"{'Distance (m)':<16} {'P(exceed) at 10yr':<20} {'P(exceed) at 20yr':<20} {'P(exceed) at 30yr'}")
print("-" * 72)
for threshold in [50, 100, 200, 300, 500]:
    p10 = np.mean(np.max(np.abs(all_results[:, :11]), axis=1) > threshold) * 100
    p20 = np.mean(np.max(np.abs(all_results[:, :21]), axis=1) > threshold) * 100
    p30 = np.mean(max_excursions > threshold) * 100
    print(f"{threshold:<16} {p10:<20.1f} {p20:<20.1f} {p30:.1f}%")

# Distribution of final positions
print("\
--- Distribution of Final Position (Year 30) ---\
")
bins = np.linspace(-600, 600, 13)
counts, _ = np.histogram(final_positions, bins=bins)
max_count = max(counts)
for i in range(len(counts)):
    lo, hi = bins[i], bins[i+1]
    bar = "#" * int(counts[i] / max(max_count, 1) * 30)
    print(f"  {lo:>+6.0f} to {hi:>+6.0f} m: {counts[i]:>3} sims  {bar}")

print(f"\
  Positive = rightward migration, Negative = leftward")
print(f"  Mean final position: {np.mean(final_positions):+.0f} m (slight rightward bias)")
print(f"  Max excursion seen:  {np.max(np.abs(final_positions)):.0f} m")

print("\
--- Key Insight ---")
print("Monte Carlo reveals that a single prediction is meaningless for braided")
print("rivers. The 95% confidence interval spans hundreds of meters. This is")
print("why setback distances for buildings must use worst-case scenarios, not")
print("average migration rates.")`,
      challenge: "Add a validation step that compares this stage output against an independent data source.",
      successHint: "This stage is complete and ready to feed into the next pipeline stage.",
    },
    {
      title: "Stage 4: Flood impact predictor with return period analysis",
      concept: "Stage 4 of the capstone builds on the previous stages. Stage 4: Flood impact predictor with return period analysis. This stage handles data ingestion, processing, model application, and output generation with quality metrics at each step.\n\nThe implementation follows software engineering best practices: modular design, error handling, and comprehensive documentation. Each function has a clear interface, and the pipeline produces both results and quality assessments.",
      analogy: "This stage is like adding a new sensor to an instrument: each component must work reliably on its own and integrate seamlessly with the rest. The whole is greater than the sum of its parts because the pipeline produces insights that no individual stage can generate alone.",
      storyConnection: "The braided river in the story constantly shifted its channels — sometimes gently, sometimes catastrophically in floods. Our model captures that dynamic behavior: predicting where the river will flow next, which banks will erode, and how the ecosystem responds to change.",
      checkQuestion: "What is the most critical quality check at this stage?",
      checkAnswer: "Every stage must validate its inputs and flag anomalies. A pipeline that silently produces wrong results is worse than one that crashes — at least a crash tells you something is wrong. The quality check at this stage is to compare output distributions against expected ranges and flag any value that falls outside 3 standard deviations of historical norms.",
      codeIntro: "Build this pipeline stage with quality metrics.",
      code: `import numpy as np

np.random.seed(42)

# === Stage 4: Flood Impact Predictor with Return Period Analysis ===

# Generate synthetic annual maximum flood discharge data (60 years)
n_years = 60
# Log-normal distribution is typical for flood peaks
annual_max_Q = np.random.lognormal(mean=np.log(25000), sigma=0.4, size=n_years)

# Sort for frequency analysis (Weibull plotting position)
sorted_Q = np.sort(annual_max_Q)[::-1]  # descending
ranks = np.arange(1, n_years + 1)
return_periods = (n_years + 1) / ranks  # Weibull formula

print("=== Stage 4: Flood Return Period Analysis ===")
print(f"\
Analyzing {n_years} years of annual maximum flood discharge.\
")

# Show the frequency analysis
print("--- Top 15 Flood Events (ranked by magnitude) ---\
")
print(f"{'Rank':<8} {'Discharge (m3/s)':<20} {'Return Period (yr)':<20} {'Probability/yr'}")
print("-" * 62)
for i in range(15):
    prob = 1.0 / return_periods[i]
    print(f"{ranks[i]:<8} {sorted_Q[i]:<20,.0f} {return_periods[i]:<20.1f} {prob:.4f}")

# Fit Gumbel distribution (common for flood frequency analysis)
# Gumbel: F(x) = exp(-exp(-(x - mu)/beta))
mean_Q = np.mean(annual_max_Q)
std_Q = np.std(annual_max_Q)
beta = std_Q * np.sqrt(6) / np.pi
mu = mean_Q - 0.5772 * beta  # Euler-Mascheroni constant

print(f"\
--- Gumbel Distribution Fit ---")
print(f"  Mean annual max: {mean_Q:,.0f} m3/s")
print(f"  Std deviation:   {std_Q:,.0f} m3/s")
print(f"  Gumbel mu:       {mu:,.0f}")
print(f"  Gumbel beta:     {beta:,.0f}")

# Predict flood magnitudes for design return periods
print("\
--- Design Flood Estimates ---\
")
print(f"{'Return Period':<16} {'Discharge (m3/s)':<20} {'Annual Prob':<14} {'Use Case'}")
print("-" * 68)
design_periods = [2, 5, 10, 25, 50, 100, 200, 500]
for T in design_periods:
    # Gumbel quantile: Q = mu - beta * ln(-ln(1 - 1/T))
    Q_T = mu - beta * np.log(-np.log(1 - 1.0/T))
    prob = 1.0/T
    use = {2: "Median flood", 5: "Minor infrastructure", 10: "Roads, bridges",
           25: "Major bridges", 50: "Dam spillway", 100: "Critical infrastructure",
           200: "Nuclear safety", 500: "Extreme risk"}.get(T, "")
    print(f"{T:>5} years      {Q_T:<20,.0f} {prob:<14.4f} {use}")

# Flood impact assessment
print("\
\
--- Flood Impact at Different Stages ---\
")
print(f"{'Discharge':<16} {'Return Period':<16} {'Water Level':<14} {'Impact'}")
print("-" * 66)

# Simplified stage-discharge relationship: h = a * Q^b
a, b = 0.05, 0.45
bank_full = 8.0  # meters

impacts = [
    (15000, "Channels full, bars submerged"),
    (25000, "Floodplain inundated, farmland flooded"),
    (35000, "Major flooding, village roads cut off"),
    (45000, "Severe: homes flooded, livestock at risk"),
    (60000, "Catastrophic: widespread destruction"),
    (80000, "Extreme: unprecedented damage"),
]
for Q_val, impact in impacts:
    stage = a * Q_val**b
    # Find return period from Gumbel
    p = np.exp(-np.exp(-(Q_val - mu) / beta))
    T_est = 1.0 / (1 - p) if p < 0.999 else 1000
    above = stage - bank_full
    level_str = f"{stage:.1f} m" + (f" (+{above:.1f}m)" if above > 0 else "")
    print(f"{Q_val:>10,}      {T_est:>8.0f} yr       {level_str:<14} {impact}")

# Risk over planning horizon
print("\
--- Probability of Exceeding Design Flood Over Planning Horizon ---\
")
print(f"{'Return Period':<16} {'P in 10yr':<12} {'P in 25yr':<12} {'P in 50yr':<12} {'P in 100yr'}")
print("-" * 56)
for T in [10, 25, 50, 100, 500]:
    p_annual = 1.0 / T
    for horizon in [10, 25, 50, 100]:
        p_exceed = 1 - (1 - p_annual)**horizon
        if horizon == 10:
            print(f"{T:>5} yr flood    {p_exceed*100:>6.1f}%", end="")
        else:
            print(f"     {p_exceed*100:>6.1f}%", end="")
    print()

print("\
A 100-year flood has a 26% chance of occurring in any 30-year mortgage!")
print("Stage 4 complete: flood frequency model ready.")`,
      challenge: "Add a validation step that compares this stage output against an independent data source.",
      successHint: "This stage is complete and ready to feed into the next pipeline stage.",
    },
    {
      title: "Stage 5: Ecosystem health scoring from channel morphology metrics",
      concept: "Stage 5 of the capstone builds on the previous stages. Stage 5: Ecosystem health scoring from channel morphology metrics. This stage handles data ingestion, processing, model application, and output generation with quality metrics at each step.\n\nThe implementation follows software engineering best practices: modular design, error handling, and comprehensive documentation. Each function has a clear interface, and the pipeline produces both results and quality assessments.",
      analogy: "This stage is like adding a new sensor to an instrument: each component must work reliably on its own and integrate seamlessly with the rest. The whole is greater than the sum of its parts because the pipeline produces insights that no individual stage can generate alone.",
      storyConnection: "The braided river in the story constantly shifted its channels — sometimes gently, sometimes catastrophically in floods. Our model captures that dynamic behavior: predicting where the river will flow next, which banks will erode, and how the ecosystem responds to change.",
      checkQuestion: "What is the most critical quality check at this stage?",
      checkAnswer: "Every stage must validate its inputs and flag anomalies. A pipeline that silently produces wrong results is worse than one that crashes — at least a crash tells you something is wrong. The quality check at this stage is to compare output distributions against expected ranges and flag any value that falls outside 3 standard deviations of historical norms.",
      codeIntro: "Build this pipeline stage with quality metrics.",
      code: `import numpy as np

np.random.seed(42)

# === Stage 5: Ecosystem Health Scoring from Channel Morphology ===

def score_metric(value, optimal_range, name):
    """
    Score a metric 0-100 based on how close it is to optimal range.
    Returns (score, assessment).
    """
    lo, hi = optimal_range
    mid = (lo + hi) / 2
    half_range = (hi - lo) / 2
    if lo <= value <= hi:
        score = 100
    else:
        distance = min(abs(value - lo), abs(value - hi))
        score = max(0, 100 - distance / half_range * 50)
    if score >= 80:
        assessment = "Excellent"
    elif score >= 60:
        assessment = "Good"
    elif score >= 40:
        assessment = "Fair"
    elif score >= 20:
        assessment = "Poor"
    else:
        assessment = "Critical"
    return score, assessment

# Define ecosystem health indicators for a braided river
indicators = {
    "Braiding Index": {
        "value": 4.2, "optimal": (3, 7), "unit": "channels",
        "why": "Multiple channels = diverse habitats"
    },
    "Sinuosity": {
        "value": 1.15, "optimal": (1.05, 1.3), "unit": "",
        "why": "Low sinuosity normal for braided rivers"
    },
    "Floodplain Connectivity": {
        "value": 0.65, "optimal": (0.6, 1.0), "unit": "fraction",
        "why": "River must access its floodplain for nutrient cycling"
    },
    "Sediment Balance": {
        "value": 0.9, "optimal": (0.8, 1.2), "unit": "ratio in/out",
        "why": "Near 1.0 = stable channel, >1.2 = aggrading, <0.8 = degrading"
    },
    "Riparian Vegetation": {
        "value": 0.45, "optimal": (0.3, 0.7), "unit": "cover fraction",
        "why": "Some bare bars needed for nesting; too much = channel fixed"
    },
    "Water Temperature": {
        "value": 24, "optimal": (18, 26), "unit": "degrees C",
        "why": "Warm enough for tropical species, not too hot"
    },
    "Dissolved Oxygen": {
        "value": 6.5, "optimal": (6, 9), "unit": "mg/L",
        "why": ">6 mg/L needed for fish survival"
    },
    "Flow Variability": {
        "value": 5.5, "optimal": (3, 8), "unit": "peak/base ratio",
        "why": "Natural monsoon pulse drives ecosystem cycles"
    },
}

print("=== Stage 5: Ecosystem Health Scorecard ===")
print("\
Assessing river health from morphology and water quality metrics.\
")
print(f"{'Indicator':<26} {'Value':<12} {'Optimal Range':<16} {'Score':<8} {'Grade':<12} {'Reason'}")
print("-" * 100)

scores = []
for name, data in indicators.items():
    score, grade = score_metric(data["value"], data["optimal"], name)
    scores.append(score)
    opt_str = f"{data['optimal'][0]}-{data['optimal'][1]}"
    val_str = f"{data['value']} {data['unit']}"
    print(f"{name:<26} {val_str:<12} {opt_str:<16} {score:>5.0f}   {grade:<12} {data['why']}")

overall = np.mean(scores)
print(f"\
{'OVERALL SCORE':<26} {'':12} {'':16} {overall:>5.0f}")

# Grade
if overall >= 80:
    grade = "HEALTHY"
    emoji = "River in good condition"
elif overall >= 60:
    grade = "FAIR"
    emoji = "Some concerns, monitoring needed"
elif overall >= 40:
    grade = "DEGRADED"
    emoji = "Intervention recommended"
else:
    grade = "CRITICAL"
    emoji = "Urgent restoration needed"
print(f"\
  Overall Grade: {grade} -- {emoji}")

# Compare scenarios
print("\
\
--- Scenario Comparison ---\
")
scenarios = {
    "Natural braided river": {"BI": 5.0, "FP": 0.85, "SB": 1.0, "RV": 0.5, "DO": 7.5, "FV": 6.0},
    "After dam construction":{"BI": 2.0, "FP": 0.3,  "SB": 0.5, "RV": 0.8, "DO": 6.0, "FV": 2.0},
    "Channelized/embanked":  {"BI": 1.0, "FP": 0.1,  "SB": 0.4, "RV": 0.1, "DO": 5.0, "FV": 1.5},
    "After restoration":     {"BI": 3.5, "FP": 0.6,  "SB": 0.85,"RV": 0.4, "DO": 6.8, "FV": 4.0},
}

metric_optima = {"BI": (3,7), "FP": (0.6,1.0), "SB": (0.8,1.2), "RV": (0.3,0.7), "DO": (6,9), "FV": (3,8)}

print(f"{'Scenario':<26} {'BI':<8} {'FP':<8} {'SB':<8} {'RV':<8} {'DO':<8} {'FV':<8} {'Score'}")
print("-" * 76)
for scenario, values in scenarios.items():
    sc_scores = []
    vals_str = ""
    for key, val in values.items():
        s, _ = score_metric(val, metric_optima[key], key)
        sc_scores.append(s)
        vals_str += f"{val:<8}"
    avg = np.mean(sc_scores)
    print(f"{scenario:<26} {vals_str} {avg:>5.0f}")

print("\
Stage 5 complete: ecosystem health scoring ready.")`,
      challenge: "Add a validation step that compares this stage output against an independent data source.",
      successHint: "This stage is complete and ready to feed into the next pipeline stage.",
    },
    {
      title: "Stage 6: Complete river assessment report with management recommendations",
      concept: "Stage 6 of the capstone builds on the previous stages. Stage 6: Complete river assessment report with management recommendations. This stage handles data ingestion, processing, model application, and output generation with quality metrics at each step.\n\nThe implementation follows software engineering best practices: modular design, error handling, and comprehensive documentation. Each function has a clear interface, and the pipeline produces both results and quality assessments.",
      analogy: "This stage is like adding a new sensor to an instrument: each component must work reliably on its own and integrate seamlessly with the rest. The whole is greater than the sum of its parts because the pipeline produces insights that no individual stage can generate alone.",
      storyConnection: "The braided river in the story constantly shifted its channels — sometimes gently, sometimes catastrophically in floods. Our model captures that dynamic behavior: predicting where the river will flow next, which banks will erode, and how the ecosystem responds to change.",
      checkQuestion: "What is the most critical quality check at this stage?",
      checkAnswer: "Every stage must validate its inputs and flag anomalies. A pipeline that silently produces wrong results is worse than one that crashes — at least a crash tells you something is wrong. The quality check at this stage is to compare output distributions against expected ranges and flag any value that falls outside 3 standard deviations of historical norms.",
      codeIntro: "Build this pipeline stage with quality metrics.",
      code: `import numpy as np

np.random.seed(42)

# === Stage 6: Complete River Assessment Report ===

# Integrate all previous stages into a final assessment

print("=" * 65)
print("   BRAIDED RIVER CHANNEL EVOLUTION ASSESSMENT REPORT")
print("   Simulated Brahmaputra-type River System")
print("=" * 65)

# --- Section 1: Hydrology ---
print("\
1. HYDROLOGICAL SUMMARY")
print("-" * 40)
annual_peaks = np.random.lognormal(np.log(25000), 0.4, 30)
print(f"  Record length:      30 years")
print(f"  Mean annual peak:   {np.mean(annual_peaks):,.0f} m3/s")
print(f"  Max recorded:       {np.max(annual_peaks):,.0f} m3/s")
print(f"  100-yr design flood: {np.percentile(annual_peaks, 99):,.0f} m3/s (est)")

# --- Section 2: Sediment ---
print("\
2. SEDIMENT BUDGET")
print("-" * 40)
sed_in = 1200 + np.random.normal(0, 100)
sed_out = 1050 + np.random.normal(0, 80)
storage = sed_in - sed_out
print(f"  Annual input:       {sed_in:,.0f} kt/yr")
print(f"  Annual output:      {sed_out:,.0f} kt/yr")
print(f"  Net storage change: {storage:+,.0f} kt/yr")
print(f"  Status:             {'Aggrading' if storage > 50 else 'Degrading' if storage < -50 else 'Near equilibrium'}")

# --- Section 3: Channel morphology ---
print("\
3. CHANNEL MORPHOLOGY")
print("-" * 40)
bi = 4.2 + np.random.normal(0, 0.5)
sinuosity = 1.12 + np.random.normal(0, 0.03)
wd_ratio = 850 + np.random.normal(0, 100)
migration = 18 + np.random.normal(0, 5)
print(f"  Braiding index:     {bi:.1f}")
print(f"  Sinuosity:          {sinuosity:.2f}")
print(f"  Width/depth ratio:  {wd_ratio:.0f}")
print(f"  Avg migration rate: {migration:.0f} m/yr")
print(f"  Channel type:       {'Braided' if bi > 2 and wd_ratio > 40 else 'Transitional'}")

# --- Section 4: Ecosystem ---
print("\
4. ECOSYSTEM HEALTH")
print("-" * 40)
metrics = {"Braiding Index": (bi, 80), "Connectivity": (0.65, 75),
           "Vegetation": (0.45, 85), "Water Quality": (6.5, 70)}
scores = []
for name, (val, score) in metrics.items():
    score += np.random.randint(-5, 5)
    scores.append(score)
    grade = "Good" if score >= 70 else "Fair" if score >= 50 else "Poor"
    print(f"  {name:<22} Score: {score}/100  ({grade})")
overall_eco = np.mean(scores)
print(f"  Overall health:     {overall_eco:.0f}/100")

# --- Section 5: Risk assessment ---
print("\
5. RISK ASSESSMENT (30-year horizon)")
print("-" * 40)
# Monte Carlo migration
migrations = np.cumsum(np.random.normal(migration, 10, (500, 30)), axis=1)
max_migrations = np.max(np.abs(migrations), axis=1)

print(f"  {'Threshold':<20} {'P(exceed in 30yr)':<20} {'Risk Level'}")
print(f"  {'-'*55}")
for thresh, use in [(100, "Farmland"), (250, "Roads"), (500, "Buildings"), (1000, "Town center")]:
    p = np.mean(max_migrations > thresh) * 100
    risk = "HIGH" if p > 50 else "MODERATE" if p > 20 else "LOW"
    print(f"  {thresh:>4}m ({use:<12})  {p:>6.1f}%              {risk}")

# --- Section 6: Recommendations ---
print("\
6. MANAGEMENT RECOMMENDATIONS")
print("-" * 40)
recommendations = []

if storage > 50:
    recommendations.append("AGGRADATION: Channel is building up. Monitor for avulsion risk.")
if migration > 20:
    recommendations.append("HIGH MIGRATION: Enforce 500m setback for permanent structures.")
if overall_eco < 70:
    recommendations.append("ECOSYSTEM: Restore floodplain connectivity; remove obsolete embankments.")
if np.mean(max_migrations > 250) > 0.3:
    recommendations.append("FLOOD RISK: Relocate infrastructure within 250m migration zone.")

recommendations.append("MONITORING: Satellite imagery every 6 months to track channel changes.")
recommendations.append("COMMUNITY: Early warning system for monsoon flood stages.")

for i, rec in enumerate(recommendations, 1):
    print(f"  {i}. {rec}")

# --- Summary ---
print(f"\
{'=' * 65}")
print(f"  ASSESSMENT COMPLETE")
print(f"  River type: Braided (BI={bi:.1f})")
print(f"  Health score: {overall_eco:.0f}/100")
print(f"  Primary risk: Channel migration ({migration:.0f} m/yr average)")
print(f"  Recommendation: {'Maintain natural dynamics' if overall_eco > 70 else 'Targeted restoration needed'}")
print(f"{'=' * 65}")`,
      challenge: "Add an interactive mode where the user can adjust parameters and see results update in real time. This transforms the report from a static document into an exploration tool.",
      successHint: "You have completed a full capstone project. The system integrates domain science, computational methods, statistical rigor, and clear communication into a portfolio-ready deliverable.",
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (braided river dynamics)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project uses Python with numpy and matplotlib to build a complete River Channel Evolution Model. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cpu className="w-5 h-5" />Load Python + NumPy</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L4-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint}
            />
        ))}
      </div>
    </div>
  );
}
