import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';
import NewtonForceDiagram from '../diagrams/NewtonForceDiagram';
import WorkForceDiagram from '../diagrams/WorkForceDiagram';
import EnergyBarChartDiagram from '../diagrams/EnergyBarChartDiagram';
import SineWaveDiagram from '../diagrams/SineWaveDiagram';
import SlopeInterceptDiagram from '../diagrams/SlopeInterceptDiagram';
import DistanceFormulaDiagram from '../diagrams/DistanceFormulaDiagram';

export default function DavidGoliathLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Variables and forces — F = ma with sling numbers',
      concept: `David's sling is a physics machine. When he swings the stone and releases it, every part of the motion is governed by **Newton's second law: F = ma** (force equals mass times acceleration).

Let's put real numbers on it. A sling stone weighs about **0.05 kg** (50 grams). David swings it in a circle, accelerating it before release. The force he applies through the sling cords determines how fast the stone goes.

In Python, we store these values in **variables** — named containers that hold numbers. You can change any variable and instantly see how it affects the result. This is what makes code powerful for physics: you can ask "what if?" a thousand times in seconds.

The code below calculates the force needed to accelerate a sling stone. Read each line — the comments explain what every variable means.`,
      analogy: 'Think of variables like labeled jars on a shelf. One jar says "mass" and holds the number 0.05. Another says "acceleration" and holds 200. F = ma just means "multiply the contents of the mass jar by the acceleration jar." You can swap in new numbers anytime.',
      storyConnection: 'David chose five smooth stones from the brook — each about 50 grams. The giant Goliath wore bronze armor weighing 57 kg. The physics question: can a 50-gram stone launched at high speed generate enough force to fell an armored giant? The answer is yes, and F = ma tells us exactly why.',
      checkQuestion: 'If David used a heavier stone (100g instead of 50g) with the same acceleration, how would the force change?',
      checkAnswer: 'The force would double. F = ma is linear in mass — doubling mass doubles force. A 100g stone at the same acceleration produces twice the impact force. But a heavier stone is also harder to accelerate in the sling, so David chose the right compromise: light enough to swing fast, heavy enough to do damage.',
      codeIntro: 'Calculate force from mass and acceleration for David\'s sling stone.',
      code: `import numpy as np

# === David's sling: the variables ===
mass = 0.05        # stone mass in kg (50 grams)
radius = 1.0       # sling length in meters
angular_speed = 30  # radians per second (about 5 full swings/sec)

# Centripetal acceleration = omega^2 * r
acceleration = angular_speed**2 * radius
print(f"Centripetal acceleration: {acceleration:.0f} m/s^2")

# Force = mass * acceleration (Newton's second law)
force = mass * acceleration
print(f"Force in the sling cord: {force:.1f} N")

# Release velocity = omega * r
v_release = angular_speed * radius
print(f"Release speed: {v_release:.0f} m/s ({v_release * 3.6:.0f} km/h)")

# Compare: how many "g"s is this?
g = 9.8
g_force = acceleration / g
print(f"\\\nThat's {g_force:.0f}g of acceleration!")
print(f"The stone feels {g_force:.0f} times its own weight")
print(f"while spinning in the sling.")`,
      challenge: 'Try changing angular_speed to 40 rad/s (faster spinning). How does the force and release speed change? At what angular_speed does the release speed exceed 150 km/h (the speed of a fast baseball pitch)?',
      successHint: 'You just used F = ma with real numbers. Variables let you change one thing and see the ripple effect on everything else. This is how physicists and engineers think — in equations with adjustable parameters.',
    },
    {
      title: 'Circular motion — the stone in the sling',
      concept: `Before David releases the stone, it moves in a **circle**. Circular motion is special because even though the speed is constant, the **direction** keeps changing — and changing direction IS acceleration.

This is **centripetal acceleration**: a = v^2 / r (or equivalently, a = omega^2 * r, where omega is angular velocity in radians/second).

The centripetal force points **inward**, toward David's hand. The sling cord provides this force. The moment David releases the cord, the inward force vanishes and the stone flies off in a **straight line tangent** to the circle — not outward, not continuing in a curve, but straight ahead in whatever direction it was moving at the instant of release.

This is why release timing matters. Release too early or too late and the stone flies in the wrong direction. Ancient slingers practiced for years to perfect this timing.`,
      analogy: 'Tie a ball to a string and swing it around your head. You feel the string pulling your hand inward — that is the centripetal force. Now let go: the ball does not fly outward (there is no outward force). It flies in a straight line tangent to the circle, like a car going straight when the road curves away.',
      storyConnection: 'David "slung" the stone — the Hebrew word implies a practiced overhead whip. Skilled slingers in ancient armies could hit targets at 100+ meters. The physics of release angle was literally a life-or-death skill on ancient battlefields. David\'s accuracy suggests years of practice with his flocks.',
      checkQuestion: 'If you swing a stone in a vertical circle (like a windmill), at what point in the circle is the string most likely to break?',
      checkAnswer: 'At the bottom of the circle. At the bottom, the string must provide centripetal force (inward = upward) AND support the stone\'s weight (also upward). So the total tension = mv^2/r + mg. At the top, gravity helps provide centripetal force, so tension = mv^2/r - mg. The bottom has the highest tension and is where the string is most likely to break.',
      codeIntro: 'Plot the circular path of the stone and the tangent release direction.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Sling parameters
radius = 1.0  # meters
omega = 30    # rad/s

# Draw the circular path
theta = np.linspace(0, 2 * np.pi, 100)
x_circle = radius * np.cos(theta)
y_circle = radius * np.sin(theta)

# Release point (choose an angle)
release_angle = np.radians(45)  # 45 degrees
x_rel = radius * np.cos(release_angle)
y_rel = radius * np.sin(release_angle)

# Tangent direction at release (perpendicular to radius)
v = omega * radius
vx = -v * np.sin(release_angle)
vy = v * np.cos(release_angle)

# Tangent line (the stone's path after release)
t_line = np.linspace(0, 0.05, 50)
x_tangent = x_rel + vx * t_line
y_tangent = y_rel + vy * t_line

plt.figure(figsize=(8, 8))
plt.plot(x_circle, y_circle, 'c--', alpha=0.5, label='Circular path')
plt.plot(0, 0, 'ko', markersize=10, label='David\'s hand')
plt.plot(x_rel, y_rel, 'ro', markersize=12, label='Release point')
plt.plot(x_tangent, y_tangent, 'r-', linewidth=3, label='Stone\'s path')
plt.arrow(x_rel, y_rel, vx*0.02, vy*0.02, head_width=0.08,
          color='red', linewidth=2)
plt.plot([0, x_rel], [0, y_rel], 'gray', linewidth=1, linestyle=':')

plt.xlim(-2, 2); plt.ylim(-2, 2)
plt.gca().set_aspect('equal')
plt.grid(alpha=0.3); plt.legend(fontsize=10)
plt.title(f'Sling Release — v = {v:.0f} m/s', fontsize=14)
plt.xlabel('x (m)'); plt.ylabel('y (m)')
plt.show()

print(f"Release speed: {v:.0f} m/s")
print(f"Direction: tangent to the circle at {np.degrees(release_angle):.0f} degrees")`,
      challenge: 'Try release_angle = 0, 90, 135, and 180 degrees. In which direction does the stone fly each time? Which release angle sends the stone straight ahead (horizontally to the right)?',
      successHint: 'Circular motion + release timing = directional control. Ancient slingers used this physics intuitively. You now understand the math behind their skill: centripetal acceleration and tangent velocity.',
    },
    {
      title: 'Projectile basics — horizontal + vertical motion',
      concept: `The moment the stone leaves the sling, only **one force** acts on it: gravity (ignoring air resistance for now). Gravity pulls the stone **downward** at 9.8 m/s^2 but does nothing to the horizontal motion.

This is the key insight of projectile motion: **horizontal and vertical motions are independent**.

- **Horizontal**: constant speed (no force, so no acceleration). x = v_x * t
- **Vertical**: accelerating downward. y = v_y * t - (1/2) * g * t^2

Together, these two equations trace out a **parabola** — the characteristic arc of any thrown or launched object. A sling stone, a basketball, a cannonball — they all follow parabolas (in the absence of air resistance).

The code below plots both components separately and then combines them into the trajectory.`,
      analogy: 'Imagine you are on a moving train and you drop a ball. From YOUR perspective, the ball falls straight down. From someone watching OUTSIDE, the ball traces a curved path (parabola) because it moves forward with the train while falling. Projectile motion is exactly this: steady horizontal movement + accelerating vertical fall = a curve.',
      storyConnection: 'When David slung the stone at Goliath, the stone did not travel in a straight line. It arced — rising slightly from the sling, then curving downward under gravity. David had to aim ABOVE Goliath\'s forehead, anticipating the drop. Every experienced slinger or archer learns this compensation instinctively.',
      checkQuestion: 'If you fire a bullet horizontally and simultaneously drop a bullet from the same height, which hits the ground first?',
      checkAnswer: 'They hit the ground at the same time. Both bullets experience the same vertical acceleration (gravity) starting from the same height with zero initial vertical velocity. The horizontal speed of the fired bullet does not affect how fast it falls. This is the independence of horizontal and vertical motion — one of the most counterintuitive facts in physics.',
      codeIntro: 'Separate horizontal and vertical motion, then combine into a trajectory.',
      code: `import numpy as np
import matplotlib.pyplot as plt

v0 = 30          # release speed (m/s)
angle = 35       # launch angle (degrees)
g = 9.8          # gravity (m/s^2)

# Decompose into horizontal and vertical
vx = v0 * np.cos(np.radians(angle))
vy = v0 * np.sin(np.radians(angle))

# Time of flight (until y returns to 0)
t_flight = 2 * vy / g
t = np.linspace(0, t_flight, 200)

# Independent motions
x = vx * t                        # constant speed
y = vy * t - 0.5 * g * t**2       # accelerated fall

fig, axes = plt.subplots(1, 3, figsize=(14, 4))

axes[0].plot(t, x, 'c', linewidth=2)
axes[0].set_title('Horizontal: x = vx * t')
axes[0].set_xlabel('Time (s)'); axes[0].set_ylabel('x (m)')
axes[0].grid(alpha=0.3)

axes[1].plot(t, y, 'orange', linewidth=2)
axes[1].set_title('Vertical: y = vy*t - g*t^2/2')
axes[1].set_xlabel('Time (s)'); axes[1].set_ylabel('y (m)')
axes[1].grid(alpha=0.3)

axes[2].plot(x, y, 'lime', linewidth=2)
axes[2].set_title('Combined: the parabola')
axes[2].set_xlabel('x (m)'); axes[2].set_ylabel('y (m)')
axes[2].grid(alpha=0.3)

plt.tight_layout(); plt.show()
print(f"Range: {x[-1]:.1f} m | Max height: {max(y):.1f} m")
print(f"Flight time: {t_flight:.2f} s")`,
      challenge: 'Change the angle to 45, 60, and 15 degrees. Which angle gives the longest range? Which gives the highest arc? Can you find the angle that maximizes range?',
      successHint: 'You now see why projectile paths are parabolas: constant horizontal + accelerating vertical = a curve. This decomposition is the foundation of ALL trajectory analysis, from sports to space missions.',
    },
    {
      title: 'Range calculator — R = v^2 sin(2theta) / g',
      concept: `There is an elegant shortcut for calculating range (horizontal distance) on flat ground:

**R = v^2 * sin(2*theta) / g**

This formula reveals something beautiful: the range depends on **sin(2*theta)**. Since sin() has a maximum of 1 at 90 degrees, and 2*theta = 90 means **theta = 45 degrees** — the maximum range always occurs at a 45-degree launch angle.

But there is more. sin(2*30) = sin(60) and sin(2*60) = sin(120) are equal (sin is symmetric around 90 degrees). This means **30 degrees and 60 degrees give the same range** — one is a low, fast trajectory; the other is a high, slow arc.

Ancient slingers discovered this empirically: a low throw and a high lob can both reach the same target. The low throw arrives faster (useful in combat), while the high throw can clear walls.`,
      analogy: 'Think of a garden hose. Tilted at 45 degrees, water reaches the farthest point on the lawn. Tilt it higher — the water goes up more but lands shorter. Tilt it lower — the water leaves fast but hits the ground too soon. 45 degrees is the sweet spot that balances height and distance perfectly.',
      storyConnection: 'David faced Goliath at relatively close range — perhaps 20-30 meters. At this distance, a slinger would use a low, fast trajectory (maybe 15-20 degrees) for accuracy and speed. The range formula tells us he did not need the maximum-range angle of 45 degrees; he needed the minimum-time angle for a given distance.',
      checkQuestion: 'Two launch angles give the same range: 30 degrees and 60 degrees. Which stone arrives at the target first?',
      checkAnswer: 'The 30-degree launch arrives first. At 30 degrees, the stone has a larger horizontal velocity component (v*cos(30) > v*cos(60)) and a shorter flight time. The 60-degree trajectory goes much higher and stays in the air longer. Same range, very different arrival times. In combat, the low trajectory is better because the target has less time to dodge.',
      codeIntro: 'Compute and plot range vs. launch angle to find the optimal angle.',
      code: `import numpy as np
import matplotlib.pyplot as plt

v0 = 30  # release speed (m/s)
g = 9.8

# Range formula for every angle from 0 to 90
angles = np.linspace(0, 90, 200)
ranges = v0**2 * np.sin(2 * np.radians(angles)) / g

plt.figure(figsize=(10, 5))
plt.plot(angles, ranges, linewidth=2.5, color='gold')
plt.axvline(45, color='red', linestyle='--', alpha=0.7, label='45 degrees (max)')

# Mark complementary pairs
for a in [30, 60]:
    r = v0**2 * np.sin(2 * np.radians(a)) / g
    plt.plot(a, r, 'o', markersize=10, color='cyan')
    plt.annotate(f'{a}deg: {r:.1f}m', xy=(a, r),
                 xytext=(a + 3, r - 5), fontsize=10, color='cyan')

plt.xlabel('Launch angle (degrees)', fontsize=12)
plt.ylabel('Range (m)', fontsize=12)
plt.title(f'Range vs Angle (v = {v0} m/s)', fontsize=14)
plt.legend(fontsize=10); plt.grid(alpha=0.3)
plt.show()

max_range = v0**2 / g
print(f"Maximum range at 45 degrees: {max_range:.1f} m")
print(f"30 deg and 60 deg give the same range: "
      f"{v0**2 * np.sin(np.radians(60))/g:.1f} m")`,
      challenge: 'What if David launches from a hilltop 3 meters above flat ground? The optimal angle shifts below 45 degrees. Modify the trajectory code from the previous lesson to include an initial height of 3m and find the new optimal angle.',
      successHint: 'R = v^2 sin(2theta)/g is a compact formula packed with insight. Maximum range at 45 degrees, complementary angle pairs, and speed matters as v-squared — these are the core rules of ballistics.',
    },
    {
      title: 'Kinetic energy — KE = 1/2 mv^2 comparisons',
      concept: `Force tells you how hard the stone pushes. **Energy** tells you how much damage it can do. The kinetic energy of a moving object is:

**KE = 1/2 * m * v^2**

Notice the **v-squared** — velocity matters far more than mass. Double the mass, you double the energy. Double the velocity, you **quadruple** the energy. This is why a small, fast sling stone can be devastating.

Let's compare David's stone to other projectiles:
- Sling stone (0.05 kg at 30 m/s): KE = 22.5 J
- Baseball pitch (0.145 kg at 40 m/s): KE = 116 J
- Arrow (0.025 kg at 60 m/s): KE = 45 J
- Bullet (0.008 kg at 370 m/s): KE = 548 J

David's stone carries about 22 Joules — modest compared to a bullet, but concentrated on a small area. Energy per unit area (energy density on impact) is what determines penetration.`,
      analogy: 'Imagine two cars: a small car going 100 km/h and a big truck going 50 km/h. Which has more kinetic energy? The truck is heavier, but the small car might have more KE because of v-squared. Speed has a disproportionate effect. This is why speed limits save more lives than weight limits — doubling speed quadruples crash energy.',
      storyConnection: 'Goliath\'s armor was heavy bronze — designed to stop slow, heavy spear thrusts. But David\'s stone was fast and small, concentrating its energy on a tiny area of Goliath\'s unprotected forehead. The physics favored David: v-squared meant his fast stone packed surprising energy, and the small impact area meant high pressure.',
      checkQuestion: 'If David could spin the sling twice as fast (60 m/s instead of 30 m/s), how much more kinetic energy would the stone have?',
      checkAnswer: 'Four times more. KE = 1/2 * m * v^2. If v doubles, v^2 quadruples, so KE quadruples: from 22.5 J to 90 J. This is the power of the v-squared relationship. It is why a sling (which can achieve higher velocities than a hand throw) was such an effective weapon.',
      codeIntro: 'Compare kinetic energies of different projectiles side by side.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Projectile data: (name, mass_kg, speed_m_s)
projectiles = [
    ("David's stone", 0.05, 30),
    ("Thrown rock",    0.20, 20),
    ("Baseball pitch", 0.145, 40),
    ("Arrow",          0.025, 60),
    ("Crossbow bolt",  0.035, 90),
    ("9mm bullet",     0.008, 370),
]

names = [p[0] for p in projectiles]
KEs = [0.5 * p[1] * p[2]**2 for p in projectiles]

plt.figure(figsize=(10, 5))
bars = plt.barh(names, KEs, color=['gold', 'orange', 'green',
                                    'cyan', 'blue', 'red'])
for bar, ke in zip(bars, KEs):
    plt.text(bar.get_width() + 5, bar.get_y() + bar.get_height()/2,
             f'{ke:.1f} J', va='center', fontsize=10, color='white')

plt.xlabel('Kinetic Energy (Joules)', fontsize=12)
plt.title('KE = 1/2 mv^2 — Speed Matters More Than Mass', fontsize=14)
plt.grid(axis='x', alpha=0.3)
plt.tight_layout(); plt.show()

print("Key insight: the bullet is lightest but has the most energy")
print("because v^2 dominates. Speed wins over mass.")`,
      challenge: 'Add a golf ball (0.046 kg at 70 m/s) and a tennis serve (0.058 kg at 60 m/s) to the comparison. Where do they rank? Which everyday sport generates the most kinetic energy?',
      successHint: 'KE = 1/2 mv^2 with its v-squared term explains why speed is the dominant factor in projectile damage. This principle applies to car crashes, ballistics, meteorite impacts, and particle physics.',
    },
    {
      title: 'Plotting trajectories — matplotlib parabolas',
      concept: `Now let's bring it all together: plot the **full trajectory** of David's stone from sling to target.

We combine everything from the previous lessons:
- Release speed from circular motion (v = omega * r)
- Decomposition into vx and vy
- Parabolic path: x(t) = vx*t, y(t) = h0 + vy*t - g*t^2/2
- Range and max height calculations

The code below plots the stone's path from David's hand to Goliath's forehead. We add David's release height (1.5m), Goliath's target height (2.7m for a ~3m tall giant's forehead), and mark the key points.

This is your first complete **physics simulation**: real numbers, real equations, visual output.`,
      analogy: 'A trajectory plot is like a time-lapse photograph of the stone in flight. Each point on the curve is where the stone is at a different moment. The curve arcs up (the stone rises from the sling), reaches a peak, and descends to the target. It is a map of the stone\'s entire journey, frozen on your screen.',
      storyConnection: 'The Valley of Elah, where David faced Goliath, was a wide valley with a dry streambed between two hills. David picked stones from this streambed. The terrain was relatively flat, making our flat-ground trajectory model a good approximation. The distance was likely 20-30 meters — well within sling range.',
      checkQuestion: 'If you launched the stone at exactly 45 degrees, would it hit a 3-meter tall giant standing 25 meters away?',
      checkAnswer: 'At 30 m/s and 45 degrees, the max range is about 91 meters and max height is about 22 meters. At 25 meters, the stone would be at a height of about 18 meters — way too high! David needed a much flatter angle (~10-15 degrees) to hit a target at head height at close range. Maximum range angle is not always the best angle.',
      codeIntro: 'Plot the complete trajectory from David\'s sling to Goliath.',
      code: `import numpy as np
import matplotlib.pyplot as plt

v0 = 30; angle = 12  # low, fast trajectory
h_david = 1.5        # David's release height (m)
h_goliath = 2.7      # Goliath's forehead height (m)
d_target = 25        # distance to Goliath (m)
g = 9.8

vx = v0 * np.cos(np.radians(angle))
vy = v0 * np.sin(np.radians(angle))

t = np.linspace(0, d_target / vx, 300)
x = vx * t
y = h_david + vy * t - 0.5 * g * t**2

plt.figure(figsize=(12, 5))
plt.plot(x, y, 'gold', linewidth=2.5, label='Stone trajectory')
plt.plot(0, h_david, 'go', markersize=12, label='David (release)')
plt.plot(d_target, h_goliath, 'rs', markersize=14, label="Goliath's head")

# Draw stick figures
plt.plot([0, 0], [0, h_david], 'g-', linewidth=3, alpha=0.5)
plt.plot([d_target, d_target], [0, 3.0], 'r-', linewidth=5, alpha=0.3)

# Find height at target
y_at_target = h_david + vy*(d_target/vx) - 0.5*g*(d_target/vx)**2
plt.annotate(f'Stone arrives at {y_at_target:.1f}m height',
             xy=(d_target, y_at_target), xytext=(d_target-8, y_at_target+1),
             fontsize=10, color='yellow',
             arrowprops=dict(arrowstyle='->', color='yellow'))

plt.xlabel('Distance (m)', fontsize=12)
plt.ylabel('Height (m)', fontsize=12)
plt.title(f'David vs Goliath — angle={angle} deg, v={v0} m/s', fontsize=14)
plt.legend(fontsize=10); plt.grid(alpha=0.3)
plt.ylim(0, 6); plt.show()

hit = "HIT" if abs(y_at_target - h_goliath) < 0.3 else "MISS"
print(f"Stone height at Goliath: {y_at_target:.2f} m — {hit}!")
print(f"Flight time: {d_target/vx:.3f} seconds")`,
      challenge: 'Adjust the angle to hit Goliath\'s forehead exactly at 2.7m height from 25m away. Try angles between 8 and 20 degrees. What is the best angle? Then try from 40m away — how does the required angle change?',
      successHint: 'You built a complete projectile simulation: real masses, real speeds, real distances, and a visual trajectory. This is how physics works in practice — equations become code, code becomes insight, insight solves problems.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">No prior physics experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for projectile motion simulations. Click to start.</p>
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
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint}
            diagram={[NewtonForceDiagram, SineWaveDiagram, DistanceFormulaDiagram, SlopeInterceptDiagram, EnergyBarChartDiagram, WorkForceDiagram][i] ? createElement([NewtonForceDiagram, SineWaveDiagram, DistanceFormulaDiagram, SlopeInterceptDiagram, EnergyBarChartDiagram, WorkForceDiagram][i]) : undefined}
            />
        ))}
      </div>
    </div>
  );
}
