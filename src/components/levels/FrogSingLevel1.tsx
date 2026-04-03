import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function FrogSingLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'How frogs make sound — the vocal sac amplifier',
      concept: `Frogs produce sound by forcing air from the lungs across the **vocal cords** (thin membranes in the larynx), causing them to vibrate — fundamentally the same mechanism as human speech, but with a twist.

Most male frogs have a **vocal sac** — an inflatable pouch of skin under the throat or on the sides of the head. The vocal sac serves as a **resonating chamber** that amplifies the sound, like cupping your hands around your mouth but far more effective.

**The process:**
1. Frog closes its nostrils and mouth
2. Air is pumped from lungs across vocal cords → sound produced
3. Air enters the vocal sac, which inflates
4. The sac vibrates in sympathy with the vocal cords → amplification
5. Air is recycled back to the lungs (frogs don't exhale to call — they recirculate)

**Key facts:**
- Frog calls can reach 90-100 dB at 1 meter (as loud as a lawn mower)
- The coqui frog of Puerto Rico reaches 100 dB — one of the loudest amphibians
- Calling is energetically expensive — a frog may spend 15-25% of its daily energy on calling
- Only males call in most species; the call advertises fitness to females

**NE India** has over 100 frog species, many found nowhere else. The Western Ghats and Eastern Himalayas are global biodiversity hotspots for frogs.`,
      analogy: 'A frog\'s vocal sac is like the body of a guitar. The vocal cords are the strings — they vibrate and produce a small, quiet sound. The vocal sac (guitar body) resonates at the same frequency, amplifying the sound and projecting it into the environment. Without the body, a guitar string is barely audible. Without the vocal sac, a frog\'s call would be a whisper.',
      storyConnection: 'After the rain stopped, the wetlands came alive with sound. The story tells of frogs singing together in a chorus so loud that villages a kilometer away could hear them. This wasn\'t random noise — each species had a distinct call, each male was advertising his strength, and the chorus was a symphony of competitive signaling shaped by millions of years of evolution.',
      checkQuestion: 'Calling uses 15-25% of a frog\'s daily energy. Why don\'t females call? And why do males keep calling despite the enormous cost?',
      checkAnswer: 'Sexual selection: females choose mates based on call quality (louder, longer, more complex calls signal a healthier, fitter male). Females don\'t need to call because males come to them. Males keep calling despite the cost because the reproductive payoff (passing on genes) outweighs the energy expense and predation risk. Frogs that don\'t call don\'t reproduce.',
      codeIntro: 'Visualize how a frog\'s vocal sac amplifies sound through resonance.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Model a frog call: vocal cord vibration + vocal sac resonance
t = np.linspace(0, 0.05, 5000)  # 50ms of audio

# Vocal cord: generates a fundamental frequency
f0 = 2000  # Hz (typical frog call frequency)
vocal_cord = 0.3 * np.sin(2 * np.pi * f0 * t)

# Add harmonics (vocal cords aren't pure tones)
vocal_cord += 0.15 * np.sin(2 * np.pi * 2 * f0 * t)
vocal_cord += 0.08 * np.sin(2 * np.pi * 3 * f0 * t)

# Vocal sac resonance: amplifies the fundamental
# Model as a bandpass filter centered on f0
sac_amplification = 3.0  # 3x amplification at resonance
amplified = vocal_cord * sac_amplification

# The sac also has its own resonant frequency
sac_resonance = 1.5 * np.sin(2 * np.pi * f0 * t) * np.exp(-50 * t)
full_call = amplified + sac_resonance

fig, axes = plt.subplots(3, 1, figsize=(12, 8), sharex=True)
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Frog Sound Production: From Vocal Cords to Broadcast', color='white', fontsize=14)

# Vocal cord alone
ax1 = axes[0]
ax1.set_facecolor('#111827')
ax1.plot(t * 1000, vocal_cord, color='#3b82f6', linewidth=1)
ax1.set_ylabel('Amplitude', color='white')
ax1.set_title('Step 1: Vocal cord vibration (quiet)', color='#3b82f6', fontsize=11)
ax1.tick_params(colors='gray')
ax1.set_ylim(-2, 2)

# Amplified by vocal sac
ax2 = axes[1]
ax2.set_facecolor('#111827')
ax2.plot(t * 1000, amplified, color='#22c55e', linewidth=1)
ax2.set_ylabel('Amplitude', color='white')
ax2.set_title(f'Step 2: Amplified by vocal sac ({sac_amplification}× gain)', color='#22c55e', fontsize=11)
ax2.tick_params(colors='gray')
ax2.set_ylim(-2, 2)

# Full call with sac resonance
ax3 = axes[2]
ax3.set_facecolor('#111827')
ax3.plot(t * 1000, full_call, color='#f59e0b', linewidth=1)
ax3.set_xlabel('Time (ms)', color='white')
ax3.set_ylabel('Amplitude', color='white')
ax3.set_title('Step 3: Full call (vocal cords + sac resonance)', color='#f59e0b', fontsize=11)
ax3.tick_params(colors='gray')
ax3.set_ylim(-2, 2)

plt.tight_layout()
plt.show()

# Sound intensity comparison
print("Sound production efficiency:")
print(f"  Vocal cords alone: ~{np.max(np.abs(vocal_cord)):.2f} amplitude units")
print(f"  With vocal sac:    ~{np.max(np.abs(full_call)):.2f} amplitude units")
print(f"  Amplification:     ~{np.max(np.abs(full_call))/np.max(np.abs(vocal_cord)):.1f}×")
print()
print(f"In decibels: {20*np.log10(np.max(np.abs(full_call))/np.max(np.abs(vocal_cord))):.1f} dB gain")
print()
print("This is why a tiny frog can produce calls audible 1 km away.")
print("The vocal sac is one of nature's most efficient acoustic amplifiers.")`,
      challenge: 'Change the fundamental frequency from 2000 Hz to 500 Hz (a larger frog). How does the waveform change? Larger frogs have lower-pitched calls — why? (Hint: longer vocal cords vibrate more slowly, just like longer guitar strings.)',
      successHint: 'Sound production in frogs follows the same physics as musical instruments and human speech. The vocal cords are the vibrating source, the vocal sac is the resonator. Understanding this system is the first step toward bioacoustics.',
    },
    {
      title: 'Resonance in vocal sacs — why some frogs are louder',
      concept: `**Resonance** occurs when an object vibrates at its **natural frequency** — the frequency at which it vibrates most efficiently with the least energy input.

For a frog's vocal sac:
- The sac's natural frequency depends on its size and the tension of the skin
- When the vocal cords produce a frequency matching the sac's natural frequency, the sac amplifies that frequency enormously
- At non-resonant frequencies, the sac provides little amplification

**The physics of resonance:**
**f_resonance = (1/2L) × sqrt(T/ρ)**
- L = characteristic length of the sac
- T = skin tension
- ρ = air density

**Larger sacs resonate at lower frequencies** (longer wavelength). This means:
- Big frogs → big sacs → low-pitched calls (bull frogs: 100-200 Hz)
- Small frogs → small sacs → high-pitched calls (spring peepers: 2,500-3,500 Hz)

**Quality factor (Q)**: measures how "sharp" the resonance is
- High Q: amplifies a narrow frequency range strongly (tuned instrument)
- Low Q: amplifies a broader range weakly (more "noisy" sound)

Frog vocal sacs typically have Q values of 5-15, meaning they are moderately tuned — enough to amplify the main frequency but broad enough to include harmonics that make the call distinctive.`,
      analogy: 'Resonance is like pushing a child on a swing. If you push at the natural frequency of the swing (once per swing cycle), the motion builds up enormously with little effort. Push at the wrong frequency and the swing barely moves. The frog\'s vocal sac "pushes" at the right frequency, building up sound energy from a small vocal cord vibration into a powerful broadcast.',
      storyConnection: 'In the wetlands after rain, some frog calls carried farther than others. The species with the best-matched vocal sacs — where the resonant frequency precisely matched the vocal cord output — dominated the soundscape. Evolution had fine-tuned each species\' vocal sac to be a perfect amplifier for its specific call frequency.',
      checkQuestion: 'If you inflated a frog\'s vocal sac with helium instead of air (helium is less dense), how would the call change?',
      checkAnswer: 'The resonant frequency would increase (higher pitch). Since f ∝ 1/sqrt(ρ) and helium has about 1/7 the density of air, the resonant frequency would increase by sqrt(7) ≈ 2.6×. The frog would sound "squeaky" — the same effect as when humans inhale helium. The vocal cord frequency wouldn\'t change much, but the vocal sac would amplify higher frequencies instead of the fundamental.',
      codeIntro: 'Model vocal sac resonance and show how size determines call frequency.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Resonance curve: amplitude vs driving frequency
# for vocal sacs of different sizes

frequencies = np.linspace(100, 5000, 500)  # Hz

def resonance_response(f, f0, Q=10):
    """Resonance amplitude response"""
    return 1 / np.sqrt((1 - (f/f0)**2)**2 + (f/(f0*Q))**2)

# Different frog species (body length → sac size → resonant frequency)
frogs = {
    'Bull frog (15cm)': {'f0': 300, 'Q': 8, 'color': '#ef4444'},
    'Green frog (8cm)': {'f0': 800, 'Q': 10, 'color': '#22c55e'},
    'Tree frog (4cm)': {'f0': 1800, 'Q': 12, 'color': '#3b82f6'},
    'Spring peeper (2.5cm)': {'f0': 3000, 'Q': 15, 'color': '#f59e0b'},
    'Cricket frog (2cm)': {'f0': 3800, 'Q': 10, 'color': '#a855f7'},
}

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')

# Resonance curves
ax1.set_facecolor('#111827')
for name, props in frogs.items():
    response = resonance_response(frequencies, props['f0'], props['Q'])
    ax1.plot(frequencies, response, color=props['color'], linewidth=2, label=name)
    # Mark peak
    ax1.plot(props['f0'], resonance_response(props['f0'], props['f0'], props['Q']),
            'o', color=props['color'], markersize=6)

ax1.set_xlabel('Frequency (Hz)', color='white')
ax1.set_ylabel('Amplification factor', color='white')
ax1.set_title('Vocal Sac Resonance: Each Species Tuned to Its Frequency', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Body size vs call frequency
ax2.set_facecolor('#111827')
sizes = [15, 8, 4, 2.5, 2]
freqs = [300, 800, 1800, 3000, 3800]
colors_frog = [frogs[n]['color'] for n in frogs]
names_short = ['Bull', 'Green', 'Tree', 'Peeper', 'Cricket']

ax2.scatter(sizes, freqs, s=[s**2 * 5 for s in sizes], c=colors_frog, zorder=5)
for name, x, y, c in zip(names_short, sizes, freqs, colors_frog):
    ax2.annotate(name, xy=(x, y), xytext=(10, 10), textcoords='offset points',
                color=c, fontsize=10)

# Fit inverse relationship: f ∝ 1/size
x_fit = np.linspace(1.5, 16, 50)
# f = k / size (approximate)
k = 300 * 15  # from bull frog
y_fit = k / x_fit
ax2.plot(x_fit, y_fit, '--', color='#6b7280', linewidth=1, label='f ∝ 1/body_size')

ax2.set_xlabel('Body length (cm)', color='white')
ax2.set_ylabel('Call frequency (Hz)', color='white')
ax2.set_title('Bigger Frogs = Lower Calls (inverse relationship)', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Frog size → call frequency relationship:")
for name, size, freq in zip(names_short, sizes, freqs):
    wavelength = 343 / freq  # speed of sound / frequency
    print(f"  {name:8s}: {size:>4.1f}cm body, {freq:>5}Hz call, {wavelength*100:.0f}cm wavelength")
print()
print("Notice: the wavelength of the call is roughly proportional")
print("to the body size. This is a consequence of resonance physics.")
print("The vocal sac acts as a resonator whose size determines the frequency.")`,
      challenge: 'What if two frog species had overlapping resonant frequencies? Model two species both calling at 1500 Hz. How could they coexist acoustically? (Hint: they could differ in call timing, call pattern, or harmonic content instead of frequency.)',
      successHint: 'Resonance is why small frogs sound different from large ones — it is physics, not choice. The same principle explains why a violin sounds different from a cello, why different-sized bells have different pitches, and why MRI machines use specific radio frequencies to image specific tissues.',
    },
    {
      title: 'Frequency matching — how females find the right male',
      concept: `Female frogs don't just listen — they **discriminate**. A female spring peeper will only respond to calls within a narrow frequency range centered on her species' typical call. This prevents hybridization (mating with the wrong species) and ensures she selects a high-quality male.

**How frequency discrimination works:**
- The female's inner ear is **tuned** to the species-specific call frequency
- Two organs in the frog ear respond to different frequency ranges:
  - **Amphibian papilla**: tuned to low frequencies (100-1,000 Hz)
  - **Basilar papilla**: tuned to high frequencies (1,000-5,000 Hz)
- Each organ resonates best at the species' typical call frequency
- Off-frequency calls (wrong species) are literally not heard as clearly

**Female choice based on call properties:**
- **Frequency**: species recognition (must be within range)
- **Call rate**: faster calling = more energetic male = better genes
- **Call duration**: longer calls signal endurance
- **Call complexity**: some species prefer calls with more notes or frequency modulation
- **Loudness**: louder calls indicate proximity and/or larger body size

This is **acoustic sexual selection** — the calls evolve because females prefer certain acoustic features, driving males to produce calls that match female preferences over generations.`,
      analogy: 'A female frog\'s ear is like a radio tuned to one specific station. All the other stations (other species) are broadcasting, but she only hears the one her receiver is tuned to. A male frog\'s call is his broadcast frequency. If his signal is strong, clear, and on the right frequency, she tunes in. If it\'s weak or off-frequency, he\'s static.',
      storyConnection: 'In the wetland chorus after rain, dozens of species called simultaneously. But each female navigated this wall of sound effortlessly, homing in on her species\' frequency like a radio dial. The apparent chaos of the chorus was actually a perfectly organized frequency-division system — each species broadcasting on its own channel.',
      checkQuestion: 'A male frog with a deeper-than-average call (lower frequency) is actually preferred by females of his species. Why would a lower frequency indicate a better mate?',
      checkAnswer: 'Lower frequency correlates with larger body size (bigger vocal cords and sac). Larger males tend to be older (survived longer = good genes), better nourished (access to more resources), and better at defending territories. The frequency is an honest signal of quality — you can\'t fake a low-frequency call with a small body. Females use this acoustic cue as a proxy for genetic fitness.',
      codeIntro: 'Simulate female frequency discrimination and male call competition.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Female auditory tuning curve: sensitivity vs frequency
# Tuned to species-typical frequency of 2000 Hz
species_freq = 2000  # Hz

# Female sensitivity (Gaussian tuning curve)
freq_range = np.linspace(500, 4000, 300)
female_sensitivity = np.exp(-((freq_range - species_freq) / 200)**2)

# Male call frequencies (population)
n_males = 50
male_freqs = np.random.normal(species_freq, 150, n_males)  # natural variation
male_loudness = np.random.uniform(0.5, 1.0, n_males)

# Other species (background)
other_species = [
    ('Species B', 1200, 100),
    ('Species C', 3200, 150),
]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

# Female tuning curve + male calls
ax1.set_facecolor('#111827')
ax1.plot(freq_range, female_sensitivity, color='#ec4899', linewidth=3, label='Female tuning curve')
ax1.fill_between(freq_range, female_sensitivity, alpha=0.1, color='#ec4899')

# Plot male calls as vertical lines
for freq, loud in zip(male_freqs, male_loudness):
    sensitivity = np.exp(-((freq - species_freq) / 200)**2)
    perceived = sensitivity * loud
    color = '#22c55e' if perceived > 0.5 else '#6b7280'
    ax1.vlines(freq, 0, loud * 0.3, color=color, linewidth=1, alpha=0.6)

# Other species
for name, f, spread in other_species:
    other_curve = 0.8 * np.exp(-((freq_range - f) / spread)**2)
    ax1.fill_between(freq_range, other_curve * 0.3, alpha=0.1, color='#ef4444')
    ax1.text(f, 0.28, name, color='#ef4444', fontsize=8, ha='center')

ax1.set_xlabel('Frequency (Hz)', color='white')
ax1.set_ylabel('Sensitivity / Amplitude', color='white')
ax1.set_title('Female Frog: Frequency Discrimination', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', labelcolor='white')
ax1.tick_params(colors='gray')

# Male call quality and female response
ax2.set_facecolor('#111827')

# Female perceived attractiveness = loudness × frequency match
attractiveness = []
for freq, loud in zip(male_freqs, male_loudness):
    freq_match = np.exp(-((freq - species_freq) / 200)**2)
    attract = freq_match * loud
    attractiveness.append(attract)

attractiveness = np.array(attractiveness)

# Sort by attractiveness
order = np.argsort(attractiveness)[::-1]
ax2.bar(range(n_males), attractiveness[order], color='#22c55e', alpha=0.8, edgecolor='none')
ax2.axhline(0.5, color='#f59e0b', linestyle='--', linewidth=1, label='Mating threshold')
n_chosen = np.sum(attractiveness > 0.5)
ax2.axvspan(0, n_chosen-0.5, alpha=0.05, color='#22c55e')

ax2.set_xlabel('Males (ranked by attractiveness)', color='white')
ax2.set_ylabel('Female-perceived attractiveness', color='white')
ax2.set_title(f'Male Competition: {n_chosen} of {n_males} males exceed threshold', color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Species typical frequency: {species_freq} Hz")
print(f"Male call frequencies: mean={np.mean(male_freqs):.0f}, std={np.std(male_freqs):.0f} Hz")
print(f"Males exceeding mating threshold: {n_chosen}/{n_males} ({n_chosen/n_males*100:.0f}%)")
print()
print("What makes a winning call:")
print("  1. Frequency close to species norm (frequency match)")
print("  2. High loudness (signals size and energy)")
print("  3. Both factors multiply: quiet + right frequency = moderate")
print("     Loud + right frequency = irresistible")`,
      challenge: 'Model what happens if climate change shifts the female tuning curve by 100 Hz (warmer temperatures can affect ear physiology). How many males now fall outside the mating threshold? This is one mechanism by which climate change could reduce frog reproductive success.',
      successHint: 'Frequency matching is natural selection acting through acoustics. The female ear, the male call, and the species-specific frequency are all co-evolved to form a precise communication system. Disrupting any part — through noise pollution, habitat loss, or climate change — can break the system.',
    },
    {
      title: 'Chorus synchronization — emergent order from simple rules',
      concept: `When hundreds of frogs call simultaneously, something remarkable happens: they **synchronize**. Individual frogs time their calls to alternate with or synchronize to their neighbors, creating structured patterns from simple rules.

**Types of chorus synchronization:**
- **Alternation**: neighboring males call at different times (avoiding overlap so each can be heard). Like a conversation where each person waits for their turn.
- **Synchrony**: many males call at exactly the same time. This creates a louder "wall of sound" that carries farther.
- **Leader-follower**: one male initiates, others respond with a slight delay.

**How does synchronization emerge?**
Each frog follows simple rules:
1. Listen to neighbors
2. Adjust your call timing slightly to avoid overlap (or achieve overlap, depending on species)
3. Repeat

No conductor. No central coordination. Just **local interactions** producing **global order**. This is an example of **emergence** — complex patterns arising from simple rules.

**The math:** frog call synchronization is mathematically identical to:
- Firefly flash synchronization
- Neuron firing in the brain
- Pendulum clock synchronization (Huygens, 1665)

All are described by **coupled oscillator models**: simple oscillators that influence each other's timing.`,
      analogy: 'A frog chorus is like an audience clapping. At first, applause is random. But gradually, people start matching the rhythm of those around them. Within seconds, the entire audience is clapping in synchrony — no one planned it, no one conducted it. Each person followed a simple rule: match your neighbors. The same rule produces frog chorus synchrony.',
      storyConnection: 'The story describes the chorus building after rain — first a few pioneers, then dozens, then hundreds, until the entire wetland pulsed with synchronized calling. This wasn\'t musical cooperation. Each frog was competing for female attention, yet the competition itself produced cooperative-seeming patterns. The whole is organized; the parts are selfish.',
      checkQuestion: 'Why would male frogs synchronize their calls? It seems counterproductive — if everyone calls at the same time, how can a female distinguish one male from another?',
      checkAnswer: 'Two theories: (1) The "beacon" hypothesis: a synchronized chorus is louder and carries farther, attracting females from greater distances. Once females arrive, they can use spatial cues (location) and fine-grained call properties (frequency, rate) to choose. (2) The "rhythm preservation" hypothesis: synchrony preserves a predictable rhythm that females can lock onto. Randomized calling is harder for females to process. Alternation also helps — females can hear each individual call clearly.',
      codeIntro: 'Simulate frog chorus synchronization using coupled oscillators.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Coupled oscillator model for frog chorus synchronization
# Each frog is an oscillator with a natural frequency and phase
# Frogs adjust their phase based on neighbors (Kuramoto model)

n_frogs = 20
n_steps = 200

# Natural frequencies (slightly different for each frog)
natural_freq = np.random.normal(2.0, 0.2, n_frogs)  # calls per second

# Coupling strength (how much they adjust to neighbors)
K = 0.3  # coupling constant

# Initial phases (random)
phases = np.random.uniform(0, 2*np.pi, n_frogs)

# Track phases over time
phase_history = np.zeros((n_steps, n_frogs))
sync_metric = np.zeros(n_steps)  # order parameter

dt = 0.1  # time step

for step in range(n_steps):
    phase_history[step] = phases

    # Order parameter: r = |mean(e^(i*phase))|
    # r=1 means perfect synchrony, r≈0 means random
    sync_metric[step] = np.abs(np.mean(np.exp(1j * phases)))

    # Update phases (Kuramoto model)
    for i in range(n_frogs):
        # Influence from all other frogs
        coupling = K / n_frogs * np.sum(np.sin(phases - phases[i]))
        phases[i] += (natural_freq[i] + coupling) * dt

    phases = phases % (2 * np.pi)

time = np.arange(n_steps) * dt

fig, (ax1, ax2, ax3) = plt.subplots(3, 1, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')

# Phase evolution (raster plot)
ax1.set_facecolor('#111827')
for i in range(n_frogs):
    # Plot call events (when phase crosses 0)
    call_times = []
    for step in range(1, n_steps):
        if phase_history[step, i] < phase_history[step-1, i]:  # phase wrapped
            call_times.append(time[step])
    ax1.scatter(call_times, [i]*len(call_times), s=8, color='#22c55e', alpha=0.7)

ax1.set_ylabel('Frog ID', color='white')
ax1.set_title('Frog Chorus: Call Events Over Time (dots = calls)', color='white', fontsize=13)
ax1.tick_params(colors='gray')
ax1.text(0.5, n_frogs + 1, 'Random →', color='#ef4444', fontsize=9)
ax1.text(time[-1] - 5, n_frogs + 1, '← Synchronized', color='#22c55e', fontsize=9, ha='right')

# Synchronization metric
ax2.set_facecolor('#111827')
ax2.plot(time, sync_metric, color='#f59e0b', linewidth=2)
ax2.fill_between(time, sync_metric, alpha=0.2, color='#f59e0b')
ax2.set_ylabel('Synchrony (r)', color='white')
ax2.set_title('Order Parameter: 0 = Random, 1 = Perfect Sync', color='white', fontsize=11)
ax2.tick_params(colors='gray')
ax2.set_ylim(0, 1)

# Phase distribution at start vs end
ax3.set_facecolor('#111827')
theta_start = phase_history[0] % (2 * np.pi)
theta_end = phase_history[-1] % (2 * np.pi)

bins = np.linspace(0, 2*np.pi, 20)
ax3.hist(theta_start, bins=bins, alpha=0.5, color='#ef4444', label='Start (random)')
ax3.hist(theta_end, bins=bins, alpha=0.5, color='#22c55e', label='End (synchronized)')
ax3.set_xlabel('Phase (radians)', color='white')
ax3.set_ylabel('Number of frogs', color='white')
ax3.set_title('Phase Distribution: Random → Clustered', color='white', fontsize=11)
ax3.legend(facecolor='#1f2937', labelcolor='white')
ax3.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Synchronization results:")
print(f"  Initial order parameter: {sync_metric[0]:.3f} (random)")
print(f"  Final order parameter:   {sync_metric[-1]:.3f} (synchronized)")
print(f"  Coupling strength K = {K}")
print()
print("The Kuramoto model: each oscillator adjusts toward the mean phase.")
print("Above a critical coupling strength, synchrony emerges spontaneously.")
print("This same model explains firefly flashes, neuron firing, and power grids.")`,
      challenge: 'Reduce the coupling strength to K=0.05 (weakly interacting frogs). Does synchrony still emerge? Find the critical coupling strength Kc where synchrony breaks down. This is a phase transition — similar to water freezing.',
      successHint: 'Emergence — complex order from simple rules — is one of the most powerful ideas in science. Frog chorus synchronization is a beautiful example, but the same mathematics governs phenomena from brain waves to power grid stability to traffic flow.',
    },
    {
      title: 'Acoustic niche hypothesis — sharing the sound spectrum',
      concept: `The **acoustic niche hypothesis** proposes that animal species in a community divide up the available sound spectrum (frequency, timing, and space) to minimize interference — just as radio stations use different frequencies to avoid jamming each other.

**Three dimensions of acoustic niche partitioning:**
1. **Frequency**: different species call at different pitches
2. **Time**: some call at dusk, others at night, others at dawn
3. **Space**: some call from treetops, others from the ground, others from the water

**Evidence from frog communities:**
- In a single NE Indian wetland, 10-15 species may call simultaneously
- Their call frequencies are typically separated by at least 200-300 Hz
- Species that are similar in frequency tend to call at different times
- This spacing is NOT random — it's statistically more regular than expected by chance

**The acoustic adaptation hypothesis** (related):
- Habitat structure affects which frequencies propagate best
- Forest floor: low frequencies travel farther (less absorption by foliage)
- Open water: high frequencies travel well (no obstacles)
- Dense vegetation: narrow frequency bands with less absorption ("sound windows")

Species evolve call frequencies that propagate best in their preferred habitat AND avoid overlap with neighbors. This dual constraint shapes the sound of every ecosystem.`,
      analogy: 'The soundscape is like a parking lot with assigned spaces. Each species has its own "parking space" in the frequency-time spectrum. If two species try to park in the same space (same frequency, same time), they interfere with each other and neither communicates effectively. Evolution assigns the spaces — gradually, over millions of years.',
      storyConnection: 'The story describes the chorus as a symphony — not random noise. Each species contributed its own frequency band: low booming calls from the large frogs at the water\'s edge, mid-frequency trills from the grass, high-pitched peeps from the bushes. The wetland was acoustically organized, each species in its niche, creating a complex soundscape from simple rules of avoidance.',
      checkQuestion: 'Noise pollution from a highway produces constant sound at 100-2000 Hz. Which frog species would be most affected: bull frogs (300 Hz), tree frogs (1800 Hz), or spring peepers (3000 Hz)?',
      checkAnswer: 'Bull frogs (300 Hz) would be most affected because their call frequency falls within the highway noise range. Tree frogs (1800 Hz) would also be partially affected. Spring peepers (3000 Hz) would be least affected as their call frequency is above the noise. In practice, frogs near highways shift their call frequency upward (if they can) or increase call amplitude — "the Lombard effect." Species that can\'t adapt acoustically may decline.',
      codeIntro: 'Visualize acoustic niche partitioning in a frog community.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Frog community: 10 species with different acoustic niches
species = [
    {'name': 'Bull frog', 'freq': 300, 'bw': 100, 'time': (19, 23), 'height': 0, 'color': '#ef4444'},
    {'name': 'Green frog', 'freq': 700, 'bw': 150, 'time': (20, 2), 'height': 0.2, 'color': '#22c55e'},
    {'name': 'Pond frog', 'freq': 1100, 'bw': 200, 'time': (18, 22), 'height': 0, 'color': '#3b82f6'},
    {'name': 'Grass frog', 'freq': 1500, 'bw': 150, 'time': (19, 1), 'height': 0.5, 'color': '#f59e0b'},
    {'name': 'Bush frog', 'freq': 1900, 'bw': 200, 'time': (20, 3), 'height': 1.5, 'color': '#a855f7'},
    {'name': 'Tree frog A', 'freq': 2400, 'bw': 150, 'time': (19, 23), 'height': 3, 'color': '#ec4899'},
    {'name': 'Tree frog B', 'freq': 2900, 'bw': 200, 'time': (21, 4), 'height': 4, 'color': '#06b6d4'},
    {'name': 'Peeper', 'freq': 3300, 'bw': 150, 'time': (18, 21), 'height': 1, 'color': '#84cc16'},
    {'name': 'Cricket frog', 'freq': 3800, 'bw': 200, 'time': (20, 2), 'height': 0.3, 'color': '#f97316'},
    {'name': 'Reed frog', 'freq': 4300, 'bw': 150, 'time': (19, 1), 'height': 0.8, 'color': '#14b8a6'},
]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 7))
fig.patch.set_facecolor('#1f2937')

# Frequency-Time niche plot
ax1.set_facecolor('#111827')
for sp in species:
    # Time range (handle wrap-around midnight)
    t_start, t_end = sp['time']
    if t_end < t_start:
        t_end += 24
    t_center = (t_start + t_end) / 2
    t_width = t_end - t_start

    # Draw ellipse representing niche
    from matplotlib.patches import Ellipse
    ellipse = Ellipse((t_center, sp['freq']), t_width, sp['bw']*2,
                      facecolor=sp['color'], alpha=0.3, edgecolor=sp['color'], linewidth=2)
    ax1.add_patch(ellipse)
    ax1.text(t_center, sp['freq'], sp['name'], color='white', fontsize=7,
            ha='center', va='center')

ax1.set_xlabel('Time of day (hour)', color='white')
ax1.set_ylabel('Frequency (Hz)', color='white')
ax1.set_title('Acoustic Niches: Frequency × Time', color='white', fontsize=13)
ax1.set_xlim(17, 28)
ax1.set_ylim(0, 5000)
ax1.set_xticks([18, 20, 22, 24, 26])
ax1.set_xticklabels(['18:00', '20:00', '22:00', '00:00', '02:00'], color='white', fontsize=8)
ax1.tick_params(colors='gray')

# Frequency spectrum at peak chorus time (21:00)
ax2.set_facecolor('#111827')
freq_axis = np.linspace(0, 5000, 500)
total_spectrum = np.zeros_like(freq_axis)

for sp in species:
    # Check if active at 21:00
    t_start, t_end = sp['time']
    if t_end < t_start:
        active = True  # wraps midnight
    else:
        active = 21 >= t_start and 21 <= t_end

    if active:
        # Gaussian spectrum for this species
        spectrum = np.exp(-((freq_axis - sp['freq']) / (sp['bw']/2))**2)
        ax2.fill_between(freq_axis, spectrum, alpha=0.3, color=sp['color'], label=sp['name'])
        total_spectrum += spectrum

ax2.plot(freq_axis, total_spectrum, color='white', linewidth=1, alpha=0.5, label='Combined')
ax2.set_xlabel('Frequency (Hz)', color='white')
ax2.set_ylabel('Call intensity', color='white')
ax2.set_title('Sound Spectrum at 21:00 (Peak Chorus)', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', labelcolor='white', fontsize=7, ncol=2, loc='upper right')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

# Frequency spacing analysis
freqs = sorted([sp['freq'] for sp in species])
spacings = [freqs[i+1] - freqs[i] for i in range(len(freqs)-1)]
print("Acoustic niche analysis:")
print(f"  Number of species: {len(species)}")
print(f"  Frequency range: {min(freqs)} - {max(freqs)} Hz")
print(f"  Mean spacing: {np.mean(spacings):.0f} Hz")
print(f"  Min spacing:  {min(spacings):.0f} Hz")
print(f"  Std of spacing: {np.std(spacings):.0f} Hz")
print()
print("The regular spacing ({:.0f} ± {:.0f} Hz) is the signature".format(np.mean(spacings), np.std(spacings)))
print("of acoustic niche partitioning. Random placement would show")
print("much more variable spacing.")`,
      challenge: 'Add an invasive species that calls at 1500 Hz (overlapping the grass frog). Simulate competition: both species reduce call intensity when their frequencies overlap. What happens to the grass frog population if it can\'t shift its frequency?',
      successHint: 'The acoustic niche hypothesis reveals that even a seemingly chaotic chorus is structured by evolutionary forces. Each species occupies a unique acoustic niche, and the community\'s soundscape is an emergent property of millions of years of acoustic competition and adaptation.',
    },
    {
      title: 'Bioacoustics research — science through listening',
      concept: `**Bioacoustics** is the study of sound production, transmission, and reception in animals. It combines biology, physics, engineering, and increasingly, computer science.

**How bioacoustics research works:**
1. **Recording**: deploy microphones (or hydrophones for underwater) in the field. Modern recorders (AudioMoth, $50) can record continuously for weeks.
2. **Analysis**: process recordings to identify species, count individuals, and assess habitat health.
3. **Conservation**: use acoustic data to monitor biodiversity, detect invasive species, and evaluate restoration success.

**Key techniques:**
- **Spectrogram analysis**: visual identification of species from their call "fingerprints"
- **Automated species identification**: machine learning classifies calls from spectrogram images
- **Acoustic indices**: mathematical summaries of soundscape diversity (like a biodiversity index but for sound)
- **Sound mapping**: spatial analysis of where calls originate using microphone arrays

**Why bioacoustics matters for conservation:**
- Many species are easier to HEAR than to SEE (especially frogs, birds, insects)
- Continuous recording monitors 24/7 (no observer fatigue)
- Non-invasive (no trapping, handling, or disturbing animals)
- Scalable (one recorder covers 1-5 hectares; you can deploy hundreds)

**NE India**: the region's incredible frog diversity (100+ species) is a prime candidate for acoustic monitoring. Several species were discovered through their calls BEFORE they were ever seen.`,
      analogy: 'Bioacoustics is like reading a book by its sound instead of its text. The forest soundscape is a "book" written by every species present. A skilled bioacoustician can "read" this book and tell you which species are there, how many, how healthy, and whether the ecosystem is changing — all without seeing a single animal.',
      storyConnection: 'The story ends with the frog chorus fading as dawn approaches. But what if we could record that chorus and analyze it? We could identify every species present, estimate population sizes, track changes year to year, and detect threats. The frogs that sing after rain are writing an acoustic diary of their wetland\'s health — bioacoustics lets us read it.',
      checkQuestion: 'A forest that was recently restored has good tree cover and looks healthy. But acoustic monitoring shows fewer frog species and lower call diversity than an old-growth forest nearby. What does this tell you that visual inspection doesn\'t?',
      checkAnswer: 'The soundscape reveals that the restored forest, despite looking good visually, lacks the ecological complexity of old growth. Fewer frog species means fewer ecological niches are filled (possibly missing microhabitats, water features, or prey species). Low call diversity might indicate reduced genetic health or elevated stress. Acoustic monitoring catches biodiversity deficits that visual surveys miss — the forest looks full but sounds empty.',
      codeIntro: 'Simulate bioacoustic monitoring: record a chorus, analyze the spectrogram, count species.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate a wetland recording (synthetic spectrogram)
duration = 10  # seconds
sample_rate = 16000  # Hz
t = np.arange(0, duration, 1/sample_rate)

# Create synthetic frog calls for 5 species
signal = np.zeros_like(t)

species_calls = [
    {'name': 'Bull frog', 'freq': 350, 'bw': 80, 'rate': 0.5, 'dur': 0.3, 'amp': 0.8},
    {'name': 'Pond frog', 'freq': 1200, 'bw': 150, 'rate': 2.0, 'dur': 0.1, 'amp': 0.5},
    {'name': 'Tree frog', 'freq': 2400, 'bw': 200, 'rate': 4.0, 'dur': 0.05, 'amp': 0.4},
    {'name': 'Peeper', 'freq': 3200, 'bw': 100, 'rate': 6.0, 'dur': 0.03, 'amp': 0.3},
    {'name': 'Cricket frog', 'freq': 4200, 'bw': 300, 'rate': 8.0, 'dur': 0.02, 'amp': 0.2},
]

for sp in species_calls:
    # Generate calls at regular intervals (with jitter)
    call_interval = 1.0 / sp['rate']
    call_times = np.arange(0, duration, call_interval) + np.random.normal(0, 0.05, int(duration * sp['rate']))
    call_times = call_times[(call_times > 0) & (call_times < duration - sp['dur'])]

    for ct in call_times:
        start = int(ct * sample_rate)
        n_samples = int(sp['dur'] * sample_rate)
        if start + n_samples > len(t):
            continue
        # Generate call: tone with frequency sweep + envelope
        call_t = np.arange(n_samples) / sample_rate
        envelope = np.sin(np.pi * call_t / sp['dur'])  # smooth envelope
        sweep = sp['freq'] + 100 * np.sin(2 * np.pi * 5 * call_t)  # slight FM
        call = sp['amp'] * envelope * np.sin(2 * np.pi * sweep * call_t)
        signal[start:start+n_samples] += call

# Add background noise
signal += 0.05 * np.random.randn(len(signal))

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

# Spectrogram
ax1.set_facecolor('#111827')
spec_data = ax1.specgram(signal, NFFT=1024, Fs=sample_rate, noverlap=900,
                         cmap='viridis', vmin=-60, vmax=-10)
ax1.set_ylim(0, 5000)
ax1.set_xlabel('Time (s)', color='white')
ax1.set_ylabel('Frequency (Hz)', color='white')
ax1.set_title('Simulated Wetland Recording: Spectrogram', color='white', fontsize=13)
ax1.tick_params(colors='gray')

# Mark species frequency bands
for sp in species_calls:
    ax1.axhline(sp['freq'], color='white', linestyle=':', alpha=0.3)
    ax1.text(duration + 0.1, sp['freq'], sp['name'], color='white', fontsize=8, va='center')

# Species detection: power in each frequency band
ax2.set_facecolor('#111827')
freq_bands = [(sp['name'], sp['freq'] - sp['bw'], sp['freq'] + sp['bw']) for sp in species_calls]

# Calculate power in each band over time windows
window_duration = 0.5  # seconds
n_windows = int(duration / window_duration)
time_centers = np.arange(n_windows) * window_duration + window_duration/2

for sp_info, (name, f_low, f_high) in zip(species_calls, freq_bands):
    powers = []
    for w in range(n_windows):
        start = int(w * window_duration * sample_rate)
        end = int((w + 1) * window_duration * sample_rate)
        chunk = signal[start:end]
        fft = np.abs(np.fft.rfft(chunk))
        freqs = np.fft.rfftfreq(len(chunk), 1/sample_rate)
        mask = (freqs >= f_low) & (freqs <= f_high)
        power = np.mean(fft[mask]**2)
        powers.append(power)

    ax2.plot(time_centers, powers, 'o-', linewidth=1.5, markersize=3,
            color=sp_info['amp'] > 0 and sp_info.get('color', '#22c55e') or '#22c55e',
            label=name, alpha=0.8)

ax2.set_xlabel('Time (s)', color='white')
ax2.set_ylabel('Band power', color='white')
ax2.set_title('Species Detection: Power in Each Frequency Band', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', labelcolor='white', fontsize=8, ncol=3)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Species detection summary:")
print(f"  Recording duration: {duration}s")
print(f"  Species detected: {len(species_calls)}")
for sp in species_calls:
    n_calls = int(duration * sp['rate'])
    print(f"    {sp['name']:15s}: ~{n_calls} calls at {sp['freq']}Hz ({sp['rate']}/sec)")
print()
print("This is how bioacoustic monitoring works:")
print("  1. Record continuously (weeks to months)")
print("  2. Generate spectrograms")
print("  3. Identify species by their frequency 'fingerprints'")
print("  4. Count calls to estimate population sizes")
print("  5. Track changes over time to assess ecosystem health")`,
      challenge: 'Add a "noise pollution" component: constant low-frequency noise (0-1500 Hz) from a nearby road. Regenerate the spectrogram. Which species become harder to detect? This is a real problem for acoustic monitoring near human development.',
      successHint: 'From frog vocal mechanics to resonance to frequency matching to chorus synchronization to acoustic niches to bioacoustic monitoring — you have traced the science of animal communication from physics to ecology to conservation. The frogs that sing after rain are not just making noise; they are transmitting information that, with the right tools, tells us the story of their entire ecosystem. Level 2 takes this into machine learning and soundscape ecology.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">No prior acoustics or biology experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for acoustics and biology simulations. Click to start.</p>
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
