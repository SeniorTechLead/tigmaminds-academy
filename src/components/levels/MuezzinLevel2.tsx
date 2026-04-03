import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import MuezzinInverseSquareDiagram from '../diagrams/MuezzinInverseSquareDiagram';
import MuezzinDomeAcousticsDiagram from '../diagrams/MuezzinDomeAcousticsDiagram';
import MuezzinSpeakerDiagram from '../diagrams/MuezzinSpeakerDiagram';
import MuezzinCityPropagationDiagram from '../diagrams/MuezzinCityPropagationDiagram';
import InterferenceDiagram from '../diagrams/InterferenceDiagram';
import MirrorReflectionDiagram from '../diagrams/MirrorReflectionDiagram';

export default function MuezzinLevel2() {
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
      title: 'Acoustic reflection — the law of reflection for sound waves',
      concept: `When a sound wave hits a hard, flat surface, it bounces back according to the **law of reflection**: the angle of incidence equals the angle of reflection (measured from the normal to the surface). This is identical to the law governing light reflection in a mirror.

The reflected wave is called an **echo** if the reflecting surface is far enough away (at least 17 metres) for the brain to perceive the original and reflected sounds as separate events. At closer distances, reflections blend with the direct sound, creating **reverberation** — a lingering quality that makes music sound richer and speech harder to understand.

In a mosque, every wall, floor, column, and dome is a reflecting surface. The architect’s challenge is to control these reflections — directing useful reflections toward the congregation while absorbing harmful ones that create muddy echoes.

The code traces reflection paths from a speaker to listeners via walls and ceiling.`,
      analogy: 'Bounce a ball off a wall. If you throw it straight at the wall, it comes straight back. If you throw at an angle, it bounces off at the same angle on the other side of the normal. Sound waves follow the same geometry. Throwing the ball in a squash court is like speaking in a mosque — the ball (sound) bounces off every surface before reaching the other player (listener).',
      storyConnection: 'In Ottoman mosques, the walls are not bare stone. They are covered in ceramic tiles, plaster, and carved stone — materials chosen not just for beauty but for their acoustic properties. Smooth tiles reflect sound efficiently (useful near the imam), while carved and textured surfaces scatter sound (reducing focused echoes that would muddy speech).',
      checkQuestion: 'A speaker faces a flat wall 10 metres away. A listener stands 5 metres behind the speaker. The direct sound travels 5 m; the reflected sound travels 10 + 10 + 5 = 25 m. What is the time delay of the echo?',
      checkAnswer: 'Extra path = 25 − 5 = 20 m. At 343 m/s: delay = 20/343 = 0.058 seconds = 58 ms. This is longer than the ~50 ms threshold where the brain hears a distinct echo. The wall creates a noticeable echo. Architects add absorption material or angle the wall to prevent this.',
      codeIntro: 'Trace sound reflection paths in a rectangular room.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Room dimensions (metres)
width = 30
height = 15

# Speaker position
sx, sy = 15, 2

# Listener positions
listeners = [(5, 1), (10, 1), (20, 1), (25, 1)]

fig, ax = plt.subplots(figsize=(12, 6))

# Draw room
room = plt.Rectangle((0, 0), width, height, fill=False, edgecolor='white', linewidth=2)
ax.add_patch(room)
ax.plot(sx, sy, 'r*', markersize=15, label='Speaker')

v_sound = 343  # m/s

for lx, ly in listeners:
    # Direct path
    d_direct = np.sqrt((lx-sx)**2 + (ly-sy)**2)
    ax.plot([sx, lx], [sy, ly], 'g-', linewidth=1, alpha=0.5)

    # Ceiling reflection: mirror source at (sx, 2*height - sy)
    mirror_y = 2 * height - sy
    d_ceil = np.sqrt((lx-sx)**2 + (ly-mirror_y)**2)
    # Reflection point on ceiling
    t = (height - sy) / (mirror_y - sy)
    rx = sx + t * (lx - sx)
    ax.plot([sx, rx, lx], [sy, height, ly], 'c-', linewidth=1, alpha=0.4)

    # Floor reflection: mirror source at (sx, -sy)
    d_floor = np.sqrt((lx-sx)**2 + (ly+sy)**2)
    t_f = sy / (sy + ly)
    rfx = sx + t_f * (lx - sx)
    ax.plot([sx, rfx, lx], [sy, 0, ly], 'y-', linewidth=1, alpha=0.4)

    # Time delays
    delay_ceil = (d_ceil - d_direct) / v_sound * 1000  # ms
    delay_floor = (d_floor - d_direct) / v_sound * 1000

    ax.plot(lx, ly, 'wo', markersize=8)
    ax.text(lx, ly + 1, f'{delay_ceil:.0f}ms', fontsize=10, color='cyan', ha='center')

# Labels
ax.set_xlim(-1, width + 1)
ax.set_ylim(-1, height + 2)
ax.set_xlabel('Distance (m)', fontsize=11)
ax.set_ylabel('Height (m)', fontsize=11)
ax.set_title('Sound Reflection Paths: Speaker to Listeners', fontsize=13)
ax.set_aspect('equal')
ax.grid(alpha=0.15)
ax.legend(fontsize=10)

plt.tight_layout()
plt.show()

print("=== Reflection Delays ===")
for lx, ly in listeners:
    d_direct = np.sqrt((lx-sx)**2 + (ly-sy)**2)
    mirror_y = 2 * height - sy
    d_ceil = np.sqrt((lx-sx)**2 + (ly-mirror_y)**2)
    delay = (d_ceil - d_direct) / v_sound * 1000
    echo = "ECHO" if delay > 50 else "blend"
    print(f"  Listener at ({lx},{ly}): ceiling delay = {delay:.1f} ms [{echo}]")`,
      challenge: 'Add side wall reflections (left wall at x=0, right wall at x=30). For each listener, calculate the total number of early reflections arriving within 80 ms. Which listener position has the best acoustics?',
      successHint: 'Acoustic reflection analysis is the foundation of room acoustics. Every concert hall, recording studio, and mosque is designed by tracing reflections and controlling their timing. The same physics governs radar, sonar, and ultrasound imaging.',
    },
    {
      title: 'Parabolic surfaces — focusing sound with geometry',
      concept: `A **parabola** has a remarkable property: any ray arriving parallel to the axis reflects to a single point called the **focus**. Conversely, any ray from the focus reflects off the parabola as a parallel beam.

The equation of a parabola with focus at distance f from the vertex is:
**y = x² / (4f)**

This geometry is used in satellite dishes (focusing radio waves), car headlights (projecting parallel light), and acoustic mirrors (focusing sound).

In mosque architecture, the mihrab (prayer niche) is often designed with a slightly parabolic curve to collect the imam’s voice and project it toward the congregation. The dome is a 3D version — a **paraboloid** that collects diverging sound waves and redirects them as a focused beam.

The code traces rays from a source at the focus of a parabolic reflector and compares parabolic, spherical, and flat surfaces.`,
      analogy: 'A magnifying glass focuses parallel sunlight to a single burning point. A parabolic reflector does the same thing with sound. Place a speaker at the focus and the reflected sound emerges as a tight, parallel beam — louder and more directional than an un-reflected source. This is why shouting into a megaphone (a truncated parabola) works so well.',
      storyConnection: 'The mihrab niche in the Süleymaniye Mosque has a concave surface that acts as a partial parabolic reflector. When the imam speaks into the mihrab, his voice is reflected outward toward the congregation. Sinan reportedly tested different curvatures by having assistants listen from various positions while he spoke from the niche.',
      checkQuestion: 'If a parabolic dish has a focal length of 2 metres, what is the depth of the dish at 3 metres from the centre?',
      checkAnswer: 'Using y = x²/(4f) = 3²/(4×2) = 9/8 = 1.125 m. The dish is 1.125 metres deep at 3 metres from the centre. In practice, mosque domes are much larger and less deeply curved, with focal lengths of 10-20 metres.',
      codeIntro: 'Compare parabolic, spherical, and flat reflectors for sound focusing.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Parabolic reflector: y = x^2 / (4f)
f = 5  # focal length (metres)
x = np.linspace(-8, 8, 200)
y_parab = x**2 / (4 * f)

# Spherical reflector: circle with radius R
R = 10
y_sphere = R - np.sqrt(np.maximum(R**2 - x**2, 0))

fig, axes = plt.subplots(1, 3, figsize=(14, 5))

# Parabolic
axes[0].plot(x, y_parab, color='#3b82f6', linewidth=2.5)
axes[0].plot(0, f, 'r*', markersize=15, label='Focus')
# Trace rays from focus
for angle in np.linspace(-0.6, 0.6, 9):
    dx = np.sin(angle)
    dy = np.cos(angle)
    # Ray from focus to parabola
    x_hit = 2 * f * np.tan(angle)
    if abs(x_hit) < 8:
        y_hit = x_hit**2 / (4*f)
        axes[0].plot([0, x_hit], [f, y_hit], 'r-', linewidth=0.8, alpha=0.5)
        # Reflected ray goes straight up (parallel to axis)
        axes[0].plot([x_hit, x_hit], [y_hit, y_hit + 5], 'g-', linewidth=0.8, alpha=0.5)
axes[0].set_title('Parabolic: perfect focus', fontsize=11)
axes[0].set_xlabel('Position (m)', fontsize=10)
axes[0].set_ylabel('Depth (m)', fontsize=10)
axes[0].legend(fontsize=10)
axes[0].set_ylim(-1, 15)
axes[0].grid(alpha=0.2)

# Spherical
axes[1].plot(x, y_sphere, color='#f59e0b', linewidth=2.5)
axes[1].plot(0, R/2, 'r*', markersize=15, label='Approx focus')
for x_hit in np.linspace(-6, 6, 9):
    if abs(x_hit) < R:
        y_hit = R - np.sqrt(R**2 - x_hit**2)
        # Normal at hit point
        nx_n = x_hit / R
        ny_n = np.sqrt(1 - nx_n**2)
        # Reflected direction (incoming parallel from below)
        dot = ny_n
        ref_x = -2 * dot * nx_n
        ref_y = 1 - 2 * dot * ny_n
        axes[1].plot([x_hit, x_hit], [-1, y_hit], 'r-', linewidth=0.8, alpha=0.3)
        axes[1].plot([x_hit, x_hit + ref_x*10], [y_hit, y_hit + ref_y*10], 'g-', linewidth=0.8, alpha=0.5)
axes[1].set_title('Spherical: approximate focus', fontsize=11)
axes[1].set_xlabel('Position (m)', fontsize=10)
axes[1].legend(fontsize=10)
axes[1].set_ylim(-1, 15)
axes[1].grid(alpha=0.2)

# Flat
axes[2].plot(x, np.zeros_like(x), color='#a855f7', linewidth=2.5)
for x_hit in np.linspace(-6, 6, 9):
    axes[2].plot([x_hit, x_hit], [-1, 0], 'r-', linewidth=0.8, alpha=0.3)
    axes[2].plot([x_hit, x_hit], [0, 5], 'g-', linewidth=0.8, alpha=0.5)
axes[2].set_title('Flat: no focusing', fontsize=11)
axes[2].set_xlabel('Position (m)', fontsize=10)
axes[2].set_ylim(-1, 15)
axes[2].grid(alpha=0.2)

for ax in axes:
    ax.set_aspect('equal')

plt.tight_layout()
plt.show()

print("Parabolic: all reflected rays are parallel (perfect collimation)")
print("Spherical: rays converge near focus but with aberration")
print("Flat: rays reflect straight back (no focusing)")
print()
print(f"Parabolic focal length: {f} m")
print(f"Spherical approximate focal length: {R/2} m")`,
      challenge: 'Design a parabolic mihrab niche that focuses the imam’s voice (placed at the focus) into a beam 20 degrees wide. Calculate the required focal length and dish diameter.',
      successHint: 'Parabolic geometry appears everywhere: satellite dishes, radio telescopes, car headlights, solar concentrators, and acoustic mirrors. Understanding the relationship between curvature and focal length is fundamental to optics and acoustics alike.',
    },
    {
      title: 'Whispering galleries — sound travelling along curved surfaces',
      concept: `Stand at one end of a circular or elliptical dome. Whisper. Someone at the other end, 30+ metres away, hears you clearly — while people in between hear nothing. This is the **whispering gallery effect**, and it defies the inverse square law.

The explanation: sound waves travelling along a curved surface experience **total internal reflection**. Just as light in a fibre optic cable bounces along the inside of the glass, sound skims along the concave surface, losing very little energy because each reflection angle is shallow.

The mathematical condition: the sound wavelength must be small compared to the dome radius. For a 15 m radius dome and speech at 1000 Hz (λ ≈ 0.34 m), the ratio is about 44:1 — well within the whispering gallery regime.

Lord Rayleigh first explained this in 1910 by studying St Paul’s Cathedral in London, where whispers travel 34 m around the dome gallery.`,
      analogy: 'Roll a marble along the inside rim of a large bowl. The marble follows the curve, staying on the rim, rather than shooting across the middle. Sound waves in a dome do the same — they hug the curved surface, skimming along the inside rather than spreading across the open space. This is why the sound stays strong over long distances along the wall.',
      storyConnection: 'Some Ottoman mosques exhibit whispering gallery effects, though this was sometimes unintentional and problematic. If the imam’s voice travelled around the dome rather than down to the congregation, it arrived delayed and muddied. Sinan’s genius was in breaking the whispering gallery effect using pendentives (triangular transitions between dome and walls) and surface textures that scatter the skimming waves downward.',
      checkQuestion: 'Why does the whispering gallery effect work better at higher frequencies?',
      checkAnswer: 'Higher frequencies have shorter wavelengths. For the effect to work, the wavelength must be much smaller than the dome radius (so the wave "sees" the surface as locally flat and reflects cleanly). Low frequencies have long wavelengths and diffract too much to stay on the surface. This is why whispers (rich in high frequencies) work better than shouts (more low-frequency content) in whispering galleries.',
      codeIntro: 'Simulate sound propagation along a circular dome wall.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Circular dome, radius R
R = 15  # metres
theta = np.linspace(0, 2*np.pi, 500)
dome_x = R * np.cos(theta)
dome_y = R * np.sin(theta)

# Whispering gallery: sound ray bouncing along the inside
# Each bounce at angle alpha from tangent
n_bounces = 30
alpha = np.radians(5)  # very shallow angle

# Start at bottom of dome
ray_angles = [np.pi/2]
ray_x = [R * np.cos(ray_angles[0])]
ray_y = [R * np.sin(ray_angles[0])]

for i in range(n_bounces):
    next_angle = ray_angles[-1] + 2 * alpha
    ray_angles.append(next_angle)
    ray_x.append(R * np.cos(next_angle))
    ray_y.append(R * np.sin(next_angle))

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))

# Whispering gallery ray path
ax1.plot(dome_x, dome_y, color='white', linewidth=2, alpha=0.3)
ax1.plot(ray_x, ray_y, 'c-o', linewidth=1.5, markersize=3, alpha=0.7)
ax1.plot(ray_x[0], ray_y[0], 'r*', markersize=15, label='Source')
ax1.plot(ray_x[-1], ray_y[-1], 'go', markersize=10, label='Receiver')
ax1.set_xlim(-18, 18)
ax1.set_ylim(-18, 18)
ax1.set_aspect('equal')
ax1.set_title('Whispering Gallery: Sound Hugs the Dome', fontsize=12)
ax1.legend(fontsize=10)
ax1.grid(alpha=0.15)

# Intensity comparison: inverse square law vs whispering gallery
distances = np.linspace(1, 30, 200)
# ISL: I proportional to 1/r^2
I_isl = 1 / distances**2
I_isl = I_isl / I_isl[0]  # normalize
# Whispering gallery: exponential decay with much smaller rate
absorption_per_m = 0.02  # dB/m along surface
arc_distance = distances  # approximate
I_wg = 10**(-absorption_per_m * arc_distance / 10)

ax2.semilogy(distances, I_isl, color='#ef4444', linewidth=2.5, label='Inverse square law (free field)')
ax2.semilogy(distances, I_wg, color='#3b82f6', linewidth=2.5, label='Whispering gallery (along dome)')
ax2.set_xlabel('Distance from source (m)', fontsize=11)
ax2.set_ylabel('Relative intensity', fontsize=11)
ax2.set_title('Why Whispers Travel 30m Along a Dome', fontsize=12)
ax2.legend(fontsize=10)
ax2.grid(alpha=0.3)

plt.tight_layout()
plt.show()

print("At 30m from source:")
print(f"  Free field (ISL): intensity = {1/30**2:.6f} (drop of {-10*np.log10(1/30**2):.0f} dB)")
print(f"  Whispering gallery: intensity = {10**(-0.02*30/10):.4f} (drop of {0.02*30:.1f} dB)")
print(f"  Gallery advantage: {-10*np.log10(1/30**2) - 0.02*30:.0f} dB stronger!")`,
      challenge: 'Model an elliptical dome (a = 20m, b = 10m) instead of circular. An ellipse has two foci: sound from one focus converges at the other. Calculate the foci positions and verify with ray tracing.',
      successHint: 'Whispering galleries demonstrate that geometry can override the inverse square law for sound along surfaces. This principle is used in optical fibres (total internal reflection of light), ring lasers, and microwave waveguides.',
    },
    {
      title: 'Dome acoustics — Sabine’s equation and reverberation time',
      concept: `In 1898, Wallace Clement Sabine measured how long it took sound to decay in Harvard’s Fogg Lecture Hall. He discovered that **reverberation time** (RT60 — the time for sound to drop by 60 dB) depends on room volume and total absorption:

**RT60 = 0.161 × V / A**

Where V is room volume (m³) and A is total absorption (m² sabins). Absorption A = sum of (surface area × absorption coefficient) for each material.

Absorption coefficients range from 0.01 (marble, highly reflective) to 0.99 (acoustic foam, highly absorptive). A large marble dome has very low absorption → long RT60 → too much echo. Adding carpets, curtains, and textured surfaces increases absorption and reduces RT60.

For speech clarity, RT60 should be 0.5-1.0 seconds. For music, 1.5-2.5 seconds. For a mosque (both speech and Qur’anic recitation), 1.0-1.5 seconds is ideal.`,
      analogy: 'Clap your hands in an empty bathroom. The sound rings for seconds because the hard tiles reflect nearly all the sound energy. Now clap in a closet full of clothes. The sound dies instantly because the fabric absorbs the energy. Sabine’s equation quantifies this: more volume and harder surfaces = longer reverb; more absorption = shorter reverb.',
      storyConnection: 'The Süleymaniye Mosque has a volume of approximately 29,000 m³. With marble floors and smooth dome surfaces, the natural RT60 would exceed 8 seconds — terrible for speech. Sinan addressed this with thick carpets (absorption coefficient ~0.5), perforated wall panels, and reportedly Helmholtz resonators embedded in the walls. The measured RT60 is about 5.5 seconds at low frequencies and 2.5 seconds at speech frequencies — remarkable for a 460-year-old building.',
      checkQuestion: 'A mosque has volume 5000 m³. The total absorption is 400 sabins. What is RT60? Is it good for speech?',
      checkAnswer: 'RT60 = 0.161 × 5000 / 400 = 2.01 seconds. This is acceptable for music but slightly long for speech clarity (ideal: 0.5-1.0s). Adding 200 m² of carpet (α = 0.5, contributing 100 sabins) would reduce RT60 to 0.161 × 5000 / 500 = 1.61 s. Adding acoustic panels on the walls could bring it to the ideal range.',
      codeIntro: 'Calculate reverberation time for a mosque and optimise surface materials.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Mosque room properties
volume = 12000  # m^3 (large mosque)

# Surfaces and their areas
surfaces = {
    'Marble floor': (800, 0.01),
    'Carpet on floor': (0, 0.50),
    'Plaster walls': (1200, 0.03),
    'Dome (smooth stone)': (600, 0.02),
    'Windows (glass)': (100, 0.18),
    'Wooden doors': (50, 0.10),
    'Congregation (people)': (0, 0.80),
}

def calc_rt60(surfaces, volume):
    total_absorption = sum(area * alpha for area, alpha in surfaces.values())
    if total_absorption == 0:
        return float('inf')
    return 0.161 * volume / total_absorption

# Scenario 1: Empty mosque, no carpet
s1 = dict(surfaces)
rt1 = calc_rt60(s1, volume)

# Scenario 2: Add carpet over half the floor
s2 = dict(surfaces)
s2['Marble floor'] = (400, 0.01)
s2['Carpet on floor'] = (400, 0.50)
rt2 = calc_rt60(s2, volume)

# Scenario 3: Full carpet + 500 people
s3 = dict(s2)
s3['Congregation (people)'] = (500, 0.80)
rt3 = calc_rt60(s3, volume)

# Scenario 4: Add acoustic treatment to dome
s4 = dict(s3)
s4['Dome (smooth stone)'] = (300, 0.02)
s4['Dome (textured panels)'] = (300, 0.35)
rt4 = calc_rt60(s4, volume)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5))

scenarios = ['Empty\\n(marble)', 'Half\\ncarpet', 'Carpet +\\n500 people', 'Carpet +\\npeople +\\ndome treat.']
rts = [rt1, rt2, rt3, rt4]
colors = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981']

bars = ax1.bar(scenarios, rts, color=colors, width=0.6, edgecolor='none')
ax1.axhspan(0.5, 1.5, color='green', alpha=0.1)
ax1.text(0, 1.6, 'Ideal for speech', color='#10b981', fontsize=10)
ax1.axhspan(1.5, 2.5, color='blue', alpha=0.1)
ax1.text(0, 2.6, 'Good for music', color='#3b82f6', fontsize=10)
for bar, rt in zip(bars, rts):
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.2,
             f'{rt:.1f}s', ha='center', fontsize=11, color='white', fontweight='bold')
ax1.set_ylabel('Reverberation Time RT60 (seconds)', fontsize=11)
ax1.set_title('Mosque Acoustic Scenarios', fontsize=12)
ax1.grid(axis='y', alpha=0.3)
ax1.tick_params(labelsize=10)

# Frequency-dependent RT60
freqs = [125, 250, 500, 1000, 2000, 4000]
# Absorption coefficients vary with frequency (simplified)
alpha_marble = [0.01, 0.01, 0.01, 0.01, 0.02, 0.02]
alpha_carpet = [0.10, 0.30, 0.50, 0.65, 0.70, 0.65]
alpha_plaster = [0.01, 0.02, 0.02, 0.03, 0.04, 0.05]
alpha_people = [0.25, 0.40, 0.80, 0.85, 0.90, 0.85]

rt_freq = []
for i, f in enumerate(freqs):
    A = (400*alpha_marble[i] + 400*alpha_carpet[i] +
         1200*alpha_plaster[i] + 600*0.02 + 100*0.18 +
         50*0.10 + 500*alpha_people[i])
    rt_freq.append(0.161 * volume / A)

ax2.plot(freqs, rt_freq, 'o-', color='#a855f7', linewidth=2.5, markersize=8)
ax2.axhspan(0.5, 1.5, color='green', alpha=0.1)
ax2.set_xlabel('Frequency (Hz)', fontsize=11)
ax2.set_ylabel('RT60 (seconds)', fontsize=11)
ax2.set_title('Frequency-Dependent Reverberation', fontsize=12)
ax2.set_xscale('log')
ax2.grid(alpha=0.3)

plt.tight_layout()
plt.show()

print("=== Reverberation Analysis ===")
for name, rt in zip(scenarios, rts):
    quality = 'Excellent' if 0.5 < rt < 1.5 else 'Good' if rt < 2.5 else 'Too reverberant'
    print(f"  {name.replace(chr(10),' '):25s}: RT60 = {rt:.1f}s [{quality}]")`,
      challenge: 'Design a mosque with volume 8000 m³ that achieves RT60 = 1.2 seconds at 1000 Hz. What combination of floor, wall, and ceiling materials do you need? Budget: total surface treatment must cost less than $50,000 (carpet: $20/m², acoustic panels: $80/m², ceiling treatment: $60/m²).',
      successHint: 'Sabine’s equation is the starting point for all architectural acoustics. Every concert hall, recording studio, classroom, and place of worship is designed using this formula. Modern software extends it with ray tracing and wave simulation, but the fundamental insight — that reverb depends on volume and absorption — remains Sabine’s gift.',
    },
    {
      title: 'Speaker crossover design — splitting frequencies for clarity',
      concept: `No single speaker can reproduce all audible frequencies (20 Hz to 20,000 Hz) well. Large speakers (woofers) have heavy cones that respond slowly — great for bass but terrible for treble. Small speakers (tweeters) have light cones that vibrate fast — great for treble but cannot move enough air for bass.

A **crossover network** splits the signal:
- **Low-pass filter** sends frequencies below the crossover point to the woofer
- **High-pass filter** sends frequencies above the crossover point to the tweeter

A simple first-order crossover uses a capacitor (blocks bass, passes treble) and an inductor (blocks treble, passes bass). The crossover frequency is:

**f_c = 1 / (2π√(LC))**

Higher-order crossovers (2nd, 4th) have steeper rolloff slopes (12 dB/octave, 24 dB/octave) for cleaner separation.

For mosque speakers, the crossover typically sits at 2-3 kHz, splitting the Muezzin’s voice between a horn (mid/treble) and a larger cone (bass).`,
      analogy: 'A mail sorting centre splits parcels by size: small envelopes go one way, large boxes another. Neither conveyor belt handles both efficiently. A crossover does the same with frequency: low notes go to the big speaker, high notes to the small one. The result is cleaner, louder, and less distorted than forcing one speaker to do everything.',
      storyConnection: 'Modern mosque speaker systems typically use two-way or three-way designs. The Muezzin’s voice spans roughly 100 Hz to 4000 Hz. A crossover at 2 kHz sends the fundamental frequencies and warmth of the voice to a horn, while the upper harmonics and sibilance go to a tweeter. This ensures the Adhan is both powerful (carrying across the city) and clear (every word intelligible).',
      checkQuestion: 'A 2-way crossover splits at 2 kHz. The Muezzin sings a note at 300 Hz with harmonics at 600, 900, 1200, 1500, 1800, 2100, 2400, 3000 Hz. Which harmonics go to the woofer and which to the tweeter?',
      checkAnswer: 'Below 2 kHz (woofer): 300, 600, 900, 1200, 1500, 1800 Hz. Above 2 kHz (tweeter): 2100, 2400, 3000 Hz. The crossover region near 2 kHz has overlap where both speakers contribute. A steep rolloff (4th order, 24 dB/octave) minimises this overlap for cleaner sound.',
      codeIntro: 'Design and visualise a speaker crossover network.',
      code: `import numpy as np
import matplotlib.pyplot as plt

freqs = np.logspace(1.3, 4.3, 1000)  # 20 Hz to 20 kHz
fc = 2000  # crossover frequency

# 1st order: 6 dB/octave
H_low_1 = 1 / np.sqrt(1 + (freqs/fc)**2)
H_high_1 = 1 / np.sqrt(1 + (fc/freqs)**2)

# 2nd order: 12 dB/octave (Butterworth)
H_low_2 = 1 / np.sqrt(1 + (freqs/fc)**4)
H_high_2 = 1 / np.sqrt(1 + (fc/freqs)**4)

# 4th order: 24 dB/octave (Linkwitz-Riley)
H_low_4 = 1 / (1 + (freqs/fc)**8)**0.5
H_high_4 = 1 / (1 + (fc/freqs)**8)**0.5

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5))

for H_l, H_h, order, col in [
    (H_low_1, H_high_1, '1st (6 dB/oct)', '#ef4444'),
    (H_low_2, H_high_2, '2nd (12 dB/oct)', '#f59e0b'),
    (H_low_4, H_high_4, '4th (24 dB/oct)', '#10b981')]:
    ax1.semilogx(freqs, 20*np.log10(H_l), color=col, linewidth=2, linestyle='-')
    ax1.semilogx(freqs, 20*np.log10(H_h), color=col, linewidth=2, linestyle='--')

ax1.axvline(fc, color='white', linewidth=0.5, linestyle=':', alpha=0.3)
ax1.text(fc*1.1, -2, f'fc = {fc} Hz', color='white', fontsize=10)
ax1.set_xlabel('Frequency (Hz)', fontsize=11)
ax1.set_ylabel('Response (dB)', fontsize=11)
ax1.set_title('Crossover: Woofer (solid) + Tweeter (dashed)', fontsize=12)
ax1.set_ylim(-40, 3)
ax1.grid(alpha=0.3)
ax1.legend(['1st LP', '1st HP', '2nd LP', '2nd HP', '4th LP', '4th HP'],
           fontsize=8, ncol=3)

# Sum of woofer + tweeter for each order
sum_1 = H_low_1 + H_high_1
sum_2 = H_low_2 + H_high_2
sum_4 = H_low_4 + H_high_4

ax2.semilogx(freqs, 20*np.log10(sum_1), color='#ef4444', linewidth=2, label='1st order sum')
ax2.semilogx(freqs, 20*np.log10(sum_2), color='#f59e0b', linewidth=2, label='2nd order sum')
ax2.semilogx(freqs, 20*np.log10(sum_4), color='#10b981', linewidth=2, label='4th order sum')
ax2.axhline(0, color='white', linewidth=0.5, linestyle=':', alpha=0.3)
ax2.set_xlabel('Frequency (Hz)', fontsize=11)
ax2.set_ylabel('Combined response (dB)', fontsize=11)
ax2.set_title('Combined Response (flat = ideal)', fontsize=12)
ax2.set_ylim(-6, 6)
ax2.grid(alpha=0.3)
ax2.legend(fontsize=10)

plt.tight_layout()
plt.show()

print("=== Crossover at 2000 Hz ===")
print("1st order: gentle slope, wide overlap, flat sum")
print("2nd order: moderate slope, some dip at crossover")
print("4th order: steep slope, clean separation, flat sum")
print()
print("For mosque: 4th order Linkwitz-Riley is preferred")
print("  → clean frequency separation")
print("  → flat combined response")
print("  → no phase cancellation at crossover")`,
      challenge: 'Design a 3-way crossover with cuts at 500 Hz and 3000 Hz (woofer, mid, tweeter). Plot the three response curves and verify the combined sum is flat. What happens if the crossover frequencies are too close together?',
      successHint: 'Crossover design is fundamental to audio engineering. Every speaker system — from headphones to stadium PA systems to mosque minarets — uses crossovers to divide the frequency spectrum among specialised drivers.',
    },
    {
      title: 'Concert hall modelling — early reflections and acoustic quality',
      concept: `Acoustic quality in a room depends on the pattern of **early reflections** — the first sounds arriving within 80 ms of the direct sound. These early reflections determine:

- **Clarity (C80)**: ratio of energy in the first 80 ms to energy after 80 ms. Higher C80 = clearer speech.
- **Definition (D50)**: fraction of total energy arriving in the first 50 ms. D50 > 0.5 is good for speech.
- **Lateral Energy Fraction (LEF)**: fraction of early energy arriving from the sides. Higher LEF = greater sense of spaciousness.

Professional acoustic modelling uses **image source methods**: for every reflecting surface, calculate a "virtual source" (the speaker’s mirror image) and trace paths from each virtual source to each listener. The arrival time, amplitude, and direction of each reflection build a complete acoustic fingerprint.

The code models a simplified rectangular hall and calculates C80, D50, and LEF for different listener positions.`,
      analogy: 'Imagine throwing many balls at once in a squash court. Each ball bounces off a different wall at a different time, eventually reaching a target on the floor. The pattern of arrivals (how many, how fast, from which direction) determines whether the target "hears" a clean signal or a muddled mess. Acoustic modelling traces each "ball" (sound ray) through the room.',
      storyConnection: 'The Süleymaniye Mosque was essentially a concert hall before concert halls existed. Sinan needed speech clarity (high C80) and a sense of spacious grandeur (high LEF). He achieved this with a large central dome providing early ceiling reflections (boosting C80) and angled walls providing lateral reflections (boosting LEF). Modern acoustic measurements confirm his design achieves remarkable metrics for a 16th-century building.',
      checkQuestion: 'If a listener receives 80% of total sound energy within the first 50 ms, is D50 good for speech? What about music?',
      checkAnswer: 'D50 = 0.80, which is excellent for speech clarity (threshold: D50 > 0.50). For music, however, this level of clarity can sound "dry" — music benefits from more late energy (reverb) that creates warmth and fullness. A concert hall for orchestral music might target D50 around 0.40-0.50. This is the fundamental tension in mosque design: speech requires clarity, Qur’anic recitation benefits from some reverb.',
      codeIntro: 'Model early reflections and calculate acoustic quality metrics.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Room: 30m x 20m x 12m dome
Lx, Ly, Lz = 30, 20, 12
v = 343  # m/s

# Speaker (imam) position
sx, sy, sz = 15, 2, 1.5

# Listener positions along central axis
listeners = [(15, y, 1.2) for y in range(4, 19, 2)]

def image_sources(sx, sy, sz, Lx, Ly, Lz, order=1):
    """Generate image sources for rectangular room"""
    images = []
    for nx in range(-order, order+1):
        for ny in range(-order, order+1):
            for nz in range(-order, order+1):
                if nx == 0 and ny == 0 and nz == 0:
                    continue
                ix = nx * 2 * Lx + (-1)**nx * sx if nx != 0 else sx
                iy = ny * 2 * Ly + (-1)**ny * sy if ny != 0 else sy
                iz = nz * 2 * Lz + (-1)**nz * sz if nz != 0 else sz
                # Simple: just first-order for each axis
                if abs(nx) + abs(ny) + abs(nz) <= order:
                    refl_coeff = 0.85 ** (abs(nx) + abs(ny) + abs(nz))
                    images.append((ix, iy, iz, refl_coeff))
    # Add simple first-order images manually
    images = [
        (sx, sy, -sz, 0.9),           # floor
        (sx, sy, 2*Lz-sz, 0.8),       # ceiling
        (-sx, sy, sz, 0.85),           # left wall
        (2*Lx-sx, sy, sz, 0.85),      # right wall
        (sx, -sy, sz, 0.85),           # front wall
        (sx, 2*Ly-sy, sz, 0.85),      # back wall
    ]
    return images

images = image_sources(sx, sy, sz, Lx, Ly, Lz)

C80_values = []
D50_values = []

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5))

for idx, (lx, ly, lz) in enumerate(listeners):
    # Direct sound
    d_direct = np.sqrt((lx-sx)**2 + (ly-sy)**2 + (lz-sz)**2)
    t_direct = d_direct / v
    a_direct = 1.0 / d_direct

    arrivals = [(t_direct, a_direct**2)]

    for ix, iy, iz, rc in images:
        d = np.sqrt((lx-ix)**2 + (ly-iy)**2 + (lz-iz)**2)
        t = d / v
        a = rc / d
        arrivals.append((t, a**2))

    arrivals.sort(key=lambda x: x[0])
    times = [a[0] - t_direct for a in arrivals]
    energies = [a[1] for a in arrivals]

    # C80: energy in first 80ms / energy after 80ms
    e_early = sum(e for t, e in zip(times, energies) if t <= 0.080)
    e_late = sum(e for t, e in zip(times, energies) if t > 0.080)
    C80 = 10 * np.log10(e_early / max(e_late, 1e-10))

    # D50: fraction in first 50ms
    e_50 = sum(e for t, e in zip(times, energies) if t <= 0.050)
    e_total = sum(energies)
    D50 = e_50 / e_total

    C80_values.append(C80)
    D50_values.append(D50)

    if idx == 0 or idx == len(listeners)-1:
        ax1.stem([t*1000 for t in times], energies, linefmt='-',
                markerfmt='o', basefmt=' ', label=f'y={ly}m')

ax1.axvline(50, color='#f59e0b', linewidth=1.5, linestyle='--', alpha=0.5)
ax1.axvline(80, color='#ef4444', linewidth=1.5, linestyle='--', alpha=0.5)
ax1.text(52, max(energies)*0.8, '50ms', color='#f59e0b', fontsize=10)
ax1.text(82, max(energies)*0.8, '80ms', color='#ef4444', fontsize=10)
ax1.set_xlabel('Time after direct sound (ms)', fontsize=11)
ax1.set_ylabel('Energy', fontsize=11)
ax1.set_title('Early Reflection Pattern', fontsize=12)
ax1.legend(fontsize=10)
ax1.grid(alpha=0.3)

y_positions = [ly for _, ly, _ in listeners]
ax2.plot(y_positions, C80_values, 'o-', color='#3b82f6', linewidth=2.5, label='C80 (dB)')
ax2_twin = ax2.twinx()
ax2_twin.plot(y_positions, D50_values, 's-', color='#10b981', linewidth=2.5, label='D50')
ax2.set_xlabel('Listener distance from front (m)', fontsize=11)
ax2.set_ylabel('C80 (dB)', fontsize=11, color='#3b82f6')
ax2_twin.set_ylabel('D50', fontsize=11, color='#10b981')
ax2.set_title('Acoustic Quality vs Position', fontsize=12)
ax2.grid(alpha=0.3)

lines1, labels1 = ax2.get_legend_handles_labels()
lines2, labels2 = ax2_twin.get_legend_handles_labels()
ax2.legend(lines1 + lines2, labels1 + labels2, fontsize=10)

plt.tight_layout()
plt.show()

print("=== Acoustic Quality Metrics ===")
for (_, ly, _), c, d in zip(listeners, C80_values, D50_values):
    quality = 'Excellent' if c > 3 and d > 0.5 else 'Good' if c > 0 else 'Poor'
    print(f"  y={ly:>2}m: C80={c:>5.1f} dB, D50={d:.2f} [{quality}]")`,
      challenge: 'Add a dome (half-sphere) above the centre of the room and calculate how it changes the C80 pattern. Does the dome improve clarity at the back of the mosque?',
      successHint: 'Room acoustic modelling is used for every significant building: concert halls, theatres, mosques, lecture halls, and even open-plan offices. The image source method is simple but powerful. Professional software (ODEON, EASE) extends it with thousands of reflections and wave-based corrections.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Builds on Level 1 foundations</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for advanced acoustics simulations. Click to start.</p>
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
            diagram={[MuezzinInverseSquareDiagram, MuezzinDomeAcousticsDiagram, MuezzinSpeakerDiagram, MuezzinCityPropagationDiagram, InterferenceDiagram, MirrorReflectionDiagram][i] ? createElement([MuezzinInverseSquareDiagram, MuezzinDomeAcousticsDiagram, MuezzinSpeakerDiagram, MuezzinCityPropagationDiagram, InterferenceDiagram, MirrorReflectionDiagram][i]) : undefined}
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
