import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function CuckooLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Molecular clock mechanisms — the TTFL loop',
      concept: `How does a cell "know" what time it is without a watch? The answer is a **transcription-translation feedback loop (TTFL)** — a molecular circuit that takes approximately 24 hours to complete one cycle.

In mammals, the core loop works like this:
1. **Morning**: The genes *CLOCK* and *BMAL1* produce proteins that pair up and activate the genes *PER* and *CRY*
2. **Afternoon**: PER and CRY proteins accumulate in the cytoplasm
3. **Evening**: PER and CRY enter the nucleus and **inhibit** CLOCK:BMAL1 (the very proteins that made them)
4. **Night**: PER and CRY are slowly degraded by enzymes (phosphorylation by CK1, then ubiquitination)
5. **Dawn**: PER and CRY levels fall low enough that CLOCK:BMAL1 can activate PER/CRY genes again

This negative feedback loop takes ~24 hours because of the time delays built into each step: transcription (making mRNA), translation (making protein), accumulation, nuclear entry, inhibition, and degradation.

The loop is remarkably robust — it runs in every cell of your body, even isolated cells in a dish.`,
      analogy: 'The TTFL is like a thermostat. The heater (CLOCK:BMAL1) warms the room. When the temperature (PER/CRY levels) gets high enough, the thermostat shuts off the heater. The room cools (PER/CRY degrade), and the heater turns back on. The "24-hour" part comes from how slowly the room heats and cools.',
      storyConnection: 'The cuckoo calls at dawn because this molecular loop in its brain cells hits a specific phase at that time. Millions of TTFL loops, running in synchrony across thousands of SCN neurons, create the emergent behaviour of a precisely timed dawn call.',
      checkQuestion: 'A mutation in the PER2 gene causes Familial Advanced Sleep Phase Syndrome (FASPS) — people fall asleep at 7pm and wake at 3am. How could a single gene mutation shift the entire clock?',
      checkAnswer: 'The mutation makes PER2 protein degrade faster (it changes a phosphorylation site that CK1 uses). Faster degradation means the inhibitory phase is shorter, so the whole loop completes faster — in about 22 hours instead of 24. The clock runs fast, so everything shifts earlier. It demonstrates that the period of the loop depends on protein stability.',
      codeIntro: 'Simulate the TTFL molecular clock as a system of differential equations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simplified TTFL model (Goodwin oscillator)
# Variables: mRNA (M), cytoplasmic protein (Pc), nuclear protein (Pn)
# dM/dt = v1 * Ki^n / (Ki^n + Pn^n) - vm * M / (Km + M)
# dPc/dt = ks * M - v2 * Pc / (K2 + Pc)
# dPn/dt = v3 * Pc / (K3 + Pc) - v4 * Pn / (K4 + Pn)

# Parameters tuned for ~24 hour oscillation
v1 = 0.76   # max transcription rate
Ki = 1.0    # inhibition constant
n = 4       # Hill coefficient (cooperativity)
vm = 0.65   # mRNA degradation rate
Km = 0.5
ks = 0.38   # translation rate
v2 = 0.3    # cytoplasmic protein degradation
K2 = 0.2
v3 = 0.7    # nuclear import rate
K3 = 0.2
v4 = 0.35   # nuclear protein degradation
K4 = 0.2

# Euler integration
dt = 0.1  # hours
t_total = 120  # 5 days
steps = int(t_total / dt)

M = np.zeros(steps)
Pc = np.zeros(steps)
Pn = np.zeros(steps)
t = np.zeros(steps)

# Initial conditions
M[0] = 0.5
Pc[0] = 0.5
Pn[0] = 0.5

for i in range(1, steps):
    dM = v1 * Ki**n / (Ki**n + Pn[i-1]**n) - vm * M[i-1] / (Km + M[i-1])
    dPc = ks * M[i-1] - v2 * Pc[i-1] / (K2 + Pc[i-1])
    dPn = v3 * Pc[i-1] / (K3 + Pc[i-1]) - v4 * Pn[i-1] / (K4 + Pn[i-1])

    M[i] = max(0, M[i-1] + dM * dt)
    Pc[i] = max(0, Pc[i-1] + dPc * dt)
    Pn[i] = max(0, Pn[i-1] + dPn * dt)
    t[i] = t[i-1] + dt

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')

# Time series
ax1.set_facecolor('#111827')
ax1.plot(t, M, color='#22c55e', linewidth=2, label='PER/CRY mRNA')
ax1.plot(t, Pc, color='#3b82f6', linewidth=2, label='Cytoplasmic protein')
ax1.plot(t, Pn, color='#ef4444', linewidth=2, label='Nuclear protein (inhibitor)')
ax1.set_xlabel('Time (hours)', color='white')
ax1.set_ylabel('Concentration (a.u.)', color='white')
ax1.set_title('Molecular Clock: TTFL Oscillation', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Phase plot (limit cycle)
ax2.set_facecolor('#111827')
# Skip transient (first 48 hours)
skip = int(48 / dt)
ax2.plot(M[skip:], Pn[skip:], color='#a855f7', linewidth=1.5, alpha=0.8)
ax2.plot(M[skip], Pn[skip], 'o', color='#22c55e', markersize=8, label='Start')
ax2.set_xlabel('mRNA concentration', color='white')
ax2.set_ylabel('Nuclear protein concentration', color='white')
ax2.set_title('Phase Portrait (Limit Cycle)', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

# Estimate period from peaks
from_hour = 48
peaks = []
for i in range(int(from_hour/dt)+1, steps-1):
    if M[i] > M[i-1] and M[i] > M[i+1]:
        peaks.append(t[i])
if len(peaks) >= 2:
    periods = [peaks[j+1]-peaks[j] for j in range(len(peaks)-1)]
    print(f"Estimated period: {np.mean(periods):.1f} hours")
print("The TTFL loop generates self-sustaining ~24h oscillations.")
print("mRNA leads → cytoplasmic protein follows → nuclear protein inhibits → cycle restarts.")`,
      challenge: 'Change n (Hill coefficient) from 4 to 2. What happens to the oscillation? Below a critical n, the oscillations die out entirely — find that threshold.',
      successHint: 'The Hill coefficient determines cooperativity — how switch-like the inhibition is. Without sufficient cooperativity (n < ~3), the system reaches a steady state instead of oscillating. This is a fundamental design principle of biological oscillators.',
    },
    {
      title: 'Photoperiodism — measuring night length, not day length',
      concept: `Plants and animals use day length to time seasonal events: flowering, migration, hibernation, reproduction. This is **photoperiodism**. But here's a counterintuitive finding from the 1930s: organisms actually measure **night length**, not day length.

The evidence: if you interrupt a long night with a brief flash of light, it prevents short-day responses (like autumn flowering). But interrupting a short night with a brief dark period has no effect. The organism is measuring the uninterrupted darkness.

In plants, the mechanism involves **phytochrome** — a pigment that exists in two forms:
- **Pr** (red-absorbing): inactive form, accumulates in darkness
- **Pfr** (far-red-absorbing): active form, produced by sunlight
- During the night, Pfr slowly converts back to Pr
- If the night is long enough, Pfr drops below a threshold → triggers short-day responses (e.g., flowering in chrysanthemums)
- If a flash of red light hits during the night, Pr converts back to Pfr, resetting the timer

This is how plants "know" what season it is — they're measuring how long the night lasts.`,
      analogy: 'Photoperiodism is like an hourglass timer, not a clock. At sunset, the hourglass flips and Pfr starts "draining" (converting to Pr). If sunrise comes before the sand runs out, the plant "knows" it\'s a short night (summer). If the sand runs out completely, it\'s a long night (winter). A flash of light during the night shakes the hourglass and resets it.',
      storyConnection: 'The cuckoo arrives in Assam when days are getting longer (nights shorter) — it\'s responding to photoperiodic changes. The plants that flower in the story\'s village are also responding. The whole ecosystem is synchronized by the same signal: night length.',
      checkQuestion: 'Greenhouse growers use artificial light to make chrysanthemums bloom at any time of year. Based on what you now know, would it be cheaper to (a) extend the day with hours of light, or (b) interrupt the night with a brief flash?',
      checkAnswer: 'Option (b) — a brief flash of light in the middle of the night is far cheaper. It breaks the long night into two short nights, and the plant\'s phytochrome system reads it as "short night = summer = don\'t flower yet." This is actually how commercial growers control flowering schedules — a few minutes of light at midnight.',
      codeIntro: 'Model the phytochrome system: Pfr decay during night, and how night interruption resets the timer.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Phytochrome model
# Pfr decays exponentially in darkness, is instantly restored by light
# Plant flowers when Pfr drops below threshold during a single night

hours = np.linspace(0, 48, 1000)  # 2 days
dt_h = hours[1] - hours[0]

# Parameters
pfr_max = 1.0       # max Pfr level (full sunlight)
decay_rate = 0.15   # Pfr → Pr conversion rate (per hour)
threshold = 0.25    # flowering trigger threshold

# Scenario 1: Summer (short night: 8h dark, sunset 20:00, sunrise 04:00)
# Scenario 2: Winter (long night: 14h dark, sunset 17:00, sunrise 07:00)
# Scenario 3: Long night + light flash at midnight

scenarios = {
    'Summer (8h night)': {'sunset': 20, 'sunrise': 4+24, 'flash': None},
    'Winter (14h night)': {'sunset': 17, 'sunrise': 7+24, 'flash': None},
    'Winter + midnight flash': {'sunset': 17, 'sunrise': 7+24, 'flash': 24.0},
}
colors = {'Summer (8h night)': '#f59e0b', 'Winter (14h night)': '#3b82f6', 'Winter + midnight flash': '#22c55e'}

fig, axes = plt.subplots(3, 1, figsize=(12, 9), sharex=True)
fig.patch.set_facecolor('#1f2937')

for idx, (name, params) in enumerate(scenarios.items()):
    ax = axes[idx]
    ax.set_facecolor('#111827')

    pfr = np.zeros_like(hours)
    pfr[0] = pfr_max  # start at dawn
    is_dark = np.zeros_like(hours, dtype=bool)

    for i in range(1, len(hours)):
        h = hours[i] % 24
        # Determine if it's dark
        s1 = params['sunset']
        s2 = params['sunrise'] % 24
        if s1 > s2:  # sunset after midnight wrap
            dark = h >= s1 or h < s2
        else:
            dark = h >= s1 and h < s2

        # Check for flash
        flash_active = False
        if params['flash'] is not None:
            flash_time = params['flash']
            if abs(hours[i] - flash_time) < 0.25:  # 15 min flash
                flash_active = True

        is_dark[i] = dark and not flash_active

        if is_dark[i]:
            pfr[i] = pfr[i-1] * np.exp(-decay_rate * dt_h)
        else:
            pfr[i] = pfr_max  # light instantly restores Pfr

    ax.plot(hours, pfr, color=colors[name], linewidth=2, label=f'Pfr level')
    ax.axhline(threshold, color='#ef4444', linestyle='--', linewidth=1, label=f'Flowering threshold')

    # Shade dark periods
    for i in range(1, len(hours)):
        if is_dark[i]:
            ax.axvspan(hours[i-1], hours[i], alpha=0.08, color='gray')

    # Check if threshold crossed
    crossed = pfr < threshold
    if np.any(crossed & is_dark):
        first_cross = hours[crossed & is_dark][0]
        ax.annotate('Below threshold!', xy=(first_cross, threshold), color='#ef4444',
                    fontsize=9, fontweight='bold', xytext=(first_cross+2, threshold+0.15),
                    arrowprops=dict(arrowstyle='->', color='#ef4444'))

    if params['flash'] is not None:
        ax.axvline(params['flash'], color='#f59e0b', linewidth=2, alpha=0.7, label='Light flash')

    ax.set_ylabel('Pfr level', color='white')
    ax.set_title(name, color='white', fontsize=11)
    ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8, loc='upper right')
    ax.tick_params(colors='gray')
    ax.set_ylim(0, 1.2)

axes[-1].set_xlabel('Time (hours)', color='white')
plt.tight_layout()
plt.show()

print("Results:")
print("  Summer (8h night): Pfr stays above threshold → no flowering")
print("  Winter (14h night): Pfr drops below threshold → flowering triggered")
print("  Winter + flash: Flash resets Pfr → stays above threshold → no flowering")
print()
print("The plant measures DARKNESS, not light.")
print("A single flash at midnight fools it into thinking it's summer.")`,
      challenge: 'Find the critical night length for this model — the minimum hours of darkness needed for Pfr to drop below threshold. Change the decay rate to see how it shifts.',
      successHint: 'Photoperiodism is the foundation of agriculture — it determines when crops flower, when trees shed leaves, and when birds migrate. Understanding the phytochrome system led to techniques that now feed billions.',
    },
    {
      title: 'Seasonal Affective Disorder — when winter darkens the mind',
      concept: `**Seasonal Affective Disorder (SAD)** affects an estimated 10-20% of people in high-latitude regions. Symptoms include depression, fatigue, carbohydrate craving, social withdrawal, and hypersomnia — and they follow a strict seasonal pattern, typically October to March in the Northern Hemisphere.

The leading hypothesis links SAD to circadian disruption:
- **Phase delay hypothesis**: In winter, reduced light causes the circadian clock to drift later. The misalignment between the clock and the social schedule (work, school) causes depressive symptoms.
- **Melatonin hypothesis**: Longer nights mean longer melatonin secretion, which in some people triggers depressive physiology.
- **Serotonin hypothesis**: Less light means less serotonin production (light stimulates serotonin synthesis in the brain).

The most effective treatment is **bright light therapy**: sitting in front of a 10,000 lux light box for 30 minutes every morning. This works as well as antidepressants in clinical trials for SAD, with fewer side effects. It works by:
1. Resetting the circadian clock to an earlier phase
2. Suppressing melatonin
3. Boosting serotonin`,
      analogy: 'SAD is like a plant that wilts in winter — not from cold, but from insufficient light. The plant\'s clock drifts, its chemistry changes, and it enters a state of dormancy. Light therapy is like a grow lamp — it provides the signal the brain needs to maintain summer-like chemistry.',
      storyConnection: 'The cuckoo departs Assam before winter, avoiding the short days entirely. Humans can\'t migrate, so those living at high latitudes face months of dim light. The cuckoo\'s instinct to fly toward longer days is, in a sense, the bird version of light therapy.',
      checkQuestion: 'SAD is rare near the equator (where Assam is) but common in Scandinavia. Why?',
      checkAnswer: 'Near the equator, day length barely changes across seasons (Assam: ~10.5h to ~13.5h). In Scandinavia (60°N+), winter days can be as short as 5-6 hours, with the sun barely rising above the horizon. The extreme light reduction overwhelms the circadian system\'s ability to compensate. SAD prevalence correlates almost perfectly with latitude.',
      codeIntro: 'Model the relationship between latitude, winter day length, and SAD prevalence.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Day length at winter solstice for different latitudes
latitudes = np.arange(0, 71, 1)  # 0° (equator) to 70°N

# Winter solstice declination: -23.45°
declination = -23.45
dec_rad = np.radians(declination)

day_lengths = []
for lat in latitudes:
    lat_rad = np.radians(lat)
    cos_h = -np.tan(lat_rad) * np.tan(dec_rad)
    cos_h = np.clip(cos_h, -1, 1)
    hour_angle = np.degrees(np.arccos(cos_h))
    dl = 2 * hour_angle / 15
    day_lengths.append(dl)

day_lengths = np.array(day_lengths)

# SAD prevalence (approximate real-world data)
# Roughly follows: prevalence = max(0, a * (12 - day_length)^2)
sad_prevalence = np.clip(0.8 * (12 - day_lengths) ** 2, 0, 30)
# Adjust: near equator it's ~1%, poles it's ~20%+
sad_prevalence = np.clip(sad_prevalence, 1, 25)

# Cities to mark
cities = {
    'Guwahati (26°N)': (26, '#22c55e'),
    'New Delhi (28°N)': (28, '#f59e0b'),
    'London (51°N)': (51, '#3b82f6'),
    'Stockholm (59°N)': (59, '#a855f7'),
    'Tromsø (69°N)': (69, '#ef4444'),
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Day length vs latitude
ax1.set_facecolor('#111827')
ax1.plot(latitudes, day_lengths, color='#f59e0b', linewidth=2.5)
for city, (lat, color) in cities.items():
    dl = day_lengths[lat]
    ax1.plot(lat, dl, 'o', color=color, markersize=8, zorder=5)
    ax1.annotate(f'{city}\
{dl:.1f}h', xy=(lat, dl), xytext=(lat+2, dl+0.5),
                color=color, fontsize=8)

ax1.set_xlabel('Latitude (°N)', color='white')
ax1.set_ylabel('Winter solstice day length (hours)', color='white')
ax1.set_title('Shortest Day of the Year by Latitude', color='white', fontsize=12)
ax1.axhline(12, color='gray', linestyle='--', alpha=0.3)
ax1.tick_params(colors='gray')

# SAD prevalence vs latitude
ax2.set_facecolor('#111827')
ax2.fill_between(latitudes, sad_prevalence, alpha=0.3, color='#8b5cf6')
ax2.plot(latitudes, sad_prevalence, color='#8b5cf6', linewidth=2.5)
for city, (lat, color) in cities.items():
    prev = sad_prevalence[lat]
    ax2.plot(lat, prev, 'o', color=color, markersize=8, zorder=5)
    ax2.annotate(f'{prev:.0f}%', xy=(lat, prev), xytext=(lat+2, prev+1), color=color, fontsize=9)

ax2.set_xlabel('Latitude (°N)', color='white')
ax2.set_ylabel('SAD prevalence (%)', color='white')
ax2.set_title('Seasonal Affective Disorder Prevalence', color='white', fontsize=12)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("The pattern is clear:")
print("  Equator → ~12h winter day → ~1% SAD")
print("  Assam (26°N) → ~10.5h winter day → ~2% SAD")
print("  London (51°N) → ~8h winter day → ~12% SAD")
print("  Stockholm (59°N) → ~6h winter day → ~20% SAD")
print()
print("Treatment: 10,000 lux light box for 30 min each morning")
print("This replaces the missing dawn signal and resets the clock.")`,
      challenge: 'Add a line showing how light therapy shifts the effective "biological day length" for a person at 59°N. If 30 min of 10,000 lux adds the equivalent of 2 hours of daylight, how does it change their SAD risk?',
      successHint: 'SAD is a direct consequence of the circadian system\'s dependence on light. It demonstrates that chronobiology isn\'t just academic — it has real mental health implications for billions of people living far from the equator.',
    },
    {
      title: 'Shift work biology — the modern circadian crisis',
      concept: `About 20% of workers in industrialized countries do **shift work** — working nights, rotating schedules, or irregular hours. This creates a state of chronic circadian disruption that the WHO has classified as a "probable carcinogen" (Group 2A).

What happens during shift work:
- **Internal desynchrony**: The SCN (synced to daylight) says "be awake" while the work schedule says "be asleep," and vice versa
- **Sleep debt**: Daytime sleep is shorter and lighter (noise, light, social pressure)
- **Metabolic disruption**: Eating at night when the gut clock expects rest leads to poor glucose processing
- **Immune suppression**: Key immune functions peak at night; disrupting this rhythm weakens defenses

Health consequences (from large epidemiological studies):
- 40% increased risk of cardiovascular disease
- 17% increased risk of breast cancer (nurses' study)
- 2-3x higher rate of metabolic syndrome
- Increased rates of depression, anxiety, and substance abuse
- Shorter life expectancy (estimated 5-7 years for long-term shift workers)

There is no way to fully "adapt" to night shifts. Even after years, the SCN remains locked to the light/dark cycle.`,
      analogy: 'Shift work is like forcing your body to live in a time zone that doesn\'t exist. Imagine permanently moving your meals to 3am, your sleep to 10am, and your exercise to midnight — but the sun, your family, and your social life are all on normal time. Your body is caught between two incompatible schedules.',
      storyConnection: 'The cuckoo doesn\'t fight its clock — it calls at dawn and sleeps at night. Shift workers are forced to override millions of years of circadian evolution. The cuckoo\'s simple obedience to its clock is, from a health perspective, wiser than modern work schedules.',
      checkQuestion: 'Some shift workers claim they\'ve "adjusted" after years on the night shift. Studies show their melatonin and cortisol rhythms haven\'t changed. What are they actually adjusting to?',
      checkAnswer: 'They\'re adjusting behaviourally and cognitively — learning to push through fatigue, timing caffeine strategically, and normalizing poor sleep. But their physiology hasn\'t adapted. Their circadian rhythms are still locked to the light/dark cycle. The subjective feeling of adaptation masks ongoing biological damage.',
      codeIntro: 'Model the circadian misalignment and accumulated health risk of shift work over years.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Model: circadian misalignment during shift work
hours = np.linspace(0, 168, 500)  # one week

# Normal worker: sleep 23:00-07:00
# Shift worker: work 23:00-07:00, attempt sleep 08:00-16:00

# SCN rhythm (locked to light, same for both)
scn_alertness = np.cos(2 * np.pi * (hours % 24 - 14) / 24)  # peaks at 2pm

# Required alertness for work
normal_work = np.zeros_like(hours)
shift_work = np.zeros_like(hours)
for i, h in enumerate(hours):
    hod = h % 24
    if 9 <= hod <= 17:
        normal_work[i] = 1  # day shift
    if hod >= 23 or hod <= 7:
        shift_work[i] = 1  # night shift

# Misalignment = difference between SCN and required state
normal_mismatch = np.abs(scn_alertness * normal_work - normal_work)
shift_mismatch = np.abs(scn_alertness * shift_work - shift_work)

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')

# One week view
ax1.set_facecolor('#111827')
ax1.fill_between(hours, normal_work * 1.2, alpha=0.15, color='#22c55e', label='Day shift hours')
ax1.fill_between(hours, shift_work * 1.2, alpha=0.15, color='#ef4444', label='Night shift hours')
ax1.plot(hours, scn_alertness, color='#f59e0b', linewidth=2, label='SCN alertness rhythm')
ax1.set_ylabel('Alertness / Work', color='white')
ax1.set_title('Circadian Rhythm vs Work Schedule (1 week)', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Long-term health risk accumulation
years = np.arange(0, 31)
# Relative risk increases with cumulative exposure
# Based on epidemiological data
cvd_risk = 1 + 0.013 * years  # ~40% increase over 30 years
cancer_risk = 1 + 0.006 * years  # ~17% increase over 30 years
metabolic_risk = 1 + 0.033 * years  # 2x over 30 years
baseline = np.ones_like(years, dtype=float)

ax2.set_facecolor('#111827')
ax2.plot(years, cvd_risk, 'o-', color='#ef4444', linewidth=2, label='Cardiovascular disease', markersize=4)
ax2.plot(years, cancer_risk, 's-', color='#a855f7', linewidth=2, label='Breast cancer', markersize=4)
ax2.plot(years, metabolic_risk, '^-', color='#f59e0b', linewidth=2, label='Metabolic syndrome', markersize=4)
ax2.plot(years, baseline, '--', color='gray', linewidth=1, label='Day workers (baseline)')

ax2.set_xlabel('Years of shift work', color='white')
ax2.set_ylabel('Relative risk', color='white')
ax2.set_title('Cumulative Health Risk from Shift Work', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')
ax2.set_ylim(0.8, 2.5)

plt.tight_layout()
plt.show()

print("After 30 years of shift work:")
print(f"  Cardiovascular risk: {cvd_risk[-1]:.0%} of baseline (+{(cvd_risk[-1]-1)*100:.0f}%)")
print(f"  Cancer risk: {cancer_risk[-1]:.0%} of baseline (+{(cancer_risk[-1]-1)*100:.0f}%)")
print(f"  Metabolic risk: {metabolic_risk[-1]:.0%} of baseline (+{(metabolic_risk[-1]-1)*100:.0f}%)")
print()
print("These are population averages. Individual risk depends on")
print("genetics, light exposure management, and schedule design.")`,
      challenge: 'Model a "forward-rotating" schedule (morning → afternoon → night, changing every 3 days). How does the misalignment compare to a fixed night shift? Forward rotation is considered less harmful — can your model explain why?',
      successHint: 'Shift work biology is one of the most pressing public health challenges of modern life. Understanding circadian disruption has led to improved schedule designs, strategic light exposure protocols, and workplace policies that save lives.',
    },
    {
      title: 'Plant circadian clocks — the green kingdom keeps time too',
      concept: `Plants don't have brains or SCNs, yet they have sophisticated circadian clocks. The plant clock controls:
- **Stomatal opening**: pores on leaves open during the day (for CO₂ uptake) and close at night (to prevent water loss)
- **Photosynthesis gene expression**: enzymes ramp up before dawn, anticipating sunlight
- **Fragrance emission**: flowers release scent when their pollinators are active
- **Leaf movement**: many plants fold their leaves at night (nyctinasty)
- **Growth**: stems elongate faster at night than during the day

The plant clock uses a TTFL similar to animals but with different genes: **CCA1**, **LHY**, **TOC1**, and **PRR** proteins form interlocking loops. The basic principle is the same — negative feedback with built-in delays creating ~24h oscillations.

A remarkable experiment by Dodd et al. (2005) showed that plants whose internal clock period matched the external light/dark cycle grew 30-40% more biomass than plants with mismatched clocks. The clock isn't optional — it's essential for fitness.`,
      analogy: 'A plant\'s clock is like a factory\'s production schedule. You don\'t turn on the assembly line (photosynthesis) when a customer walks in — you have it ready and running before the rush (dawn). Plants that anticipate sunrise have a head start on competitors that merely react to it.',
      storyConnection: 'The cuckoo calls at dawn because of its clock. The trees it perches in open their stomata at dawn because of their clocks. The flowers below release fragrance because of their clocks. The entire dawn chorus — birds, plants, insects — is an orchestra of synchronized biological clocks.',
      checkQuestion: 'If plants anticipate dawn and have their photosynthesis machinery ready before sunrise, what advantage does this give them over hypothetical plants that only activate after sensing light?',
      checkAnswer: 'A 1-2 hour head start every day compounds over a growing season. The clock-equipped plant captures more total light energy, produces more sugar, and grows faster. Over months, this can mean 30-40% more biomass — the difference between surviving and being outcompeted. Dodd\'s experiment proved this: clock-matched plants dramatically outperformed mismatched ones.',
      codeIntro: 'Simulate how clock-matched vs. clock-mismatched plants differ in growth over a season.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Dodd et al. (2005) simulation
# Plants with different clock periods in different light/dark cycles

days = np.arange(0, 90)  # 3 months growing season

# External light cycle: 24 hours (12L:12D)
# Three plants:
# 1. Clock = 24h (matched)
# 2. Clock = 20h (too fast, 4h mismatch)
# 3. Clock = 28h (too slow, 4h mismatch)

# Daily carbon gain depends on how well the clock matches the light cycle
# Matched: stomata open at dawn, photosynthesis enzymes ready → max efficiency
# Mismatched: some hours of suboptimal preparation

def daily_carbon(clock_period, light_period=24):
    # Misalignment accumulates daily then wraps
    mismatch = abs(clock_period - light_period) / light_period
    # Efficiency drops with mismatch (Dodd: ~30-40% reduction)
    efficiency = 1.0 - 0.4 * mismatch / 0.17  # normalized to max mismatch
    efficiency = max(0.5, efficiency)
    return efficiency

plants = {
    '24h clock (matched)': {'period': 24, 'color': '#22c55e'},
    '20h clock (too fast)': {'period': 20, 'color': '#f59e0b'},
    '28h clock (too slow)': {'period': 28, 'color': '#ef4444'},
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Growth curves
ax1.set_facecolor('#111827')
for name, props in plants.items():
    eff = daily_carbon(props['period'])
    # Biomass accumulation (sigmoid with efficiency factor)
    biomass = 100 * eff / (1 + np.exp(-0.08 * (days - 45)))
    ax1.plot(days, biomass, color=props['color'], linewidth=2.5, label=f"{name} (eff={eff:.0%})")

ax1.set_xlabel('Days', color='white')
ax1.set_ylabel('Biomass (g)', color='white')
ax1.set_title('Plant Growth: Clock Period vs Light Cycle', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Daily efficiency pattern
hours = np.linspace(0, 48, 500)
ax2.set_facecolor('#111827')

# Light (12L:12D)
light = np.zeros_like(hours)
for i, h in enumerate(hours):
    if (h % 24) < 12:
        light[i] = 1.0
ax2.fill_between(hours, light * 1.1, alpha=0.1, color='#f59e0b', label='Light period')

# Stomatal opening for each clock
for name, props in plants.items():
    period = props['period']
    # Stomata open during subjective day (first half of clock cycle)
    stomata = np.array([0.5 + 0.5 * np.cos(2 * np.pi * (h % period) / period - np.pi) for h in hours])
    stomata = np.clip(stomata, 0, 1)
    ax2.plot(hours, stomata, color=props['color'], linewidth=2, label=f'{name}')

ax2.set_xlabel('Hours', color='white')
ax2.set_ylabel('Stomatal opening', color='white')
ax2.set_title('Stomatal Rhythm vs Light (48h)', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Clock-matched plants (24h clock in 24h light cycle):")
print("  → Stomata open when light is available ✓")
print("  → Photosynthesis enzymes ready at dawn ✓")
print("  → 30-40% more biomass than mismatched plants")
print()
print("This proves the clock isn't just a side effect —")
print("it's a major determinant of plant fitness.")`,
      challenge: 'Add a 22h clock plant and a 26h clock plant. Plot biomass for all five. Is there a linear relationship between mismatch size and growth penalty, or is it nonlinear?',
      successHint: 'Plant clocks are now a target for crop improvement. If breeders can tune the clock period to match local day lengths (which vary with latitude), they could increase yields without changing anything about the plant\'s photosynthesis or metabolism.',
    },
    {
      title: 'Chronotherapy — treating disease with time',
      concept: `If the body's physiology changes across the 24-hour cycle, then the optimal time to give medicine must also change. This is **chronotherapy** — timing medical treatments to circadian rhythms for maximum effect and minimum side effects.

Examples already in clinical use:
- **Blood pressure medication**: BP naturally dips at night. Taking medication at bedtime (instead of morning) reduced cardiovascular events by 45% in a 19,000-patient study (Hygia, 2019)
- **Chemotherapy**: Cancer cells and healthy cells divide at different times. Timing chemo to when healthy cells are resting (and cancer cells are dividing) reduces side effects by 50% while improving efficacy
- **Asthma inhalers**: Airway inflammation peaks at ~4am. Timed-release drugs targeting this peak reduce nighttime attacks
- **Statins**: Cholesterol synthesis peaks at night. Taking statins in the evening is more effective than morning
- **Vaccination**: Immune response is strongest in the morning. Morning flu shots produce stronger antibody responses than afternoon shots

The field is expanding rapidly. Researchers have identified circadian patterns in:
- Drug metabolism (liver enzymes cycle)
- Drug targets (receptor expression cycles)
- Disease symptoms (most heart attacks occur 6am-noon)
- Surgical outcomes (afternoon surgery has fewer complications)`,
      analogy: 'Chronotherapy is like watering a garden at the right time. You could pour the same amount of water at noon (when it evaporates quickly) or at dawn (when the soil absorbs it). Same resource, same total amount, but timing determines effectiveness. Medicine works the same way — the drug is the water, and your body\'s rhythm determines absorption.',
      storyConnection: 'The cuckoo calls at dawn — not randomly, but at the optimal time for its signal to carry (cool, still air) and for potential mates to hear it (they\'re waking up). Chronotherapy applies the same principle: deliver the signal (medicine) when the receiver (target organ) is most receptive.',
      checkQuestion: 'If you were designing a clinical trial for a new heart disease drug, why would you need to record the time of day each patient takes their dose?',
      checkAnswer: 'Because the drug\'s efficacy and side effects likely vary with time of day. If some patients take it at 8am and others at 10pm, the trial results will be a messy average of two very different responses. Controlling for (or deliberately varying) dosing time could reveal the optimal administration window — and explain "inconsistent" results from previous trials that ignored timing.',
      codeIntro: 'Model how drug efficacy and toxicity change across 24 hours, and find the optimal dosing window.',
      code: `import numpy as np
import matplotlib.pyplot as plt

hours = np.linspace(0, 24, 200)

# Drug efficacy depends on target expression (circadian)
# Drug toxicity depends on liver metabolism (circadian)

# Example: chemotherapy drug
# Cancer cell division: peaks at 10am (most vulnerable to chemo)
cancer_vulnerability = 0.5 + 0.5 * np.cos(2 * np.pi * (hours - 10) / 24)

# Healthy cell division: peaks at 2am (most vulnerable at night)
healthy_vulnerability = 0.5 + 0.5 * np.cos(2 * np.pi * (hours - 2) / 24)

# Therapeutic index = cancer_vuln / healthy_vuln (higher = better)
therapeutic_index = cancer_vulnerability / (healthy_vulnerability + 0.1)

# Normalize
therapeutic_index = therapeutic_index / therapeutic_index.max()

# Drug absorption (gut motility peaks in morning)
absorption = 0.6 + 0.4 * np.cos(2 * np.pi * (hours - 8) / 24)

# Liver metabolism (clearance peaks at night)
clearance = 0.5 + 0.5 * np.cos(2 * np.pi * (hours - 22) / 24)

fig, axes = plt.subplots(2, 2, figsize=(14, 9))
fig.patch.set_facecolor('#1f2937')

# Cancer vs healthy vulnerability
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.plot(hours, cancer_vulnerability, color='#ef4444', linewidth=2, label='Cancer cells')
ax.plot(hours, healthy_vulnerability, color='#22c55e', linewidth=2, label='Healthy cells')
ax.set_title('Cell Vulnerability to Chemo', color='white', fontsize=11)
ax.set_ylabel('Division rate (vulnerability)', color='white')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Therapeutic index
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.fill_between(hours, therapeutic_index, alpha=0.3, color='#f59e0b')
ax.plot(hours, therapeutic_index, color='#f59e0b', linewidth=2.5)
optimal_time = hours[np.argmax(therapeutic_index)]
ax.axvline(optimal_time, color='#22c55e', linestyle='--', linewidth=2)
ax.annotate(f'Optimal: {optimal_time:.0f}:00', xy=(optimal_time, 1), color='#22c55e',
            fontsize=11, fontweight='bold', xytext=(optimal_time+2, 0.85),
            arrowprops=dict(arrowstyle='->', color='#22c55e'))
ax.set_title('Therapeutic Index (higher = better)', color='white', fontsize=11)
ax.set_ylabel('Relative index', color='white')
ax.tick_params(colors='gray')

# Drug absorption
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.plot(hours, absorption, color='#3b82f6', linewidth=2, label='Gut absorption')
ax.plot(hours, clearance, color='#a855f7', linewidth=2, label='Liver clearance')
ax.set_title('Drug Absorption & Clearance', color='white', fontsize=11)
ax.set_xlabel('Hour of day', color='white')
ax.set_ylabel('Relative rate', color='white')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Blood pressure drug example
ax = axes[1, 1]
ax.set_facecolor('#111827')
bp = 120 + 15 * np.cos(2 * np.pi * (hours - 14) / 24)  # peaks at 2pm
bp_morning_dose = bp - 10 * np.exp(-((hours - 8) ** 2) / 20)
bp_bedtime_dose = bp - 12 * np.exp(-((hours - 22) ** 2) / 20)
ax.plot(hours, bp, color='gray', linewidth=1, linestyle='--', label='No medication')
ax.plot(hours, bp_morning_dose, color='#3b82f6', linewidth=2, label='Morning dose')
ax.plot(hours, bp_bedtime_dose, color='#22c55e', linewidth=2, label='Bedtime dose')
ax.axhspan(130, 145, alpha=0.1, color='#ef4444')
ax.text(12, 137, 'Danger zone', color='#ef4444', fontsize=9, ha='center')
ax.set_title('Blood Pressure Medication Timing', color='white', fontsize=11)
ax.set_xlabel('Hour of day', color='white')
ax.set_ylabel('Systolic BP (mmHg)', color='white')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

for ax in axes.flat:
    time_labels = ['12am', '4am', '8am', '12pm', '4pm', '8pm', '12am']
    ax.set_xticks(np.arange(0, 25, 4))
    ax.set_xticklabels(time_labels, fontsize=7, color='gray')

plt.tight_layout()
plt.show()

print("Chronotherapy findings:")
print(f"  Best chemo time: ~{optimal_time:.0f}:00 (max cancer kill, min healthy damage)")
print("  BP medication: bedtime dosing > morning dosing (45% fewer events)")
print("  Vaccination: morning shots → stronger immune response")
print()
print("The same drug, at the same dose, can be medicine or poison")
print("depending on WHEN you take it. Time is the hidden variable.")`,
      challenge: 'Add a new subplot showing immune cell count across 24 hours (peaks at ~2am, lowest at ~2pm). Based on this, when should flu vaccines be given? When should immunosuppressants be given?',
      successHint: 'Chronotherapy represents the convergence of circadian biology and medicine. From a cuckoo calling at dawn to timing cancer treatment — the principle is the same: biology runs on schedules, and working with them is always better than against them.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Builds on Level 1 foundations</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for chronobiology simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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