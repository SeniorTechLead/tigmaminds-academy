import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function BambooFluteLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Project design — the Naga Scale Synthesizer',
      concept: `In this capstone you will build a complete music synthesizer in Python that generates melodies based on Naga traditional scales. The system will have five components:

**1. Waveform generator:** Produce basic wave shapes (sine, square, sawtooth, triangle) at any frequency and duration.

**2. Envelope shaper:** Apply ADSR (Attack, Decay, Sustain, Release) envelopes to shape how each note starts, sustains, and fades.

**3. Scale engine:** Define pentatonic and Naga-inspired scales using frequency ratios, and map note numbers to frequencies.

**4. Melody composer:** Algorithmically generate melodies that follow scale constraints, with controllable rhythm patterns.

**5. Spectral display:** Visualize the output waveforms and their frequency spectra.

The architecture follows a pipeline pattern: Scale -> Note frequencies -> Waveform -> Envelope -> Mix -> Output. Each component is a pure function that takes parameters and returns numpy arrays. This modular design means you can swap any component without affecting the others.

We will build each component in the next five mini-lessons, then assemble the full synthesizer.`,
      analogy: 'Building a synthesizer is like building a bamboo flute from scratch. First you select the bamboo (waveform type). Then you shape the bore (envelope). Then you drill finger holes at precise positions (scale system). Then you learn fingering patterns (melody generation). Finally, you play and listen critically (spectral analysis). Each step depends on understanding the previous one.',
      storyConnection: 'The bamboo flute of Nagaland is itself a synthesizer — it converts breath energy into pitched musical tones shaped by the tube geometry and finger positions. Our Python synthesizer does the same thing digitally: convert mathematical functions into pitched tones shaped by code. By building this, you will understand at a deep level what happens physically inside a bamboo flute when a Naga musician plays.',
      checkQuestion: 'Why is a modular pipeline architecture (scale -> waveform -> envelope -> mix) better than writing one monolithic function that does everything?',
      checkAnswer: 'Modularity lets you change one component without breaking others. You can swap the scale from pentatonic to chromatic without touching the waveform generator. You can change from sine to sawtooth waves without modifying the envelope. You can test each component independently. And you can reuse components in different projects. This is the same principle as interchangeable parts in manufacturing.',
      codeIntro: 'Set up the project skeleton with the core data structures and a simple proof-of-concept.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# ---- PROJECT SKELETON: Naga Scale Synthesizer ----

SAMPLE_RATE = 44100  # CD quality

# Core data structures
class SynthConfig:
    """Global synthesizer configuration."""
    def __init__(self, sample_rate=44100, master_volume=0.8):
        self.sample_rate = sample_rate
        self.master_volume = master_volume

class Note:
    """A single musical note."""
    def __init__(self, frequency, duration, velocity=1.0):
        self.frequency = frequency  # Hz
        self.duration = duration    # seconds
        self.velocity = velocity    # 0.0 to 1.0 (loudness)

class Scale:
    """A musical scale defined by ratios from a root frequency."""
    def __init__(self, name, ratios, root_freq=490):
        self.name = name
        self.ratios = ratios
        self.root_freq = root_freq

    def get_freq(self, degree, octave=0):
        """Get frequency for a scale degree (0-indexed) and octave offset."""
        ratio = self.ratios[degree % len(self.ratios)]
        octave_shift = octave + (degree // len(self.ratios))
        return self.root_freq * ratio * (2 ** octave_shift)

    def all_freqs(self, n_octaves=2):
        """Get all frequencies across multiple octaves."""
        freqs = []
        for octave in range(n_octaves):
            for ratio in self.ratios:
                freqs.append(self.root_freq * ratio * (2 ** octave))
        return freqs

# Define scales
SCALES = {
    'major_pentatonic': Scale('Major Pentatonic', [1, 9/8, 5/4, 3/2, 5/3], 490),
    'minor_pentatonic': Scale('Minor Pentatonic', [1, 6/5, 4/3, 3/2, 9/5], 490),
    'naga_folk': Scale('Naga Folk', [1, 9/8, 5/4, 3/2, 5/3], 490),  # Pentatonic base
    'naga_ceremonial': Scale('Naga Ceremonial', [1, 16/15, 5/4, 3/2, 8/5], 392),  # Minor-flavored
}

# Quick proof of concept: generate a simple 5-note melody
config = SynthConfig()
scale = SCALES['naga_folk']

# Generate sine wave for each scale degree
def quick_tone(freq, duration, sr=SAMPLE_RATE):
    t = np.linspace(0, duration, int(sr * duration), endpoint=False)
    return np.sin(2 * np.pi * freq * t)

# Play up the pentatonic scale
melody_signal = np.array([])
note_duration = 0.3
for degree in range(5):
    freq = scale.get_freq(degree)
    tone = quick_tone(freq, note_duration) * 0.5
    # Add tiny fade to avoid clicks
    fade = int(0.005 * SAMPLE_RATE)
    tone[:fade] *= np.linspace(0, 1, fade)
    tone[-fade:] *= np.linspace(1, 0, fade)
    melody_signal = np.concatenate([melody_signal, tone])

# Visualize
fig, axes = plt.subplots(2, 2, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# 1. Architecture diagram (text-based)
ax = axes[0, 0]
components = ['Scale\
Engine', 'Waveform\
Generator', 'Envelope\
Shaper', 'Melody\
Composer', 'Spectral\
Display']
x_pos = np.linspace(0.1, 0.9, 5)
for i, (comp, x) in enumerate(zip(components, x_pos)):
    color = ['#4ade80', '#60a5fa', '#f97316', '#a78bfa', '#f472b6'][i]
    ax.add_patch(plt.Rectangle((x - 0.08, 0.3), 0.16, 0.4, facecolor=color, alpha=0.3,
                                edgecolor=color, linewidth=2, transform=ax.transAxes))
    ax.text(x, 0.5, comp, transform=ax.transAxes, ha='center', va='center',
            fontsize=8, color='white', fontweight='bold')
    if i < 4:
        ax.annotate('', xy=(x_pos[i + 1] - 0.08, 0.5), xytext=(x + 0.08, 0.5),
                     xycoords='axes fraction', textcoords='axes fraction',
                     arrowprops=dict(arrowstyle='->', color='white', lw=2))
ax.set_xlim(0, 1)
ax.set_ylim(0, 1)
ax.set_title('Synthesizer architecture', color='white', fontsize=11)
ax.axis('off')

# 2. Scale frequencies
ax2 = axes[0, 1]
for i, (key, sc) in enumerate(SCALES.items()):
    freqs = sc.all_freqs(1)
    ax2.scatter(freqs, [i] * len(freqs), s=100, zorder=5,
               color=['#4ade80', '#60a5fa', '#f97316', '#a78bfa'][i])
    ax2.text(min(freqs) - 30, i, sc.name, fontsize=9, color='white', ha='right', va='center')
    for f in freqs:
        ax2.text(f, i + 0.2, f'{f:.0f}', fontsize=6, color='gray', ha='center')
ax2.set_xlabel('Frequency (Hz)', color='white')
ax2.set_title('Available scales', color='white', fontsize=11)
ax2.set_yticks([])

# 3. Proof-of-concept melody waveform
ax3 = axes[1, 0]
t_melody = np.linspace(0, len(melody_signal) / SAMPLE_RATE, len(melody_signal))
ax3.plot(t_melody, melody_signal, color='#4ade80', linewidth=0.5)
for i in range(5):
    freq = scale.get_freq(i)
    t_start = i * note_duration
    ax3.text(t_start + note_duration / 2, 0.7, f'{freq:.0f} Hz',
             fontsize=8, color='white', ha='center')
ax3.set_xlabel('Time (s)', color='white')
ax3.set_ylabel('Amplitude', color='white')
ax3.set_title('Proof of concept: Naga pentatonic ascending', color='white', fontsize=11)

# 4. Spectrum of the full melody
ax4 = axes[1, 1]
spectrum = np.abs(np.fft.rfft(melody_signal))
freqs_fft = np.fft.rfftfreq(len(melody_signal), 1 / SAMPLE_RATE)
ax4.plot(freqs_fft[:2000], spectrum[:2000], color='#4ade80', linewidth=1)
# Mark scale frequencies
for degree in range(5):
    f = scale.get_freq(degree)
    ax4.axvline(f, color='#f97316', linewidth=1, alpha=0.5, linestyle='--')
    ax4.text(f, max(spectrum[:2000]) * 0.9, f'{f:.0f}', fontsize=7, color='#f97316',
             ha='center', rotation=45)
ax4.set_xlabel('Frequency (Hz)', color='white')
ax4.set_ylabel('Magnitude', color='white')
ax4.set_title('Melody spectrum (5 pentatonic notes visible)', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print("Naga Scale Synthesizer — Project skeleton ready")
print(f"Sample rate: {SAMPLE_RATE} Hz")
print(f"Available scales: {', '.join(SCALES.keys())}")
print(f"\
Naga Folk scale from {scale.root_freq} Hz:")
for i, ratio in enumerate(scale.ratios):
    print(f"  Degree {i}: ratio {ratio:.4f} -> {scale.get_freq(i):.1f} Hz")
print(f"\
Next steps: waveform generation, envelopes, melody algorithm")`,
      challenge: 'Add a "Naga warrior" scale with root at 330 Hz and ratios [1, 7/6, 4/3, 3/2, 7/4] — using septimal intervals (ratios involving 7) that give a raw, powerful quality. Plot its frequencies alongside the other scales.',
      successHint: 'Septimal intervals (7th harmonic ratios) sound distinctly different from the familiar 5-limit ratios used in Western music. The 7/6 ratio (~267 cents) is a narrow minor third, and 7/4 (~969 cents) is the "harmonic seventh" — flatter than the Western minor seventh. These intervals appear in many non-Western musical traditions and create a raw, earthy quality.',
    },
    {
      title: 'Waveform generation — sine, square, sawtooth, triangle',
      concept: `Every synthesizer starts with basic waveform generators (oscillators). The four fundamental shapes:

**Sine wave:** The purest tone — only one frequency, no harmonics. Sounds smooth and hollow. Generated by sin(2*pi*f*t). The building block of all other waveforms via Fourier synthesis.

**Square wave:** Alternates abruptly between +1 and -1. Contains only odd harmonics (1, 3, 5, 7...) with amplitudes decreasing as 1/n. Sounds hollow but buzzy. Generated by sign(sin(2*pi*f*t)) or by summing odd harmonics.

**Sawtooth wave:** Ramps linearly from -1 to +1 then drops back. Contains all harmonics (1, 2, 3, 4...) with amplitudes 1/n. Sounds bright and brassy. The richest of the basic waveforms. Generated by 2*(f*t mod 1) - 1.

**Triangle wave:** Like a square wave's harmonics (odd only) but amplitudes decrease as 1/n^2, making it much softer. Sounds between sine and square — mellow but with some character. Generated by integrating a square wave or by the formula 2*abs(2*(f*t mod 1) - 1) - 1.

For a bamboo flute model, the sine wave is closest to the fundamental, but real flutes produce a blend: strong fundamental (sine-like) plus weaker harmonics that vary with blowing pressure. We can model this by mixing waveforms or using additive synthesis with controlled harmonic amplitudes.`,
      analogy: 'The four waveforms are like four types of bamboo cuts. A smooth, round culm (sine) produces a clean, pure sound. A culm split sharply in half (square) adds a buzzy edge. A culm shaved at an angle (sawtooth) is the most textured and bright. A culm smoothly bent into a V-shape (triangle) is gentle but with a hint of character. The flute maker can shape the embouchure to emphasize any of these qualities.',
      storyConnection: 'The bamboo flute of Nagaland, when played gently, produces nearly a pure sine tone — just the fundamental frequency with minimal harmonics. As the musician blows harder, more harmonics appear and the timbre shifts toward a sawtooth-like spectrum. Overblowing forces the flute into a higher register, emphasizing odd harmonics like a square wave. The musician controls which "waveform" the flute produces through breath pressure alone.',
      checkQuestion: 'Why does a square wave sound different from a sawtooth wave at the same frequency, even though both have strong harmonics?',
      checkAnswer: 'A square wave contains only odd harmonics (1, 3, 5, 7...), while a sawtooth contains all harmonics (1, 2, 3, 4...). The even harmonics (2, 4, 6...) present in the sawtooth but absent in the square are what give the sawtooth its brighter, brassy character. The square sounds more "hollow" because the missing even harmonics create gaps in the spectrum that the ear perceives as a distinctive timbral quality.',
      codeIntro: 'Implement all four basic waveform generators and compare their time-domain shapes and frequency spectra.',
      code: `import numpy as np
import matplotlib.pyplot as plt

SAMPLE_RATE = 44100
f0 = 490  # Bamboo flute fundamental

def generate_sine(freq, duration, sr=SAMPLE_RATE):
    t = np.linspace(0, duration, int(sr * duration), endpoint=False)
    return t, np.sin(2 * np.pi * freq * t)

def generate_square(freq, duration, sr=SAMPLE_RATE, n_harmonics=30):
    """Band-limited square wave via additive synthesis (avoids aliasing)."""
    t = np.linspace(0, duration, int(sr * duration), endpoint=False)
    signal = np.zeros_like(t)
    for n in range(1, n_harmonics + 1, 2):  # Odd harmonics only
        if n * freq < sr / 2:  # Stay below Nyquist
            signal += (1 / n) * np.sin(2 * np.pi * n * freq * t)
    signal *= 4 / np.pi  # Normalize to approx [-1, 1]
    return t, signal

def generate_sawtooth(freq, duration, sr=SAMPLE_RATE, n_harmonics=30):
    """Band-limited sawtooth via additive synthesis."""
    t = np.linspace(0, duration, int(sr * duration), endpoint=False)
    signal = np.zeros_like(t)
    for n in range(1, n_harmonics + 1):  # All harmonics
        if n * freq < sr / 2:
            signal += ((-1) ** (n + 1)) * (1 / n) * np.sin(2 * np.pi * n * freq * t)
    signal *= 2 / np.pi
    return t, signal

def generate_triangle(freq, duration, sr=SAMPLE_RATE, n_harmonics=30):
    """Band-limited triangle via additive synthesis."""
    t = np.linspace(0, duration, int(sr * duration), endpoint=False)
    signal = np.zeros_like(t)
    for n in range(1, n_harmonics + 1, 2):  # Odd harmonics only
        if n * freq < sr / 2:
            signal += ((-1) ** ((n - 1) // 2)) * (1 / n ** 2) * np.sin(2 * np.pi * n * freq * t)
    signal *= 8 / (np.pi ** 2)
    return t, signal

# Generate all waveforms
duration = 0.02  # 20ms for visualization
waveforms = {
    'Sine': generate_sine(f0, duration),
    'Square': generate_square(f0, duration),
    'Sawtooth': generate_sawtooth(f0, duration),
    'Triangle': generate_triangle(f0, duration),
}

colors = {'Sine': '#4ade80', 'Square': '#60a5fa', 'Sawtooth': '#f97316', 'Triangle': '#a78bfa'}

fig, axes = plt.subplots(4, 2, figsize=(14, 12))
fig.patch.set_facecolor('#1f2937')

for i, (name, (t, signal)) in enumerate(waveforms.items()):
    color = colors[name]

    # Time domain
    ax = axes[i, 0]
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')
    ax.plot(t * 1000, signal, color=color, linewidth=1.5)
    ax.set_ylabel('Amplitude', color='white', fontsize=8)
    ax.set_title(f'{name} wave — {f0} Hz', color='white', fontsize=10)
    if i == 3:
        ax.set_xlabel('Time (ms)', color='white')

    # Frequency domain
    ax2 = axes[i, 1]
    ax2.set_facecolor('#111827')
    ax2.tick_params(colors='gray')

    # Use longer signal for better frequency resolution
    _, long_signal = waveforms[name].__class__.__mro__  # Regenerate longer
    t_long, sig_long = globals()[f'generate_{name.lower()}'](f0, 0.1)
    spectrum = np.abs(np.fft.rfft(sig_long))
    freqs = np.fft.rfftfreq(len(sig_long), 1 / SAMPLE_RATE)

    ax2.plot(freqs[:400], spectrum[:400], color=color, linewidth=1)

    # Mark harmonics
    for n in range(1, 8):
        if n * f0 < freqs[400]:
            ax2.axvline(n * f0, color='gray', linewidth=0.3, alpha=0.5)
            ax2.text(n * f0, max(spectrum[:400]) * 1.05, f'{n}',
                     fontsize=7, color='white', ha='center')

    ax2.set_ylabel('Magnitude', color='white', fontsize=8)
    ax2.set_title(f'{name} spectrum', color='white', fontsize=10)
    if i == 3:
        ax2.set_xlabel('Frequency (Hz)', color='white')

plt.tight_layout()
plt.show()

# Harmonic content summary
print("Waveform harmonic content:")
print(f"  Sine:     Harmonic 1 only (pure tone)")
print(f"  Square:   Odd harmonics (1,3,5,7...) at 1/n amplitude")
print(f"  Sawtooth: All harmonics (1,2,3,4...) at 1/n amplitude")
print(f"  Triangle: Odd harmonics (1,3,5,7...) at 1/n^2 amplitude")
print()
print(f"Bamboo flute connection:")
print(f"  Gentle blowing -> sine-like (mostly fundamental)")
print(f"  Normal playing -> triangle-like (weak odd harmonics)")
print(f"  Hard blowing  -> sawtooth-like (all harmonics present)")
print(f"  Overblowing   -> square-like (odd harmonics dominate)")`,
      challenge: 'Create a "bamboo flute" waveform generator that blends sine and sawtooth based on a "breath pressure" parameter (0.0 = pure sine, 1.0 = mostly sawtooth). Plot how the spectrum changes at pressure values of 0.0, 0.3, 0.7, and 1.0.',
      successHint: 'Cross-fading between waveforms based on a control parameter is called "morphing" and is a fundamental technique in synthesis. The bamboo flute breath pressure model shows how a single physical parameter (air speed) maps to a continuous change in harmonic content — from pure fundamental to rich overtone spectrum.',
    },
    {
      title: 'Envelope and modulation — ADSR, vibrato, tremolo',
      concept: `A raw oscillator produces a static tone — it starts instantly and stops instantly, sounding mechanical and lifeless. Real instruments have dynamic amplitude and pitch contours.

**ADSR envelope** shapes amplitude over time:
- **Attack**: time to go from silence to peak amplitude (a bamboo flute has a soft attack ~50ms as breath builds up)
- **Decay**: time to fall from peak to sustain level (flute: ~30ms as the initial burst settles)
- **Sustain**: the steady-state amplitude held while the note plays (flute: ~0.7 of peak)
- **Release**: time to fade to silence after the note ends (flute: ~100ms as breath stops)

**Vibrato** is periodic pitch modulation — the frequency wobbles slightly up and down. In mathematical terms: f(t) = f0 * (1 + depth * sin(2*pi*rate*t)). Typical values: rate = 5-7 Hz, depth = 0.5-2%. Vibrato adds warmth and expressiveness. Naga flute players use subtle vibrato by varying breath pressure.

**Tremolo** is periodic amplitude modulation: a(t) = 1 - depth * (1 - sin(2*pi*rate*t))/2. It creates a pulsing effect. Rate and depth are similar to vibrato. Tremolo happens naturally on bamboo flutes when the player\'s diaphragm pulses rhythmically.

Both vibrato and tremolo are forms of **low-frequency oscillation (LFO)** — a slow oscillator (below 20 Hz) that modulates a parameter of the sound rather than being heard directly.`,
      analogy: 'ADSR is like how you enter a room. Attack is opening the door (fast = slamming it open, slow = gently pushing). Decay is settling into the room after the initial burst of entry. Sustain is sitting comfortably. Release is leaving the room (fast = jumping out, slow = lingering at the doorway). Every instrument has a characteristic way of "entering and leaving the room" — a drum slams in and out instantly, a flute drifts in and floats out.',
      storyConnection: 'A skilled Naga flute player uses envelope and modulation instinctively. The attack varies from a soft breath onset for contemplative melodies to a sharp tongue articulation for dance rhythms. Vibrato deepens during long sustained notes in ceremonial music — the gentle pitch wobble gives the tone a living, breathing quality that carries across the village grounds during evening festivals. The bamboo flute is one of the most expressive acoustic instruments precisely because the player has direct control over these parameters through breath.',
      checkQuestion: 'Why would a synthesizer with no ADSR envelope sound robotic, even if the waveform and frequency are accurate?',
      checkAnswer: 'Without ADSR, every note starts at full volume instantly and stops instantly — creating harsh clicks at the start and end. Real instruments always have finite attack and release times because physical systems cannot change state instantaneously. The ear is extremely sensitive to these transients. Even 5ms of attack smoothing makes a huge perceptual difference. The ADSR shape is often more important to recognizing an instrument than its harmonic content.',
      codeIntro: 'Implement ADSR envelopes and LFO modulation, then apply them to bamboo flute tones.',
      code: `import numpy as np
import matplotlib.pyplot as plt

SAMPLE_RATE = 44100

def generate_adsr_envelope(duration, attack=0.05, decay=0.03, sustain_level=0.7,
                            release=0.1, sr=SAMPLE_RATE):
    """Generate an ADSR amplitude envelope.
    Total duration includes the release phase."""
    n_samples = int(sr * duration)
    n_attack = int(sr * attack)
    n_decay = int(sr * decay)
    n_release = int(sr * release)
    n_sustain = max(0, n_samples - n_attack - n_decay - n_release)

    envelope = np.concatenate([
        np.linspace(0, 1, n_attack),                          # Attack
        np.linspace(1, sustain_level, n_decay),                # Decay
        np.full(n_sustain, sustain_level),                     # Sustain
        np.linspace(sustain_level, 0, n_release),              # Release
    ])
    return envelope[:n_samples]

def apply_vibrato(freq, t, rate=5.5, depth=0.015):
    """Apply vibrato (pitch modulation) to a tone.
    depth is fractional: 0.015 = 1.5% frequency deviation."""
    modulated_freq = freq * (1 + depth * np.sin(2 * np.pi * rate * t))
    # Integrate instantaneous frequency to get phase
    phase = 2 * np.pi * np.cumsum(modulated_freq) / SAMPLE_RATE
    return np.sin(phase)

def apply_tremolo(signal, rate=6.0, depth=0.3):
    """Apply tremolo (amplitude modulation) to a signal."""
    t = np.arange(len(signal)) / SAMPLE_RATE
    modulator = 1 - depth * (1 - np.sin(2 * np.pi * rate * t)) / 2
    return signal * modulator

# Generate bamboo flute tones with different envelopes
f0 = 490
duration = 1.0
t = np.linspace(0, duration, int(SAMPLE_RATE * duration), endpoint=False)

# Different ADSR profiles
profiles = {
    'Soft breath onset': {'attack': 0.12, 'decay': 0.05, 'sustain_level': 0.7, 'release': 0.15},
    'Sharp tongued attack': {'attack': 0.01, 'decay': 0.08, 'sustain_level': 0.6, 'release': 0.05},
    'Ceremonial sustain': {'attack': 0.08, 'decay': 0.03, 'sustain_level': 0.85, 'release': 0.20},
    'Percussive tap': {'attack': 0.005, 'decay': 0.15, 'sustain_level': 0.2, 'release': 0.03},
}

fig, axes = plt.subplots(3, 2, figsize=(14, 12))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# 1. ADSR envelope shapes
ax = axes[0, 0]
profile_colors = ['#4ade80', '#60a5fa', '#f97316', '#a78bfa']
for (name, params), color in zip(profiles.items(), profile_colors):
    env = generate_adsr_envelope(duration, **params)
    t_env = np.linspace(0, duration, len(env))
    ax.plot(t_env, env, color=color, linewidth=2, label=name)
ax.set_xlabel('Time (s)', color='white')
ax.set_ylabel('Amplitude', color='white')
ax.set_title('ADSR envelope profiles for bamboo flute', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 2. Tone with vs without envelope
ax2 = axes[0, 1]
raw_tone = np.sin(2 * np.pi * f0 * t)
env = generate_adsr_envelope(duration, attack=0.08, decay=0.03, sustain_level=0.7, release=0.15)
shaped_tone = raw_tone * env

t_show = 0.3  # Show first 300ms
n_show = int(SAMPLE_RATE * t_show)
ax2.plot(t[:n_show] * 1000, raw_tone[:n_show], color='gray', linewidth=0.5, alpha=0.5, label='Raw (no envelope)')
ax2.plot(t[:n_show] * 1000, shaped_tone[:n_show], color='#4ade80', linewidth=1, label='With ADSR')
ax2.plot(t[:n_show] * 1000, env[:n_show], color='#f97316', linewidth=2, linestyle='--', label='Envelope')
ax2.set_xlabel('Time (ms)', color='white')
ax2.set_ylabel('Amplitude', color='white')
ax2.set_title('Raw tone vs ADSR-shaped tone', color='white', fontsize=11)
ax2.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 3. Vibrato visualization
ax3 = axes[1, 0]
no_vibrato = np.sin(2 * np.pi * f0 * t)
with_vibrato = apply_vibrato(f0, t, rate=5.5, depth=0.015)

# Show pitch over time for vibrato
inst_freq_clean = np.full_like(t, f0)
inst_freq_vibrato = f0 * (1 + 0.015 * np.sin(2 * np.pi * 5.5 * t))
ax3.plot(t[:int(SAMPLE_RATE * 0.5)] * 1000, inst_freq_clean[:int(SAMPLE_RATE * 0.5)],
         color='gray', linewidth=1, alpha=0.5, label='No vibrato')
ax3.plot(t[:int(SAMPLE_RATE * 0.5)] * 1000, inst_freq_vibrato[:int(SAMPLE_RATE * 0.5)],
         color='#60a5fa', linewidth=2, label=f'Vibrato (rate=5.5 Hz, depth=1.5%)')
ax3.set_xlabel('Time (ms)', color='white')
ax3.set_ylabel('Instantaneous frequency (Hz)', color='white')
ax3.set_title('Vibrato: frequency modulation', color='white', fontsize=11)
ax3.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 4. Vibrato waveform (zoomed)
ax4 = axes[1, 1]
n_zoom = int(SAMPLE_RATE * 0.04)  # 40ms
ax4.plot(t[:n_zoom] * 1000, no_vibrato[:n_zoom], color='gray', linewidth=1, alpha=0.5, label='No vibrato')
ax4.plot(t[:n_zoom] * 1000, with_vibrato[:n_zoom], color='#60a5fa', linewidth=1.5, label='With vibrato')
ax4.set_xlabel('Time (ms)', color='white')
ax4.set_ylabel('Amplitude', color='white')
ax4.set_title('Vibrato effect on waveform (zoomed)', color='white', fontsize=11)
ax4.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 5. Tremolo
ax5 = axes[2, 0]
base_tone = np.sin(2 * np.pi * f0 * t) * env
tremolo_tone = apply_tremolo(base_tone, rate=6.0, depth=0.4)

n_show2 = int(SAMPLE_RATE * 0.5)
ax5.plot(t[:n_show2] * 1000, base_tone[:n_show2], color='gray', linewidth=0.5, alpha=0.5, label='No tremolo')
ax5.plot(t[:n_show2] * 1000, tremolo_tone[:n_show2], color='#f97316', linewidth=0.8, label='With tremolo (6 Hz, 40%)')
ax5.set_xlabel('Time (ms)', color='white')
ax5.set_ylabel('Amplitude', color='white')
ax5.set_title('Tremolo: amplitude modulation', color='white', fontsize=11)
ax5.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 6. Combined: ADSR + vibrato + tremolo (full bamboo flute model)
ax6 = axes[2, 1]
full_flute = apply_vibrato(f0, t, rate=5.5, depth=0.012) * env
full_flute = apply_tremolo(full_flute, rate=4.0, depth=0.2)

ax6.plot(t * 1000, full_flute, color='#4ade80', linewidth=0.5)
ax6.plot(t * 1000, env, color='#f97316', linewidth=2, linestyle='--', alpha=0.5, label='Envelope')
ax6.set_xlabel('Time (ms)', color='white')
ax6.set_ylabel('Amplitude', color='white')
ax6.set_title('Complete bamboo flute tone (ADSR + vibrato + tremolo)', color='white', fontsize=11)
ax6.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Envelope and modulation summary:")
print(f"  ADSR: Shapes each note's amplitude life cycle")
print(f"  Vibrato: Pitch wobble at 5-7 Hz, 1-2% depth -> warmth")
print(f"  Tremolo: Volume pulse at 4-6 Hz, 20-40% depth -> animation")
print(f"\
Bamboo flute model combines all three:")
print(f"  Soft attack (breath onset), sustained tone, gentle release")
print(f"  Subtle vibrato from breath pressure variation")
print(f"  Optional tremolo from diaphragm pulsing")`,
      challenge: 'Implement a "delay vibrato" where vibrato does not start until 200ms into the note (musicians often play the initial attack straight, then add vibrato on the sustain). This is more realistic than instant vibrato.',
      successHint: 'Delayed vibrato is standard practice for most wind instruments. The musician focuses on clean articulation during the attack, then relaxes into vibrato during the sustain. You can implement this by ramping the vibrato depth from 0 to full over a transition window. This kind of detail separates realistic synthesis from toy examples.',
    },
    {
      title: 'Scale system — pentatonic and Naga traditional scales',
      concept: `Now we build the scale engine that maps abstract note numbers to concrete frequencies. A scale is defined by:

1. A **root frequency** (e.g., 490 Hz for our bamboo flute)
2. A set of **frequency ratios** relative to the root
3. Rules for **octave extension** (multiply by 2 for each octave up)

The major pentatonic scale uses ratios: 1, 9/8, 5/4, 3/2, 5/3 (in just intonation). These map to scale degrees 0, 1, 2, 3, 4. To get degree 5, you wrap around: it is degree 0 one octave up (ratio 2).

For algorithmic composition, we need a **note-to-frequency** mapping that handles any integer note number:

frequency = root * ratio[degree % 5] * 2^(degree // 5)

We also need the reverse mapping: given a frequency, find the nearest scale degree. This is useful for quantizing (snapping) arbitrary pitches to the nearest "legal" note in the scale.

Naga traditional scales are not precisely documented in Western music theory terms, but ethnomusicological recordings suggest they are predominantly pentatonic with occasional passing tones. Some Naga tribes use scales with slightly different ratios than the standard Western pentatonic — microtonal inflections that add distinctive character. We model these as ratio variations.`,
      analogy: 'A scale system is like a ruler with marked positions. The pentatonic scale is a ruler with 5 marks per unit — you can only measure at those positions. The chromatic scale has 12 marks (finer resolution but more choices). The Naga folk scale is like a handmade ruler where the marks are placed by ear and tradition rather than mathematical precision — slightly different from the factory ruler, and that is what gives it character.',
      storyConnection: 'The bamboo flute of Nagaland has finger holes drilled at specific positions that determine the available notes. The hole positions encode a scale — a set of frequency ratios chosen by tradition. Different Naga tribes have slightly different hole spacings, producing subtly different scales. When a craftsman drills a new flute, they are literally programming a scale engine into bamboo. Our Python scale system does the same thing digitally — and we can switch between scales instantly, something a physical flute cannot do.',
      checkQuestion: 'If two Naga flutes have the same tube length but different finger hole positions, how would their melodies differ even when playing the "same" song?',
      checkAnswer: 'The finger hole positions determine the available scale degrees. Different positions mean different frequency ratios — the intervals between notes are different. Playing the same sequence of finger movements (degree 0, 2, 4, 3, 1) would produce different frequency sequences on the two flutes. The melodic contour (up-down pattern) would be similar, but the exact intervals would differ, giving each tribe a recognizable melodic "accent."',
      codeIntro: 'Build a comprehensive scale system with multiple Naga-inspired scales and tools for frequency mapping, quantization, and comparison.',
      code: `import numpy as np
import matplotlib.pyplot as plt

SAMPLE_RATE = 44100

class ScaleSystem:
    """Complete scale system for the Naga synthesizer."""

    # Scale definitions: name -> (root_hz, [ratios])
    SCALES = {
        'major_pentatonic': (490, [1, 9/8, 5/4, 3/2, 5/3]),
        'minor_pentatonic': (490, [1, 6/5, 4/3, 3/2, 9/5]),
        'naga_folk': (490, [1, 9/8, 5/4, 3/2, 5/3]),
        'naga_ceremonial': (392, [1, 16/15, 5/4, 3/2, 8/5]),
        'naga_dance': (520, [1, 9/8, 6/5, 3/2, 7/4]),
        'chromatic_et': (440, [2 ** (i / 12) for i in range(12)]),
    }

    def __init__(self, scale_name='naga_folk'):
        self.scale_name = scale_name
        self.root, self.ratios = self.SCALES[scale_name]
        self.n_degrees = len(self.ratios)

    def degree_to_freq(self, degree):
        """Convert scale degree (any integer) to frequency."""
        octave = degree // self.n_degrees
        step = degree % self.n_degrees
        return self.root * self.ratios[step] * (2 ** octave)

    def freq_to_degree(self, freq):
        """Find nearest scale degree for a given frequency."""
        # Search across 4 octaves
        best_degree = 0
        best_diff = float('inf')
        for d in range(-self.n_degrees, 4 * self.n_degrees):
            f = self.degree_to_freq(d)
            diff = abs(np.log2(freq / f))  # Log-scale distance
            if diff < best_diff:
                best_diff = diff
                best_degree = d
        return best_degree

    def quantize_freq(self, freq):
        """Snap a frequency to the nearest note in this scale."""
        degree = self.freq_to_degree(freq)
        return self.degree_to_freq(degree)

    def get_intervals_cents(self):
        """Get intervals between consecutive degrees in cents."""
        intervals = []
        for i in range(len(self.ratios) - 1):
            cents = 1200 * np.log2(self.ratios[i + 1] / self.ratios[i])
            intervals.append(cents)
        # Last interval to octave
        cents = 1200 * np.log2(2 / self.ratios[-1])
        intervals.append(cents)
        return intervals

    def all_freqs(self, n_octaves=2):
        """All frequencies across n octaves."""
        return [self.degree_to_freq(d) for d in range(n_octaves * self.n_degrees + 1)]

# Create scale systems
scales = {name: ScaleSystem(name) for name in ['naga_folk', 'naga_ceremonial', 'naga_dance', 'minor_pentatonic']}

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# 1. Interval comparison (cents between consecutive degrees)
ax = axes[0, 0]
scale_colors = {'naga_folk': '#4ade80', 'naga_ceremonial': '#60a5fa',
                'naga_dance': '#f97316', 'minor_pentatonic': '#a78bfa'}
width = 0.2
positions = np.arange(5)  # 5 intervals for pentatonic

for i, (name, sc) in enumerate(scales.items()):
    intervals = sc.get_intervals_cents()
    ax.bar(positions + i * width, intervals, width, color=scale_colors[name],
           label=name.replace('_', ' ').title(), edgecolor='white', linewidth=0.5)

ax.set_xticks(positions + 1.5 * width)
ax.set_xticklabels([f'{d}->{d+1}' for d in range(4)] + ['4->oct'], fontsize=8, color='white')
ax.set_ylabel('Interval size (cents)', color='white')
ax.set_title('Interval sizes by scale', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.axhline(200, color='gray', linestyle='--', alpha=0.3, linewidth=1)
ax.text(4.5, 205, 'whole tone (200c)', fontsize=7, color='gray')

# 2. Scale degrees on a piano-roll style display
ax2 = axes[0, 1]
for i, (name, sc) in enumerate(scales.items()):
    freqs = sc.all_freqs(2)
    for j, f in enumerate(freqs):
        ax2.barh(i, 0.02, left=f, height=0.6, color=scale_colors[name], alpha=0.8)
        if j < sc.n_degrees:  # Label first octave
            ax2.text(f, i + 0.35, f'{f:.0f}', fontsize=6, color='white', ha='center')
    ax2.text(min(freqs) - 50, i, sc.scale_name.replace('_', ' ').title(),
             fontsize=8, color='white', ha='right', va='center')

ax2.set_xlabel('Frequency (Hz)', color='white')
ax2.set_title('Scale frequencies (2 octaves)', color='white', fontsize=11)
ax2.set_yticks([])
ax2.set_xscale('log')

# 3. Quantization demonstration
ax3 = axes[1, 0]
# Random frequencies
np.random.seed(42)
random_freqs = np.random.uniform(400, 1200, 30)

sc_folk = scales['naga_folk']
quantized_freqs = [sc_folk.quantize_freq(f) for f in random_freqs]

ax3.scatter(random_freqs, np.ones(30), color='#f87171', s=30, alpha=0.6, label='Random pitches')
ax3.scatter(quantized_freqs, np.zeros(30), color='#4ade80', s=30, alpha=0.8, label='Quantized to Naga folk')

# Draw arrows connecting each pair
for rf, qf in zip(random_freqs, quantized_freqs):
    ax3.annotate('', xy=(qf, 0.1), xytext=(rf, 0.9),
                 arrowprops=dict(arrowstyle='->', color='gray', alpha=0.3, lw=0.5))

# Mark scale frequencies
for f in sc_folk.all_freqs(2):
    if 400 < f < 1200:
        ax3.axvline(f, color='#4ade80', alpha=0.2, linewidth=1)

ax3.set_xlabel('Frequency (Hz)', color='white')
ax3.set_title('Pitch quantization to Naga folk scale', color='white', fontsize=11)
ax3.set_yticks([0, 1])
ax3.set_yticklabels(['Quantized', 'Original'], color='white')
ax3.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 4. Generate a short melody in each scale and show as pitch contour
ax4 = axes[1, 1]
np.random.seed(123)
melody_length = 16  # 16 notes

for name, sc in scales.items():
    degrees = [0]
    for _ in range(melody_length - 1):
        # Random walk constrained to scale
        step = np.random.choice([-2, -1, 0, 1, 2])
        next_deg = max(0, min(2 * sc.n_degrees, degrees[-1] + step))
        degrees.append(next_deg)
    freqs_melody = [sc.degree_to_freq(d) for d in degrees]
    ax4.plot(range(melody_length), freqs_melody, 'o-', color=scale_colors[name],
             linewidth=1.5, markersize=4, label=name.replace('_', ' ').title())

ax4.set_xlabel('Note number', color='white')
ax4.set_ylabel('Frequency (Hz)', color='white')
ax4.set_title('Random walk melodies in different scales', color='white', fontsize=11)
ax4.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Scale system summary:")
for name, sc in scales.items():
    intervals = sc.get_intervals_cents()
    print(f"\
  {name}:")
    print(f"    Root: {sc.root} Hz, Degrees: {sc.n_degrees}")
    print(f"    Ratios: {[f'{r:.4f}' for r in sc.ratios]}")
    print(f"    Intervals: {[f'{c:.0f}c' for c in intervals]}")
print(f"\
Quantization example: 567 Hz -> {sc_folk.quantize_freq(567):.1f} Hz (nearest Naga folk note)")`,
      challenge: 'Add a "Naga harvest" scale with ratios [1, 10/9, 5/4, 3/2, 15/8] and compare its interval pattern to the other scales. This scale has a large gap (major 7th to octave = 135 cents) that creates dramatic tension before resolution.',
      successHint: 'The large 7th-to-octave interval (135 cents, a semitone) creates a strong "pull" toward the octave — a sense of tension and resolution. Different scales create different emotional characters through their interval patterns. The Naga harvest scale with its wide gaps and tight resolutions could evoke the anticipation and celebration of harvest time.',
    },
    {
      title: 'Melody generation — algorithmic composition with scale constraints',
      concept: `Algorithmic composition generates melodies using rules and randomness. The key insight: **constrain the randomness** so that any output sounds musical.

Our constraints:
1. **Scale constraint**: every note must belong to the active scale (we already have this from the scale engine)
2. **Contour constraint**: prefer small steps (1-2 scale degrees) over large leaps. This produces singable melodies.
3. **Rhythm constraint**: use a set of allowed note durations (e.g., quarter, eighth, half notes) with probabilities that create interesting rhythmic patterns
4. **Phrase structure**: group notes into phrases of 4-8 beats, with phrases ending on stable scale degrees (root or fifth)
5. **Repetition**: repeat or vary earlier phrases. Music without repetition sounds random; music with too much repetition sounds boring.

The simplest algorithm is a **constrained random walk** on scale degrees:
- Start on the root (degree 0)
- At each step, choose a random interval from [-3, -2, -1, 0, 1, 2, 3] with probabilities weighted toward small steps
- Clamp to a range (e.g., 0 to 2 octaves)
- At phrase endings, snap to the root or fifth

More advanced: **Markov chains** where the probability of the next note depends on the current note (and possibly the previous note). Train the transition matrix from existing Naga melodies and the algorithm will generate new melodies in a similar style.`,
      analogy: 'Algorithmic composition is like a river flowing downhill. The river (melody) has freedom to meander, but gravity (scale constraints) keeps it flowing generally downward. Banks (range limits) prevent it from going too far. The occasional rock (rhythm accent) creates interesting turbulence. And the river eventually reaches the sea (phrase ending on the root). The beauty comes from the interplay of freedom and constraint.',
      storyConnection: 'Naga folk melodies follow implicit rules passed down through generations. A melody typically starts on the root, rises to a peak around the fourth or fifth degree, then descends back home. Phrases are often 4 beats long, matching the rhythmic cycle of traditional dances. Our algorithmic composer encodes these same implicit rules as explicit parameters. The result is new melodies that a Naga musician would recognize as stylistically "correct" — following the grammar of the tradition even though the specific note sequence is novel.',
      checkQuestion: 'Why does constraining a random walk to a pentatonic scale produce more pleasant results than constraining it to a chromatic scale?',
      checkAnswer: 'The pentatonic scale has no semitone intervals (half steps), which are the most dissonant intervals in a melody. Any random combination of pentatonic notes sounds at least acceptable because all intervals are consonant (major seconds, minor thirds, or larger). The chromatic scale includes many dissonant intervals (minor seconds, tritones), so random walks frequently hit clashing note sequences. The pentatonic scale is a "safe" harmonic space where randomness sounds musical.',
      codeIntro: 'Build an algorithmic melody generator with phrase structure, contour control, and rhythm patterns.',
      code: `import numpy as np
import matplotlib.pyplot as plt

SAMPLE_RATE = 44100

class ScaleSystem:
    SCALES = {
        'naga_folk': (490, [1, 9/8, 5/4, 3/2, 5/3]),
        'naga_ceremonial': (392, [1, 16/15, 5/4, 3/2, 8/5]),
        'naga_dance': (520, [1, 9/8, 6/5, 3/2, 7/4]),
    }
    def __init__(self, name='naga_folk'):
        self.root, self.ratios = self.SCALES[name]
        self.n = len(self.ratios)
        self.name = name
    def degree_to_freq(self, d):
        return self.root * self.ratios[d % self.n] * (2 ** (d // self.n))

class MelodyGenerator:
    """Algorithmic melody generator with Naga folk music constraints."""

    def __init__(self, scale, tempo_bpm=90, seed=None):
        self.scale = scale
        self.tempo = tempo_bpm
        self.beat_duration = 60.0 / tempo_bpm  # seconds per beat
        self.rng = np.random.RandomState(seed)

        # Step probabilities: favor small intervals
        self.step_probs = {-3: 0.05, -2: 0.12, -1: 0.25, 0: 0.10,
                           1: 0.25, 2: 0.12, 3: 0.05, 4: 0.03, -4: 0.03}

        # Rhythm patterns (in beats): common Naga dance rhythms
        self.rhythm_patterns = [
            [1, 1, 1, 1],             # Straight quarters
            [0.5, 0.5, 1, 0.5, 0.5], # Syncopated
            [1.5, 0.5, 1, 1],         # Dotted quarter + eighth
            [0.5, 0.5, 0.5, 0.5, 1, 1], # Running eighths + quarters
            [2, 1, 1],                # Half + quarters
        ]

    def generate_phrase(self, start_degree, n_beats=4, end_on_root=False):
        """Generate one musical phrase."""
        # Choose a rhythm pattern
        pattern = self.rng.choice(len(self.rhythm_patterns))
        durations = list(self.rhythm_patterns[pattern])

        # Extend or trim to fill n_beats
        total = sum(durations)
        while total < n_beats:
            durations.append(self.rng.choice([0.5, 1.0]))
            total = sum(durations)
        # Trim excess
        trimmed = []
        running = 0
        for d in durations:
            if running + d <= n_beats:
                trimmed.append(d)
                running += d
            else:
                trimmed.append(n_beats - running)
                break
        durations = trimmed

        # Generate pitch contour
        degrees = [start_degree]
        for i in range(len(durations) - 1):
            steps = list(self.step_probs.keys())
            probs = np.array(list(self.step_probs.values()))
            probs /= probs.sum()
            step = self.rng.choice(steps, p=probs)
            next_deg = np.clip(degrees[-1] + step, 0, 2 * self.scale.n)
            degrees.append(int(next_deg))

        # Snap last note to root or fifth if requested
        if end_on_root:
            stable = [0, self.scale.n // 2, self.scale.n]  # Root, ~fifth, octave
            degrees[-1] = min(stable, key=lambda d: abs(d - degrees[-1]))

        return degrees, durations

    def generate_melody(self, n_phrases=4, beats_per_phrase=4):
        """Generate a complete melody with phrase structure."""
        all_degrees = []
        all_durations = []

        current_degree = 0  # Start on root
        for i in range(n_phrases):
            end_on_root = (i == n_phrases - 1) or (i % 2 == 1)  # End phrases on stable notes
            degrees, durations = self.generate_phrase(
                current_degree, beats_per_phrase, end_on_root
            )
            all_degrees.extend(degrees)
            all_durations.extend(durations)
            current_degree = degrees[-1]

        frequencies = [self.scale.degree_to_freq(d) for d in all_degrees]
        beat_durations = [d * self.beat_duration for d in all_durations]
        return all_degrees, frequencies, beat_durations, all_durations

# Generate melodies in three scales
fig, axes = plt.subplots(3, 2, figsize=(14, 12))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

scale_configs = [
    ('naga_folk', '#4ade80', 42),
    ('naga_ceremonial', '#60a5fa', 77),
    ('naga_dance', '#f97316', 13),
]

for row, (scale_name, color, seed) in enumerate(scale_configs):
    sc = ScaleSystem(scale_name)
    gen = MelodyGenerator(sc, tempo_bpm=100, seed=seed)
    degrees, freqs, sec_durs, beat_durs = gen.generate_melody(n_phrases=4, beats_per_phrase=4)

    # Left: pitch contour (piano roll style)
    ax = axes[row, 0]
    beat_positions = np.cumsum([0] + beat_durs[:-1])

    for i, (bp, bd, f, d) in enumerate(zip(beat_positions, beat_durs, freqs, degrees)):
        ax.barh(f, bd, height=f * 0.04, left=bp, color=color, alpha=0.8,
                edgecolor='white', linewidth=0.5)
        ax.text(bp + bd / 2, f, str(d), fontsize=6, color='white',
                ha='center', va='center')

    # Mark phrase boundaries
    beats_so_far = 0
    for p in range(4):
        beats_so_far += 4
        ax.axvline(beats_so_far * gen.beat_duration, color='white', linewidth=0.5, alpha=0.3)

    ax.set_ylabel('Frequency (Hz)', color='white', fontsize=8)
    ax.set_title(f'{scale_name.replace("_", " ").title()} melody', color='white', fontsize=10)
    if row == 2:
        ax.set_xlabel('Time (beats)', color='white')

    # Right: degree sequence and rhythm
    ax2 = axes[row, 1]
    ax2.step(range(len(degrees)), degrees, color=color, linewidth=2, where='mid')
    ax2.scatter(range(len(degrees)), degrees, color=color, s=40, zorder=5)

    # Show rhythm as bar widths
    for i, (d, bd) in enumerate(zip(degrees, beat_durs)):
        ax2.bar(i, 0.3, bottom=d - 0.15, width=bd * 1.5,
                color=color, alpha=0.3, edgecolor='none')

    ax2.set_ylabel('Scale degree', color='white', fontsize=8)
    ax2.set_title(f'Degree contour + rhythm', color='white', fontsize=10)
    if row == 2:
        ax2.set_xlabel('Note index', color='white')
    ax2.set_ylim(-1, 12)

plt.tight_layout()
plt.show()

# Print melody details
sc = ScaleSystem('naga_folk')
gen = MelodyGenerator(sc, tempo_bpm=100, seed=42)
degrees, freqs, sec_durs, beat_durs = gen.generate_melody(4, 4)

print("Generated Naga folk melody:")
print(f"  Scale: {sc.name}, Root: {sc.root} Hz, Tempo: 100 BPM")
print(f"  Notes: {len(degrees)}, Phrases: 4 x 4 beats")
print(f"\
  {'Note':<6} {'Degree':<8} {'Freq':<10} {'Duration':<10}")
print(f"  {'-'*34}")
for i, (d, f, dur) in enumerate(zip(degrees, freqs, beat_durs)):
    print(f"  {i+1:<6} {d:<8} {f:<10.1f} {dur:.2f} beats")

# Contour analysis
steps = [degrees[i+1] - degrees[i] for i in range(len(degrees)-1)]
print(f"\
  Interval distribution:")
print(f"    Small steps (|step| <= 1): {sum(1 for s in steps if abs(s) <= 1)} / {len(steps)}")
print(f"    Medium steps (|step| = 2): {sum(1 for s in steps if abs(s) == 2)} / {len(steps)}")
print(f"    Large leaps (|step| >= 3):  {sum(1 for s in steps if abs(s) >= 3)} / {len(steps)}")
print(f"    -> Mostly stepwise motion, as expected for singable folk melody")`,
      challenge: 'Implement a first-order Markov chain melody generator: define a 5x5 transition probability matrix where entry (i,j) is the probability of going from degree i to degree j. Train it from the random walk output, then generate new melodies from the Markov chain. Compare the two.',
      successHint: 'The Markov chain captures note-to-note transition tendencies from the training data. If the random walk favors small steps, the Markov chain will too — but it can also learn asymmetric patterns (e.g., ascending passages more likely from degree 0, descending from degree 4). In real ethnomusicology, Markov analysis of recorded melodies reveals the implicit "grammar" of a musical tradition.',
    },
    {
      title: 'Portfolio — complete synthesizer with scale selector and spectral display',
      concept: `This final mini-lesson assembles all components into a complete, working music synthesizer:

1. **Scale engine**: selectable Naga scales with frequency mapping
2. **Waveform generator**: sine, square, sawtooth, triangle, or bamboo-flute blend
3. **ADSR envelope**: configurable attack, decay, sustain, release
4. **Vibrato and tremolo**: optional LFO modulation
5. **Melody generator**: algorithmic composition with phrase structure
6. **Audio rendering**: mix all notes into a single waveform
7. **Spectral analysis**: visualize the output in time and frequency domains

The synthesizer demonstrates every concept from Levels 1-4:
- Wave physics (Level 1): how frequency maps to pitch
- Sound analysis (Level 2): spectral content of generated tones
- Acoustics theory (Level 3): scales, psychoacoustics, synthesis methods
- Software engineering (Level 4): modular pipeline architecture

This is a portfolio piece that shows you can bridge physics, music theory, signal processing, and programming into a single working system.`,
      analogy: 'The final synthesizer is like the bamboo flute itself — a complete instrument. The bamboo tube is the waveform generator. The bore shape is the filter (subtractive synthesis). The finger holes are the scale engine. The musician\'s breath is the envelope and modulation system. The village festival ground is the listening room (spectral environment). Everything we built in code mirrors what a Naga craftsman builds in bamboo.',
      storyConnection: 'The bamboo flute of Nagaland is more than an instrument — it is a complete sound system that encodes centuries of acoustic knowledge in its physical form. The tube length sets the fundamental. The bore diameter determines timbre richness. The finger hole positions encode a traditional scale. The embouchure shape controls the waveform. And the musician\'s breath shapes every note with envelopes and modulation. Our Python synthesizer makes all of this knowledge explicit and programmable. You now understand, at every level, what happens when a Naga musician lifts a bamboo flute and plays.',
      checkQuestion: 'If you wanted to make the synthesizer sound more like a real bamboo flute and less like an electronic instrument, what three improvements would have the most impact?',
      checkAnswer: 'First, model the breath noise — real flutes have a breathy, airy component (filtered noise mixed with the tonal signal) that gives them warmth. Second, add note-to-note legato transitions where the pitch slides smoothly between notes rather than jumping discretely. Third, introduce micro-variations in timing, pitch, and amplitude — real musicians never play perfectly metronomically. These three additions would bridge most of the gap between our synthesizer and a real bamboo flute recording.',
      codeIntro: 'Assemble the complete Naga Scale Synthesizer and generate a full musical piece with visualization.',
      code: `import numpy as np
import matplotlib.pyplot as plt

SAMPLE_RATE = 44100

# ============================================================
# COMPLETE NAGA SCALE SYNTHESIZER
# ============================================================

class NagaSynthesizer:
    """Full synthesizer: scale + waveform + envelope + modulation + melody."""

    SCALES = {
        'naga_folk': (490, [1, 9/8, 5/4, 3/2, 5/3]),
        'naga_ceremonial': (392, [1, 16/15, 5/4, 3/2, 8/5]),
        'naga_dance': (520, [1, 9/8, 6/5, 3/2, 7/4]),
    }

    WAVEFORMS = ['sine', 'square', 'sawtooth', 'triangle', 'bamboo_flute']

    def __init__(self, scale='naga_folk', waveform='bamboo_flute', tempo=100):
        self.root, self.ratios = self.SCALES[scale]
        self.n_degrees = len(self.ratios)
        self.scale_name = scale
        self.waveform = waveform
        self.tempo = tempo
        self.beat_dur = 60.0 / tempo
        self.sr = SAMPLE_RATE

        # ADSR defaults (bamboo flute style)
        self.attack = 0.06
        self.decay = 0.03
        self.sustain = 0.7
        self.release = 0.12

        # Modulation defaults
        self.vibrato_rate = 5.5
        self.vibrato_depth = 0.012
        self.tremolo_rate = 4.0
        self.tremolo_depth = 0.15

    def degree_to_freq(self, d):
        return self.root * self.ratios[d % self.n_degrees] * (2 ** (d // self.n_degrees))

    def generate_waveform(self, freq, n_samples):
        t = np.arange(n_samples) / self.sr
        if self.waveform == 'sine':
            return np.sin(2 * np.pi * freq * t)
        elif self.waveform == 'square':
            sig = np.zeros(n_samples)
            for n in range(1, 20, 2):
                if n * freq < self.sr / 2:
                    sig += (1/n) * np.sin(2*np.pi*n*freq*t)
            return sig * 4 / np.pi
        elif self.waveform == 'sawtooth':
            sig = np.zeros(n_samples)
            for n in range(1, 20):
                if n * freq < self.sr / 2:
                    sig += ((-1)**(n+1)) * (1/n) * np.sin(2*np.pi*n*freq*t)
            return sig * 2 / np.pi
        elif self.waveform == 'triangle':
            sig = np.zeros(n_samples)
            for n in range(1, 20, 2):
                if n * freq < self.sr / 2:
                    sig += ((-1)**((n-1)//2)) * (1/n**2) * np.sin(2*np.pi*n*freq*t)
            return sig * 8 / np.pi**2
        elif self.waveform == 'bamboo_flute':
            # Blend: strong fundamental + weak harmonics + breath noise
            sig = np.sin(2 * np.pi * freq * t)
            sig += 0.3 * np.sin(2 * np.pi * 2 * freq * t)
            sig += 0.1 * np.sin(2 * np.pi * 3 * freq * t)
            sig += 0.05 * np.sin(2 * np.pi * 4 * freq * t)
            # Add breath noise (filtered)
            noise = np.random.randn(n_samples) * 0.03
            sig += noise
            return sig / np.max(np.abs(sig))

    def apply_envelope(self, n_samples):
        na = int(self.sr * self.attack)
        nd = int(self.sr * self.decay)
        nr = int(self.sr * self.release)
        ns = max(0, n_samples - na - nd - nr)
        env = np.concatenate([
            np.linspace(0, 1, max(na, 1)),
            np.linspace(1, self.sustain, max(nd, 1)),
            np.full(ns, self.sustain),
            np.linspace(self.sustain, 0, max(nr, 1)),
        ])
        return env[:n_samples]

    def apply_vibrato(self, signal, freq):
        t = np.arange(len(signal)) / self.sr
        mod_freq = freq * (1 + self.vibrato_depth * np.sin(2*np.pi*self.vibrato_rate*t))
        phase = 2 * np.pi * np.cumsum(mod_freq) / self.sr
        return np.sin(phase) * np.max(np.abs(signal))  # Simplified

    def apply_tremolo(self, signal):
        t = np.arange(len(signal)) / self.sr
        mod = 1 - self.tremolo_depth * (1 - np.sin(2*np.pi*self.tremolo_rate*t)) / 2
        return signal * mod

    def render_note(self, freq, duration, velocity=1.0):
        n = int(self.sr * duration)
        wave = self.generate_waveform(freq, n)
        env = self.apply_envelope(n)
        note = wave * env * velocity
        if self.vibrato_depth > 0:
            # Apply vibrato after initial attack
            vib_start = int(self.sr * (self.attack + self.decay))
            if vib_start < n:
                t_vib = np.arange(n - vib_start) / self.sr
                vib_mod = 1 + self.vibrato_depth * np.sin(2*np.pi*self.vibrato_rate*t_vib)
                vib_env = np.ones(n)
                vib_env[vib_start:] = vib_mod[:n - vib_start]
                # Modulate the signal slightly
                note *= vib_env
        if self.tremolo_depth > 0:
            note = self.apply_tremolo(note)
        return note

    def generate_melody(self, n_phrases=4, beats_per_phrase=4, seed=42):
        rng = np.random.RandomState(seed)
        step_weights = np.array([0.03, 0.05, 0.12, 0.25, 0.10, 0.25, 0.12, 0.05, 0.03])
        steps = np.array([-4, -3, -2, -1, 0, 1, 2, 3, 4])

        rhythm_patterns = [
            [1, 1, 1, 1], [0.5, 0.5, 1, 0.5, 0.5],
            [1.5, 0.5, 1, 1], [2, 1, 1],
        ]

        all_degrees, all_beat_durs = [], []
        deg = 0

        for phrase_i in range(n_phrases):
            pattern = rhythm_patterns[rng.randint(len(rhythm_patterns))]
            durs = list(pattern)
            total = sum(durs)
            while total < beats_per_phrase:
                durs.append(rng.choice([0.5, 1.0]))
                total = sum(durs)

            for i, dur in enumerate(durs):
                all_degrees.append(deg)
                all_beat_durs.append(dur)
                step = rng.choice(steps, p=step_weights / step_weights.sum())
                deg = int(np.clip(deg + step, 0, 2 * self.n_degrees))

            # End phrase on stable note
            if phrase_i == n_phrases - 1:
                all_degrees[-1] = 0  # End on root
            elif phrase_i % 2 == 1:
                stable = [0, self.n_degrees // 2, self.n_degrees]
                all_degrees[-1] = min(stable, key=lambda d: abs(d - all_degrees[-1]))

        freqs = [self.degree_to_freq(d) for d in all_degrees]
        sec_durs = [bd * self.beat_dur for bd in all_beat_durs]
        return all_degrees, freqs, sec_durs, all_beat_durs

    def render_melody(self, degrees, freqs, sec_durs):
        audio = np.array([])
        for freq, dur in zip(freqs, sec_durs):
            note = self.render_note(freq, dur)
            audio = np.concatenate([audio, note])
        # Normalize
        if np.max(np.abs(audio)) > 0:
            audio = audio / np.max(np.abs(audio)) * 0.9
        return audio

# ============================================================
# GENERATE AND VISUALIZE
# ============================================================

synth = NagaSynthesizer(scale='naga_folk', waveform='bamboo_flute', tempo=100)
degrees, freqs, sec_durs, beat_durs = synth.generate_melody(n_phrases=4, beats_per_phrase=4, seed=42)
audio = synth.render_melody(degrees, freqs, sec_durs)

fig, axes = plt.subplots(3, 2, figsize=(14, 12))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Naga Scale Synthesizer — Complete Output', color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# 1. Full waveform
ax = axes[0, 0]
t_audio = np.arange(len(audio)) / SAMPLE_RATE
ax.plot(t_audio, audio, color='#4ade80', linewidth=0.3)
# Mark note boundaries
t_pos = 0
for i, dur in enumerate(sec_durs):
    if i % 4 == 0:
        ax.axvline(t_pos, color='white', linewidth=0.3, alpha=0.3)
    t_pos += dur
ax.set_xlabel('Time (s)', color='white')
ax.set_ylabel('Amplitude', color='white')
ax.set_title('Complete melody waveform', color='white', fontsize=11)

# 2. Spectrogram (manual)
ax2 = axes[0, 1]
frame_size = 2048
hop = 512
n_frames = (len(audio) - frame_size) // hop
spectrogram = np.zeros((frame_size // 2 + 1, n_frames))
for i in range(n_frames):
    frame = audio[i * hop:i * hop + frame_size] * np.hanning(frame_size)
    spectrogram[:, i] = np.abs(np.fft.rfft(frame))

freq_axis = np.fft.rfftfreq(frame_size, 1 / SAMPLE_RATE)
time_axis = np.arange(n_frames) * hop / SAMPLE_RATE

# Limit frequency display
max_freq_idx = np.searchsorted(freq_axis, 3000)
ax2.pcolormesh(time_axis, freq_axis[:max_freq_idx],
               np.log1p(spectrogram[:max_freq_idx]), cmap='magma', shading='auto')
ax2.set_xlabel('Time (s)', color='white')
ax2.set_ylabel('Frequency (Hz)', color='white')
ax2.set_title('Spectrogram', color='white', fontsize=11)

# 3. Piano roll
ax3 = axes[1, 0]
t_pos = 0
for i, (d, f, dur) in enumerate(zip(degrees, freqs, sec_durs)):
    color = '#4ade80' if d <= synth.n_degrees else '#60a5fa'
    ax3.barh(f, dur, height=f * 0.04, left=t_pos, color=color,
             alpha=0.8, edgecolor='white', linewidth=0.5)
    ax3.text(t_pos + dur / 2, f, str(d), fontsize=6, color='white', ha='center', va='center')
    t_pos += dur
ax3.set_xlabel('Time (s)', color='white')
ax3.set_ylabel('Frequency (Hz)', color='white')
ax3.set_title('Piano roll (degree labels)', color='white', fontsize=11)

# 4. Harmonic analysis of a single note
ax4 = axes[1, 1]
single_note = synth.render_note(synth.degree_to_freq(0), 0.5)
spectrum = np.abs(np.fft.rfft(single_note))
spec_freqs = np.fft.rfftfreq(len(single_note), 1 / SAMPLE_RATE)
max_idx = np.searchsorted(spec_freqs, 3000)
ax4.plot(spec_freqs[:max_idx], spectrum[:max_idx], color='#4ade80', linewidth=1)
# Mark harmonics
for n in range(1, 6):
    f_h = synth.root * n
    if f_h < 3000:
        ax4.axvline(f_h, color='#f97316', linewidth=1, alpha=0.5, linestyle='--')
        ax4.text(f_h, max(spectrum[:max_idx]) * 0.9, f'H{n}', fontsize=8, color='#f97316', ha='center')
ax4.set_xlabel('Frequency (Hz)', color='white')
ax4.set_ylabel('Magnitude', color='white')
ax4.set_title(f'Single note spectrum (root = {synth.root} Hz, bamboo flute)', color='white', fontsize=11)

# 5. Scale comparison across all three Naga scales
ax5 = axes[2, 0]
for i, (scale_name, color) in enumerate([('naga_folk', '#4ade80'), ('naga_ceremonial', '#60a5fa'), ('naga_dance', '#f97316')]):
    s = NagaSynthesizer(scale=scale_name, waveform='bamboo_flute', tempo=100)
    d, f, sd, bd = s.generate_melody(2, 4, seed=42)
    a = s.render_melody(d, f, sd)
    t_a = np.arange(len(a)) / SAMPLE_RATE
    offset = i * 2.5
    ax5.plot(t_a, a + offset, color=color, linewidth=0.3, label=scale_name.replace('_', ' ').title())
    ax5.text(-0.1, offset, scale_name.replace('_', ' ').title(), fontsize=8, color=color, ha='right', va='center')
ax5.set_xlabel('Time (s)', color='white')
ax5.set_title('Same melody in 3 Naga scales', color='white', fontsize=11)
ax5.set_yticks([])

# 6. Synthesis parameter summary
ax6 = axes[2, 1]
ax6.axis('off')
params = [
    ('Scale', synth.scale_name.replace('_', ' ').title()),
    ('Root frequency', f'{synth.root} Hz'),
    ('Waveform', synth.waveform),
    ('Tempo', f'{synth.tempo} BPM'),
    ('ADSR', f'A={synth.attack}s D={synth.decay}s S={synth.sustain} R={synth.release}s'),
    ('Vibrato', f'{synth.vibrato_rate} Hz, {synth.vibrato_depth*100:.1f}% depth'),
    ('Tremolo', f'{synth.tremolo_rate} Hz, {synth.tremolo_depth*100:.0f}% depth'),
    ('Notes generated', str(len(degrees))),
    ('Total duration', f'{sum(sec_durs):.1f}s'),
    ('Sample rate', f'{SAMPLE_RATE} Hz'),
]
for i, (key, val) in enumerate(params):
    y = 0.95 - i * 0.09
    ax6.text(0.05, y, key + ':', fontsize=10, color='#a0aec0', transform=ax6.transAxes, fontweight='bold')
    ax6.text(0.55, y, val, fontsize=10, color='white', transform=ax6.transAxes)
ax6.set_title('Synthesizer parameters', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print("=" * 60)
print("NAGA SCALE SYNTHESIZER — PORTFOLIO COMPLETE")
print("=" * 60)
print(f"\
Scale: {synth.scale_name} (root = {synth.root} Hz)")
print(f"Waveform: {synth.waveform}")
print(f"Melody: {len(degrees)} notes, {sum(sec_durs):.1f}s total")
print(f"Audio: {len(audio)} samples ({len(audio)/SAMPLE_RATE:.1f}s at {SAMPLE_RATE} Hz)")
print(f"\
Components built:")
print(f"  1. Scale engine with 3 Naga scales")
print(f"  2. 5 waveform generators (sine, square, sawtooth, triangle, bamboo_flute)")
print(f"  3. ADSR envelope shaper")
print(f"  4. Vibrato (FM) and tremolo (AM) modulation")
print(f"  5. Algorithmic melody generator with phrase structure")
print(f"  6. Spectral analysis and visualization")
print(f"\
This synthesizer bridges physics, music theory, signal processing,")
print(f"and programming — all inspired by the bamboo flute of Nagaland.")`,
      challenge: 'Add a "duet mode" where two synthesizers play simultaneously — one with the naga_folk scale and another with naga_ceremonial — creating a two-voice texture. Mix the two audio streams and visualize the combined spectrogram. How do the different scale systems interact harmonically?',
      successHint: 'When two different pentatonic scales play simultaneously, some notes will be consonant (close to simple ratios) and others will create interesting "beating" patterns (slight frequency differences). This is the basis of heterophony — a texture common in Southeast Asian and tribal music where multiple performers play the same melody with individual variations. The result is richer than unison but less structured than Western harmony.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Capstone — Build a Music Synthesizer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (sound physics & acoustics)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project builds a complete music synthesizer in Python. You will need numpy and matplotlib. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
