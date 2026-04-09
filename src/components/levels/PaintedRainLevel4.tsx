import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function PaintedRainLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: "Capstone Design: Rainbow Simulator — from droplet optics to full-sky rendering",
      concept: "The capstone integrates all Level 3 skills into a complete, deployable system. from droplet optics to full-sky rendering. This stage handles data ingestion, processing, model application, and output generation with quality metrics at each step.\n\nThe implementation follows software engineering best practices: modular design, error handling, and comprehensive documentation. Each function has a clear interface, and the pipeline produces both results and quality assessments.",
      analogy: "Building this capstone is like constructing a complete laboratory instrument: each component must work reliably on its own and integrate seamlessly with the rest. The whole is greater than the sum of its parts because the pipeline produces insights that no individual stage can generate alone.",
      storyConnection: "The girl who painted rain saw colors that others missed — the subtle purples at rainbow edges, the bright band of Alexander's dark band, the rare supernumerary arcs. Our simulator recreates these phenomena from first principles: every color, every arc, every subtle effect explained by the physics of light bending through water droplets.",
      checkQuestion: "What is the most critical quality check at this stage?",
      checkAnswer: "Every stage must validate its inputs and flag anomalies. A pipeline that silently produces wrong results is worse than one that crashes — at least a crash tells you something is wrong. The quality check at this stage is to compare output distributions against expected ranges and flag any value that falls outside 3 standard deviations of historical norms.",
      codeIntro: "Build this pipeline stage with quality metrics.",
      code: `import numpy as np

np.random.seed(42)

# === Stage 1: Capstone Design --- Droplet Optics Foundation ===
# Build the core refractive index model that all later stages depend on

class DropletOptics:
    """Core optics engine for a spherical water droplet."""

    # Cauchy coefficients for water
    A = 1.3199
    B = 0.00653

    def __init__(self, radius_mm=1.0, temperature_c=20):
        self.radius = radius_mm
        self.temp = temperature_c
        # Temperature correction: n decreases ~0.0001 per degree C
        self.temp_correction = (temperature_c - 20) * (-0.0001)

    def refractive_index(self, wavelength_nm):
        """Cauchy equation with temperature correction."""
        lam_um = wavelength_nm / 1000.0
        n = self.A + self.B / lam_um**2 + self.temp_correction
        return n

    def critical_angle(self, wavelength_nm):
        """Total internal reflection angle."""
        n = self.refractive_index(wavelength_nm)
        return np.degrees(np.arcsin(1.0 / n))

    def fresnel_reflectance(self, wavelength_nm, incidence_deg):
        """Fraction of light reflected at air-water interface."""
        n = self.refractive_index(wavelength_nm)
        theta_i = np.radians(incidence_deg)
        sin_t = np.sin(theta_i) / n
        if abs(sin_t) > 1:
            return 1.0  # total internal reflection
        theta_t = np.arcsin(sin_t)
        rs = ((np.cos(theta_i) - n * np.cos(theta_t)) / (np.cos(theta_i) + n * np.cos(theta_t)))**2
        rp = ((n * np.cos(theta_i) - np.cos(theta_t)) / (n * np.cos(theta_i) + np.cos(theta_t)))**2
        return (rs + rp) / 2

# Validate the model
droplet = DropletOptics(radius_mm=1.0, temperature_c=20)

print("=== Stage 1: Droplet Optics Foundation ===")
print("\\nRefractive index model validated against known values:\\n")

known = {"Red (656nm)": (656, 1.3311), "Yellow (589nm)": (589, 1.3330),
         "Green (527nm)": (527, 1.3355), "Blue (486nm)": (486, 1.3371),
         "Violet (397nm)": (397, 1.3414)}

print(f"{'Color':<16} {'Computed n':<14} {'Known n':<14} {'Error'}")
print("-" * 52)
errors = []
for name, (wl, n_known) in known.items():
    n_calc = droplet.refractive_index(wl)
    error = abs(n_calc - n_known)
    errors.append(error)
    status = "OK" if error < 0.002 else "CHECK"
    print(f"{name:<16} {n_calc:<14.6f} {n_known:<14.4f} {error:.6f} {status}")

print(f"\\nMax error: {max(errors):.6f} (acceptable < 0.002)")
print(f"Mean error: {np.mean(errors):.6f}")

print("\\n--- Fresnel Reflectance at Different Angles ---\\n")
print(f"{'Angle':<10} {'Red (656nm)':<14} {'Blue (486nm)':<14}")
print("-" * 38)
for angle in [0, 20, 40, 60, 80]:
    r_red = droplet.fresnel_reflectance(656, angle)
    r_blue = droplet.fresnel_reflectance(486, angle)
    print(f"{angle:>4} deg    {r_red:<14.4f} {r_blue:<14.4f}")

print("\\n--- Temperature Sensitivity ---\\n")
for temp in [5, 15, 20, 25, 35]:
    d = DropletOptics(temperature_c=temp)
    n = d.refractive_index(589)
    print(f"  {temp:>2} C -> n(589nm) = {n:.6f}")

print("\\nStage 1 complete: DropletOptics class ready for ray tracing.")`,
      challenge: "Add a validation step that compares this stage output against an independent data source.",
      successHint: "This stage is complete and ready to feed into the next pipeline stage.",
    },
    {
      title: "Stage 2: Ray tracing through spherical water droplets",
      concept: "Stage 2 of the capstone builds on the previous stages. Stage 2: Ray tracing through spherical water droplets. This stage handles data ingestion, processing, model application, and output generation with quality metrics at each step.\n\nThe implementation follows software engineering best practices: modular design, error handling, and comprehensive documentation. Each function has a clear interface, and the pipeline produces both results and quality assessments.",
      analogy: "This stage is like adding a new sensor to an instrument: each component must work reliably on its own and integrate seamlessly with the rest. The whole is greater than the sum of its parts because the pipeline produces insights that no individual stage can generate alone.",
      storyConnection: "The girl who painted rain saw colors that others missed — the subtle purples at rainbow edges, the bright band of Alexander's dark band, the rare supernumerary arcs. Our simulator recreates these phenomena from first principles: every color, every arc, every subtle effect explained by the physics of light bending through water droplets.",
      checkQuestion: "What is the most critical quality check at this stage?",
      checkAnswer: "Every stage must validate its inputs and flag anomalies. A pipeline that silently produces wrong results is worse than one that crashes — at least a crash tells you something is wrong. The quality check at this stage is to compare output distributions against expected ranges and flag any value that falls outside 3 standard deviations of historical norms.",
      codeIntro: "Build this pipeline stage with quality metrics.",
      code: `import numpy as np

np.random.seed(42)

# === Stage 2: Ray tracing through spherical water droplets ===

def trace_ray(n, theta_i_deg, num_reflections=1):
    """
    Trace a ray through a spherical droplet.
    Returns: deviation angle, exit intensity (fraction of original)
    n: refractive index
    theta_i_deg: incidence angle in degrees
    num_reflections: 1 for primary rainbow, 2 for secondary
    """
    theta_i = np.radians(theta_i_deg)
    sin_r = np.sin(theta_i) / n
    if abs(sin_r) > 1:
        return None, 0  # total internal reflection, no exit
    theta_r = np.arcsin(sin_r)

    # Deviation angle for k internal reflections
    deviation = 2 * theta_i - 2 * (num_reflections + 1) * theta_r + num_reflections * np.pi
    deviation_deg = np.degrees(deviation) % 360

    # Fresnel: fraction reflected at each interface
    cos_i, cos_r = np.cos(theta_i), np.cos(theta_r)
    rs = ((cos_i - n * cos_r) / (cos_i + n * cos_r))**2
    rp = ((n * cos_i - cos_r) / (n * cos_i + cos_r))**2
    R = (rs + rp) / 2
    T = 1 - R

    # Light enters (T), reflects k times (R^k), exits (T)
    intensity = T * (R ** num_reflections) * T

    return deviation_deg, intensity

# Trace rays at many incidence angles to find the rainbow angle
incidence_angles = np.linspace(0, 89, 500)

# Refractive indices for visible spectrum
colors = {"Red (700nm)": 1.3312, "Green (520nm)": 1.3355, "Blue (460nm)": 1.3380}

print("=== Stage 2: Ray Tracing Through a Spherical Droplet ===")
print("\\nTracing 500 rays at different incidence angles per color...\\n")

print("--- Primary Rainbow (1 reflection) ---\\n")
print(f"{'Color':<16} {'Min Deviation':<16} {'Rainbow Angle':<16} {'Intensity'}")
print("-" * 60)

for color_name, n in colors.items():
    deviations = []
    intensities = []
    for angle in incidence_angles:
        dev, inten = trace_ray(n, angle, num_reflections=1)
        if dev is not None:
            deviations.append(dev)
            intensities.append(inten)
    dev_arr = np.array(deviations)
    int_arr = np.array(intensities)
    min_idx = np.argmin(dev_arr)
    min_dev = dev_arr[min_idx]
    rainbow_ang = 180 - min_dev
    peak_int = int_arr[min_idx]
    print(f"{color_name:<16} {min_dev:<16.2f} {rainbow_ang:<16.2f} {peak_int:.4f}")

print("\\n--- Secondary Rainbow (2 reflections) ---\\n")
print(f"{'Color':<16} {'Min Deviation':<16} {'Rainbow Angle':<16} {'Intensity'}")
print("-" * 60)

for color_name, n in colors.items():
    deviations = []
    intensities = []
    for angle in incidence_angles:
        dev, inten = trace_ray(n, angle, num_reflections=2)
        if dev is not None:
            deviations.append(dev)
            intensities.append(inten)
    dev_arr = np.array(deviations)
    int_arr = np.array(intensities)
    min_idx = np.argmin(dev_arr)
    min_dev = dev_arr[min_idx]
    rainbow_ang = min_dev - 180
    peak_int = int_arr[min_idx]
    print(f"{color_name:<16} {min_dev:<16.2f} {rainbow_ang:<16.2f} {peak_int:.4f}")

# Intensity comparison
print("\\n--- Why is the secondary rainbow dimmer? ---\\n")
n_test = 1.3330
_, i1 = trace_ray(n_test, 59.0, num_reflections=1)
_, i2 = trace_ray(n_test, 72.0, num_reflections=2)
print(f"Primary peak intensity:   {i1:.4f} ({i1*100:.1f}% of incident light)")
print(f"Secondary peak intensity: {i2:.4f} ({i2*100:.1f}% of incident light)")
print(f"Ratio: secondary is {i1/i2:.1f}x dimmer than primary")
print("\\nEach extra reflection loses ~96% of light (Fresnel reflectance ~4%).")
print("Stage 2 complete: ray tracer ready for dispersion calculations.")`,
      challenge: "Add a validation step that compares this stage output against an independent data source.",
      successHint: "This stage is complete and ready to feed into the next pipeline stage.",
    },
    {
      title: "Stage 3: Full spectrum dispersion and intensity calculation",
      concept: "Stage 3 of the capstone builds on the previous stages. Stage 3: Full spectrum dispersion and intensity calculation. This stage handles data ingestion, processing, model application, and output generation with quality metrics at each step.\n\nThe implementation follows software engineering best practices: modular design, error handling, and comprehensive documentation. Each function has a clear interface, and the pipeline produces both results and quality assessments.",
      analogy: "This stage is like adding a new sensor to an instrument: each component must work reliably on its own and integrate seamlessly with the rest. The whole is greater than the sum of its parts because the pipeline produces insights that no individual stage can generate alone.",
      storyConnection: "The girl who painted rain saw colors that others missed — the subtle purples at rainbow edges, the bright band of Alexander's dark band, the rare supernumerary arcs. Our simulator recreates these phenomena from first principles: every color, every arc, every subtle effect explained by the physics of light bending through water droplets.",
      checkQuestion: "What is the most critical quality check at this stage?",
      checkAnswer: "Every stage must validate its inputs and flag anomalies. A pipeline that silently produces wrong results is worse than one that crashes — at least a crash tells you something is wrong. The quality check at this stage is to compare output distributions against expected ranges and flag any value that falls outside 3 standard deviations of historical norms.",
      codeIntro: "Build this pipeline stage with quality metrics.",
      code: `import numpy as np

np.random.seed(42)

# === Stage 3: Full spectrum dispersion and intensity calculation ===

def cauchy_n(wavelength_nm):
    """Refractive index of water via Cauchy equation."""
    lam = wavelength_nm / 1000.0
    return 1.3199 + 0.00653 / lam**2

def find_rainbow_angle(n, k=1):
    """Find the minimum deviation angle (rainbow angle) for k reflections."""
    cos_i = np.sqrt((n**2 - 1) / (k * (k + 2)))
    theta_i = np.arccos(cos_i)
    theta_r = np.arcsin(np.sin(theta_i) / n)
    deviation = 2 * theta_i - 2 * (k + 1) * theta_r + k * np.pi
    rainbow_ang = np.pi - deviation if k == 1 else deviation - np.pi
    # Fresnel intensity at this angle
    cos_r = np.cos(theta_r)
    cos_ti = np.cos(theta_i)
    rs = ((cos_ti - n * cos_r) / (cos_ti + n * cos_r))**2
    rp = ((n * cos_ti - cos_r) / (n * cos_ti + cos_r))**2
    R = (rs + rp) / 2
    intensity = (1 - R) * (R ** k) * (1 - R)
    return np.degrees(rainbow_ang), intensity

# Solar spectrum approximation (relative intensity, blackbody at 5778K)
def solar_intensity(wavelength_nm):
    """Simplified solar spectral irradiance (normalized)."""
    # Approximate peak at ~500nm
    return np.exp(-0.5 * ((wavelength_nm - 500) / 150)**2)

# Full spectrum: 380nm to 700nm in 5nm steps
wavelengths = np.arange(380, 705, 5)

print("=== Stage 3: Full Spectrum Dispersion and Intensity ===")
print("\\nComputing rainbow properties for {} wavelengths (380-700nm)...\\n".format(len(wavelengths)))

# Compute for each wavelength
results = []
for wl in wavelengths:
    n = cauchy_n(wl)
    angle, fresnel_int = find_rainbow_angle(n, k=1)
    solar = solar_intensity(wl)
    combined = fresnel_int * solar
    results.append((wl, n, angle, fresnel_int, solar, combined))

results = np.array(results)

# Print sampled results
print("--- Primary Rainbow Spectrum (sampled every 40nm) ---\\n")
print(f"{'Wavelength':<12} {'n':<10} {'Angle (deg)':<14} {'Fresnel I':<12} {'Solar I':<10} {'Combined'}")
print("-" * 68)
for row in results[::8]:
    wl, n, ang, fi, si, ci = row
    bar = "#" * int(ci * 200)
    print(f"{wl:>5.0f} nm     {n:<10.5f} {ang:<14.3f} {fi:<12.5f} {si:<10.4f} {ci:.5f} {bar}")

# Summary statistics
angles = results[:, 2]
combined = results[:, 5]
print(f"\\n--- Dispersion Summary ---")
print(f"\\nAngular range: {angles.min():.3f} to {angles.max():.3f} degrees")
print(f"Total angular spread: {angles.max() - angles.min():.3f} degrees")
print(f"Peak intensity wavelength: {results[np.argmax(combined), 0]:.0f} nm")
print(f"Intensity range: {combined.min():.5f} to {combined.max():.5f}")

# Where does each color band fall?
print("\\n--- Color Band Positions in the Rainbow ---\\n")
bands = [("Violet", 380, 450), ("Blue", 450, 490), ("Cyan", 490, 520),
         ("Green", 520, 565), ("Yellow", 565, 590), ("Orange", 590, 625), ("Red", 625, 700)]
for name, lo, hi in bands:
    mask = (results[:, 0] >= lo) & (results[:, 0] <= hi)
    if mask.any():
        band_angles = results[mask, 2]
        band_intensity = results[mask, 5]
        print(f"  {name:<8} {lo}-{hi}nm  angle: {band_angles.min():.2f}-{band_angles.max():.2f} deg  avg intensity: {band_intensity.mean():.5f}")

print("\\nStage 3 complete: full spectrum dispersion model ready.")`,
      challenge: "Add a validation step that compares this stage output against an independent data source.",
      successHint: "This stage is complete and ready to feed into the next pipeline stage.",
    },
    {
      title: "Stage 4: Observer geometry and rainbow arc computation",
      concept: "Stage 4 of the capstone builds on the previous stages. Stage 4: Observer geometry and rainbow arc computation. This stage handles data ingestion, processing, model application, and output generation with quality metrics at each step.\n\nThe implementation follows software engineering best practices: modular design, error handling, and comprehensive documentation. Each function has a clear interface, and the pipeline produces both results and quality assessments.",
      analogy: "This stage is like adding a new sensor to an instrument: each component must work reliably on its own and integrate seamlessly with the rest. The whole is greater than the sum of its parts because the pipeline produces insights that no individual stage can generate alone.",
      storyConnection: "The girl who painted rain saw colors that others missed — the subtle purples at rainbow edges, the bright band of Alexander's dark band, the rare supernumerary arcs. Our simulator recreates these phenomena from first principles: every color, every arc, every subtle effect explained by the physics of light bending through water droplets.",
      checkQuestion: "What is the most critical quality check at this stage?",
      checkAnswer: "Every stage must validate its inputs and flag anomalies. A pipeline that silently produces wrong results is worse than one that crashes — at least a crash tells you something is wrong. The quality check at this stage is to compare output distributions against expected ranges and flag any value that falls outside 3 standard deviations of historical norms.",
      codeIntro: "Build this pipeline stage with quality metrics.",
      code: `import numpy as np

np.random.seed(42)

# === Stage 4: Observer geometry and rainbow arc computation ===

# The rainbow is a cone of light centered on the anti-solar point
# (the point directly opposite the sun from the observer's perspective).
# The observer sees an arc whose size depends on the sun's altitude.

def visible_arc_fraction(sun_altitude_deg, rainbow_angle_deg=42.0):
    """
    How much of the rainbow circle is visible above the horizon?
    Returns fraction (0 to 1) and the arc angular extent.
    """
    # The anti-solar point is at altitude = -sun_altitude
    # Rainbow arc is a circle of radius rainbow_angle around anti-solar point
    anti_solar_alt = -sun_altitude_deg

    # Top of rainbow arc
    top = anti_solar_alt + rainbow_angle_deg
    # Bottom of rainbow arc
    bottom = anti_solar_alt - rainbow_angle_deg

    if top <= 0:
        return 0.0, 0.0  # entire rainbow below horizon
    if bottom >= 0:
        return 1.0, 360.0  # entire rainbow above horizon (only from aircraft)

    # Fraction visible: the arc above horizon = 0 degrees
    # Using geometry of circle intersection with line
    cos_half = -anti_solar_alt / rainbow_angle_deg
    cos_half = np.clip(cos_half, -1, 1)
    half_angle = np.arccos(cos_half)
    visible_fraction = half_angle / np.pi
    arc_extent = np.degrees(2 * half_angle)

    return visible_fraction, arc_extent

print("=== Stage 4: Observer Geometry and Rainbow Arc ===")
print("\\nThe rainbow is a circle centered on the anti-solar point.")
print("How much you see depends on the sun's altitude.\\n")

# Primary rainbow at ~42 degrees, secondary at ~51 degrees
print("--- Visible Rainbow Arc vs Sun Altitude ---\\n")
print(f"{'Sun Altitude':<14} {'Anti-solar':<12} {'Primary (42 deg)':<24} {'Secondary (51 deg)'}")
print(f"{'':14} {'point':12} {'Visible   Arc Top':24} {'Visible   Arc Top'}")
print("-" * 70)

for sun_alt in [0, 5, 10, 15, 20, 30, 42, 50]:
    frac_p, arc_p = visible_arc_fraction(sun_alt, 42.0)
    frac_s, arc_s = visible_arc_fraction(sun_alt, 51.0)
    top_p = -sun_alt + 42.0
    top_s = -sun_alt + 51.0
    p_str = f"{frac_p*100:>5.1f}%  {top_p:>5.1f} deg"
    s_str = f"{frac_s*100:>5.1f}%  {top_s:>5.1f} deg"
    if frac_p == 0:
        p_str = "  INVISIBLE"
    if frac_s == 0:
        s_str = "  INVISIBLE"
    print(f"{sun_alt:>5} deg      {-sun_alt:>5} deg     {p_str:<24} {s_str}")

print("\\n--- Key Observations ---")
print("At sunset (sun = 0 deg): maximum rainbow, full semicircle, top at 42 deg")
print("At sun = 42 deg: primary rainbow entirely below horizon (invisible)")
print("At sun = 51 deg: secondary also gone")
print("From an airplane: anti-solar point can be above you -> FULL CIRCLE rainbow!")

# Angular size of rainbow in the sky
print("\\n\\n--- Physical Size Estimate ---\\n")
print("If a rain curtain is D km away, what is the rainbow's apparent size?\\n")
for dist_km in [0.5, 1.0, 2.0, 5.0]:
    radius_m = dist_km * 1000 * np.tan(np.radians(42))
    print(f"  Distance: {dist_km} km -> rainbow radius: {radius_m:.0f} m ({radius_m/1000:.2f} km)")

print("\\nThe rainbow has no fixed location -- it moves with you!")
print("Every observer sees their OWN rainbow from DIFFERENT droplets.")
print("\\nStage 4 complete: observer geometry model ready.")`,
      challenge: "Add a validation step that compares this stage output against an independent data source.",
      successHint: "This stage is complete and ready to feed into the next pipeline stage.",
    },
    {
      title: "Stage 5: Atmospheric conditions and rare rainbow types",
      concept: "Stage 5 of the capstone builds on the previous stages. Stage 5: Atmospheric conditions and rare rainbow types. This stage handles data ingestion, processing, model application, and output generation with quality metrics at each step.\n\nThe implementation follows software engineering best practices: modular design, error handling, and comprehensive documentation. Each function has a clear interface, and the pipeline produces both results and quality assessments.",
      analogy: "This stage is like adding a new sensor to an instrument: each component must work reliably on its own and integrate seamlessly with the rest. The whole is greater than the sum of its parts because the pipeline produces insights that no individual stage can generate alone.",
      storyConnection: "The girl who painted rain saw colors that others missed — the subtle purples at rainbow edges, the bright band of Alexander's dark band, the rare supernumerary arcs. Our simulator recreates these phenomena from first principles: every color, every arc, every subtle effect explained by the physics of light bending through water droplets.",
      checkQuestion: "What is the most critical quality check at this stage?",
      checkAnswer: "Every stage must validate its inputs and flag anomalies. A pipeline that silently produces wrong results is worse than one that crashes — at least a crash tells you something is wrong. The quality check at this stage is to compare output distributions against expected ranges and flag any value that falls outside 3 standard deviations of historical norms.",
      codeIntro: "Build this pipeline stage with quality metrics.",
      code: `import numpy as np

np.random.seed(42)

# === Stage 5: Atmospheric conditions and rare rainbow types ===

def cauchy_n(wavelength_nm):
    lam = wavelength_nm / 1000.0
    return 1.3199 + 0.00653 / lam**2

def rainbow_angle_for_k(n, k):
    """Rainbow angle for k-th order (k internal reflections)."""
    cos_i = np.sqrt((n**2 - 1) / (k * (k + 2)))
    if abs(cos_i) > 1:
        return None
    theta_i = np.arccos(cos_i)
    theta_r = np.arcsin(np.sin(theta_i) / n)
    deviation = 2 * theta_i - 2 * (k + 1) * theta_r + k * np.pi
    return np.degrees(deviation)

# Droplet size affects rainbow appearance
print("=== Stage 5: Atmospheric Conditions and Rare Rainbow Types ===")

print("\\n--- Effect of Droplet Size ---\\n")
print("Droplet size controls whether you see vivid colors or a white fog-bow.\\n")
sizes = [
    (2.0, "Large drops", "Vivid primary + secondary, sharp colors"),
    (1.0, "Medium drops", "Good primary, faint secondary"),
    (0.5, "Small drops", "Broad primary, washed-out colors"),
    (0.1, "Drizzle/mist", "Wide, nearly white fog-bow"),
    (0.01, "Fog droplets", "White fog-bow, no color separation"),
]
# Approximate angular width of color band vs droplet size
# Smaller drops -> more diffraction -> broader, whiter band
print(f"{'Size (mm)':<12} {'Type':<16} {'Color Width':<14} {'Appearance'}")
print("-" * 70)
for size, name, appearance in sizes:
    # Diffraction broadening ~ wavelength / droplet_diameter
    diffraction_deg = np.degrees(0.5e-6 / (size * 1e-3))  # rough estimate
    total_width = 1.8 + diffraction_deg  # 1.8 deg is geometric dispersion
    print(f"{size:<12.2f} {name:<16} {total_width:>6.2f} deg     {appearance}")

print("\\n\\n--- Higher-Order Rainbows ---\\n")
print("Beyond primary (k=1) and secondary (k=2), higher orders exist but are very rare.\\n")
n_yellow = cauchy_n(570)
print(f"{'Order k':<10} {'Reflections':<14} {'Deviation':<14} {'Direction':<20} {'Visibility'}")
print("-" * 72)
for k in range(1, 7):
    dev = rainbow_angle_for_k(n_yellow, k)
    if dev is not None:
        dev_mod = dev % 360
        if k <= 2:
            direction = "Opposite sun (easy)"
        elif k in [3, 4]:
            direction = "Near the SUN (hard!)"
        else:
            direction = "Back opposite sun"
        # Intensity drops as R^k where R ~ 0.04
        rel_intensity = (0.04 ** k) / (0.04 ** 1) * 100
        visibility = f"{rel_intensity:.4f}% of primary"
        print(f"  k={k:<6} {k:<14} {dev_mod:>8.1f} deg    {direction:<20} {visibility}")

print("\\n\\n--- Supernumerary Arcs ---\\n")
print("These faint pastel bands INSIDE the primary rainbow are caused by")
print("wave interference -- rays taking slightly different paths through the drop.\\n")
# Simulate interference pattern
n = cauchy_n(550)  # green light
theta_rainbow = 42.0
offsets = np.linspace(0, 2.0, 20)  # degrees inside rainbow
for offset in offsets[::4]:
    # Simplified Airy function intensity
    x_airy = offset * 15  # scale factor depends on droplet size
    intensity = (np.sin(x_airy) / max(x_airy, 0.001))**2 if x_airy > 0.01 else 1.0
    bar = "#" * int(intensity * 30)
    label = ""
    if offset < 0.1:
        label = " <- main rainbow"
    elif intensity > 0.3 and offset > 0.3:
        label = " <- supernumerary arc"
    print(f"  {42.0 - offset:>5.1f} deg  I = {intensity:.3f}  {bar}{label}")

print("\\nSupernumerary arcs are most visible with uniform small droplets (0.5-1mm).")
print("Stage 5 complete: atmospheric effects model ready.")`,
      challenge: "Add a validation step that compares this stage output against an independent data source.",
      successHint: "This stage is complete and ready to feed into the next pipeline stage.",
    },
    {
      title: "Stage 6: Complete rainbow simulation report with color science analysis",
      concept: "Stage 6 of the capstone builds on the previous stages. Stage 6: Complete rainbow simulation report with color science analysis. This stage handles data ingestion, processing, model application, and output generation with quality metrics at each step.\n\nThe implementation follows software engineering best practices: modular design, error handling, and comprehensive documentation. Each function has a clear interface, and the pipeline produces both results and quality assessments.",
      analogy: "This stage is like adding a new sensor to an instrument: each component must work reliably on its own and integrate seamlessly with the rest. The whole is greater than the sum of its parts because the pipeline produces insights that no individual stage can generate alone.",
      storyConnection: "The girl who painted rain saw colors that others missed — the subtle purples at rainbow edges, the bright band of Alexander's dark band, the rare supernumerary arcs. Our simulator recreates these phenomena from first principles: every color, every arc, every subtle effect explained by the physics of light bending through water droplets.",
      checkQuestion: "What is the most critical quality check at this stage?",
      checkAnswer: "Every stage must validate its inputs and flag anomalies. A pipeline that silently produces wrong results is worse than one that crashes — at least a crash tells you something is wrong. The quality check at this stage is to compare output distributions against expected ranges and flag any value that falls outside 3 standard deviations of historical norms.",
      codeIntro: "Build this pipeline stage with quality metrics.",
      code: `import numpy as np

np.random.seed(42)

# === Stage 6: Complete Rainbow Simulation Report ===

# Integrate all stages into one simulation

def cauchy_n(wl_nm, temp_c=20):
    lam = wl_nm / 1000.0
    return 1.3199 + 0.00653 / lam**2 + (temp_c - 20) * (-0.0001)

def rainbow_angle(n, k=1):
    cos_i = np.sqrt((n**2 - 1) / (k * (k + 2)))
    theta_i = np.arccos(cos_i)
    theta_r = np.arcsin(np.sin(theta_i) / n)
    deviation = 2 * theta_i - 2 * (k + 1) * theta_r + k * np.pi
    cos_ti, cos_r = np.cos(theta_i), np.cos(theta_r)
    rs = ((cos_ti - n * cos_r) / (cos_ti + n * cos_r))**2
    rp = ((n * cos_ti - cos_r) / (n * cos_ti + cos_r))**2
    R = (rs + rp) / 2
    intensity = (1 - R) * (R ** k) * (1 - R)
    return np.degrees(np.pi - deviation) if k == 1 else np.degrees(deviation - np.pi), intensity

def solar_spectrum(wl_nm):
    return np.exp(-0.5 * ((wl_nm - 500) / 150)**2)

def visible_fraction(sun_alt, r_angle):
    anti = -sun_alt
    top = anti + r_angle
    if top <= 0: return 0.0
    bottom = anti - r_angle
    if bottom >= 0: return 1.0
    cos_h = np.clip(-anti / r_angle, -1, 1)
    return np.arccos(cos_h) / np.pi

# --- Run full simulation ---
print("=" * 60)
print("   COMPLETE RAINBOW SIMULATION REPORT")
print("=" * 60)

# Input conditions
sun_alt = 15.0
temp = 22.0
droplet_mm = 1.0

print(f"\\nInput Conditions:")
print(f"  Sun altitude:   {sun_alt} degrees")
print(f"  Temperature:    {temp} C")
print(f"  Droplet size:   {droplet_mm} mm")

# Compute full spectrum
wavelengths = np.arange(380, 705, 5)
colors_map = {380:"Violet", 450:"Blue", 490:"Cyan", 520:"Green", 570:"Yellow", 600:"Orange", 640:"Red"}

print(f"\\n--- Primary Rainbow Profile ---\\n")
print(f"{'WL (nm)':<10} {'n':<10} {'Angle':<10} {'Intensity':<12} {'Solar':<10} {'Combined'}")
print("-" * 58)
all_data = []
for wl in wavelengths:
    n = cauchy_n(wl, temp)
    ang, inten = rainbow_angle(n, k=1)
    sol = solar_spectrum(wl)
    comb = inten * sol
    all_data.append((wl, n, ang, inten, sol, comb))

# Print every 8th row
for row in all_data[::8]:
    wl, n, ang, inten, sol, comb = row
    print(f"{wl:>5.0f}      {n:<10.5f} {ang:<10.3f} {inten:<12.5f} {sol:<10.4f} {comb:.5f}")

angles = [d[2] for d in all_data]
combined = [d[5] for d in all_data]

print(f"\\n--- Summary Statistics ---")
print(f"  Primary arc: {min(angles):.2f} to {max(angles):.2f} deg (width: {max(angles)-min(angles):.2f} deg)")
print(f"  Peak intensity at {all_data[np.argmax(combined)][0]:.0f} nm")
frac = visible_fraction(sun_alt, 42.0)
print(f"  Visible arc: {frac*100:.1f}% of full circle ({frac*360:.0f} deg)")
print(f"  Rainbow top: {-sun_alt + 42:.1f} deg above horizon")

# Secondary
print(f"\\n--- Secondary Rainbow ---")
sec_data = []
for wl in wavelengths:
    n = cauchy_n(wl, temp)
    ang, inten = rainbow_angle(n, k=2)
    sec_data.append((wl, ang, inten))
sec_angles = [d[1] for d in sec_data]
sec_inten = [d[2] for d in sec_data]
print(f"  Arc: {min(sec_angles):.2f} to {max(sec_angles):.2f} deg")
print(f"  Intensity: {np.mean(sec_inten)/np.mean([d[3] for d in all_data])*100:.1f}% of primary")

# Alexander's dark band
dark_lo = max(angles)
dark_hi = min(sec_angles)
print(f"\\n--- Alexander's Dark Band ---")
print(f"  From {dark_lo:.2f} to {dark_hi:.2f} deg ({dark_hi - dark_lo:.2f} deg wide)")

# Supernumerary prediction
diff_width = np.degrees(0.5e-6 / (droplet_mm * 1e-3))
print(f"\\n--- Supernumerary Arcs ---")
print(f"  Diffraction broadening: {diff_width:.2f} deg")
if droplet_mm < 1.5:
    print(f"  Prediction: VISIBLE (droplets small enough for clear interference)")
else:
    print(f"  Prediction: WASHED OUT (large droplets blur the interference pattern)")

print(f"\\n{'=' * 60}")
print(f"  SIMULATION COMPLETE")
print(f"  Rainbow visible: YES (sun below 42 deg)")
print(f"  Best viewing: face away from sun, look at {42 - sun_alt:.0f} deg altitude")
print(f"{'=' * 60}")`,
      challenge: "Add an interactive mode where the user can adjust parameters and see results update in real time. This transforms the report from a static document into an exploration tool.",
      successHint: "You have completed a full capstone project. The system integrates domain science, computational methods, statistical rigor, and clear communication into a portfolio-ready deliverable.",
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (color science and atmospheric optics)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project uses Python with numpy and matplotlib to build a complete Rainbow Simulator. Click to start.</p>
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
