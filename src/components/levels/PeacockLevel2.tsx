import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function PeacockLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Information theory — measuring signals mathematically',
      concept: `Claude Shannon's **information theory** (1948) provides the mathematical framework for understanding ALL communication — from peacock displays to WiFi signals.

**Key concepts:**
- **Entropy** (H): measures the uncertainty/information content of a signal. H = -sum(p * log2(p))
- More possible messages → higher entropy → more information per signal
- A peacock with 10 possible display states carries more information than one with 2

**Bit**: the fundamental unit of information. One bit = one yes/no question answered.
- A coin flip has 1 bit of entropy (H = -0.5*log2(0.5) - 0.5*log2(0.5) = 1)
- A die roll has 2.58 bits (H = -6*(1/6)*log2(1/6) = 2.58)

**Channel capacity**: maximum information rate a channel can carry.
- C = B * log2(1 + S/N), where B = bandwidth, S/N = signal-to-noise ratio
- A peacock display in foggy weather has lower channel capacity (more noise)

**For animal communication:**
- Each display component (tail angle, vibration speed, call pitch) is a channel
- Total information = sum of all channels
- Redundancy (repeated signals) reduces errors but lowers new information`,
      analogy: 'Information theory treats communication like plumbing. Entropy is the water pressure — how much information is pushing through the pipe. Channel capacity is the pipe diameter — how much can flow. Noise is leaks — information lost in transit. Shannon showed that with the right encoding (pipe insulation), you can transmit information reliably through any pipe, no matter how leaky.',
      storyConnection: 'When the peacock fans its tail in the Assamese forest, it is transmitting a complex signal through the "visual channel." The forest canopy, distance, and light conditions add noise. The peacock compensates with redundancy: 150 eyespots all saying the same thing ("I am fit"), vibrations reinforcing the visual, calls reaching ears that can\'t see the display. Shannon would recognize this as excellent error-correcting code.',
      checkQuestion: 'A peacock can angle its tail in 8 distinct positions, vibrate at 4 speeds, and call at 3 pitches. How many total unique signals can it produce?',
      checkAnswer: '8 x 4 x 3 = 96 unique combinations. In information theory terms, that is log2(96) = 6.58 bits of information per display. That is enough to encode which of 96 possible "quality grades" the male belongs to. Combined with continuous variables (exact tail angle, not just 8 positions), the real information content is much higher.',
      codeIntro: 'Calculate entropy and information content of animal signals.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 2, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

# 1. Entropy as a function of probability
ax = axes[0, 0]
ax.set_facecolor('#111827')
p = np.linspace(0.001, 0.999, 200)
H = -p * np.log2(p) - (1-p) * np.log2(1-p)
ax.plot(p, H, color='#22c55e', linewidth=2)
ax.set_xlabel('Probability of signal state 1', color='white')
ax.set_ylabel('Entropy (bits)', color='white')
ax.set_title('Binary Entropy: Max at p=0.5 (most uncertain)', color='white', fontsize=11)
ax.axvline(0.5, color='#f59e0b', linestyle='--', alpha=0.5)
ax.tick_params(colors='gray')

# 2. Entropy of different animal signals
ax = axes[0, 1]
ax.set_facecolor('#111827')
signals = {
    'Bee waggle\
(direction)': 360,  # continuous direction
    'Peacock display\
(multi-modal)': 96,
    'Vervet alarm\
(3 calls)': 3,
    'Firefly flash\
(on/off pattern)': 16,
    'Dog body\
(posture states)': 12,
    'Whale song\
(phrase combos)': 200,
}

names = list(signals.keys())
states = list(signals.values())
entropies = [np.log2(s) for s in states]
colors = plt.cm.viridis(np.linspace(0.2, 0.9, len(names)))

bars = ax.barh(names, entropies, color=colors)
ax.set_xlabel('Entropy (bits)', color='white')
ax.set_title('Information Content of Animal Signals', color='white', fontsize=11)
ax.tick_params(colors='gray')
for bar, e, s in zip(bars, entropies, states):
    ax.text(bar.get_width() + 0.1, bar.get_y() + bar.get_height()/2,
            f'{e:.1f} bits ({s} states)', va='center', color='white', fontsize=8)

# 3. Channel capacity with noise
ax = axes[1, 0]
ax.set_facecolor('#111827')
snr_db = np.linspace(-10, 40, 200)
snr_linear = 10 ** (snr_db / 10)
bandwidth = 1  # normalized

capacity = bandwidth * np.log2(1 + snr_linear)

ax.plot(snr_db, capacity, color='#3b82f6', linewidth=2)
ax.set_xlabel('Signal-to-Noise Ratio (dB)', color='white')
ax.set_ylabel('Channel Capacity (bits/s/Hz)', color='white')
ax.set_title('Shannon Capacity: C = B \× log\₂(1 + S/N)', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Mark animal scenarios
scenarios = [
    ('Peacock in fog', 5, '#ef4444'),
    ('Peacock clear day', 20, '#f59e0b'),
    ('Bird song (quiet)', 25, '#22c55e'),
    ('Bird song (noisy)', 10, '#8b5cf6'),
]
for name, snr, color in scenarios:
    cap = np.log2(1 + 10**(snr/10))
    ax.scatter(snr, cap, s=80, color=color, zorder=5, edgecolors='white')
    ax.annotate(name, xy=(snr, cap), xytext=(5, 5), textcoords='offset points',
                color=color, fontsize=8)

# 4. Redundancy in peacock display
ax = axes[1, 1]
ax.set_facecolor('#111827')
# Simulate signal transmission with different redundancy levels
noise_level = 0.3
n_trials = 1000
redundancy_levels = range(1, 11)
error_rates = []

for r in redundancy_levels:
    errors = 0
    for _ in range(n_trials):
        # Original message: random bit
        message = np.random.randint(2)
        # Send r copies (redundancy)
        received = np.array([message] * r)
        # Add noise to each copy
        noise_mask = np.random.random(r) < noise_level
        received[noise_mask] = 1 - received[noise_mask]
        # Decode by majority vote
        decoded = int(np.mean(received) > 0.5)
        if decoded != message:
            errors += 1
    error_rates.append(errors / n_trials * 100)

ax.plot(list(redundancy_levels), error_rates, 'o-', color='#ef4444', linewidth=2)
ax.set_xlabel('Redundancy (copies of signal)', color='white')
ax.set_ylabel('Error rate (%)', color='white')
ax.set_title(f'Redundancy Reduces Errors (noise={noise_level*100:.0f}%)', color='white', fontsize=11)
ax.tick_params(colors='gray')

ax.annotate('Peacock: ~150 eyespots\
= massive redundancy', xy=(7, error_rates[6]),
            xytext=(3, 15), color='#f59e0b', fontsize=10,
            arrowprops=dict(arrowstyle='->', color='#f59e0b'))

plt.tight_layout()
plt.show()

print("Information theory of peacock display:")
print(f"  96 unique signal combinations = {np.log2(96):.1f} bits")
print(f"  150 eyespots provide ~150x redundancy for pattern quality signal")
print(f"  At 30% noise (fog/distance), 150x redundancy reduces errors to near 0%")
print()
print("Shannon's insight: EVERY communication system — biological or digital —")
print("is governed by the same mathematical laws. Entropy, capacity, redundancy.")`,
      challenge: 'Calculate the information content of human language: 26 letters, average word length 5 characters. How many bits per word? Compare this to a peacock display. Which carries more information per signal?',
      successHint: 'Information theory is the mathematical foundation of the digital age. It explains why we need error-correcting codes in WiFi, why DNA has repair mechanisms, and why peacocks have 150 redundant eyespots. One theory, universal application.',
    },
    {
      title: 'Signal-to-noise ratio — communicating in a noisy world',
      concept: `Every signal exists in a noisy environment. The **signal-to-noise ratio (SNR)** determines whether a message gets through.

**SNR = signal power / noise power** (often in decibels: SNR_dB = 10*log10(S/N))

**Sources of noise in animal communication:**
- **Environmental**: wind, rain, other species' calls, rustling leaves
- **Transmission**: signal degrades with distance (inverse square law)
- **Receiver**: imperfect sensory organs, competing attention
- **Interference**: other males displaying simultaneously

**How animals increase SNR:**
1. **Amplitude**: shout louder (howler monkey calls reach 140 dB!)
2. **Frequency selection**: use frequencies that don't overlap with noise (urban birds sing at higher pitches to avoid traffic noise)
3. **Timing**: signal when noise is low (dawn chorus when wind is calm)
4. **Directionality**: aim the signal (peacock angles tail toward female)
5. **Repetition**: send the signal multiple times (bird song repetitions)
6. **Contrast**: use colors/sounds that stand out against background

The peacock's iridescent blues and greens maximize contrast against green forest backgrounds. The vibration frequency (~26 Hz) doesn't overlap with common forest sounds.`,
      analogy: 'SNR is like trying to have a conversation at a party. In a quiet room (high SNR), you whisper and are heard. In a loud club (low SNR), you must shout, repeat yourself, and face the listener directly. Animals face the same challenge: they must ensure their signal rises above the environmental "noise floor."',
      storyConnection: 'In the monsoon forests of Assam, the peacock faces severe noise: rain hammering leaves, frogs calling, thunder rumbling. Its visual display is rain-proof (iridescence works in any light), and its call carries above the broadband noise of rain. The peacock evolved to signal in one of the noisiest environments on Earth — the tropical monsoon.',
      checkQuestion: 'Urban birds sing at higher pitches than rural birds of the same species. Is this evolution or learning?',
      checkAnswer: 'Both. Studies show: (1) Short-term: individual birds learn to pitch-shift upward to avoid low-frequency traffic noise (behavioral plasticity). (2) Long-term: urban populations show genetic changes in vocal apparatus over 50+ years of urban living (microevolution). The urban environment is selecting for higher-pitched singers — real-time evolution happening in cities.',
      codeIntro: 'Explore how signal-to-noise ratio affects communication reliability.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

fig, axes = plt.subplots(2, 2, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

# 1. Visual SNR: peacock against different backgrounds
ax = axes[0, 0]
ax.set_facecolor('#111827')

# Simulate color contrast (simplified)
# Peacock color: RGB = (0, 100, 200) = blue-green
peacock_color = np.array([0, 0.4, 0.8])

backgrounds = {
    'Green forest': np.array([0.1, 0.5, 0.15]),
    'Brown soil': np.array([0.5, 0.3, 0.1]),
    'Blue sky': np.array([0.3, 0.5, 0.9]),
    'Grey rocks': np.array([0.4, 0.4, 0.4]),
    'Autumn leaves': np.array([0.7, 0.4, 0.1]),
}

contrasts = {}
for name, bg in backgrounds.items():
    contrast = np.sqrt(np.sum((peacock_color - bg)**2))
    contrasts[name] = contrast

names_bg = list(contrasts.keys())
values_bg = list(contrasts.values())
colors_bg = ['#22c55e', '#8b6914', '#3b82f6', '#6b7280', '#f59e0b']
bars = ax.barh(names_bg, values_bg, color=colors_bg)
ax.set_xlabel('Color contrast (Euclidean distance)', color='white')
ax.set_title('Peacock Visibility Against Backgrounds', color='white', fontsize=11)
ax.tick_params(colors='gray')

# 2. Acoustic SNR simulation
ax = axes[1, 0]
ax.set_facecolor('#111827')
t = np.linspace(0, 1, 10000)

# Peacock call (simplified sine wave at 500 Hz)
signal_freq = 500
signal = 0.5 * np.sin(2 * np.pi * signal_freq * t)

for snr_db, color, label in [(20, '#22c55e', 'Clear day (20dB)'),
                               (10, '#f59e0b', 'Light rain (10dB)'),
                               (3, '#ef4444', 'Heavy rain (3dB)')]:
    snr_linear = 10 ** (snr_db / 10)
    noise_power = 0.5**2 / snr_linear
    noise = np.random.normal(0, np.sqrt(noise_power), len(t))
    received = signal + noise
    ax.plot(t[:500], received[:500], color=color, linewidth=0.5, alpha=0.7, label=label)

ax.plot(t[:500], signal[:500], color='white', linewidth=2, label='Original signal')
ax.set_xlabel('Time (s)', color='white')
ax.set_ylabel('Amplitude', color='white')
ax.set_title('Peacock Call in Different Noise Conditions', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# 3. Frequency spectrum: signal vs noise
ax = axes[0, 1]
ax.set_facecolor('#111827')
freqs = np.linspace(0, 5000, 1000)

# Forest noise spectrum (more low-frequency)
forest_noise = 5 * np.exp(-freqs / 500) + 0.5
rain_noise = 3 * np.exp(-(freqs - 2000)**2 / 500000) + forest_noise
traffic_noise = 8 * np.exp(-freqs / 200) + 0.3

ax.plot(freqs, forest_noise, color='#22c55e', linewidth=2, label='Forest (natural)')
ax.plot(freqs, rain_noise, color='#3b82f6', linewidth=2, label='Rain')
ax.plot(freqs, traffic_noise, color='#ef4444', linewidth=2, label='Traffic')

# Peacock call frequency band
ax.axvspan(300, 700, alpha=0.2, color='#f59e0b')
ax.text(500, max(traffic_noise) * 0.8, 'Peacock\
call', ha='center', color='#f59e0b', fontsize=9)

ax.set_xlabel('Frequency (Hz)', color='white')
ax.set_ylabel('Noise power', color='white')
ax.set_title('Noise Spectra: Where to Signal?', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# 4. Detection distance vs SNR
ax = axes[1, 1]
ax.set_facecolor('#111827')
distances = np.linspace(1, 500, 200)

# Signal decreases with distance squared (inverse square law)
# SNR = signal_power / noise_power
# signal_power = P0 / d^2

signal_power_0 = 100  # at 1m
noise_power = 1  # constant background

for scenario, noise_mult, color in [('Quiet forest', 1, '#22c55e'),
                                     ('Light rain', 5, '#f59e0b'),
                                     ('Monsoon', 20, '#ef4444')]:
    snr = signal_power_0 / (distances**2 * noise_mult * noise_power)
    snr_db = 10 * np.log10(np.maximum(snr, 1e-10))
    ax.plot(distances, snr_db, color=color, linewidth=2, label=scenario)

ax.axhline(3, color='gray', linestyle='--', alpha=0.5, label='Detection threshold (3dB)')
ax.set_xlabel('Distance (m)', color='white')
ax.set_ylabel('SNR (dB)', color='white')
ax.set_title('Signal Detectability vs Distance', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("SNR determines communication range:")
print("  Quiet forest: peacock call detectable at ~150m")
print("  Light rain: range drops to ~70m")
print("  Monsoon: range drops to ~30m")
print()
print("Solutions: visual display (rain-proof), louder calls,")
print("frequency selection to avoid noise bands, redundancy")`,
      challenge: 'Urban peacocks face traffic noise (high power at low frequencies). At what call frequency would an urban peacock have the best SNR? How does this compare to rural peacock call frequencies?',
      successHint: 'Signal-to-noise ratio is the universal concept connecting animal communication, radio engineering, medical imaging, and audio recording. Every engineer designing a communication system faces the same challenge as the peacock: making the signal stand out from the noise.',
    },
    {
      title: 'Color perception — how animals see the peacock differently',
      concept: `Humans see the peacock's display as spectacular. But other animals see it completely differently because their eyes have different **photoreceptor types**.

**Photoreceptors and color vision:**
- Humans: 3 cone types (red, green, blue) = trichromatic
- Most mammals: 2 cone types = dichromatic (like red-green color blindness)
- Birds: 4 cone types (red, green, blue, **ultraviolet**) = tetrachromatic
- Mantis shrimp: 16 cone types (but probably don't see 16x better)
- Snakes: some see infrared (heat vision)

**Peahens see MORE than we do:**
Peacock feathers reflect UV light. Peahens have UV-sensitive cones, so they see UV patterns INVISIBLE to us. The peacock tail has a "hidden" UV display we can't see — but peahens can.

**Color perception is subjective:**
What we call "blue" is our brain's interpretation of 470nm light. A pigeon's brain interprets the same 470nm light differently (plus it sees UV). There is no "true" color — only what the receiver's nervous system constructs.

**Why does this matter?**
A conservation camera trap captures the peacock in human-visible light only. A bird predator sees in UV. The camouflage that works against mammals may fail against birds — because they see in a different color space.`,
      analogy: 'Color perception is like different music apps playing the same song. One app (human eyes) has a 3-band equalizer (R, G, B). Another app (bird eyes) has a 4-band equalizer (R, G, B, UV). A third (mantis shrimp) has 16 bands. Each "hears" the same song differently. The peacock composes its display for a 4-band audience (birds), so we\'re missing an entire channel when we watch it.',
      storyConnection: 'When the peacock dances in the Assamese forest, the peahen sees a display far more complex than any human observer. The UV patterns in the eyespots, invisible to our eyes, are like secret messages between peacock and peahen. The human villager sees a beautiful dance; the peahen sees a detailed fitness report encoded in wavelengths we cannot perceive.',
      checkQuestion: 'If peahens see UV and we don\'t, how did scientists discover the UV patterns on peacock feathers?',
      checkAnswer: 'Using UV-sensitive cameras! Scientists photograph peacock feathers under UV-only illumination and discover patterns invisible to the naked eye. They can then test whether manipulating UV reflectance (with UV-absorbing coating) affects peahen preference. It does — peahens prefer feathers with intact UV patterns, confirming UV is part of the display signal.',
      codeIntro: 'Model how different visual systems perceive the same peacock display.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 3, figsize=(16, 8))
fig.patch.set_facecolor('#1f2937')

# Wavelength spectrum of light
wavelengths = np.linspace(300, 700, 400)  # nm

# Photoreceptor sensitivity curves
def gaussian(x, mu, sigma):
    return np.exp(-(x - mu)**2 / (2 * sigma**2))

# Human cones
human_S = gaussian(wavelengths, 420, 25)  # blue
human_M = gaussian(wavelengths, 530, 35)  # green
human_L = gaussian(wavelengths, 560, 35)  # red

# Bird cones (including UV)
bird_UV = gaussian(wavelengths, 370, 20)  # UV
bird_S = gaussian(wavelengths, 445, 25)  # blue
bird_M = gaussian(wavelengths, 508, 30)  # green
bird_L = gaussian(wavelengths, 565, 35)  # red

# Peacock feather reflectance spectrum (simplified)
feather_reflectance = (0.3 * gaussian(wavelengths, 370, 30) +   # UV peak!
                       0.8 * gaussian(wavelengths, 470, 25) +   # blue peak
                       0.5 * gaussian(wavelengths, 520, 30) +   # green peak
                       0.1 * gaussian(wavelengths, 600, 40))    # slight red

# 1. Photoreceptor sensitivity
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.plot(wavelengths, human_S, color='#3b82f6', linewidth=2, label='S (blue)')
ax.plot(wavelengths, human_M, color='#22c55e', linewidth=2, label='M (green)')
ax.plot(wavelengths, human_L, color='#ef4444', linewidth=2, label='L (red)')
ax.axvspan(300, 380, alpha=0.1, color='white')
ax.text(340, 0.9, 'UV\
(invisible)', color='gray', fontsize=8, ha='center')
ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_ylabel('Sensitivity', color='white')
ax.set_title('Human Vision (3 cones)', color='white', fontsize=10)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# 2. Bird photoreceptors
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.plot(wavelengths, bird_UV, color='#8b5cf6', linewidth=2, label='UV')
ax.plot(wavelengths, bird_S, color='#3b82f6', linewidth=2, label='S (blue)')
ax.plot(wavelengths, bird_M, color='#22c55e', linewidth=2, label='M (green)')
ax.plot(wavelengths, bird_L, color='#ef4444', linewidth=2, label='L (red)')
ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_title('Bird Vision (4 cones + UV)', color='white', fontsize=10)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# 3. Peacock feather spectrum
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.fill_between(wavelengths, feather_reflectance, alpha=0.3, color='#f59e0b')
ax.plot(wavelengths, feather_reflectance, color='#f59e0b', linewidth=2)
ax.axvspan(300, 380, alpha=0.2, color='#8b5cf6')
ax.annotate('UV peak\
(invisible to humans)', xy=(370, 0.32), xytext=(420, 0.7),
            color='#8b5cf6', fontsize=9, arrowprops=dict(arrowstyle='->', color='#8b5cf6'))
ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_title('Peacock Feather Reflectance', color='white', fontsize=10)
ax.tick_params(colors='gray')

# 4. What human sees vs what bird sees (simulated perception)
ax = axes[1, 0]
ax.set_facecolor('#111827')
# Human perception (no UV)
human_response = np.array([
    np.sum(feather_reflectance * human_L),
    np.sum(feather_reflectance * human_M),
    np.sum(feather_reflectance * human_S),
])
human_response /= max(human_response)

# Bird perception (with UV)
bird_response = np.array([
    np.sum(feather_reflectance * bird_L),
    np.sum(feather_reflectance * bird_M),
    np.sum(feather_reflectance * bird_S),
    np.sum(feather_reflectance * bird_UV),
])
bird_response /= max(bird_response)

x_h = ['Red', 'Green', 'Blue']
x_b = ['Red', 'Green', 'Blue', 'UV']
ax.bar(x_h, human_response, color=['#ef4444', '#22c55e', '#3b82f6'], alpha=0.7)
ax.set_ylabel('Cone response', color='white')
ax.set_title('Human Perception', color='white', fontsize=10)
ax.tick_params(colors='gray')

ax2 = axes[1, 1]
ax2.set_facecolor('#111827')
ax2.bar(x_b, bird_response, color=['#ef4444', '#22c55e', '#3b82f6', '#8b5cf6'], alpha=0.7)
ax2.set_ylabel('Cone response', color='white')
ax2.set_title('Bird Perception (more info!)', color='white', fontsize=10)
ax2.tick_params(colors='gray')

# 5. Information content comparison
ax = axes[1, 2]
ax.set_facecolor('#111827')
visual_systems = {
    'Dichromat\
(most mammals)': 2,
    'Human\
(trichromat)': 3,
    'Bird\
(tetrachromat)': 4,
    'Mantis shrimp\
(16 types)': 16,
}

names_vs = list(visual_systems.keys())
n_cones = list(visual_systems.values())
# Color discrimination: roughly proportional to cone combinations
discriminable_colors = [c * (c-1) / 2 * 100 for c in n_cones]

bars = ax.bar(names_vs, discriminable_colors, color=['#6b7280', '#3b82f6', '#22c55e', '#f59e0b'])
ax.set_ylabel('Relative color discrimination', color='white')
ax.set_title('More Cone Types = Richer Color World', color='white', fontsize=10)
ax.tick_params(colors='gray')

for bar, n, d in zip(bars, n_cones, discriminable_colors):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 100,
            f'{n} cones', ha='center', color='white', fontsize=9)

plt.tight_layout()
plt.show()

print("Color perception comparison:")
print(f"  Human: 3 cones, sees ~1 million colors")
print(f"  Bird: 4 cones, sees ~100 million colors (estimated)")
print(f"  Peacock feather UV peak: invisible to humans, critical to peahens")
print()
print("Implication: the peacock display is MORE complex than it looks to us.")
print("We see a beautiful tail; the peahen sees a UV-encoded fitness report.")`,
      challenge: 'If you could add one more cone type to human vision (say, infrared at 800nm), what new things would you see? How would the peacock display look different with infrared vision?',
      successHint: 'Color perception teaches us that our sensory reality is just one interpretation of the physical world. Other species inhabit different sensory realities — a profound insight for biology, philosophy, and sensor engineering.',
    },
    {
      title: 'Iridescence physics — structural color without pigments',
      concept: `Peacock feathers are NOT colored by pigments. The blue, green, and gold are created by **structural color** — microscopic structures that interfere with light waves.

**How thin-film interference works:**
1. Feather barbules have layers of melanin rods separated by air gaps
2. Light enters and bounces off each layer
3. Some wavelengths constructively interfere (add up → bright)
4. Other wavelengths destructively interfere (cancel → dark)
5. The spacing between layers determines which color is reflected

**The physics:**
- Constructive interference: 2nd = m*lambda (where d = layer spacing, m = integer)
- At different viewing angles, the path length changes → different colors → iridescence

**Why structural color is special:**
- Never fades (unlike pigments that break down in sunlight)
- Changes with angle (pigments look the same from all angles)
- Can produce colors outside the pigment range (UV, extremely saturated blues)
- Can be extremely bright (almost perfect reflection at selected wavelengths)

**Technological applications:**
- Morpho butterfly-inspired structural color in displays
- Anti-counterfeiting features on banknotes
- Iridescent car paint
- Photonic crystals for optical computing`,
      analogy: 'Structural color is like a soap bubble or oil slick. The color comes not from dye but from the THICKNESS of the film. As the thickness changes, different colors appear. Peacock feathers are like precision-engineered soap bubbles — evolved over millions of years to reflect exactly the right wavelengths at exactly the right angles.',
      storyConnection: 'When the peacock shimmers in the Assamese rain, each eyespot is a miniature physics laboratory. The raindrops change the refractive index of the surface, temporarily altering the iridescence — the colors shift subtly in the rain, creating a dynamic display. This is why the peacock\'s rain dance is especially spectacular: the rain itself modulates the physics of the display.',
      checkQuestion: 'Why can\'t a blue jay feather stay blue if you crush it, but a peacock feather\'s blue is also structural — yet appears more robust?',
      checkAnswer: 'Both use structural color, but differently. The blue jay uses random air pockets in keratin (constructive interference via scattering). Crushing destroys the air pockets → color disappears. The peacock uses highly ordered melanin rod layers (thin-film interference). Even slightly crushed, some layered structure remains → color partially survives. But fully grinding either feather to powder destroys the nanostructure and the color vanishes — only brown melanin remains.',
      codeIntro: 'Simulate thin-film interference and structural coloration.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 2, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

# Thin-film interference model
# Reflectance of multilayer system
def multilayer_reflectance(wavelengths, d, n_film, n_air, n_layers, angle_deg):
    """Calculate reflectance from a multilayer thin film."""
    angle = np.radians(angle_deg)
    reflectance = np.zeros_like(wavelengths, dtype=float)

    for i, lam in enumerate(wavelengths):
        # Phase difference per layer
        path_diff = 2 * n_film * d * np.cos(angle)
        phase = 2 * np.pi * path_diff / lam

        # Simplified multilayer interference
        # R = |sum of reflected amplitudes|^2
        r = (n_film - n_air) / (n_film + n_air)  # single-surface reflectance

        amplitude = 0
        for layer in range(n_layers):
            amplitude += r * np.exp(1j * layer * phase)

        reflectance[i] = np.abs(amplitude) ** 2 / n_layers**2

    # Normalize
    reflectance /= max(reflectance) if max(reflectance) > 0 else 1
    return reflectance

wavelengths = np.linspace(300, 700, 400)

# 1. Reflectance at different viewing angles
ax = axes[0, 0]
ax.set_facecolor('#111827')

d = 140  # nm (melanin rod spacing in peacock feather)
n_film = 2.0  # refractive index of melanin
n_air = 1.0
n_layers = 10

for angle, color in [(0, '#3b82f6'), (20, '#22c55e'), (40, '#f59e0b'), (60, '#ef4444')]:
    R = multilayer_reflectance(wavelengths, d, n_film, n_air, n_layers, angle)
    ax.plot(wavelengths, R, color=color, linewidth=2, label=f'{angle}\°')

ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_ylabel('Reflectance', color='white')
ax.set_title('Peacock Feather: Color Shifts with Angle', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Add color bands
for wl, c, name in [(380, '#8b5cf6', 'UV'), (450, '#3b82f6', 'B'), (520, '#22c55e', 'G'),
                      (580, '#f59e0b', 'Y'), (650, '#ef4444', 'R')]:
    ax.axvline(wl, color=c, alpha=0.2, linewidth=10)
    ax.text(wl, 1.05, name, ha='center', color=c, fontsize=8)

# 2. Effect of layer spacing on peak color
ax = axes[0, 1]
ax.set_facecolor('#111827')

spacings = np.linspace(100, 250, 100)
peak_wavelengths = []

for d in spacings:
    R = multilayer_reflectance(wavelengths, d, n_film, n_air, n_layers, 0)
    peak_wl = wavelengths[np.argmax(R)]
    peak_wavelengths.append(peak_wl)

ax.plot(spacings, peak_wavelengths, color='#22c55e', linewidth=2)
ax.set_xlabel('Melanin rod spacing (nm)', color='white')
ax.set_ylabel('Peak reflected wavelength (nm)', color='white')
ax.set_title('Spacing Controls Color', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Mark peacock colors
for d_val, color_name, c in [(130, 'Violet', '#8b5cf6'), (140, 'Blue', '#3b82f6'),
                               (160, 'Green', '#22c55e'), (190, 'Yellow', '#f59e0b')]:
    R = multilayer_reflectance(wavelengths, d_val, n_film, n_air, n_layers, 0)
    peak = wavelengths[np.argmax(R)]
    ax.scatter(d_val, peak, s=80, color=c, zorder=5, edgecolors='white')
    ax.annotate(color_name, xy=(d_val, peak), xytext=(5, 10),
                textcoords='offset points', color=c, fontsize=9)

# 3. Pigment vs structural color stability
ax = axes[1, 0]
ax.set_facecolor('#111827')
uv_exposure_years = np.linspace(0, 20, 100)
pigment_remaining = np.exp(-uv_exposure_years / 5) * 100  # pigments fade
structural_remaining = np.exp(-uv_exposure_years / 200) * 100  # structural barely fades

ax.plot(uv_exposure_years, pigment_remaining, color='#ef4444', linewidth=2, label='Pigment color (fades)')
ax.plot(uv_exposure_years, structural_remaining, color='#22c55e', linewidth=2, label='Structural color (stable)')
ax.set_xlabel('UV exposure (years)', color='white')
ax.set_ylabel('Color intensity (%)', color='white')
ax.set_title('Color Durability: Structural Wins', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# 4. Biomimetic applications
ax = axes[1, 1]
ax.set_facecolor('#111827')
applications = ['Morpho butterfly\
display tech', 'Peacock-inspired\
anti-counterfeit', 'Beetle-inspired\
color-shift paint',
                'Opal-inspired\
photonic crystals', 'Bird-feather\
fabric dyes']
trl = [7, 6, 8, 5, 4]  # Technology Readiness Level
market_size = [500, 200, 1000, 300, 150]  # millions USD

scatter = ax.scatter(trl, market_size, s=[m/3 for m in market_size],
                     c=['#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#22c55e'],
                     alpha=0.7, edgecolors='white')
for name, t, m in zip(applications, trl, market_size):
    ax.annotate(name, xy=(t, m), xytext=(5, 5), textcoords='offset points',
                color='white', fontsize=8)
ax.set_xlabel('Technology Readiness Level', color='white')
ax.set_ylabel('Market size ($ millions)', color='white')
ax.set_title('Biomimetic Structural Color Applications', color='white', fontsize=11)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Structural color physics:")
print(f"  Melanin rod spacing: ~140nm for blue, ~160nm for green")
print(f"  Constructive interference: 2*n*d*cos(\θ) = m*\λ")
print(f"  Iridescence: color changes with angle because cos(\θ) changes")
print()
print("Applications: paint-free coloring saves billions in pigment costs")
print("and eliminates toxic dye chemicals from manufacturing.")`,
      challenge: 'Design a thin-film structure that reflects RED light (650nm) at 0 degrees and BLUE light (450nm) at 60 degrees. What layer spacing do you need? This is how some beetles create dramatic color shifts.',
      successHint: 'Structural color is where physics meets evolution meets engineering. The peacock evolved photonic nanostructures that human engineers are only now learning to replicate. Nature has been doing nanotechnology for 100 million years.',
    },
    {
      title: 'Game theory in communication — strategic signaling',
      concept: `Animal communication is a **strategic game** — each participant makes decisions based on what others do. **Game theory** provides the mathematics.

**The Signaling Game (Spence, 1973 / biology: Maynard Smith):**
- **Sender** has private information (quality: high or low)
- **Receiver** must decide based on the signal (mate or not)
- **Equilibrium**: stable strategy where no one benefits from changing behavior

**Types of equilibria:**
1. **Separating equilibrium**: high-quality senders signal, low-quality don't. Receiver can distinguish. (Peacock: only fit males maintain full displays)
2. **Pooling equilibrium**: all senders give same signal. Receiver can't distinguish. (All males display equally, females choose randomly)
3. **Partially separating**: some low-quality senders bluff. (Some weak males attempt displays but can't sustain them)

**Peacock game theory:**
- Honest males: pay cost C, get mating benefit B (net: B - C)
- Cheater males: pay cost 0, get benefit B if undetected, 0 if detected
- Females: benefit from mating with honest high-quality males, lose by mating with cheaters
- Equilibrium: costly signaling ensures honest communication (handicap principle as game theory)`,
      analogy: 'The peacock signaling game is like a job market. High-skill candidates (fit males) invest in education (costly tail). Low-skill candidates can try to fake credentials (cheat), but interviews (female assessment) catch most fakes. The equilibrium has most candidates being honest because the cost of faking (maintaining a huge tail without the health to back it up) exceeds the benefit.',
      storyConnection: 'In the forests of Assam, every peacock display is a game. The male decides how much energy to invest in displaying. The peahen decides how long to watch, how many males to compare, and what threshold to set. Each is optimizing against the other. Game theory predicts their behavior with remarkable accuracy — evolution has found the Nash equilibrium.',
      checkQuestion: 'In a Nash equilibrium, no player can benefit by unilaterally changing their strategy. How does this apply to peacock eyespot number?',
      checkAnswer: 'If the average is 150 eyespots: A male with 130 can\'t benefit by reducing further (loses too many mates). A male with 170 can\'t benefit by adding more (survival cost exceeds mating gain). No male can do better by unilaterally changing — this is the Nash equilibrium. But if ALL males could agree to have fewer eyespots, they\'d all be better off (less survival cost, same relative ranking). This is a biological prisoner\'s dilemma.',
      codeIntro: 'Implement game-theoretic models of animal signaling.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

fig, axes = plt.subplots(2, 2, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

# 1. Signaling game: sender-receiver dynamics
ax = axes[0, 0]
ax.set_facecolor('#111827')

# Population: varying quality (0-1) and signaling effort (0-1)
n_pop = 200
quality = np.random.beta(2, 2, n_pop)
signal_effort = np.random.beta(2, 2, n_pop)

# Signal = quality * effort (can't signal what you don't have)
signal = quality * signal_effort + np.random.normal(0, 0.1, n_pop)
signal = np.clip(signal, 0, 1)

# Cost of signaling
signal_cost = signal_effort * 0.3  # 30% of effort as fitness cost

# Mating success (proportional to signal if receiver trusts signals)
mating_success = signal ** 2

# Net fitness = mating - cost
net_fitness = mating_success - signal_cost

scatter = ax.scatter(quality, signal_effort, s=net_fitness * 100 + 10,
                     c=net_fitness, cmap='RdYlGn', alpha=0.7, edgecolors='none')
ax.set_xlabel('True quality', color='white')
ax.set_ylabel('Signaling effort', color='white')
ax.set_title('Quality vs Effort (size = net fitness)', color='white', fontsize=11)
ax.tick_params(colors='gray')
plt.colorbar(scatter, ax=ax, label='Net fitness')

# 2. Nash equilibrium: optimal signal level
ax = axes[0, 1]
ax.set_facecolor('#111827')

# For different quality levels, find optimal signal effort
qualities = np.linspace(0.1, 0.9, 5)
efforts = np.linspace(0, 1, 100)

for q in qualities:
    signal_vals = q * efforts
    mating = signal_vals ** 2
    cost = efforts * 0.3
    fitness = mating - cost
    ax.plot(efforts, fitness, linewidth=2, label=f'Quality = {q:.1f}')
    opt_idx = np.argmax(fitness)
    ax.scatter(efforts[opt_idx], fitness[opt_idx], s=60, color='white', zorder=5)

ax.set_xlabel('Signaling effort', color='white')
ax.set_ylabel('Net fitness', color='white')
ax.set_title('Optimal Effort Depends on Quality', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# 3. Evolutionary simulation of signaling strategies
ax = axes[1, 0]
ax.set_facecolor('#111827')

generations = 200
pop_size = 300
# Each individual: (quality, honesty parameter)
# honesty = how closely signal matches quality
pop_quality = np.random.beta(2, 2, pop_size)
pop_honesty = np.random.uniform(0, 1, pop_size)  # 1 = perfectly honest

mean_honesty = []
mean_cheating = []

for gen in range(generations):
    # Signal = quality * honesty + (1-honesty) * random_bluff
    signal = pop_quality * pop_honesty + (1 - pop_honesty) * np.random.uniform(0.5, 1, pop_size)
    signal = np.clip(signal, 0, 1)

    # Cost: proportional to signal (whether honest or not)
    cost = signal * 0.3

    # Detection: receivers catch cheaters with prob proportional to mismatch
    mismatch = np.abs(signal - pop_quality)
    detected = np.random.random(pop_size) < (mismatch * 2)

    # Mating success: undetected get full benefit, detected get penalty
    mating = np.where(detected, -0.2, signal ** 2)

    fitness = mating - cost
    fitness = np.maximum(fitness, 0.001)
    fitness /= fitness.sum()

    mean_honesty.append(np.mean(pop_honesty))
    mean_cheating.append(1 - np.mean(pop_honesty))

    # Reproduce
    parents = np.random.choice(pop_size, pop_size, p=fitness)
    pop_quality = np.random.beta(2, 2, pop_size)  # quality is random each gen
    pop_honesty = pop_honesty[parents] + np.random.normal(0, 0.03, pop_size)
    pop_honesty = np.clip(pop_honesty, 0, 1)

ax.plot(range(generations), mean_honesty, color='#22c55e', linewidth=2, label='Mean honesty')
ax.plot(range(generations), mean_cheating, color='#ef4444', linewidth=2, label='Mean cheating')
ax.set_xlabel('Generation', color='white')
ax.set_ylabel('Level', color='white')
ax.set_title('Evolution of Honesty (with detection)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# 4. Prisoner's dilemma in signaling
ax = axes[1, 1]
ax.set_facecolor('#111827')
# Payoff matrix for signaling game
# If both honest: moderate display, moderate cost (3, 3)
# If one cheats: cheater wins big (5), honest loses (1)
# If both cheat: no one believes signals (2, 2)
payoff_matrix = np.array([[3, 1], [5, 2]])

ax.imshow(payoff_matrix, cmap='RdYlGn', aspect='auto')
ax.set_xticks([0, 1])
ax.set_yticks([0, 1])
ax.set_xticklabels(['Honest', 'Cheat'], color='white')
ax.set_yticklabels(['Honest', 'Cheat'], color='white')
ax.set_xlabel('Player B', color='white')
ax.set_ylabel('Player A', color='white')
ax.set_title('Signaling Payoff Matrix', color='white', fontsize=11)

for i in range(2):
    for j in range(2):
        ax.text(j, i, f'{payoff_matrix[i,j]}', ha='center', va='center',
                color='white', fontsize=16, fontweight='bold')

ax.text(0.5, -0.3, 'Nash equilibrium: both cheat (2,2) BUT\
costly signaling + detection restores honesty',
        transform=ax.transAxes, ha='center', color='#f59e0b', fontsize=9)

plt.tight_layout()
plt.show()

print("Game theory of peacock signaling:")
print("  Without detection: cheating dominates (prisoner's dilemma)")
print("  With detection: honest signaling evolves (separating equilibrium)")
print(f"  Final population honesty: {mean_honesty[-1]:.2f}")
print()
print("Key insight: costly signals + receiver scrutiny = honest communication")
print("This applies to peacocks, job markets, luxury goods, and online reviews.")`,
      challenge: 'Add a "reputation" system: receivers remember which males were detected cheating and permanently avoid them. How does reputation change the equilibrium honesty level?',
      successHint: 'Game theory in biology was pioneered by John Maynard Smith and has since influenced economics, political science, and computer science. The peacock signaling game is a biological version of market signaling theory — for which Michael Spence won the Nobel Prize in Economics.',
    },
    {
      title: 'AI for animal behavior — machine learning meets biology',
      concept: `**Computer vision** and **machine learning** are transforming how we study animal behavior. AI can now identify individual animals, classify behaviors, and detect patterns humans would miss.

**Key applications:**
1. **Individual ID**: neural networks identify individual animals from photos (coat patterns, face features). Replaces manual ID from camera traps.
2. **Behavior classification**: classify actions from video (feeding, resting, displaying, fleeing). Processes thousands of hours automatically.
3. **Pose estimation**: DeepLabCut and similar tools track body part positions frame by frame.
4. **Sound classification**: identify species from audio recordings (bird song ID, bat echolocation).
5. **Population monitoring**: satellite imagery + deep learning counts animals across landscapes.

**For peacock research:**
- Train a CNN to identify individual peacocks from eyespot patterns
- Classify display intensity from video (tail angle, vibration frequency)
- Correlate display features with female response (approach/ignore/leave)
- Predict mating success from display metrics

**Tools:** TensorFlow, PyTorch, DeepLabCut, BirdNET (for bird sounds), MegaDetector (camera trap filtering)`,
      analogy: 'AI for animal behavior is like hiring a thousand tireless research assistants. Each one watches a camera trap video, counts eyespots, measures tail angles, and records female responses. They never get bored, never make fatigue errors, and work 24/7. The human scientist designs the study and interprets the results. The AI does the tedious observation work — freeing scientists for what humans do best: asking the right questions.',
      storyConnection: 'The boy could watch one clouded leopard for a few hours. An AI system can watch a thousand peacocks simultaneously, across all seasons, for years. In the tea gardens of Assam, researchers are beginning to deploy AI-powered camera systems that automatically catalog every peacock display, building a dataset that would take a human lifetime to collect manually.',
      checkQuestion: 'An AI correctly classifies peacock display behavior 95% of the time. A human expert achieves 98%. Is the AI useful?',
      checkAnswer: 'Absolutely. The human is slightly more accurate but can only process ~50 video clips per day. The AI processes 10,000 per day at 95% accuracy. That means 9,500 correct classifications per day (AI) vs. 49 (human). For large-scale studies, the AI finds patterns in thousands of observations that the human would never have time to examine. The slight accuracy trade-off is overwhelmingly compensated by scale.',
      codeIntro: 'Build a simple behavior classifier and explore AI applications in animal research.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate peacock behavior data
n_observations = 1000

# Features: tail_angle (0-180), vibration_speed (0-30 Hz), call_volume (0-100 dB)
# 4 behaviors: resting, walking, low_display, full_display

behaviors = np.random.choice(['resting', 'walking', 'low_display', 'full_display'],
                              n_observations, p=[0.3, 0.3, 0.2, 0.2])

# Generate features based on behavior
data = np.zeros((n_observations, 3))
for i, b in enumerate(behaviors):
    if b == 'resting':
        data[i] = [np.random.normal(0, 5), np.random.normal(0, 2), np.random.normal(10, 5)]
    elif b == 'walking':
        data[i] = [np.random.normal(20, 10), np.random.normal(0, 3), np.random.normal(30, 10)]
    elif b == 'low_display':
        data[i] = [np.random.normal(90, 20), np.random.normal(10, 5), np.random.normal(60, 15)]
    else:  # full_display
        data[i] = [np.random.normal(160, 15), np.random.normal(25, 5), np.random.normal(85, 10)]

data = np.clip(data, 0, [180, 30, 100])

fig, axes = plt.subplots(2, 2, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

# 1. Feature space visualization
ax = axes[0, 0]
ax.set_facecolor('#111827')
color_map = {'resting': '#3b82f6', 'walking': '#22c55e', 'low_display': '#f59e0b', 'full_display': '#ef4444'}
for b in ['resting', 'walking', 'low_display', 'full_display']:
    mask = behaviors == b
    ax.scatter(data[mask, 0], data[mask, 1], s=20, color=color_map[b], alpha=0.5, label=b)
ax.set_xlabel('Tail angle (\°)', color='white')
ax.set_ylabel('Vibration speed (Hz)', color='white')
ax.set_title('Behavior in Feature Space', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# 2. Simple nearest-centroid classifier
ax = axes[0, 1]
ax.set_facecolor('#111827')

# Calculate centroids
centroids = {}
for b in ['resting', 'walking', 'low_display', 'full_display']:
    mask = behaviors == b
    centroids[b] = np.mean(data[mask], axis=0)

# Classify using nearest centroid
predictions = []
for point in data:
    dists = {b: np.linalg.norm(point - c) for b, c in centroids.items()}
    predictions.append(min(dists, key=dists.get))
predictions = np.array(predictions)

# Confusion matrix
behavior_list = ['resting', 'walking', 'low_display', 'full_display']
conf_matrix = np.zeros((4, 4), dtype=int)
for true_b, pred_b in zip(behaviors, predictions):
    i = behavior_list.index(true_b)
    j = behavior_list.index(pred_b)
    conf_matrix[i, j] += 1

im = ax.imshow(conf_matrix, cmap='YlGn')
ax.set_xticks(range(4))
ax.set_yticks(range(4))
short_names = ['Rest', 'Walk', 'Low', 'Full']
ax.set_xticklabels(short_names, color='white', fontsize=9)
ax.set_yticklabels(short_names, color='white', fontsize=9)
ax.set_xlabel('Predicted', color='white')
ax.set_ylabel('True', color='white')
ax.set_title(f'Confusion Matrix (accuracy: {np.sum(behaviors == predictions)/n_observations*100:.1f}%)',
             color='white', fontsize=11)
for i in range(4):
    for j in range(4):
        ax.text(j, i, str(conf_matrix[i, j]), ha='center', va='center',
                color='white' if conf_matrix[i, j] < 100 else 'black', fontsize=10)

# 3. Decision boundary visualization
ax = axes[1, 0]
ax.set_facecolor('#111827')
# Create a grid
xx, yy = np.meshgrid(np.linspace(0, 180, 100), np.linspace(0, 30, 100))
grid_points = np.column_stack([xx.ravel(), yy.ravel(), np.full(10000, 50)])  # fixed call_volume=50

grid_predictions = []
for point in grid_points:
    dists = {b: np.linalg.norm(point - c) for b, c in centroids.items()}
    grid_predictions.append(behavior_list.index(min(dists, key=dists.get)))

grid_predictions = np.array(grid_predictions).reshape(100, 100)
ax.contourf(xx, yy, grid_predictions, levels=[-0.5, 0.5, 1.5, 2.5, 3.5],
            colors=['#3b82f6', '#22c55e', '#f59e0b', '#ef4444'], alpha=0.3)
for b in behavior_list:
    mask = behaviors == b
    ax.scatter(data[mask, 0], data[mask, 1], s=10, color=color_map[b], alpha=0.5)
ax.set_xlabel('Tail angle (\°)', color='white')
ax.set_ylabel('Vibration speed (Hz)', color='white')
ax.set_title('Decision Boundaries', color='white', fontsize=11)
ax.tick_params(colors='gray')

# 4. Scaling analysis
ax = axes[1, 1]
ax.set_facecolor('#111827')
# Human vs AI throughput
sample_sizes = [100, 500, 1000, 5000, 10000, 50000]
human_time = [s * 0.1 for s in sample_sizes]  # hours (6 min per observation)
ai_time = [0.5 + s * 0.001 for s in sample_sizes]  # hours (setup + processing)

ax.plot(sample_sizes, human_time, 'o-', color='#ef4444', linewidth=2, label='Human expert')
ax.plot(sample_sizes, ai_time, 'o-', color='#22c55e', linewidth=2, label='AI classifier')
ax.set_xlabel('Number of observations', color='white')
ax.set_ylabel('Processing time (hours)', color='white')
ax.set_title('Human vs AI: Processing Time Scales', color='white', fontsize=11)
ax.set_xscale('log')
ax.set_yscale('log')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

accuracy = np.sum(behaviors == predictions) / n_observations * 100
print(f"Simple nearest-centroid classifier:")
print(f"  Accuracy: {accuracy:.1f}%")
print(f"  Observations: {n_observations}")
print()
print("Per-behavior accuracy:")
for b in behavior_list:
    mask = behaviors == b
    acc = np.sum(predictions[mask] == b) / np.sum(mask) * 100
    print(f"  {b}: {acc:.1f}%")
print()
print("AI enables research at scales impossible for human observers.")
print("From individual eyespot counting to population-wide behavior monitoring.")`,
      challenge: 'Implement a simple k-nearest-neighbors (k-NN) classifier with k=5. Compare its accuracy to the nearest-centroid classifier. Which is better at classifying the hard-to-distinguish categories?',
      successHint: 'AI is not replacing field biologists — it is amplifying them. A single researcher with AI tools can now study animal behavior at scales that previously required an entire team. From peacock displays to whale songs, machine learning is opening new windows into animal minds.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Signal Processing in Nature</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for signal processing and game theory. Click to start.</p>
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