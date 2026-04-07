import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function FireflyChemLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Enzyme kinetics of luciferase — Michaelis-Menten in action',
      concept: `Firefly luciferase follows **Michaelis-Menten kinetics** — the fundamental model of enzyme behavior:

**v = Vmax × [S] / (Km + [S])**

where v is the reaction rate, [S] is substrate concentration, Vmax is the maximum rate, and Km is the Michaelis constant (substrate concentration at half-max rate).

For firefly luciferase:
- **Km for luciferin**: ~20 μM (relatively high affinity)
- **Km for ATP**: ~100 μM (lower affinity)
- **kcat** (turnover number): ~0.01 s⁻¹ (slow! — each enzyme molecule produces only ~1 photon every 100 seconds)
- **Product inhibition**: oxyluciferin strongly inhibits the enzyme (Ki ~0.5 μM)

The slow kcat is actually a feature: it prevents the firefly from using up its luciferin too fast. The flash is controlled by oxygen delivery to the light organ, not by enzyme speed. When nerve signals open tracheal tubes, oxygen floods in, the reaction proceeds, and light is emitted. Close the tubes → flash ends.`,
      analogy: 'Luciferase kinetics is like a factory assembly line. Vmax is the maximum production rate (all workers busy). Km is how hard it is to find raw materials — low Km means they\'re easy to find (high affinity). The slow kcat means each worker produces slowly but reliably. Product inhibition is like finished products blocking the workspace — you need to clear them to keep working.',
      storyConnection: 'The firefly\'s flash isn\'t controlled by how much luciferin or luciferase is available — it\'s controlled by oxygen delivery. The enzyme is always ready, the substrate is always present, but the reaction waits for oxygen. This is why firefly flashes are so precisely timed — neural control of tracheal valves acts as a molecular switch.',
      checkQuestion: 'If you double the concentration of luciferin in a test tube with luciferase, does the light output double?',
      checkAnswer: 'Only if [luciferin] << Km (the linear range). At [luciferin] = Km, doubling gives only 33% more output (from 50% to 67% of Vmax). At [luciferin] >> Km, the enzyme is saturated — doubling substrate has almost no effect. This saturation behavior is the hallmark of Michaelis-Menten kinetics, and it\'s why biochemists always measure Km.',
      codeIntro: 'Model and analyze luciferase enzyme kinetics with Michaelis-Menten equations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# 1. Michaelis-Menten curve
ax = axes[0, 0]
ax.set_facecolor('#111827')

Vmax = 10  # relative units
Km = 20  # μM

S = np.linspace(0, 200, 500)
v = Vmax * S / (Km + S)

ax.plot(S, v, color='#84cc16', linewidth=2.5)
ax.axhline(Vmax, color='#f59e0b', linestyle='--', label=f'Vmax = {Vmax}')
ax.axhline(Vmax/2, color='#ef4444', linestyle=':', label=f'Vmax/2')
ax.axvline(Km, color='#ef4444', linestyle=':', label=f'Km = {Km} μM')
ax.plot(Km, Vmax/2, 'o', color='#ef4444', markersize=10)
ax.set_xlabel('[Luciferin] (μM)', color='white')
ax.set_ylabel('Reaction rate (v)', color='white')
ax.set_title('Michaelis-Menten Kinetics', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# 2. Lineweaver-Burk (double reciprocal) plot
ax = axes[0, 1]
ax.set_facecolor('#111827')

S_pos = S[S > 5]  # avoid division by zero
v_pos = Vmax * S_pos / (Km + S_pos)

ax.plot(1/S_pos, 1/v_pos, 'o', color='#84cc16', markersize=3, alpha=0.5)

# Linear fit
x_lb = np.linspace(-0.02, 0.2, 100)
y_lb = (Km / Vmax) * x_lb + 1/Vmax
ax.plot(x_lb, y_lb, color='#3b82f6', linewidth=2, label='Linear fit')

ax.axhline(0, color='#4b5563', linestyle='-', alpha=0.3)
ax.axvline(0, color='#4b5563', linestyle='-', alpha=0.3)
ax.plot(0, 1/Vmax, 'o', color='#f59e0b', markersize=8)
ax.text(0.01, 1/Vmax, f'1/Vmax = {1/Vmax:.2f}', color='#f59e0b', fontsize=9)
ax.plot(-1/Km, 0, 'o', color='#ef4444', markersize=8)
ax.text(-1/Km + 0.005, 0.01, f'-1/Km = {-1/Km:.3f}', color='#ef4444', fontsize=9)

ax.set_xlabel('1/[S] (1/μM)', color='white')
ax.set_ylabel('1/v', color='white')
ax.set_title('Lineweaver-Burk Plot', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')
ax.set_xlim(-0.08, 0.2)

# 3. Product inhibition
ax = axes[1, 0]
ax.set_facecolor('#111827')

Ki = 0.5  # μM (oxyluciferin inhibition constant)
product_concs = [0, 0.5, 2, 5]  # μM oxyluciferin
colors_pi = ['#84cc16', '#22c55e', '#f59e0b', '#ef4444']

for P, color in zip(product_concs, colors_pi):
    # Competitive inhibition: apparent Km increases
    Km_app = Km * (1 + P / Ki)
    v_inh = Vmax * S / (Km_app + S)
    ax.plot(S, v_inh, color=color, linewidth=2, label=f'[Product] = {P} μM')

ax.set_xlabel('[Luciferin] (μM)', color='white')
ax.set_ylabel('Reaction rate', color='white')
ax.set_title(f'Product Inhibition (Ki = {Ki} μM)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax.tick_params(colors='gray')

# 4. Flash simulation with kinetics
ax = axes[1, 1]
ax.set_facecolor('#111827')

dt = 0.001  # seconds
time = np.arange(0, 2, dt)
luciferin = 50.0  # initial μM
atp = 1000.0  # μM (excess)
oxygen = 0.0  # initially no O2
product = 0.0
light = np.zeros_like(time)

for i in range(1, len(time)):
    t = time[i]
    # Oxygen pulse (nerve signal opens trachea at t=0.2s, closes at t=0.5s)
    if 0.2 < t < 0.5:
        oxygen = min(oxygen + 500 * dt, 250)  # O2 floods in
    else:
        oxygen = max(oxygen - 100 * dt, 0)  # O2 consumed/diffuses away

    # Reaction rate (depends on luciferin, ATP, O2, and product inhibition)
    Km_app = Km * (1 + product / Ki)
    rate = Vmax * luciferin / (Km_app + luciferin) * oxygen / (50 + oxygen)

    # Update concentrations
    luciferin -= rate * dt
    product += rate * dt
    light[i] = rate

ax.plot(time * 1000, light / light.max(), color='#84cc16', linewidth=2, label='Light output')
ax.fill_between(time * 1000, light / light.max(), alpha=0.2, color='#84cc16')

# Show oxygen pulse
o2_trace = np.zeros_like(time)
o2 = 0
for i in range(len(time)):
    if 0.2 < time[i] < 0.5: o2 = min(o2 + 500*dt, 250)
    else: o2 = max(o2 - 100*dt, 0)
    o2_trace[i] = o2
ax.plot(time * 1000, o2_trace / o2_trace.max() * 0.3, color='#3b82f6', linewidth=1.5, linestyle='--', label='O₂ pulse')

ax.set_xlabel('Time (ms)', color='white')
ax.set_ylabel('Relative intensity', color='white')
ax.set_title('Simulated Firefly Flash (kinetic model)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Firefly luciferase kinetics:")
print(f"  Km (luciferin): ~{Km} μM")
print(f"  Ki (product inhibition): ~{Ki} μM")
print(f"  kcat: ~0.01 s⁻¹ (very slow)")
print(f"  Flash controlled by: O₂ delivery (neural control of trachea)")
print()
print("Key insight: the enzyme is always ready. The flash is controlled")
print("by oxygen, not by enzyme availability. This enables precise neural")
print("control of flash timing — essential for species-specific signals.")`,
      challenge: 'Add a competitive inhibitor (a drug that blocks the active site). Model it by increasing Km_app further: Km_app = Km × (1 + [P]/Ki + [I]/Ki_inhibitor). How does this affect the flash?',
      successHint: 'Michaelis-Menten kinetics describes every enzyme on Earth. Mastering it with luciferase gives you the tools to understand drug metabolism, genetic engineering, and industrial biotechnology.',
    },
    {
      title: 'ATP and bioluminescence — the energy currency connection',
      concept: `Firefly bioluminescence requires **ATP** (adenosine triphosphate) — the universal energy currency of all living cells. This chemical dependency has been exploited for one of the most important assays in biology:

**ATP bioluminescence assay**: Add firefly luciferase + excess luciferin to a sample. The light output is directly proportional to ATP concentration:

Light ∝ [ATP] (when luciferin is in excess)

Since all living cells contain ATP and dead cells don't, this assay detects **any living organism**:

Applications:
- **Food safety**: Swab a surface, add luciferase → if it glows, there are living bacteria (contamination)
- **Hygiene monitoring**: Hospitals use ATP bioluminescence to verify surface cleaning
- **Water quality**: Detect microbial contamination in drinking water
- **Cell viability**: Measure how many cells survived a treatment
- **Antibiotic susceptibility**: If bacteria are killed by an antibiotic, ATP drops → light drops

The assay is incredibly sensitive: it can detect ~0.1 femtomole of ATP (10⁻¹⁶ moles), equivalent to about 60,000 molecules. A single bacterium contains ~1-10 femtomoles of ATP.`,
      analogy: 'The ATP bioluminescence assay is like a life detector. ATP is the "heartbeat" of cells — if there\'s ATP, something is alive. Luciferase is the "stethoscope" that makes that heartbeat visible as light. No ATP = no light = no life. It\'s the simplest, fastest way to answer the question: "Is anything alive on this surface?"',
      storyConnection: 'The firefly\'s cold light requires ATP — the same molecule that powers every cell in your body. This connection between bioluminescence and cellular energy is what makes the luciferase assay so powerful: by measuring light, you\'re measuring life itself. The firefly\'s chemistry has become humanity\'s universal life-detection system.',
      checkQuestion: 'A hospital uses ATP bioluminescence to check if an operating room surface is clean. The reading is 200 RLU (relative light units). The threshold for "clean" is 100 RLU. What should they do?',
      checkAnswer: 'Re-clean the surface and re-test. 200 RLU means there\'s twice the acceptable amount of biological material (bacteria, body fluids, or other organic matter with ATP). The beauty of the assay: it gives a quantitative result in 15 seconds, so you can clean and re-test immediately — no waiting for overnight bacterial cultures.',
      codeIntro: 'Simulate an ATP bioluminescence assay: calibration curve and bacterial detection.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# 1. ATP standard curve
ax1.set_facecolor('#111827')

# ATP concentrations (femtomoles)
atp_standards = np.array([0, 0.1, 1, 10, 100, 1000, 10000])

# Light output (RLU) - linear over 5 orders of magnitude
sensitivity = 50  # RLU per fmol ATP
background = 10  # RLU (instrument noise)
light_output = sensitivity * atp_standards + background
# Add measurement noise
light_measured = light_output + np.random.normal(0, light_output * 0.05 + 2)
light_measured = np.maximum(light_measured, 0)

ax1.loglog(atp_standards[1:], light_measured[1:], 'o-', color='#84cc16', linewidth=2, markersize=8)
ax1.axhline(background, color='#ef4444', linestyle='--', label=f'Background ({background} RLU)')

# Detection limit
det_limit = 3 * background / sensitivity
ax1.axvline(det_limit, color='#f59e0b', linestyle=':', label=f'Detection limit ({det_limit:.1f} fmol)')

# Mark bacteria equivalent
atp_per_bacterium = 1  # fmol
ax1.axvline(atp_per_bacterium, color='#3b82f6', linestyle=':', alpha=0.5)
ax1.text(atp_per_bacterium * 1.5, 50, '1 bacterium\\\n(~1 fmol ATP)', color='#3b82f6', fontsize=8)

ax1.set_xlabel('ATP (femtomoles)', color='white')
ax1.set_ylabel('Light output (RLU)', color='white')
ax1.set_title('ATP Bioluminescence Standard Curve', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# 2. Antibiotic susceptibility test
ax2.set_facecolor('#111827')

time_hours = np.arange(0, 24, 0.5)

# Untreated bacteria (exponential growth → ATP increases)
growth_rate = 0.3  # per hour
atp_untreated = 100 * np.exp(growth_rate * time_hours)

# Effective antibiotic (bacteria die → ATP drops)
atp_effective = 100 * np.exp(-0.15 * time_hours)
atp_effective[time_hours < 2] = 100  # takes 2 hours to start working

# Resistant bacteria (no effect)
atp_resistant = 100 * np.exp(growth_rate * 0.9 * time_hours)

# Bacteriostatic (stops growth but doesn't kill)
atp_static = 100 * np.ones_like(time_hours)
atp_static[time_hours >= 2] = 100 * np.exp(-0.01 * (time_hours[time_hours >= 2] - 2))

ax2.semilogy(time_hours, atp_untreated, color='#ef4444', linewidth=2, label='No antibiotic')
ax2.semilogy(time_hours, atp_resistant, color='#f59e0b', linewidth=2, label='Resistant strain', linestyle='--')
ax2.semilogy(time_hours, atp_static, color='#3b82f6', linewidth=2, label='Bacteriostatic drug')
ax2.semilogy(time_hours, atp_effective, color='#22c55e', linewidth=2, label='Effective antibiotic')

ax2.axhline(10, color='#4b5563', linestyle=':', alpha=0.3)
ax2.text(23, 12, 'Detection limit', color='#4b5563', fontsize=8, ha='right')

ax2.set_xlabel('Time (hours)', color='white')
ax2.set_ylabel('ATP signal (RLU)', color='white')
ax2.set_title('Antibiotic Susceptibility Test', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("ATP bioluminescence assay:")
print(f"  Sensitivity: ~{det_limit:.1f} femtomoles ATP (detection limit)")
print(f"  That's about {det_limit/atp_per_bacterium:.0f} bacteria")
print(f"  Time to result: 15 seconds (vs 24-48 hours for culture)")
print()
print("Applications:")
print("  Food safety: $2 billion/year market")
print("  Hospital hygiene: real-time surface cleanliness verification")
print("  Antibiotic testing: determine susceptibility in hours, not days")`,
      challenge: 'A food processing plant tests surfaces after cleaning. Before cleaning: 5000 RLU. After: 80 RLU. Threshold: 100 RLU. Is the surface clean? What if the threshold is for a surgical room (10 RLU)?',
      successHint: 'The ATP bioluminescence assay is one of the most commercially important applications of firefly biochemistry. Billions of tests are performed annually, protecting food safety and hospital hygiene worldwide.',
    },
    {
      title: 'Reporter genes — luciferase as a molecular spy',
      concept: `A **reporter gene** is a gene whose product is easy to detect, attached to a gene of interest. When the gene of interest is activated, the reporter is also activated — making the invisible visible.

Firefly **luciferase** is one of the most popular reporter genes because:
- Light output is quantitative (more gene expression → more light)
- No external light source needed (unlike GFP)
- Very low background (cells don't normally glow)
- Extremely sensitive (single-cell detection possible)
- Real-time measurement (flash assay takes seconds)

How it works:
1. Take the **promoter** (on/off switch) of a gene you want to study
2. Attach it to the **luciferase coding sequence**
3. Insert this construct into cells
4. When the gene of interest would normally turn on, luciferase is produced instead
5. Add luciferin → cells glow in proportion to gene activity

This turns invisible molecular events into measurable light signals. Drug companies screen millions of compounds this way: does Drug X turn on Gene Y? Add Drug X to reporter cells, measure light. Done in seconds.`,
      analogy: 'A reporter gene is like a spy wearing a wire. The spy (luciferase gene) infiltrates the cell\'s genetic machinery. Whenever the target gene activates, the spy transmits a signal (light). Researchers sitting outside the cell "listen" to the light signal and know exactly when and how strongly the target gene was activated.',
      storyConnection: 'The firefly\'s luciferase gene has been cloned, modified, and inserted into thousands of other organisms — from bacteria to mice to human cells. It\'s the most widely used bioluminescent reporter in the world. The firefly\'s cold-light chemistry, evolved for mating signals in Assam\'s forests, now drives drug discovery in laboratories worldwide.',
      checkQuestion: 'A researcher makes a luciferase reporter for a cancer gene. In healthy cells, the reporter gives 100 RLU. In cancer cells, it gives 10,000 RLU. What does this tell us?',
      checkAnswer: 'The cancer gene is 100× more active in cancer cells than in healthy cells. This could mean the gene is overexpressed (too many copies or too much transcription). This information is valuable for: (1) understanding what drives the cancer, (2) developing drugs that turn down this gene, (3) using the gene as a diagnostic marker. All from a simple light measurement.',
      codeIntro: 'Simulate a high-throughput drug screen using luciferase reporters.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# 1. High-throughput drug screen (96-well plate)
ax1.set_facecolor('#111827')

# Simulate a 96-well plate (8 rows × 12 columns)
rows, cols = 8, 12
plate = np.zeros((rows, cols))

# Control wells
plate[0, :] = np.random.normal(100, 10, cols)  # untreated (baseline)
plate[7, :] = np.random.normal(10, 3, cols)  # positive control (known inhibitor)

# Test compounds (6 rows × 12 = 72 compounds)
for i in range(1, 7):
    for j in range(cols):
        # Most drugs don't work (signal stays ~100)
        # A few are hits (signal drops significantly)
        is_hit = np.random.rand() < 0.08  # 8% hit rate
        if is_hit:
            plate[i, j] = np.random.normal(25, 8)  # strong inhibitor
        else:
            plate[i, j] = np.random.normal(95, 15)  # no effect

plate = np.clip(plate, 0, None)

im = ax1.imshow(plate, cmap='YlGn_r', aspect='auto', vmin=0, vmax=120)
cbar = plt.colorbar(im, ax=ax1)
cbar.set_label('Luciferase signal (RLU)', color='white')
cbar.ax.tick_params(colors='gray')

# Mark hits
for i in range(rows):
    for j in range(cols):
        if plate[i, j] < 50 and i not in [0, 7]:
            ax1.plot(j, i, 'x', color='#ef4444', markersize=12, markeredgewidth=2)

ax1.set_xticks(range(cols))
ax1.set_xticklabels(range(1, cols+1), color='white', fontsize=8)
ax1.set_yticks(range(rows))
ax1.set_yticklabels(['Control-', 'A', 'B', 'C', 'D', 'E', 'F', 'Control+'],
                     color='white', fontsize=8)
ax1.set_title('Drug Screen: 96-Well Luciferase Assay', color='white', fontsize=12)
ax1.tick_params(colors='gray')
ax1.text(11.5, 0, '(untreated)', color='white', fontsize=7, ha='right')
ax1.text(11.5, 7, '(known drug)', color='white', fontsize=7, ha='right')

# 2. Dose-response curve for a hit compound
ax2.set_facecolor('#111827')

doses = np.logspace(-3, 2, 50)  # μM
baseline = 100  # RLU

# Strong hit (IC50 = 1 μM)
response_strong = baseline / (1 + (doses / 1)**1.5) + 5
response_strong += np.random.normal(0, 3, len(doses))

# Weak hit (IC50 = 10 μM)
response_weak = baseline / (1 + (doses / 10)**1.2) + 5
response_weak += np.random.normal(0, 3, len(doses))

# No effect
response_none = baseline + np.random.normal(0, 5, len(doses))

ax2.semilogx(doses, response_strong, 'o-', color='#22c55e', linewidth=2, markersize=4, label='Hit A (IC₅₀=1μM)')
ax2.semilogx(doses, response_weak, 's-', color='#f59e0b', linewidth=2, markersize=4, label='Hit B (IC₅₀=10μM)')
ax2.semilogx(doses, response_none, '^-', color='#ef4444', linewidth=2, markersize=4, label='Non-hit')

ax2.axhline(baseline, color='#4b5563', linestyle=':', alpha=0.3)
ax2.axhline(baseline/2, color='#3b82f6', linestyle='--', alpha=0.5, label='50% inhibition')

ax2.set_xlabel('Drug concentration (μM)', color='white')
ax2.set_ylabel('Luciferase signal (RLU)', color='white')
ax2.set_title('Dose-Response Curves', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

n_hits = np.sum(plate[1:7, :] < 50)
print(f"Drug screen results:")
print(f"  Compounds tested: 72")
print(f"  Hits identified: {n_hits} (signal < 50% of control)")
print(f"  Hit rate: {n_hits/72*100:.1f}%")
print()
print("Next steps for hits:")
print("  1. Dose-response curve (find IC₅₀)")
print("  2. Counter-screen (rule out false positives)")
print("  3. Mechanism of action studies")
print("  4. Toxicity testing")
print("  5. Lead optimization → clinical trials")`,
      challenge: 'Calculate the Z\' factor for this screen: Z\' = 1 - 3(σ_positive + σ_negative)/(|μ_positive - μ_negative|). A Z\' > 0.5 means the assay is robust. Is this screen good enough?',
      successHint: 'Reporter gene assays are the backbone of modern drug discovery. Every major pharmaceutical company uses luciferase-based screens to find new drugs. The firefly\'s chemistry is literally saving lives by accelerating the discovery of medicines.',
    },
    {
      title: 'Green fluorescent protein — the revolution in cell biology',
      concept: `**GFP** (Green Fluorescent Protein) from the jellyfish *Aequorea victoria* is arguably the most important protein in modern biology. It absorbs blue light (395nm) and emits green light (509nm) — no substrate needed, no enzyme reaction, no cofactors. Just shine blue light and see green glow.

Why GFP is revolutionary:
- **Genetic encoding**: the gene for GFP can be fused to ANY protein gene. The resulting fusion protein glows green AND functions normally.
- **Non-invasive**: GFP doesn't kill cells or require toxic substrates
- **Real-time**: watch proteins move, interact, and change in living cells
- **Variants**: engineered versions now cover the entire visible spectrum: BFP (blue), CFP (cyan), YFP (yellow), mCherry (red)

Applications:
- Track protein localization: where in the cell is protein X?
- Monitor gene expression: when is gene Y turned on?
- Measure protein-protein interactions (FRET between CFP and YFP)
- Create "brainbow" — label every neuron a different color to map brain circuits
- Mark stem cells to track their fate during development`,
      analogy: 'GFP is like a biological GPS tracker. Attach it to any protein, and you can follow that protein\'s every move through the cell — where it goes, when it gets there, and who it interacts with. Before GFP, studying proteins in living cells was like tracking someone by checking their house periodically. With GFP, you have real-time satellite tracking.',
      storyConnection: 'GFP doesn\'t come from a firefly — it comes from a jellyfish. But it\'s part of the same bioluminescence story: the jellyfish uses aequorin (a bioluminescent protein that emits blue light) paired with GFP (which converts the blue to green). The firefly\'s luciferin-luciferase provides bioluminescent reporters; GFP provides fluorescent ones. Together, they\'re the two pillars of biological light technology.',
      checkQuestion: 'Roger Tsien engineered GFP variants in every color of the rainbow. How do you change the color of a fluorescent protein?',
      checkAnswer: 'By mutating amino acids near the chromophore (the light-emitting part of GFP). The chromophore forms spontaneously from three amino acids in the protein\'s interior. Changing the electronic environment around the chromophore shifts its absorption and emission wavelengths. For example, the T203Y mutation (replacing threonine with tyrosine at position 203) shifts emission from green to yellow (YFP). It\'s molecular color engineering.',
      codeIntro: 'Visualize GFP and its variants: excitation/emission spectra and applications.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# 1. Excitation and emission spectra of fluorescent protein variants
ax1.set_facecolor('#111827')
wavelengths = np.linspace(350, 700, 500)

fp_variants = [
    ('BFP', 383, 15, 448, 20, '#3b82f6'),
    ('CFP', 434, 18, 477, 22, '#06b6d4'),
    ('GFP', 395, 20, 509, 25, '#22c55e'),
    ('YFP', 514, 15, 527, 18, '#eab308'),
    ('mCherry', 587, 20, 610, 25, '#ef4444'),
]

for name, ex_peak, ex_width, em_peak, em_width, color in fp_variants:
    excitation = np.exp(-((wavelengths - ex_peak) / ex_width)**2)
    emission = np.exp(-((wavelengths - em_peak) / em_width)**2)
    ax1.plot(wavelengths, excitation, color=color, linewidth=1.5, linestyle='--', alpha=0.5)
    ax1.plot(wavelengths, emission, color=color, linewidth=2, label=f'{name} ({em_peak}nm)')
    ax1.fill_between(wavelengths, emission, alpha=0.1, color=color)

ax1.set_xlabel('Wavelength (nm)', color='white')
ax1.set_ylabel('Relative intensity', color='white')
ax1.set_title('Fluorescent Protein Rainbow', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')

# 2. Simulated "brainbow" — neurons labeled with different colors
ax2.set_facecolor('#020617')

np.random.seed(42)
n_neurons = 25

for _ in range(n_neurons):
    # Random neuron path (branching)
    start_x = np.random.uniform(10, 90)
    start_y = np.random.uniform(10, 90)

    # Random color (combination of 3 fluorescent proteins at random levels)
    r = np.random.uniform(0.2, 1.0)
    g = np.random.uniform(0.2, 1.0)
    b = np.random.uniform(0.2, 1.0)
    color = (r, g, b)

    # Draw neuron body
    ax2.scatter(start_x, start_y, s=50, c=[color], zorder=5, edgecolors='white', linewidths=0.3)

    # Draw axon (random walk)
    n_segments = np.random.randint(10, 30)
    x_path = [start_x]
    y_path = [start_y]
    angle = np.random.uniform(0, 2*np.pi)
    for seg in range(n_segments):
        angle += np.random.normal(0, 0.3)
        step = np.random.uniform(1, 4)
        x_path.append(x_path[-1] + step * np.cos(angle))
        y_path.append(y_path[-1] + step * np.sin(angle))

    ax2.plot(x_path, y_path, color=color, linewidth=0.8, alpha=0.7)

    # Branches
    for branch_start in np.random.choice(range(len(x_path)), size=min(3, len(x_path)), replace=False):
        bx = [x_path[branch_start]]
        by = [y_path[branch_start]]
        ba = angle + np.random.uniform(-1, 1)
        for _ in range(np.random.randint(3, 8)):
            ba += np.random.normal(0, 0.4)
            bx.append(bx[-1] + np.random.uniform(0.5, 2) * np.cos(ba))
            by.append(by[-1] + np.random.uniform(0.5, 2) * np.sin(ba))
        ax2.plot(bx, by, color=color, linewidth=0.4, alpha=0.5)

ax2.set_xlim(0, 100)
ax2.set_ylim(0, 100)
ax2.set_title('"Brainbow" — Each Neuron a Unique Color', color='white', fontsize=13)
ax2.set_xlabel('μm', color='white')
ax2.set_ylabel('μm', color='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Fluorescent protein timeline:")
print("  1962: Shimomura isolates GFP from jellyfish")
print("  1992: Prasher clones the GFP gene")
print("  1994: Chalfie expresses GFP in bacteria and worms")
print("  1995: Tsien engineers color variants (BFP, CFP, YFP)")
print("  2005: Brainbow technique developed (Livet et al.)")
print("  2008: Nobel Prize to Shimomura, Chalfie, Tsien")
print()
print("GFP impact: used in >100,000 published studies")
print("Without GFP, modern cell biology would not exist.")`,
      challenge: 'FRET (Forster Resonance Energy Transfer) occurs when two fluorescent proteins are very close (< 10nm). CFP (donor) transfers energy to YFP (acceptor) without emitting a photon. Design a FRET sensor for protein-protein interaction.',
      successHint: 'GFP is to cell biology what the telescope is to astronomy — it made the invisible visible. The 2008 Nobel Prize recognized that a jellyfish protein had transformed our understanding of life at the molecular level.',
    },
    {
      title: 'Optogenetics — controlling life with light',
      concept: `**Optogenetics** combines optics (light) with genetics (gene modification) to control specific cells in living organisms with millisecond precision.

The key tool: **channelrhodopsin** — a light-activated ion channel from green algae. When illuminated with blue light (470nm), it opens and allows ions to flow, activating the neuron.

How it works:
1. Insert the channelrhodopsin gene into specific neurons (using targeted viral vectors)
2. Implant a tiny fiber optic into the brain
3. Shine blue light → channelrhodopsin opens → neuron fires
4. Turn off light → channel closes → neuron stops

This gives researchers an ON/OFF switch for individual brain circuits. For the first time, we can ask: "What happens if I activate exactly these 100 neurons?" The answer reveals which circuits control which behaviors.

Optogenetics has revealed circuits for:
- Fear and anxiety
- Memory formation
- Reward and addiction
- Motor control
- Sleep/wake cycles

It's also being developed for **medical treatment**: restoring vision in blind patients by making retinal cells light-sensitive (clinical trials underway).`,
      analogy: 'Traditional neuroscience is like investigating a city\'s power grid by shutting down entire neighborhoods (lesion studies) or watching voltage from outside (brain imaging). Optogenetics is like having a switch for every individual wire — you can turn on the lights in exactly one apartment and see what happens. It\'s the difference between a sledgehammer and a scalpel.',
      storyConnection: 'Optogenetics uses light to control biology — the reverse of bioluminescence, where biology creates light. The firefly makes light from chemistry (luciferin → photon). Optogenetics uses light to drive chemistry (photon → ion channel opens → neuron fires). Together, they represent humanity\'s growing mastery of the light-life interface.',
      checkQuestion: 'Channelrhodopsin responds to blue light (470nm). What if you wanted to independently control two different neuron populations — one with blue light and one with another color?',
      checkAnswer: 'Use two different opsins: channelrhodopsin (blue, excitatory) and halorhodopsin (yellow, 590nm, inhibitory). Shine blue → activate population A. Shine yellow → silence population B. You can even control them simultaneously. Newer opsins respond to red light, giving three independent channels. This is "multicolor optogenetics" — each neuron population gets its own color-coded remote control.',
      codeIntro: 'Simulate optogenetic control of neurons: light-driven neural activity.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# 1. Channelrhodopsin activation spectrum
ax = axes[0, 0]
ax.set_facecolor('#111827')
wavelengths = np.linspace(380, 650, 300)

opsins = [
    ('ChR2 (excitatory)', 470, 30, '#3b82f6'),
    ('NpHR (inhibitory)', 590, 25, '#f59e0b'),
    ('ReaChR (red-shifted)', 620, 35, '#ef4444'),
    ('CheRiff (fast)', 460, 20, '#22c55e'),
]

for name, peak, width, color in opsins:
    response = np.exp(-((wavelengths - peak) / width)**2)
    ax.plot(wavelengths, response, color=color, linewidth=2, label=name)
    ax.fill_between(wavelengths, response, alpha=0.1, color=color)

ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_ylabel('Activation', color='white')
ax.set_title('Optogenetic Tool Activation Spectra', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# 2. Light stimulation → neural response
ax = axes[0, 1]
ax.set_facecolor('#111827')

time = np.linspace(0, 2, 2000)  # seconds
dt = time[1] - time[0]

# Light stimulus (3 pulses)
light = np.zeros_like(time)
for t_on in [0.2, 0.6, 1.2]:
    light[(time >= t_on) & (time < t_on + 0.15)] = 1

# Neuron response (integrate-and-fire model with optogenetic input)
membrane_v = np.zeros_like(time)
spikes = []
v_rest = -70  # mV
v_threshold = -40  # mV
tau = 0.02  # membrane time constant
v = v_rest

for i in range(1, len(time)):
    # Optogenetic current
    i_opto = light[i] * 30  # nA when light is on
    # Noisy background
    i_noise = np.random.normal(0, 2)
    # Membrane equation
    dv = (-( v - v_rest) + i_opto + i_noise) / tau * dt
    v += dv
    if v >= v_threshold:
        spikes.append(time[i])
        v = v_rest - 10  # reset
    membrane_v[i] = v

ax.plot(time, light * 20 - 90, color='#3b82f6', linewidth=2, label='Blue light')
ax.plot(time, membrane_v, color='#22c55e', linewidth=1)
for s in spikes:
    ax.plot([s, s], [-40, 20], color='#22c55e', linewidth=1.5)
ax.axhline(v_threshold, color='#ef4444', linestyle=':', alpha=0.3, label='Threshold')
ax.set_xlabel('Time (s)', color='white')
ax.set_ylabel('Membrane potential (mV)', color='white')
ax.set_title('Light → Neural Spikes', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax.tick_params(colors='gray')

# 3. Application: vision restoration
ax = axes[1, 0]
ax.set_facecolor('#111827')

# Simulated visual field: normal vs blind vs optogenetic
field_size = 40
normal_vision = np.random.normal(0.5, 0.1, (field_size, field_size))
# Add a simple scene (bright circle)
yy, xx = np.mgrid[:field_size, :field_size]
scene = 0.8 * np.exp(-((xx-20)**2 + (yy-20)**2) / 50) + 0.1

blind = np.random.normal(0.1, 0.02, (field_size, field_size))

# Optogenetic restoration (lower resolution, some noise)
opto_restored = scene * 0.6 + np.random.normal(0, 0.1, (field_size, field_size))
# Pixelated (lower resolution)
block = 4
for i in range(0, field_size, block):
    for j in range(0, field_size, block):
        opto_restored[i:i+block, j:j+block] = opto_restored[i:i+block, j:j+block].mean()

images = [scene, blind, opto_restored]
titles_img = ['Normal vision', 'Blind (no photoreceptors)', 'Optogenetic restoration']

for idx, (img, title) in enumerate(zip(images, titles_img)):
    x_offset = idx * (field_size + 2)
    ax.imshow(np.clip(img, 0, 1), cmap='gray', extent=[x_offset, x_offset+field_size, 0, field_size])
    ax.text(x_offset + field_size/2, -2, title, ha='center', color='white', fontsize=8)

ax.set_xlim(-2, 3 * (field_size + 2))
ax.set_ylim(-5, field_size + 2)
ax.set_title('Optogenetic Vision Restoration', color='white', fontsize=11)
ax.axis('off')

# 4. Timeline of optogenetics
ax = axes[1, 1]
ax.set_facecolor('#111827')

events = [
    (2002, 'ChR2 discovered\\\nin algae', '#3b82f6'),
    (2005, 'First optogenetic\\\nneuron control', '#22c55e'),
    (2010, 'Fear circuits\\\nmapped', '#f59e0b'),
    (2015, 'Memory cells\\\nactivated', '#a855f7'),
    (2020, 'Human clinical\\\ntrial (blindness)', '#ef4444'),
    (2024, 'Partial vision\\\nrestored', '#ec4899'),
]

for i, (year, label, color) in enumerate(events):
    ax.plot(year, 0, 'o', color=color, markersize=12, zorder=5)
    y_offset = 0.5 if i % 2 == 0 else -0.5
    ax.annotate(label, (year, 0), xytext=(year, y_offset),
                color='white', fontsize=8, ha='center',
                arrowprops=dict(arrowstyle='->', color=color))

ax.axhline(0, color='#4b5563', linewidth=2)
ax.set_xlim(2000, 2026)
ax.set_ylim(-1.5, 1.5)
ax.set_title('Optogenetics Timeline', color='white', fontsize=11)
ax.set_xlabel('Year', color='white')
ax.set_yticks([])
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Optogenetics summary:")
print("  Tool: light-activated ion channels (channelrhodopsin)")
print("  Resolution: single neurons, millisecond timing")
print("  Applications: brain circuit mapping, behavior control")
print("  Medical: vision restoration (clinical trials ongoing)")
print()
print("The connection to bioluminescence:")
print("  Bioluminescence: biology → light (firefly)")
print("  Optogenetics: light → biology (algal rhodopsin)")
print("  Together: complete bidirectional light-life interface")`,
      challenge: 'Could you combine optogenetics with bioluminescence? Imagine making neurons that express BOTH luciferase (to report activity as light) AND channelrhodopsin (to be activated by light from neighbors). This is called "bioluminescence-driven optogenetics" — sketch how it would work.',
      successHint: 'Optogenetics is the inverse of bioluminescence: one makes light from life, the other controls life with light. Together, they represent humanity\'s deepest integration of photonics and biology — a frontier that started with a curious child watching fireflies.',
    },
    {
      title: 'Synthetic biology of light — engineering new glows',
      concept: `**Synthetic biology** aims to engineer biological systems with new functions. For bioluminescence, this means:

**Brighter luciferases**: Directed evolution has created luciferase variants 100× brighter than wild-type firefly luciferase. NanoLuc (from deep-sea shrimp, engineered by Promega) is 150× brighter and 100× smaller than firefly luciferase.

**New colors**: By mutating the luciferase active site or using different luciferin analogs, researchers have created bioluminescent systems emitting in every color from deep blue (420nm) to near-infrared (700nm). NIR is especially valuable for medical imaging because it penetrates tissue better.

**Autonomous bioluminescence**: In 2020, researchers transferred the complete mushroom bioluminescence pathway (caffeic acid cycle) into tobacco plants, creating plants that glow continuously without any external substrate. The plants glow visibly in the dark.

**Bioluminescent materials**: Luciferase proteins embedded in hydrogels, nanoparticles, and thin films create self-powered light sources. Potential applications: emergency lighting (no electricity needed), biological night lights, living architecture.

The ultimate vision: streets lined with glowing trees instead of electric streetlights. Self-illuminating emergency exits. Crops that report their health status by glowing different colors.`,
      analogy: 'Synthetic biology of light is like the transition from finding fire in nature (lightning strikes) to engineering it (matches, lighters, power plants). We started by observing bioluminescence in nature. Now we\'re engineering it: brighter, different colors, new organisms, new applications. We\'re not just copying the firefly — we\'re improving on 100 million years of evolution.',
      storyConnection: 'The firefly\'s cold light was evolution\'s invention. Synthetic biology is humanity\'s extension of that invention: taking the firefly\'s chemistry and engineering it into plants, medical devices, sensors, and materials that the firefly never imagined. From a forest in Assam to a tobacco plant glowing in a laboratory — the same chemistry, reimagined by human creativity.',
      checkQuestion: 'Glowing plants were created in 2020. Could we make glowing trees bright enough to replace streetlights?',
      checkAnswer: 'Not yet. Current glowing plants produce about 10⁸ photons/second — visible in a dark room but far dimmer than a streetlight (which produces ~10¹⁸ photons/second). That\'s a factor of 10 billion. However, brightness has been increasing ~10× per engineering generation, and there\'s no known physical limit (quantum yield can approach 100%). If improvements continue, glowing trees as streetlights might be achievable in 20-50 years.',
      codeIntro: 'Explore the frontier of synthetic bioluminescence: brightness evolution and future projections.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# 1. Brightness evolution of engineered luciferases
ax1.set_facecolor('#111827')

years = [1985, 1990, 1995, 2000, 2005, 2010, 2012, 2015, 2018, 2020, 2023]
brightness = [1, 1.5, 3, 5, 10, 20, 50, 80, 150, 200, 350]  # relative to wild-type
names = ['Wild-type\\\nfirefly', '', 'Click beetle\\\ngreen', '', 'Renilla\\\nimproved',
         '', 'NanoLuc', '', 'teLuc', 'Antares2', 'NanoBRET\\\n3.0']

ax1.semilogy(years, brightness, 'o-', color='#84cc16', linewidth=2.5, markersize=8)
for y, b, n in zip(years, brightness, names):
    if n:
        ax1.annotate(n, (y, b), textcoords="offset points", xytext=(5, 10),
                     color='white', fontsize=7)

# Project future
future_years = np.arange(2023, 2040)
projected = 350 * 2**((future_years - 2023) / 3)  # doubling every 3 years
ax1.semilogy(future_years, projected, '--', color='#84cc16', alpha=0.3)
ax1.fill_between(future_years, projected * 0.3, projected * 3, alpha=0.05, color='#84cc16')

# Streetlight brightness target
streetlight_rel = 1e10  # relative to firefly
ax1.axhline(streetlight_rel, color='#f59e0b', linestyle=':', alpha=0.3)
ax1.text(2038, streetlight_rel * 1.5, 'Streetlight brightness', color='#f59e0b', fontsize=8)

ax1.set_xlabel('Year', color='white')
ax1.set_ylabel('Brightness (× wild-type firefly)', color='white')
ax1.set_title('Engineered Luciferase Brightness Over Time', color='white', fontsize=13)
ax1.tick_params(colors='gray')
ax1.set_ylim(0.5, 1e12)

# 2. Application landscape
ax2.set_facecolor('#111827')

applications = {
    'Medical\\\nimaging': (9, 8, '#22c55e'),
    'Drug\\\nscreening': (10, 9, '#3b82f6'),
    'Environmental\\\nsensors': (6, 7, '#f59e0b'),
    'Glowing\\\nplants': (4, 6, '#84cc16'),
    'Living\\\narchitecture': (2, 9, '#a855f7'),
    'Autonomous\\\nlighting': (1, 10, '#ef4444'),
    'Food safety\\\ntesting': (9, 5, '#06b6d4'),
    'Space\\\nbiosensors': (3, 8, '#ec4899'),
}

for name, (readiness, impact, color) in applications.items():
    ax2.scatter(readiness, impact, s=200, c=color, edgecolors='white', linewidths=1.5, zorder=5)
    ax2.annotate(name, (readiness, impact), textcoords="offset points", xytext=(10, 0),
                 color='white', fontsize=8, va='center')

ax2.set_xlabel('Technology Readiness (1-10)', color='white')
ax2.set_ylabel('Potential Impact (1-10)', color='white')
ax2.set_title('Synthetic Bioluminescence: Applications Landscape', color='white', fontsize=13)
ax2.tick_params(colors='gray')
ax2.set_xlim(0, 11)
ax2.set_ylim(4, 11)

# Quadrant labels
ax2.text(8, 10.5, 'Ready & impactful', color='#22c55e', fontsize=9, ha='center')
ax2.text(2, 10.5, 'High impact, early stage', color='#ef4444', fontsize=9, ha='center')

plt.tight_layout()
plt.show()

print("Synthetic bioluminescence milestones:")
print("  1985: Firefly luciferase gene cloned")
print("  2012: NanoLuc (150× brighter, from deep-sea shrimp)")
print("  2020: Autonomous glowing plants (mushroom pathway in tobacco)")
print("  2023: NanoBRET 3.0 (350× brighter)")
print()
print("The trajectory: brightness doubles every ~3 years")
print("If this continues:")
print("  2030: ~10,000× wild-type (visible from meters away)")
print("  2040: ~1,000,000× (room-level illumination)")
print()
print("From a firefly's flash to engineered living light —")
print("bioluminescence is becoming a technology, not just a curiosity.")`,
      challenge: 'Design a biosensor for water pollution: a bacterium engineered with a luciferase reporter gene linked to a heavy-metal-responsive promoter. When mercury exceeds safe levels, the bacteria glow. Describe the genetic construct and the detection system.',
      successHint: 'From enzyme kinetics to ATP assays to reporter genes to GFP to optogenetics to synthetic biology — the biochemistry of light connects molecular biology, medicine, engineering, and even architecture. The firefly\'s cold light, born in evolution\'s laboratory, is being reimagined in humanity\'s. The story of bioluminescence is far from over — it\'s just beginning.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Biochemistry of Light — some chemistry and biology experience helpful</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for advanced biochemistry simulations. Click to start.</p>
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