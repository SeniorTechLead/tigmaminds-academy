import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import MuezzinInverseSquareDiagram from '../diagrams/MuezzinInverseSquareDiagram';
import MuezzinDomeAcousticsDiagram from '../diagrams/MuezzinDomeAcousticsDiagram';
import MuezzinSpeakerDiagram from '../diagrams/MuezzinSpeakerDiagram';
import MuezzinCityPropagationDiagram from '../diagrams/MuezzinCityPropagationDiagram';
import SineWaveDiagram from '../diagrams/SineWaveDiagram';
import DopplerEffectDiagram from '../diagrams/DopplerEffectDiagram';

export default function MuezzinLevel1() {
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
      await py.runPythonAsync(`import sys,io\nclass OC:\n def __init__(self):self.o=[]\n def write(self,t):self.o.append(t)\n def flush(self):pass\n def get_output(self):return''.join(self.o)\n def clear(self):self.o=[]\n_stdout_capture=OC();sys.stdout=_stdout_capture;sys.stderr=_stdout_capture\nimport matplotlib;matplotlib.use('AGG');import warnings;warnings.filterwarnings('ignore',category=UserWarning);import matplotlib.pyplot as plt;import base64\ndef _get_plot_as_base64():\n buf=io.BytesIO();plt.savefig(buf,format='png',dpi=100,bbox_inches='tight',facecolor='#1f2937',edgecolor='none');buf.seek(0);s=base64.b64encode(buf.read()).decode('utf-8');plt.close('all');return s`);
      pyodideRef.current = py; setPyReady(true); setLoading(false); setLoadProgress(''); return py;
    } catch (e: any) { setLoading(false); setLoadProgress('Error: ' + e.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'What is sound? — vibrations in the air',
      concept: `Sound is a **pressure wave** — a pattern of compressions (air pushed together) and rarefactions (air pulled apart) that travels outward from a vibrating source. The muezzin’s vocal cords vibrate, pushing air molecules, which push their neighbours, creating a chain reaction that spreads at **343 m/s** (the speed of sound in air at 20°C).

Key properties:
- **Frequency** (Hz): how many vibrations per second. The human voice ranges from ~85 Hz (deep bass) to ~1000 Hz (high soprano).
- **Amplitude**: how much the air pressure changes. Louder = bigger pressure swings.
- **Wavelength**: distance between compressions. λ = speed / frequency.

A muezzin’s call (adhan) typically ranges from 200-600 Hz. At 400 Hz, the wavelength is 343/400 = 0.86 metres — just under a metre between each compression.

In the code, you will generate and visualise sound waves at different frequencies.`,
      analogy: 'Drop a pebble in a pond. Ripples spread outward in circles — the water surface goes up and down, but the water itself does not travel outward. Sound works the same way: air molecules vibrate back and forth but do not travel from the minaret to your ear. Only the wave pattern — the energy — travels.',
      storyConnection: 'When Bilal ibn Rabah, the first muezzin, climbed the Ka’bah in Mecca to deliver the adhan, his voice had to reach the entire early Muslim community. He was chosen partly for his powerful, clear voice — good amplitude and a frequency range that carried well through open air. The physics of his voice determined who could hear the call.',
      checkQuestion: 'Sound travels at 343 m/s. If the minaret is 1 km from a house, how long after the muezzin begins does the homeowner hear it?',
      checkAnswer: 'Time = distance / speed = 1000 / 343 = 2.9 seconds. Nearly 3 seconds delay. At 5 km, the delay would be ~14.6 seconds. This is why in large cities with multiple mosques, you hear the adhan starting at slightly different times — partly due to different muezzins, but also partly due to the travel time of sound.',
      codeIntro: 'Generate and visualise sound waves at different frequencies.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Sound wave: pressure = A * sin(2*pi*f*t)
t = np.linspace(0, 0.01, 1000)  # 10 milliseconds

frequencies = [200, 400, 800]  # Hz
labels = ['Deep voice (200 Hz)', 'Typical adhan (400 Hz)', 'High note (800 Hz)']
colors = ['#ef4444', '#f59e0b', '#3b82f6']

fig, axes = plt.subplots(3, 1, figsize=(10, 6), sharex=True)

for ax, f, label, color in zip(axes, frequencies, labels, colors):
    wave = np.sin(2 * np.pi * f * t)
    ax.plot(t * 1000, wave, linewidth=2, color=color)
    ax.fill_between(t * 1000, wave, alpha=0.1, color=color)
    ax.set_ylabel('Pressure', fontsize=10, color='lightgray')
    ax.set_title(label, fontsize=11, color=color)
    ax.tick_params(colors='lightgray')
    ax.grid(alpha=0.2)
    ax.set_ylim(-1.3, 1.3)

    # Mark wavelength
    wavelength = 343 / f
    ax.text(0.95, 0.9, f'λ = {wavelength:.2f}m', transform=ax.transAxes,
            fontsize=10, color=color, ha='right')

axes[-1].set_xlabel('Time (ms)', fontsize=12, color='lightgray')
plt.suptitle('Sound Waves at Different Frequencies', fontsize=14, color='white', y=1.02)
plt.tight_layout()
plt.show()

print("Higher frequency = more cycles per second = higher pitch")
print("Lower frequency = fewer cycles = lower, deeper pitch")
print()
for f in frequencies:
    wl = 343 / f
    print(f"  {f:4d} Hz: wavelength = {wl:.2f} m ({wl*100:.0f} cm)")`,
      challenge: 'Add a 4th subplot showing two frequencies added together (200 Hz + 400 Hz). This creates a complex waveform — the real human voice is a sum of many frequencies. This is why voices sound different even at the same pitch.',
      successHint: 'Every sound you hear is a pressure wave described by frequency, amplitude, and wavelength. The muezzin’s voice, the wind, a car horn — all are patterns of air molecules pushing back and forth. The rest of this lesson series builds on this foundation.',
    },
    {
      title: 'The inverse square law — why minarets are tall',
      concept: `Sound from a point source spreads outward in a sphere. As the sphere grows, the same energy is spread over a larger area. The surface area of a sphere is **4πr²**, so when you double the distance, the area quadruples and the intensity drops to **one quarter**.

**I = P / (4πr²)**

This is the **inverse square law**. It means:
- At 10m: intensity = I
- At 20m: intensity = I/4 (one quarter)
- At 100m: intensity = I/100

In decibels, doubling the distance reduces sound by **6 dB**. Since humans perceive 10 dB as "twice as loud," a 6 dB drop is very noticeable.

This is why minarets exist. Elevating the source:
1. Reduces the distance to listeners (sound travels in a straight line over obstacles)
2. Avoids absorption by ground-level surfaces
3. Clears buildings that would block the sound path`,
      analogy: 'Imagine spraying a flashlight beam at a wall. Close up, the bright spot is small and intense. Move the flashlight back, and the same light covers a much larger area — each point gets dimmer. Sound does the same: the "cone" of sound spreads wider with distance, and each point in the cone gets less energy.',
      storyConnection: 'Early minarets were built specifically as sound amplification platforms. The famous Minaret of Jam (65m, Afghanistan) and the Great Mosque of Samarra’s minaret (52m, Iraq) were engineered to carry the human voice across entire cities — centuries before loudspeakers. Their height directly countered the inverse square law.',
      checkQuestion: 'A muezzin’s voice is 80 dB at 1 metre. How loud is it at 100 metres? (6 dB loss per doubling of distance)',
      checkAnswer: '100m is about 6.6 doublings of 1m (2⁶·⁶ ≈ 100). Each doubling loses 6 dB, so total loss = 6.6 × 6 = ~40 dB. The sound at 100m is 80 - 40 = 40 dB — about the level of a quiet library. At 500m, it would be near the threshold of hearing. This is why unamplified voices could not serve modern cities and loudspeakers became necessary.',
      codeIntro: 'Calculate and plot how sound intensity drops with distance.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Inverse square law: I = P / (4 * pi * r^2)
# In dB: L = L_ref - 20 * log10(r / r_ref)

r_ref = 1.0  # reference distance (m)
L_ref = 80   # dB at reference distance (loud voice)

distances = np.linspace(1, 1000, 500)
dB = L_ref - 20 * np.log10(distances / r_ref)

# Heights comparison
heights = [0, 15, 30, 50]  # ground, short minaret, tall, very tall
labels = ['Ground level', '15m minaret', '30m minaret', '50m minaret']
colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6']

plt.figure(figsize=(10, 5))
for h, label, color in zip(heights, labels, colors):
    # From elevated source, the distance to a listener 200m away:
    actual_distance = np.sqrt(distances**2 + h**2)
    dB_h = L_ref - 20 * np.log10(actual_distance / r_ref)
    plt.plot(distances, dB_h, linewidth=2, color=color, label=label)

# Reference lines
plt.axhline(y=60, color='white', linewidth=0.5, linestyle=':', alpha=0.3)
plt.text(800, 61, 'Normal conversation', fontsize=9, color='lightgray')
plt.axhline(y=40, color='white', linewidth=0.5, linestyle=':', alpha=0.3)
plt.text(800, 41, 'Quiet library', fontsize=9, color='lightgray')
plt.axhline(y=20, color='white', linewidth=0.5, linestyle=':', alpha=0.3)
plt.text(800, 21, 'Barely audible', fontsize=9, color='lightgray')

plt.xlabel('Horizontal distance (m)', fontsize=12, color='lightgray')
plt.ylabel('Sound level (dB)', fontsize=12, color='lightgray')
plt.title('Sound Level vs Distance at Different Heights', fontsize=14, color='white')
plt.legend(fontsize=10, labelcolor='lightgray')
plt.grid(alpha=0.2)
plt.tick_params(colors='lightgray')
plt.show()

print("At 500m horizontal distance:")
for h, label in zip(heights, labels):
    d = np.sqrt(500**2 + h**2)
    db = L_ref - 20 * np.log10(d / r_ref)
    print(f"  {label:20s}: {db:.1f} dB")
print()
print("Height helps most at short-medium distances")
print("At very long distances, height barely matters")`,
      challenge: 'Plot the "audible range" — the maximum distance at which the adhan exceeds 30 dB (the threshold for intelligible speech outdoors) for each minaret height. How much further does a 50m minaret carry sound compared to ground level?',
      successHint: 'The inverse square law is the reason minarets exist. It is also the reason we need loudspeakers for modern cities — the human voice simply cannot overcome the 1/r² decay over distances of several kilometres.',
    },
    {
      title: 'Dome acoustics — how mosques amplify sound',
      concept: `Walk into a domed mosque and clap. You hear the sound linger — sometimes for several seconds. This is **reverberation**, and it is not accidental. Domed architecture manipulates sound in specific ways:

1. **Focusing**: a concave dome reflects sound toward a focal point, concentrating energy
2. **Whispering gallery effect**: sound waves hug the curved surface, travelling along the dome with minimal loss
3. **Reverberation**: multiple reflections blend together, making the space sound rich and full

The **reverberation time** (RT60) is how long sound takes to decay by 60 dB. For speech clarity, RT60 should be 1-2 seconds. For music, 2-3 seconds is preferred. Large mosques like the Hagia Sophia have RT60 of ~10 seconds — too long for speech, but creating a spectacular immersive sound.

The code models how reflections build up inside a dome.`,
      analogy: 'A dome is an acoustic mirror. Just as a curved mirror in a telescope focuses light from distant stars into a single bright point, a dome focuses scattered sound waves into a concentrated zone. The speaker stands at one focus of the dome; listeners at the other focus hear the sound amplified. This is why the imam’s mihrab (prayer niche) is always at a specific point relative to the dome.',
      storyConnection: 'The great mosques of the Islamic world — the Hagia Sophia, the Shah Mosque in Isfahan, the Great Mosque of Cordoba — were acoustic masterpieces built centuries before the science of acoustics was formalised. Their architects understood intuitively what we now express as equations: dome geometry controls sound.',
      checkQuestion: 'Two identical rooms: one has bare stone walls, the other has thick carpets and curtains. Which has longer reverberation time?',
      checkAnswer: 'The bare stone room. Stone reflects almost all sound energy (absorption coefficient ~0.02), so sound bounces many times before dying out — long reverberation. Carpets and curtains absorb sound energy (absorption coefficient ~0.5-0.8), converting it to heat. Fewer reflections = shorter reverberation. This is why "dead" recording studios have fabric-covered walls and "live" concert halls have hard surfaces.',
      codeIntro: 'Model reverberation time and dome focusing.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Sabine equation: RT60 = 0.161 * V / A
# V = room volume (m^3), A = total absorption (m^2 Sabine)

def rt60(volume, surfaces):
    """Calculate reverberation time using Sabine equation"""
    total_absorption = sum(area * alpha for area, alpha in surfaces)
    return 0.161 * volume / total_absorption

# Mosque configurations
mosques = {
    "Small masjid": {
        "volume": 500,  # m^3
        "surfaces": [(200, 0.03), (50, 0.02), (100, 0.15)],  # (area, absorption)
        "labels": "stone walls, dome, carpet floor"
    },
    "Medium mosque": {
        "volume": 5000,
        "surfaces": [(800, 0.03), (300, 0.02), (500, 0.15), (200, 0.50)],
        "labels": "stone, dome, carpet, curtains"
    },
    "Grand mosque": {
        "volume": 50000,
        "surfaces": [(5000, 0.03), (2000, 0.02), (3000, 0.15)],
        "labels": "marble, domes, carpet"
    },
    "Hagia Sophia": {
        "volume": 256000,
        "surfaces": [(15000, 0.02), (7000, 0.02), (5000, 0.10)],
        "labels": "stone/marble, domes, floor"
    },
}

print("=== Reverberation Time (RT60) ===")
names = list(mosques.keys())
rt_values = []
for name in names:
    m = mosques[name]
    rt = rt60(m["volume"], m["surfaces"])
    rt_values.append(rt)
    print(f"  {name:20s}: RT60 = {rt:.1f}s  (V={m['volume']:,} m³)")

# Plot
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

ax1.barh(names, rt_values, color=['#10b981','#3b82f6','#f59e0b','#ef4444'], alpha=0.7)
ax1.axvline(x=1.5, color='white', linewidth=1, linestyle='--', alpha=0.5)
ax1.text(1.6, -0.3, 'Ideal for speech', fontsize=9, color='lightgray')
ax1.set_xlabel('RT60 (seconds)', fontsize=11, color='lightgray')
ax1.set_title('Reverberation Time by Mosque Size', fontsize=13, color='white')
ax1.tick_params(colors='lightgray')

# Dome focusing simulation
theta = np.linspace(0, np.pi, 100)
dome_r = 10  # metres
# Sound source at (0, 0), dome centred above
source_x, source_y = -3, 0
# Reflection off dome surface
dome_x = dome_r * np.cos(theta)
dome_y = dome_r * np.sin(theta)

ax2.plot(dome_x, dome_y, linewidth=3, color='#ca8a04')
ax2.plot(source_x, source_y, 'bo', markersize=10, label='Source')
ax2.plot(3, 0, 'r*', markersize=15, label='Focus')

# Draw some reflection paths
for a in [-0.8, -0.5, -0.2, 0.2]:
    hx = dome_r * np.cos(np.pi/2 + a)
    hy = dome_r * np.sin(np.pi/2 + a)
    ax2.plot([source_x, hx], [source_y, hy], 'b-', alpha=0.3, linewidth=1)
    ax2.plot([hx, 3], [hy, 0], 'r--', alpha=0.3, linewidth=1)

ax2.set_xlim(-12, 12)
ax2.set_ylim(-2, 12)
ax2.set_aspect('equal')
ax2.legend(fontsize=9, labelcolor='lightgray')
ax2.set_title('Dome Focuses Sound', fontsize=13, color='white')
ax2.tick_params(colors='lightgray')

plt.tight_layout()
plt.show()

print("\\nKey: larger volume = longer reverberation")
print("Ideal for speech: RT60 = 1-2 seconds")
print("The Hagia Sophia (10+ seconds) creates awe, not clarity")`,
      challenge: 'Modify the Grand Mosque by adding 2000 m² of acoustic panels (absorption coefficient 0.80). How does RT60 change? This is how modern mosque renovations balance acoustic tradition with speech intelligibility.',
      successHint: 'Dome acoustics is where architecture meets physics. The builders of the great mosques were acoustic engineers who shaped stone and air to amplify the human voice. Their solutions still inform modern architectural acoustics.',
    },
    {
      title: 'Sound absorption — what surfaces do to sound',
      concept: `When sound hits a surface, three things happen:
1. **Reflection**: sound bounces off (hard surfaces like stone)
2. **Absorption**: sound energy converts to heat (soft surfaces like carpet)
3. **Transmission**: sound passes through (thin walls)

The **absorption coefficient** (α) ranges from 0 (perfect reflection) to 1 (perfect absorption):
- Marble: α = 0.01 (almost perfect reflection)
- Brick: α = 0.03
- Carpet: α = 0.15-0.40
- Heavy curtain: α = 0.50-0.80
- Acoustic foam: α = 0.80-0.95

Importantly, absorption depends on **frequency**. Carpet absorbs high frequencies well but barely touches low frequencies. Thick materials absorb low frequencies better.

Mosque designers balance reflection (for projection and richness) with absorption (for clarity).`,
      analogy: 'Think of a squash court vs a pillow fort. In the squash court (hard walls), the ball bounces everywhere endlessly — that is a reverberant room. In the pillow fort (soft walls), the ball thuds and stops — that is an absorbed room. Real rooms are a mix: some walls hard (for brightness), some soft (for control).',
      storyConnection: 'Traditional mosques use a combination of marble floors (highly reflective, projecting the imam’s voice) and thick carpets (absorptive, preventing the sound from becoming a muddy echo). Muqarnas (the honeycomb vaulting seen in Islamic architecture) scatter sound in many directions, evening out the acoustic field so no seat is in a dead spot.',
      checkQuestion: 'A room has RT60 = 4 seconds. You cover 50% of the wall area with acoustic panels (α = 0.80). The other 50% is stone (α = 0.02). What is the new RT60?',
      checkAnswer: 'The Sabine equation: RT60 = 0.161V/A. Adding absorption increases A. If original total absorption was A₀ (giving RT60=4s), adding panels roughly doubles the total absorption (panels contribute much more than the stone they replace). New RT60 ≈ 4s × (A₀ / (A₀ + extra)) ≈ 2s. The exact answer depends on room dimensions, but approximately halving RT60 is correct. This is a dramatic improvement for speech clarity.',
      codeIntro: 'Model frequency-dependent absorption and room acoustics.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Frequency-dependent absorption coefficients
freqs = np.array([125, 250, 500, 1000, 2000, 4000])  # Hz

materials = {
    "Marble floor":    [0.01, 0.01, 0.01, 0.02, 0.02, 0.02],
    "Brick wall":      [0.03, 0.03, 0.04, 0.05, 0.05, 0.06],
    "Thick carpet":    [0.08, 0.20, 0.30, 0.40, 0.50, 0.60],
    "Heavy curtain":   [0.10, 0.30, 0.50, 0.70, 0.70, 0.60],
    "Acoustic panel":  [0.30, 0.60, 0.80, 0.90, 0.95, 0.90],
    "Muqarnas vault":  [0.15, 0.25, 0.35, 0.40, 0.45, 0.50],
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

colors = ['#94a3b8', '#78716c', '#10b981', '#8b5cf6', '#ef4444', '#f59e0b']
for (name, alphas), color in zip(materials.items(), colors):
    ax1.plot(freqs, alphas, 'o-', linewidth=2, color=color, label=name)

ax1.set_xlabel('Frequency (Hz)', fontsize=11, color='lightgray')
ax1.set_ylabel('Absorption coefficient', fontsize=11, color='lightgray')
ax1.set_title('Material Absorption vs Frequency', fontsize=13, color='white')
ax1.legend(fontsize=8, labelcolor='lightgray', loc='upper left')
ax1.set_xscale('log')
ax1.tick_params(colors='lightgray'); ax1.grid(alpha=0.2)

# RT60 at each frequency for a mosque
V = 5000  # m^3
wall_area = 800
floor_area = 500
dome_area = 300
carpet_area = 500

rt60_stone = []
rt60_carpeted = []
for i in range(len(freqs)):
    # All stone
    A_stone = wall_area * materials["Brick wall"][i] + \
              floor_area * materials["Marble floor"][i] + \
              dome_area * materials["Brick wall"][i]
    rt60_stone.append(0.161 * V / A_stone)

    # With carpet and muqarnas
    A_carpet = wall_area * materials["Brick wall"][i] + \
               carpet_area * materials["Thick carpet"][i] + \
               dome_area * materials["Muqarnas vault"][i] + \
               (floor_area - carpet_area) * materials["Marble floor"][i]
    rt60_carpeted.append(0.161 * V / A_carpet)

ax2.plot(freqs, rt60_stone, 'o-', linewidth=2.5, color='#ef4444', label='All stone')
ax2.plot(freqs, rt60_carpeted, 'o-', linewidth=2.5, color='#10b981', label='Carpet + muqarnas')
ax2.axhline(y=2, color='white', linewidth=1, linestyle='--', alpha=0.3)
ax2.text(150, 2.1, 'Ideal for speech', fontsize=9, color='lightgray')

ax2.set_xlabel('Frequency (Hz)', fontsize=11, color='lightgray')
ax2.set_ylabel('RT60 (seconds)', fontsize=11, color='lightgray')
ax2.set_title('Reverberation Time vs Frequency', fontsize=13, color='white')
ax2.legend(fontsize=10, labelcolor='lightgray')
ax2.set_xscale('log')
ax2.tick_params(colors='lightgray'); ax2.grid(alpha=0.2)

plt.tight_layout()
plt.show()

print("Key findings:")
print("  - Carpet reduces high-frequency reverberation dramatically")
print("  - Low frequencies are harder to absorb (need thick materials)")
print("  - Muqarnas scatters sound, improving evenness")
print("  - Traditional mosque design achieves excellent speech clarity!")`,
      challenge: 'Replace the muqarnas with flat stone ceiling (absorption = brick values). How does RT60 change? This shows why muqarnas is not just decorative — it is acoustic engineering.',
      successHint: 'Every surface in a room is an acoustic device. The genius of Islamic architecture was combining beauty with function — muqarnas vaults are stunning visually AND serve as acoustic diffusers. Form follows function, and function follows physics.',
    },
    {
      title: 'Loudspeakers — from voice to voltage to sound',
      concept: `Modern mosques use loudspeaker systems to carry the adhan across cities. A loudspeaker converts electrical signals to sound through electromagnetism:

1. A **microphone** converts the muezzin’s voice to an electrical signal (varying voltage)
2. An **amplifier** boosts the signal’s power
3. A **loudspeaker** converts the amplified electrical signal back to sound

Inside a speaker: a permanent magnet creates a fixed magnetic field. A **voice coil** (wire wrapped in a cylinder) sits inside this field. When current flows through the coil, it creates its own magnetic field that interacts with the permanent magnet, pushing the coil forward or backward. The coil is attached to a **cone** that pushes air, creating sound waves.

The frequency of the electrical signal determines the pitch. The amplitude determines the volume.`,
      analogy: 'A loudspeaker is like a trampoline controlled by an electromagnet. The magnet pushes the trampoline surface up and down in the pattern of the music. As the surface bounces, it pushes and pulls the air above it, creating sound waves. The faster it bounces (higher frequency current), the higher the pitch. The harder it bounces (more current), the louder the sound.',
      storyConnection: 'The first loudspeakers were installed in mosques in the 1930s-40s. Before that, multiple muezzins would relay the call from different parts of the city — a human amplification chain. The transition to electronic amplification was controversial: some scholars debated whether an electronically reproduced voice fulfilled the religious requirement. Today, loudspeakers are universal, but the quality of the muezzin’s voice remains paramount.',
      checkQuestion: 'A 100-watt speaker is pointed at a crowd 50 metres away. How loud is it?',
      checkAnswer: 'Using I = P/(4πr²): I = 100/(4×π×50²) = 0.0032 W/m². Converting to dB: L = 10×log₁₀(0.0032/10⁻¹²) = 95 dB. That is about as loud as a motorcycle. But this assumes the speaker radiates equally in all directions. A horn-loaded speaker on a minaret can direct sound forward with 10 dB gain, making it effectively 105 dB at 50m — louder than a rock concert.',
      codeIntro: 'Model speaker output and directivity for a minaret installation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Speaker coverage model
power = 100  # watts
distances = np.linspace(10, 2000, 200)

# Omnidirectional speaker
I_omni = power / (4 * np.pi * distances**2)
dB_omni = 10 * np.log10(I_omni / 1e-12)

# Horn speaker with directivity gain
directivity = 10  # dB (horn focuses sound forward)
dB_horn = dB_omni + directivity

# Cluster of 4 speakers (6 dB more)
dB_cluster = dB_horn + 6

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

ax1.plot(distances, dB_omni, linewidth=2, color='#94a3b8', label='Omnidirectional')
ax1.plot(distances, dB_horn, linewidth=2, color='#f59e0b', label='Horn (+10 dB)')
ax1.plot(distances, dB_cluster, linewidth=2, color='#ef4444', label='4-horn cluster (+16 dB)')

ax1.axhline(y=65, color='#10b981', linewidth=1, linestyle='--', alpha=0.5)
ax1.text(1500, 66, 'Intelligible speech', fontsize=9, color='#10b981')
ax1.axhline(y=45, color='#3b82f6', linewidth=1, linestyle='--', alpha=0.5)
ax1.text(1500, 46, 'Audible background', fontsize=9, color='#3b82f6')

ax1.set_xlabel('Distance (m)', fontsize=11, color='lightgray')
ax1.set_ylabel('Sound level (dB)', fontsize=11, color='lightgray')
ax1.set_title('Speaker Range: 100W System', fontsize=13, color='white')
ax1.legend(fontsize=9, labelcolor='lightgray')
ax1.tick_params(colors='lightgray'); ax1.grid(alpha=0.2)

# Polar directivity pattern
angles = np.linspace(-np.pi, np.pi, 360)
# Omni
r_omni = np.ones_like(angles)
# Horn (cardioid-like)
r_horn = 0.5 * (1 + np.cos(angles))
# Super-cardioid
r_super = 0.37 + 0.63 * np.cos(angles)
r_super = np.maximum(r_super, 0)

ax2 = plt.subplot(122, polar=True)
ax2.plot(angles, r_omni, linewidth=1.5, color='#94a3b8', label='Omni')
ax2.plot(angles, r_horn, linewidth=2, color='#f59e0b', label='Horn')
ax2.plot(angles, r_super, linewidth=2, color='#ef4444', label='Super-cardioid')
ax2.set_title('Speaker Directivity Patterns', fontsize=13, color='white', pad=20)
ax2.legend(fontsize=8, loc='lower right', labelcolor='lightgray')
ax2.tick_params(colors='lightgray')

plt.tight_layout()
plt.show()

# Calculate range for intelligible speech (65 dB)
for name, db in [("Omni", dB_omni), ("Horn", dB_horn), ("Cluster", dB_cluster)]:
    idx = np.argmin(np.abs(db - 65))
    print(f"  {name:10s}: intelligible to {distances[idx]:.0f}m")`,
      challenge: 'Model a city with 5 minarets, each with a 4-horn cluster at 30m height. Calculate the combined sound level at any point in the city using superposition (sum of intensities from all sources). Create a coverage map showing where the adhan is audible.',
      successHint: 'Modern minaret loudspeaker systems are carefully designed using the same physics you just modelled. Horn directivity, cluster configuration, height, and power all combine to ensure the adhan reaches every corner of the city while minimising noise complaints from adjacent neighbourhoods.',
    },
    {
      title: 'Urban sound propagation — how cities shape the adhan',
      concept: `In a real city, sound does not travel in a straight line. It encounters buildings, streets, trees, and temperature layers that bend, reflect, absorb, and scatter it.

Key urban acoustic phenomena:
1. **Diffraction**: sound bends around buildings (low frequencies bend more)
2. **Canyon effect**: street canyons (narrow streets with tall buildings) can focus or trap sound
3. **Temperature inversion**: warm air above cool air bends sound downward, increasing range
4. **Wind**: carries sound downwind farther and reduces it upwind

A 30m minaret in a modern city faces all of these challenges. The adhan must navigate a complex acoustic landscape to reach listeners in their homes.

The code models sound propagation through a simple city grid.`,
      analogy: 'Sound in a city is like water flowing through a maze of channels. Some channels (wide streets) carry it far. Some (narrow alleys) trap and amplify it. Some (parks with trees) absorb it. Dead ends (tall buildings) reflect it back. The minaret is a fountain at the centre of the maze — its height helps the water (sound) flow over the walls (buildings) instead of getting trapped.',
      storyConnection: 'As cities like Mecca, Istanbul, and Cairo have grown denser and taller, the acoustic challenge of the adhan has evolved. Modern acoustic engineers use computer models very similar to what you are building to design minaret sound systems that account for the specific urban landscape of each mosque. It is ancient tradition meeting modern physics.',
      checkQuestion: 'On a still, cool morning, the adhan is heard much farther than on a hot afternoon. Why?',
      checkAnswer: 'Temperature gradient. On cool mornings (especially with ground fog), the ground is cool and the air above is warmer (temperature inversion). Sound travels faster in warm air, so sound rays curve DOWNWARD — toward listeners. On a hot afternoon, the ground is hot and air above is cooler (normal lapse). Sound rays curve UPWARD — away from listeners. This "thermal bending" can change the effective range of the adhan by 2-3 times.',
      codeIntro: 'Model sound propagation through a city grid with buildings and streets.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simple city grid: buildings block, streets transmit
grid_size = 50
cell_size = 20  # metres per cell

# Create city: 0 = street, 1 = building
np.random.seed(42)
city = np.zeros((grid_size, grid_size))
# Add buildings as random rectangles
for _ in range(40):
    bx = np.random.randint(2, grid_size-5)
    by = np.random.randint(2, grid_size-5)
    bw = np.random.randint(2, 5)
    bh = np.random.randint(2, 5)
    city[by:by+bh, bx:bx+bw] = 1

# Source: minaret at centre
src_x, src_y = grid_size//2, grid_size//2
city[src_y-1:src_y+1, src_x-1:src_x+1] = 0  # clear around minaret

# Simple propagation: sound level decreases with distance
# and is attenuated by buildings
sound_level = np.zeros((grid_size, grid_size))
source_power = 100  # dB at 1 cell distance

for i in range(grid_size):
    for j in range(grid_size):
        if city[i, j] == 1:
            sound_level[i, j] = 0  # inside buildings
            continue

        dx = (j - src_x) * cell_size
        dy = (i - src_y) * cell_size
        dist = max(np.sqrt(dx**2 + dy**2), cell_size)

        # Free-field inverse square
        db = source_power - 20 * np.log10(dist / cell_size)

        # Count buildings in the path (simple ray)
        n_steps = int(max(abs(j-src_x), abs(i-src_y)))
        if n_steps > 0:
            blocking = 0
            for step in range(1, n_steps):
                frac = step / n_steps
                cx = int(src_x + frac * (j - src_x))
                cy = int(src_y + frac * (i - src_y))
                if 0 <= cx < grid_size and 0 <= cy < grid_size:
                    if city[cy, cx] == 1:
                        blocking += 5  # 5 dB per building

            db -= blocking

        sound_level[i, j] = max(db, 0)

plt.figure(figsize=(10, 8))
# Show buildings
plt.imshow(city, cmap='Greys', alpha=0.3, extent=[0, grid_size*cell_size, grid_size*cell_size, 0])
# Show sound levels
masked = np.ma.masked_where(city == 1, sound_level)
im = plt.imshow(masked, cmap='YlOrRd', alpha=0.7,
                extent=[0, grid_size*cell_size, grid_size*cell_size, 0],
                vmin=30, vmax=90)
plt.colorbar(im, label='Sound level (dB)')
plt.plot(src_x * cell_size, src_y * cell_size, 'b^', markersize=15)
plt.annotate('Minaret', xy=(src_x*cell_size, src_y*cell_size),
             xytext=(src_x*cell_size+50, src_y*cell_size-50),
             fontsize=10, color='blue', arrowprops=dict(arrowstyle='->', color='blue'))

plt.xlabel('East (m)', fontsize=12, color='lightgray')
plt.ylabel('North (m)', fontsize=12, color='lightgray')
plt.title('Sound Propagation Through a City', fontsize=14, color='white')
plt.tick_params(colors='lightgray')
plt.show()

# Coverage statistics
street_cells = sound_level[city == 0]
print(f"Street cells > 65 dB (intelligible): {np.sum(street_cells > 65)} / {len(street_cells)}")
print(f"Street cells > 45 dB (audible): {np.sum(street_cells > 45)} / {len(street_cells)}")
print(f"Coverage (>45dB): {np.sum(street_cells > 45)/len(street_cells)*100:.0f}%")`,
      challenge: 'Raise the minaret to 50m by adding a height factor: when the path to a listener clears the average building height (15m), remove the building attenuation. How much does coverage improve? This is the core argument for tall minarets.',
      successHint: 'Urban acoustic modelling is a living field that merges physics, architecture, and city planning. The next time you hear the adhan floating over a cityscape, you will understand the physics that carries it: inverse square decay, diffraction around buildings, reflection off walls, and the height advantage of the minaret.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">No prior physics experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for acoustics simulations. Click to start.</p>
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
            diagram={[SineWaveDiagram, MuezzinInverseSquareDiagram, MuezzinDomeAcousticsDiagram, DopplerEffectDiagram, MuezzinSpeakerDiagram, MuezzinCityPropagationDiagram][i] ? createElement([SineWaveDiagram, MuezzinInverseSquareDiagram, MuezzinDomeAcousticsDiagram, DopplerEffectDiagram, MuezzinSpeakerDiagram, MuezzinCityPropagationDiagram][i]) : undefined}
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
