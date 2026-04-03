import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function KiteFestivalLevel2() {
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState('');

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true); setLoadProgress('Loading Python...');
    try {
      if (!(window as any).loadPyodide) { const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js'; document.head.appendChild(s); await new Promise<void>((r, j) => { s.onload = () => r(); s.onerror = () => j(new Error('Failed')); }); }
      setLoadProgress('Starting Python...'); const py = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      setLoadProgress('Installing packages...'); await py.loadPackage('micropip'); const mp = py.pyimport('micropip');
      for (const p of ['numpy', 'matplotlib']) { try { await mp.install(p); } catch { await py.loadPackage(p).catch(() => {}); } }
      await py.runPythonAsync(`import sys,io\nclass OC:\n def __init__(self):self.o=[]\n def write(self,t):self.o.append(t)\n def flush(self):pass\n def get_output(self):return''.join(self.o)\n def clear(self):self.o=[]\n_stdout_capture=OC();sys.stdout=_stdout_capture;sys.stderr=_stdout_capture\nimport matplotlib;matplotlib.use('AGG');import warnings;warnings.filterwarnings('ignore',category=UserWarning);import matplotlib.pyplot as plt;import base64\ndef _get_plot_as_base64():\n buf=io.BytesIO();plt.savefig(buf,format='png',dpi=100,bbox_inches='tight',facecolor='#1f2937',edgecolor='none');buf.seek(0);s=base64.b64encode(buf.read()).decode('utf-8');plt.close('all');return s`);
      pyodideRef.current = py; setPyReady(true); setLoading(false); setLoadProgress(''); return py;
    } catch (e: any) { setLoading(false); setLoadProgress('Error: ' + e.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Airfoil design — engineering the shape of lift',
      concept: `An **airfoil** is the cross-sectional shape of a wing. Its geometry determines how efficiently it generates lift and how much drag it creates.

Key geometric parameters:
- **Chord length** (c): distance from leading to trailing edge
- **Maximum camber**: height of the mean camber line above the chord. More camber = more lift at low speed, but more drag.
- **Camber position**: where max camber occurs. Forward camber = early pressure peak, gentler stall.
- **Thickness-to-chord ratio** (t/c): typically 6-18%. Thinner = less drag, less structural strength.

**NACA series**:
- **4-digit** (e.g., 2412): simple, well-understood. 1st digit = max camber %, 2nd = position/10, 3rd-4th = thickness %.
- **5-digit** (e.g., 23015): designed for specific lift coefficients. Better performance but more complex.
- **6-series** (e.g., 63-215): laminar flow airfoils. Maintain smooth flow over more of the surface, dramatically reducing drag.

Modern airfoils are designed computationally using **panel methods** and **CFD** (computational fluid dynamics). The designer specifies desired lift, drag, and stall characteristics, and optimization algorithms find the shape.

The lift coefficient of an airfoil: **Cₗ ≈ 2π(α + α₀)** for thin airfoils, where α is angle of attack and α₀ is the zero-lift angle (related to camber). This elegant result from thin airfoil theory agrees remarkably well with experiments up to near stall.`,
      analogy: 'Designing an airfoil is like tuning a musical instrument. The chord length is the string length (determines the fundamental). Camber is the string tension (determines the pitch/lift). Thickness is the string material (determines tone/structural strength). Small changes in any parameter change the entire performance envelope — just as small tuning adjustments change the sound.',
      storyConnection: 'The bamboo spine and paper surface of a Guwahati festival kite create a crude airfoil when the wind bows the surface. A fighter kite\'s flyer adjusts this curvature by controlling string tension — effectively redesigning the airfoil in real-time. Modern aircraft do the same with flaps and slats: reconfigurable airfoils for different flight phases.',
      checkQuestion: 'A laminar flow airfoil (NACA 6-series) has lower drag than a conventional airfoil. Why aren\'t all wings laminar flow?',
      checkAnswer: 'Laminar flow is fragile. Any surface roughness (bugs, rain, ice, scratches) or turbulence in the incoming air trips the flow from laminar to turbulent, destroying the drag advantage. Laminar airfoils work beautifully in clean conditions (high-altitude cruise) but lose their advantage in dirty conditions (takeoff, rain, icing). Most commercial aircraft use airfoils that work well in turbulent conditions rather than optimizing for laminar flow.',
      codeIntro: 'Generate and analyze NACA airfoil shapes with thin airfoil theory.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def naca4(code, n=150):
    m = int(code[0])/100; p = int(code[1])/10; t = int(code[2:])/100
    x = (1-np.cos(np.linspace(0,np.pi,n)))/2
    yt = 5*t*(0.2969*np.sqrt(x)-0.1260*x-0.3516*x**2+0.2843*x**3-0.1015*x**4)
    if m == 0: yc = np.zeros_like(x)
    else: yc = np.where(x<p, m/p**2*(2*p*x-x**2), m/(1-p)**2*(1-2*p+2*p*x-x**2))
    dyc = np.gradient(yc, x)
    theta = np.arctan(dyc)
    xu, yu = x-yt*np.sin(theta), yc+yt*np.cos(theta)
    xl, yl = x+yt*np.sin(theta), yc-yt*np.cos(theta)
    return xu, yu, xl, yl

fig, axes = plt.subplots(2, 2, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

# --- Airfoil gallery ---
ax = axes[0, 0]; ax.set_facecolor('#111827')
foils = [('0012','Symmetric',0), ('2412','Standard',-0.25), ('4412','High camber',-0.5), ('2418','Thick',-0.75)]
for code, name, offset in foils:
    xu,yu,xl,yl = naca4(code)
    x_all = np.concatenate([xu, xl[::-1]])
    y_all = np.concatenate([yu, yl[::-1]]) + offset
    ax.fill(x_all, y_all, alpha=0.3); ax.plot(x_all, y_all, linewidth=1.5)
    ax.text(-0.12, offset, f'NACA {code}\n{name}', color='white', fontsize=7, va='center')
ax.set_xlim(-0.15,1.1); ax.set_aspect('equal')
ax.set_title('NACA Airfoil Gallery', color='white', fontsize=11)
ax.set_xticks([]); ax.set_yticks([])

# --- Thin airfoil theory: Cl vs AoA for different camber ---
ax = axes[0, 1]; ax.set_facecolor('#111827')
aoa = np.linspace(-5, 15, 100)
for camber, name, c in [(0,'0%','#3b82f6'),(2,'2%','#22c55e'),(4,'4%','#f59e0b'),(6,'6%','#ef4444')]:
    alpha0 = -camber * 0.9  # zero-lift angle
    Cl = 2*np.pi*(np.radians(aoa) - np.radians(alpha0))
    Cl_stall = np.where(aoa < 14, Cl, Cl[aoa==14][0] if (aoa==14).any() else Cl[-1])
    ax.plot(aoa, Cl, color=c, linewidth=2, label=f'{camber}% camber')
ax.axhline(0, color='gray', linewidth=0.5, alpha=0.3)
ax.axvline(0, color='gray', linewidth=0.5, alpha=0.3)
ax.set_xlabel('Angle of attack (°)', color='white')
ax.set_ylabel('Lift coefficient Cₗ', color='white')
ax.set_title('Thin Airfoil Theory: Cl = 2π(α - α₀)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# --- Pressure coefficient distribution ---
ax = axes[1, 0]; ax.set_facecolor('#111827')
x_c = np.linspace(0.01, 0.99, 100)
# Approximate Cp for NACA 2412 at 5° AoA
Cp_upper = -3*(1-x_c)*np.exp(-3*x_c) - 0.5  # suction
Cp_lower = 0.3*(1-x_c)**0.5  # pressure
ax.plot(x_c, -Cp_upper, color='#3b82f6', linewidth=2, label='Upper surface')
ax.plot(x_c, -Cp_lower, color='#ef4444', linewidth=2, label='Lower surface')
ax.fill_between(x_c, -Cp_upper, -Cp_lower, alpha=0.15, color='#22c55e')
ax.axhline(0, color='gray', linewidth=0.5, alpha=0.3)
ax.invert_yaxis()
ax.set_xlabel('Chord position (x/c)', color='white')
ax.set_ylabel('-Cp (pressure coefficient)', color='white')
ax.set_title('Pressure Distribution (NACA 2412, α=5°)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')
ax.text(0.4, -1.5, 'Area between curves\n= Lift per unit span', color='#22c55e', fontsize=9, ha='center')

# --- Effect of thickness on drag ---
ax = axes[1, 1]; ax.set_facecolor('#111827')
thickness = np.linspace(4, 24, 100)
# Profile drag ~ t/c for turbulent flow
Cd_profile = 0.003 + 0.0015 * thickness
# Structural weight benefit of thickness
weight_penalty = 1 + 0.5 * np.exp(-thickness/8)
# Net merit
merit = 1 / (Cd_profile * weight_penalty)
merit /= merit.max()

ax.plot(thickness, Cd_profile*100, color='#ef4444', linewidth=2, label='Profile drag (×100)')
ax.plot(thickness, weight_penalty/weight_penalty.max(), color='#3b82f6', linewidth=2, label='Weight factor (norm.)')
ax.plot(thickness, merit, color='#22c55e', linewidth=2, linestyle='--', label='Net merit (norm.)')

opt_t = thickness[np.argmax(merit)]
ax.axvline(opt_t, color='gray', linestyle=':', alpha=0.3)
ax.text(opt_t+0.5, 0.5, f'Optimum\n~{opt_t:.0f}%', color='gray', fontsize=9)

ax.set_xlabel('Thickness (% chord)', color='white')
ax.set_ylabel('Value', color='white')
ax.set_title('Thickness Trade-off: Drag vs Structure', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Airfoil design summary:")
print("  Thin airfoil theory: Cl = 2π(α - α₀)")
print("  More camber → more lift at zero AoA, but more drag")
print("  More thickness → more drag, but stronger structure")
print("  Optimal design balances all trade-offs for the specific mission")`,
      challenge: 'Design an airfoil for a solar-powered drone that must fly slowly at high altitude (thin air): high Cl at low speed, low drag, moderate thickness for solar cells. What NACA code would you choose?',
      successHint: 'Airfoil design is one of the most refined arts in engineering. A fraction of a percent change in camber can mean the difference between a successful and failed design. Modern airfoils are shaped by computers but understood through the elegant simplicity of thin airfoil theory.',
    },
    {
      title: 'Reynolds number — why scale matters in aerodynamics',
      concept: `A kite and a Boeing 747 both fly, but the airflow around them behaves very differently. The **Reynolds number** (Re) captures this difference:

**Re = ρvL/μ**

Where ρ = air density, v = airspeed, L = characteristic length (chord), μ = viscosity.

Re tells you the ratio of inertial forces to viscous forces:
- **Low Re** (< 10⁴): viscous forces dominate. Thick, laminar boundary layers. Flow is smooth. Insects, small kites.
- **Medium Re** (10⁴-10⁶): transition zone. Both laminar and turbulent regions. Birds, model aircraft, festival kites.
- **High Re** (> 10⁶): inertial forces dominate. Thin, turbulent boundary layers. Aircraft, ships.

Why this matters: **aerodynamic coefficients (Cₗ, Cd) change with Reynolds number.** A kite design that works at Re = 100,000 will NOT work at Re = 10,000,000 (and vice versa). This is why you can't just scale up a model airplane and expect it to fly — the Reynolds number changes, the flow regime changes, and the performance changes.

Typical Reynolds numbers:
- Dust particle falling: Re ~ 0.1
- Butterfly: Re ~ 5,000
- Kite: Re ~ 100,000
- Bird: Re ~ 200,000
- Small aircraft: Re ~ 3,000,000
- Boeing 747: Re ~ 300,000,000`,
      analogy: 'Reynolds number is like the difference between walking through water (low Re: viscous forces dominate, everything is slow and smooth) and walking through air (high Re: inertial forces dominate, you can move freely). At low Re, air feels "thick" to tiny insects. At high Re, air feels "thin" to airplanes. Same fluid, different experience based on size and speed.',
      storyConnection: 'A festival kite in Guwahati operates at Re ~ 100,000. At this Reynolds number, the boundary layer is mostly laminar, and small changes in angle of attack have dramatic effects (which is why kites are twitchy). A Boeing flying over Guwahati at Re ~ 300,000,000 has a fully turbulent boundary layer — more stable but requiring much more power. Same air, completely different physics.',
      checkQuestion: 'Why can\'t you just build a 10× larger model airplane and expect it to fly the same way?',
      checkAnswer: 'Scaling up 10× increases the characteristic length L by 10×. At the same airspeed, Re increases 10×. The flow transitions from laminar to turbulent, drag coefficients change, stall characteristics change, and the airfoil that worked at small Re may not work at large Re. To maintain the same Re when scaling up, you\'d need to reduce airspeed by 10× — but then you might not have enough lift. This is called the "scale effect" and it\'s why wind tunnel testing must carefully match Reynolds numbers.',
      codeIntro: 'Calculate Reynolds numbers and show how flow characteristics change with scale.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 2, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

# --- Reynolds number scale ---
ax = axes[0, 0]; ax.set_facecolor('#111827')
objects = ['Dust particle', 'Fruit fly', 'Butterfly', 'Hummingbird',
           'Festival kite', 'Hawk', 'Cessna 172', 'Boeing 747', 'Blue whale']
Re_values = [0.1, 100, 5000, 15000, 100000, 300000, 3e6, 3e8, 3e8]
colors_obj = ['#9ca3af','#22c55e','#f59e0b','#ef4444','#a855f7',
              '#3b82f6','#06b6d4','#fbbf24','#22c55e']

ax.barh(range(len(objects)), np.log10(Re_values), color=colors_obj, height=0.6)
ax.set_yticks(range(len(objects)))
ax.set_yticklabels(objects, color='white', fontsize=8)
ax.set_xlabel('log₁₀(Reynolds number)', color='white')
ax.set_title('Reynolds Number Scale', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Flow regime boundaries
ax.axvline(np.log10(2000), color='#f59e0b', linewidth=1.5, linestyle='--', alpha=0.5)
ax.axvline(np.log10(5e5), color='#ef4444', linewidth=1.5, linestyle='--', alpha=0.5)
ax.text(np.log10(500), -0.5, 'Laminar', color='#22c55e', fontsize=7)
ax.text(np.log10(50000), -0.5, 'Transition', color='#f59e0b', fontsize=7)
ax.text(np.log10(5e6), -0.5, 'Turbulent', color='#ef4444', fontsize=7)

# --- Cl vs AoA at different Re ---
ax = axes[0, 1]; ax.set_facecolor('#111827')
aoa = np.linspace(-5, 20, 100)
for Re, label, c in [(1e4, 'Re=10⁴ (insect)', '#22c55e'),
                       (1e5, 'Re=10⁵ (kite)', '#f59e0b'),
                       (1e6, 'Re=10⁶ (bird)', '#3b82f6'),
                       (1e7, 'Re=10⁷ (plane)', '#ef4444')]:
    # Stall angle increases with Re
    stall = 10 + 2*np.log10(Re/1e4)
    Cl_max = 0.8 + 0.15*np.log10(Re/1e4)
    Cl = np.where(aoa < stall, Cl_max/stall * aoa, Cl_max - 0.2*(aoa-stall)**1.5)
    ax.plot(aoa, Cl, color=c, linewidth=2, label=label)

ax.set_xlabel('Angle of attack (°)', color='white')
ax.set_ylabel('Lift coefficient', color='white')
ax.set_title('Cl vs AoA at Different Reynolds Numbers', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='gray')
ax.axhline(0, color='gray', linewidth=0.5, alpha=0.3)

# --- Drag coefficient vs Re ---
ax = axes[1, 0]; ax.set_facecolor('#111827')
Re_range = np.logspace(1, 8, 200)
# Cd for a sphere
Cd_sphere = np.where(Re_range < 1, 24/Re_range,
            np.where(Re_range < 1000, 24/Re_range * (1 + 0.15*Re_range**0.687),
            np.where(Re_range < 3e5, 0.44,
            0.1)))  # drag crisis

ax.loglog(Re_range, Cd_sphere, color='#3b82f6', linewidth=2.5, label='Sphere')

# Cd for flat plate (skin friction)
Cd_plate_lam = 1.328 / np.sqrt(Re_range)
Cd_plate_turb = 0.074 / Re_range**0.2
Cd_plate = np.minimum(Cd_plate_lam, Cd_plate_turb)
ax.loglog(Re_range, Cd_plate, color='#22c55e', linewidth=2.5, label='Flat plate (friction)')

# Drag crisis annotation
ax.annotate('Drag crisis!\nFlow transitions', xy=(3e5, 0.1), xytext=(3e6, 0.3),
            color='#ef4444', fontsize=8, arrowprops=dict(arrowstyle='->', color='#ef4444'))

ax.set_xlabel('Reynolds number', color='white')
ax.set_ylabel('Drag coefficient Cd', color='white')
ax.set_title('Drag Coefficient vs Reynolds Number', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# --- Boundary layer visualization ---
ax = axes[1, 1]; ax.set_facecolor('#111827')
x = np.linspace(0, 1, 100)
# Laminar BL thickness ~ x^0.5
bl_lam = 0.15 * np.sqrt(x)
# Turbulent BL thickness ~ x^0.8
bl_turb = 0.05 * x**0.8

# Transition at x = 0.4
bl_combined = np.where(x < 0.4, bl_lam, 0.05 * x**0.8 + 0.03)

ax.fill_between(x, 0, bl_combined, alpha=0.2, color='#3b82f6')
ax.fill_between(x, 0, -bl_combined, alpha=0.2, color='#3b82f6')
ax.plot(x, bl_combined, color='#22c55e', linewidth=2, label='Laminar→Turbulent')
ax.plot(x, -bl_combined, color='#22c55e', linewidth=2)
ax.plot(x, bl_lam, color='#3b82f6', linewidth=1.5, linestyle='--', label='Fully laminar')
ax.plot(x, -bl_lam, color='#3b82f6', linewidth=1.5, linestyle='--')

ax.axvline(0.4, color='#ef4444', linewidth=1.5, linestyle='--')
ax.text(0.42, 0.12, 'Transition', color='#ef4444', fontsize=9)
ax.axhline(0, color='white', linewidth=1)  # Surface

ax.set_xlabel('Position along surface (x/c)', color='white')
ax.set_ylabel('Boundary layer thickness', color='white')
ax.set_title('Boundary Layer Growth', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Reynolds number: Re = ρvL/μ")
print("  Low Re (< 10⁴): laminar, viscous (insects)")
print("  Medium Re (10⁴-10⁶): transition (kites, birds)")
print("  High Re (> 10⁶): turbulent (aircraft)")
print()
print("Scale effect: same shape at different Re = different performance")
print("This is why model testing must match Re, not just shape.")`,
      challenge: 'A golf ball has dimples that trip the boundary layer from laminar to turbulent. This actually REDUCES drag. Calculate Re for a golf ball (d=4.3cm, v=70m/s, ρ=1.225, μ=1.8e-5) and explain why turbulent BL reduces drag on a sphere.',
      successHint: 'Reynolds number is the most important dimensionless number in fluid mechanics. It determines whether flow is laminar or turbulent, and therefore controls drag, lift, stall, and every other aerodynamic property. Matching Re is the key to valid wind tunnel testing and computational simulation.',
    },
    {
      title: 'Wind tunnel testing — simulating flight on the ground',
      concept: `A **wind tunnel** creates controlled airflow to test aerodynamic designs without building full-scale prototypes. The principle: it doesn\'t matter if the object moves through air or air moves past the object — the physics is identical (Galilean relativity).

**Types of wind tunnels**:
- **Subsonic** (< Mach 0.8): most common. Used for cars, buildings, kites, low-speed aircraft.
- **Transonic** (Mach 0.8-1.2): for jet airliners cruising near the speed of sound.
- **Supersonic** (Mach 1.2-5): for fighter jets and missiles.
- **Hypersonic** (> Mach 5): for reentry vehicles and scramjets.

**What is measured**:
- **Force balance**: measures lift, drag, and side forces directly using strain gauges
- **Pressure taps**: tiny holes on the model surface connected to pressure sensors
- **Flow visualization**: smoke, tufts (short threads), oil flow, schlieren photography (for shock waves)
- **PIV** (Particle Image Velocimetry): laser illuminates tracer particles, camera tracks their movement → full velocity field

**Challenges**:
- Reynolds number matching: a 1/10 scale model has 1/10 the Re. Solutions: pressurize the tunnel, use cryogenic air (denser), or run at higher speed.
- Wall effects: tunnel walls constrain flow, affecting results. Corrections required.
- Model fidelity: surface roughness, gaps, and deformations affect results.`,
      analogy: 'A wind tunnel is like a treadmill for airplanes. On a treadmill, you run in place while the belt moves under you. In a wind tunnel, the model sits still while air moves past it. The physics of running is the same whether you move through still air or air moves past you. The advantage: you can instrument the "runner" (model) with sensors because it is not moving.',
      storyConnection: 'If you wanted to optimize a kite for the Guwahati festival — maximum altitude, best stability in gusty Brahmaputra winds — you would test it in a small wind tunnel. Smoke visualization would show the flow separation at high angles of attack. A force balance would measure lift and drag at different wind speeds. The festival champion would have the best-tested kite.',
      checkQuestion: 'The Wright brothers built a small wind tunnel in 1901 and tested over 200 wing shapes. Why was this more valuable than their flight tests?',
      checkAnswer: 'Systematic testing. In flight, wind speed, direction, and turbulence all vary — you can\'t isolate variables. In the wind tunnel, they controlled wind speed precisely and tested one shape at a time. They could compare 200 wings under identical conditions in weeks, which would take years of flight tests. Their wind tunnel data corrected errors in published lift tables (by Lilienthal and Langley), giving them accurate data that others lacked. The wind tunnel, not the engine, was their key breakthrough.',
      codeIntro: 'Simulate wind tunnel measurements: lift and drag at various angles and speeds.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 2, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

# --- Wind tunnel force measurement simulation ---
ax = axes[0, 0]; ax.set_facecolor('#111827')
aoa_test = np.arange(-4, 20, 2)  # tested angles
np.random.seed(42)

# "Measured" data with noise
Cl_true = np.where(aoa_test < 14, 0.1*aoa_test + 0.2, 1.6 - 0.1*(aoa_test-14)**1.5)
Cd_true = 0.02 + 0.005*aoa_test**2 + np.where(aoa_test > 14, 0.03*(aoa_test-14)**2, 0)

Cl_measured = Cl_true + 0.03*np.random.randn(len(aoa_test))
Cd_measured = np.abs(Cd_true + 0.005*np.random.randn(len(aoa_test)))

ax.errorbar(aoa_test, Cl_measured, yerr=0.05, fmt='o-', color='#22c55e',
            linewidth=1.5, markersize=6, capsize=3, label='Measured Cl')
ax.errorbar(aoa_test, Cd_measured, yerr=0.01, fmt='s-', color='#ef4444',
            linewidth=1.5, markersize=6, capsize=3, label='Measured Cd')

aoa_fine = np.linspace(-4, 19, 100)
Cl_fit = np.where(aoa_fine < 14, 0.1*aoa_fine + 0.2, 1.6 - 0.1*(aoa_fine-14)**1.5)
ax.plot(aoa_fine, Cl_fit, color='#22c55e', linewidth=1, linestyle='--', alpha=0.5)

ax.set_xlabel('Angle of attack (°)', color='white')
ax.set_ylabel('Coefficient', color='white')
ax.set_title('Wind Tunnel Data (with measurement error)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# --- Drag polar from wind tunnel ---
ax = axes[0, 1]; ax.set_facecolor('#111827')
ax.plot(Cd_measured, Cl_measured, 'o-', color='#a855f7', linewidth=2, markersize=6)
# Parabolic fit: Cd = Cd0 + Cl²/(π*e*AR)
Cd0 = 0.02; e = 0.8; AR = 6
Cl_fit_range = np.linspace(-0.2, 1.6, 100)
Cd_fit_range = Cd0 + Cl_fit_range**2 / (np.pi * e * AR)
ax.plot(Cd_fit_range, Cl_fit_range, '--', color='gray', linewidth=1, label='Parabolic fit')

# Best L/D tangent
LD = Cl_fit_range / Cd_fit_range
best_idx = np.argmax(LD[Cl_fit_range > 0])
ax.plot([0, Cd_fit_range[Cl_fit_range > 0][best_idx]*2],
        [0, Cl_fit_range[Cl_fit_range > 0][best_idx]*2], ':', color='#f59e0b', linewidth=1.5)
ax.text(0.05, 1.0, f'Best L/D = {LD[Cl_fit_range > 0].max():.1f}', color='#f59e0b', fontsize=9)

ax.set_xlabel('Drag coefficient Cd', color='white')
ax.set_ylabel('Lift coefficient Cl', color='white')
ax.set_title('Drag Polar', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# --- Reynolds number effect on results ---
ax = axes[1, 0]; ax.set_facecolor('#111827')
Re_tests = [5e4, 1e5, 3e5, 1e6]
for Re in Re_tests:
    stall_angle = 10 + 2*np.log10(Re/5e4)
    Cl_max = 0.8 + 0.2*np.log10(Re/5e4)
    aoa_r = np.linspace(-2, 18, 100)
    Cl_r = np.where(aoa_r < stall_angle, Cl_max/stall_angle*aoa_r, Cl_max-0.15*(aoa_r-stall_angle)**1.5)
    ax.plot(aoa_r, Cl_r, linewidth=2, label=f'Re = {Re:.0e}')

ax.set_xlabel('Angle of attack (°)', color='white')
ax.set_ylabel('Lift coefficient', color='white')
ax.set_title('Re Effect: Same Airfoil, Different Re', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# --- Flow visualization simulation ---
ax = axes[1, 1]; ax.set_facecolor('#111827')
# Smoke lines around an airfoil at high AoA (showing separation)
xu, yu, xl, yl = naca4('2412') if 'naca4' in dir() else ([0,0.5,1],[0.06,0.08,0],[0,0.5,1],[0,-0.02,0])
# Redefine simple
x_af = np.linspace(0, 1, 50)
y_upper = 0.12 * (0.2969*np.sqrt(x_af) - 0.126*x_af - 0.3516*x_af**2 + 0.2843*x_af**3 - 0.1015*x_af**4)
y_lower = -y_upper * 0.3

# Draw airfoil at 12° AoA
rad = np.radians(12)
x_rot = x_af*np.cos(rad) - y_upper*np.sin(rad)
y_rot = x_af*np.sin(rad) + y_upper*np.cos(rad)
x_rot_l = x_af*np.cos(rad) - y_lower*np.sin(rad)
y_rot_l = x_af*np.sin(rad) + y_lower*np.cos(rad)

ax.fill(np.concatenate([x_rot, x_rot_l[::-1]]), np.concatenate([y_rot, y_rot_l[::-1]]),
        color='#374151')

# Streamlines (attached up front, separated at back)
np.random.seed(7)
for y0 in np.linspace(-0.3, 0.3, 15):
    x_s = np.linspace(-0.3, 1.5, 80)
    # Smooth flow up front, turbulent behind separation point
    y_s = y0 + 0.05*np.sin(2*np.pi*x_s)
    # Add turbulence after x=0.5
    turb = np.where(x_s > 0.5, 0.08*np.random.randn(len(x_s))*(x_s-0.5), 0)
    y_s += turb
    if y0 > 0:
        y_s += 0.15*np.exp(-((x_s-0.3)/0.2)**2)  # deflect over airfoil
    ax.plot(x_s, y_s, color='#06b6d4', linewidth=0.4, alpha=0.5)

ax.text(0.8, 0.25, 'Separated\nflow', color='#ef4444', fontsize=9)
ax.text(-0.2, 0.25, 'Attached\nflow', color='#22c55e', fontsize=9)
ax.annotate('→ Wind', xy=(-0.3, -0.2), color='#06b6d4', fontsize=10)

ax.set_xlim(-0.4, 1.6); ax.set_ylim(-0.5, 0.5)
ax.set_aspect('equal')
ax.set_title('Flow Visualization: Smoke Lines at 12° AoA', color='white', fontsize=11)
ax.set_xticks([]); ax.set_yticks([])

plt.tight_layout()
plt.show()

print("Wind tunnel testing provides:")
print("  Lift and drag coefficients at each angle of attack")
print("  Drag polar (Cl vs Cd) — the complete performance map")
print("  Stall characteristics (when and how badly)")
print("  Flow visualization (where separation occurs)")
print()
print("Key challenge: matching Reynolds number")
print("  Model at 1/10 scale has 1/10 Re")
print("  Must compensate with higher speed or denser air")`,
      challenge: 'You want to test a kite (chord = 0.5m, flight speed = 5 m/s, Re = 170,000) in a wind tunnel with a 1/5 scale model (chord = 0.1m). What tunnel speed gives the same Re? Is this feasible?',
      successHint: 'Wind tunnels transformed aerodynamics from guesswork to science. The Wright brothers\' 1901 tunnel produced better data than decades of full-scale experiments. Every modern aircraft, car, building, and bridge has been wind-tunnel tested.',
    },
    {
      title: 'Glider optimization — maximum flight from no engine',
      concept: `A **glider** is the purest expression of aerodynamic efficiency — it flies without any engine, sustained only by lift exceeding drag. A kite without a string, essentially, that has been optimized.

The key metric is **lift-to-drag ratio (L/D)**, also called **glide ratio**:
- L/D = distance traveled forward / altitude lost
- L/D = 10 means: for every 1 meter of altitude lost, the glider travels 10 meters forward
- A paper airplane: L/D ≈ 3-5
- A festival kite: L/D ≈ 4-6
- A hang glider: L/D ≈ 15
- A sailplane (competition glider): L/D ≈ 40-70
- An albatross: L/D ≈ 20

**What determines L/D**:
- **Aspect ratio**: higher AR → less induced drag → better L/D. Sailplanes have AR of 20-40.
- **Surface finish**: smoother → more laminar flow → less skin friction drag
- **Wing loading** (weight/area): affects minimum sink rate and best speed
- **Airfoil**: optimized for the operating Re and speed range

**Thermal soaring**: gliders gain altitude by circling in rising columns of warm air (thermals). A thermal rising at 3 m/s can lift a glider at 2 m/s (net) — indefinitely. Cross-country flights of 1,000+ km are routine in competition gliding.`,
      analogy: 'A glider is like a ball rolling on a tilted surface. The surface is always tilted downward (gravity pulls the glider down), but if the "slope" is gentle enough (high L/D), the ball rolls a long way before reaching the bottom. Thermals are like little bumps that push the ball back up. A good glider pilot finds enough bumps to keep rolling indefinitely.',
      storyConnection: 'A kite over the Brahmaputra is a tethered glider. Cut the string, and if it has good L/D, it will glide some distance before landing. Festival kites are not optimized for gliding — they are optimized for stability and maneuverability on a string. But the same aerodynamic principles that make a good glider also make a good kite: efficient lift, minimal drag, appropriate wing shape.',
      checkQuestion: 'The Gossamer Albatross (human-powered aircraft) crossed the English Channel in 1979. Its pilot pedaled the entire way. Why was high L/D essential for human-powered flight?',
      checkAnswer: 'A human can sustain about 200-300 watts of power. An aircraft with L/D of 40 at 10 m/s needs about 200W to maintain level flight (Power = Weight × speed / L/D). With L/D of 10, the same aircraft would need 800W — far beyond human capability. Human-powered flight is only possible with extremely high L/D, which requires very high aspect ratio wings, ultra-light construction, and laminar-flow airfoils. Every watt matters when the engine is human.',
      codeIntro: 'Optimize a glider design by exploring the parameter space of aspect ratio, wing loading, and airfoil choice.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 2, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

# --- L/D vs Aspect Ratio ---
ax = axes[0, 0]; ax.set_facecolor('#111827')
AR = np.linspace(3, 50, 100)
Cd0 = 0.01  # parasite drag
e = 0.85  # Oswald efficiency

# Optimal L/D for each AR
Cl_opt = np.sqrt(Cd0 * np.pi * e * AR)
Cd_opt = 2 * Cd0
LD_max = Cl_opt / Cd_opt
# More accurate: LD_max = 0.5 * sqrt(pi * e * AR / Cd0)
LD_max_accurate = 0.5 * np.sqrt(np.pi * e * AR / Cd0)

ax.plot(AR, LD_max_accurate, color='#22c55e', linewidth=2.5)
ax.fill_between(AR, LD_max_accurate, alpha=0.1, color='#22c55e')

# Mark real gliders
gliders = [(6, 'Paper plane', '#9ca3af'), (8, 'Kite', '#f59e0b'),
           (15, 'Hang glider', '#3b82f6'), (25, 'Sailplane', '#a855f7'),
           (40, 'Competition', '#ef4444')]
for ar, name, c in gliders:
    ld = 0.5 * np.sqrt(np.pi * e * ar / Cd0)
    ax.plot(ar, ld, 'o', color=c, markersize=8, zorder=5)
    ax.annotate(name, xy=(ar, ld), xytext=(ar+2, ld+3), color=c, fontsize=8,
                arrowprops=dict(arrowstyle='->', color=c, lw=0.8))

ax.set_xlabel('Aspect ratio', color='white')
ax.set_ylabel('Maximum L/D', color='white')
ax.set_title('Glide Ratio vs Aspect Ratio', color='white', fontsize=11)
ax.tick_params(colors='gray')

# --- Speed polar (sink rate vs speed) ---
ax = axes[0, 1]; ax.set_facecolor('#111827')
speeds = np.linspace(10, 60, 100)  # m/s
W = 500 * 9.81  # 500 kg glider, Newtons
S = 15  # m² wing area
rho = 1.225

for AR_val, label, c in [(10, 'AR=10 (hang glider)', '#f59e0b'),
                           (25, 'AR=25 (sailplane)', '#3b82f6'),
                           (40, 'AR=40 (competition)', '#a855f7')]:
    Cl = 2*W / (rho * speeds**2 * S)
    Cd = 0.01 + Cl**2 / (np.pi * 0.85 * AR_val)
    LD = Cl / Cd
    sink_rate = speeds / LD
    ax.plot(speeds * 3.6, sink_rate, color=c, linewidth=2, label=label)

ax.set_xlabel('Speed (km/h)', color='white')
ax.set_ylabel('Sink rate (m/s) — lower is better', color='white')
ax.set_title('Speed Polar', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.set_ylim(0, 5)
ax.invert_yaxis()
ax.tick_params(colors='gray')

# --- Thermal soaring simulation ---
ax = axes[1, 0]; ax.set_facecolor('#111827')
np.random.seed(42)
t = np.linspace(0, 600, 1000)  # 10 minutes
altitude = np.zeros_like(t)
x_pos = np.zeros_like(t)
in_thermal = False
thermal_start = 0
sink_rate = 0.8  # m/s (still air)
thermal_lift = 3  # m/s

for i in range(1, len(t)):
    dt = t[i]-t[i-1]
    # Random thermal encounters
    if not in_thermal and np.random.random() < 0.003:
        in_thermal = True
        thermal_start = t[i]
    if in_thermal and t[i] - thermal_start > 60:  # thermals last ~60s
        in_thermal = False

    if in_thermal:
        altitude[i] = altitude[i-1] + (thermal_lift - sink_rate) * dt
        x_pos[i] = x_pos[i-1] + 5 * dt  # circling = slow forward
    else:
        altitude[i] = altitude[i-1] - sink_rate * dt
        x_pos[i] = x_pos[i-1] + 20 * dt  # cruising = fast forward

    altitude[i] = max(0, altitude[i])

ax.plot(x_pos/1000, altitude, color='#f59e0b', linewidth=1.5)
# Shade thermals
for i in range(1, len(t)):
    if i > 0 and in_thermal:
        ax.axvspan(x_pos[i-1]/1000, x_pos[i]/1000, alpha=0.05, color='#ef4444')

ax.set_xlabel('Distance (km)', color='white')
ax.set_ylabel('Altitude (m)', color='white')
ax.set_title('Cross-Country Glider Flight (thermal soaring)', color='white', fontsize=11)
ax.tick_params(colors='gray')

# --- Design optimization space ---
ax = axes[1, 1]; ax.set_facecolor('#111827')
AR_opt = np.linspace(5, 50, 50)
Wl_opt = np.linspace(10, 80, 50)  # wing loading kg/m²
AR_g, Wl_g = np.meshgrid(AR_opt, Wl_opt)

LD_opt = 0.5 * np.sqrt(np.pi * 0.85 * AR_g / 0.01)
# Higher wing loading = faster but worse sink
v_min = np.sqrt(2 * Wl_g * 9.81 / (1.225 * 1.2))  # min speed
sink_min = v_min / LD_opt
# Merit: low sink + reasonable speed
merit = LD_opt / (1 + Wl_g/50)

im = ax.contourf(AR_g, Wl_g, merit, levels=20, cmap='viridis')
plt.colorbar(im, ax=ax, label='Design merit')

ax.set_xlabel('Aspect ratio', color='white')
ax.set_ylabel('Wing loading (kg/m²)', color='white')
ax.set_title('Design Optimization Space', color='white', fontsize=11)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Glider optimization summary:")
print("  L/D_max = 0.5 × sqrt(π × e × AR / Cd0)")
print("  Higher AR → better L/D (but structural challenges)")
print("  Lower Cd0 → better L/D (smooth surfaces, laminar flow)")
print()
print("Real-world records:")
print("  Best competition sailplane L/D: ~70")
print("  That means: 1 km altitude → 70 km glide distance!")`,
      challenge: 'An albatross has L/D ≈ 20 and uses "dynamic soaring" — extracting energy from wind speed gradients near ocean waves. Calculate how far an albatross can glide from 100m altitude. Then look up their actual flight ranges (thousands of km) — how do they do it without thermals?',
      successHint: 'Glider optimization is pure aerodynamics distilled to its essence: maximum distance from minimum energy. Every improvement in L/D translates directly to performance. The same optimization drives modern airliner design, where fuel efficiency is the ultimate metric.',
    },
    {
      title: 'Drone aerodynamics — rotary-wing flight',
      concept: `Drones (quadcopters) fly using a different principle than kites and fixed-wing aircraft: **rotary-wing lift**. Each rotor is a spinning wing — the airfoil moves through the air rather than air moving past the airfoil.

**How a quadcopter generates lift**:
- Each rotor spins, creating lift = ½ρv²CₗA along the blade
- v varies along the blade (tip moves faster than hub)
- Total thrust = integral of lift along each blade × number of blades × RPM

**Control**:
- **Throttle**: all rotors speed up/down equally → climb/descend
- **Pitch**: front rotors slow, rear speed up → tilt forward → fly forward
- **Roll**: left rotors slow, right speed up → tilt right → fly right
- **Yaw**: CW rotors speed up, CCW slow down → torque imbalance → rotate

Why **four** rotors? Two spin clockwise, two counterclockwise. This cancels the net torque (reaction torque that would spin the body). A helicopter needs a tail rotor to counteract this; a quad uses opposing rotation.

**Hovering efficiency**: rotary-wing aircraft are less efficient than fixed-wing for forward flight, but they can hover — which fixed-wing cannot. The power to hover: P = T^(3/2) / √(2ρA), where T = thrust and A = rotor disc area. Larger rotors → more efficient hover (helicopters > quadcopters > small drones).`,
      analogy: 'A drone rotor is like a ceiling fan pointed downward. The spinning blades push air down (like the fan pushes air), and Newton\'s third law pushes the drone up. A quadcopter is four ceiling fans on a frame, independently controlled. Speed up one fan, and the frame tilts that direction. The pilot controls four fan speeds to achieve any combination of movement.',
      storyConnection: 'Drones are increasingly present at Indian festivals — capturing aerial video of kite festivals, Bihu celebrations, and boat races on the Brahmaputra. The drone hovering above the Guwahati kite festival uses rotary-wing aerodynamics, while the kites below use fixed-surface aerodynamics. Both are flight, but the engineering is completely different.',
      checkQuestion: 'A quadcopter has 4 rotors. A helicopter has 1 main rotor + 1 tail rotor. Why aren\'t there 2-rotor or 3-rotor drones?',
      checkAnswer: 'A 2-rotor (bicopter) can work but needs servos to tilt the rotors for control — mechanically complex. A 3-rotor (tricopter) has a torque imbalance (odd number of rotors) and needs a servo-tilted rear motor to compensate for yaw. A 4-rotor is the simplest configuration that provides full 6-DOF control (up/down, left/right, forward/back, pitch, roll, yaw) using only motor speed — no servos, no swash plates, no moving parts except the motors. Simplicity wins.',
      codeIntro: 'Model quadcopter flight dynamics and control.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 2, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

# --- Rotor thrust vs RPM ---
ax = axes[0, 0]; ax.set_facecolor('#111827')
rpm = np.linspace(1000, 10000, 100)
rho = 1.225
# Simplified thrust: T = Ct * rho * n² * D⁴ (n in rev/s, D in m)
D = 0.25  # 10-inch propeller
Ct = 0.01  # typical thrust coefficient
n = rpm / 60  # rev/s
T = Ct * rho * n**2 * D**4

ax.plot(rpm, T, color='#22c55e', linewidth=2.5)
ax.fill_between(rpm, T, alpha=0.1, color='#22c55e')

# Mark hover RPM for 1kg drone (0.25kg per motor)
hover_thrust = 0.25 * 9.81  # per motor
hover_rpm = 60 * np.sqrt(hover_thrust / (Ct * rho * D**4))
ax.axhline(hover_thrust, color='#ef4444', linewidth=1.5, linestyle='--')
ax.axvline(hover_rpm, color='#ef4444', linewidth=1.5, linestyle='--')
ax.text(hover_rpm+200, hover_thrust+0.3, f'Hover: {hover_rpm:.0f} RPM', color='#ef4444', fontsize=9)

ax.set_xlabel('Motor RPM', color='white')
ax.set_ylabel('Thrust per motor (N)', color='white')
ax.set_title('Rotor Thrust vs RPM', color='white', fontsize=11)
ax.tick_params(colors='gray')

# --- Quadcopter control ---
ax = axes[1, 0]; ax.set_facecolor('#111827')
# Draw quad from above
positions = [(-1, 1), (1, 1), (1, -1), (-1, -1)]
labels_r = ['Front-Left\n(CCW)', 'Front-Right\n(CW)', 'Rear-Right\n(CCW)', 'Rear-Left\n(CW)']
base_rpm = 5000

# Different commands
commands = {
    'Hover': [5000, 5000, 5000, 5000],
    'Forward': [4500, 4500, 5500, 5500],
    'Right': [5500, 4500, 4500, 5500],
    'Yaw CW': [4500, 5500, 4500, 5500],
}

for cmd_idx, (cmd_name, rpms) in enumerate(commands.items()):
    x_off = (cmd_idx % 2) * 5
    y_off = (cmd_idx // 2) * -5

    # Frame
    for (x, y) in positions:
        ax.plot([x_off, x_off + x], [y_off, y_off + y], color='gray', linewidth=1)

    # Rotors (size = RPM)
    for (x, y), rpm_val, label in zip(positions, rpms, labels_r):
        size = rpm_val / 5000 * 0.6
        circle = plt.Circle((x_off + x, y_off + y), size, color='#06b6d4',
                            alpha=0.3 + 0.4*(rpm_val/6000))
        ax.add_patch(circle)
        ax.text(x_off + x, y_off + y, f'{rpm_val}', ha='center', va='center',
                color='white', fontsize=6)

    ax.text(x_off, y_off + 1.8, cmd_name, ha='center', color='#f59e0b',
            fontsize=10, fontweight='bold')

ax.set_xlim(-2, 8); ax.set_ylim(-7, 3)
ax.set_aspect('equal')
ax.set_title('Quadcopter Control (top view)', color='white', fontsize=11)
ax.set_xticks([]); ax.set_yticks([])

# --- Hover efficiency vs rotor size ---
ax = axes[0, 1]; ax.set_facecolor('#111827')
D_range = np.linspace(0.05, 1.0, 100)  # rotor diameter in m
W = 10 * 9.81  # 10 kg drone
n_rotors = 4
T_per_rotor = W / n_rotors
A_disc = np.pi * (D_range/2)**2 * n_rotors  # total disc area

# Power to hover: P = T^(3/2) / sqrt(2*rho*A)
P_hover = W**1.5 / np.sqrt(2 * rho * A_disc)

ax.plot(D_range * 100, P_hover, color='#f59e0b', linewidth=2.5)
ax.fill_between(D_range * 100, P_hover, alpha=0.1, color='#f59e0b')

# Mark common sizes
for d, name, c in [(10, 'Racing drone', '#ef4444'), (25, 'Photo drone', '#22c55e'),
                     (50, 'Delivery drone', '#3b82f6')]:
    p = W**1.5 / np.sqrt(2 * rho * np.pi * (d/200)**2 * 4)
    ax.plot(d, p, 'o', color=c, markersize=8, zorder=5)
    ax.annotate(name, xy=(d, p), xytext=(d+5, p+20), color=c, fontsize=8,
                arrowprops=dict(arrowstyle='->', color=c, lw=0.8))

ax.set_xlabel('Rotor diameter (cm)', color='white')
ax.set_ylabel('Hover power (W)', color='white')
ax.set_title('Hover Efficiency: Bigger Rotors = Less Power', color='white', fontsize=11)
ax.tick_params(colors='gray')

# --- Flight envelope: forward speed vs max altitude ---
ax = axes[1, 1]; ax.set_facecolor('#111827')
speed = np.linspace(0, 30, 100)  # m/s forward
# At forward speed, induced power decreases (translational lift)
P_induced = P_hover[50] / np.sqrt(1 + (speed/10)**2)
P_parasite = 0.5 * rho * 0.01 * 0.1 * speed**3  # parasite drag power
P_total = P_induced + P_parasite + 50  # base power

# Battery limit (e.g., 500W)
battery_limit = 500

ax.plot(speed * 3.6, P_total, color='#a855f7', linewidth=2.5, label='Total power')
ax.plot(speed * 3.6, P_induced, color='#3b82f6', linewidth=1.5, linestyle='--', label='Induced (hover)')
ax.plot(speed * 3.6, P_parasite, color='#ef4444', linewidth=1.5, linestyle='--', label='Parasite (drag)')
ax.axhline(battery_limit, color='#f59e0b', linewidth=1.5, linestyle=':', label='Battery limit')

ax.set_xlabel('Forward speed (km/h)', color='white')
ax.set_ylabel('Power required (W)', color='white')
ax.set_title('Power Curve: Hover vs Forward Flight', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Drone aerodynamics:")
print("  Thrust: T = Ct × ρ × n² × D⁴")
print("  Hover power: P = T^(3/2) / √(2ρA)")
print("  Bigger rotors = more efficient hover")
print()
print("Control (quadcopter):")
print("  4 independent motor speeds → 4 control axes")
print("  No mechanical parts — pure electronic control")
print("  CW + CCW rotation cancels yaw torque")`,
      challenge: 'A delivery drone must carry a 5 kg package while hovering. Its empty weight is 5 kg. Using P = T^(3/2) / √(2ρA) with four 30cm rotors, calculate the hover power. If the battery holds 100 Wh, how long can it hover?',
      successHint: 'Drone aerodynamics combines rotary-wing theory with electronic control. The same physics that lifts a kite (air deflection creating reaction force) lifts a drone — just applied through spinning blades instead of a tilted surface.',
    },
    {
      title: 'Computational fluid dynamics — simulating air with math',
      concept: `**Computational Fluid Dynamics (CFD)** uses computers to solve the equations of fluid flow. Instead of building wind tunnels, engineers simulate airflow digitally.

The governing equations are the **Navier-Stokes equations** — the fundamental laws of fluid motion:

**∂u/∂t + (u·∇)u = -∇P/ρ + ν∇²u + f**

This equation says: acceleration = pressure forces + viscous forces + external forces. It is extremely difficult to solve analytically — in fact, proving whether smooth solutions always exist is one of the Clay Millennium Prize Problems (worth $1 million).

**CFD workflow**:
1. **Geometry**: define the shape (kite, wing, car body)
2. **Mesh**: divide the space into millions of small cells (finite elements)
3. **Solver**: numerically solve Navier-Stokes in each cell at each time step
4. **Post-processing**: visualize pressure, velocity, streamlines, forces

**Turbulence modeling** is the biggest challenge:
- **DNS** (Direct Numerical Simulation): resolves all turbulence scales. Accurate but computationally extreme (Re³ grid points needed).
- **LES** (Large Eddy Simulation): resolves large turbulent structures, models small ones.
- **RANS** (Reynolds-Averaged Navier-Stokes): averages turbulence, uses models. Most practical.

A modern CFD simulation of an aircraft might use 100 million cells, run for days on a supercomputer, and produce terabytes of data. But it is cheaper and faster than building and testing a full-scale wind tunnel model.`,
      analogy: 'CFD is like simulating weather, but for a wing instead of the whole atmosphere. Just as weather models divide the atmosphere into grid boxes and calculate temperature, pressure, and wind in each box, CFD divides the air around a wing into tiny cells and calculates velocity, pressure, and turbulence in each one. The equations are the same (Navier-Stokes); only the scale differs.',
      storyConnection: 'If you wanted to design the ultimate kite for the Guwahati festival, CFD would be your most powerful tool. You could simulate thousands of kite shapes, tail lengths, and bridle configurations in a computer — optimizing for stability in gusty Brahmaputra winds — before building a single physical prototype. The festival champion of the future will be a CFD user.',
      checkQuestion: 'The Navier-Stokes existence and smoothness problem is worth $1 million. Why is it so hard to solve?',
      checkAnswer: 'The equation is nonlinear (the (u·∇)u term means velocity multiplied by its own derivative — feedback that creates turbulence). This nonlinearity means small changes in initial conditions can produce wildly different outcomes (chaos). Mathematically, no one has proven that solutions always remain smooth (finite) for all time in 3D. They might "blow up" — become infinite — which would mean the equations break down. In practice, we know fluids don\'t have infinite velocities, so either the equations are always smooth (and we can\'t prove it) or they need modification at extreme conditions.',
      codeIntro: 'Simulate a simple 2D potential flow around objects using computational methods.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 2, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

# --- Potential flow around a cylinder (analytic) ---
ax = axes[0, 0]; ax.set_facecolor('#111827')

# Grid
x = np.linspace(-3, 3, 200)
y = np.linspace(-2, 2, 150)
X, Y = np.meshgrid(x, y)

# Uniform flow + doublet (cylinder in potential flow)
U_inf = 1.0  # freestream velocity
R = 0.5  # cylinder radius
r = np.sqrt(X**2 + Y**2)
theta = np.arctan2(Y, X)

# Velocity components (potential flow around cylinder)
r_safe = np.maximum(r, R)
Vx = U_inf * (1 - R**2 * (X**2 - Y**2) / r_safe**4)
Vy = -U_inf * R**2 * 2 * X * Y / r_safe**4

# Mask inside cylinder
mask = r < R
Vx[mask] = 0; Vy[mask] = 0

speed = np.sqrt(Vx**2 + Vy**2)
speed[mask] = np.nan

# Streamlines
ax.streamplot(X, Y, Vx, Vy, color=speed, cmap='cool', linewidth=0.8, density=2, arrowsize=0.5)

# Cylinder
circle = plt.Circle((0, 0), R, color='#ef4444', alpha=0.5)
ax.add_patch(circle)

ax.set_xlim(-2.5, 2.5); ax.set_ylim(-1.5, 1.5)
ax.set_aspect('equal')
ax.set_title('Potential Flow Around Cylinder', color='white', fontsize=11)
ax.set_xticks([]); ax.set_yticks([])

# --- Pressure coefficient on cylinder ---
ax = axes[0, 1]; ax.set_facecolor('#111827')
theta_cyl = np.linspace(0, 2*np.pi, 200)
# Cp = 1 - 4sin²(θ) for potential flow
Cp = 1 - 4*np.sin(theta_cyl)**2

ax.plot(np.degrees(theta_cyl), Cp, color='#3b82f6', linewidth=2.5, label='Potential flow (inviscid)')
# Real flow (with separation)
Cp_real = np.where(np.degrees(theta_cyl) < 80, Cp,
          np.where(np.degrees(theta_cyl) < 280, -1.0, Cp))
ax.plot(np.degrees(theta_cyl), Cp_real, color='#ef4444', linewidth=2.5, linestyle='--', label='Real flow (viscous)')

ax.axhline(0, color='gray', linewidth=0.5, alpha=0.3)
ax.set_xlabel('Angle around cylinder (°)', color='white')
ax.set_ylabel('Pressure coefficient Cp', color='white')
ax.set_title('Cp Distribution: Theory vs Reality', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')
ax.text(180, -2, 'Real: separation creates\nconstant low-pressure wake', color='#ef4444', fontsize=8, ha='center')

# --- CFD mesh visualization ---
ax = axes[1, 0]; ax.set_facecolor('#111827')

# Simple structured mesh around an airfoil-like shape
n_r = 30; n_theta = 60
r_mesh = np.linspace(0.2, 2.0, n_r)
theta_mesh = np.linspace(0, 2*np.pi, n_theta)

for r_val in r_mesh:
    x_ring = r_val * np.cos(theta_mesh)
    y_ring = r_val * np.sin(theta_mesh) * 0.3 * (1 + 0.5/r_val)
    ax.plot(x_ring, y_ring, color='#22c55e', linewidth=0.3, alpha=0.5)

for t_val in theta_mesh[::2]:
    x_rad = r_mesh * np.cos(t_val)
    y_rad = r_mesh * np.sin(t_val) * 0.3 * (1 + 0.5/r_mesh)
    ax.plot(x_rad, y_rad, color='#22c55e', linewidth=0.3, alpha=0.5)

# Airfoil body
t_body = np.linspace(0, 2*np.pi, 100)
ax.fill(0.2*np.cos(t_body), 0.06*np.sin(t_body), color='#374151')

ax.set_xlim(-2.5, 2.5); ax.set_ylim(-1, 1)
ax.set_aspect('equal')
ax.set_title(f'CFD Mesh ({n_r}×{n_theta} = {n_r*n_theta} cells)', color='white', fontsize=11)
ax.set_xticks([]); ax.set_yticks([])

# --- CFD hierarchy ---
ax = axes[1, 1]; ax.set_facecolor('#111827')
methods = ['Panel\nMethod', 'RANS', 'LES', 'DNS']
accuracy = [3, 6, 8, 10]
cost = [1, 4, 7, 10]
colors_m = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444']

x_pos = np.arange(len(methods))
ax.bar(x_pos - 0.2, accuracy, 0.35, color=[c for c in colors_m], alpha=0.7, label='Accuracy')
ax.bar(x_pos + 0.2, cost, 0.35, color=[c for c in colors_m], alpha=0.3, label='Computational cost')

ax.set_xticks(x_pos)
ax.set_xticklabels(methods, color='white', fontsize=9)
ax.set_ylabel('Relative scale (0-10)', color='white')
ax.set_title('CFD Methods: Accuracy vs Cost', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("CFD: solving Navier-Stokes numerically")
print()
print("Methods (increasing accuracy and cost):")
print("  Panel method: fast, inviscid, good for preliminary design")
print("  RANS: practical for industry, models all turbulence")
print("  LES: resolves large eddies, models small ones")
print("  DNS: resolves everything — Re³ cost, research only")
print()
print("Real-world CFD:")
print("  Boeing 787 wing: ~100 million cells, weeks of computation")
print("  Formula 1 car: ~300 million cells, continuous optimization")
print("  Weather prediction: ~1 billion cells, daily global run")`,
      challenge: 'Estimate the grid size needed for DNS of flow around a kite (Re = 100,000). DNS needs approximately Re^(9/4) grid points in 3D. How many points is that? How does this compare to the number of atoms in a grain of sand (~10¹⁹)?',
      successHint: 'CFD is where physics meets computer science at the frontier of human capability. The same Navier-Stokes equations that govern a kite fluttering over the Brahmaputra also govern weather, ocean currents, blood flow, and galaxy formation. Solving them computationally is one of the grand challenges of science and engineering.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Innovator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Builds on Level 1 aerodynamics foundations</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for flight engineering simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint}
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
