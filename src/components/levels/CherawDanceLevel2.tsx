import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function CherawDanceLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Visualizing sine waves — the shape of rhythm',
      concept: `Every periodic motion can be described by a **sine wave**: \`y(t) = A × sin(2π f t + φ)\`

Where:
- **A** = amplitude (how far the motion extends)
- **f** = frequency (how many cycles per second)
- **t** = time
- **φ** (phi) = phase offset (where the cycle starts)

For bamboo poles in Cheraw:
- Amplitude = half the gap width (e.g., 30 cm if poles open 60 cm apart)
- Frequency = the dance tempo in Hz
- Phase = 0 when poles are at maximum opening

Plotting this sine wave reveals the smooth, predictable motion that dancers internalize. The wave's shape shows exactly how much time the dancer has at each point in the cycle.

📚 *matplotlib is Python's standard plotting library. \`plt.plot(x, y)\` creates a line plot, and \`plt.fill_between()\` shades regions.*`,
      analogy: 'A sine wave is the shadow of a point moving around a circle. If you put a light above a spinning wheel and watch the shadow of a point on the rim, it traces a perfect sine wave on the floor. The Cheraw bamboos move in this same smooth pattern.',
      storyConnection: 'When the Cheraw bamboo holders practice, they develop a smooth, sinusoidal motion — not jerky stops and starts. This sine-wave quality is what makes the dance both visually beautiful and physically predictable for the dancers stepping through.',
      checkQuestion: 'In the sine wave equation, what happens to the wave when you double the frequency f?',
      checkAnswer: 'The wave completes twice as many cycles in the same time period. Visually, the peaks get closer together. Physically, the bamboos clap twice as fast, halving the time the dancer has to step through.',
      codeIntro: 'Plot the sine wave motion of Cheraw bamboo poles at different tempos.',
      code: `import numpy as np
import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt

t = np.linspace(0, 2, 1000)  # 2 seconds

fig, axes = plt.subplots(3, 1, figsize=(10, 8))
fig.patch.set_facecolor('#111827')

tempos = [60, 90, 120]
colors = ['#34d399', '#fbbf24', '#f87171']
labels = ['Slow (60 BPM)', 'Medium (90 BPM)', 'Fast (120 BPM)']

for ax, bpm, color, label in zip(axes, tempos, colors, labels):
    freq = bpm / 60
    y = 30 * np.sin(2 * np.pi * freq * t)  # amplitude = 30 cm

    ax.set_facecolor('#1f2937')
    ax.plot(t, y, color=color, linewidth=2)

    # Shade safe zones (poles > 15 cm apart)
    safe = y > 15
    ax.fill_between(t, -35, 35, where=safe, alpha=0.15, color='#34d399')
    ax.fill_between(t, -35, 35, where=~safe, alpha=0.1, color='#f87171')

    ax.set_ylabel('Gap (cm)', color='lightgray', fontsize=10)
    ax.set_title(label, color='white', fontsize=12, fontweight='bold')
    ax.set_ylim(-35, 35)
    ax.axhline(0, color='gray', linewidth=0.5, linestyle='--')
    ax.tick_params(colors='lightgray')
    for spine in ax.spines.values():
        spine.set_color('#374151')

axes[-1].set_xlabel('Time (seconds)', color='lightgray', fontsize=11)
plt.suptitle('Cheraw Bamboo Pole Motion — Sine Waves at Different Tempos',
             color='white', fontsize=14, fontweight='bold', y=1.02)
plt.tight_layout()
plt.savefig('/tmp/cheraw_sine.png', dpi=100, bbox_inches='tight',
            facecolor='#111827')
plt.show()
print("Green zones = safe to step through (gap > 15 cm)")
print("Red zones = danger (poles closing or closed)")`,
      challenge: 'Add a fourth subplot showing 150 BPM. Notice how the safe zones become extremely narrow. Calculate what percentage of each cycle is "safe" at each tempo.',
      successHint: 'You learned to visualize periodic motion as sine waves using matplotlib. The plot reveals a crucial insight: as tempo increases, the safe stepping windows shrink dramatically — quantifying why fast Cheraw is so difficult.',
    },
    {
      title: 'Amplitude and energy — how hard the bamboos clap',
      concept: `**Amplitude** determines the intensity of periodic motion. In the Cheraw dance, amplitude is the maximum distance the bamboo poles open.

The energy in a periodic motion is proportional to the **square** of the amplitude:

\`E ∝ A²\`

Doubling the amplitude quadruples the energy. This means opening the bamboos wider requires significantly more effort from the holders — and produces a louder clap when they close.

The **velocity** of the bamboo tips also depends on amplitude:
\`v_max = 2π f A\`

At 90 BPM with a 30 cm amplitude, the bamboo tips move at:
\`v_max = 2π × 1.5 × 0.3 = 2.83 m/s ≈ 10 km/h\`

That is a brisk jogging speed — getting hit by the bamboos would hurt!

📚 *numpy arrays support element-wise operations: \`np.sin(array)\` computes sine for every element simultaneously, much faster than a loop.*`,
      analogy: 'Think of pushing a child on a swing. Small pushes (low amplitude) are easy and gentle. But pushing the swing high (high amplitude) requires much more effort, and the child moves much faster at the bottom. The energy scales with the square of the height — doubling the height means four times the energy.',
      storyConnection: 'In performance Cheraw, the bamboo holders must balance amplitude carefully. Too small and the dancers cannot fit through. Too large and the holders tire quickly — plus the bamboo claps become dangerously forceful. The ideal amplitude is just wide enough for the dance steps.',
      checkQuestion: 'If bamboo holders increase the opening from 40 cm to 60 cm amplitude, by what factor does the energy increase?',
      checkAnswer: 'Energy ratio = (60/40)² = (1.5)² = 2.25. The energy increases by 2.25×, meaning the holders must exert more than double the effort. The maximum velocity of the bamboo tips also increases by 1.5×.',
      codeIntro: 'Plot how amplitude affects the energy and velocity of bamboo pole motion.',
      code: `import numpy as np
import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt

amplitudes = np.linspace(10, 50, 100)  # cm
freq = 1.5  # Hz (90 BPM)

# Energy proportional to A^2 (normalized)
energy = amplitudes**2 / amplitudes[0]**2

# Maximum velocity: v_max = 2*pi*f*A
v_max = 2 * np.pi * freq * (amplitudes / 100)  # convert cm to m
v_max_kmh = v_max * 3.6  # convert m/s to km/h

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#111827')

# Energy plot
ax1.set_facecolor('#1f2937')
ax1.plot(amplitudes, energy, color='#fbbf24', linewidth=2.5)
ax1.fill_between(amplitudes, energy, alpha=0.2, color='#fbbf24')
ax1.set_xlabel('Amplitude (cm)', color='lightgray', fontsize=11)
ax1.set_ylabel('Relative Energy', color='lightgray', fontsize=11)
ax1.set_title('Energy vs Amplitude', color='white', fontsize=13, fontweight='bold')
ax1.tick_params(colors='lightgray')
for s in ax1.spines.values(): s.set_color('#374151')

# Velocity plot
ax2.set_facecolor('#1f2937')
ax2.plot(amplitudes, v_max_kmh, color='#f87171', linewidth=2.5)
ax2.fill_between(amplitudes, v_max_kmh, alpha=0.2, color='#f87171')
ax2.axhline(10, color='#34d399', linestyle='--', label='Jogging speed')
ax2.axhline(20, color='#fbbf24', linestyle='--', label='Cycling speed')
ax2.set_xlabel('Amplitude (cm)', color='lightgray', fontsize=11)
ax2.set_ylabel('Max Tip Velocity (km/h)', color='lightgray', fontsize=11)
ax2.set_title('Bamboo Tip Speed vs Amplitude', color='white', fontsize=13, fontweight='bold')
ax2.legend(facecolor='#1f2937', edgecolor='#374151', labelcolor='lightgray')
ax2.tick_params(colors='lightgray')
for s in ax2.spines.values(): s.set_color('#374151')

plt.tight_layout()
plt.savefig('/tmp/cheraw_amplitude.png', dpi=100, bbox_inches='tight',
            facecolor='#111827')
plt.show()
print(f"At 30 cm amplitude: Energy = {(30/10)**2:.1f}x baseline, Tip speed = {2*np.pi*1.5*0.3*3.6:.1f} km/h")
print(f"At 50 cm amplitude: Energy = {(50/10)**2:.1f}x baseline, Tip speed = {2*np.pi*1.5*0.5*3.6:.1f} km/h")`,
      challenge: 'Add a third subplot showing the "safe window duration" as a function of amplitude (time when gap > 20 cm). Is there an optimal amplitude that maximizes safety while minimizing holder effort?',
      successHint: 'You learned that energy scales with amplitude squared — a fundamental relationship in all wave physics. This explains why large-amplitude Cheraw performances are exhausting for the holders and dangerous for the dancers.',
    },
    {
      title: 'Fourier analysis — decomposing complex rhythms',
      concept: `Any complex periodic pattern can be broken down into a sum of simple sine waves — this is **Fourier analysis**, one of the most powerful tools in physics and engineering.

A square wave (like bamboos snapping open and shut) can be written as:
\`square(t) = sin(t) + sin(3t)/3 + sin(5t)/5 + sin(7t)/7 + ...\`

Each term is a **harmonic** — a sine wave at an integer multiple of the fundamental frequency. The more harmonics you add, the closer you get to the sharp-edged square wave.

In rhythm:
- **Fundamental**: the basic beat (1st harmonic)
- **2nd harmonic**: double-time pattern
- **3rd harmonic**: triplet feel
- Higher harmonics add crisp, percussive edges to the rhythm

📚 *numpy's broadcasting lets you compute many harmonics at once. Summing arrays element-wise builds up the Fourier series.*`,
      analogy: 'Fourier analysis is like a prism splitting white light into rainbow colors. White light looks simple, but it is actually many frequencies mixed together. Similarly, a complex drum pattern sounds like one thing, but Fourier analysis reveals it is many simple sine waves layered on top of each other.',
      storyConnection: 'The rich, complex sound of the Cheraw bamboo clap is not a single frequency — it contains harmonics that give it its distinctive sharp character. Fourier analysis explains why the bamboo clap sounds different from, say, a drum beat, even if both have the same tempo.',
      checkQuestion: 'Why does a square wave need odd harmonics only (1st, 3rd, 5th...) while a sawtooth wave needs all harmonics?',
      checkAnswer: 'A square wave is symmetric about its midline — it looks the same flipped vertically. This symmetry cancels out all even harmonics. A sawtooth wave is asymmetric (slow rise, sharp drop), so it needs both odd and even harmonics to capture that asymmetry.',
      codeIntro: 'Build up a square wave from sine harmonics to visualize Fourier synthesis.',
      code: `import numpy as np
import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt

t = np.linspace(0, 2, 1000)
freq = 1.5  # Hz (90 BPM)

fig, axes = plt.subplots(2, 2, figsize=(12, 8))
fig.patch.set_facecolor('#111827')

harmonics_list = [1, 3, 7, 25]
colors = ['#34d399', '#fbbf24', '#f87171', '#a78bfa']

for ax, n_harmonics, color in zip(axes.flat, harmonics_list, colors):
    ax.set_facecolor('#1f2937')

    # Build Fourier series for square wave
    y = np.zeros_like(t)
    for k in range(1, n_harmonics + 1, 2):  # odd harmonics only
        y += np.sin(2 * np.pi * freq * k * t) / k

    y *= 4 / np.pi  # normalize to amplitude 1

    ax.plot(t, y, color=color, linewidth=2, label=f'{(n_harmonics+1)//2} harmonics')

    # Show the target square wave
    square = np.sign(np.sin(2 * np.pi * freq * t))
    ax.plot(t, square, color='gray', linewidth=1, linestyle='--', alpha=0.5)

    ax.set_ylim(-1.5, 1.5)
    ax.set_title(f'{(n_harmonics+1)//2} harmonic(s)', color='white', fontsize=12, fontweight='bold')
    ax.tick_params(colors='lightgray')
    ax.set_ylabel('Position', color='lightgray')
    for s in ax.spines.values(): s.set_color('#374151')

axes[1][0].set_xlabel('Time (s)', color='lightgray')
axes[1][1].set_xlabel('Time (s)', color='lightgray')
plt.suptitle('Fourier Synthesis — Building a Bamboo Clap from Sine Waves',
             color='white', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.savefig('/tmp/cheraw_fourier.png', dpi=100, bbox_inches='tight',
            facecolor='#111827')
plt.show()
print("With just 1 harmonic: smooth sine wave (gentle motion)")
print("With 4 harmonics: starting to look square (sharper clap)")
print("With 13 harmonics: nearly perfect square wave (crisp clap)")`,
      challenge: 'Modify the code to build a sawtooth wave instead (use ALL harmonics, not just odd ones, with alternating signs). How does the sawtooth shape differ from the square wave?',
      successHint: 'You learned Fourier synthesis — building complex waves from simple sines. This is the foundation of audio processing, signal analysis, and even image compression (JPEG uses a 2D version of this).',
    },
    {
      title: 'Resonance — when rhythms synchronize',
      concept: `**Resonance** occurs when a periodic force matches the natural frequency of a system. When you push a swing at just the right timing, the amplitude builds up dramatically. Push at the wrong timing, and the motion stays small or becomes chaotic.

The resonance condition: **f_driving = f_natural**

Near resonance, the amplitude amplification factor is:
\`A/A₀ = f_natural / √((f_natural² - f_driving²)² + (γ f_driving)²)\`

Where γ (gamma) is the damping coefficient. With low damping, the resonance peak is tall and narrow. With high damping, it is broad and low.

In Cheraw, resonance explains why the bamboo holders naturally settle into specific tempos — the ones that resonate with the bamboo's natural flex frequency.

📚 *matplotlib's \`plt.subplot()\` and multiple y-axes (\`ax.twinx()\`) let you overlay different datasets on the same plot for comparison.*`,
      analogy: 'Resonance is like pushing someone on a swing. If you push at the right moment (matching the swing\'s natural frequency), the person goes higher and higher with minimal effort. Push at the wrong time, and your pushes fight the motion. The swing "wants" to oscillate at its natural frequency.',
      storyConnection: 'Experienced Cheraw holders report that certain tempos "feel right" — the bamboo flexes naturally and the motion requires less effort. This is resonance: the driving frequency matches the bamboo\'s natural oscillation frequency, making the dance efficient and sustainable.',
      checkQuestion: 'Why is resonance dangerous in engineering (like bridges) but useful in musical instruments?',
      checkAnswer: 'In engineering, uncontrolled resonance can build up amplitude until structures fail (like the Tacoma Narrows Bridge). In music, resonance is controlled and intentional — the body of a guitar resonates with string vibrations to amplify sound. The difference is whether you control the energy input.',
      codeIntro: 'Plot the resonance curve showing how amplitude depends on driving frequency relative to natural frequency.',
      code: `import numpy as np
import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt

f_natural = 1.5  # Hz (natural bamboo flex frequency)
f_drive = np.linspace(0.5, 3.0, 500)

fig, ax = plt.subplots(figsize=(10, 6))
fig.patch.set_facecolor('#111827')
ax.set_facecolor('#1f2937')

# Different damping levels
damping_values = [0.05, 0.15, 0.4]
colors = ['#f87171', '#fbbf24', '#34d399']
labels = ['Low damping (stiff bamboo)', 'Medium damping (normal)',
          'High damping (flexible bamboo)']

for gamma, color, label in zip(damping_values, colors, labels):
    denominator = np.sqrt((f_natural**2 - f_drive**2)**2 +
                          (gamma * f_drive)**2)
    amplitude = f_natural / denominator
    ax.plot(f_drive, amplitude, color=color, linewidth=2.5, label=label)

# Mark the natural frequency
ax.axvline(f_natural, color='white', linestyle=':', alpha=0.5, linewidth=1)
ax.annotate('Natural frequency\
(90 BPM)', xy=(f_natural, 0.5),
            color='white', fontsize=10, ha='center')

# Mark common dance tempos
for bpm, name in [(60, '60'), (90, '90'), (120, '120')]:
    f = bpm / 60
    ax.axvline(f, color='gray', linestyle='--', alpha=0.3)
    ax.text(f, ax.get_ylim()[1] if ax.get_ylim()[1] > 5 else 18,
            f'{bpm} BPM', color='gray', fontsize=9, ha='center', va='top')

ax.set_xlabel('Driving Frequency (Hz)', color='lightgray', fontsize=12)
ax.set_ylabel('Amplitude Amplification', color='lightgray', fontsize=12)
ax.set_title('Resonance in Cheraw Bamboo Poles', color='white',
             fontsize=14, fontweight='bold')
ax.legend(facecolor='#1f2937', edgecolor='#374151', labelcolor='lightgray')
ax.set_ylim(0, 20)
ax.tick_params(colors='lightgray')
for s in ax.spines.values(): s.set_color('#374151')

plt.tight_layout()
plt.savefig('/tmp/cheraw_resonance.png', dpi=100, bbox_inches='tight',
            facecolor='#111827')
plt.show()
print(f"At resonance ({f_natural} Hz = 90 BPM), amplitude peaks dramatically")
print(f"Low damping: amplitude can be 20x the input — very efficient but hard to control")
print(f"High damping: amplitude is only ~2.5x — easier to control, needs more effort")`,
      challenge: 'What happens if the bamboo\'s natural frequency is 1.5 Hz but the holders drive at 3.0 Hz (double)? This is called the second harmonic. Add a vertical line at 3.0 Hz and read off the amplitude. Is there any resonance boost?',
      successHint: 'You learned that resonance explains why certain tempos feel natural in the Cheraw dance. This principle applies everywhere: from tuning a radio (matching electromagnetic frequencies) to MRI machines (matching atomic frequencies).',
    },
    {
      title: 'Damped oscillations — why the bamboos slow down',
      concept: `No real periodic motion lasts forever. **Damping** removes energy from the system, causing amplitude to decay over time:

\`y(t) = A₀ × e^(-γt) × sin(2πft)\`

The exponential term \`e^(-γt)\` is the **decay envelope**. The damping coefficient γ determines how quickly the motion dies out:
- **Underdamped** (γ < 2πf): oscillation continues but shrinks — like a ringing bell
- **Critically damped** (γ = 2πf): fastest return to rest without oscillating
- **Overdamped** (γ > 2πf): slow creep back to rest, no oscillation

For bamboo poles, damping comes from:
- Air resistance on the bamboo surface
- Internal friction in the bamboo fibers
- The holders' grip absorbing energy

📚 *numpy's \`np.exp()\` computes the exponential function. Combined with \`np.sin()\`, it creates damped oscillations — one of the most common patterns in physics.*`,
      analogy: 'Damping is like friction on a playground merry-go-round. Give it one good push and it spins, but gradually slows down due to friction at the axle. The shape of the slowdown (exponential decay) is the same whether it is a merry-go-round, a vibrating bamboo, or a ringing bell.',
      storyConnection: 'When the Cheraw bamboo holders pause, the bamboo poles continue to vibrate briefly before settling. This damped oscillation is visible — the poles wobble back and forth with decreasing amplitude. The holders must account for this "ring" when they restart the rhythm.',
      checkQuestion: 'If a bamboo pole has a damping coefficient of γ = 0.5 s⁻¹, how long does it take for the amplitude to drop to half its initial value?',
      checkAnswer: 'We need e^(-γt) = 0.5, so -0.5t = ln(0.5) = -0.693, giving t = 0.693/0.5 = 1.386 seconds. This is called the half-life of the oscillation. After about 1.4 seconds, the bamboo vibration has lost half its amplitude.',
      codeIntro: 'Visualize damped oscillations showing how bamboo vibration decays over time for different damping levels.',
      code: `import numpy as np
import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt

t = np.linspace(0, 4, 1000)
freq = 1.5  # Hz
A0 = 30  # cm initial amplitude

fig, axes = plt.subplots(3, 1, figsize=(10, 9))
fig.patch.set_facecolor('#111827')

damping = [0.3, 1.0, 5.0]
labels = ['Underdamped (γ=0.3)', 'Moderately damped (γ=1.0)',
          'Heavily damped (γ=5.0)']
colors = ['#34d399', '#fbbf24', '#f87171']

for ax, gamma, label, color in zip(axes, damping, labels, colors):
    ax.set_facecolor('#1f2937')

    envelope = A0 * np.exp(-gamma * t)
    y = envelope * np.sin(2 * np.pi * freq * t)

    ax.plot(t, y, color=color, linewidth=2)
    ax.plot(t, envelope, color='white', linewidth=1, linestyle='--', alpha=0.5,
            label='Decay envelope')
    ax.plot(t, -envelope, color='white', linewidth=1, linestyle='--', alpha=0.5)

    # Mark half-life
    half_life = np.log(2) / gamma
    if half_life < 4:
        ax.axvline(half_life, color='gray', linestyle=':', alpha=0.5)
        ax.text(half_life + 0.05, A0 * 0.8, f't½={half_life:.2f}s',
                color='gray', fontsize=9)

    ax.set_title(label, color='white', fontsize=12, fontweight='bold')
    ax.set_ylim(-35, 35)
    ax.set_ylabel('Position (cm)', color='lightgray')
    ax.tick_params(colors='lightgray')
    for s in ax.spines.values(): s.set_color('#374151')

axes[-1].set_xlabel('Time (seconds)', color='lightgray', fontsize=11)
plt.suptitle('Damped Oscillation of Cheraw Bamboo Poles',
             color='white', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.savefig('/tmp/cheraw_damped.png', dpi=100, bbox_inches='tight',
            facecolor='#111827')
plt.show()
print("Underdamped: bamboo rings for several seconds (most realistic)")
print("Moderately damped: vibration dies quickly (1-2 seconds)")
print("Heavily damped: barely oscillates — like bamboo in thick mud")`,
      challenge: 'Calculate the total energy lost over 3 seconds for each damping level. Energy is proportional to amplitude squared, so integrate the square of the envelope. Which damping level loses 90% of its energy fastest?',
      successHint: 'You learned about damped oscillations — the realistic version of periodic motion. Every real vibration eventually dies out. Understanding damping is essential for engineering (shock absorbers, building design) and for understanding why the Cheraw holders must continuously supply energy to maintain the rhythm.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Visualizing Rhythm Physics with matplotlib</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint} />
        ))}
      </div>
    </div>
  );
}
