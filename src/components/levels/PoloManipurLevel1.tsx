import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function PoloManipurLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'The birthplace of polo — momentum in the first sport on horseback',
      concept: `**Polo** (called "Sagol Kangjei" in Manipuri) originated in Manipur over 2,000 years ago. When a polo stick strikes the ball, the physics of **momentum** determines the outcome.

**Momentum = mass x velocity**
**p = m x v**

Momentum is a **vector** — it has both magnitude and direction. A heavier object or a faster object has more momentum. Units: kg x m/s.

When the stick hits the ball, momentum is **transferred** from stick to ball. The more momentum the stick has, the harder the hit.

In Python, we calculate momentum with simple multiplication.`,
      analogy: 'Momentum is like the "unstoppability" of an object. A bowling ball rolling slowly has moderate momentum. A tennis ball thrown fast also has moderate momentum. A bowling ball thrown fast has enormous momentum. Momentum combines mass AND speed — both matter.',
      storyConnection: 'In the story, young polo players in Manipur learn that a fast, light swing can be as effective as a slow, heavy one — because both can transfer the same momentum to the ball. This insight separates skilled players from strong ones.',
      checkQuestion: 'Which has more momentum: a 0.13 kg polo ball moving at 50 m/s, or a 0.5 kg polo stick head moving at 15 m/s?',
      checkAnswer: 'Ball: p = 0.13 x 50 = 6.5 kg⋅m/s. Stick head: p = 0.5 x 15 = 7.5 kg⋅m/s. The stick has more momentum despite being slower, because it is heavier. This is why the stick can accelerate the ball — it transfers some of its larger momentum to the smaller ball.',
      codeIntro: 'Calculate momentum for different polo scenarios.',
      code: `# Momentum in Manipuri Polo (Sagol Kangjei)

# Polo ball properties
ball_mass = 0.13  # kg (bamboo root ball)
# Polo stick head
stick_mass = 0.5  # kg

print("=== Momentum in Sagol Kangjei ===\
")

# Different scenarios
scenarios = [
    ("Gentle tap",      stick_mass, 5),
    ("Normal swing",    stick_mass, 15),
    ("Power drive",     stick_mass, 30),
    ("Full gallop hit", stick_mass, 40),
]

print(f"{'Scenario':<18} {'Mass':>6} {'Speed':>7} {'Momentum':>10} {'Ball speed*':>12}")
print("-" * 56)

for name, mass, speed in scenarios:
    p = mass * speed
    # Assuming perfect transfer: m_stick * v_stick = m_ball * v_ball
    ball_speed = p / ball_mass
    print(f"{name:<18} {mass:>4.1f}kg {speed:>5.0f}m/s {p:>8.1f}kg⋅m/s {ball_speed:>9.0f}m/s")

print("\
* Theoretical max ball speed (perfect momentum transfer)")
print(f"\
Note: {30 * 3.6:.0f} km/h stick swing → {0.5*30/0.13*3.6:.0f} km/h ball speed!")
print("This is why polo balls travel so fast from a seemingly")
print("moderate swing — the mass ratio amplifies the speed.")

# Horse + rider momentum
horse_mass = 450  # kg
rider_mass = 70   # kg
gallop_speed = 12  # m/s (about 43 km/h)
combined = (horse_mass + rider_mass) * gallop_speed
print(f"\
Horse + rider at gallop: {combined:,.0f} kg⋅m/s")
print(f"That's {combined / (ball_mass * 50):.0f}x more than the ball at full speed!")`,
      challenge: 'A Manipuri pony is smaller (350 kg) than a standard polo horse (450 kg). If both gallop at the same speed, how much less momentum does the Manipuri pony have? Does this affect the game?',
      successHint: 'Momentum is the fundamental quantity in collision physics. Every time a stick hits a ball, a car hits a wall, or a meteor hits Earth, momentum is the key to understanding what happens.',
    },
    {
      title: 'Conservation of momentum — what happens during the hit',
      concept: `When the stick hits the ball, total momentum is **conserved** — it does not disappear or appear from nothing.

**m_stick x v_stick_before = m_stick x v_stick_after + m_ball x v_ball_after**

This is **Newton\'s third law** in action: the force the stick exerts on the ball equals the force the ball exerts back on the stick (but in opposite direction).

After the collision:
- The stick slows down (lost momentum)
- The ball speeds up (gained momentum)
- Total momentum is unchanged

If the collision is **elastic** (no energy lost), we can calculate both final velocities exactly.`,
      analogy: 'Conservation of momentum is like a bank transaction. If you transfer 100₹ from your account to someone else, your balance drops by 100₹ and theirs rises by 100₹. The total money in the system stays the same. Momentum works the same way — every transfer is perfectly balanced.',
      storyConnection: 'In the story, the polo master demonstrates that a follow-through swing transfers more momentum than a chopping swing. The follow-through keeps the stick in contact longer, allowing more complete momentum transfer — the stick slows down more, and the ball speeds up more.',
      checkQuestion: 'If the stick stops completely after hitting the ball, did all the momentum transfer?',
      checkAnswer: 'Yes! If v_stick_after = 0, then m_stick x v_stick_before = m_ball x v_ball_after. All stick momentum went to the ball. This is the theoretical maximum transfer. In practice, the stick does not stop completely — it continues moving but slower — so the transfer is partial.',
      codeIntro: 'Simulate the stick-ball collision using conservation of momentum.',
      code: `# Conservation of momentum in polo stick-ball collision
m_stick = 0.5    # kg
m_ball = 0.13    # kg

print("=== Momentum Conservation: Stick Hits Ball ===\
")

# Ball starts stationary, stick swings at various speeds
for v_stick in [10, 20, 30, 40]:
    p_before = m_stick * v_stick
    p_ball_before = 0

    # For elastic collision:
    # v_stick_after = (m_stick - m_ball) / (m_stick + m_ball) * v_stick
    # v_ball_after = 2 * m_stick / (m_stick + m_ball) * v_stick
    v_stick_after = (m_stick - m_ball) / (m_stick + m_ball) * v_stick
    v_ball_after = 2 * m_stick / (m_stick + m_ball) * v_stick

    p_stick_after = m_stick * v_stick_after
    p_ball_after = m_ball * v_ball_after

    print(f"Stick speed: {v_stick} m/s")
    print(f"  Before: stick p = {p_before:.2f}, ball p = 0.00")
    print(f"  After:  stick p = {p_stick_after:.2f}, ball p = {p_ball_after:.2f}")
    print(f"  Total:  before = {p_before:.2f}, after = {p_stick_after + p_ball_after:.2f} ({'CONSERVED' if abs(p_before - p_stick_after - p_ball_after) < 0.01 else 'ERROR'})")
    print(f"  Ball speed: {v_ball_after:.1f} m/s ({v_ball_after * 3.6:.0f} km/h)")
    print(f"  Stick slows to: {v_stick_after:.1f} m/s ({v_stick_after/v_stick*100:.0f}% of original)")
    print()

# Speed amplification ratio
ratio = 2 * m_stick / (m_stick + m_ball)
print(f"Speed amplification: ball goes {ratio:.2f}x stick speed")
print(f"This is because m_stick/m_ball = {m_stick/m_ball:.1f}")
print(f"Heavier stick → more amplification → faster ball")`,
      challenge: 'What if the ball is already moving toward the stick (a defensive block)? Set ball initial velocity to -10 m/s and recalculate. What happens when two momenta collide head-on?',
      successHint: 'Conservation of momentum is one of the most fundamental laws in physics. It holds for everything from subatomic particles to galaxy collisions. No exception has ever been found.',
    },
    {
      title: 'Projectile motion — the flight of the polo ball',
      concept: `After being struck, the polo ball follows a **parabolic trajectory** — projectile motion under gravity.

The key equations:
- **Horizontal**: x = v₀ x cos(theta) x t
- **Vertical**: y = v₀ x sin(theta) x t - 0.5 x g x t²

Where theta is the launch angle and v₀ is the initial speed.

Maximum range occurs at **theta = 45°** (in vacuum). But in polo, the optimal angle is lower (~20-30°) because:
1. The ball must stay low to be playable
2. Air resistance reduces high trajectories more
3. Players need the ball to reach quickly, not fly high

The **range formula**: R = v₀² x sin(2*theta) / g`,
      analogy: 'Projectile motion is like throwing a water balloon. Throw it straight up — it goes high but lands at your feet (no range). Throw it horizontal — it hits the ground immediately (no height). The optimal angle balances height and distance.',
      storyConnection: 'In the story, a polo player learns to control the launch angle of the ball. A high lob gives time for the team to position but is easy to intercept. A low drive reaches the goal fast but may be blocked. The physics of projectile motion governs the optimal strategy.',
      checkQuestion: 'If a ball is hit at 30 m/s at 20 degrees, how far does it travel? How long is it in the air?',
      checkAnswer: 'Range = v²sin(2*theta)/g = 900*sin(40°)/9.8 = 900*0.643/9.8 = 59.0 m. Time of flight = 2*v*sin(theta)/g = 2*30*sin(20°)/9.8 = 2*30*0.342/9.8 = 2.09 s. The ball travels nearly 60 metres in about 2 seconds — plenty fast for a polo match.',
      codeIntro: 'Calculate and display the trajectory of a polo ball at different angles.',
      code: `# Projectile motion of a polo ball
import math

g = 9.8
v0 = 30  # initial speed (m/s)

print("=== Polo Ball Trajectories ===\
")
print(f"Launch speed: {v0} m/s ({v0*3.6:.0f} km/h)\
")
print(f"{'Angle':>6} {'Range':>8} {'Max Height':>11} {'Time':>7} {'Practical?':>11}")
print("-" * 48)

best_range = 0
best_angle = 0

for angle_deg in range(5, 85, 5):
    angle_rad = math.radians(angle_deg)

    # Range (no air resistance)
    R = v0**2 * math.sin(2 * angle_rad) / g
    # Maximum height
    H = (v0 * math.sin(angle_rad))**2 / (2 * g)
    # Time of flight
    T = 2 * v0 * math.sin(angle_rad) / g

    practical = "YES" if 15 <= angle_deg <= 35 else "too high" if angle_deg > 35 else "too low"

    if R > best_range:
        best_range = R
        best_angle = angle_deg

    if angle_deg % 10 == 0 or angle_deg in [15, 25, 35, 45]:
        print(f"{angle_deg:>4}° {R:>7.1f}m {H:>9.1f}m {T:>5.1f}s {practical:>11}")

print(f"\
Max range at {best_angle}° = {best_range:.1f}m")
print(f"But polo players use 20-30° for practical reasons:")
print(f"  At 25°: range = {v0**2*math.sin(math.radians(50))/g:.1f}m, height = {(v0*math.sin(math.radians(25)))**2/(2*g):.1f}m")
print(f"  Ball stays low and arrives quickly!")`,
      challenge: 'A stronger player hits at 40 m/s instead of 30 m/s. Calculate the range at 25 degrees for both speeds. Range scales with v² — how much farther does the stronger hit go?',
      successHint: 'Projectile motion is one of the oldest problems in physics — Galileo studied it 400 years ago. It governs everything from polo balls to artillery to spacecraft trajectories.',
    },
    {
      title: 'Impulse — the physics of a perfect hit',
      concept: `**Impulse** is force applied over time. It equals the change in momentum:

**J = F x delta_t = delta_p = m x delta_v**

A polo player can achieve the same impulse (same ball speed) by:
- Hitting hard for a short time (quick snap)
- Hitting gently for a long time (sweeping follow-through)

The **follow-through** is critical: it extends delta_t, allowing the same impulse with less peak force. This is easier on the wrist and more controlled.

For a ball accelerated from 0 to 30 m/s:
- Impulse = 0.13 x 30 = 3.9 kg⋅m/s
- If contact lasts 0.01s: F = 390 N (jarring)
- If contact lasts 0.05s: F = 78 N (smooth)`,
      analogy: 'Impulse is like catching an egg. Catch it with stiff hands (short delta_t) and it breaks (high force). Catch it with soft, yielding hands (long delta_t) and it survives (low force). Same change in momentum, but distributed over more time.',
      storyConnection: 'The story describes how the polo master\'s hits look effortless — the ball rockets away but the swing seems gentle. The secret is a long contact time through follow-through. The student\'s choppy hit produces the same ball speed but with painful wrist impact and less accuracy.',
      checkQuestion: 'In a car crash, why do airbags save lives?',
      checkAnswer: 'The car occupant\'s momentum must reach zero (they stop). Impulse = change in momentum is fixed. Without an airbag: contact time with dashboard is ~0.005s → enormous force → fatal. With airbag: contact time is ~0.05s → force is 10x less → survivable. Same impulse, longer time, lower peak force. Exactly the same physics as the polo follow-through.',
      codeIntro: 'Calculate impulse and force for different polo hitting styles.',
      code: `# Impulse and force in polo hitting
ball_mass = 0.13  # kg
target_speed = 30  # m/s
impulse = ball_mass * target_speed  # fixed

print("=== Impulse in Polo: Same Result, Different Forces ===\
")
print(f"Target ball speed: {target_speed} m/s")
print(f"Required impulse: {impulse:.2f} N⋅s\
")

print(f"{'Hit Style':<20} {'Contact time':>13} {'Peak Force':>11} {'Wrist Stress':>12}")
print("-" * 60)

styles = [
    ("Choppy hit",       0.005, "DANGEROUS"),
    ("Quick snap",       0.010, "High"),
    ("Normal swing",     0.020, "Moderate"),
    ("Follow-through",   0.040, "Low"),
    ("Long sweep",       0.060, "Minimal"),
]

for name, dt, stress in styles:
    force = impulse / dt
    force_kg = force / 9.8  # equivalent weight
    print(f"{name:<20} {dt*1000:>10.0f} ms {force:>9.0f} N {stress:>12}")

print(f"\
Same impulse ({impulse:.2f} N⋅s) achieves the same ball speed ({target_speed} m/s)")
print("But the FORCE varies by 12x depending on contact time!")
print("\
Pro polo tip: always follow through!")

# Compare: what impulse for different ball speeds?
print(f"\
Impulse required for different ball speeds:")
for v in [10, 20, 30, 40, 50]:
    J = ball_mass * v
    F_typical = J / 0.02  # typical 20ms contact
    print(f"  {v:>3} m/s ({v*3.6:.0f} km/h): J = {J:.2f} N⋅s, F ≈ {F_typical:.0f} N")`,
      challenge: 'Professional polo players can hit the ball at 60 m/s. If contact time is 0.015s, what force is that? Compare to the weight of a heavy object. Could your wrist handle that without a follow-through?',
      successHint: 'Impulse explains why follow-through matters in every hitting sport, why crumple zones save lives in cars, and why you bend your knees when landing a jump. The physics is universal.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Momentum & Collision Basics</span>
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
