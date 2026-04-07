import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function RainbowFishLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Project Design: Fish Scale Iridescence Simulator',
      concept: `Our capstone builds a complete iridescence simulator that predicts the reflected color of a fish scale given its physical structure. This is real optics engineering: the same physics is used to design anti-reflective camera coatings, banknote security features, and structural-color fabrics.

The core problem: a fish scale contains stacks of guanine crystal platelets, each about 5-20 nm thick, separated by cytoplasm gaps. When white sunlight hits these stacks, each interface reflects a tiny fraction of light. The reflected waves from different layers travel different distances, so they arrive at your eye with different phases. At certain wavelengths, the waves add up (constructive interference) and you see a bright color. At other wavelengths, they cancel (destructive interference) and you see nothing. The result is a vivid, angle-dependent color produced entirely by structure, not pigment.

Our simulator pipeline has four stages. **Stage 1**: Compute single-film reflectance using the Fresnel equations and thin-film interference formula. **Stage 2**: Convert a reflectance spectrum into a visible RGB color using the CIE color-matching functions. **Stage 3**: Extend the model from a single film to a multi-layer guanine-cytoplasm stack using the transfer-matrix method. **Stage 4**: Sweep viewing angle to show how the color shifts, exactly as Daphisha saw Ka Ri Bneng change color depending on how she looked at the fish. Each lesson builds one stage.`,
      analogy: 'Designing this simulator is like planning a recipe before cooking. You do not start by throwing ingredients in a pan. You identify the dish (iridescent color), list the ingredients (refractive indices, layer thicknesses, viewing angle), write the recipe steps (Fresnel equations, interference, CIE conversion), and plan the plating (visualization). Each later lesson cooks one course of the meal.',
      storyConnection: 'Daphisha saw Ka Ri Bneng shimmer gold one day, violet the next, white the third. Her grandmother said "the fish has every colour in her scales, all the time. What changes is which colour your eyes choose to see." The physics is even more beautiful than the story: the fish really does have every color encoded in its structure, and the color that reaches your eye genuinely changes with viewing angle. Our simulator will prove this quantitatively.',
      checkQuestion: 'Why does thin-film interference produce different colors at different viewing angles, while a red pigment looks red from every angle?',
      checkAnswer: 'Thin-film interference depends on the path length difference between light reflected from the top and bottom surfaces of the film. When you change the viewing angle, the path length through the film changes (longer at steep angles, shorter at normal incidence). This shifts which wavelength gets constructive interference. A pigment, by contrast, absorbs specific wavelengths chemically regardless of the geometry, so its color is angle-independent.',
      codeIntro: 'Define the physical parameters of a fish scale, generate the visible light spectrum, and inspect the building blocks of our simulator.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# === PHYSICAL CONSTANTS ===
# Visible light wavelengths in nanometers
wavelengths = np.linspace(380, 700, 300)

# Refractive indices of materials in a fish scale
N_WATER = 1.333        # water above the scale
N_GUANINE = 1.83       # guanine crystal platelet
N_CYTOPLASM = 1.37     # cytoplasm between platelets

# Typical layer thicknesses in nanometers
GUANINE_THICKNESS = 80    # nm — single guanine platelet
CYTOPLASM_THICKNESS = 120  # nm — gap between platelets

# === WHAT COLORS DOES EACH WAVELENGTH CORRESPOND TO? ===
def wavelength_to_rgb(wl):
    """Approximate RGB for a single wavelength (for plotting)."""
    if 380 <= wl < 440:
        r, g, b = -(wl-440)/(440-380), 0.0, 1.0
    elif 440 <= wl < 490:
        r, g, b = 0.0, (wl-440)/(490-440), 1.0
    elif 490 <= wl < 510:
        r, g, b = 0.0, 1.0, -(wl-510)/(510-490)
    elif 510 <= wl < 580:
        r, g, b = (wl-510)/(580-510), 1.0, 0.0
    elif 580 <= wl < 645:
        r, g, b = 1.0, -(wl-645)/(645-580), 0.0
    elif 645 <= wl <= 700:
        r, g, b = 1.0, 0.0, 0.0
    else:
        r, g, b = 0, 0, 0
    return (r, g, b)

# === FRESNEL REFLECTION AT A SINGLE INTERFACE ===
def fresnel_normal(n1, n2):
    """Reflectance at normal incidence (angle = 0)."""
    return ((n1 - n2) / (n1 + n2)) ** 2

# Show reflectance at each interface in the fish scale
interfaces = [
    ('Water -> Guanine', N_WATER, N_GUANINE),
    ('Guanine -> Cytoplasm', N_GUANINE, N_CYTOPLASM),
    ('Cytoplasm -> Guanine', N_CYTOPLASM, N_GUANINE),
]

print("FISH SCALE INTERFACE REFLECTANCES")
print("=" * 50)
for name, n1, n2 in interfaces:
    R = fresnel_normal(n1, n2)
    print(f"  {name:<28} R = {R:.4f} ({R*100:.2f}%)")
print()
print("Each interface reflects only 2-4% of light.")
print("But with 5-20 layers, the reflections ADD UP")
print("through constructive interference!")

# === VISUALIZE THE BUILDING BLOCKS ===
fig, axes = plt.subplots(1, 3, figsize=(14, 4.5))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Fish Scale Iridescence — Building Blocks',
             color='white', fontsize=13, fontweight='bold')

# Panel 1: Visible spectrum
ax = axes[0]
ax.set_facecolor('#111827')
for i, wl in enumerate(wavelengths):
    ax.axvline(wl, color=wavelength_to_rgb(wl), alpha=0.8, linewidth=1.2)
ax.set_xlabel('Wavelength (nm)', color='white', fontsize=10)
ax.set_title('Visible Light Spectrum', color='white', fontsize=11)
ax.set_yticks([])
ax.tick_params(colors='gray')

# Panel 2: Refractive index profile through scale layers
ax2 = axes[1]
ax2.set_facecolor('#111827')
z_pos = 0
colors_layer = ['#3b82f6', '#f59e0b', '#22c55e']
labels = ['Water', 'Guanine', 'Cytoplasm']
n_vals = [N_WATER, N_GUANINE, N_CYTOPLASM]
widths = [50, GUANINE_THICKNESS, CYTOPLASM_THICKNESS]
for i in range(7):
    idx = 0 if i == 0 else (1 if i % 2 == 1 else 2)
    w = widths[idx]
    ax2.barh(0, w, left=z_pos, height=0.6,
             color=colors_layer[idx], alpha=0.7,
             label=labels[idx] if i < 3 else '')
    ax2.text(z_pos + w/2, 0, f'n={n_vals[idx]}',
             ha='center', va='center', color='white', fontsize=10)
    z_pos += w
ax2.set_xlabel('Depth into scale (nm)', color='white', fontsize=10)
ax2.set_title('Layer Structure (side view)', color='white', fontsize=11)
ax2.legend(fontsize=10, facecolor='#1f2937', edgecolor='gray',
           labelcolor='white', loc='upper right')
ax2.set_yticks([])
ax2.tick_params(colors='gray')

# Panel 3: Fresnel reflectance vs refractive index ratio
ax3 = axes[2]
ax3.set_facecolor('#111827')
ratios = np.linspace(1.0, 2.5, 200)
R_fresnel = ((1 - ratios) / (1 + ratios)) ** 2
ax3.plot(ratios, R_fresnel * 100, color='#a855f7', linewidth=2.5)
# Mark our specific interfaces
for name, n1, n2 in interfaces:
    ratio = n2 / n1
    R = fresnel_normal(n1, n2)
    ax3.plot(ratio, R * 100, 'o', color='#f59e0b', markersize=8, zorder=5)
    ax3.annotate(name.split('->')[1].strip(), (ratio, R*100),
                 textcoords='offset points', xytext=(5, 8),
                 color='#f59e0b', fontsize=10)
ax3.set_xlabel('Refractive index ratio (n2/n1)', color='white', fontsize=10)
ax3.set_ylabel('Reflectance (%)', color='white', fontsize=10)
ax3.set_title('Fresnel Reflectance', color='white', fontsize=11)
ax3.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print()
print("Pipeline stage 1 complete: physical parameters defined.")
print(f"Spectrum: {len(wavelengths)} wavelengths, {wavelengths[0]:.0f}-{wavelengths[-1]:.0f} nm")
print(f"Guanine platelet: {GUANINE_THICKNESS} nm thick, n = {N_GUANINE}")
print(f"Next: build the thin-film interference engine.")`,
      challenge: 'Research the refractive index of chitin (butterfly wings) and keratin (peacock feathers). Add them to the interface table and compare their Fresnel reflectances to guanine. Which material creates the strongest single-interface reflection?',
      successHint: 'You have defined the complete physical setup: refractive indices, layer thicknesses, and Fresnel reflectances at each interface. A single guanine-water interface reflects only about 3% of light, but stacking multiple layers will multiply this through constructive interference, which is what the next lesson builds.',
    },
    {
      title: 'Thin-Film Reflectance Engine',
      concept: `Now we build the core physics: computing how much light a single thin film reflects at each wavelength. This is where iridescence is born.

When light hits a thin film (like one guanine platelet), some reflects off the top surface and some enters the film, bounces off the bottom surface, and exits through the top. These two reflected beams travel different distances. The extra distance the second beam travels is called the **optical path difference**: OPD = 2 * n * d * cos(theta), where n is the refractive index of the film, d is the film thickness, and theta is the angle of refraction inside the film.

If the OPD equals a whole number of wavelengths (OPD = m * lambda), the two beams arrive in phase and add up: **constructive interference**. If it equals a half-number of wavelengths (OPD = (m + 0.5) * lambda), they cancel: **destructive interference**. The result is that certain wavelengths reflect strongly and others do not, producing color.

The complete reflectance formula for a thin film with interfaces at the top (n1 to n_film) and bottom (n_film to n_substrate) is: R = (r1 + r2 * exp(i * delta))^2 / (1 + r1 * r2 * exp(i * delta))^2, where r1 and r2 are the Fresnel amplitude reflection coefficients and delta = 4 * pi * n_film * d * cos(theta) / lambda is the phase difference. This is the **Airy formula** and it accounts for multiple internal reflections, not just the first two beams.`,
      analogy: 'Think of two people clapping in a hallway. If they clap at exactly the same time (in phase), the sound is twice as loud. If one claps while the other is pulling their hands apart (out of phase), the sounds partially cancel and it is quieter. The thin film is the hallway: it sets the timing delay between the two "claps" of reflected light. Change the hallway length (film thickness) or the clapping speed (wavelength), and you change whether the result is loud (bright color) or quiet (no color).',
      storyConnection: 'Ka Ri Bneng has guanine platelets roughly 80 nm thick with refractive index 1.83. At normal incidence, the path difference is 2 * 1.83 * 80 = 293 nm. The wavelength closest to 293 nm in the visible range is deep violet-blue. But at a steeper viewing angle, the effective thickness increases, shifting the peak toward green or gold. This single equation explains why the fish "changes color" when Daphisha looks from different positions.',
      checkQuestion: 'A guanine platelet is 100 nm thick (n = 1.83). At normal incidence, what wavelength gets the strongest first-order constructive interference? What color is that?',
      checkAnswer: 'The optical path difference is 2 * 1.83 * 100 = 366 nm. For first-order constructive interference (m = 1), the reflected wavelength is 366 nm, which is in the ultraviolet, just below the visible range. So this particular thickness would NOT produce a strong visible color at normal incidence. The second-order peak would be at 366/2 = 183 nm, even farther into UV. To get a visible color (say green at 550 nm), you would need d = 550 / (2 * 1.83) = 150 nm.',
      codeIntro: 'Implement the Airy thin-film reflectance formula and compute the reflectance spectrum for a single guanine platelet.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

wavelengths = np.linspace(380, 700, 300)  # nm

# Refractive indices
N_WATER = 1.333
N_GUANINE = 1.83
N_CYTOPLASM = 1.37

def fresnel_r(n1, n2, theta1_rad):
    """Fresnel amplitude reflection coefficient (s-polarization).
    Returns complex r for the interface n1 -> n2."""
    # Snell's law: n1 * sin(theta1) = n2 * sin(theta2)
    sin_t2 = n1 / n2 * np.sin(theta1_rad)
    # Handle total internal reflection
    if np.any(np.abs(sin_t2) > 1):
        return 1.0  # total internal reflection
    cos_t1 = np.cos(theta1_rad)
    cos_t2 = np.sqrt(1 - sin_t2**2)
    # s-polarization (TE) Fresnel coefficient
    rs = (n1 * cos_t1 - n2 * cos_t2) / (n1 * cos_t1 + n2 * cos_t2)
    return rs

def thin_film_reflectance(wavelengths_nm, n_above, n_film, n_below,
                          thickness_nm, angle_deg=0):
    """Reflectance spectrum of a single thin film (Airy formula).

    Args:
        wavelengths_nm: array of wavelengths in nm
        n_above: refractive index above the film
        n_film: refractive index of the film
        n_below: refractive index below the film
        thickness_nm: film thickness in nm
        angle_deg: incidence angle in degrees

    Returns:
        Reflectance array (0 to 1) for each wavelength
    """
    theta0 = np.radians(angle_deg)

    # Snell's law: angle inside the film
    sin_theta_film = n_above / n_film * np.sin(theta0)
    cos_theta_film = np.sqrt(1 - sin_theta_film**2)

    # Fresnel amplitude coefficients at each interface
    r1 = fresnel_r(n_above, n_film, theta0)
    # Angle at bottom interface
    theta_film = np.arcsin(sin_theta_film)
    r2 = fresnel_r(n_film, n_below, theta_film)

    # Phase difference for round trip through the film
    # delta = 4 * pi * n_film * d * cos(theta_film) / lambda
    delta = 4 * np.pi * n_film * thickness_nm * cos_theta_film / wavelengths_nm

    # Airy formula: accounts for all multiple reflections
    numerator = r1**2 + r2**2 + 2*r1*r2*np.cos(delta)
    denominator = 1 + (r1*r2)**2 + 2*r1*r2*np.cos(delta)
    R = numerator / denominator

    return np.clip(R, 0, 1)

# === COMPUTE REFLECTANCE FOR DIFFERENT THICKNESSES ===
thicknesses = [60, 80, 100, 120, 150]
colors = ['#a855f7', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444']

fig, axes = plt.subplots(1, 2, figsize=(14, 5.5))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Single Guanine Platelet: Thin-Film Reflectance',
             color='white', fontsize=13, fontweight='bold')

# Panel 1: Reflectance spectra for different thicknesses
ax = axes[0]
ax.set_facecolor('#111827')
for d, clr in zip(thicknesses, colors):
    R = thin_film_reflectance(wavelengths, N_WATER, N_GUANINE,
                              N_CYTOPLASM, d, angle_deg=0)
    peak_wl = wavelengths[np.argmax(R)]
    ax.plot(wavelengths, R * 100, color=clr, linewidth=2,
            label=f'd={d} nm (peak {peak_wl:.0f} nm)')

ax.set_xlabel('Wavelength (nm)', color='white', fontsize=10)
ax.set_ylabel('Reflectance (%)', color='white', fontsize=10)
ax.set_title('Thickness Controls Color', color='white', fontsize=11)
ax.legend(fontsize=10, facecolor='#1f2937', edgecolor='gray',
          labelcolor='white')
ax.tick_params(colors='gray')

# Panel 2: Peak wavelength vs thickness (design chart)
ax2 = axes[1]
ax2.set_facecolor('#111827')
d_range = np.linspace(40, 200, 200)
peak_wavelengths = []
for d in d_range:
    R = thin_film_reflectance(wavelengths, N_WATER, N_GUANINE,
                              N_CYTOPLASM, d, angle_deg=0)
    peak_wavelengths.append(wavelengths[np.argmax(R)])
peak_wavelengths = np.array(peak_wavelengths)

# Color the line by the peak wavelength
def wl_to_rgb(wl):
    if 380 <= wl < 440: return (0.5, 0.0, 1.0)
    elif 440 <= wl < 490: return (0.0, 0.3, 1.0)
    elif 490 <= wl < 510: return (0.0, 1.0, 0.5)
    elif 510 <= wl < 580: return (0.3, 1.0, 0.0)
    elif 580 <= wl < 645: return (1.0, 0.7, 0.0)
    elif 645 <= wl <= 700: return (1.0, 0.0, 0.0)
    return (0.5, 0.5, 0.5)

for i in range(len(d_range) - 1):
    ax2.plot(d_range[i:i+2], peak_wavelengths[i:i+2],
             color=wl_to_rgb(peak_wavelengths[i]), linewidth=3)

ax2.set_xlabel('Guanine thickness (nm)', color='white', fontsize=10)
ax2.set_ylabel('Peak reflected wavelength (nm)', color='white', fontsize=10)
ax2.set_title('Design Chart: Thickness -> Color', color='white', fontsize=11)
ax2.axhline(480, color='gray', linestyle=':', alpha=0.4)
ax2.text(45, 484, 'Blue', color='#3b82f6', fontsize=10)
ax2.axhline(550, color='gray', linestyle=':', alpha=0.4)
ax2.text(45, 554, 'Green', color='#22c55e', fontsize=10)
ax2.axhline(620, color='gray', linestyle=':', alpha=0.4)
ax2.text(45, 624, 'Red', color='#ef4444', fontsize=10)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

# Numerical report
print("THIN-FILM REFLECTANCE REPORT")
print("=" * 55)
for d, clr in zip(thicknesses, colors):
    R = thin_film_reflectance(wavelengths, N_WATER, N_GUANINE,
                              N_CYTOPLASM, d, angle_deg=0)
    peak_idx = np.argmax(R)
    print(f"  d = {d:>3d} nm  ->  peak at {wavelengths[peak_idx]:.0f} nm"
          f"  (R = {R[peak_idx]*100:.1f}%)")
print()
print("A single platelet reflects only 5-8% at peak.")
print("Next: convert these spectra into visible RGB colors.")`,
      challenge: 'Add a third panel showing reflectance spectra at a fixed thickness (80 nm) but three different incidence angles: 0, 30, and 60 degrees. How does the peak wavelength shift with angle? This is the origin of iridescence.',
      successHint: 'The thin-film engine computes reflectance at every visible wavelength using the Airy formula. A single guanine platelet only reflects 5-8% of light at its peak wavelength, which is why you need multiple layers to get a vivid color. The design chart shows the direct relationship between platelet thickness and reflected color.',
    },
    {
      title: 'Spectral-to-Color Pipeline',
      concept: `A reflectance spectrum is a list of numbers: "12% at 450 nm, 8% at 500 nm, 3% at 600 nm." But your eye does not see numbers. It sees color. To convert a spectrum into a color your monitor can display, we need the **CIE color matching functions** and the **sRGB color space**.

The human eye has three types of cone cells. The CIE 1931 standard defines three functions, x-bar(lambda), y-bar(lambda), and z-bar(lambda), that approximate how these cones respond to each wavelength. To convert a spectrum S(lambda) into a color, you integrate: X = integral of S(lambda) * x-bar(lambda), and similarly for Y and Z. These XYZ tristimulus values are a device-independent description of the color.

To display the color on a screen, you convert XYZ to sRGB using a 3x3 matrix multiplication, then apply gamma correction. The matrix encodes the specific red, green, and blue phosphors your monitor uses. Gamma correction accounts for the nonlinear relationship between the voltage sent to a pixel and the brightness your eye perceives. The formula is: if linear value <= 0.0031308, sRGB = 12.92 * linear, else sRGB = 1.055 * linear^(1/2.4) - 0.055.

This pipeline is used everywhere: cameras converting sensor data to JPEG, TV broadcast encoding, scientific visualization, and our fish scale simulator.`,
      analogy: 'The spectrum-to-color pipeline is like translating a book from one language to another. The spectrum is the original text (in "physics language"). The CIE functions are the dictionary (mapping each wavelength-word to cone-cell responses). The XYZ values are the intermediate translation. The sRGB conversion is the final typesetting into a format the reader (your screen) can display. Each step loses a little nuance, but the result is faithful enough to be useful.',
      storyConnection: 'Daphisha saw "gold," "violet," and "white." Her eyes performed exactly this conversion: the reflected spectrum from Ka Ri Bneng entered her cone cells, which responded according to functions very close to our CIE x-bar, y-bar, z-bar. Her brain integrated those responses and produced a perceived color. Our code replicates her visual system in 30 lines of Python.',
      checkQuestion: 'A spectrum has equal reflectance at all visible wavelengths (a "flat" spectrum). What color does it appear? What if reflectance is high only at 450 nm and 620 nm simultaneously?',
      checkAnswer: 'A flat spectrum reflects all wavelengths equally, which is the definition of white (or gray if the overall level is low). A spectrum with peaks at 450 nm (blue) and 620 nm (red) simultaneously would appear purple/magenta. Your eye has no single cone type for purple. Instead, the brain interprets simultaneous activation of the blue-sensitive (S) and red-sensitive (L) cones as purple, a color that does not exist as a single wavelength.',
      codeIntro: 'Build the CIE color matching functions and the full spectrum-to-RGB conversion, then visualize the colors produced by different fish scale thicknesses.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

wavelengths = np.linspace(380, 700, 300)

# === CIE 1931 COLOR MATCHING FUNCTIONS ===
# (Wyman et al. analytical approximation)
def cie_xbar(lam):
    t1 = (lam - 442.0) * (0.0624 if lam < 442 else 0.0374)
    t2 = (lam - 599.8) * (0.0264 if lam < 599.8 else 0.0323)
    t3 = (lam - 474.0) * (0.0264 if lam < 474 else 0.0323)
    return max(0.362*np.exp(-0.5*t1**2) +
               1.056*np.exp(-0.5*t2**2) -
               0.065*np.exp(-0.5*t3**2), 0)

def cie_ybar(lam):
    t1 = (lam - 568.8) * (0.0213 if lam < 568.8 else 0.0247)
    t2 = (lam - 530.9) * (0.0613 if lam < 530.9 else 0.0322)
    return max(0.821*np.exp(-0.5*t1**2) +
               0.286*np.exp(-0.5*t2**2), 0)

def cie_zbar(lam):
    t1 = (lam - 437.0) * (0.0845 if lam < 437 else 0.0278)
    t2 = (lam - 459.0) * (0.0385 if lam < 459 else 0.0725)
    return max(1.217*np.exp(-0.5*t1**2) +
               0.681*np.exp(-0.5*t2**2), 0)

# Precompute for all wavelengths
cx = np.array([cie_xbar(w) for w in wavelengths])
cy = np.array([cie_ybar(w) for w in wavelengths])
cz = np.array([cie_zbar(w) for w in wavelengths])

def spectrum_to_rgb(spectrum):
    """Convert a reflectance spectrum to sRGB color.

    Args:
        spectrum: array of reflectance values (0-1) at each wavelength

    Returns:
        RGB array, each channel 0-1
    """
    dl = wavelengths[1] - wavelengths[0]
    X = np.sum(spectrum * cx) * dl
    Y = np.sum(spectrum * cy) * dl
    Z = np.sum(spectrum * cz) * dl

    # Normalize by luminance
    norm = max(X + Y + Z, 1e-10)
    X, Y, Z = X / norm, Y / norm, Z / norm

    # XYZ to linear sRGB (D65 illuminant)
    r_lin = 3.2406*X - 1.5372*Y - 0.4986*Z
    g_lin = -0.9689*X + 1.8758*Y + 0.0415*Z
    b_lin = 0.0557*X - 0.2040*Y + 1.0570*Z

    # Gamma correction
    def gamma(c):
        c = max(c, 0)
        return 12.92*c if c <= 0.0031308 else 1.055*c**(1/2.4) - 0.055

    return np.clip([gamma(r_lin), gamma(g_lin), gamma(b_lin)], 0, 1)

# === THIN-FILM ENGINE (from Lesson 2) ===
def thin_film_R(wl, n_above, n_film, n_below, d, angle_deg=0):
    theta0 = np.radians(angle_deg)
    sin_tf = n_above / n_film * np.sin(theta0)
    cos_tf = np.sqrt(1 - sin_tf**2)
    cos_t0 = np.cos(theta0)
    theta_f = np.arcsin(sin_tf) if sin_tf < 1 else np.pi/2
    cos_tb = np.cos(theta_f)
    r1 = (n_above*cos_t0 - n_film*cos_tf) / (n_above*cos_t0 + n_film*cos_tf)
    r2 = (n_film*cos_tb - n_below*np.sqrt(1 - (n_film/n_below*sin_tf)**2)) / \
         (n_film*cos_tb + n_below*np.sqrt(1 - (n_film/n_below*sin_tf)**2))
    delta = 4*np.pi*n_film*d*cos_tf / wl
    num = r1**2 + r2**2 + 2*r1*r2*np.cos(delta)
    den = 1 + (r1*r2)**2 + 2*r1*r2*np.cos(delta)
    return np.clip(num / den, 0, 1)

# === CONVERT FISH SCALE SPECTRA TO VISIBLE COLORS ===
N_WATER, N_GUANINE, N_CYTOPLASM = 1.333, 1.83, 1.37
thicknesses = np.arange(50, 180, 5)

fig, axes = plt.subplots(1, 3, figsize=(14, 5))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Spectrum-to-Color Pipeline: Fish Scale Colors',
             color='white', fontsize=13, fontweight='bold')

# Panel 1: CIE color matching functions
ax = axes[0]
ax.set_facecolor('#111827')
ax.plot(wavelengths, cx, color='#ef4444', linewidth=2, label='x-bar (red)')
ax.plot(wavelengths, cy, color='#22c55e', linewidth=2, label='y-bar (green)')
ax.plot(wavelengths, cz, color='#3b82f6', linewidth=2, label='z-bar (blue)')
ax.set_xlabel('Wavelength (nm)', color='white', fontsize=10)
ax.set_ylabel('Response', color='white', fontsize=10)
ax.set_title('CIE 1931 Color Matching', color='white', fontsize=11)
ax.legend(fontsize=10, facecolor='#1f2937', edgecolor='gray',
          labelcolor='white')
ax.tick_params(colors='gray')

# Panel 2: Color bar — thickness to perceived color
ax2 = axes[1]
ax2.set_facecolor('#111827')
color_bar = []
for d in thicknesses:
    R = thin_film_R(wavelengths, N_WATER, N_GUANINE, N_CYTOPLASM, d)
    rgb = spectrum_to_rgb(R)
    color_bar.append(rgb)
    ax2.barh(d, 1, height=5, color=rgb, edgecolor='none')

ax2.set_ylabel('Guanine thickness (nm)', color='white', fontsize=10)
ax2.set_title('Perceived Color vs Thickness', color='white', fontsize=11)
ax2.set_xticks([])
ax2.tick_params(colors='gray')

# Panel 3: Three example spectra with their RGB colors
ax3 = axes[2]
ax3.set_facecolor('#111827')
examples = [(70, '#a855f7'), (100, '#22c55e'), (140, '#ef4444')]
for d, fallback in examples:
    R = thin_film_R(wavelengths, N_WATER, N_GUANINE, N_CYTOPLASM, d)
    rgb = spectrum_to_rgb(R)
    hex_c = '#{:02x}{:02x}{:02x}'.format(
        int(rgb[0]*255), int(rgb[1]*255), int(rgb[2]*255))
    ax3.plot(wavelengths, R * 100, linewidth=2, color=rgb,
             label=f'{d} nm -> {hex_c}')
    ax3.fill_between(wavelengths, R * 100, alpha=0.15, color=rgb)

ax3.set_xlabel('Wavelength (nm)', color='white', fontsize=10)
ax3.set_ylabel('Reflectance (%)', color='white', fontsize=10)
ax3.set_title('Spectra Colored by Perceived Hue', color='white', fontsize=11)
ax3.legend(fontsize=10, facecolor='#1f2937', edgecolor='gray',
           labelcolor='white')
ax3.tick_params(colors='gray')

plt.tight_layout()
plt.show()

# Report
print("SPECTRUM-TO-COLOR CONVERSION RESULTS")
print("=" * 55)
print(f"{'Thickness':>10}  {'Peak (nm)':>10}  {'RGB':>20}  {'Hex':>10}")
print("-" * 55)
for d in [60, 80, 100, 120, 140, 160]:
    R = thin_film_R(wavelengths, N_WATER, N_GUANINE, N_CYTOPLASM, d)
    rgb = spectrum_to_rgb(R)
    peak = wavelengths[np.argmax(R)]
    hex_c = '#{:02x}{:02x}{:02x}'.format(
        int(rgb[0]*255), int(rgb[1]*255), int(rgb[2]*255))
    print(f"  {d:>6d} nm   {peak:>7.0f} nm   ({rgb[0]:.2f}, {rgb[1]:.2f}, {rgb[2]:.2f})   {hex_c}")

print()
print("The pipeline works: spectrum -> CIE XYZ -> sRGB -> hex color.")
print("Next: stack multiple layers for realistic fish scale brilliance.")`,
      challenge: 'Multiply the reflectance spectrum by a solar illumination spectrum (Planck blackbody at 5778 K) before converting to RGB. How does the color change when the fish is lit by sunlight versus a flat white light? This matters because underwater light is filtered by the water above.',
      successHint: 'You now have a complete spectrum-to-color pipeline. The color bar shows the full rainbow of colors a fish scale can produce just by varying platelet thickness from 50 to 175 nm. Combined with the thin-film engine from Lesson 2, you can predict the color of any single-layer iridescent structure.',
    },
    {
      title: 'Multi-Layer Stack Model',
      concept: `A single guanine platelet reflects only 5-8% of light at its peak wavelength. Real fish scales have 5 to 20 layers of alternating guanine and cytoplasm. These layers act as a **distributed Bragg reflector**: each layer reflects a small amount, and when the reflections from all layers add constructively, the total reflectance can exceed 80%. This is how fish achieve their brilliant, mirror-like iridescence.

The **transfer matrix method** handles multi-layer stacks elegantly. Each layer is described by a 2x2 matrix that encodes how it transforms the forward-going and backward-going light waves. For a single layer of thickness d and refractive index n, the matrix is:

M = [[cos(phi), -i*sin(phi)/eta], [-i*eta*sin(phi), cos(phi)]]

where phi = 2*pi*n*d*cos(theta)/lambda is the phase accumulated in the layer and eta = n*cos(theta) is the effective admittance. To get the total system response, you multiply the matrices of all layers together, then extract the overall reflectance from the product matrix.

The beauty of this method is that adding more layers is just more matrix multiplication. Five layers? Multiply five matrices. Twenty layers? Multiply twenty. The physics of constructive and destructive interference across all layers is captured automatically.`,
      analogy: 'Imagine 10 people standing in a line, each holding a partly reflective pane of glass. If you shine a flashlight at the first person, each pane reflects a little light back and transmits the rest forward. With random spacing, the reflected beams arrive at random times and mostly cancel out. But if you space the panes precisely so every reflected beam arrives in step, they combine into a bright flash. The transfer matrix method computes the timing of every reflection and transmission through the entire line at once.',
      storyConnection: 'Ka Ri Bneng was described as having scales "made of captured rainbows." The multi-layer stack is the physics behind that poetry. Each guanine-cytoplasm bilayer captures a narrow band of the rainbow and reflects it back. With enough layers, the fish captures almost all the light in that band, producing a brilliance that no pigment can match. The number of layers determines whether the fish looks subtly shimmery (5 layers) or blazingly metallic (20 layers).',
      checkQuestion: 'If you double the number of guanine-cytoplasm layers from 5 to 10, does the peak reflectance double?',
      checkAnswer: 'No. Reflectance does not increase linearly with layer count. With 5 layers, peak reflectance might be 40%. With 10 layers, it might reach 85%. With 20 layers, it approaches 95%. The relationship is nonlinear because each additional layer adds less marginal reflectance as the stack approaches perfect reflection. It follows roughly R ~ 1 - (1-r)^(2N) where r is the single-interface reflectance and N is the number of bilayers.',
      codeIntro: 'Implement the transfer matrix method for a multi-layer guanine-cytoplasm stack and show how reflectance builds with layer count.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

wavelengths = np.linspace(380, 700, 300)

# Refractive indices
N_WATER = 1.333
N_GUANINE = 1.83
N_CYTOPLASM = 1.37

def transfer_matrix_reflectance(wavelengths_nm, layers, n_incident,
                                n_substrate, angle_deg=0):
    """Compute reflectance of a multi-layer stack using transfer matrices.

    Args:
        wavelengths_nm: array of wavelengths
        layers: list of (refractive_index, thickness_nm) tuples
        n_incident: refractive index of incident medium
        n_substrate: refractive index of substrate
        angle_deg: incidence angle in degrees

    Returns:
        Reflectance array for each wavelength
    """
    theta0 = np.radians(angle_deg)
    R_out = np.zeros(len(wavelengths_nm))

    for w_idx, lam in enumerate(wavelengths_nm):
        # Build total transfer matrix
        M = np.array([[1.0, 0.0], [0.0, 1.0]], dtype=complex)

        theta_current = theta0
        n_current = n_incident

        for n_layer, d in layers:
            # Snell's law for this layer
            sin_t = n_current / n_layer * np.sin(theta_current)
            if abs(sin_t) > 1:
                R_out[w_idx] = 1.0
                break
            cos_t = np.sqrt(1 - sin_t**2)

            # Phase accumulated in this layer
            phi = 2 * np.pi * n_layer * d * cos_t / lam

            # Admittance (s-polarization)
            eta = n_layer * cos_t

            # Layer transfer matrix
            layer_M = np.array([
                [np.cos(phi), -1j * np.sin(phi) / eta],
                [-1j * eta * np.sin(phi), np.cos(phi)]
            ], dtype=complex)

            M = M @ layer_M
            theta_current = np.arcsin(sin_t)
            n_current = n_layer
        else:
            # Extract reflectance from total matrix
            # For s-polarization with incident and substrate admittances
            eta_i = n_incident * np.cos(theta0)
            sin_sub = n_incident / n_substrate * np.sin(theta0)
            cos_sub = np.sqrt(1 - sin_sub**2) if abs(sin_sub) <= 1 else 0
            eta_s = n_substrate * cos_sub

            # r = (eta_i*M[0,0] + eta_i*eta_s*M[0,1] - M[1,0] - eta_s*M[1,1]) /
            #     (eta_i*M[0,0] + eta_i*eta_s*M[0,1] + M[1,0] + eta_s*M[1,1])
            num = eta_i*M[0,0] + eta_i*eta_s*M[0,1] - M[1,0] - eta_s*M[1,1]
            den = eta_i*M[0,0] + eta_i*eta_s*M[0,1] + M[1,0] + eta_s*M[1,1]
            r = num / den
            R_out[w_idx] = min(float(np.abs(r)**2), 1.0)

    return R_out

def build_fish_stack(n_bilayers, d_guanine=80, d_cytoplasm=120):
    """Build a list of (n, d) tuples for a fish scale stack."""
    layers = []
    for _ in range(n_bilayers):
        layers.append((N_GUANINE, d_guanine))
        layers.append((N_CYTOPLASM, d_cytoplasm))
    return layers

# === HOW REFLECTANCE BUILDS WITH LAYER COUNT ===
layer_counts = [1, 3, 5, 10, 15]
plot_colors = ['#94a3b8', '#a855f7', '#3b82f6', '#22c55e', '#f59e0b']

fig, axes = plt.subplots(1, 2, figsize=(14, 5.5))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Multi-Layer Stack: From Faint Shimmer to Mirror',
             color='white', fontsize=13, fontweight='bold')

# Panel 1: Reflectance spectra vs layer count
ax = axes[0]
ax.set_facecolor('#111827')
peak_Rs = []
for N, clr in zip(layer_counts, plot_colors):
    stack = build_fish_stack(N, d_guanine=80, d_cytoplasm=120)
    R = transfer_matrix_reflectance(wavelengths, stack, N_WATER, N_CYTOPLASM)
    peak_R = R.max()
    peak_Rs.append(peak_R)
    ax.plot(wavelengths, R * 100, color=clr, linewidth=2,
            label=f'{N} bilayer{"s" if N > 1 else ""} (peak {peak_R*100:.0f}%)')

ax.set_xlabel('Wavelength (nm)', color='white', fontsize=10)
ax.set_ylabel('Reflectance (%)', color='white', fontsize=10)
ax.set_title('Layer Count vs Reflectance', color='white', fontsize=11)
ax.legend(fontsize=10, facecolor='#1f2937', edgecolor='gray',
          labelcolor='white')
ax.tick_params(colors='gray')

# Panel 2: Peak reflectance vs number of bilayers
ax2 = axes[1]
ax2.set_facecolor('#111827')
all_N = range(1, 21)
all_peaks = []
all_widths = []
for N in all_N:
    stack = build_fish_stack(N, d_guanine=80, d_cytoplasm=120)
    R = transfer_matrix_reflectance(wavelengths, stack, N_WATER, N_CYTOPLASM)
    all_peaks.append(R.max() * 100)
    # Bandwidth: wavelengths where R > 0.5 * max(R)
    half_max = R.max() / 2
    above = wavelengths[R > half_max]
    width = above[-1] - above[0] if len(above) > 1 else 0
    all_widths.append(width)

ax2.plot(list(all_N), all_peaks, 'o-', color='#3b82f6', linewidth=2.5,
         markersize=6, label='Peak reflectance (%)')
ax2b = ax2.twinx()
ax2b.plot(list(all_N), all_widths, 's--', color='#f59e0b', linewidth=2,
          markersize=5, label='Bandwidth (nm)')
ax2b.set_ylabel('Bandwidth at half-max (nm)', color='#f59e0b', fontsize=10)
ax2b.tick_params(colors='#f59e0b')

ax2.set_xlabel('Number of bilayers', color='white', fontsize=10)
ax2.set_ylabel('Peak reflectance (%)', color='#3b82f6', fontsize=10)
ax2.set_title('Brilliance vs Color Purity', color='white', fontsize=11)
ax2.tick_params(axis='y', colors='#3b82f6')
ax2.tick_params(axis='x', colors='gray')
ax2.legend(fontsize=10, facecolor='#1f2937', edgecolor='gray',
           labelcolor='white', loc='center left')
ax2b.legend(fontsize=10, facecolor='#1f2937', edgecolor='gray',
            labelcolor='white', loc='center right')

plt.tight_layout()
plt.show()

print("MULTI-LAYER STACK REPORT")
print("=" * 50)
print(f"{'Bilayers':>10}  {'Peak R (%)':>12}  {'Bandwidth (nm)':>15}")
print("-" * 50)
for N, pk, bw in zip(all_N, all_peaks, all_widths):
    print(f"  {N:>6d}     {pk:>8.1f}%      {bw:>8.1f} nm")

print()
print("Key insight: more layers = brighter AND purer color.")
print("The peak reflectance saturates near 95%, but the")
print("bandwidth keeps narrowing, giving an increasingly")
print("vivid, laser-like color selection.")
print()
print("Next: sweep viewing angle to see iridescent color shift.")`,
      challenge: 'Introduce disorder: vary each layer thickness randomly by plus or minus 10%. How does disorder affect the peak reflectance and bandwidth? Real biological stacks have some disorder, which is why fish look iridescent rather than mirror-perfect.',
      successHint: 'The transfer matrix method shows the dramatic difference between 1 layer (barely visible shimmer) and 15 layers (mirror-like brilliance). Real fish iridophores contain 5-20 bilayers, placing them squarely in the regime where structural color dominates. The bandwidth narrowing means more layers produce purer, more saturated colors.',
    },
    {
      title: 'Angular Color-Shift Dashboard',
      concept: `The defining feature of iridescence is that color changes with viewing angle. A red pigment looks red from every direction. An iridescent fish scale shifts from blue to green to gold as you tilt it. This is because the optical path difference through the layers depends on the angle of refraction inside the film: OPD = 2 * n * d * cos(theta_internal). As the angle increases, cos(theta) decreases, making the path shorter. A shorter path means constructive interference shifts to shorter wavelengths. This is called a **blue shift** at steeper angles.

The shift follows a precise relationship. If the peak wavelength at normal incidence (angle = 0) is lambda_0, then at angle theta the peak shifts to approximately lambda = lambda_0 * sqrt(1 - (sin(theta)/n_eff)^2), where n_eff is an effective refractive index of the stack. For a guanine-cytoplasm stack, n_eff is roughly 1.6, so at 60 degrees the peak shifts by about 10-15%.

This is exactly what Daphisha observed: the fish appeared different colors from different positions. It is also why the grandmother said "the fish has every colour in her scales, all the time." The full spectrum IS present in the layer structure. The viewing angle selects which wavelength exits the stack toward your eye. Change your position, change the angle, change the color. No mood reading required.`,
      analogy: 'A prism splits white light into a rainbow because different colors bend at different angles. An iridescent stack does the reverse: it has one color per angle, and as you walk around the fish, you scan through the rainbow. It is like a vending machine that dispenses a different snack depending on which button you press. The buttons are the viewing angles, and the snacks are the colors.',
      storyConnection: 'On her first visit (happy, leaning forward excitedly), Daphisha saw gold. On her second visit (upset, hunched and looking down), she saw violet. On her third visit (frightened, sitting stiffly upright), she saw white. Her posture changed her viewing angle, which changed the color. The grandmother was half right: the fish is a mirror, but it is an angular mirror. It does not reflect your mood. It reflects your geometry.',
      checkQuestion: 'At what viewing angle would a fish scale with 80 nm guanine layers shift its peak color from green (550 nm at normal incidence) to blue (450 nm)?',
      checkAnswer: 'Using lambda = lambda_0 * sqrt(1 - (sin(theta)/n_eff)^2) with lambda_0 = 550, lambda = 450, n_eff = 1.6: (450/550)^2 = 1 - (sin(theta)/1.6)^2, so (sin(theta)/1.6)^2 = 1 - 0.669 = 0.331, sin(theta) = 1.6 * 0.575 = 0.92, theta = arcsin(0.92) = 67 degrees. The fish scale would shift from green to blue at about 67 degrees, a steep but physically achievable viewing angle.',
      codeIntro: 'Sweep viewing angle from 0 to 70 degrees, compute the reflected color at each angle, and build a color-shift map that shows iridescence in action.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

wavelengths = np.linspace(380, 700, 300)
N_WATER, N_GUANINE, N_CYTOPLASM = 1.333, 1.83, 1.37

# === TRANSFER MATRIX (from Lesson 4) ===
def tmm_reflectance(wls, layers, n_inc, n_sub, angle_deg=0):
    theta0 = np.radians(angle_deg)
    R_out = np.zeros(len(wls))
    for w_idx, lam in enumerate(wls):
        M = np.eye(2, dtype=complex)
        n_cur = n_inc
        th_cur = theta0
        for n_l, d in layers:
            sin_t = n_cur / n_l * np.sin(th_cur)
            if abs(sin_t) > 1:
                R_out[w_idx] = 1.0; break
            cos_t = np.sqrt(1 - sin_t**2)
            phi = 2*np.pi*n_l*d*cos_t / lam
            eta = n_l * cos_t
            layer_M = np.array([
                [np.cos(phi), -1j*np.sin(phi)/eta],
                [-1j*eta*np.sin(phi), np.cos(phi)]], dtype=complex)
            M = M @ layer_M
            th_cur = np.arcsin(sin_t)
            n_cur = n_l
        else:
            eta_i = n_inc * np.cos(theta0)
            sin_s = n_inc / n_sub * np.sin(theta0)
            cos_s = np.sqrt(1 - sin_s**2) if abs(sin_s) <= 1 else 0
            eta_s = n_sub * cos_s
            num = eta_i*M[0,0] + eta_i*eta_s*M[0,1] - M[1,0] - eta_s*M[1,1]
            den = eta_i*M[0,0] + eta_i*eta_s*M[0,1] + M[1,0] + eta_s*M[1,1]
            R_out[w_idx] = min(float(np.abs(num/den)**2), 1.0)
    return R_out

# === CIE + RGB (from Lesson 3) ===
def cie_xbar(l):
    t1=(l-442)*(0.0624 if l<442 else 0.0374)
    t2=(l-599.8)*(0.0264 if l<599.8 else 0.0323)
    t3=(l-474)*(0.0264 if l<474 else 0.0323)
    return max(0.362*np.exp(-.5*t1**2)+1.056*np.exp(-.5*t2**2)-0.065*np.exp(-.5*t3**2),0)

def cie_ybar(l):
    t1=(l-568.8)*(0.0213 if l<568.8 else 0.0247)
    t2=(l-530.9)*(0.0613 if l<530.9 else 0.0322)
    return max(0.821*np.exp(-.5*t1**2)+0.286*np.exp(-.5*t2**2),0)

def cie_zbar(l):
    t1=(l-437)*(0.0845 if l<437 else 0.0278)
    t2=(l-459)*(0.0385 if l<459 else 0.0725)
    return max(1.217*np.exp(-.5*t1**2)+0.681*np.exp(-.5*t2**2),0)

cx = np.array([cie_xbar(w) for w in wavelengths])
cy = np.array([cie_ybar(w) for w in wavelengths])
cz = np.array([cie_zbar(w) for w in wavelengths])

def spec_to_rgb(spectrum):
    dl = wavelengths[1] - wavelengths[0]
    X = np.sum(spectrum*cx)*dl
    Y = np.sum(spectrum*cy)*dl
    Z = np.sum(spectrum*cz)*dl
    n = max(X+Y+Z, 1e-10)
    X,Y,Z = X/n, Y/n, Z/n
    r = 3.2406*X - 1.5372*Y - 0.4986*Z
    g = -0.9689*X + 1.8758*Y + 0.0415*Z
    b = 0.0557*X - 0.2040*Y + 1.0570*Z
    def gam(c):
        c=max(c,0)
        return 12.92*c if c<=0.0031308 else 1.055*c**(1/2.4)-0.055
    return np.clip([gam(r), gam(g), gam(b)], 0, 1)

# === ANGULAR COLOR-SHIFT ANALYSIS ===
angles = np.arange(0, 71, 2)  # 0 to 70 degrees
n_bilayers = 10
stack = []
for _ in range(n_bilayers):
    stack.append((N_GUANINE, 80))
    stack.append((N_CYTOPLASM, 120))

# Compute spectrum and color at each angle
angle_colors = []
peak_wavelengths = []
peak_reflectances = []

for ang in angles:
    R = tmm_reflectance(wavelengths, stack, N_WATER, N_CYTOPLASM, ang)
    rgb = spec_to_rgb(R)
    angle_colors.append(rgb)
    peak_wavelengths.append(wavelengths[np.argmax(R)])
    peak_reflectances.append(R.max())

angle_colors = np.array(angle_colors)
peak_wavelengths = np.array(peak_wavelengths)

# === VISUALIZATION ===
fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Iridescence in Action: Color Shifts with Viewing Angle',
             color='white', fontsize=14, fontweight='bold')

# Panel 1: Color ring (angular sweep)
ax = axes[0, 0]
ax.set_facecolor('#111827')
for i, ang in enumerate(angles):
    ax.barh(ang, 1, height=2, color=angle_colors[i], edgecolor='none')
ax.set_ylabel('Viewing angle (degrees)', color='white', fontsize=10)
ax.set_title('Color vs Angle', color='white', fontsize=11)
ax.set_xticks([])
ax.tick_params(colors='gray')
ax.invert_yaxis()

# Panel 2: Peak wavelength vs angle
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
for i in range(len(angles)-1):
    ax2.plot(angles[i:i+2], peak_wavelengths[i:i+2],
             color=angle_colors[i], linewidth=3)
ax2.set_xlabel('Viewing angle (degrees)', color='white', fontsize=10)
ax2.set_ylabel('Peak wavelength (nm)', color='white', fontsize=10)
ax2.set_title('Blue Shift with Angle', color='white', fontsize=11)
ax2.tick_params(colors='gray')
# Add theoretical prediction
n_eff = np.sqrt((N_GUANINE**2 + N_CYTOPLASM**2) / 2)
lam0 = peak_wavelengths[0]
theory = lam0 * np.sqrt(1 - (np.sin(np.radians(angles))/n_eff)**2)
ax2.plot(angles, theory, '--', color='white', linewidth=1.5,
         alpha=0.6, label=f'Theory (n_eff={n_eff:.2f})')
ax2.legend(fontsize=10, facecolor='#1f2937', edgecolor='gray',
           labelcolor='white')

# Panel 3: Spectra at 4 selected angles
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
show_angles = [0, 20, 40, 60]
for ang in show_angles:
    R = tmm_reflectance(wavelengths, stack, N_WATER, N_CYTOPLASM, ang)
    rgb = spec_to_rgb(R)
    ax3.plot(wavelengths, R * 100, linewidth=2, color=rgb,
             label=f'{ang} deg')
    ax3.fill_between(wavelengths, R*100, alpha=0.1, color=rgb)
ax3.set_xlabel('Wavelength (nm)', color='white', fontsize=10)
ax3.set_ylabel('Reflectance (%)', color='white', fontsize=10)
ax3.set_title('Spectra at Selected Angles', color='white', fontsize=11)
ax3.legend(fontsize=10, facecolor='#1f2937', edgecolor='gray',
           labelcolor='white')
ax3.tick_params(colors='gray')

# Panel 4: Daphisha's three visits
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
visits = [
    ('Visit 1: Happy\\\n(leaning forward, ~15 deg)', 15, '#f59e0b'),
    ('Visit 2: Upset\\\n(hunched down, ~55 deg)', 55, '#a855f7'),
    ('Visit 3: Afraid\\\n(sitting upright, ~5 deg)', 5, '#94a3b8'),
]
for i, (label, ang, fallback) in enumerate(visits):
    R = tmm_reflectance(wavelengths, stack, N_WATER, N_CYTOPLASM, ang)
    rgb = spec_to_rgb(R)
    ax4.barh(i, 1, height=0.6, color=rgb, edgecolor='white', linewidth=0.5)
    brightness = 0.299*rgb[0] + 0.587*rgb[1] + 0.114*rgb[2]
    tc = 'black' if brightness > 0.5 else 'white'
    ax4.text(0.5, i, label, ha='center', va='center',
             color=tc, fontsize=10, fontweight='bold')
ax4.set_title("Daphisha's Three Visits Explained",
              color='white', fontsize=11)
ax4.set_xticks([])
ax4.set_yticks([])
ax4.set_xlim(0, 1)

plt.tight_layout()
plt.show()

print("ANGULAR COLOR-SHIFT REPORT")
print("=" * 50)
print(f"{'Angle':>8}  {'Peak (nm)':>10}  {'Peak R (%)':>12}  {'Color':>12}")
print("-" * 50)
for ang, pk, pr, rgb in zip(angles[::5], peak_wavelengths[::5],
                             peak_reflectances[::5], angle_colors[::5]):
    hex_c = '#{:02x}{:02x}{:02x}'.format(
        int(rgb[0]*255), int(rgb[1]*255), int(rgb[2]*255))
    print(f"  {ang:>4d} deg   {pk:>7.0f} nm    {pr*100:>8.1f}%      {hex_c}")

print()
print("The fish scale shifts from long wavelengths (warm colors)")
print("at normal incidence to short wavelengths (cool colors)")
print("at steep angles. This is the physics of iridescence.")`,
      challenge: 'Create a "mood ring" visualization: for each of Daphisha\'s three visits, use a specific guanine thickness (not just angle) that best matches the described color. Can you find thickness-angle combinations that produce gold, deep violet, and pale white?',
      successHint: 'The angular sweep reveals the complete iridescence mechanism. At 0 degrees the fish might appear green; at 40 degrees it shifts to blue; at 60 degrees it reaches violet. The theoretical blue-shift formula matches the numerical result closely. The story panel proves that Daphisha was not reading moods but scanning viewing angles.',
    },
    {
      title: 'Full Iridescence Simulator',
      concept: `The final capstone integrates all four stages into a polished, reusable tool: the **IridescenceSimulator** class. It takes physical parameters (refractive indices, layer thicknesses, number of layers) and produces a complete analysis: reflectance spectra, perceived colors, angular color shifts, and a comparison across different biological structures.

A professional simulator needs more than correct physics. It needs **input validation** (reject negative thicknesses, warn about unrealistic refractive indices), **meaningful defaults** (pre-configured profiles for common biological structures), **clear output** (both numerical data and publication-quality visualizations), and **documentation** explaining what each parameter means and what the limitations are.

We will also compare three real biological iridescent systems: fish scales (guanine-cytoplasm stacks), butterfly wings (chitin-air stacks), and beetle shells (chitin-melanin stacks). Each uses the same physics (thin-film interference) but different materials and geometries, producing different color ranges and angular behaviors. This comparison demonstrates that our simulator is not fish-specific: it is a general tool for any layered iridescent structure.

The output includes: (1) a multi-angle reflectance spectrum panel, (2) a color-shift trajectory on a chromaticity diagram, (3) a comparison of three biological systems, and (4) an Umiam Lake simulation showing what Ka Ri Bneng would look like under different water conditions.`,
      analogy: 'Building the final simulator is like assembling a Swiss Army knife from individual blades you forged one at a time. The thin-film engine is the main blade. The CIE converter is the bottle opener. The transfer matrix is the screwdriver. The angular sweep is the corkscrew. Individually useful, but packaged together they become a versatile tool you can carry to any iridescence problem and open it up.',
      storyConnection: 'Daphisha became a teacher and took her students to Umiam Lake every year to see Ka Ri Bneng. With this simulator, her students could predict what color the fish would appear before they saw it. "If you sit here at this angle, with the afternoon sun at 30 degrees, Ka Ri Bneng will appear emerald green. Move three meters to the left and she will turn gold." The magic does not disappear when you understand the physics. It deepens.',
      checkQuestion: 'The simulator compares fish (guanine/cytoplasm), butterflies (chitin/air), and beetles (chitin/melanin). Which system would produce the most vivid iridescence and why?',
      checkAnswer: 'Butterflies (chitin/air) would produce the most vivid iridescence. The refractive index contrast between chitin (n=1.56) and air (n=1.0) is 0.56, much larger than guanine/cytoplasm (1.83 - 1.37 = 0.46) or chitin/melanin (1.56 - 1.7 = 0.14). Greater contrast means stronger Fresnel reflection at each interface, so fewer layers are needed to achieve high reflectance. This is why morpho butterflies, with their chitin-air stacks, are the most brilliantly iridescent animals on Earth.',
      codeIntro: 'Build the complete IridescenceSimulator class with biological presets, multi-system comparison, and a Umiam Lake simulation dashboard.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

wavelengths = np.linspace(380, 700, 300)

# === CIE COLOR MATCHING (precomputed) ===
def cie_x(l):
    t1=(l-442)*(0.0624 if l<442 else 0.0374)
    t2=(l-599.8)*(0.0264 if l<599.8 else 0.0323)
    t3=(l-474)*(0.0264 if l<474 else 0.0323)
    return max(0.362*np.exp(-.5*t1**2)+1.056*np.exp(-.5*t2**2)-0.065*np.exp(-.5*t3**2),0)
def cie_y(l):
    t1=(l-568.8)*(0.0213 if l<568.8 else 0.0247)
    t2=(l-530.9)*(0.0613 if l<530.9 else 0.0322)
    return max(0.821*np.exp(-.5*t1**2)+0.286*np.exp(-.5*t2**2),0)
def cie_z(l):
    t1=(l-437)*(0.0845 if l<437 else 0.0278)
    t2=(l-459)*(0.0385 if l<459 else 0.0725)
    return max(1.217*np.exp(-.5*t1**2)+0.681*np.exp(-.5*t2**2),0)

CX = np.array([cie_x(w) for w in wavelengths])
CY = np.array([cie_y(w) for w in wavelengths])
CZ = np.array([cie_z(w) for w in wavelengths])

# ================================================================
# IRIDESCENCE SIMULATOR
# ================================================================
class IridescenceSimulator:
    """Simulate structural color from layered biological nanostructures.

    Computes reflectance spectra, perceived colors, and angular
    color shifts for multi-layer thin-film stacks.

    Usage:
        sim = IridescenceSimulator.fish_scale()
        result = sim.analyze(angles=[0, 20, 40, 60])
    """

    # Biological presets
    PRESETS = {
        'fish_scale': {
            'n_high': 1.83, 'n_low': 1.37,  # guanine / cytoplasm
            'n_medium': 1.333,               # water above
            'd_high': 80, 'd_low': 120,      # nm
            'n_bilayers': 10,
            'label': 'Fish scale (guanine/cytoplasm)',
        },
        'morpho_butterfly': {
            'n_high': 1.56, 'n_low': 1.0,   # chitin / air
            'n_medium': 1.0,                 # air above
            'd_high': 62, 'd_low': 127,
            'n_bilayers': 8,
            'label': 'Morpho butterfly (chitin/air)',
        },
        'jewel_beetle': {
            'n_high': 1.7, 'n_low': 1.56,   # melanin / chitin
            'n_medium': 1.0,                 # air above
            'd_high': 95, 'd_low': 75,
            'n_bilayers': 12,
            'label': 'Jewel beetle (melanin/chitin)',
        },
    }

    def __init__(self, n_high, n_low, n_medium, d_high, d_low,
                 n_bilayers, label='Custom'):
        self.n_high = n_high
        self.n_low = n_low
        self.n_medium = n_medium
        self.d_high = d_high
        self.d_low = d_low
        self.n_bilayers = n_bilayers
        self.label = label

        # Build layer stack
        self.stack = []
        for _ in range(n_bilayers):
            self.stack.append((n_high, d_high))
            self.stack.append((n_low, d_low))

    @classmethod
    def fish_scale(cls, n_bilayers=10, d_guanine=80, d_cytoplasm=120):
        p = cls.PRESETS['fish_scale']
        return cls(p['n_high'], p['n_low'], p['n_medium'],
                   d_guanine, d_cytoplasm, n_bilayers, p['label'])

    @classmethod
    def morpho_butterfly(cls, n_bilayers=8):
        p = cls.PRESETS['morpho_butterfly']
        return cls(p['n_high'], p['n_low'], p['n_medium'],
                   p['d_high'], p['d_low'], n_bilayers, p['label'])

    @classmethod
    def jewel_beetle(cls, n_bilayers=12):
        p = cls.PRESETS['jewel_beetle']
        return cls(p['n_high'], p['n_low'], p['n_medium'],
                   p['d_high'], p['d_low'], n_bilayers, p['label'])

    def reflectance(self, angle_deg=0):
        """Compute reflectance spectrum at given angle."""
        theta0 = np.radians(angle_deg)
        R = np.zeros(len(wavelengths))
        for w_i, lam in enumerate(wavelengths):
            M = np.eye(2, dtype=complex)
            n_c, th_c = self.n_medium, theta0
            for n_l, d in self.stack:
                sin_t = n_c / n_l * np.sin(th_c)
                if abs(sin_t) > 1: R[w_i] = 1.0; break
                cos_t = np.sqrt(1-sin_t**2)
                phi = 2*np.pi*n_l*d*cos_t/lam
                eta = n_l*cos_t
                M = M @ np.array([
                    [np.cos(phi), -1j*np.sin(phi)/eta],
                    [-1j*eta*np.sin(phi), np.cos(phi)]],
                    dtype=complex)
                th_c = np.arcsin(sin_t); n_c = n_l
            else:
                ei = self.n_medium*np.cos(theta0)
                ss = self.n_medium/self.n_low*np.sin(theta0)
                cs = np.sqrt(1-ss**2) if abs(ss)<=1 else 0
                es = self.n_low*cs
                nm = ei*M[0,0]+ei*es*M[0,1]-M[1,0]-es*M[1,1]
                dn = ei*M[0,0]+ei*es*M[0,1]+M[1,0]+es*M[1,1]
                R[w_i] = min(float(np.abs(nm/dn)**2), 1.0)
        return R

    @staticmethod
    def to_rgb(spectrum):
        dl = wavelengths[1]-wavelengths[0]
        X = np.sum(spectrum*CX)*dl
        Y = np.sum(spectrum*CY)*dl
        Z = np.sum(spectrum*CZ)*dl
        n = max(X+Y+Z,1e-10)
        X,Y,Z = X/n,Y/n,Z/n
        r=3.2406*X-1.5372*Y-0.4986*Z
        g=-0.9689*X+1.8758*Y+0.0415*Z
        b=0.0557*X-0.2040*Y+1.0570*Z
        def gm(c):
            c=max(c,0)
            return 12.92*c if c<=0.0031308 else 1.055*c**(1/2.4)-0.055
        return np.clip([gm(r),gm(g),gm(b)],0,1)

    def analyze(self, angles=None):
        """Full analysis: spectra and colors at multiple angles."""
        if angles is None:
            angles = np.arange(0, 71, 5)
        results = []
        for a in angles:
            R = self.reflectance(a)
            rgb = self.to_rgb(R)
            pk = wavelengths[np.argmax(R)]
            results.append({
                'angle': a, 'spectrum': R, 'rgb': rgb,
                'peak_nm': pk, 'peak_R': R.max()
            })
        return results

# ================================================================
# FINAL SHOWCASE
# ================================================================
fish = IridescenceSimulator.fish_scale()
butterfly = IridescenceSimulator.morpho_butterfly()
beetle = IridescenceSimulator.jewel_beetle()

fig, axes = plt.subplots(2, 2, figsize=(14, 11))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Iridescence Simulator — Final Showcase',
             color='white', fontsize=15, fontweight='bold')

# Panel 1: Three biological systems compared at 0 degrees
ax = axes[0, 0]
ax.set_facecolor('#111827')
systems = [
    (fish, '#3b82f6', 'Fish scale'),
    (butterfly, '#22c55e', 'Morpho butterfly'),
    (beetle, '#f59e0b', 'Jewel beetle'),
]
for sim, clr, name in systems:
    R = sim.reflectance(0)
    rgb = sim.to_rgb(R)
    ax.plot(wavelengths, R*100, color=rgb, linewidth=2.5, label=name)
    ax.fill_between(wavelengths, R*100, alpha=0.1, color=rgb)
ax.set_xlabel('Wavelength (nm)', color='white', fontsize=10)
ax.set_ylabel('Reflectance (%)', color='white', fontsize=10)
ax.set_title('Three Iridescent Systems (normal incidence)',
             color='white', fontsize=11)
ax.legend(fontsize=10, facecolor='#1f2937', edgecolor='gray',
          labelcolor='white')
ax.tick_params(colors='gray')

# Panel 2: Angular color-shift comparison
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
angles_sweep = np.arange(0, 66, 3)
for sim, clr, name in systems:
    peaks = []
    for a in angles_sweep:
        R = sim.reflectance(a)
        peaks.append(wavelengths[np.argmax(R)])
    shift = np.array(peaks) - peaks[0]
    ax2.plot(angles_sweep, shift, 'o-', color=clr, linewidth=2,
             markersize=4, label=name)
ax2.set_xlabel('Viewing angle (degrees)', color='white', fontsize=10)
ax2.set_ylabel('Wavelength shift (nm)', color='white', fontsize=10)
ax2.set_title('Color Shift vs Angle', color='white', fontsize=11)
ax2.legend(fontsize=10, facecolor='#1f2937', edgecolor='gray',
           labelcolor='white')
ax2.tick_params(colors='gray')

# Panel 3: Ka Ri Bneng under different Umiam Lake conditions
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
conditions = [
    ('Clear water, noon (5 deg)', 5, 10),
    ('Clear water, afternoon (25 deg)', 25, 10),
    ('Clear water, low sun (45 deg)', 45, 10),
    ('Misty morning (5 deg, 5 layers)', 5, 5),
    ('Deep water (25 deg, 15 layers)', 25, 15),
]
for i, (label, angle, n_bi) in enumerate(conditions):
    sim = IridescenceSimulator.fish_scale(n_bilayers=n_bi)
    R = sim.reflectance(angle)
    rgb = sim.to_rgb(R)
    ax3.barh(i, 1, height=0.7, color=rgb, edgecolor='white', linewidth=0.5)
    brightness = 0.299*rgb[0] + 0.587*rgb[1] + 0.114*rgb[2]
    tc = 'black' if brightness > 0.5 else 'white'
    ax3.text(0.5, i, label, ha='center', va='center',
             color=tc, fontsize=10, fontweight='bold')
ax3.set_title('Ka Ri Bneng at Umiam Lake',
              color='white', fontsize=11)
ax3.set_xticks([])
ax3.set_yticks([])
ax3.set_xlim(0, 1)

# Panel 4: Design space — thickness vs bilayers heatmap
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
d_range = np.arange(50, 151, 10)
n_range = np.arange(1, 16)
peak_map = np.zeros((len(n_range), len(d_range)))
for j, d in enumerate(d_range):
    for i, nb in enumerate(n_range):
        sim = IridescenceSimulator.fish_scale(n_bilayers=nb, d_guanine=d)
        R = sim.reflectance(0)
        peak_map[i, j] = R.max() * 100

im = ax4.imshow(peak_map, aspect='auto', origin='lower',
                extent=[d_range[0], d_range[-1], n_range[0], n_range[-1]],
                cmap='magma', vmin=0, vmax=100)
ax4.set_xlabel('Guanine thickness (nm)', color='white', fontsize=10)
ax4.set_ylabel('Number of bilayers', color='white', fontsize=10)
ax4.set_title('Design Space: Peak Reflectance (%)',
              color='white', fontsize=11)
ax4.tick_params(colors='gray')
cbar = plt.colorbar(im, ax=ax4)
cbar.ax.tick_params(colors='gray')
cbar.set_label('Peak R (%)', color='white', fontsize=10)

plt.tight_layout()
plt.show()

# === COMPREHENSIVE REPORT ===
print("=" * 65)
print("  IRIDESCENCE SIMULATOR — FINAL REPORT")
print("=" * 65)
print()

for sim, _, name in systems:
    print(f"{name} ({sim.label}):")
    print(f"  Structure: {sim.n_bilayers} bilayers of "
          f"n={sim.n_high}/{sim.n_low}, d={sim.d_high}/{sim.d_low} nm")
    r0 = sim.analyze([0, 30, 60])
    for res in r0:
        hex_c = '#{:02x}{:02x}{:02x}'.format(
            int(res['rgb'][0]*255), int(res['rgb'][1]*255),
            int(res['rgb'][2]*255))
        print(f"    {res['angle']:>2d} deg: peak={res['peak_nm']:.0f} nm, "
              f"R={res['peak_R']*100:.0f}%, color={hex_c}")
    print()

print("UMIAM LAKE SIMULATION:")
for label, angle, n_bi in conditions:
    sim = IridescenceSimulator.fish_scale(n_bilayers=n_bi)
    R = sim.reflectance(angle)
    rgb = sim.to_rgb(R)
    hex_c = '#{:02x}{:02x}{:02x}'.format(
        int(rgb[0]*255), int(rgb[1]*255), int(rgb[2]*255))
    print(f"  {label}: {hex_c}")

print()
print("The simulator proves that Ka Ri Bneng's color shifts")
print("are pure physics: thin-film interference in guanine")
print("crystal stacks, modulated by viewing angle and the")
print("number of layers. No magic required — just nanometers.")`,
      challenge: 'Add underwater light filtering: sunlight passing through Umiam Lake water is absorbed (red wavelengths first). Multiply the solar spectrum by an exponential water absorption curve before it hits the fish scale, then recompute the perceived colors at 1 m, 5 m, and 10 m depth. At what depth does iridescence become invisible?',
      successHint: 'You have built a complete, class-based iridescence simulator that works for any layered biological structure. It combines Fresnel equations, the transfer matrix method, CIE color science, and angular analysis into a single tool. The Umiam Lake panel directly answers the story: Ka Ri Bneng does not read moods. She reads angles.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Capstone
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Build a Fish Scale Iridescence Simulator with thin-film optics and color science</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project uses Python with numpy and matplotlib to simulate iridescence in fish scales. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cpu className="w-5 h-5" />Load Python + NumPy</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L4-${i + 1}`} number={i + 1}
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
