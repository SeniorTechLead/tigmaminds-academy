import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function NightJasmineLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Plant clocks — how plants tell time without a brain',
      concept: `In "Why the Night Jasmine Blooms After Dark," a grandmother explains that the parijat tree opens its flowers only at dusk and drops them by dawn. This is not random — the plant has an internal **circadian clock** that keeps time even without sunlight cues.

**Circadian rhythms** are biological cycles that repeat roughly every 24 hours. Plants use them to:
- Open and close flowers at specific times
- Raise and lower leaves (nyctinasty)
- Release fragrance when pollinators are active
- Regulate photosynthesis enzymes before dawn

The clock is molecular — built from genes and proteins that interact in feedback loops:
1. Gene A makes Protein A during the day
2. Protein A accumulates and eventually turns OFF Gene A
3. Protein A slowly degrades overnight
4. When Protein A is gone, Gene A turns back on
5. Cycle repeats every ~24 hours

This negative feedback loop is the core oscillator. It runs even in constant darkness — the plant continues its rhythm, drifting slightly without light to reset it.`,
      analogy: 'A plant clock is like an hourglass that flips itself. Sand (protein) flows down during the day, and when the top is empty (protein reaches peak), it triggers a flip (gene turns off). Sand flows the other way overnight. At dawn, it flips again. The hourglass keeps time on its own but uses sunrise to correct small errors.',
      storyConnection: 'The grandmother in the story says the parijat blooms at night because "it remembers the moonlight." In biology, the plant doesn\'t remember moonlight — it runs an internal clock that aligns with dusk. Even if you kept the tree in constant light, it would still cycle, opening buds roughly every 24 hours.',
      checkQuestion: 'If you keep a night jasmine in a sealed dark room with no light at all, will it still open its flowers on schedule?',
      checkAnswer: 'Yes, for several days. The internal clock keeps running in constant darkness (this is called "free-running"). But without light to reset (entrain) the clock, it drifts — typically by 30-60 minutes per day. After a week or two, the rhythm degrades. The plant needs periodic light signals to stay synchronised with the real day-night cycle.',
      codeIntro: 'Model a circadian clock as a protein accumulation-degradation cycle.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simple circadian oscillator model
# Protein production during "subjective day", degradation always
hours = np.arange(0, 120, 0.1)  # 5 days

# Parameters
production_rate = 1.0  # protein made per hour (when gene is on)
degradation_rate = 0.08  # fraction degraded per hour
threshold = 8.0  # protein level that turns gene off

protein = np.zeros_like(hours)
gene_on = np.ones_like(hours, dtype=bool)
protein[0] = 2.0

for i in range(1, len(hours)):
    # Gene turns off when protein > threshold, on when < threshold/2
    if protein[i-1] > threshold:
        gene_on[i] = False
    elif protein[i-1] < threshold / 2:
        gene_on[i] = True
    else:
        gene_on[i] = gene_on[i-1]

    production = production_rate if gene_on[i] else 0
    degradation = degradation_rate * protein[i-1]
    protein[i] = protein[i-1] + (production - degradation) * 0.1

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 7), sharex=True)
fig.patch.set_facecolor('#1f2937')

# Protein level
ax1.set_facecolor('#111827')
ax1.plot(hours, protein, color='#22c55e', linewidth=2)
ax1.axhline(threshold, color='#ef4444', linestyle='--', alpha=0.5, label=f'Threshold ({threshold})')
ax1.axhline(threshold/2, color='#f59e0b', linestyle='--', alpha=0.5, label=f'Reset ({threshold/2})')
ax1.fill_between(hours, protein, alpha=0.1, color='#22c55e')
ax1.set_ylabel('Protein level', color='white')
ax1.set_title('Circadian Clock: Protein Oscillation', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Day/night shading
for day in range(5):
    ax1.axvspan(day*24 + 6, day*24 + 18, alpha=0.05, color='yellow')
    ax1.axvspan(day*24 + 18, day*24 + 30, alpha=0.05, color='blue')

# Gene activity
ax2.set_facecolor('#111827')
ax2.fill_between(hours, gene_on.astype(float), step='mid', alpha=0.5, color='#3b82f6')
ax2.set_ylabel('Gene ON/OFF', color='white')
ax2.set_xlabel('Hours', color='white')
ax2.set_title('Gene Activity (ON when protein is low)', color='white', fontsize=11)
ax2.set_yticks([0, 1])
ax2.set_yticklabels(['OFF', 'ON'], color='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

# Measure period
peaks = []
for i in range(1, len(protein)-1):
    if protein[i] > protein[i-1] and protein[i] > protein[i+1] and protein[i] > threshold * 0.8:
        peaks.append(hours[i])
if len(peaks) > 1:
    periods = [peaks[i+1] - peaks[i] for i in range(len(peaks)-1)]
    print(f"Measured clock period: {np.mean(periods):.1f} hours")
print(f"Oscillation peaks: {len(peaks)} over {hours[-1]:.0f} hours")
print("The clock runs on negative feedback: protein turns off its own gene.")`,
      challenge: 'Change the degradation rate from 0.08 to 0.12. How does this change the period of the clock? Faster degradation = shorter cycle. What degradation rate gives exactly 24 hours?',
      successHint: 'This simple feedback loop — production, accumulation, inhibition, degradation — is the core of circadian clocks in plants, animals, fungi, and even cyanobacteria. The details differ, but the principle is universal.',
    },
    {
      title: 'Photoperiodism — how day length controls plant behaviour',
      concept: `Plants don't just track the 24-hour cycle — they measure the **length of the day** (or more precisely, the length of the night). This is called **photoperiodism**, and it controls critical events:

- When to flower
- When to drop leaves (deciduous trees)
- When to form tubers (potatoes)
- When to go dormant for winter

Plants are classified by their flowering response to day length:
- **Long-day plants** (LDPs): flower when days are long (>12-14h). Examples: wheat, lettuce, spinach
- **Short-day plants** (SDPs): flower when days are short (<12h). Examples: rice, chrysanthemum, night jasmine
- **Day-neutral plants**: flower regardless of day length. Examples: tomato, cucumber

The critical insight: **plants actually measure the length of the NIGHT, not the day.** A short-day plant is really a "long-night" plant. If you interrupt a long night with a brief flash of light, the plant will not flower — because the uninterrupted dark period was broken.`,
      analogy: 'Photoperiodism is like a kitchen timer. The plant sets a timer at dusk. If the timer runs out before dawn (long enough night), it triggers flowering. A flash of light in the middle resets the timer. Short-day plants need the timer to complete; long-day plants need it to NOT complete.',
      storyConnection: 'The night jasmine (parijat) is a short-day plant that flowers in autumn and winter when nights are long. In the story, the tree blooms "when darkness comes." Biologically, this is photoperiodism: the long uninterrupted night triggers the flowering hormone florigen, which travels from leaves to buds.',
      checkQuestion: 'Farmers sometimes use artificial lighting in greenhouses at night to prevent plants from flowering. Why would they want to prevent flowering?',
      checkAnswer: 'For leafy vegetables (spinach, lettuce), flowering means the plant stops making leaves and puts energy into seeds. The leaves become bitter (bolting). By keeping lights on at night, farmers trick short-day leafy plants into thinking it is still summer, maintaining vegetative growth and leaf production longer.',
      codeIntro: 'Simulate how different day lengths affect flowering in short-day and long-day plants.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Day length varies through the year (Northern Hemisphere, ~26°N latitude like Assam)
days = np.arange(1, 366)
# Day length model: varies from ~10.5h (winter) to ~13.5h (summer)
day_length = 12 + 1.5 * np.sin(2 * np.pi * (days - 80) / 365)

# Critical thresholds
sdp_critical = 12.0  # short-day plant flowers when day < 12h
ldp_critical = 13.0  # long-day plant flowers when day > 13h

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 7))
fig.patch.set_facecolor('#1f2937')

# Top: day length through the year
ax1.set_facecolor('#111827')
ax1.plot(days, day_length, color='#f59e0b', linewidth=2)
ax1.axhline(sdp_critical, color='#a855f7', linestyle='--', alpha=0.7, label=f'SDP critical ({sdp_critical}h)')
ax1.axhline(ldp_critical, color='#22c55e', linestyle='--', alpha=0.7, label=f'LDP critical ({ldp_critical}h)')
ax1.fill_between(days, day_length, sdp_critical, where=day_length < sdp_critical, alpha=0.2, color='#a855f7')
ax1.fill_between(days, day_length, ldp_critical, where=day_length > ldp_critical, alpha=0.2, color='#22c55e')

months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
month_starts = [1, 32, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335]
ax1.set_xticks(month_starts)
ax1.set_xticklabels(months, color='gray')
ax1.set_ylabel('Day length (hours)', color='white')
ax1.set_title('Day Length Through the Year (Assam, ~26°N)', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Bottom: flowering probability
ax2.set_facecolor('#111827')

# SDP: flowers when day < critical (autumn/winter)
sdp_flower = np.where(day_length < sdp_critical, (sdp_critical - day_length) / 1.5, 0)
# LDP: flowers when day > critical (late spring/summer)
ldp_flower = np.where(day_length > ldp_critical, (day_length - ldp_critical) / 0.5, 0)
ldp_flower = np.clip(ldp_flower, 0, 1)

ax2.fill_between(days, sdp_flower, alpha=0.5, color='#a855f7', label='Night jasmine (SDP)')
ax2.fill_between(days, ldp_flower, alpha=0.5, color='#22c55e', label='Wheat (LDP)')
ax2.set_xticks(month_starts)
ax2.set_xticklabels(months, color='gray')
ax2.set_ylabel('Flowering intensity', color='white')
ax2.set_xlabel('Month', color='white')
ax2.set_title('Flowering Windows: Short-Day vs Long-Day Plants', color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Night jasmine (short-day plant):")
print("  Flowers: Oct-Feb (when nights are long)")
print("  Critical day length: <12 hours")
print()
print("Wheat (long-day plant):")
print("  Flowers: May-Jul (when days are long)")
print("  Critical day length: >13 hours")
print()
print("At the equator, day length barely changes — so photoperiodic")
print("plants at low latitudes use temperature or rainfall as cues instead.")`,
      challenge: 'Change the latitude to 60°N (like Scandinavia) where day length varies from 6h to 18h. How does this affect the flowering windows? Would night jasmine survive there?',
      successHint: 'Photoperiodism is one of the most important discoveries in plant biology. It explains why the same crop grows differently at different latitudes and why moving plants north or south can disrupt their flowering entirely.',
    },
    {
      title: 'Phytochrome pigments — the molecules that see light',
      concept: `How does a plant measure night length if it has no eyes? The answer is **phytochrome** — a pigment protein that exists in two interconvertible forms:

- **Pr** (red-absorbing form): inactive form, absorbs red light (660nm)
- **Pfr** (far-red-absorbing form): active form, absorbs far-red light (730nm)

The conversion cycle:
1. **During the day**: sunlight (rich in red) converts Pr → Pfr. Pfr accumulates
2. **At dusk**: no more red light. Pfr slowly reverts to Pr in the dark (takes ~8 hours)
3. **Short night**: dawn arrives before Pfr is fully converted back. Pfr remains high → long-day response
4. **Long night**: Pfr is fully converted back to Pr before dawn. Low Pfr → short-day response

So the plant measures night length by tracking how much Pfr has reverted to Pr. The Pfr level at dawn is the signal:
- High Pfr at dawn = short night = summer → long-day plant flowers
- Low Pfr at dawn = long night = winter → short-day plant flowers

This is why a flash of red light in the middle of a long night prevents short-day flowering — it converts Pr back to Pfr, resetting the timer.`,
      analogy: 'Phytochrome is like a glow-in-the-dark sticker. Sunlight "charges" it (converts Pr to Pfr). In the dark, it slowly fades (Pfr reverts to Pr). If you check the sticker at dawn and it is still glowing, the night was short. If the glow is gone, the night was long. The sticker is the timer; dawn is the readout.',
      storyConnection: 'The grandmother in the story says the parijat "waits for darkness." In molecular terms, the parijat waits for its Pfr levels to drop below a critical threshold — which only happens after a long enough night. The flower buds literally monitor a molecular timer, opening only when the Pfr signal says "the night was long enough."',
      checkQuestion: 'If you shine far-red light (730nm) on a plant immediately after sunset, what happens to flowering in a short-day plant?',
      checkAnswer: 'Far-red light converts Pfr back to Pr instantly. This makes the plant "think" it is already deep into the night (Pfr already low). If the night is then long enough, the short-day plant flowers normally — or even earlier. Far-red light at dusk is like fast-forwarding the dark timer.',
      codeIntro: 'Model phytochrome Pr/Pfr conversion over a 24-hour light-dark cycle.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Phytochrome conversion model
hours = np.linspace(0, 72, 1000)  # 3 days

def simulate_phytochrome(day_length):
    """Simulate Pfr levels given a day length"""
    pfr = np.zeros_like(hours)
    pfr[0] = 0.3  # start at dawn
    dt = hours[1] - hours[0]

    for i in range(1, len(hours)):
        hour_of_day = hours[i] % 24
        is_light = hour_of_day < day_length

        if is_light:
            # Light converts Pr to Pfr (fast)
            conversion = 0.8 * (1.0 - pfr[i-1])  # approaches 1.0
        else:
            # Dark: Pfr slowly reverts to Pr
            conversion = -0.15 * pfr[i-1]  # slow reversion

        pfr[i] = pfr[i-1] + conversion * dt
        pfr[i] = np.clip(pfr[i], 0, 1)

    return pfr

fig, axes = plt.subplots(3, 1, figsize=(12, 8), sharex=True)
fig.patch.set_facecolor('#1f2937')

day_lengths = [10, 12, 14]
titles = ['Short day (10h light)', 'Equinox (12h light)', 'Long day (14h light)']
colors = ['#a855f7', '#f59e0b', '#22c55e']

for ax, dl, title, color in zip(axes, day_lengths, titles, colors):
    ax.set_facecolor('#111827')

    pfr = simulate_phytochrome(dl)
    ax.plot(hours, pfr, color=color, linewidth=2)
    ax.fill_between(hours, pfr, alpha=0.15, color=color)

    # Shade night periods
    for day in range(3):
        ax.axvspan(day*24 + dl, day*24 + 24, alpha=0.1, color='blue')
        ax.axvspan(day*24, day*24 + dl, alpha=0.05, color='yellow')

    # Mark Pfr level at dawn
    for day in range(1, 3):
        dawn_idx = np.argmin(np.abs(hours - day * 24))
        ax.plot(hours[dawn_idx], pfr[dawn_idx], 'o', color='white', markersize=8)
        ax.annotate(f'Dawn Pfr: {pfr[dawn_idx]:.2f}', xy=(hours[dawn_idx], pfr[dawn_idx]),
                    xytext=(hours[dawn_idx]+2, pfr[dawn_idx]+0.15), color='white', fontsize=9)

    # Critical threshold for SDP flowering
    ax.axhline(0.3, color='#ef4444', linestyle=':', alpha=0.5)
    ax.text(71, 0.32, 'SDP threshold', color='#ef4444', fontsize=8, ha='right')

    ax.set_ylabel('Pfr level', color='white')
    ax.set_title(title, color=color, fontsize=11)
    ax.set_ylim(-0.05, 1.1)
    ax.tick_params(colors='gray')

axes[-1].set_xlabel('Hours', color='white')
plt.suptitle('Phytochrome Pfr Levels Under Different Day Lengths', color='white', fontsize=13, y=1.01)
plt.tight_layout()
plt.show()

print("Phytochrome as a night-length timer:")
print("  Short day (10h): Pfr drops below 0.3 by dawn → SDP flowers")
print("  Equinox (12h):   Pfr near threshold → transitional")
print("  Long day (14h):  Pfr stays above 0.3 at dawn → LDP flowers")
print()
print("The plant doesn't 'count' hours. It measures a chemical gradient.")`,
      challenge: 'Simulate a "night break" experiment: flash red light for 15 minutes at midnight during a long night. Does the Pfr level at dawn change? Does this explain why night breaks prevent short-day flowering?',
      successHint: 'Phytochrome is one of the most elegant sensory systems in biology — a single molecule that converts a physical signal (light) into a chemical signal (Pfr level) that encodes time (night length). Simple, robust, and universal across the plant kingdom.',
    },
    {
      title: 'Short-day vs long-day plants — why timing matters',
      concept: `Flowering at the right time is a life-or-death matter for plants. Flower too early, and pollinators aren't active yet. Flower too late, and seeds won't mature before winter. Photoperiodism ensures precise timing.

**Short-day plants (SDPs) — flower when nights are long:**
- Rice: flowers in autumn, needs short days to trigger grain formation
- Chrysanthemum: autumn bloomer, controlled by greenhouse lighting commercially
- Night jasmine (parijat): flowers from October to February
- Poinsettia: needs 14+ hours of darkness to turn red
- Cannabis: switches to flowering under short days

**Long-day plants (LDPs) — flower when days are long:**
- Wheat, barley, oats: flower in late spring/early summer
- Spinach, lettuce: bolt (flower) in long summer days
- Clover, many wildflowers: bloom in summer meadows

**Day-neutral plants — flower based on age or temperature:**
- Tomato, cucumber, maize: flower when mature enough
- Roses: continuous flowering varieties exist

The critical photoperiod varies by species AND latitude. A rice variety from Assam (26°N) may not flower in Japan (35°N) because the day-length pattern is different.`,
      analogy: 'Flowering timing is like a concert schedule. SDPs are evening performers — they only go on stage when the lights dim (long nights). LDPs are daytime acts — they perform when the spotlight is bright (long days). Day-neutrals are buskers — they play whenever they feel like it, regardless of the venue lighting.',
      storyConnection: 'The parijat in the story "only blooms when darkness falls." This makes it a classic short-day plant. In Assam, nights exceed 12 hours from roughly October to February — exactly when parijat flowers carpet the ground each morning. The story captures seasonal biology through cultural observation.',
      checkQuestion: 'Greenhouses grow chrysanthemums year-round by controlling light. How would you force a chrysanthemum to flower in June (when natural days are long)?',
      checkAnswer: 'Cover the plants with blackout cloth for 14-16 hours each day, giving them artificial "long nights." After 6-8 weeks of short days (long nights), the plants flower. Commercial growers do this routinely to produce chrysanthemums for any date — including out-of-season holidays.',
      codeIntro: 'Map the flowering windows of common plants across the year in Assam.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Flowering calendar for Assam (26°N)
plants = [
    ('Night Jasmine', 'SDP', 10, 2, '#a855f7'),
    ('Rice (kharif)', 'SDP', 9, 11, '#22c55e'),
    ('Chrysanthemum', 'SDP', 10, 12, '#f59e0b'),
    ('Poinsettia', 'SDP', 11, 1, '#ef4444'),
    ('Wheat', 'LDP', 3, 5, '#3b82f6'),
    ('Mustard', 'LDP', 2, 4, '#fbbf24'),
    ('Spinach', 'LDP', 4, 6, '#10b981'),
    ('Tomato', 'Neutral', 1, 12, '#ec4899'),
    ('Marigold', 'Neutral', 1, 12, '#f97316'),
]

fig, ax = plt.subplots(figsize=(14, 7))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827')

months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

for i, (name, ptype, start, end, color) in enumerate(plants):
    y = len(plants) - i
    if start <= end:
        ax.barh(y, end - start + 1, left=start - 0.5, height=0.6, color=color, alpha=0.7, edgecolor='none')
    else:
        # Wraps around year (e.g., Oct-Feb)
        ax.barh(y, 12 - start + 1, left=start - 0.5, height=0.6, color=color, alpha=0.7, edgecolor='none')
        ax.barh(y, end, left=0.5, height=0.6, color=color, alpha=0.7, edgecolor='none')

    label_x = (start + end) / 2 if start <= end else ((start + end + 12) / 2) % 12
    ax.text(-0.5, y, f'{name} ({ptype})', ha='right', va='center', color=color, fontsize=10, fontweight='bold')

ax.set_xlim(0.5, 12.5)
ax.set_xticks(range(1, 13))
ax.set_xticklabels(months, color='white')
ax.set_yticks([])
ax.set_title('Flowering Calendar: Assam (~26°N)', color='white', fontsize=14)
ax.tick_params(colors='gray')

# Add day length curve on secondary axis
ax2 = ax.twinx()
days_of_month = np.array([15, 46, 74, 105, 135, 166, 196, 227, 258, 288, 319, 349])
day_length = 12 + 1.5 * np.sin(2 * np.pi * (days_of_month - 80) / 365)
ax2.plot(range(1, 13), day_length, 'o--', color='white', alpha=0.3, linewidth=1)
ax2.set_ylabel('Day length (h)', color='gray', fontsize=9)
ax2.set_ylim(9, 15)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Flowering patterns in Assam:")
print("  SDPs (night jasmine, rice, chrysanthemum): flower Oct-Feb")
print("  LDPs (wheat, mustard, spinach): flower Feb-Jun")
print("  Day-neutrals (tomato, marigold): flower year-round")
print()
print("The same species may flower at different times at different latitudes")
print("because the day-length pattern changes with latitude.")`,
      challenge: 'Add a rice variety from Thailand (14°N) where day length varies only 11-13h. How does its flowering window differ from Assam rice? This is why tropical rice breeding is different from temperate rice breeding.',
      successHint: 'Understanding photoperiodism revolutionised agriculture. Breeders can now select varieties for specific latitudes, and greenhouse growers can force-flower crops year-round by manipulating light schedules.',
    },
    {
      title: 'Why some flowers open at night — moth pollination',
      concept: `Night jasmine doesn't bloom at night by accident. It evolved to attract **nocturnal pollinators** — primarily moths. This is called a **pollination syndrome**: a set of flower traits that match the sensory abilities and preferences of specific pollinators.

**Night-blooming flower traits (moth pollination syndrome):**
- **White or pale flowers**: visible in moonlight/starlight (moths see UV and blue, not red)
- **Strong, sweet fragrance**: released at night when visual cues are weak
- **Deep tubular shape**: matches long moth proboscis
- **Copious nectar**: reward for pollinators who fly long distances at night
- **Open at dusk, close at dawn**: synchronised with moth activity

**Why not stay open all day too?**
- Open flowers lose water through their petals (transpiration)
- Exposed nectar attracts daytime thieves (ants, beetles) that don't pollinate
- UV damage to delicate petal tissues
- Energy cost of keeping flowers open is significant

The timing is precise: night jasmine flowers open within 30 minutes of sunset, triggered by a drop in light intensity and temperature. They drop off the tree by sunrise — the entire bloom lasts one night.`,
      analogy: 'A night-blooming flower is like a restaurant that opens only for the dinner rush. It has dim lighting (white petals for moonlight), strong aromas (fragrance to attract customers from far away), and a full menu (copious nectar). It closes after dinner because the kitchen staff (petal cells) need rest, and morning customers (ants) rarely pay their bill (pollinate).',
      storyConnection: 'The story captures the ephemerality of parijat flowers — carpeting the ground each morning, gone by afternoon. This daily shedding is not waste; it is efficiency. Each flower has one job: attract a moth for one night. Once pollinated (or not), the flower drops to save the tree\'s energy for the next night\'s batch.',
      checkQuestion: 'Some flowers are red and have no scent. What type of pollinator are they adapted for?',
      checkAnswer: 'Birds, especially hummingbirds. Birds have excellent colour vision (they see red well) but a poor sense of smell. So bird-pollinated flowers invest in bright red/orange colour instead of fragrance. They also tend to be tubular (matching beak shape), produce thin nectar (matching the bird\'s lapping tongue), and are sturdy (birds land on them).',
      codeIntro: 'Compare pollination syndromes: which traits attract which pollinators.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Pollination syndrome comparison
traits = ['Fragrance\\\nstrength', 'Colour\\\nbrightness', 'Nectar\\\nvolume', 'Flower\\\nsize', 'Tube\\\ndepth', 'UV\\\npattern']
N = len(traits)

syndromes = {
    'Moth (night jasmine)': [10, 3, 8, 5, 8, 7],
    'Bee (sunflower)': [6, 8, 5, 7, 4, 10],
    'Bird (hibiscus)': [1, 10, 7, 8, 6, 2],
    'Butterfly (lantana)': [5, 9, 4, 4, 5, 5],
    'Wind (grass)': [0, 0, 0, 1, 0, 0],
}
colors = {
    'Moth (night jasmine)': '#a855f7',
    'Bee (sunflower)': '#f59e0b',
    'Bird (hibiscus)': '#ef4444',
    'Butterfly (lantana)': '#ec4899',
    'Wind (grass)': '#6b7280',
}

angles = np.linspace(0, 2 * np.pi, N, endpoint=False).tolist()
angles += angles[:1]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6), subplot_kw={'polar': True})
fig.patch.set_facecolor('#1f2937')

# Radar chart
ax1.set_facecolor('#111827')
for name, values in syndromes.items():
    values_plot = values + values[:1]
    ax1.plot(angles, values_plot, 'o-', linewidth=2, label=name, color=colors[name])
    ax1.fill(angles, values_plot, alpha=0.08, color=colors[name])

ax1.set_xticks(angles[:-1])
ax1.set_xticklabels(traits, color='white', fontsize=8)
ax1.set_ylim(0, 10)
ax1.set_yticks([2, 5, 8])
ax1.set_yticklabels(['2', '5', '8'], color='gray', fontsize=7)
ax1.set_title('Pollination Syndromes', color='white', fontsize=12, pad=20)
ax1.legend(loc='upper left', bbox_to_anchor=(-0.3, 1.15), facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)

# Time-of-day activity chart
ax2.set_facecolor('#111827')
hours_24 = np.linspace(0, 2*np.pi, 24, endpoint=False)

moth_activity = np.array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,8,10,9,6,2])
bee_activity = np.array([0,0,0,0,0,0,1,4,8,10,10,9,8,9,10,8,4,1,0,0,0,0,0,0])
bird_activity = np.array([0,0,0,0,0,1,5,9,10,8,7,6,7,8,9,7,3,0,0,0,0,0,0,0])

for activity, name, color in [(moth_activity, 'Moth', '#a855f7'),
                                (bee_activity, 'Bee', '#f59e0b'),
                                (bird_activity, 'Bird', '#ef4444')]:
    act = list(activity) + [activity[0]]
    ang = list(hours_24) + [hours_24[0] + 2*np.pi]
    ax2.plot(ang, act, color=color, linewidth=2, label=name)
    ax2.fill(ang, act, alpha=0.1, color=color)

ax2.set_xticks(hours_24[::3])
ax2.set_xticklabels(['12am','3am','6am','9am','12pm','3pm','6pm','9pm'], color='white', fontsize=7)
ax2.set_title('Pollinator Activity by Hour', color='white', fontsize=12, pad=20)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)

plt.tight_layout()
plt.show()

print("Night jasmine's strategy:")
print("  White flowers → visible in moonlight")
print("  Strong fragrance → moths track scent plumes for 100m+")
print("  Open at dusk → matches moth emergence")
print("  Drop at dawn → saves energy, avoids nectar theft")
print()
print("Wind-pollinated grasses invest in NONE of these traits.")
print("No colour, no scent, no nectar — just massive pollen production.")`,
      challenge: 'Bat-pollinated flowers exist too (e.g., durian, agave). Research their traits and add them to the radar chart. Hint: bats use echolocation and have a good sense of smell.',
      successHint: 'Pollination syndromes show how tightly organisms co-evolve. The night jasmine and its moth pollinators have shaped each other over millions of years — the flower evolving to match the moth\'s senses, the moth evolving to exploit the flower\'s rewards.',
    },
    {
      title: 'Biological timing mechanisms — clocks throughout nature',
      concept: `Circadian clocks aren't unique to plants. Nearly every organism on Earth has one — from cyanobacteria to humans. These clocks share common features:

**Universal principles of biological clocks:**
1. **Endogenous**: they run without external cues (free-running period ~24h)
2. **Entrainable**: they synchronise to environmental signals (light, temperature)
3. **Temperature-compensated**: they keep accurate time despite temperature changes (unlike most chemical reactions, which speed up with heat)

**Clocks at different scales:**
- **Cyanobacteria**: simplest known clock, just 3 proteins (KaiA, KaiB, KaiC). Works in a test tube
- **Plants**: multiple interacting clock genes (TOC1, CCA1, LHY). Control flowering, growth, defence
- **Insects**: clock controls emergence (fruit flies hatch at dawn), migration (monarch butterflies)
- **Mammals**: master clock in the suprachiasmatic nucleus (SCN) of the hypothalamus. ~20,000 neurons synchronise the entire body
- **Humans**: circadian clock controls sleep/wake, body temperature, hormone release, immune function, metabolism

**Disrupting the clock:**
- Jet lag: clock is out of sync with local time (takes ~1 day/timezone to adjust)
- Shift work: chronic clock disruption linked to cancer, diabetes, depression
- Seasonal affective disorder: shortened days disrupt circadian-mood coupling`,
      analogy: 'Biological clocks are like a city\'s traffic lights. Each intersection (cell) has its own timer, but they are all synchronised by a central controller (the SCN in mammals, or light signals in plants). If the central controller fails, each intersection still cycles, but they fall out of sync — causing chaos (like jet lag).',
      storyConnection: 'The night jasmine\'s clock is one expression of a universal biological principle. The grandmother in the story says the tree "remembers." In a sense, all circadian clocks are a form of biological memory — they remember the pattern of day and night and predict the next cycle, preparing the organism before conditions change.',
      checkQuestion: 'Some cave-dwelling animals (blind cavefish, cave crickets) have lost their circadian clocks over evolutionary time. Why would a clock be useless in a cave?',
      checkAnswer: 'In perpetual darkness, there is no day-night cycle to predict. A circadian clock that tries to synchronise with a nonexistent signal becomes a liability — it might make the animal inactive during "subjective night" when food is available. Evolution removed the clock because it no longer provided an advantage. Use it or lose it.',
      codeIntro: 'Compare circadian clock properties across organisms, from cyanobacteria to humans.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Clock parameters across organisms
organisms = ['Cyanobacteria', 'Fungi\\\n(Neurospora)', 'Plants\\\n(Arabidopsis)', 'Fruit fly', 'Mouse', 'Human']
free_period = [24.0, 22.5, 24.5, 23.8, 23.7, 24.2]  # hours (free-running)
n_clock_genes = [3, 5, 12, 8, 14, 14]
temp_compensation = [0.95, 0.92, 0.97, 0.94, 0.99, 0.99]  # Q10 (1.0 = perfect)

fig, axes = plt.subplots(1, 3, figsize=(15, 6))
fig.patch.set_facecolor('#1f2937')

# Free-running period
ax = axes[0]
ax.set_facecolor('#111827')
colors_bar = ['#22c55e', '#a855f7', '#3b82f6', '#f59e0b', '#ec4899', '#ef4444']
bars = ax.barh(organisms, free_period, color=colors_bar, height=0.6)
ax.axvline(24, color='white', linestyle='--', alpha=0.3)
ax.set_xlabel('Free-running period (hours)', color='white')
ax.set_title('Endogenous Period', color='white', fontsize=11)
ax.tick_params(colors='gray')
ax.set_xlim(22, 25)
for bar, val in zip(bars, free_period):
    ax.text(bar.get_width() + 0.05, bar.get_y() + bar.get_height()/2,
            f'{val}h', va='center', color='white', fontsize=9)

# Number of clock genes
ax = axes[1]
ax.set_facecolor('#111827')
bars = ax.barh(organisms, n_clock_genes, color=colors_bar, height=0.6)
ax.set_xlabel('Number of core clock genes', color='white')
ax.set_title('Clock Complexity', color='white', fontsize=11)
ax.tick_params(colors='gray')
for bar, val in zip(bars, n_clock_genes):
    ax.text(bar.get_width() + 0.2, bar.get_y() + bar.get_height()/2,
            str(val), va='center', color='white', fontsize=9)

# Temperature compensation
ax = axes[2]
ax.set_facecolor('#111827')
bars = ax.barh(organisms, temp_compensation, color=colors_bar, height=0.6)
ax.axvline(1.0, color='#22c55e', linestyle='--', alpha=0.3)
ax.set_xlabel('Temperature compensation (Q10)', color='white')
ax.set_title('Temperature Stability', color='white', fontsize=11)
ax.tick_params(colors='gray')
ax.set_xlim(0.85, 1.05)
for bar, val in zip(bars, temp_compensation):
    ax.text(bar.get_width() + 0.005, bar.get_y() + bar.get_height()/2,
            f'{val:.2f}', va='center', color='white', fontsize=9)

plt.suptitle('Circadian Clocks Across Life', color='white', fontsize=14, y=1.02)
plt.tight_layout()
plt.show()

print("Universal features of circadian clocks:")
print(f"  Free-running period: 22-25 hours (close to 24)")
print(f"  Clock genes: 3 (simplest) to 14 (mammals)")
print(f"  Temperature compensation: Q10 near 1.0 (clock speed")
print(f"    barely changes with temperature)")
print()
print("The 2017 Nobel Prize in Physiology/Medicine was awarded")
print("for discovering the molecular mechanisms of circadian rhythms.")
print("From night jasmine to human sleep — the same principle applies.")`,
      challenge: 'Simulate jet lag: plot a human circadian cycle that is suddenly shifted 8 hours (flying from Assam to London). How many days does it take for the clock to re-entrain? Use the model from Lesson 1.',
      successHint: 'From a flowering tree in an Assamese story to the molecular clocks in every cell of your body, circadian biology connects plant science to human medicine. Level 2 goes deeper into the molecular machinery — clock genes, light signalling, and how we are engineering plants with altered timing.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Circadian Rhythms in Plants</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for plant biology simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L1-${i + 1}`} number={i + 1}
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
