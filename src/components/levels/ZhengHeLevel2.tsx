import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function ZhengHeLevel2() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Metacentric height — why ships stay upright (or capsize)',
      concept: `When a ship tilts (heels), the centre of buoyancy shifts to the side. The vertical line through the new centre of buoyancy intersects the ship's centreline at a point called the **metacentre (M)**. The distance from the centre of gravity (G) to the metacentre is the **metacentric height (GM)**.

**If GM > 0**: the ship is stable — when it tilts, the buoyancy force creates a restoring torque that pushes it upright.
**If GM < 0**: the ship is unstable — when it tilts, the torque pushes it further over. It capsizes.

The metacentric height is calculated as: **GM = BM - BG**, where BM = I / V (second moment of waterplane area divided by displaced volume) and BG is the distance from the centre of buoyancy to the centre of gravity.

For Zheng He's treasure ships (~120 m long, ~50 m beam), the wide, flat hull gave a large waterplane moment I and therefore a large BM — making them inherently stable despite their enormous size.

📚 *The metacentric height is the single most important parameter in ship stability. Naval architects check it before anything else. Too small = capsizes in waves. Too large = snaps back too fast and damages cargo.*`,
      analogy: 'Stand with your feet wide apart and lean sideways — you naturally spring back upright because your support base is wide. Now stand with feet together and lean — much easier to fall over. A ship\'s beam (width) works the same way: wider hull = wider "stance" = higher metacentric height = more stable.',
      storyConnection: 'Zheng He\'s treasure ships were reported as ~120 m long and ~50 m wide — a length-to-beam ratio of about 2.4:1, unusually wide compared to European ships (3:1 to 4:1). This extreme beam gave them enormous stability, essential for carrying heavy cargo (silk, porcelain, spices) across the open Indian Ocean without capsizing.',
      checkQuestion: 'A ship has a waterplane second moment of area I = 50,000 m⁴, displaced volume V = 10,000 m³, and BG = 2.0 m. What is the metacentric height GM? Is the ship stable?',
      checkAnswer: 'BM = I/V = 50,000/10,000 = 5.0 m. GM = BM - BG = 5.0 - 2.0 = 3.0 m. Since GM > 0, the ship is stable. A GM of 3.0 m is actually quite large — the ship would feel very stiff, snapping back quickly from any heel. Typical merchant ships have GM = 0.5-1.5 m.',
      codeIntro: 'Calculate metacentric height for different hull forms and determine stability limits.',
      code: `import numpy as np

# Ship parameters for stability analysis
ships = [
    {"name": "Zheng He treasure ship", "L": 120, "B": 50, "T": 7.5, "KG": 5.0},
    {"name": "Chinese war junk",       "L": 30,  "B": 8,  "T": 2.5, "KG": 2.0},
    {"name": "Portuguese caravel",     "L": 25,  "B": 7,  "T": 2.0, "KG": 2.5},
    {"name": "Spanish galleon",        "L": 40,  "B": 12, "T": 4.0, "KG": 4.5},
    {"name": "Modern container ship",  "L": 300, "B": 48, "T": 14,  "KG": 12.0},
]

print("=== Metacentric Height (GM) Analysis ===")
print(f"{'Ship':<28} {'L(m)':>5} {'B(m)':>5} {'T(m)':>5} {'BM(m)':>6} {'BG(m)':>6} {'GM(m)':>6} {'Stable?':>8}")
print("-" * 72)

for s in ships:
    # Waterplane second moment of area (rectangular approximation)
    # I = (L × B³) / 12
    I_wp = s["L"] * s["B"]**3 / 12

    # Displaced volume (block coefficient ~0.6 for traditional ships)
    Cb = 0.6
    V_disp = s["L"] * s["B"] * s["T"] * Cb

    # BM = I / V
    BM = I_wp / V_disp

    # Centre of buoyancy KB ~ 0.53 × draft (for typical hull forms)
    KB = 0.53 * s["T"]

    # BG = KG - KB
    BG = s["KG"] - KB

    # GM = BM - BG
    GM = BM - BG

    stable = "YES" if GM > 0 else "CAPSIZE!"
    stiffness = "stiff" if GM > 2.0 else "comfortable" if GM > 0.5 else "tender"

    print(f"{s['name']:<28} {s['L']:>4.0f} {s['B']:>4.0f} {s['T']:>4.0f} "
          f"{BM:>5.1f} {BG:>5.1f} {GM:>5.1f}  {stable} ({stiffness})")

# What if the treasure ship were narrower?
print("\\\n=== Effect of Beam on Treasure Ship Stability ===")
print(f"{'Beam (m)':<10} {'BM (m)':>8} {'GM (m)':>8} {'Roll period (s)':>16}")
for beam in [30, 35, 40, 45, 50, 55]:
    I_wp = 120 * beam**3 / 12
    V_disp = 120 * beam * 7.5 * 0.6
    BM = I_wp / V_disp
    KB = 0.53 * 7.5
    BG = 5.0 - KB
    GM = BM - BG
    # Natural roll period T ~ 2π × B / (2 × √(g × GM))
    if GM > 0:
        T_roll = 2 * np.pi * beam / (2 * np.sqrt(9.81 * GM))
    else:
        T_roll = float('inf')
    print(f"{beam:<10.0f} {BM:>7.1f} {GM:>7.1f} {T_roll:>14.1f}")`,
      challenge: 'Cargo loading raises the centre of gravity (KG). Calculate how many tonnes of cargo stacked on the top deck (raising KG by 2 m) before GM drops below 0.5 m (the minimum safe stability). This is the real loading limit calculation every ship does before departure.',
      successHint: 'Metacentric height is the foundation of naval architecture — every ship ever built has its GM calculated before launch. You now understand why wide ships are stable, why top-heavy loading is dangerous, and why Zheng He\'s unusually wide treasure ships could carry enormous cargoes safely across open ocean.',
    },
    {
      title: 'Sail force calculation — decomposing wind into drive and heel',
      concept: `A sail doesn't simply "catch" the wind — it generates an **aerodynamic force** that can be decomposed into two components:

**Drive force** (along the ship's heading): propels the ship forward.
**Heel force** (perpendicular to heading): pushes the ship sideways, causing it to tilt.

The total aerodynamic force on a sail is: **F = 0.5 × ρ_air × V² × A × C_L**, where ρ_air is air density, V is apparent wind speed, A is sail area, and C_L is the lift coefficient (depends on sail shape and angle of attack).

The decomposition depends on the angle between the wind and the ship's heading:
- **Drive = F × cos(α)** where α is the angle between the force and the ship's heading
- **Heel = F × sin(α)**

Running before the wind (wind from behind) gives maximum drive and minimum heel. Sailing close-hauled (wind from ahead-side) gives less drive but significant heel — requiring the ship's stability (GM) to resist capsizing.

📚 *A sail is an aerofoil — it generates lift the same way an airplane wing does. The curved shape creates low pressure on the lee side, pulling the sail (and the ship) forward.*`,
      analogy: 'Hold your hand out a car window at an angle. You feel two forces: one pushing your hand backward (drag) and one pushing it upward or downward (lift). Tilt your hand and the ratio changes. A sail works the same way — the angle to the wind determines how much force goes forward (drive) vs sideways (heel).',
      storyConnection: 'Zheng He\'s junks used balanced lug sails with bamboo battens — a design that allowed rapid angle adjustment. The battens stiffened the sail, maintaining an efficient aerofoil shape across a wide range of wind angles. This versatility was critical for navigating the shifting monsoon winds of the Indian Ocean.',
      checkQuestion: 'A sail generates 10,000 N of total force at 30 degrees to the ship\'s heading. What are the drive and heel components?',
      checkAnswer: 'Drive = 10,000 × cos(30°) = 10,000 × 0.866 = 8,660 N. Heel = 10,000 × sin(30°) = 10,000 × 0.5 = 5,000 N. So 87% of the force drives the ship forward and 50% tries to tip it over. This is why wide, stable ships (high GM) can sail closer to the wind — they resist the heel force.',
      codeIntro: 'Calculate sail forces for different wind angles and determine the optimal sailing point.',
      code: `import numpy as np

def sail_force(wind_speed, sail_area, wind_angle_deg, C_L=1.2):
    """
    Calculate drive and heel forces from a sail.
    wind_angle_deg: angle between apparent wind and ship heading
    (0 = wind from dead astern, 90 = beam wind, 180 = head wind)
    """
    rho_air = 1.225  # kg/m³
    angle_rad = np.radians(wind_angle_deg)

    # Total aerodynamic force
    # Effective angle of attack (sails can't work below ~30° or above ~170°)
    if wind_angle_deg < 30 or wind_angle_deg > 170:
        return 0, 0, 0

    # Apparent wind component on sail
    F_total = 0.5 * rho_air * wind_speed**2 * sail_area * C_L

    # Decompose into drive and heel
    # Sail force acts roughly perpendicular to sail, which is set at ~half wind angle
    sail_angle = angle_rad / 2
    drive = F_total * np.cos(sail_angle)
    heel = F_total * np.sin(sail_angle)

    return F_total, drive, heel

# Zheng He's treasure ship sail plan
# 9 masts, total estimated sail area ~3,000 m²
total_sail_area = 3000  # m²
wind_speed = 8  # m/s (moderate trade wind, ~15 knots)

print("=== Sail Force Analysis: Zheng He Treasure Ship ===")
print(f"Sail area: {total_sail_area} m² | Wind: {wind_speed} m/s ({wind_speed*1.944:.0f} knots)")
print()
print(f"{'Wind Angle':>11} {'Total (kN)':>11} {'Drive (kN)':>11} {'Heel (kN)':>11} {'Drive %':>8}")
print("-" * 54)

best_drive = 0
best_angle = 0

for angle in range(30, 175, 5):
    F, drv, hl = sail_force(wind_speed, total_sail_area, angle)
    if F > 0:
        pct = drv / F * 100
        if drv > best_drive:
            best_drive = drv
            best_angle = angle
        if angle % 15 == 0 or angle == 30:
            print(f"{angle:>9}° {F/1000:>10.1f} {drv/1000:>10.1f} {hl/1000:>10.1f} {pct:>7.0f}%")

print(f"\\\nOptimal sailing angle: {best_angle}° (max drive: {best_drive/1000:.1f} kN)")

# Speed estimate using drag balance
# At steady speed: drive force = hull drag
# Hull drag ≈ 0.5 × ρ_water × V² × wetted_area × Cf
print("\\\n=== Estimated Ship Speed vs Wind Angle ===")
rho_water = 1025
wetted_area = 120 * 50 * 0.7  # rough estimate
Cf = 0.003  # friction coefficient for wooden hull

for angle in [45, 60, 90, 120, 150]:
    _, drv, _ = sail_force(wind_speed, total_sail_area, angle)
    if drv > 0:
        # V = sqrt(2 × drive / (rho × A × Cf))
        v_ship = np.sqrt(2 * drv / (rho_water * wetted_area * Cf))
        v_knots = v_ship * 1.944
        print(f"  Wind at {angle:>3}°: speed = {v_ship:.1f} m/s ({v_knots:.1f} knots)")`,
      challenge: 'Zheng He\'s ships had 9 masts with individually adjustable sails. Model each mast separately (different sizes, different angles) and find the optimal combination of sail angles for a beam wind (90 degrees). This is how modern racing yachts optimise their sail trim — except they use real-time computers.',
      successHint: 'Sail force decomposition is vector physics applied to fluid mechanics. You calculated the same forces that yacht designers compute using computational fluid dynamics (CFD). The key insight: a sail is an aerofoil, and the angle of attack determines the balance between forward drive and sideways heel.',
    },
    {
      title: 'Wood material properties — grain direction and moisture effects',
      concept: `Wood is an **anisotropic** material — its strength depends on the direction of the force relative to the grain. Along the grain (longitudinal), wood is remarkably strong. Across the grain (radial or tangential), it's much weaker.

Key properties:
- **Longitudinal strength** (along grain): 40-100 MPa in tension, 30-50 MPa in compression
- **Transverse strength** (across grain): only 2-5 MPa — 10-20× weaker
- **Shear strength** (parallel to grain): 5-10 MPa — this is how planks split

Moisture profoundly affects wood: below the **fibre saturation point (~28%)**, absorbed water weakens the cell walls. Above that point (free water in cell cavities), no further weakening occurs. Drying wood from 28% to 12% moisture can increase strength by 50%.

📚 *Wood is nature's composite: cellulose fibres (strong in tension) embedded in lignin (resists compression). The fibres run along the grain — which is why wood is strong along the grain and weak across it, just like a bundle of ropes is strong along its length but easily separated sideways.*`,
      analogy: 'Think of a bundle of drinking straws glued together. Push along the straws — very strong (the walls of every straw resist). Push sideways — the straws separate easily. Pull one straw out — easy. Wood grain works the same way: cellulose fibres are the straws, and lignin is the glue between them.',
      storyConnection: 'Zheng He\'s shipbuilders used teak and camphor wood — species chosen specifically for their properties. Teak has natural oils that resist water absorption (keeping moisture below 15% even at sea), while its interlocking grain resists splitting. The keel was oriented so the grain ran along the ship\'s length, maximising longitudinal strength where bending stresses are greatest.',
      checkQuestion: 'A ship\'s plank is loaded in tension along the grain (40 MPa capacity) and the connecting bolt pushes across the grain (4 MPa capacity). Which fails first?',
      checkAnswer: 'The bolt hole fails first — the cross-grain bearing stress around the hole will reach 4 MPa long before the plank reaches 40 MPa along the grain. This is why shipbuilders use large washers and multiple bolts: to spread the cross-grain load over a larger area.',
      codeIntro: 'Model how grain direction and moisture content affect the strength of ship timbers.',
      code: `import numpy as np

# Wood species used in Chinese shipbuilding
woods = [
    {"name": "Teak",         "rho": 650, "long_mpa": 95, "trans_mpa": 5.5, "shear_mpa": 10, "moisture_resist": 0.85},
    {"name": "Camphor",      "rho": 530, "long_mpa": 65, "trans_mpa": 4.0, "shear_mpa": 7,  "moisture_resist": 0.75},
    {"name": "China fir",    "rho": 350, "long_mpa": 40, "trans_mpa": 2.5, "shear_mpa": 5,  "moisture_resist": 0.50},
    {"name": "Ironwood",     "rho": 1050,"long_mpa": 130,"trans_mpa": 8.0, "shear_mpa": 14, "moisture_resist": 0.70},
    {"name": "European oak", "rho": 700, "long_mpa": 85, "trans_mpa": 5.0, "shear_mpa": 9,  "moisture_resist": 0.65},
]

print("=== Wood Anisotropy: Strength by Direction ===")
print(f"{'Species':<16} {'Density':>7} {'Along grain':>12} {'Across grain':>13} {'Shear':>7} {'Ratio':>6}")
print(f"{'':>16} {'kg/m³':>7} {'MPa':>12} {'MPa':>13} {'MPa':>7} {'L/T':>6}")
print("-" * 63)

for w in woods:
    ratio = w["long_mpa"] / w["trans_mpa"]
    print(f"{w['name']:<16} {w['rho']:>6} {w['long_mpa']:>10.0f} {w['trans_mpa']:>11.1f} "
          f"{w['shear_mpa']:>6.0f} {ratio:>5.0f}:1")

# Moisture effect on strength
print("\\\n=== Moisture Content vs Strength (Teak) ===")
teak_dry = 95  # MPa at 12% moisture
print(f"{'Moisture %':>11} {'Strength (MPa)':>15} {'% of Dry':>9} {'Condition':>20}")
print("-" * 57)

for mc in [5, 8, 12, 18, 24, 28, 35, 50]:
    if mc <= 28:
        # Below fibre saturation: strength decreases linearly
        factor = 1.0 + 0.03 * (12 - mc)  # 3% change per 1% moisture
        factor = max(factor, 0.5)
    else:
        # Above fibre saturation: no further change
        factor = 1.0 + 0.03 * (12 - 28)
    strength = teak_dry * factor
    pct = factor * 100
    condition = ("oven-dried" if mc < 8 else "air-dried" if mc < 15
                 else "partially wet" if mc < 25 else "saturated" if mc <= 28
                 else "waterlogged")
    print(f"{mc:>9}% {strength:>13.1f} {pct:>8.0f}% {condition:>20}")

print("\\\nBelow 28% (fibre saturation): strength changes with moisture.")
print("Above 28%: cell walls are saturated — no further strength loss.")
print("Teak's natural oils keep moisture low even in marine environments.")

# Plank sizing for treasure ship
print("\\\n=== Hull Plank Sizing (Treasure Ship) ===")
hull_load_kpa = 80  # hydrostatic pressure at 7.5m draft
for w in woods:
    # Required thickness: t = sqrt(6 × P × span² / (strength × width))
    # Assume plank spans 0.6m between frames
    span = 0.6  # m between frames
    width = 0.3  # m plank width
    # Across-grain bending: use transverse strength with safety factor 4
    safe_stress = w["trans_mpa"] * 1000 / 4  # kPa
    t_required = np.sqrt(6 * hull_load_kpa * span**2 / (safe_stress * width)) * 1000
    print(f"{w['name']:<16} Required plank thickness: {t_required:>5.0f} mm")`,
      challenge: 'Wooden ships at sea undergo cyclic wetting and drying. Model 20 years of seasonal moisture cycling (wet monsoon: 25% MC, dry season: 14% MC) and calculate the cumulative fatigue damage to a teak plank. Each cycle weakens the wood slightly — how many cycles before the plank needs replacing?',
      successHint: 'Wood anisotropy is one of the most important concepts in structural timber engineering. Every wooden structure — from ships to houses to bridges — must account for grain direction. You now understand why shipbuilders were so particular about timber selection and grain orientation.',
    },
    {
      title: 'Hull plate stress — bending between frames',
      concept: `A ship's hull planking spans between structural frames (ribs). Water pressure pushes inward on the planks, bending them between the frames like a beam supported at two ends with a distributed load.

The **bending stress** in a plank is: **σ = M / Z**, where M is the bending moment and Z is the section modulus.

For a uniformly loaded beam (hydrostatic pressure on a plank) supported at both ends:
- **M_max = w × L² / 8** (maximum moment at mid-span)
- **Z = b × t² / 6** (section modulus for a rectangular cross-section)

Where w is the load per unit length (pressure × plank width), L is the span (frame spacing), b is the plank width, and t is the plank thickness.

The hydrostatic pressure at depth d is: **P = ρ_water × g × d**. At the keel of a ship with 7.5 m draft, that's about 75 kPa — significant force pushing inward on every plank.

📚 *Frame spacing is a critical design choice: closer frames = lower plank stress (shorter span) but more weight and construction time. The designer must balance structural adequacy against weight and cost.*`,
      analogy: 'Lay a ruler across two books and press down in the middle — it bends. Use thicker books closer together, and the ruler bends less. The ruler is the hull plank, the books are the frames, and your finger is the water pressure. Closer frames (closer books) and thicker planks (thicker ruler) reduce the bending stress.',
      storyConnection: 'Zheng He\'s treasure ships had closely spaced frames — approximately 0.5-0.6 m apart — much closer than European ships of the same era (0.8-1.0 m). This tighter frame spacing allowed thinner planks to resist the enormous hydrostatic pressures at the keel of a ship with 7+ metre draft.',
      checkQuestion: 'A hull plank is 300 mm wide, 80 mm thick, and spans 600 mm between frames. Water pressure is 50 kPa. What is the maximum bending stress?',
      checkAnswer: 'Load per unit length: w = 50 × 0.3 = 15 kN/m. M_max = 15 × 0.6² / 8 = 0.675 kN·m. Z = 0.3 × 0.08² / 6 = 3.2 × 10⁻⁴ m³. σ = 0.675 / 3.2×10⁻⁴ = 2,109 kPa = 2.1 MPa. For teak (transverse strength ~5.5 MPa), the safety factor is 5.5/2.1 = 2.6 — adequate but not generous.',
      codeIntro: 'Calculate hull plate bending stress at different depths and frame spacings for the treasure ship.',
      code: `import numpy as np

def hull_plank_stress(depth_m, frame_spacing_m, plank_width_m, plank_thickness_m):
    """
    Calculate bending stress in a hull plank between frames.
    Returns stress in MPa and safety factor for teak.
    """
    rho_water = 1025  # kg/m³
    g = 9.81

    # Hydrostatic pressure at depth
    P = rho_water * g * depth_m / 1000  # kPa

    # Load per unit length on plank
    w = P * plank_width_m  # kN/m

    # Maximum bending moment (simply supported, uniform load)
    M = w * frame_spacing_m**2 / 8  # kN·m

    # Section modulus
    Z = plank_width_m * plank_thickness_m**2 / 6  # m³

    # Bending stress
    sigma = M / Z / 1000  # convert kN·m / m³ to MPa

    return P, sigma

# Treasure ship parameters
draft = 7.5  # m
teak_trans_strength = 5.5  # MPa (across grain)

print("=== Hull Plank Stress Analysis ===")
print("Ship: Zheng He Treasure Ship | Draft: 7.5 m | Material: Teak")
print()

# Vary depth
plank_w = 0.30  # m
plank_t = 0.10  # m (100 mm thick planks)
frame_sp = 0.55  # m

print(f"Frame spacing: {frame_sp*1000:.0f} mm | Plank: {plank_w*1000:.0f} × {plank_t*1000:.0f} mm")
print(f"{'Depth (m)':<10} {'Pressure (kPa)':>15} {'Stress (MPa)':>13} {'Safety Factor':>14}")
print("-" * 54)

for depth in np.arange(0.5, draft + 0.1, 0.5):
    P, sigma = hull_plank_stress(depth, frame_sp, plank_w, plank_t)
    sf = teak_trans_strength / sigma if sigma > 0 else float('inf')
    warning = " << LOW" if sf < 2.0 else ""
    print(f"{depth:<9.1f} {P:>13.1f} {sigma:>11.2f} {sf:>12.1f}{warning}")

# Vary frame spacing at maximum depth (keel)
print(f"\\\n=== Frame Spacing Effect at Keel ({draft} m depth) ===")
print(f"{'Spacing (mm)':<13} {'Stress (MPa)':>13} {'Safety Factor':>14} {'Assessment':>12}")
print("-" * 54)

for spacing in [400, 500, 550, 600, 700, 800, 1000]:
    P, sigma = hull_plank_stress(draft, spacing/1000, plank_w, plank_t)
    sf = teak_trans_strength / sigma
    assessment = "Excellent" if sf > 4 else "Good" if sf > 3 else "Adequate" if sf > 2 else "RISKY"
    print(f"{spacing:<12} {sigma:>11.2f} {sf:>12.1f}  {assessment}")

# Plank thickness required for safety factor = 3 at keel
print(f"\\\n=== Required Plank Thickness (SF=3) at Keel ===")
for spacing in [400, 500, 600, 800]:
    P_keel = 1025 * 9.81 * draft / 1000  # kPa
    w = P_keel * plank_w
    M = w * (spacing/1000)**2 / 8
    # sigma = M / Z, Z = b*t²/6, need sigma = strength/SF
    sigma_allow = teak_trans_strength / 3  # MPa
    Z_required = M / (sigma_allow * 1000)  # m³
    t_required = np.sqrt(6 * Z_required / plank_w) * 1000  # mm
    print(f"  Spacing {spacing} mm -> required thickness: {t_required:.0f} mm")`,
      challenge: 'Add the effect of wave slamming: in rough seas, dynamic pressure can be 2-3x the static hydrostatic pressure. Recalculate the stress at the keel with a dynamic amplification factor of 2.5. What frame spacing is needed to maintain a safety factor of 3? This is why storm conditions are the design case for hull structures.',
      successHint: 'Hull plate bending between frames is the most fundamental calculation in ship structural design. Every classification society (Lloyd\'s, DNV, ABS) uses formulas very similar to what you just coded to determine minimum plank thickness, frame spacing, and material requirements.',
    },
    {
      title: 'Navigation chart construction — portolan chart mathematics',
      concept: `Before GPS, navigators used **portolan charts** — maps based on compass bearings and estimated distances between ports. These charts used a network of **rhumb lines** (lines of constant compass bearing) radiating from key points called **compass roses**.

The mathematics of portolan charts involves:
1. **Rhumb line navigation**: sailing at a constant compass bearing. On a sphere, this traces a **loxodrome** — a spiral path that is longer than the great circle route but much easier to follow.
2. **Dead reckoning**: estimating position from heading and speed. Position = previous position + (speed × time) in the heading direction.
3. **Mercator projection**: the mathematical transformation that makes rhumb lines appear as straight lines on a flat chart.

The Mercator projection stretches latitude as: **y = ln(tan(π/4 + φ/2))**, where φ is latitude. This distorts areas (Greenland looks huge) but preserves angles — perfect for navigation.

📚 *Chinese navigators used star altitude and compass bearing to construct charts of the Indian Ocean centuries before Mercator (1569). Their charts were less mathematically formal but remarkably accurate for practical navigation.*`,
      analogy: 'Imagine walking across a football field by always heading 45 degrees from the sideline. You\'d walk a straight diagonal line on the flat field. Now imagine doing the same on the curved surface of the Earth — your path would curve slightly because "45 degrees from north" changes direction as you move. Mercator\'s trick: distort the map so that constant-bearing path looks straight again.',
      storyConnection: 'Zheng He\'s navigators created the Mao Kun map — a strip chart showing the routes from Nanjing to the East African coast with compass bearings, star altitudes, and coastal features. They used dead reckoning between landmark sightings and stellar navigation to fix position — practical portolan-style navigation refined over seven epic voyages.',
      checkQuestion: 'A ship sails on a bearing of 060° at 5 knots for 12 hours. What is the dead reckoning displacement in the east and north directions?',
      checkAnswer: 'Distance = 5 × 12 = 60 nautical miles. East component = 60 × sin(60°) = 60 × 0.866 = 52.0 nm. North component = 60 × cos(60°) = 60 × 0.5 = 30.0 nm. Dead reckoning position: 30 nm north, 52 nm east of starting point.',
      codeIntro: 'Build a navigation calculator: dead reckoning, rhumb line distance, and Mercator projection.',
      code: `import numpy as np

def dead_reckoning(lat0, lon0, bearing_deg, distance_nm):
    """
    Calculate new position from dead reckoning.
    bearing: degrees from north (clockwise)
    distance: nautical miles
    Returns new (lat, lon) in degrees.
    """
    R_nm = 3440.065  # Earth radius in nautical miles
    bear_rad = np.radians(bearing_deg)
    d_rad = distance_nm / R_nm

    lat0_rad = np.radians(lat0)
    lon0_rad = np.radians(lon0)

    lat1 = np.arcsin(np.sin(lat0_rad) * np.cos(d_rad) +
                     np.cos(lat0_rad) * np.sin(d_rad) * np.cos(bear_rad))
    lon1 = lon0_rad + np.arctan2(
        np.sin(bear_rad) * np.sin(d_rad) * np.cos(lat0_rad),
        np.cos(d_rad) - np.sin(lat0_rad) * np.sin(lat1))

    return np.degrees(lat1), np.degrees(lon1)

def rhumb_distance(lat1, lon1, lat2, lon2):
    """Calculate rhumb line (loxodrome) distance in nautical miles."""
    dlat = np.radians(lat2 - lat1)
    dlon = np.radians(lon2 - lon1)
    lat1_r = np.radians(lat1)
    lat2_r = np.radians(lat2)

    # Mercator latitude difference
    dphi = np.log(np.tan(np.pi/4 + lat2_r/2) / np.tan(np.pi/4 + lat1_r/2))

    if abs(dphi) > 1e-10:
        q = dlat / dphi
    else:
        q = np.cos(lat1_r)

    dist_rad = np.sqrt(dlat**2 + q**2 * dlon**2)
    return dist_rad * 3440.065

# Zheng He's route: key waypoints
waypoints = [
    ("Nanjing",        32.06, 118.78),
    ("Fuzhou",         26.06, 119.31),
    ("Champa (Vietnam)", 12.25, 109.18),
    ("Malacca",         2.20, 102.25),
    ("Calicut (India)", 11.25, 75.78),
    ("Hormuz (Persia)", 27.15, 56.28),
    ("Mogadishu",       2.05,  45.34),
    ("Malindi (Kenya)", -3.22, 40.12),
]

print("=== Zheng He's Voyage Route Analysis ===")
print(f"{'Leg':<35} {'Rhumb dist':>11} {'Bearing':>8}")
print("-" * 56)

total_distance = 0
for i in range(len(waypoints) - 1):
    name1, lat1, lon1 = waypoints[i]
    name2, lat2, lon2 = waypoints[i + 1]
    dist = rhumb_distance(lat1, lon1, lat2, lon2)
    total_distance += dist

    # Bearing calculation
    dlat = np.radians(lat2 - lat1)
    dlon = np.radians(lon2 - lon1)
    dphi = np.log(np.tan(np.pi/4 + np.radians(lat2)/2) /
                  np.tan(np.pi/4 + np.radians(lat1)/2))
    bearing = np.degrees(np.arctan2(dlon, dphi)) % 360

    leg = f"{name1} -> {name2}"
    print(f"{leg:<35} {dist:>8.0f} nm {bearing:>6.0f}°")

print(f"\\\nTotal route distance: {total_distance:,.0f} nm ({total_distance * 1.852:,.0f} km)")

# Dead reckoning error accumulation
print("\\\n=== Dead Reckoning Error Accumulation ===")
print("Starting from Malacca, heading to Calicut (bearing ~285°)")
true_lat, true_lon = 11.25, 75.78  # Calicut
dr_lat, dr_lon = 2.20, 102.25     # Malacca start

bearing = 285
speed_knots = 4
total_hours = 0
errors = []

for day in range(1, 31):
    # Each day: add small random errors to speed and bearing
    actual_speed = speed_knots + np.random.normal(0, 0.5)
    actual_bearing = bearing + np.random.normal(0, 3)  # 3° compass error
    dr_lat, dr_lon = dead_reckoning(dr_lat, dr_lon, actual_bearing,
                                     actual_speed * 24)
    error_nm = rhumb_distance(dr_lat, dr_lon,
                               *dead_reckoning(2.20, 102.25, bearing,
                                               speed_knots * 24 * day))
    if day % 5 == 0:
        print(f"  Day {day:>2}: DR position ({dr_lat:.1f}°, {dr_lon:.1f}°) | "
              f"Accumulated error: ~{error_nm:.0f} nm")`,
      challenge: 'Add star-sight corrections: every 3 days, the navigator observes Polaris and corrects the latitude (reducing north-south error to near zero but leaving east-west error). How does this change the error accumulation? This is exactly how pre-GPS navigators operated — celestial fixes correcting dead reckoning drift.',
      successHint: 'You just implemented the core algorithms of pre-GPS navigation: dead reckoning, rhumb line distance, and Mercator projection. These same algorithms run in every ship\'s navigation computer today — GPS provides the fix, but the underlying mathematics of position, bearing, and distance are unchanged since Zheng He\'s time.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Naval engineering analysis and deeper physics</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 2 dives into ship stability, sail forces, timber mechanics, hull stress, and navigation mathematics.
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
