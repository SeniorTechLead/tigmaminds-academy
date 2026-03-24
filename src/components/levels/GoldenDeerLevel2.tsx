import { useState, useRef, useCallback } from 'react';
import { Loader2, Zap } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function GoldenDeerLevel2() {
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState('');

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true); setLoadProgress('Loading Python...');
    try {
      if (!(window as any).loadPyodide) { const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js'; document.head.appendChild(s); await new Promise<void>((r, j) => { s.onload = () => r(); s.onerror = () => j(new Error('Failed')); }); }
      const py = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      await py.loadPackage('micropip'); const mp = py.pyimport('micropip');
      for (const p of ['numpy', 'matplotlib']) { try { await mp.install(p); } catch { await py.loadPackage(p).catch(() => {}); } }
      await py.runPythonAsync(`import sys,io\nclass OC:\n def __init__(self):self.o=[]\n def write(self,t):self.o.append(t)\n def flush(self):pass\n def get_output(self):return''.join(self.o)\n def clear(self):self.o=[]\n_stdout_capture=OC();sys.stdout=_stdout_capture;sys.stderr=_stdout_capture\nimport matplotlib;matplotlib.use('AGG');import matplotlib.pyplot as plt;import base64\ndef _get_plot_as_base64():\n buf=io.BytesIO();plt.savefig(buf,format='png',dpi=100,bbox_inches='tight',facecolor='#1f2937',edgecolor='none');buf.seek(0);s=base64.b64encode(buf.read()).decode('utf-8');plt.close('all');return s`);
      pyodideRef.current = py; setPyReady(true); setLoading(false); setLoadProgress(''); return py;
    } catch (e: any) { setLoading(false); setLoadProgress('Error: ' + e.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Lenses — how they focus light',
      concept: `In Level 1 you learned that light bends when it crosses a boundary between materials (refraction). A **lens** is a piece of glass or plastic shaped to bend light in a specific, controlled way. By curving the surface, a lens can make parallel rays converge to a single point — the **focal point**.

There are two main types:
- **Convex (converging) lens**: thicker in the middle, bends light inward. Used in magnifying glasses, cameras, telescopes, and your own eyes. Parallel rays converge to a focal point at distance **f** (the focal length).
- **Concave (diverging) lens**: thinner in the middle, spreads light outward. Used in flashlights, corrective glasses for nearsightedness, and peepholes.

The **thin lens equation** relates object distance (d_o), image distance (d_i), and focal length (f):

**1/f = 1/d_o + 1/d_i**

This single equation governs cameras, microscopes, telescopes, projectors, and your eyeballs. When d_o > f, a convex lens forms a real, inverted image (cameras). When d_o < f, it forms a virtual, upright, magnified image (magnifying glass).

Your eye is a convex lens with f ~ 17 mm. The cornea and lens focus light onto the retina, which is the "sensor" at the back. Nearsightedness happens when the eye\'s focal length is too short (image forms before the retina); farsightedness when it is too long.`,
      analogy: 'A lens is like a funnel for light. A convex lens narrows a wide stream of light down to a point (like a funnel concentrating water). A concave lens is like an upside-down funnel — it spreads light out. The shape of the funnel determines exactly where and how the light converges.',
      storyConnection: 'If someone in the story used a lens to observe the golden deer from far away, they would be using refraction — the same physics that made the deer\'s eyes "sparkle like river reflections." A telescope is just controlled refraction: multiple lenses bending light to bring distant objects close.',
      checkQuestion: 'A camera lens has a focal length of 50 mm. An object is 2 meters (2000 mm) away. Where does the image form? (Use 1/f = 1/d_o + 1/d_i)',
      checkAnswer: '1/50 = 1/2000 + 1/d_i, so 1/d_i = 1/50 - 1/2000 = 40/2000 - 1/2000 = 39/2000, giving d_i = 2000/39 = 51.3 mm. The image forms just 1.3 mm behind the focal point. This is where the camera sensor (or film) must be placed. Notice: the farther the object, the closer d_i gets to f.',
      codeIntro: 'Simulate how a convex lens focuses parallel light rays to a focal point.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# --- Left: Convex lens ray diagram ---
ax1.set_facecolor('#111827')
ax1.set_xlim(-8, 8)
ax1.set_ylim(-4, 4)
ax1.set_aspect('equal')

# Draw lens (vertical ellipse)
theta = np.linspace(0, 2 * np.pi, 100)
lens_x = 0.3 * np.cos(theta)
lens_y = 3 * np.sin(theta)
ax1.plot(lens_x, lens_y, color='#38bdf8', linewidth=2)
ax1.fill(lens_x, lens_y, color='#38bdf8', alpha=0.15)

# Focal points
f = 3  # focal length
ax1.plot([-f, f], [0, 0], 'o', color='#f59e0b', markersize=8)
ax1.text(-f, -0.5, 'F', color='#f59e0b', ha='center', fontsize=10)
ax1.text(f, -0.5, 'F', color='#f59e0b', ha='center', fontsize=10)

# Optical axis
ax1.axhline(0, color='gray', linewidth=0.5, linestyle='--')

# Parallel rays converging to focal point
ray_heights = [-2.0, -1.0, 0, 1.0, 2.0]
for h in ray_heights:
    # Incoming parallel ray
    ax1.annotate('', xy=(0, h), xytext=(-7, h),
                 arrowprops=dict(arrowstyle='->', color='#f59e0b', lw=1.5))
    # Refracted ray to focal point
    if h != 0:
        ax1.plot([0, f], [h, 0], color='#22c55e', linewidth=1.5)
        # Continue past focal point
        dx = 7 - f
        slope = -h / f
        ax1.plot([f, 7], [0, slope * dx], color='#22c55e', linewidth=1, alpha=0.4)
    else:
        ax1.annotate('', xy=(7, 0), xytext=(0, 0),
                     arrowprops=dict(arrowstyle='->', color='#22c55e', lw=1.5))

ax1.set_title('Convex Lens: Focusing Light', color='white', fontsize=12)
ax1.set_xlabel('Distance (arbitrary units)', color='white')
ax1.tick_params(colors='gray')

# --- Right: Thin lens equation visualization ---
ax2.set_facecolor('#111827')

f_lens = 50  # mm
d_objects = np.linspace(55, 5000, 500)  # object distances in mm
d_images = 1 / (1/f_lens - 1/d_objects)

# Magnification
magnification = -d_images / d_objects

ax2_twin = ax2.twinx()

ax2.plot(d_objects / 1000, d_images, color='#22c55e', linewidth=2, label='Image distance')
ax2.axhline(f_lens, color='#f59e0b', linewidth=1, linestyle='--', label=f'Focal length ({f_lens}mm)')
ax2.set_xlabel('Object distance (meters)', color='white')
ax2.set_ylabel('Image distance (mm)', color='#22c55e')
ax2.set_ylim(45, 200)
ax2.set_title(f'Thin Lens Equation (f = {f_lens}mm)', color='white', fontsize=12)
ax2.tick_params(axis='y', colors='#22c55e')
ax2.tick_params(axis='x', colors='gray')
ax2.legend(loc='upper right', facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)

ax2_twin.plot(d_objects / 1000, np.abs(magnification), color='#a855f7', linewidth=1.5,
              linestyle=':', label='|Magnification|')
ax2_twin.set_ylabel('|Magnification|', color='#a855f7')
ax2_twin.tick_params(axis='y', colors='#a855f7')
ax2_twin.set_ylim(0, 0.5)
ax2_twin.legend(loc='center right', facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)

plt.tight_layout()
plt.show()

print("Thin lens equation: 1/f = 1/d_o + 1/d_i")
print()
print(f"Camera lens (f = {f_lens}mm):")
for d in [0.5, 1, 2, 5, 10]:
    d_mm = d * 1000
    d_i = 1 / (1/f_lens - 1/d_mm)
    mag = abs(-d_i / d_mm)
    print(f"  Object at {d}m -> image at {d_i:.1f}mm (mag: {mag:.4f})")
print()
print("Key insight: the farther the object, the closer the")
print("image distance approaches the focal length.")
print("At infinity: d_i = f exactly (that's how we measure f).")`,
      challenge: 'What happens when the object is closer than the focal length (d_o < f)? The thin lens equation gives a negative d_i, meaning the image is virtual — on the same side as the object. This is how a magnifying glass works. Plot this region.',
      successHint: 'Every camera, telescope, microscope, and pair of glasses uses the thin lens equation. Your eyes focus light using a biological lens — same physics, different material. The golden deer could be photographed because lenses know how to bend its reflected light into a sharp image.',
    },
    {
      title: 'Prisms and spectroscopy — splitting white light into colors',
      concept: `In Level 1 you learned that white light is a mix of all visible wavelengths. A **prism** can separate white light into its component colors because of **dispersion**: different wavelengths refract by different amounts.

The refractive index of glass is not constant — it varies with wavelength. Blue light (short wavelength, ~450 nm) has a slightly higher refractive index in glass than red light (long wavelength, ~700 nm). So blue bends more than red. When white light enters a prism at an angle, each wavelength bends differently, spreading the beam into a **spectrum** — the rainbow of colors from violet to red.

**Spectroscopy** takes this principle further. Every element, when heated, emits light at specific wavelengths (emission lines). And every element absorbs specific wavelengths from white light passing through it (absorption lines). By analyzing the spectrum of a light source, scientists can determine:
- What elements are present (each has a unique spectral "fingerprint")
- The temperature of the source
- Whether it is moving toward or away from us (Doppler shift)

This is how we know what stars are made of — even stars millions of light-years away. We split their light with a prism (or diffraction grating) and read the spectral lines.`,
      analogy: 'A prism is like a linguistic translator that reveals every language in a crowd. White light is a crowd of wavelengths all talking at once. The prism separates them so you can hear each one individually. Spectroscopy is reading those individual voices to identify who is in the crowd.',
      storyConnection: 'The golden deer\'s coat shone in sunlight — white light containing all wavelengths. If you passed that reflected light through a prism, you would see the deer\'s spectral signature: strong emission in the yellow-orange range, weak in the blue. Every golden surface has its own unique spectrum.',
      checkQuestion: 'How can astronomers determine the chemical composition of a star that is 100 light-years away without ever visiting it?',
      checkAnswer: 'They collect the star\'s light and pass it through a spectrograph (a sophisticated prism). The resulting spectrum has dark absorption lines at specific wavelengths — each line corresponds to an element in the star\'s atmosphere absorbing that wavelength. Hydrogen produces a specific pattern of lines; helium, carbon, iron each have their own. It is like reading a barcode made of light.',
      codeIntro: 'Simulate white light passing through a prism and splitting into a spectrum.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# --- Left: Prism dispersion diagram ---
ax1.set_facecolor('#111827')
ax1.set_xlim(-2, 6)
ax1.set_ylim(-2.5, 2.5)
ax1.set_aspect('equal')

# Draw prism (triangle)
prism_x = [0, 1.5, 0.75, 0]
prism_y = [-1.5, 0, 1.5, -1.5]
ax1.fill(prism_x, prism_y, color='#38bdf8', alpha=0.2)
ax1.plot(prism_x, prism_y, color='#38bdf8', linewidth=2)
ax1.text(0.75, 0, 'PRISM', color='#38bdf8', ha='center', fontsize=10, fontweight='bold')

# Incoming white light
ax1.annotate('', xy=(0.3, 0.6), xytext=(-2, 0.6),
             arrowprops=dict(arrowstyle='->', color='white', lw=3))
ax1.text(-1.5, 0.9, 'White light', color='white', fontsize=10)

# Dispersed rays (different colors at different angles)
colors_disp = [
    ('#8b5cf6', 'Violet', -0.15),
    ('#3b82f6', 'Blue', -0.05),
    ('#22c55e', 'Green', 0.05),
    ('#eab308', 'Yellow', 0.12),
    ('#f97316', 'Orange', 0.19),
    ('#ef4444', 'Red', 0.26),
]

start_x, start_y = 1.2, 0.3
for color, label, offset in colors_disp:
    end_x = 5.5
    end_y = start_y + (end_x - start_x) * offset - 0.8
    ax1.plot([start_x, end_x], [start_y, end_y], color=color, linewidth=2)
    ax1.text(end_x + 0.1, end_y, label, color=color, fontsize=8, va='center')

ax1.set_title('Dispersion: Prism Splits White Light', color='white', fontsize=12)
ax1.tick_params(colors='gray', labelbottom=False, labelleft=False)

# --- Right: Refractive index vs wavelength (dispersion curve) ---
ax2.set_facecolor('#111827')

# Cauchy equation for crown glass: n = A + B/lambda^2 + C/lambda^4
wavelengths = np.linspace(380, 700, 200)
A, B, C = 1.5220, 4.59e3, 3.56e8
n_glass = A + B / wavelengths**2 + C / wavelengths**4

def wavelength_to_rgb(wl):
    if 380 <= wl < 440:
        r, g, b = -(wl - 440) / 60, 0.0, 1.0
    elif 440 <= wl < 490:
        r, g, b = 0.0, (wl - 440) / 50, 1.0
    elif 490 <= wl < 510:
        r, g, b = 0.0, 1.0, -(wl - 510) / 20
    elif 510 <= wl < 580:
        r, g, b = (wl - 510) / 70, 1.0, 0.0
    elif 580 <= wl < 645:
        r, g, b = 1.0, -(wl - 645) / 65, 0.0
    elif 645 <= wl <= 700:
        r, g, b = 1.0, 0.0, 0.0
    else:
        r, g, b = 0.0, 0.0, 0.0
    return (r, g, b)

# Plot with color gradient
for i in range(len(wavelengths) - 1):
    color = wavelength_to_rgb(wavelengths[i])
    ax2.plot(wavelengths[i:i+2], n_glass[i:i+2], color=color, linewidth=3)

ax2.set_xlabel('Wavelength (nm)', color='white')
ax2.set_ylabel('Refractive index (n)', color='white')
ax2.set_title('Dispersion: n Varies with Wavelength', color='white', fontsize=12)
ax2.tick_params(colors='gray')

# Annotate
ax2.annotate(f'Violet: n = {n_glass[0]:.4f}\\n(bends most)',
             xy=(380, n_glass[0]), xytext=(430, n_glass[0] + 0.003),
             color='#8b5cf6', fontsize=9,
             arrowprops=dict(arrowstyle='->', color='#8b5cf6'))
ax2.annotate(f'Red: n = {n_glass[-1]:.4f}\\n(bends least)',
             xy=(700, n_glass[-1]), xytext=(580, n_glass[-1] - 0.005),
             color='#ef4444', fontsize=9,
             arrowprops=dict(arrowstyle='->', color='#ef4444'))

plt.tight_layout()
plt.show()

print("Dispersion: different wavelengths refract differently")
print(f"  Violet (380 nm): n = {n_glass[0]:.4f} (bends most)")
print(f"  Red (700 nm): n = {n_glass[-1]:.4f} (bends least)")
print(f"  Difference: {n_glass[0] - n_glass[-1]:.4f}")
print()
print("This tiny difference in n is enough to spread white")
print("light into a full rainbow through a prism.")
print()
print("Applications:")
print("  - Spectroscopy: identify elements by their spectral lines")
print("  - Astronomy: determine star composition from light-years away")
print("  - Chemistry: identify unknown substances")
print("  - Quality control: verify material purity")`,
      challenge: 'Rainbows are natural prisms — water droplets split sunlight through refraction and internal reflection. The second rainbow (fainter, outside the first) has reversed colors. Why? Hint: it involves an extra internal reflection inside the droplet.',
      successHint: 'Newton was the first to show that white light is a mixture, not a pure entity, by passing it through a prism in 1666. That single experiment launched the field of spectroscopy — which today lets us read the chemistry of stars billions of light-years away.',
    },
    {
      title: 'Fiber optics — guiding light through glass',
      concept: `In Level 1 you learned about total internal reflection — when light hits a boundary at a steep enough angle, it reflects completely instead of passing through. **Fiber optics** exploit this principle to guide light through thin glass fibers over enormous distances.

An optical fiber has two layers:
- **Core**: a thin glass strand (8-62 microns diameter) where light travels
- **Cladding**: an outer glass layer with a lower refractive index

When light enters the core at a shallow angle, it hits the core-cladding boundary at an angle greater than the **critical angle**. Total internal reflection kicks in — the light bounces back into the core. It bounces thousands of times per meter, zig-zagging down the fiber with almost no loss.

Modern fiber optic cables transmit data at the speed of light (well, 0.69c in glass) across oceans. A single fiber can carry **100+ terabits per second** — enough for millions of simultaneous video calls. The internet backbone is fiber optic. When you watch a video from a server in another country, the data traveled as pulses of light through undersea glass fibers.

Key numbers:
- A fiber optic cable can be thinner than a human hair
- Light can travel ~100 km in fiber before needing amplification
- Submarine cables carry 99% of intercontinental internet traffic
- The total length of undersea fiber: over 1.3 million km`,
      analogy: 'Imagine a perfectly polished tunnel with mirrored walls. You shine a flashlight in at one end at an angle. The light bounces off wall after wall, zig-zagging its way to the other end without ever escaping through the walls. That is total internal reflection in a fiber. The "mirror" is just physics — the difference in refractive index between core and cladding.',
      storyConnection: 'The golden deer radiated light that traveled through the air to reach the eyes of those who saw it. Fiber optics trap that same kind of light inside glass and guide it wherever we want — across rooms, cities, or oceans. Light that once illuminated a mythical deer now carries the world\'s information.',
      checkQuestion: 'Why is fiber optic better than copper wire for long-distance communication?',
      checkAnswer: 'Three reasons: (1) Speed — light in fiber is faster than electrical signals in copper. (2) Bandwidth — a single fiber carries far more data than copper. (3) Loss — light in fiber loses less signal over distance than electricity in copper. Also, fiber is immune to electromagnetic interference, lighter, and harder to tap (better security).',
      codeIntro: 'Simulate light bouncing through an optical fiber using total internal reflection.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 6))
fig.patch.set_facecolor('#1f2937')

# --- Top: light path inside fiber ---
ax1.set_facecolor('#111827')

# Fiber parameters
fiber_length = 10  # arbitrary units
core_radius = 0.5
n_core = 1.48
n_cladding = 1.46

# Critical angle
critical_angle = np.degrees(np.arcsin(n_cladding / n_core))

# Draw fiber
ax1.fill_between([0, fiber_length], -core_radius - 0.2, -core_radius,
                 color='#1e3a5f', alpha=0.5, label='Cladding')
ax1.fill_between([0, fiber_length], core_radius, core_radius + 0.2,
                 color='#1e3a5f', alpha=0.5)
ax1.fill_between([0, fiber_length], -core_radius, core_radius,
                 color='#0f172a', alpha=0.3, label='Core')

# Draw boundaries
ax1.plot([0, fiber_length], [core_radius, core_radius], color='#38bdf8', linewidth=2)
ax1.plot([0, fiber_length], [-core_radius, -core_radius], color='#38bdf8', linewidth=2)

# Simulate light ray bouncing through fiber
entry_angle = 12  # degrees from axis
angle_rad = np.radians(entry_angle)

x_points = [0]
y_points = [0]
x = 0
y = 0
direction = 1  # 1 = going up, -1 = going down
slope = np.tan(angle_rad) * direction

while x < fiber_length:
    # Find where ray hits the wall
    if direction == 1:
        dx = (core_radius - y) / np.tan(angle_rad)
    else:
        dx = (-core_radius - y) / (-np.tan(angle_rad))

    x_next = x + dx
    y_next = core_radius * direction

    if x_next > fiber_length:
        # Ray exits the fiber
        y_exit = y + (fiber_length - x) * np.tan(angle_rad) * direction
        x_points.append(fiber_length)
        y_points.append(y_exit)
        break

    x_points.append(x_next)
    y_points.append(y_next)

    # Total internal reflection: reverse y direction
    direction *= -1
    x = x_next
    y = y_next

# Plot ray path
ax1.plot(x_points, y_points, color='#f59e0b', linewidth=2, label='Light ray')

# Mark reflection points
for xp, yp in zip(x_points[1:-1], y_points[1:-1]):
    ax1.plot(xp, yp, 'o', color='#ef4444', markersize=5)

ax1.set_xlim(-0.5, fiber_length + 0.5)
ax1.set_ylim(-1.2, 1.2)
ax1.set_xlabel('Distance along fiber', color='white')
ax1.set_ylabel('Position', color='white')
ax1.set_title(f'Light Bouncing Through Optical Fiber (entry angle: {entry_angle} deg)',
              color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# --- Bottom: acceptance angle and numerical aperture ---
ax2.set_facecolor('#111827')

# Plot light loss vs entry angle
angles = np.linspace(0, 30, 200)
# Numerical aperture
NA = np.sqrt(n_core**2 - n_cladding**2)
max_angle = np.degrees(np.arcsin(NA))

# Transmission efficiency (simplified model)
transmission = np.where(angles < max_angle, 100, 100 * np.exp(-2 * (angles - max_angle)))

ax2.plot(angles, transmission, color='#22c55e', linewidth=2)
ax2.axvline(max_angle, color='#ef4444', linewidth=1.5, linestyle='--',
            label=f'Max acceptance angle: {max_angle:.1f} deg')
ax2.fill_between(angles, transmission, where=angles < max_angle,
                 alpha=0.15, color='#22c55e')

ax2.set_xlabel('Entry angle (degrees from axis)', color='white')
ax2.set_ylabel('Transmission (%)', color='white')
ax2.set_title('Fiber Acceptance: Light Must Enter at a Shallow Angle', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Fiber optic parameters:")
print(f"  Core refractive index: {n_core}")
print(f"  Cladding refractive index: {n_cladding}")
print(f"  Critical angle: {critical_angle:.1f} degrees")
print(f"  Numerical aperture (NA): {NA:.4f}")
print(f"  Max acceptance angle: {max_angle:.1f} degrees")
print()
print("Total internal reflection keeps light trapped inside.")
print("The ray bounces thousands of times per meter —")
print("but loses almost no energy at each reflection.")
print()
print("This is how your internet works:")
print("  Light pulses = data bits (on = 1, off = 0)")
print("  Speed: ~200,000 km/s in glass (0.69c)")
print("  Capacity: 100+ Tbps per fiber")`,
      challenge: 'What happens if you increase the core-cladding refractive index difference? Try n_core = 1.52 and n_cladding = 1.40. The acceptance angle increases — meaning the fiber can capture light from a wider cone. But there is a trade-off: wider angles cause more mode dispersion (signal blurring). Research this.',
      successHint: 'Total internal reflection — a concept from Level 1 — is the foundation of the global internet. The next time you stream a video, remember: those bits traveled as light pulses bouncing through glass fibers under the ocean. The physics of the golden deer\'s shimmer now carries human civilization\'s information.',
    },
    {
      title: 'Lasers — coherent light and its applications',
      concept: `Ordinary light (from the sun, a lamp, or the golden deer) is **incoherent** — the waves have random phases, directions, and often multiple wavelengths. A **laser** produces light that is:

- **Monochromatic**: a single wavelength (one pure color)
- **Coherent**: all waves are in phase (peaks align with peaks)
- **Collimated**: the beam stays narrow over long distances

LASER stands for **Light Amplification by Stimulated Emission of Radiation**. Here is how it works:

1. **Excitation**: energy (electricity, light, or chemical reaction) pumps atoms to a higher energy state
2. **Stimulated emission**: a photon passing by an excited atom triggers it to release an identical photon — same wavelength, same direction, same phase
3. **Amplification**: mirrors at each end of the laser cavity bounce photons back and forth, triggering more stimulated emissions. One mirror is partially transparent, allowing the beam to escape.

The result: a beam of perfectly synchronized photons — billions of waves marching in lockstep.

Applications span every field:
- **Medicine**: laser eye surgery (LASIK), tumor removal, dental procedures
- **Manufacturing**: laser cutting, welding, 3D printing
- **Communication**: fiber optic signals use laser diodes
- **Science**: spectroscopy, holography, atomic clocks, gravitational wave detection
- **Daily life**: barcode scanners, laser pointers, Blu-ray players`,
      analogy: 'Imagine a crowd of people clapping. Normally, everyone claps at random times — incoherent (ordinary light). Now imagine a conductor gets everyone to clap at exactly the same moment, with the same rhythm. The synchronized clapping is much louder and more focused. That is a laser — synchronized photons instead of synchronized claps.',
      storyConnection: 'The golden deer\'s radiance was beautiful but chaotic — sunlight scattered in all directions by its fur. A laser takes that same fundamental entity (photons) and organizes them into a precise, powerful beam. It is the difference between a golden glow and a golden arrow of light that can cut steel.',
      checkQuestion: 'Why can a 5-milliwatt laser pointer be dangerous to your eyes, when a 100-watt light bulb is not?',
      checkAnswer: 'The light bulb spreads 100 watts over a full sphere — very little power enters your tiny pupil. The laser concentrates 5 milliwatts into a beam just 1mm wide, all focused by your eye lens onto a microscopic point on your retina. The power density (watts per square millimeter) on the retina from a laser is thousands of times higher than from a bulb.',
      codeIntro: 'Compare coherent laser light with incoherent ordinary light by plotting their waves.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 2, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')

# --- Top left: incoherent light (random phases, multiple wavelengths) ---
ax1 = axes[0, 0]
ax1.set_facecolor('#111827')

x = np.linspace(0, 10, 1000)
np.random.seed(42)

# 5 random waves (different wavelengths, phases, amplitudes)
total = np.zeros_like(x)
for i in range(5):
    wavelength = np.random.uniform(0.8, 1.5)
    phase = np.random.uniform(0, 2 * np.pi)
    amplitude = np.random.uniform(0.3, 1.0)
    wave = amplitude * np.sin(2 * np.pi * x / wavelength + phase)
    ax1.plot(x, wave, alpha=0.3, linewidth=1)
    total += wave

ax1.plot(x, total, color='white', linewidth=2, label='Sum')
ax1.set_title('Incoherent Light (lamp/sun)', color='white', fontsize=11)
ax1.set_ylabel('Amplitude', color='white')
ax1.legend(facecolor='#1f2937', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')
ax1.set_ylim(-4, 4)

# --- Top right: coherent light (same wavelength, phase) ---
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')

total_coherent = np.zeros_like(x)
for i in range(5):
    wave = np.sin(2 * np.pi * x / 1.0)  # all same
    ax2.plot(x, wave, alpha=0.3, color='#ef4444', linewidth=1)
    total_coherent += wave

ax2.plot(x, total_coherent, color='#ef4444', linewidth=2, label='Sum (5x amplitude!)')
ax2.set_title('Coherent Light (laser)', color='#ef4444', fontsize=11)
ax2.legend(facecolor='#1f2937', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')
ax2.set_ylim(-6, 6)

# --- Bottom left: laser cavity diagram ---
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
ax3.set_xlim(-1, 11)
ax3.set_ylim(-2, 2)
ax3.set_aspect('equal')

# Mirrors
ax3.plot([0, 0], [-1.5, 1.5], color='#94a3b8', linewidth=4, label='Full mirror')
ax3.plot([10, 10], [-1.5, 1.5], color='#94a3b8', linewidth=4, linestyle='--',
         label='Partial mirror')

# Gain medium
ax3.fill_between([1, 9], -1, 1, color='#7c3aed', alpha=0.2)
ax3.text(5, 0, 'Gain medium\\n(excited atoms)', color='#a855f7',
         ha='center', fontsize=9, fontweight='bold')

# Photons bouncing
for y_off in [-0.3, 0, 0.3]:
    ax3.annotate('', xy=(9.5, y_off), xytext=(0.5, y_off),
                 arrowprops=dict(arrowstyle='->', color='#ef4444', lw=1.5))

# Output beam
ax3.annotate('', xy=(13, 0), xytext=(10.2, 0),
             arrowprops=dict(arrowstyle='->', color='#ef4444', lw=3))
ax3.text(11.5, 0.5, 'LASER\\nBEAM', color='#ef4444', fontsize=10,
         ha='center', fontweight='bold')

ax3.set_title('Laser Cavity', color='white', fontsize=11)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white',
           fontsize=8, loc='lower left')
ax3.tick_params(colors='gray', labelbottom=False, labelleft=False)

# --- Bottom right: beam divergence comparison ---
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')

distances = np.linspace(0, 100, 200)  # meters

# Flashlight: beam spreads ~15 degrees half-angle
flashlight_radius = distances * np.tan(np.radians(15))

# Laser: beam spreads ~0.05 degrees (1 mrad)
laser_radius = 0.001 + distances * np.tan(np.radians(0.05))

ax4.plot(distances, flashlight_radius, color='#f59e0b', linewidth=2, label='Flashlight')
ax4.plot(distances, laser_radius, color='#ef4444', linewidth=2, label='Laser')
ax4.set_xlabel('Distance (meters)', color='white')
ax4.set_ylabel('Beam radius (meters)', color='white')
ax4.set_title('Beam Divergence: Laser vs Flashlight', color='white', fontsize=11)
ax4.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Incoherent light: random phases cancel out")
print("  5 waves of amplitude 1 -> sum amplitude ~ 2.2 (random walk)")
print()
print("Coherent light: phases reinforce")
print("  5 waves of amplitude 1 -> sum amplitude = 5 (perfect addition)")
print()
print("That's why lasers are powerful despite low total energy:")
print("  All the energy is concentrated in one direction,")
print("  one wavelength, perfectly in phase.")
print()
print("At 100m distance:")
print(f"  Flashlight beam radius: {flashlight_radius[-1]:.1f} m (spread everywhere)")
print(f"  Laser beam radius: {laser_radius[-1]:.3f} m (still tight)")`,
      challenge: 'Laser pointers are typically 1-5 mW. The world\'s most powerful laser (National Ignition Facility) outputs 500 terawatts in pulses lasting a few nanoseconds, aimed at achieving nuclear fusion. Calculate the total energy in one pulse (power x time) and compare it to everyday objects.',
      successHint: 'Lasers transformed technology, medicine, communication, and science. The golden deer scattered light in all directions — beautiful but inefficient. A laser takes that same light and gives it military discipline: one wavelength, one direction, one phase. Order from chaos.',
    },
    {
      title: 'Optical illusions — how our brain interprets light',
      concept: `Your eyes do not see reality directly. Light enters the eye, hits the retina, and the retina sends electrical signals to the brain. The brain then **constructs** a visual experience from those signals. Most of the time, this construction matches reality. Sometimes it does not — and the result is an **optical illusion**.

Optical illusions reveal the brain's visual processing rules:

- **Brightness contrast**: a gray square on a dark background looks lighter than the same gray on a light background. The brain judges brightness *relative to surroundings*, not absolutely.
- **Color constancy**: a banana still looks yellow under blue-tinted light. The brain "subtracts" the ambient light color to estimate the object's "true" color. This is why "the dress" (2015) divided the internet — people's brains made different assumptions about the lighting.
- **Size illusions**: the Muller-Lyer illusion makes identical lines look different lengths based on arrow direction at the ends. The Ponzo illusion makes identical objects look different sizes based on converging lines (perspective cues).
- **Motion illusions**: static patterns that appear to move, caused by the brain's edge-detection and motion-processing systems.

These are not "errors" — they are features. The brain optimizes for speed and usefulness, not pixel-perfect accuracy. Seeing a "probably a tiger" faster is more useful than seeing an "accurate but slow analysis of striped patterns."`,
      analogy: 'Your visual system is like an AI image recognition model. It was trained (by evolution) on millions of years of real-world scenes. It makes assumptions and fills in gaps. When the input matches the training data, it works perfectly. When the input is unusual (an optical illusion), the assumptions fail — revealing the algorithm underneath.',
      storyConnection: 'Did the people of Kamakhya truly see a golden deer? Or did the dappled light through the forest, the expectation of something magical, and the brief glimpse cause their brains to construct "golden deer" from ambiguous visual data? Every sighting involves not just photons, but interpretation. The brain builds the image.',
      checkQuestion: 'Two identical gray squares are placed on different backgrounds — one white, one black. Most people swear the square on the black background is lighter. Why?',
      checkAnswer: 'The brain uses **lateral inhibition** — neurons that detect brightness are suppressed by their neighbors. On a dark background, the gray square\'s neurons are not suppressed (dark neighbors), so the signal seems stronger. On a light background, the surrounding brightness suppresses the gray square\'s signal. Same input, different neural processing, different perception.',
      codeIntro: 'Generate optical illusions with matplotlib to see your brain\'s biases in action.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 2, figsize=(10, 8))
fig.patch.set_facecolor('#1f2937')

# --- 1. Brightness contrast illusion ---
ax1 = axes[0, 0]
ax1.set_facecolor('#111827')

# Create two backgrounds with same gray square
size = 100
dark_bg = np.ones((size, size)) * 0.1  # dark
light_bg = np.ones((size, size)) * 0.9  # light

# Same gray value in the center
gray_val = 0.5
sq = 25
combined = np.ones((size, size * 2 + 10)) * 0.5
combined[:, :size] = dark_bg
combined[:, size+10:] = light_bg
combined[sq:size-sq, sq:size-sq] = gray_val
combined[sq:size-sq, size+10+sq:size*2+10-sq] = gray_val

ax1.imshow(combined, cmap='gray', vmin=0, vmax=1)
ax1.set_title('Brightness Contrast\\n(Both inner squares are identical gray)', color='white', fontsize=10)
ax1.tick_params(colors='gray', labelbottom=False, labelleft=False)

# --- 2. Hermann grid illusion ---
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')

grid = np.zeros((200, 200))
square_size = 30
gap = 8
for row in range(0, 200, square_size + gap):
    for col in range(0, 200, square_size + gap):
        grid[row:row+square_size, col:col+square_size] = 1

ax2.imshow(grid, cmap='gray', vmin=0, vmax=1)
ax2.set_title('Hermann Grid\\n(See gray dots at intersections?\\nThey are not there!)',
              color='white', fontsize=10)
ax2.tick_params(colors='gray', labelbottom=False, labelleft=False)

# --- 3. Muller-Lyer illusion ---
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
ax3.set_xlim(-1, 11)
ax3.set_ylim(-1, 5)
ax3.set_aspect('equal')

# Line 1: outward arrows (appears shorter)
y1 = 3.5
ax3.plot([2, 8], [y1, y1], color='white', linewidth=3)
arrow_len = 0.8
for x, direction in [(2, -1), (8, 1)]:
    ax3.plot([x, x + direction * arrow_len], [y1, y1 + arrow_len], color='#ef4444', linewidth=2)
    ax3.plot([x, x + direction * arrow_len], [y1, y1 - arrow_len], color='#ef4444', linewidth=2)

# Line 2: inward arrows (appears longer)
y2 = 1.0
ax3.plot([2, 8], [y2, y2], color='white', linewidth=3)
for x, direction in [(2, 1), (8, -1)]:
    ax3.plot([x, x + direction * arrow_len], [y2, y2 + arrow_len], color='#22c55e', linewidth=2)
    ax3.plot([x, x + direction * arrow_len], [y2, y2 - arrow_len], color='#22c55e', linewidth=2)

ax3.text(5, 4.5, 'Both lines are the SAME length!', color='#f59e0b',
         ha='center', fontsize=10, fontweight='bold')
ax3.set_title('Muller-Lyer Illusion', color='white', fontsize=10)
ax3.tick_params(colors='gray', labelbottom=False, labelleft=False)

# --- 4. Checker shadow illusion (simplified) ---
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')

# Create checkerboard with gradient shadow
board = np.zeros((8, 8))
for r in range(8):
    for c in range(8):
        if (r + c) % 2 == 0:
            board[r, c] = 0.8  # light square
        else:
            board[r, c] = 0.3  # dark square

# Apply a shadow gradient (darken right side)
shadow = np.ones((8, 8))
for c in range(8):
    shadow[:, c] = 1.0 - 0.06 * c

board_shadowed = board * shadow

ax4.imshow(board_shadowed, cmap='gray', vmin=0, vmax=1, interpolation='nearest')

# Mark two squares with same actual value
# A light square in shadow and a dark square in light
r1, c1 = 3, 6  # light square in shadow area
r2, c2 = 3, 1  # dark square in light area
v1 = board_shadowed[r1, c1]
v2 = board_shadowed[r2, c2]

ax4.plot(c1, r1, 's', color='#ef4444', markersize=20, markerfacecolor='none', markeredgewidth=2)
ax4.plot(c2, r2, 's', color='#22c55e', markersize=20, markerfacecolor='none', markeredgewidth=2)
ax4.set_title(f'Shadow Illusion\\nRed={v1:.2f}, Green={v2:.2f}\\n(close values, look different!)',
              color='white', fontsize=10)
ax4.tick_params(colors='gray', labelbottom=False, labelleft=False)

plt.tight_layout()
plt.show()

print("Your brain does NOT show you raw pixel data.")
print("It processes, interprets, and sometimes deceives you.")
print()
print("Illusion 1: Same gray looks different on different backgrounds")
print("  -> Brain uses RELATIVE brightness, not absolute")
print()
print("Illusion 2: Gray dots appear at intersections of white lines")
print("  -> Lateral inhibition in retinal ganglion cells")
print()
print("Illusion 3: Same-length lines look different")
print("  -> Brain interprets arrow tips as depth cues")
print()
print("Illusion 4: Same shade looks different in shadow vs light")
print("  -> Brain compensates for assumed lighting")
print()
print("Vision is not a camera. It is an interpretation engine.")`,
      challenge: 'Search online for the "rotating snakes" illusion by Akiyoshi Kitaoka. These static images appear to rotate because of how your brain processes high-contrast edges at the periphery of vision. Can you create a simple version with matplotlib using repeated circular gradient patterns?',
      successHint: 'Optical illusions are not party tricks — they reveal the architecture of human vision. Understanding how the brain constructs images from light is essential for designing displays, user interfaces, virtual reality, camouflage, and art. The golden deer was as much a brain event as a light event.',
    },
    {
      title: 'From light to technology — cameras, screens, and solar panels',
      concept: `Everything you have learned across both levels — electromagnetic waves, reflection, refraction, lenses, color, spectra, fiber optics, lasers — comes together in the technologies you use every day:

**Cameras**: A lens (refraction) focuses light onto a sensor. The sensor has millions of tiny photodiodes that convert photons into electrical current (the photoelectric effect). A color filter array (Bayer filter) splits light into R, G, B channels. Software reconstructs the full-color image. Your phone camera is a complete optics lab in a 5mm package.

**Screens (LCD/OLED)**: LEDs or organic molecules emit light at specific wavelengths (R, G, B). LCD screens use a white backlight filtered through liquid crystals that block or pass light. OLED screens emit light directly from each pixel — deeper blacks, wider viewing angles, thinner displays. Each pixel is an independent additive color mixer.

**Solar panels**: Photons hit a semiconductor (silicon). If the photon has enough energy (wavelength < ~1100 nm), it knocks an electron free, creating electrical current. This is the **photovoltaic effect** — light directly converted to electricity. A single panel converts about 20-25% of incoming solar energy to electricity. The rest becomes heat.

**The connection**: Light from the Sun travels 150 million km, reflects off a golden deer (or any object), passes through a camera lens, is detected by a sensor, transmitted as laser pulses through fiber optic cables, displayed on an OLED screen, and perceived by your brain\'s visual cortex. Every step is optics.`,
      storyConnection: 'The golden deer of Kamakhya was a creature of light — its entire magic was visual. Modern technology has made us all creatures of light. We capture it (cameras), transmit it (fiber optics), display it (screens), and harvest it (solar panels). The wonder that people felt seeing the golden deer is the same wonder that drives optics research today.',
      codeIntro: 'Summarize the complete journey from the physics of light to modern technology.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 2, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')

# --- 1. Camera: photon to pixel ---
ax1 = axes[0, 0]
ax1.set_facecolor('#111827')

# Simulate Bayer filter pattern
bayer = np.zeros((8, 8, 3))
for r in range(8):
    for c in range(8):
        if r % 2 == 0:
            if c % 2 == 0:
                bayer[r, c] = [0, 0.7, 0]  # green
            else:
                bayer[r, c] = [0.7, 0, 0]  # red
        else:
            if c % 2 == 0:
                bayer[r, c] = [0, 0, 0.7]  # blue
            else:
                bayer[r, c] = [0, 0.7, 0]  # green

ax1.imshow(bayer, interpolation='nearest')
ax1.set_title('Camera Bayer Filter\\n(50% green, 25% red, 25% blue)', color='white', fontsize=10)
ax1.tick_params(colors='gray', labelbottom=False, labelleft=False)
ax1.text(3.5, -0.8, 'Each colored cell = one photodiode on the sensor',
         color='gray', ha='center', fontsize=8)

# --- 2. OLED: sub-pixel emission ---
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')

# Simulate OLED pixels rendering gold color
gold_r, gold_g, gold_b = 255, 215, 0
pixel_grid = np.zeros((6, 18, 3))

for row in range(6):
    for px in range(6):
        col = px * 3
        pixel_grid[row, col] = [gold_r/255, 0, 0]       # R sub-pixel
        pixel_grid[row, col+1] = [0, gold_g/255, 0]      # G sub-pixel
        pixel_grid[row, col+2] = [0, 0, gold_b/255]      # B sub-pixel

ax2.imshow(pixel_grid, interpolation='nearest', aspect='auto')
ax2.set_title(f'OLED Sub-pixels Rendering Gold\\nRGB({gold_r}, {gold_g}, {gold_b})',
              color='#f59e0b', fontsize=10)
ax2.tick_params(colors='gray', labelbottom=False, labelleft=False)

# --- 3. Solar panel: spectral response ---
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')

wavelengths = np.linspace(300, 1200, 500)

# Silicon solar cell spectral response (approximate)
# Peaks around 900 nm, cuts off at ~1100 nm (bandgap)
response = np.zeros_like(wavelengths)
mask = (wavelengths > 350) & (wavelengths < 1100)
wl_norm = (wavelengths[mask] - 350) / (1100 - 350)
response[mask] = 4 * wl_norm * (1 - wl_norm)  # parabolic approximation

# Sun's spectrum (simplified)
h, c, k = 6.626e-34, 3e8, 1.381e-23
T = 5778
wl_m = wavelengths * 1e-9
solar = (2 * h * c**2 / wl_m**5) / (np.exp(h * c / (wl_m * k * T)) - 1)
solar = solar / solar.max()

ax3.plot(wavelengths, solar, color='#f59e0b', linewidth=2, label='Solar spectrum')
ax3.plot(wavelengths, response, color='#3b82f6', linewidth=2, label='Silicon response')
ax3.fill_between(wavelengths, np.minimum(solar, response), alpha=0.2, color='#22c55e',
                 label='Usable energy')

# Mark visible range
ax3.axvspan(380, 700, alpha=0.1, color='white')
ax3.text(540, 0.05, 'Visible', color='gray', ha='center', fontsize=8)

ax3.set_xlabel('Wavelength (nm)', color='white')
ax3.set_ylabel('Relative intensity / response', color='white')
ax3.set_title('Solar Panel: Capturing the Sun\\'s Light', color='white', fontsize=10)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax3.tick_params(colors='gray')

# --- 4. The full journey ---
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
ax4.set_xlim(0, 10)
ax4.set_ylim(0, 10)
ax4.set_aspect('equal')

steps = [
    (1, 9, 'SUN', '#f59e0b', 'Photons emitted'),
    (1, 7, 'OBJECT', '#22c55e', 'Reflection'),
    (1, 5, 'LENS', '#38bdf8', 'Refraction'),
    (1, 3, 'SENSOR', '#a855f7', 'Photoelectric effect'),
    (5.5, 3, 'FIBER', '#ef4444', 'Total internal reflection'),
    (5.5, 5, 'SCREEN', '#f59e0b', 'Additive color mixing'),
    (5.5, 7, 'EYE', '#22c55e', 'Biological optics'),
    (5.5, 9, 'BRAIN', '#38bdf8', 'Perception!'),
]

for x, y, label, color, desc in steps:
    ax4.plot(x, y, 'o', color=color, markersize=15)
    ax4.text(x + 0.4, y, f'{label}: {desc}', color=color, fontsize=8, va='center')

# Connect with arrows
connections = [(0,1), (1,2), (2,3), (3,4), (4,5), (5,6), (6,7)]
for i, j in connections:
    x1, y1 = steps[i][0], steps[i][1]
    x2, y2 = steps[j][0], steps[j][1]
    ax4.annotate('', xy=(x2, y2), xytext=(x1, y1),
                 arrowprops=dict(arrowstyle='->', color='gray', lw=1.5))

ax4.set_title('The Journey of Light', color='white', fontsize=11)
ax4.tick_params(colors='gray', labelbottom=False, labelleft=False)

plt.tight_layout()
plt.show()

print("=" * 55)
print("  YOUR OPTICS & LIGHT JOURNEY")
print("=" * 55)
print()
print("Level 1 — Fundamentals:")
print("  * Electromagnetic waves: what light IS")
print("  * Reflection: how surfaces bounce light")
print("  * Refraction: how light bends at boundaries")
print("  * Color & wavelengths: why gold looks gold")
print("  * RGB color mixing: additive vs subtractive")
print("  * The EM spectrum: visible light is a tiny slice")
print()
print("Level 2 — Applications:")
print("  * Lenses: focusing light (cameras, eyes)")
print("  * Prisms & spectroscopy: splitting light to read stars")
print("  * Fiber optics: guiding light across oceans")
print("  * Lasers: coherent light that cuts and communicates")
print("  * Optical illusions: the brain's interpretation engine")
print("  * Cameras, screens, solar panels: light as technology")
print()
print("From a folktale about a golden deer whose coat")
print("shone like the sun, to the physics that powers")
print("cameras, the internet, and solar energy.")
print()
print("The golden deer of Kamakhya was light made legend.")
print("Now you understand the science behind the shimmer.")`,
      challenge: 'Solar panels currently convert about 20-25% of solar energy to electricity. The theoretical maximum (Shockley-Queisser limit) is about 33% for a single-junction silicon cell. Research why — what happens to the other 67-75% of the energy? Hint: think about which wavelengths silicon can and cannot absorb.',
      successHint: 'From electromagnetic waves to solar panels — all built on the same physics. Light is the most versatile tool in the universe: it carries information (fiber optics), energy (solar), images (cameras), and meaning (the golden shimmer of a mythical deer). You now understand all of it.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Zap className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Completed Level 1 (or some physics background)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">Load Python for optics simulations and visualizations.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Zap className="w-5 h-5" />Load Python</>)}
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