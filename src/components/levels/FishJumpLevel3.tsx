import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function FishJumpLevel3() {
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState('');

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true);
    setLoadProgress('Loading Python runtime...');
    try {
      if (!(window as any).loadPyodide) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
        document.head.appendChild(script);
        await new Promise<void>((resolve, reject) => { script.onload = () => resolve(); script.onerror = () => reject(new Error('Failed')); });
      }
      setLoadProgress('Starting Python...');
      const pyodide = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      setLoadProgress('Installing numpy & matplotlib...');
      await pyodide.loadPackage('micropip');
      const micropip = pyodide.pyimport('micropip');
      for (const pkg of ['numpy', 'matplotlib']) {
        try { await micropip.install(pkg); } catch { await pyodide.loadPackage(pkg).catch(() => {}); }
      }
      await pyodide.runPythonAsync(`
import sys, io
class OutputCapture:
    def __init__(self): self.output = []
    def write(self, text): self.output.append(text)
    def flush(self): pass
    def get_output(self): return ''.join(self.output)
    def clear(self): self.output = []
_stdout_capture = OutputCapture()
sys.stdout = _stdout_capture
sys.stderr = _stdout_capture
import matplotlib; matplotlib.use('AGG')
import warnings; warnings.filterwarnings('ignore', category=UserWarning)
import matplotlib.pyplot as plt; import base64
def _get_plot_as_base64():
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=100, bbox_inches='tight', facecolor='#1f2937', edgecolor='none')
    buf.seek(0); img_str = base64.b64encode(buf.read()).decode('utf-8'); plt.close('all'); return img_str
`);
      pyodideRef.current = pyodide; setPyReady(true); setLoading(false); setLoadProgress('');
      return pyodide;
    } catch (err: any) { setLoading(false); setLoadProgress('Error: ' + err.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Fish locomotion hydrodynamics — thrust, drag, and the physics of swimming',
      concept: `Fish swim by generating thrust through undulatory body movements and fin strokes, while overcoming drag from the water. The physics is governed by the Reynolds number: Re = ρvL/μ, where ρ is water density, v is swimming speed, L is body length, and μ is dynamic viscosity. Most fish swim at Re = 10³ to 10⁶, firmly in the inertial (turbulent) regime where drag is proportional to v².

Two types of drag dominate fish locomotion. Pressure drag (form drag) comes from the pressure difference between the front and back of the fish body — a streamlined shape minimizes this. Skin friction drag comes from water shearing along the fish surface. The total drag force is F_drag = ½ρv²C_d A, where C_d is the drag coefficient and A is the reference area. Fish have evolved remarkably low C_d values (0.01-0.05) through body shape optimization.

For a fish to jump, it must achieve an exit velocity at the water surface that provides enough kinetic energy to reach the desired height. From energy conservation: v_exit = √(2gh), where g is gravitational acceleration and h is jump height. A fish jumping 1 meter needs v_exit = 4.43 m/s. To reach this speed underwater, the fish must generate enough thrust to overcome drag and accelerate its mass. The power requirement scales as P ∝ v³, which is why jumping is one of the most energetically expensive activities a fish can perform.`,
      analogy: 'Swimming through water is like running through a crowd. At walking speed, people gently part around you (low Reynolds number). At sprinting speed, you slam into them and must push hard to get through (high Reynolds number). Drag increases with the square of speed, so swimming twice as fast requires four times the force. Jumping is like sprinting and then launching yourself into the air — the most explosive effort possible.',
      storyConnection: 'When the fish of Assam\'s rivers jump, they are performing one of the most demanding feats in animal locomotion. Each jump requires the fish to accelerate from cruising speed to maximum velocity, overcome the water-air boundary, and achieve enough exit velocity to clear the surface by a significant height. The story asks "why do fish jump?" — the physics tells us what it costs them to do so.',
      checkQuestion: 'A 30cm mahseer (0.3 kg) jumps 0.8 meters above the water surface. What exit velocity does it need? If it accelerates over a distance of 0.5m underwater, what average force must its muscles generate (ignoring drag)?',
      checkAnswer: 'Exit velocity: v = √(2 × 9.81 × 0.8) = 3.96 m/s. Average force from F = ma, where a = v²/(2d) = 3.96²/(2×0.5) = 15.7 m/s². So F = 0.3 × 15.7 = 4.7 N. This is about 16 times the fish\'s weight (0.3 × 9.81 = 2.94 N). In reality, drag adds significantly — the fish needs 30-50% more force. Fish jumping is an extraordinary muscular achievement.',
      codeIntro: 'Model the hydrodynamics of fish swimming and jumping — compute thrust, drag, and the energy budget of a jump.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Fish hydrodynamics model
rho_water = 998    # kg/m^3
mu_water = 1.0e-3  # Pa·s (dynamic viscosity at 20°C)
g = 9.81           # m/s^2

# Fish parameters (mahseer)
mass = 0.3         # kg
length = 0.30      # m
width = 0.06       # m
Cd = 0.03          # drag coefficient (streamlined fish)
A_frontal = np.pi * (width/2)**2  # frontal area

def drag_force(v):
    return 0.5 * rho_water * v**2 * Cd * A_frontal

def reynolds_number(v):
    return rho_water * v * length / mu_water

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Drag force vs swimming speed
ax = axes[0, 0]
ax.set_facecolor('#111827')
speeds = np.linspace(0, 5, 200)
drag = drag_force(speeds)
power = drag * speeds  # P = F × v

ax.plot(speeds, drag, color='#ef4444', linewidth=2.5, label='Drag force (N)')
ax2_twin = ax.twinx()
ax2_twin.plot(speeds, power, color='#3b82f6', linewidth=2.5, linestyle='--', label='Power (W)')
ax.set_xlabel('Swimming speed (m/s)', color='white')
ax.set_ylabel('Drag force (N)', color='#ef4444')
ax2_twin.set_ylabel('Power required (W)', color='#3b82f6')
ax.set_title('Drag & Power vs Speed (v² and v³ scaling)', color='white', fontsize=12, fontweight='bold')
# Mark jumping speed
v_jump = np.sqrt(2 * g * 0.8)
ax.axvline(v_jump, color='#fbbf24', linewidth=1.5, linestyle=':')
ax.text(v_jump + 0.1, drag_force(v_jump) * 0.7, f'Jump speed\\n{v_jump:.1f} m/s',
        color='#fbbf24', fontsize=9)
ax.tick_params(colors='gray'); ax2_twin.tick_params(colors='gray')
lines1, labels1 = ax.get_legend_handles_labels()
lines2, labels2 = ax2_twin.get_legend_handles_labels()
ax.legend(lines1 + lines2, labels1 + labels2, fontsize=8, facecolor='#1f2937',
          edgecolor='gray', labelcolor='white')

# Plot 2: Jump trajectory (projectile motion)
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
exit_angles = [30, 45, 60, 75, 90]
v0 = 4.5  # exit speed (m/s)
for angle in exit_angles:
    theta = np.radians(angle)
    vx = v0 * np.cos(theta)
    vy = v0 * np.sin(theta)
    # Time of flight
    t_flight = 2 * vy / g
    t = np.linspace(0, t_flight, 100)
    x = vx * t
    y = vy * t - 0.5 * g * t**2
    max_h = vy**2 / (2 * g)
    ax2.plot(x, y, linewidth=2, label=f'{angle}° (h={max_h:.2f}m)')

ax2.axhline(0, color='#3b82f6', linewidth=2, label='Water surface')
ax2.set_xlabel('Horizontal distance (m)', color='white')
ax2.set_ylabel('Height above water (m)', color='white')
ax2.set_title('Jump Trajectories by Exit Angle', color='white', fontsize=11)
ax2.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')
ax2.set_ylim(-0.1, 1.2)

# Plot 3: Energy budget of a jump
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
jump_heights = np.linspace(0.1, 1.5, 50)
v_exits = np.sqrt(2 * g * jump_heights)
# Kinetic energy at surface
KE_surface = 0.5 * mass * v_exits**2
# Energy lost to drag during underwater acceleration (approximate)
accel_dist = 0.5  # m
drag_work = drag_force(v_exits / 2) * accel_dist  # average drag over acceleration
# Potential energy at peak
PE_peak = mass * g * jump_heights
# Total energy input needed
total_energy = KE_surface + drag_work

ax3.stackplot(jump_heights, PE_peak, drag_work, KE_surface - PE_peak,
              colors=['#22c55e', '#ef4444', '#3b82f6'],
              labels=['Potential energy at peak', 'Energy lost to drag', 'Kinetic energy at entry'],
              alpha=0.7)
ax3.set_xlabel('Jump height (m)', color='white')
ax3.set_ylabel('Energy (J)', color='white')
ax3.set_title('Energy Budget of a Fish Jump', color='white', fontsize=11)
ax3.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')

# Plot 4: Reynolds number regimes
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
fish_sizes = [(0.02, 'Larva (2cm)'), (0.10, 'Juvenile (10cm)'),
              (0.30, 'Adult (30cm)'), (1.0, 'Large mahseer (1m)')]
for L, label in fish_sizes:
    Re_vals = rho_water * speeds * L / mu_water
    ax4.semilogy(speeds, Re_vals, linewidth=2, label=label)
ax4.axhspan(1, 1e3, alpha=0.1, color='#3b82f6')
ax4.axhspan(1e3, 1e6, alpha=0.1, color='#22c55e')
ax4.axhspan(1e6, 1e8, alpha=0.1, color='#f59e0b')
ax4.text(0.2, 100, 'Viscous\\n(Stokes)', color='#3b82f6', fontsize=8)
ax4.text(0.2, 1e4, 'Transitional', color='#22c55e', fontsize=8)
ax4.text(0.2, 5e6, 'Turbulent', color='#f59e0b', fontsize=8)
ax4.set_xlabel('Swimming speed (m/s)', color='white')
ax4.set_ylabel('Reynolds number', color='white')
ax4.set_title('Reynolds Number by Fish Size & Speed', color='white', fontsize=11)
ax4.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Fish Jump Physics:")
print(f"  Exit velocity for 0.8m jump: {np.sqrt(2*g*0.8):.2f} m/s")
print(f"  Exit velocity for 1.0m jump: {np.sqrt(2*g*1.0):.2f} m/s")
print(f"  Exit velocity for 1.5m jump: {np.sqrt(2*g*1.5):.2f} m/s")
print(f"\\nDrag at jump speed ({v_jump:.1f} m/s): {drag_force(v_jump):.3f} N")
print(f"Power at jump speed: {drag_force(v_jump)*v_jump:.3f} W")
print(f"Reynolds number at jump: {reynolds_number(v_jump):.0f} (turbulent)")
print(f"\\nEnergy for 0.8m jump: {0.5*mass*v_jump**2:.3f} J kinetic + drag losses")
print(f"This is ~{0.5*mass*v_jump**2 / (mass * g * 0.8) * 100:.0f}% more than the gravitational PE gained.")`,
      challenge: 'Add air resistance to the jump trajectory. Model the fish as a projectile experiencing quadratic drag in air (Cd_air ≈ 0.4). How much does air resistance reduce the maximum height compared to vacuum?',
      successHint: 'Fish locomotion involves the same fluid dynamics principles as aircraft and submarine design. The v² drag law and v³ power law are universal consequences of moving through a fluid at high Reynolds numbers. Understanding these physics explains why fish body shapes are so remarkably streamlined.',
    },
    {
      title: 'Muscle contraction biochemistry — ATP, actin, and myosin',
      concept: `Every fish jump begins with muscle contraction, and every muscle contraction begins with a molecule called ATP (adenosine triphosphate). ATP is the universal energy currency of all living cells. When a fish's brain sends a signal to jump, motor neurons release acetylcholine at the neuromuscular junction, triggering calcium release from the sarcoplasmic reticulum. Calcium ions bind to troponin, exposing binding sites on actin filaments. Myosin heads, powered by ATP hydrolysis, then "walk" along actin filaments, shortening the muscle fiber.

The cross-bridge cycle has four steps. (1) ATP binds to myosin, detaching it from actin. (2) ATP is hydrolyzed to ADP + Pi, cocking the myosin head into a high-energy state. (3) Myosin binds to actin and releases Pi, triggering the power stroke — the head pivots, pulling actin ~10nm. (4) ADP releases, and the cycle repeats. Each cycle consumes one ATP and moves the filament ~10nm. Thousands of myosin heads working in parallel generate the force to contract the muscle.

Fish have two main muscle types. White muscle (fast-twitch, glycolytic) powers explosive bursts like jumping — it contracts quickly but fatigues rapidly because glycolysis produces ATP anaerobically. Red muscle (slow-twitch, oxidative) powers sustained swimming — it contracts slowly but resists fatigue because aerobic metabolism produces ATP efficiently. A jumping fish relies almost entirely on white muscle, burning through its ATP reserves in seconds.`,
      analogy: 'The myosin cross-bridge cycle is like rowing a boat. The oar (myosin head) reaches forward and grabs the water (binds to actin). The power stroke pulls the oar backward (pivoting the myosin head). The oar is lifted and reset (ATP detaches myosin). Repeat. Each stroke moves the boat a fixed distance, just as each myosin cycle moves actin ~10nm. The ATP is the energy that lifts and resets the oar for the next stroke.',
      storyConnection: 'When a fish jumps from the water, what you see is the visible result of trillions of molecular machines working in concert. Each myosin head in the fish\'s white muscle is a tiny motor, converting the chemical energy of ATP into the mechanical work of contraction. The explosive leap that breaks the water surface is powered by the same biochemical cycle that powers every muscle in every animal on Earth.',
      checkQuestion: 'A fish\'s fast-twitch muscle fiber has 10 billion myosin heads. Each cross-bridge cycle consumes 1 ATP and moves actin 10nm. If all heads cycle 50 times per second during a jump, how much actin displacement occurs per second? How many ATP molecules are consumed per second?',
      checkAnswer: 'Each head moves actin 10nm × 50 cycles = 500nm (0.5 μm) per second. Not all heads are in phase, so this represents the maximum shortening rate. ATP consumption: 10 billion heads × 50 cycles = 5 × 10¹¹ ATP per second, just in one fiber. A fish has thousands of fibers, so total ATP turnover during a jump is astronomical — this is why jumping depletes energy reserves so rapidly.',
      codeIntro: 'Model the cross-bridge cycle and simulate muscle force generation, comparing fast-twitch (jumping) and slow-twitch (cruising) muscle fibers.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Muscle contraction model
# Cross-bridge cycling rate depends on ATP availability and fiber type

def muscle_force(n_heads, attachment_rate, detachment_rate, force_per_head=2e-12):
    """Compute steady-state force from cross-bridge cycling."""
    # Fraction of heads attached at any time
    f_attached = attachment_rate / (attachment_rate + detachment_rate)
    total_force = n_heads * f_attached * force_per_head
    return total_force, f_attached

def atp_consumption(n_heads, cycle_rate, duration):
    """Total ATP consumed during contraction."""
    return n_heads * cycle_rate * duration

# Fiber type parameters
fiber_types = {
    'White (fast-twitch)': {
        'n_heads': 1e10,
        'attach_rate': 100,  # /s
        'detach_rate': 200,  # /s
        'max_velocity': 10,   # fiber lengths/s
        'fatigue_time': 5,    # seconds
        'color': '#ef4444',
    },
    'Red (slow-twitch)': {
        'n_heads': 5e9,
        'attach_rate': 30,
        'detach_rate': 20,
        'max_velocity': 3,
        'fatigue_time': 3600,
        'color': '#3b82f6',
    },
}

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Force-velocity relationship
ax = axes[0, 0]
ax.set_facecolor('#111827')
for name, params in fiber_types.items():
    velocities = np.linspace(0, params['max_velocity'], 100)
    # Hill's equation: F = F0 * (V_max - V) / (V_max + V * (F0/a))
    F0 = muscle_force(params['n_heads'], params['attach_rate'], params['detach_rate'])[0]
    Vmax = params['max_velocity']
    a = F0 * 0.25  # Hill constant
    force = F0 * (Vmax - velocities) / (Vmax + velocities * F0 / a)
    force = np.maximum(force, 0)
    power = force * velocities
    ax.plot(velocities, force * 1e6, color=params['color'], linewidth=2.5, label=f'{name} — Force')
    ax.set_xlabel('Contraction velocity (fiber lengths/s)', color='white')
    ax.set_ylabel('Force (μN per fiber)', color='white')

ax.set_title("Hill's Force-Velocity Relationship", color='white', fontsize=12, fontweight='bold')
ax.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: ATP consumption and fatigue
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
time = np.linspace(0, 30, 500)  # seconds
for name, params in fiber_types.items():
    cycle_rate = params['attach_rate']
    # ATP reserve
    atp_reserve = 1e12  # molecules
    # Consumption rate
    consumption = params['n_heads'] * cycle_rate
    # ATP remaining
    atp_remaining = np.maximum(atp_reserve - consumption * time, 0)
    # Normalize
    ax2.plot(time, atp_remaining / atp_reserve * 100, color=params['color'],
             linewidth=2.5, label=name)

ax2.axhline(10, color='#f59e0b', linewidth=1, linestyle='--', label='Fatigue threshold')
ax2.set_xlabel('Time (seconds)', color='white')
ax2.set_ylabel('ATP remaining (%)', color='white')
ax2.set_title('ATP Depletion During Activity', color='white', fontsize=11)
ax2.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# Plot 3: Cross-bridge cycle states
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
# Model state transitions
states = ['Detached\\n(ATP bound)', 'Cocked\\n(ADP+Pi)', 'Attached\\n(power stroke)', 'Rigor\\n(no ATP)']
transition_rates = [100, 200, 150, 80]  # /s for fast-twitch
# Steady state fractions
total_rate = sum(transition_rates)
fractions = [r / total_rate for r in transition_rates]

colors_state = ['#3b82f6', '#f59e0b', '#22c55e', '#ef4444']
bars = ax3.bar(states, [f * 100 for f in fractions], color=colors_state, alpha=0.8,
              edgecolor='white', linewidth=0.5)
for bar, frac in zip(bars, fractions):
    ax3.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1,
            f'{frac:.0%}', ha='center', color='white', fontsize=11, fontweight='bold')
ax3.set_ylabel('% of myosin heads in state', color='white')
ax3.set_title('Cross-Bridge Cycle — State Distribution', color='white', fontsize=11)
ax3.tick_params(colors='gray')

# Plot 4: Muscle composition in different fish
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
fish_species = ['Salmon\\n(migratory)', 'Tuna\\n(pelagic)', 'Mahseer\\n(river)', 'Catfish\\n(benthic)', 'Flying fish\\n(jumper)']
white_pct = [55, 35, 70, 60, 80]
red_pct = [40, 60, 25, 30, 15]
pink_pct = [5, 5, 5, 10, 5]

x = np.arange(len(fish_species))
ax4.bar(x, white_pct, color='#ef4444', alpha=0.8, label='White (fast-twitch)')
ax4.bar(x, red_pct, bottom=white_pct, color='#3b82f6', alpha=0.8, label='Red (slow-twitch)')
ax4.bar(x, pink_pct, bottom=[w+r for w,r in zip(white_pct, red_pct)], color='#f59e0b',
        alpha=0.8, label='Pink (intermediate)')
ax4.set_xticks(x); ax4.set_xticklabels(fish_species, fontsize=9)
ax4.set_ylabel('Muscle composition (%)', color='white')
ax4.set_title('Muscle Fiber Composition by Species', color='white', fontsize=11)
ax4.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Muscle Biochemistry of Fish Jumping:")
for name, params in fiber_types.items():
    F, f_att = muscle_force(params['n_heads'], params['attach_rate'], params['detach_rate'])
    print(f"\\n{name}:")
    print(f"  Heads: {params['n_heads']:.0e}")
    print(f"  Fraction attached: {f_att:.1%}")
    print(f"  Force per fiber: {F*1e6:.1f} μN")
    print(f"  ATP consumption: {params['n_heads']*params['attach_rate']:.2e} /s")
    print(f"  Fatigue time: {params['fatigue_time']} s")
print(f"\\nJumping fish rely on white muscle — maximum power, rapid fatigue.")
print(f"A jump lasting 0.2s consumes ~{1e10 * 100 * 0.2:.1e} ATP molecules per fiber.")
print(f"Recovery takes minutes as creatine phosphate and glycolysis replenish ATP.")`,
      challenge: 'Model the recovery phase after a jump: add creatine phosphate buffering (fast, ~10s) and glycolysis (slow, ~minutes) as ATP replenishment pathways. Plot the ATP recovery curve and predict how many consecutive jumps a fish can make.',
      successHint: 'Every animal movement, from a fish jump to a human heartbeat, is powered by the same cross-bridge cycle of actin and myosin, fueled by ATP. The biochemistry is universal; only the fiber composition and metabolic support vary between species and activities.',
    },
    {
      title: 'Swim bladder physics — buoyancy control and depth regulation',
      concept: `Most bony fish have a swim bladder — a gas-filled organ that provides buoyancy. By adjusting the volume of gas in the bladder, a fish can achieve neutral buoyancy at any depth, hovering without effort. Without a swim bladder, a fish would need to swim continuously to avoid sinking (like sharks, which lack bladders and must keep moving).

The physics is Archimedes' principle: buoyant force = ρ_water × g × V_displaced. A fish achieves neutral buoyancy when its average density equals water density. Since fish tissue is slightly denser than water (~1050 kg/m³), the swim bladder provides the needed volume of low-density gas to bring the average density to ~1000 kg/m³. For a typical fish, the bladder is about 5-7% of body volume.

Boyle's Law creates a challenge for depth changes. As a fish descends, water pressure increases (adding 1 atm per 10m depth). This compresses the gas in the bladder: PV = constant. At 10m depth (2 atm), the bladder volume halves, and the fish becomes negatively buoyant (sinks faster). The fish must actively secrete gas into the bladder (via the gas gland, which uses lactic acid to release O₂ from hemoglobin) to maintain neutral buoyancy at the new depth. Rising fish must reabsorb gas through the oval window to prevent the bladder from expanding and potentially rupturing. Fish that jump must handle the extreme pressure change from water to air in a fraction of a second.`,
      analogy: 'A swim bladder works like a diver\'s BCD (buoyancy control device). Inflate it and you rise; deflate it and you sink. But Boyle\'s Law makes it tricky: the deeper you go, the more your BCD compresses, making you sink faster (a positive feedback loop). You must actively add air to compensate. Fish face the same challenge — and must solve it with a biological gas-secretion system rather than a tank of compressed air.',
      storyConnection: 'When a fish jumps, it transitions from neutral buoyancy in water to full gravitational freefall in air. The swim bladder, suddenly free of water pressure, expands slightly. Upon re-entry, the fish plunges through the surface and must rapidly readjust buoyancy as hydrostatic pressure reasserts itself. The jump is not just a muscular feat but a buoyancy management crisis.',
      checkQuestion: 'A fish is neutrally buoyant at 5m depth (1.5 atm) with a swim bladder volume of 20 mL. It rapidly rises to the surface (1.0 atm). What will the bladder volume become? What happens to the fish?',
      checkAnswer: 'Boyle\'s Law: P₁V₁ = P₂V₂. V₂ = P₁V₁/P₂ = 1.5 × 20 / 1.0 = 30 mL. The bladder expands by 50%, making the fish positively buoyant (it floats upward even faster — a dangerous positive feedback loop). If the fish cannot reabsorb gas quickly enough, the bladder can overexpand, compressing internal organs or even rupturing. This is why deep-sea fish brought to the surface often have everted stomachs — pushed out by the expanding swim bladder.',
      codeIntro: 'Model swim bladder physics: Boyle\'s Law compression at depth, buoyancy forces, and the gas secretion/reabsorption system.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Swim bladder physics
g = 9.81
rho_water = 998    # kg/m^3
P_atm = 101325     # Pa (1 atm)

def pressure_at_depth(depth):
    """Hydrostatic pressure at given depth (m)."""
    return P_atm + rho_water * g * depth

def bladder_volume_boyle(V0, P0, P):
    """Bladder volume at new pressure (Boyle's Law)."""
    return V0 * P0 / P

# Fish parameters
fish_mass = 0.3     # kg
fish_tissue_density = 1050  # kg/m^3
fish_tissue_volume = fish_mass / fish_tissue_density  # m^3

# At neutral buoyancy: fish_mass = rho_water * (tissue_vol + bladder_vol)
# bladder_vol_neutral = fish_mass / rho_water - tissue_vol
V_bladder_surface = fish_mass / rho_water - fish_tissue_volume  # m^3

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Bladder volume vs depth (Boyle's Law)
ax = axes[0, 0]
ax.set_facecolor('#111827')
depths = np.linspace(0, 50, 200)
pressures = pressure_at_depth(depths)
bladder_volumes = bladder_volume_boyle(V_bladder_surface, P_atm, pressures)
bladder_ml = bladder_volumes * 1e6  # convert m^3 to mL
surface_ml = V_bladder_surface * 1e6

ax.plot(bladder_ml, depths, color='#f59e0b', linewidth=2.5, label='Passive (Boyle only)')
# Active regulation: fish maintains constant volume
ax.plot([surface_ml] * len(depths), depths, color='#22c55e', linewidth=2.5,
        linestyle='--', label='Active regulation (neutral)')
ax.invert_yaxis()
ax.set_xlabel('Swim bladder volume (mL)', color='white')
ax.set_ylabel('Depth (m)', color='white')
ax.set_title("Boyle's Law vs Active Buoyancy Control", color='white', fontsize=12, fontweight='bold')
ax.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Net buoyancy force vs depth (without active regulation)
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
# Total fish volume = tissue + bladder
total_vol = fish_tissue_volume + bladder_volumes
# Average density
avg_density = fish_mass / total_vol
# Buoyancy force
buoyancy = rho_water * g * total_vol
weight = fish_mass * g
net_force = buoyancy - weight

ax2.plot(net_force, depths, color='#3b82f6', linewidth=2.5)
ax2.axvline(0, color='white', linewidth=0.5, linestyle='--')
ax2.fill_betweenx(depths, 0, net_force, where=net_force > 0, color='#22c55e', alpha=0.2,
                   label='Positively buoyant (rises)')
ax2.fill_betweenx(depths, 0, net_force, where=net_force < 0, color='#ef4444', alpha=0.2,
                   label='Negatively buoyant (sinks)')
ax2.invert_yaxis()
ax2.set_xlabel('Net buoyancy force (N)', color='white')
ax2.set_ylabel('Depth (m)', color='white')
ax2.set_title('Net Buoyancy Without Active Control', color='white', fontsize=11)
ax2.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# Plot 3: Gas secretion/reabsorption rates
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
time_min = np.linspace(0, 60, 500)
# Fish descends from 0m to 20m at t=0
# Gas gland secretion follows exponential approach
depth_change = 20  # m
P_new = pressure_at_depth(depth_change)
V_compressed = bladder_volume_boyle(V_bladder_surface, P_atm, P_new)
V_deficit = V_bladder_surface - V_compressed

# Secretion rate (physostome fish: slower; physoclist: uses gas gland)
tau_secretion = 15  # minutes time constant
V_recovery = V_compressed + V_deficit * (1 - np.exp(-time_min / tau_secretion))

ax3.plot(time_min, V_recovery * 1e6, color='#22c55e', linewidth=2.5, label='Volume recovery')
ax3.axhline(V_bladder_surface * 1e6, color='#fbbf24', linewidth=1, linestyle='--',
            label='Neutral buoyancy volume')
ax3.axhline(V_compressed * 1e6, color='#ef4444', linewidth=1, linestyle='--',
            label='Compressed volume at 20m')
ax3.set_xlabel('Time after descent (minutes)', color='white')
ax3.set_ylabel('Bladder volume (mL)', color='white')
ax3.set_title('Gas Secretion After Depth Change (0→20m)', color='white', fontsize=11)
ax3.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')

# Plot 4: Jump buoyancy dynamics
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
# Simulate a jump: fish at 2m depth → surface → 0.8m above → re-entry
t_jump = np.linspace(0, 1.5, 300)  # seconds
# Position: underwater acceleration, then projectile
depth_profile = np.zeros_like(t_jump)
for i, t in enumerate(t_jump):
    if t < 0.3:  # underwater acceleration (2m to surface)
        depth_profile[i] = 2 * (1 - t / 0.3)
    elif t < 0.7:  # airborne
        t_air = t - 0.3
        depth_profile[i] = -4.43 * t_air + 0.5 * g * t_air**2  # negative = above surface
        depth_profile[i] = -max(-depth_profile[i], 0)
    else:  # re-entry and descent
        t_reentry = t - 0.7
        depth_profile[i] = 0.5 * g * t_reentry**2 * 0.5  # slowing in water

P_profile = pressure_at_depth(np.maximum(depth_profile, 0))
P_profile[depth_profile < 0] = P_atm  # in air
V_bladder_jump = bladder_volume_boyle(V_bladder_surface, pressure_at_depth(2), P_profile)

ax4.plot(t_jump, depth_profile, color='#3b82f6', linewidth=2, label='Fish position')
ax4_twin = ax4.twinx()
ax4_twin.plot(t_jump, V_bladder_jump * 1e6, color='#f59e0b', linewidth=2,
              linestyle='--', label='Bladder volume')
ax4.axhline(0, color='white', linewidth=0.5)
ax4.set_xlabel('Time (seconds)', color='white')
ax4.set_ylabel('Depth (m, negative = above)', color='#3b82f6')
ax4_twin.set_ylabel('Bladder volume (mL)', color='#f59e0b')
ax4.set_title('Buoyancy During a Jump', color='white', fontsize=11)
lines1, labels1 = ax4.get_legend_handles_labels()
lines2, labels2 = ax4_twin.get_legend_handles_labels()
ax4.legend(lines1+lines2, labels1+labels2, fontsize=9, facecolor='#1f2937',
           edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray'); ax4_twin.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Swim Bladder Physics:")
print(f"  Fish mass: {fish_mass} kg")
print(f"  Tissue density: {fish_tissue_density} kg/m³")
print(f"  Bladder volume for neutral buoyancy: {V_bladder_surface*1e6:.1f} mL")
print(f"  Bladder as % of body: {V_bladder_surface/(fish_tissue_volume+V_bladder_surface)*100:.1f}%")
print()
print("Depth effects (Boyle's Law):")
for d in [0, 5, 10, 20, 50]:
    P = pressure_at_depth(d)
    V = bladder_volume_boyle(V_bladder_surface, P_atm, P)
    print(f"  {d:>3}m: P={P/P_atm:.1f} atm, V={V*1e6:.1f} mL ({V/V_bladder_surface*100:.0f}% of surface)")
print()
print("During a jump, bladder expands {:.0f}% as fish goes from 2m to air.".format(
    (bladder_volume_boyle(V_bladder_surface, pressure_at_depth(2), P_atm) / V_bladder_surface - 1) * 100))`,
      challenge: 'Model the difference between physostome fish (connected to gut, can gulp air) and physoclist fish (sealed bladder, must secrete/reabsorb gas). Compare their depth-change response times and predict which type is better suited for jumping.',
      successHint: 'The swim bladder is a beautiful example of physics and biology working together. Boyle\'s Law, Archimedes\' principle, and gas exchange physiology combine into a system that gives fish precise depth control — something human engineers achieve with complex ballast systems in submarines.',
    },
    {
      title: 'Dissolved oxygen and fish behavior — why fish jump when oxygen is low',
      concept: `One of the most common reasons fish jump is low dissolved oxygen (hypoxia). When DO drops below ~4 mg/L, many fish species exhibit aquatic surface respiration (ASR) — swimming to the surface to gulp the oxygen-rich water film. Jumping may be an extreme form of this behavior, or it may serve to aerate the water around the fish by breaking the surface tension.

Dissolved oxygen dynamics are governed by several processes. Supply: atmospheric diffusion across the air-water interface (driven by the concentration gradient and wind mixing), and photosynthesis by aquatic plants (which produces O₂ during daylight). Demand: aerobic respiration by all organisms, decomposition of organic matter by bacteria, and chemical oxidation. The balance between supply and demand determines DO.

Fish oxygen consumption follows Michaelis-Menten kinetics: uptake = V_max × [DO] / (Km + [DO]), where V_max is maximum uptake rate and Km is the half-saturation constant (~2-3 mg/L for most fish). Below Km, uptake drops sharply and the fish switches from aerobic to anaerobic metabolism, producing lactate and creating an oxygen debt. The critical oxygen level (Pcrit) is the DO at which a fish can no longer maintain its resting metabolic rate — below Pcrit, the fish must either flee, surface-breathe, or die.`,
      analogy: 'Dissolved oxygen for fish is like air pressure for a mountain climber. At sea level, breathing is effortless. As altitude increases (or DO decreases), each breath provides less oxygen. At some critical altitude (Pcrit), the climber cannot get enough oxygen to function normally — they must either descend, use supplemental oxygen, or risk death. Fish jumping at low DO are like climbers desperately reaching for an oxygen mask.',
      storyConnection: 'The fish in the story jump at dawn — precisely when dissolved oxygen is at its daily minimum. Overnight, respiration by all organisms consumes oxygen while photosynthesis stops. By dawn, DO has been declining for ~12 hours. The predawn jump is not mysterious; it is a survival response to the daily oxygen minimum. The story\'s observation is perfectly explained by the diel oxygen cycle.',
      checkQuestion: 'At 2 AM, a pond has DO = 2.5 mg/L. A fish species has Pcrit = 3.0 mg/L and Km = 2.0 mg/L. Calculate the fish\'s oxygen uptake rate as a percentage of its maximum. Is the fish in distress?',
      checkAnswer: 'Uptake = Vmax × [DO] / (Km + [DO]) = Vmax × 2.5 / (2.0 + 2.5) = Vmax × 0.556 = 55.6% of maximum. The fish is operating at only 56% of its potential oxygen uptake. Since DO (2.5) is below Pcrit (3.0), the fish cannot maintain its resting metabolic rate — it IS in distress. It would exhibit stress behaviors: ASR, jumping, or attempting to move to higher-DO water.',
      codeIntro: 'Model dissolved oxygen dynamics over 24 hours, compute fish oxygen uptake with Michaelis-Menten kinetics, and predict when and why fish jump.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# 24-hour DO model for a tropical pond
hours = np.linspace(0, 48, 1000)

# DO dynamics
def daily_DO(t, DO_mean=6.0, photo_amp=3.0, resp_rate=2.0):
    """Model diel DO cycle with photosynthesis (day) and respiration (always)."""
    # Photosynthesis: only during daylight (6am-6pm), sinusoidal
    photo = np.zeros_like(t)
    for h in t:
        hour_of_day = h % 24
        if 6 <= hour_of_day <= 18:
            photo[list(t).index(h) if isinstance(t, list) else np.where(t == h)[0][0]] = \
                photo_amp * np.sin(np.pi * (hour_of_day - 6) / 12)
    # Simpler vectorized version
    hour_of_day = t % 24
    is_day = (hour_of_day >= 6) & (hour_of_day <= 18)
    photo = np.where(is_day, photo_amp * np.sin(np.pi * (hour_of_day - 6) / 12), 0)

    # DO integrates photosynthesis - respiration
    DO = np.zeros_like(t)
    DO[0] = DO_mean
    dt = t[1] - t[0]
    for i in range(1, len(t)):
        reaeration = 0.3 * (9.0 - DO[i-1])  # toward saturation
        dDO = (photo[i] + reaeration - resp_rate) * dt
        DO[i] = max(DO[i-1] + dDO, 0.5)
    return DO

# Michaelis-Menten oxygen uptake
def oxygen_uptake(DO, Vmax=1.0, Km=2.5):
    return Vmax * DO / (Km + DO)

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: 48-hour DO cycle
ax = axes[0, 0]
ax.set_facecolor('#111827')
DO_normal = daily_DO(hours)
DO_eutrophic = daily_DO(hours, DO_mean=4.0, photo_amp=4.5, resp_rate=3.5)

ax.plot(hours, DO_normal, color='#3b82f6', linewidth=2.5, label='Healthy pond')
ax.plot(hours, DO_eutrophic, color='#ef4444', linewidth=2.5, label='Eutrophic pond')
ax.axhline(5, color='#f59e0b', linewidth=1, linestyle='--', label='Fish stress')
ax.axhline(2, color='#ef4444', linewidth=1, linestyle='--', label='Hypoxia')
# Shade night
for start in [0, 18, 42]:
    ax.axvspan(start, min(start + 12, 48), alpha=0.08, color='gray')
ax.set_xticks(range(0, 49, 6))
ax.set_xticklabels([f'{h%24}:00' for h in range(0, 49, 6)], fontsize=8)
ax.set_xlabel('Time', color='white')
ax.set_ylabel('DO (mg/L)', color='white')
ax.set_title('48-Hour Dissolved Oxygen Cycle', color='white', fontsize=12, fontweight='bold')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Michaelis-Menten uptake curves
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
DO_range = np.linspace(0, 12, 200)
species = [
    ('Tolerant catfish', 1.0, 1.5, 1.5, '#22c55e'),
    ('Mahseer', 1.0, 2.5, 3.0, '#3b82f6'),
    ('Hill trout', 1.0, 3.5, 4.5, '#f59e0b'),
    ('Sensitive endemic', 1.0, 4.0, 5.5, '#ef4444'),
]
for name, vmax, km, pcrit, color in species:
    uptake = oxygen_uptake(DO_range, vmax, km)
    ax2.plot(DO_range, uptake / vmax * 100, color=color, linewidth=2.5, label=name)
    ax2.axvline(pcrit, color=color, linewidth=0.8, linestyle=':', alpha=0.5)
    ax2.plot(pcrit, oxygen_uptake(pcrit, vmax, km) / vmax * 100, 'v',
             color=color, markersize=8)

ax2.set_xlabel('Dissolved oxygen (mg/L)', color='white')
ax2.set_ylabel('O₂ uptake (% of maximum)', color='white')
ax2.set_title('Michaelis-Menten Oxygen Uptake', color='white', fontsize=11)
ax2.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# Plot 3: Predicted jump probability vs DO
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
DO_vals = np.linspace(0, 10, 200)
# Jump probability increases as DO decreases below Pcrit
Pcrit = 3.0
jump_prob = 1 / (1 + np.exp(3 * (DO_vals - Pcrit)))
# Also correlate with time of day
ax3.plot(DO_vals, jump_prob * 100, color='#f59e0b', linewidth=2.5)
ax3.fill_between(DO_vals, 0, jump_prob * 100, color='#f59e0b', alpha=0.15)
ax3.axvline(Pcrit, color='#ef4444', linewidth=1.5, linestyle='--', label=f'Pcrit = {Pcrit} mg/L')
ax3.set_xlabel('Dissolved oxygen (mg/L)', color='white')
ax3.set_ylabel('Jump probability (%)', color='white')
ax3.set_title('Predicted Jumping Behavior vs DO', color='white', fontsize=11)
ax3.legend(fontsize=10, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')

# Plot 4: Jump frequency over 24 hours
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
hours_24 = np.linspace(0, 24, 200)
DO_24 = daily_DO(hours_24, DO_mean=4.5, photo_amp=4.0, resp_rate=3.0)
jump_freq = 1 / (1 + np.exp(3 * (DO_24 - Pcrit))) * 20  # jumps per hour

ax4_twin = ax4.twinx()
ax4.bar(hours_24, jump_freq, width=0.12, color='#f59e0b', alpha=0.6, label='Jump frequency')
ax4_twin.plot(hours_24, DO_24, color='#3b82f6', linewidth=2.5, label='DO')
ax4_twin.axhline(Pcrit, color='#ef4444', linewidth=1, linestyle='--')
ax4.set_xlabel('Hour of day', color='white')
ax4.set_ylabel('Jumps per hour', color='#f59e0b')
ax4_twin.set_ylabel('DO (mg/L)', color='#3b82f6')
ax4.set_title('Jump Frequency & DO Over 24 Hours', color='white', fontsize=11)
lines1, labels1 = ax4.get_legend_handles_labels()
lines2, labels2 = ax4_twin.get_legend_handles_labels()
ax4.legend(lines1+lines2, labels1+labels2, fontsize=9, facecolor='#1f2937',
           edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray'); ax4_twin.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Dissolved Oxygen & Fish Behavior:")
print(f"  DO minimum typically occurs at 4-6 AM (predawn)")
print(f"  Maximum jumping activity correlates with DO minimum")
print()
print("Species oxygen thresholds:")
for name, _, km, pcrit, _ in species:
    print(f"  {name}: Km={km} mg/L, Pcrit={pcrit} mg/L")
print()
print("This explains why fish jump at dawn — it\'s when DO is lowest.")
print("Jumping either aerates local water or lets fish gulp air directly.")`,
      challenge: 'Add water temperature as a confounding variable: warmer water holds less DO AND increases fish metabolic demand. Model how a 3°C temperature increase (climate warming) changes the daily DO minimum and shifts the peak jumping hour earlier.',
      successHint: 'The connection between dissolved oxygen and fish behavior is a textbook example of how physics (gas solubility), chemistry (oxidation/reduction), biology (respiration), and ecology (diel cycles) all intersect. Fish jumping at dawn is not a mystery — it is a predictable response to the daily oxygen minimum.',
    },
    {
      title: 'Fish migration triggers and telemetry tracking',
      concept: `Many fish species undertake remarkable migrations — moving upstream to spawn, downstream to feed, or between rivers and oceans. These migrations are triggered by environmental cues: changes in water temperature, photoperiod (day length), flow rate, and dissolved oxygen. The combination of triggers varies by species, but the underlying principle is that fish have evolved to time their movements to match environmental conditions that maximize reproductive success.

Temperature is often the primary trigger. Many salmonids begin their upstream migration when water temperatures cross a threshold (e.g., 10°C for Atlantic salmon). Photoperiod provides a calendar — as days shorten in autumn, hormonal changes prepare fish for migration. Flow rate triggers in river fish: rising water levels (from monsoon rains in Assam) signal that floodplain habitat is available and upstream passage is possible. These multiple cues provide redundancy — no single false signal triggers an energetically costly migration.

Modern telemetry tracks individual fish movements using acoustic transmitters, PIT tags, or satellite tags. An acoustic transmitter (small enough to surgically implant) emits coded ultrasonic pings detected by underwater receivers. By placing receivers at known locations, researchers reconstruct migration routes, timing, swimming speeds, and survival rates. Radio telemetry works similarly but uses radio waves, which travel through air better than water — useful for shallow rivers. Satellite tags on larger fish transmit location data directly to orbiting satellites, providing ocean-scale migration maps.`,
      analogy: 'Fish migration triggers are like the multiple conditions needed to launch a rocket. Temperature is the fuel readiness check. Photoperiod is the countdown timer. Flow rate is the weather clearance. All conditions must be met before launch (migration) begins. One missing signal delays the entire mission — evolution has built in multiple safety checks to prevent costly false starts.',
      storyConnection: 'The fish of Assam\'s rivers jump most spectacularly during monsoon season, when rising waters trigger upstream spawning migrations. The story\'s observation of fish jumping occurs at a precise time of year — when temperature, flow, and photoperiod align to trigger the ancient migratory impulse. Telemetry studies in the Brahmaputra basin have revealed migration routes that fish have followed for millennia.',
      checkQuestion: 'You deploy 20 acoustic receivers along a 50km river stretch and tag 100 mahseer. After one monsoon season, 60 fish are detected at receiver 15 (40km upstream), but only 25 at receiver 20 (50km). What can you conclude about migration success?',
      checkAnswer: 'Of 100 tagged fish, 60% reached 40km upstream — good migration progress. But only 25% reached the 50km mark, meaning 35 fish (58% of those at receiver 15) failed to complete the final 10km. This suggests a barrier or challenge between km 40 and 50 — possibly a waterfall, low-oxygen zone, or strong current. The 40% of fish never detected may have died, lost their tags, taken a different route, or not migrated at all. Telemetry identifies both the overall success rate and specific bottleneck locations.',
      codeIntro: 'Simulate fish migration triggers, model telemetry tracking, and analyze how environmental conditions drive migration timing.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Fish migration model: environmental triggers + telemetry tracking
np.random.seed(42)

# Environmental data: 365 days
days = np.arange(365)
# Temperature (tropical monsoon pattern)
temp = 18 + 10 * np.sin(2 * np.pi * (days - 100) / 365) + np.random.normal(0, 1, 365)
# Photoperiod (hours of daylight)
photo = 12 + 1.5 * np.sin(2 * np.pi * (days - 172) / 365)
# River flow (monsoon-driven)
base_flow = 50 + 30 * np.sin(2 * np.pi * (days - 180) / 365)
monsoon_pulse = 100 * np.exp(-0.5 * ((days - 200) / 20)**2)
flow = np.maximum(base_flow + monsoon_pulse + np.random.normal(0, 10, 365), 10)
# Dissolved oxygen
DO = 9.0 - 0.15 * temp + 0.01 * flow + np.random.normal(0, 0.3, 365)

# Migration trigger model: logistic function of combined cue strength
def migration_probability(temp, flow, photo, day):
    """Compute daily migration probability from environmental cues."""
    # Temperature trigger: >22°C
    t_cue = 1 / (1 + np.exp(-2 * (temp - 22)))
    # Flow trigger: >80 m³/s
    f_cue = 1 / (1 + np.exp(-0.05 * (flow - 80)))
    # Photoperiod: decreasing day length (post-solstice)
    p_cue = 1 / (1 + np.exp(5 * (photo - 12.5)))
    # Combined probability (all cues must align)
    return t_cue * f_cue * p_cue * 0.3

mig_prob = np.array([migration_probability(temp[d], flow[d], photo[d], d) for d in days])

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Environmental cues through the year
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax_t = ax.twinx()
ax.plot(days, temp, color='#ef4444', linewidth=1.5, alpha=0.8, label='Temperature (°C)')
ax.plot(days, flow / 5, color='#3b82f6', linewidth=1.5, alpha=0.8, label='Flow / 5 (m³/s)')
ax_t.plot(days, photo, color='#22c55e', linewidth=1.5, alpha=0.8, label='Photoperiod (h)')
ax.fill_between(days, 0, mig_prob * 100, color='#f59e0b', alpha=0.3, label='Migration prob (%)')
months = ['J','F','M','A','M','J','J','A','S','O','N','D']
ax.set_xticks(np.arange(15, 366, 30.5))
ax.set_xticklabels(months)
ax.set_ylabel('Temp / Flow / Migration %', color='white')
ax_t.set_ylabel('Photoperiod (hours)', color='#22c55e')
ax.set_title('Environmental Migration Cues', color='white', fontsize=12, fontweight='bold')
lines1, labels1 = ax.get_legend_handles_labels()
lines2, labels2 = ax_t.get_legend_handles_labels()
ax.legend(lines1+lines2, labels1+labels2, fontsize=7, facecolor='#1f2937',
          edgecolor='gray', labelcolor='white', loc='upper left')
ax.tick_params(colors='gray'); ax_t.tick_params(colors='gray')

# Plot 2: Simulated telemetry — fish positions over time
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
n_fish = 50
n_receivers = 10
receiver_positions = np.linspace(0, 50, n_receivers)  # km
# Simulate migration: each fish starts migrating based on probability
fish_positions = np.zeros((n_fish, 365))
for f in range(n_fish):
    speed = np.random.uniform(2, 8)  # km/day when migrating
    migrating = False
    for d in range(365):
        if not migrating and np.random.random() < mig_prob[d]:
            migrating = True
        if migrating:
            fish_positions[f, d] = min(fish_positions[f, d-1] + speed * np.random.uniform(0.5, 1.5)
                                       if d > 0 else 0, 50)
            # Some fish stop at barriers
            if fish_positions[f, d] > 35 and np.random.random() < 0.02:
                migrating = False
        else:
            fish_positions[f, d] = fish_positions[f, d-1] if d > 0 else 0

for f in range(min(15, n_fish)):
    ax2.plot(days, fish_positions[f], linewidth=0.8, alpha=0.6)
# Plot receiver positions
for rp in receiver_positions:
    ax2.axhline(rp, color='#fbbf24', linewidth=0.3, alpha=0.3)
ax2.set_xticks(np.arange(15, 366, 30.5))
ax2.set_xticklabels(months)
ax2.set_ylabel('Distance upstream (km)', color='white')
ax2.set_title('Telemetry: Individual Fish Tracks', color='white', fontsize=11)
ax2.tick_params(colors='gray')

# Plot 3: Detection counts at each receiver
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
# Count unique fish detected at each receiver position
detections = np.zeros(n_receivers)
for r, rp in enumerate(receiver_positions):
    for f in range(n_fish):
        if np.any(np.abs(fish_positions[f] - rp) < 2):
            detections[r] += 1

ax3.bar(receiver_positions, detections, width=3, color='#3b82f6', alpha=0.8,
        edgecolor='white', linewidth=0.5)
ax3.set_xlabel('Receiver position (km upstream)', color='white')
ax3.set_ylabel('Fish detected', color='white')
ax3.set_title('Fish Detections by Receiver', color='white', fontsize=11)
ax3.tick_params(colors='gray')
# Annotate the drop-off
if len(detections) > 7:
    drop = detections[6] - detections[7]
    if drop > 5:
        ax3.annotate(f'Drop: {drop:.0f} fish\\nlost here', xy=(receiver_positions[7], detections[7]),
                    xytext=(receiver_positions[7]+5, detections[7]+10),
                    color='#ef4444', fontsize=9, fontweight='bold',
                    arrowprops=dict(arrowstyle='->', color='#ef4444'))

# Plot 4: Migration timing distribution
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
# When did each fish start migrating?
start_days = []
for f in range(n_fish):
    started = np.where(fish_positions[f] > 1)[0]
    if len(started) > 0:
        start_days.append(started[0])
if start_days:
    ax4.hist(start_days, bins=30, color='#22c55e', alpha=0.7, edgecolor='white', linewidth=0.5)
    mean_start = np.mean(start_days)
    ax4.axvline(mean_start, color='#fbbf24', linewidth=2, linestyle='--',
                label=f'Mean start: day {mean_start:.0f}')
    ax4.set_xticks(np.arange(15, 366, 30.5))
    ax4.set_xticklabels(months)
ax4.set_xlabel('Migration start date', color='white')
ax4.set_ylabel('Number of fish', color='white')
ax4.set_title('Migration Timing Distribution', color='white', fontsize=11)
ax4.legend(fontsize=10, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

n_migrated = sum(1 for f in range(n_fish) if fish_positions[f, -1] > 5)
n_completed = sum(1 for f in range(n_fish) if fish_positions[f, -1] > 45)
print("Migration Telemetry Summary:")
print(f"  Tagged fish: {n_fish}")
print(f"  Fish that migrated: {n_migrated} ({n_migrated/n_fish*100:.0f}%)")
print(f"  Fish reaching 45+ km: {n_completed} ({n_completed/n_fish*100:.0f}%)")
if start_days:
    print(f"  Mean migration start: day {np.mean(start_days):.0f} (±{np.std(start_days):.0f})")
    print(f"  Peak migration month: {'JFMAMJJASOND'[int(np.mean(start_days)//30)]}")
print(f"\\nMigration triggers aligned: temperature >22°C + flow >80 m³/s + shortening days")
print(f"The monsoon pulse (July-September) opens the migration window.")
print(f"Telemetry reveals that ~{(n_migrated-n_completed)/max(n_migrated,1)*100:.0f}% of migrants fail to complete the journey.")`,
      challenge: 'Add a dam/barrier at km 35 that blocks 80% of fish. Then model a fish ladder that reduces the blockage to 20%. Compare migration success rates with and without the fish ladder and calculate the population-level impact on spawning success.',
      successHint: 'Telemetry has revolutionized fisheries science by replacing aggregate population estimates with individual-level movement data. Combined with environmental monitoring, it reveals the precise cues that trigger migration and the specific barriers that limit it. This knowledge is essential for managing fish stocks and designing effective fish passages.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (fish biology fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for hydrodynamics, biochemistry, and ecological modeling. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cpu className="w-5 h-5" />Load Python + NumPy</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L3-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint}
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
