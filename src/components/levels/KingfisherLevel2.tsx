import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function KingfisherLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Thin film interference math — from waves to colors',
      concept: `When light hits a thin film of thickness d and refractive index n, it reflects from both surfaces. The reflected beams travel different path lengths, creating interference. The **optical path difference** (OPD) is:

**OPD = 2nd cos(θ_t)** + possible phase shift

where θ_t is the angle of refraction inside the film. An additional π phase shift occurs when light reflects from a surface where n increases (going from air to film).

Constructive interference (bright color): OPD = mλ (integer multiple of wavelength)
Destructive interference (dark): OPD = (m + 1/2)λ

The reflectance of a single film at normal incidence:
**R = ((n₁ - n₂)/(n₁ + n₂))²**

For a thin film bounded by different media:
**R = r₁² + r₂² + 2r₁r₂cos(δ)** / (1 + r₁²r₂² + 2r₁r₂cos(δ))

where δ = 4πnd/λ is the phase difference and r₁, r₂ are the Fresnel reflection coefficients at each interface.`,
      analogy: 'The thin film equations are like mixing two sound waves in a recording studio. You calculate the path difference (delay between the two tracks), and depending on whether crests align or cancel, you get amplification or silence. The phase difference δ controls whether colors appear bright or dark — it\'s the mixing board knob.',
      storyConnection: 'The kingfisher\'s feather nanostructure is much more complex than a single thin film — it\'s a multi-layer quasi-periodic structure. But the fundamental math is the same: path differences, phase shifts, and interference. Master single-film math first, then stack layers for photonic crystals.',
      checkQuestion: 'Anti-reflective coatings on eyeglasses use destructive interference. If the coating has n=1.38 and the glass has n=1.52, what coating thickness minimizes reflection at λ=550nm (green, center of visible)?',
      checkAnswer: 'For destructive interference at normal incidence: 2nd = λ/2 (first minimum). So d = λ/(4n) = 550/(4×1.38) ≈ 99.6 nm. This ~100nm coating cancels green light reflection. Purple/red reflections remain slightly, which is why coated lenses have a faint purple tint.',
      codeIntro: 'Calculate and visualize thin film interference with full Fresnel equations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def thin_film_R(wavelength, d, n1=1.0, n2=1.5, n3=1.0, theta_i=0):
    """Full thin film reflectance using Fresnel equations."""
    # Snell's law
    theta_1 = theta_i
    theta_2 = np.arcsin(np.clip(n1 * np.sin(theta_1) / n2, -1, 1))
    theta_3 = np.arcsin(np.clip(n2 * np.sin(theta_2) / n3, -1, 1))

    # Fresnel coefficients (s-polarization)
    r12 = (n1 * np.cos(theta_1) - n2 * np.cos(theta_2)) / (n1 * np.cos(theta_1) + n2 * np.cos(theta_2))
    r23 = (n2 * np.cos(theta_2) - n3 * np.cos(theta_3)) / (n2 * np.cos(theta_2) + n3 * np.cos(theta_3))

    # Phase difference
    delta = 4 * np.pi * n2 * d * np.cos(theta_2) / wavelength

    # Total reflectance
    R = (r12**2 + r23**2 + 2*r12*r23*np.cos(delta)) / (1 + r12**2*r23**2 + 2*r12*r23*np.cos(delta))
    return R

wavelengths = np.linspace(380, 750, 500)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# 1. Reflectance vs wavelength for different thicknesses
ax = axes[0, 0]
ax.set_facecolor('#111827')
for d, color in zip([80, 120, 160, 200, 250], ['#a855f7', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444']):
    R = np.array([thin_film_R(wl, d) for wl in wavelengths])
    ax.plot(wavelengths, R * 100, color=color, linewidth=2, label=f'd={d}nm')
ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_ylabel('Reflectance (%)', color='white')
ax.set_title('Reflectance vs Film Thickness', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# 2. Reflectance vs angle for d=150nm
ax = axes[0, 1]
ax.set_facecolor('#111827')
angles = np.linspace(0, np.pi/3, 100)
for wl, color, name in zip([450, 500, 550, 600, 650],
                            ['#3b82f6', '#06b6d4', '#22c55e', '#f59e0b', '#ef4444'],
                            ['450nm', '500nm', '550nm', '600nm', '650nm']):
    R = np.array([thin_film_R(wl, 150, theta_i=a) for a in angles])
    ax.plot(np.degrees(angles), R * 100, color=color, linewidth=2, label=name)
ax.set_xlabel('Angle of incidence (degrees)', color='white')
ax.set_ylabel('Reflectance (%)', color='white')
ax.set_title('Angular Dependence (d=150nm)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# 3. Anti-reflective coating design
ax = axes[1, 0]
ax.set_facecolor('#111827')
# No coating vs optimal AR coating
R_bare = np.array([thin_film_R(wl, 0, n1=1.0, n2=1.52, n3=1.52) for wl in wavelengths])
d_ar = 550 / (4 * 1.38)  # quarter-wave for green
R_ar = np.array([thin_film_R(wl, d_ar, n1=1.0, n2=1.38, n3=1.52) for wl in wavelengths])
ax.plot(wavelengths, R_bare * 100, color='#ef4444', linewidth=2, label='Bare glass (no coating)')
ax.plot(wavelengths, R_ar * 100, color='#22c55e', linewidth=2, label=f'AR coated (d={d_ar:.0f}nm)')
ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_ylabel('Reflectance (%)', color='white')
ax.set_title('Anti-Reflective Coating Design', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# 4. Phase diagram
ax = axes[1, 1]
ax.set_facecolor('#111827')
d_range = np.linspace(50, 400, 200)
wl_range = np.linspace(380, 750, 200)
D, W = np.meshgrid(d_range, wl_range)
R_map = np.zeros_like(D)
for i in range(len(wl_range)):
    for j in range(len(d_range)):
        R_map[i, j] = thin_film_R(wl_range[i], d_range[j])

im = ax.imshow(R_map * 100, aspect='auto', cmap='hot',
               extent=[50, 400, 380, 750], origin='lower')
ax.set_xlabel('Film thickness (nm)', color='white')
ax.set_ylabel('Wavelength (nm)', color='white')
ax.set_title('Reflectance Map (% vs d and λ)', color='white', fontsize=11)
cbar = plt.colorbar(im, ax=ax)
cbar.ax.yaxis.label.set_color('white')
cbar.set_label('Reflectance %', color='white')
cbar.ax.tick_params(colors='gray')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Thin film interference equations:")
print("  Phase: δ = 4πnd·cos(θ)/λ")
print("  Reflectance: R = (r₁² + r₂² + 2r₁r₂cos(δ)) / (1 + r₁²r₂² + 2r₁r₂cos(δ))")
print()
print(f"  AR coating for glass: d = λ/(4n) = 550/(4×1.38) = {550/(4*1.38):.1f}nm")
print(f"  Kingfisher blue: d ≈ 150nm, peak at ~{2*1.5*150:.0f}nm")`,
      challenge: 'Design a coating that reflects red (650nm) at normal incidence but blue (450nm) at 45°. What thickness and refractive index would you need? Can a single layer do both?',
      successHint: 'Thin film interference is the foundation of optical coatings: anti-reflective lenses, mirrors, filters, and sensors. The math is elegant and the applications are everywhere.',
    },
    {
      title: 'Multilayer structures — stacking interference for power',
      concept: `A single thin film reflects weakly (~4% for glass). But stack many layers of alternating high and low refractive index materials, and you can achieve **>99% reflectance** at a specific wavelength. This is a **dielectric mirror** or **Bragg reflector**.

The design: alternate layers of thickness λ/(4n) for each material:
- High-n layer: n_H, d_H = λ₀/(4n_H)
- Low-n layer: n_L, d_L = λ₀/(4n_L)

Each interface reflects a small amount. With N layer pairs, all the small reflections add constructively at the design wavelength λ₀:

**R_max ≈ ((n_H/n_L)^(2N) - 1)² / ((n_H/n_L)^(2N) + 1)²**

With n_H=2.3, n_L=1.38, and N=10 pairs: R ≈ 99.7%!

The **bandwidth** (range of reflected wavelengths) depends on the contrast ratio n_H/n_L: higher contrast = wider bandwidth.

This is exactly how kingfisher feathers work: alternating melanin (n≈2.0) and keratin/air (n≈1.0-1.5) layers create a natural Bragg reflector for blue light.`,
      analogy: 'A multilayer mirror is like a choir singing in unison. One voice (one layer) is quiet. But 20 voices (20 layers) all singing the same note at the same time produce a powerful, resonant sound. The key is that all layers contribute at exactly the same wavelength — constructive interference from every surface.',
      storyConnection: 'The kingfisher\'s feather is a biological Bragg reflector — alternating layers of melanin granules and air/keratin. Evolution optimized the number of layers, their spacing, and their refractive index contrast to produce the most vivid blue possible. Human-made Bragg reflectors follow the same physics but with synthetic materials.',
      checkQuestion: 'A 20-layer Bragg reflector reflects 99.9% at its design wavelength. What happens to the other 0.1% of the light?',
      checkAnswer: 'It\'s transmitted through the stack. In a dielectric mirror (no absorption), R + T = 100%. So T = 0.1% passes through. If any layer absorbs light (like melanin does slightly), some energy is also lost to heat. Real kingfisher feathers absorb some light in the melanin layers, which is why they\'re not perfect mirrors — but they\'re impressively reflective for biological structures.',
      codeIntro: 'Simulate a multilayer Bragg reflector and explore its properties.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def multilayer_reflectance(wavelength, n_layers, n_high, n_low, design_wl):
    """Calculate reflectance of a multilayer Bragg reflector using transfer matrix method (simplified)."""
    d_high = design_wl / (4 * n_high)
    d_low = design_wl / (4 * n_low)

    # Phase for each layer
    phi_h = 2 * np.pi * n_high * d_high / wavelength
    phi_l = 2 * np.pi * n_low * d_low / wavelength

    # Transfer matrix (simplified for normal incidence)
    # For a quarter-wave stack, reflectance at design wavelength:
    ratio = n_high / n_low
    R_peak = ((ratio**(2*n_layers) - 1) / (ratio**(2*n_layers) + 1))**2

    # Approximate spectral shape using sinc-like function
    detuning = (wavelength - design_wl) / design_wl
    bandwidth = 2 * np.arcsin((n_high - n_low) / (n_high + n_low)) / np.pi
    R = R_peak * np.sinc(detuning / bandwidth * n_layers / 2)**2
    return np.clip(R, 0, 1)

wavelengths = np.linspace(350, 800, 1000)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# 1. Effect of number of layers
ax1.set_facecolor('#111827')
n_h, n_l = 2.0, 1.45
design = 470  # blue

for N, color in zip([2, 5, 10, 20], ['#f59e0b', '#22c55e', '#3b82f6', '#a855f7']):
    R = np.array([multilayer_reflectance(wl, N, n_h, n_l, design) for wl in wavelengths])
    ax1.plot(wavelengths, R * 100, color=color, linewidth=2, label=f'{N} layer pairs')

ax1.set_xlabel('Wavelength (nm)', color='white')
ax1.set_ylabel('Reflectance (%)', color='white')
ax1.set_title(f'Bragg Reflector: More Layers = Sharper, Stronger Peak', color='white', fontsize=11)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')
ax1.set_ylim(0, 105)

# 2. Peak reflectance vs N for different contrast ratios
ax2.set_facecolor('#111827')
N_range = np.arange(1, 25)

contrasts = [(2.3, 1.38, 'TiO₂/MgF₂'), (2.0, 1.45, 'ZnS/SiO₂'),
             (1.8, 1.45, 'Melanin/keratin'), (1.6, 1.45, 'Low contrast')]
colors_c = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6']

for (nh, nl, name), color in zip(contrasts, colors_c):
    ratio = nh / nl
    R_peaks = [((ratio**(2*N) - 1) / (ratio**(2*N) + 1))**2 for N in N_range]
    ax2.plot(N_range, np.array(R_peaks) * 100, 'o-', color=color, linewidth=2,
             markersize=4, label=f'{name} ({nh}/{nl})')

ax2.axhline(99, color='#4b5563', linestyle=':', alpha=0.3)
ax2.text(24, 99.5, '99%', color='#9ca3af', fontsize=8, ha='right')
ax2.set_xlabel('Number of layer pairs (N)', color='white')
ax2.set_ylabel('Peak reflectance (%)', color='white')
ax2.set_title('Peak Reflectance vs Layer Count', color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Bragg reflector design:")
print(f"  Design wavelength: {design}nm (blue)")
print(f"  High-n: {n_h}, layer thickness: {design/(4*n_h):.1f}nm")
print(f"  Low-n: {n_l}, layer thickness: {design/(4*n_l):.1f}nm")
print()
print("Peak reflectance by layer count:")
ratio = n_h / n_l
for N in [2, 5, 10, 20]:
    R = ((ratio**(2*N) - 1) / (ratio**(2*N) + 1))**2
    print(f"  N={N:>2}: R = {R*100:.2f}%")`,
      challenge: 'Design a Bragg reflector for infrared (λ=10,000nm, used in thermal insulation). What layer thicknesses are needed with germanium (n=4.0) and zinc selenide (n=2.4)? How many layers for 99% reflectance?',
      successHint: 'Multilayer reflectors are used in lasers (cavity mirrors), telescopes (dielectric coatings), optical filters, and energy-efficient windows. The kingfisher\'s feather is a biological prototype of technology worth billions.',
    },
    {
      title: 'Photonic bandgaps — light forbidden zones',
      concept: `A **photonic bandgap** is a range of wavelengths that cannot propagate through a photonic crystal — they're completely reflected. This is the optical analog of the electronic bandgap in semiconductors.

In a 1D photonic crystal (multilayer stack), the bandgap appears around the Bragg wavelength. In 2D and 3D photonic crystals, the bandgap can be **omnidirectional** — reflecting all wavelengths in the gap regardless of angle or polarization.

The bandgap width depends on refractive index contrast:
**Δω/ω₀ ≈ (4/π) × arcsin((n_H - n_L)/(n_H + n_L))**

For n_H=3.5, n_L=1.0: Δω/ω₀ ≈ 0.37 (37% relative bandwidth — enormous!)

Applications of photonic bandgaps:
- **Photonic crystal fibers**: guide light around bends with zero loss
- **LEDs**: increase light extraction efficiency by 2-3×
- **Lasers**: create micro-cavities for ultra-low-threshold lasing
- **Solar cells**: trap light inside the cell for more absorption
- **Sensors**: shifts in the bandgap indicate chemical changes`,
      analogy: 'A photonic bandgap is like a mountain range that blocks certain radio frequencies. Signals within the "forbidden" frequency range can\'t get through — they\'re reflected back. Signals outside the range pass freely. Photonic crystals are engineered "mountain ranges" for light, designed to block specific colors while passing others.',
      storyConnection: 'The kingfisher\'s feather nanostructure has a photonic bandgap centered on blue wavelengths. Blue light is reflected (we see the blue coat). Red and green light pass through and is absorbed by melanin underneath. The bandgap is what makes the blue so pure and vivid — it\'s not just enhanced by interference, it\'s the ONLY color allowed out.',
      checkQuestion: 'If you could create a material with a complete 3D photonic bandgap, you could trap light inside a cavity forever (in theory). Why is this useful?',
      checkAnswer: 'A photonic cavity with a complete bandgap would confine light with zero loss — no leakage in any direction. This enables: (1) ultra-low-threshold lasers (less energy needed to lase), (2) quantum computing with photons (single photons confined and manipulated), (3) perfect optical memories. In practice, materials absorb some light, so "forever" becomes "very long time" — but it\'s still transformative.',
      codeIntro: 'Visualize photonic bandgaps and their dependence on structure parameters.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# 1. Band structure of a 1D photonic crystal
ax1.set_facecolor('#111827')

n_h, n_l = 2.0, 1.45
a = 155  # period (nm)

# Dispersion relation for 1D photonic crystal (Kronig-Penney model, simplified)
# Band edges at k = 0 and k = π/a
k_range = np.linspace(0, np.pi / a, 200)

# First few bands (approximate)
n_avg = (n_h + n_l) / 2
c = 3e17  # nm/s (speed of light)

# Free-photon dispersion (no crystal)
omega_free = c * k_range / n_avg

# Band gaps open at Brillouin zone boundaries
# Gap width approximation
delta_n = n_h - n_l
n_sum = n_h + n_l

bands_low = []
bands_high = []
for band in range(1, 6):
    omega_center = band * np.pi * c / (n_avg * a)
    gap_width = omega_center * (2 / np.pi) * np.arcsin(delta_n / n_sum)

    omega_lower = omega_center - gap_width / 2
    omega_upper = omega_center + gap_width / 2

    # Convert to wavelength for labeling
    wl_center = 2 * np.pi * c / omega_center
    wl_lower = 2 * np.pi * c / omega_upper
    wl_upper = 2 * np.pi * c / omega_lower

    # Draw band
    k_band = np.linspace(0, np.pi / a, 100)
    omega_band_low = omega_lower * np.sin(k_band * a / (2 * band)) / np.sin(np.pi / (2 * band) + 0.01)
    omega_band_high = omega_upper + (omega_upper * 0.3) * (1 - np.cos(k_band * a / band))

    # Bandgap shading
    if 300 < wl_center < 800:
        gap_color = '#ef4444'
    else:
        gap_color = '#4b5563'

    ax1.axhspan(omega_lower * 1e-15, omega_upper * 1e-15, alpha=0.2, color=gap_color)
    if 0.5 < omega_center * 1e-15 < 5:
        ax1.text(np.pi / a * 1.05, (omega_lower + omega_upper) / 2 * 1e-15,
                 f'Gap: {wl_upper:.0f}-{wl_lower:.0f}nm', color=gap_color, fontsize=7, va='center')

# Plot dispersion lines
for band in range(1, 8):
    omega = band * c * k_range / (n_avg * 2)
    ax1.plot(k_range, omega * 1e-15, color='#22c55e', linewidth=1.5)

ax1.set_xlabel('Wave vector k (1/nm)', color='white')
ax1.set_ylabel('Frequency (PHz)', color='white')
ax1.set_title('1D Photonic Crystal Band Structure', color='white', fontsize=11)
ax1.set_xlim(0, np.pi / a * 1.1)
ax1.set_ylim(0, 4)
ax1.tick_params(colors='gray')

# 2. Bandgap width vs refractive index contrast
ax2.set_facecolor('#111827')
n_low_fixed = 1.45
n_high_range = np.linspace(1.5, 4.0, 100)
contrast = n_high_range / n_low_fixed

# Relative bandgap width
gap_relative = (2 / np.pi) * np.arcsin((n_high_range - n_low_fixed) / (n_high_range + n_low_fixed))

ax2.plot(contrast, gap_relative * 100, color='#22c55e', linewidth=3)
ax2.fill_between(contrast, gap_relative * 100, alpha=0.15, color='#22c55e')

# Mark specific materials
materials = [
    (1.5/1.45, 'SiO₂/MgF₂', '#3b82f6'),
    (2.0/1.45, 'Melanin/keratin\
(kingfisher)', '#06b6d4'),
    (2.3/1.45, 'TiO₂/SiO₂', '#f59e0b'),
    (3.5/1.45, 'Si/SiO₂', '#ef4444'),
]
for ratio, name, color in materials:
    gap = (2/np.pi) * np.arcsin((ratio*1.45 - 1.45) / (ratio*1.45 + 1.45))
    ax2.plot(ratio, gap * 100, 'o', color=color, markersize=10, zorder=5)
    ax2.annotate(name, (ratio, gap*100), textcoords="offset points", xytext=(10, 5),
                 color=color, fontsize=8)

ax2.set_xlabel('Refractive index contrast (n_H / n_L)', color='white')
ax2.set_ylabel('Relative bandgap width (%)', color='white')
ax2.set_title('Bandgap Width vs Index Contrast', color='white', fontsize=11)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Photonic bandgap summary:")
print(f"  Formula: Δω/ω₀ ≈ (2/π)·arcsin((n_H-n_L)/(n_H+n_L))")
print()
for ratio, name, _ in materials:
    nh = ratio * 1.45
    gap = (2/np.pi) * np.arcsin((nh - 1.45) / (nh + 1.45)) * 100
    print(f"  {name}: n_H/n_L={ratio:.2f}, bandgap width={gap:.1f}%")`,
      challenge: 'A photonic crystal fiber uses a 2D bandgap to guide light around bends. If the bandgap is centered at 1550nm (telecom wavelength) and is 10% wide, what range of wavelengths is guided? Is this enough for fiber optic communications?',
      successHint: 'Photonic bandgaps are to photonics what electronic bandgaps are to electronics. They enable control over light that was impossible with conventional optics — and nature had them first.',
    },
    {
      title: 'Anti-reflection coatings — making glass invisible',
      concept: `An **anti-reflection (AR) coating** does the opposite of a Bragg reflector: it minimizes reflection. At each glass surface, ~4% of light is reflected (R = ((n-1)/(n+1))² ≈ 0.04 for n=1.52).

**Quarter-wave AR coating**: A single layer of thickness d = λ/(4n_c) where n_c = √(n_glass) ≈ 1.23 for glass. This makes the reflected beams from top and bottom of the coating interfere destructively.

**Multi-layer AR coatings** (broadband): Stack layers to cancel reflection across the entire visible spectrum. Modern coatings achieve <0.5% reflection from 400-700nm.

**Moth-eye nanostructure**: Instead of discrete layers, a gradient in refractive index from air (n=1) to the substrate. Moths evolved this on their eyes to see better at night — any reflection would alert predators. The nanostructure consists of tiny pillars (~200nm) that create a smooth n transition.

Applications: camera lenses (8-15 surfaces, each needs AR coating), solar cells (reduce reflection loss from ~30% to ~2%), eyeglasses, smartphone screens.`,
      analogy: 'An AR coating is like a ramp between two levels. A staircase (abrupt interface) causes a "bump" (reflection) at each step. A ramp (gradual index change) creates a smooth transition with no bump. The moth-eye structure is the ultimate ramp — a continuous gradient from air to glass.',
      storyConnection: 'The kingfisher\'s feather does the opposite of AR coating — it maximizes reflection of blue light. But the underlying physics is identical: controlling interference at interfaces. AR coatings cancel reflections; the kingfisher\'s nanostructure reinforces them. Same equations, different optimization targets.',
      checkQuestion: 'A camera lens has 7 glass elements (14 surfaces). Without AR coating, each surface reflects 4%. What fraction of light gets through all 14 surfaces?',
      checkAnswer: 'Each surface transmits 96%, so total transmission = 0.96¹⁴ ≈ 0.56 = 56%. Nearly half the light is lost to reflections! With AR coating (0.5% per surface): 0.995¹⁴ ≈ 0.932 = 93.2%. AR coatings are not optional — without them, modern cameras would be unusable.',
      codeIntro: 'Design and compare single-layer vs multi-layer vs moth-eye AR coatings.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

wavelengths = np.linspace(380, 750, 500)
n_glass = 1.52

# 1. Single-layer AR coating
def single_ar_reflectance(wl, d, n_coat, n_glass=1.52):
    r1 = (1 - n_coat) / (1 + n_coat)
    r2 = (n_coat - n_glass) / (n_coat + n_glass)
    delta = 4 * np.pi * n_coat * d / wl
    R = (r1**2 + r2**2 + 2*r1*r2*np.cos(delta)) / (1 + r1**2*r2**2 + 2*r1*r2*np.cos(delta))
    return R

# Bare glass
R_bare = ((1 - n_glass) / (1 + n_glass))**2 * np.ones_like(wavelengths) * 100

# Single layer optimized for 550nm
n_coat = np.sqrt(n_glass)  # ideal: n_c = sqrt(n_glass)
d_opt = 550 / (4 * n_coat)
R_single = np.array([single_ar_reflectance(wl, d_opt, n_coat) for wl in wavelengths]) * 100

# V-coat (two layers, optimized for 550nm)
def two_layer_ar(wl, n_glass=1.52):
    n1, n2 = 1.38, 1.7
    d1 = 550 / (4 * n1) * 0.5
    d2 = 550 / (4 * n2) * 0.5
    delta1 = 4 * np.pi * n1 * d1 / wl
    delta2 = 4 * np.pi * n2 * d2 / wl
    r01 = (1 - n1) / (1 + n1)
    r12 = (n1 - n2) / (n1 + n2)
    r23 = (n2 - n_glass) / (n2 + n_glass)
    # Simplified multi-layer
    R = abs(r01 + r12 * np.exp(1j*delta1) + r23 * np.exp(1j*(delta1+delta2)))**2 / 3
    return R

R_two = np.array([two_layer_ar(wl) for wl in wavelengths]) * 100

# Moth-eye (gradient index, approximate)
def moth_eye_ar(wl, n_glass=1.52):
    # Gradient from n=1 to n=1.52 over 200nm pillars
    # Each thin slice contributes a tiny reflection
    n_slices = 50
    pillar_height = 200
    R_total = 0
    for i in range(n_slices):
        n_i = 1 + (n_glass - 1) * (i / n_slices)**1.5
        n_j = 1 + (n_glass - 1) * ((i+1) / n_slices)**1.5
        r = (n_i - n_j) / (n_i + n_j)
        R_total += r**2
    return R_total

R_moth = np.array([moth_eye_ar(wl) for wl in wavelengths]) * 100

ax1.set_facecolor('#111827')
ax1.plot(wavelengths, R_bare, color='#ef4444', linewidth=2, label='Bare glass (4.2%)')
ax1.plot(wavelengths, R_single, color='#f59e0b', linewidth=2, label=f'Single layer (n={n_coat:.2f})')
ax1.plot(wavelengths, R_two, color='#3b82f6', linewidth=2, label='Two-layer V-coat')
ax1.plot(wavelengths, R_moth, color='#22c55e', linewidth=2, label='Moth-eye gradient')

ax1.set_xlabel('Wavelength (nm)', color='white')
ax1.set_ylabel('Reflectance (%)', color='white')
ax1.set_title('AR Coating Comparison', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')
ax1.set_ylim(0, 5)

# 2. Camera lens transmission with/without AR
ax2.set_facecolor('#111827')
n_surfaces = np.arange(1, 21)
T_bare = (1 - 0.042)**n_surfaces * 100
T_single = (1 - 0.012)**n_surfaces * 100
T_multi = (1 - 0.003)**n_surfaces * 100
T_moth = (1 - 0.001)**n_surfaces * 100

ax2.plot(n_surfaces, T_bare, 'o-', color='#ef4444', linewidth=2, label='No coating (4.2%/surface)')
ax2.plot(n_surfaces, T_single, 's-', color='#f59e0b', linewidth=2, label='Single AR (1.2%)')
ax2.plot(n_surfaces, T_multi, '^-', color='#3b82f6', linewidth=2, label='Multi-layer (0.3%)')
ax2.plot(n_surfaces, T_moth, 'D-', color='#22c55e', linewidth=2, label='Moth-eye (0.1%)')

ax2.set_xlabel('Number of glass surfaces', color='white')
ax2.set_ylabel('Total transmission (%)', color='white')
ax2.set_title('Camera Lens: Light Lost to Reflections', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')
ax2.set_ylim(0, 105)

plt.tight_layout()
plt.show()

print("AR coating performance (per surface):")
print(f"  Bare glass: {0.042*100:.1f}% reflection")
print(f"  Single-layer MgF₂: ~1.2% reflection")
print(f"  Multi-layer broadband: ~0.3% reflection")
print(f"  Moth-eye nanostructure: ~0.1% reflection")
print()
print(f"Camera with 14 surfaces:")
print(f"  No coating: {(1-0.042)**14*100:.1f}% transmission")
print(f"  Multi-layer: {(1-0.003)**14*100:.1f}% transmission")`,
      challenge: 'Solar cells lose ~30% of incident light to surface reflection. Design an AR coating for silicon (n=3.5). What is the ideal single-layer coating material (n = √3.5 ≈ 1.87)? What thickness for 600nm light?',
      successHint: 'AR coatings are invisible but essential. Every camera, telescope, solar cell, and eyeglass lens relies on interference engineering. The moth\'s eye evolved the ultimate solution — and now we copy it for next-generation solar panels.',
    },
    {
      title: 'Structural color applications — from nature to nanotechnology',
      concept: `Structural color is moving from laboratory curiosity to industrial reality:

**Photonic paper and ink**: Nanoparticles self-assemble into photonic crystals when deposited on paper. Different particle sizes produce different colors. No chemical dyes needed.

**Responsive materials**: Hydrogels embedded with photonic crystals swell in response to chemical changes, shifting the bandgap and changing color. Applications: pH sensors, glucose monitors, freshness indicators for food packaging.

**Structural color fabrics**: Researchers at MIT and Cambridge have produced fibers with embedded photonic crystals. Colors don't fade, don't require toxic dyes, and can be tuned by stretching.

**Anti-counterfeiting**: Photonic crystal patterns produce angle-dependent colors that are nearly impossible to replicate with printing technology. Used on passports, banknotes, and luxury goods.

**Energy harvesting**: Photonic crystals on solar cells create "slow light" — light trapped inside the cell bounces back and forth, increasing absorption. Efficiency improvements of 5-30% are demonstrated.`,
      analogy: 'Structural color applications are like the transition from analog to digital photography. Chemical dyes (film) are being replaced by nanostructured colors (digital sensors). Both produce images, but the digital version is more precise, more durable, more tunable, and eventually cheaper at scale.',
      storyConnection: 'The kingfisher\'s blue coat is nature\'s proof of concept. Millions of years of evolution optimized the nanostructure for vivid, permanent, angle-dependent color. Human engineers are now reverse-engineering that feat — creating structural color materials that could eliminate chemical dyes from textiles, paints, and inks.',
      checkQuestion: 'A structural color humidity sensor changes from blue (dry) to green (wet) to red (very wet). What\'s happening at the nanoscale?',
      checkAnswer: 'The photonic crystal is absorbing water and swelling. As the lattice spacing d increases, the Bragg-reflected wavelength λ = 2nd increases: blue (450nm) → green (530nm) → red (650nm). The color shift is directly proportional to the amount of swelling, which is proportional to humidity. You\'re reading humidity from color — a real-world application of photonic bandgap physics.',
      codeIntro: 'Simulate a structural color sensor that changes color in response to an environmental variable.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# 1. Humidity sensor — color shift
ax = axes[0, 0]
ax.set_facecolor('#111827')
wavelengths = np.linspace(380, 750, 500)
base_d = 160  # nm
n_eff = 1.45

humidity = [10, 30, 50, 70, 90]
for rh in humidity:
    d = base_d * (1 + 0.003 * rh)  # 0.3% swell per %RH
    peak = 2 * n_eff * d
    R = 0.8 * np.exp(-((wavelengths - peak) / 25)**2)
    rgb = plt.cm.rainbow((peak - 380) / (750 - 380))
    ax.plot(wavelengths, R, color=rgb, linewidth=2, label=f'{rh}% RH → {peak:.0f}nm')

ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_ylabel('Reflectance', color='white')
ax.set_title('Humidity Sensor (structural color shift)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# 2. Color stability comparison
ax = axes[0, 1]
ax.set_facecolor('#111827')
uv_hours = np.linspace(0, 10000, 200)

pigment_fade = {
    'Red dye': 100 * np.exp(-uv_hours / 2000),
    'Blue dye': 100 * np.exp(-uv_hours / 4000),
    'Nanostructure': 100 - uv_hours * 0.0005,
}
colors_dye = ['#ef4444', '#3b82f6', '#22c55e']
for (name, intensity), color in zip(pigment_fade.items(), colors_dye):
    style = '-' if 'Nano' in name else '--'
    ax.plot(uv_hours, intensity, color=color, linewidth=2, linestyle=style, label=name)

ax.set_xlabel('UV exposure (hours)', color='white')
ax.set_ylabel('Color intensity (%)', color='white')
ax.set_title('UV Stability: Dyes vs Nanostructures', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# 3. Solar cell enhancement
ax = axes[1, 0]
ax.set_facecolor('#111827')
wl_solar = np.linspace(300, 1100, 500)

# Silicon absorption without coating (simplified)
si_absorption = 1 - np.exp(-0.005 * (1100 - wl_solar))
si_absorption = np.clip(si_absorption, 0, 0.7)

# With photonic crystal (enhanced near band edge)
pc_enhancement = 1 + 0.3 * np.exp(-((wl_solar - 900) / 100)**2)
si_enhanced = np.clip(si_absorption * pc_enhancement, 0, 0.95)

ax.plot(wl_solar, si_absorption * 100, color='#ef4444', linewidth=2, label='Bare silicon')
ax.plot(wl_solar, si_enhanced * 100, color='#22c55e', linewidth=2, label='With photonic crystal')
ax.fill_between(wl_solar, si_absorption*100, si_enhanced*100, alpha=0.2, color='#22c55e')
ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_ylabel('Absorption (%)', color='white')
ax.set_title('Solar Cell: Photonic Crystal Enhancement', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# 4. Fabrication methods comparison
ax = axes[1, 1]
ax.set_facecolor('#111827')
methods = ['Self-assembly\
(colloidal)', 'Lithography\
(e-beam)', 'Holographic', 'Bio-templating', 'Inkjet\
printing']
cost = [2, 10, 5, 3, 1]
precision = [6, 10, 8, 5, 4]
scalability = [8, 2, 5, 4, 9]

x = np.arange(len(methods))
width = 0.25
ax.bar(x - width, cost, width, label='Cost (lower=better)', color='#ef4444', alpha=0.8)
ax.bar(x, precision, width, label='Precision', color='#3b82f6', alpha=0.8)
ax.bar(x + width, scalability, width, label='Scalability', color='#22c55e', alpha=0.8)

ax.set_xticks(x)
ax.set_xticklabels(methods, color='white', fontsize=8)
ax.set_ylabel('Score (0-10)', color='white')
ax.set_title('Nanostructure Fabrication Methods', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Structural color technology status:")
print("  Anti-counterfeiting: DEPLOYED (passports, banknotes)")
print("  Responsive sensors: PROTOTYPE (medical, food safety)")
print("  Textile color: RESEARCH (MIT, Cambridge)")
print("  Solar enhancement: PROTOTYPE (5-30% improvement)")
print()
print("The kingfisher's lesson: nanostructure creates color")
print("without chemistry. The textile industry produces 20%")
print("of global water pollution from dye processing.")
print("Structural color could eliminate this entirely.")`,
      challenge: 'Design a food freshness indicator: a photonic crystal that changes from green (fresh) to yellow (caution) to red (spoiled) as ammonia concentration increases. What base spacing and swelling rate would you need?',
      successHint: 'From the kingfisher\'s feather to humidity sensors, solar cells, and pollution-free textiles — nanophotonics is transforming how we create and use color. The physics that makes a bird beautiful is the same physics that could make industry sustainable.',
    },
    {
      title: 'Fabricating nanostructures — building at the atomic scale',
      concept: `Creating structures at the 100-300nm scale (the range needed for structural color) requires specialized techniques:

**Top-down methods** (carve nanostructures from bulk material):
- **Electron beam lithography**: a focused electron beam "writes" patterns in a resist layer with ~10nm resolution. Slow and expensive, but extremely precise.
- **Nanoimprint lithography**: press a mold into soft material, like a nano-stamp. Faster than e-beam, scalable.
- **Laser interference lithography**: two laser beams create an interference pattern that exposes a resist in periodic stripes. Good for 1D/2D periodic structures.

**Bottom-up methods** (build structures from atomic/molecular components):
- **Self-assembly**: colloidal nanoparticles (silica or polystyrene spheres, ~200nm) naturally pack into face-centered cubic crystals. This creates 3D photonic crystals. The opal gemstone is a natural example.
- **Block copolymer assembly**: two incompatible polymers linked together spontaneously form periodic nanostructures.
- **Bio-templating**: use biological structures (butterfly wings, diatom shells) as templates for synthetic materials.

The grand challenge: achieving the precision of top-down methods with the speed and cost of bottom-up methods.`,
      analogy: 'Fabricating nanostructures is like building with LEGO at a scale where each brick is 1/1000th the width of a human hair. Top-down is like carving a sculpture from a block of stone — precise but slow. Bottom-up is like scattering LEGO bricks and hoping they self-assemble — fast but less controllable. The future is combining both: self-assembly guided by templates.',
      storyConnection: 'The kingfisher builds its photonic nanostructure through biological self-assembly — proteins guide melanin granules into a quasi-periodic arrangement inside each feather barb. The bird doesn\'t need a clean room or an electron beam. Evolution found a way to fabricate photonic crystals using only proteins and pigments at body temperature. That\'s the ultimate manufacturing challenge for humans: nature-like fabrication.',
      checkQuestion: 'Opal gemstones are natural photonic crystals — self-assembled silica spheres ~150-300nm in diameter. What determines opal\'s color?',
      checkAnswer: 'The sphere diameter. Smaller spheres (150nm) → blue opal. Larger spheres (300nm) → red opal. The spheres pack into a face-centered cubic crystal, creating a photonic bandgap at a wavelength proportional to the sphere diameter. The play of colors (fire) comes from different crystal orientations exposing different lattice spacings to the viewer.',
      codeIntro: 'Simulate self-assembly of colloidal spheres into a photonic crystal.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 7))
fig.patch.set_facecolor('#1f2937')

# 1. Self-assembled colloidal crystal (2D cross-section)
ax1.set_facecolor('#111827')
sphere_d = 200  # nm diameter
r = sphere_d / 2

# Hexagonal close-packed arrangement
rows = 12
cols = 12
colors_sphere = []

for row in range(rows):
    for col in range(cols):
        x = col * sphere_d + (r if row % 2 else 0)
        y = row * sphere_d * np.sqrt(3) / 2

        # Add slight random displacement (real crystals aren't perfect)
        x += np.random.normal(0, 3)
        y += np.random.normal(0, 3)

        # Color based on local spacing
        circle = plt.Circle((x, y), r * 0.95, facecolor='#3b82f6', alpha=0.3,
                            edgecolor='#60a5fa', linewidth=0.5)
        ax1.add_patch(circle)

# Show lattice spacing
ax1.annotate('', xy=(sphere_d, 0), xytext=(0, 0),
             arrowprops=dict(arrowstyle='<->', color='#f59e0b', lw=2))
ax1.text(r, -50, f'd = {sphere_d}nm', ha='center', color='#f59e0b', fontsize=10)

# Light paths
ax1.annotate('', xy=(400, -80), xytext=(200, 200),
             arrowprops=dict(arrowstyle='->', color='white', lw=1.5))
ax1.annotate('', xy=(600, 200), xytext=(400, -80),
             arrowprops=dict(arrowstyle='->', color='#22c55e', lw=2))

ax1.set_xlim(-100, cols * sphere_d + 100)
ax1.set_ylim(-150, rows * sphere_d * np.sqrt(3) / 2)
ax1.set_title('Self-Assembled Colloidal Crystal (2D)', color='white', fontsize=12)
ax1.set_xlabel('nm', color='white')
ax1.set_ylabel('nm', color='white')
ax1.set_aspect('equal')
ax1.tick_params(colors='gray')

# 2. Reflected color vs sphere diameter
ax2.set_facecolor('#111827')
diameters = np.linspace(120, 350, 200)
# Bragg reflection: λ = 2 * d * n_eff * sin(60°) for FCC (111) plane
# n_eff ≈ 1.35 for silica spheres in air (74% packing)
n_eff = 1.35
peak_wavelengths = 2 * diameters * n_eff * np.sin(np.radians(60)) * 0.8  # correction factor

# Color each point by its reflected wavelength
for i in range(len(diameters) - 1):
    wl = peak_wavelengths[i]
    if 380 <= wl <= 750:
        color_val = (wl - 380) / (750 - 380)
        color = plt.cm.rainbow(color_val)
    else:
        color = '#4b5563'
    ax2.bar(diameters[i], peak_wavelengths[i], width=diameters[1]-diameters[0],
            color=color, alpha=0.8)

ax2.axhline(380, color='#a855f7', linestyle=':', alpha=0.3)
ax2.axhline(750, color='#ef4444', linestyle=':', alpha=0.3)
ax2.text(355, 390, 'Violet', color='#a855f7', fontsize=8)
ax2.text(355, 740, 'Red', color='#ef4444', fontsize=8)

# Mark specific opals
ax2.annotate('Blue opal\
(d≈180nm)', xy=(180, 2*180*n_eff*np.sin(np.radians(60))*0.8),
             xytext=(200, 600), color='#3b82f6', fontsize=9,
             arrowprops=dict(arrowstyle='->', color='#3b82f6'))
ax2.annotate('Red opal\
(d≈280nm)', xy=(280, 2*280*n_eff*np.sin(np.radians(60))*0.8),
             xytext=(300, 700), color='#ef4444', fontsize=9,
             arrowprops=dict(arrowstyle='->', color='#ef4444'))

ax2.set_xlabel('Sphere diameter (nm)', color='white')
ax2.set_ylabel('Peak reflected wavelength (nm)', color='white')
ax2.set_title('Opal Color vs Sphere Size', color='white', fontsize=12)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Nanostructure fabrication methods:")
print("  Top-down: e-beam lithography (10nm precision, slow, expensive)")
print("  Bottom-up: colloidal self-assembly (fast, cheap, less precise)")
print("  Hybrid: template-guided self-assembly (best of both)")
print()
print("Natural examples of self-assembled photonic crystals:")
print("  Opal: silica spheres (precious gemstone)")
print("  Morpho butterfly: ridged nanostructures on wing scales")
print("  Kingfisher: melanin/air spongy structure in feather barbs")
print("  Peacock: melanin rod lattice in feather barbules")`,
      challenge: 'Opals form over millions of years as silica spheres slowly settle and pack. In the lab, you can speed this up with centrifugation or evaporation-driven assembly. If you want spheres to pack in 1 hour instead of 1 million years, what acceleration factor do you need? What centrifuge speed achieves this?',
      successHint: 'Nanofabrication is where physics meets engineering at the smallest possible scale. The techniques developed to copy nature\'s structural colors are now enabling quantum computing, advanced sensors, and ultra-efficient solar cells. The kingfisher didn\'t know it was pioneering nanophotonics — but it was.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Nanophotonics — some physics and math experience helpful</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for nanophotonics simulations. Click to start.</p>
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