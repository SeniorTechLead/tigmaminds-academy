import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import NewtonForceDiagram from '../diagrams/NewtonForceDiagram';
import WorkForceDiagram from '../diagrams/WorkForceDiagram';
import EnergyBarChartDiagram from '../diagrams/EnergyBarChartDiagram';
import SineWaveDiagram from '../diagrams/SineWaveDiagram';
import SlopeInterceptDiagram from '../diagrams/SlopeInterceptDiagram';
import DistanceFormulaDiagram from '../diagrams/DistanceFormulaDiagram';

export default function DavidGoliathLevel4() {
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState('');

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true); setLoadProgress('Loading Python runtime...');
    try {
      if (!(window as any).loadPyodide) { const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js'; document.head.appendChild(s); await new Promise<void>((r, j) => { s.onload = () => r(); s.onerror = () => j(new Error('Failed')); }); }
      setLoadProgress('Starting Python...'); const py = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      setLoadProgress('Installing numpy & matplotlib...'); await py.loadPackage('micropip'); const mp = py.pyimport('micropip');
      for (const p of ['numpy', 'matplotlib']) { try { await mp.install(p); } catch { await py.loadPackage(p).catch(() => {}); } }
      await py.runPythonAsync(`import sys,io\nclass OC:\n def __init__(self):self.o=[]\n def write(self,t):self.o.append(t)\n def flush(self):pass\n def get_output(self):return''.join(self.o)\n def clear(self):self.o=[]\n_stdout_capture=OC();sys.stdout=_stdout_capture;sys.stderr=_stdout_capture\nimport matplotlib;matplotlib.use('AGG');import warnings;warnings.filterwarnings('ignore',category=UserWarning);import matplotlib.pyplot as plt;import base64\ndef _get_plot_as_base64():\n buf=io.BytesIO();plt.savefig(buf,format='png',dpi=100,bbox_inches='tight',facecolor='#1f2937',edgecolor='none');buf.seek(0);s=base64.b64encode(buf.read()).decode('utf-8');plt.close('all');return s`);
      pyodideRef.current = py; setPyReady(true); setLoading(false); setLoadProgress(''); return py;
    } catch (e: any) { setLoading(false); setLoadProgress('Error: ' + e.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Design a sling simulator with physics engine',
      concept: `Time to build a complete **sling physics engine** from the ground up. This simulator combines everything from Levels 1-3 into a single cohesive system:

1. **Spin-up phase**: model the sling as a rotating mass with torque input and drag
2. **Release phase**: convert angular motion to linear projectile
3. **Flight phase**: Euler integration with gravity and air drag
4. **Impact phase**: calculate force, pressure, and energy transfer

The engine is organized as a Python class with methods for each phase. This is how real physics simulations are structured: modular, reusable, and configurable through parameters.

Your simulator will accept inputs (stone mass, sling length, spin rate, target distance) and output a complete analysis: trajectory, flight time, impact speed, force, pressure, and damage assessment.`,
      analogy: 'A physics engine is like a virtual laboratory. Instead of buying equipment, measuring by hand, and running one experiment at a time, you define the rules of physics in code and run thousands of experiments instantly. Game studios use the same approach — every physics-based game (Angry Birds to spacecraft simulators) runs a physics engine at its core.',
      storyConnection: 'Ancient generals would test weapons empirically: fire many shots, measure results, adjust. Our simulator does the same in milliseconds. David tested his sling against wolves and lions before facing Goliath. Our code "tests" against virtual targets with perfect measurement.',
      checkQuestion: 'Why is it important to validate a physics simulation against known analytical solutions before using it for new problems?',
      checkAnswer: 'Because bugs in the simulation can produce plausible-looking but wrong results. By first testing against problems with known solutions (e.g., ideal projectile motion without drag), you verify the code is correct. Only then can you trust it for problems without analytical solutions (e.g., projectile with drag and wind). This is the scientific method applied to software.',
      codeIntro: 'Build a complete sling physics engine as a Python class.',
      code: `import numpy as np
import matplotlib.pyplot as plt

class SlingSimulator:
    def __init__(self, m=0.05, r_stone=0.01, L_sling=0.8):
        self.m = m; self.r = r_stone; self.L = L_sling
        self.A = np.pi * r_stone**2
        self.Cd = 0.47; self.rho = 1.2; self.g = 9.8

    def spin_up(self, torque, duration, dt=0.001):
        I = self.m * self.L**2
        omega, t = 0, 0
        while t < duration:
            alpha = torque / I
            omega += alpha * dt; t += dt
        return omega, omega * self.L  # angular vel, linear vel

    def fly(self, v0, angle, h0=1.5, dt=0.001):
        vx = v0 * np.cos(np.radians(angle))
        vy = v0 * np.sin(np.radians(angle))
        x, y, xs, ys = 0, h0, [0], [h0]
        while y >= 0:
            v = np.sqrt(vx**2 + vy**2)
            Fd = 0.5*self.rho*v**2*self.Cd*self.A/self.m
            vx -= Fd*vx/v*dt; vy -= (self.g + Fd*vy/v)*dt
            x += vx*dt; y += vy*dt
            xs.append(x); ys.append(y)
        v_impact = np.sqrt(vx**2 + vy**2)
        return np.array(xs), np.array(ys), v_impact

    def impact(self, v_impact, contact_area=1e-4, stop_time=0.001):
        p = self.m * v_impact
        F = p / stop_time
        P = F / contact_area
        KE = 0.5 * self.m * v_impact**2
        return {'force_N': F, 'pressure_MPa': P/1e6, 'energy_J': KE}

# Run simulation
sim = SlingSimulator(m=0.05, L_sling=0.8)
omega, v_release = sim.spin_up(torque=4.0, duration=0.8)
xs, ys, v_impact = sim.fly(v_release, angle=15, h0=1.5)
result = sim.impact(v_impact)

plt.figure(figsize=(10, 5))
plt.plot(xs, ys, 'gold', linewidth=2.5)
plt.plot(xs[-1], 0, 'r*', markersize=15)
plt.xlabel('Distance (m)'); plt.ylabel('Height (m)')
plt.title(f'Sling Simulator: v={v_release:.0f} m/s, impact={v_impact:.0f} m/s')
plt.grid(alpha=0.3); plt.ylim(0); plt.show()

print(f"Release: {v_release:.1f} m/s | Impact: {v_impact:.1f} m/s")
print(f"Force: {result['force_N']:.0f} N | Pressure: {result['pressure_MPa']:.1f} MPa")
print(f"Energy: {result['energy_J']:.1f} J")`,
      challenge: 'Add a method `find_angle(target_x, target_y)` that searches for the launch angle that hits a specific point. Use a binary search between 5 and 80 degrees.',
      successHint: 'You built a real physics engine. The class structure makes it reusable and extensible. Every feature you add in the following lessons plugs into this framework.',
    },
    {
      title: 'Add wind and elevation effects',
      concept: `Real ballistics happens in the real world — with wind, terrain, and varying air density. Let's extend the simulator.

**Wind** adds a constant horizontal force. A headwind slows the stone; a tailwind pushes it farther. Crosswind (in 3D) would push it sideways, but we will stay in 2D for now.

**Elevation** changes the problem geometry. Shooting uphill, gravity works against you more. Shooting downhill, it helps. The optimal angle shifts away from 45 degrees:
- Uphill: optimal angle > 45 degrees
- Downhill: optimal angle < 45 degrees

**Air density** decreases with altitude (about 12% per 1000m). At higher elevations, drag is less and projectiles fly farther. This is why golf balls travel farther in Denver than at sea level.

The code extends the SlingSimulator class with wind and terrain slope.`,
      analogy: 'Think of throwing a paper airplane outdoors vs. indoors. Indoors, the flight is predictable. Outdoors, wind pushes it sideways or slows it down. The same paper airplane performs completely differently because of environmental forces. Our simulator learns to account for these real-world effects.',
      storyConnection: 'The Valley of Elah runs roughly east-west. If a westerly wind blew (common in the afternoon), it would have aided David\'s stone traveling toward the Philistine camp. Ancient slingers absolutely considered wind — experienced soldiers waited for favorable conditions or adjusted their aim.',
      checkQuestion: 'A sniper shooting at a target 800m away in a 10 km/h crosswind must aim to the side. But by how much? Is it centimeters, meters, or tens of meters?',
      checkAnswer: 'Several meters. A 10 km/h (2.8 m/s) crosswind pushes a bullet sideways during its ~1 second flight time. The deflection is roughly 1-3 meters depending on bullet aerodynamics. At 800m, this is the difference between a hit and a complete miss. Military snipers use wind charts and practice extensive wind reading. For a sling stone (slower, more drag), wind effects are even more dramatic.',
      codeIntro: 'Extend the simulator with wind and terrain slope effects.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def simulate_with_wind(v0, angle, h0, wind_speed, slope_deg,
                       m=0.05, Cd=0.47, r=0.01, dt=0.001):
    A = np.pi * r**2; rho = 1.2; g = 9.8
    vx = v0 * np.cos(np.radians(angle))
    vy = v0 * np.sin(np.radians(angle))
    x, y, xs, ys = 0, h0, [0], [h0]

    while y >= 0 and x < 150:
        # Relative velocity (stone vs. wind)
        vx_rel = vx - wind_speed
        v_rel = np.sqrt(vx_rel**2 + vy**2)
        if v_rel < 0.01: break
        Fd = 0.5 * rho * v_rel**2 * Cd * A / m
        vx -= Fd * vx_rel / v_rel * dt
        vy -= (g + Fd * vy / v_rel) * dt
        x += vx * dt; y += vy * dt
        # Ground follows slope
        ground_y = x * np.tan(np.radians(slope_deg))
        if y < ground_y: break
        xs.append(x); ys.append(y)
    return np.array(xs), np.array(ys)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))

# Wind effects
for wind, color, label in [(-5, 'red', 'Headwind 5 m/s'),
                            (0, 'lime', 'No wind'),
                            (5, 'cyan', 'Tailwind 5 m/s'),
                            (10, 'blue', 'Tailwind 10 m/s')]:
    xs, ys = simulate_with_wind(30, 20, 1.5, wind, 0)
    ax1.plot(xs, ys, color=color, linewidth=2, label=label)

ax1.set_title('Effect of Wind on Trajectory', fontsize=13)
ax1.set_xlabel('Distance (m)'); ax1.set_ylabel('Height (m)')
ax1.legend(fontsize=9); ax1.grid(alpha=0.3); ax1.set_ylim(0)

# Slope effects
for slope, color, label in [(-10, 'cyan', 'Downhill 10 deg'),
                              (-5, 'blue', 'Downhill 5 deg'),
                              (0, 'lime', 'Flat'),
                              (5, 'orange', 'Uphill 5 deg'),
                              (10, 'red', 'Uphill 10 deg')]:
    xs, ys = simulate_with_wind(30, 25, 1.5, 0, slope)
    ax2.plot(xs, ys, color=color, linewidth=2, label=label)
    # Draw ground
    gx = np.linspace(0, 80, 100)
    ax2.plot(gx, gx*np.tan(np.radians(slope)), color=color,
             linestyle=':', alpha=0.3)

ax2.set_title('Effect of Terrain Slope', fontsize=13)
ax2.set_xlabel('Distance (m)'); ax2.set_ylabel('Height (m)')
ax2.legend(fontsize=9); ax2.grid(alpha=0.3)
ax2.set_ylim(-5, 15)

plt.tight_layout(); plt.show()
print("Headwind cuts range dramatically (v_relative is higher -> more drag)")
print("Tailwind extends range (v_relative is lower -> less drag)")
print("Downhill shooting extends effective range; uphill reduces it")`,
      challenge: 'Add altitude-dependent air density: rho = 1.225 * exp(-altitude/8500). Simulate launching from 0m, 1000m, and 3000m elevation. How much does range increase at high altitude? This is why Denver is a "hitter\'s park" in baseball.',
      successHint: 'Real ballistics requires accounting for wind, terrain, and atmosphere. Your simulator now handles all three. Military and sports ballistics software uses exactly these models, just with more precise empirical data.',
    },
    {
      title: 'Build an impact damage calculator',
      concept: `Let's build a **damage assessment model** that predicts what happens when a projectile hits a target. This combines everything: kinematics, energy, impulse, pressure, and material properties.

The model considers:
- **Impact velocity** (from trajectory simulation)
- **Contact mechanics**: how the stone deforms on impact, determining contact area over time
- **Stress analysis**: is the pressure above the material's failure threshold?
- **Energy partition**: how much energy goes to deformation, fracture, heat, and rebound

We will use a simplified **Hertzian contact model** for a sphere hitting a flat surface:
- Contact radius: a = sqrt(R * delta) where delta is penetration depth
- Contact area: A = pi * a^2
- Force: F = (4/3) * E_eff * sqrt(R) * delta^(3/2)

where R is the stone radius and E_eff is the effective elastic modulus of the stone-bone system.`,
      analogy: 'Think of pressing a tennis ball against a table. The harder you press, the bigger the flat spot (contact area). A golf ball pressed with the same force has a smaller flat spot because it is stiffer. The contact area during impact determines how force distributes — stiff on stiff (stone on bone) means a tiny contact area and enormous pressure.',
      storyConnection: 'Forensic archaeology can analyze ancient battle injuries from skeletal remains. Depressed skull fractures from sling stones have been found at archaeological sites. The damage pattern — a circular depression matching a stone\'s contact area — confirms the physics we are modeling: concentrated pressure exceeding bone fracture threshold.',
      checkQuestion: 'Why does a bulletproof vest stop a bullet but a direct hit from the same bullet breaks a rib? The vest doesn\'t eliminate the force.',
      checkAnswer: 'The vest spreads the force over a much larger area (reducing pressure below the rib fracture threshold) AND extends the stopping time (reducing peak force via impulse). A bullet has ~1mm^2 contact area; the vest\'s backing plate spreads it to ~100 cm^2 — a factor of 10,000. Even though the total impulse is the same, the pressure drops from bone-shattering to bruise-level.',
      codeIntro: 'Build a Hertzian contact model for stone-on-bone impact.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Material properties
R_stone = 0.01    # stone radius (m)
E_stone = 50e9    # stone elastic modulus (Pa) — granite
E_bone = 15e9     # bone elastic modulus (Pa) — skull
nu = 0.3          # Poisson's ratio (both)

# Effective modulus
E_eff = 1 / ((1-nu**2)/E_stone + (1-nu**2)/E_bone)

m, v_impact = 0.05, 28  # kg, m/s
KE = 0.5 * m * v_impact**2

# Hertzian contact: F = (4/3) E* sqrt(R) delta^(3/2)
# Max penetration from energy balance:
# KE = (8/15) E* sqrt(R) delta_max^(5/2)
delta_max = (15 * KE / (8 * E_eff * np.sqrt(R_stone)))**0.4
a_max = np.sqrt(R_stone * delta_max)  # max contact radius
A_max = np.pi * a_max**2
F_max = (4/3) * E_eff * np.sqrt(R_stone) * delta_max**1.5
P_max = F_max / A_max

print("=== Impact Damage Assessment ===")
print(f"Impact KE: {KE:.1f} J at {v_impact} m/s")
print(f"Max penetration: {delta_max*1000:.2f} mm")
print(f"Max contact radius: {a_max*1000:.2f} mm")
print(f"Peak force: {F_max:.0f} N ({F_max/9.8:.0f} kg-force)")
print(f"Peak pressure: {P_max/1e6:.1f} MPa")
print(f"Skull fracture threshold: ~40-80 MPa")
print(f"Result: {'FRACTURE LIKELY' if P_max/1e6 > 40 else 'No fracture'}")

# Plot force vs penetration
delta = np.linspace(0, delta_max, 200)
F = (4/3) * E_eff * np.sqrt(R_stone) * delta**1.5
a = np.sqrt(R_stone * delta)
P = np.where(a > 0, F / (np.pi * a**2), 0)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
ax1.plot(delta*1000, F, 'gold', linewidth=2.5)
ax1.set_xlabel('Penetration (mm)'); ax1.set_ylabel('Force (N)')
ax1.set_title('Force vs Penetration (Hertzian Contact)')
ax1.grid(alpha=0.3)

ax2.plot(delta*1000, P/1e6, 'red', linewidth=2.5)
ax2.axhline(40, color='white', linestyle='--', alpha=0.5, label='Fracture threshold')
ax2.set_xlabel('Penetration (mm)'); ax2.set_ylabel('Pressure (MPa)')
ax2.set_title('Pressure vs Penetration')
ax2.legend(); ax2.grid(alpha=0.3)

plt.tight_layout(); plt.show()`,
      challenge: 'Compare a smooth round stone (R=1cm) with a pointed flint (model as R=2mm, sharper tip). How does the peak pressure change? What about a lead sling bullet (denser, so higher KE at same speed)?',
      successHint: 'The Hertzian contact model is used in engineering for gear teeth, ball bearings, railway wheels, and crash analysis. You just applied the same industrial-grade model to an ancient weapon.',
    },
    {
      title: 'Model ancient vs modern projectiles',
      concept: `How does David's sling compare to projectiles across history? Let's build a **comparative ballistics database** spanning thousands of years:

- **Sling** (3000 BC): stone, 30 m/s, 50g
- **Longbow** (1300 AD): arrow, 60 m/s, 50g
- **Crossbow** (1400 AD): bolt, 90 m/s, 35g
- **Musket** (1700 AD): ball, 300 m/s, 30g
- **Rifle** (1900 AD): bullet, 700 m/s, 10g
- **Modern rifle** (2000 AD): bullet, 950 m/s, 4g

The trend is clear: projectiles got **lighter and faster** over time. This exploits the v-squared in KE = 1/2 mv^2. A 4-gram bullet at 950 m/s has 1805 J — 80x more energy than David's stone. Technology amplifies velocity, and v^2 amplifies energy.

The code simulates all these projectiles side by side and compares range, impact energy, and flight characteristics.`,
      analogy: 'Think of it as an arms race between spear and shield across millennia. Each new projectile was faster, forcing better armor, which forced even faster projectiles. The sling was surprisingly effective for its era — competitive with early bows. It only became obsolete when crossbows and firearms raised velocities beyond what any sling could achieve.',
      storyConnection: 'David\'s sling was not a toy or a shepherd\'s afterthought. Ancient slingers were elite troops in armies from the Balearic Islands to Rome. A trained slinger could outrange an archer and was feared on ancient battlefields. David\'s weapon was the assault rifle of the Bronze Age.',
      checkQuestion: 'Why did firearms eventually replace bows, even though early muskets were less accurate and slower to reload?',
      checkAnswer: 'Training time. An effective archer required years of training (English longbowmen started training as children). A musketeer could be trained in weeks. Muskets also had higher muzzle energy, could penetrate plate armor that stopped arrows, and were psychologically devastating (loud, smoky, terrifying). Accuracy and rate of fire improved later, but the initial advantage was mass deployment of minimally trained soldiers.',
      codeIntro: 'Compare projectiles across 5000 years of history.',
      code: `import numpy as np
import matplotlib.pyplot as plt

weapons = [
    ("Sling (3000 BC)",    0.050, 30,  0.010, 0.47),
    ("Longbow (1300 AD)",  0.050, 60,  0.005, 0.30),
    ("Crossbow (1400 AD)", 0.035, 90,  0.004, 0.25),
    ("Musket (1700 AD)",   0.030, 300, 0.008, 0.30),
    ("Rifle (1900 AD)",    0.010, 700, 0.004, 0.25),
    ("Modern (2000 AD)",   0.004, 950, 0.003, 0.20),
]

fig, axes = plt.subplots(1, 3, figsize=(15, 5))
names = [w[0] for w in weapons]
KEs = [0.5*w[1]*w[2]**2 for w in weapons]
speeds = [w[2] for w in weapons]
momenta = [w[1]*w[2] for w in weapons]

colors = ['gold', 'green', 'cyan', 'orange', 'red', 'magenta']

axes[0].barh(names, KEs, color=colors)
axes[0].set_xlabel('Kinetic Energy (J)')
axes[0].set_title('Energy (1/2 mv^2)')
for i, ke in enumerate(KEs):
    axes[0].text(ke+5, i, f'{ke:.0f}J', va='center', fontsize=8, color='white')

axes[1].barh(names, speeds, color=colors)
axes[1].set_xlabel('Speed (m/s)')
axes[1].set_title('Muzzle/Release Speed')

axes[2].barh(names, momenta, color=colors)
axes[2].set_xlabel('Momentum (kg*m/s)')
axes[2].set_title('Momentum (mv)')

plt.suptitle('5000 Years of Projectile Evolution', fontsize=14)
plt.tight_layout(); plt.show()

print("Key trend: mass DOWN, speed UP, energy UP")
print(f"Sling energy:   {KEs[0]:.0f} J")
print(f"Modern rifle:   {KEs[-1]:.0f} J")
print(f"Ratio: {KEs[-1]/KEs[0]:.0f}x more energy")
print(f"\\nBut momentum ratio is only {momenta[-1]/momenta[0]:.1f}x")
print("Energy scales as v^2, momentum as v — energy grows faster")`,
      challenge: 'Add trajectory simulations for each weapon. Plot all six trajectories on the same graph. Which weapons are affected most by air resistance? (Hint: lighter, slower projectiles are affected more relative to their energy.)',
      successHint: 'The evolution of projectile weapons is a story of exploiting v-squared. Each generation found ways to launch projectiles faster, and the quadratic energy scaling rewarded speed over mass. Physics drove military history.',
    },
    {
      title: 'Optimize launch parameters',
      concept: `Given a specific target (distance, height), what are the **optimal** launch parameters? This is an **optimization problem** — find the combination of angle, speed, and sling length that maximizes some objective (e.g., impact energy) while satisfying constraints (must hit the target).

We will use a **grid search**: try many combinations and pick the best. This is brute-force but effective and easy to understand. More sophisticated methods (gradient descent, genetic algorithms) exist for harder problems.

The optimization considers:
- **Angle**: must be correct to hit the target
- **Speed**: higher is better for impact, but limited by sling physics
- **Sling length**: longer = faster release but harder to control
- **Stone mass**: heavier = more momentum but slower to spin up

The tradeoffs create a multi-dimensional optimization landscape. The code searches this landscape and visualizes the optimal region.`,
      analogy: 'Imagine tuning a guitar by trying every possible combination of string tension. With 6 strings and 100 tension levels each, that is 100^6 = one trillion combinations. Grid search tries a representative sample. Real optimization narrows down the search by following the gradient toward "better" — like tuning each string individually while listening for harmony.',
      storyConnection: 'David optimized intuitively: he chose smooth stones (less drag), used a well-practiced sling length, and selected a low angle for speed and accuracy. His years of practice effectively "searched" the parameter space through trial and error. Our code does in seconds what David learned over years of shepherding.',
      checkQuestion: 'If you can change only ONE parameter to maximize impact energy at 25 meters, which should you change: stone mass, launch speed, or launch angle?',
      checkAnswer: 'Launch speed. Impact energy scales as v^2, so increasing speed has the strongest effect. Doubling speed quadruples energy. Doubling mass only doubles energy. Angle matters for hitting the target but does not change the total energy (just the direction). A 10% increase in speed gives more energy than a 10% increase in mass.',
      codeIntro: 'Grid search for optimal sling parameters to hit a target.',
      code: `import numpy as np
import matplotlib.pyplot as plt

target_x, target_y = 25, 2.7  # Goliath's forehead
g, rho, Cd = 9.8, 1.2, 0.47

def simulate_hit(m, v0, angle, L_sling, h0=1.5):
    A = np.pi * (0.01)**2
    vx = v0 * np.cos(np.radians(angle))
    vy = v0 * np.sin(np.radians(angle))
    x, y, dt = 0, h0, 0.001
    for _ in range(20000):
        v = np.sqrt(vx**2 + vy**2)
        Fd = 0.5*rho*v**2*Cd*A/m
        vx -= Fd*vx/v*dt; vy -= (g+Fd*vy/v)*dt
        x += vx*dt; y += vy*dt
        if x >= target_x:
            hit_error = abs(y - target_y)
            v_imp = np.sqrt(vx**2 + vy**2)
            KE = 0.5 * m * v_imp**2
            return hit_error, KE, v_imp
        if y < 0: break
    return 999, 0, 0  # miss

# Search over angles and speeds
angles = np.arange(5, 45, 1)
speeds = np.arange(20, 45, 1)
best = {'KE': 0, 'angle': 0, 'speed': 0, 'error': 999}
results = np.zeros((len(angles), len(speeds)))

for i, a in enumerate(angles):
    for j, v in enumerate(speeds):
        err, ke, v_imp = simulate_hit(0.05, v, a, 0.8)
        if err < 0.3:  # within 30cm of target
            results[i, j] = ke
            if ke > best['KE']:
                best = {'KE': ke, 'angle': a, 'speed': v,
                        'error': err, 'v_imp': v_imp}

plt.figure(figsize=(10, 6))
plt.imshow(results, extent=[speeds[0], speeds[-1], angles[-1], angles[0]],
           aspect='auto', cmap='hot', interpolation='bilinear')
plt.colorbar(label='Impact KE (J)')
plt.plot(best['speed'], best['angle'], 'c*', markersize=20,
         label=f"Best: {best['angle']}deg, {best['speed']}m/s")
plt.xlabel('Launch Speed (m/s)', fontsize=12)
plt.ylabel('Launch Angle (deg)', fontsize=12)
plt.title(f'Optimization: Max Impact Energy at ({target_x}m, {target_y}m)')
plt.legend(fontsize=11); plt.show()

print(f"Optimal: angle={best['angle']}deg, speed={best['speed']}m/s")
print(f"Impact KE: {best['KE']:.1f} J, Impact speed: {best.get('v_imp',0):.1f} m/s")`,
      challenge: 'Add stone mass to the optimization (search over 0.02-0.10 kg). Heavier stones have more energy but more drag. Also add sling length (0.5-1.5m) — longer slings give more speed but reduce angular velocity (assume torque is fixed). Find the globally optimal combination.',
      successHint: 'Grid search optimization is the brute-force foundation of all optimization. You can see the "landscape" of solutions and understand why certain parameters matter more than others. This approach scales to any physics or engineering problem.',
    },
    {
      title: 'Capstone: Complete ballistics lab',
      concept: `This is your capstone project: a **complete ballistics laboratory** that brings together every concept from all four levels.

Your lab will:
1. Model the kinetic chain (arm + sling spin-up)
2. Simulate the trajectory with full physics (drag, wind, terrain)
3. Analyze the impact (Hertzian contact, energy partition)
4. Compare with historical weapons
5. Optimize for a given scenario

The code below is a complete analysis pipeline. It takes scenario parameters and produces a full report with visualizations. This is the kind of analysis tool that a physics researcher, forensic archaeologist, or game developer would build.

Run it, study the output, and then modify it to answer your own questions about projectile physics.`,
      analogy: 'This capstone is like building a complete weather station vs. just reading a thermometer. A thermometer tells you temperature. A weather station measures temperature, humidity, pressure, wind, and UV, processes them together, and produces forecasts. Your ballistics lab measures, simulates, analyzes, and optimizes — a complete scientific instrument built in code.',
      storyConnection: 'From David\'s first stone to this capstone: you started with F = ma and built up to a full physics engine. The story of David and Goliath is a story about physics winning against size. Your lab proves it quantitatively: a 50-gram stone at 30 m/s generates enough force and pressure to fell a giant. The physics is decisive.',
      checkQuestion: 'If you were a forensic archaeologist who found a skull with a circular depressed fracture, how would you use this lab to estimate the weapon that caused it?',
      checkAnswer: 'Measure the fracture diameter (gives contact area), fracture depth (gives penetration/energy), and fracture shape (round = sling stone, elongated = arrow/sword). Input the bone properties and fracture dimensions into the Hertzian model to back-calculate impact energy. Compare with the weapons database to identify which weapon matches. This is real forensic biomechanics — your lab does exactly this analysis.',
      codeIntro: 'Complete ballistics lab: scenario analysis pipeline.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# === SCENARIO: David vs Goliath ===
config = {
    'stone_mass': 0.05, 'stone_radius': 0.01,
    'sling_length': 0.8, 'spin_torque': 4.0, 'spin_time': 0.8,
    'launch_angle': 15, 'launch_height': 1.5,
    'target_x': 25, 'target_y': 2.7,
    'wind': 0, 'Cd': 0.47
}

c = config; g = 9.8; rho = 1.2
A = np.pi * c['stone_radius']**2

# Phase 1: Spin-up
I = c['stone_mass'] * c['sling_length']**2
omega = c['spin_torque'] / I * c['spin_time']
v0 = omega * c['sling_length']

# Phase 2: Flight
vx = v0 * np.cos(np.radians(c['launch_angle']))
vy = v0 * np.sin(np.radians(c['launch_angle']))
x, y, dt = 0, c['launch_height'], 0.0005
xs, ys, ts, vs = [0], [y], [0], [v0]
t = 0
while y >= 0 and x < 150:
    v = np.sqrt(vx**2 + vy**2)
    Fd = 0.5*rho*v**2*c['Cd']*A/c['stone_mass']
    vx -= Fd*(vx-c['wind'])/v*dt; vy -= (g+Fd*vy/v)*dt
    x += vx*dt; y += vy*dt; t += dt
    xs.append(x); ys.append(y); ts.append(t); vs.append(v)

v_imp = vs[-1]

# Phase 3: Impact
F_impact = c['stone_mass'] * v_imp / 0.001
P_impact = F_impact / (np.pi * (0.005)**2) / 1e6
KE_impact = 0.5 * c['stone_mass'] * v_imp**2

# Phase 4: Report
fig, axes = plt.subplots(2, 2, figsize=(12, 9))

axes[0,0].plot(xs, ys, 'gold', linewidth=2.5)
axes[0,0].plot(c['target_x'], c['target_y'], 'r*', markersize=15)
axes[0,0].set_title('Trajectory'); axes[0,0].set_xlabel('x (m)')
axes[0,0].set_ylabel('y (m)'); axes[0,0].grid(alpha=0.3); axes[0,0].set_ylim(0)

axes[0,1].plot(ts, vs, 'cyan', linewidth=2)
axes[0,1].set_title('Speed vs Time'); axes[0,1].set_xlabel('t (s)')
axes[0,1].set_ylabel('Speed (m/s)'); axes[0,1].grid(alpha=0.3)

KE_arr = [0.5*c['stone_mass']*v**2 for v in vs]
PE_arr = [c['stone_mass']*g*y for y in ys]
axes[1,0].stackplot(ts, KE_arr, PE_arr, colors=['red','blue'], alpha=0.6,
                    labels=['KE','PE'])
axes[1,0].set_title('Energy Budget'); axes[1,0].set_xlabel('t (s)')
axes[1,0].set_ylabel('Energy (J)'); axes[1,0].legend(); axes[1,0].grid(alpha=0.3)

labels = ['Force (N)', 'Pressure (MPa)', 'Energy (J)']
values = [F_impact, P_impact, KE_impact]
colors_bar = ['red', 'orange', 'gold']
axes[1,1].bar(labels, values, color=colors_bar)
axes[1,1].set_title('Impact Analysis'); axes[1,1].grid(axis='y', alpha=0.3)
for i, v in enumerate(values):
    axes[1,1].text(i, v+0.5, f'{v:.1f}', ha='center', color='white', fontsize=10)

plt.suptitle('BALLISTICS LAB: David vs Goliath', fontsize=15, fontweight='bold')
plt.tight_layout(); plt.show()

print(f"Release: {v0:.1f} m/s | Impact: {v_imp:.1f} m/s")
print(f"Flight: {ts[-1]:.3f}s | Range: {xs[-1]:.1f}m")
print(f"Force: {F_impact:.0f}N | Pressure: {P_impact:.1f}MPa | KE: {KE_impact:.1f}J")
verdict = "LETHAL" if P_impact > 40 else "NON-LETHAL"
print(f"\\nVERDICT: {verdict} — {'exceeds' if P_impact>40 else 'below'} skull fracture threshold")`,
      challenge: 'Modify the config to test: (1) a Balearic slinger with a longer sling (1.2m) and heavier stone (80g), (2) a Roman lead sling bullet (30g, denser so smaller radius=0.007m), (3) a child with a short sling (0.4m) and weaker torque (2.0). Which is most effective? Build a comparison table.',
      successHint: 'You built a complete physics laboratory in code. From F = ma to Hertzian contact theory, from Euler integration to optimization — this capstone demonstrates that a story about a shepherd boy and a giant is, at its core, a story about physics.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Capstone: Build a Complete Ballistics Lab</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These capstone exercises build a full ballistics simulation engine. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cpu className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L4-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint}
            diagram={[NewtonForceDiagram, WorkForceDiagram, EnergyBarChartDiagram, SlopeInterceptDiagram, SineWaveDiagram, DistanceFormulaDiagram][i] ? createElement([NewtonForceDiagram, WorkForceDiagram, EnergyBarChartDiagram, SlopeInterceptDiagram, SineWaveDiagram, DistanceFormulaDiagram][i]) : undefined}
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
