import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function ThangTaLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'The spinning sword — what is angular velocity?',
      concept: `**Thang-Ta** is the ancient martial art of Manipur. "Thang" means sword, "Ta" means spear. Warriors spin their swords in fluid circular arcs — and every spin obeys the laws of **rotational dynamics**.

When a Thang-Ta warrior spins a sword, the blade tip moves faster than the handle. This is because of **angular velocity** (omega, measured in radians per second):

**v = omega x r**

Where:
- v = linear speed of a point on the sword (m/s)
- omega = angular velocity (rad/s) — same for every point
- r = distance from the axis of rotation (metres)

One full rotation = 2 x pi radians. So if a warrior spins the sword once per second, omega = 2 x pi ≈ 6.28 rad/s.

In Python, variables store these values and simple multiplication gives us the speed.`,
      analogy: 'Think of a merry-go-round. A child sitting at the edge travels faster than one near the centre, even though they both complete one rotation in the same time. The outer child has larger r, so v = omega x r gives a higher speed. A sword works the same way — the tip is "at the edge."',
      storyConnection: 'In the story, the Thang-Ta master demonstrates how a slight change in grip position changes the sword\'s reach and speed. This is not just technique — it is physics. Moving your hand closer to the blade\'s centre of mass changes r for the tip.',
      checkQuestion: 'If a sword is 0.8 metres long and spins at 3 revolutions per second, how fast is the tip moving?',
      checkAnswer: 'omega = 3 x 2 x pi = 18.85 rad/s. Tip speed v = omega x r = 18.85 x 0.8 = 15.08 m/s. That is about 54 km/h — faster than a sprinter! And the tip speed increases linearly with sword length, which is why longer swords are more dangerous.',
      codeIntro: 'Calculate the tip speed of a Thang-Ta sword at different spin rates.',
      code: `# Thang-Ta sword spin — angular velocity basics
import math

sword_length = 0.8  # metres (handle to tip)
grip_position = 0.15  # distance from handle end to hand

# Effective radius (hand to tip)
r_tip = sword_length - grip_position

print("=== Thang-Ta Sword Tip Speed ===")
print(f"Sword length: {sword_length} m")
print(f"Effective radius (grip to tip): {r_tip} m")
print()
print(f"{'Spin rate':>12} {'Omega':>10} {'Tip speed':>10} {'km/h':>8}")
print("-" * 44)

for rpm in [1, 2, 3, 4, 5]:
    omega = rpm * 2 * math.pi  # convert rev/s to rad/s
    v_tip = omega * r_tip       # tip speed in m/s
    v_kmh = v_tip * 3.6         # convert to km/h

    print(f"{rpm:>8} rev/s {omega:>9.2f} {v_tip:>9.2f} m/s {v_kmh:>7.1f}")

# Compare: what about the handle end (behind the grip)?
r_handle = grip_position
v_handle = 3 * 2 * math.pi * r_handle
print(f"\\nAt 3 rev/s:")
print(f"  Tip speed:    {3 * 2 * math.pi * r_tip:.1f} m/s")
print(f"  Handle speed: {v_handle:.1f} m/s")
print(f"  Tip is {r_tip/r_handle:.1f}x faster than handle end!")`,
      challenge: 'A spear (Ta) is 1.8 metres long with a grip at 0.4m from the end. Calculate its tip speed at 2 rev/s. How much faster is the spear tip compared to the sword tip?',
      successHint: 'The v = omega x r relationship is the foundation of all rotational motion. Every spinning object — from sword tips to car wheels to Earth itself — follows this law.',
    },
    {
      title: 'Torque — the twist that starts the spin',
      concept: `To start spinning a sword, a warrior applies **torque** — a rotational force. Torque is:

**tau = F x r x sin(theta)**

Where:
- tau = torque (Newton-metres, Nm)
- F = force applied by the hand (Newtons)
- r = distance from axis to where force is applied
- theta = angle between force direction and the lever arm

Maximum torque happens when theta = 90° (sin(90°) = 1) — pushing perpendicular to the sword. Zero torque happens when pushing along the sword (theta = 0°).

A Thang-Ta warrior instinctively applies force at 90° to the sword — this is why the circular motions look smooth. Any other angle wastes energy.`,
      analogy: 'Torque is like opening a door. Push near the hinges (small r) — hard to open. Push at the handle (large r) — easy. Push along the door instead of perpendicular (wrong theta) — the door does not move at all. Thang-Ta warriors maximise torque by applying force far from the spin axis, perpendicular to the blade.',
      storyConnection: 'The story describes how young students struggle to spin heavy swords while masters make it look effortless. The secret is not strength — it is torque. Masters apply force at the optimal angle and distance, getting maximum rotation from minimum effort.',
      checkQuestion: 'Why do Thang-Ta warriors grip the sword away from its centre of mass?',
      checkAnswer: 'Gripping away from the centre of mass creates a longer lever arm for torque. If you grip at the centre, the torque required to spin the sword is minimal, but you lose reach and control. Gripping near the handle end maximises r_tip (reach) while still allowing enough torque to control the spin. It is a trade-off between reach and control.',
      codeIntro: 'Calculate the torque needed to spin a Thang-Ta sword at different grip positions and angles.',
      code: `# Torque analysis for Thang-Ta sword spinning
import math

sword_mass = 1.2      # kg
sword_length = 0.8    # metres
g = 9.8

# Moment of inertia of sword (thin rod about one end)
# I = (1/3) * m * L²
I = (1.0/3) * sword_mass * sword_length**2

# Force needed to achieve angular acceleration of 10 rad/s²
alpha = 10.0  # desired angular acceleration (rad/s²)
tau_needed = I * alpha  # torque = I * alpha

print("=== Torque Analysis for Thang-Ta ===")
print(f"Sword mass: {sword_mass} kg, length: {sword_length} m")
print(f"Moment of inertia: {I:.4f} kg⋅m²")
print(f"Desired acceleration: {alpha} rad/s²")
print(f"Torque needed: {tau_needed:.2f} Nm\\n")

# How much force at different grip positions?
print(f"{'Grip from end':>14} {'Lever arm':>10} {'Force needed':>13}")
print("-" * 40)
for grip in [0.10, 0.15, 0.20, 0.25, 0.30]:
    r = grip  # lever arm from pivot (end of handle)
    F = tau_needed / r if r > 0 else float('inf')
    print(f"{grip:>11.2f} m {r:>9.2f} m {F:>10.1f} N ({F/g:.1f} kg)")

# Effect of angle
print(f"\\nForce at 0.15m grip, varying angle:")
r = 0.15
for angle_deg in [30, 45, 60, 75, 90]:
    angle_rad = math.radians(angle_deg)
    F = tau_needed / (r * math.sin(angle_rad))
    print(f"  θ = {angle_deg}°: F = {F:.1f} N — {'optimal!' if angle_deg == 90 else ''}{'wastes energy' if angle_deg < 60 else ''}")`,
      challenge: 'A spear weighs 1.8 kg and is 1.8 m long. Calculate its moment of inertia and the torque needed for the same angular acceleration. How much harder is it to spin a spear versus a sword?',
      successHint: 'Torque is what converts linear pushing/pulling into rotational motion. Understanding it explains why some grips feel natural and others feel awkward — your body intuitively seeks maximum torque.',
    },
    {
      title: 'The kinetic chain — how the whole body generates power',
      concept: `A Thang-Ta strike does not come from the arm alone. Power flows through a **kinetic chain**:
1. **Feet** push against the ground (ground reaction force)
2. **Legs** rotate the hips (large muscles, slow)
3. **Hips** rotate the torso (medium muscles, medium speed)
4. **Torso** rotates the shoulders
5. **Shoulder** rotates the arm
6. **Arm** rotates the wrist
7. **Wrist** accelerates the sword tip

Each link in the chain **amplifies** the speed. The legs move slowly but with great force. Each subsequent joint moves faster with less force. By the time energy reaches the sword tip, a slow hip rotation has become a blazing-fast blade.

In Python, we can model this as a **list** of body segments, each multiplying the speed from the previous link.`,
      analogy: 'A kinetic chain is like cracking a whip. Your arm moves slowly, but the wave travels along the whip, getting faster at each point. By the time it reaches the tip, it is moving faster than the speed of sound — creating the "crack." A Thang-Ta strike works the same way: slow at the core, fast at the extremity.',
      storyConnection: 'The story describes how the master strikes faster than the eye can follow, yet his body seems to move slowly. The kinetic chain explains this paradox: the visible body motion is slow, but the chain amplifies speed through each joint until the blade moves at extraordinary velocity.',
      checkQuestion: 'If each joint in the chain doubles the angular velocity, and there are 5 joints, how much faster is the tip than the first joint?',
      checkAnswer: '2^5 = 32 times faster. This is the power of sequential amplification. In reality, the multiplication factor varies per joint (hips might amplify 1.5x, wrist might amplify 3x), but the principle holds: the chain multiplies, not adds.',
      codeIntro: 'Model the kinetic chain of a Thang-Ta strike from feet to sword tip.',
      code: `# Kinetic chain model for Thang-Ta strike
segments = [
    ('Ground → Foot',    0.10, 1.5),   # (name, length_m, speed_multiplier)
    ('Foot → Knee',      0.45, 1.3),
    ('Knee → Hip',       0.45, 1.4),
    ('Hip → Shoulder',   0.55, 1.6),
    ('Shoulder → Elbow', 0.30, 1.8),
    ('Elbow → Wrist',    0.25, 2.0),
    ('Wrist → Sword tip', 0.65, 2.5),
]

print("=== Thang-Ta Kinetic Chain Analysis ===\\n")
print(f"{'Segment':<22} {'Length':>7} {'Mult':>6} {'Speed':>8} {'Cum. Mult':>10}")
print("-" * 58)

speed = 0.5  # initial hip rotation speed (m/s)
cumulative_mult = 1.0
total_length = 0

for name, length, mult in segments:
    speed *= mult
    cumulative_mult *= mult
    total_length += length
    print(f"{name:<22} {length:>5.2f}m {mult:>5.1f}x {speed:>7.1f} m/s {cumulative_mult:>9.1f}x")

print(f"\\nTotal chain length: {total_length:.2f} m")
print(f"Final tip speed: {speed:.1f} m/s ({speed * 3.6:.0f} km/h)")
print(f"Overall amplification: {cumulative_mult:.0f}x")
print(f"\\nStarting from {0.5} m/s at the hip → {speed:.1f} m/s at the blade")
print(f"That's like going from walking speed to highway speed!")`,
      challenge: 'What happens if the warrior removes one link (e.g., keeps the wrist locked)? Remove the wrist segment and recalculate. How much speed is lost?',
      successHint: 'The kinetic chain principle applies to all striking sports: tennis serves, golf swings, karate punches, and cricket bowling. The chain is what separates powerful athletes from weak ones — it is not about muscle size, it is about coordination.',
    },
    {
      title: 'Angular momentum — why spinning objects stay stable',
      concept: `A spinning sword resists being knocked off its rotation axis. This stability comes from **angular momentum**:

**L = I x omega**

Where:
- L = angular momentum (kg⋅m²/s)
- I = moment of inertia (kg⋅m²)
- omega = angular velocity (rad/s)

The **conservation of angular momentum** says: if no external torque acts, L stays constant. This means:
- If I decreases (bring mass closer to axis), omega increases
- If I increases (extend mass away), omega decreases

This is exactly what figure skaters do — pull arms in to spin faster. Thang-Ta warriors do the same thing with their sword grip.`,
      analogy: 'Angular momentum conservation is like a revolving door. Once spinning, it keeps going because the momentum is stored in the rotation. Pushing against it (applying torque) is the only way to stop it. A spinning sword has the same stability — it "wants" to keep spinning.',
      storyConnection: 'The story describes how warriors maintain continuous spinning motions, flowing from one arc to the next. They are not fighting gravity or friction — they are riding the conservation of angular momentum, only applying small torques to redirect the spin.',
      checkQuestion: 'If a warrior pulls the sword closer to their body mid-spin, what happens to the spin rate?',
      checkAnswer: 'The spin rate increases. Pulling the sword closer reduces the moment of inertia I. Since L = I x omega must stay constant (no external torque), omega must increase to compensate. This is why pulling a spinning sword inward makes a satisfying "whoosh" — the blade accelerates.',
      codeIntro: 'Calculate angular momentum and show how grip changes affect spin rate.',
      code: `# Angular momentum conservation in Thang-Ta
import math

sword_mass = 1.2  # kg
sword_length = 0.8  # m

# Moment of inertia for different grip styles
# Modelled as thin rod about a point
grips = {
    'End grip (full reach)':    0.80,  # pivot at handle end
    'Middle grip (balanced)':    0.40,  # pivot at midpoint
    'Choked grip (close combat)': 0.20, # pivot near centre of mass
}

omega_initial = 3 * 2 * math.pi  # 3 rev/s starting speed

print("=== Angular Momentum in Thang-Ta ===\\n")
print(f"Starting spin: 3 rev/s ({omega_initial:.1f} rad/s)")
print(f"Sword: {sword_mass} kg, {sword_length} m\\n")

L_ref = None
for name, pivot_dist in grips.items():
    # I = (1/3) * m * L² for rod about end
    # For arbitrary pivot: I = m/12 * L² + m * d² (parallel axis)
    # Simplified: I ≈ (1/3) * m * (L - pivot_dist + L)...
    # Use: I = (1/3) * m * effective_length²
    eff_length = sword_length - pivot_dist + sword_length * 0.5
    eff_length = min(eff_length, sword_length)
    I = (1.0/3) * sword_mass * (sword_length - pivot_dist/2)**2

    if L_ref is None:
        L = I * omega_initial
        L_ref = L
        omega = omega_initial
    else:
        omega = L_ref / I  # conserve angular momentum

    rev_s = omega / (2 * math.pi)
    print(f"{name}:")
    print(f"  Pivot distance: {pivot_dist:.2f}m from end")
    print(f"  I = {I:.4f} kg⋅m²")
    print(f"  ω = {omega:.1f} rad/s = {rev_s:.1f} rev/s")
    print(f"  L = {L_ref:.3f} kg⋅m²/s (conserved)")
    print()

# The ice skater effect
print("--- The Skater Effect ---")
print("Pulling sword from full reach to choked grip:")
I_extended = (1.0/3) * sword_mass * sword_length**2
I_compact = (1.0/3) * sword_mass * (sword_length * 0.4)**2
omega_compact = omega_initial * (I_extended / I_compact)
print(f"  Extended I = {I_extended:.4f}, Compact I = {I_compact:.4f}")
print(f"  Speed increase: {omega_initial/(2*math.pi):.1f} rev/s → {omega_compact/(2*math.pi):.1f} rev/s")
print(f"  That's {omega_compact/omega_initial:.1f}x faster!")`,
      challenge: 'If the warrior switches from a 0.8m sword to a 0.4m dagger (same mass) while maintaining angular momentum, what happens to the spin rate? Calculate the new omega.',
      successHint: 'Angular momentum conservation explains why gyroscopes work, why planets orbit, and why Thang-Ta warriors can smoothly transition between wide sweeping arcs and tight rapid spins.',
    },
    {
      title: 'Centripetal force — what keeps the sword on its path',
      concept: `When a sword follows a circular path, something must pull it inward — otherwise it would fly off in a straight line (Newton's first law). This inward pull is **centripetal force**:

**F = m x v² / r = m x omega² x r**

The warrior's grip provides this centripetal force. The faster the spin and the heavier the sword, the harder the warrior must grip. At high speeds, the force becomes enormous.

This is why warriors train their grip strength intensely. A sword spinning at 5 rev/s requires the hand to exert a centripetal force of many times the sword's weight.

If the warrior loses grip, the sword flies off tangentially — in a straight line, not outward. There is no "centrifugal force" pushing it out. The sword simply stops being pulled in.`,
      analogy: 'Swing a ball on a string in a circle. Your hand pulls the string inward (centripetal force). If the string breaks, the ball flies off in a straight line — tangent to the circle, not radially outward. Your hand is the "string" for the Thang-Ta sword.',
      storyConnection: 'The story mentions warriors accidentally releasing swords during training — the blades always fly sideways, never outward. This surprised students until they understood centripetal force. The master explains: "The sword does not want to go out. It wants to go straight. Your hand bends its path into a circle."',
      checkQuestion: 'If you double the spin rate, what happens to the centripetal force needed?',
      checkAnswer: 'F = m x omega² x r. Doubling omega quadruples the force (because omega is squared). This is why high-speed spins are so demanding on grip strength — a small increase in speed requires a disproportionately large increase in grip force.',
      codeIntro: 'Calculate the centripetal force a Thang-Ta warrior\'s hand must exert at various spin rates.',
      code: `# Centripetal force on a spinning Thang-Ta sword
import math

sword_mass = 1.2  # kg
sword_length = 0.8  # m
g = 9.8

# Centre of mass of sword (assume uniform) is at L/2 from handle
r_com = sword_length / 2  # 0.4m from grip

print("=== Centripetal Force in Thang-Ta ===\\n")
print(f"Sword: {sword_mass} kg, CoM at {r_com} m from grip\\n")

print(f"{'Spin (rev/s)':>13} {'Omega':>8} {'Force (N)':>10} {'x Weight':>9}")
print("-" * 44)

for rev_s in [1, 2, 3, 4, 5, 6]:
    omega = rev_s * 2 * math.pi
    F_centripetal = sword_mass * omega**2 * r_com
    weight = sword_mass * g
    ratio = F_centripetal / weight

    print(f"{rev_s:>8} rev/s {omega:>7.1f} {F_centripetal:>9.1f} N {ratio:>8.1f}x")

# At what spin rate does centripetal force equal 10x sword weight?
target_ratio = 10
target_F = target_ratio * sword_mass * g
target_omega = math.sqrt(target_F / (sword_mass * r_com))
target_revs = target_omega / (2 * math.pi)
print(f"\\nTo reach {target_ratio}x weight: need {target_revs:.1f} rev/s")
print(f"That requires gripping with {target_F:.0f} N of force")
print(f"(About {target_F/g:.0f} kg grip strength — serious training needed!)")

# What if the sword is released at 3 rev/s?
omega = 3 * 2 * math.pi
v_release = omega * r_com
print(f"\\nIf released at 3 rev/s, sword flies at {v_release:.1f} m/s ({v_release*3.6:.0f} km/h)")
print("Direction: tangent to the circle (sideways), NOT outward!")`,
      challenge: 'Compare a heavy training sword (2.0 kg) with the standard 1.2 kg sword. At 3 rev/s, how much more grip force does the heavy sword require? This is why warriors train with heavy swords.',
      successHint: 'Centripetal force is not a separate force — it is the NET inward force (grip, tension, gravity, etc.) that bends a straight path into a circle. Understanding this eliminates the "centrifugal force" misconception forever.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Rotational Dynamics Basics</span>
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
