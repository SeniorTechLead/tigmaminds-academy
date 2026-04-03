import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function DholDrumLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: "Vibrating membrane physics — modeling drum head oscillation modes",
      concept: "A drum head is a vibrating circular membrane. Its motion follows the 2D wave equation: d²u/dt² = c²(d²u/dx² + d²u/dy²), where u is displacement and c is wave speed = sqrt(T/σ) (T = tension, σ = surface density). The solutions are Bessel functions — circular harmonics that describe the drum's natural vibration modes.\n\nEach mode (m,n) has a characteristic frequency f_mn = (α_mn/(2πR)) × sqrt(T/σ), where α_mn is the nth zero of the mth Bessel function and R is the drum radius. The (0,1) mode is the fundamental — the entire membrane moves up and down. Higher modes create nodal lines where the membrane does not move.\n\nKey parameters:\n- **Tension T**: higher tension = higher pitch. Tuning pegs adjust this.\n- **Radius R**: larger drum = lower pitch (inversely proportional).\n- **Surface density σ**: thicker membrane = lower pitch.\n- **Damping**: energy dissipation determines how long the note sustains.",
      analogy: "Drum modes are like ripples in a circular pond. Drop a stone in the center and you get concentric rings (radial modes). Drop it off-center and you get asymmetric patterns. The drum head vibrates in all these patterns simultaneously — the combination determines the timbre (tone quality) that distinguishes a dhol from a tabla.",
      storyConnection: "The dhol drum in the story had a distinctive deep resonance that carried across the valley. That resonance comes from its large diameter (low fundamental frequency) and loose goatskin membrane (low surface density). The physics of Bessel functions explains why the dhol sounds different from every other drum — its size and construction select specific vibration modes.",
      checkQuestion: "Why do larger drums produce lower-pitched sounds?",
      checkAnswer: "The fundamental frequency f ∝ 1/R (inversely proportional to radius). A larger membrane takes longer to complete one oscillation because the wave must travel further. Doubling the radius halves the fundamental frequency (drops one octave). This is the same reason longer guitar strings produce lower notes — the wave path length determines the pitch.",
      codeIntro: "Simulate circular membrane vibration modes and compute natural frequencies for a dhol drum.",
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Circular membrane vibration modes ---
# Bessel function zeros (first few for each order)
bessel_zeros = {
    0: [2.405, 5.520, 8.654],  # J0 zeros
    1: [3.832, 7.016, 10.174],  # J1 zeros
    2: [5.136, 8.417, 11.620],  # J2 zeros
}

def drum_frequency(m, n, R, T, sigma):
    """Compute frequency of mode (m,n) for circular membrane.
    m: circumferential mode number (0,1,2,...)
    n: radial mode number (1,2,3,...)
    R: radius (m), T: tension (N/m), sigma: surface density (kg/m²)
    """
    alpha = bessel_zeros[m][n-1]
    c = np.sqrt(T / sigma)
    f = alpha * c / (2 * np.pi * R)
    return f

def drum_mode_shape(m, n, R, resolution=100):
    """Compute mode shape (spatial pattern) for visualization."""
    from numpy import cos, sin
    alpha = bessel_zeros[m][n-1]
    r = np.linspace(0, R, resolution)
    theta = np.linspace(0, 2*np.pi, resolution)
    R_grid, Theta = np.meshgrid(r, theta)

    # Bessel function approximation (simplified)
    x = alpha * R_grid / R
    # J_m approximation using series
    J = np.ones_like(x)
    term = np.ones_like(x)
    for k in range(1, 20):
        term *= -(x/2)**2 / (k * (k + m))
        J += term

    if m > 0:
        J *= (x/2)**m

    Z = J * np.cos(m * Theta)
    X = R_grid * np.cos(Theta)
    Y = R_grid * np.sin(Theta)
    return X, Y, Z

# --- Dhol drum parameters ---
R_dhol = 0.18  # 18cm radius (36cm diameter)
T_dhol = 2000  # N/m tension
sigma_dhol = 0.5  # kg/m² (goatskin)

# Compute modes
print("Dhol drum natural frequencies:")
print(f"  Radius: {R_dhol*100:.0f} cm")
print(f"  Tension: {T_dhol} N/m")
print(f"  Surface density: {sigma_dhol} kg/m²")
print(f"  Wave speed: {np.sqrt(T_dhol/sigma_dhol):.1f} m/s")
print()

modes = []
for m in range(3):
    for n in range(1, 4):
        f = drum_frequency(m, n, R_dhol, T_dhol, sigma_dhol)
        modes.append((m, n, f))
        print(f"  Mode ({m},{n}): {f:.1f} Hz")

# --- Plot mode shapes ---
fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')

mode_list = [(0,1), (1,1), (2,1), (0,2), (1,2), (0,3)]
for idx, (m, n) in enumerate(mode_list):
    ax = axes[idx//3, idx%3]
    ax.set_facecolor('#111827')
    X, Y, Z = drum_mode_shape(m, n, R_dhol, 80)
    im = ax.contourf(X, Y, Z, levels=20, cmap='RdBu_r')
    ax.set_aspect('equal')
    f = drum_frequency(m, n, R_dhol, T_dhol, sigma_dhol)
    ax.set_title(f'Mode ({m},{n}) — {f:.0f} Hz', color='white', fontsize=10)
    ax.tick_params(colors='gray', labelsize=7)
    circle = plt.Circle((0,0), R_dhol, fill=False, color='white', linewidth=1)
    ax.add_patch(circle)

plt.tight_layout()
plt.show()

# Frequency ratios (inharmonicity)
f0 = modes[0][2]
print(f"\nFrequency ratios (relative to fundamental {f0:.0f} Hz):")
for m, n, f in modes:
    print(f"  ({m},{n}): {f/f0:.3f}")
print("\nNote: ratios are NOT integer multiples — drums are inharmonic")
print("This is why drums have 'pitch' but not clear 'notes' like strings")`,
      challenge: "Add a second membrane (the other side of the dhol) with different tension and coupling. How does the coupled system change the frequency spectrum? Do new resonances appear?",
      successHint: "You can now model circular membrane vibration modes and compute natural frequencies — the physics of drum acoustics.",
    },
    {
      title: "Spectral analysis of percussion — decomposing drum sounds into frequency components",
      concept: "A single drum strike produces a complex waveform containing many vibration modes simultaneously. Fourier analysis decomposes this complexity: the FFT (Fast Fourier Transform) converts a time-domain signal into a frequency spectrum showing the amplitude of each frequency component.\n\nFor drums, the spectrum reveals:\n- **Fundamental frequency**: the lowest, loudest mode — determines the perceived pitch.\n- **Overtone series**: higher modes that add character (timbre). Unlike strings, drum overtones are NOT harmonic (not integer multiples of the fundamental).\n- **Attack transient**: the initial milliseconds contain high-frequency energy from the impact. This \"crack\" distinguishes a dhol from a tabla.\n- **Decay envelope**: each mode decays at a different rate. Low modes sustain longer; high modes die quickly.\n\nThe **spectrogram** shows frequency content over time — revealing how the sound evolves from attack through sustain to silence.",
      analogy: "A drum spectrum is like a group photograph taken at different shutter speeds. A fast shutter (short FFT window) captures the attack transient — who arrived first. A slow shutter (long window) captures the sustained tones — who stayed. The spectrogram is a series of photographs showing the whole event from start to finish.",
      storyConnection: "The dhol player in the story could produce dozens of distinct sounds from one drum — center strikes, rim strikes, muted strikes, rolls. Each technique excites different combinations of vibration modes, creating different spectra. Spectral analysis is the mathematical magnifying glass that reveals what makes each technique unique.",
      checkQuestion: "Why does hitting the drum near the center produce a different sound than hitting near the rim?",
      checkAnswer: "Different strike locations excite different modes. A center strike maximally excites symmetric modes (m=0) because the center is an antinode for these modes. A rim strike excites asymmetric modes (m>0) because the rim region is where these modes have maximum displacement. The resulting spectrum — and therefore the perceived timbre — depends on which modes receive energy. Center = boomy (low symmetric modes). Rim = bright and cutting (high asymmetric modes).",
      codeIntro: "Synthesize dhol drum sounds from center and rim strikes, compute their spectra, and generate spectrograms.",
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

sr = 22050
duration = 1.5

# Bessel zeros for mode frequencies
bessel_zeros = {0: [2.405, 5.520, 8.654], 1: [3.832, 7.016, 10.174], 2: [5.136, 8.417, 11.620]}

def synthesize_drum_hit(strike_type='center', R=0.18, T=2000, sigma=0.5, sr=22050, dur=1.5):
    """Synthesize a drum strike sound from vibration modes."""
    t = np.linspace(0, dur, int(sr * dur), endpoint=False)
    signal = np.zeros_like(t)

    # Mode amplitudes depend on strike location
    if strike_type == 'center':
        mode_amps = {(0,1): 1.0, (0,2): 0.3, (0,3): 0.1, (1,1): 0.05, (2,1): 0.02}
    elif strike_type == 'rim':
        mode_amps = {(0,1): 0.2, (1,1): 1.0, (2,1): 0.6, (1,2): 0.3, (2,2): 0.15}
    else:  # muted
        mode_amps = {(0,1): 0.8, (0,2): 0.1, (1,1): 0.02}

    for (m, n), amp in mode_amps.items():
        alpha = bessel_zeros[m][n-1]
        c = np.sqrt(T / sigma)
        freq = alpha * c / (2 * np.pi * R)
        # Each mode has different decay rate (higher modes decay faster)
        decay = 3 + 2 * m + n
        mode_signal = amp * np.sin(2 * np.pi * freq * t) * np.exp(-decay * t)
        signal += mode_signal

    # Add attack transient (impact noise)
    attack_dur = 0.005
    attack = np.exp(-t / attack_dur) * np.random.randn(len(t)) * 0.3
    signal += attack

    # Normalize
    signal = signal / np.max(np.abs(signal)) * 0.9
    return t, signal

# --- Synthesize different strikes ---
t, center_hit = synthesize_drum_hit('center')
_, rim_hit = synthesize_drum_hit('rim')
_, muted_hit = synthesize_drum_hit('muted')

# --- FFT ---
def compute_spectrum(signal, sr):
    N = len(signal)
    fft = np.fft.rfft(signal)
    freqs = np.fft.rfftfreq(N, 1/sr)
    magnitude = np.abs(fft) / N * 2
    return freqs, magnitude

# --- Spectrogram ---
def simple_spectrogram(signal, sr, window_size=1024, hop=256):
    n_windows = (len(signal) - window_size) // hop
    spec = np.zeros((window_size // 2 + 1, n_windows))
    for i in range(n_windows):
        start = i * hop
        frame = signal[start:start + window_size] * np.hanning(window_size)
        spec[:, i] = np.abs(np.fft.rfft(frame))
    freqs = np.fft.rfftfreq(window_size, 1/sr)
    times = np.arange(n_windows) * hop / sr
    return times, freqs, spec

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Waveforms
for ax, signal, name, color in [(axes[0,0], center_hit, 'Center strike', '#22c55e'),
                                  (axes[0,1], rim_hit, 'Rim strike', '#f59e0b'),
                                  (axes[0,2], muted_hit, 'Muted strike', '#3b82f6')]:
    ax.plot(t[:4000], signal[:4000], color=color, linewidth=0.5)
    ax.set_title(name, color='white', fontsize=11)
    ax.set_xlabel('Time (s)', color='white', fontsize=9)
    ax.set_ylabel('Amplitude', color='white', fontsize=9)

# Spectra
for ax, signal, name, color in [(axes[1,0], center_hit, 'Center', '#22c55e'),
                                  (axes[1,1], rim_hit, 'Rim', '#f59e0b')]:
    freqs, mag = compute_spectrum(signal, sr)
    ax.plot(freqs[:500], mag[:500], color=color, linewidth=1)
    ax.set_xlabel('Frequency (Hz)', color='white', fontsize=9)
    ax.set_ylabel('Magnitude', color='white', fontsize=9)
    ax.set_title(f'{name} strike spectrum', color='white', fontsize=11)

# Spectrogram of center hit
times_s, freqs_s, spec_s = simple_spectrogram(center_hit, sr)
axes[1,2].imshow(np.log1p(spec_s[:100,:]), aspect='auto', origin='lower',
    extent=[0, times_s[-1], 0, freqs_s[100]], cmap='magma')
axes[1,2].set_xlabel('Time (s)', color='white', fontsize=9)
axes[1,2].set_ylabel('Frequency (Hz)', color='white', fontsize=9)
axes[1,2].set_title('Spectrogram (center strike)', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print("Drum sound analysis:")
for name, signal in [('Center', center_hit), ('Rim', rim_hit), ('Muted', muted_hit)]:
    freqs, mag = compute_spectrum(signal, sr)
    peak_freq = freqs[np.argmax(mag[1:]) + 1]
    print(f"  {name} strike: dominant frequency = {peak_freq:.0f} Hz")`,
      challenge: "Synthesize a drum roll (rapid sequence of alternating center and rim strikes) and plot its spectrogram. Do the spectral characteristics change during the roll as the drum head heats up (simulated by a slight frequency increase over time)?",
      successHint: "You can now decompose drum sounds into frequency components and visualize how they evolve over time.",
    },
    {
      title: "Rhythm mathematics — quantifying temporal patterns in drumming",
      concept: "Rhythm is mathematics made audible. Every drum pattern can be described as a sequence of onset times and inter-onset intervals (IOIs). The mathematical structure of rhythm includes:\n\n- **Meter**: the regular grouping of beats (4/4, 6/8, 7/8). Meter defines a grid; rhythm is which grid positions are activated.\n- **Subdivision**: dividing each beat into 2 (duple), 3 (triple), or irregular parts.\n- **Syncopation**: placing accents off the expected beat positions. Quantified as the number of onsets that fall on weak metric positions.\n- **Groove**: micro-timing deviations from the grid that create the \"feel.\" A swing groove shifts every other subdivision by ~30-70ms.\n- **Entropy**: information-theoretic measure of pattern complexity. A steady quarter-note pattern has low entropy; a complex polyrhythm has high entropy.\n\nThe **autocorrelation** of the onset pattern reveals periodicity: peaks in the autocorrelation correspond to the repeating structure (downbeat, phrase length, etc.).",
      analogy: "Rhythm mathematics is like analyzing sentence structure. The meter is grammar (subject-verb-object pattern). Syncopation is placing emphasis on unexpected words for effect. Groove is the speaker's personal delivery style — the same sentence, spoken by different people, has different micro-timing. Autocorrelation identifies the repeating sentence structure (chorus pattern).",
      storyConnection: "The dhol drummer in the story played rhythms that made people dance spontaneously. Dance is a biomechanical response to rhythm — the body synchronizes to the beat through motor entrainment. The mathematical regularity of the pattern (meter) provides predictability, while syncopation provides surprise. The balance between predictability and surprise is what makes rhythm compelling.",
      checkQuestion: "Why do humans find syncopated rhythms more danceable than perfectly metronomic patterns?",
      checkAnswer: "Perfectly metronomic patterns are maximally predictable — no surprise, no engagement. Pure randomness is maximally surprising — no predictability, no groove. Syncopation sits between: the underlying meter provides a predictable framework, while off-beat accents create controlled violations of expectation. Each violation triggers a small dopamine response (prediction error signal). The brain enjoys the pattern of predict-surprise-resolve that syncopation creates. This is the \"sweet spot\" theory of musical pleasure.",
      codeIntro: "Generate drum patterns with varying syncopation and groove, and analyze their rhythmic properties mathematically.",
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

sr = 22050
bpm = 120
beat_duration = 60 / bpm  # seconds per beat
bar_duration = beat_duration * 4  # 4/4 time

def generate_onset_times(pattern_binary, bpm, subdivisions=16):
    """Convert binary pattern to onset times.
    pattern_binary: list of 0/1 for each subdivision
    """
    subdiv_duration = 60 / bpm * 4 / subdivisions  # duration of one subdivision
    onsets = []
    for i, hit in enumerate(pattern_binary):
        if hit:
            onsets.append(i * subdiv_duration)
    return np.array(onsets)

def add_groove(onsets, swing=0, humanize=0):
    """Add micro-timing deviations."""
    grooved = onsets.copy()
    subdiv = onsets[1] - onsets[0] if len(onsets) > 1 else 0.1
    for i in range(len(grooved)):
        # Swing: delay every other subdivision
        if i % 2 == 1 and swing > 0:
            grooved[i] += swing * subdiv
        # Humanize: random micro-timing
        grooved[i] += np.random.normal(0, humanize * subdiv)
    return grooved

def syncopation_score(pattern, subdivisions=16):
    """Compute syncopation score (LHL metric position weight)."""
    # Metric weight: downbeat=4, half=3, quarter=2, eighth=1, sixteenth=0
    weights = np.zeros(subdivisions)
    weights[0] = 4   # downbeat
    weights[8] = 3   # half bar
    weights[4] = weights[12] = 2  # quarter beats
    weights[2] = weights[6] = weights[10] = weights[14] = 1  # eighth beats
    # Syncopation = sum of (pattern * inverse of metric weight)
    inv_weights = 4 - weights
    return np.sum(np.array(pattern) * inv_weights)

def pattern_entropy(pattern):
    """Shannon entropy of IOI distribution."""
    if sum(pattern) < 2:
        return 0
    onsets = [i for i, p in enumerate(pattern) if p]
    iois = np.diff(onsets)
    if len(iois) == 0:
        return 0
    # Normalize IOIs to probabilities
    unique, counts = np.unique(iois, return_counts=True)
    probs = counts / counts.sum()
    return -np.sum(probs * np.log2(probs + 1e-10))

# --- Define rhythm patterns ---
patterns = {
    'Basic rock': [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
    'Syncopated': [1,0,0,1, 0,0,1,0, 0,1,0,0, 1,0,0,1],
    'Son clave':  [1,0,0,1, 0,0,1,0, 0,0,1,0, 1,0,1,0],
    'Dhol basic': [1,0,1,0, 0,1,0,0, 1,0,0,1, 0,0,1,0],
    'Complex':    [1,0,1,1, 0,1,0,1, 1,0,0,1, 0,1,1,0],
}

# Analyze
analyses = {}
for name, pattern in patterns.items():
    synco = syncopation_score(pattern)
    entropy = pattern_entropy(pattern)
    density = sum(pattern) / len(pattern)
    analyses[name] = {'syncopation': synco, 'entropy': entropy, 'density': density}

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Pattern visualization
ax0 = axes[0, 0]
colors_p = ['#22c55e', '#f59e0b', '#3b82f6', '#a855f7', '#ef4444']
for i, (name, pattern) in enumerate(patterns.items()):
    for j, hit in enumerate(pattern):
        if hit:
            ax0.barh(i, 1, left=j, height=0.6, color=colors_p[i], alpha=0.8)
    # Metric grid
    for j in [0, 4, 8, 12]:
        ax0.axvline(j, color='gray', linewidth=0.5, alpha=0.3)
ax0.set_yticks(range(len(patterns)))
ax0.set_yticklabels(list(patterns.keys()), color='white', fontsize=8)
ax0.set_xlabel('Subdivision (16ths)', color='white')
ax0.set_title('Rhythm patterns (one bar)', color='white', fontsize=11)

# Syncopation vs entropy
ax1 = axes[0, 1]
for (name, a), color in zip(analyses.items(), colors_p):
    ax1.scatter(a['syncopation'], a['entropy'], s=200, c=color, edgecolors='white',
               linewidth=0.5, zorder=5, label=name)
ax1.set_xlabel('Syncopation score', color='white')
ax1.set_ylabel('Entropy (bits)', color='white')
ax1.set_title('Rhythm complexity space', color='white', fontsize=11)
ax1.legend(fontsize=7)

# Autocorrelation of dhol pattern
ax2 = axes[1, 0]
dhol = np.array(patterns['Dhol basic'] * 4)  # 4 bars
autocorr = np.correlate(dhol, dhol, mode='full')
autocorr = autocorr[len(autocorr)//2:]
ax2.plot(autocorr, color='#a855f7', linewidth=2)
ax2.set_xlabel('Lag (subdivisions)', color='white')
ax2.set_ylabel('Autocorrelation', color='white')
ax2.set_title('Dhol pattern autocorrelation', color='white', fontsize=11)

# Groove comparison
ax3 = axes[1, 1]
base_onsets = generate_onset_times(patterns['Dhol basic'], bpm)
no_groove = base_onsets
swing_groove = add_groove(base_onsets.copy(), swing=0.3)
human_groove = add_groove(base_onsets.copy(), humanize=0.08)

for i, (onsets, name, color) in enumerate([
    (no_groove, 'Metronomic', '#3b82f6'),
    (swing_groove, 'Swing groove', '#f59e0b'),
    (human_groove, 'Humanized', '#22c55e'),
]):
    for t_onset in onsets:
        ax3.barh(i, 0.02, left=t_onset, height=0.6, color=color)
ax3.set_yticks([0, 1, 2])
ax3.set_yticklabels(['Metronomic', 'Swing', 'Humanized'], color='white', fontsize=9)
ax3.set_xlabel('Time (s)', color='white')
ax3.set_title('Groove: micro-timing variations', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print("Rhythm analysis:")
print(f"{'Pattern':<15} {'Syncopation':>12} {'Entropy':>8} {'Density':>8}")
print("-" * 45)
for name, a in analyses.items():
    print(f"{name:<15} {a['syncopation']:>12.0f} {a['entropy']:>8.2f} {a['density']:>8.2f}")`,
      challenge: "Create a \"rhythm generator\" that produces patterns with a target syncopation score. Use random search: generate 10,000 random 16-step patterns and find the one closest to a syncopation score of 15.",
      successHint: "You can now quantify rhythm mathematically — connecting drum patterns to information theory and metric structure.",
    },
    {
      title: "Drum tuning theory — the relationship between tension, frequency, and timbre",
      concept: "Tuning a drum means adjusting membrane tension to achieve desired frequencies and tonal balance. The fundamental frequency f₀ = (2.405)/(2πR) × sqrt(T/σ) relates directly to tension T. But tuning is more than just pitch — it involves balancing multiple modes.\n\nUniform tension produces clear, focused pitch. Non-uniform tension (one side tighter) creates beating between modes that are supposed to be degenerate (same frequency), producing a warbling sound. Professional tuners achieve uniform tension by tightening opposite lugs in a star pattern.\n\nThe tension-frequency relationship is nonlinear at high tensions because the membrane stretches, changing both R and σ. The effective formula becomes f ∝ sqrt(T - T₀), where T₀ is the slack tension at which the membrane just barely stretches flat.\n\nTimbre (tone quality) depends on the ratio of overtone frequencies to the fundamental. This ratio is fixed by the drum geometry — you cannot change it by tuning. But you CAN change which overtones are audible by adjusting damping (muting material) or by changing the strike location.",
      analogy: "Tuning a drum is like focusing a camera lens. When tension is uniform, all modes align and the sound is \"in focus\" — clear and defined. When tension is uneven, modes split and the sound is blurry — multiple slightly-different frequencies interfere. The tuner's job is to bring all modes into sharp focus through precise tension adjustment.",
      storyConnection: "The dhol player tuned his drum by tightening leather straps, listening to each adjustment. He was navigating the tension-frequency curve by ear — finding the sweet spot where the fundamental was at the right pitch and the overtones were balanced. Our model quantifies what his ears measured intuitively.",
      checkQuestion: "Why does a drum go out of tune when the temperature changes?",
      checkAnswer: "Temperature affects both the membrane (animal skin expands with heat, increasing R and decreasing T) and the shell (wood or metal expands slightly, changing the tensioning geometry). A 10°C increase can drop the fundamental by 5-10% as the skin loosens. Synthetic drumheads (Mylar) are more temperature-stable than natural skin because their thermal expansion coefficient is lower and more predictable. This is why concert drummers retune between sets — stage lights raise the temperature.",
      codeIntro: "Model the tension-frequency relationship for drum tuning and predict how temperature and humidity affect pitch.",
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Drum tuning model ---
class DrumTuner:
    def __init__(self, R=0.18, sigma_0=0.5, n_lugs=8):
        self.R = R  # radius (m)
        self.sigma_0 = sigma_0  # initial surface density (kg/m²)
        self.n_lugs = n_lugs
        self.lug_tensions = np.ones(n_lugs) * 2000  # N/m per lug

    def effective_tension(self):
        return np.mean(self.lug_tensions)

    def tension_uniformity(self):
        return 1 - np.std(self.lug_tensions) / np.mean(self.lug_tensions)

    def fundamental_freq(self, T=None):
        if T is None:
            T = self.effective_tension()
        T_slack = 200  # minimum tension for membrane to be taut
        T_eff = max(0, T - T_slack)
        c = np.sqrt(T_eff / self.sigma_0)
        return 2.405 * c / (2 * np.pi * self.R)

    def frequency_at_temperature(self, T_tension, temp_C, humidity=50):
        """Adjust frequency for temperature and humidity."""
        ref_temp = 20
        # Skin expansion: ~0.003 per degree C
        expansion = 1 + 0.003 * (temp_C - ref_temp)
        # Humidity softening: ~0.001 per % RH above 50
        softening = 1 + 0.001 * max(0, humidity - 50)
        T_adjusted = T_tension / (expansion * softening)
        R_adjusted = self.R * np.sqrt(expansion)
        sigma_adjusted = self.sigma_0 / expansion
        T_eff = max(0, T_adjusted - 200)
        c = np.sqrt(T_eff / sigma_adjusted)
        return 2.405 * c / (2 * np.pi * R_adjusted)

    def tune_to_frequency(self, target_freq):
        """Find tension needed for target frequency."""
        # f = 2.405/(2piR) * sqrt((T-T0)/sigma)
        # T = sigma * (f * 2piR / 2.405)^2 + T0
        T_needed = self.sigma_0 * (target_freq * 2 * np.pi * self.R / 2.405)**2 + 200
        return T_needed

tuner = DrumTuner()

# --- Tension-frequency curve ---
tensions = np.linspace(500, 5000, 200)
freqs = [tuner.fundamental_freq(T) for T in tensions]

# Temperature effect
temps = [10, 20, 30, 40]
temp_freqs = {}
for temp in temps:
    temp_freqs[temp] = [tuner.frequency_at_temperature(T, temp) for T in tensions]

# Target frequencies for musical notes
target_notes = {'C3': 130.8, 'D3': 146.8, 'E3': 164.8, 'G3': 196.0, 'A3': 220.0}

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Tension vs frequency
ax0 = axes[0, 0]
ax0.plot(tensions, freqs, color='#22c55e', linewidth=2, label='20°C (reference)')
for temp, color in zip([10, 30, 40], ['#3b82f6', '#f59e0b', '#ef4444']):
    ax0.plot(tensions, temp_freqs[temp], color=color, linewidth=1, alpha=0.7, label=f'{temp}°C')
for note, freq in target_notes.items():
    ax0.axhline(freq, color='gray', linestyle=':', alpha=0.3)
    ax0.text(4800, freq, note, color='gray', fontsize=8)
ax0.set_xlabel('Tension (N/m)', color='white')
ax0.set_ylabel('Fundamental frequency (Hz)', color='white')
ax0.set_title('Tuning curve: tension vs frequency', color='white', fontsize=11)
ax0.legend(fontsize=8)

# Temperature drift
ax1 = axes[0, 1]
T_fixed = 2500
temp_range = np.linspace(5, 45, 100)
freq_drift = [tuner.frequency_at_temperature(T_fixed, t) for t in temp_range]
f_ref = tuner.frequency_at_temperature(T_fixed, 20)
drift_pct = [(f - f_ref) / f_ref * 100 for f in freq_drift]
ax1.plot(temp_range, drift_pct, color='#f59e0b', linewidth=2)
ax1.axhline(0, color='gray', linestyle='--', alpha=0.5)
ax1.set_xlabel('Temperature (°C)', color='white')
ax1.set_ylabel('Frequency drift (%)', color='white')
ax1.set_title(f'Temperature detuning (at T={T_fixed} N/m)', color='white', fontsize=11)

# Lug uniformity simulation
ax2 = axes[1, 0]
uniformities = np.linspace(0.7, 1.0, 50)
beat_freqs = []
for u in uniformities:
    # Non-uniform tension splits degenerate modes
    T_mean = 2500
    T_std = T_mean * (1 - u)
    f1 = tuner.fundamental_freq(T_mean + T_std)
    f2 = tuner.fundamental_freq(T_mean - T_std)
    beat_freqs.append(abs(f1 - f2))
ax2.plot(uniformities * 100, beat_freqs, color='#a855f7', linewidth=2)
ax2.set_xlabel('Tension uniformity (%)', color='white')
ax2.set_ylabel('Beat frequency (Hz)', color='white')
ax2.set_title('Warbling from non-uniform tension', color='white', fontsize=11)
ax2.axhline(2, color='#ef4444', linestyle='--', alpha=0.5, label='Audible threshold')
ax2.legend(fontsize=8)

# Tuning targets
ax3 = axes[1, 1]
note_names = list(target_notes.keys())
note_freqs = list(target_notes.values())
tensions_needed = [tuner.tune_to_frequency(f) for f in note_freqs]
ax3.bar(note_names, tensions_needed, color='#22c55e')
ax3.set_ylabel('Required tension (N/m)', color='white')
ax3.set_title('Tension required for musical notes', color='white', fontsize=11)
for label in ax3.get_xticklabels(): label.set_color('white')
for i, (t, f) in enumerate(zip(tensions_needed, note_freqs)):
    ax3.text(i, t + 50, f'{f:.0f} Hz', ha='center', color='white', fontsize=8)

plt.tight_layout()
plt.show()

print("Drum tuning parameters:")
for note, freq in target_notes.items():
    T = tuner.tune_to_frequency(freq)
    print(f"  {note} ({freq:.1f} Hz): tension = {T:.0f} N/m")
print(f"\nTemperature sensitivity: {abs(drift_pct[0] - drift_pct[-1])/(temp_range[-1]-temp_range[0]):.2f}% per °C")`,
      challenge: "Model a drum with 8 individually adjustable tuning lugs. Simulate what happens when one lug is 20% loose while the rest are correct. Visualize the resulting non-uniform tension field and predict the beating frequency.",
      successHint: "You can now model drum tuning — connecting tension, temperature, and frequency into a complete acoustic prediction system.",
    },
    {
      title: "Beat detection and tempo estimation — extracting rhythm from audio",
      concept: "Given an audio recording of drumming, how do we automatically detect the beats? This is the **beat detection** problem — fundamental to music information retrieval.\n\nThe standard pipeline:\n1. **Onset detection**: find when new drum hits begin. Compute the spectral flux — the rate of change of the frequency spectrum between adjacent frames. Peaks in spectral flux correspond to onsets.\n2. **Onset strength function**: smooth the spectral flux and threshold to get a clean onset signal.\n3. **Tempo estimation**: compute the autocorrelation of the onset strength function. Peaks correspond to the beat period. Tempo (BPM) = 60 / beat_period.\n4. **Beat tracking**: align a regular grid (at the estimated tempo) to the onset times using dynamic programming to minimize the total deviation.\n\nChallenges: tempo changes (accelerando/ritardando), polyrhythm (multiple simultaneous tempos), and syncopation (onsets between beats). Simple autocorrelation handles steady tempo well but fails for rubato playing.",
      analogy: "Beat detection is like watching a crowd clap along to music. Most people clap on the beat — the peaks in \"clapping energy\" correspond to beats. If the crowd is large enough, individual timing errors average out and the collective clapping locks onto the true beat. Autocorrelation of the onset signal does the same thing mathematically — averaging over many events to find the dominant periodicity.",
      storyConnection: "The dhol drummer played complex rhythms that even experienced dancers could follow. Their bodies performed beat detection intuitively — the motor cortex locked onto the periodicity of the onset pattern and generated synchronized movement. Our algorithm replicates this neurological process computationally.",
      checkQuestion: "Why does simple peak-picking fail for beat detection in syncopated music?",
      checkAnswer: "Syncopated music has strong onsets between the beats. A peak-picker finds all onsets equally — it cannot distinguish a beat from an off-beat accent. Beat detection requires temporal context: the beat is the periodicity that best explains the PATTERN of onsets, not just the loudest ones. Autocorrelation captures this by finding the time interval that produces the strongest self-similarity, even if individual beats are quieter than syncopated accents.",
      codeIntro: "Implement a complete beat detection pipeline: onset detection, tempo estimation, and beat tracking.",
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

sr = 22050
bpm_true = 120
beat_dur = 60 / bpm_true

# --- Synthesize a rhythmic drum pattern ---
duration = 8  # seconds
t = np.linspace(0, duration, int(sr * duration), endpoint=False)
signal = np.zeros_like(t)

# Drum hits at specific times
pattern = [1,0,0,1, 0,0,1,0, 0,1,0,0, 1,0,0,1]  # 16th note pattern
subdiv_dur = beat_dur / 4

hit_times = []
for bar in range(int(duration / (beat_dur * 4))):
    for i, hit in enumerate(pattern):
        if hit:
            t_hit = bar * beat_dur * 4 + i * subdiv_dur
            # Add slight humanization
            t_hit += np.random.normal(0, 0.01)
            hit_times.append(t_hit)

# Synthesize hits as decaying noise bursts
for t_hit in hit_times:
    idx = int(t_hit * sr)
    if idx < len(signal) - 2000:
        burst = np.random.randn(2000) * np.exp(-np.linspace(0, 10, 2000))
        # Add tonal component
        burst += 0.5 * np.sin(2 * np.pi * 150 * np.linspace(0, 2000/sr, 2000)) * np.exp(-np.linspace(0, 8, 2000))
        signal[idx:idx+2000] += burst * 0.3

signal += np.random.randn(len(signal)) * 0.01  # background noise
signal = signal / np.max(np.abs(signal)) * 0.9

# --- Onset detection (spectral flux) ---
frame_size = 1024
hop = 256
n_frames = (len(signal) - frame_size) // hop

onset_strength = np.zeros(n_frames)
prev_spectrum = np.zeros(frame_size // 2 + 1)

for i in range(n_frames):
    start = i * hop
    frame = signal[start:start + frame_size] * np.hanning(frame_size)
    spectrum = np.abs(np.fft.rfft(frame))

    # Spectral flux: sum of positive frequency changes
    flux = np.sum(np.maximum(0, spectrum - prev_spectrum))
    onset_strength[i] = flux
    prev_spectrum = spectrum

frame_times = np.arange(n_frames) * hop / sr

# Normalize
onset_strength = onset_strength / np.max(onset_strength)

# --- Tempo estimation (autocorrelation) ---
# Autocorrelation of onset strength
max_lag = int(2.0 * sr / hop)  # up to 2 seconds
min_lag = int(0.25 * sr / hop)  # down to 0.25 seconds (240 BPM)
autocorr = np.correlate(onset_strength, onset_strength, mode='full')
autocorr = autocorr[len(autocorr)//2:]  # positive lags only
autocorr = autocorr[min_lag:max_lag]
lag_times = np.arange(min_lag, max_lag) * hop / sr

# Find peaks
best_lag_idx = np.argmax(autocorr)
estimated_beat_period = lag_times[best_lag_idx]
estimated_bpm = 60 / estimated_beat_period

# --- Beat tracking (simple grid alignment) ---
beat_times = np.arange(0, duration, estimated_beat_period)
# Adjust phase to align with first onset
onset_peaks = frame_times[onset_strength > 0.3]
if len(onset_peaks) > 0:
    phase_offset = onset_peaks[0] % estimated_beat_period
    beat_times = np.arange(phase_offset, duration, estimated_beat_period)

# --- Plot ---
fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Waveform with detected beats
ax0 = axes[0, 0]
ax0.plot(t[:sr*4], signal[:sr*4], color='#22c55e', linewidth=0.3, alpha=0.7)
for bt in beat_times[beat_times < 4]:
    ax0.axvline(bt, color='#ef4444', linewidth=1, alpha=0.7)
ax0.set_xlabel('Time (s)', color='white')
ax0.set_title('Waveform with detected beats (red)', color='white', fontsize=11)

# Onset strength
ax1 = axes[0, 1]
ax1.plot(frame_times, onset_strength, color='#f59e0b', linewidth=0.8)
ax1.axhline(0.3, color='#ef4444', linestyle='--', alpha=0.5, label='Threshold')
for bt in beat_times[beat_times < duration]:
    ax1.axvline(bt, color='#ef4444', linewidth=0.5, alpha=0.5)
ax1.set_xlabel('Time (s)', color='white')
ax1.set_ylabel('Onset strength', color='white')
ax1.set_title('Onset detection function', color='white', fontsize=11)
ax1.legend(fontsize=8)

# Autocorrelation
ax2 = axes[1, 0]
ax2.plot(60/lag_times, autocorr, color='#3b82f6', linewidth=1)
ax2.axvline(estimated_bpm, color='#22c55e', linewidth=2, linestyle='--', label=f'Detected: {estimated_bpm:.1f} BPM')
ax2.axvline(bpm_true, color='#f59e0b', linewidth=2, linestyle=':', label=f'True: {bpm_true} BPM')
ax2.set_xlabel('Tempo (BPM)', color='white')
ax2.set_ylabel('Autocorrelation', color='white')
ax2.set_title('Tempo estimation', color='white', fontsize=11)
ax2.set_xlim(60, 200)
ax2.legend(fontsize=9)

# Beat accuracy
ax3 = axes[1, 1]
errors = []
for bt in beat_times:
    closest_hit = hit_times[np.argmin(np.abs(np.array(hit_times) - bt))]
    errors.append((bt - closest_hit) * 1000)  # ms
ax3.hist(errors, bins=20, color='#a855f7', edgecolor='#111827', alpha=0.7)
ax3.set_xlabel('Beat error (ms)', color='white')
ax3.set_ylabel('Count', color='white')
ax3.set_title(f'Beat tracking accuracy (mean={np.mean(np.abs(errors)):.1f}ms)', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print(f"True tempo: {bpm_true} BPM")
print(f"Estimated tempo: {estimated_bpm:.1f} BPM (error: {abs(estimated_bpm-bpm_true):.1f} BPM)")
print(f"Beat tracking: mean error = {np.mean(np.abs(errors)):.1f} ms")
print(f"Detected {len(beat_times)} beats in {duration}s")`,
      challenge: "Modify the drum pattern to include a gradual tempo increase (accelerando) from 120 to 140 BPM over 8 seconds. Does the autocorrelation-based tempo estimator detect the change? Implement a windowed tempo estimator that tracks tempo over time.",
      successHint: "You can now detect beats and estimate tempo from audio — the foundation of rhythm analysis software.",
    },
    {
      title: "Building a drum classifier — distinguishing drum types by their acoustic signatures",
      concept: "Different drums have different acoustic signatures: the dhol has a deep, boomy spectrum; the tabla has a defined pitch with clear harmonics; the nagara has a sharp attack with minimal sustain. Building a classifier that distinguishes drum types from audio is a pattern recognition problem.\n\nThe pipeline: (1) Synthesize or record examples of each drum type. (2) Extract features: spectral centroid, bandwidth, attack time, decay rate, harmonic ratio. (3) Train a classifier (k-NN or logistic regression) on the feature vectors. (4) Evaluate with confusion matrix.\n\nFor drum classification, the most discriminative features are:\n- **Spectral centroid**: low for dhol, medium for nagara, high for metallic percussion.\n- **Attack time**: fast for sticks (nagara), medium for hands (tabla), slow for mallets (dhol).\n- **Decay time**: long for large drums, short for small drums.\n- **Harmonic-to-noise ratio**: high for tuned drums (tabla), low for untuned (dhol side drum).",
      analogy: "Drum classification is like wine tasting. An expert can identify the grape variety (drum type) from taste (acoustic features): the acidity (spectral centroid), the body (spectral bandwidth), the finish (decay time), and the clarity (harmonic ratio). The classifier learns these same distinctions from numerical features instead of sensory experience.",
      storyConnection: "The dhol player in the story was part of an ensemble — dhol, taal, pepa, gagana — each instrument contributing a unique voice. The classifier learns to recognize each voice computationally, which enables automatic transcription of ensemble recordings into separate instrument tracks.",
      checkQuestion: "Why is harmonic-to-noise ratio a good feature for distinguishing tabla from dhol?",
      checkAnswer: "Tabla are precisely tuned — their membrane vibration produces clear harmonic overtones at integer-related frequencies, giving a high harmonic-to-noise ratio. Dhol (especially the bass side) have loose membranes that produce broad-spectrum noise with less defined harmonics, giving a low ratio. This single feature separates tuned drums from untuned drums with high accuracy. Adding spectral centroid then separates high-pitched tuned drums from low-pitched ones.",
      codeIntro: "Build a complete drum type classifier from synthesized audio features.",
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Synthesize features for drum types ---
def generate_drum_features(drum_type, n_samples=60):
    """Generate synthetic feature vectors for different drum types."""
    features = []
    for _ in range(n_samples):
        if drum_type == 'dhol':
            centroid = np.random.normal(200, 40)
            bandwidth = np.random.normal(300, 50)
            attack = np.random.normal(15, 3)  # ms
            decay = np.random.normal(500, 80)  # ms
            hnr = np.random.normal(3, 1)
        elif drum_type == 'tabla':
            centroid = np.random.normal(400, 60)
            bandwidth = np.random.normal(150, 30)
            attack = np.random.normal(8, 2)
            decay = np.random.normal(300, 60)
            hnr = np.random.normal(12, 2)
        elif drum_type == 'nagara':
            centroid = np.random.normal(600, 80)
            bandwidth = np.random.normal(400, 70)
            attack = np.random.normal(5, 1.5)
            decay = np.random.normal(150, 40)
            hnr = np.random.normal(5, 1.5)
        elif drum_type == 'pepa':
            centroid = np.random.normal(800, 100)
            bandwidth = np.random.normal(200, 40)
            attack = np.random.normal(20, 5)
            decay = np.random.normal(400, 70)
            hnr = np.random.normal(15, 3)

        features.append([centroid, bandwidth, attack, decay, hnr])
    return np.array(features)

# Generate dataset
drum_types = ['dhol', 'tabla', 'nagara', 'pepa']
X_all, y_all = [], []
for i, dtype in enumerate(drum_types):
    feats = generate_drum_features(dtype)
    X_all.append(feats)
    y_all.extend([i] * len(feats))

X = np.vstack(X_all)
y = np.array(y_all)
feature_names = ['Spectral centroid', 'Bandwidth', 'Attack (ms)', 'Decay (ms)', 'HNR']

# Train/test split
idx = np.random.permutation(len(y))
split = int(0.7 * len(y))
X_train, X_test = X[idx[:split]], X[idx[split:]]
y_train, y_test = y[idx[:split]], y[idx[split:]]

# Normalize
mu, sigma = X_train.mean(0), X_train.std(0) + 1e-8
Xn_train = (X_train - mu) / sigma
Xn_test = (X_test - mu) / sigma

# k-NN classifier
def knn_predict(X_train, y_train, X_test, k=5):
    predictions = []
    for x in X_test:
        dists = np.sqrt(np.sum((X_train - x)**2, axis=1))
        nearest = np.argsort(dists)[:k]
        votes = y_train[nearest]
        pred = np.bincount(votes, minlength=len(drum_types)).argmax()
        predictions.append(pred)
    return np.array(predictions)

preds = knn_predict(Xn_train, y_train, Xn_test, k=5)

# Confusion matrix
n_classes = len(drum_types)
cm = np.zeros((n_classes, n_classes), dtype=int)
for true, pred in zip(y_test, preds):
    cm[true, pred] += 1

accuracy = np.sum(preds == y_test) / len(y_test)

# Per-class metrics
per_class = {}
for i, name in enumerate(drum_types):
    tp = cm[i, i]
    fp = cm[:, i].sum() - tp
    fn = cm[i, :].sum() - tp
    prec = tp / max(tp + fp, 1)
    rec = tp / max(tp + fn, 1)
    per_class[name] = {'precision': prec, 'recall': rec}

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Feature scatter (centroid vs HNR)
ax0 = axes[0, 0]
colors_d = ['#22c55e', '#f59e0b', '#3b82f6', '#a855f7']
for i, (name, color) in enumerate(zip(drum_types, colors_d)):
    mask = y == i
    ax0.scatter(X[mask, 0], X[mask, 4], s=15, c=color, alpha=0.6, label=name)
ax0.set_xlabel('Spectral centroid (Hz)', color='white')
ax0.set_ylabel('Harmonic-to-noise ratio', color='white')
ax0.set_title('Feature space', color='white', fontsize=11)
ax0.legend(fontsize=9)

# Confusion matrix
ax1 = axes[0, 1]
im = ax1.imshow(cm, cmap='Blues')
ax1.set_xticks(range(n_classes))
ax1.set_xticklabels(drum_types, color='white', fontsize=9)
ax1.set_yticks(range(n_classes))
ax1.set_yticklabels(drum_types, color='white', fontsize=9)
for i in range(n_classes):
    for j in range(n_classes):
        ax1.text(j, i, str(cm[i,j]), ha='center', va='center', color='white', fontsize=14, fontweight='bold')
ax1.set_title(f'Confusion matrix (accuracy={accuracy:.0%})', color='white', fontsize=11)
ax1.set_xlabel('Predicted', color='white')
ax1.set_ylabel('True', color='white')

# Feature importance (by variance ratio)
ax2 = axes[1, 0]
between_var = np.zeros(5)
for f in range(5):
    class_means = [X[y==i, f].mean() for i in range(n_classes)]
    overall_mean = X[:, f].mean()
    between_var[f] = np.sum([(m - overall_mean)**2 for m in class_means])
within_var = np.zeros(5)
for f in range(5):
    for i in range(n_classes):
        within_var[f] += np.var(X[y==i, f])
f_ratio = between_var / (within_var + 1e-10)
sorted_idx = np.argsort(f_ratio)
ax2.barh(range(5), f_ratio[sorted_idx], color='#22c55e')
ax2.set_yticks(range(5))
ax2.set_yticklabels([feature_names[i] for i in sorted_idx], color='white', fontsize=9)
ax2.set_title('Feature discriminative power (F-ratio)', color='white', fontsize=11)

# Per-class performance
ax3 = axes[1, 1]
x_pos = np.arange(n_classes)
precs = [per_class[n]['precision'] for n in drum_types]
recs = [per_class[n]['recall'] for n in drum_types]
ax3.bar(x_pos - 0.2, precs, 0.4, color='#22c55e', label='Precision')
ax3.bar(x_pos + 0.2, recs, 0.4, color='#f59e0b', label='Recall')
ax3.set_xticks(x_pos)
ax3.set_xticklabels(drum_types, color='white', fontsize=9)
ax3.set_ylabel('Score', color='white')
ax3.set_title('Per-class precision & recall', color='white', fontsize=11)
ax3.legend(fontsize=9)

plt.tight_layout()
plt.show()

print(f"Drum classifier: {accuracy:.0%} accuracy on {len(y_test)} test samples")
for name in drum_types:
    print(f"  {name}: precision={per_class[name]['precision']:.2f}, recall={per_class[name]['recall']:.2f}")`,
      challenge: "Add a \"mixed ensemble\" test: synthesize a drum pattern where dhol and tabla play simultaneously. Can you separate their contributions using spectral centroid filtering? How does classification accuracy change when the drums overlap in time?",
      successHint: "You have built a complete drum acoustics analysis pipeline: from membrane physics through spectral analysis, rhythm mathematics, tuning theory, beat detection, to sound classification. The system connects the dhol drum tradition to quantitative acoustics and machine learning.",
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Machine Learning Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (acoustics fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for drum acoustics and rhythm analysis. Click to start.</p>
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
