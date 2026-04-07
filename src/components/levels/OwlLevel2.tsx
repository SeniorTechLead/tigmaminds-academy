import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function OwlLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Optics of the eye — refraction, focal length, and aberrations',
      concept: `The eye is a compound optical system with two refracting elements: the **cornea** (n=1.376, fixed focus, provides ~43 diopters) and the **lens** (n=1.386-1.406, adjustable, provides ~15-30 diopters). Total optical power: ~58-73 diopters.

Key optical relationships:
- **Optical power** P = 1/f (diopters, where f is in meters)
- **Lens equation**: 1/f = 1/d_o + 1/d_i (object distance, image distance)
- **Magnification**: M = -d_i/d_o

**Aberrations** in the eye:
- **Spherical aberration**: peripheral rays focus differently from central rays
- **Chromatic aberration**: different wavelengths focus at different points (~2 diopters across visible spectrum)
- **Astigmatism**: cornea not perfectly spherical → different focal lengths in different orientations

The eye corrects these through the iris (blocks peripheral rays, reducing spherical aberration), the gradient-index lens (n varies from center to edge), and neural processing (the brain corrects residual aberrations computationally).`,
      analogy: 'The eye is like a camera with auto-everything: auto-focus (lens accommodation), auto-exposure (pupil/iris), auto-white-balance (chromatic adaptation), and auto-enhancement (neural processing). No camera does all of these simultaneously as well as the eye — and the eye does them in real-time with zero power consumption from external sources.',
      storyConnection: 'The owl\'s eye is optically similar to ours but optimized for different conditions: a larger cornea radius of curvature (more light gathering), a wider pupil (lower f-number), and a lens that accommodates less (owls focus mainly at hunting distances). Same optical principles, different optimization targets.',
      checkQuestion: 'The human eye has chromatic aberration of ~2 diopters across the visible spectrum. Why doesn\'t this blur our vision noticeably?',
      checkAnswer: 'Three compensating mechanisms: (1) The fovea is most sensitive to green-yellow light (555nm), which is near the middle of the spectrum, so the extreme wavelengths contribute less. (2) The pupil acts as a spatial filter, blocking the most aberrated peripheral rays. (3) The brain\'s visual cortex computationally compensates for known optical imperfections. Biology patches hardware flaws with software.',
      codeIntro: 'Model the optics of the eye and visualize aberrations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# 1. Accommodation: lens power vs object distance
ax1.set_facecolor('#111827')

object_dist = np.linspace(0.1, 10, 200)  # meters
fixed_image_dist = 0.017  # retina distance in meters (17mm)

# Required total power to focus
required_power = 1/fixed_image_dist - (-1/object_dist)  # negative because virtual image side
# Simplified: P_total = 1/f = 1/d_i + 1/d_o (both positive for real imaging)
P_total = 1/fixed_image_dist + 1/object_dist

cornea_power = 43  # diopters (fixed)
lens_power = P_total - cornea_power  # what the lens must provide

ax1.plot(object_dist, P_total, color='#22c55e', linewidth=2, label='Total power needed')
ax1.axhline(cornea_power, color='#3b82f6', linestyle='--', linewidth=1.5, label=f'Cornea ({cornea_power}D, fixed)')
ax1.plot(object_dist, lens_power, color='#f59e0b', linewidth=2, label='Lens power (adjustable)')

ax1.axhline(73, color='#ef4444', linestyle=':', alpha=0.5)
ax1.text(9, 74, 'Max accommodation (~73D)', color='#ef4444', fontsize=8)

ax1.set_xlabel('Object distance (m)', color='white')
ax1.set_ylabel('Optical power (diopters)', color='white')
ax1.set_title('Accommodation: How the Eye Focuses', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')
ax1.set_ylim(40, 80)

# 2. Chromatic aberration: focal shift vs wavelength
ax2.set_facecolor('#111827')
wavelengths = np.linspace(400, 700, 200)

# Chromatic aberration of the eye (approximate)
# Reference at 555nm (green-yellow)
ref_wl = 555
# Cauchy equation for eye: n(λ) ≈ a + b/λ² + c/λ⁴
# Focal shift ≈ proportional to dn/dλ
# Simplified: approximately linear in 1/λ²
chromatic_shift = 2.5 * (1/(wavelengths/1000)**2 - 1/(ref_wl/1000)**2)  # diopters

# Colors for wavelength visualization
for i in range(len(wavelengths)-1):
    wl = wavelengths[i]
    if wl < 450: r, g, b = 0.3, 0, 1
    elif wl < 490: r, g, b = 0, 0.5, 1
    elif wl < 510: r, g, b = 0, 1, 0.5
    elif wl < 580: r, g, b = 0.5, 1, 0
    elif wl < 620: r, g, b = 1, 0.7, 0
    else: r, g, b = 1, 0, 0
    ax2.plot(wavelengths[i:i+2], chromatic_shift[i:i+2], color=(r, g, b), linewidth=3)

ax2.axhline(0, color='#4b5563', linestyle=':', alpha=0.3)
ax2.axvline(ref_wl, color='#f59e0b', linestyle='--', alpha=0.5, label=f'Reference ({ref_wl}nm)')

ax2.set_xlabel('Wavelength (nm)', color='white')
ax2.set_ylabel('Focal shift (diopters)', color='white')
ax2.set_title('Chromatic Aberration of the Human Eye', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Eye optics parameters:")
print(f"  Cornea power: ~43 D (fixed)")
print(f"  Lens power: ~15-30 D (adjustable = accommodation)")
print(f"  Total: ~58-73 D")
print(f"  Image distance: ~17mm (eye length)")
print()
print("Chromatic aberration:")
print(f"  ~2.5 D from 400nm to 700nm")
print(f"  Blue focuses ~1.5D in front of retina")
print(f"  Red focuses ~1D behind retina")
print(f"  Green-yellow (555nm) is in focus → peak sensitivity there")`,
      challenge: 'A myopic (nearsighted) eye has too much optical power — the image forms in front of the retina. If the excess power is 3 diopters, what corrective lens is needed? What focal length is that?',
      successHint: 'The optics of the eye are a masterclass in compound lens design, accommodation, and aberration management. Every eyeglass prescription, contact lens, and LASIK procedure is applied optics of the eye.',
    },
    {
      title: 'F-number and light gathering — the physics of seeing in the dark',
      concept: `The **f-number** (f/#) of an optical system is the ratio of focal length to aperture diameter: f/# = f/D. It determines how much light reaches the sensor.

- **Lower f-number = more light** (wider aperture relative to focal length)
- Light gathering scales as (1/f#)² — halving the f-number collects 4× more light

Species f-numbers:
- Human eye (day): f/8 (pupil ~3mm, f=17mm → f/5.7, but iris limits further)
- Human eye (dark-adapted): f/2.1 (pupil ~8mm)
- Owl eye (hunting): f/1.1-1.3 (pupil ~14mm)
- Tarsier eye: f/0.9 (the lowest of any mammal)
- Camera lenses: typically f/1.4-f/22

The owl's f/1.1 eye collects about **4× more light per unit area** than a dark-adapted human eye (f/2.1): (2.1/1.1)² ≈ 3.6×. Combined with a larger eye overall (more total collecting area), the owl gathers roughly **10× more light** than a human.`,
      analogy: 'F-number is like the width of a funnel. A wide funnel (low f-number) catches more rain. A narrow funnel (high f-number) catches less. But a wide funnel also lets in debris (aberrations). The trade-off: more light = more aberration. Camera photographers know this: shoot wide open (f/1.4) for low light, stop down (f/8) for sharpness.',
      storyConnection: 'The owl\'s eye has an f-number of about 1.1 — among the lowest of any vertebrate. This means its eye is essentially a wide-open light funnel, optimized for photon collection. The trade-off: more aberrations and less depth of field. The owl doesn\'t need sharp focus at multiple distances — it needs maximum light from one direction.',
      checkQuestion: 'A photographer shoots at f/2.8 and gets a dim image. She switches to f/1.4. How much brighter is the image? How does this compare to the owl\'s advantage over the human eye?',
      checkAnswer: 'Brightness scales as (1/f#)²: (2.8/1.4)² = 4× brighter. The owl (f/1.1) vs. dark-adapted human (f/2.1): (2.1/1.1)² ≈ 3.6× brighter. So the f-number advantage is similar to going from f/2.8 to f/1.4 on a camera. But the owl\'s eye is also physically larger, adding another 2-3× in total light collection.',
      codeIntro: 'Calculate light gathering for different f-numbers and compare species.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# 1. Light gathering vs f-number
ax1.set_facecolor('#111827')
f_numbers = np.linspace(0.8, 16, 200)
relative_brightness = (1 / f_numbers)**2
relative_brightness = relative_brightness / relative_brightness[f_numbers >= 2.0][0]  # normalize to f/2

ax1.plot(f_numbers, relative_brightness, color='#22c55e', linewidth=2.5)
ax1.fill_between(f_numbers, relative_brightness, alpha=0.1, color='#22c55e')

# Mark species
species_f = [
    ('Tarsier', 0.9, '#ef4444'),
    ('Owl', 1.1, '#f59e0b'),
    ('Cat', 1.4, '#22c55e'),
    ('Human\\\n(dark)', 2.1, '#3b82f6'),
    ('Human\\\n(bright)', 5.7, '#a855f7'),
    ('Camera\\\nf/8', 8, '#ec4899'),
]
for name, fn, color in species_f:
    brightness = (1/fn)**2 / (1/2.0)**2
    ax1.plot(fn, brightness, 'o', color=color, markersize=10, zorder=5)
    ax1.annotate(name, (fn, brightness), textcoords="offset points", xytext=(10, 5),
                 color=color, fontsize=8)

ax1.set_xlabel('f-number', color='white')
ax1.set_ylabel('Relative brightness (normalized to f/2)', color='white')
ax1.set_title('Light Gathering: Lower f/# = Brighter Image', color='white', fontsize=13)
ax1.tick_params(colors='gray')
ax1.set_xlim(0.5, 10)

# 2. Total light collection: f-number × eye area
ax2.set_facecolor('#111827')
species_data = {
    'Mouse': (3, 2.1, '#ef4444'),
    'Human': (24, 2.1, '#3b82f6'),
    'Cat': (22, 1.4, '#22c55e'),
    'Owl (barn)': (21, 1.2, '#f59e0b'),
    'Owl (eagle)': (36, 1.1, '#f97316'),
    'Tarsier': (16, 0.9, '#a855f7'),
}

names = list(species_data.keys())
# Relative light collection = (pupil_area) × (1/f#)² ∝ (eye_dia × NA)²
# Simplified: total photons ∝ (eye_diameter / f_number)² = pupil_diameter²
# pupil ≈ eye_diameter / (2 × f_number) roughly
for i, (name, (eye_dia, f_num, color)) in enumerate(species_data.items()):
    pupil_dia = eye_dia / f_num  # approximate max pupil
    total_collection = (pupil_dia / 8)**2  # relative to human (8mm pupil)
    ax2.barh(i, total_collection, color=color, alpha=0.8, edgecolor='white', linewidth=0.5)
    ax2.text(total_collection + 0.1, i, f'pupil≈{pupil_dia:.0f}mm, f/{f_num}',
             va='center', color='white', fontsize=9)

ax2.set_yticks(range(len(names)))
ax2.set_yticklabels(names, color='white')
ax2.set_xlabel('Total light collection (× human)', color='white')
ax2.set_title('Total Light Collection by Species', color='white', fontsize=13)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("F-number and light gathering:")
print("  f/# = focal_length / aperture_diameter")
print("  Brightness ∝ (1/f#)²")
print()
for name, (eye_dia, f_num, _) in species_data.items():
    pupil = eye_dia / f_num
    relative = (pupil / 8)**2
    print(f"  {name}: eye={eye_dia}mm, f/{f_num}, pupil≈{pupil:.0f}mm, {relative:.1f}× human")`,
      challenge: 'The Hubble Space Telescope has a 2.4m mirror and f/24 optics. Calculate its light-gathering power relative to the human eye. How many times more photons does it collect?',
      successHint: 'F-number is the single most important parameter for low-light imaging. Every night-vision device, telescope, and security camera is designed around its f-number — the same parameter that evolution optimized in the owl\'s eye.',
    },
    {
      title: 'Image sensors — CCD vs CMOS',
      concept: `Digital image sensors convert photons to electrical signals, just as the retina converts photons to neural signals:

**CCD (Charge-Coupled Device)**:
- Photons generate electrons in each pixel
- Charges are shifted sequentially to a single amplifier (like a bucket brigade)
- Low noise, high uniformity, but slow and power-hungry
- Used in: scientific cameras, older digital cameras

**CMOS (Complementary Metal-Oxide-Semiconductor)**:
- Each pixel has its own amplifier (like each photoreceptor has its own bipolar cell)
- Faster readout, lower power, but more noise (historically)
- Modern CMOS has nearly matched CCD in quality
- Used in: smartphones, DSLRs, security cameras, spacecraft

Key sensor parameters:
- **Quantum efficiency** (QE): fraction of photons that generate electrons. Best CCDs: ~95%. Retinal rods: ~10%.
- **Read noise**: electrons generated by the electronics, not photons. Best cameras: 1-3 electrons. Sets the minimum detectable signal.
- **Dark current**: thermally generated electrons (not from photons). Doubles every ~7°C. This is why astronomical cameras are cooled.
- **Full well capacity**: maximum electrons per pixel before saturation. Determines dynamic range.`,
      analogy: 'CCD is like a conveyor belt in a factory: all products (charges) move to one inspection station (amplifier). Efficient and uniform, but if the belt breaks, everything stops. CMOS is like having an inspector at every workstation: faster throughput, but inspectors may differ slightly (more noise). Modern CMOS trains its inspectors better (noise reduction) and now matches CCD quality.',
      storyConnection: 'The owl\'s retina is a biological CMOS sensor: each photoreceptor has its own processing circuit (bipolar cell → ganglion cell). The retina even does on-chip processing (lateral inhibition, edge detection) before sending data to the brain — just like modern CMOS sensors with on-chip image processing.',
      checkQuestion: 'The retina\'s quantum efficiency is only ~10% (1 in 10 photons detected). Modern CCD sensors achieve 95%. Why is the retina\'s QE so low?',
      checkAnswer: 'The retina is "inverted" — light must pass through blood vessels, nerve fibers, and processing layers before reaching the photoreceptors at the back. About 50% of photons are absorbed by these layers. Of the remaining, ~20% hit a photoreceptor, and ~50% of those trigger a response. 0.5 × 0.2 × 0.5 ≈ 5-10%. Evolution could not easily "flip" the retina (it develops from a brain outgrowth). The cephalopod retina IS correctly oriented and has higher QE.',
      codeIntro: 'Simulate CCD vs CMOS sensor performance and noise characteristics.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Create a simple test scene
scene_size = 64
scene = np.zeros((scene_size, scene_size))
# Gradient background
for i in range(scene_size):
    scene[i, :] = i / scene_size * 0.5
# Bright star
scene[15, 45] = 1.0
scene[14:17, 44:47] = 0.8
# Dim nebula
yy, xx = np.mgrid[:scene_size, :scene_size]
nebula = 0.15 * np.exp(-((yy-40)**2 + (xx-20)**2) / 100)
scene += nebula

# 1. CCD simulation
ax = axes[0, 0]
ax.set_facecolor('#111827')
photon_count = 100  # average photons per pixel for dim scene
qe = 0.90
read_noise = 3  # electrons
dark_current = 0.5  # electrons per pixel

signal = np.random.poisson(scene * photon_count * qe)
ccd_noise = np.random.normal(0, read_noise, scene.shape)
ccd_image = signal + ccd_noise + np.random.poisson(dark_current, scene.shape)
ccd_image = np.clip(ccd_image, 0, None)

ax.imshow(ccd_image, cmap='gray', vmin=0, vmax=photon_count)
ax.set_title(f'CCD (QE=90%, read noise={read_noise}e⁻)', color='white', fontsize=10)
ax.axis('off')

# 2. CMOS simulation (more read noise, pixel-to-pixel variation)
ax = axes[0, 1]
ax.set_facecolor('#111827')
cmos_read_noise = 5  # slightly more read noise (older CMOS)
pixel_gain_variation = np.random.normal(1, 0.03, scene.shape)  # 3% gain variation

cmos_signal = np.random.poisson(scene * photon_count * 0.85)  # slightly lower QE
cmos_noise = np.random.normal(0, cmos_read_noise, scene.shape)
cmos_image = cmos_signal * pixel_gain_variation + cmos_noise
cmos_image = np.clip(cmos_image, 0, None)

ax.imshow(cmos_image, cmap='gray', vmin=0, vmax=photon_count)
ax.set_title(f'CMOS (QE=85%, read noise={cmos_read_noise}e⁻)', color='white', fontsize=10)
ax.axis('off')

# 3. SNR comparison
ax = axes[1, 0]
ax.set_facecolor('#111827')
signal_levels = np.logspace(0, 5, 200)  # photons/pixel

# SNR = signal / sqrt(signal + read_noise² + dark_current)
snr_ccd = signal_levels * 0.9 / np.sqrt(signal_levels * 0.9 + read_noise**2 + dark_current)
snr_cmos = signal_levels * 0.85 / np.sqrt(signal_levels * 0.85 + cmos_read_noise**2 + dark_current)
snr_retina = signal_levels * 0.1 / np.sqrt(signal_levels * 0.1 + 50**2 + 10)  # retina has high "noise"

ax.loglog(signal_levels, snr_ccd, color='#22c55e', linewidth=2, label='CCD')
ax.loglog(signal_levels, snr_cmos, color='#3b82f6', linewidth=2, label='CMOS')
ax.loglog(signal_levels, snr_retina, color='#f59e0b', linewidth=2, label='Retina (rod)')
ax.axhline(3, color='#ef4444', linestyle=':', alpha=0.5, label='SNR=3 (detection limit)')

ax.set_xlabel('Signal (photons/pixel)', color='white')
ax.set_ylabel('Signal-to-Noise Ratio', color='white')
ax.set_title('SNR vs Signal Level', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax.tick_params(colors='gray')

# 4. Sensor comparison table
ax = axes[1, 1]
ax.set_facecolor('#111827')
params = ['QE (%)', 'Read noise (e⁻)', 'Dark current\\\n(e⁻/pix/s)', 'Dynamic\\\nrange (dB)', 'Speed']
ccd_vals = [95, 3, 0.001, 80, 3]
cmos_vals = [85, 2, 0.01, 75, 9]
retina_vals = [10, 50, 10, 120, 8]

x = np.arange(len(params))
width = 0.25
ax.bar(x - width, ccd_vals, width, label='CCD', color='#22c55e', alpha=0.8)
ax.bar(x, cmos_vals, width, label='CMOS', color='#3b82f6', alpha=0.8)
ax.bar(x + width, retina_vals, width, label='Retina', color='#f59e0b', alpha=0.8)

ax.set_xticks(x)
ax.set_xticklabels(params, color='white', fontsize=8)
ax.set_ylabel('Score (higher=better, except noise)', color='white')
ax.set_title('Sensor Parameter Comparison', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Sensor comparison:")
print("  CCD:    QE=95%, read=3e⁻, slow, power-hungry, uniform")
print("  CMOS:   QE=85%, read=2e⁻, fast, low power, improving")
print("  Retina: QE=10%, high noise, but 120dB dynamic range!")
print()
print("The retina's secret weapon: 120dB dynamic range")
print("  (10 billion to 1 brightness range)")
print("  Best cameras: ~80dB. Retina wins by 10,000×.")`,
      challenge: 'A scientific camera cooled to -100°C has dark current of 0.001 e⁻/pixel/s. At room temperature (25°C), dark current would be 100 e⁻/pixel/s. If dark current doubles every 7°C, verify this temperature relationship.',
      successHint: 'Image sensors are the digital equivalent of the retina. Understanding noise sources (read noise, dark current, shot noise) is essential for night-vision engineering, astrophotography, and any low-light application.',
    },
    {
      title: 'Noise in low light — the physics of grainy images',
      concept: `In low light, images become noisy (grainy). The fundamental reason is **photon shot noise**: light is quantized into individual photons that arrive randomly.

If a pixel expects N photons on average, the actual count follows a Poisson distribution with standard deviation √N. The **signal-to-noise ratio** (SNR) is:

**SNR = N / √(N + σ_read² + N_dark)** ≈ √N (when photon noise dominates)

This means:
- 100 photons → SNR = 10 (noisy but usable)
- 10,000 photons → SNR = 100 (clean image)
- 1 photon → SNR = 1 (as much noise as signal)

Ways to improve SNR:
- **Longer exposure**: more photons → higher SNR (∝ √t)
- **Larger aperture**: more photons per pixel
- **Larger pixels**: each pixel collects more photons
- **Cooling**: reduces dark current noise
- **Frame stacking**: averaging N frames improves SNR by √N
- **Computational denoising**: AI-based noise reduction`,
      analogy: 'Photon shot noise is like counting raindrops in a cup. If you expect 100 drops, you might get 90 or 110 — that\'s √100 = 10 drops of variation (10%). If you expect only 4 drops, you might get 2 or 6 — √4 = 2 drops of variation (50%). Fewer photons = proportionally more noise. This is a fundamental physical limit, not a camera deficiency.',
      storyConnection: 'The owl overcomes photon noise by having larger "pixels" (photoreceptor cells that pool signals from multiple rods in a process called convergence). A single rod detects very few photons, but 100 rods connected to one ganglion cell effectively collect 100× more signal — like having a 100× larger pixel. The trade-off: lower resolution (each "superpixel" covers a larger angle).',
      checkQuestion: 'A pixel receives 9 photons on average. What is the SNR? If you stack 100 frames, what is the new SNR?',
      checkAnswer: 'Single frame: SNR = √9 = 3 (barely usable — 33% noise). After stacking 100 frames: total photons = 900, SNR = √900 = 30 (excellent). Alternatively: SNR improves by √N_frames = √100 = 10×. Frame stacking is the simplest and most powerful technique for low-light imaging.',
      codeIntro: 'Simulate photon shot noise and demonstrate frame stacking for noise reduction.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

# Create a clean reference image
size = 80
clean = np.zeros((size, size))
# Circular object with gradient
yy, xx = np.mgrid[:size, :size]
r = np.sqrt((xx - 40)**2 + (yy - 40)**2)
clean = np.clip(1 - r/30, 0, 1) * 0.8 + 0.05  # bright disc on dim background

# Different photon levels
photon_levels = [5, 25, 100, 500, 2500]
titles = ['5 photons/pixel', '25 photons', '100 photons', '500 photons', '2500 photons']

for idx, (n_photons, title) in enumerate(zip(photon_levels, titles)):
    ax = axes[idx // 3][idx % 3]
    ax.set_facecolor('#111827')
    noisy = np.random.poisson(clean * n_photons) / n_photons
    snr = np.sqrt(clean.mean() * n_photons)
    ax.imshow(noisy, cmap='gray', vmin=0, vmax=1.5)
    ax.set_title(f'{title}\\\nSNR≈{snr:.1f}', color='white', fontsize=10)
    ax.axis('off')

# Frame stacking demo
ax = axes[1, 2]
ax.set_facecolor('#111827')
n_photons_per_frame = 5
n_frames = 100
stacked = np.zeros((size, size))
for _ in range(n_frames):
    stacked += np.random.poisson(clean * n_photons_per_frame)
stacked /= (n_frames * n_photons_per_frame)
snr_stacked = np.sqrt(clean.mean() * n_photons_per_frame * n_frames)
ax.imshow(stacked, cmap='gray', vmin=0, vmax=1.5)
ax.set_title(f'{n_frames}× stacked (5 photons each)\\\nSNR≈{snr_stacked:.1f}', color='white', fontsize=10)
ax.axis('off')

plt.suptitle('Photon Shot Noise: More Photons = Cleaner Image', color='white', fontsize=14, y=1.02)
plt.tight_layout()
plt.show()

print("Photon noise (Poisson statistics):")
print("  SNR = √N (when photon noise dominates)")
print()
for n in photon_levels:
    snr = np.sqrt(n * clean.mean())
    print(f"  {n:>5} photons/pixel → SNR = {snr:.1f}")
print()
print(f"Frame stacking: 100 frames × 5 photons = 500 effective photons")
print(f"  SNR = √{500*clean.mean():.0f} ≈ {np.sqrt(500*clean.mean()):.1f}")
print()
print("Key insight: SNR ∝ √(total photons)")
print("You can get more photons by: longer exposure, bigger aperture,")
print("larger pixels, or frame stacking. All equivalent mathematically.")`,
      challenge: 'The James Webb Space Telescope stacks exposures for hours on extremely faint objects. If a single 100-second exposure gives SNR=3, how long must you expose to reach SNR=30? (Hint: SNR ∝ √time)',
      successHint: 'Photon noise is the ultimate limit of imaging physics. No amount of engineering can beat √N — you can only collect more photons. Understanding this single equation explains why telescopes are big, exposures are long, and night-vision devices amplify light.',
    },
    {
      title: 'Image processing for night vision — computational seeing',
      concept: `Modern night vision relies heavily on **computational image processing** — algorithms that enhance images beyond what the raw sensor captures:

**Noise reduction**:
- **Temporal averaging**: stack multiple frames (SNR improves by √N)
- **Spatial filtering**: average neighboring pixels (reduces noise, blurs detail)
- **Non-local means**: find similar patches in the image and average them (preserves edges)
- **Deep learning**: trained neural networks remove noise while preserving detail

**Contrast enhancement**:
- **Histogram equalization**: redistribute pixel intensities to use the full dynamic range
- **CLAHE** (Contrast-Limited Adaptive Histogram Equalization): equalize locally, preventing over-amplification
- **Retinex**: model the retina's ability to separate illumination from reflectance

**Super-resolution**: AI generates high-resolution images from low-resolution inputs by learning patterns from training data.

Smartphone "Night Mode" combines all of these: multi-frame capture, alignment, stacking, noise reduction, HDR fusion, and AI enhancement — all in <3 seconds.`,
      analogy: 'Computational night vision is like an audio engineer working with a noisy recording. You can: (1) record multiple takes and average them (frame stacking), (2) apply noise gates and filters (spatial filtering), (3) use AI to separate voice from noise (deep learning denoising). The result sounds better than any single raw recording. Night-mode photos are similarly "produced" images.',
      storyConnection: 'The owl\'s brain is the original night-vision processor. Its visual cortex applies neural noise reduction (averaging signals from multiple rods), contrast enhancement (lateral inhibition amplifies edges), and motion detection (specialized neurons fire only for moving objects). Silicon night-vision systems are now approaching what neural wetware has done for 60 million years.',
      checkQuestion: 'Smartphone night mode takes 10-30 photos and combines them. But you\'re holding the phone with shaky hands. How does the phone handle motion blur between frames?',
      checkAnswer: 'Image alignment algorithms (optical flow, feature matching) detect how each frame has shifted relative to others, then warp them into alignment before stacking. Moving objects in the scene create "ghost" artifacts — the algorithm detects and masks these. Some phones use the gyroscope to predict motion and adjust exposure timing. It\'s a remarkably sophisticated pipeline.',
      codeIntro: 'Implement and compare image processing techniques for low-light enhancement.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Create a noisy low-light image
size = 80
clean = np.zeros((size, size))
yy, xx = np.mgrid[:size, :size]
# Scene: two objects
clean += 0.6 * np.exp(-((xx-25)**2 + (yy-30)**2) / 80)  # bright object
clean += 0.3 * np.exp(-((xx-55)**2 + (yy-50)**2) / 200)  # dim object
clean += 0.05  # background

# Simulate low-light capture (25 photons average)
n_photons = 25
noisy = np.random.poisson(clean * n_photons).astype(float) / n_photons

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

# 1. Original noisy image
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.imshow(noisy, cmap='gray', vmin=0, vmax=0.8)
ax.set_title('Raw low-light image', color='white', fontsize=11)
ax.axis('off')

# 2. Gaussian blur (spatial averaging)
ax = axes[0, 1]
ax.set_facecolor('#111827')
kernel_size = 3
kernel = np.ones((kernel_size, kernel_size)) / kernel_size**2
from numpy import convolve
blurred = np.zeros_like(noisy)
for i in range(size):
    blurred[i, :] = np.convolve(noisy[i, :], kernel[0], mode='same')
for j in range(size):
    blurred[:, j] = np.convolve(blurred[:, j], kernel[:, 0], mode='same')
ax.imshow(blurred, cmap='gray', vmin=0, vmax=0.8)
ax.set_title('Gaussian blur (3×3)', color='white', fontsize=11)
ax.axis('off')

# 3. Frame stacking (16 frames)
ax = axes[0, 2]
ax.set_facecolor('#111827')
n_stack = 16
stacked = np.zeros_like(clean)
for _ in range(n_stack):
    stacked += np.random.poisson(clean * n_photons).astype(float) / n_photons
stacked /= n_stack
ax.imshow(stacked, cmap='gray', vmin=0, vmax=0.8)
ax.set_title(f'Frame stacking ({n_stack} frames)', color='white', fontsize=11)
ax.axis('off')

# 4. Histogram equalization
ax = axes[1, 0]
ax.set_facecolor('#111827')
# Simple histogram equalization
flat = stacked.flatten()
sorted_idx = np.argsort(flat)
equalized = np.zeros_like(flat)
equalized[sorted_idx] = np.linspace(0, 1, len(flat))
eq_image = equalized.reshape(stacked.shape)
ax.imshow(eq_image, cmap='gray', vmin=0, vmax=1)
ax.set_title('Histogram equalization', color='white', fontsize=11)
ax.axis('off')

# 5. Local contrast enhancement (simplified CLAHE)
ax = axes[1, 1]
ax.set_facecolor('#111827')
# Local mean subtraction + rescaling
local_mean = np.zeros_like(stacked)
window = 15
for i in range(size):
    for j in range(size):
        i_lo, i_hi = max(0, i-window), min(size, i+window)
        j_lo, j_hi = max(0, j-window), min(size, j+window)
        local_mean[i, j] = stacked[i_lo:i_hi, j_lo:j_hi].mean()
enhanced = (stacked - local_mean) / (local_mean + 0.01) + 0.5
enhanced = np.clip(enhanced, 0, 1)
ax.imshow(enhanced, cmap='gray', vmin=0, vmax=1)
ax.set_title('Local contrast enhancement', color='white', fontsize=11)
ax.axis('off')

# 6. Clean reference
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.imshow(clean, cmap='gray', vmin=0, vmax=0.8)
ax.set_title('Ground truth (perfect)', color='white', fontsize=11)
ax.axis('off')

plt.suptitle('Night Vision Image Processing Pipeline', color='white', fontsize=14, y=1.02)
plt.tight_layout()
plt.show()

# Calculate RMSE for each method
rmse_noisy = np.sqrt(np.mean((noisy - clean)**2))
rmse_blur = np.sqrt(np.mean((blurred - clean)**2))
rmse_stack = np.sqrt(np.mean((stacked - clean)**2))

print("Image processing results (RMSE vs ground truth):")
print(f"  Raw noisy:     RMSE = {rmse_noisy:.4f}")
print(f"  Gaussian blur: RMSE = {rmse_blur:.4f} ({(1-rmse_blur/rmse_noisy)*100:.0f}% improvement)")
print(f"  16× stacking:  RMSE = {rmse_stack:.4f} ({(1-rmse_stack/rmse_noisy)*100:.0f}% improvement)")
print()
print("Frame stacking preserves detail while reducing noise.")
print("Blurring reduces noise but also loses detail.")
print("The best: stacking + local contrast enhancement.")`,
      challenge: 'Implement a simple non-local means denoiser: for each pixel, find the 10 most similar 5×5 patches in the image and average them. Compare to Gaussian blur — which preserves edges better?',
      successHint: 'Computational imaging is transforming night vision from a hardware problem to a software problem. The owl\'s brain has been doing neural image processing for 60 million years; our algorithms are catching up fast.',
    },
    {
      title: 'Thermal imaging — seeing heat, not light',
      concept: `Every object above absolute zero (-273.15°C) emits electromagnetic radiation. For objects at everyday temperatures (0-100°C), this radiation peaks in the **thermal infrared** (8-14 μm wavelength) — invisible to our eyes but detectable by thermal cameras.

**Planck's law** describes the emission spectrum:
B(λ,T) = (2hc²/λ⁵) × 1/(e^(hc/λkT) - 1)

**Wien's displacement law**: peak wavelength λ_max = 2898/T (μm, T in Kelvin)
- Sun (5778K): peak at 502nm (visible green) → we see the sun
- Human (310K): peak at 9.35μm (thermal IR) → we're invisible to visible cameras in darkness
- Room (293K): peak at 9.89μm → background thermal radiation

**Stefan-Boltzmann law**: total power emitted = σT⁴ per unit area
A human at 37°C radiates about 500 watts of thermal infrared. We're all glowing — just not in visible light.

Thermal cameras detect this radiation using bolometer arrays (resistance changes with temperature) or quantum detectors (photons excite electrons across a bandgap).`,
      analogy: 'Thermal imaging is like reading Braille instead of printed text. Both contain information, but they use different sensory channels. Visible light requires an external source (sun, lamp). Thermal IR is emitted by the objects themselves. In thermal imaging, every object is its own light bulb — the warmer it is, the brighter it glows.',
      storyConnection: 'The owl doesn\'t see in thermal IR (no vertebrate has true thermal vision, except pit vipers which have a limited form). But the concept is the same: the owl uses an invisible signal (ultrasonic hearing) to detect prey that is invisible to visible-light vision. Thermal cameras extend this principle to electromagnetic radiation — seeing the invisible heat signatures of warm-blooded prey.',
      checkQuestion: 'A thermal camera can detect a temperature difference of 0.05°C. A mouse at 38°C sits on ground at 20°C. What is the thermal contrast? Is this detectable?',
      checkAnswer: 'Temperature difference: 38 - 20 = 18°C. This is 360× the camera\'s sensitivity (18/0.05 = 360). Easily detectable. Even a mouse\'s footprint (which cools quickly) is detectable for several seconds after the mouse passes. This is why thermal cameras are used for search and rescue — body heat is unmistakable against any natural background.',
      codeIntro: 'Visualize thermal emission: Planck\'s law, Wien\'s law, and thermal imaging simulation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# 1. Planck's law for different temperatures
ax1.set_facecolor('#111827')

h = 6.626e-34  # Planck's constant
c = 3e8  # speed of light
k = 1.381e-23  # Boltzmann constant

def planck(wavelength_um, T):
    wl = wavelength_um * 1e-6  # convert to meters
    numerator = 2 * h * c**2 / wl**5
    denominator = np.exp(h * c / (wl * k * T)) - 1
    return numerator / denominator * 1e-6  # W/m²/sr/μm

wavelengths = np.linspace(0.1, 30, 1000)

temperatures = [
    (5778, 'Sun (5778K)', '#f59e0b'),
    (1000, 'Lava (1000K)', '#ef4444'),
    (310, 'Human (37°C)', '#22c55e'),
    (293, 'Room (20°C)', '#3b82f6'),
    (200, 'Dry ice (-73°C)', '#a855f7'),
]

for T, name, color in temperatures:
    B = np.array([planck(wl, T) for wl in wavelengths])
    # Normalize for visualization
    B_norm = B / B.max()
    ax1.plot(wavelengths, B_norm, color=color, linewidth=2, label=name)
    # Wien's peak
    peak = 2898 / T
    if peak < 30:
        ax1.axvline(peak, color=color, linestyle=':', alpha=0.3)

# Mark visible and thermal IR bands
ax1.axvspan(0.38, 0.75, alpha=0.1, color='#f59e0b')
ax1.axvspan(8, 14, alpha=0.1, color='#ef4444')
ax1.text(0.55, 0.95, 'Visible', color='#f59e0b', fontsize=8, ha='center')
ax1.text(11, 0.95, 'Thermal IR', color='#ef4444', fontsize=8, ha='center')

ax1.set_xlabel('Wavelength (μm)', color='white')
ax1.set_ylabel('Normalized spectral radiance', color='white')
ax1.set_title("Planck's Law: Thermal Emission Spectra", color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')
ax1.set_xlim(0, 25)

# 2. Simulated thermal image
ax2.set_facecolor('#111827')
np.random.seed(42)
thermal_size = 80

# Background at ~20°C (293K)
thermal_scene = np.random.normal(293, 0.5, (thermal_size, thermal_size))

# Warm person (37°C = 310K)
person_y, person_x = 40, 30
for dy in range(-15, 16):
    for dx in range(-8, 9):
        r = np.sqrt((dy/15)**2 + (dx/8)**2)
        if r < 1:
            temp = 310 - 5 * r  # warmer at center
            thermal_scene[person_y+dy, person_x+dx] = temp

# Warm car engine (80°C = 353K)
thermal_scene[20:30, 55:70] = np.random.normal(353, 2, (10, 15))

# Cold window (reflecting sky, ~-10°C = 263K)
thermal_scene[10:25, 10:20] = np.random.normal(263, 1, (15, 10))

# Mouse (38°C, tiny)
thermal_scene[60:63, 65:68] = 311

im = ax2.imshow(thermal_scene, cmap='inferno', vmin=260, vmax=360)
ax2.text(30, 58, 'Person (37°C)', color='white', fontsize=8, ha='center')
ax2.text(62, 33, 'Engine (80°C)', color='white', fontsize=8, ha='center')
ax2.text(15, 28, 'Cold window', color='cyan', fontsize=8, ha='center')
ax2.text(66, 65, 'Mouse', color='white', fontsize=7, ha='center')

cbar = plt.colorbar(im, ax=ax2)
cbar.set_label('Temperature (K)', color='white')
cbar.ax.tick_params(colors='gray')
ax2.set_title('Simulated Thermal Image', color='white', fontsize=13)
ax2.axis('off')

plt.tight_layout()
plt.show()

print("Thermal imaging key facts:")
print("  Wien's law: λ_peak = 2898/T (μm)")
print(f"    Sun: {2898/5778:.2f} μm (visible green)")
print(f"    Human: {2898/310:.2f} μm (thermal IR)")
print(f"    Room: {2898/293:.2f} μm (thermal IR)")
print()
print("  Stefan-Boltzmann: Power = σT⁴")
print(f"    Human at 37°C radiates ~{5.67e-8 * 310**4 * 1.7:.0f} W total")
print(f"    That's enough to power several light bulbs — all in IR!")`,
      challenge: 'A search-and-rescue drone uses thermal imaging at night. A lost hiker (37°C) is in a forest where trees are 15°C and rocks are 10°C. Calculate the thermal contrast ratio. Is the hiker easy to find?',
      successHint: 'Thermal imaging completes the night-vision toolkit: image intensifiers amplify visible light, digital processing enhances dim images, and thermal cameras detect heat directly. Together, they give humans something owls never had — the ability to see in absolute darkness across all conditions.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Sensory Physics — some physics and math experience helpful</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for optics and imaging simulations. Click to start.</p>
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
            />
        ))}
      </div>
    </div>
  );
}