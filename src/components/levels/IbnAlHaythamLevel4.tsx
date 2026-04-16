import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function IbnAlHaythamLevel4() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Capstone project: Design an Optics Simulator — system architecture',
      concept: `In this capstone project, you will build a complete **Optics Simulator** — a Python program that:

1. **Models optical elements** (lenses, mirrors, surfaces) as objects with physical properties
2. **Traces rays** through multi-element systems using Snell's law and the reflection law
3. **Calculates image formation** — position, magnification, and orientation
4. **Optimises lens designs** to minimise aberrations
5. **Generates a technical report** documenting the design

This brings together everything from Levels 1-3: Snell's law, the thin lens equation, aberrations, dispersion, diffraction limits, and the scientific method.

The first step is **system design** — defining the classes that represent optical elements and the interfaces between them. A well-designed architecture makes the ray tracing engine clean, testable, and extensible to new element types.

📚 *Ibn al-Haytham's systematic approach to optics — defining properties of light, surfaces, and their interactions — is the intellectual ancestor of object-oriented optical modelling. He treated each optical phenomenon as a separate, testable component of a larger system.*`,
      analogy: 'Before building a house, an architect draws blueprints showing every room, wall, and pipe. Before building an optics simulator, you draw a "software blueprint" showing every class, property, and method. The blueprint for an optics simulator has three core objects: Ray (the light), Surface (where light interacts), and Lens (a pair of surfaces with glass between them).',
      storyConnection: 'Ibn al-Haytham organised the Book of Optics into systematic chapters: the nature of light, reflection, refraction, the eye, and optical illusions — each building on the previous. His organisational structure is itself a form of system design: decomposing a complex problem into manageable, well-defined components.',
      checkQuestion: 'Why should a Ray object store both position AND direction, rather than just position?',
      checkAnswer: 'Because a ray is defined by where it is and where it\'s going. After refraction or reflection, the position stays the same (at the surface) but the direction changes. If you only stored position, you couldn\'t calculate where the ray goes next. Position + direction = complete specification of the ray\'s state at any point.',
      codeIntro: 'Design the architecture of the Optics Simulator — define the Ray, Surface, and Lens classes.',
      code: `import numpy as np

class Ray:
    """A light ray defined by position, direction, and wavelength."""

    def __init__(self, y, angle_deg, wavelength_nm=550):
        self.y = y                    # height above optical axis (mm)
        self.angle = angle_deg        # angle to optical axis (degrees)
        self.wavelength = wavelength_nm
        self.history = [(0.0, y)]     # (x, y) positions along the path

    def propagate(self, distance_mm):
        """Move ray forward by a distance along the axis."""
        dy = distance_mm * np.tan(np.radians(self.angle))
        self.y += dy
        last_x = self.history[-1][0]
        self.history.append((last_x + distance_mm, self.y))

    def __repr__(self):
        return f"Ray(y={self.y:.3f}, θ={self.angle:.2f}°, λ={self.wavelength}nm)"

class Surface:
    """An optical surface (flat, spherical, or parabolic)."""

    def __init__(self, radius, n_before, n_after, position_x=0):
        self.radius = radius        # mm (positive=convex, inf=flat)
        self.n_before = n_before    # refractive index before surface
        self.n_after = n_after      # refractive index after surface
        self.position_x = position_x

    def refract(self, ray):
        """Apply Snell's law at this surface."""
        # For a spherical surface: n1/s + n2/s' = (n2-n1)/R
        # Thin surface approximation: change ray angle
        if self.radius == float('inf'):  # flat surface
            # Snell's law: n1 sin(θ1) = n2 sin(θ2)
            sin_out = self.n_before * np.sin(np.radians(ray.angle)) / self.n_after
            sin_out = np.clip(sin_out, -1, 1)
            ray.angle = np.degrees(np.arcsin(sin_out))
        else:
            # Power of curved surface
            power = (self.n_after - self.n_before) / self.radius
            # Refraction: angle changes based on ray height and power
            ray.angle = ray.angle - np.degrees(ray.y * power / self.n_after)
        ray.history.append((self.position_x, ray.y))

class Lens:
    """A thin lens defined by focal length and position."""

    def __init__(self, focal_length, position_x, aperture_radius=25):
        self.f = focal_length        # mm
        self.position_x = position_x # mm along axis
        self.aperture = aperture_radius

    def refract(self, ray):
        """Apply thin lens equation to a ray."""
        if abs(ray.y) > self.aperture:
            return False  # ray blocked by aperture
        # Thin lens: deflects ray by -y/f
        ray.angle = ray.angle - np.degrees(np.arctan(ray.y / self.f))
        ray.history.append((self.position_x, ray.y))
        return True

# Test the architecture
print("=== Optics Simulator — Architecture Test ===\
")

# Create components
ray1 = Ray(y=10, angle_deg=0, wavelength_nm=550)
ray2 = Ray(y=5, angle_deg=0, wavelength_nm=550)
ray3 = Ray(y=-8, angle_deg=0, wavelength_nm=550)
lens = Lens(focal_length=50, position_x=100)

print("Components created:")
print(f"  {ray1}")
print(f"  {ray2}")
print(f"  {ray3}")
print(f"  Lens: f={lens.f}mm at x={lens.position_x}mm\
")

# Trace rays through the lens
for r in [ray1, ray2, ray3]:
    r.propagate(100)   # travel to lens
    lens.refract(r)     # refract at lens
    r.propagate(50)     # travel past lens

print("After tracing through lens (f=50mm):")
print(f"{'Ray':>5} {'y_in':>8} {'y_out':>8} {'Final angle':>12}")
print("-" * 35)
for i, r in enumerate([ray1, ray2, ray3], 1):
    print(f"  {i:>3} {r.history[1][1]:>6.1f}mm {r.y:>6.1f}mm {r.angle:>10.2f}°")

print(f"\
All parallel rays converge near x = {lens.position_x + lens.f}mm (focal point)")
print("Architecture verified. Next: multi-element ray tracing engine.")`,
      challenge: 'Add a Mirror class that reflects rays (angle_out = -angle_in relative to surface normal). Test it with a concave mirror of radius 100 mm. Verify that parallel rays converge at f = R/2 = 50 mm.',
      successHint: 'Good system design makes everything else easier. You defined Ray, Surface, and Lens classes with clear properties and methods. Real optical design software (Zemax, Code V, Oslo) uses exactly this architecture: objects representing optical elements with methods that transform rays. Ibn al-Haytham\'s systematic decomposition of optics into light, surfaces, and interactions is the conceptual ancestor of this design.',
    },
    {
      title: 'Building the ray tracing engine — tracing rays through multi-element systems',
      concept: `Now we build the core simulation engine: a function that takes a set of rays and a sequence of optical elements and traces each ray through the entire system.

The engine must:
1. **Sort elements** by position along the optical axis
2. **Propagate** each ray from one element to the next
3. **Apply refraction** at each surface using Snell's law
4. **Track the ray path** — record (x, y) at every interaction
5. **Handle edge cases** — rays that miss elements, total internal reflection, rays blocked by apertures

This is the heart of the simulator. Every optical design program, from phone camera optimisation to telescope engineering, runs a ray tracing engine that does exactly this — just with more sophisticated surface models and millions of rays.

📚 *Sequential ray tracing — processing elements in order along the axis — is the standard approach for imaging optics. Non-sequential tracing (for stray light analysis) lets rays hit any surface in any order, but is computationally much more expensive.*`,
      analogy: 'Imagine a ball rolling across a table through a series of ramps (lenses). At each ramp, the ball changes direction. The ray tracing engine is like tracking that ball: advance it to the next ramp, apply the direction change, advance to the next ramp, and so on. Simple in concept, powerful in practice — because you can stack as many ramps as you want.',
      storyConnection: 'Ibn al-Haytham\'s method in the Book of Optics was inherently sequential: he traced light from the source, through each interaction (reflection off a wall, refraction through glass, entry into the eye), step by step. His "trace the ray forward through the system" approach is exactly what our engine implements — a thousand years later, with code instead of geometry.',
      checkQuestion: 'A ray enters a two-lens system. Lens 1 (f=100mm) is at x=0, Lens 2 (f=50mm) is at x=150mm. The ray starts at y=20mm, parallel to the axis. Where does it cross the axis after Lens 2?',
      checkAnswer: 'After Lens 1: the ray aims toward the focal point at x=100mm, so at Lens 2 (x=150mm) it has descended to y = 20 × (1 - 150/100) = -10mm (below axis). Lens 2 refracts it upward. The combined system has an effective focal length shorter than either lens alone. The exact crossing point requires the full trace — which is why we build engines to do this automatically.',
      codeIntro: 'Build the sequential ray tracing engine and trace rays through a multi-element optical system.',
      code: `import numpy as np

class Ray:
    def __init__(self, y, angle_deg=0, wavelength_nm=550):
        self.y = y
        self.angle = angle_deg
        self.wavelength = wavelength_nm
        self.path = [(0.0, y)]
        self.alive = True

class ThinLens:
    def __init__(self, f, x_pos, aperture=25):
        self.f = f
        self.x = x_pos
        self.aperture = aperture
        self.label = f"Lens(f={f}mm)"

    def interact(self, ray):
        if abs(ray.y) > self.aperture:
            ray.alive = False
            return
        ray.angle -= np.degrees(np.arctan(ray.y / self.f))
        ray.path.append((self.x, ray.y))

class FlatMirror:
    def __init__(self, x_pos, aperture=25):
        self.x = x_pos
        self.aperture = aperture
        self.label = "Flat mirror"

    def interact(self, ray):
        if abs(ray.y) > self.aperture:
            ray.alive = False
            return
        ray.angle = -ray.angle
        ray.path.append((self.x, ray.y))

def trace_system(rays, elements, screen_x):
    """
    Sequential ray tracing engine.
    Traces each ray through all elements in order, then to the screen.
    """
    # Sort elements by position
    elements_sorted = sorted(elements, key=lambda e: e.x)

    for ray in rays:
        if not ray.alive:
            continue
        current_x = 0

        for elem in elements_sorted:
            if not ray.alive:
                break
            # Propagate to element
            dx = elem.x - current_x
            if dx > 0:
                ray.y += dx * np.tan(np.radians(ray.angle))
                ray.path.append((elem.x, ray.y))
            # Interact with element
            elem.interact(ray)
            current_x = elem.x

        # Propagate to screen
        if ray.alive and screen_x > current_x:
            dx = screen_x - current_x
            ray.y += dx * np.tan(np.radians(ray.angle))
            ray.path.append((screen_x, ray.y))

    return rays

# === Test 1: Single lens ===
print("=== Test 1: Single Converging Lens ===")
f1 = 80  # mm
lens1 = ThinLens(f1, x_pos=100)
rays1 = [Ray(y=h, angle_deg=0) for h in [-15, -10, -5, 0, 5, 10, 15]]

traced1 = trace_system(rays1, [lens1], screen_x=180)

print(f"Lens: f={f1}mm at x=100mm | Screen at x=180mm")
print(f"\
{'Start y':>9} {'At lens':>9} {'At screen':>10} {'Status':<10}")
print("-" * 40)
for r in traced1:
    start_y = r.path[0][1]
    at_screen = r.path[-1][1] if r.alive else "blocked"
    print(f"{start_y:>7.1f}mm {r.path[1][1] if len(r.path)>1 else 0:>7.1f}mm "
          f"{at_screen if isinstance(at_screen,str) else f'{at_screen:>7.1f}mm':>10} "
          f"{'alive' if r.alive else 'BLOCKED'}")

# === Test 2: Two-lens telescope ===
print("\
=== Test 2: Keplerian Telescope ===")
f_obj, f_eye = 200, 25
sep = f_obj + f_eye  # afocal arrangement
obj_lens = ThinLens(f_obj, x_pos=0, aperture=40)
eye_lens = ThinLens(f_eye, x_pos=sep, aperture=15)

# Incoming rays at slight angle (distant star not on axis)
star_angle = 0.5  # degrees
rays2 = [Ray(y=h, angle_deg=star_angle) for h in [-20, -10, 0, 10, 20]]

traced2 = trace_system(rays2, [obj_lens, eye_lens], screen_x=sep + 50)

print(f"Objective: f={f_obj}mm | Eyepiece: f={f_eye}mm | Separation: {sep}mm")
print(f"Input angle: {star_angle}° | Expected output: {star_angle * f_obj/f_eye:.1f}°")
print(f"Magnification: {f_obj/f_eye:.0f}×\
")

for r in traced2:
    if r.alive and len(r.path) >= 4:
        out_angle = np.degrees(np.arctan((r.path[-1][1] - r.path[-2][1]) /
                    (r.path[-1][0] - r.path[-2][0])))
        print(f"Ray y={r.path[0][1]:>5.0f}: exit angle = {out_angle:.2f}° "
              f"(magnified {abs(out_angle/star_angle):.1f}×)")

# === Test 3: Three-element system ===
print("\
=== Test 3: Three-Lens Relay ===")
elements = [
    ThinLens(60, x_pos=0, aperture=20),
    ThinLens(-30, x_pos=80, aperture=15),
    ThinLens(40, x_pos=140, aperture=20),
]
rays3 = [Ray(y=h, angle_deg=0) for h in [-12, -6, 0, 6, 12]]
traced3 = trace_system(rays3, elements, screen_x=200)

print("Elements: f=60mm @ 0, f=-30mm @ 80, f=40mm @ 140")
print(f"\
{'Start y':>8} {'Screen y':>10} {'Converge?':<12}")
print("-" * 32)
for r in traced3:
    screen_y = r.path[-1][1] if r.alive else float('nan')
    print(f"{r.path[0][1]:>6.1f}mm {screen_y:>8.2f}mm {'yes' if r.alive else 'blocked'}")`,
      challenge: 'Add a CurvedMirror class that focuses parallel rays at f = R/2. Then build a Newtonian telescope: a concave primary mirror (f = 400mm) and a flat secondary mirror at 45° that redirects light to the side where an eyepiece (f = 20mm) forms the final image. Calculate the magnification.',
      successHint: 'You built a sequential ray tracing engine — the same core algorithm used by Zemax, Code V, and every professional optical design tool. The engine is simple in structure (propagate, interact, repeat) but powerful in application — it can model any rotationally symmetric optical system.',
    },
    {
      title: 'Image formation calculator — position, size, and quality',
      concept: `The ray tracing engine tells you WHERE rays go, but an optical engineer needs to know: WHERE does the image form? HOW big is it? HOW sharp is it?

**Image position** is found by tracing rays from a single object point and finding where they converge (cross each other). For a perfect lens, all rays from one object point meet at one image point. For a real lens, they form a **blur spot** whose size indicates image quality.

**Image size** (magnification) is found by tracing a ray from the edge of the object and measuring its height at the image plane.

**Image quality** is measured by the **spot size** — the diameter of the blur disc formed by rays from a single point. A smaller spot = sharper image. The ultimate limit is the **Airy disc** from diffraction: d = 2.44 × λ × f/D.

📚 *Ibn al-Haytham was the first to explain image formation correctly: each point on an object sends light in all directions, and the lens (or eye) collects a cone of these rays and brings them together at the image point. His "point-by-point" model of image formation is exactly what our calculator implements.*`,
      analogy: 'Imagine a crowd of people all pointing flashlights at the same spot on a wall. If the wall is at the right distance, all the spots overlap into one bright dot (sharp image). If the wall is too close or too far, the spots are spread out (blurry image). The image formation calculator finds the wall position where the spots overlap best.',
      storyConnection: 'Ibn al-Haytham\'s explanation of the camera obscura (pinhole camera) was the first correct analysis of image formation. He showed that each point on a bright object sends light through the pinhole, and the pinhole selects a narrow cone that creates a point on the opposite wall. Assembling all these points creates an inverted image — the same point-by-point process our calculator automates.',
      checkQuestion: 'A lens (f = 75mm) forms an image of an object 200mm away. Where is the image and what is the magnification?',
      checkAnswer: '1/dᵢ = 1/75 - 1/200 = (200-75)/(75×200) = 125/15000. dᵢ = 120mm. Magnification = -120/200 = -0.6×. The image is 120mm from the lens, inverted, and 60% of the object size. Our calculator should reproduce these numbers exactly for a perfect thin lens.',
      codeIntro: 'Build an image formation calculator that finds image position, magnification, and spot size for any optical system.',
      code: `import numpy as np

class LensElement:
    def __init__(self, f, x_pos, aperture=25, abbe=64):
        self.f = f
        self.x = x_pos
        self.aperture = aperture
        self.abbe = abbe  # for chromatic aberration

    def focal_at_wavelength(self, wavelength_nm):
        """Focal length adjusted for dispersion."""
        delta = (587.6 - wavelength_nm) / 200
        return self.f * (1 + delta / self.abbe)

def trace_ray(y_start, angle_deg, elements, wavelength_nm=550):
    """Trace a single ray through a list of elements."""
    y = y_start
    angle = angle_deg
    x = 0
    path = [(x, y)]

    for elem in sorted(elements, key=lambda e: e.x):
        dx = elem.x - x
        y += dx * np.tan(np.radians(angle))
        path.append((elem.x, y))
        if abs(y) > elem.aperture:
            return path, False  # blocked
        f_eff = elem.focal_at_wavelength(wavelength_nm)
        angle -= np.degrees(np.arctan(y / f_eff))
        x = elem.x

    return path, True, y, angle, x

def find_image(elements, obj_distance, obj_height, aperture_sample=7, screen_range=(50, 500)):
    """
    Find image position by tracing multiple rays from an object point
    and finding where they converge (minimum spread).
    """
    # Launch rays from tip of object
    angles = np.linspace(-5, 5, aperture_sample)
    first_elem_x = min(e.x for e in elements)

    best_x = 0
    best_spread = float('inf')

    for screen_x in np.arange(screen_range[0], screen_range[1], 0.5):
        y_at_screen = []
        for ang in angles:
            result = trace_ray(obj_height, ang, elements)
            if len(result) < 4:
                continue
            path, alive, y_final, ang_final, x_final = result
            if not alive:
                continue
            dx = screen_x - x_final
            y_screen = y_final + dx * np.tan(np.radians(ang_final))
            y_at_screen.append(y_screen)

        if len(y_at_screen) >= 3:
            spread = max(y_at_screen) - min(y_at_screen)
            if spread < best_spread:
                best_spread = spread
                best_x = screen_x
                best_y = np.mean(y_at_screen)

    return best_x, best_y if best_spread < 100 else None, best_spread

# === Single lens image formation ===
print("=== Image Formation Calculator ===\
")

lens = LensElement(f=75, x_pos=0, aperture=20)

print("--- Single Lens (f = 75 mm) ---")
print(f"{'Object dist':>12} {'Image dist':>11} {'Magnif.':>9} {'Spot size':>10} {'Theory dᵢ':>10}")
print("-" * 54)

for d_obj in [300, 200, 150, 100, 80]:
    # Theoretical
    d_img_theory = 1 / (1/75 - 1/d_obj)
    mag_theory = -d_img_theory / d_obj

    # Numerical (trace rays)
    img_x, img_y, spot = find_image(
        [lens], d_obj, obj_height=10,
        screen_range=(d_img_theory - 30, d_img_theory + 30)
    )

    mag_num = img_y / 10 if img_y else 0
    print(f"{d_obj:>10} mm {img_x:>9.1f} mm {mag_num:>+8.2f} {spot:>8.3f} mm {d_img_theory:>8.1f} mm")

# === Chromatic aberration ===
print("\
--- Chromatic Focus Shift ---")
lens_chrom = LensElement(f=100, x_pos=0, aperture=15, abbe=35)  # flint glass

print(f"Lens f=100mm, Abbe number=35 (high dispersion)\
")
print(f"{'Wavelength':>11} {'Effective f':>12} {'Focus shift':>12}")
print("-" * 37)

for wl in [400, 450, 500, 550, 600, 650, 700]:
    f_eff = lens_chrom.focal_at_wavelength(wl)
    shift = f_eff - 100
    print(f"{wl:>8} nm {f_eff:>10.2f} mm {shift:>+10.2f} mm")

# === Two-lens system ===
print("\
--- Two-Lens Imaging System ---")
system = [
    LensElement(f=60, x_pos=0, aperture=20),
    LensElement(f=40, x_pos=100, aperture=15),
]

print("Lens 1: f=60mm @ x=0 | Lens 2: f=40mm @ x=100mm")
print(f"\
{'Object dist':>12} {'Image pos':>10} {'Magnification':>14} {'Spot (mm)':>10}")
print("-" * 48)

for d_obj in [200, 150, 120, 100, 80]:
    img_x, img_y, spot = find_image(system, d_obj, obj_height=5, screen_range=(100, 400))
    mag = img_y / 5 if img_y else 0
    print(f"{d_obj:>10} mm {img_x:>8.1f} mm {mag:>+12.3f} {spot:>8.3f} mm")`,
      challenge: 'Add a diffraction-limited spot size calculation: d_Airy = 2.44 × λ × f_eff / D, where D is the aperture diameter. Compare the geometric spot size (from ray tracing) to the diffraction limit. When the geometric spot is smaller than the Airy disc, the system is "diffraction-limited" — the best possible performance.',
      successHint: 'You built an image formation calculator that finds image position numerically — the same approach used in professional optical design. The key insight: trace many rays, find where they converge. When they converge tightly, the image is sharp. When they don\'t, you\'ve found an aberration that needs correcting.',
    },
    {
      title: 'Optical design optimiser — minimising aberrations automatically',
      concept: `Real optical systems have many free parameters: the radii of curvature, lens spacings, glass types, and aperture sizes. Finding the combination that minimises aberrations is an **optimisation problem**.

The **merit function** measures how well the system performs. A common choice: the **RMS spot size** — the root-mean-square radius of the blur disc formed by rays from a point source. Lower RMS = sharper image.

The optimiser adjusts the free parameters, evaluates the merit function, and searches for the minimum. We'll use a **grid search** (evaluate all combinations) for simplicity — professional tools use gradient descent and damped least squares.

The challenge: parameters interact. Changing one lens's curvature affects all downstream images. Reducing chromatic aberration (by adding a flint glass element) may increase spherical aberration. The optimiser must balance all aberrations simultaneously.

📚 *Optical design optimisation is one of the oldest applications of numerical methods in engineering. The basic approach — define a merit function and minimise it — is the same technique used in machine learning, financial modelling, and drug design.*`,
      analogy: 'Imagine tuning a guitar with six strings. Tightening one string can slightly change the tension on others (through the neck). You can\'t tune each string independently — you have to iterate: tune one, check the others, adjust, repeat. Lens design is the same: adjusting one surface affects the whole system, so you iterate until all aberrations are minimised simultaneously.',
      storyConnection: 'Ibn al-Haytham spent years refining his experiments — adjusting the size of the aperture, the distance to the screen, the brightness of the light source — seeking the clearest possible images. His iterative, systematic approach to improving experimental results is the human version of the optimisation algorithm: adjust parameters, evaluate the result, repeat until optimal.',
      checkQuestion: 'An optimiser reduces chromatic aberration from 2.0 mm to 0.3 mm, but spherical aberration increases from 0.1 mm to 0.5 mm. Is the system better overall?',
      checkAnswer: 'It depends on the merit function. If the merit function is the sum (CA + SA), the old design scores 2.1 and the new scores 0.8 — better. If the merit function is the maximum aberration, the old scores 2.0 and the new scores 0.5 — also better. But if you only care about SA (e.g., monochromatic laser application), the new design is worse. The merit function must reflect the actual application.',
      codeIntro: 'Build an optical design optimiser that searches for the best lens configuration to minimise aberrations.',
      code: `import numpy as np

def trace_spot(f1, f2, separation, obj_dist, aperture, wavelength=550, abbe1=64, abbe2=28):
    """
    Trace rays through a two-lens system and return RMS spot size.
    """
    # Chromatic focal lengths
    delta1 = (587.6 - wavelength) / 200 / abbe1
    delta2 = (587.6 - wavelength) / 200 / abbe2
    f1_eff = f1 * (1 + delta1)
    f2_eff = f2 * (1 + delta2)

    ray_heights = np.linspace(-aperture, aperture, 15)
    image_y = []

    for h in ray_heights:
        # Through lens 1
        angle = -np.degrees(np.arctan(h / f1_eff))
        # Spherical aberration (third order)
        sa_correction = 0.0003 * (h / aperture) ** 2 * f1_eff
        angle -= np.degrees(sa_correction / f1_eff)

        # Propagate to lens 2
        y2 = h + separation * np.tan(np.radians(angle))

        # Through lens 2
        angle2 = angle - np.degrees(np.arctan(y2 / f2_eff))
        sa2 = 0.0003 * (y2 / aperture) ** 2 * f2_eff
        angle2 -= np.degrees(sa2 / f2_eff)

        # Propagate to best focus (approximate)
        if abs(np.tan(np.radians(angle2))) > 1e-6:
            focus_dist = -y2 / np.tan(np.radians(angle2))
            y_focus = 0
        else:
            y_focus = y2
        image_y.append(y_focus if abs(y_focus) < 100 else y2)

    return np.std(image_y)  # RMS spot size

def merit_function(f1, f2, sep, obj_dist=200, aperture=12):
    """
    Multi-wavelength merit function.
    Average RMS spot across red, green, blue wavelengths.
    """
    spot_r = trace_spot(f1, f2, sep, obj_dist, aperture, wavelength=650)
    spot_g = trace_spot(f1, f2, sep, obj_dist, aperture, wavelength=550)
    spot_b = trace_spot(f1, f2, sep, obj_dist, aperture, wavelength=450)
    return (spot_r + spot_g + spot_b) / 3

# Grid search optimisation
print("=== Optical Design Optimiser ===")
print("Two-element achromatic system")
print("Free parameters: f1 (crown), f2 (flint), separation\
")

best_merit = float('inf')
best_config = None
configs_tested = 0

print("Searching...")
results = []

for f1 in np.arange(40, 120, 5):
    for f2 in np.arange(-200, -30, 10):
        for sep in np.arange(2, 20, 2):
            configs_tested += 1
            m = merit_function(f1, f2, sep)
            results.append((f1, f2, sep, m))
            if m < best_merit:
                best_merit = m
                best_config = (f1, f2, sep)

print(f"Configurations tested: {configs_tested:,}")

# Top 10 designs
results.sort(key=lambda r: r[3])
print(f"\
{'Rank':>5} {'f1 (mm)':>8} {'f2 (mm)':>8} {'Sep (mm)':>9} {'Merit (RMS)':>12}")
print("-" * 44)
for i, (f1, f2, sep, m) in enumerate(results[:10], 1):
    marker = " ◀ BEST" if i == 1 else ""
    print(f"{i:>5} {f1:>6.0f} {f2:>6.0f} {sep:>7.0f} {m:>10.4f}{marker}")

# Analyse best design
print(f"\
=== Best Design Analysis ===")
f1_b, f2_b, sep_b = best_config
print(f"Crown lens: f = {f1_b:.0f} mm (converging, Abbe 64)")
print(f"Flint lens: f = {f2_b:.0f} mm (diverging, Abbe 28)")
print(f"Separation: {sep_b:.0f} mm")

# Effective focal length
f_eff = 1 / (1/f1_b + 1/f2_b - sep_b/(f1_b*f2_b))
print(f"Effective focal length: {f_eff:.1f} mm")

# Per-wavelength performance
print(f"\
{'Wavelength':>11} {'RMS spot':>10} {'Rating':<12}")
print("-" * 35)
for wl, colour in [(450, "Blue"), (550, "Green"), (650, "Red")]:
    spot = trace_spot(f1_b, f2_b, sep_b, 200, 12, wavelength=wl)
    rating = "Excellent" if spot < 0.01 else "Good" if spot < 0.05 else "Fair" if spot < 0.1 else "Poor"
    print(f"{wl:>8} nm {spot:>8.4f} {rating:<12}")`,
      challenge: 'Add lens thickness as a free parameter (1-10 mm) and glass type (3 options with different Abbe numbers). How does expanding the search space affect the best design? For a 4-parameter search with 10 values each, you have 10⁴ = 10,000 combinations. Explain why gradient descent becomes necessary for real optical design with 20+ free parameters.',
      successHint: 'You built an optical design optimiser — a simplified version of the tools used by every lens designer in the world. The key concepts — merit functions, parameter spaces, grid search, and trade-offs between aberration types — are universal in engineering optimisation, from lens design to neural network training.',
    },
    {
      title: 'Portfolio presentation — documenting the Optics Simulator',
      concept: `The final step in any engineering project is **documentation** — recording what you built, why, how it works, and what it reveals. A well-documented project becomes a **portfolio piece** that demonstrates your skills.

Your Optics Simulator documentation should include:

1. **Introduction** — what problem does it solve?
2. **Architecture** — what are the core classes and how do they interact?
3. **Methodology** — what physics models does it use?
4. **Results** — what designs did it produce and how do they perform?
5. **Limitations** — what does the model NOT capture?
6. **Future work** — how could it be improved?

This is the structure of a **technical report** — the standard format for communicating engineering results in industry and academia.

📚 *Ibn al-Haytham's Book of Optics is itself a masterpiece of documentation: 7 volumes, methodically organised, with clear descriptions of experiments, results, and conclusions. It was translated into Latin and used as a textbook for 600 years — because it was documented so well that anyone could follow his reasoning and reproduce his experiments.*`,
      analogy: 'A recipe book doesn\'t just list ingredients — it explains WHY you\'re adding each one, WHAT happens if you skip a step, and WHEN to adjust. Good documentation does the same for code: not just what it does, but why it works that way and where it might fail.',
      storyConnection: 'Ibn al-Haytham\'s documentation was so thorough that Roger Bacon, Kepler, Huygens, and Newton all built on his work centuries later. His Book of Optics was the longest continuously cited scientific text in history — precisely because it documented not just results but methodology. Your simulator documentation follows the same principle: explain the process, not just the output.',
      checkQuestion: 'Why is documenting limitations more valuable than hiding them?',
      checkAnswer: 'Documenting limitations shows intellectual honesty and engineering maturity. A user who trusts your simulator without knowing its limits might misapply it — designing a system that fails because the model didn\'t capture a critical effect. A user who knows the limits can use the tool appropriately and decide when a more sophisticated model is needed.',
      codeIntro: 'Generate the complete project documentation for the Optics Simulator.',
      code: `# Optics Simulator — Project Documentation

print("""
================================================================
              OPTICS SIMULATOR
            Project Documentation
================================================================

1. INTRODUCTION
---------------
This simulator traces light rays through multi-element optical
systems — lenses, mirrors, and surfaces — to predict image
formation, magnification, and aberrations. It was inspired by
Ibn al-Haytham's Book of Optics (1021 CE), the first systematic
treatise on light, vision, and optical instruments.

The simulator solves the core problem of optical engineering:
given a set of optical elements, where does the image form,
how large is it, and how sharp is it?

2. ARCHITECTURE
--------------
Core classes:
  - Ray: position (y), angle, wavelength, path history
  - Surface: radius, refractive indices (n_before, n_after)
  - Lens: focal length, position, aperture, Abbe number
  - ThinLens: simplified lens using thin lens equation
  - FlatMirror: reflects rays with angle reversal

Key subsystems:
  a) Ray tracing engine — sequential propagation through elements
  b) Image formation calculator — finds convergence point
  c) Aberration analyser — computes spot size vs wavelength
  d) Design optimiser — grid search over parameter space

3. PHYSICS MODELS
-----------------
  - Snell's law: n1 sin(θ1) = n2 sin(θ2) at each surface
  - Thin lens equation: 1/f = 1/do + 1/di
  - Lensmaker equation: 1/f = (n-1)(1/R1 - 1/R2)
  - Cauchy dispersion: n(λ) = A + B/λ²
  - Third-order spherical aberration model
  - Rayleigh diffraction limit: θ = 1.22 λ/D

4. KEY RESULTS
--------------
  - Single lens: image position matches thin lens equation
    to <0.5% for paraxial rays
  - Achromatic doublet: chromatic aberration reduced by 5-8×
    compared to singlet lens
  - Telescope model: magnification matches f_obj/f_eye theory
  - Optimiser found best achromat configuration from 10,000+
    candidate designs

5. LIMITATIONS
--------------
  - 2D (meridional plane) only — no skew rays or sagittal focus
  - Thin lens approximation — ignores principal plane separation
  - Third-order aberrations only — no coma, astigmatism, or
    field curvature
  - Monochromatic diffraction model — no polychromatic PSF
  - No coating models (anti-reflection, dichroic filters)
  - No tolerance analysis (manufacturing imprecisions)

6. FUTURE IMPROVEMENTS
----------------------
  - 3D ray tracing with full (x, y, z) ray vectors
  - Exact thick lens model with principal planes
  - Higher-order Seidel aberrations (coma, astigmatism,
    distortion, field curvature, Petzval sum)
  - Monte Carlo tolerance analysis
  - Gradient descent optimiser for faster convergence
  - Export to standard optical interchange format (Zemax .zmx)

7. SKILLS DEMONSTRATED
----------------------
  ✓ Object-oriented programming (Python classes)
  ✓ Physics simulation (Snell's law, wave optics)
  ✓ Numerical methods (ray tracing, root finding)
  ✓ Optimisation (grid search, merit functions)
  ✓ Data analysis (spot diagrams, aberration curves)
  ✓ Technical documentation
================================================================
""")

# Skills summary for portfolio
skills = [
    ("Python OOP",          "Ray, Surface, Lens classes with methods"),
    ("Geometric optics",    "Snell's law, thin lens equation, ray tracing"),
    ("Wave optics",         "Diffraction, interference, dispersion"),
    ("Numerical methods",   "Sequential tracing, convergence search"),
    ("Optimisation",        "Grid search, merit functions, trade-offs"),
    ("Scientific method",   "Hypothesis, experiment, analysis, documentation"),
]

print("PORTFOLIO SKILLS SUMMARY:")
for skill, detail in skills:
    print(f"  {skill:<24} {detail}")

print()
print("Inspired by Ibn al-Haytham (965-1040 CE)")
print("'The seeker of truth does not place his trust in any")
print(" mere consensus, but rather subjects what he hears to")
print(" his critical examination.' — Book of Optics")`,
      challenge: 'Turn this documentation into a real portfolio piece. Add a section comparing your simulator\'s predictions to analytical results — e.g., thin lens equation for single lens, f_obj/f_eye for telescope magnification. Quantifying the agreement between your numerical model and analytical theory is how engineers validate simulation tools.',
      successHint: 'You completed a full engineering project cycle: system design, implementation, testing, optimisation, and documentation. This mirrors the workflow of professional optical engineers at Zemax, Nikon, Canon, and ASML. Ibn al-Haytham would recognise your methodology — systematic, experimental, documented — as his own, applied with tools he could not have imagined.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Build a complete Optics Simulator</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 4 is a capstone project: design, build, and document a complete Optics Simulator inspired by Ibn al-Haytham.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {loadProgress}</>) : (<><Sparkles className="w-5 h-5" /> Load Python</>)}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson
            key={i}
            id={`L4-${i + 1}`}
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
