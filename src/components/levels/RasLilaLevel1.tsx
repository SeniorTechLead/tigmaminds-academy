import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function RasLilaLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'The sacred circle — why dancers move in circles',
      concept: `**Ras Lila** is a classical dance-drama from Manipur performed in a circle under moonlight. Dancers move in perfect circular paths, maintaining equal spacing — a living demonstration of **circular motion**.

Any object moving in a circle has:
- **Speed** (v) — how fast it moves along the circle
- **Radius** (r) — the size of the circle
- **Period** (T) — time for one complete revolution

These are related: **v = 2 x pi x r / T**

The circumference of a circle is 2 x pi x r. If you travel the full circumference in time T, your speed is circumference / time.

In Python, we use \`math.pi\` for the value of pi (3.14159...) and simple arithmetic to calculate these quantities.`,
      analogy: 'Circular motion is like a clock hand. The tip of the minute hand moves faster than the hour hand — same centre, same direction, but different speeds because the minute hand completes a full circle in 1 hour while the hour hand takes 12.',
      storyConnection: 'In Ras Lila, dancers on the outer ring must move faster than those on the inner ring to keep formation. This is not choreographic choice — it is physics. The outer dancers have larger r, so v = 2*pi*r/T is higher even though T is the same for all dancers.',
      checkQuestion: 'If 12 dancers form a circle of radius 5 metres and complete one revolution in 30 seconds, how fast is each dancer moving?',
      checkAnswer: 'v = 2 x pi x 5 / 30 = 1.047 m/s — about the speed of a slow walk. Even though the dance looks graceful and slow, the dancers collectively cover over 31 metres per revolution. This speed must be precisely matched by all 12 dancers.',
      codeIntro: 'Calculate the speed of Ras Lila dancers at different circle sizes.',
      code: `# Ras Lila circular motion — basic calculations
import math

period = 30  # seconds for one revolution
n_dancers = 12

print("=== Ras Lila Circular Motion ===")
print(f"Period: {period} seconds per revolution")
print(f"Dancers: {n_dancers}\\\n")

print(f"{'Radius (m)':>11} {'Speed (m/s)':>12} {'Spacing (m)':>12} {'Circum. (m)':>12}")
print("-" * 50)

for radius in [2, 3, 4, 5, 6, 8, 10]:
    circumference = 2 * math.pi * radius
    speed = circumference / period
    spacing = circumference / n_dancers

    print(f"{radius:>8}    {speed:>10.3f}  {spacing:>10.2f}  {circumference:>10.1f}")

# How fast would dancers need to move in a 20m radius circle?
big_radius = 20
big_speed = 2 * math.pi * big_radius / period
print(f"\\\nAt {big_radius}m radius: speed = {big_speed:.2f} m/s ({big_speed * 3.6:.1f} km/h)")
print("That's jogging speed — impossible to maintain graceful dance!")
print(f"\\\nThe 5m radius keeps speed at {2*math.pi*5/period:.2f} m/s — a gentle walking pace.")`,
      challenge: 'If the period changes to 20 seconds (faster dance), recalculate all speeds. At what radius does the speed become faster than walking (1.4 m/s)?',
      successHint: 'The relationship v = 2*pi*r/T connects three fundamental quantities of circular motion. Knowing any two lets you calculate the third.',
    },
    {
      title: 'Centripetal acceleration — the inward pull of the circle',
      concept: `When you move in a circle, you are constantly changing direction. Changing direction requires **acceleration**, even if your speed stays constant. This is **centripetal acceleration**:

**a = v² / r**

"Centripetal" means "centre-seeking." The acceleration always points toward the centre of the circle. Without it, you would move in a straight line (Newton's first law).

For a Ras Lila dancer, the centripetal acceleration is provided by:
- The friction of feet on the ground
- The lean of the body toward the centre
- The grip of adjacent dancers' hands

The faster the dance or the smaller the circle, the greater the centripetal acceleration — and the harder it is to maintain the circle.`,
      analogy: 'Centripetal acceleration is like the force you feel when a car turns a corner. You feel "pushed" outward, but really the car (via the seat and seatbelt) is pushing you inward toward the centre of the turn. Without that inward push, you would continue straight — through the car door.',
      storyConnection: 'In Ras Lila, dancers in very tight circles (small r) must lean inward noticeably. In wide circles, they stand nearly upright. This lean angle is a visible indicator of centripetal acceleration — physics written in body language.',
      checkQuestion: 'If a dancer moves at 1 m/s in a 5m radius circle, is the centripetal acceleration significant compared to gravity?',
      checkAnswer: 'a = v²/r = 1²/5 = 0.2 m/s². Compared to gravity (9.8 m/s²), this is only 2%. The dancer barely needs to lean. But at 3 m/s in a 2m circle: a = 9/2 = 4.5 m/s² — that is 46% of gravity! The dancer would need to lean dramatically inward.',
      codeIntro: 'Calculate centripetal acceleration for different Ras Lila dance configurations.',
      code: `# Centripetal acceleration in Ras Lila
import math

g = 9.8  # gravity for comparison

print("=== Centripetal Acceleration in Dance ===\\\n")
print(f"{'Radius':>7} {'Speed':>7} {'a_c':>8} {'vs gravity':>10} {'Lean angle':>11}")
print("-" * 48)

for radius in [2, 3, 5, 8]:
    for period in [15, 30, 60]:
        speed = 2 * math.pi * radius / period
        a_c = speed**2 / radius
        ratio = a_c / g
        # Lean angle: tan(theta) = a_c / g
        lean_deg = math.degrees(math.atan(a_c / g))

        if radius == 5 or period == 30:  # show subset
            print(f"{radius:>5}m  {speed:>5.2f}  {a_c:>7.3f}  {ratio:>8.1%}  {lean_deg:>8.1f}°")

print(f"\\\n--- Key insight ---")
print(f"At walking speed (1 m/s), 5m radius: lean = {math.degrees(math.atan(1/5/g)):.1f}°")
print(f"At running speed (3 m/s), 2m radius: lean = {math.degrees(math.atan(9/2/g)):.1f}°")
print("\\\nFast, tight circles demand visible body lean!")
print("This is why Ras Lila uses gentle speeds in wide circles — elegance requires low acceleration.")`,
      challenge: 'At what speed in a 3m radius circle would the lean angle reach 45 degrees? (Hint: tan(45) = 1, so a_c = g). What would that speed be in km/h?',
      successHint: 'Centripetal acceleration is not a "force" — it is the acceleration that describes the rate of direction change. Any circular motion, from dancers to planets, experiences it.',
    },
    {
      title: 'The centrifugal myth — there is no outward force',
      concept: `Many people believe that objects moving in circles feel a "centrifugal force" pushing them outward. **This force does not exist** in the physics of the situation (in an inertial reference frame).

What actually happens:
1. An object moves in a straight line (Newton's first law)
2. A centripetal force pulls it inward, bending the path into a circle
3. If the centripetal force disappears, the object flies off **tangentially** (sideways), not outward

The "outward push" people feel is their body's inertia — its tendency to continue in a straight line while the seat/floor/rope bends their path inward.

This is one of the most common misconceptions in physics. Getting it right is important.`,
      analogy: 'Imagine spinning a ball on a string. The string pulls the ball inward. If the string breaks, the ball does NOT fly straight outward from the centre — it flies off tangent to the circle, at 90 degrees to the radius. Try it. The ball goes sideways, not outward.',
      storyConnection: 'In the story, a dancer stumbles during Ras Lila and is "thrown outward." But actually, she continues in a straight line — tangent to the circle at the point where she stumbled. The other dancers, still moving in the circle, see her move away from the centre, creating the illusion of an outward force.',
      checkQuestion: 'If a Ras Lila dancer lets go of her neighbours\' hands while moving east on the north side of the circle, which direction does she move?',
      checkAnswer: 'She continues moving east — tangent to the circle at that point. She does NOT fly northward (outward from centre). From the perspective of other dancers still in the circle, she appears to drift outward, but she is actually going straight while they curve inward. The "outward force" is an illusion of the rotating reference frame.',
      codeIntro: 'Simulate what happens when a dancer leaves the circular path — tangential, not radial.',
      code: `# The centrifugal myth — tangential departure
import math

# Circle parameters
radius = 5.0
period = 30.0
speed = 2 * math.pi * radius / period
n_points = 100

# Generate circular path
circle_x = []
circle_y = []
for i in range(n_points + 1):
    angle = 2 * math.pi * i / n_points
    circle_x.append(radius * math.cos(angle))
    circle_y.append(radius * math.sin(angle))

# Dancer leaves circle at angle = pi/2 (top of circle, moving left)
leave_angle = math.pi / 2
leave_x = radius * math.cos(leave_angle)
leave_y = radius * math.sin(leave_angle)

# Tangent direction at that point (perpendicular to radius, in direction of motion)
# At angle pi/2, tangent points in -x direction
tangent_dx = -math.sin(leave_angle)  # -1
tangent_dy = math.cos(leave_angle)   # 0

# Radial direction (what people THINK happens — "centrifugal")
radial_dx = math.cos(leave_angle)    # 0
radial_dy = math.sin(leave_angle)    # 1

# Trace both paths
time_steps = 30
tangent_path_x = [leave_x + speed * tangent_dx * t * 0.3 for t in range(time_steps)]
tangent_path_y = [leave_y + speed * tangent_dy * t * 0.3 for t in range(time_steps)]
radial_path_x = [leave_x + speed * radial_dx * t * 0.3 for t in range(time_steps)]
radial_path_y = [leave_y + speed * radial_dy * t * 0.3 for t in range(time_steps)]

print("=== The Centrifugal Myth ===\\\n")
print(f"Dancer leaves circle at ({leave_x:.1f}, {leave_y:.1f})")
print(f"Moving in direction: ({tangent_dx:.1f}, {tangent_dy:.1f}) — tangential")
print(f"NOT in direction: ({radial_dx:.1f}, {radial_dy:.1f}) — radial")
print(f"\\\nSpeed at departure: {speed:.2f} m/s")
print(f"\\\nAfter 1 second:")
print(f"  Tangent path: ({leave_x + speed*tangent_dx:.1f}, {leave_y + speed*tangent_dy:.1f})")
print(f"  Radial path:  ({leave_x + speed*radial_dx:.1f}, {leave_y + speed*radial_dy:.1f})")
print(f"\\\nThe tangent path moves SIDEWAYS, not outward!")
print(f"Distance from centre after 1s (tangent): {math.sqrt((leave_x+speed*tangent_dx)**2 + (leave_y+speed*tangent_dy)**2):.2f}m")
print("\\\nThe dancer drifts slightly outward over time because the")
print("tangent line diverges from the circle — but the initial")
print("motion is perpendicular to the radius, NOT along it.")`,
      challenge: 'Calculate the dancer\'s distance from the centre at t=0, 1, 2, 3 seconds after leaving the circle tangentially. The distance increases — but slowly at first and then faster. This gradual increase creates the ILLUSION of outward force.',
      successHint: 'Understanding that centrifugal force is fictional is one of the most important conceptual leaps in physics. It separates people who memorise formulas from people who truly understand mechanics.',
    },
    {
      title: 'Planetary orbits — Ras Lila on a cosmic scale',
      concept: `The same physics that governs Ras Lila dancers governs **planetary orbits**. Planets move in circles (approximately) around the Sun because gravity provides the centripetal force.

**F_gravity = G x M x m / r²**  (gravitational pull)
**F_centripetal = m x v² / r**   (required for circular orbit)

Setting them equal:
**G x M / r² = v² / r**
**v = sqrt(G x M / r)**

This means:
- Closer planets move faster (smaller r → higher v)
- Farther planets move slower
- Mercury zips around at 47 km/s while Neptune crawls at 5.4 km/s

The Ras Lila dancers are like planets: inner dancers (closer to centre) must move faster to maintain the formation.`,
      analogy: 'A solar system is a giant Ras Lila. The Sun sits at the centre. Each planet dances in its own circle, with inner planets dancing faster and outer planets dancing slower. Gravity is the "hand-holding" that keeps them in formation.',
      storyConnection: 'The story draws the parallel: "As dancers circle the sacred flame, so do worlds circle their star." The Ras Lila choreography mirrors orbital mechanics — not by coincidence, but because both are governed by the same mathematical law: things moving in circles need an inward force.',
      checkQuestion: 'If Earth moved to Mars\'s orbit (1.5x farther from the Sun), would it need to move faster or slower to maintain a circular orbit?',
      checkAnswer: 'Slower. v = sqrt(GM/r), so increasing r decreases v. At Mars\'s orbit, Earth would move at sqrt(1/1.5) = 0.816 times its current speed. This is why Mars takes 687 days to orbit versus Earth\'s 365 — it moves slower AND has a longer path.',
      codeIntro: 'Calculate orbital speeds for all planets and compare to Ras Lila dancer speeds.',
      code: `# Orbital mechanics — planetary Ras Lila
import math

G = 6.674e-11      # gravitational constant (m³/kg/s²)
M_sun = 1.989e30   # mass of Sun (kg)

planets = [
    ('Mercury', 5.79e10),
    ('Venus',   1.08e11),
    ('Earth',   1.50e11),
    ('Mars',    2.28e11),
    ('Jupiter', 7.78e11),
    ('Saturn',  1.43e12),
    ('Uranus',  2.87e12),
    ('Neptune', 4.50e12),
]

print("=== Planetary Orbital Speeds ===\\\n")
print(f"{'Planet':<10} {'Radius (AU)':>11} {'Speed (km/s)':>13} {'Period (yrs)':>13}")
print("-" * 50)

AU = 1.50e11  # 1 astronomical unit

for name, r in planets:
    v = math.sqrt(G * M_sun / r)           # orbital speed (m/s)
    circumference = 2 * math.pi * r         # orbit circumference
    T = circumference / v                    # period (seconds)
    T_years = T / (365.25 * 24 * 3600)

    print(f"{name:<10} {r/AU:>10.2f}  {v/1000:>11.1f}  {T_years:>11.2f}")

# The Ras Lila connection
print("\\\n--- Ras Lila Comparison ---")
dance_radius = 5.0
dance_speed = 2 * math.pi * dance_radius / 30
print(f"Ras Lila dancer: r={dance_radius}m, v={dance_speed:.2f} m/s")
print(f"Earth orbit:     r={1.50e11/1000:.0e}km, v={math.sqrt(G*M_sun/1.50e11)/1000:.1f} km/s")
print(f"\\\nSame physics, vastly different scales!")
print(f"Both need centripetal force = mv²/r to stay in their circles.")`,
      challenge: 'If a new planet were discovered at 10 AU from the Sun, what would its orbital speed and period be? How does this compare to Neptune?',
      successHint: 'Orbital mechanics is just circular motion with gravity as the centripetal force. You can calculate the speed and period of any orbiting object if you know the mass being orbited and the orbital radius.',
    },
    {
      title: 'Kepler\'s laws — the geometry of orbits',
      concept: `Real orbits are not perfect circles — they are **ellipses**. Johannes Kepler discovered three laws:

**1st Law**: Orbits are ellipses with the Sun at one focus.
**2nd Law**: A line from the Sun to a planet sweeps equal areas in equal times (planets move faster when closer to the Sun).
**3rd Law**: T² is proportional to r³ (T²/r³ = constant for all planets).

Kepler's third law is powerful: **T² = (4*pi²/GM) x r³**

This means if you know the radius, you know the period, and vice versa. It works for any orbit: planets, moons, satellites, even binary stars.

In Python, we verify Kepler's third law by computing T²/r³ for every planet — they should all give the same value.`,
      analogy: 'Kepler\'s second law is like a figure skater doing spins. When the skater pulls their arms in (closer to axis), they spin faster. When a planet is closer to the Sun, it moves faster. Both conserve angular momentum — which is the real reason behind Kepler\'s second law.',
      storyConnection: 'In Ras Lila, when dancers move through elliptical paths (some choreographies use oval formations), they naturally speed up on the tight ends and slow down on the wide sides. Kepler\'s second law describes this perfectly — equal areas in equal times.',
      checkQuestion: 'If T²/r³ is constant for all planets, what does that constant equal?',
      checkAnswer: 'T²/r³ = 4*pi²/(G*M_sun). Plugging in: 4 x pi² / (6.674e-11 x 1.989e30) = 2.97e-19 s²/m³. This constant depends only on the Sun\'s mass. For orbits around Earth, it would be a different constant (because M_earth is different). The constant tells you the mass of the central body.',
      codeIntro: 'Verify Kepler\'s third law for all planets in the solar system.',
      code: `# Kepler's third law verification
import math

G = 6.674e-11
M_sun = 1.989e30
AU = 1.496e11

planets = [
    ('Mercury', 0.387, 87.97),
    ('Venus',   0.723, 224.7),
    ('Earth',   1.000, 365.25),
    ('Mars',    1.524, 687.0),
    ('Jupiter', 5.203, 4331),
    ('Saturn',  9.537, 10747),
    ('Uranus',  19.19, 30589),
    ('Neptune', 30.07, 59800),
]

print("=== Kepler's Third Law: T² ∝ r³ ===\\\n")
print(f"{'Planet':<10} {'r (AU)':>8} {'T (days)':>9} {'T² (yr²)':>10} {'r³ (AU³)':>10} {'T²/r³':>8}")
print("-" * 58)

theoretical_constant = (4 * math.pi**2) / (G * M_sun)

for name, r_au, T_days in planets:
    T_years = T_days / 365.25
    T_sq = T_years**2
    r_cube = r_au**3
    ratio = T_sq / r_cube

    print(f"{name:<10} {r_au:>7.3f} {T_days:>8.0f} {T_sq:>9.2f} {r_cube:>9.2f} {ratio:>7.3f}")

print(f"\\\nIf Kepler's law holds, T²/r³ should be 1.000 for all planets")
print(f"(when T is in years and r is in AU)")

# Predict: if a comet has r = 50 AU, what is its period?
r_comet = 50
T_comet = math.sqrt(r_comet**3)  # T² = r³ when using AU and years
print(f"\\\nPrediction: comet at {r_comet} AU has period = {T_comet:.0f} years")
print(f"It was last near the Sun in {2024 - int(T_comet)} and will return in {2024 + int(T_comet)}")`,
      challenge: 'Use Kepler\'s third law to calculate the orbital radius of the International Space Station (period = 92 minutes, orbiting Earth with M = 5.97e24 kg). How high above Earth\'s surface is it?',
      successHint: 'Kepler\'s laws are among the most beautiful results in physics. They were discovered empirically by Kepler and later derived from first principles by Newton. You just verified them with code.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Circular Motion Fundamentals</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L1-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint} />
        ))}
      </div>
    </div>
  );
}
