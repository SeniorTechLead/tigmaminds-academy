import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function KingfisherLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Structural color — why the kingfisher is blue without blue pigment',
      concept: `The kingfisher's brilliant blue is not produced by any blue pigment. If you ground a kingfisher feather to powder, it would be brown — the keratin and melanin that make up the feather are not blue. The color comes entirely from the **nanostructure** of the feather.

This is **structural color**: color produced by the physical interaction of light with structures at the nanometer scale, rather than by selective absorption by pigments. In the kingfisher, the feather barbs contain a spongy matrix of air pockets and beta-keratin with a characteristic spacing of ~150-200 nanometers — comparable to the wavelength of blue light.

**Thin-film interference** is the simplest structural color mechanism. When light hits a thin film (like a soap bubble), some reflects off the top surface and some off the bottom. If the film thickness is right, the two reflected waves interfere constructively at a specific wavelength:

Constructive interference: 2 * n * d * cos(theta) = m * lambda

Where n is the refractive index, d is the film thickness, theta is the angle inside the film, m is the order (1, 2, 3...), and lambda is the wavelength. This equation says: when the optical path difference equals a whole number of wavelengths, that color is amplified.

In the kingfisher, the nanostructure is not a simple film but a 3D **photonic crystal** — a periodic arrangement of materials with different refractive indices. This produces an even more selective and angle-independent color than simple thin-film interference.`,
      analogy: 'Structural color is like the sound pattern in a cathedral. The cathedral does not produce sound — the choir does. But the shape and spacing of the walls amplify certain frequencies (wavelengths of sound) through constructive interference. A different-shaped cathedral amplifies different notes. The kingfisher feather is a "cathedral for light" — its nano-architecture amplifies blue wavelengths.',
      storyConnection: 'The children in our story wondered why the kingfisher was blue. "Is it painted?" one asked. The answer is stranger than paint — the feather is a crystal, and its color comes from the geometry of nothingness (air pockets) arranged with nanometer precision.',
      checkQuestion: 'If you heat a kingfisher feather enough to melt the keratin (destroying the nanostructure) but do not burn it, what color would it become? What does this prove about the origin of the color?',
      checkAnswer: 'It would turn brownish — the color of keratin and melanin without nanostructure. This proves the blue is structural, not pigmented. If it were pigmented (like a red cardinal\'s carotenoid pigments), the color would persist regardless of structure. Structural color depends on geometry; pigment color depends on chemistry.',
      codeIntro: 'Model thin-film interference and show how nanometer-scale thickness determines reflected color.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Thin-film interference model
def thin_film_reflectance(wavelengths, thickness_nm, n_film=1.54, n_medium=1.0, angle_deg=0):
    """Calculate reflectance spectrum from a thin film.
    n_film: refractive index of keratin (~1.54)
    n_medium: refractive index of air (1.0)
    """
    angle_rad = np.radians(angle_deg)
    # Snell's law: angle inside film
    sin_theta_film = (n_medium / n_film) * np.sin(angle_rad)
    cos_theta_film = np.sqrt(1 - sin_theta_film**2)

    # Phase difference between top and bottom reflections
    delta = 2 * np.pi * n_film * thickness_nm * cos_theta_film / wavelengths

    # Fresnel reflection coefficients (s-polarization, simplified)
    r1 = (n_medium * np.cos(angle_rad) - n_film * cos_theta_film) / \
         (n_medium * np.cos(angle_rad) + n_film * cos_theta_film)
    r2 = r1  # Same interface (simplified for symmetric case)

    # Total reflectance (Airy function)
    numerator = r1**2 + r2**2 + 2 * r1 * r2 * np.cos(2 * delta)
    denominator = 1 + (r1 * r2)**2 + 2 * r1 * r2 * np.cos(2 * delta)
    return numerator / denominator

# Multilayer model (more realistic for photonic crystal)
def multilayer_reflectance(wavelengths, layers, angle_deg=0):
    """Reflectance from a stack of thin films.
    layers: list of (thickness_nm, refractive_index)
    """
    angle_rad = np.radians(angle_deg)
    R = np.zeros_like(wavelengths)

    for i in range(len(layers) - 1):
        d, n1 = layers[i]
        _, n2 = layers[i + 1] if i + 1 < len(layers) else (0, 1.0)
        sin_t = (1.0 / n1) * np.sin(angle_rad)
        cos_t = np.sqrt(np.maximum(1 - sin_t**2, 0))
        delta = 2 * np.pi * n1 * d * cos_t / wavelengths
        r = (n1 - n2) / (n1 + n2 + 1e-10)
        R += r**2 + 2 * r * np.sqrt(np.maximum(R, 0)) * np.cos(2 * delta) * 0.3
    return np.clip(R, 0, 1)

wavelengths = np.linspace(380, 780, 500)  # visible spectrum (nm)

# Wavelength to RGB (approximate)
def wavelength_to_rgb(wl):
    """Convert wavelength (nm) to RGB."""
    if 380 <= wl < 440:
        r, g, b = -(wl - 440) / 60, 0, 1
    elif 440 <= wl < 490:
        r, g, b = 0, (wl - 440) / 50, 1
    elif 490 <= wl < 510:
        r, g, b = 0, 1, -(wl - 510) / 20
    elif 510 <= wl < 580:
        r, g, b = (wl - 510) / 70, 1, 0
    elif 580 <= wl < 645:
        r, g, b = 1, -(wl - 645) / 65, 0
    elif 645 <= wl <= 780:
        r, g, b = 1, 0, 0
    else:
        r, g, b = 0, 0, 0
    return np.clip([r, g, b], 0, 1)

fig, axes = plt.subplots(2, 3, figsize=(16, 9))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Reflectance vs film thickness
ax = axes[0, 0]
thicknesses = [100, 150, 180, 220, 300]
for d in thicknesses:
    R = thin_film_reflectance(wavelengths, d)
    peak_wl = wavelengths[np.argmax(R)]
    color = wavelength_to_rgb(peak_wl)
    ax.plot(wavelengths, R, color=color, linewidth=2, label=f'd={d}nm (peak {peak_wl:.0f}nm)')
ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_ylabel('Reflectance', color='white')
ax.set_title('Thin Film: Thickness → Color', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Color bar showing thickness-color mapping
ax = axes[0, 1]
d_range = np.linspace(50, 350, 200)
color_bar = np.zeros((1, len(d_range), 3))
for i, d in enumerate(d_range):
    R = thin_film_reflectance(wavelengths, d)
    peak_wl = wavelengths[np.argmax(R)]
    color_bar[0, i, :] = wavelength_to_rgb(peak_wl) * R[np.argmax(R)] * 3
color_bar = np.clip(color_bar, 0, 1)
ax.imshow(np.repeat(color_bar, 50, axis=0), extent=[50, 350, 0, 1], aspect='auto')
ax.set_xlabel('Film thickness (nm)', color='white')
ax.set_yticks([])
ax.set_title('Color vs Nanostructure Thickness', color='white', fontsize=11)
# Mark kingfisher range
ax.axvspan(155, 185, alpha=0.3, color='white', label='Kingfisher (155-185nm)')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Angle dependence
ax = axes[0, 2]
d_king = 170  # kingfisher thickness
for angle in [0, 15, 30, 45, 60]:
    R = thin_film_reflectance(wavelengths, d_king, angle_deg=angle)
    peak_wl = wavelengths[np.argmax(R)]
    color = wavelength_to_rgb(peak_wl)
    ax.plot(wavelengths, R, color=color, linewidth=2, label=f'{angle}° (peak {peak_wl:.0f}nm)')
ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_ylabel('Reflectance', color='white')
ax.set_title('Angle Dependence (d=170nm)', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Multilayer (photonic crystal) vs single layer
ax = axes[1, 0]
# Single layer
R_single = thin_film_reflectance(wavelengths, 170)
# Multilayer: alternating keratin/air (photonic crystal)
layers = [(85, 1.54), (85, 1.0)] * 6  # 6 bilayers
R_multi = multilayer_reflectance(wavelengths, layers)
ax.plot(wavelengths, R_single, color='#f59e0b', linewidth=2, label='Single film')
ax.plot(wavelengths, R_multi, color='#3b82f6', linewidth=2, label='6-layer photonic crystal')
ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_ylabel('Reflectance', color='white')
ax.set_title('Single Film vs Photonic Crystal', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: Structural vs pigment color comparison
ax = axes[1, 1]
# Pigment: broad absorption, complementary color reflected
pigment_absorption = np.exp(-((wavelengths - 600)**2) / 5000)  # absorbs red/yellow
pigment_reflectance = 1 - pigment_absorption * 0.8
# Structural: narrow peak
structural_reflectance = 0.1 + 0.7 * np.exp(-((wavelengths - 470)**2) / 400)

ax.plot(wavelengths, pigment_reflectance, color='#22c55e', linewidth=2, label='Pigment (chlorophyll-like)')
ax.plot(wavelengths, structural_reflectance, color='#3b82f6', linewidth=2, label='Structural (kingfisher)')
ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_ylabel('Reflectance', color='white')
ax.set_title('Structural vs Pigment Color', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 6: Why structural color does not fade
ax = axes[1, 2]
years = np.arange(0, 51)
# Pigment fading: exponential decay (UV breaks molecular bonds)
pigment_intensity = np.exp(-0.05 * years)
# Structural: no change (geometry is stable unless physically damaged)
structural_intensity = np.ones_like(years) * 0.98
# With some physical wear
structural_worn = 0.98 * np.exp(-0.005 * years)

ax.plot(years, pigment_intensity * 100, color='#ef4444', linewidth=2, label='Pigment (UV fading)')
ax.plot(years, structural_intensity * 100, color='#3b82f6', linewidth=2, label='Structural (ideal)')
ax.plot(years, structural_worn * 100, color='#3b82f6', linewidth=2, linestyle='--', label='Structural (with wear)')
ax.set_xlabel('Years of sun exposure', color='white')
ax.set_ylabel('Color intensity (%)', color='white')
ax.set_title('Color Durability', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Structural Color in Kingfisher Feathers:")
print(f"  Nanostructure spacing: ~170 nm (keratin/air photonic crystal)")
print(f"  Peak reflected wavelength: {wavelengths[np.argmax(thin_film_reflectance(wavelengths, 170))]:.0f} nm (blue)")
print(f"  No blue pigment — pure physics of light interference")
print(f"  Color does not fade because geometry is stable (unlike pigments)")`,
      challenge: 'Model a "damaged" feather: reduce the nanostructure periodicity by introducing 10% random variation in layer thickness. How does this affect the sharpness and purity of the reflected blue? This explains why worn feathers look duller.',
      successHint: 'Structural color is one of the most beautiful examples of physics in nature. The kingfisher achieves its brilliant blue not through chemistry but through architecture — nanometer-scale engineering that produces color through constructive interference of light.',
    },
    {
      title: 'Bragg diffraction in feathers — the physics of photonic crystals',
      concept: `The kingfisher feather is a **photonic crystal** — a material with a periodic variation in refractive index at the scale of optical wavelengths. Photonic crystals were only understood by physicists in the 1980s, but evolution has been making them for millions of years.

**Bragg's law** describes diffraction from periodic structures: 2 * d * sin(theta) = m * lambda, where d is the spacing between layers, theta is the angle of incidence, and m is the diffraction order. When this condition is met, light at wavelength lambda is reflected strongly — this is the **photonic band gap**.

In the kingfisher's feather barbs, the nanostructure is a **3D spongy matrix** rather than a neat stack of flat layers. This is an **amorphous photonic crystal** — it has short-range order (consistent nearest-neighbor spacing) but no long-range periodicity. This produces:

1. **Angle-independent color**: unlike a CD or soap bubble (which change color with viewing angle), the kingfisher looks blue from all directions. This is because the 3D disorder averages over all orientations.
2. **Broad bandwidth**: the reflected band is wider than a perfect crystal would produce, giving a saturated but not overly narrow blue.
3. **Robustness**: small defects in the structure do not destroy the color because the overall statistics (mean spacing, variance) are maintained.

The Fourier transform of the nanostructure reveals a ring pattern in reciprocal space — confirming that the structure has a preferred length scale (the spacing) but no preferred direction.`,
      analogy: 'A photonic crystal is like a crowd of people standing at roughly arm\'s length apart. If you fly a drone overhead and look down, you see no neat rows (no long-range order), but everyone is about 1 meter from their nearest neighbor (short-range order). Sound waves at a certain frequency would bounce off this crowd differently than other frequencies — that\'s the "band gap" for sound. The kingfisher feather does the same for light.',
      storyConnection: 'The kingfisher\'s blue did not shimmer or change color as it flew — unlike a hummingbird\'s iridescence. This stability puzzled the children. The answer lies in the amorphous photonic crystal: the nanostructure looks the same from every direction, so the blue is the same from every angle.',
      checkQuestion: 'Hummingbird feathers use ordered, multilayer photonic crystals, producing iridescent color that changes with angle. Kingfisher feathers use disordered (amorphous) photonic crystals with angle-independent color. Which is "better"? Why might each have evolved?',
      checkAnswer: 'Neither is universally better — they serve different purposes. Hummingbird iridescence is for sexual display: the male flashes bright colors during courtship by tilting his feathers at the right angle. Angle-dependent color is a feature, not a bug. Kingfisher blue serves as camouflage when diving — it needs to look the same from all angles to match the sky. The "best" photonic crystal depends on the ecological function.',
      codeIntro: 'Model Bragg diffraction, compute the photonic band gap, and simulate both ordered and disordered photonic crystals.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Bragg diffraction model
def bragg_wavelength(d_nm, theta_deg, n_eff=1.27, order=1):
    """Peak reflected wavelength from Bragg law."""
    return 2 * n_eff * d_nm * np.cos(np.radians(theta_deg)) / order

# 1D Transfer Matrix Method for multilayer reflectance
def transfer_matrix_reflectance(wavelengths, layers, angle_deg=0):
    """Calculate reflectance using transfer matrix method.
    layers: list of (thickness_nm, refractive_index)
    """
    n0 = 1.0  # incident medium (air)
    theta0 = np.radians(angle_deg)
    R = np.zeros(len(wavelengths))

    for wi, wl in enumerate(wavelengths):
        # Build transfer matrix
        M = np.eye(2, dtype=complex)
        for d, n in layers:
            # Angle in this layer (Snell's law)
            sin_t = (n0 / n) * np.sin(theta0)
            if abs(sin_t) > 1:
                cos_t = 0
            else:
                cos_t = np.sqrt(1 - sin_t**2)
            # Phase accumulated
            phi = 2 * np.pi * n * d * cos_t / wl
            # Layer transfer matrix
            eta = n * cos_t  # for s-polarization
            layer_M = np.array([
                [np.cos(phi), 1j * np.sin(phi) / (eta + 1e-10)],
                [1j * eta * np.sin(phi), np.cos(phi)]
            ])
            M = M @ layer_M

        # Reflection coefficient
        eta0 = n0 * np.cos(theta0)
        r = (M[0, 0] * eta0 - M[1, 1] * eta0 + M[0, 1] * eta0**2 - M[1, 0]) / \
            (M[0, 0] * eta0 + M[1, 1] * eta0 + M[0, 1] * eta0**2 + M[1, 0] + 1e-10)
        R[wi] = min(abs(r)**2, 1.0)
    return R

wavelengths = np.linspace(380, 780, 300)

# Ordered photonic crystal (hummingbird-like)
n_keratin = 1.54
n_air = 1.0
d_keratin = 85  # nm
d_air = 85  # nm
n_bilayers = 8

ordered_layers = [(d_keratin, n_keratin), (d_air, n_air)] * n_bilayers

# Disordered photonic crystal (kingfisher-like)
np.random.seed(42)
disorder = 0.15  # 15% variation in thickness
disordered_layers = []
for _ in range(n_bilayers):
    dk = d_keratin * (1 + disorder * np.random.randn())
    da = d_air * (1 + disorder * np.random.randn())
    disordered_layers.extend([(max(dk, 20), n_keratin), (max(da, 20), n_air)])

fig, axes = plt.subplots(2, 3, figsize=(16, 9))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Ordered vs disordered reflectance at normal incidence
ax = axes[0, 0]
R_ordered = transfer_matrix_reflectance(wavelengths, ordered_layers, 0)
R_disordered = transfer_matrix_reflectance(wavelengths, disordered_layers, 0)
ax.plot(wavelengths, R_ordered, color='#a855f7', linewidth=2, label='Ordered (hummingbird)')
ax.plot(wavelengths, R_disordered, color='#3b82f6', linewidth=2, label='Disordered (kingfisher)')
ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_ylabel('Reflectance', color='white')
ax.set_title('Ordered vs Amorphous Photonic Crystal', color='white', fontsize=10)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Angle dependence comparison
ax = axes[0, 1]
angles = [0, 20, 40, 60]
for ang in angles:
    R_ord = transfer_matrix_reflectance(wavelengths, ordered_layers, ang)
    peak_ord = wavelengths[np.argmax(R_ord)]
    ax.plot(wavelengths, R_ord, linewidth=1.5, label=f'Ordered {ang}° (peak={peak_ord:.0f}nm)')
ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_ylabel('Reflectance', color='white')
ax.set_title('Iridescence: Ordered Crystal', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Angle dependence of disordered
ax = axes[0, 2]
# Disordered average: simulate many random orientations
avg_R = np.zeros_like(wavelengths)
n_orient = 20
for _ in range(n_orient):
    rand_angle = np.random.uniform(0, 50)
    rand_layers = []
    for _ in range(n_bilayers):
        dk = d_keratin * (1 + disorder * np.random.randn())
        da = d_air * (1 + disorder * np.random.randn())
        rand_layers.extend([(max(dk, 20), n_keratin), (max(da, 20), n_air)])
    avg_R += transfer_matrix_reflectance(wavelengths, rand_layers, rand_angle) / n_orient

ax.plot(wavelengths, avg_R, color='#3b82f6', linewidth=2, label='Avg. over orientations')
peak_disordered = wavelengths[np.argmax(avg_R)]
ax.axvline(peak_disordered, color='#f59e0b', linestyle=':', label=f'Peak: {peak_disordered:.0f}nm')
ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_ylabel('Reflectance', color='white')
ax.set_title('Kingfisher: Angle-Independent Blue', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Bragg law visualization
ax = axes[1, 0]
spacings = np.linspace(80, 250, 100)
for theta in [0, 15, 30, 45]:
    peak_wls = [bragg_wavelength(d, theta) for d in spacings]
    ax.plot(spacings, peak_wls, linewidth=2, label=f'θ={theta}°')
ax.axhspan(450, 495, alpha=0.15, color='#3b82f6', label='Blue band')
ax.axhline(470, color='#3b82f6', linestyle=':', alpha=0.5)
ax.set_xlabel('Layer spacing (nm)', color='white')
ax.set_ylabel('Peak wavelength (nm)', color='white')
ax.set_title("Bragg's Law: Spacing → Color", color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: Number of layers vs reflectance peak
ax = axes[1, 1]
for n_layers in [2, 4, 8, 16]:
    layers_test = [(d_keratin, n_keratin), (d_air, n_air)] * n_layers
    R_test = transfer_matrix_reflectance(wavelengths, layers_test, 0)
    ax.plot(wavelengths, R_test, linewidth=2, label=f'{n_layers} bilayers')
ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_ylabel('Reflectance', color='white')
ax.set_title('More Layers = Sharper Color', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 6: Natural examples comparison
ax = axes[1, 2]
examples = [
    ('Kingfisher\\n(amorphous)', 170, 0.15, '#3b82f6'),
    ('Morpho\\nbutterfly', 200, 0.05, '#22c55e'),
    ('Peacock', 140, 0.08, '#a855f7'),
    ('Beetle\\n(jewel)', 250, 0.03, '#f59e0b'),
]
for name, spacing, disorder_val, color in examples:
    peak = bragg_wavelength(spacing, 0)
    bandwidth = peak * disorder_val * 2 + 20
    ax.barh(name, bandwidth, left=peak - bandwidth/2, color=color, height=0.5, edgecolor='none')
    ax.plot(peak, name, 'o', color='white', markersize=6)
ax.axvspan(380, 450, alpha=0.05, color='violet')
ax.axvspan(450, 495, alpha=0.05, color='blue')
ax.axvspan(495, 570, alpha=0.05, color='green')
ax.axvspan(570, 590, alpha=0.05, color='yellow')
ax.axvspan(590, 620, alpha=0.05, color='orange')
ax.axvspan(620, 780, alpha=0.05, color='red')
ax.set_xlabel('Reflected wavelength range (nm)', color='white')
ax.set_title('Structural Color in Nature', color='white', fontsize=11)
ax.set_xlim(380, 780)

plt.tight_layout()
plt.show()

print("Photonic Crystal Physics:")
print(f"  Kingfisher spacing: ~170nm → peak at {bragg_wavelength(170, 0):.0f}nm (blue)")
print(f"  Peacock spacing: ~140nm → peak at {bragg_wavelength(140, 0):.0f}nm (blue-green)")
print(f"  Ordered crystals: sharp peak, angle-dependent (iridescent)")
print(f"  Amorphous crystals: broader peak, angle-independent (non-iridescent)")`,
      challenge: 'Model a "gradient" photonic crystal where layer spacing increases from 150nm at the top to 200nm at the bottom. What does the reflectance spectrum look like? Some beetles use this to reflect a broad rainbow of colors simultaneously.',
      successHint: 'Photonic crystals are now a major field of photonics research, with applications in sensors, lasers, and solar cells. Nature has been perfecting them for 500 million years. The kingfisher feather is one of the best natural photonic crystals known.',
    },
    {
      title: 'Biomimetic photonic materials — from feathers to technology',
      concept: `The kingfisher's nanostructure has inspired a new field: **biomimetic photonic materials**. If nature can create angle-independent structural color with a self-assembled spongy matrix, can we replicate it for technology?

Applications of biomimetic structural color:
1. **Fade-proof pigments**: paints and coatings that never fade because the color comes from structure, not chemistry. Already commercialized in some automotive paints.
2. **Anti-counterfeiting**: structural color patterns are nearly impossible to replicate with standard printing, making them excellent for currency and ID security.
3. **Sensors**: photonic crystals change color when their spacing changes. Swell a hydrogel photonic crystal with moisture → color shift → humidity sensor.
4. **Energy**: photonic crystals can enhance solar cell efficiency by trapping specific wavelengths and directing them to the active layer.
5. **Display technology**: structural color pixels that are visible in direct sunlight (unlike LCD/OLED) with zero power consumption when static.

The manufacturing challenge: nature self-assembles photonic crystals through phase separation of proteins during feather growth. Replicating this in the lab requires techniques like **colloidal self-assembly** (letting nanoparticles settle into ordered arrays), **block copolymer lithography**, or **3D printing at the nanoscale**.`,
      analogy: 'Biomimicry is like reverse-engineering a competitor\'s product. Nature is the competitor, and it has had billions of years of R&D. Instead of starting from scratch, we study what works in nature and adapt it. The kingfisher feather is nature\'s patent for fade-proof structural color — and now we are licensing it.',
      storyConnection: 'The kingfisher\'s blue inspired more than just wonder — it inspired engineers. The same nanostructure that makes the feather blue is now being studied for smartphone screens, car paint, and even cancer detection. The humble kingfisher sitting by the river is a nanotechnology pioneer.',
      checkQuestion: 'A structural color sensor changes from blue (470nm) to green (530nm) when humidity increases from 30% to 80%. If the initial spacing is 170nm, what is the new spacing? (Use Bragg: lambda = 2*n*d)',
      checkAnswer: 'Initial: 470 = 2 * 1.27 * 170, which checks out (470 ≈ 431 nm — close with first-order correction). More simply: lambda is proportional to d. So new_d / 170 = 530 / 470, giving new_d = 170 * 530/470 = 192 nm. The spacing increased by 22nm (13%) due to water swelling the matrix. This 13% swelling produces a clearly visible color change — making structural color sensors highly sensitive.',
      codeIntro: 'Model biomimetic applications: sensors, fade-proof coatings, and the Shinkansen bullet train nose.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Structural color sensor model
def sensor_color(spacing_nm, n_eff=1.27):
    """Peak reflected wavelength from Bragg law (normal incidence)."""
    return 2 * n_eff * spacing_nm

# Humidity sensor: spacing changes with moisture absorption
def humidity_to_spacing(humidity_pct, base_spacing=170, swell_factor=0.002):
    """Spacing increases with humidity due to hygroscopic swelling."""
    return base_spacing * (1 + swell_factor * humidity_pct)

# Temperature sensor: thermal expansion
def temp_to_spacing(temp_c, base_spacing=170, expansion_coeff=0.0001):
    """Spacing changes with thermal expansion."""
    return base_spacing * (1 + expansion_coeff * (temp_c - 25))

# pH sensor
def pH_to_spacing(pH, base_spacing=170):
    """Hydrogel swelling depends on pH."""
    return base_spacing * (1 + 0.003 * (pH - 7)**2)

def wavelength_to_rgb(wl):
    if 380 <= wl < 440: r, g, b = -(wl-440)/60, 0, 1
    elif 440 <= wl < 490: r, g, b = 0, (wl-440)/50, 1
    elif 490 <= wl < 510: r, g, b = 0, 1, -(wl-510)/20
    elif 510 <= wl < 580: r, g, b = (wl-510)/70, 1, 0
    elif 580 <= wl < 645: r, g, b = 1, -(wl-645)/65, 0
    elif 645 <= wl <= 780: r, g, b = 1, 0, 0
    else: r, g, b = 0, 0, 0
    return np.clip([r, g, b], 0, 1)

fig, axes = plt.subplots(2, 3, figsize=(16, 9))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Humidity sensor
ax = axes[0, 0]
humidities = np.linspace(0, 100, 200)
spacings = [humidity_to_spacing(h) for h in humidities]
wls = [sensor_color(s) for s in spacings]
for i in range(len(humidities) - 1):
    color = wavelength_to_rgb(wls[i])
    ax.plot([humidities[i], humidities[i+1]], [wls[i], wls[i+1]], color=color, linewidth=3)
ax.set_xlabel('Humidity (%)', color='white')
ax.set_ylabel('Reflected wavelength (nm)', color='white')
ax.set_title('Photonic Humidity Sensor', color='white', fontsize=11)

# Plot 2: pH sensor
ax = axes[0, 1]
pHs = np.linspace(2, 12, 200)
wls_pH = [sensor_color(pH_to_spacing(p)) for p in pHs]
for i in range(len(pHs) - 1):
    color = wavelength_to_rgb(np.clip(wls_pH[i], 380, 780))
    ax.plot([pHs[i], pHs[i+1]], [wls_pH[i], wls_pH[i+1]], color=color, linewidth=3)
ax.set_xlabel('pH', color='white')
ax.set_ylabel('Reflected wavelength (nm)', color='white')
ax.set_title('Photonic pH Sensor', color='white', fontsize=11)

# Plot 3: Fade resistance comparison
ax = axes[0, 2]
years = np.arange(0, 31)
materials = {
    'Organic dye': np.exp(-0.08 * years),
    'Car paint (pigment)': np.exp(-0.03 * years),
    'Structural color': np.exp(-0.003 * years),
    'Kingfisher feather': np.exp(-0.005 * years),
}
colors_mat = ['#ef4444', '#f59e0b', '#3b82f6', '#22c55e']
for (name, fade), color in zip(materials.items(), colors_mat):
    ax.plot(years, fade * 100, color=color, linewidth=2, label=name)
ax.set_xlabel('Years of sun exposure', color='white')
ax.set_ylabel('Color retention (%)', color='white')
ax.set_title('Fade Resistance', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Shinkansen bullet train nose
ax = axes[1, 0]
# Kingfisher-inspired low-drag profile
t = np.linspace(0, 1, 200)
# Kingfisher beak profile (tapered)
kingfisher_profile = 0.5 * t**0.6
# Old bullet train (blunt)
old_profile = 0.8 * np.sqrt(t)
# Conventional cone
cone_profile = 0.6 * t

ax.plot(t * 10, kingfisher_profile * 3, color='#3b82f6', linewidth=2, label='Kingfisher-inspired')
ax.plot(t * 10, -kingfisher_profile * 3, color='#3b82f6', linewidth=2)
ax.plot(t * 10, old_profile * 3, color='#ef4444', linewidth=2, linestyle='--', label='Old design (blunt)')
ax.plot(t * 10, -old_profile * 3, color='#ef4444', linewidth=2, linestyle='--')
ax.fill_between(t * 10, -kingfisher_profile * 3, kingfisher_profile * 3, alpha=0.1, color='#3b82f6')
ax.set_xlabel('Length (m)', color='white')
ax.set_ylabel('Width (m)', color='white')
ax.set_title('Shinkansen Nose: Kingfisher Biomimicry', color='white', fontsize=10)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_aspect('equal')

# Plot 5: Applications overview
ax = axes[1, 1]
apps = ['Fade-proof\\ncoatings', 'Anti-\\ncounterfeit', 'Sensors', 'Solar\\ncells', 'Displays', 'Stealth']
readiness = [8, 7, 6, 4, 5, 3]  # Technology readiness level (1-9)
market_size = [5, 3, 2, 8, 6, 4]  # Relative market potential
colors_apps = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7', '#6b7280']
x = np.arange(len(apps))
ax.bar(x - 0.2, readiness, 0.35, color=[c for c in colors_apps], label='Readiness (1-9)', alpha=0.7)
ax.bar(x + 0.2, market_size, 0.35, color=[c for c in colors_apps], label='Market potential', alpha=0.4)
ax.set_xticks(x)
ax.set_xticklabels(apps, color='white', fontsize=8)
ax.set_ylabel('Score', color='white')
ax.set_title('Biomimetic Photonics Applications', color='white', fontsize=11)

# Plot 6: Summary
ax = axes[1, 2]
ax.axis('off')
text = """Biomimetic Photonic Materials
================================

FROM KINGFISHER TO TECHNOLOGY:

1. STRUCTURAL COLOR → Fade-proof paint
   No pigment = no fading. Ever.

2. NANOSTRUCTURE → Sensors
   Spacing change = color change.
   Detect humidity, pH, strain, gases.

3. BEAK SHAPE → Shinkansen 500 Series
   Kingfisher beak enters water with
   minimal splash → train enters tunnel
   with minimal sonic boom.
   Result: 15% less electricity,
   10% faster, no tunnel boom.

4. DIVING PHYSICS → Optical systems
   Refraction correction inspires
   adaptive optics designs.

Nature's R&D budget: 3.8 billion years.
Our job: learn and apply."""
ax.text(0.05, 0.95, text, transform=ax.transAxes, fontsize=9,
        verticalalignment='top', color='white', fontfamily='monospace')

plt.tight_layout()
plt.show()

print("Biomimetic Applications Summary:")
print("  Structural color: fade-proof, angle-independent, tunable")
print("  Sensors: visible color change from nanometer-scale physics")
print("  Shinkansen: kingfisher beak reduced noise and energy by 15%")
print("  The kingfisher teaches us: nature has already solved most engineering problems.")`,
      challenge: 'Design a structural color thermometer: choose a material with the right thermal expansion coefficient so that the color changes from blue (20°C) to red (40°C) — spanning the visible spectrum across a 20°C range. What expansion coefficient is needed?',
      successHint: 'Biomimicry is not just inspiration — it is a rigorous engineering approach. The kingfisher\'s nanostructure, beak shape, and diving mechanics have all been translated into real technology. Understanding the physics makes you both a better scientist and a better engineer.',
    },
    {
      title: 'Diving physics — refraction correction and the kingfisher\'s precision',
      concept: `When a kingfisher spots a fish from its perch above water, the fish is NOT where it appears to be. Light bending at the air-water interface (**refraction**) makes the fish appear shallower and slightly displaced from its true position. Yet the kingfisher catches fish with >90% success rate. How?

**Snell's Law**: n1 * sin(theta1) = n2 * sin(theta2), where n1 = 1.00 (air) and n2 = 1.33 (water). Light from the fish bends AWAY from the normal as it exits water. The apparent position is where the refracted ray, extended backward, intersects the water surface.

For a fish at depth d and horizontal distance x from directly below:
- True angle from vertical: alpha = arctan(x/d)
- Apparent angle (from above): beta = arcsin(sin(alpha) / 1.33) — always less steep
- Apparent depth: d_apparent = d * cos(alpha) / cos(beta) — always shallower

The kingfisher compensates by:
1. **Diving at steep angles** (close to vertical), which minimizes the refraction error
2. **Binocular vision** that may directly perceive the refraction distortion
3. **Learning from experience** — juveniles miss more often and improve with practice

The beak design is also critical: the long, narrow beak enters the water with minimal splash and drag. The cross-section transitions smoothly from circular to diamond-shaped — the same geometry used in the Shinkansen bullet train nose.`,
      analogy: 'Refraction is like the trick where a straw in a glass of water appears bent. The light from the underwater part of the straw changes direction at the surface, making it look displaced. The kingfisher faces this optical illusion every time it hunts — and has evolved the neural circuitry to see through it.',
      storyConnection: 'The children watched the kingfisher dive and were amazed — it never missed. "How does it see through the water?" they asked. The answer is physics: the kingfisher\'s brain corrects for refraction, aiming not where the fish appears but where it truly is.',
      checkQuestion: 'A fish is 30 cm deep and 20 cm to the side. What is the apparent depth and horizontal position as seen from above? (Use n_water = 1.33)',
      checkAnswer: 'True angle from vertical: alpha = arctan(20/30) = 33.7°. In water, sin(alpha) = 0.555. Refracted angle in air: sin(beta) = 0.555 * 1.33 = 0.738, beta = 47.6°. Apparent depth: 30 * cos(33.7°)/cos(47.6°) = 30 * 0.832/0.673 = 37.1 cm? Wait — apparent depth is SHALLOWER: d_app ≈ d/n = 30/1.33 = 22.6 cm (for viewing near-vertical). The fish appears at ~22.6 cm deep instead of 30 cm. If the kingfisher aimed at the apparent position, it would dive too shallow and miss by 7.4 cm.',
      codeIntro: 'Model refraction at the water surface and simulate how the kingfisher corrects for the optical illusion.',
      code: `import numpy as np
import matplotlib.pyplot as plt

n_air = 1.00
n_water = 1.33

def refraction_geometry(fish_depth, fish_horizontal, viewing_height=2.0):
    """Calculate apparent and true fish position."""
    # True position
    true_angle = np.arctan2(fish_horizontal, fish_depth)

    # Refracted angle (Snell's law at water surface)
    sin_in_water = np.sin(true_angle)
    sin_in_air = sin_in_water * n_water / n_air
    sin_in_air = np.clip(sin_in_air, -1, 1)
    apparent_angle = np.arcsin(sin_in_air)

    # Apparent depth (simple approximation for near-vertical viewing)
    apparent_depth = fish_depth / n_water
    # More accurate apparent horizontal position
    apparent_horizontal = apparent_depth * np.tan(apparent_angle)

    return {
        'true_depth': fish_depth,
        'true_horiz': fish_horizontal,
        'apparent_depth': apparent_depth,
        'apparent_horiz': apparent_horizontal,
        'depth_error': fish_depth - apparent_depth,
        'horiz_error': fish_horizontal - apparent_horizontal,
        'total_error': np.sqrt((fish_depth - apparent_depth)**2 + (fish_horizontal - apparent_horizontal)**2),
    }

# Dive success model
def dive_success_probability(depth, horiz, correction_skill=0.0):
    """Probability of catching fish given correction skill (0=none, 1=perfect)."""
    geom = refraction_geometry(depth, horiz)
    error_uncorrected = geom['total_error']
    # With correction
    error = error_uncorrected * (1 - correction_skill)
    # Success if error < fish size (~3 cm)
    fish_size = 3.0  # cm
    return np.exp(-(error / fish_size)**2)

fig, axes = plt.subplots(2, 3, figsize=(16, 9))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Refraction diagram
ax = axes[0, 0]
fish_d, fish_h = 30, 15  # cm
geom = refraction_geometry(fish_d, fish_h)

# Water surface
ax.axhline(0, color='#3b82f6', linewidth=2)
ax.fill_between([-10, 40], [-35, -35], [0, 0], alpha=0.1, color='#3b82f6')

# True fish position
ax.plot(fish_h, -fish_d, 'o', color='#22c55e', markersize=12, label='True position')
# Apparent fish position
ax.plot(geom['apparent_horiz'], -geom['apparent_depth'], 'x', color='#ef4444',
        markersize=12, markeredgewidth=3, label='Apparent position')

# Light ray from fish to surface to eye
# Underwater ray
ax.plot([fish_h, fish_h * 0.6], [-fish_d, 0], color='#f59e0b', linewidth=1.5, linestyle='-')
# Above water (refracted)
ax.plot([fish_h * 0.6, 0], [0, 30], color='#f59e0b', linewidth=1.5, linestyle='-')
# Virtual ray extension (what eye "sees")
ax.plot([fish_h * 0.6, geom['apparent_horiz']], [0, -geom['apparent_depth']],
        color='#ef4444', linewidth=1.5, linestyle='--')

# Kingfisher eye
ax.plot(0, 30, 'v', color='#a855f7', markersize=15, label='Kingfisher eye')

ax.set_xlim(-10, 40)
ax.set_ylim(-35, 35)
ax.set_xlabel('Horizontal (cm)', color='white')
ax.set_ylabel('Depth (cm)', color='white')
ax.set_title('Refraction Makes Fish Look Shallower', color='white', fontsize=10)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.text(5, -35, 'WATER', color='#3b82f6', fontsize=10)
ax.text(5, 25, 'AIR', color='white', fontsize=10)

# Plot 2: Error vs fish depth
ax = axes[0, 1]
depths = np.linspace(5, 60, 100)
for h in [0, 10, 20, 30]:
    errors = [refraction_geometry(d, h)['total_error'] for d in depths]
    ax.plot(depths, errors, linewidth=2, label=f'Horiz offset: {h}cm')
ax.set_xlabel('Fish depth (cm)', color='white')
ax.set_ylabel('Position error (cm)', color='white')
ax.set_title('Refraction Error vs Depth', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Success rate vs correction skill
ax = axes[0, 2]
skills = np.linspace(0, 1, 100)
for d, h in [(20, 10), (30, 15), (40, 20)]:
    success = [dive_success_probability(d, h, s) * 100 for s in skills]
    ax.plot(skills * 100, success, linewidth=2, label=f'd={d}, h={h}cm')
ax.axhline(90, color='#f59e0b', linestyle='--', label='Kingfisher success (~90%)')
ax.set_xlabel('Refraction correction skill (%)', color='white')
ax.set_ylabel('Catch success rate (%)', color='white')
ax.set_title('Correction Skill vs Success', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Optimal dive angle
ax = axes[1, 0]
dive_angles = np.linspace(10, 90, 80)  # degrees from horizontal
fish_depth = 25
fish_lateral = 15
errors_by_angle = []
for angle in dive_angles:
    # Effective viewing angle
    eff_horiz = fish_lateral * np.cos(np.radians(angle))
    error = refraction_geometry(fish_depth, eff_horiz)['total_error']
    errors_by_angle.append(error)
ax.plot(dive_angles, errors_by_angle, color='#3b82f6', linewidth=2)
ax.axvline(dive_angles[np.argmin(errors_by_angle)], color='#22c55e', linestyle='--',
           label=f'Optimal: {dive_angles[np.argmin(errors_by_angle)]:.0f}°')
ax.set_xlabel('Dive angle from horizontal (degrees)', color='white')
ax.set_ylabel('Position error (cm)', color='white')
ax.set_title('Why Kingfishers Dive Steeply', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: Beak drag comparison
ax = axes[1, 1]
speeds = np.linspace(0, 10, 100)  # m/s
# Drag = 0.5 * rho * v^2 * Cd * A
rho_water = 998
# Different nose shapes
shapes = {
    'Blunt (Cd=0.47)': (0.47, 3e-4),  # sphere
    'Cone (Cd=0.20)': (0.20, 3e-4),
    'Kingfisher beak (Cd=0.07)': (0.07, 2e-4),  # streamlined
}
colors_shapes = ['#ef4444', '#f59e0b', '#22c55e']
for (name, (cd, area)), color in zip(shapes.items(), colors_shapes):
    drag = 0.5 * rho_water * speeds**2 * cd * area
    ax.plot(speeds, drag, color=color, linewidth=2, label=name)
ax.set_xlabel('Entry speed (m/s)', color='white')
ax.set_ylabel('Drag force (N)', color='white')
ax.set_title('Beak Shape Reduces Entry Drag', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 6: Splash comparison
ax = axes[1, 2]
ax.axis('off')
text = """Kingfisher Diving Physics
===========================

REFRACTION CORRECTION:
  Fish at 30cm depth appears at 22.6cm
  Error: 7.4cm (bigger than the fish!)
  Kingfisher compensates with 90%+ skill

OPTIMAL STRATEGY:
  - Dive steeply (near vertical)
  - Minimizes refraction error
  - Observed angle: 70-85° from horizontal

BEAK DESIGN:
  - Cross-section: circle → diamond
  - Drag coefficient: 0.07 (vs 0.47 blunt)
  - Minimal splash (no warning for fish)
  - Inspired Shinkansen 500 Series nose

SHINKANSEN RESULT:
  - 15% less electricity
  - 10% faster in tunnels
  - Eliminated sonic boom at tunnel exit
  - All from copying a bird's beak"""
ax.text(0.05, 0.95, text, transform=ax.transAxes, fontsize=9,
        verticalalignment='top', color='white', fontfamily='monospace')

plt.tight_layout()
plt.show()

print("Kingfisher Diving Physics:")
print(f"  At depth=30cm, horiz=15cm: position error = {refraction_geometry(30, 15)['total_error']:.1f}cm")
print(f"  Kingfisher correction skill: ~90%+ (enough for >90% catch rate)")
print(f"  Steep dive angle minimizes refraction error")
print(f"  Beak drag coefficient ~0.07 — better than most engineered shapes")`,
      challenge: 'Model a muddy river: turbidity reduces visibility to 20cm. How does reduced visibility change the optimal hunting strategy? Should the kingfisher dive from closer (lower, less refraction) or farther (higher, more time to adjust)?',
      successHint: 'The kingfisher is a complete physics lesson: structural color (optics), diving (refraction), beak shape (fluid dynamics), and hunting (neuroscience). Every aspect of its biology is an engineering solution optimized by evolution.',
    },
    {
      title: 'Shinkansen bullet train nose — kingfisher-inspired engineering',
      concept: `The **Shinkansen 500 Series** bullet train is the most famous example of kingfisher-inspired biomimicry. In the 1990s, engineer Eiji Nakatsu faced a problem: when the bullet train exited tunnels at 300 km/h, it created a massive **sonic boom** (the "tunnel boom" problem).

The physics: as the blunt-nosed train entered a tunnel, it compressed air ahead of it. This compression wave traveled at the speed of sound, building in intensity through the tunnel. When it exited the far end — BOOM. Residents near tunnel exits complained of noise equivalent to a thunder clap.

Nakatsu, a birdwatcher, noticed that the kingfisher enters water at high speed with almost no splash. The secret: the kingfisher's beak has a gradually tapering profile that spreads the pressure change over time rather than concentrating it in a sudden impact.

The redesigned train nose mimics the kingfisher beak's geometry:
- **15m long** tapered nose (vs 6m for the old design)
- Cross-section transitions from circular to a flattened triangular shape
- The taper follows a power law similar to the beak: radius ~ (1 - x/L)^0.6

Results:
- **Eliminated tunnel boom** completely
- **15% reduction** in electricity consumption (less air resistance)
- **10% increase** in maximum speed
- **Quieter** operation overall

This is biomimicry at its finest — not copying the animal, but understanding the physics and applying the principle.`,
      analogy: 'The old train nose was like pushing your flat hand through water — big splash, lots of resistance. The kingfisher beak is like sliding a knife through water — minimal splash, minimal resistance. The Shinkansen nose applies the same principle: gradually displace air instead of slamming into it.',
      storyConnection: 'The kingfisher in our story plunged into the river daily, its beak cutting the water like a blade. Thousands of kilometers away, a bullet train uses the same shape to cut through air. The bird and the machine share the same physics, separated only by scale.',
      checkQuestion: 'If the Shinkansen saved 15% on electricity by copying the kingfisher beak, and the Shinkansen network uses about 1.6 TWh of electricity per year, how much energy does the kingfisher-inspired design save annually?',
      checkAnswer: '1.6 TWh * 15% = 0.24 TWh = 240 GWh per year. At Japanese electricity prices (~$0.20/kWh), that is $48 million per year in savings. Over the 20-year life of the 500 Series, that is nearly $1 billion — from copying a bird\'s beak. This is one of the highest-return biomimicry investments ever.',
      codeIntro: 'Model the tunnel boom problem and show how the kingfisher-inspired nose profile eliminates it.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Train nose profiles
def old_nose_profile(x, length=6):
    """Old blunt nose: hemisphere."""
    t = np.clip(x / length, 0, 1)
    return np.sqrt(np.maximum(1 - (1 - t)**2, 0))

def kingfisher_nose_profile(x, length=15):
    """Kingfisher-inspired: gradual taper."""
    t = np.clip(x / length, 0, 1)
    return t**0.6

def cone_nose_profile(x, length=10):
    """Simple cone."""
    t = np.clip(x / length, 0, 1)
    return t

# Pressure wave model
def pressure_wave(nose_profile, x_positions, speed=300/3.6, tunnel_length=2000):
    """Model pressure buildup as train enters tunnel.
    Returns pressure vs time at tunnel exit.
    """
    # Rate of cross-section change = rate of air displacement
    dx = x_positions[1] - x_positions[0]
    profile_derivative = np.gradient(nose_profile, dx)

    # Pressure at exit proportional to rate of volume change
    # Simplified: p(t) = rho * v * dA/dx * v
    rho = 1.225
    radius_max = 1.7  # meters (train radius)
    # Area change rate
    dA_dx = 2 * np.pi * radius_max * nose_profile * profile_derivative
    pressure = rho * speed**2 * dA_dx

    # Propagation delay to tunnel exit
    c = 343  # speed of sound
    time_to_exit = tunnel_length / c

    return pressure

x = np.linspace(0, 20, 500)

old_prof = old_nose_profile(x)
new_prof = kingfisher_nose_profile(x)
cone_prof = cone_nose_profile(x)

p_old = pressure_wave(old_prof, x)
p_new = pressure_wave(new_prof, x)
p_cone = pressure_wave(cone_prof, x)

fig, axes = plt.subplots(2, 3, figsize=(16, 9))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Nose profiles
ax = axes[0, 0]
ax.plot(x, old_prof * 1.7, color='#ef4444', linewidth=2, label='Old (hemisphere, 6m)')
ax.plot(x, -old_prof * 1.7, color='#ef4444', linewidth=2)
ax.plot(x, new_prof * 1.7, color='#22c55e', linewidth=2, label='Kingfisher (taper, 15m)')
ax.plot(x, -new_prof * 1.7, color='#22c55e', linewidth=2)
ax.fill_between(x, -new_prof * 1.7, new_prof * 1.7, alpha=0.08, color='#22c55e')
ax.set_xlabel('Distance from nose tip (m)', color='white')
ax.set_ylabel('Radius (m)', color='white')
ax.set_title('Train Nose Profiles', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_aspect('equal')

# Plot 2: Cross-section area change rate
ax = axes[0, 1]
dx = x[1] - x[0]
dA_old = np.abs(np.gradient(np.pi * (old_prof * 1.7)**2, dx))
dA_new = np.abs(np.gradient(np.pi * (new_prof * 1.7)**2, dx))
ax.plot(x, dA_old, color='#ef4444', linewidth=2, label='Old nose')
ax.plot(x, dA_new, color='#22c55e', linewidth=2, label='Kingfisher nose')
ax.set_xlabel('Position along nose (m)', color='white')
ax.set_ylabel('Rate of area change (m²/m)', color='white')
ax.set_title('Air Displacement Rate', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Pressure wave at tunnel exit
ax = axes[0, 2]
time = x / (300 / 3.6) * 1000  # convert to milliseconds
ax.plot(time[:len(p_old)], p_old / np.max(np.abs(p_old) + 1e-10), color='#ef4444', linewidth=2, label='Old nose')
ax.plot(time[:len(p_new)], p_new / np.max(np.abs(p_new) + 1e-10), color='#22c55e', linewidth=2, label='Kingfisher nose')
ax.set_xlabel('Time (ms)', color='white')
ax.set_ylabel('Pressure (normalized)', color='white')
ax.set_title('Pressure Pulse at Tunnel Exit', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Energy savings
ax = axes[1, 0]
speeds = np.linspace(100, 350, 100)  # km/h
# Drag proportional to Cd * v^2
cd_old = 0.25
cd_new = 0.21  # 15% reduction
energy_old = cd_old * (speeds / 3.6)**2
energy_new = cd_new * (speeds / 3.6)**2
savings_pct = (1 - energy_new / energy_old) * 100

ax.plot(speeds, energy_old, color='#ef4444', linewidth=2, label='Old design')
ax.plot(speeds, energy_new, color='#22c55e', linewidth=2, label='Kingfisher design')
ax.fill_between(speeds, energy_new, energy_old, alpha=0.15, color='#22c55e', label='Energy saved')
ax.set_xlabel('Speed (km/h)', color='white')
ax.set_ylabel('Energy consumption (relative)', color='white')
ax.set_title('Energy Savings', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: Noise reduction
ax = axes[1, 1]
positions = ['200m before\\ntunnel', 'Tunnel\\nentrance', 'Inside\\ntunnel', 'Tunnel\\nexit', '200m after\\ntunnel']
noise_old = [70, 95, 85, 100, 75]  # dB
noise_new = [68, 78, 80, 75, 70]   # dB
x_pos = np.arange(len(positions))
ax.bar(x_pos - 0.2, noise_old, 0.35, color='#ef4444', label='Old design')
ax.bar(x_pos + 0.2, noise_new, 0.35, color='#22c55e', label='Kingfisher design')
ax.axhline(85, color='#f59e0b', linestyle='--', label='Noise limit (85 dB)')
ax.set_xticks(x_pos)
ax.set_xticklabels(positions, color='white', fontsize=7)
ax.set_ylabel('Noise level (dB)', color='white')
ax.set_title('Noise Comparison', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 6: ROI summary
ax = axes[1, 2]
ax.axis('off')
text = """Shinkansen Biomimicry ROI
===========================

PROBLEM: Tunnel sonic boom at 300 km/h
SOLUTION: Kingfisher beak nose profile

COSTS:
  Design & testing: ~$50M
  Longer nose = less passenger space

BENEFITS (per year):
  Energy savings: $48M/yr (15%)
  Speed increase: $30M/yr (time saved)
  Noise compliance: avoided $100M+ fines
  Total: ~$178M/yr

PAYBACK: < 1 year

20-YEAR LIFETIME VALUE: ~$3 billion

All from studying how a bird
catches fish.

The kingfisher beak is one of the
most profitable shapes in history."""
ax.text(0.05, 0.95, text, transform=ax.transAxes, fontsize=9,
        verticalalignment='top', color='white', fontfamily='monospace')

plt.tight_layout()
plt.show()

print("Shinkansen Biomimicry Summary:")
print("  Old nose: 6m hemisphere → tunnel boom, high drag")
print("  New nose: 15m kingfisher taper → no boom, 15% less energy")
print("  Annual savings: ~$178M across Japanese rail network")
print("  The kingfisher's beak shape is worth billions in engineering value.")`,
      challenge: 'Design an even better nose: optimize the power law exponent (currently 0.6) to minimize peak pressure while keeping the nose shorter than 15m. Is there an optimal exponent? Does it match the kingfisher beak more closely at some other value?',
      successHint: 'The Shinkansen story demonstrates that biomimicry is not metaphor — it is engineering. The kingfisher solved the exact same physics problem (high-speed entry into a denser medium) that the train engineers faced. Understanding the physics connects biology to technology.',
    },
    {
      title: 'Structural Color Simulator preview — thin-film interference model',
      concept: `This mini-lesson previews the Level 4 capstone: a **Structural Color Simulator** that predicts reflected wavelengths from thin-film layer configurations.

The simulator will let you:
1. Define any number of thin-film layers with custom thickness and refractive index
2. Compute the full reflectance spectrum using the Transfer Matrix Method
3. Visualize the predicted color as it would appear to the human eye
4. Optimize layer design to achieve a target color
5. Explore how manufacturing tolerances affect color reproducibility

The core physics is the **Transfer Matrix Method (TMM)** — a rigorous solution to Maxwell's equations for stratified media. For each layer, the electromagnetic field is represented as a 2x2 matrix. The total system matrix is the product of all layer matrices. Reflectance and transmittance are extracted from the boundary conditions.

This is the same method used to design:
- **Anti-reflective coatings** on camera lenses
- **Dichroic mirrors** in projectors
- **Bragg reflectors** in fiber optics
- **Structural color pigments** in the cosmetics industry`,
      analogy: 'The Transfer Matrix Method is like a relay race for light. At each layer boundary, the baton (electromagnetic wave) is passed from one runner (medium) to the next, with some energy reflected back. The transfer matrix keeps track of all the handoffs, including interference between forward and backward waves.',
      storyConnection: 'Our structural color simulator takes the kingfisher\'s photonic crystal — nature\'s creation — and gives you the tools to design your own. You become the engineer, using the same physics that makes the kingfisher blue to create any color you want.',
      checkQuestion: 'An anti-reflective coating works by making reflected waves cancel (destructive interference). What thickness should a coating with n=1.38 be for minimum reflection at 550nm (green light)?',
      checkAnswer: 'For destructive interference of reflected light: 2*n*d = lambda/2 (quarter-wave condition, accounting for phase change at one surface). So d = lambda / (4*n) = 550 / (4 * 1.38) = 99.6 nm. A ~100nm coating of MgF2 (n≈1.38) on glass minimizes green reflection. This is why coated lenses have a purple/magenta tint — green is suppressed, so the residual reflection is the complementary color.',
      codeIntro: 'Build the Transfer Matrix Method core and preview the structural color simulator.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def transfer_matrix_spectrum(wavelengths_nm, layers, angle_deg=0, polarization='s'):
    """Full Transfer Matrix Method for multilayer thin films.
    layers: list of (thickness_nm, refractive_index)
    Returns reflectance and transmittance spectra.
    """
    n0 = 1.0  # incident medium (air)
    ns = 1.5  # substrate (glass)
    theta0 = np.radians(angle_deg)

    R = np.zeros(len(wavelengths_nm))
    T = np.zeros(len(wavelengths_nm))

    for wi, wl in enumerate(wavelengths_nm):
        # System transfer matrix
        M = np.eye(2, dtype=complex)

        for d, n in layers:
            # Angle in layer
            sin_t = (n0 / n) * np.sin(theta0)
            cos_t = np.sqrt(1 - sin_t**2 + 0j)

            # Phase thickness
            delta = 2 * np.pi * n * d * cos_t / wl

            if polarization == 's':
                eta = n * cos_t
            else:
                eta = n / cos_t

            # Layer matrix
            cos_d = np.cos(delta)
            sin_d = np.sin(delta)
            layer_M = np.array([
                [cos_d, 1j * sin_d / eta],
                [1j * eta * sin_d, cos_d]
            ])
            M = M @ layer_M

        # Boundary conditions
        eta_0 = n0 * np.cos(theta0) if polarization == 's' else n0 / np.cos(theta0)
        sin_ts = (n0 / ns) * np.sin(theta0)
        cos_ts = np.sqrt(1 - sin_ts**2 + 0j)
        eta_s = ns * cos_ts if polarization == 's' else ns / cos_ts

        # Reflection and transmission coefficients
        num = M[0, 0] * eta_s + M[0, 1] * eta_0 * eta_s - M[1, 0] - M[1, 1] * eta_0
        den = M[0, 0] * eta_s + M[0, 1] * eta_0 * eta_s + M[1, 0] + M[1, 1] * eta_0
        r = num / (den + 1e-20)
        R[wi] = min(float(np.abs(r)**2), 1.0)

    return R

def spectrum_to_rgb(wavelengths, spectrum):
    """Convert reflectance spectrum to perceived RGB color."""
    # CIE approximate color matching
    rgb = np.array([0.0, 0.0, 0.0])
    for wl, s in zip(wavelengths, spectrum):
        if 380 <= wl < 440:
            r, g, b = -(wl-440)/60, 0, 1
        elif 440 <= wl < 490:
            r, g, b = 0, (wl-440)/50, 1
        elif 490 <= wl < 510:
            r, g, b = 0, 1, -(wl-510)/20
        elif 510 <= wl < 580:
            r, g, b = (wl-510)/70, 1, 0
        elif 580 <= wl < 645:
            r, g, b = 1, -(wl-645)/65, 0
        elif 645 <= wl <= 780:
            r, g, b = 1, 0, 0
        else:
            r, g, b = 0, 0, 0
        rgb += np.array([r, g, b]) * s
    rgb = rgb / max(np.max(rgb), 1e-10)
    return np.clip(rgb, 0, 1)

wl = np.linspace(380, 780, 400)

# Design examples
designs = {
    'Kingfisher blue': [(85, 1.54), (85, 1.0)] * 6,
    'Morpho butterfly': [(100, 1.56), (70, 1.0)] * 10,
    'Anti-reflective': [(100, 1.38)],
    'Gold mirror': [(50, 1.5), (100, 2.5)] * 4,
    'Green structural': [(110, 1.54), (95, 1.0)] * 6,
}

fig, axes = plt.subplots(2, 3, figsize=(16, 9))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: All designs compared
ax = axes[0, 0]
for name, layers in designs.items():
    R = transfer_matrix_spectrum(wl, layers)
    ax.plot(wl, R, linewidth=2, label=name)
ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_ylabel('Reflectance', color='white')
ax.set_title('Structural Color Designs', color='white', fontsize=11)
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Color swatches
ax = axes[0, 1]
for i, (name, layers) in enumerate(designs.items()):
    R = transfer_matrix_spectrum(wl, layers)
    rgb = spectrum_to_rgb(wl, R)
    ax.barh(i, 1, color=rgb, edgecolor='white', linewidth=0.5)
    ax.text(0.5, i, name, ha='center', va='center', color='white' if np.mean(rgb) < 0.5 else 'black',
            fontsize=9, fontweight='bold')
ax.set_xlim(0, 1)
ax.set_yticks([])
ax.set_xticks([])
ax.set_title('Predicted Colors', color='white', fontsize=11)

# Plot 3: Layer thickness sweep
ax = axes[0, 2]
thicknesses = np.arange(50, 200, 2)
peak_wls = []
for d in thicknesses:
    R = transfer_matrix_spectrum(wl, [(d, 1.54), (d, 1.0)] * 6)
    peak_wls.append(wl[np.argmax(R)])
# Color the line
for i in range(len(thicknesses) - 1):
    rgb = spectrum_to_rgb(wl, transfer_matrix_spectrum(wl, [(thicknesses[i], 1.54), (thicknesses[i], 1.0)] * 6))
    ax.plot([thicknesses[i], thicknesses[i+1]], [peak_wls[i], peak_wls[i+1]], color=rgb, linewidth=3)
ax.set_xlabel('Layer thickness (nm)', color='white')
ax.set_ylabel('Peak wavelength (nm)', color='white')
ax.set_title('Thickness → Peak Color', color='white', fontsize=11)

# Plot 4: Manufacturing tolerance
ax = axes[1, 0]
target_d = 85  # nm (kingfisher blue)
tolerances = [0, 2, 5, 10, 20]  # nm standard deviation
for tol in tolerances:
    if tol == 0:
        R = transfer_matrix_spectrum(wl, [(target_d, 1.54), (target_d, 1.0)] * 6)
        ax.plot(wl, R, linewidth=2, label=f'±{tol}nm (perfect)')
    else:
        R_avg = np.zeros_like(wl)
        for _ in range(20):
            layers = []
            for _ in range(6):
                d1 = max(20, target_d + np.random.randn() * tol)
                d2 = max(20, target_d + np.random.randn() * tol)
                layers.extend([(d1, 1.54), (d2, 1.0)])
            R_avg += transfer_matrix_spectrum(wl, layers) / 20
        ax.plot(wl, R_avg, linewidth=2, label=f'±{tol}nm', alpha=0.8)
ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_ylabel('Reflectance', color='white')
ax.set_title('Manufacturing Tolerance Impact', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: Angle sweep for kingfisher
ax = axes[1, 1]
for angle in [0, 15, 30, 45, 60]:
    R = transfer_matrix_spectrum(wl, designs['Kingfisher blue'], angle)
    rgb = spectrum_to_rgb(wl, R)
    ax.plot(wl, R, color=rgb, linewidth=2, label=f'{angle}°')
ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_ylabel('Reflectance', color='white')
ax.set_title('Kingfisher: Angle Dependence', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 6: Capstone preview
ax = axes[1, 2]
ax.axis('off')
text = """Level 4 Capstone Preview
===========================

STRUCTURAL COLOR SIMULATOR

You will build a tool that:
1. Accepts custom layer stacks
2. Computes full reflectance (TMM)
3. Predicts perceived color
4. Optimizes layers for target color
5. Analyzes manufacturing tolerance

Applications:
- Design anti-reflective coatings
- Create structural color pigments
- Build photonic sensors
- Understand natural photonic crystals

Core physics: Transfer Matrix Method
Same math used in fiber optics,
thin-film solar cells, and laser mirrors.

The kingfisher's blue becomes
YOUR design tool."""
ax.text(0.05, 0.95, text, transform=ax.transAxes, fontsize=9,
        verticalalignment='top', color='white', fontfamily='monospace')

plt.tight_layout()
plt.show()

print("Structural Color Simulator preview complete.")
print("The Transfer Matrix Method can design ANY thin-film optical system.")
print("From kingfisher feathers to anti-reflective coatings to solar cells.")
print("Level 4 will give you the full optimizer to design your own structural colors.")`,
      challenge: 'Design a structural color that appears red (peak at 650nm). What layer thickness and how many bilayers do you need? Then design one that appears violet (420nm). Which is harder to manufacture, and why?',
      successHint: 'You now have the core physics of structural color: thin-film interference, photonic crystals, Bragg diffraction, and the Transfer Matrix Method. Level 4 will take this foundation and build a complete color design tool — from the kingfisher\'s blue to any color you can imagine.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Structural Color & Biomimetic Physics
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (optics & physics fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for photonic crystal and biomimicry simulations. Click to start.</p>
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
