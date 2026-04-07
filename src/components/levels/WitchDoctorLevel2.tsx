import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function WitchDoctorLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Pharmacokinetics — what the body does to a drug',
      concept: `Level 1 covered what drugs do to the body (pharmacodynamics). Now we flip the question: what does the body do to the drug? This is **pharmacokinetics** — ADME:

- **Absorption**: drug enters the bloodstream (oral, injection, topical, inhalation)
- **Distribution**: drug travels to tissues via blood (crosses membranes, binds proteins)
- **Metabolism**: liver enzymes break down the drug (often into inactive metabolites)
- **Excretion**: kidneys and liver remove the drug and metabolites from the body

The key metric is **half-life (t₁/₂)**: the time it takes for blood concentration to drop by half.
- Caffeine: ~5 hours (why you can't sleep if you drink coffee at 6 PM)
- Ibuprofen: ~2 hours (take every 4-6 hours)
- Diazepam: ~40 hours (effects last days)

Understanding ADME determines dosing schedules. A drug with a 2-hour half-life needs frequent dosing. A drug with a 40-hour half-life might accumulate dangerously with repeated doses.`,
      analogy: 'ADME is like a package delivery system. Absorption is the package entering the shipping network. Distribution is it traveling to the destination. Metabolism is the recipient opening and processing the contents. Excretion is the packaging being recycled. Half-life is how long until half the package contents are used up.',
      storyConnection: 'The witch doctor instructs the patient to drink the remedy three times a day, at specific intervals. This isn\'t arbitrary — it\'s empirical pharmacokinetics. The healer has observed that the effect wears off after a certain time and must be renewed. Modern dosing schedules do the same thing with mathematical precision.',
      checkQuestion: 'If a drug has a half-life of 4 hours and you take 100mg at 8 AM, how much is left at 8 PM?',
      checkAnswer: '8 AM: 100mg. 12 PM (4 hrs): 50mg. 4 PM (8 hrs): 25mg. 8 PM (12 hrs): 12.5mg. Three half-lives = 12 hours. The general formula: amount_remaining = initial_dose * (0.5)^(time/half_life). After 12 hours: 100 * 0.5^3 = 12.5mg.',
      codeIntro: 'Simulate drug concentration over time with repeated dosing.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Drug parameters
dose = 400  # mg (like ibuprofen)
half_life = 2  # hours
dosing_interval = 6  # hours (every 6 hours)
n_doses = 5
total_time = 36  # hours

# Elimination rate constant
k = np.log(2) / half_life

# Time array (fine resolution)
t = np.linspace(0, total_time, 1000)
concentration = np.zeros_like(t)

# Each dose adds to current concentration
dose_times = [i * dosing_interval for i in range(n_doses)]
for dt in dose_times:
    mask = t >= dt
    concentration[mask] += dose * np.exp(-k * (t[mask] - dt))

fig, ax = plt.subplots(figsize=(12, 6))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827')

ax.plot(t, concentration, color='#3b82f6', linewidth=2)

# Therapeutic range
therapeutic_min = 200
therapeutic_max = 800
ax.axhline(therapeutic_min, color='#22c55e', linestyle='--', alpha=0.7, label=f'Min effective ({therapeutic_min}mg)')
ax.axhline(therapeutic_max, color='#ef4444', linestyle='--', alpha=0.7, label=f'Toxic threshold ({therapeutic_max}mg)')
ax.fill_between(t, therapeutic_min, therapeutic_max, alpha=0.05, color='#22c55e')

# Mark doses
for dt in dose_times:
    ax.axvline(dt, color='#f59e0b', linestyle=':', alpha=0.5)
    idx = np.argmin(np.abs(t - dt))
    ax.annotate(f'Dose: {dose}mg', xy=(dt, concentration[idx]),
                xytext=(dt + 0.5, concentration[idx] + 50),
                color='#f59e0b', fontsize=8)

ax.set_xlabel('Time (hours)', color='white')
ax.set_ylabel('Drug concentration (mg)', color='white')
ax.set_title('Pharmacokinetics: Repeated Dosing Over Time', color='white', fontsize=13)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Drug: half-life = {half_life}h, dose = {dose}mg every {dosing_interval}h")
print(f"After 5 doses, peak concentration: {max(concentration):.0f}mg")
print(f"Trough (just before next dose): check if above {therapeutic_min}mg")
print()
print("If trough drops below minimum -> patient has periods without effect")
print("If peak rises above maximum -> toxicity risk")
print("Dosing schedule must keep concentration in the green zone.")`,
      challenge: 'Change half-life to 6 hours (slower elimination). Does the drug accumulate dangerously? What if you reduce the dose to 200mg to compensate? Find the combination that stays in the therapeutic range.',
      successHint: 'Every drug label ("take 2 tablets every 4-6 hours") is a pharmacokinetic calculation. The witch doctor\'s "three times daily" instruction is the same idea, refined through observation rather than equations.',
    },
    {
      title: 'Molecular docking — how drugs fit receptors',
      concept: `At the molecular level, a drug works by fitting into a **receptor** — a protein on or inside a cell. This is the **lock-and-key** model, but modern understanding adds nuance: **induced fit**.

The receptor isn't a rigid lock. When the drug (ligand) approaches, both molecules change shape slightly to optimize binding. Think of it as a handshake — both hands adjust.

Key concepts:
- **Binding affinity (Kd)**: how tightly the drug grips the receptor. Lower Kd = tighter binding
- **Agonist**: drug activates the receptor (turns it ON)
- **Antagonist**: drug blocks the receptor (prevents activation)
- **Competitive inhibition**: drug and natural molecule compete for the same binding site
- **Allosteric modulation**: drug binds elsewhere, changing the receptor's shape

**Molecular docking** is a computational technique that predicts how well a molecule fits into a receptor's binding site — like testing thousands of keys in a lock using a computer simulation.`,
      analogy: 'Molecular docking is like trying on shoes. The foot (drug) and shoe (receptor) need to fit well. A good fit (high binding affinity) means the shoe stays on. An agonist is a shoe that lets you run faster. An antagonist is a shoe that\'s stuck and prevents you from putting on any other shoe. Computational docking is like a virtual shoe-fitting app.',
      storyConnection: 'The witch doctor\'s remedies contain multiple compounds, some of which compete for the same receptor sites. When the healer combines two plants, they may be unknowingly exploiting competitive inhibition or synergistic binding — the same principles that pharmaceutical companies spend millions to optimize.',
      checkQuestion: 'Why might a drug that perfectly fits a receptor in a computer simulation fail in clinical trials?',
      checkAnswer: 'The simulation only models binding in isolation. In a real body: (1) the drug might be destroyed by stomach acid before reaching the receptor, (2) liver enzymes might metabolize it too quickly, (3) it might not cross cell membranes, (4) it might bind to OFF-TARGET receptors causing side effects, (5) the receptor in a living cell is in a different environment (pH, temperature, nearby molecules) than the simulation assumed. Docking is step 1 of a long journey.',
      codeIntro: 'Simulate a molecular docking score landscape — how binding energy varies as a ligand explores different orientations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate a 2D binding energy landscape
# x = rotation angle, y = translation offset
x = np.linspace(-180, 180, 200)  # rotation degrees
y = np.linspace(-10, 10, 200)    # translation angstroms
X, Y = np.meshgrid(x, y)

# Energy landscape: multiple local minima (binding poses)
# Global minimum = best binding pose
energy = (5 * np.sin(X/30)**2 + 3 * np.cos(Y/2)**2 +
          0.5 * (X/180)**2 + 0.3 * Y**2 -
          8 * np.exp(-((X-30)**2/500 + (Y-2)**2/5)) -  # best pose
          5 * np.exp(-((X+90)**2/800 + (Y+3)**2/8)) -  # second best
          3 * np.exp(-((X-120)**2/400 + (Y-5)**2/3)))  # third

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Energy landscape
ax1.set_facecolor('#111827')
c = ax1.contourf(X, Y, energy, levels=30, cmap='RdYlGn_r')
ax1.contour(X, Y, energy, levels=15, colors='white', alpha=0.2, linewidths=0.5)

# Mark the best binding poses
best_idx = np.unravel_index(np.argmin(energy), energy.shape)
ax1.plot(X[best_idx], Y[best_idx], '*', color='#f59e0b', markersize=20, label='Best pose')
ax1.set_xlabel('Rotation angle (degrees)', color='white')
ax1.set_ylabel('Translation (angstroms)', color='white')
ax1.set_title('Binding Energy Landscape', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')
cbar = plt.colorbar(c, ax=ax1)
cbar.set_label('Binding energy (kcal/mol)', color='white')
cbar.ax.tick_params(colors='gray')

# Docking scores for 20 candidate molecules
n_candidates = 20
scores = np.random.normal(-6, 2, n_candidates)
scores[3] = -12.5  # one great candidate
scores[11] = -10.2  # another good one
scores = np.sort(scores)

ax2.set_facecolor('#111827')
colors_bar = ['#22c55e' if s < -10 else '#f59e0b' if s < -7 else '#ef4444' for s in scores]
ax2.barh(range(n_candidates), scores, color=colors_bar)
ax2.set_xlabel('Docking score (kcal/mol, more negative = better)', color='white')
ax2.set_ylabel('Candidate molecule', color='white')
ax2.set_title('Virtual Screening: Ranking Drug Candidates', color='white', fontsize=13)
ax2.tick_params(colors='gray')
ax2.axvline(-10, color='#22c55e', linestyle='--', alpha=0.5, label='Strong binder threshold')
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Molecular docking results:")
print(f"  Best candidate score: {min(scores):.1f} kcal/mol")
print(f"  Candidates below -10: {sum(s < -10 for s in scores)} (strong binders)")
print(f"  Candidates above -5: {sum(s > -5 for s in scores)} (weak, discarded)")
print()
print("In drug discovery, you might screen 100,000+ molecules computationally")
print("to find 100 worth testing in the lab. This saves years and millions of dollars.")`,
      challenge: 'Add noise to the binding energy landscape (simulating protein flexibility). Use: energy += np.random.normal(0, 1, energy.shape). Does the best binding pose change? This models the uncertainty in real docking.',
      successHint: 'Computational docking is how modern drug discovery starts. Instead of testing millions of compounds in a lab, computers predict which ones are worth trying. The witch doctor tests a few dozen plants; docking tests millions of molecules in hours.',
    },
    {
      title: 'Synergy and antagonism — when drugs interact',
      concept: `The witch doctor often combines plants in a single remedy. Sometimes the combination works better than either plant alone — this is **synergy**. Sometimes one plant cancels the other — **antagonism**.

Drug interactions follow three patterns:
- **Additive**: 1 + 1 = 2 (effects simply add up)
- **Synergistic**: 1 + 1 = 5 (combination amplifies the effect)
- **Antagonistic**: 1 + 1 = 0.5 (combination reduces the effect)

Real examples:
- **Synergy**: Trimethoprim + Sulfamethoxazole (antibiotics that block two consecutive steps in bacterial metabolism — devastating together)
- **Antagonism**: Calcium + Tetracycline (calcium binds tetracycline in the gut, preventing absorption — why you shouldn't take tetracycline with milk)

Synergy is measured by the **Combination Index (CI)**:
- CI < 1: synergy
- CI = 1: additive
- CI > 1: antagonism`,
      analogy: 'Drug synergy is like two people pushing a stuck car. If they push from the same direction at the same time (synergy), the car moves much more than the sum of their individual pushes. If they push from opposite sides (antagonism), the car barely moves. If they push at different times (additive), the car moves exactly the sum of their pushes.',
      storyConnection: 'The witch doctor combines three plants in a tea — one for fever, one for pain, one for nausea. The combination works better than taking each separately. This isn\'t magic; it\'s multi-target therapy. Modern medicine calls it "combination therapy" and uses it for HIV (antiretroviral cocktails), cancer (chemo regimens), and tuberculosis.',
      checkQuestion: 'Why is grapefruit juice dangerous with many medications?',
      checkAnswer: 'Grapefruit contains furanocoumarins that inhibit CYP3A4, a liver enzyme responsible for metabolizing ~50% of all drugs. When CYP3A4 is blocked, the drug isn\'t broken down as fast, so blood levels rise — potentially to toxic concentrations. A normal dose becomes an overdose. It\'s an unintended drug-food antagonism at the metabolic level.',
      codeIntro: 'Plot an isobologram — the standard tool for visualizing drug synergy.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Isobologram: doses of Drug A vs Drug B that produce 50% effect
# If combination falls BELOW the line: synergy
# If ON the line: additive
# If ABOVE the line: antagonism

# Drug A alone: EC50 = 10 mg
# Drug B alone: EC50 = 20 mg
ec50_a = 10
ec50_b = 20

# Additive line (null hypothesis)
line_a = np.linspace(0, ec50_a, 100)
line_b = ec50_b * (1 - line_a / ec50_a)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Isobologram
ax1.set_facecolor('#111827')
ax1.plot(line_a, line_b, 'w--', linewidth=2, label='Additive (CI=1)')
ax1.fill_between(line_a, line_b, 0, alpha=0.1, color='#22c55e')
ax1.fill_between(line_a, line_b, ec50_b, alpha=0.1, color='#ef4444')

# Synergistic combination (below line)
ax1.plot(3, 5, 'o', color='#22c55e', markersize=12, label='Synergistic (CI=0.55)')
ax1.annotate('3mg A + 5mg B\\\n= 50% effect!', xy=(3, 5), xytext=(4.5, 8),
             color='#22c55e', fontsize=9, arrowprops=dict(arrowstyle='->', color='#22c55e'))

# Antagonistic combination (above line)
ax1.plot(7, 16, 'o', color='#ef4444', markersize=12, label='Antagonistic (CI=1.5)')
ax1.annotate('7mg A + 16mg B\\\n= only 50% effect', xy=(7, 16), xytext=(2, 18),
             color='#ef4444', fontsize=9, arrowprops=dict(arrowstyle='->', color='#ef4444'))

ax1.set_xlabel(f'Drug A dose (mg) [EC50={ec50_a}]', color='white')
ax1.set_ylabel(f'Drug B dose (mg) [EC50={ec50_b}]', color='white')
ax1.set_title('Isobologram: Visualizing Drug Interactions', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')
ax1.text(2, 2, 'SYNERGY\\\nZONE', color='#22c55e', fontsize=12, alpha=0.5)
ax1.text(6, 14, 'ANTAGONISM\\\nZONE', color='#ef4444', fontsize=12, alpha=0.5)

# Combination Index for various ratios
ratios = np.linspace(0, 1, 50)  # fraction of dose that is Drug A
ci_synergy = 0.3 + 0.5 * np.sin(ratios * np.pi)**0.5  # bowl shape, min at ~50:50
ci_antagonism = 1.2 + 0.5 * np.sin(ratios * np.pi)**0.5
ci_additive = np.ones_like(ratios)

ax2.set_facecolor('#111827')
ax2.plot(ratios * 100, ci_synergy, color='#22c55e', linewidth=2, label='Synergistic pair')
ax2.plot(ratios * 100, ci_additive, color='white', linewidth=2, linestyle='--', label='Additive pair')
ax2.plot(ratios * 100, ci_antagonism, color='#ef4444', linewidth=2, label='Antagonistic pair')
ax2.axhline(1.0, color='gray', linestyle=':', alpha=0.3)
ax2.fill_between(ratios * 100, 0, 1, alpha=0.05, color='#22c55e')
ax2.fill_between(ratios * 100, 1, 2, alpha=0.05, color='#ef4444')
ax2.set_xlabel('Drug A fraction of total dose (%)', color='white')
ax2.set_ylabel('Combination Index (CI)', color='white')
ax2.set_title('CI Across Dose Ratios', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')
ax2.set_ylim(0, 2)

plt.tight_layout()
plt.show()

print("Combination Index (CI):")
print("  CI < 1: Synergy (less of each drug needed)")
print("  CI = 1: Additive (no interaction)")
print("  CI > 1: Antagonism (more of each drug needed)")
print()
print(f"Synergistic pair: CI = {min(ci_synergy):.2f} at ~50:50 ratio")
print("  -> Use 30% A + 25% B instead of 100% A or 100% B alone")
print("  -> Less drug, fewer side effects, same efficacy")`,
      challenge: 'The witch doctor\'s remedy has THREE plants. Extend the model to 3D — create a 3D surface where the z-axis is the combination index for three drugs at varying ratios. Use ax = fig.add_subplot(111, projection=\'3d\').',
      successHint: 'Drug combination science is one of the most active areas in pharmacology. HIV treatment uses 3-drug cocktails (HAART), cancer often uses 4+ drugs, and tuberculosis treatment requires 4 antibiotics. The witch doctor\'s multi-plant remedies are the ancestral version of combination therapy.',
    },
    {
      title: 'Pharmacogenomics — why the same drug works differently in different people',
      concept: `Two patients take the same dose of the same drug. One recovers. The other gets severe side effects. Why? **Pharmacogenomics** — the study of how your genes affect your response to drugs.

The key player: **cytochrome P450 (CYP) enzymes** in the liver. These enzymes metabolize most drugs. But the genes encoding these enzymes have variants:
- **Poor metabolizers**: slow CYP enzymes → drug accumulates → overdose risk
- **Normal metabolizers**: standard response (what dosing is based on)
- **Ultra-rapid metabolizers**: fast CYP enzymes → drug cleared too quickly → no effect

Example: Codeine is a prodrug (inactive). CYP2D6 converts it to morphine (active).
- Poor metabolizers: no conversion → codeine doesn't work for pain
- Ultra-rapid metabolizers: too much conversion → morphine overdose (dangerous!)

About **7% of Caucasians** are CYP2D6 poor metabolizers. About **29% of Ethiopians** are ultra-rapid metabolizers. The same pill, at the same dose, has completely different effects based on ancestry.`,
      analogy: 'CYP enzymes are like different-speed blenders. Give three blenders the same apple (drug). Blender 1 (poor metabolizer) barely chops it — big chunks remain (drug accumulates). Blender 2 (normal) makes a smooth smoothie (correct metabolism). Blender 3 (ultra-rapid) liquefies it in seconds (drug disappears before it can work). Same apple, same recipe, wildly different results.',
      storyConnection: 'The witch doctor observes that the same remedy works for most villagers but makes one person sicker. Rather than blaming bad spirits, a pharmacogenomic understanding reveals that this person\'s liver enzymes process the plant compounds differently. Individual variation in drug response is genetic, not mystical.',
      checkQuestion: 'If you know a patient is a CYP2D6 ultra-rapid metabolizer, should you increase or decrease the dose of codeine?',
      checkAnswer: 'Neither — you should avoid codeine entirely and choose a different painkiller (like ibuprofen or acetaminophen) that doesn\'t depend on CYP2D6. Increasing the dose of an ultra-rapid metabolizer would increase morphine production even further (more dangerous). Decreasing might make it ineffective. The right answer is to pick a drug that bypasses the problematic enzyme.',
      codeIntro: 'Simulate how CYP2D6 metabolizer status affects drug concentration over time.',
      code: `import numpy as np
import matplotlib.pyplot as plt

time = np.linspace(0, 24, 500)  # hours
dose = 100  # mg

# Metabolism rates for different CYP2D6 phenotypes
# Half-life varies by metabolizer type
phenotypes = {
    'Poor metabolizer': {'half_life': 12, 'color': '#ef4444', 'pct': '7%'},
    'Normal metabolizer': {'half_life': 4, 'color': '#22c55e', 'pct': '77%'},
    'Ultra-rapid metabolizer': {'half_life': 1.5, 'color': '#3b82f6', 'pct': '5%'},
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Drug concentration over time
ax1.set_facecolor('#111827')
therapeutic_min = 20
therapeutic_max = 80
ax1.axhspan(therapeutic_min, therapeutic_max, alpha=0.1, color='#22c55e')
ax1.axhline(therapeutic_min, color='#22c55e', linestyle=':', alpha=0.5)
ax1.axhline(therapeutic_max, color='#ef4444', linestyle=':', alpha=0.5)

for name, props in phenotypes.items():
    k = np.log(2) / props['half_life']
    conc = dose * np.exp(-k * time)
    ax1.plot(time, conc, color=props['color'], linewidth=2,
             label=f'{name} (t½={props["half_life"]}h)')

ax1.set_xlabel('Time (hours)', color='white')
ax1.set_ylabel('Drug concentration (mg)', color='white')
ax1.set_title('Same Dose, Different Genes, Different Outcomes', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')
ax1.text(15, 60, 'Toxic zone', color='#ef4444', fontsize=9, alpha=0.7)
ax1.text(15, 40, 'Therapeutic zone', color='#22c55e', fontsize=9, alpha=0.7)
ax1.text(15, 10, 'Ineffective zone', color='gray', fontsize=9, alpha=0.7)

# Population distribution of metabolizer types
ax2.set_facecolor('#111827')
labels = ['Ultra-rapid\\\n(5%)', 'Rapid\\\n(11%)', 'Normal\\\n(77%)', 'Poor\\\n(7%)']
sizes = [5, 11, 77, 7]
bar_colors = ['#3b82f6', '#60a5fa', '#22c55e', '#ef4444']
bars = ax2.bar(labels, sizes, color=bar_colors, width=0.6)
ax2.set_ylabel('Population percentage (%)', color='white')
ax2.set_title('CYP2D6 Phenotype Distribution (Caucasians)', color='white', fontsize=12)
ax2.tick_params(colors='gray')
for bar, s in zip(bars, sizes):
    ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1,
             f'{s}%', ha='center', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print("Pharmacogenomics explains why 'one size fits all' dosing fails:")
print("  Poor metabolizer: drug stays too long -> toxicity")
print("  Ultra-rapid: drug cleared too fast -> no effect")
print()
print("FDA now recommends genetic testing before prescribing:")
print("  - Codeine (CYP2D6)")
print("  - Warfarin (CYP2C9 + VKORC1)")
print("  - Clopidogrel (CYP2C19)")
print("  - Tamoxifen (CYP2D6)")
print()
print("The future: your genome sequence on your medical record,")
print("and every prescription tailored to your genetics.")`,
      challenge: 'Add a fourth phenotype: "intermediate metabolizer" with half-life 7 hours (16% of population). How does their concentration curve compare? Are they closer to normal or poor?',
      successHint: 'Pharmacogenomics is the bridge between the witch doctor\'s observation that "this remedy works for most but not all" and modern precision medicine. The underlying reason is always genetics — and now we can test for it before prescribing.',
    },
    {
      title: 'Drug design — from molecule to medicine',
      concept: `Modern drug design follows a pipeline that transforms a molecular idea into a pill on the pharmacy shelf:

1. **Target identification** (1-2 years): Find the protein/receptor involved in the disease
2. **Hit discovery** (1-2 years): Screen thousands of compounds for binding
3. **Lead optimization** (2-3 years): Modify the best "hit" to improve potency, selectivity, safety
4. **Preclinical testing** (1-2 years): Test in cell cultures and animal models
5. **Phase I clinical trial**: Safety in healthy volunteers (20-80 people)
6. **Phase II clinical trial**: Efficacy and dose-finding in patients (100-300 people)
7. **Phase III clinical trial**: Large-scale efficacy (1,000-3,000 people)
8. **FDA/regulatory review** (1-2 years): Analyze all data
9. **Post-market surveillance**: Monitor for rare side effects

Total: **10-15 years** and **$1-2 billion** from target to pharmacy.

Success rate: only about **1 in 10,000** compounds that enter the pipeline makes it to market.`,
      analogy: 'Drug development is like building a bridge across a canyon. Target ID is surveying the canyon. Hit discovery is testing materials. Lead optimization is designing the blueprint. Preclinical is building a scale model. Phase I-III trials are stress-testing with increasing loads. FDA review is the safety inspection. Post-market surveillance is monitoring the bridge after opening day.',
      storyConnection: 'The witch doctor\'s remedy has been through its own pipeline — just informal and spanning centuries instead of years. Generations of healers identified which plants worked (hit discovery), refined preparations (lead optimization), and observed outcomes across many patients (clinical trials). Modern pharma compresses this into a structured process with controls and statistics.',
      checkQuestion: 'Why do drug companies charge such high prices for new drugs?',
      checkAnswer: 'The $1-2 billion pipeline cost is spread across the one drug that succeeds plus the 9,999 that failed. A company might spend $500 million on a drug that fails in Phase III — total loss. The successes must pay for all the failures. Additionally, patents expire after 20 years, and generics take over. So the company has a limited window to recoup costs. This doesn\'t justify ALL pricing (there\'s also profit), but it explains why drug development is inherently expensive.',
      codeIntro: 'Visualize the drug development pipeline — time, cost, and attrition at each stage.',
      code: `import numpy as np
import matplotlib.pyplot as plt

stages = ['Target ID', 'Hit finding', 'Lead optim.', 'Preclinical',
          'Phase I', 'Phase II', 'Phase III', 'FDA review', 'Market']
years = [1.5, 1.5, 2.5, 2, 1.5, 2, 3, 1.5, 0]
cost_millions = [50, 100, 150, 200, 50, 100, 300, 50, 0]
compounds_remaining = [10000, 1000, 200, 50, 10, 5, 2, 1.5, 1]

fig, (ax1, ax2, ax3) = plt.subplots(3, 1, figsize=(12, 10), sharex=True)
fig.patch.set_facecolor('#1f2937')

# Timeline
ax1.set_facecolor('#111827')
cumulative_years = np.cumsum([0] + years[:-1])
colors_stage = plt.cm.viridis(np.linspace(0.2, 0.9, len(stages)))
ax1.barh(range(len(stages)), years, left=cumulative_years, color=colors_stage, height=0.6)
for i, (y, cy) in enumerate(zip(years, cumulative_years)):
    if y > 0:
        ax1.text(cy + y/2, i, f'{y}y', ha='center', va='center', color='white', fontsize=9)
ax1.set_yticks(range(len(stages)))
ax1.set_yticklabels(stages, color='white', fontsize=9)
ax1.set_title('Drug Development Timeline (~14 years total)', color='white', fontsize=13)
ax1.tick_params(colors='gray')
ax1.invert_yaxis()

# Cost
ax2.set_facecolor('#111827')
ax2.bar(range(len(stages)), cost_millions, color=colors_stage, width=0.6)
ax2.set_ylabel('Cost ($M)', color='white')
ax2.set_title(f'Cost at Each Stage (Total: ~{sum(cost_millions):,}M)', color='white', fontsize=13)
ax2.tick_params(colors='gray')

# Attrition funnel
ax3.set_facecolor('#111827')
ax3.semilogy(range(len(stages)), compounds_remaining, 'o-', color='#ef4444', linewidth=2, markersize=8)
ax3.fill_between(range(len(stages)), compounds_remaining, alpha=0.15, color='#ef4444')
ax3.set_xticks(range(len(stages)))
ax3.set_xticklabels(stages, color='gray', rotation=30, ha='right', fontsize=9)
ax3.set_ylabel('Compounds remaining (log scale)', color='white')
ax3.set_title('The Attrition Funnel: 10,000 to 1', color='white', fontsize=13)
ax3.tick_params(colors='gray')
for i, n in enumerate(compounds_remaining):
    label = f'{int(n):,}' if n >= 1 else f'{n}'
    ax3.annotate(label, xy=(i, n), xytext=(i+0.2, n*1.5), color='#f59e0b', fontsize=9)

plt.tight_layout()
plt.show()

print("The brutal reality of drug development:")
print(f"  Start: {compounds_remaining[0]:,} compounds")
print(f"  Market: {compounds_remaining[-1]:.0f} approved drug")
print(f"  Success rate: {compounds_remaining[-1]/compounds_remaining[0]*100:.2f}%")
print(f"  Time: ~{sum(years):.0f} years")
print(f"  Cost: ~{sum(cost_millions):,} million")
print()
print("And that's for ONE drug. Companies run dozens of pipelines simultaneously.")`,
      challenge: 'AI-accelerated drug discovery claims to cut the timeline by 30-50%. Modify the years array to show an AI-accelerated pipeline. Which stages benefit most from AI? (Hint: hit finding and lead optimization.)',
      successHint: 'The drug development pipeline is one of the most expensive, time-consuming, and failure-prone processes in any industry. Understanding it explains why medicines cost what they do, why some diseases have no treatments, and why the witch doctor\'s centuries of accumulated knowledge is irreplaceable — it\'s a pipeline too, just measured in generations.',
    },
    {
      title: 'Traditional knowledge meets modern science — the future of drug discovery',
      concept: `The future of pharmacology lies at the intersection of traditional knowledge and modern technology. Three converging trends:

**1. Ethnobotanical AI**
Machine learning models trained on traditional medicine databases can predict which unstudied plants are most likely to contain active compounds. Input: chemical families, habitats, traditional uses. Output: ranked list of candidates for lab testing.

**2. Synthetic biology**
Once we identify an active compound in a rare plant, we can engineer bacteria or yeast to produce it. This means we don't need to harvest endangered plants. Example: artemisinic acid (malaria drug precursor) is now produced by engineered yeast at scale.

**3. Network pharmacology**
Traditional remedies use multiple compounds hitting multiple targets simultaneously. Modern "network pharmacology" models this mathematically — mapping all the interactions between all compounds and all targets. This explains why traditional multi-herb formulas sometimes outperform single-target drugs.

These approaches validate the witch doctor while augmenting their knowledge with precision and scale.`,
      analogy: 'The future of drug discovery is like GPS navigation built on top of centuries of road knowledge. Local guides (traditional healers) know the terrain intimately. GPS (modern science) adds precision, real-time data, and route optimization. Neither is complete without the other. The best navigation uses both — local knowledge for context, technology for accuracy.',
      storyConnection: 'The witch doctor passes knowledge to the next generation orally. Modern ethnobotany digitizes this knowledge before it\'s lost. The story\'s ending — the healer training an apprentice — is really a race against time. When a healer dies without an apprentice, an irreplaceable database of empirical pharmacology dies with them.',
      checkQuestion: 'If AI can predict which plants contain useful compounds, why do we still need traditional healers?',
      checkAnswer: 'Three reasons: (1) AI predictions need training data — traditional knowledge IS the training data. Without it, the AI has nothing to learn from. (2) Traditional healers know about preparation methods, dosage, timing, and combinations that aren\'t in any database. (3) Many plants haven\'t been catalogued by science at all — only local healers know they exist and where to find them. AI accelerates the search; traditional knowledge provides the map.',
      codeIntro: 'Build a simple ethnobotanical scoring model that ranks unstudied plants by their predicted medicinal potential.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Features of 30 unstudied plants (simulated)
n_plants = 30
plant_names = [f'Plant {i+1}' for i in range(n_plants)]

# Features (0-10 scale):
alkaloid_content = np.random.uniform(0, 10, n_plants)
trad_use_score = np.random.uniform(0, 10, n_plants)  # traditional healer rating
related_species_active = np.random.uniform(0, 10, n_plants)
habitat_biodiversity = np.random.uniform(0, 10, n_plants)
chemical_novelty = np.random.uniform(0, 10, n_plants)

# Weighted scoring model (learned from known medicinal plants)
weights = {'alkaloid': 0.25, 'traditional': 0.30, 'related': 0.20,
           'habitat': 0.10, 'novelty': 0.15}

scores = (weights['alkaloid'] * alkaloid_content +
          weights['traditional'] * trad_use_score +
          weights['related'] * related_species_active +
          weights['habitat'] * habitat_biodiversity +
          weights['novelty'] * chemical_novelty)

# Rank
ranked = np.argsort(scores)[::-1]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 7))
fig.patch.set_facecolor('#1f2937')

# Feature importance
ax1.set_facecolor('#111827')
features = list(weights.keys())
importances = list(weights.values())
colors_feat = ['#22c55e', '#f59e0b', '#3b82f6', '#a855f7', '#ec4899']
ax1.barh(features, importances, color=colors_feat, height=0.5)
ax1.set_xlabel('Weight in prediction model', color='white')
ax1.set_title('What Predicts Medicinal Potential?', color='white', fontsize=13)
ax1.tick_params(colors='gray')
for i, v in enumerate(importances):
    ax1.text(v + 0.01, i, f'{v:.0%}', va='center', color='white', fontsize=10)

# Top 10 candidates
top10 = ranked[:10]
ax2.set_facecolor('#111827')
bar_colors = ['#22c55e' if scores[i] > 7 else '#f59e0b' if scores[i] > 5 else '#3b82f6'
              for i in top10]
ax2.barh([plant_names[i] for i in top10], [scores[i] for i in top10],
         color=bar_colors, height=0.6)
ax2.set_xlabel('Predicted medicinal score', color='white')
ax2.set_title('Top 10 Candidates for Lab Testing', color='white', fontsize=13)
ax2.tick_params(colors='gray')
ax2.invert_yaxis()

plt.tight_layout()
plt.show()

print("Ethnobotanical prediction model:")
print(f"  Highest weight: Traditional healer rating ({weights['traditional']:.0%})")
print(f"  -> The witch doctor's knowledge is the MOST predictive feature!")
print()
print("Top 5 candidates for lab testing:")
for rank, idx in enumerate(ranked[:5]):
    print(f"  #{rank+1} {plant_names[idx]}: score={scores[idx]:.2f}")
    print(f"       Traditional use: {trad_use_score[idx]:.1f}, Alkaloids: {alkaloid_content[idx]:.1f}")
print()
print("Key insight: Traditional knowledge carries the highest weight in the model.")
print("The witch doctor is not obsolete — they're the most valuable data source we have.")`,
      challenge: 'Remove the "traditional use" feature from the model (set weight to 0, redistribute to others). How much do the rankings change? This demonstrates the value of ethnobotanical knowledge quantitatively.',
      successHint: 'From medicinal plants to pharmacokinetics to genomics to AI — you\'ve traced the entire arc of pharmacology. The witch doctor and the computational chemist are on the same continuum: both are trying to find the right molecule, at the right dose, for the right patient. The tools change; the mission doesn\'t.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced Pharmacology & Drug Design</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for advanced pharmacology models. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L2-${i + 1}`} number={i + 1}
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
