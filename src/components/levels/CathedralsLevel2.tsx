import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function CathedralsLevel2() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Voussoir geometry — the mathematics of arch stone cutting',
      concept: `A Gothic arch is not a single piece of stone — it is assembled from **voussoirs**: wedge-shaped blocks that lock together under compression. The geometry of each voussoir must be calculated precisely so that the faces between adjacent stones are perpendicular to the arch curve at that point.

For a **pointed Gothic arch** (two circular arcs meeting at a peak), each voussoir is defined by:
- Its **angular position** along the arc
- Its **inner radius** (intrados) and **outer radius** (extrados)
- The **joint angle** — the angle of the face where it meets the next voussoir

The key constraint: every joint must be perpendicular to the arch curve. If a joint is angled incorrectly, the force doesn't transfer cleanly between stones, creating a shear stress that can crack the mortar.

In the code below, you'll compute the exact geometry of each voussoir in a pointed Gothic arch — the same calculations medieval master masons performed with compasses and straightedges.

📚 *A voussoir arch works entirely in compression — no stone is pulled apart. This is why stone arches can last millennia: stone is 10-20× stronger in compression than in tension.*`,
      analogy: 'Imagine a line of people leaning inward against each other in two rows, meeting at the top. Each person pushes against their neighbours — nobody is pulling. As long as everyone keeps pushing, the structure holds. Remove one person (voussoir) and the whole line collapses. That\'s why the keystone at the top is so critical — it locks the two halves together.',
      storyConnection: 'The master masons at Chartres cut over 10,000 voussoirs for the cathedral\'s arcade arches alone. Each stone was shaped on the ground using full-scale templates (called "tracing floor" drawings), then lifted into position on wooden centering. A single miscut voussoir could cause an entire arch to collapse during decentering.',
      checkQuestion: 'A semicircular arch has 15 voussoirs. What is the angular span of each voussoir?',
      checkAnswer: '180° / 15 = 12° per voussoir. But a pointed Gothic arch spans less than 180° per side — two arcs of perhaps 60-80° each. With 15 voussoirs per side, that\'s only 4-5° per stone, requiring extremely precise cutting. This is why Gothic masonry demanded such skilled craftsmen.',
      codeIntro: 'Compute the geometry of every voussoir in a pointed Gothic arch.',
      code: `import numpy as np

def gothic_arch_voussoirs(span_m, height_m, n_voussoirs_per_side=12, thickness_m=0.6):
    """
    Calculate voussoir geometry for a pointed Gothic arch.
    Two circular arcs spring from the base and meet at the apex.
    """
    # Find the radius of each arc: the centre of each arc is offset
    # from the midpoint so the two arcs meet at the desired height
    half_span = span_m / 2
    # For a pointed arch: R = (half_span^2 + height^2) / (2 * height)
    # when centre is at the opposite springing point (equilateral arch)
    R = (half_span**2 + height_m**2) / (2 * height_m)

    # Arc angle from springing to apex
    arc_angle = np.arcsin(half_span / R)

    print(f"=== Gothic Arch Voussoir Geometry ===")
    print(f"Span: {span_m:.1f} m | Rise: {height_m:.1f} m")
    print(f"Arc radius: {R:.2f} m | Arc angle: {np.degrees(arc_angle):.1f}°")
    print(f"Voussoirs per side: {n_voussoirs_per_side} | Stone thickness: {thickness_m} m")
    print()

    # Compute each voussoir for the left side
    d_angle = arc_angle / n_voussoirs_per_side

    print(f"{'#':>3} {'Angle (°)':>10} {'Inner X':>9} {'Inner Y':>9} "
          f"{'Width (mm)':>11} {'Depth (mm)':>11} {'Joint Angle':>12}")
    print("-" * 68)

    voussoirs = []
    # Arc centre is at (half_span, 0) for the left arc
    cx, cy = half_span, 0

    for i in range(n_voussoirs_per_side):
        theta_start = np.pi - arc_angle + i * d_angle
        theta_end = theta_start + d_angle
        theta_mid = (theta_start + theta_end) / 2

        # Inner edge (intrados) coordinates at midpoint
        ix = cx + R * np.cos(theta_mid)
        iy = cy + R * np.sin(theta_mid)

        # Voussoir width along the intrados arc
        arc_length = R * d_angle * 1000  # mm

        # Joint angle (perpendicular to curve at that point)
        joint_angle = np.degrees(theta_mid - np.pi/2)

        # Depth (radial thickness)
        depth = thickness_m * 1000  # mm

        voussoirs.append({
            "n": i+1, "angle": np.degrees(theta_mid),
            "ix": ix, "iy": iy,
            "width": arc_length, "depth": depth,
            "joint": joint_angle
        })

        print(f"{i+1:>3} {np.degrees(theta_mid):>9.1f}° {ix:>8.3f}m {iy:>8.3f}m "
              f"{arc_length:>9.0f} {depth:>9.0f} {joint_angle:>10.1f}°")

    # Summary
    total_stones = 2 * n_voussoirs_per_side + 1  # +1 for keystone
    total_mass = total_stones * (voussoirs[0]["width"]/1000 * thickness_m * 0.5) * 2500
    print(f"\\\nTotal voussoirs (both sides + keystone): {total_stones}")
    print(f"Estimated total arch mass: {total_mass:.0f} kg")

    return voussoirs

# Chartres Cathedral nave arcade arch
voussoirs = gothic_arch_voussoirs(span_m=8.0, height_m=12.0, n_voussoirs_per_side=14)

# Compare arch types
print("\\\n=== Arch Type Comparison ===")
for name, span, height in [
    ("Romanesque (semicircular)", 8.0, 4.0),
    ("Lancet (narrow pointed)", 6.0, 14.0),
    ("Equilateral Gothic", 8.0, 6.93),
    ("Flamboyant (wide pointed)", 10.0, 8.0),
]:
    half = span / 2
    R = (half**2 + height**2) / (2 * height)
    angle = np.degrees(np.arcsin(half / R))
    print(f"{name:<30} R={R:>5.1f}m  Arc angle={angle:>5.1f}°  Rise/span={height/span:.2f}")`,
      challenge: 'The keystone at the apex is a special voussoir — it must be perfectly symmetric and slightly wider than the others to lock the arch. Calculate the keystone geometry for the Chartres arch: its angular span should be 1.5× the normal voussoir span. How does this affect the number and size of the remaining voussoirs?',
      successHint: 'You just performed the same geometric calculations that medieval master masons did on their tracing floors — except they used compasses and string instead of NumPy. The mathematics of arch geometry is the foundation of structural masonry, still used today in bridge and tunnel design.',
    },
    {
      title: 'Moment equilibrium — overturning vs restoring forces',
      concept: `A Gothic cathedral\'s walls are pushed outward by the weight of the vaulted ceiling. This outward push creates an **overturning moment** — a rotational force that tries to tip the wall outward. The wall resists with a **restoring moment** from its own weight pressing downward.

**Moment = Force × Distance** (from the pivot point). The pivot is the outer base edge of the wall. The overturning moment comes from the horizontal thrust of the vault pushing at the top of the wall. The restoring moment comes from the wall's weight acting at its centre of gravity.

If overturning moment > restoring moment, the wall tips over and the cathedral collapses. The **factor of safety** = restoring / overturning. Medieval builders needed this ratio above ~2.0.

**Flying buttresses** solve this problem by adding restoring force: the buttress pushes inward at the top of the wall, directly counteracting the vault's outward thrust. This allowed walls to be thinner, taller, and filled with stained glass.

📚 *A moment (or torque) is a force's tendency to cause rotation. The further from the pivot a force acts, the larger the moment — which is why a long lever is more effective than a short one.*`,
      analogy: 'Hold a heavy book at arm\'s length — your shoulder is the pivot, and the book\'s weight creates an overturning moment that tries to pull your arm down. Now have someone push up on your elbow — that\'s the flying buttress, adding a restoring moment. The book (vault) still pushes down, but the support (buttress) keeps your arm (wall) from falling.',
      storyConnection: 'Beauvais Cathedral attempted the tallest Gothic vault ever — 48 metres. The overturning moment from this enormous vault overwhelmed the buttresses. The vault collapsed in 1284, just 12 years after completion. The rebuilt version still stands, but Beauvais was never completed — a monument to the limits of medieval structural intuition.',
      checkQuestion: 'A wall is 1.5 m thick and 20 m tall. The vault pushes outward with 80 kN at the top. The wall weighs 600 kN acting at its centre (0.75 m from the outer edge). Is the wall stable?',
      checkAnswer: 'Overturning moment = 80 kN × 20 m = 1,600 kN·m. Restoring moment = 600 kN × 0.75 m = 450 kN·m. Factor of safety = 450 / 1,600 = 0.28 — far below 1.0. The wall WILL tip over without buttresses. This is exactly why flying buttresses were invented.',
      codeIntro: 'Calculate overturning and restoring moments for Gothic cathedral walls with and without flying buttresses.',
      code: `import numpy as np

def moment_analysis(wall_height, wall_thickness, vault_span,
                    buttress=False, buttress_angle_deg=45, buttress_weight_kn=0):
    """
    Analyse moment equilibrium of a Gothic cathedral wall.
    Pivot point: outer base edge of the wall.
    """
    # Material properties
    stone_density = 2400  # kg/m³
    g = 9.81

    # Wall weight (per metre of wall length)
    wall_weight = wall_thickness * wall_height * 1.0 * stone_density * g / 1000  # kN
    wall_cg_x = wall_thickness / 2  # centre of gravity from outer edge

    # Vault thrust (horizontal outward force at top of wall)
    # Approximate: thrust = w × L / (8 × f) where w=load/m, L=span, f=rise
    vault_rise = vault_span * 0.6  # pointed arch rise ~ 0.6 × span
    vault_weight_per_m = vault_span * 0.3 * stone_density * g / 1000  # kN/m
    horizontal_thrust = vault_weight_per_m * vault_span / (8 * vault_rise)

    # Overturning moment (thrust × height from base)
    thrust_height = wall_height * 0.85  # thrust acts near top of wall
    M_overturn = horizontal_thrust * thrust_height

    # Restoring moment (wall weight × distance from pivot)
    M_restore_wall = wall_weight * wall_cg_x

    # Buttress contribution
    M_restore_buttress = 0
    buttress_inward = 0
    if buttress:
        angle_rad = np.radians(buttress_angle_deg)
        # Buttress pushes inward at the top of the wall
        buttress_inward = buttress_weight_kn * np.sin(angle_rad)
        # Also pushes downward
        buttress_down = buttress_weight_kn * np.cos(angle_rad)
        # Inward force at wall top creates restoring moment
        M_restore_buttress = buttress_inward * thrust_height + buttress_down * wall_cg_x

    M_restore_total = M_restore_wall + M_restore_buttress
    fos = M_restore_total / M_overturn if M_overturn > 0 else float('inf')

    return {
        "wall_weight": wall_weight,
        "thrust": horizontal_thrust,
        "M_overturn": M_overturn,
        "M_restore_wall": M_restore_wall,
        "M_restore_buttress": M_restore_buttress,
        "M_restore_total": M_restore_total,
        "fos": fos,
        "stable": fos > 1.0,
        "safe": fos > 2.0,
    }

# Analyse famous cathedrals
cathedrals = [
    ("Chartres", 36, 2.5, 16, True, 55, 300),
    ("Notre-Dame", 33, 2.2, 12, True, 50, 250),
    ("Beauvais", 48, 2.0, 15, True, 60, 280),
    ("Romanesque (no buttress)", 20, 3.5, 10, False, 0, 0),
]

print("=== Cathedral Moment Equilibrium Analysis ===\\\n")
print(f"{'Cathedral':<26} {'H(m)':>5} {'Thrust':>7} {'M_over':>8} "
      f"{'M_rest':>8} {'FoS':>6} {'Status':>8}")
print("-" * 72)

for name, h, t, span, butt, angle, bw in cathedrals:
    r = moment_analysis(h, t, span, butt, angle, bw)
    status = "SAFE" if r["safe"] else "OK" if r["stable"] else "FAIL"
    print(f"{name:<26} {h:>4}m {r['thrust']:>6.0f}kN {r['M_overturn']:>7.0f} "
          f"{r['M_restore_total']:>7.0f} {r['fos']:>5.2f} {status:>8}")

# Show buttress impact
print("\\\n=== Effect of Flying Buttresses (Chartres) ===")
for butt_weight in [0, 100, 200, 300, 400, 500]:
    r = moment_analysis(36, 2.5, 16, butt_weight > 0, 55, butt_weight)
    print(f"Buttress weight: {butt_weight:>4} kN  "
          f"Restoring moment: {r['M_restore_total']:>7.0f} kN·m  FoS: {r['fos']:.2f}")`,
      challenge: 'Beauvais collapsed because its factor of safety was too low. Calculate the minimum buttress weight needed to bring Beauvais to FoS = 2.5. What if the builders had used thicker walls (2.5 m instead of 2.0 m)? How much buttress weight could they save? This trade-off — wall thickness vs buttress size — defined Gothic architecture.',
      successHint: 'Moment equilibrium is the fundamental analysis for any structure that can topple: retaining walls, dams, towers, cranes. You just applied the same analysis that modern structural engineers use to certify buildings — the difference is they use software instead of hand calculations.',
    },
    {
      title: 'Stained glass optics — light transmission and colour from metal oxides',
      concept: `Gothic stained glass windows are not painted — the colour is **in the glass itself**, created by dissolving metal oxide compounds into molten silica during manufacturing:

- **Cobalt oxide** (CoO) → deep blue
- **Gold chloride** (AuCl₃) → ruby red (nanoparticles!)
- **Copper oxide** (CuO) → green
- **Manganese dioxide** (MnO₂) → purple
- **Iron oxide** (Fe₂O₃) → amber/brown
- **Antimony** or **tin oxide** → white/opaque

Each oxide absorbs specific wavelengths of light and transmits the rest. The **transmission spectrum** — the fraction of light that passes through at each wavelength — determines the colour we see.

The intensity of colour depends on the **concentration** of the oxide and the **thickness** of the glass, following the **Beer-Lambert law**: I = I₀ × e^(-α × c × d), where α is the absorption coefficient, c is concentration, and d is thickness.

📚 *The Beer-Lambert law describes how light attenuates as it passes through an absorbing medium. It's used in spectroscopy, atmospheric science, and medical imaging.*`,
      analogy: 'Imagine looking through coloured water — a thin layer looks pale, a thick layer looks deep. Adding more dye makes the colour stronger at any thickness. The Beer-Lambert law captures both effects: more material (thicker glass) and more dye (higher oxide concentration) both reduce transmission and deepen the colour.',
      storyConnection: 'The great rose window of Chartres Cathedral (c. 1230) contains over 150 individual glass panels, each with a precisely controlled colour. The blue glass — Chartres is famous for its "Chartres blue" — uses cobalt oxide at approximately 0.1% concentration in a potash-lime glass. This specific formulation has never been exactly replicated.',
      checkQuestion: 'If glass transmits 80% of red light and 20% of blue light, what colour does it appear?',
      checkAnswer: 'Red — because far more red light passes through than blue. The glass absorbs blue wavelengths and transmits red. This is the opposite of what we might expect: the glass IS the colour it lets through, not the colour it absorbs.',
      codeIntro: 'Model light transmission through stained glass using the Beer-Lambert law and metal oxide absorption spectra.',
      code: `import numpy as np

def beer_lambert(wavelength, absorbers, thickness_mm):
    """
    Calculate transmission through stained glass.
    Beer-Lambert: T = exp(-sum(alpha_i * c_i * d))
    """
    d = thickness_mm / 1000  # convert to metres
    total_absorbance = 0

    for absorber in absorbers:
        # Each absorber has a peak wavelength and absorption width
        peak = absorber["peak_nm"]
        width = absorber["width_nm"]
        alpha = absorber["alpha"]  # absorption coefficient
        conc = absorber["conc"]    # concentration (fraction)

        # Gaussian absorption profile
        absorbance = alpha * conc * d * np.exp(-0.5 * ((wavelength - peak) / width)**2)
        total_absorbance += absorbance

    return np.exp(-total_absorbance)

# Wavelength range (visible light: 380-750 nm)
wavelengths = np.linspace(380, 750, 75)

# Glass colorants
colorants = {
    "Cobalt blue": [{"peak_nm": 590, "width_nm": 80, "alpha": 500, "conc": 0.001}],
    "Gold ruby": [{"peak_nm": 530, "width_nm": 40, "alpha": 800, "conc": 0.0005}],
    "Copper green": [{"peak_nm": 450, "width_nm": 60, "alpha": 300, "conc": 0.002},
                     {"peak_nm": 650, "width_nm": 70, "alpha": 350, "conc": 0.002}],
    "Iron amber": [{"peak_nm": 420, "width_nm": 100, "alpha": 200, "conc": 0.005}],
    "Manganese purple": [{"peak_nm": 550, "width_nm": 50, "alpha": 400, "conc": 0.003}],
    "Clear glass": [],
}

thickness = 3.0  # mm — typical medieval glass

print("=== Stained Glass Transmission Spectra ===")
print(f"Glass thickness: {thickness} mm\\\n")

for name, absorbers in colorants.items():
    transmissions = [beer_lambert(w, absorbers, thickness) for w in wavelengths]
    avg_t = np.mean(transmissions)

    # Find peak transmission wavelength
    peak_idx = np.argmax(transmissions)
    peak_wl = wavelengths[peak_idx]
    peak_t = transmissions[peak_idx]

    # Colour name from peak wavelength
    color_map = [(380,"violet"),(450,"blue"),(495,"cyan"),(570,"green"),
                 (590,"yellow"),(620,"orange"),(750,"red")]
    color = "white"
    for threshold, c in color_map:
        if peak_wl >= threshold:
            color = c

    print(f"{name:<22} Avg transmission: {avg_t:>5.1%}  "
          f"Peak: {peak_wl:.0f}nm ({color}) at {peak_t:.1%}")

# Effect of glass thickness on colour intensity
print("\\\n=== Thickness vs Colour Intensity (Cobalt Blue) ===")
cobalt = colorants["Cobalt blue"]
for t in [1, 2, 3, 4, 5, 8, 10]:
    trans = [beer_lambert(w, cobalt, t) for w in wavelengths]
    avg = np.mean(trans)
    blue_band = [beer_lambert(w, cobalt, t) for w in wavelengths if 450 <= w <= 490]
    blue_avg = np.mean(blue_band)
    print(f"  {t:>2} mm: overall transmission {avg:.1%}, "
          f"blue band (450-490nm) {blue_avg:.1%}")`,
      challenge: 'The "Chartres blue" is believed to use a combination of cobalt AND a small amount of iron oxide. Model a mixed colorant (cobalt at 0.08% + iron at 0.3%) and compare its transmission spectrum to pure cobalt blue. Does the iron addition shift the blue toward a warmer tone? This is how medieval glaziers fine-tuned their colours.',
      successHint: 'The Beer-Lambert law is one of the most widely used equations in analytical chemistry and spectroscopy. You just applied it to stained glass — but the same physics governs how sunlight attenuates through the atmosphere (why sunsets are red), how medical imaging works (X-ray absorption), and how pollution sensors measure air quality.',
    },
    {
      title: 'Acoustic ray tracing — modelling sound paths in a cathedral nave',
      concept: `Gothic cathedrals have extraordinary acoustics — a choir singing at the altar can be heard clearly 100 metres away at the west door. The secret is the cathedral's geometry: the vaulted ceiling, parallel stone walls, and long nave create a **reverberant space** where sound bounces multiple times before reaching the listener.

**Acoustic ray tracing** models sound as rays (like light rays) that travel in straight lines and reflect off surfaces. At each reflection, some energy is absorbed (depending on the surface material) and the rest bounces according to the **law of reflection**: angle of incidence = angle of reflection.

Key acoustic metrics:
- **Reverberation time (RT60)** — how long it takes for sound to decay by 60 dB after the source stops. Cathedrals: 4-8 seconds. Concert halls: 1.5-2.5 seconds.
- **Early reflections** — the first reflections (within 50 ms) that reinforce the direct sound and help clarity.
- **Late reflections** — reflections after 50 ms that create the "wash" of reverb.

📚 *The Sabine equation predicts reverberation time: RT60 = 0.161 × V / A, where V is room volume (m³) and A is total absorption (m² sabins). Larger rooms with hard surfaces have longer reverb.*`,
      analogy: 'Clap your hands in a tiled bathroom — you hear a bright, quick echo. Clap in a carpeted living room — the sound is dead, absorbed by soft surfaces. Now imagine a bathroom the size of a football field, with 30-metre stone ceilings. That\'s a cathedral\'s acoustics: every sound bounces dozens of times, creating a long, shimmering reverb.',
      storyConnection: 'Notre-Dame de Paris has a reverberation time of approximately 6 seconds — meaning a single chord from the organ lingers for 6 seconds after the organist lifts their hands. The cathedral was designed so that Gregorian chant — slow, sustained notes — would blend into a continuous wash of harmony. Fast, articulated music sounds muddy in such a space.',
      checkQuestion: 'Cathedral A has a volume of 100,000 m³ and total absorption of 3,000 m² sabins. What is its RT60?',
      checkAnswer: 'RT60 = 0.161 × 100,000 / 3,000 = 5.37 seconds. This is typical for a large Gothic cathedral — perfect for Gregorian chant but too long for a spoken sermon (words blur together). This is why pulpits were placed close to the congregation.',
      codeIntro: 'Simulate acoustic ray tracing in a simplified cathedral cross-section and calculate reverberation time.',
      code: `import numpy as np

def sabine_rt60(volume_m3, surfaces):
    """
    Sabine reverberation time.
    surfaces: list of (area_m2, absorption_coefficient) pairs
    """
    total_absorption = sum(area * alpha for area, alpha in surfaces)
    if total_absorption == 0:
        return float('inf')
    return 0.161 * volume_m3 / total_absorption

def trace_ray(source, angle_deg, walls, max_bounces=20, speed=343):
    """
    Trace a single acoustic ray through a 2D rectangular space.
    Returns list of (time_ms, distance, energy_fraction) at each reflection.
    """
    angle = np.radians(angle_deg)
    x, y = source
    dx = np.cos(angle)
    dy = np.sin(angle)
    energy = 1.0
    reflections = []

    for bounce in range(max_bounces):
        # Find nearest wall intersection
        min_t = float('inf')
        hit_wall = None

        for wall in walls:
            wx, wy, wlen, wnx, wny, walpha = wall
            # Simplified: axis-aligned walls only
            if abs(wnx) > 0.5:  # vertical wall
                if abs(dx) > 1e-10:
                    t = (wx - x) / dx
                    if t > 0.001:
                        hit_y = y + dy * t
                        if 0 <= hit_y <= wy + wlen:
                            if t < min_t:
                                min_t = t
                                hit_wall = wall
            else:  # horizontal wall
                if abs(dy) > 1e-10:
                    t = (wy - y) / dy
                    if t > 0.001:
                        hit_x = x + dx * t
                        if 0 <= hit_x <= wx + wlen:
                            if t < min_t:
                                min_t = t
                                hit_wall = wall

        if hit_wall is None or min_t == float('inf'):
            break

        x += dx * min_t
        y += dy * min_t
        distance = min_t
        time_ms = distance / speed * 1000

        # Absorb energy at wall
        alpha = hit_wall[5]
        energy *= (1 - alpha)

        # Reflect
        if abs(hit_wall[3]) > 0.5:
            dx = -dx
        else:
            dy = -dy

        reflections.append((time_ms, distance, energy))

        if energy < 0.001:
            break

    return reflections

# Cathedral dimensions
cathedrals = {
    "Chartres": {"L": 130, "W": 32, "H": 37, "V": 100000},
    "Notre-Dame": {"L": 128, "W": 40, "H": 33, "V": 108000},
    "Beauvais": {"L": 72, "W": 27, "H": 48, "V": 80000},
    "Sainte-Chapelle": {"L": 36, "W": 10, "H": 20, "V": 5000},
}

# Surface absorption coefficients (at 500 Hz)
stone_alpha = 0.02    # bare stone — very reflective
glass_alpha = 0.04    # stained glass
wood_alpha = 0.10     # wooden pews
congregation = 0.60   # seated people absorb well

print("=== Cathedral Acoustics: Sabine RT60 ===\\\n")
print(f"{'Cathedral':<20} {'Volume':>8} {'RT60 (empty)':>13} {'RT60 (full)':>12}")
print("-" * 55)

for name, dims in cathedrals.items():
    V = dims["V"]
    # Surfaces: floor, ceiling, walls, windows
    floor = dims["L"] * dims["W"]
    ceiling = floor
    walls = 2 * (dims["L"] + dims["W"]) * dims["H"]
    windows = walls * 0.3  # 30% of wall area is glass
    solid_walls = walls * 0.7

    # Empty cathedral
    surfaces_empty = [
        (floor, stone_alpha), (ceiling, stone_alpha),
        (solid_walls, stone_alpha), (windows, glass_alpha),
    ]
    rt_empty = sabine_rt60(V, surfaces_empty)

    # Full cathedral (1 person per 1.5 m²)
    n_people = floor * 0.4 / 1.5  # 40% of floor is seating
    people_area = n_people * 0.5  # 0.5 m² per person
    surfaces_full = surfaces_empty + [(people_area, congregation)]
    rt_full = sabine_rt60(V, surfaces_full)

    print(f"{name:<20} {V:>7,} m³ {rt_empty:>10.1f} s {rt_full:>10.1f} s")

print("\\\nIdeal RT60: chant 4-6s, organ 3-5s, speech 1-2s")`,
      challenge: 'Sainte-Chapelle is famous for being almost entirely glass (75% of wall area is stained glass windows). Recalculate its RT60 with 75% glass walls. How does replacing stone with glass change the acoustics? Why does Sainte-Chapelle sound "brighter" than Chartres?',
      successHint: 'Acoustic ray tracing and the Sabine equation are the tools that every acoustic engineer uses to design concert halls, recording studios, and lecture theatres. You just applied them to medieval cathedrals — spaces that were designed by intuition and trial-and-error to achieve acoustics that modern engineers struggle to replicate.',
    },
    {
      title: 'Construction staging — building sequence over 200 years',
      concept: `A Gothic cathedral was not built all at once — construction typically spanned **100-300 years**, with different sections built by different generations of workers under different master masons. The building sequence had to ensure that the structure was **stable at every intermediate stage**, not just when complete.

**Critical path analysis** determines which tasks must happen in sequence and which can run in parallel. The critical path is the longest chain of sequential tasks — it determines the minimum total construction time.

Gothic cathedral construction followed a specific sequence:
1. **Foundations and choir** (east end) — built first so services could begin early
2. **Nave walls** — extended westward from the choir
3. **Flying buttresses** — built alongside the walls they support
4. **Vaults** — the last structural element, requiring all supports in place
5. **Towers and facade** — often the last to be built (sometimes never completed)

📚 *The critical path method (CPM) was formalised in the 1950s, but medieval builders practiced it intuitively. Every task depended on which walls and supports were already standing.*`,
      analogy: 'Building a cathedral is like baking a layered cake — you can\'t add the frosting until the cake has cooled, you can\'t stack layers until each one is baked, but you CAN make the frosting while the cake bakes. Some tasks are sequential (bake then cool), others are parallel (make frosting while baking). The critical path is the sequence of tasks you CAN\'T overlap.',
      storyConnection: 'Chartres Cathedral was rebuilt after a fire in 1194 — the main structure was completed in just 26 years (by 1220), exceptionally fast for a Gothic cathedral. This speed was achieved by having the choir, nave, and transepts under construction simultaneously by separate teams — a medieval example of parallel construction staging.',
      checkQuestion: 'Task A (foundations) takes 5 years. Task B (walls) takes 15 years and needs A. Task C (buttresses) takes 8 years and needs A. Task D (vaults) takes 4 years and needs B and C. What is the critical path?',
      checkAnswer: 'Path A→B→D = 5+15+4 = 24 years. Path A→C→D = 5+8+4 = 17 years. The critical path is A→B→D at 24 years. Task C has 7 years of "float" — it could start 7 years late without delaying the project. The critical path determines the minimum total time.',
      codeIntro: 'Model the construction staging of a Gothic cathedral — find the critical path and simulate multi-generational building.',
      code: `import numpy as np

def critical_path(tasks):
    """
    Calculate critical path through a task dependency graph.
    tasks: dict of {name: (duration_years, [dependencies])}
    Returns: (critical_path, total_duration, schedule)
    """
    # Forward pass: earliest start times
    earliest = {}

    def get_earliest(name):
        if name in earliest:
            return earliest[name]
        dur, deps = tasks[name]
        if not deps:
            earliest[name] = 0
        else:
            earliest[name] = max(get_earliest(d) + tasks[d][0] for d in deps)
        return earliest[name]

    for name in tasks:
        get_earliest(name)

    # Total project duration
    total = max(earliest[n] + tasks[n][0] for n in tasks)

    # Backward pass: latest start times
    latest = {}
    for name in tasks:
        dur, deps = tasks[name]
        # Find tasks that depend on this one
        successors = [n for n, (d, ds) in tasks.items() if name in ds]
        if not successors:
            latest[name] = total - dur
        else:
            latest[name] = min(latest.get(s, total) for s in successors) - dur

    # Identify critical path (tasks with zero float)
    schedule = []
    for name in tasks:
        dur, deps = tasks[name]
        es = earliest[name]
        ls = latest.get(name, es)
        float_time = ls - es
        is_critical = float_time < 0.5
        schedule.append((name, dur, es, ls, float_time, is_critical))

    # Sort by earliest start
    schedule.sort(key=lambda x: x[2])

    cp = [s[0] for s in schedule if s[5]]

    return cp, total, schedule

# Chartres Cathedral construction (post-1194 fire)
tasks = {
    "Site clearance":       (1, []),
    "Foundation (choir)":   (3, ["Site clearance"]),
    "Foundation (nave)":    (3, ["Site clearance"]),
    "Foundation (transept)":(2, ["Site clearance"]),
    "Choir walls":          (6, ["Foundation (choir)"]),
    "Nave walls":           (10, ["Foundation (nave)"]),
    "Transept walls":       (5, ["Foundation (transept)"]),
    "Choir buttresses":     (4, ["Choir walls"]),
    "Nave buttresses":      (7, ["Nave walls"]),
    "Transept buttresses":  (3, ["Transept walls"]),
    "Choir vaults":         (3, ["Choir buttresses"]),
    "Nave vaults":          (5, ["Nave buttresses", "Transept buttresses"]),
    "Rose windows":         (4, ["Transept walls"]),
    "West facade":          (8, ["Nave walls"]),
    "North tower":          (12, ["West facade"]),
    "South tower":          (10, ["West facade"]),
    "Stained glass":        (15, ["Choir vaults", "Nave vaults", "Rose windows"]),
}

cp, total, schedule = critical_path(tasks)

print("=== Chartres Cathedral Construction Schedule ===\\\n")
print(f"{'Task':<26} {'Dur':>4} {'Start':>6} {'End':>6} {'Float':>6} {'Critical':>9}")
print("-" * 60)

for name, dur, es, ls, ft, crit in schedule:
    marker = ">>>" if crit else ""
    print(f"{name:<26} {dur:>3}yr {es:>5.0f} {es+dur:>5.0f} {ft:>5.0f}yr {marker:>8}")

print(f"\\\nCritical path: {' -> '.join(cp)}")
print(f"Minimum construction time: {total:.0f} years")
print(f"Tasks on critical path: {len(cp)} of {len(tasks)}")

# Compare with actual construction times
print("\\\n=== Historical Construction Durations ===")
cathedrals = [
    ("Chartres (rebuild)", 1194, 1220, "Fast — parallel teams"),
    ("Notre-Dame de Paris", 1163, 1345, "182 years — many pauses"),
    ("Cologne Cathedral", 1248, 1880, "632 years — centuries-long halt"),
    ("Beauvais", 1225, 1600, "375 years — never completed"),
    ("Sainte-Chapelle", 1242, 1248, "6 years — royal priority"),
]

for name, start, end, note in cathedrals:
    print(f"  {name:<24} {end-start:>4} years ({start}-{end}) — {note}")`,
      challenge: 'Add a "worker availability" constraint: each year, only 200 workers are available, and each task requires a certain number of workers. If two tasks overlap and together need more than 200 workers, one must be delayed. How does this resource constraint change the schedule? This is resource-levelled scheduling — the real-world constraint that medieval builders faced.',
      successHint: 'You just applied critical path analysis — the standard tool for project management in construction, software development, and manufacturing. Every modern building project uses CPM software to plan and track construction. The medieval master masons managed the same complexity with experience and intuition.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Structural analysis and cathedral engineering</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 2 covers voussoir geometry, moment equilibrium, stained glass optics, acoustic ray tracing, and construction staging.
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
