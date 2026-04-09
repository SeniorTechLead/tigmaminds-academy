import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function TigerWhiskerLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Neural signal transduction — from touch to electricity',
      concept: `When a tiger's whisker bends, mechanical force must be converted into an electrical signal the brain can process. This conversion is called **signal transduction**.

The process in a whisker follicle:
1. **Mechanical stimulus**: whisker bends, deforming the follicle tissue
2. **Ion channel opening**: mechanosensitive ion channels (Piezo2 proteins) in the nerve endings physically stretch open
3. **Ion influx**: positively charged ions (Na+, Ca2+) rush into the nerve cell
4. **Receptor potential**: the influx creates a local voltage change (graded potential)
5. **Action potential generation**: if the voltage exceeds threshold (~-55mV), an all-or-nothing electrical spike fires
6. **Signal propagation**: the spike travels along the nerve axon at 30-120 m/s to the brainstem

The key molecule is **Piezo2** — a protein discovered in 2010 (Nobel Prize 2021) that literally changes shape when stretched, opening a pore that lets ions flow through. It is a molecular switch that converts force into electricity.`,
      analogy: 'Piezo2 is like a pressure-sensitive doorbell. When you push it (mechanical force), an electrical circuit closes (ion channel opens), and a signal (action potential) travels down the wire (axon) to ring the bell (activate the brain). No push, no ring — but once pushed past the threshold, the ring is always the same volume.',
      storyConnection: 'Every night when the girl approached the tiger, air currents deflected the tiger\'s whiskers by fractions of a millimetre. This bent Piezo2 channels in the follicle, triggering action potentials that raced to the brain at highway speed. The tiger knew she was coming before her first footstep landed.',
      checkQuestion: 'Action potentials are "all-or-nothing" — they always have the same voltage. So how does the brain know the difference between a light touch and a hard press?',
      checkAnswer: 'The brain uses frequency coding. A light touch generates a few action potentials per second. A hard press generates hundreds per second. The signal strength is encoded in the firing rate, not the voltage of individual spikes. More force = more spikes per second = brain interprets stronger stimulus.',
      codeIntro: 'Model an action potential and show how stimulus strength maps to firing rate.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Hodgkin-Huxley simplified action potential shape
def action_potential(t, t_start):
    """Generate a single action potential waveform"""
    t_rel = t - t_start
    # Resting potential: -70mV, peak: +30mV
    ap = np.where(t_rel < 0, -70,
         np.where(t_rel < 0.5, -70 + 100 * (t_rel / 0.5),  # depolarisation
         np.where(t_rel < 1.0, 30 - 110 * ((t_rel - 0.5) / 0.5),  # repolarisation
         np.where(t_rel < 2.0, -80 + 10 * ((t_rel - 1.0) / 1.0),  # hyperpolarisation
         -70))))
    return ap

fig, axes = plt.subplots(3, 1, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')

t = np.linspace(0, 50, 2000)  # 50ms

# Three stimulus intensities
intensities = [
    ('Light touch', 3, '#22c55e'),
    ('Moderate press', 8, '#f59e0b'),
    ('Hard press', 20, '#ef4444'),
]

for ax, (label, n_spikes, color) in zip(axes, intensities):
    ax.set_facecolor('#111827')

    # Generate spike train
    spike_times = np.linspace(2, 45, n_spikes)
    voltage = np.full_like(t, -70.0)
    for st in spike_times:
        ap = action_potential(t, st)
        mask = (t >= st) & (t < st + 2.5)
        voltage[mask] = ap[mask]

    ax.plot(t, voltage, color=color, linewidth=1.2)
    ax.axhline(-55, color='white', linestyle=':', alpha=0.3, linewidth=0.8)
    ax.text(48, -53, 'threshold', color='white', alpha=0.4, fontsize=7, ha='right')
    ax.set_ylabel('mV', color='white', fontsize=9)
    ax.set_ylim(-90, 45)
    ax.set_title(f'{label}: {n_spikes} spikes / 50ms = {n_spikes*20} Hz', color=color, fontsize=10)
    ax.tick_params(colors='gray')

axes[-1].set_xlabel('Time (ms)', color='white')
plt.suptitle('Frequency Coding: Stimulus Strength → Firing Rate', color='white', fontsize=13, y=1.01)
plt.tight_layout()
plt.show()

print("Signal transduction summary:")
print("  Whisker bends → Piezo2 channels open → ions flow in")
print("  → receptor potential → action potential (if above threshold)")
print()
print("Frequency coding:")
print(f"  Light touch:    ~{3*20} Hz ({3} spikes/50ms)")
print(f"  Moderate press: ~{8*20} Hz ({8} spikes/50ms)")
print(f"  Hard press:     ~{20*20} Hz ({20} spikes/50ms)")
print()
print("Same spike shape every time. Only the RATE changes.")`,
      challenge: 'Add a "refractory period" of 1.5ms where no spike can fire. What is the maximum possible firing rate? (Hint: this limits the maximum frequency the nervous system can encode.)',
      successHint: 'The all-or-nothing action potential is one of the most elegant designs in biology. It provides noise-immune digital-like signalling over long distances — the same principle as fibre optic cables, evolved billions of years earlier.',
    },
    {
      title: 'Somatosensory cortex — where touch reaches consciousness',
      concept: `Action potentials from whiskers travel through three relay stations before reaching the cortex:

**Pathway: Whisker → Brain**
1. **Trigeminal nerve**: axons from whisker follicles converge into the trigeminal nerve (cranial nerve V)
2. **Brainstem nuclei**: first processing station — each whisker's signals are sorted into separate bundles called **barrelettes**
3. **Thalamus (VPM)**: second relay — signals are refined in **barreloids**
4. **Somatosensory cortex (S1)**: final destination — signals arrive in **barrels**, where conscious perception occurs

At each stage, the whisker map is preserved but refined:
- Barrelettes (brainstem): raw signal sorting
- Barreloids (thalamus): noise filtering, gain control
- Barrels (cortex): feature extraction, conscious perception

The cortex doesn't just register "whisker touched." It extracts:
- Which whisker (spatial identity)
- How hard (force magnitude)
- What direction (deflection angle)
- What texture (vibration pattern)
- How fast (velocity of contact)`,
      analogy: 'The whisker-to-cortex pathway is like a package delivery system. The whisker is the sender, the trigeminal nerve is the highway, the brainstem is the regional sorting centre, the thalamus is the local post office (checking addresses, filtering junk), and the cortex is the final recipient who opens and reads the package.',
      storyConnection: 'The tiger in the story made a decision to trust the girl — that decision required cortical processing. Raw whisker data (she is 3 metres away, moving slowly, no threatening odour) was integrated in the cortex with memory (she has come before, she brought food) to produce a complex judgment: safe to approach.',
      checkQuestion: 'People with damage to the somatosensory cortex can still reflexively pull their hand from a hot stove, but they cannot describe what they touched. Why?',
      checkAnswer: 'The withdrawal reflex is handled by the spinal cord — it never reaches the cortex. The signal takes a shortcut (reflex arc) for speed. But conscious perception — knowing what you touched, how it felt — requires cortical processing. Damage to S1 eliminates the "knowing" while preserving the "reacting."',
      codeIntro: 'Model the whisker-to-cortex pathway showing signal transformation at each stage.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate signal transformation through the pathway
t = np.linspace(0, 100, 1000)  # 100ms

# Stage 1: Raw whisker signal (noisy, high frequency)
raw_signal = np.sin(2 * np.pi * 20 * t/1000) * 0.5
raw_signal += np.random.normal(0, 0.3, len(t))
raw_signal += np.where((t > 20) & (t < 60), 0.8, 0)  # stimulus

# Stage 2: Brainstem (some noise filtered)
brainstem = np.convolve(raw_signal, np.ones(20)/20, mode='same')
brainstem += np.random.normal(0, 0.1, len(t))

# Stage 3: Thalamus (gain control, sharper)
thalamus = np.clip(brainstem * 1.5, -0.5, 1.5)
thalamus = np.convolve(thalamus, np.ones(10)/10, mode='same')

# Stage 4: Cortex (clean, feature-extracted)
cortex = np.where(thalamus > 0.3, thalamus * 1.2, 0)
cortex = np.convolve(cortex, np.ones(15)/15, mode='same')

fig, axes = plt.subplots(4, 1, figsize=(12, 8), sharex=True)
fig.patch.set_facecolor('#1f2937')

stages = [
    ('Whisker follicle (raw)', raw_signal, '#ef4444'),
    ('Brainstem barrelette (filtered)', brainstem, '#f59e0b'),
    ('Thalamus barreloid (gain control)', thalamus, '#3b82f6'),
    ('Cortex barrel (feature extraction)', cortex, '#22c55e'),
]

for ax, (label, signal, color) in zip(axes, stages):
    ax.set_facecolor('#111827')
    ax.plot(t, signal, color=color, linewidth=1)
    ax.fill_between(t, signal, alpha=0.15, color=color)
    ax.set_ylabel(label, color='white', fontsize=8, rotation=0, labelpad=120, va='center', ha='left')
    ax.tick_params(colors='gray')
    ax.set_yticks([])

    # Mark stimulus window
    ax.axvspan(20, 60, alpha=0.05, color='white')

axes[0].set_title('Signal Transformation: Whisker → Cortex', color='white', fontsize=13)
axes[-1].set_xlabel('Time (ms)', color='white')
axes[0].text(40, max(raw_signal)*0.8, 'stimulus', ha='center', color='white', alpha=0.5, fontsize=9)

plt.tight_layout()
plt.show()

print("At each relay station, the signal gets cleaner:")
print(f"  Whisker: raw, noisy (SNR ~1)")
print(f"  Brainstem: smoothed, sorted (SNR ~3)")
print(f"  Thalamus: gain-adjusted, sharpened (SNR ~8)")
print(f"  Cortex: clean feature signal (SNR ~15)")
print()
print("The brain doesn't just pass signals along — it refines them.")
print("Each stage extracts more meaning from the raw data.")`,
      challenge: 'Add a second whisker signal that arrives 10ms later. In the cortex stage, can you distinguish the two whiskers? This is how the brain maintains spatial resolution through the pathway.',
      successHint: 'The hierarchical processing from raw signal to conscious perception mirrors how modern deep learning networks work — each layer extracts increasingly abstract features. Neuroscience inspired AI, and now AI helps us understand neuroscience.',
    },
    {
      title: 'Barrel cortex in rodents — nature\'s best-studied touch map',
      concept: `The barrel cortex in mice and rats is the most extensively studied sensory map in neuroscience. Each "barrel" is a cylindrical column of ~4,000 neurons, visible under a microscope when the brain is stained.

**Why rodents?**
- Whiskers are their dominant sense (like vision is for humans)
- 30% of their somatosensory cortex is dedicated to whiskers
- The barrel pattern is stereotyped — same layout in every mouse
- Each barrel can be matched to a specific whisker using a naming convention (rows A-E, columns 1-7)

**Key discoveries from barrel cortex research:**
- **Critical periods**: barrel formation requires whisker input during the first postnatal week. Remove a whisker at birth → that barrel never forms properly
- **Plasticity**: remove a whisker in an adult → neighbouring barrels expand into its territory within days
- **Sparse coding**: only ~10% of neurons in a barrel fire for any given whisker touch — the brain uses an efficient code
- **Multi-whisker integration**: cortical neurons respond to their "principal" whisker but are modulated by surrounding whiskers — creating a contextual response

The barrel cortex has become a model system for understanding how all sensory cortices work.`,
      analogy: 'The barrel cortex is like a well-organised newsroom. Each barrel is a desk covering one beat (one whisker). The desk has ~4,000 reporters (neurons), but only ~400 write about any given event (sparse coding). Reporters at neighbouring desks share tips (multi-whisker integration), and if a desk shuts down, the neighbours absorb its beat (plasticity).',
      storyConnection: 'The tiger\'s 48 whiskers (24 per side) each map to a barrel in its cortex. When the girl sat near the tiger night after night, the barrels corresponding to her direction would fire repeatedly, forming a memory trace. The tiger\'s brain literally built a neural model of her presence — a "trust map" constructed from whisker data.',
      checkQuestion: 'If only 10% of barrel neurons fire for each touch, why have the other 90%? Isn\'t that wasteful?',
      checkAnswer: 'The 90% are not silent — they fire for different aspects of the stimulus. Some respond to direction of deflection, others to velocity, others to texture. The "sparse code" means each individual stimulus activates a unique combination of neurons, allowing the brain to represent an enormous number of different touch patterns with a limited number of neurons.',
      codeIntro: 'Visualise the barrel cortex map and simulate sparse coding within a single barrel.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 7))
fig.patch.set_facecolor('#1f2937')

# Left: Barrel cortex map (simplified mouse whisker layout)
ax1.set_facecolor('#111827')
ax1.set_xlim(-1, 8)
ax1.set_ylim(-1, 6)
ax1.set_aspect('equal')

rows = ['A', 'B', 'C', 'D', 'E']
cols_per_row = [4, 4, 5, 6, 5]
row_colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7']

for ri, (row, n_cols, color) in enumerate(zip(rows, cols_per_row, row_colors)):
    for ci in range(n_cols):
        x = ci + 0.5 + (0.3 if ri % 2 else 0)
        y = ri + 0.5
        circle = plt.Circle((x, y), 0.35, fill=True, facecolor=color, alpha=0.3, edgecolor=color, linewidth=1.5)
        ax1.add_patch(circle)
        ax1.text(x, y, f'{row}{ci+1}', ha='center', va='center', color='white', fontsize=8, fontweight='bold')

# Highlight one barrel
highlight = plt.Circle((2.5, 2.5), 0.35, fill=False, edgecolor='#fbbf24', linewidth=3, linestyle='--')
ax1.add_patch(highlight)
ax1.annotate('C3 barrel\\n(examined below)', xy=(2.5, 2.5), xytext=(5.5, 4.5),
             color='#fbbf24', fontsize=10, fontweight='bold',
             arrowprops=dict(arrowstyle='->', color='#fbbf24', linewidth=2))

ax1.set_title('Mouse Barrel Cortex Map\\n(each circle = one barrel = one whisker)', color='white', fontsize=11)
ax1.axis('off')

# Right: Sparse coding in barrel C3
ax2.set_facecolor('#111827')

# 4000 neurons, ~10% active per stimulus
n_neurons = 100  # showing 100 for visualisation (represents 4000)
n_trials = 5

# Each trial: different subset of neurons active
activity = np.zeros((n_trials, n_neurons))
for trial in range(n_trials):
    active_idx = np.random.choice(n_neurons, size=int(n_neurons * 0.12), replace=False)
    # Some core neurons always active, rest vary
    core = np.array([10, 25, 42, 67, 83])  # always respond
    active_idx = np.unique(np.concatenate([active_idx, core]))
    activity[trial, active_idx] = 1

im = ax2.imshow(activity, aspect='auto', cmap='YlOrRd', interpolation='nearest')
ax2.set_xlabel('Neuron index (of ~4000 in real barrel)', color='white')
ax2.set_ylabel('Touch trial', color='white')
ax2.set_title('Sparse Coding in Barrel C3\\n(~10% neurons active per touch)', color='white', fontsize=11)
ax2.set_yticks(range(n_trials))
ax2.set_yticklabels([f'Touch {i+1}' for i in range(n_trials)], color='white')
ax2.tick_params(colors='gray')

# Add activity percentage
for trial in range(n_trials):
    pct = np.sum(activity[trial]) / n_neurons * 100
    ax2.text(n_neurons + 2, trial, f'{pct:.0f}%', va='center', color='#f59e0b', fontsize=9)

plt.tight_layout()
plt.show()

print("Barrel cortex facts:")
print("  5 rows (A-E) matching 5 whisker rows")
print("  ~24 barrels total per hemisphere")
print("  ~4,000 neurons per barrel")
print("  ~10% active per stimulus (sparse code)")
print()
print("Sparse coding advantages:")
print("  - Energy efficient (fewer neurons firing)")
print("  - High capacity (many unique patterns)")
print("  - Noise robust (requires multiple neuron agreement)")`,
      challenge: 'Calculate how many unique touch patterns can be represented by 4000 neurons if exactly 400 fire at a time. Use the combination formula C(4000, 400). The number is astronomically large.',
      successHint: 'The barrel cortex has taught us fundamental principles of brain organisation: topographic mapping, sparse coding, critical periods, and plasticity. These principles apply to every sensory system in every animal, including humans.',
    },
    {
      title: 'Sensory prosthetics — restoring lost touch',
      concept: `When a person loses a limb, they lose not just movement but also sensation. Modern **sensory prosthetics** aim to restore the sense of touch by connecting artificial sensors to the nervous system.

**Current approaches:**
1. **Peripheral nerve stimulation**: electrodes wrapped around remaining nerves deliver patterns of electrical pulses that the brain interprets as touch
2. **Targeted sensory reinnervation (TSR)**: nerves that once served the lost hand are surgically rerouted to chest skin. Touching the chest then feels like touching the phantom hand
3. **Cortical implants**: electrodes placed directly in the somatosensory cortex bypass the entire pathway, stimulating barrels directly
4. **Vibrotactile substitution**: pressure sensors on prosthetic fingers trigger vibrators on the remaining arm — the brain learns to interpret vibration patterns as touch

**Challenges:**
- The brain expects signals from ~17,000 mechanoreceptors in one hand
- Current prosthetics provide 5-50 channels of feedback
- Signal patterns must match what the brain expects (wrong patterns feel like tingling or pain)
- Long-term electrode stability (scar tissue forms around implants)`,
      analogy: 'Current sensory prosthetics are like giving someone a 50-pixel display when they are used to a 4K screen. The image is recognisable but crude. The user can tell "something is there" and roughly "how hard," but the richness of natural touch — texture, warmth, moisture, pain — is mostly missing.',
      storyConnection: 'The tiger\'s whisker in the story was an ingredient in a healing potion. In modern medicine, understanding whisker neuroscience has directly contributed to prosthetic design. The barrel cortex taught us that the brain expects sensory input organised in spatial maps — and prosthetics must respect that organisation to feel natural.',
      checkQuestion: 'Some amputees experience "phantom limb" sensations — feeling touch, pain, or movement in a limb that no longer exists. What causes this?',
      checkAnswer: 'The somatosensory cortex still has the map for the missing limb. Without real input, the cortical neurons become hyper-excitable or are activated by neighbouring body regions (the face map is adjacent to the hand map in the cortex). The brain interprets this activity as coming from the missing hand — because that is what those neurons have always meant.',
      codeIntro: 'Compare the channel count of natural touch vs. prosthetic systems.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Left: channel count comparison
ax1.set_facecolor('#111827')
systems = [
    'Human hand\\n(natural)', 'Cat whisker\\narray', 'LUKE arm\\n(2024)',
    'BrainGate\\ncortical', 'Vibrotactile\\nsubstitution', 'e-dermis\\n(JHU 2018)'
]
channels = [17000, 4800, 20, 96, 6, 32]
colors = ['#22c55e', '#f59e0b', '#3b82f6', '#a855f7', '#6b7280', '#ec4899']

bars = ax1.barh(systems, channels, color=colors, height=0.6)
ax1.set_xscale('log')
ax1.set_xlabel('Number of sensory channels (log scale)', color='white')
ax1.set_title('Sensory Resolution: Biology vs Prosthetics', color='white', fontsize=12)
ax1.tick_params(colors='gray')
for bar, val in zip(bars, channels):
    ax1.text(bar.get_width() * 1.2, bar.get_y() + bar.get_height()/2,
             f'{val:,}', va='center', color='white', fontsize=9)

# Right: timeline of prosthetic touch milestones
ax2.set_facecolor('#111827')
years = [1998, 2004, 2012, 2015, 2018, 2020, 2023, 2025]
channel_counts = [1, 4, 16, 32, 32, 64, 96, 128]
milestones = ['First nerve\\nstimulation', 'Targeted\\nreinnervation', 'Utah array\\ncortical', 'DARPA\\nLUKE arm',
              'e-dermis\\ntexture', '64-ch\\ncortical', 'BrainGate\\ntouch', 'Next-gen\\nprosthetics']

ax2.plot(years, channel_counts, 'o-', color='#22c55e', linewidth=2, markersize=8)
for y, c, m in zip(years, channel_counts, milestones):
    ax2.annotate(m, (y, c), xytext=(0, 15), textcoords='offset points',
                 ha='center', color='white', fontsize=7,
                 arrowprops=dict(arrowstyle='->', color='gray', linewidth=0.5))

ax2.axhline(17000, color='#f59e0b', linestyle='--', alpha=0.5)
ax2.text(2026, 17000, 'Natural hand\\n(17,000)', color='#f59e0b', fontsize=8, va='bottom')
ax2.set_xlabel('Year', color='white')
ax2.set_ylabel('Sensory channels', color='white')
ax2.set_yscale('log')
ax2.set_title('Progress in Prosthetic Touch', color='white', fontsize=12)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("The prosthetic touch gap:")
print(f"  Natural hand: 17,000 channels")
print(f"  Best prosthetic (2025): ~128 channels")
print(f"  Gap: ~130x fewer channels")
print()
print("But even crude touch feedback dramatically improves:")
print("  - Grip control (50% fewer dropped objects)")
print("  - Embodiment (feeling the prosthetic as 'part of me')")
print("  - Phantom pain reduction")`,
      challenge: 'If prosthetic channels double every 3 years (like Moore\'s Law), when would we reach 17,000 channels? Plot the projection from 2025 onwards.',
      successHint: 'Sensory prosthetics show that even partial restoration of touch fundamentally changes quality of life. You do not need 17,000 channels to make a difference — even 20 channels restores a sense of agency and connection to the world.',
    },
    {
      title: 'Haptic feedback in VR — simulating touch in virtual worlds',
      concept: `Virtual reality creates convincing visual and auditory experiences, but touch remains the hardest sense to simulate. **Haptic feedback in VR** aims to let you feel virtual objects.

**Current technologies:**
1. **Vibrotactile actuators**: eccentric rotating mass (ERM) or linear resonant actuators (LRA) in controllers — the most common, cheapest, but lowest fidelity
2. **Force feedback exoskeletons**: motorised finger brakes that resist movement when you "grip" a virtual object (e.g., HaptX, Dexmo)
3. **Pneumatic actuators**: inflatable bladders in gloves that apply pressure (SenseGlove)
4. **Electrotactile stimulation**: mild electrical pulses through skin electrodes — can simulate texture
5. **Ultrasonic mid-air haptics**: phased arrays of ultrasound speakers create focused pressure points in air (Ultraleap)

**The fundamental challenge:**
Real touch involves deformation of skin at microscopic scales. The spatial resolution of a fingertip is ~1mm. Reproducing this requires actuator arrays with ~1mm spacing — which means ~2,500 actuators per cm² of fingertip. No current technology comes close.`,
      analogy: 'Current VR haptics are like early colour television. The first colour TVs had terrible colour accuracy — but people loved them because even crude colour was better than black-and-white. Similarly, even basic vibration in VR controllers makes the experience dramatically more immersive than no touch at all.',
      storyConnection: 'Imagine a VR experience where you could feel the tiger\'s whisker between your fingers — the stiffness, the taper, the slight warmth. Current VR cannot do this. But whisker neuroscience tells us exactly what signals the brain expects, giving haptic engineers a precise target to aim for.',
      checkQuestion: 'Ultrasonic mid-air haptics create a sensation of touch with no physical contact. How is this possible?',
      checkAnswer: 'Phased arrays of 40kHz ultrasound speakers create focused regions of high acoustic pressure in air. This pressure (a few hundred Pascals) is enough to deform skin slightly and activate Pacinian corpuscles (vibration detectors). By rapidly moving the focal point, patterns are traced on the skin. The sensation is like a light breeze with texture — not as strong as contact, but perceptible.',
      codeIntro: 'Simulate ultrasonic haptic focal point creation using constructive interference.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simulate phased array ultrasound focusing
fig, axes = plt.subplots(1, 3, figsize=(15, 5))
fig.patch.set_facecolor('#1f2937')

# Grid
x = np.linspace(-50, 50, 200)  # mm
y = np.linspace(0, 100, 200)   # mm
X, Y = np.meshgrid(x, y)

# Ultrasound sources (array of 16 emitters along bottom)
n_sources = 16
source_x = np.linspace(-40, 40, n_sources)
wavelength = 8.6  # mm (40 kHz in air)
k = 2 * np.pi / wavelength

# Three focus points
focus_points = [(0, 60, 'Single focus point'), (-20, 50, 'Left focus'), (15, 70, 'Right focus')]

for ax, (fx, fy, title) in zip(axes, focus_points):
    ax.set_facecolor('#111827')

    # Calculate pressure field from phased array
    pressure = np.zeros_like(X)
    for sx in source_x:
        # Distance from source to each grid point
        r = np.sqrt((X - sx)**2 + Y**2)
        # Phase delay to focus at (fx, fy)
        r_focus = np.sqrt((fx - sx)**2 + fy**2)
        phase = k * (r - r_focus)
        pressure += np.cos(phase) / np.maximum(r, 1)

    pressure = pressure / np.max(np.abs(pressure))

    im = ax.imshow(pressure**2, extent=[-50, 50, 0, 100], origin='lower',
                    cmap='hot', aspect='auto', vmin=0, vmax=0.5)
    ax.plot(fx, fy, 'x', color='#22c55e', markersize=15, markeredgewidth=3)
    ax.plot(source_x, np.zeros_like(source_x), 'v', color='#3b82f6', markersize=6)
    ax.set_title(title, color='white', fontsize=10)
    ax.set_xlabel('x (mm)', color='white')
    ax.tick_params(colors='gray')

axes[0].set_ylabel('Distance from array (mm)', color='white')

plt.suptitle('Ultrasonic Haptics: Focusing Sound to Create Touch', color='white', fontsize=13, y=1.02)
plt.tight_layout()
plt.show()

print("How ultrasonic mid-air haptics work:")
print(f"  Frequency: 40 kHz (inaudible)")
print(f"  Wavelength: {wavelength}mm")
print(f"  Array: {n_sources} emitters")
print(f"  Focal spot size: ~{wavelength/2:.1f}mm")
print()
print("By adjusting phase delays, the focus point moves in 3D.")
print("Tracing patterns at 200Hz creates tactile sensations.")
print("Current resolution: ~4mm (vs 1mm for fingertip receptors)")`,
      challenge: 'Double the number of sources to 32. How does the focal spot change? More sources = tighter focus = better spatial resolution. This is the same principle behind radio telescope arrays.',
      successHint: 'Ultrasonic haptics is the closest we have come to "force fields" from science fiction. The physics is well understood — the engineering challenge is making arrays with enough elements, fast enough electronics, and precise enough phase control.',
    },
    {
      title: 'Brain-machine interfaces — connecting brains to computers',
      concept: `A **brain-machine interface (BMI)** is a direct communication pathway between the brain and an external device. BMIs can read neural signals (decode) or write them (stimulate).

**Reading the brain (decode):**
- **EEG**: electrodes on the scalp measure bulk electrical activity. Low resolution (~cm) but non-invasive
- **ECoG**: electrode grids placed on the brain surface. Medium resolution (~mm). Requires surgery
- **Intracortical arrays** (Utah array, Neuropixels): tiny electrodes inserted into brain tissue. High resolution (single neurons). Most invasive

**Writing to the brain (stimulate):**
- **Transcranial magnetic stimulation (TMS)**: magnetic pulses from outside the skull activate neurons. Non-invasive but imprecise
- **Deep brain stimulation (DBS)**: implanted electrodes deliver pulses. Used for Parkinson's disease
- **Optogenetics**: genetically modified neurons respond to light. Extremely precise but requires gene therapy

**Current BMI achievements:**
- Paralysed patients typing 90 characters/minute by imagining handwriting
- Robotic arms controlled by thought with 95% accuracy
- Sensory feedback restored through cortical stimulation
- Speech decoded from brain signals at 78 words/minute

The tiger's whisker sensory system — from mechanoreceptor to cortex — is the biological blueprint that BMI engineers are trying to replicate with silicon and electrodes.`,
      analogy: 'A BMI is like learning to play a new musical instrument. At first, the brain produces clumsy signals and the decoder makes mistakes. Over weeks of practice, the brain adapts its signals to what the decoder expects, and the decoder adapts to the brain. Both sides learn — this co-adaptation is what makes BMIs work.',
      storyConnection: 'The girl in the story built a communication channel with the tiger over months of patient interaction. A BMI does something similar — building a communication channel between brain and machine over weeks of calibration. Both require patience, trust, and gradual adaptation on both sides.',
      checkQuestion: 'If a BMI can read brain signals, could it read thoughts? Is "mind reading" possible?',
      checkAnswer: 'Current BMIs read motor intentions (planned movements) and sensory expectations, not abstract thoughts. They detect WHICH neurons fire and WHEN, but thoughts involve billions of neurons in complex patterns across many brain regions. Reading specific thoughts would require understanding the neural code for concepts — which we are nowhere near achieving. It is like reading voltage fluctuations on a computer\'s circuit board and trying to determine what email is being written.',
      codeIntro: 'Simulate a simple BMI decoder that classifies imagined movements from neural signals.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate neural signals from 10 electrodes during two imagined movements
n_electrodes = 10
n_trials = 50
n_timepoints = 100

# Movement A (imagined left hand): electrodes 0-4 more active
# Movement B (imagined right hand): electrodes 5-9 more active
signals_A = np.random.randn(n_trials, n_electrodes, n_timepoints) * 0.5
signals_A[:, :5, 30:70] += 1.5  # electrodes 0-4 active during movement A

signals_B = np.random.randn(n_trials, n_electrodes, n_timepoints) * 0.5
signals_B[:, 5:, 30:70] += 1.5  # electrodes 5-9 active during movement B

# Simple decoder: average power in electrodes 0-4 vs 5-9
power_A_left = np.mean(signals_A[:, :5, 30:70]**2, axis=(1,2))
power_A_right = np.mean(signals_A[:, 5:, 30:70]**2, axis=(1,2))
power_B_left = np.mean(signals_B[:, :5, 30:70]**2, axis=(1,2))
power_B_right = np.mean(signals_B[:, 5:, 30:70]**2, axis=(1,2))

fig, (ax1, ax2, ax3) = plt.subplots(1, 3, figsize=(15, 5))
fig.patch.set_facecolor('#1f2937')

# Left: neural signals heatmap (single trial)
ax1.set_facecolor('#111827')
im = ax1.imshow(signals_A[0], aspect='auto', cmap='RdBu_r', vmin=-2, vmax=2)
ax1.set_xlabel('Time (ms)', color='white')
ax1.set_ylabel('Electrode #', color='white')
ax1.set_title('Neural signals\\n(imagined left hand)', color='white', fontsize=10)
ax1.axvline(30, color='#22c55e', linestyle='--', alpha=0.5)
ax1.axvline(70, color='#22c55e', linestyle='--', alpha=0.5)
ax1.tick_params(colors='gray')

# Middle: decoder scatter plot
ax2.set_facecolor('#111827')
ax2.scatter(power_A_left, power_A_right, c='#3b82f6', alpha=0.6, s=40, label='Left hand imagined')
ax2.scatter(power_B_left, power_B_right, c='#ef4444', alpha=0.6, s=40, label='Right hand imagined')
ax2.plot([0, 3], [0, 3], '--', color='gray', alpha=0.5)
ax2.set_xlabel('Power in left-hand electrodes', color='white')
ax2.set_ylabel('Power in right-hand electrodes', color='white')
ax2.set_title('BMI Decoder Space', color='white', fontsize=10)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

# Right: decoder accuracy over training
ax3.set_facecolor('#111827')
sessions = np.arange(1, 21)
# Accuracy improves as brain and decoder co-adapt
accuracy = 55 + 40 * (1 - np.exp(-sessions / 5)) + np.random.randn(20) * 3
accuracy = np.clip(accuracy, 50, 99)
ax3.plot(sessions, accuracy, 'o-', color='#22c55e', linewidth=2, markersize=5)
ax3.axhline(50, color='#ef4444', linestyle='--', alpha=0.5, label='Chance level')
ax3.axhline(95, color='#f59e0b', linestyle='--', alpha=0.5, label='Clinical threshold')
ax3.fill_between(sessions, 50, accuracy, alpha=0.1, color='#22c55e')
ax3.set_xlabel('Training session', color='white')
ax3.set_ylabel('Accuracy (%)', color='white')
ax3.set_title('Decoder Accuracy\\nOver Training', color='white', fontsize=10)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax3.tick_params(colors='gray')
ax3.set_ylim(40, 100)

plt.tight_layout()
plt.show()

print("BMI decoder performance:")
print(f"  Initial accuracy: ~{accuracy[0]:.0f}% (near chance)")
print(f"  After 20 sessions: ~{accuracy[-1]:.0f}%")
print()
print("Key insight: both brain and decoder LEARN.")
print("The brain reshapes its signals to be more decodable.")
print("The decoder adapts its model to the brain's patterns.")
print("This co-adaptation is why BMIs improve over weeks of use.")`,
      challenge: 'Add noise to the signals (increase the random component) and see how decoder accuracy drops. What signal-to-noise ratio is needed for reliable decoding? This is the central engineering challenge of BMIs.',
      successHint: 'From a tiger\'s whisker to brain-machine interfaces, you have traced the full journey of sensory neuroscience. The same principles — signal transduction, topographic mapping, sparse coding, plasticity — underlie both biological sensation and our best engineering attempts to recreate it.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Deep Dive
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Sensory Neuroscience</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for neuroscience simulations. Click to start.</p>
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
