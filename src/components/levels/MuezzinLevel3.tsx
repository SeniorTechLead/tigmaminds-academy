import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';
import MuezzinInverseSquareDiagram from '../diagrams/MuezzinInverseSquareDiagram';
import MuezzinDomeAcousticsDiagram from '../diagrams/MuezzinDomeAcousticsDiagram';
import MuezzinSpeakerDiagram from '../diagrams/MuezzinSpeakerDiagram';
import MuezzinCityPropagationDiagram from '../diagrams/MuezzinCityPropagationDiagram';
import DiffractionDiagram from '../diagrams/DiffractionDiagram';
import InterferenceDiagram from '../diagrams/InterferenceDiagram';

export default function MuezzinLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Ray tracing acoustics — tracing thousands of sound paths',
      concept: `The image source method from Level 2 works for simple rooms, but a mosque with domes, arches, columns, and niches needs a more flexible approach: **acoustic ray tracing**.

The idea: launch thousands of rays from the sound source in random directions. Each ray travels in a straight line until it hits a surface, where it reflects (angle of incidence = angle of reflection) with some energy absorbed. Track each ray until its energy drops below a threshold.

At each receiver position, collect all rays that pass within a small radius. The arrival time and energy of each ray builds an **impulse response** — the acoustic fingerprint of the room.

Advantages over image sources: handles any room geometry (curved surfaces, columns, irregular shapes). The cost is proportional to the number of rays, not the room complexity.`,
      analogy: 'Imagine releasing thousands of bouncing balls in a room, each carrying a tiny paint capsule. When a ball hits a surface, it bounces and leaves a paint mark (losing some paint). After many bounces, the paint pattern on the floor shows you where sound is concentrated. Areas with lots of paint marks get lots of sound. Areas with few marks are acoustic "dead spots."',
      storyConnection: 'Modern acoustic studies of the Süleymaniye Mosque use ray tracing with 100,000+ rays to model its complex geometry. The dome, pendentives, semi-domes, columns, and wall niches create a reflection pattern that no simple formula can capture. Ray tracing revealed that Sinan’s design distributes early reflections remarkably evenly across the prayer area.',
      checkQuestion: 'Why does ray tracing become less accurate for low frequencies (below ~200 Hz)?',
      checkAnswer: 'Ray tracing assumes sound travels in straight lines and reflects like a billiard ball. This is only valid when the wavelength is much smaller than the room features (the "geometric acoustics" regime). At 100 Hz, λ ≈ 3.4 m, comparable to columns and arches. At these scales, **diffraction** (bending around obstacles) dominates and ray tracing misses it. For low frequencies, wave-based methods (FEM, BEM) are needed.',
      codeIntro: 'Build a 2D acoustic ray tracer for a simplified mosque floor plan.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simplified mosque: rectangular with semicircular dome apse
room_width = 30
room_length = 25
apse_radius = 8
apse_cx = room_width / 2
apse_cy = room_length

# Source (imam at mihrab)
sx, sy = room_width/2, 2

n_rays = 2000
max_bounces = 8
absorption = 0.15  # average wall absorption coefficient

# Receiver grid
rx = np.linspace(2, room_width-2, 15)
ry = np.linspace(3, room_length-2, 12)
RX, RY = np.meshgrid(rx, ry)
energy_map = np.zeros_like(RX)
recv_radius = 1.5

np.random.seed(42)
angles = np.random.uniform(0, 2*np.pi, n_rays)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))

# Trace rays
for ray_idx in range(n_rays):
    x, y = sx, sy
    dx = np.cos(angles[ray_idx])
    dy = np.sin(angles[ray_idx])
    energy = 1.0

    for bounce in range(max_bounces):
        if energy < 0.01:
            break

        # Find nearest wall intersection
        t_min = 1e6
        normal = None

        # Left wall (x=0)
        if dx < 0:
            t = -x / dx
            yh = y + t * dy
            if 0 <= yh <= room_length and t > 0.01:
                if t < t_min: t_min, normal = t, (1, 0)

        # Right wall (x=room_width)
        if dx > 0:
            t = (room_width - x) / dx
            yh = y + t * dy
            if 0 <= yh <= room_length and t > 0.01:
                if t < t_min: t_min, normal = t, (-1, 0)

        # Back wall (y=0)
        if dy < 0:
            t = -y / dy
            xh = x + t * dx
            if 0 <= xh <= room_width and t > 0.01:
                if t < t_min: t_min, normal = t, (0, 1)

        # Front wall (y=room_length)
        if dy > 0:
            t = (room_length - y) / dy
            xh = x + t * dx
            if 0 <= xh <= room_width and t > 0.01:
                if t < t_min: t_min, normal = t, (0, -1)

        if normal is None:
            break

        # Move to hit point
        x_new = x + t_min * dx
        y_new = y + t_min * dy

        # Check receivers along path
        for i in range(RX.shape[0]):
            for j in range(RX.shape[1]):
                # Distance from ray segment to receiver
                prx, pry = RX[i,j] - x, RY[i,j] - y
                proj = prx*dx + pry*dy
                if 0 < proj < t_min:
                    dist = abs(prx*dy - pry*dx)
                    if dist < recv_radius:
                        d_total = np.sqrt((RX[i,j]-sx)**2 + (RY[i,j]-sy)**2)
                        energy_map[i,j] += energy / max(d_total, 1)

        # Reflect
        nx_n, ny_n = normal
        dot = dx*nx_n + dy*ny_n
        dx = dx - 2*dot*nx_n
        dy = dy - 2*dot*ny_n
        energy *= (1 - absorption)
        x, y = x_new, y_new

        # Draw first 50 rays
        if ray_idx < 50 and bounce < 3:
            ax1.plot([x - t_min*(-dx + 2*dot*nx_n), x],
                     [y - t_min*(-dy + 2*dot*ny_n), y],
                     'c-', linewidth=0.3, alpha=0.3)

# Draw room
ax1.plot([0, room_width, room_width, 0, 0],
         [0, 0, room_length, room_length, 0], 'w-', linewidth=2)
ax1.plot(sx, sy, 'r*', markersize=15, label='Imam')
ax1.set_xlim(-2, room_width+2)
ax1.set_ylim(-2, room_length+5)
ax1.set_aspect('equal')
ax1.set_title(f'Ray Tracing: {n_rays} rays, {max_bounces} bounces', fontsize=12)
ax1.legend(fontsize=10)
ax1.grid(alpha=0.15)

# Energy distribution
c = ax2.contourf(RX, RY, np.log10(energy_map + 1), levels=20, cmap='inferno')
ax2.plot(sx, sy, 'r*', markersize=15)
ax2.set_xlabel('X (m)', fontsize=11)
ax2.set_ylabel('Y (m)', fontsize=11)
ax2.set_title('Sound Energy Distribution (log scale)', fontsize=12)
plt.colorbar(c, ax=ax2, label='Log energy')
ax2.set_aspect('equal')

plt.tight_layout()
plt.show()

# Statistics
print(f"Rays traced: {n_rays}")
print(f"Max bounces: {max_bounces}")
print(f"Energy range: {energy_map.min():.1f} to {energy_map.max():.1f}")
print(f"Uniformity (std/mean): {energy_map.std()/energy_map.mean():.2f}")
print("Lower uniformity ratio = more even sound distribution")`,
      challenge: 'Add a semicircular apse (dome niche) at the imam’s end and trace how it focuses reflections. Compare the energy distribution with and without the apse. Does it improve coverage at the back of the mosque?',
      successHint: 'Acoustic ray tracing is the standard method in professional room acoustics software. ODEON, EASE, and CATT-Acoustic all use variations of this technique to design concert halls, mosques, and stadiums worldwide.',
    },
    {
      title: 'Impulse response — the acoustic DNA of a room',
      concept: `If you clap your hands once in a room, the sound that reaches a microphone is called the **impulse response** (IR). It contains ALL information about the room’s acoustics: every reflection, every echo, every resonance.

An IR starts with the **direct sound** (the first arrival), followed by **early reflections** (0-80 ms), then a gradually decaying tail of **late reverberation**. From the IR, you can calculate every acoustic metric: RT60, C80, D50, STI (speech intelligibility).

The revolutionary insight: if you **convolve** any dry recording with a room’s impulse response, the result sounds exactly as if the original sound had been produced in that room. This is how movie sound designers place dialogue in virtual spaces and how musicians add "reverb" from famous concert halls.

The code generates a synthetic impulse response and calculates acoustic metrics.`,
      analogy: 'An impulse response is like a room’s fingerprint. Just as a fingerprint uniquely identifies a person, the IR uniquely identifies how a room shapes sound. Record the fingerprint (clap and measure), and you can predict how any sound will behave in that room, forever, without being there.',
      storyConnection: 'Acoustic researchers have recorded impulse responses inside the Süleymaniye, the Blue Mosque, and dozens of other Ottoman mosques. These IRs are preserved in databases. By convolving a recording of a Muezzin’s voice with the mosque’s IR, researchers can hear exactly what the congregation would have heard 500 years ago — even from a laboratory.',
      checkQuestion: 'If a room’s impulse response is 3 seconds long and the direct sound is 10 dB stronger than the strongest early reflection, what does this tell you about the room?',
      checkAnswer: 'A 3-second IR indicates significant reverberation (RT60 around 3s). The 10 dB difference between direct and first reflection means the nearest reflective surface is relatively far away (sound has spread and weakened before the first bounce). This suggests a large room with distant walls — consistent with a cathedral or large mosque. Good for music, but speech intelligibility may suffer.',
      codeIntro: 'Generate a synthetic impulse response and extract acoustic metrics.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fs = 44100  # sample rate
duration = 3.0  # seconds
n_samples = int(fs * duration)
t = np.arange(n_samples) / fs

# Build synthetic impulse response
ir = np.zeros(n_samples)

# Direct sound at t=0
ir[0] = 1.0

# Early reflections (first 80ms)
early_times = [0.012, 0.018, 0.025, 0.033, 0.042, 0.055, 0.063, 0.075]
early_amps = [0.5, 0.35, 0.45, 0.3, 0.25, 0.35, 0.2, 0.15]
for et, ea in zip(early_times, early_amps):
    idx = int(et * fs)
    if idx < n_samples:
        ir[idx] = ea * (1 if np.random.random() > 0.5 else -1)

# Late reverberation: exponentially decaying noise
rt60 = 2.5  # seconds
decay_rate = 6.91 / rt60  # natural log decay for 60 dB
noise = np.random.randn(n_samples) * 0.1
late_start = int(0.08 * fs)
envelope = np.exp(-decay_rate * t)
ir[late_start:] += noise[late_start:] * envelope[late_start:]

# Normalize
ir = ir / np.max(np.abs(ir))

fig, axes = plt.subplots(2, 2, figsize=(13, 9))

# Full IR
axes[0,0].plot(t * 1000, ir, color='#3b82f6', linewidth=0.5)
axes[0,0].set_xlabel('Time (ms)', fontsize=10)
axes[0,0].set_ylabel('Amplitude', fontsize=10)
axes[0,0].set_title('Full Impulse Response', fontsize=12)
axes[0,0].grid(alpha=0.2)

# Early part (first 100ms)
early_mask = t < 0.1
axes[0,1].plot(t[early_mask] * 1000, ir[early_mask], color='#10b981', linewidth=1.5)
axes[0,1].axvline(50, color='#f59e0b', linewidth=1, linestyle='--', alpha=0.5)
axes[0,1].axvline(80, color='#ef4444', linewidth=1, linestyle='--', alpha=0.5)
axes[0,1].text(52, 0.5, 'D50', color='#f59e0b', fontsize=10)
axes[0,1].text(82, 0.5, 'C80', color='#ef4444', fontsize=10)
axes[0,1].set_xlabel('Time (ms)', fontsize=10)
axes[0,1].set_ylabel('Amplitude', fontsize=10)
axes[0,1].set_title('Early Reflections (first 100ms)', fontsize=12)
axes[0,1].grid(alpha=0.2)

# Energy decay curve (Schroeder integration)
energy = ir**2
cumulative_reverse = np.cumsum(energy[::-1])[::-1]
edc = 10 * np.log10(cumulative_reverse / cumulative_reverse[0] + 1e-10)

axes[1,0].plot(t, edc, color='#a855f7', linewidth=2)
axes[1,0].axhline(-60, color='#ef4444', linewidth=1, linestyle='--')
axes[1,0].text(0.1, -57, '-60 dB (RT60)', color='#ef4444', fontsize=10)
# Find RT60
rt60_idx = np.where(edc < -60)[0]
measured_rt60 = t[rt60_idx[0]] if len(rt60_idx) > 0 else duration
axes[1,0].axvline(measured_rt60, color='#f59e0b', linewidth=1, linestyle=':')
axes[1,0].text(measured_rt60 + 0.05, -30, f'RT60={measured_rt60:.2f}s', color='#f59e0b', fontsize=10)
axes[1,0].set_xlabel('Time (s)', fontsize=10)
axes[1,0].set_ylabel('Energy (dB)', fontsize=10)
axes[1,0].set_title('Energy Decay Curve (Schroeder)', fontsize=12)
axes[1,0].set_ylim(-80, 0)
axes[1,0].grid(alpha=0.2)

# Metrics bar chart
e_50 = np.sum(ir[:int(0.050*fs)]**2)
e_80 = np.sum(ir[:int(0.080*fs)]**2)
e_total = np.sum(ir**2)
e_late = e_total - e_80

C80 = 10 * np.log10(e_80 / max(e_late, 1e-10))
D50 = e_50 / e_total

metrics = {'RT60 (s)': measured_rt60, 'C80 (dB)': C80, 'D50': D50}
bars = axes[1,1].bar(metrics.keys(), metrics.values(),
                     color=['#3b82f6', '#10b981', '#f59e0b'], width=0.5, edgecolor='none')
for bar, val in zip(bars, metrics.values()):
    axes[1,1].text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.1,
                   f'{val:.2f}', ha='center', fontsize=12, color='white', fontweight='bold')
axes[1,1].set_title('Acoustic Metrics', fontsize=12)
axes[1,1].grid(axis='y', alpha=0.3)

plt.tight_layout()
plt.show()

print(f"RT60 = {measured_rt60:.2f} s (target for mosque: 1.0-2.0 s)")
print(f"C80  = {C80:.1f} dB (speech clarity: > 0 dB is good)")
print(f"D50  = {D50:.2f} (definition: > 0.50 is good for speech)")`,
      challenge: 'Modify the impulse response to simulate a smaller room (RT60 = 0.8s) with stronger early reflections. How do C80 and D50 change? Now simulate a cathedral (RT60 = 6s) and compare.',
      successHint: 'Impulse responses are the bridge between acoustic measurement and audio engineering. With a room’s IR, you can simulate, analyse, and auralize any acoustic scenario — the same technique used by architects, sound designers, and musicians worldwide.',
    },
    {
      title: 'Reverberation time — Eyring’s equation for non-uniform absorption',
      concept: `Sabine’s equation (RT60 = 0.161V/A) assumes low absorption. In rooms with significant absorption (like a studio with acoustic treatment), it overestimates reverb time.

**Eyring’s equation** corrects this:

**RT60 = 0.161 × V / (-S × ln(1 - α_avg))**

Where S is total surface area and α_avg is the average absorption coefficient.

When α_avg is small, ln(1 - α) ≈ -α, and Eyring reduces to Sabine. But for α_avg > 0.3, Sabine significantly overestimates RT60.

Additionally, **air absorption** at high frequencies matters in large rooms:

**RT60 = 0.161 × V / (-S × ln(1 - α_avg) + 4mV)**

Where m is the air absorption coefficient (depends on humidity and temperature). At 4 kHz in a large mosque, air absorption can reduce RT60 by 20-30%.`,
      analogy: 'Sabine assumed each sound reflection only loses a little energy (like a ball barely losing speed on each bounce). Eyring realised that if the walls are very absorptive (like a ball hitting a soft mattress), the loss per bounce is much larger and the ball stops sooner than Sabine predicted. The correction matters when the room is heavily treated.',
      storyConnection: 'The Süleymaniye Mosque has a measured RT60 of about 5.5 seconds at 125 Hz but only 2.5 seconds at 2 kHz. This frequency-dependent reverb is partly due to air absorption (significant at 2 kHz in a 29,000 m³ space) and partly because the thick carpets absorb high frequencies much more than low frequencies. Eyring’s equation with air absorption matches the measured data much better than Sabine’s.',
      checkQuestion: 'A recording studio has α_avg = 0.6 (heavily treated). What does Sabine predict vs Eyring? Which is more accurate?',
      checkAnswer: 'For a 200 m³ room with S = 250 m²: Sabine: RT60 = 0.161 × 200 / (250 × 0.6) = 0.21 s. Eyring: RT60 = 0.161 × 200 / (-250 × ln(0.4)) = 0.161 × 200 / (250 × 0.916) = 0.14 s. Sabine overestimates by 50%. Eyring is correct for this heavily absorptive room.',
      codeIntro: 'Compare Sabine and Eyring predictions across absorption levels.',
      code: `import numpy as np
import matplotlib.pyplot as plt

V = 12000  # m^3 (large mosque)
S = 3500   # m^2 total surface area

alpha_range = np.linspace(0.01, 0.8, 200)

# Sabine
rt_sabine = 0.161 * V / (S * alpha_range)

# Eyring
rt_eyring = 0.161 * V / (-S * np.log(1 - alpha_range))

# Eyring with air absorption at 2 kHz
m_air = 0.01  # air absorption at 2 kHz, 50% RH
rt_eyring_air = 0.161 * V / (-S * np.log(1 - alpha_range) + 4 * m_air * V)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5))

ax1.plot(alpha_range, rt_sabine, color='#ef4444', linewidth=2.5, label='Sabine')
ax1.plot(alpha_range, rt_eyring, color='#3b82f6', linewidth=2.5, label='Eyring')
ax1.plot(alpha_range, rt_eyring_air, color='#10b981', linewidth=2.5, label='Eyring + air absorption')
ax1.set_xlabel('Average absorption coefficient', fontsize=11)
ax1.set_ylabel('RT60 (seconds)', fontsize=11)
ax1.set_title('Sabine vs Eyring: Reverberation Time', fontsize=12)
ax1.legend(fontsize=10)
ax1.set_ylim(0, 15)
ax1.grid(alpha=0.3)

# Frequency-dependent RT60 for the mosque
freqs = [125, 250, 500, 1000, 2000, 4000]
alpha_freq = [0.05, 0.08, 0.12, 0.18, 0.25, 0.30]  # carpet + marble + plaster average
m_freq = [0.001, 0.002, 0.004, 0.007, 0.012, 0.025]  # air absorption

rt_sabine_f = [0.161 * V / (S * a) for a in alpha_freq]
rt_eyring_f = [0.161 * V / (-S * np.log(1-a) + 4*m*V)
               for a, m in zip(alpha_freq, m_freq)]

# Measured data (approximate for Suleymaniye)
rt_measured = [5.5, 4.8, 3.8, 3.0, 2.5, 1.8]

ax2.plot(freqs, rt_sabine_f, 'o--', color='#ef4444', linewidth=2, label='Sabine')
ax2.plot(freqs, rt_eyring_f, 's-', color='#3b82f6', linewidth=2.5, label='Eyring + air')
ax2.plot(freqs, rt_measured, 'D-', color='#10b981', linewidth=2.5, label='Measured')
ax2.set_xlabel('Frequency (Hz)', fontsize=11)
ax2.set_ylabel('RT60 (seconds)', fontsize=11)
ax2.set_title('Frequency-Dependent RT60: Süleymaniye Mosque', fontsize=12)
ax2.set_xscale('log')
ax2.legend(fontsize=10)
ax2.grid(alpha=0.3)

plt.tight_layout()
plt.show()

print("=== Sabine vs Eyring vs Measured ===")
for f, rs, re, rm in zip(freqs, rt_sabine_f, rt_eyring_f, rt_measured):
    err_s = abs(rs - rm) / rm * 100
    err_e = abs(re - rm) / rm * 100
    print(f"  {f:>5} Hz: Sabine={rs:.1f}s (err {err_s:.0f}%), Eyring+air={re:.1f}s (err {err_e:.0f}%), Measured={rm:.1f}s")`,
      challenge: 'The mosque is getting new carpet that has α = 0.7 at 2 kHz instead of 0.5. Recalculate the frequency-dependent RT60 and plot the change. Does the new carpet bring the mosque closer to the ideal speech range?',
      successHint: 'Eyring’s correction is standard practice for any room with significant absorption. Understanding when Sabine fails and Eyring succeeds is essential for accurate acoustic design. Air absorption becomes critical in large spaces like mosques, cathedrals, and concert halls.',
    },
    {
      title: 'Noise cancellation — active control using anti-phase signals',
      concept: `Active noise cancellation (ANC) uses **destructive interference** to silence unwanted sound. A microphone detects the noise, a processor computes the exact anti-phase signal (same amplitude, opposite polarity), and a speaker outputs it. When the noise and anti-noise meet: cancellation.

For a simple sine wave at frequency f, the anti-noise is phase-shifted by 180°:
**anti_noise(t) = -noise(t) = A sin(2πft + π)**

For complex noise, the system must compute the anti-signal in real time using digital signal processing (DSP). The challenge is **latency** — the anti-signal must arrive at the ear within microseconds of the noise, or the cancellation is incomplete.

ANC works best for low frequencies (λ > head size) where the sound field is relatively uniform. For high frequencies, the wavefield varies rapidly across small distances and cancellation is impractical.`,
      analogy: 'Imagine someone pushing you forward. If an equally strong person pushes you backward at exactly the same moment, you stay still. Active noise cancellation is the same: the speaker pushes air molecules in the exact opposite direction of the noise. The two pushes cancel, and you hear silence. But if the anti-push is even slightly late, you feel a jolt — imperfect cancellation.',
      storyConnection: 'Some modern mosques in dense urban areas use active noise control to address two problems: (1) reducing traffic noise inside the mosque during prayers, and (2) reducing the Adhan’s level in nearby apartments without reducing it for the intended audience. Directional ANC arrays on the minaret can create "zones of silence" in specific directions.',
      checkQuestion: 'Why can’t noise-cancelling headphones eliminate all sounds perfectly?',
      checkAnswer: 'Three reasons: (1) High frequencies have short wavelengths, so the noise field varies rapidly across the headphone’s microphone-to-ear distance — the anti-signal cannot match everywhere. (2) Processing latency means the anti-signal is always slightly late. (3) Sudden, impulsive sounds (claps, speech) change too fast for the system to track. ANC is best for steady, low-frequency noise (engine hum, air conditioning, traffic drone).',
      codeIntro: 'Simulate active noise cancellation for steady and variable noise.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fs = 44100
t = np.linspace(0, 0.05, int(fs * 0.05))  # 50 ms

# Scenario 1: Perfect cancellation of pure tone
f_noise = 200  # Hz
noise = np.sin(2 * np.pi * f_noise * t)
anti_noise = -noise
result_perfect = noise + anti_noise

# Scenario 2: Slight delay in anti-signal (0.5 ms)
delay_samples = int(0.0005 * fs)
anti_delayed = np.zeros_like(noise)
anti_delayed[delay_samples:] = -noise[:-delay_samples]
result_delayed = noise + anti_delayed

# Scenario 3: Complex noise (multiple frequencies)
noise_complex = (np.sin(2*np.pi*100*t) + 0.5*np.sin(2*np.pi*300*t) +
                 0.3*np.sin(2*np.pi*800*t) + 0.2*np.sin(2*np.pi*2000*t))
# ANC only cancels low frequencies effectively
anti_complex = -(np.sin(2*np.pi*100*t) + 0.5*np.sin(2*np.pi*300*t))
result_complex = noise_complex + anti_complex

fig, axes = plt.subplots(3, 1, figsize=(12, 9), sharex=True)

# Perfect
axes[0].plot(t*1000, noise, color='#ef4444', linewidth=1.5, alpha=0.7, label='Noise')
axes[0].plot(t*1000, anti_noise, color='#3b82f6', linewidth=1.5, alpha=0.7, label='Anti-noise')
axes[0].plot(t*1000, result_perfect, color='#10b981', linewidth=2.5, label='Result')
axes[0].set_title('Perfect ANC: complete silence', fontsize=12)
axes[0].legend(fontsize=9, loc='upper right')
axes[0].set_ylabel('Amplitude', fontsize=10)
axes[0].grid(alpha=0.2)

# Delayed
axes[1].plot(t*1000, noise, color='#ef4444', linewidth=1.5, alpha=0.7, label='Noise')
axes[1].plot(t*1000, anti_delayed, color='#3b82f6', linewidth=1.5, alpha=0.7, label='Anti (0.5ms late)')
axes[1].plot(t*1000, result_delayed, color='#f59e0b', linewidth=2, label='Result')
residual_db = 20*np.log10(np.sqrt(np.mean(result_delayed**2)) / np.sqrt(np.mean(noise**2)) + 1e-10)
axes[1].set_title(f'Delayed ANC: {residual_db:.1f} dB reduction', fontsize=12)
axes[1].legend(fontsize=9, loc='upper right')
axes[1].set_ylabel('Amplitude', fontsize=10)
axes[1].grid(alpha=0.2)

# Complex
axes[2].plot(t*1000, noise_complex, color='#ef4444', linewidth=1.5, alpha=0.7, label='Complex noise')
axes[2].plot(t*1000, result_complex, color='#a855f7', linewidth=2, label='After low-freq ANC')
residual_c = 20*np.log10(np.sqrt(np.mean(result_complex**2)) / np.sqrt(np.mean(noise_complex**2)) + 1e-10)
axes[2].set_title(f'Partial ANC (low freq only): {residual_c:.1f} dB reduction', fontsize=12)
axes[2].legend(fontsize=9, loc='upper right')
axes[2].set_xlabel('Time (ms)', fontsize=11)
axes[2].set_ylabel('Amplitude', fontsize=10)
axes[2].grid(alpha=0.2)

plt.tight_layout()
plt.show()

print("=== ANC Performance ===")
print(f"  Perfect (0 delay): complete cancellation")
print(f"  0.5ms delay: {residual_db:.1f} dB reduction")
print(f"  Low-freq only: {residual_c:.1f} dB reduction (high freq remains)")
print()
print("Real headphones achieve 20-30 dB reduction below 500 Hz")
print("Above 1 kHz, passive isolation (ear cushion) does better")`,
      challenge: 'Add adaptive filtering: at each sample, adjust the anti-noise amplitude to minimize the error signal. Implement a simple LMS (Least Mean Squares) adaptive filter and show it converging on the correct anti-signal over time.',
      successHint: 'Active noise cancellation is one of the most elegant applications of superposition. It is used in headphones, car cabins, MRI machines, and increasingly in urban noise management. The same DSP principles apply to vibration control, radar jamming, and echo cancellation in phone calls.',
    },
    {
      title: 'Acoustic metamaterials — engineering materials to control sound',
      concept: `**Acoustic metamaterials** are engineered structures with properties not found in nature. They can bend sound around obstacles (acoustic cloaking), focus sound to a point smaller than a wavelength (super-resolution), and block specific frequencies while passing others (acoustic band gaps).

The key idea: arrange small resonant structures (tubes, cavities, membranes) in a periodic pattern. When the spacing is smaller than the wavelength, the array behaves as a bulk material with custom-designed effective density and bulk modulus.

**Helmholtz resonators** — the clay jars Sinan may have used — are a simple example. Each jar resonates at a specific frequency, absorbing that frequency while passing others. An array of jars tuned to different frequencies creates a broadband absorber.

Modern metamaterials use 3D-printed structures with labyrinthine channels that force sound waves through long, winding paths — achieving strong absorption in panels only centimetres thick.`,
      analogy: 'A prism bends light because glass has different optical properties from air. An acoustic metamaterial bends sound because its engineered microstructure creates effective properties (density, stiffness) that don’t exist in any natural material. Imagine creating a material so light that sound speeds up inside it, or so dense that sound slows to a crawl — metamaterials make both possible.',
      storyConnection: 'Sinan’s alleged use of embedded clay jars is remarkably prescient. Each jar acts as a Helmholtz resonator: air vibrates in the jar’s neck at a frequency determined by the neck dimensions and cavity volume. The resonating air absorbs energy from the room’s sound field at that frequency. Modern acoustic metamaterials extend this idea from individual jars to engineered arrays that can control sound in ways Sinan could not have imagined.',
      checkQuestion: 'A Helmholtz resonator has a cavity volume of 500 cm³ and a neck of radius 1 cm and length 3 cm. What is its resonant frequency?',
      checkAnswer: 'f = (v/2π) × √(A/(V×L_eff)) where A = πr², L_eff = L + 1.7r. A = π(0.01)² = 3.14×10⁻⁴ m², V = 5×10⁻⁴ m³, L_eff = 0.03 + 0.017 = 0.047 m. f = (343/2π) × √(3.14×10⁻⁴ / (5×10⁻⁴ × 0.047)) = 54.6 × √(13.36) = 54.6 × 3.66 ≈ 200 Hz. This is in the speech fundamental range.',
      codeIntro: 'Model Helmholtz resonator arrays and acoustic metamaterial absorption.',
      code: `import numpy as np
import matplotlib.pyplot as plt

v_sound = 343

def helmholtz_freq(V_cm3, r_cm, L_cm):
    """Resonant frequency of a Helmholtz resonator"""
    V = V_cm3 * 1e-6  # m^3
    r = r_cm * 0.01   # m
    L = L_cm * 0.01   # m
    A = np.pi * r**2
    L_eff = L + 1.7 * r  # end correction
    f = (v_sound / (2 * np.pi)) * np.sqrt(A / (V * L_eff))
    return f

# Array of resonators tuned to different frequencies
resonators = [
    (800, 1.5, 4, 'Large jar'),   # low frequency
    (400, 1.2, 3, 'Medium jar'),
    (200, 1.0, 2.5, 'Small jar'),
    (100, 0.8, 2, 'Tiny jar'),
]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5))

freqs = np.linspace(50, 2000, 1000)
total_absorption = np.zeros_like(freqs)

colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6']
for (V, r, L, name), col in zip(resonators, colors):
    f0 = helmholtz_freq(V, r, L)
    Q = 8  # quality factor
    # Absorption spectrum of resonator
    absorption = 1 / (1 + Q**2 * (freqs/f0 - f0/freqs)**2)
    total_absorption += absorption * 0.3  # weighted

    ax1.plot(freqs, absorption, color=col, linewidth=2, label=f'{name} (f₀={f0:.0f} Hz)')
    ax1.axvline(f0, color=col, linewidth=0.5, linestyle=':', alpha=0.3)

ax1.set_xlabel('Frequency (Hz)', fontsize=11)
ax1.set_ylabel('Absorption coefficient', fontsize=11)
ax1.set_title('Individual Helmholtz Resonators', fontsize=12)
ax1.legend(fontsize=9)
ax1.grid(alpha=0.3)

# Combined absorption
ax2.fill_between(freqs, 0, np.minimum(total_absorption, 1.0), color='#a855f7', alpha=0.3)
ax2.plot(freqs, np.minimum(total_absorption, 1.0), color='#a855f7', linewidth=2.5,
         label='Combined array')

# Compare with plain plaster
ax2.axhline(0.03, color='#6b7280', linewidth=2, linestyle='--', label='Plain plaster')

ax2.set_xlabel('Frequency (Hz)', fontsize=11)
ax2.set_ylabel('Absorption coefficient', fontsize=11)
ax2.set_title('Resonator Array vs Plain Wall', fontsize=12)
ax2.legend(fontsize=10)
ax2.grid(alpha=0.3)
ax2.set_ylim(0, 1.1)

plt.tight_layout()
plt.show()

print("=== Helmholtz Resonator Frequencies ===")
for V, r, L, name in resonators:
    f0 = helmholtz_freq(V, r, L)
    print(f"  {name:12s}: V={V}cm³, r={r}cm, L={L}cm → f₀ = {f0:.0f} Hz")
print()
print("Array of 4 resonators provides broadband absorption from 100-600 Hz")
print("This is the principle behind Sinan’s embedded clay jars")`,
      challenge: 'Design a labyrinthine metamaterial panel that achieves α > 0.8 at 500 Hz in a panel only 5 cm thick (normally you need λ/4 = 17 cm). Model the sound path through a folded channel inside the panel.',
      successHint: 'Acoustic metamaterials are an active research frontier. They promise ultra-thin sound barriers, acoustic cloaking (making objects invisible to sonar), and perfect absorbers for specific frequencies. Sinan’s clay jars were 500 years ahead of their time.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced acoustics, ray tracing, and signal processing</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for advanced acoustic simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
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
            diagram={[MuezzinCityPropagationDiagram, MuezzinDomeAcousticsDiagram, MuezzinInverseSquareDiagram, MuezzinSpeakerDiagram, DiffractionDiagram, InterferenceDiagram][i] ? createElement([MuezzinCityPropagationDiagram, MuezzinDomeAcousticsDiagram, MuezzinInverseSquareDiagram, MuezzinSpeakerDiagram, DiffractionDiagram, InterferenceDiagram][i]) : undefined}
            />
        ))}
      </div>
    </div>
  );
}
