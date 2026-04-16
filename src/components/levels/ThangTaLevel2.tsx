import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function ThangTaLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Mapping the sword arc — polar coordinates and matplotlib',
      concept: `A spinning sword traces a circle. The natural way to describe circular motion is with **polar coordinates** (r, theta) instead of Cartesian (x, y).

In polar coordinates:
- **r** = distance from the pivot (constant for a rigid sword)
- **theta** = angle of rotation (changes with time)

Converting to Cartesian for plotting:
- x = r x cos(theta)
- y = r x sin(theta)

matplotlib can plot in polar coordinates directly using \`plt.subplot(projection='polar')\`, which is perfect for visualising sword arcs and comparing different fighting stances.`,
      analogy: 'Polar coordinates are like giving directions with a compass: "walk 5 metres at 30 degrees northeast." Cartesian coordinates are like street addresses: "go 4 blocks east and 3 blocks north." Both describe the same location, but the compass version is more natural for circular motion.',
      storyConnection: 'Every Thang-Ta kata (form) traces specific arcs through the air. Some are full circles, some are partial arcs, some are figure-eights. Polar coordinates let us map these patterns precisely — turning martial art into geometry.',
      checkQuestion: 'Why are polar coordinates better than Cartesian for describing circular motion?',
      checkAnswer: 'In Cartesian coordinates, a circle requires the equation x² + y² = r² — two variables changing simultaneously. In polar coordinates, a circle is simply r = constant — one variable (theta) changes while the other (r) stays fixed. The math is dramatically simpler.',
      codeIntro: 'Plot the arc traced by a Thang-Ta sword in different fighting stances.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Three different Thang-Ta arcs
fig, axes = plt.subplots(1, 3, figsize=(12, 4), subplot_kw={'projection': 'polar'})
fig.patch.set_facecolor('#1f2937')

sword_length = 0.8  # metres

# Arc 1: Full defensive circle
theta1 = np.linspace(0, 2*np.pi, 200)
r1 = np.full_like(theta1, sword_length)
axes[0].plot(theta1, r1, color='#34d399', linewidth=2)
axes[0].fill(theta1, r1, alpha=0.1, color='#34d399')
axes[0].set_title('Full Circle\
(Defensive)', color='white', fontsize=10, pad=15)

# Arc 2: Half-arc overhead strike
theta2 = np.linspace(-np.pi/4, np.pi + np.pi/4, 200)
r2 = np.full_like(theta2, sword_length)
axes[1].plot(theta2, r2, color='#f59e0b', linewidth=3)
axes[1].set_title('Overhead Arc\
(Attack)', color='white', fontsize=10, pad=15)

# Arc 3: Figure-of-eight (two offset arcs)
theta3a = np.linspace(0, np.pi, 100)
r3a = sword_length * (1 + 0.2*np.sin(2*theta3a))
theta3b = np.linspace(np.pi, 2*np.pi, 100)
r3b = sword_length * (1 - 0.2*np.sin(2*theta3b))
axes[2].plot(theta3a, r3a, color='#ef4444', linewidth=2)
axes[2].plot(theta3b, r3b, color='#a78bfa', linewidth=2)
axes[2].set_title('Figure-Eight\
(Transition)', color='white', fontsize=10, pad=15)

for ax in axes:
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white', labelsize=7)
    ax.set_rlabel_position(45)
    ax.grid(True, alpha=0.3, color='white')

plt.tight_layout()
plt.savefig('sword_arcs.png', dpi=100, bbox_inches='tight', facecolor='#1f2937')
plt.show()

# Calculate arc lengths
arc1 = sword_length * 2 * np.pi
arc2 = sword_length * (np.pi + np.pi/2)
print(f"Full circle arc length: {arc1:.2f} m")
print(f"Overhead strike arc: {arc2:.2f} m")
print(f"Time for each at 3 rev/s: {1/3:.3f}s and {arc2/(sword_length*3*2*np.pi):.3f}s")`,
      challenge: 'Create a spiral arc where the sword extends outward during the spin (r increases from 0.4 to 0.8 over one rotation). This represents a "reaching" strike. Plot it.',
      successHint: 'Polar coordinates are the native language of rotation. Every radar screen, every compass, every turntable uses polar coordinates. You now speak this language.',
    },
    {
      title: 'Rotational energy — how much power is in a spin?',
      concept: `A spinning sword stores **rotational kinetic energy**:

**KE_rot = 0.5 x I x omega²**

This is the rotational equivalent of KE = 0.5 x m x v² for linear motion.

The **moment of inertia** I determines how much energy a given spin rate stores. A heavier sword or one gripped at the end (larger I) stores more energy at the same spin rate.

When the sword strikes a target, this rotational energy is transferred on impact. More stored energy = more devastating strike. But more I also means the sword is harder to start spinning and harder to stop.

This is the fundamental trade-off in weapon design: **power vs. agility**.`,
      analogy: 'Rotational energy is like the energy stored in a wound-up rubber band. The tighter you wind it (higher omega), the more energy is stored. A thick rubber band (high I) stores more energy per turn but is harder to wind up. A thin one (low I) is easy to wind but stores less.',
      storyConnection: 'The story describes two styles of Thang-Ta: the "heavy water" style (slow, powerful, high I) and the "quick fire" style (fast, agile, low I). These are not just aesthetic choices — they represent different trade-offs on the energy-agility spectrum.',
      checkQuestion: 'If you double the spin rate, how much more energy is stored?',
      checkAnswer: 'KE = 0.5 x I x omega². Doubling omega quadruples KE (because omega is squared). This means a small increase in spin rate dramatically increases striking power. Going from 3 to 4 rev/s increases energy by (4/3)² = 1.78x — a 78% increase from just 33% more speed.',
      codeIntro: 'Calculate and compare rotational energy for different Thang-Ta weapons and spin rates.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Different weapons
weapons = {
    'Light sword (0.8 kg)': {'mass': 0.8, 'length': 0.7, 'color': '#34d399'},
    'War sword (1.2 kg)':   {'mass': 1.2, 'length': 0.8, 'color': '#f59e0b'},
    'Heavy sword (1.8 kg)': {'mass': 1.8, 'length': 0.9, 'color': '#ef4444'},
    'Spear (1.5 kg)':       {'mass': 1.5, 'length': 1.8, 'color': '#a78bfa'},
}

omega_range = np.linspace(0, 8*2*np.pi, 200)  # 0 to 8 rev/s

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 5))
for ax in (ax1, ax2):
    ax.set_facecolor('#1f2937')
fig.patch.set_facecolor('#1f2937')

print("=== Rotational Energy Comparison ===\
")
print(f"{'Weapon':<22} {'I (kg⋅m²)':>10} {'KE at 3rev/s':>13} {'KE at 5rev/s':>13}")
print("-" * 62)

for name, props in weapons.items():
    I = (1.0/3) * props['mass'] * props['length']**2
    KE = 0.5 * I * omega_range**2

    rev_s = omega_range / (2 * np.pi)
    ax1.plot(rev_s, KE, color=props['color'], linewidth=2, label=name)

    ke3 = 0.5 * I * (3*2*np.pi)**2
    ke5 = 0.5 * I * (5*2*np.pi)**2
    print(f"{name:<22} {I:>9.4f} {ke3:>10.1f} J {ke5:>10.1f} J")
    ax2.bar(name.split('(')[0].strip(), ke3, color=props['color'], alpha=0.7, label=f'3 rev/s')

ax1.set_title('Rotational KE vs Spin Rate', color='white', fontsize=12, fontweight='bold')
ax1.set_xlabel('Spin rate (rev/s)', color='white')
ax1.set_ylabel('Kinetic Energy (J)', color='white')
ax1.tick_params(colors='white')
ax1.legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=8)
ax1.grid(True, alpha=0.2, color='white')

ax2.set_title('Energy at 3 rev/s by Weapon', color='white', fontsize=12, fontweight='bold')
ax2.set_ylabel('Kinetic Energy (J)', color='white')
ax2.tick_params(colors='white', labelsize=8)

plt.tight_layout()
plt.savefig('rotational_energy.png', dpi=100, bbox_inches='tight', facecolor='#1f2937')
plt.show()

# Impact force estimate
print("\
Impact estimate (stopping in 0.01s at 3 rev/s):")
for name, props in weapons.items():
    I = (1.0/3) * props['mass'] * props['length']**2
    omega = 3 * 2 * np.pi
    KE = 0.5 * I * omega**2
    F_avg = KE / 0.01  # work-energy theorem: F*d ≈ KE, assume 1cm deformation
    print(f"  {name}: KE={KE:.1f}J → F≈{F_avg:.0f}N ({F_avg/9.8:.0f}kg)")`,
      challenge: 'Add a "training weighted sword" (2.5 kg, 0.8m). Calculate its energy at 2 rev/s. Why do warriors train with heavy swords but fight with lighter ones?',
      successHint: 'Energy scales with omega squared — this is why speed matters more than mass in martial arts. A 20% faster strike delivers 44% more energy. Speed training is physics-backed.',
    },
    {
      title: 'Biomechanics — joint angles and sword trajectory',
      concept: `The trajectory of a sword depends on the angles of every joint in the arm. Using **forward kinematics**, we can calculate where the sword tip is given the angles of the shoulder, elbow, and wrist.

For a 2D model:
- **Shoulder angle** (theta1) rotates the upper arm
- **Elbow angle** (theta2) rotates the forearm relative to the upper arm
- **Wrist angle** (theta3) rotates the sword relative to the forearm

The sword tip position:
x = L1*cos(theta1) + L2*cos(theta1+theta2) + L3*cos(theta1+theta2+theta3)
y = L1*sin(theta1) + L2*sin(theta1+theta2) + L3*sin(theta1+theta2+theta3)

This is the same math used in **robotics** for controlling robot arms.`,
      analogy: 'Forward kinematics is like following a chain of hinges. Imagine three rulers connected by hinges. If you know the angle of each hinge, you can calculate exactly where the tip of the last ruler ends up. The arm-and-sword system is exactly this chain of hinges.',
      storyConnection: 'The Thang-Ta master teaches students specific joint angles for each strike. "Shoulder at 45 degrees, elbow at 90, wrist at 30." These are not arbitrary — they define a precise trajectory that maximises reach and power. Forward kinematics is the math behind the master\'s instructions.',
      checkQuestion: 'If the shoulder and elbow are both at 0 degrees (arm straight out), where is the sword tip?',
      checkAnswer: 'All segments are aligned horizontally. x = L1 + L2 + L3 (maximum horizontal reach), y = 0. This is the position of maximum forward reach — arm and sword fully extended. Any joint bend reduces horizontal reach but adds vertical or lateral movement.',
      codeIntro: 'Animate a Thang-Ta strike using forward kinematics.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Segment lengths
L1 = 0.30  # upper arm
L2 = 0.28  # forearm
L3 = 0.65  # sword

# Animate an overhead strike: shoulder sweeps, elbow extends, wrist snaps
n_frames = 50
shoulder = np.linspace(2.5, 0.5, n_frames)       # radians
elbow = np.linspace(-1.5, -0.3, n_frames)
wrist = np.linspace(0.5, -0.8, n_frames)

# Calculate all joint positions for each frame
tip_trail_x, tip_trail_y = [], []

fig, ax = plt.subplots(1, 1, figsize=(8, 8))
ax.set_facecolor('#1f2937')
fig.patch.set_facecolor('#1f2937')

for frame in [0, 12, 24, 36, 49]:  # sample frames
    t1, t2, t3 = shoulder[frame], elbow[frame], wrist[frame]

    # Joint positions via forward kinematics
    x0, y0 = 0, 0  # shoulder pivot
    x1 = x0 + L1 * np.cos(t1)
    y1 = y0 + L1 * np.sin(t1)
    x2 = x1 + L2 * np.cos(t1 + t2)
    y2 = y1 + L2 * np.sin(t1 + t2)
    x3 = x2 + L3 * np.cos(t1 + t2 + t3)
    y3 = y2 + L3 * np.sin(t1 + t2 + t3)

    alpha = 0.3 + 0.7 * (frame / 49)
    ax.plot([x0, x1, x2, x3], [y0, y1, y2, y3], 'o-',
            color='#34d399', alpha=alpha, linewidth=2, markersize=5)

# Full tip trajectory
for frame in range(n_frames):
    t1, t2, t3 = shoulder[frame], elbow[frame], wrist[frame]
    x1 = L1 * np.cos(t1)
    y1 = L1 * np.sin(t1)
    x2 = x1 + L2 * np.cos(t1 + t2)
    y2 = y1 + L2 * np.sin(t1 + t2)
    x3 = x2 + L3 * np.cos(t1 + t2 + t3)
    y3 = y2 + L3 * np.sin(t1 + t2 + t3)
    tip_trail_x.append(x3)
    tip_trail_y.append(y3)

ax.plot(tip_trail_x, tip_trail_y, '-', color='#ef4444', linewidth=3, alpha=0.7, label='Sword tip path')
ax.plot(0, 0, 'o', color='white', markersize=10, label='Shoulder pivot')
ax.set_title('Thang-Ta Overhead Strike — Forward Kinematics', color='white', fontsize=13, fontweight='bold')
ax.set_xlabel('x (metres)', color='white')
ax.set_ylabel('y (metres)', color='white')
ax.tick_params(colors='white')
ax.set_aspect('equal')
ax.legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white')
ax.grid(True, alpha=0.2, color='white')

plt.tight_layout()
plt.savefig('kinematics.png', dpi=100, bbox_inches='tight', facecolor='#1f2937')
plt.show()

# Tip speed at each frame
speeds = []
for i in range(1, len(tip_trail_x)):
    dx = tip_trail_x[i] - tip_trail_x[i-1]
    dy = tip_trail_y[i] - tip_trail_y[i-1]
    dt = 0.5 / n_frames  # assume 0.5s total strike time
    speed = np.sqrt(dx**2 + dy**2) / dt
    speeds.append(speed)
print(f"Peak tip speed: {max(speeds):.1f} m/s ({max(speeds)*3.6:.0f} km/h)")
print(f"Average tip speed: {np.mean(speeds):.1f} m/s")`,
      challenge: 'Create a different strike by changing the angle trajectories. Make a horizontal sweep (shoulder stays constant, elbow sweeps). How does the tip path differ?',
      successHint: 'Forward kinematics is the foundation of robotics. Every industrial robot arm, every animated character, and every motion-capture system uses exactly this math. You just applied it to a martial art.',
    },
    {
      title: 'Power generation — torque times angular velocity',
      concept: `**Mechanical power** in rotation is:

**P = tau x omega**

Where tau is the torque applied and omega is the angular velocity. This tells us the rate at which the warrior does work on the sword.

But the warrior's muscles have limits. At low speed, they can apply high torque. At high speed, their torque drops. This creates a **force-velocity curve** that peaks at intermediate speeds.

The maximum power output occurs not at maximum torque (too slow) or maximum speed (too little torque), but somewhere in the middle. This is why Thang-Ta strikes are not maximally fast — they are optimally powerful.`,
      analogy: 'Power is like cycling up a hill. In the lowest gear (high torque, low speed), you have plenty of force but move slowly — low power. In the highest gear (low torque, high speed), you spin fast but cannot push hard — also low power. The optimal gear gives the most wattage. Muscles work the same way.',
      storyConnection: 'The story describes how beginners try to swing as fast as possible but deliver weak strikes. Masters swing at a measured pace but generate devastating impact. The force-velocity relationship explains why: optimal power is at intermediate speed, not maximum speed.',
      checkQuestion: 'Why does a very fast but "loose" swing deliver less impact than a slower, "connected" swing?',
      checkAnswer: 'A fast, loose swing has high omega but low effective torque (the muscles are moving too fast to generate force). A connected swing has moderate omega but high torque (muscles are in their optimal range). Since P = tau x omega, the connected swing can deliver more total power despite lower speed.',
      codeIntro: 'Model the muscle force-velocity relationship and find the optimal striking speed.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Hill's muscle model: F = F_max * (1 - v/v_max)^n
# For rotational: tau = tau_max * (1 - omega/omega_max)^n
tau_max = 25.0       # maximum isometric torque (Nm) — strong warrior
omega_max = 40.0     # maximum angular velocity (rad/s) at zero load
n_hill = 0.4         # Hill's curve shape parameter

omega = np.linspace(0, omega_max, 200)
tau = tau_max * (1 - omega / omega_max) ** n_hill
tau = np.maximum(tau, 0)

power = tau * omega

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 5))
for ax in (ax1, ax2):
    ax.set_facecolor('#1f2937')
fig.patch.set_facecolor('#1f2937')

ax1.plot(omega / (2*np.pi), tau, color='#3b82f6', linewidth=2)
ax1.set_title("Muscle Torque-Velocity Curve", color='white', fontsize=12, fontweight='bold')
ax1.set_xlabel('Angular velocity (rev/s)', color='white')
ax1.set_ylabel('Torque (Nm)', color='white')
ax1.tick_params(colors='white')
ax1.grid(True, alpha=0.2, color='white')

ax2.plot(omega / (2*np.pi), power, color='#ef4444', linewidth=2)
opt_idx = np.argmax(power)
ax2.plot(omega[opt_idx]/(2*np.pi), power[opt_idx], 'o', color='#f59e0b', markersize=12,
         label=f'Peak: {power[opt_idx]:.0f}W at {omega[opt_idx]/(2*np.pi):.1f} rev/s')
ax2.set_title("Power Output vs Speed", color='white', fontsize=12, fontweight='bold')
ax2.set_xlabel('Angular velocity (rev/s)', color='white')
ax2.set_ylabel('Power (Watts)', color='white')
ax2.tick_params(colors='white')
ax2.legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white')
ax2.grid(True, alpha=0.2, color='white')

plt.tight_layout()
plt.savefig('power_curve.png', dpi=100, bbox_inches='tight', facecolor='#1f2937')
plt.show()

opt_omega = omega[opt_idx]
opt_tau = tau[opt_idx]
print(f"Optimal striking speed: {opt_omega/(2*np.pi):.1f} rev/s ({opt_omega:.1f} rad/s)")
print(f"At optimal: torque = {opt_tau:.1f} Nm, power = {power[opt_idx]:.0f} W")
print(f"At max speed ({omega_max/(2*np.pi):.1f} rev/s): torque ≈ 0, power ≈ 0")
print(f"At zero speed: torque = {tau_max} Nm, power = 0")
print(f"\
The optimal speed is {opt_omega/omega_max*100:.0f}% of maximum — NOT at max speed!")`,
      challenge: 'Compare a trained warrior (tau_max=25, omega_max=40) with a beginner (tau_max=12, omega_max=25). Plot both power curves. How much more powerful is the trained warrior?',
      successHint: 'The force-velocity relationship governs all athletic performance. Sprinters, swimmers, and martial artists all have optimal speeds where they generate maximum power. Training shifts the entire curve upward and rightward.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Rotational Analysis & Biomechanics</span>
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
