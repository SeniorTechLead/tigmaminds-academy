import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function IbnAlHaythamLevel2() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Ray tracing — reflection and refraction at curved surfaces',
      concept: `Ibn al-Haytham was the first to systematically trace rays of light through optical systems. **Ray tracing** follows each ray as it bounces off mirrors (reflection) or bends through lenses (refraction).

For a **flat mirror**, the law of reflection is simple: angle of incidence = angle of reflection. But for a **curved mirror** (concave or convex), each point on the surface has a different normal direction — so parallel rays converge to a **focal point** (concave) or diverge as if from one (convex).

**Refraction** at a curved surface follows Snell's law at each point: n₁ sin θ₁ = n₂ sin θ₂. The curvature determines where rays meet after passing through — this is how lenses form images.

The key equation for a curved refracting surface: **n₁/s + n₂/s' = (n₂ - n₁)/R**, where s is the object distance, s' is the image distance, and R is the radius of curvature.

📚 *Ibn al-Haytham's Kitab al-Manazir (Book of Optics, 1011 CE) was the first work to treat light as rays that travel in straight lines and can be traced geometrically through any optical system.*`,
      analogy: 'Imagine rolling marbles across a flat table toward a curved wall. Each marble bounces off at a different angle depending on where it hits the curve — but if the curve is shaped just right (parabolic), all the marbles converge to the same point. That\'s exactly what a concave mirror does with light rays.',
      storyConnection: 'Ibn al-Haytham built his understanding of vision by tracing rays from objects to the eye — reversing the ancient Greek belief that eyes emit light. His method of tracing individual rays through curved surfaces became the foundation of all optical design, from reading glasses to the Hubble telescope.',
      checkQuestion: 'A concave mirror has a radius of curvature of 40 cm. Where is its focal point?',
      checkAnswer: 'The focal length f = R/2 = 40/2 = 20 cm. Parallel rays hitting this mirror converge at a point 20 cm in front of it. This is why concave mirrors are used in telescopes — they gather parallel starlight and focus it to a point where a detector or eyepiece can capture the image.',
      codeIntro: 'Trace rays through curved mirrors and refracting surfaces, computing where they converge.',
      code: `import numpy as np

def trace_mirror_ray(y_in, R, is_concave=True):
    """
    Trace a horizontal ray at height y_in hitting a
    spherical mirror of radius R.
    Returns the x-position where the reflected ray crosses the axis.
    """
    sign = 1 if is_concave else -1
    # Mirror surface: x = R - sqrt(R^2 - y^2) (for concave, centre at x=R)
    x_mirror = R - sign * np.sqrt(R**2 - y_in**2)
    # Normal at hit point makes angle alpha with axis
    alpha = np.arcsin(y_in / R)
    # Reflected ray angle with axis = 2*alpha
    theta_r = 2 * alpha
    # Axis crossing: x_cross = x_mirror + y_in / tan(theta_r)
    if np.abs(np.tan(theta_r)) < 1e-10:
        return float('inf')
    x_cross = x_mirror - sign * y_in / np.tan(theta_r)
    return x_cross

# Concave mirror, R = 200 mm
R = 200.0
print("=== Concave Mirror Ray Tracing ===")
print(f"Radius of curvature: {R:.0f} mm")
print(f"Paraxial focal length (f = R/2): {R/2:.0f} mm")
print(f"\\n{'Ray height (mm)':<18} {'Axis crossing (mm)':>20} {'Deviation from f':>18}")
print("-" * 58)

for y in [5, 10, 20, 40, 60, 80, 95]:
    x_cross = trace_mirror_ray(y, R)
    dev = x_cross - R/2
    print(f"{y:<18.0f} {x_cross:>18.2f} {dev:>16.2f}")

print("\\nRays far from the axis cross CLOSER to the mirror — this")
print("is SPHERICAL ABERRATION. Only paraxial (near-axis) rays")
print("focus exactly at f = R/2.")

# Refraction at curved surface
print("\\n=== Refraction at a Curved Glass Surface ===")
n1, n2 = 1.0, 1.5  # air to glass
R_lens = 100.0      # mm

print(f"n1 = {n1} (air), n2 = {n2} (glass), R = {R_lens} mm")
print(f"\\n{'Object dist (mm)':<20} {'Image dist (mm)':>18} {'Magnification':>15}")
print("-" * 55)

for s_obj in [500, 300, 200, 150, 120]:
    # n1/s + n2/s' = (n2 - n1)/R
    inv_s_prime = (n2 - n1) / R_lens - n1 / s_obj
    if abs(inv_s_prime) < 1e-10:
        print(f"{s_obj:<20.0f} {'infinity':>18} {'---':>15}")
        continue
    s_prime = n2 / inv_s_prime
    mag = -(n1 * s_prime) / (n2 * s_obj)
    print(f"{s_obj:<20.0f} {s_prime:>16.1f} {mag:>13.2f}")`,
      challenge: 'A parabolic mirror focuses ALL parallel rays to a single point — no spherical aberration. Modify trace_mirror_ray to use a parabola (x = y²/(4f)) instead of a sphere. Verify that all rays cross the axis at exactly f, regardless of height.',
      successHint: 'Ray tracing is the foundation of all optical engineering. Every camera lens, telescope mirror, and fibre optic cable is designed by tracing rays through the system. The same mathematics — Snell\'s law applied at each surface — drives the ray tracing engines in modern 3D graphics and movie CGI.',
    },
    {
      title: 'The thin lens equation — predicting where images form',
      concept: `A thin lens is a transparent element with two curved surfaces that refracts light to form images. The **thin lens equation** relates three quantities:

**1/f = 1/dₒ + 1/dᵢ**

Where f is the focal length, dₒ is the object distance, and dᵢ is the image distance. This single equation predicts where any lens forms an image of any object.

**Magnification** m = -dᵢ/dₒ. Negative m means the image is inverted. |m| > 1 means the image is larger than the object.

The **lensmaker's equation** connects focal length to the lens shape: 1/f = (n - 1)(1/R₁ - 1/R₂), where n is the refractive index and R₁, R₂ are the radii of curvature.

📚 *A converging (convex) lens has a positive focal length and brings parallel rays together. A diverging (concave) lens has a negative focal length and spreads rays apart. Together, they can correct each other's aberrations.*`,
      analogy: 'A magnifying glass is a converging lens. Hold it at arm\'s length and look at a distant building — you see a tiny, inverted image on the other side. Move the glass closer to a book and the text appears enlarged. The thin lens equation tells you exactly how big the image will be and where it forms, for any distance.',
      storyConnection: 'Ibn al-Haytham described the magnifying properties of curved glass segments in his Book of Optics. His analysis of how curved surfaces bend light laid the groundwork for the reading stones used in medieval monasteries and eventually for spectacles, microscopes, and telescopes — all governed by the thin lens equation.',
      checkQuestion: 'An object is placed 30 cm from a lens with f = 20 cm. Where does the image form, and how large is it?',
      checkAnswer: '1/dᵢ = 1/f - 1/dₒ = 1/20 - 1/30 = (3-2)/60 = 1/60. So dᵢ = 60 cm. Magnification = -60/30 = -2. The image forms 60 cm from the lens, is inverted (negative sign), and is 2× larger than the object.',
      codeIntro: 'Explore the thin lens equation — map how image position and magnification change with object distance.',
      code: `import numpy as np

def thin_lens(f, d_obj):
    """
    Thin lens equation: 1/f = 1/do + 1/di
    Returns (image_distance, magnification).
    """
    if abs(d_obj - f) < 1e-10:
        return float('inf'), float('inf')
    d_img = 1 / (1/f - 1/d_obj)
    mag = -d_img / d_obj
    return d_img, mag

def lensmaker(n, R1, R2):
    """Lensmaker equation: 1/f = (n-1)(1/R1 - 1/R2)."""
    return 1 / ((n - 1) * (1/R1 - 1/R2))

# Explore a converging lens (f = 50 mm)
f = 50.0  # mm
print("=== Thin Lens Image Formation ===")
print(f"Focal length: {f:.0f} mm (converging lens)")
print(f"\\n{'Object dist':>12} {'Image dist':>12} {'Magnif.':>10} {'Image type':<20}")
print("-" * 56)

for d_obj in [200, 150, 100, 75, 60, 50.1, 40, 30, 20]:
    d_img, mag = thin_lens(f, d_obj)
    if d_img == float('inf'):
        img_type = "at infinity"
    elif d_img > 0:
        img_type = "real, inverted" if mag < 0 else "real, upright"
    else:
        img_type = "virtual, upright"
    print(f"{d_obj:>10.1f} mm {d_img:>10.1f} mm {mag:>+9.2f} {img_type:<20}")

print(f"\\nAt d_obj = f ({f:.0f} mm): rays emerge parallel — image at infinity")
print(f"At d_obj < f: image is virtual (same side as object), upright, magnified")

# Lensmaker equation — design a lens
print("\\n=== Lens Design (Lensmaker Equation) ===")
print(f"{'Glass type':<18} {'n':>5} {'R1 (mm)':>8} {'R2 (mm)':>8} {'f (mm)':>8}")
print("-" * 49)

designs = [
    ("Crown glass",   1.52, 100, -100),
    ("Crown glass",   1.52, 80,  -120),
    ("Flint glass",   1.62, 100, -100),
    ("Diamond",       2.42, 100, -100),
    ("Water droplet",  1.33, 50,  -50),
]

for name, n, R1, R2 in designs:
    f_calc = lensmaker(n, R1, R2)
    print(f"{name:<18} {n:>5.2f} {R1:>6.0f} {R2:>6.0f} {f_calc:>8.1f}")

print("\\nHigher refractive index → shorter focal length → stronger lens")
print("This is why diamond sparkles — its high n bends light sharply")`,
      challenge: 'A two-lens system: lens 1 (f₁ = 50 mm) forms an image that becomes the object for lens 2 (f₂ = 30 mm), separated by 120 mm. Calculate the final image position and total magnification. This is how microscopes and telescopes work — multiple lenses in sequence.',
      successHint: 'The thin lens equation is used every day by optometrists prescribing glasses, photographers choosing lenses, and engineers designing projectors. You now understand the core equation that governs all image-forming optics.',
    },
    {
      title: 'Total internal reflection — trapping light inside glass',
      concept: `When light passes from a denser medium (glass, n = 1.5) to a less dense medium (air, n = 1.0), it bends AWAY from the normal. As the angle of incidence increases, the refracted ray bends further — until at the **critical angle**, the refracted ray skims along the surface (90° to the normal).

Beyond the critical angle, **no light escapes** — it is completely reflected back inside the glass. This is **total internal reflection (TIR)**.

The critical angle: **θ_c = arcsin(n₂/n₁)**

For glass-to-air: θ_c = arcsin(1.0/1.5) = 41.8°. Any ray hitting the surface at more than 41.8° is trapped inside.

This is the principle behind **optical fibres**: light enters a thin glass fibre and bounces along its length by TIR, travelling kilometres with almost no loss. The entire internet runs on this phenomenon.

📚 *Ibn al-Haytham studied refraction at the boundary between water and air — the same physics that causes TIR. He correctly noted that the bending angle depends on the density of each medium.*`,
      analogy: 'Imagine skipping a stone on water. At a shallow angle, the stone bounces off the surface — it doesn\'t penetrate. At a steep angle, it plunges in. Light does the same thing at a glass-air boundary: at shallow angles (measured from the surface), the light bounces back inside. The critical angle is the threshold between "bounce" and "escape."',
      storyConnection: 'Ibn al-Haytham investigated why objects look distorted when viewed through water — the refraction that causes TIR. Centuries later, John Tyndall demonstrated that light could be guided along a curved stream of water by total internal reflection. Today, that same principle carries 99% of the world\'s internet data through fibre optic cables.',
      checkQuestion: 'What is the critical angle for diamond (n = 2.42) surrounded by air? Why does diamond sparkle so intensely?',
      checkAnswer: 'θ_c = arcsin(1.0/2.42) = 24.4°. This is very small — most light hitting the inside surface of a diamond is totally reflected. Light bounces around inside the diamond many times before escaping, creating intense sparkle. Diamond cutters shape facets specifically to exploit this low critical angle.',
      codeIntro: 'Calculate critical angles, model total internal reflection, and simulate light propagation in an optical fibre.',
      code: `import numpy as np

def critical_angle(n1, n2):
    """Critical angle for TIR (n1 > n2 required)."""
    if n1 <= n2:
        return 90.0  # no TIR possible
    return np.degrees(np.arcsin(n2 / n1))

def snell_refract(theta_i_deg, n1, n2):
    """Apply Snell's law. Returns refracted angle or None if TIR."""
    theta_i = np.radians(theta_i_deg)
    sin_theta_t = n1 * np.sin(theta_i) / n2
    if abs(sin_theta_t) > 1:
        return None  # total internal reflection
    return np.degrees(np.arcsin(sin_theta_t))

# Critical angles for various media
print("=== Critical Angles for Total Internal Reflection ===")
print(f"{'Interface':<28} {'n1':>5} {'n2':>5} {'θ_c (°)':>8}")
print("-" * 48)

interfaces = [
    ("Glass → Air",       1.50, 1.00),
    ("Diamond → Air",     2.42, 1.00),
    ("Water → Air",       1.33, 1.00),
    ("Glass → Water",     1.50, 1.33),
    ("Fibre core → clad", 1.48, 1.46),
]

for name, n1, n2 in interfaces:
    theta_c = critical_angle(n1, n2)
    print(f"{name:<28} {n1:>5.2f} {n2:>5.2f} {theta_c:>7.1f}")

# Trace light at various angles through glass-air interface
print("\\n=== Light at Glass-Air Interface (n=1.5 → n=1.0) ===")
n1, n2 = 1.50, 1.00
theta_c = critical_angle(n1, n2)
print(f"Critical angle: {theta_c:.1f}°\\n")
print(f"{'Incidence (°)':>14} {'Refracted (°)':>14} {'Outcome':<20}")
print("-" * 50)

for theta_i in range(0, 90, 5):
    theta_r = snell_refract(theta_i, n1, n2)
    if theta_r is None:
        outcome = "TOTAL INTERNAL REFLECTION"
    else:
        outcome = f"refracted at {theta_r:.1f}°"
    print(f"{theta_i:>12}° {'---' if theta_r is None else f'{theta_r:.1f}°':>13} {outcome}")

# Optical fibre simulation
print("\\n=== Optical Fibre: Light Bounces Over 1 km ===")
fibre_n_core = 1.48
fibre_n_clad = 1.46
fibre_theta_c = critical_angle(fibre_n_core, fibre_n_clad)
fibre_diameter_um = 50  # micrometres
fibre_length_m = 1000

launch_angle_deg = fibre_theta_c + 5  # safely above critical angle
bounce_angle = 90 - launch_angle_deg
bounce_length_mm = fibre_diameter_um / 1000 / np.tan(np.radians(bounce_angle))
n_bounces = fibre_length_m * 1000 / bounce_length_mm

print(f"Core n = {fibre_n_core}, Cladding n = {fibre_n_clad}")
print(f"Critical angle: {fibre_theta_c:.1f}°")
print(f"Launch angle: {launch_angle_deg:.1f}° (above critical)")
print(f"Bounces per km: {n_bounces:,.0f}")
print(f"Total path length: {fibre_length_m * n_bounces * bounce_length_mm / (fibre_length_m*1000):.2f} km")
print(f"Light travels slightly further than the fibre is long!")`,
      challenge: 'Optical fibres lose about 0.2 dB/km of signal. If each bounce loses 0.00001% of the light, calculate the total loss over 1 km. At what distance does the signal drop to 1% of its original power? This determines how far apart repeaters must be placed in undersea cables.',
      successHint: 'Total internal reflection is one of the most commercially important phenomena in physics. The global fibre optic network — carrying phone calls, video, and internet data across oceans — depends entirely on TIR. You now understand the physics that makes modern telecommunications possible.',
    },
    {
      title: 'Diffraction — light bending around obstacles',
      concept: `When light passes through a narrow slit, it doesn't just travel in a straight line — it **spreads out** (diffracts). This spreading creates a pattern of bright and dark bands on a screen behind the slit.

For a **single slit** of width *a*, the positions of dark fringes (minima) are:

**a sin θ = m λ** (where m = ±1, ±2, ±3, ...)

The central bright band is twice as wide as the others. The pattern gets wider as the slit gets narrower or the wavelength gets longer — the slit is "squeezing" the light, and the wave fights back by spreading.

This is fundamentally a **wave** phenomenon — particles passing through a slit would just make a single bright stripe. The spreading pattern proves that light is a wave.

📚 *Ibn al-Haytham observed that light passing through a narrow opening creates a broader spot than expected from straight-line travel. Though he didn't have the wave theory to explain it, his careful observations were among the earliest documented accounts of diffraction.*`,
      analogy: 'Drop a pebble in a pond behind a wall with a narrow gap. The circular ripples pass through the gap and spread out on the other side — they don\'t just travel in a straight line through the opening. The narrower the gap relative to the wavelength, the more the waves spread. Light does exactly the same thing.',
      storyConnection: 'Ibn al-Haytham\'s famous darkened room experiments — where he admitted light through a small hole to study its properties — were early encounters with diffraction. He noted that the bright spot on the wall was larger than the hole, and that the edges were not sharp. These observations, recorded in 1021 CE, prefigured the wave theory of light by 700 years.',
      checkQuestion: 'Light of wavelength 600 nm passes through a slit 0.1 mm wide. What is the angular width of the central bright band?',
      checkAnswer: 'The first minimum is at sin θ = λ/a = 600×10⁻⁹ / 0.1×10⁻³ = 0.006. So θ = 0.34°. The full central band spans ±0.34° = 0.69°. On a screen 2 m away, the central band is about 24 mm wide — much wider than the 0.1 mm slit. The narrower the slit, the wider the pattern.',
      codeIntro: 'Calculate and visualise single-slit diffraction patterns for different slit widths and wavelengths.',
      code: `import numpy as np

def single_slit_intensity(theta_deg, a_um, wavelength_nm):
    """
    Single slit diffraction intensity.
    I(θ) = I₀ × [sin(β)/β]² where β = π × a × sin(θ) / λ
    """
    theta = np.radians(theta_deg)
    a_nm = a_um * 1000  # convert µm to nm
    beta = np.pi * a_nm * np.sin(theta) / wavelength_nm
    if abs(beta) < 1e-10:
        return 1.0
    return (np.sin(beta) / beta) ** 2

# Compute diffraction pattern
slit_width_um = 50  # 50 µm slit
wavelength = 550    # nm (green light)

print("=== Single Slit Diffraction Pattern ===")
print(f"Slit width: {slit_width_um} µm | Wavelength: {wavelength} nm")
print(f"\\n{'Angle (°)':>10} {'Intensity':>10} {'Bar chart':<30}")
print("-" * 52)

for theta in np.arange(-3.0, 3.1, 0.25):
    I = single_slit_intensity(theta, slit_width_um, wavelength)
    bar = "█" * int(I * 30)
    print(f"{theta:>9.2f}° {I:>9.4f} {bar}")

# Minima positions
print(f"\\n=== Minima Positions ===")
print(f"{'Order m':>8} {'Angle (°)':>10} {'Position on screen at 1m (mm)':>30}")
print("-" * 50)
a_nm = slit_width_um * 1000
for m in [1, 2, 3, 4, 5]:
    sin_theta = m * wavelength / a_nm
    if sin_theta > 1:
        break
    theta_deg = np.degrees(np.arcsin(sin_theta))
    pos_mm = 1000 * np.tan(np.radians(theta_deg))  # screen at 1m
    print(f"{m:>8} {theta_deg:>9.3f}° {pos_mm:>28.2f}")

# Compare different slit widths
print(f"\\n=== Central Band Width vs Slit Width ===")
print(f"{'Slit (µm)':>10} {'Central band (°)':>18} {'At 1m screen (mm)':>20}")
print("-" * 50)
for a in [10, 25, 50, 100, 200, 500]:
    sin_t = wavelength / (a * 1000)
    if sin_t > 1:
        theta_1 = 90
    else:
        theta_1 = np.degrees(np.arcsin(sin_t))
    width_deg = 2 * theta_1
    width_mm = 2 * 1000 * np.tan(np.radians(theta_1))
    print(f"{a:>10} {width_deg:>16.2f}° {width_mm:>18.1f}")

print("\\nNarrower slit → wider diffraction pattern (inverse relationship)")`,
      challenge: 'Compare diffraction patterns for red (700 nm), green (550 nm), and blue (450 nm) light through the same slit. When white light hits a slit, each colour diffracts by a different amount — this is why diffraction gratings separate white light into a rainbow, just like a prism but by a completely different mechanism.',
      successHint: 'Diffraction is how we know light is a wave. It explains why microscopes have resolution limits (the Abbe diffraction limit), why radio antennas have beam widths, and why X-ray crystallography can reveal molecular structures. Every optical instrument is ultimately limited by diffraction.',
    },
    {
      title: 'Colour theory — dispersion and the physics of prisms',
      concept: `White light is a mixture of all visible wavelengths (400-700 nm). When it enters a prism, each wavelength refracts by a **different amount** because the refractive index of glass depends on wavelength — this is **dispersion**.

The relationship between refractive index and wavelength is described by the **Cauchy equation**:

**n(λ) = A + B/λ² + C/λ⁴**

Shorter wavelengths (violet, 400 nm) have higher n and bend more. Longer wavelengths (red, 700 nm) have lower n and bend less. This is why a prism splits white light into a rainbow: ROYGBIV from least bent to most bent.

The **angular dispersion** of a prism tells you how much it separates two wavelengths: Δθ = (dn/dλ) × Δλ × geometric factor. A material with high dispersion (flint glass) separates colours more than one with low dispersion (crown glass).

📚 *Ibn al-Haytham experimented with light passing through glass spheres and noted that different colours emerge at different angles — an observation of dispersion centuries before Newton's famous prism experiments of 1666.*`,
      analogy: 'Imagine a marching band turning a corner from pavement onto sand. The musicians who step onto sand first slow down, causing the whole line to pivot. Now imagine three bands with different marching speeds on sand — each pivots by a different amount. That\'s dispersion: different colours (wavelengths) travel at different speeds in glass and therefore bend by different amounts.',
      storyConnection: 'Ibn al-Haytham studied light passing through glass vessels filled with water and noted colour separation effects. He proposed that colours were properties of light itself, not created by the medium — a revolutionary idea that contradicted Aristotle. Newton later confirmed this with prisms, but Ibn al-Haytham\'s insight came 650 years earlier.',
      checkQuestion: 'Crown glass has n = 1.515 at 400 nm and n = 1.509 at 700 nm. What is the difference in refraction angle for these wavelengths entering at 45°?',
      checkAnswer: 'Using Snell\'s law: sin θ₁ = sin(45°)/n. For violet: θ = arcsin(0.707/1.515) = 27.84°. For red: θ = arcsin(0.707/1.509) = 27.95°. The difference is 0.11° — small, but over the length of a prism this produces visible colour separation. Flint glass (higher dispersion) can produce 3-5× more separation.',
      codeIntro: 'Model dispersion through a prism — calculate how different wavelengths separate into a spectrum.',
      code: `import numpy as np

def cauchy_n(wavelength_nm, A, B, C=0):
    """Cauchy equation for refractive index vs wavelength."""
    lam_um = wavelength_nm / 1000  # convert to micrometres
    return A + B / lam_um**2 + C / lam_um**4

def prism_deviation(n, apex_deg):
    """
    Minimum deviation angle for a prism with apex angle A.
    At minimum deviation: n = sin((A + D_min)/2) / sin(A/2)
    So D_min = 2 × arcsin(n × sin(A/2)) - A
    """
    A = np.radians(apex_deg)
    sin_val = n * np.sin(A / 2)
    if abs(sin_val) > 1:
        return float('nan')
    return np.degrees(2 * np.arcsin(sin_val)) - apex_deg

# Glass types (Cauchy coefficients)
glasses = [
    ("Crown glass (BK7)", 1.5046, 0.00420),
    ("Flint glass (SF11)", 1.7432, 0.01160),
    ("Fused silica",      1.4580, 0.00354),
]

wavelengths = [
    (400, "Violet"), (450, "Blue"), (500, "Cyan"),
    (550, "Green"), (600, "Yellow"), (650, "Orange"), (700, "Red"),
]

apex = 60  # degrees — standard prism

print("=== Prism Dispersion Analysis ===")
print(f"Apex angle: {apex}°\\n")

for glass_name, A, B in glasses:
    print(f"--- {glass_name} ---")
    print(f"{'Wavelength':>11} {'Colour':<8} {'n':>7} {'Deviation (°)':>14}")
    print("-" * 42)

    deviations = []
    for lam, colour in wavelengths:
        n = cauchy_n(lam, A, B)
        dev = prism_deviation(n, apex)
        deviations.append(dev)
        print(f"{lam:>8} nm {colour:<8} {n:>7.4f} {dev:>12.2f}°")

    spread = max(deviations) - min(deviations)
    print(f"Angular spread (violet-red): {spread:.2f}°\\n")

# Compare dispersion power
print("=== Abbe Number (Dispersion Power) ===")
print("Lower Abbe number = higher dispersion\\n")
for glass_name, A, B in glasses:
    n_d = cauchy_n(587.6, A, B)  # yellow d-line
    n_F = cauchy_n(486.1, A, B)  # blue F-line
    n_C = cauchy_n(656.3, A, B)  # red C-line
    abbe = (n_d - 1) / (n_F - n_C)
    print(f"{glass_name:<24} Abbe number: {abbe:.1f}")

print("\\nFlint glass has lower Abbe number = more dispersion")
print("Crown glass has higher Abbe number = less dispersion")
print("Combining both corrects chromatic aberration (achromat)")`,
      challenge: 'An achromatic doublet combines a crown glass converging lens with a flint glass diverging lens to cancel chromatic aberration. If crown glass has Abbe number V₁ = 64 and flint glass V₂ = 25, and the desired combined focal length is 100 mm, calculate f₁ and f₂ using: f₁ = f × (1 - V₂/V₁) and f₂ = f × (1 - V₁/V₂). This is how every camera lens and telescope eyepiece is designed.',
      successHint: 'Dispersion and the Cauchy equation are fundamental to optical design. Every lens in your phone camera, every pair of glasses, and every scientific instrument uses carefully chosen glass types to control how different wavelengths behave. You now understand why glass choice matters as much as lens shape.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Geometric optics and wave fundamentals</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 2 covers ray tracing, the thin lens equation, total internal reflection, diffraction, and colour dispersion.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {loadProgress}</>) : (<><Sparkles className="w-5 h-5" /> Load Python</>)}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson
            key={i}
            id={`L2-${i + 1}`}
            number={i + 1}
            title={lesson.title}
            concept={lesson.concept}
            analogy={lesson.analogy}
            storyConnection={lesson.storyConnection}
            checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer}
            codeIntro={lesson.codeIntro}
            code={lesson.code}
            challenge={lesson.challenge}
            successHint={lesson.successHint}
          />
        ))}
      </div>
    </div>
  );
}
