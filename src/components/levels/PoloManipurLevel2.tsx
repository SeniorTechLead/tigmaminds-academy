import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function PoloManipurLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Plotting trajectories — the parabola of the polo ball',
      concept: `Using **matplotlib**, we can visualise the polo ball\'s trajectory for different launch angles and speeds. The trajectory is a **parabola** defined by:

x(t) = v₀ cos(theta) t
y(t) = v₀ sin(theta) t - 0.5 g t²

By plotting multiple trajectories on the same axes, we see how angle and speed trade off. The **envelope** of all trajectories defines the maximum range achievable at each height — the "danger zone" of a polo hit.`,
      analogy: 'A trajectory plot is like a time-lapse photograph of the ball in flight. Each frame adds one dot to the path, and connecting the dots reveals the parabola. Multiple trajectories on one plot show all possible paths — like a garden sprinkler showing all the water arcs simultaneously.',
      storyConnection: 'In the story, a coach draws trajectory arcs in the dust to teach young players. Our matplotlib plots are the digital version — showing exactly where the ball goes for every combination of speed and angle.',
      checkQuestion: 'At what point in the trajectory is the ball moving fastest?',
      checkAnswer: 'At launch and at landing. The horizontal velocity is constant (ignoring air resistance), and the vertical velocity is highest at launch and landing (it is zero at the peak). Total speed = sqrt(v_x² + v_y²), which is maximised when v_y is maximised — at the start and end of the trajectory.',
      codeIntro: 'Plot polo ball trajectories for different angles and find the optimal angle for range.',
      code: `import numpy as np
import matplotlib.pyplot as plt

g = 9.8
v0 = 35  # m/s

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 5))
for ax in (ax1, ax2):
    ax.set_facecolor('#1f2937')
fig.patch.set_facecolor('#1f2937')

# Plot trajectories for different angles
angles = [10, 20, 30, 45, 60, 70]
colors = ['#ef4444', '#f59e0b', '#34d399', '#3b82f6', '#a78bfa', '#ec4899']
ranges = []

for angle, color in zip(angles, colors):
    theta = np.radians(angle)
    T = 2 * v0 * np.sin(theta) / g
    t = np.linspace(0, T, 200)
    x = v0 * np.cos(theta) * t
    y = v0 * np.sin(theta) * t - 0.5 * g * t**2

    R = v0**2 * np.sin(2*theta) / g
    ranges.append(R)
    ax1.plot(x, y, color=color, linewidth=2, label=f'{angle}° (R={R:.0f}m)')

ax1.set_title(f'Polo Ball Trajectories (v₀={v0} m/s)', color='white', fontsize=12, fontweight='bold')
ax1.set_xlabel('Distance (m)', color='white')
ax1.set_ylabel('Height (m)', color='white')
ax1.tick_params(colors='white')
ax1.legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=8)
ax1.grid(True, alpha=0.2, color='white')
ax1.set_ylim(0, 40)

# Range vs angle (continuous)
all_angles = np.linspace(0, 90, 200)
all_ranges = v0**2 * np.sin(2*np.radians(all_angles)) / g

ax2.plot(all_angles, all_ranges, color='#f59e0b', linewidth=2)
ax2.axvline(x=45, color='#34d399', linestyle='--', alpha=0.7, label='Max range at 45°')
ax2.fill_between([15, 35], 0, max(all_ranges)*1.1, alpha=0.1, color='#3b82f6', label='Polo optimal (15-35°)')
ax2.set_title('Range vs Launch Angle', color='white', fontsize=12, fontweight='bold')
ax2.set_xlabel('Angle (degrees)', color='white')
ax2.set_ylabel('Range (m)', color='white')
ax2.tick_params(colors='white')
ax2.legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white')
ax2.grid(True, alpha=0.2, color='white')

plt.tight_layout()
plt.savefig('trajectories.png', dpi=100, bbox_inches='tight', facecolor='#1f2937')
plt.show()

opt_R = v0**2 / g  # max range at 45°
print(f"Maximum range (45°): {opt_R:.1f} m")
polo_R = v0**2 * np.sin(2*np.radians(25)) / g
print(f"Practical polo range (25°): {polo_R:.1f} m ({polo_R/opt_R*100:.0f}% of max)")
print(f"Height at 25°: {(v0*np.sin(np.radians(25)))**2/(2*g):.1f} m (stays low)")
print(f"Height at 45°: {(v0*np.sin(np.radians(45)))**2/(2*g):.1f} m (too high for polo)")`,
      challenge: 'Add air resistance: F_drag = -0.5 * C_d * rho * A * v². Use C_d=0.47, rho=1.2, A=0.002 m². Integrate numerically. How much does drag reduce the range?',
      successHint: 'Trajectory plots reveal the deep connection between angle, speed, and range. Every sport involving projectiles — polo, golf, cricket, football — uses these same parabolas.',
    },
    {
      title: 'Elastic vs inelastic collisions — energy in the hit',
      concept: `Collisions come in two types:
- **Elastic**: kinetic energy is conserved (billiard balls)
- **Inelastic**: some kinetic energy is lost (car crashes)
- **Perfectly inelastic**: objects stick together (maximum energy loss)

The **coefficient of restitution** (e) measures "bounciness":
**e = (v₂_after - v₁_after) / (v₁_before - v₂_before)**

e = 1: perfectly elastic
e = 0: perfectly inelastic
Polo ball on stick: e ≈ 0.6-0.8

The energy lost goes into deformation, heat, and sound (the satisfying "thwack" of a polo hit).`,
      analogy: 'The coefficient of restitution is like the quality of a bouncy ball. A super ball (e ≈ 0.9) bounces nearly as high as you drop it. A tennis ball (e ≈ 0.7) loses some height. A bean bag (e ≈ 0.1) barely bounces. Each collision converts kinetic energy to other forms.',
      storyConnection: 'In the story, the bamboo root ball used in traditional Sagol Kangjei has a lower coefficient of restitution than a modern plastic polo ball. This changes the game dynamics: the traditional ball does not travel as far per hit but is easier to control. The physics of e governs the character of the game.',
      checkQuestion: 'If 30% of kinetic energy is lost in a collision, what is the approximate coefficient of restitution?',
      checkAnswer: 'Energy retained = 70% = 0.70. For a simple case, e ≈ sqrt(KE_after/KE_before) = sqrt(0.70) ≈ 0.84. So e ≈ 0.84 — the collision is mostly elastic. A 30% energy loss still produces a vigorous bounce.',
      codeIntro: 'Compare elastic and inelastic polo collisions and visualise energy transfer.',
      code: `import numpy as np
import matplotlib.pyplot as plt

m_stick = 0.5   # kg
m_ball = 0.13   # kg
v_stick = 25    # m/s
v_ball = 0      # stationary ball

# Elastic collision (e = 1)
v_stick_elastic = (m_stick - m_ball) / (m_stick + m_ball) * v_stick
v_ball_elastic = 2 * m_stick / (m_stick + m_ball) * v_stick

# Perfectly inelastic (e = 0) — objects stick
v_combined = m_stick * v_stick / (m_stick + m_ball)

# Realistic (e = 0.7)
e_values = np.linspace(0, 1, 100)
v_ball_e = (1 + e_values) * m_stick * v_stick / (m_stick + m_ball)
v_stick_e = v_stick - m_ball * v_ball_e / m_stick  # conservation of momentum

# Energy calculations
KE_before = 0.5 * m_stick * v_stick**2
KE_ball_e = 0.5 * m_ball * v_ball_e**2
KE_stick_e = 0.5 * m_stick * v_stick_e**2
KE_total_after = KE_ball_e + KE_stick_e
energy_lost_pct = (1 - KE_total_after / KE_before) * 100

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 5))
for ax in (ax1, ax2):
    ax.set_facecolor('#1f2937')
fig.patch.set_facecolor('#1f2937')

ax1.plot(e_values, v_ball_e, color='#34d399', linewidth=2, label='Ball speed')
ax1.plot(e_values, v_stick_e, color='#ef4444', linewidth=2, label='Stick speed')
ax1.axvline(x=0.7, color='#f59e0b', linestyle='--', alpha=0.7, label='Polo ball (e≈0.7)')
ax1.set_title('Post-collision Speeds vs Restitution', color='white', fontsize=12, fontweight='bold')
ax1.set_xlabel('Coefficient of restitution (e)', color='white')
ax1.set_ylabel('Speed (m/s)', color='white')
ax1.tick_params(colors='white')
ax1.legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white')
ax1.grid(True, alpha=0.2, color='white')

ax2.plot(e_values, energy_lost_pct, color='#a78bfa', linewidth=2)
ax2.axvline(x=0.7, color='#f59e0b', linestyle='--', alpha=0.7, label='Polo ball (e≈0.7)')
ax2.fill_between(e_values, energy_lost_pct, alpha=0.15, color='#a78bfa')
ax2.set_title('Energy Lost in Collision', color='white', fontsize=12, fontweight='bold')
ax2.set_xlabel('Coefficient of restitution (e)', color='white')
ax2.set_ylabel('Energy lost (%)', color='white')
ax2.tick_params(colors='white')
ax2.legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white')
ax2.grid(True, alpha=0.2, color='white')

plt.tight_layout()
plt.savefig('collisions.png', dpi=100, bbox_inches='tight', facecolor='#1f2937')
plt.show()

# Key comparisons
for e_val, name in [(1.0, 'Elastic'), (0.7, 'Polo ball'), (0.3, 'Bamboo ball'), (0, 'Perfectly inelastic')]:
    v_b = (1 + e_val) * m_stick * v_stick / (m_stick + m_ball)
    ke_b = 0.5 * m_ball * v_b**2
    loss = (1 - (ke_b + 0.5*m_stick*(v_stick-m_ball*v_b/m_stick)**2)/KE_before)*100
    print(f"e={e_val:.1f} ({name:>20s}): ball speed = {v_b:.1f} m/s, energy lost = {loss:.1f}%")`,
      challenge: 'In billiards (e≈0.95), the cue ball nearly stops when it hits a stationary ball of equal mass. Verify this with the formulas. Why does equal mass produce this result?',
      successHint: 'The coefficient of restitution governs every collision in every sport. Understanding it explains why some materials make better balls, sticks, and surfaces.',
    },
    {
      title: 'Centre of mass — where the horse-rider system balances',
      concept: `The **centre of mass** (CoM) is the balance point of a system. For a horse and rider:

**x_com = (m_horse x x_horse + m_rider x x_rider) / (m_horse + m_rider)**

The CoM matters because:
- The system\'s total momentum equals total_mass x v_CoM
- External forces act as if applied at the CoM
- A rider who shifts their weight shifts the CoM, steering the horse
- During a polo swing, the rider must compensate to keep their CoM over the horse

If the CoM moves outside the horse\'s base of support, the rider falls off.`,
      analogy: 'The centre of mass is like the "X marks the spot" on a treasure map of weight. If you balance a ruler on your finger, the balance point is the centre of mass. For a horse and rider, this balance point determines stability — lean too far, and the "ruler" tips.',
      storyConnection: 'In the story, polo riders are trained to lean the opposite direction during a swing. When the stick goes right, the body leans left — keeping the centre of mass over the horse. This is not just instinct; it is physics. The best riders have an intuitive understanding of their combined CoM.',
      checkQuestion: 'If a 70 kg rider on a 400 kg horse leans 0.5m to the right during a swing, how far does the system CoM shift?',
      checkAnswer: 'CoM shift = m_rider x displacement / (m_horse + m_rider) = 70 x 0.5 / (400 + 70) = 0.074m ≈ 7.4 cm. A small body shift by the rider produces a very small CoM shift because the horse is much heavier. But 7.4 cm can be the difference between balance and falling at a gallop.',
      codeIntro: 'Visualise the centre of mass of a horse-rider-stick system during a polo swing.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Horse-rider system
m_horse = 400     # kg
m_rider = 70      # kg
m_stick = 2       # kg (including arm)

# Positions (2D side view, x = forward, y = up)
# Horse CoM: roughly at centre of body
horse_com = np.array([0, 0.8])  # metres from ground at centre of back
# Rider CoM: at hip level when upright
rider_base = np.array([0, 1.5])

fig, axes = plt.subplots(1, 3, figsize=(12, 5))
for ax in axes:
    ax.set_facecolor('#1f2937')
fig.patch.set_facecolor('#1f2937')

swing_phases = ['Ready', 'Backswing', 'Strike']
rider_leans = [0, 0.2, -0.4]     # metres lean right (positive = right)
stick_positions = [
    np.array([0.3, 1.2]),        # ready
    np.array([-0.5, 1.8]),       # backswing
    np.array([0.8, 0.5]),        # strike
]

for idx, (phase, lean, stick_pos) in enumerate(zip(swing_phases, rider_leans, stick_positions)):
    ax = axes[idx]

    # Adjusted rider position
    rider_com = rider_base + np.array([lean, 0])

    # System centre of mass
    total_mass = m_horse + m_rider + m_stick
    system_com = (m_horse * horse_com + m_rider * rider_com + m_stick * stick_pos) / total_mass

    # Draw horse (rectangle)
    horse_rect = plt.Rectangle((-0.6, 0.4), 1.2, 0.6, color='#92400e', alpha=0.6)
    ax.add_patch(horse_rect)
    # Draw legs
    for lx in [-0.4, -0.1, 0.2, 0.5]:
        ax.plot([lx, lx], [0, 0.4], color='#92400e', linewidth=3)

    # Draw rider (circle + line)
    ax.plot([rider_com[0], rider_com[0]], [1.0, rider_com[1]+0.2], color='#3b82f6', linewidth=4)
    ax.plot(rider_com[0], rider_com[1]+0.3, 'o', color='#3b82f6', markersize=12)

    # Draw stick
    ax.plot([rider_com[0], stick_pos[0]], [rider_com[1], stick_pos[1]], color='#f59e0b', linewidth=3)

    # Draw centres of mass
    ax.plot(*horse_com, 's', color='#ef4444', markersize=8, label='Horse CoM')
    ax.plot(*rider_com, 's', color='#3b82f6', markersize=8, label='Rider CoM')
    ax.plot(*system_com, '*', color='#34d399', markersize=15, label='System CoM')

    # Support base
    ax.axhline(y=0, color='white', alpha=0.3)
    ax.fill_between([-0.5, 0.6], -0.1, 0, alpha=0.1, color='#34d399')

    ax.set_title(f'{phase}\\nCoM: ({system_com[0]:.2f}, {system_com[1]:.2f})', color='white', fontsize=10, fontweight='bold')
    ax.set_xlim(-1.2, 1.5)
    ax.set_ylim(-0.2, 2.5)
    ax.set_aspect('equal')
    ax.tick_params(colors='white', labelsize=7)
    if idx == 0:
        ax.legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=7, loc='upper left')

plt.suptitle('Centre of Mass During Polo Swing', color='white', fontsize=14, fontweight='bold', y=1.02)
plt.tight_layout()
plt.savefig('com.png', dpi=100, bbox_inches='tight', facecolor='#1f2937')
plt.show()

# Stability analysis
print("Centre of Mass Analysis:")
for phase, lean, stick_pos in zip(swing_phases, rider_leans, stick_positions):
    rider_com = rider_base + np.array([lean, 0])
    sys_com = (m_horse*horse_com + m_rider*rider_com + m_stick*stick_pos) / (m_horse+m_rider+m_stick)
    print(f"  {phase}: system CoM at ({sys_com[0]:.3f}, {sys_com[1]:.3f})")
    if abs(sys_com[0]) > 0.5:
        print(f"    WARNING: CoM near edge of support base!")`,
      challenge: 'What if the rider weighs 90 kg instead of 70 kg? How does the CoM shift change during the strike phase? Heavier riders are more stable — calculate the stability margin.',
      successHint: 'Centre of mass analysis is used in vehicle stability, building engineering, robotics, and sports biomechanics. You just applied it to one of the most dynamic sporting scenarios — polo at a gallop.',
    },
    {
      title: '2D collision analysis — when polo balls collide',
      concept: `When two polo balls collide (or a ball hits a goalpost), the collision happens in **two dimensions**. Momentum is conserved in BOTH x and y directions independently:

**m₁v₁ₓ + m₂v₂ₓ = m₁v₁ₓ\' + m₂v₂ₓ\'**  (x-direction)
**m₁v₁ᵧ + m₂v₂ᵧ = m₁v₁ᵧ\' + m₂v₂ᵧ\'**  (y-direction)

The angle of impact matters. A glancing blow (off-centre) transfers less momentum than a direct hit. The **impact parameter** (how off-centre the collision is) determines the deflection angle.

We visualise these 2D collisions with matplotlib, showing before and after velocity vectors.`,
      analogy: '2D collisions are like billiards. A direct hit sends the target ball straight forward. An off-centre hit sends it at an angle. The cue ball goes in the complementary direction. The total momentum (magnitude and direction) is always conserved.',
      storyConnection: 'In polo, players deliberately use glancing hits to change the ball\'s direction without stopping it. A side-swipe can redirect the ball 90 degrees — a crucial defensive technique. The physics of 2D collisions makes this possible.',
      checkQuestion: 'In a 2D elastic collision between equal masses where one is initially stationary, what is the angle between the two objects after collision?',
      checkAnswer: 'Exactly 90 degrees. This is a beautiful result of simultaneous conservation of momentum and kinetic energy for equal masses. The velocity vectors after collision are always perpendicular. This is why in billiards, the cue ball and object ball always separate at 90 degrees (for equal-mass balls).',
      codeIntro: 'Simulate and visualise 2D polo ball collisions at different impact angles.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def elastic_2d_collision(m1, v1, m2, v2, impact_angle):
    """2D elastic collision. impact_angle = 0 for head-on."""
    # Rotate to collision frame
    cos_a = np.cos(impact_angle)
    sin_a = np.sin(impact_angle)

    # Components along and perpendicular to line of centres
    v1_along = v1[0] * cos_a + v1[1] * sin_a
    v1_perp = -v1[0] * sin_a + v1[1] * cos_a
    v2_along = v2[0] * cos_a + v2[1] * sin_a
    v2_perp = -v2[0] * sin_a + v2[1] * cos_a

    # 1D elastic collision along line of centres
    v1_along_new = (m1 - m2) / (m1 + m2) * v1_along + 2*m2/(m1+m2) * v2_along
    v2_along_new = 2*m1/(m1+m2) * v1_along + (m2 - m1)/(m1+m2) * v2_along

    # Perpendicular components unchanged
    # Rotate back
    v1_new = np.array([v1_along_new*cos_a - v1_perp*sin_a, v1_along_new*sin_a + v1_perp*cos_a])
    v2_new = np.array([v2_along_new*cos_a - v2_perp*sin_a, v2_along_new*sin_a + v2_perp*cos_a])

    return v1_new, v2_new

m = 0.13  # both balls same mass
v1_init = np.array([20.0, 0.0])  # ball 1 moving right
v2_init = np.array([0.0, 0.0])   # ball 2 stationary

fig, axes = plt.subplots(2, 3, figsize=(12, 7))
for row in axes:
    for ax in row:
        ax.set_facecolor('#1f2937')
fig.patch.set_facecolor('#1f2937')

impact_angles = [0, 15, 30, 45, 60, 75]

for idx, angle_deg in enumerate(impact_angles):
    ax = axes[idx // 3][idx % 3]
    angle_rad = np.radians(angle_deg)

    v1_after, v2_after = elastic_2d_collision(m, v1_init, m, v2_init, angle_rad)

    scale = 0.15
    # Before
    ax.arrow(0, 0, v1_init[0]*scale, v1_init[1]*scale, head_width=0.2, color='#3b82f6', linewidth=2, label='Ball 1')
    ax.plot(0, 0, 'o', color='#3b82f6', markersize=10)
    ax.plot(3, angle_deg*0.05, 'o', color='#ef4444', markersize=10)

    # After
    ax.arrow(3, angle_deg*0.05, v1_after[0]*scale, v1_after[1]*scale, head_width=0.2, color='#3b82f6', linewidth=2, alpha=0.6)
    ax.arrow(3, angle_deg*0.05, v2_after[0]*scale, v2_after[1]*scale, head_width=0.2, color='#ef4444', linewidth=2, alpha=0.6)

    # Angle between outputs
    if np.linalg.norm(v1_after) > 0.1 and np.linalg.norm(v2_after) > 0.1:
        cos_between = np.dot(v1_after, v2_after) / (np.linalg.norm(v1_after) * np.linalg.norm(v2_after))
        angle_between = np.degrees(np.arccos(np.clip(cos_between, -1, 1)))
    else:
        angle_between = 0

    speed1 = np.linalg.norm(v1_after)
    speed2 = np.linalg.norm(v2_after)
    ax.set_title(f'Impact: {angle_deg}°\\nSeparation: {angle_between:.0f}°', color='white', fontsize=9, fontweight='bold')
    ax.set_xlim(-2, 7)
    ax.set_ylim(-3, 4)
    ax.set_aspect('equal')
    ax.tick_params(colors='white', labelsize=7)
    ax.grid(True, alpha=0.15, color='white')

plt.suptitle('2D Polo Ball Collisions at Different Impact Angles', color='white', fontsize=13, fontweight='bold')
plt.tight_layout()
plt.savefig('2d_collisions.png', dpi=100, bbox_inches='tight', facecolor='#1f2937')
plt.show()

print("Impact angle → Ball speeds after collision:")
for angle_deg in impact_angles:
    v1_a, v2_a = elastic_2d_collision(m, v1_init, m, v2_init, np.radians(angle_deg))
    s1, s2 = np.linalg.norm(v1_a), np.linalg.norm(v2_a)
    print(f"  {angle_deg:>2}°: ball1 = {s1:.1f} m/s, ball2 = {s2:.1f} m/s, total KE conserved: {0.5*m*(s1**2+s2**2):.1f} J")`,
      challenge: 'What if the two balls have different masses (0.13 kg and 0.20 kg — a worn ball vs new)? How does the mass difference affect the collision outcome at 30 degrees?',
      successHint: '2D collision analysis is essential in particle physics, astrophysics, and vehicle crash analysis. The same vector decomposition you used here works for any collision in any number of dimensions.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Collision Analysis & Visualization</span>
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
          <MiniLesson key={i} id={`L2-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint} />
        ))}
      </div>
    </div>
  );
}
