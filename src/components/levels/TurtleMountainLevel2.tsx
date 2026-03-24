import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function TurtleMountainLevel2() {
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState('');

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true); setLoadProgress('Loading Python...');
    try {
      if (!(window as any).loadPyodide) { const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js'; document.head.appendChild(s); await new Promise<void>((r, j) => { s.onload = () => r(); s.onerror = () => j(new Error('Failed')); }); }
      setLoadProgress('Starting Python...'); const py = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      setLoadProgress('Installing packages...'); await py.loadPackage('micropip'); const mp = py.pyimport('micropip');
      for (const p of ['numpy', 'matplotlib']) { try { await mp.install(p); } catch { await py.loadPackage(p).catch(() => {}); } }
      await py.runPythonAsync(`import sys,io\nclass OC:\n def __init__(self):self.o=[]\n def write(self,t):self.o.append(t)\n def flush(self):pass\n def get_output(self):return''.join(self.o)\n def clear(self):self.o=[]\n_stdout_capture=OC();sys.stdout=_stdout_capture;sys.stderr=_stdout_capture\nimport matplotlib;matplotlib.use('AGG');import matplotlib.pyplot as plt;import base64\ndef _get_plot_as_base64():\n buf=io.BytesIO();plt.savefig(buf,format='png',dpi=100,bbox_inches='tight',facecolor='#1f2937',edgecolor='none');buf.seek(0);s=base64.b64encode(buf.read()).decode('utf-8');plt.close('all');return s`);
      pyodideRef.current = py; setPyReady(true); setLoading(false); setLoadProgress(''); return py;
    } catch (e: any) { setLoading(false); setLoadProgress('Error: ' + e.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Seismic waves — P, S, and surface waves',
      concept: `When a fault ruptures, energy radiates outward as **seismic waves**. There are three main types, each with distinct physics:

**P-waves (Primary)**: compression waves — particles oscillate back and forth in the direction the wave travels (like a slinky pushed lengthwise). Fastest (5-8 km/s in crust). Travel through solids, liquids, and gases.

**S-waves (Secondary)**: shear waves — particles oscillate perpendicular to the wave direction (like shaking a rope sideways). Slower (3-4.5 km/s). Travel only through solids — they cannot pass through the liquid outer core.

**Surface waves**: travel along the Earth's surface.
- **Love waves**: horizontal shearing (side-to-side)
- **Rayleigh waves**: rolling motion (elliptical, like ocean waves)
- Slowest but most destructive because all their energy stays at the surface

The fact that S-waves cannot pass through the outer core is how we know it is liquid. P-waves slow and refract through it, creating a "shadow zone" on the opposite side of the Earth. This is seismology's greatest detective achievement.`,
      analogy: 'Imagine throwing a stone into a pond. The expanding ring on the surface is a surface wave. Now imagine the stone also sends a pulse through the water — compressing it outward (P-wave) and swirling it side-to-side (S-wave). All three travel at different speeds, so they arrive at different times. That arrival gap tells you how far away the stone landed.',
      storyConnection: 'When the turtle beneath the Bodo earth shifts, different types of trembling reach different places at different times. The first to arrive is a rumble (P-wave), then a jolt (S-wave), then a rolling motion (surface wave). Ancient observers noticed this sequence without knowing why.',
      checkQuestion: 'If P-waves travel at 6 km/s and S-waves at 3.5 km/s, and you feel the P-wave 10 seconds before the S-wave, how far away is the earthquake?',
      checkAnswer: 'Let d = distance. Time for P-wave = d/6. Time for S-wave = d/3.5. Difference = d/3.5 - d/6 = 10 seconds. Solving: d(1/3.5 - 1/6) = 10, d(0.2857 - 0.1667) = 10, d(0.119) = 10, d = 84 km. The P-S delay is the foundation of earthquake location.',
      codeIntro: 'Simulate P, S, and surface wave propagation and arrival times.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Wave propagation simulation
distance = np.linspace(0, 500, 1000)  # km from epicentre

# Wave speeds (km/s)
v_p = 6.0
v_s = 3.5
v_love = 2.8
v_rayleigh = 2.5

# Arrival times
t_p = distance / v_p
t_s = distance / v_s
t_love = distance / v_love
t_rayleigh = distance / v_rayleigh

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Travel-time curves
ax1.set_facecolor('#111827')
ax1.plot(distance, t_p, linewidth=2, color='#3b82f6', label=f'P-wave ({v_p} km/s)')
ax1.plot(distance, t_s, linewidth=2, color='#22c55e', label=f'S-wave ({v_s} km/s)')
ax1.plot(distance, t_love, linewidth=2, color='#f59e0b', label=f'Love wave ({v_love} km/s)')
ax1.plot(distance, t_rayleigh, linewidth=2, color='#ef4444', label=f'Rayleigh ({v_rayleigh} km/s)')

# Example: station at 200 km
d_example = 200
ax1.axvline(d_example, color='gray', linestyle=':', linewidth=1)
for v, label, c in [(v_p, 'P', '#3b82f6'), (v_s, 'S', '#22c55e'),
                     (v_love, 'Love', '#f59e0b'), (v_rayleigh, 'R', '#ef4444')]:
    t = d_example / v
    ax1.plot(d_example, t, 'o', color=c, markersize=6)
    ax1.annotate(f'{label}: {t:.1f}s', xy=(d_example, t), xytext=(d_example + 20, t),
                 color=c, fontsize=8)

ax1.set_xlabel('Distance from epicentre (km)', color='white')
ax1.set_ylabel('Arrival time (seconds)', color='white')
ax1.set_title('Seismic Wave Travel-Time Curves', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Seismogram at 200 km (simulated)
ax2.set_facecolor('#111827')
time = np.linspace(0, 250, 5000)
seismogram = np.zeros_like(time)

def wave_packet(t, arrival, freq, amplitude, duration):
    mask = (t >= arrival) & (t < arrival + duration)
    signal = np.zeros_like(t)
    signal[mask] = amplitude * np.sin(2 * np.pi * freq * (t[mask] - arrival)) * \
                   np.exp(-2 * (t[mask] - arrival) / duration)
    return signal

seismogram += wave_packet(time, d_example/v_p, 5.0, 0.3, 15)        # P-wave
seismogram += wave_packet(time, d_example/v_s, 3.0, 0.6, 20)        # S-wave
seismogram += wave_packet(time, d_example/v_love, 1.5, 0.8, 30)     # Love
seismogram += wave_packet(time, d_example/v_rayleigh, 1.0, 1.0, 35) # Rayleigh

ax2.plot(time, seismogram, color='white', linewidth=0.5)
ax2.fill_between(time, seismogram, alpha=0.3, color='#f59e0b')

arrivals = [(d_example/v_p, 'P', '#3b82f6'), (d_example/v_s, 'S', '#22c55e'),
            (d_example/v_love, 'Love', '#f59e0b'), (d_example/v_rayleigh, 'R', '#ef4444')]
for t_arr, label, c in arrivals:
    ax2.axvline(t_arr, color=c, linestyle='--', linewidth=1)
    ax2.text(t_arr + 1, 0.9, label, color=c, fontsize=10, fontweight='bold')

ax2.set_xlabel('Time (seconds)', color='white')
ax2.set_ylabel('Ground motion', color='white')
ax2.set_title(f'Simulated Seismogram at {d_example} km', color='white', fontsize=13)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

ps_delay = d_example/v_s - d_example/v_p
print(f"At {d_example} km from the epicentre:")
print(f"  P-wave arrives at: {d_example/v_p:.1f} s")
print(f"  S-wave arrives at: {d_example/v_s:.1f} s")
print(f"  P-S delay: {ps_delay:.1f} s")
print(f"  Estimated distance from P-S delay: {ps_delay / (1/v_s - 1/v_p):.0f} km")`,
      challenge: 'Write code to calculate the distance from the P-S delay for delays of 5, 10, 20, and 40 seconds. At what delay does the earthquake become "distant" (>500 km)?',
      successHint: 'The P-S delay is the most fundamental measurement in seismology. A single seismometer with a clock can estimate earthquake distance. Three seismometers can pinpoint the epicentre through triangulation.',
    },
    {
      title: 'Richter scale vs moment magnitude — measuring earthquake size',
      concept: `The **Richter scale** (ML) was developed in 1935 by Charles Richter. It measures the amplitude of seismic waves recorded on a specific instrument (the Wood-Anderson seismograph) at a standard distance. It works well for local, moderate earthquakes but "saturates" above magnitude 7 — it underestimates the true size of great earthquakes.

The **moment magnitude scale** (Mw) replaced it in the 1970s. It is based on the **seismic moment**: M0 = rigidity * fault area * average slip. This is a direct physical measure of the earthquake's energy, not an instrument reading.

Mw = (2/3) * log10(M0) - 10.7

Key properties of Mw:
- Does not saturate at any magnitude
- Directly tied to the physical fault parameters
- Each whole number increase = 31.6x more energy
- Two whole numbers = 1000x more energy

Both scales give similar numbers for small-to-moderate earthquakes (Mw 3-7). They diverge significantly for large events. The 2004 Indian Ocean earthquake was ML ~8.0 but Mw 9.1 — a massive underestimate on the Richter scale.`,
      analogy: 'The Richter scale is like measuring a race car\'s speed by how loud its engine sounds. Works fine at normal speeds, but at 300 km/h, the sound maxes out — you can\'t tell 300 from 400 by ear. Moment magnitude is like reading the actual speedometer. It measures the real physical quantity, not a proxy.',
      storyConnection: 'If the Bodo turtle carried mountains of different sizes, we would need a way to describe how big each "turtle shift" was. The Richter scale was the first attempt; moment magnitude was the refinement. Both try to answer the question the story raises: how big was the trembling?',
      checkQuestion: 'The 1897 Shillong earthquake was originally estimated at ML 8.1. Modern recalculation using Mw gives 8.0. Why might the original Richter estimate be slightly high?',
      checkAnswer: 'For earthquakes near Mw 8, the Richter scale and Mw are close but can differ depending on local site effects, instrument calibration, and the frequency content of the waves. The original 1897 instruments were crude by modern standards, and the conversion from historical records to magnitude involves assumptions. The Mw 8.0 estimate is likely more accurate.',
      codeIntro: 'Compare Richter and moment magnitude scales, and show the energy relationship.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Moment magnitude: Mw = (2/3) * log10(M0) - 10.7
# Energy: log10(E) = 1.5 * Mw + 4.8

mw_range = np.linspace(2, 10, 200)

# Energy in Joules
energy = 10 ** (1.5 * mw_range + 4.8)

# Seismic moment
M0 = 10 ** (1.5 * (mw_range + 10.7))

# Richter scale (saturates above ~7)
# Simplified saturation model
ml_range = np.where(mw_range < 7, mw_range, 7 + 0.3 * np.log10(10**(mw_range - 7)))

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Mw vs ML comparison
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.plot(mw_range, mw_range, '--', color='gray', linewidth=1, label='Perfect agreement')
ax.plot(mw_range, ml_range, color='#ef4444', linewidth=2, label='Richter (ML) — saturates')
ax.plot(mw_range, mw_range, color='#22c55e', linewidth=2, label='Moment magnitude (Mw)')
ax.set_xlabel('True earthquake size', color='white')
ax.set_ylabel('Measured magnitude', color='white')
ax.set_title('Richter vs Moment Magnitude', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')
ax.annotate('Saturation zone', xy=(8.5, 7.5), color='#ef4444', fontsize=10)

# Energy vs magnitude
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.plot(mw_range, energy, color='#f59e0b', linewidth=2)
ax.set_yscale('log')
ax.set_xlabel('Moment Magnitude (Mw)', color='white')
ax.set_ylabel('Energy (Joules)', color='white')
ax.set_title('Energy Released vs Magnitude', color='white', fontsize=12)
ax.tick_params(colors='gray')

# Mark notable earthquakes
notable = [(5.0, 'Moderate'), (6.7, '2016 Manipur'), (8.0, '1897 Shillong'),
           (8.6, '1950 Assam'), (9.1, '2004 Indian Ocean')]
for mw, name in notable:
    e = 10 ** (1.5 * mw + 4.8)
    ax.plot(mw, e, 'o', color='#ef4444', markersize=6)
    ax.annotate(name, xy=(mw, e), xytext=(mw - 0.5, e * 10),
                color='white', fontsize=7, fontweight='bold')

# Energy ratio visualization
ax = axes[1, 0]
ax.set_facecolor('#111827')
ref_mw = 5
magnitudes = [5, 6, 7, 8, 9]
ratios = [10 ** (1.5 * (m - ref_mw)) for m in magnitudes]
colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7']
bars = ax.bar([f'Mw {m}' for m in magnitudes], ratios, color=colors)
ax.set_yscale('log')
ax.set_ylabel(f'Energy relative to Mw {ref_mw}', color='white')
ax.set_title('Energy Scaling (each +1 Mw = 31.6x energy)', color='white', fontsize=12)
ax.tick_params(colors='gray')
for bar, r in zip(bars, ratios):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() * 1.5,
            f'{r:,.0f}x', ha='center', color='white', fontsize=9)

# Fault parameters for each magnitude
ax = axes[1, 1]
ax.set_facecolor('#111827')
fault_mags = [5, 6, 7, 8, 9]
fault_lengths = [5, 15, 70, 200, 800]    # km (approximate)
fault_slips = [0.1, 0.5, 2, 5, 15]       # metres

x_pos = np.arange(len(fault_mags))
w = 0.35
ax.bar(x_pos - w/2, fault_lengths, w, color='#3b82f6', label='Fault length (km)')
ax.bar(x_pos + w/2, [s * 20 for s in fault_slips], w, color='#f59e0b', label='Slip x20 (m)')
ax.set_xticks(x_pos)
ax.set_xticklabels([f'Mw {m}' for m in fault_mags], color='white')
ax.set_ylabel('Value', color='white')
ax.set_title('Fault Parameters by Magnitude', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Moment magnitude is derived from physical fault properties:")
print("  Mw = (2/3) * log10(rigidity * area * slip) - 10.7")
print()
for m, l, s in zip(fault_mags, fault_lengths, fault_slips):
    print(f"  Mw {m}: fault ~{l} km long, ~{s} m of slip")`,
      challenge: 'Calculate how many Mw 5 earthquakes it would take to release the same energy as one Mw 9. (Answer: about 1 million.) Show this calculation.',
      successHint: 'Moment magnitude replaced the Richter scale because it measures the actual physics of the earthquake, not an instrument reading. For great earthquakes (Mw 8+), the difference between the two scales can be the difference between adequate and catastrophically inadequate preparation.',
    },
    {
      title: 'Seismograph design — how we record earthquakes',
      concept: `A **seismograph** records ground motion by exploiting inertia. The basic principle: suspend a heavy mass from a frame bolted to the ground. When the ground shakes, the frame moves but the mass (due to inertia) tends to stay still. The relative motion between mass and frame is the seismogram.

**Short-period seismograph**: stiff spring, records high-frequency vibrations (>1 Hz). Good for local earthquakes.
**Long-period seismograph**: soft spring or pendulum, records low-frequency motion (<1 Hz). Good for distant and deep earthquakes.
**Broadband seismograph**: electronic feedback system that records the full range (0.01-50 Hz). The modern standard.

Key components:
- **Sensor** (seismometer): mass-spring system that converts ground motion to electrical signal
- **Amplifier**: boosts the tiny electrical signal
- **ADC** (analog-to-digital converter): converts voltage to numbers (typically 24-bit, sampling at 100 Hz)
- **Timing**: GPS clock for precise timestamps (accuracy ~1 microsecond)
- **Recording**: data stored locally and transmitted to a network

A modern seismograph can detect ground motion of **0.1 nanometres** — less than the diameter of an atom. It can record an earthquake on the other side of the planet.`,
      analogy: 'A seismograph is like a pen suspended from the ceiling over a moving table. If you shake the table (earthquake), the pen stays relatively still (inertia) and draws a wiggly line on the moving paper (seismogram). The pen is the mass, the table is the ground, and the paper is the recording device.',
      storyConnection: 'The Bodo people could feel the turtle shifting — their bodies were the seismograph. Modern instruments extend this human sense to detect trembling too small to feel, too far away to notice, and too deep to hear. The seismograph is the scientific extension of the storyteller\'s awareness.',
      checkQuestion: 'Why do seismographs need three separate sensors — one for up-down, one for north-south, and one for east-west?',
      checkAnswer: 'Ground motion is a 3D vector. A single sensor only measures motion along one axis. You need three mutually perpendicular sensors to capture the full motion: vertical (Z), north-south (N), and east-west (E). Together, they let you reconstruct the complete ground displacement at any point in time.',
      codeIntro: 'Simulate a seismograph as a damped harmonic oscillator responding to ground motion.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Seismograph model: damped harmonic oscillator
# m*x'' + c*x' + k*x = -m*a_ground
# x = relative displacement between mass and frame

dt = 0.001  # 1000 Hz sampling
time = np.arange(0, 30, dt)

# Ground acceleration: earthquake pulse
a_ground = np.zeros_like(time)
# P-wave arrival at t=5
mask_p = (time >= 5) & (time < 8)
a_ground[mask_p] = 0.5 * np.sin(2 * np.pi * 5 * (time[mask_p] - 5)) * np.exp(-1.5 * (time[mask_p] - 5))
# S-wave arrival at t=10
mask_s = (time >= 10) & (time < 16)
a_ground[mask_s] = 1.5 * np.sin(2 * np.pi * 3 * (time[mask_s] - 10)) * np.exp(-(time[mask_s] - 10))
# Surface wave at t=15
mask_surf = (time >= 15) & (time < 25)
a_ground[mask_surf] = 2.0 * np.sin(2 * np.pi * 1.2 * (time[mask_surf] - 15)) * np.exp(-0.3 * (time[mask_surf] - 15))

def seismograph_response(a_ground, dt, natural_freq, damping):
    omega = 2 * np.pi * natural_freq
    x = np.zeros_like(a_ground)
    v = np.zeros_like(a_ground)
    for i in range(1, len(a_ground)):
        a = -omega**2 * x[i-1] - 2 * damping * omega * v[i-1] - a_ground[i]
        v[i] = v[i-1] + a * dt
        x[i] = x[i-1] + v[i] * dt
    return x

# Three different seismograph designs
short_period = seismograph_response(a_ground, dt, 10.0, 0.7)   # f=10Hz, high damping
long_period = seismograph_response(a_ground, dt, 0.5, 0.7)     # f=0.5Hz
broadband = seismograph_response(a_ground, dt, 3.0, 0.707)     # f=3Hz, critical damping

fig, axes = plt.subplots(4, 1, figsize=(13, 10), sharex=True)
fig.patch.set_facecolor('#1f2937')

# Ground acceleration
axes[0].set_facecolor('#111827')
axes[0].plot(time, a_ground, color='white', linewidth=0.5)
axes[0].fill_between(time, a_ground, alpha=0.3, color='#f59e0b')
axes[0].set_ylabel('Ground accel', color='white')
axes[0].set_title('Earthquake Ground Motion & Seismograph Responses', color='white', fontsize=13)
axes[0].tick_params(colors='gray')
axes[0].text(6, 0.4, 'P', color='#3b82f6', fontsize=12, fontweight='bold')
axes[0].text(12, 1.2, 'S', color='#22c55e', fontsize=12, fontweight='bold')
axes[0].text(18, 1.5, 'Surface', color='#ef4444', fontsize=12, fontweight='bold')

configs = [
    (short_period, 'Short-period (10 Hz)', '#3b82f6'),
    (long_period, 'Long-period (0.5 Hz)', '#22c55e'),
    (broadband, 'Broadband (3 Hz, critically damped)', '#f59e0b'),
]

for ax, (signal, label, color) in zip(axes[1:], configs):
    ax.set_facecolor('#111827')
    ax.plot(time, signal, color=color, linewidth=0.5)
    ax.fill_between(time, signal, alpha=0.2, color=color)
    ax.set_ylabel('Displacement', color='white')
    ax.set_title(label, color=color, fontsize=10)
    ax.tick_params(colors='gray')

axes[-1].set_xlabel('Time (seconds)', color='white')
plt.tight_layout()
plt.show()

print("Seismograph comparison:")
print(f"  Short-period: emphasizes P-wave (high frequency)")
print(f"  Long-period: emphasizes surface waves (low frequency)")
print(f"  Broadband: captures all phases equally (best overall)")
print()
print("Peak responses:")
print(f"  Short-period: {np.max(np.abs(short_period)):.4f}")
print(f"  Long-period:  {np.max(np.abs(long_period)):.4f}")
print(f"  Broadband:    {np.max(np.abs(broadband)):.4f}")`,
      challenge: 'Change the broadband damping from 0.707 (critical) to 0.3 (underdamped). What happens to the signal? Why is critical damping preferred?',
      successHint: 'The seismograph is one of the most sensitive instruments ever built. Its physics (damped harmonic oscillator) is the same physics used in car suspensions, loudspeakers, and atomic force microscopes.',
    },
    {
      title: 'Locating epicentres — triangulation with seismic data',
      concept: `To locate an earthquake's epicentre, you need data from at least **three seismograph stations**.

The method:
1. At each station, measure the P-S delay (time between P-wave and S-wave arrivals)
2. Convert the delay to distance: d = delay / (1/Vs - 1/Vp)
3. Draw a circle of that radius around each station on a map
4. The three circles intersect at one point — the epicentre

This is **triangulation** (technically trilateration). It works because each station gives you distance but not direction. One circle has infinite possible epicentres. Two circles narrow it to two points. Three circles give one unique point.

In practice, seismologists use dozens of stations and sophisticated algorithms to account for:
- Velocity variations in the crust (waves don't travel at constant speed)
- Depth of the focus (shallow vs. deep earthquakes)
- Station timing errors
- Crustal structure heterogeneity

Modern global networks can locate any earthquake above Mw 4 to within ~10 km, anywhere on Earth, within minutes.`,
      analogy: 'Triangulation is like hearing thunder from three different positions. At position A, the thunder is 3 seconds after lightning (storm is ~1 km away). At position B, it is 6 seconds (2 km away). At position C, it is 9 seconds (3 km away). Draw circles of 1, 2, and 3 km from A, B, and C respectively. Where they intersect is the lightning strike.',
      storyConnection: 'The Bodo people in different villages would have felt the turtle\'s shifting at different times and with different intensity. If they compared notes, they could triangulate the source of the shaking — "the turtle\'s heart." This is exactly what seismic networks do: combine observations from multiple locations to find the epicentre.',
      checkQuestion: 'What if only two stations record the earthquake? Can you still find the epicentre?',
      checkAnswer: 'Two stations give two possible locations (two intersection points of two circles). You need a third station to resolve the ambiguity. However, if you know the earthquake is on land (not in the ocean), or along a known fault, you can sometimes eliminate one of the two points using geological reasoning.',
      codeIntro: 'Demonstrate epicentre location by triangulation using three simulated stations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# True epicentre (unknown to stations)
epicentre = np.array([26.5, 92.8])  # lat, lon (somewhere in Assam)

# Three seismic stations
stations = {
    'Guwahati': np.array([26.14, 91.73]),
    'Shillong': np.array([25.57, 91.88]),
    'Tezpur': np.array([26.63, 92.80]),
}

v_p = 6.0  # km/s
v_s = 3.5  # km/s

# Calculate true distances and P-S delays
km_per_deg = 111.0  # approximate
print("Station data:")
distances = {}
for name, pos in stations.items():
    d_deg = np.sqrt((pos[0] - epicentre[0])**2 + (pos[1] - epicentre[1])**2)
    d_km = d_deg * km_per_deg
    ps_delay = d_km * (1/v_s - 1/v_p)
    distances[name] = d_km
    print(f"  {name}: distance={d_km:.1f} km, P-S delay={ps_delay:.1f} s")

fig, ax = plt.subplots(figsize=(10, 10))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827')

# Draw circles for each station
theta = np.linspace(0, 2 * np.pi, 200)
colors = ['#3b82f6', '#22c55e', '#f59e0b']
for (name, pos), d_km, c in zip(stations.items(), distances.values(), colors):
    r_deg = d_km / km_per_deg
    circle_lon = pos[1] + r_deg * np.cos(theta)
    circle_lat = pos[0] + r_deg * np.sin(theta)
    ax.plot(circle_lon, circle_lat, color=c, linewidth=2, label=f'{name} (r={d_km:.0f} km)')
    ax.plot(pos[1], pos[0], '^', color=c, markersize=12, markeredgecolor='white', markeredgewidth=1)
    ax.annotate(name, xy=(pos[1], pos[0]), xytext=(pos[1] + 0.05, pos[0] + 0.05),
                color=c, fontsize=10, fontweight='bold')

# True epicentre
ax.plot(epicentre[1], epicentre[0], '*', color='#ef4444', markersize=20,
        markeredgecolor='white', markeredgewidth=1, label='Epicentre', zorder=5)
ax.annotate('EPICENTRE', xy=(epicentre[1], epicentre[0]),
            xytext=(epicentre[1] + 0.1, epicentre[0] + 0.1),
            color='#ef4444', fontsize=11, fontweight='bold')

ax.set_xlabel('Longitude (°E)', color='white')
ax.set_ylabel('Latitude (°N)', color='white')
ax.set_title('Epicentre Location by Triangulation', color='white', fontsize=14)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax.set_aspect('equal')
ax.tick_params(colors='gray')
ax.grid(True, alpha=0.1)

plt.tight_layout()
plt.show()

print()
print("Triangulation method:")
print("  1. Measure P-S delay at each station")
print("  2. Convert delay to distance: d = delay / (1/Vs - 1/Vp)")
print("  3. Draw a circle of radius d around each station")
print("  4. The intersection point is the epicentre")
print()
print("With 3+ stations, this uniquely identifies the location.")`,
      challenge: 'Add a fourth station at Dibrugarh (27.47, 94.91). Does its circle also pass through the epicentre? In practice, four stations overdetermine the solution and reduce error.',
      successHint: 'Triangulation is the foundation of earthquake location, GPS navigation, cell tower positioning, and sonar. The same mathematical principle — intersecting circles (or spheres) — appears across science and engineering.',
    },
    {
      title: 'Earthquake prediction — the unsolved problem',
      concept: `Despite decades of research, **reliable earthquake prediction** (specifying the time, place, and magnitude in advance) remains impossible.

What we can do:
- **Hazard mapping**: identify which areas are most likely to experience earthquakes (seismic zoning). NE India is in Zone V — highest risk. This is statistical, not predictive.
- **Early warning**: after an earthquake starts, P-waves travel faster than destructive S-waves and surface waves. A sensor near the epicentre can send an electronic alert (at the speed of light) to distant cities before the damaging waves arrive. Japan's system gives Tokyo 15-60 seconds of warning.
- **Forecast probability**: "there is a 62% probability of a Mw 6.7+ earthquake in the San Francisco Bay Area before 2043." This is useful for policy but not for evacuation.

What does NOT work:
- Animal behaviour (no consistent, reproducible evidence)
- Groundwater changes (correlations exist but are unreliable predictors)
- Electromagnetic precursors (research ongoing, no operational system)

The fundamental problem: earthquakes are governed by **chaotic dynamics**. The stress state of a fault is unknowable at the resolution needed for prediction. Small variations in conditions lead to vastly different outcomes — the butterfly effect, applied to rock.`,
      analogy: 'Predicting an earthquake is like predicting exactly when a twig will snap when you bend it slowly. You know it will snap (the fault is stressed). You know roughly how much bending it can take (fault strength). But the exact moment of failure depends on microscopic flaws in the wood that you cannot see or measure. We predict "it will snap eventually" but not "it will snap at 3:47 PM."',
      storyConnection: 'The Bodo knew the turtle would shift — but not when. Modern seismology is in the same position: we know NE India will have a major earthquake, but we cannot predict the year, let alone the day. The turtle is unpredictable by nature. So is the fault.',
      checkQuestion: 'Japan\'s earthquake early warning system gave Tokyo about 60 seconds of warning before the 2011 Mw 9.0 earthquake. What can you do in 60 seconds?',
      checkAnswer: 'Stop trains (Japan\'s bullet trains auto-brake). Open fire station doors (prevent jamming). Shut down gas lines (prevent fires). Alert hospitals to brace equipment. People can drop, cover, and hold on. Elevators can stop at the nearest floor. 60 seconds is not enough to evacuate but is enough to save thousands of lives through automated safety responses.',
      codeIntro: 'Simulate an earthquake early warning system: detect P-wave, send alert, compare with S-wave arrival.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Early warning: P-wave detected near epicentre, electronic alert sent
# How much warning time does a distant city get?

v_p = 6.0        # km/s
v_s = 3.5        # km/s
v_surface = 2.8  # km/s
v_alert = 300000  # km/s (speed of light, electronic signal)

distances = np.linspace(10, 500, 200)  # km from epicentre

# Time for each phase to reach city
t_p = distances / v_p
t_s = distances / v_s
t_surface = distances / v_surface

# Alert: P-wave reaches sensor (10 km from epicentre) + processing (3s) + light-speed travel
sensor_dist = 10  # km
processing_time = 3  # seconds
t_alert = sensor_dist / v_p + processing_time + distances / v_alert

# Warning time before S-wave
warning_s = t_s - t_alert
# Warning time before surface wave
warning_surf = t_surface - t_alert

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Travel times
ax1.set_facecolor('#111827')
ax1.plot(distances, t_p, color='#3b82f6', linewidth=2, label='P-wave')
ax1.plot(distances, t_s, color='#22c55e', linewidth=2, label='S-wave (damaging)')
ax1.plot(distances, t_surface, color='#ef4444', linewidth=2, label='Surface wave (most damaging)')
ax1.plot(distances, t_alert, color='#f59e0b', linewidth=2, linestyle='--', label='Electronic alert')
ax1.fill_between(distances, t_alert, t_s, alpha=0.15, color='#f59e0b', label='Warning window')
ax1.set_xlabel('Distance from epicentre (km)', color='white')
ax1.set_ylabel('Time (seconds)', color='white')
ax1.set_title('Early Warning: Alert vs Wave Arrival', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Warning time
ax2.set_facecolor('#111827')
ax2.plot(distances, warning_s, color='#22c55e', linewidth=2, label='Before S-wave')
ax2.plot(distances, warning_surf, color='#ef4444', linewidth=2, label='Before surface wave')
ax2.axhline(0, color='gray', linestyle=':', linewidth=0.5)
ax2.fill_between(distances, 0, warning_s, where=warning_s > 0, alpha=0.15, color='#22c55e')

# Mark key distances
cities = [(50, 'Nearby city'), (150, 'Regional capital'), (300, 'Distant city')]
for d, name in cities:
    ws = d/v_s - (sensor_dist/v_p + processing_time + d/v_alert)
    ax2.plot(d, ws, 'o', color='#f59e0b', markersize=8)
    ax2.annotate(f'{name}\\n{ws:.0f}s warning', xy=(d, ws), xytext=(d + 15, ws + 5),
                 color='#f59e0b', fontsize=9, fontweight='bold')

ax2.set_xlabel('Distance from epicentre (km)', color='white')
ax2.set_ylabel('Warning time (seconds)', color='white')
ax2.set_title('Available Warning Time', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Early warning effectiveness by distance:")
for d in [30, 50, 100, 200, 300, 500]:
    ws = d/v_s - (sensor_dist/v_p + processing_time)
    wsurf = d/v_surface - (sensor_dist/v_p + processing_time)
    print(f"  {d:3d} km: {ws:5.1f}s before S-wave, {wsurf:5.1f}s before surface wave")
print()
print("60 seconds is enough to: stop trains, shut gas valves,")
print("open fire doors, alert hospitals, and brace for impact.")`,
      challenge: 'India\'s early warning system is being developed. If a sensor is 20 km from the epicentre (not 10) and processing takes 5 seconds (not 3), how does this affect warning time for Guwahati at 150 km?',
      successHint: 'We cannot predict earthquakes, but we can predict where they will happen and build systems that respond faster than the destructive waves travel. Early warning is the pragmatic alternative to prediction — and it works.',
    },
    {
      title: 'Structural engineering for earthquakes — building to survive',
      concept: `Earthquake-resistant design does not aim to make buildings that never move. It aims to make buildings that **move without collapsing**.

Design principles:
1. **Ductility**: the ability to deform without breaking. Reinforced concrete with proper steel detailing is ductile. Unreinforced masonry (brick walls) is brittle and deadly.
2. **Redundancy**: multiple load paths. If one column fails, others can carry the load.
3. **Regularity**: symmetric, uniform buildings perform better. Irregular shapes (L, T, U plans) create torsion (twisting) during shaking.
4. **Light upper floors**: heavier base, lighter top. An inverted pyramid is the worst design in an earthquake.

Advanced techniques:
- **Base isolation**: rubber or sliding bearings between foundation and building. The ground moves; the building floats.
- **Tuned mass dampers**: a heavy pendulum at the top that swings opposite to the building, cancelling motion. Taipei 101 has a 730-tonne damper visible to visitors.
- **Buckling-restrained braces**: steel braces that absorb energy by yielding in compression without buckling.

In NE India, the biggest risk is **non-engineered construction** — buildings made without structural analysis, using poor materials, with no earthquake consideration. The IS 1893 building code exists; enforcement is the challenge.`,
      analogy: 'A building in an earthquake is like a tree in a storm. A rigid tree (brittle building) snaps. A flexible tree (ductile building) bends and springs back. The palm tree survives hurricanes not because it is strong but because it is flexible. Earthquake engineering makes buildings more like palm trees.',
      storyConnection: 'The Bodo people built lightweight houses on stilts — bamboo frames with thatch roofs. These are naturally earthquake-resistant: light, flexible, and if they collapse, they don\'t kill. Modern earthquake engineering rediscovers these principles: use lightweight materials, ensure flexibility, and design for graceful failure rather than catastrophic collapse.',
      checkQuestion: 'Why do buildings with open ground floors (shops, parking) collapse in earthquakes more than buildings with walls on the ground floor?',
      checkAnswer: 'The open ground floor is a "soft story" — it is far less stiff and strong than the upper floors. During shaking, almost all the lateral displacement concentrates in this weak floor, which collapses while the upper floors pancake down intact. The fix is adding stiffness: shear walls, diagonal braces, or infill panels at the ground floor.',
      codeIntro: 'Simulate a tuned mass damper: a pendulum that reduces building sway.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Two models: building without damper vs. building with tuned mass damper
dt = 0.005
time = np.arange(0, 40, dt)

# Earthquake excitation (simplified harmonic near building natural frequency)
f_building = 0.5  # Hz (natural frequency of building)
earthquake = np.zeros_like(time)
mask = (time >= 2) & (time < 15)
earthquake[mask] = 0.8 * np.sin(2 * np.pi * f_building * time[mask]) * \
                   np.exp(-0.1 * (time[mask] - 2))
earthquake += 0.3 * np.sin(2 * np.pi * 1.3 * time) * mask * np.exp(-0.1 * (time - 2) * mask)

# Building without damper (SDOF)
omega_b = 2 * np.pi * f_building
zeta_b = 0.02  # low structural damping

x_no_damper = np.zeros_like(time)
v_no_damper = np.zeros_like(time)
for i in range(1, len(time)):
    a = -omega_b**2 * x_no_damper[i-1] - 2 * zeta_b * omega_b * v_no_damper[i-1] + earthquake[i]
    v_no_damper[i] = v_no_damper[i-1] + a * dt
    x_no_damper[i] = x_no_damper[i-1] + v_no_damper[i] * dt

# Building with TMD (2DOF)
# TMD: mass ratio 0.05, tuned to building frequency, damping 0.1
mu = 0.05  # mass ratio
f_tmd = f_building / (1 + mu)
omega_t = 2 * np.pi * f_tmd
zeta_t = 0.10

x_b = np.zeros_like(time)  # building
v_b = np.zeros_like(time)
x_t = np.zeros_like(time)  # TMD
v_t = np.zeros_like(time)

for i in range(1, len(time)):
    # Building equation
    a_b = (-omega_b**2 * x_b[i-1] - 2 * zeta_b * omega_b * v_b[i-1] +
           mu * omega_t**2 * (x_t[i-1] - x_b[i-1]) +
           mu * 2 * zeta_t * omega_t * (v_t[i-1] - v_b[i-1]) +
           earthquake[i])
    v_b[i] = v_b[i-1] + a_b * dt
    x_b[i] = x_b[i-1] + v_b[i] * dt

    # TMD equation
    a_t = -omega_t**2 * (x_t[i-1] - x_b[i-1]) - 2 * zeta_t * omega_t * (v_t[i-1] - v_b[i-1])
    v_t[i] = v_t[i-1] + a_t * dt
    x_t[i] = x_t[i-1] + v_t[i] * dt

fig, axes = plt.subplots(3, 1, figsize=(13, 9), sharex=True)
fig.patch.set_facecolor('#1f2937')

# Earthquake
axes[0].set_facecolor('#111827')
axes[0].plot(time, earthquake, color='#f59e0b', linewidth=1)
axes[0].fill_between(time, earthquake, alpha=0.2, color='#f59e0b')
axes[0].set_ylabel('Excitation', color='white')
axes[0].set_title('Earthquake Forcing (near building resonance)', color='white', fontsize=13)
axes[0].tick_params(colors='gray')

# Without damper
axes[1].set_facecolor('#111827')
axes[1].plot(time, x_no_damper, color='#ef4444', linewidth=1)
axes[1].fill_between(time, x_no_damper, alpha=0.2, color='#ef4444')
peak_no = np.max(np.abs(x_no_damper))
axes[1].set_ylabel('Displacement', color='white')
axes[1].set_title(f'Without TMD (peak: {peak_no:.3f})', color='#ef4444', fontsize=11)
axes[1].tick_params(colors='gray')

# With damper
axes[2].set_facecolor('#111827')
axes[2].plot(time, x_b, color='#22c55e', linewidth=1, label='Building')
axes[2].plot(time, x_t, color='#3b82f6', linewidth=0.5, alpha=0.5, label='TMD mass')
axes[2].fill_between(time, x_b, alpha=0.2, color='#22c55e')
peak_with = np.max(np.abs(x_b))
axes[2].set_ylabel('Displacement', color='white')
axes[2].set_xlabel('Time (seconds)', color='white')
axes[2].set_title(f'With TMD (peak: {peak_with:.3f})', color='#22c55e', fontsize=11)
axes[2].legend(facecolor='#1f2937', labelcolor='white', fontsize=8)
axes[2].tick_params(colors='gray')

plt.tight_layout()
plt.show()

reduction = (1 - peak_with / peak_no) * 100
print(f"Results:")
print(f"  Without TMD: peak displacement = {peak_no:.4f}")
print(f"  With TMD: peak displacement = {peak_with:.4f}")
print(f"  Reduction: {reduction:.0f}%")
print()
print("The TMD works by absorbing the building's kinetic energy.")
print("Taipei 101's 730-tonne TMD reduces sway by ~40% during typhoons.")
print("The same principle protects against earthquake resonance.")`,
      challenge: 'Increase the mass ratio from 0.05 to 0.10 (a heavier damper). How much additional reduction do you get? Is there a point of diminishing returns?',
      successHint: 'Structural engineering is where physics meets life safety. Every concept in this level — seismic waves, magnitude, seismographs, triangulation, prediction, and structural design — connects into a system for understanding and surviving earthquakes. For NE India, this knowledge is not academic; it is survival.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Innovator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Builds on Level 1 geology concepts</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for seismology simulations. Click to start.</p>
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
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}