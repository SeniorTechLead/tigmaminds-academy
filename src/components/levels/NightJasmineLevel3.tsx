import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function NightJasmineLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Circadian rhythms — the internal clock of plants',
      concept: `The night jasmine (Nyctanthes arbor-tristis) opens its flowers at dusk and drops them at dawn. This is not a passive response to darkness — it is driven by an **internal circadian clock** that runs on an approximately 24-hour cycle even in constant conditions.

The plant circadian clock consists of interlocking **transcription-translation feedback loops (TTFLs)**:

1. **Morning genes** (CCA1, LHY): peak at dawn, activate evening genes, repress themselves
2. **Evening genes** (TOC1, GI): peak at dusk, activate morning genes, repress themselves
3. This creates an oscillation: morning genes ON -> evening genes ON -> morning genes ON -> ...

The clock is **entrained** by light (through photoreceptors) and temperature. Entrainment synchronizes the internal ~24h cycle to the actual 24h day. Without entrainment, the clock "free-runs" at its natural period (which is rarely exactly 24.0 hours).

Why have a clock? **Anticipation**. A plant that waits for darkness to start producing scent molecules is too late — the moths are already flying. A plant with a clock starts producing scent BEFORE dusk, so molecules are ready exactly when pollinators arrive. The clock allows the plant to prepare for predictable environmental changes.`,
      analogy: 'The circadian clock is like your alarm system. You do not wait for the morning light to start waking up — your body starts raising cortisol, blood sugar, and heart rate 1-2 hours BEFORE your alarm goes off. That is anticipation driven by an internal clock. If you fly to a different time zone, your clock takes days to re-synchronize (jet lag). Plants experience the same thing when seasons change — they must gradually shift their clock to match the new day length.',
      storyConnection: 'The night jasmine in the story opens its flowers precisely at dusk — not a minute early, not a minute late. This precision is not magic. It is the output of a molecular clock that has been ticking inside every cell of the plant since it germinated. The clock tells the flower: "It is time. Open now. The moths are coming."',
      checkQuestion: 'You grow a night jasmine in a sealed room with constant darkness. Will it still open its flowers on a ~24-hour cycle?',
      checkAnswer: 'Yes, for several days to weeks. The circadian clock is endogenous — it runs without external cues. In constant darkness, the plant will continue to open and close flowers on an approximately 24-hour cycle (called "free-running"). However, without the entraining signal of light, the cycle will gradually drift — it might be 23.5 or 24.7 hours instead of exactly 24. Over weeks, the opening time will shift noticeably. This was first demonstrated by de Mairan in 1729 with mimosa leaves.',
      codeIntro: 'Model a circadian oscillator using coupled differential equations and visualize the 24-hour gene expression cycle.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Circadian clock model: Goodwin oscillator (simplified TTFL)
# dx/dt = v1 * K^n / (K^n + z^n) - d1 * x  (morning gene mRNA)
# dy/dt = v2 * x - d2 * y  (morning protein)
# dz/dt = v3 * y - d3 * z  (evening protein, represses morning gene)

def circadian_oscillator(hours, params=None):
    if params is None:
        params = {
            'v1': 1.0, 'K': 1.0, 'n': 4,  # Hill function parameters
            'v2': 0.5, 'v3': 0.5,
            'd1': 0.1, 'd2': 0.1, 'd3': 0.1,
        }

    dt = 0.1
    steps = int(hours / dt)
    t = np.arange(steps) * dt

    x = np.zeros(steps)  # morning mRNA
    y = np.zeros(steps)  # morning protein
    z = np.zeros(steps)  # evening protein

    # Initial conditions
    x[0], y[0], z[0] = 1.0, 0.5, 0.2

    p = params
    for i in range(1, steps):
        dx = p['v1'] * p['K']**p['n'] / (p['K']**p['n'] + z[i-1]**p['n']) - p['d1'] * x[i-1]
        dy = p['v2'] * x[i-1] - p['d2'] * y[i-1]
        dz = p['v3'] * y[i-1] - p['d3'] * z[i-1]

        x[i] = max(0, x[i-1] + dx * dt)
        y[i] = max(0, y[i-1] + dy * dt)
        z[i] = max(0, z[i-1] + dz * dt)

    return t, x, y, z

# Run for 120 hours (5 days)
t, morning_mRNA, morning_protein, evening_protein = circadian_oscillator(120)

# Light entrainment: add a forcing function
def entrained_oscillator(hours, light_period=24):
    params = {
        'v1': 1.0, 'K': 1.0, 'n': 4,
        'v2': 0.5, 'v3': 0.5,
        'd1': 0.1, 'd2': 0.1, 'd3': 0.1,
    }
    dt = 0.1
    steps = int(hours / dt)
    t = np.arange(steps) * dt

    x, y, z = np.zeros(steps), np.zeros(steps), np.zeros(steps)
    light = np.zeros(steps)
    x[0], y[0], z[0] = 1.0, 0.5, 0.2

    p = params
    for i in range(1, steps):
        # Light signal: sinusoidal with period = light_period
        light[i] = max(0, np.sin(2 * np.pi * t[i] / light_period))
        light_boost = 0.3 * light[i]  # light activates morning genes

        dx = p['v1'] * p['K']**p['n'] / (p['K']**p['n'] + z[i-1]**p['n']) + light_boost - p['d1'] * x[i-1]
        dy = p['v2'] * x[i-1] - p['d2'] * y[i-1]
        dz = p['v3'] * y[i-1] - p['d3'] * z[i-1]

        x[i] = max(0, x[i-1] + dx * dt)
        y[i] = max(0, y[i-1] + dy * dt)
        z[i] = max(0, z[i-1] + dz * dt)

    return t, x, y, z, light

t_e, x_e, y_e, z_e, light_e = entrained_oscillator(120, light_period=24)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Free-running oscillation
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.plot(t, morning_mRNA, color='#f59e0b', linewidth=1.5, label='Morning gene (CCA1)')
ax.plot(t, morning_protein, color='#22c55e', linewidth=1.5, label='Morning protein')
ax.plot(t, evening_protein, color='#a855f7', linewidth=1.5, label='Evening protein (TOC1)')
ax.set_xlabel('Hours', color='white')
ax.set_ylabel('Expression level', color='white')
ax.set_title('Free-running circadian oscillator', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Entrained oscillation
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.fill_between(t_e, 0, light_e * max(x_e), alpha=0.1, color='#fbbf24', label='Light')
ax.plot(t_e, x_e, color='#f59e0b', linewidth=1.5, label='Morning gene')
ax.plot(t_e, z_e, color='#a855f7', linewidth=1.5, label='Evening protein')
ax.set_xlabel('Hours', color='white')
ax.set_ylabel('Expression level', color='white')
ax.set_title('Light-entrained oscillator (24h cycle)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Phase portrait
ax = axes[1, 0]
ax.set_facecolor('#111827')
# Plot trajectory in x-z phase space
ax.plot(morning_mRNA[200:], evening_protein[200:], color='#22c55e', linewidth=1, alpha=0.7)
ax.scatter([morning_mRNA[200]], [evening_protein[200]], c='#ef4444', s=50, zorder=5, label='Start')
ax.set_xlabel('Morning gene expression', color='white')
ax.set_ylabel('Evening protein level', color='white')
ax.set_title('Phase portrait: limit cycle oscillation', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Period measurement
ax = axes[1, 1]
ax.set_facecolor('#111827')
# Find peaks to measure period
from_idx = len(t) // 3  # skip transients
peaks = []
for i in range(from_idx + 1, len(morning_mRNA) - 1):
    if morning_mRNA[i] > morning_mRNA[i-1] and morning_mRNA[i] > morning_mRNA[i+1]:
        peaks.append(t[i])

if len(peaks) > 1:
    periods = np.diff(peaks)
    ax.bar(range(len(periods)), periods, color='#3b82f6', edgecolor='none')
    ax.axhline(24, color='#ef4444', linestyle='--', linewidth=2, label='24h reference')
    ax.axhline(np.mean(periods), color='#22c55e', linestyle='--', linewidth=2,
               label=f'Mean period: {np.mean(periods):.1f}h')
    ax.set_xlabel('Cycle number', color='white')
    ax.set_ylabel('Period (hours)', color='white')
    ax.set_title('Free-running period measurement', color='white', fontsize=11)
    ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

mean_period = np.mean(periods) if len(peaks) > 1 else 0
print("CIRCADIAN CLOCK MODEL")
print(f"Free-running period: {mean_period:.1f} hours")
print(f"Deviation from 24h: {abs(mean_period - 24):.1f} hours")
print()
print("The Goodwin oscillator captures the core logic:")
print("  Morning genes -> morning protein -> evening protein -> represses morning genes")
print("  This negative feedback loop with delay creates sustained oscillations.")
print("  Light entrainment synchronizes the ~24h clock to exactly 24h.")`,
      challenge: 'Change the Hill coefficient n from 4 to 2. Does the oscillation persist? There is a critical n below which oscillations die out and the system reaches a steady state. Find the critical value.',
      successHint: 'The circadian clock is one of the most conserved molecular systems across life — from cyanobacteria to humans. The transcription-translation feedback loop architecture is the same. Night jasmine, fruit flies, and humans all tell time using the same basic circuit.',
    },
    {
      title: 'Photoperiodism — how plants measure day length',
      concept: `Night jasmine flowers open when night falls. But how does the plant "know" the day length has changed? This is **photoperiodism** — the ability to measure the relative lengths of day and night.

Plants do not measure light duration directly. Instead, they use the **external coincidence model**:

1. The circadian clock produces a rhythmic protein (say, CONSTANS) that peaks at a specific time of day — let us say 16 hours after dawn.
2. If this protein peak coincides with light (long day), it triggers one response.
3. If the peak falls in darkness (short day), a different response occurs.

Night jasmine is a **short-day plant** (or more accurately, a **long-night plant**) — it needs a sufficiently long uninterrupted dark period to trigger flowering. If you flash light in the middle of the night, you break the dark period and flowering is inhibited.

**Phytochrome** is the light sensor:
- **Pr** (red-absorbing form): inactive, accumulates in darkness
- **Pfr** (far-red-absorbing form): active, produced by red light
- Pfr gradually converts back to Pr in darkness (dark reversion)
- The Pfr:Pr ratio tells the plant whether it is day or night`,
      analogy: 'Photoperiodism is like an hourglass alarm system. The plant starts an hourglass (Pfr converting to Pr) when it gets dark. If the hourglass runs out completely before light returns (long night), the alarm goes off: "Start flowering!" If light interrupts before the hourglass empties, the alarm resets. A brief flash of light in the middle of the night is like someone flipping the hourglass back — the timing restarts. This is why night-break experiments prevent flowering in short-day plants.',
      storyConnection: 'The night jasmine opens precisely at dusk because its phytochrome system detects the shift from Pfr-dominant (daytime) to Pr-dominant (nighttime). The falling Pfr level is the signal that says "night has begun." The flowers have been preparing all afternoon — the phytochrome shift is just the final trigger.',
      checkQuestion: 'A night jasmine receives 10 hours of light and 14 hours of dark (short day / long night). You flash red light for 5 minutes at midnight. Will the flowers open?',
      checkAnswer: 'No. The red light flash converts Pr back to Pfr, effectively "resetting" the dark period. The plant now perceives two short dark periods (5h + 9h) instead of one long dark period (14h). Neither half-period exceeds the critical dark length needed for flowering. This "night-break" experiment was how scientists proved that plants measure night length, not day length. Even 5 minutes of light can cancel 14 hours of darkness.',
      codeIntro: 'Model the phytochrome photoconversion dynamics and simulate the external coincidence model with night-break experiments.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Phytochrome dynamics model
# Pr <-> Pfr conversion
# Light: Pr -> Pfr (fast, proportional to light intensity)
# Dark:  Pfr -> Pr (slow, first-order decay)

def phytochrome_dynamics(hours, day_length=12, night_break=None):
    dt = 0.05
    steps = int(hours / dt)
    t = np.arange(steps) * dt

    Pr = np.zeros(steps)
    Pfr = np.zeros(steps)
    total = 1.0  # Pr + Pfr = constant (conservation)
    Pr[0] = 0.3
    Pfr[0] = 0.7

    light = np.zeros(steps)
    k_light = 2.0  # Pr -> Pfr rate in light
    k_dark = 0.15  # Pfr -> Pr rate in dark (dark reversion)

    for i in range(1, steps):
        hour_of_day = t[i] % 24
        # Is it light?
        is_light = hour_of_day < day_length

        # Night break: flash at specified hour for 0.1h
        if night_break is not None:
            if night_break <= hour_of_day < night_break + 0.1:
                is_light = True

        light[i] = 1.0 if is_light else 0.0

        if is_light:
            # Light: Pr -> Pfr
            conversion = k_light * Pr[i-1] * dt
            Pr[i] = Pr[i-1] - conversion
            Pfr[i] = Pfr[i-1] + conversion
        else:
            # Dark: Pfr -> Pr (reversion)
            reversion = k_dark * Pfr[i-1] * dt
            Pfr[i] = Pfr[i-1] - reversion
            Pr[i] = Pr[i-1] + reversion

    return t, Pr, Pfr, light

# Circadian CONSTANS-like protein (peaks ~16h after dawn)
def constans_rhythm(t, peak_hour=16):
    return 0.5 + 0.5 * np.cos(2 * np.pi * (t % 24 - peak_hour) / 24)

# Run scenarios
scenarios = [
    ('Long day (16L:8D)', 16, None),
    ('Short day (10L:14D)', 10, None),
    ('Short day + night break', 10, 17),  # flash at hour 17 (midnight)
]

fig, axes = plt.subplots(len(scenarios), 2, figsize=(14, 12))
fig.patch.set_facecolor('#1f2937')

flowering_signals = []

for row, (name, day_len, nb) in enumerate(scenarios):
    t, Pr, Pfr, light = phytochrome_dynamics(72, day_length=day_len, night_break=nb)
    co = constans_rhythm(t)

    # Flowering signal: CO protein present AND Pfr is low (night)
    # In short-day plants: flowering when CO peak falls in darkness (low Pfr)
    flowering_signal = co * (1 - Pfr)  # high when CO is high AND it\'s dark
    avg_signal = np.mean(flowering_signal[len(t)//3:])  # average over last 2 days
    flowering_signals.append(avg_signal)

    # Phytochrome dynamics
    ax = axes[row, 0]
    ax.set_facecolor('#111827')
    ax.fill_between(t, 0, light * 1.1, alpha=0.1, color='#fbbf24')
    ax.plot(t, Pfr, color='#ef4444', linewidth=1.5, label='Pfr (active)')
    ax.plot(t, Pr, color='#3b82f6', linewidth=1.5, label='Pr (inactive)')
    ax.set_ylabel('Phytochrome', color='white')
    ax.set_title(name, color='white', fontsize=11)
    ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8, loc='upper right')
    ax.tick_params(colors='gray')
    if row == len(scenarios) - 1:
        ax.set_xlabel('Hours', color='white')

    # External coincidence
    ax = axes[row, 1]
    ax.set_facecolor('#111827')
    ax.fill_between(t, 0, light * 1.1, alpha=0.1, color='#fbbf24', label='Light')
    ax.plot(t, co, color='#a855f7', linewidth=1.5, label='CO protein (clock)')
    ax.plot(t, flowering_signal, color='#22c55e', linewidth=2, label=f'Flowering signal (avg={avg_signal:.2f})')
    ax.axhline(0.3, color='#f59e0b', linestyle='--', alpha=0.5, label='Threshold')
    ax.set_ylabel('Level', color='white')
    ax.set_title(f'External coincidence model', color='white', fontsize=11)
    ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7, loc='upper right')
    ax.tick_params(colors='gray')
    if row == len(scenarios) - 1:
        ax.set_xlabel('Hours', color='white')

plt.tight_layout()
plt.show()

print("PHOTOPERIODISM ANALYSIS")
print(f"{'Scenario':<30} {'Flowering signal':>15} {'Flower?':>10}")
print("-" * 58)
for (name, _, _), sig in zip(scenarios, flowering_signals):
    flowers = "YES" if sig > 0.25 else "NO"
    print(f"{name:<30} {sig:>15.3f} {flowers:>10}")
print()
print("Key insight: the night break cancels flowering even though total dark hours")
print("are nearly unchanged. Plants measure CONTINUOUS dark period, not total darkness.")
print("This proves the external coincidence model: the clock protein must coincide")
print("with darkness for the flowering signal to activate.")`,
      challenge: 'Try a far-red light flash instead of red light during the night break. Far-red converts Pfr back to Pr immediately. Does a far-red night break also cancel flowering? (Hint: it should not, and this was a key experiment in phytochrome research.)',
      successHint: 'Photoperiodism is how plants track seasons. As days shorten in autumn, short-day plants like night jasmine, chrysanthemums, and poinsettias flower. Commercial greenhouses manipulate photoperiod to force flowering year-round — the entire $100B cut flower industry runs on this principle.',
    },
    {
      title: 'Phytochrome signaling cascades — from photon to gene expression',
      concept: `When light hits a phytochrome molecule, the signal must travel from the cell membrane to the nucleus to change gene expression. This **signal transduction cascade** involves multiple steps:

1. **Photon absorption**: phytochrome absorbs red light (660nm), changing its shape from Pr to Pfr
2. **Nuclear translocation**: Pfr moves from the cytoplasm into the nucleus
3. **Protein-protein interaction**: Pfr binds to PIF (Phytochrome Interacting Factor) transcription factors
4. **PIF degradation**: the Pfr-PIF complex is tagged for proteasomal degradation
5. **Gene de-repression**: without PIF repressing them, light-responsive genes turn on
6. **Downstream effects**: hundreds of genes change expression — photosynthesis genes up, shade-avoidance genes modulated, flowering pathway activated or repressed

The cascade has built-in **signal amplification**: one Pfr molecule can bind and degrade multiple PIF proteins, and each PIF protein was repressing hundreds of genes. This is why even a brief flash of light can have dramatic effects.

The cascade also has **temporal filtering**: rapid fluctuations (clouds passing) are filtered out because nuclear translocation takes time. Only sustained light changes propagate through the full cascade.`,
      analogy: 'The phytochrome cascade is like a corporate communication chain. A single observation by the CEO (photon hitting phytochrome) triggers a memo to the VP (nuclear translocation), who calls a meeting (protein interaction), which results in firing an obstructive manager (PIF degradation), which unleashes 50 workers who were being held back (gene de-repression). One photon at the top triggers hundreds of genes at the bottom. And like corporate communication, there is a delay — the signal does not reach the workers instantly.',
      storyConnection: 'When dusk falls and the night jasmine "decides" to open its flowers, the decision cascades through this molecular relay. The last red photons of sunset convert Pfr to its active form one final time. As darkness deepens, Pfr reverts to Pr, PIFs accumulate, and the genes controlling petal opening, scent production, and nectar secretion are activated in sequence.',
      checkQuestion: 'A mutation causes PIF proteins to be resistant to degradation (they cannot be tagged for destruction). What happens to the plant in normal light/dark cycles?',
      checkAnswer: 'The plant behaves as if it is always in the dark, even in full sunlight. PIF proteins normally repress light-responsive genes and are destroyed by Pfr in light. If PIFs cannot be degraded, those genes stay repressed permanently. The plant would be elongated (etiolated), pale (low chlorophyll), and unable to respond to photoperiod. It would look like a seedling grown in the dark — tall, spindly, and yellow. This mutation has been studied extensively in Arabidopsis.',
      codeIntro: 'Model the phytochrome signaling cascade with signal amplification and temporal filtering, tracking each molecular species.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Multi-step signaling cascade model
# Pfr -> nuclear_Pfr -> PIF_complex -> PIF_degradation -> gene_expression

def signaling_cascade(hours, light_pattern='normal_day'):
    dt = 0.02
    steps = int(hours / dt)
    t = np.arange(steps) * dt

    # Molecular species
    Pfr_cytoplasm = np.zeros(steps)
    Pfr_nucleus = np.zeros(steps)
    PIF_free = np.zeros(steps)
    PIF_complex = np.zeros(steps)
    gene_on = np.zeros(steps)
    light = np.zeros(steps)

    # Initial conditions (dawn)
    Pfr_cytoplasm[0] = 0.1
    PIF_free[0] = 1.0

    # Rate constants
    k_photo = 3.0      # Pr -> Pfr in light
    k_revert = 0.15    # Pfr -> Pr in dark
    k_nuclear = 0.5    # cytoplasm -> nucleus translocation
    k_export = 0.1     # nucleus -> cytoplasm export
    k_bind = 2.0       # Pfr + PIF binding
    k_degrade = 1.0    # PIF complex degradation
    k_PIF_synth = 0.3  # PIF synthesis rate
    k_gene_on = 0.8    # gene activation when PIF is low
    k_gene_off = 0.2   # gene deactivation

    for i in range(1, steps):
        hour = t[i] % 24

        # Light pattern
        if light_pattern == 'normal_day':
            light[i] = 1.0 if hour < 12 else 0.0
        elif light_pattern == 'brief_flash':
            light[i] = 1.0 if (hour < 12 or (18 <= hour < 18.05)) else 0.0
        elif light_pattern == 'constant_dark':
            light[i] = 0.0
        elif light_pattern == 'flickering':
            # Simulate clouds: random on/off every few minutes
            light[i] = 1.0 if (hour < 12 and np.sin(t[i] * 20) > 0) else 0.0

        # Phytochrome dynamics
        if light[i] > 0.5:
            photo_rate = k_photo * (1 - Pfr_cytoplasm[i-1]) * dt
        else:
            photo_rate = -k_revert * Pfr_cytoplasm[i-1] * dt

        # Nuclear translocation
        transloc = k_nuclear * Pfr_cytoplasm[i-1] * dt
        export = k_export * Pfr_nucleus[i-1] * dt

        Pfr_cytoplasm[i] = np.clip(Pfr_cytoplasm[i-1] + photo_rate - transloc + export, 0, 1)
        Pfr_nucleus[i] = np.clip(Pfr_nucleus[i-1] + transloc - export, 0, 1)

        # PIF dynamics
        binding = k_bind * Pfr_nucleus[i] * PIF_free[i-1] * dt
        degradation = k_degrade * PIF_complex[i-1] * dt
        synthesis = k_PIF_synth * (1 - PIF_free[i-1]) * dt  # homeostatic synthesis

        PIF_free[i] = np.clip(PIF_free[i-1] - binding + synthesis, 0, 2)
        PIF_complex[i] = np.clip(PIF_complex[i-1] + binding - degradation, 0, 2)

        # Gene expression (inverse of PIF — genes are de-repressed when PIF is low)
        target = 1.0 / (1 + 3 * PIF_free[i])  # sigmoid response
        gene_on[i] = gene_on[i-1] + (target - gene_on[i-1]) * k_gene_on * dt

    return t, light, Pfr_cytoplasm, Pfr_nucleus, PIF_free, PIF_complex, gene_on

patterns = [
    ('Normal 12L:12D', 'normal_day'),
    ('Constant dark', 'constant_dark'),
    ('Night flash at 18h', 'brief_flash'),
    ('Flickering (clouds)', 'flickering'),
]

fig, axes = plt.subplots(4, 2, figsize=(14, 16))
fig.patch.set_facecolor('#1f2937')

for row, (name, pattern) in enumerate(patterns):
    t, light, Pfr_c, Pfr_n, PIF, PIF_cx, gene = signaling_cascade(48, pattern)

    ax = axes[row, 0]
    ax.set_facecolor('#111827')
    ax.fill_between(t, 0, light, alpha=0.1, color='#fbbf24')
    ax.plot(t, Pfr_c, color='#ef4444', linewidth=1.5, label='Pfr (cytoplasm)')
    ax.plot(t, Pfr_n, color='#f59e0b', linewidth=1.5, label='Pfr (nucleus)')
    ax.plot(t, PIF, color='#a855f7', linewidth=1.5, label='PIF (free)')
    ax.set_ylabel('Level', color='white')
    ax.set_title(f'{name} — molecular dynamics', color='white', fontsize=10)
    ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
    ax.tick_params(colors='gray')

    ax = axes[row, 1]
    ax.set_facecolor('#111827')
    ax.fill_between(t, 0, light, alpha=0.1, color='#fbbf24')
    ax.plot(t, gene, color='#22c55e', linewidth=2, label='Gene expression (output)')
    ax.plot(t, 1 - PIF, color='#a855f7', linewidth=1, alpha=0.5, linestyle='--', label='1 - PIF (de-repression)')
    ax.set_ylabel('Gene expression', color='white')
    ax.set_title(f'{name} — gene expression output', color='white', fontsize=10)
    ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
    ax.tick_params(colors='gray')

    if row == 3:
        axes[row, 0].set_xlabel('Hours', color='white')
        axes[row, 1].set_xlabel('Hours', color='white')

plt.tight_layout()
plt.show()

print("SIGNALING CASCADE ANALYSIS")
print()
print("Normal day: Pfr enters nucleus, degrades PIF, genes turn ON in light, OFF at night")
print("Constant dark: PIF stays high, genes stay OFF (etiolated state)")
print("Night flash: brief Pfr pulse degrades some PIF, partial gene activation")
print("Flickering: temporal filter smooths rapid fluctuations — cascade responds to AVERAGE light")
print()
print("The cascade acts as:")
print("  1. Signal AMPLIFIER: 1 Pfr -> many PIF degraded -> hundreds of genes")
print("  2. Temporal FILTER: rapid flickers are smoothed by nuclear translocation delay")
print("  3. Binary SWITCH: PIF acts as a threshold — above it, genes are off; below, they\'re on")`,
      challenge: 'Add a feedback loop where gene expression products stabilize Pfr in the nucleus (positive feedback). How does this change the switching dynamics? Does the system become bistable (having two stable states)?',
      successHint: 'Signal transduction cascades are the computational circuits of cells. They amplify, filter, integrate, and switch — performing logic operations without any silicon or electricity. The same cascade architecture appears in immune signaling, neural transmission, and hormone response.',
    },
    {
      title: 'Volatile organic compounds — the chemistry of jasmine scent',
      concept: `The night jasmine produces its intoxicating fragrance through **volatile organic compounds (VOCs)** — small, low-molecular-weight molecules that evaporate easily and reach your nose through the air.

The key scent compounds in night jasmine include:

- **Methyl benzoate**: sweet, slightly balsamic — the dominant compound
- **Benzyl acetate**: fruity, jasmine-like
- **Linalool**: floral, slightly spicy — shared with lavender and basil
- **Indole**: at low concentration, floral; at high concentration, fecal (this compound is why jasmine has a complex, not purely "sweet" scent)
- **cis-Jasmone**: the quintessential jasmine molecule

These compounds are synthesized through two main pathways:
1. **Mevalonate (MVA) pathway**: produces sesquiterpenes and sterols (cytoplasm)
2. **Methylerythritol phosphate (MEP) pathway**: produces monoterpenes and carotenoid-derived volatiles (plastids)

The synthesis is under circadian control — enzymes peak in the late afternoon so that volatile pools are maximal at dusk when moth pollinators arrive. The compounds are stored in **osmophores** (scent glands) on the petals and released when the flower opens and petal cells expand.`,
      analogy: 'VOC production is like a perfume factory running on a schedule. The raw materials (terpene precursors) are manufactured during the day shift (photosynthesis provides carbon skeletons). The assembly line (biosynthetic enzymes) ramps up in the afternoon shift. The finished perfume (VOCs) is bottled (stored in osmophores) by evening. And the store opens (flower opens, VOCs released) precisely at dusk. Every step is scheduled by the circadian clock for just-in-time delivery.',
      storyConnection: 'The night jasmine\'s secret is not just that it opens at night — it is the precisely timed production of a complex chemical cocktail. The scent that fills the evening air in the story is a mixture of dozens of VOCs, each synthesized by a different enzyme, each enzyme controlled by the circadian clock, all converging to produce one irresistible signal: "Pollinators, come here."',
      checkQuestion: 'Why does jasmine scent contain indole, which smells fecal at high concentrations? Seems like a design flaw.',
      checkAnswer: 'It is not a flaw — it is a feature. Many moth pollinators are also attracted to decaying organic matter (where they lay eggs). Indole at low concentrations adds complexity and depth to the scent, but at trace levels it also mimics rotting-matter cues that attract nocturnal moths. This is chemical mimicry — the flower hijacks the moth neural pathways evolved for finding egg-laying sites. Evolution optimizes for pollinator attraction, not human aesthetic preference.',
      codeIntro: 'Model the biosynthesis and emission dynamics of jasmine VOCs over a 24-hour cycle, showing how the circadian clock coordinates scent production.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# VOC emission model: circadian-controlled enzyme activity drives synthesis
hours = np.linspace(0, 48, 500)

# Circadian enzyme activity peaks in late afternoon (~15:00)
def enzyme_activity(t, peak_hour=15, width=4):
    phase = 2 * np.pi * ((t % 24) - peak_hour) / 24
    return np.clip(0.5 + 0.5 * np.cos(phase), 0, 1) ** 2

# Flower openness (sigmoid at dusk, closes at dawn)
def flower_open(t, open_hour=18, close_hour=6):
    h = t % 24
    # Open from 18:00 to 06:00
    return np.where((h >= open_hour) | (h < close_hour), 1.0, 0.0)

# VOC compounds
compounds = {
    'Methyl benzoate': {'pathway': 'phenylpropanoid', 'peak': 15, 'amount': 1.0, 'color': '#f59e0b'},
    'Benzyl acetate': {'pathway': 'phenylpropanoid', 'peak': 14, 'amount': 0.7, 'color': '#22c55e'},
    'Linalool': {'pathway': 'MEP', 'peak': 16, 'amount': 0.5, 'color': '#3b82f6'},
    'Indole': {'pathway': 'shikimate', 'peak': 17, 'amount': 0.15, 'color': '#a855f7'},
    'cis-Jasmone': {'pathway': 'LOX', 'peak': 15.5, 'amount': 0.4, 'color': '#ef4444'},
}

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Enzyme activity and flower openness
ax = axes[0, 0]
ax.set_facecolor('#111827')
enz = enzyme_activity(hours)
fl_open = flower_open(hours)

# Shade night periods
for day in range(3):
    ax.axvspan(18 + day*24, 30 + day*24, alpha=0.1, color='#3b82f6')

ax.plot(hours, enz, color='#f59e0b', linewidth=2, label='Enzyme activity')
ax.plot(hours, fl_open, color='#22c55e', linewidth=2, label='Flower openness')
ax.set_xlabel('Hours', color='white')
ax.set_ylabel('Level (0-1)', color='white')
ax.set_title('Circadian enzyme activity vs flower opening', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Individual VOC emission profiles
ax = axes[0, 1]
ax.set_facecolor('#111827')
for day in range(3):
    ax.axvspan(18 + day*24, 30 + day*24, alpha=0.05, color='#3b82f6')

for name, data in compounds.items():
    # Synthesis rate depends on enzyme activity
    synth = enzyme_activity(hours, peak_hour=data['peak']) * data['amount']
    # Emission depends on synthesis pool AND flower being open
    # Pool accumulates during afternoon, emitted when flower opens
    pool = np.zeros_like(hours)
    emission = np.zeros_like(hours)
    for i in range(1, len(hours)):
        dt = hours[i] - hours[i-1]
        pool[i] = pool[i-1] + synth[i] * dt
        if fl_open[i] > 0.5:
            emit = pool[i] * 0.3 * dt  # 30% per hour emission rate
            emission[i] = emit / dt  # emission rate
            pool[i] -= emit
        else:
            emission[i] = 0

    ax.plot(hours, emission, color=data['color'], linewidth=1.5, label=name)

ax.set_xlabel('Hours', color='white')
ax.set_ylabel('Emission rate (AU)', color='white')
ax.set_title('VOC emission profiles over 48 hours', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='gray')

# Scent composition at different times
ax = axes[1, 0]
ax.set_facecolor('#111827')
time_points = [12, 19, 22, 3]  # noon, early evening, late night, pre-dawn
time_labels = ['12:00\\n(noon)', '19:00\\n(dusk)', '22:00\\n(night)', '03:00\\n(pre-dawn)']

comp_names = list(compounds.keys())
colors_comp = [compounds[c]['color'] for c in comp_names]

emissions_at_times = []
for tp in time_points:
    # Find closest hour index
    idx = np.argmin(np.abs(hours - tp - 24))  # second day for steady state
    e = []
    for name, data in compounds.items():
        synth = enzyme_activity(hours, peak_hour=data['peak']) * data['amount']
        pool_val = 0
        for i in range(1, idx+1):
            dt_v = hours[i] - hours[i-1]
            pool_val += synth[i] * dt_v
            if fl_open[i] > 0.5:
                pool_val -= pool_val * 0.3 * dt_v
        emit_rate = pool_val * 0.3 if fl_open[idx] > 0.5 else 0
        e.append(emit_rate)
    emissions_at_times.append(e)

x_pos = np.arange(len(time_points))
width = 0.15
for j, (name, color) in enumerate(zip(comp_names, colors_comp)):
    vals = [emissions_at_times[i][j] for i in range(len(time_points))]
    ax.bar(x_pos + j * width, vals, width, color=color, label=name, edgecolor='none')

ax.set_xticks(x_pos + width * 2)
ax.set_xticklabels(time_labels, color='white', fontsize=8)
ax.set_ylabel('Emission rate', color='white')
ax.set_title('Scent composition changes through the night', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='gray')

# Pathway contribution
ax = axes[1, 1]
ax.set_facecolor('#111827')
pathways = {}
for name, data in compounds.items():
    p = data['pathway']
    pathways[p] = pathways.get(p, 0) + data['amount']

ax.pie(pathways.values(), labels=pathways.keys(),
       colors=['#f59e0b', '#22c55e', '#a855f7', '#3b82f6'],
       autopct='%1.0f%%', textprops={'fontsize': 9, 'color': 'white'})
ax.set_title('Biosynthetic pathway contributions', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print("NIGHT JASMINE VOC ANALYSIS")
print()
print("Scent production timeline:")
print("  14:00-17:00: Enzyme activity peaks, VOCs synthesized and stored")
print("  18:00: Flower opens, stored VOCs begin emission")
print("  19:00-22:00: Peak emission period (pollinators most active)")
print("  03:00-06:00: Pools depleted, emission wanes")
print("  06:00: Flower closes and drops")
print()
print("The scent is not constant — its composition changes through the night.")
print("Early: dominated by methyl benzoate (broad attraction)")
print("Late: indole proportion increases (targets persistent moths)")`,
      challenge: 'Add temperature dependence to VOC emission rates (VOCs evaporate faster at higher temperatures). Model how a heat wave shifts the emission peak earlier and changes the scent composition moths encounter.',
      successHint: 'Scent production is one of the most energy-expensive things a flower does. The night jasmine invests heavily in VOCs because its survival depends on attracting nocturnal pollinators that cannot see color. The scent IS the advertisement, and the circadian clock is the media scheduler.',
    },
    {
      title: 'Moth pollination syndrome — co-evolution of flower and pollinator',
      concept: `The night jasmine did not evolve its traits randomly. White petals, strong scent, nocturnal opening, and tubular corolla are all part of the **moth pollination syndrome** — a suite of traits that co-evolved with moth pollinators.

Pollination syndromes are predictable packages:

| Pollinator | Flower color | Scent | Time | Shape | Nectar |
|-----------|-------------|-------|------|-------|--------|
| **Moths** | White/pale | Strong, sweet | Night | Tubular | Deep, copious |
| Butterflies | Bright colors | Mild | Day | Landing platform | Moderate |
| Bees | Blue, yellow, UV | Mild-moderate | Day | Lip/landing pad | Moderate |
| Birds | Red, orange | None | Day | Tubular, robust | Copious, dilute |
| Bats | White, dull | Musty, fermented | Night | Open, robust | Very copious |
| Wind | Green, dull | None | Any | Exposed stamens | None |

The night jasmine hits every moth syndrome trait:
- **White petals**: visible in low light (moths see best in UV and blue)
- **Strong scent**: compensates for poor visual detection at night
- **Tubular corolla**: matches moth proboscis length (ensuring pollen contact)
- **Copious nectar**: rewards moths that must fuel high-energy hovering flight

This is **reciprocal selection**: moths with longer proboscises access deeper flowers; deeper flowers exclude less-effective pollinators. Over millions of years, both flower and moth specialize, creating a tight mutualism.`,
      analogy: 'Pollination syndromes are like restaurant-customer co-evolution. A restaurant (flower) evolves its menu (nectar), decor (color), hours (timing), and entrance size (corolla shape) to attract its target clientele (pollinators). A fine-dining restaurant (moth-pollinated flower) has dim lighting (night), strong aromas (VOCs), elegant narrow entryways (tubular corolla), and generous portions (copious nectar). A food truck (wind-pollinated grass) has no decor at all — it just throws food in the air and hopes someone catches it.',
      storyConnection: 'The night jasmine in the story is not just a flower — it is one half of a partnership millions of years in the making. Its white petals glow in the moonlight to guide moths. Its fragrance carries information: "Nectar here, fresh and abundant." The tubular corolla ensures that only moths with the right proboscis length get rewarded — and in doing so, contact the reproductive parts. Every trait is a signal in an ancient dialogue.',
      checkQuestion: 'Climate change is shifting moth emergence dates earlier. Night jasmine still opens at the same time (controlled by photoperiod). What happens to pollination?',
      checkAnswer: 'Temporal mismatch (phenological mismatch). If moths emerge 2 weeks earlier but jasmine still blooms at the original time, the peak moth activity no longer coincides with peak flowering. Pollination rates drop. This is one of the most serious ecological consequences of climate change — it disrupts co-evolved mutualisms that took millions of years to develop. Some species can adapt their timing; others cannot and face reproductive failure.',
      codeIntro: 'Model the co-evolutionary dynamics between flower tube length and moth proboscis length, and simulate phenological mismatch under climate change.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Co-evolution model: flower tube length vs moth proboscis length
# Each generation, moths that match flower length get more nectar (survive better)
# Flowers that match moth length get more pollination (reproduce better)

def coevolution(n_gen=200, n_pop=100):
    # Initial distributions
    flower_lengths = np.random.normal(15, 3, n_pop)  # mm
    moth_lengths = np.random.normal(12, 3, n_pop)  # mm

    flower_history = [np.mean(flower_lengths)]
    moth_history = [np.mean(moth_lengths)]
    flower_std = [np.std(flower_lengths)]
    moth_std = [np.std(moth_lengths)]

    for gen in range(n_gen):
        # Fitness: moths that match flower length feed successfully
        # Flowers matched by moths get pollinated
        moth_fitness = np.zeros(n_pop)
        flower_fitness = np.zeros(n_pop)

        for i in range(n_pop):
            # Moth i visits random flowers — success if proboscis >= tube length
            visited = np.random.choice(n_pop, 10)
            accessible = flower_lengths[visited] <= moth_lengths[i]
            moth_fitness[i] = np.sum(accessible) / 10

            # Flower i visited by random moths — pollinated if moth can reach nectar
            visitors = np.random.choice(n_pop, 10)
            pollinators = moth_lengths[visitors] >= flower_lengths[i]
            # But flower prefers moths that BARELY fit (ensures pollen contact)
            contact_bonus = np.exp(-0.5 * ((moth_lengths[visitors] - flower_lengths[i]) / 2)**2)
            flower_fitness[i] = np.mean(pollinators * contact_bonus)

        # Selection + reproduction with mutation
        moth_probs = moth_fitness / moth_fitness.sum()
        flower_probs = flower_fitness / (flower_fitness.sum() + 1e-10)

        new_moths = moth_lengths[np.random.choice(n_pop, n_pop, p=moth_probs)]
        new_moths += np.random.normal(0, 0.3, n_pop)  # mutation

        new_flowers = flower_lengths[np.random.choice(n_pop, n_pop, p=flower_probs)]
        new_flowers += np.random.normal(0, 0.3, n_pop)  # mutation

        # Flowers also evolve longer tubes to exclude short-tongued cheaters
        flower_bonus = 0.1 * (np.mean(new_moths) - np.mean(new_flowers))
        new_flowers += flower_bonus

        moth_lengths = np.clip(new_moths, 5, 50)
        flower_lengths = np.clip(new_flowers, 5, 50)

        flower_history.append(np.mean(flower_lengths))
        moth_history.append(np.mean(moth_lengths))
        flower_std.append(np.std(flower_lengths))
        moth_std.append(np.std(moth_lengths))

    return (np.array(flower_history), np.array(moth_history),
            np.array(flower_std), np.array(moth_std))

fl_h, mo_h, fl_s, mo_s = coevolution()

# Phenological mismatch model
def phenology_model(years=50, warming_rate=0.03):
    # Moth emergence driven by temperature (advances with warming)
    # Flower bloom driven by photoperiod (fixed)
    moth_peak = np.zeros(years)
    flower_peak = np.zeros(years)
    overlap = np.zeros(years)

    for yr in range(years):
        warming = warming_rate * yr  # degrees C
        moth_peak[yr] = 150 - 2 * warming + np.random.normal(0, 3)  # day of year (earlier with warming)
        flower_peak[yr] = 155 + np.random.normal(0, 2)  # fixed by photoperiod

        # Overlap: gaussian overlap of two activity windows (width ~10 days)
        gap = abs(moth_peak[yr] - flower_peak[yr])
        overlap[yr] = np.exp(-gap**2 / (2 * 8**2))

    return moth_peak, flower_peak, overlap

moth_peak, flower_peak, overlap = phenology_model()

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Co-evolution trajectory
ax = axes[0, 0]
ax.set_facecolor('#111827')
gens = np.arange(len(fl_h))
ax.plot(gens, fl_h, color='#22c55e', linewidth=2, label='Flower tube length')
ax.fill_between(gens, fl_h - fl_s, fl_h + fl_s, alpha=0.15, color='#22c55e')
ax.plot(gens, mo_h, color='#a855f7', linewidth=2, label='Moth proboscis length')
ax.fill_between(gens, mo_h - mo_s, mo_h + mo_s, alpha=0.15, color='#a855f7')
ax.set_xlabel('Generation', color='white')
ax.set_ylabel('Length (mm)', color='white')
ax.set_title('Co-evolutionary arms race', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Pollination syndrome comparison
ax = axes[0, 1]
ax.set_facecolor('#111827')
syndromes = ['Moth', 'Butterfly', 'Bee', 'Bird', 'Bat', 'Wind']
traits = ['Scent', 'Color\\nbrightness', 'Tube\\nlength', 'Nectar\\nvolume', 'Night\\nactivity']
data = np.array([
    [1.0, 0.3, 0.8, 0.8, 1.0],  # Moth
    [0.3, 0.9, 0.5, 0.5, 0.0],  # Butterfly
    [0.4, 0.7, 0.4, 0.5, 0.0],  # Bee
    [0.0, 0.8, 0.7, 0.9, 0.0],  # Bird
    [0.6, 0.2, 0.3, 1.0, 0.9],  # Bat
    [0.0, 0.1, 0.0, 0.0, 0.0],  # Wind
])

im = ax.imshow(data, cmap='YlOrRd', aspect='auto', vmin=0, vmax=1)
ax.set_xticks(range(len(traits)))
ax.set_xticklabels(traits, color='white', fontsize=8)
ax.set_yticks(range(len(syndromes)))
ax.set_yticklabels(syndromes, color='white', fontsize=9)
ax.set_title('Pollination syndrome trait matrix', color='white', fontsize=11)
for i in range(len(syndromes)):
    for j in range(len(traits)):
        ax.text(j, i, f'{data[i,j]:.1f}', ha='center', va='center',
                fontsize=8, color='black' if data[i,j] > 0.5 else 'white')

# Phenological mismatch
ax = axes[1, 0]
ax.set_facecolor('#111827')
years_arr = np.arange(50)
ax.plot(years_arr, moth_peak, color='#a855f7', linewidth=2, label='Moth emergence (day)')
ax.plot(years_arr, flower_peak, color='#22c55e', linewidth=2, label='Flower bloom (day)')
ax.fill_between(years_arr, moth_peak, flower_peak, alpha=0.15, color='#ef4444')
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Day of year', color='white')
ax.set_title('Phenological mismatch under warming', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Overlap/pollination success
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.plot(years_arr, overlap, color='#f59e0b', linewidth=2)
ax.fill_between(years_arr, 0, overlap, alpha=0.2, color='#f59e0b')
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Pollination success', color='white')
ax.set_title('Pollination success declining with warming', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Add trend line
z = np.polyfit(years_arr, overlap, 1)
ax.plot(years_arr, np.polyval(z, years_arr), '--', color='#ef4444', linewidth=2,
        label=f'Trend: {z[0]*10:.2f}/decade')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)

plt.tight_layout()
plt.show()

print("CO-EVOLUTION RESULTS")
print(f"Initial flower tube: {fl_h[0]:.1f}mm, moth proboscis: {mo_h[0]:.1f}mm")
print(f"Final (gen 200): tube: {fl_h[-1]:.1f}mm, proboscis: {mo_h[-1]:.1f}mm")
print(f"Both increased by ~{fl_h[-1]-fl_h[0]:.0f}mm through arms race")
print()
print(f"CLIMATE CHANGE IMPACT")
print(f"Moth emergence shifted {moth_peak[0]-moth_peak[-1]:.0f} days earlier over 50 years")
print(f"Flower bloom: nearly unchanged (photoperiod-controlled)")
print(f"Pollination success: declined from {overlap[0]:.2f} to {overlap[-1]:.2f}")
print(f"This temporal mismatch threatens moth-pollinated species worldwide.")`,
      challenge: 'Add a generalist pollinator (e.g., a beetle that visits by day) to the model. If moth pollination declines, can generalist pollination compensate? What is the cost (pollen wasted on the wrong species)?',
      successHint: 'Pollination syndromes show that flowers are communication devices optimized for a specific audience. The night jasmine speaks moth — white, fragrant, tubular, nocturnal. When climate change disrupts this conversation, the silence is reproductive failure.',
    },
    {
      title: 'Gene expression cycling — transcriptomics of the circadian clock',
      concept: `In a real plant, the circadian clock controls the expression of **30-50% of all genes**. These genes cycle with different phases — some peak at dawn, others at dusk, others at midnight. The entire transcriptome is a symphony of overlapping waves.

**Transcriptomics** measures mRNA levels for every gene simultaneously using RNA sequencing. When you sample a night jasmine every 2 hours for 48 hours and sequence the RNA, you get a **time-series expression matrix**: rows are genes, columns are time points, values are expression levels.

Analyzing this data requires:

1. **Periodicity detection**: which genes are truly cycling vs. noisy? Use Fourier analysis or the JTK_CYCLE algorithm to test for ~24h periodicity.
2. **Phase clustering**: group genes by when they peak. Dawn-peaking genes might be photosynthesis-related; dusk-peaking genes might control scent production.
3. **Amplitude analysis**: some genes have huge expression swings (10-fold between peak and trough); others oscillate weakly (1.5-fold). Amplitude reflects how tightly the clock controls that gene.
4. **Waveform analysis**: not all genes follow a sinusoidal pattern. Some have sharp on/off switching (square wave), others have asymmetric profiles (rapid rise, slow decline).

The circadian transcriptome is the most comprehensive readout of the clock's output — it tells you what the plant is preparing for at every hour of the day.`,
      analogy: 'The circadian transcriptome is like monitoring all the departments of a 24-hour hospital. The ER (photosynthesis genes) is busiest during the day shift. The cleaning crew (repair genes) works the night shift. The pharmacy (scent biosynthesis) ramps up in the evening. The IT department (DNA replication) runs maintenance at 3 AM when nobody is using the system. Each department has its own schedule, but they are all coordinated by the central administration (the clock).',
      storyConnection: 'When the night jasmine in the story opens its flowers at dusk, it is the visible output of thousands of genes that have been cycling in coordination all day. The scent genes peaked hours earlier to build up volatile pools. The petal-opening genes are activating now. The photosynthesis genes are shutting down. The entire molecular orchestra is playing its evening movement.',
      checkQuestion: 'You find a gene that peaks at 4 AM in night jasmine. What biological function might it serve?',
      checkAnswer: 'Genes peaking at 4 AM (the coldest, darkest hour) are likely involved in: (1) cold stress response (preparing for the temperature minimum), (2) starch mobilization (breaking down starch reserves to fuel respiration when photosynthesis is zero), (3) cell division (many plants concentrate mitosis in the pre-dawn hours when metabolic demand is lowest), or (4) preparation for dawn (pre-loading photosynthetic machinery). The clock anticipates dawn by starting preparations 2-3 hours early.',
      codeIntro: 'Simulate a circadian transcriptome with genes cycling at different phases and amplitudes, then analyze it with Fourier methods.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate circadian transcriptome
n_genes = 200
n_timepoints = 24  # samples every 2 hours for 48h = 24 time points
time_hours = np.linspace(0, 48, n_timepoints)

# Each gene has: phase (when it peaks), amplitude, period, and noise level
phases = np.random.uniform(0, 24, n_genes)  # peak hour
amplitudes = np.random.exponential(2, n_genes) + 0.5  # fold-change
base_expression = np.random.exponential(50, n_genes) + 10  # baseline

# Gene categories
categories = np.random.choice(
    ['photosynthesis', 'scent_biosynthesis', 'defense', 'growth', 'metabolism', 'clock_core'],
    n_genes,
    p=[0.2, 0.15, 0.15, 0.2, 0.2, 0.1]
)

# Category-specific phase preferences
phase_prefs = {
    'photosynthesis': (8, 3),    # peak mid-morning
    'scent_biosynthesis': (16, 2),  # peak late afternoon
    'defense': (22, 4),           # peak night
    'growth': (4, 3),             # peak pre-dawn
    'metabolism': (12, 6),        # variable
    'clock_core': (6, 1),         # tight dawn peak
}

for i in range(n_genes):
    mu, sigma = phase_prefs[categories[i]]
    phases[i] = (np.random.normal(mu, sigma)) % 24

# Generate expression matrix
expression = np.zeros((n_genes, n_timepoints))
for i in range(n_genes):
    signal = base_expression[i] + amplitudes[i] * base_expression[i] * \
             0.5 * (1 + np.cos(2 * np.pi * (time_hours - phases[i]) / 24))
    noise = np.random.normal(0, base_expression[i] * 0.1, n_timepoints)
    expression[i] = np.clip(signal + noise, 0, None)

# Fourier analysis: detect 24h periodicity
def detect_periodicity(expr, time_h):
    """Test each gene for ~24h periodicity using Fourier analysis."""
    n = len(time_h)
    results = []
    for i in range(expr.shape[0]):
        # Detrend
        signal = expr[i] - np.mean(expr[i])
        # FFT
        fft_vals = np.fft.rfft(signal)
        freqs = np.fft.rfftfreq(n, d=(time_h[1]-time_h[0]))
        power = np.abs(fft_vals)**2

        # Find power at ~24h period (frequency = 1/24)
        target_freq = 1.0 / 24.0
        freq_idx = np.argmin(np.abs(freqs - target_freq))
        circadian_power = power[freq_idx]
        total_power = np.sum(power[1:])  # exclude DC
        ratio = circadian_power / (total_power + 1e-10)

        # Phase from FFT
        phase_est = -np.angle(fft_vals[freq_idx]) * 24 / (2 * np.pi) % 24

        results.append({'circadian_power': ratio, 'phase': phase_est,
                        'amplitude': (np.max(expr[i]) - np.min(expr[i])) / np.mean(expr[i])})
    return results

periodicity = detect_periodicity(expression, time_hours)

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')

# Heatmap: genes sorted by phase
phase_order = np.argsort(phases)
ax = axes[0, 0]
ax.set_facecolor('#111827')
sorted_expr = expression[phase_order]
# Normalize each gene to 0-1
norm_expr = (sorted_expr - sorted_expr.min(axis=1, keepdims=True)) / \
            (sorted_expr.max(axis=1, keepdims=True) - sorted_expr.min(axis=1, keepdims=True) + 1e-10)
ax.imshow(norm_expr, aspect='auto', cmap='inferno',
          extent=[0, 48, n_genes, 0])
ax.set_xlabel('Hours', color='white')
ax.set_ylabel('Genes (sorted by phase)', color='white')
ax.set_title('Circadian transcriptome heatmap', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Phase histogram by category
ax = axes[0, 1]
ax.set_facecolor('#111827')
cat_colors = {'photosynthesis': '#22c55e', 'scent_biosynthesis': '#f59e0b',
              'defense': '#ef4444', 'growth': '#3b82f6', 'metabolism': '#94a3b8',
              'clock_core': '#a855f7'}
for cat, color in cat_colors.items():
    cat_phases = phases[categories == cat]
    ax.hist(cat_phases, bins=24, range=(0, 24), alpha=0.5, color=color, label=cat, density=True)
ax.set_xlabel('Peak hour', color='white')
ax.set_ylabel('Density', color='white')
ax.set_title('Gene phase distribution by category', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='gray')

# Example gene traces
ax = axes[0, 2]
ax.set_facecolor('#111827')
for cat in ['photosynthesis', 'scent_biosynthesis', 'clock_core']:
    idx = np.where(categories == cat)[0][0]
    norm_trace = (expression[idx] - expression[idx].min()) / (expression[idx].max() - expression[idx].min())
    ax.plot(time_hours, norm_trace, linewidth=2, color=cat_colors[cat], label=f'{cat} (peak={phases[idx]:.0f}h)')
ax.set_xlabel('Hours', color='white')
ax.set_ylabel('Expression (normalized)', color='white')
ax.set_title('Example gene expression traces', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='gray')

# Circadian power distribution
ax = axes[1, 0]
ax.set_facecolor('#111827')
powers = [p['circadian_power'] for p in periodicity]
ax.hist(powers, bins=40, color='#a855f7', edgecolor='none', alpha=0.7)
ax.axvline(0.3, color='#ef4444', linestyle='--', linewidth=2, label='Significance threshold')
n_rhythmic = sum(1 for p in powers if p > 0.3)
ax.set_xlabel('Circadian power (24h component / total)', color='white')
ax.set_ylabel('Gene count', color='white')
ax.set_title(f'Periodicity: {n_rhythmic}/{n_genes} genes rhythmic', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Phase vs amplitude scatter
ax = axes[1, 1]
ax.set_facecolor('#111827')
for cat, color in cat_colors.items():
    mask = categories == cat
    cat_ampls = [periodicity[i]['amplitude'] for i in range(n_genes) if mask[i]]
    cat_phases_est = [periodicity[i]['phase'] for i in range(n_genes) if mask[i]]
    ax.scatter(cat_phases_est, cat_ampls, c=color, s=20, alpha=0.6, label=cat)
ax.set_xlabel('Estimated phase (hour)', color='white')
ax.set_ylabel('Amplitude (fold-change)', color='white')
ax.set_title('Phase vs amplitude by gene category', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='gray')

# Clock output: percentage of genes active at each hour
ax = axes[1, 2]
ax.set_facecolor('#111827')
hour_bins = np.arange(0, 24, 1)
for cat, color in cat_colors.items():
    mask = categories == cat
    cat_ph = phases[mask]
    counts, _ = np.histogram(cat_ph, bins=24, range=(0, 24))
    ax.plot(hour_bins, counts, color=color, linewidth=2, label=cat)
ax.set_xlabel('Hour of day', color='white')
ax.set_ylabel('Genes peaking', color='white')
ax.set_title('Clock output: when genes peak', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("TRANSCRIPTOME ANALYSIS")
print(f"Total genes: {n_genes}")
print(f"Rhythmic (24h period): {n_rhythmic} ({n_rhythmic/n_genes:.0%})")
print()
print("Peak timing by category:")
for cat in cat_colors:
    cat_ph = phases[categories == cat]
    print(f"  {cat:<25} mean peak = {np.mean(cat_ph):.1f}h +/- {np.std(cat_ph):.1f}h")
print()
print("The circadian clock orchestrates a temporal program:")
print("  Dawn: clock core genes reset, photosynthesis genes activate")
print("  Afternoon: scent biosynthesis genes ramp up, VOC pools fill")
print("  Dusk: defense genes peak, growth genes prepare for night")
print("  Night: growth and repair dominate, starch reserves mobilized")`,
      challenge: 'Simulate a clock mutant where all phases are randomized (no temporal coordination). Compare the "wild type" and "mutant" heatmaps. How would this affect the plant\'s ability to time scent production for moth arrival?',
      successHint: 'The circadian transcriptome reveals that a plant is not doing the same thing at all hours — it is running a highly optimized daily schedule. Understanding this schedule is the foundation for chronobiology, chrono-agriculture, and even chrono-medicine.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Chronobiology & Chemical Ecology
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (plant biology fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib to model circadian rhythms and chemical signaling. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cpu className="w-5 h-5" />Load Python + NumPy</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L3-${i + 1}`} number={i + 1}
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
