import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function BambooWindLevel4() {
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState('');

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true);
    setLoadProgress('Loading Python runtime...');
    try {
      if (!(window as any).loadPyodide) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
        document.head.appendChild(script);
        await new Promise<void>((resolve, reject) => { script.onload = () => resolve(); script.onerror = () => reject(new Error('Failed')); });
      }
      setLoadProgress('Starting Python...');
      const pyodide = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      setLoadProgress('Installing numpy & matplotlib...');
      await pyodide.loadPackage('micropip');
      const micropip = pyodide.pyimport('micropip');
      for (const pkg of ['numpy', 'matplotlib']) {
        try { await micropip.install(pkg); } catch { await pyodide.loadPackage(pkg).catch(() => {}); }
      }
      await pyodide.runPythonAsync(`
import sys, io
class OutputCapture:
    def __init__(self): self.output = []
    def write(self, text): self.output.append(text)
    def flush(self): pass
    def get_output(self): return ''.join(self.output)
    def clear(self): self.output = []
_stdout_capture = OutputCapture()
sys.stdout = _stdout_capture
sys.stderr = _stdout_capture
import matplotlib; matplotlib.use('AGG')
import matplotlib.pyplot as plt; import base64
def _get_plot_as_base64():
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=100, bbox_inches='tight', facecolor='#1f2937', edgecolor='none')
    buf.seek(0); img_str = base64.b64encode(buf.read()).decode('utf-8'); plt.close('all'); return img_str
`);
      pyodideRef.current = pyodide; setPyReady(true); setLoading(false); setLoadProgress('');
      return pyodide;
    } catch (err: any) { setLoading(false); setLoadProgress('Error: ' + err.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Project design — the bamboo flute simulator',
      concept: `In this capstone project you will build a complete bamboo flute simulator from first principles. The simulator takes two inputs: a set of finger hole positions along a bamboo tube, and a blowing pressure parameter. It outputs a synthesized sound waveform that models what the flute would actually sound like with those physical parameters.

This is not a toy. Real acoustic instrument simulators use the same physics we will implement here — resonant cavity modeling, harmonic synthesis, and envelope shaping. The difference between our simulator and a commercial one is scale (they model hundreds of physical parameters; we will model the essential dozen) and audio quality (they use 64-bit floating point and sophisticated noise models; we will use numpy arrays and simpler approximations). But the core physics is identical.

The architecture has four stages, each corresponding to a mini-lesson in this capstone. First, the **physics model** calculates resonant frequencies from tube geometry. Second, the **tone synthesizer** generates audio waveforms by summing harmonics with appropriate amplitudes. Third, the **fingering chart generator** maps musical notes to specific hole configurations. Fourth, the **spectral visualizer** plots the frequency content of each note for analysis. By the end, you will have a working instrument that takes physical dimensions as input and produces audible music as output.`,
      analogy: 'Building the flute simulator is like building a flight simulator. You do not need to build a real airplane — you need to model the physics accurately enough that the behavior matches reality. Our "cockpit" is the tube dimensions and hole positions. Our "flight physics" is the resonance equations. Our "display" is the waveform and spectrum plots.',
      storyConnection: 'The bamboo that taught the wind to dance did so through physics — tube length, diameter, hole positions. This simulator encodes that same physics in code. You are building a digital bamboo grove where you can experiment with tube dimensions and hear the results instantly, without carving a single piece of bamboo.',
      checkQuestion: 'What are the minimum physical parameters needed to simulate a bamboo flute with six finger holes? List each parameter and explain why it matters.',
      checkAnswer: 'Minimum parameters: (1) tube length — sets the fundamental frequency, (2) tube inner diameter — affects end correction and harmonic content, (3) six hole positions along the tube — each determines the effective length when opened, (4) six hole diameters — affects how completely each hole "cuts off" the tube, (5) blowing pressure — affects amplitude and which harmonics are excited. Optional but important: wall thickness (affects impedance), taper (affects intonation), temperature (affects speed of sound).',
      codeIntro: 'Set up the project scaffolding: define the BambooFlute class with all physical parameters and a method to calculate the speed of sound adjusted for temperature.',
      code: `import numpy as np
import matplotlib.pyplot as plt

class BambooFlute:
    """
    Physical model of a bamboo flute.
    All dimensions in meters, frequencies in Hz.
    """
    def __init__(self, tube_length=0.40, inner_diameter=0.018,
                 wall_thickness=0.003, temperature=25.0):
        self.tube_length = tube_length          # meters
        self.inner_radius = inner_diameter / 2  # meters
        self.wall_thickness = wall_thickness    # meters
        self.temperature = temperature          # Celsius

        # Finger hole positions (distance from blowing end) and diameters
        # Default: 6 holes for a major scale
        self.hole_positions = []  # will be calculated
        self.hole_diameters = []  # will be calculated

        # Acoustic properties
        self.speed_of_sound = self._calc_speed_of_sound()
        self.end_correction = 0.6133 * self.inner_radius

        # Synthesis parameters
        self.sample_rate = 44100
        self.num_harmonics = 12
        self.blowing_pressure = 0.7  # 0.0 to 1.0

    def _calc_speed_of_sound(self):
        """Speed of sound in air, adjusted for temperature."""
        return 331.3 + 0.606 * self.temperature

    def effective_length(self, physical_length=None):
        """Effective acoustic length including end corrections."""
        L = physical_length if physical_length is not None else self.tube_length
        return L + 2 * self.end_correction

    def fundamental_frequency(self, effective_length=None):
        """Fundamental frequency for open-open tube."""
        L_eff = effective_length if effective_length is not None else self.effective_length()
        return self.speed_of_sound / (2 * L_eff)

    def info(self):
        """Print flute specifications."""
        L_eff = self.effective_length()
        f1 = self.fundamental_frequency()
        return {
            'tube_length_cm': self.tube_length * 100,
            'inner_diameter_mm': self.inner_radius * 2000,
            'wall_thickness_mm': self.wall_thickness * 1000,
            'temperature_C': self.temperature,
            'speed_of_sound': self.speed_of_sound,
            'end_correction_mm': self.end_correction * 1000,
            'effective_length_cm': L_eff * 100,
            'fundamental_Hz': f1,
        }


# Create a flute and display its properties
flute = BambooFlute(tube_length=0.40, inner_diameter=0.018, temperature=25)
info = flute.info()

fig, axes = plt.subplots(1, 2, figsize=(14, 5))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Bamboo Flute Simulator: Project Setup',
             color='white', fontsize=14, fontweight='bold')

# Plot 1: How fundamental frequency changes with tube length
ax = axes[0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
lengths = np.linspace(0.20, 0.60, 100)
fundamentals = [BambooFlute(tube_length=L).fundamental_frequency() for L in lengths]

ax.plot(lengths * 100, fundamentals, color='#22c55e', linewidth=2.5)
ax.axhline(info['fundamental_Hz'], color='#f59e0b', linestyle='--', alpha=0.5)
ax.axvline(info['tube_length_cm'], color='#f59e0b', linestyle='--', alpha=0.5)
ax.scatter([info['tube_length_cm']], [info['fundamental_Hz']],
           color='#f59e0b', s=100, zorder=5,
           label=f'Our flute: {info["tube_length_cm"]:.0f} cm = {info["fundamental_Hz"]:.1f} Hz')
ax.set_title('Fundamental frequency vs tube length', color='white', fontsize=11)
ax.set_xlabel('Tube length (cm)', color='gray')
ax.set_ylabel('Fundamental freq (Hz)', color='gray')
ax.legend(fontsize=9)

# Plot 2: How temperature affects pitch
ax2 = axes[1]
ax2.set_facecolor('#111827')
ax2.tick_params(colors='gray')
temps = np.linspace(0, 45, 100)
freqs_temp = [BambooFlute(tube_length=0.40, temperature=T).fundamental_frequency()
              for T in temps]
ax2.plot(temps, freqs_temp, color='#3b82f6', linewidth=2.5)
ax2.axvline(25, color='#f59e0b', linestyle='--', alpha=0.5)
ax2.set_title('Pitch drift with temperature (same tube)', color='white', fontsize=11)
ax2.set_xlabel('Temperature (C)', color='gray')
ax2.set_ylabel('Fundamental freq (Hz)', color='gray')

# Annotate the range
f_cold = BambooFlute(tube_length=0.40, temperature=5).fundamental_frequency()
f_hot = BambooFlute(tube_length=0.40, temperature=40).fundamental_frequency()
ax2.annotate(f'{f_hot - f_cold:.1f} Hz drift\n(5C to 40C)',
             xy=(22, (f_cold + f_hot)/2), fontsize=10, color='#f59e0b',
             ha='center')

plt.tight_layout()
plt.show()

print("=== Bamboo Flute Simulator: Specifications ===")
print()
for key, val in info.items():
    label = key.replace('_', ' ').title()
    if isinstance(val, float):
        print(f"  {label}: {val:.2f}")
    else:
        print(f"  {label}: {val}")
print()
print("Project architecture:")
print("  1. Physics model  -> resonant frequencies from geometry")
print("  2. Tone synthesis -> waveforms from harmonic recipes")
print("  3. Fingering chart -> note-to-hole mapping")
print("  4. Spectral viz   -> frequency analysis of output")
print("  5. Portfolio       -> complete simulator with UI")
print()
print("Next: implement the resonance model to calculate frequencies")
print("for every possible fingering combination.")`,
      challenge: 'Extend the BambooFlute class to accept a taper parameter (ratio of exit diameter to entrance diameter). Research how conical vs cylindrical bores affect the harmonic series. A conical bore produces all harmonics (like an open cylinder), while a true cylinder closed at one end produces only odd harmonics.',
      successHint: 'The project scaffolding is in place. Every subsequent mini-lesson builds on this BambooFlute class, adding capabilities until we have a complete simulator.',
    },
    {
      title: 'Physics model — resonant cavity frequencies',
      concept: `The core of the flute simulator is calculating **which frequencies the tube will produce for each fingering**. When all holes are closed, the effective tube length equals the full physical length (plus end corrections), and the flute plays its lowest note. When you open a finger hole, you create an acoustic short-circuit at that point — the air column effectively ends at the first open hole. The effective length shortens, and the pitch rises.

The simplest model treats each open hole as a new open end: L_effective = distance_to_first_open_hole + end_correction. This gives a reasonable first approximation, but real flutes are more complex. A small hole does not completely terminate the air column — some sound energy continues past it. The correction depends on the hole diameter relative to the tube diameter. A hole that is much smaller than the tube diameter acts as a partial opening, raising the pitch less than a full open end would. This is modeled with a **lattice cutoff frequency**: below this frequency, the hole has little effect; above it, the hole acts as an open end.

For our simulator, we use an intermediate model: each open hole reduces the effective length by an amount proportional to (hole_diameter / tube_diameter)^2. This captures the essential physics — larger holes shift pitch more — without requiring a full transmission-line simulation. The resonant frequencies for a given fingering are then f_n = n * v_sound / (2 * L_effective) for harmonics n = 1, 2, 3, ...`,
      analogy: 'Think of the bamboo tube as a hallway with doors along one side. When all doors are closed, sound bounces between the two ends of the full hallway. Opening a door is like punching a hole in the wall — sound escapes there, and the effective hallway shortens to the distance from the start to the first open door. A small door lets some sound through; a large door lets almost all of it through.',
      storyConnection: 'The bamboo in the story has natural nodes and joints — places where the tube geometry changes. Each joint acts like a partial finger hole, subtly altering the resonant frequencies. The wind discovers that different bamboo stalks, with their unique joint patterns, produce different melodies. Our simulator models this same relationship between geometry and frequency.',
      checkQuestion: 'A flute has a tube length of 40 cm and a finger hole at 25 cm from the blowing end with a diameter equal to the tube diameter. Another hole at 30 cm has a diameter of only 1/3 of the tube diameter. If both are open, which one determines the effective length, and why?',
      checkAnswer: 'The hole at 25 cm determines the effective length because it is closer to the blowing end — sound encounters it first. Even though the hole at 30 cm is also open, the air column is already effectively terminated at 25 cm. The small diameter of the 30 cm hole is irrelevant because the 25 cm hole (being full-diameter) acts as a complete open end. If only the 30 cm hole were open, its small diameter would mean the effective length is somewhat longer than 30 cm.',
      codeIntro: 'Implement the resonant frequency calculator. Given hole positions and a fingering pattern (which holes are open/closed), compute the effective tube length and all resonant frequencies.',
      code: `import numpy as np
import matplotlib.pyplot as plt

class BambooFlute:
    def __init__(self, tube_length=0.40, inner_diameter=0.018, temperature=25.0):
        self.tube_length = tube_length
        self.inner_radius = inner_diameter / 2
        self.temperature = temperature
        self.speed_of_sound = 331.3 + 0.606 * temperature
        self.end_correction = 0.6133 * self.inner_radius
        self.hole_positions = []
        self.hole_diameters = []

    def add_hole(self, position, diameter=0.008):
        """Add a finger hole at given position (meters from blowing end)."""
        self.hole_positions.append(position)
        self.hole_diameters.append(diameter)

    def effective_length(self, fingering):
        """
        Calculate effective acoustic length for a given fingering.
        fingering: list of bools, True = hole open, False = hole closed.
        """
        L = self.tube_length

        # Find the first open hole
        for i, is_open in enumerate(fingering):
            if is_open and i < len(self.hole_positions):
                hole_pos = self.hole_positions[i]
                hole_d = self.hole_diameters[i]
                tube_d = self.inner_radius * 2

                # Correction factor: small holes don\'t fully terminate the column
                # Effective shortening depends on (hole_d / tube_d)^2
                correction_factor = min((hole_d / tube_d) ** 2, 1.0)

                # Effective length: interpolate between full tube and hole position
                L = hole_pos + (self.tube_length - hole_pos) * (1 - correction_factor)
                break

        return L + 2 * self.end_correction

    def resonant_frequencies(self, fingering, n_harmonics=8):
        """Calculate resonant frequencies for a given fingering."""
        L_eff = self.effective_length(fingering)
        f1 = self.speed_of_sound / (2 * L_eff)
        return [n * f1 for n in range(1, n_harmonics + 1)]


# Create a 6-hole bamboo flute
flute = BambooFlute(tube_length=0.40, inner_diameter=0.018)

# Place 6 holes for an approximate major scale
# Positions calculated to produce roughly equal semitone steps
hole_positions = [0.175, 0.200, 0.225, 0.260, 0.290, 0.320]
hole_diameters = [0.008, 0.008, 0.008, 0.009, 0.009, 0.010]

for pos, diam in zip(hole_positions, hole_diameters):
    flute.add_hole(pos, diam)

# Define fingerings: False = closed, True = open
# Standard flute: opening holes from bottom to top raises pitch
fingerings = {
    'All closed':       [False, False, False, False, False, False],
    'Hole 6 open':      [False, False, False, False, False, True],
    'Holes 5-6 open':   [False, False, False, False, True,  True],
    'Holes 4-6 open':   [False, False, False, True,  True,  True],
    'Holes 3-6 open':   [False, False, True,  True,  True,  True],
    'Holes 2-6 open':   [False, True,  True,  True,  True,  True],
    'All open':         [True,  True,  True,  True,  True,  True],
}

fig, axes = plt.subplots(2, 2, figsize=(14, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Bamboo Flute Physics: Resonant Frequencies for Each Fingering',
             color='white', fontsize=14, fontweight='bold')

# --- Plot 1: Effective length for each fingering ---
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

names = list(fingerings.keys())
eff_lengths = [flute.effective_length(f) * 100 for f in fingerings.values()]
fundamentals = [flute.resonant_frequencies(f)[0] for f in fingerings.values()]

colors = plt.cm.viridis(np.linspace(0.2, 0.9, len(names)))
ax.barh(range(len(names)), eff_lengths, color=colors)
ax.set_yticks(range(len(names)))
ax.set_yticklabels(names, fontsize=8, color='gray')
ax.set_xlabel('Effective acoustic length (cm)', color='gray')
ax.set_title('Effective tube length per fingering', color='white', fontsize=11)

for i, (L, f) in enumerate(zip(eff_lengths, fundamentals)):
    ax.text(L + 0.3, i, f'{f:.0f} Hz', va='center', fontsize=8, color='white')

# --- Plot 2: Harmonic series for each fingering ---
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
ax2.tick_params(colors='gray')

for i, (name, fing) in enumerate(fingerings.items()):
    freqs = flute.resonant_frequencies(fing, n_harmonics=6)
    color = colors[i]
    for h, f in enumerate(freqs):
        ax2.scatter(f, i, color=color, s=max(80 - h * 12, 10), zorder=5)
    # Connect harmonics
    ax2.plot(freqs, [i] * len(freqs), color=color, linewidth=0.5, alpha=0.5)

ax2.set_yticks(range(len(names)))
ax2.set_yticklabels(names, fontsize=8, color='gray')
ax2.set_xlabel('Frequency (Hz)', color='gray')
ax2.set_title('Harmonic series for each fingering (6 harmonics)', color='white', fontsize=11)

# --- Plot 3: Physical tube diagram with hole positions ---
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
ax3.tick_params(colors='gray')

# Draw the tube
tube_y = 0.5
tube_height = 0.15
ax3.add_patch(plt.Rectangle((0, tube_y - tube_height/2),
              flute.tube_length * 100, tube_height,
              facecolor='#92400e', edgecolor='#d97706', linewidth=2))

# Draw holes
for i, (pos, diam) in enumerate(zip(hole_positions, hole_diameters)):
    circle = plt.Circle((pos * 100, tube_y), diam * 100 * 3,
                         facecolor='#1f2937', edgecolor='white', linewidth=1.5)
    ax3.add_patch(circle)
    ax3.text(pos * 100, tube_y - 0.25, f'H{i+1}\\n{pos*100:.1f}cm',
             ha='center', fontsize=7, color='gray')

ax3.set_xlim(-2, flute.tube_length * 100 + 2)
ax3.set_ylim(-0.1, 1.0)
ax3.set_xlabel('Position along tube (cm)', color='gray')
ax3.set_title('Physical flute layout (6 finger holes)', color='white', fontsize=11)
ax3.set_aspect('equal')

# --- Plot 4: Fundamental frequency scale ---
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
ax4.tick_params(colors='gray')

note_freqs = fundamentals
ax4.plot(range(len(note_freqs)), note_freqs, 'o-', color='#22c55e', linewidth=2, markersize=8)
for i, f in enumerate(note_freqs):
    ax4.annotate(f'{f:.0f} Hz', (i, f), textcoords='offset points',
                xytext=(0, 12), fontsize=8, color='white', ha='center')

ax4.set_xticks(range(len(names)))
ax4.set_xticklabels([n.replace(' ', '\\n') for n in names], fontsize=7, color='gray')
ax4.set_ylabel('Frequency (Hz)', color='gray')
ax4.set_title('Scale produced by sequential fingerings', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print("=== Resonant Frequency Calculator ===")
print(f"Tube: {flute.tube_length*100:.1f} cm, diameter: {flute.inner_radius*2000:.1f} mm")
print(f"Speed of sound: {flute.speed_of_sound:.1f} m/s")
print()
for name, fing in fingerings.items():
    L_eff = flute.effective_length(fing)
    freqs = flute.resonant_frequencies(fing, 4)
    print(f"{name:20s} | L_eff={L_eff*100:5.1f} cm | "
          f"f1={freqs[0]:6.1f} | f2={freqs[1]:6.1f} | f3={freqs[2]:6.1f} | f4={freqs[3]:6.1f} Hz")
print()
print("Interval between consecutive notes:")
for i in range(1, len(fundamentals)):
    ratio = fundamentals[i] / fundamentals[i-1]
    cents = 1200 * np.log2(ratio)
    print(f"  {names[i-1]:20s} -> {names[i]:20s}: ratio={ratio:.4f}, {cents:.0f} cents")`,
      challenge: 'The simple model treats each open hole as a new open end. Improve it by modeling the effect of multiple open holes: when holes 4, 5, and 6 are all open, the effective termination point is influenced by all three. Implement a correction where each subsequent open hole pulls the effective end slightly further toward the blowing end.',
      successHint: 'The physics model is the foundation. Every subsequent step — synthesis, fingering charts, visualization — depends on these frequency calculations being accurate.',
    },
    {
      title: 'Tone synthesis — harmonics and ADSR envelope',
      concept: `Knowing the resonant frequencies is only half the story. To generate audio that sounds like a bamboo flute, we need to model two more things: the **harmonic recipe** (the relative amplitudes of each harmonic) and the **envelope** (how the sound evolves over time from the moment the player starts blowing to the moment they stop).

The harmonic recipe of a bamboo flute is distinctive. The fundamental is strong. The second harmonic is moderate. Higher harmonics fall off gradually, roughly following a 1/n pattern but with significant variation depending on the bore shape, hole configuration, and blowing technique. Odd harmonics tend to be slightly stronger than even harmonics in cylindrical bores, giving bamboo flutes their characteristic hollow, warm quality. A breathy flute sound also contains broadband noise — the turbulence of air hitting the edge of the embouchure — which we can model by adding filtered white noise.

The **ADSR envelope** (Attack, Decay, Sustain, Release) shapes how the amplitude changes over time. Attack is the initial onset (10-50 ms for a flute — the time it takes for the air column to start resonating). Decay is a brief drop to the sustain level (the air column stabilizes). Sustain is the steady-state level while the player blows. Release is the fade after the player stops (50-200 ms as the resonance dies out). Without the envelope, synthesized notes sound mechanical and lifeless. With it, they breathe.`,
      analogy: 'The harmonic recipe is like a cooking recipe: "two parts fundamental, one part second harmonic, half a part third harmonic." The ADSR envelope is how you serve the dish: you plate it (attack), let it settle (decay), the diner eats steadily (sustain), and the plate is cleared (release). Both the recipe and the presentation matter for the final experience.',
      storyConnection: 'When the wind first catches the bamboo tube, there is a brief breathy attack as the resonance builds. Then the tone stabilizes into a sustained note. When the wind shifts, the note fades. This natural envelope — the wind rising and falling — is exactly what ADSR models. The story describes the wind learning to shape these envelopes: short staccato gusts vs long sustained breezes.',
      checkQuestion: 'A flute note has attack=20ms, decay=30ms, sustain_level=0.7, release=100ms, and total duration=500ms. At what amplitude is the signal at t=10ms, t=40ms, t=300ms, and t=550ms?',
      checkAnswer: 'At t=10ms: in attack phase, amplitude = 10/20 = 0.5 (ramping up linearly). At t=40ms: in decay phase, 10ms into decay, amplitude = 1.0 - (1.0-0.7)*(10/30) = 0.9. At t=300ms: in sustain phase, amplitude = 0.7. At t=550ms: in release phase, 50ms into release, amplitude = 0.7 * (1 - 50/100) = 0.35.',
      codeIntro: 'Implement a complete tone synthesizer with harmonic recipe and ADSR envelope. Generate and visualize individual flute notes.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def adsr_envelope(duration, sample_rate, attack=0.02, decay=0.03,
                  sustain_level=0.7, release=0.1):
    """Generate an ADSR envelope."""
    total_samples = int(duration * sample_rate)
    attack_samples = int(attack * sample_rate)
    decay_samples = int(decay * sample_rate)
    release_samples = int(release * sample_rate)
    sustain_samples = total_samples - attack_samples - decay_samples - release_samples

    if sustain_samples < 0:
        sustain_samples = 0

    envelope = np.zeros(total_samples)
    idx = 0

    # Attack: ramp from 0 to 1
    if attack_samples > 0:
        envelope[idx:idx+attack_samples] = np.linspace(0, 1, attack_samples)
        idx += attack_samples

    # Decay: ramp from 1 to sustain_level
    if decay_samples > 0:
        envelope[idx:idx+decay_samples] = np.linspace(1, sustain_level, decay_samples)
        idx += decay_samples

    # Sustain: hold at sustain_level
    if sustain_samples > 0:
        envelope[idx:idx+sustain_samples] = sustain_level
        idx += sustain_samples

    # Release: ramp from sustain_level to 0
    if release_samples > 0:
        remaining = total_samples - idx
        release_actual = min(release_samples, remaining)
        envelope[idx:idx+release_actual] = np.linspace(sustain_level, 0, release_actual)

    return envelope


def synthesize_flute_note(frequency, duration=0.5, sample_rate=44100,
                           n_harmonics=8, blowing_pressure=0.7,
                           breath_noise=0.03):
    """
    Synthesize a bamboo flute note with harmonics, ADSR, and breath noise.
    """
    t = np.linspace(0, duration, int(sample_rate * duration), endpoint=False)

    # Harmonic amplitudes: bamboo flute characteristic
    # Fundamental strong, harmonics decay as 1/n with slight odd-harmonic emphasis
    signal = np.zeros_like(t)
    for n in range(1, n_harmonics + 1):
        amp = (1.0 / n) * blowing_pressure
        # Slight boost to odd harmonics (cylindrical bore characteristic)
        if n % 2 == 1:
            amp *= 1.15
        # Add slight random variation (each flute is unique)
        amp *= (0.9 + 0.2 * np.random.random())
        signal += amp * np.sin(2 * np.pi * n * frequency * t)

    # Add breath noise (filtered white noise)
    noise = np.random.randn(len(t)) * breath_noise
    # Simple low-pass filter on noise (moving average)
    kernel_size = 5
    noise = np.convolve(noise, np.ones(kernel_size)/kernel_size, mode='same')
    signal += noise

    # Apply ADSR envelope
    envelope = adsr_envelope(duration, sample_rate,
                              attack=0.025, decay=0.04,
                              sustain_level=0.7, release=0.12)
    signal *= envelope

    # Normalize
    if np.max(np.abs(signal)) > 0:
        signal = signal / np.max(np.abs(signal))

    return signal, envelope


# Synthesize notes across the scale
sr = 44100
fundamentals = [428, 472, 524, 558, 618, 683, 759, 856]
note_names = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C+']

fig, axes = plt.subplots(3, 2, figsize=(14, 11))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Bamboo Flute Synthesis: Harmonics + ADSR Envelope',
             color='white', fontsize=14, fontweight='bold')

# --- Plot 1: ADSR envelope shape ---
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
env = adsr_envelope(0.5, sr, attack=0.025, decay=0.04, sustain_level=0.7, release=0.12)
t_env = np.linspace(0, 0.5, len(env))
ax.plot(t_env * 1000, env, color='#f59e0b', linewidth=2.5)
ax.axvline(25, color='white', alpha=0.3, linestyle='--')
ax.axvline(65, color='white', alpha=0.3, linestyle='--')
ax.axvline(380, color='white', alpha=0.3, linestyle='--')
ax.text(12, 1.05, 'A', color='white', fontsize=10, ha='center')
ax.text(45, 1.05, 'D', color='white', fontsize=10, ha='center')
ax.text(220, 1.05, 'S', color='white', fontsize=10, ha='center')
ax.text(440, 1.05, 'R', color='white', fontsize=10, ha='center')
ax.set_title('ADSR envelope for bamboo flute', color='white', fontsize=11)
ax.set_xlabel('Time (ms)', color='gray')
ax.set_ylabel('Amplitude', color='gray')

# --- Plot 2: Harmonic recipe ---
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
ax2.tick_params(colors='gray')
n_harm = 8
harm_amps = []
for n in range(1, n_harm + 1):
    amp = 1.0 / n
    if n % 2 == 1:
        amp *= 1.15
    harm_amps.append(amp)

colors_harm = ['#22c55e' if n % 2 == 1 else '#3b82f6' for n in range(1, n_harm + 1)]
ax2.bar(range(1, n_harm + 1), harm_amps, color=colors_harm)
ax2.set_title('Harmonic recipe (green=odd, blue=even)', color='white', fontsize=11)
ax2.set_xlabel('Harmonic number', color='gray')
ax2.set_ylabel('Relative amplitude', color='gray')

# --- Plot 3: Synthesized waveform (full note) ---
signal_c, env_c = synthesize_flute_note(428, duration=0.5, sample_rate=sr)
t_full = np.linspace(0, 0.5, len(signal_c))

ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
ax3.tick_params(colors='gray')
ax3.plot(t_full * 1000, signal_c, color='#22c55e', linewidth=0.3, alpha=0.7)
ax3.plot(t_full * 1000, env_c * np.max(np.abs(signal_c)), color='#f59e0b',
         linewidth=2, label='Envelope')
ax3.set_title(f'Synthesized note: C ({428} Hz), full duration', color='white', fontsize=11)
ax3.set_xlabel('Time (ms)', color='gray')
ax3.set_ylabel('Amplitude', color='gray')
ax3.legend(fontsize=9)

# --- Plot 4: Waveform zoom (2 cycles) ---
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
ax4.tick_params(colors='gray')
samples_2cycles = int(2 * sr / 428)
# Start from sustain region (200ms in)
start_idx = int(0.2 * sr)
t_zoom = np.arange(samples_2cycles) / sr * 1000
ax4.plot(t_zoom, signal_c[start_idx:start_idx + samples_2cycles],
         color='#22c55e', linewidth=2)
ax4.set_title('Waveform detail (2 cycles from sustain region)', color='white', fontsize=11)
ax4.set_xlabel('Time (ms)', color='gray')
ax4.set_ylabel('Amplitude', color='gray')

# --- Plot 5: Multiple notes overlaid ---
ax5 = axes[2, 0]
ax5.set_facecolor('#111827')
ax5.tick_params(colors='gray')
colors_notes = plt.cm.viridis(np.linspace(0.2, 0.9, len(fundamentals)))
for i, (f, name) in enumerate(zip(fundamentals, note_names)):
    sig, _ = synthesize_flute_note(f, duration=0.004, sample_rate=sr, blowing_pressure=0.7)
    t_short = np.linspace(0, 4, len(sig))
    ax5.plot(t_short, sig + i * 2.2, color=colors_notes[i], linewidth=1.5)
    ax5.text(-0.3, i * 2.2, f'{name} ({f}Hz)', fontsize=8, color='white', va='center')

ax5.set_title('Waveform shapes for each note in the scale', color='white', fontsize=11)
ax5.set_xlabel('Time (ms)', color='gray')
ax5.set_yticks([])

# --- Plot 6: Effect of blowing pressure ---
ax6 = axes[2, 1]
ax6.set_facecolor('#111827')
ax6.tick_params(colors='gray')
pressures = [0.3, 0.5, 0.7, 0.9]
colors_p = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444']
for p, color in zip(pressures, colors_p):
    sig, _ = synthesize_flute_note(500, duration=0.5, sample_rate=sr, blowing_pressure=p)
    fft_vals = 2 * np.abs(np.fft.rfft(sig[int(0.1*sr):int(0.3*sr)])) / (0.2 * sr)
    fft_freqs = np.fft.rfftfreq(int(0.2 * sr), 1/sr)
    ax6.plot(fft_freqs, fft_vals, color=color, linewidth=1.5,
             label=f'Pressure={p}', alpha=0.8)

ax6.set_xlim(0, 5000)
ax6.set_title('Spectrum vs blowing pressure (stronger = more harmonics)',
              color='white', fontsize=11)
ax6.set_xlabel('Frequency (Hz)', color='gray')
ax6.set_ylabel('Magnitude', color='gray')
ax6.legend(fontsize=9)

plt.tight_layout()
plt.show()

print("=== Tone Synthesis Engine ===")
print()
print("ADSR parameters (bamboo flute model):")
print("  Attack:  25 ms (air column resonance build-up)")
print("  Decay:   40 ms (stabilization)")
print("  Sustain: 70% (steady blowing)")
print("  Release: 120 ms (resonance die-off)")
print()
print("Harmonic recipe (relative amplitudes):")
for n in range(1, n_harm + 1):
    amp = harm_amps[n-1]
    bar = '#' * int(amp * 30)
    odd_mark = ' (odd, boosted)' if n % 2 == 1 else ''
    print(f"  H{n}: {bar} {amp:.3f}{odd_mark}")
print()
print("Synthesized scale:")
for name, freq in zip(note_names, fundamentals):
    print(f"  {name}: {freq} Hz")`,
      challenge: 'Add vibrato to the synthesizer. Real flute players apply a slight periodic variation to the pitch (typically 5-7 Hz modulation rate, 10-30 cents depth). Implement this as frequency modulation: f(t) = f0 * (1 + depth * sin(2*pi*rate*t)). Compare the spectrum with and without vibrato.',
      successHint: 'The tone synthesizer transforms dry frequency calculations into audio that sounds recognizably like a bamboo flute. The ADSR envelope is the difference between a musical instrument and a test tone generator.',
    },
    {
      title: 'Fingering chart generator',
      concept: `A fingering chart maps every note in the musical scale to a specific combination of open and closed finger holes. For a six-hole bamboo flute, there are 2^6 = 64 possible fingerings, but only a subset produce musically useful notes. The job of the fingering chart generator is to find the fingering that produces a frequency closest to each target note in the desired scale.

The algorithm is straightforward: for each of the 64 possible fingerings, calculate the resulting fundamental frequency using the physics model. Then, for each target note frequency, find the fingering whose fundamental is closest. If the closest match is more than 50 cents away from the target, flag it as a poor match — the flute's hole positions may need adjustment.

In practice, bamboo flute makers solve the inverse problem: given a desired scale, where should the holes be placed? This is an optimization problem. The maker adjusts hole positions and diameters to minimize the total tuning error across all notes in the scale. Traditional makers do this by ear, iteratively reaming holes slightly larger until the pitch is right. Our simulator can do it computationally by searching the space of possible hole positions. This is where centuries of craft knowledge meets modern optimization.`,
      analogy: 'A fingering chart is like a codebook or lookup table. Each "code" (fingering pattern like 001101) maps to a specific "message" (musical note). The chart generator is the compiler that builds this codebook from the physics model. A well-designed flute has a clean codebook where every important note has a distinct, unambiguous fingering.',
      storyConnection: 'Each bamboo stalk in the story has its own "fingering chart" determined by its natural holes and joints. The wind learns which stalks can play which notes and composes melodies that use each stalk for the notes it produces best. Our fingering chart generator automates this same discovery process.',
      checkQuestion: 'A six-hole flute has 64 possible fingerings but you need only 7 notes for a major scale (plus the all-closed note). What should you do with the other 56 fingerings? Are they useless?',
      checkAnswer: 'Not useless. Some may produce useful chromatic notes (sharps/flats) for more complex melodies. Some create "fork fingerings" — non-standard patterns that produce notes unavailable through simple sequential opening. Some are duplicates (two fingerings producing similar frequencies). Professional flute players use many non-standard fingerings for trills, microtonal adjustments, and alternate tunings. The "extra" fingerings expand the instrument beyond a simple major scale.',
      codeIntro: 'Build a complete fingering chart: enumerate all 64 fingerings, calculate their frequencies, match them to target notes, and visualize the results.',
      code: `import numpy as np
import matplotlib.pyplot as plt

class BambooFlute:
    def __init__(self, tube_length=0.40, inner_diameter=0.018, temperature=25.0):
        self.tube_length = tube_length
        self.inner_radius = inner_diameter / 2
        self.speed_of_sound = 331.3 + 0.606 * temperature
        self.end_correction = 0.6133 * self.inner_radius
        self.hole_positions = []
        self.hole_diameters = []

    def add_hole(self, position, diameter=0.008):
        self.hole_positions.append(position)
        self.hole_diameters.append(diameter)

    def effective_length(self, fingering):
        L = self.tube_length
        for i, is_open in enumerate(fingering):
            if is_open and i < len(self.hole_positions):
                hole_pos = self.hole_positions[i]
                hole_d = self.hole_diameters[i]
                tube_d = self.inner_radius * 2
                correction_factor = min((hole_d / tube_d) ** 2, 1.0)
                L = hole_pos + (self.tube_length - hole_pos) * (1 - correction_factor)
                break
        return L + 2 * self.end_correction

    def fundamental_freq(self, fingering):
        return self.speed_of_sound / (2 * self.effective_length(fingering))


# Build the flute
flute = BambooFlute(tube_length=0.40, inner_diameter=0.018)
hole_positions = [0.175, 0.200, 0.225, 0.260, 0.290, 0.320]
hole_diameters = [0.008, 0.008, 0.008, 0.009, 0.009, 0.010]
for pos, diam in zip(hole_positions, hole_diameters):
    flute.add_hole(pos, diam)

# Enumerate ALL 64 fingerings
n_holes = 6
all_fingerings = []
for bits in range(2 ** n_holes):
    fingering = [(bits >> i) & 1 == 1 for i in range(n_holes)]
    freq = flute.fundamental_freq(fingering)
    pattern = ''.join(['O' if f else '-' for f in fingering])
    all_fingerings.append({
        'pattern': pattern,
        'fingering': fingering,
        'frequency': freq,
        'bits': bits,
    })

# Sort by frequency
all_fingerings.sort(key=lambda x: x['frequency'])

# Target scale: C major starting from the all-closed note
f_base = flute.fundamental_freq([False]*6)
# Equal temperament major scale intervals in semitones: 0, 2, 4, 5, 7, 9, 11, 12
scale_semitones = [0, 2, 4, 5, 7, 9, 11, 12]
scale_names = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C+']
target_freqs = [f_base * 2**(s/12) for s in scale_semitones]

# Find best fingering for each target note
best_fingerings = []
for target_f, name in zip(target_freqs, scale_names):
    best = min(all_fingerings,
               key=lambda x: abs(1200 * np.log2(x['frequency'] / target_f)))
    cents_off = 1200 * np.log2(best['frequency'] / target_f)
    best_fingerings.append({
        'note': name,
        'target_freq': target_f,
        'actual_freq': best['frequency'],
        'cents_off': cents_off,
        'pattern': best['pattern'],
        'fingering': best['fingering'],
    })

# --- Visualization ---
fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Bamboo Flute Fingering Chart Generator',
             color='white', fontsize=14, fontweight='bold')

# Plot 1: All 64 fingerings and their frequencies
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
freqs_all = [f['frequency'] for f in all_fingerings]
colors_all = ['#22c55e' if any(bf['pattern'] == f['pattern'] for bf in best_fingerings)
              else '#3b82f6' for f in all_fingerings]
ax.scatter(range(len(all_fingerings)), freqs_all, c=colors_all, s=15, alpha=0.8)

# Highlight the selected fingerings
for bf in best_fingerings:
    idx = next(i for i, f in enumerate(all_fingerings) if f['pattern'] == bf['pattern'])
    ax.annotate(bf['note'], (idx, bf['actual_freq']),
                fontsize=8, color='#f59e0b', fontweight='bold',
                xytext=(5, 8), textcoords='offset points')

ax.set_title('All 64 fingerings sorted by frequency', color='white', fontsize=11)
ax.set_xlabel('Fingering index (sorted)', color='gray')
ax.set_ylabel('Frequency (Hz)', color='gray')

# Plot 2: Fingering chart diagram
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
ax2.tick_params(colors='gray')
ax2.set_xlim(-0.5, 5.5)
ax2.set_ylim(-0.5, len(best_fingerings) - 0.5)

for row, bf in enumerate(best_fingerings):
    # Note name
    ax2.text(-0.4, row, f"{bf['note']} ({bf['actual_freq']:.0f}Hz)",
             fontsize=9, color='white', va='center', ha='left')

    # Draw holes
    for col, is_open in enumerate(bf['fingering']):
        circle = plt.Circle((col + 2, row), 0.15,
                             facecolor='#1f2937' if is_open else '#f59e0b',
                             edgecolor='white', linewidth=1.5)
        ax2.add_patch(circle)

    # Tuning accuracy
    color = '#22c55e' if abs(bf['cents_off']) < 10 else '#f59e0b' if abs(bf['cents_off']) < 25 else '#ef4444'
    ax2.text(8.2, row, f"{bf['cents_off']:+.0f}c", fontsize=8, color=color,
             va='center', ha='center', transform=ax2.transData)

# Column labels
for col in range(6):
    ax2.text(col + 2, len(best_fingerings) - 0.1, f'H{col+1}',
             fontsize=8, color='gray', ha='center', va='bottom')

ax2.set_title('Fingering chart (filled=closed, empty=open)', color='white', fontsize=11)
ax2.set_xticks([])
ax2.set_yticks([])

# Plot 3: Tuning accuracy
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
ax3.tick_params(colors='gray')

cents_values = [bf['cents_off'] for bf in best_fingerings]
colors_cents = ['#22c55e' if abs(c) < 10 else '#f59e0b' if abs(c) < 25 else '#ef4444'
                for c in cents_values]
ax3.bar(scale_names, cents_values, color=colors_cents)
ax3.axhline(0, color='white', linewidth=0.5)
ax3.axhline(10, color='#f59e0b', linewidth=0.5, linestyle='--', alpha=0.5)
ax3.axhline(-10, color='#f59e0b', linewidth=0.5, linestyle='--', alpha=0.5)
ax3.set_title('Tuning error (cents from equal temperament)', color='white', fontsize=11)
ax3.set_ylabel('Cents deviation', color='gray')
ax3.set_xlabel('Note', color='gray')

# Plot 4: Target vs actual frequencies
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
ax4.tick_params(colors='gray')
target_f = [bf['target_freq'] for bf in best_fingerings]
actual_f = [bf['actual_freq'] for bf in best_fingerings]

ax4.plot(scale_names, target_f, 'o--', color='#3b82f6', linewidth=2,
         markersize=8, label='Target (ET)')
ax4.plot(scale_names, actual_f, 's-', color='#22c55e', linewidth=2,
         markersize=8, label='Actual')
ax4.set_title('Target vs actual frequencies', color='white', fontsize=11)
ax4.set_ylabel('Frequency (Hz)', color='gray')
ax4.legend(fontsize=9)

plt.tight_layout()
plt.show()

print("=== Fingering Chart ===")
print(f"{'Note':<5} {'Pattern':<8} {'Target Hz':<10} {'Actual Hz':<10} {'Error':<8}")
print("-" * 45)
for bf in best_fingerings:
    error_str = f"{bf['cents_off']:+.1f}c"
    quality = 'OK' if abs(bf['cents_off']) < 10 else 'WARN' if abs(bf['cents_off']) < 25 else 'BAD'
    print(f"{bf['note']:<5} {bf['pattern']:<8} {bf['target_freq']:<10.1f} "
          f"{bf['actual_freq']:<10.1f} {error_str:<8} {quality}")

print()
print(f"Total fingerings: {len(all_fingerings)}")
unique_freqs = len(set(round(f['frequency'], 1) for f in all_fingerings))
print(f"Unique frequencies (within 0.1 Hz): {unique_freqs}")
print(f"Scale notes matched: {len(best_fingerings)}")
avg_error = np.mean([abs(bf['cents_off']) for bf in best_fingerings])
print(f"Average tuning error: {avg_error:.1f} cents")`,
      challenge: 'Implement a hole position optimizer. Given a target scale (e.g., C major pentatonic), use a numerical optimization method (even a simple grid search) to find the 6 hole positions that minimize the total tuning error across all notes. Compare the optimized positions to the hand-chosen ones.',
      successHint: 'The fingering chart connects the physics model to musical practice. Traditional flute makers carry this chart in their intuition; our simulator makes it explicit and quantitative.',
    },
    {
      title: 'Spectral visualization — analyzing the simulated flute',
      concept: `Now that we can synthesize flute notes, we need to verify that they sound correct by examining their **spectra**. Spectral visualization is the quality assurance step: it reveals whether the synthesizer is producing the right harmonics, whether the ADSR envelope is shaping the sound properly, and how the timbre varies across the flute's range.

A **spectrogram** (also called a time-frequency plot) shows how the frequency content of a signal evolves over time. The x-axis is time, the y-axis is frequency, and the color represents amplitude. For a well-synthesized flute note, the spectrogram should show: (1) horizontal bands at the harmonic frequencies, (2) the bands appearing during the attack phase, (3) the bands fading during the release phase, and (4) higher harmonics being weaker (lighter color) than the fundamental.

Comparing the spectra of our synthesized notes to published analyses of real bamboo flute recordings is how we would validate the model in a production setting. Common discrepancies include: harmonics that are too evenly spaced (real tubes have slight inharmonicity), overtones that are too strong or too weak (the harmonic recipe needs calibration), and missing noise components (real flutes have significant breath noise that adds "life" to the sound). Each discrepancy points to a specific improvement in the physics model.`,
      analogy: 'A spectrogram is like a musical score written by the sound itself. A traditional score tells a musician what to play. A spectrogram tells you what the instrument actually produced. When the spectrogram matches what you expected from the physics model, the simulator is correct. When it does not, the spectrogram shows you exactly where the model fails.',
      storyConnection: 'If you could see the wind dancing with the bamboo, a spectrogram is what it would look like. Each horizontal stripe is a harmonic — a dance step. The pattern of stripes is the choreography. Different bamboo stalks produce different stripe patterns, and the spectrogram reveals the unique fingerprint of each stalk.',
      checkQuestion: 'A spectrogram of a flute note shows the fundamental at 500 Hz and harmonics at 1000, 1500, and 2000 Hz. But there is also a faint band at 1250 Hz that does not fit the harmonic series. What could cause this?',
      checkAnswer: 'The 1250 Hz component is not a harmonic of 500 Hz (it would need to be 2.5 x 500, and harmonics are integer multiples). Possible causes: (1) a combination tone from nonlinear interaction between harmonics, (2) a resonance of the tube body itself (a wall vibration mode), (3) ambient noise from the recording environment, or (4) aliasing from undersampling if the signal was digitized. In a simulation, it likely indicates a bug in the synthesis code.',
      codeIntro: 'Generate a complete spectral analysis of the simulated bamboo flute: individual note spectra, a spectrogram of a melodic phrase, and a comparison across all notes in the scale.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def adsr_envelope(duration, sr, attack=0.025, decay=0.04, sustain_level=0.7, release=0.12):
    total = int(duration * sr)
    a_s = int(attack * sr)
    d_s = int(decay * sr)
    r_s = int(release * sr)
    s_s = max(total - a_s - d_s - r_s, 0)
    env = np.zeros(total)
    idx = 0
    if a_s > 0: env[idx:idx+a_s] = np.linspace(0, 1, a_s); idx += a_s
    if d_s > 0: env[idx:idx+d_s] = np.linspace(1, sustain_level, d_s); idx += d_s
    if s_s > 0: env[idx:idx+s_s] = sustain_level; idx += s_s
    remaining = total - idx
    if remaining > 0: env[idx:idx+remaining] = np.linspace(sustain_level, 0, remaining)
    return env

def synth_note(freq, duration=0.4, sr=44100, n_harm=10, pressure=0.7):
    t = np.linspace(0, duration, int(sr * duration), endpoint=False)
    sig = np.zeros_like(t)
    for n in range(1, n_harm + 1):
        amp = (1.0 / n) * pressure
        if n % 2 == 1: amp *= 1.15
        sig += amp * np.sin(2 * np.pi * n * freq * t)
    sig += np.random.randn(len(t)) * 0.02
    sig *= adsr_envelope(duration, sr)
    if np.max(np.abs(sig)) > 0:
        sig /= np.max(np.abs(sig))
    return sig

sr = 44100
scale_freqs = [428, 472, 524, 558, 618, 683, 759, 856]
scale_names = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C+']

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Spectral Analysis of the Bamboo Flute Simulator',
             color='white', fontsize=14, fontweight='bold')

# --- Plot 1: Spectrogram of a melodic phrase ---
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

# Synthesize a simple melody: C D E F G A B C+
melody = np.array([])
note_duration = 0.3
for freq in scale_freqs:
    note = synth_note(freq, duration=note_duration, sr=sr)
    melody = np.concatenate([melody, note])

# Compute spectrogram
nperseg = 2048
noverlap = 1800
hop = nperseg - noverlap
n_frames = (len(melody) - nperseg) // hop + 1
spec = np.zeros((nperseg // 2 + 1, n_frames))
window = np.hanning(nperseg)

for i in range(n_frames):
    start = i * hop
    frame = melody[start:start + nperseg] * window
    spec[:, i] = np.abs(np.fft.rfft(frame))

spec_db = 20 * np.log10(spec + 1e-10)
spec_db = np.clip(spec_db, spec_db.max() - 60, spec_db.max())

freqs_spec = np.fft.rfftfreq(nperseg, 1/sr)
times_spec = np.arange(n_frames) * hop / sr

ax.pcolormesh(times_spec, freqs_spec, spec_db, cmap='inferno', shading='auto')
ax.set_ylim(0, 5000)
ax.set_title('Spectrogram: ascending C major scale', color='white', fontsize=11)
ax.set_xlabel('Time (s)', color='gray')
ax.set_ylabel('Frequency (Hz)', color='gray')

# Mark note boundaries
for i in range(len(scale_freqs)):
    t_start = i * note_duration
    ax.axvline(t_start, color='white', alpha=0.3, linewidth=0.5)
    ax.text(t_start + note_duration/2, 4700, scale_names[i],
            fontsize=8, color='white', ha='center')

# --- Plot 2: Individual note spectra overlaid ---
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
ax2.tick_params(colors='gray')

colors_scale = plt.cm.viridis(np.linspace(0.2, 0.9, len(scale_freqs)))
for freq, name, color in zip(scale_freqs, scale_names, colors_scale):
    note = synth_note(freq, duration=0.3, sr=sr)
    # Take FFT from the sustain region
    start_s = int(0.08 * sr)
    end_s = int(0.25 * sr)
    segment = note[start_s:end_s]
    N = len(segment)
    fft_mag = 2 * np.abs(np.fft.rfft(segment * np.hanning(N))) / N
    fft_freqs = np.fft.rfftfreq(N, 1/sr)
    ax2.plot(fft_freqs, fft_mag, color=color, linewidth=1, alpha=0.8, label=name)

ax2.set_xlim(0, 5000)
ax2.set_title('Spectra of all notes (sustain region)', color='white', fontsize=11)
ax2.set_xlabel('Frequency (Hz)', color='gray')
ax2.set_ylabel('Magnitude', color='gray')
ax2.legend(fontsize=8, ncol=4, loc='upper right')

# --- Plot 3: Harmonic content comparison across notes ---
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
ax3.tick_params(colors='gray')

harmonic_strengths = np.zeros((len(scale_freqs), 6))  # first 6 harmonics
for i, freq in enumerate(scale_freqs):
    note = synth_note(freq, duration=0.3, sr=sr)
    start_s = int(0.08 * sr)
    end_s = int(0.25 * sr)
    segment = note[start_s:end_s]
    N = len(segment)
    fft_mag = np.abs(np.fft.rfft(segment * np.hanning(N)))
    fft_freqs = np.fft.rfftfreq(N, 1/sr)

    for h in range(6):
        target = (h + 1) * freq
        idx = np.argmin(np.abs(fft_freqs - target))
        harmonic_strengths[i, h] = fft_mag[idx]

    # Normalize per note
    if harmonic_strengths[i, 0] > 0:
        harmonic_strengths[i] /= harmonic_strengths[i, 0]

im = ax3.imshow(harmonic_strengths.T, aspect='auto', cmap='YlOrRd',
                origin='lower', interpolation='nearest')
ax3.set_xticks(range(len(scale_names)))
ax3.set_xticklabels(scale_names, color='gray')
ax3.set_yticks(range(6))
ax3.set_yticklabels([f'H{i+1}' for i in range(6)], color='gray')
ax3.set_title('Harmonic strength (normalized) across notes', color='white', fontsize=11)
ax3.set_xlabel('Note', color='gray')
ax3.set_ylabel('Harmonic', color='gray')
plt.colorbar(im, ax=ax3, label='Relative amplitude')

# --- Plot 4: Envelope verification via short-time energy ---
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
ax4.tick_params(colors='gray')

note_c = synth_note(428, duration=0.5, sr=sr)
# Short-time energy (frame-by-frame RMS)
frame_len = 512
hop_len = 128
rms = []
times_rms = []
for j in range(0, len(note_c) - frame_len, hop_len):
    frame = note_c[j:j + frame_len]
    rms.append(np.sqrt(np.mean(frame**2)))
    times_rms.append(j / sr)

ax4.plot(np.array(times_rms) * 1000, rms, color='#f59e0b', linewidth=2, label='RMS energy')
env = adsr_envelope(0.5, sr)
t_env = np.linspace(0, 500, len(env))
ax4.plot(t_env, env * max(rms), color='#22c55e', linewidth=1.5,
         linestyle='--', alpha=0.7, label='ADSR target')
ax4.set_title('Envelope verification: RMS energy vs ADSR target', color='white', fontsize=11)
ax4.set_xlabel('Time (ms)', color='gray')
ax4.set_ylabel('RMS amplitude', color='gray')
ax4.legend(fontsize=9)

plt.tight_layout()
plt.show()

print("=== Spectral Analysis Results ===")
print()
print("Spectrogram: horizontal bands confirm correct harmonic generation")
print("Each note shows fundamental + overtones at integer multiples")
print()
print("Harmonic content per note (relative to fundamental):")
print(f"{'Note':<5}", end='')
for h in range(1, 7):
    print(f"{'H'+str(h):<8}", end='')
print()
for i, name in enumerate(scale_names):
    print(f"{name:<5}", end='')
    for h in range(6):
        print(f"{harmonic_strengths[i, h]:.3f}   ", end='')
    print()
print()
print("ADSR verification: RMS energy curve closely follows the target envelope")`,
      challenge: 'Add inharmonicity to the model. Real bamboo tubes produce harmonics that are slightly shifted from perfect integer multiples due to dispersion (the speed of sound varies slightly with frequency in a tube). Model this as f_n = n * f1 * (1 + B * n^2) where B is a small inharmonicity constant. How does this affect the spectrogram?',
      successHint: 'Spectral visualization closes the feedback loop between model and output. If the spectrogram looks wrong, you know exactly which part of the physics model to fix.',
    },
    {
      title: 'Portfolio — the complete bamboo flute simulator',
      concept: `This final mini-lesson integrates everything into a single, polished simulator. The complete pipeline runs as follows: (1) define the flute geometry (tube length, diameter, hole positions), (2) compute resonant frequencies for every fingering using the physics model, (3) build a fingering chart mapping notes to hole configurations, (4) synthesize a melody by concatenating individual notes with ADSR envelopes, and (5) visualize the output with waveforms, spectra, and spectrograms.

The result is a documented, end-to-end instrument simulator built entirely from physics first principles. No audio samples were used. No recordings were needed. Every sound produced by this simulator is generated from equations: the speed of sound, the resonance conditions of cylindrical tubes, the harmonic series, and the ADSR envelope model. This is the power of computational physics — you can build instruments that have never existed, test designs before carving bamboo, and explore the space of possible flutes far faster than any craftsman could.

The simulator also serves as a teaching tool. Every parameter has a physical meaning. Changing the tube length changes the pitch. Changing the hole positions changes the scale. Changing the blowing pressure changes the timbre. Students can experiment with these relationships interactively, building intuition about acoustics that would take years to develop through physical experimentation alone.`,
      analogy: 'The complete simulator is like a virtual workshop for a bamboo flute maker. Instead of carving bamboo and testing by ear, you type dimensions and hear results immediately. You can "carve" a thousand flutes in the time it takes to make one physical prototype. The physics is the same; only the medium has changed from bamboo to code.',
      storyConnection: 'You have built what the bamboo and wind created together in the story: a system where physical structure (tube geometry) meets energy (blowing pressure) to produce music (synthesized waveform). The simulator is your digital bamboo grove. Every run is the wind learning a new dance with a new configuration of stalks.',
      checkQuestion: 'If you wanted to extend this simulator to model a real bamboo flute from Assam as accurately as possible, what additional physical phenomena would you need to model beyond what we have implemented?',
      checkAnswer: 'Key additions: (1) wall vibrations — bamboo walls are not rigid, they absorb and radiate energy, affecting timbre. (2) Turbulent jet physics — the air stream hitting the embouchure edge is chaotic, creating broadband noise that varies with blowing angle and pressure. (3) Tone hole interactions — multiple open holes affect each other through mutual radiation impedance. (4) Bore irregularities — real bamboo tapers and has internal nodes. (5) Temperature gradients — the player warm breath creates a temperature gradient along the tube, altering the speed of sound non-uniformly. (6) Room acoustics — reverberation affects perceived timbre.',
      codeIntro: 'Run the complete pipeline: define a flute, generate a fingering chart, synthesize a melody, and produce a comprehensive visualization of the full simulator output.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# =====================================================
# COMPLETE BAMBOO FLUTE SIMULATOR
# From "The Bamboo That Taught the Wind to Dance"
# =====================================================

class BambooFluteSimulator:
    """Full bamboo flute simulator: geometry -> physics -> synthesis -> visualization."""

    def __init__(self, tube_length=0.40, inner_diameter=0.018, temperature=25.0):
        self.tube_length = tube_length
        self.inner_radius = inner_diameter / 2
        self.temperature = temperature
        self.v_sound = 331.3 + 0.606 * temperature
        self.end_correction = 0.6133 * self.inner_radius
        self.sr = 44100
        self.holes = []  # list of (position, diameter)

    def add_hole(self, position, diameter=0.008):
        self.holes.append((position, diameter))

    def effective_length(self, fingering):
        L = self.tube_length
        for i, is_open in enumerate(fingering):
            if is_open and i < len(self.holes):
                pos, d = self.holes[i]
                cf = min((d / (2 * self.inner_radius)) ** 2, 1.0)
                L = pos + (self.tube_length - pos) * (1 - cf)
                break
        return L + 2 * self.end_correction

    def freq(self, fingering):
        return self.v_sound / (2 * self.effective_length(fingering))

    def fingering_chart(self, target_scale_semitones, note_names):
        f_base = self.freq([False] * len(self.holes))
        targets = [(f_base * 2 ** (s / 12), name) for s, name in zip(target_scale_semitones, note_names)]

        # All possible fingerings
        n = len(self.holes)
        all_fing = []
        for bits in range(2 ** n):
            fing = [(bits >> i) & 1 == 1 for i in range(n)]
            all_fing.append((fing, self.freq(fing)))

        chart = []
        for target_f, name in targets:
            best_fing, best_freq = min(all_fing, key=lambda x: abs(1200 * np.log2(x[1] / target_f)))
            cents = 1200 * np.log2(best_freq / target_f)
            chart.append({'note': name, 'target': target_f, 'actual': best_freq,
                          'cents': cents, 'fingering': best_fing})
        return chart

    def adsr(self, duration, attack=0.02, decay=0.03, sus=0.7, release=0.1):
        total = int(duration * self.sr)
        a, d, r = int(attack * self.sr), int(decay * self.sr), int(release * self.sr)
        s = max(total - a - d - r, 0)
        env = np.zeros(total)
        idx = 0
        if a > 0: env[idx:idx+a] = np.linspace(0, 1, a); idx += a
        if d > 0: env[idx:idx+d] = np.linspace(1, sus, d); idx += d
        if s > 0: env[idx:idx+s] = sus; idx += s
        rem = total - idx
        if rem > 0: env[idx:idx+rem] = np.linspace(sus, 0, rem)
        return env

    def synthesize(self, frequency, duration=0.3, pressure=0.7, n_harm=10):
        t = np.linspace(0, duration, int(self.sr * duration), endpoint=False)
        sig = np.zeros_like(t)
        for n in range(1, n_harm + 1):
            amp = (1.0 / n) * pressure * (1.15 if n % 2 == 1 else 1.0)
            sig += amp * np.sin(2 * np.pi * n * frequency * t)
        sig += np.random.randn(len(t)) * 0.02
        sig *= self.adsr(duration)
        mx = np.max(np.abs(sig))
        return sig / mx if mx > 0 else sig

    def play_melody(self, chart, note_duration=0.3):
        melody = np.array([])
        for entry in chart:
            note = self.synthesize(entry['actual'], duration=note_duration)
            melody = np.concatenate([melody, note])
        return melody


# === BUILD THE FLUTE ===
flute = BambooFluteSimulator(tube_length=0.40, inner_diameter=0.018, temperature=25)
for pos, d in zip([0.175, 0.200, 0.225, 0.260, 0.290, 0.320],
                  [0.008, 0.008, 0.008, 0.009, 0.009, 0.010]):
    flute.add_hole(pos, d)

# === GENERATE FINGERING CHART ===
scale = [0, 2, 4, 5, 7, 9, 11, 12]
names = ['Sa', 'Re', 'Ga', 'Ma', 'Pa', 'Dha', 'Ni', "Sa'"]
chart = flute.fingering_chart(scale, names)

# === SYNTHESIZE MELODY ===
# Ascending scale then descending: Sa Re Ga Ma Pa Dha Ni Sa' Ni Dha Pa Ma Ga Re Sa
melody_chart = chart + list(reversed(chart[:-1]))
melody = flute.play_melody(melody_chart, note_duration=0.25)
sr = flute.sr

# === COMPREHENSIVE VISUALIZATION ===
fig = plt.figure(figsize=(16, 14))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Bamboo Flute Simulator — Complete Output',
             color='white', fontsize=16, fontweight='bold', y=0.98)

# Layout: 3 rows, custom widths
gs = fig.add_gridspec(3, 3, hspace=0.35, wspace=0.3)

# --- 1. Spectrogram of full melody ---
ax1 = fig.add_subplot(gs[0, :])
ax1.set_facecolor('#111827')
ax1.tick_params(colors='gray')

nperseg = 2048
hop = 256
n_frames = (len(melody) - nperseg) // hop + 1
spec = np.zeros((nperseg // 2 + 1, n_frames))
window = np.hanning(nperseg)
for i in range(n_frames):
    start = i * hop
    frame = melody[start:start + nperseg] * window
    spec[:, i] = np.abs(np.fft.rfft(frame))

spec_db = 20 * np.log10(spec + 1e-10)
spec_db = np.clip(spec_db, spec_db.max() - 50, spec_db.max())
freqs_ax = np.fft.rfftfreq(nperseg, 1/sr)
times_ax = np.arange(n_frames) * hop / sr

ax1.pcolormesh(times_ax, freqs_ax, spec_db, cmap='magma', shading='auto')
ax1.set_ylim(0, 5000)
ax1.set_title('Spectrogram: ascending & descending scale (Indian sargam notation)',
              color='white', fontsize=12)
ax1.set_xlabel('Time (s)', color='gray')
ax1.set_ylabel('Frequency (Hz)', color='gray')

# Note labels
note_dur = 0.25
for i, entry in enumerate(melody_chart):
    t_mid = i * note_dur + note_dur / 2
    ax1.text(t_mid, 4700, entry['note'], fontsize=7, color='white',
             ha='center', va='center')

# --- 2. Flute diagram ---
ax2 = fig.add_subplot(gs[1, 0])
ax2.set_facecolor('#111827')
ax2.tick_params(colors='gray')

# Tube
ax2.add_patch(plt.Rectangle((0, 0.35), 40, 0.3,
              facecolor='#92400e', edgecolor='#d97706', linewidth=2, zorder=1))
ax2.text(20, 0.1, 'Bamboo tube: 40 cm x 18 mm', ha='center',
         fontsize=9, color='gray')

for i, (pos, d) in enumerate(flute.holes):
    circle = plt.Circle((pos * 100, 0.5), d * 100 * 3,
                         facecolor='#1f2937', edgecolor='white', linewidth=1.5, zorder=2)
    ax2.add_patch(circle)
    ax2.text(pos * 100, 0.85, f'{pos*100:.1f}', ha='center', fontsize=7, color='gray')

ax2.set_xlim(-2, 42)
ax2.set_ylim(-0.1, 1.1)
ax2.set_title('Physical flute layout', color='white', fontsize=11)
ax2.set_xticks([])
ax2.set_yticks([])

# --- 3. Fingering chart ---
ax3 = fig.add_subplot(gs[1, 1])
ax3.set_facecolor('#111827')
ax3.tick_params(colors='gray')

for row, entry in enumerate(chart):
    ax3.text(0, row, f"{entry['note']}", fontsize=9, color='white', va='center')
    ax3.text(1.5, row, f"{entry['actual']:.0f}Hz", fontsize=8, color='gray', va='center')
    for col, is_open in enumerate(entry['fingering']):
        c = plt.Circle((3 + col * 0.6, row), 0.18,
                        facecolor='#1f2937' if is_open else '#f59e0b',
                        edgecolor='white', linewidth=1)
        ax3.add_patch(c)
    color = '#22c55e' if abs(entry['cents']) < 10 else '#f59e0b'
    ax3.text(7, row, f"{entry['cents']:+.0f}c", fontsize=8, color=color, va='center')

ax3.set_xlim(-0.5, 8)
ax3.set_ylim(-0.5, len(chart) - 0.3)
ax3.set_title('Fingering chart', color='white', fontsize=11)
ax3.set_xticks([])
ax3.set_yticks([])

# --- 4. Tuning accuracy ---
ax4 = fig.add_subplot(gs[1, 2])
ax4.set_facecolor('#111827')
ax4.tick_params(colors='gray')

cents_vals = [e['cents'] for e in chart]
colors_c = ['#22c55e' if abs(c) < 10 else '#f59e0b' if abs(c) < 25 else '#ef4444'
            for c in cents_vals]
ax4.barh([e['note'] for e in chart], cents_vals, color=colors_c)
ax4.axvline(0, color='white', linewidth=0.5)
ax4.set_title('Tuning error (cents)', color='white', fontsize=11)
ax4.set_xlabel('Cents', color='gray')

# --- 5. Waveform of full melody ---
ax5 = fig.add_subplot(gs[2, :2])
ax5.set_facecolor('#111827')
ax5.tick_params(colors='gray')
t_melody = np.arange(len(melody)) / sr
ax5.plot(t_melody, melody, color='#22c55e', linewidth=0.2, alpha=0.7)
ax5.set_title('Full melody waveform', color='white', fontsize=11)
ax5.set_xlabel('Time (s)', color='gray')
ax5.set_ylabel('Amplitude', color='gray')

# --- 6. Scale frequency profile ---
ax6 = fig.add_subplot(gs[2, 2])
ax6.set_facecolor('#111827')
ax6.tick_params(colors='gray')
freqs_plot = [e['actual'] for e in chart]
ax6.plot([e['note'] for e in chart], freqs_plot, 'o-', color='#3b82f6',
         linewidth=2, markersize=8)
for e in chart:
    ax6.annotate(f'{e["actual"]:.0f}', (e['note'], e['actual']),
                textcoords='offset points', xytext=(0, 10),
                fontsize=8, color='white', ha='center')
ax6.set_title('Scale frequencies', color='white', fontsize=11)
ax6.set_ylabel('Frequency (Hz)', color='gray')

plt.tight_layout()
plt.show()

print("=" * 60)
print("  BAMBOO FLUTE SIMULATOR — COMPLETE OUTPUT")
print("  Story: The Bamboo That Taught the Wind to Dance")
print("=" * 60)
print()
print(f"Flute: {flute.tube_length*100:.0f} cm tube, {flute.inner_radius*2000:.0f} mm bore")
print(f"Temperature: {flute.temperature} C | Speed of sound: {flute.v_sound:.1f} m/s")
print(f"Sample rate: {sr} Hz | Harmonics: 10 | Pressure: 0.7")
print()
print("Fingering chart (Indian sargam):")
print(f"{'Note':<5} {'Freq Hz':<9} {'Fingering':<10} {'Error'}")
for e in chart:
    pat = ''.join(['O' if f else '-' for f in e['fingering']])
    print(f"{e['note']:<5} {e['actual']:<9.1f} {pat:<10} {e['cents']:+.1f} cents")
print()
print(f"Melody: {len(melody_chart)} notes, {len(melody)/sr:.1f} seconds")
print(f"Total samples: {len(melody):,}")
print()
print("Pipeline summary:")
print("  1. Geometry  -> defined tube + 6 holes")
print("  2. Physics   -> resonant frequencies for 64 fingerings")
print("  3. Chart     -> mapped 8 notes to best fingerings")
print("  4. Synthesis -> ADSR envelopes + harmonic recipe")
print("  5. Spectrum  -> verified harmonic content")
print()
print("This simulator was built entirely from physics equations.")
print("No audio samples. No recordings. Pure mathematics -> music.")`,
      challenge: 'Extend the simulator to play a real Assamese folk melody. Research the note sequence for a traditional Bihu song or a Zikir composition, convert it to sargam notation, and synthesize it with your flute simulator. Add dynamics (varying blowing pressure per note) and slight pitch bends between notes for a more natural performance.',
      successHint: 'You have built a complete digital instrument from first principles. The physics of resonance, harmonics, impedance, and digital signal processing — all working together to turn bamboo tube dimensions into music. This is computational acoustics.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Capstone — Build a Bamboo Flute Simulator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (acoustics & signal processing)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project builds a complete bamboo flute simulator using Python with numpy and matplotlib. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
