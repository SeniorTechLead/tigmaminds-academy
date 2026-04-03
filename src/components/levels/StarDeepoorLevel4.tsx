import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function StarDeepoorLevel4() {
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
      title: `Capstone Design: Impact Crater Calculator Pipeline`,
      concept: `In Level 3 you learned atmospheric entry, crater scaling, shock metamorphism, meteorite classification, crater morphometry, and orbital mechanics. Now you integrate these into a complete Impact Crater Calculator. The pipeline: (1) Atmospheric entry simulation with ablation. (2) Crater size prediction using scaling laws. (3) Shock zone mapping. (4) Environmental effects computation. (5) Risk assessment. (6) Strewn field prediction.

This mirrors real tools used by NASA Planetary Defense. The calculator takes impactor properties (diameter, density, velocity, angle) and outputs comprehensive predictions with uncertainty bounds from Monte Carlo simulation.

Each module feeds into the next: entry determines ground-level mass and velocity, which determines crater size, which determines shock distribution, which determines environmental effects. The chain of models transforms a set of initial conditions into a complete impact scenario.`,
      analogy: `Building this calculator is like assembling a weather forecasting system. Individual instruments (barometer, thermometer, wind gauge) are useful alone, but the forecast requires integrating them into a coupled model. Our impact calculator couples entry physics, scaling laws, and environmental models into a unified prediction system.`,
      storyConnection: `The star that fell at Deepor can now be fully analyzed: our calculator takes whatever is known about the event and works backward to determine what fell, how fast, and what happened on impact. The story becomes a solvable physics problem.`,
      checkQuestion: `Why must atmospheric entry be modeled before crater prediction, rather than just using the cosmic velocity?`,
      checkAnswer: `A 10m stony meteoroid enters at 20 km/s but may reach the ground at only 5 km/s after losing 90%+ of its mass. Using cosmic velocity would overpredict crater size by a factor of 10-100. Only objects larger than ~50m retain significant velocity through the atmosphere. The entry model is essential.`,
      codeIntro: `Build the integrated entry + crater + effects calculator.`,
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

class ImpactCalculator:
    def entry_sim(self, mass, vel, d, rho, angle=45):
        surv = min(1, max(0.001, (d/100)**0.8 * (rho/3500)**0.3))
        v_g = vel * surv**0.3 if d > 50 else max(100, vel*0.01)
        return mass*surv, v_g, surv

    def crater(self, mass, vel):
        E = 0.5*mass*vel**2
        D = max(0, 0.07 * E**(1/3.4)) if vel > 2000 else 0
        depth = D/5 if D < 4000 else D/20
        return D, depth, E

    def effects(self, E):
        Mt = E / 4.184e15
        fb = 0.06 * max(Mt, 1e-10)**0.4
        blast = max(0.01, (Mt+1e-10)**0.36 * 2)
        return Mt, fb, blast, blast*3

    def full(self, d, rho, v, angle=45):
        mass = (4/3)*np.pi*(d/2)**3*rho
        m_g, v_g, surv = self.entry_sim(mass, v, d, rho, angle)
        D, depth, E = self.crater(m_g, v_g)
        Mt, fb, b5, b1 = self.effects(E)
        freq = 1e3*(d/1000)**(-2.7) / 5e8
        return dict(d=d, rho=rho, v=v, mass=mass, surv=surv, v_ground=v_g,
                    crater_D=D, depth=depth, energy_Mt=Mt, fireball=fb,
                    blast_5psi=b5, blast_1psi=b1, annual_freq=freq)

calc = ImpactCalculator()
cases = [('1m stone',1,3500,20000), ('10m stone',10,3500,20000),
         ('50m stone',50,3500,20000), ('100m iron',100,7800,25000),
         ('500m stone',500,3500,20000)]

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Impact Crater Calculator - Full Analysis', color='white', fontsize=14)
colors = ['#22c55e','#3b82f6','#f59e0b','#ef4444','#a855f7']

# Crater size comparison
ax = axes[0,0]; ax.set_facecolor('#111827')
names = [c[0] for c in cases]
craters = [calc.full(c[1],c[2],c[3])['crater_D'] for c in cases]
ax.barh(names, craters, color=colors)
for i,v in enumerate(craters): ax.text(v+20, i, f'{v:.0f}m', va='center', color='white', fontsize=8)
ax.set_xlabel('Crater Diameter (m)', color='white')
ax.set_title('Crater Size Comparison', color='white')
ax.tick_params(colors='gray')

# Survival fraction
ax = axes[0,1]; ax.set_facecolor('#111827')
survs = [calc.full(c[1],c[2],c[3])['surv']*100 for c in cases]
ax.barh(names, survs, color=colors)
ax.set_xlabel('Mass Surviving Entry (%)', color='white')
ax.set_title('Atmospheric Filter', color='white')
ax.tick_params(colors='gray')

# Energy scale
ax = axes[0,2]; ax.set_facecolor('#111827')
d_range = np.logspace(0, 4, 100)
Mt_range = [calc.full(d, 3500, 20000)['energy_Mt'] for d in d_range]
ax.loglog(d_range, Mt_range, color='#ef4444', linewidth=2)
ax.axhline(y=0.015, color='#f59e0b', linestyle='--', alpha=0.5, label='Hiroshima (15kt)')
ax.axhline(y=15, color='white', linestyle='--', alpha=0.5, label='Tunguska (15Mt)')
ax.set_xlabel('Diameter (m)', color='white'); ax.set_ylabel('Energy (Mt)', color='white')
ax.set_title('Impact Energy Scale', color='white')
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Damage zones for 100m
ax = axes[1,0]; ax.set_facecolor('#111827')
r100 = calc.full(100, 3500, 20000)
theta = np.linspace(0, 2*np.pi, 100)
for name,r,col in [('Crater',r100['crater_D']/2000,'#ef4444'),
                    ('Fireball',r100['fireball'],'#f59e0b'),
                    ('5psi blast',r100['blast_5psi'],'#3b82f6'),
                    ('1psi blast',r100['blast_1psi'],'#22c55e')]:
    ax.fill(r*np.cos(theta), r*np.sin(theta), alpha=0.3, color=col, label=f'{name}: {r:.1f}km')
ax.set_aspect('equal'); ax.set_title('100m Damage Zones', color='white')
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Risk curve
ax = axes[1,1]; ax.set_facecolor('#111827')
freqs = [calc.full(d, 3500, 20000)['annual_freq'] for d in d_range]
areas = [np.pi * calc.full(d, 3500, 20000)['blast_5psi']**2 for d in d_range]
risk = np.array(freqs) * np.array(areas)
ax.loglog(d_range, risk, color='#a855f7', linewidth=2)
pk = np.argmax(risk)
ax.scatter([d_range[pk]], [risk[pk]], s=200, marker='*', color='#f59e0b', zorder=5,
           label=f'Peak risk at {d_range[pk]:.0f}m')
ax.set_xlabel('Diameter (m)', color='white'); ax.set_ylabel('Annual risk (km2/yr)', color='white')
ax.set_title('Annualized Risk', color='white')
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Monte Carlo
ax = axes[1,2]; ax.set_facecolor('#111827')
mc_craters = []
for _ in range(300):
    d_v = 100 * np.random.lognormal(0, 0.1)
    rho_v = 3500 * np.random.lognormal(0, 0.15)
    v_v = 20000 * np.random.lognormal(0, 0.05)
    mc_craters.append(calc.full(d_v, rho_v, v_v)['crater_D'])
ax.hist(mc_craters, bins=30, color='#22c55e', alpha=0.7, edgecolor='white')
ax.axvline(x=np.percentile(mc_craters, 5), color='white', linestyle=':', label='5th pctl')
ax.axvline(x=np.percentile(mc_craters, 95), color='white', linestyle=':', label='95th pctl')
ax.set_xlabel('Crater Diameter (m)', color='white')
ax.set_title('Monte Carlo Uncertainty (100m stone)', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("IMPACT CRATER CALCULATOR RESULTS")
print("=" * 55)
for name, d, rho, v in cases:
    r = calc.full(d, rho, v)
    print(f"{name}: crater={r['crater_D']:.0f}m, E={r['energy_Mt']:.2e}Mt, survived={r['surv']*100:.1f}%")
print(f"\\nMonte Carlo 95% CI for 100m stone: {np.percentile(mc_craters,5):.0f}-{np.percentile(mc_craters,95):.0f}m")`,
      challenge: `Add tsunami computation for ocean impacts: compute wave height vs distance accounting for water depth and coastal amplification.`,
      successHint: `The integrated calculator connects every aspect of impact science into a single deployable tool. This is real planetary defense technology.`,
    },
    {
      title: `Environmental Effects and Damage Radii`,
      concept: `The environmental effects module computes blast wave, thermal radiation, seismic shaking, and ejecta as functions of distance from ground zero. Overpressure from the expanding shock wave causes structural damage at different thresholds: 1 psi breaks windows, 5 psi destroys buildings, 20 psi destroys reinforced concrete.

Thermal radiation extends further than blast for large impacts. The fireball radiates at ~6000K, igniting flammable material at distances where flux exceeds 10 kW/m2. For Tunguska-class events (15 Mt), this is about 10 km.

Seismic effects scale as magnitude = 0.67 * log10(E) - 5.87. A 100m impactor produces roughly a magnitude 6 earthquake at the impact site, felt hundreds of kilometers away.`,
      analogy: `Impact effects spread like ripples from a stone in a pond. The splash (crater) is local, but ripples (blast, thermal, ejecta) travel far. For the largest impacts, the ripples reach every shore.`,
      storyConnection: `The Deepor impact, depending on size, could have rattled windows in Guwahati or leveled trees in the surrounding wetland. The scaling laws tell us exactly what witnesses at each distance would experience.`,
      checkQuestion: `An airburst (like Tunguska) causes more surface damage than a ground impact of the same energy. Why?`,
      checkAnswer: `An airburst deposits energy high in the atmosphere, creating a downward-directed shock wave over a wide area. A ground impact focuses energy into crater excavation and seismic waves. The airburst maximizes the blast footprint on the surface, which is why Tunguska flattened 2000 km2 of forest.`,
      codeIntro: `Compute environmental effects (fireball, blast, thermal, seismic) as functions of distance.`,
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

def impact_effects(energy_Mt):
    dist = np.logspace(-1, 3, 500)
    fireball_r = 0.06 * max(energy_Mt, 1e-10)**0.4
    scaled = dist / (energy_Mt**(1/3) + 0.001)
    overpressure = 14.7 * (1.0/(scaled+0.01)**2.5 + 0.3/(scaled+0.01)**1.5)
    overpressure = np.clip(overpressure, 0, 1000)
    thermal = energy_Mt * 4.184e15 * 0.3 / (4*np.pi*(dist*1000)**2) / 4184 * 10
    thermal = np.clip(thermal, 0, 1e4)
    ejecta_r = 0.5 * 0.07 * (energy_Mt*4.184e15)**(1/3.4) / 1000
    ejecta = np.where(dist > ejecta_r, 100*(ejecta_r/(dist+0.01))**3, 0)
    return dist, overpressure, thermal, ejecta, fireball_r

energies = [0.015, 1, 15, 1000]
labels = ['15 kt (Hiroshima)', '1 Mt', '15 Mt (Tunguska)', '1 Gt (1km asteroid)']
colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444']

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Impact Environmental Effects', color='white', fontsize=14)

ax = axes[0,0]; ax.set_facecolor('#111827')
for E, col, lbl in zip(energies, colors, labels):
    d, op, _, _, _ = impact_effects(E)
    ax.loglog(d, op, color=col, linewidth=2, label=lbl)
ax.axhline(y=1, color='white', linestyle=':', alpha=0.3)
ax.axhline(y=5, color='white', linestyle='--', alpha=0.3)
ax.text(200, 1.3, 'Window break', color='gray', fontsize=7)
ax.text(200, 6, 'Building damage', color='gray', fontsize=7)
ax.set_xlabel('Distance (km)', color='white'); ax.set_ylabel('Overpressure (psi)', color='white')
ax.set_title('Blast Wave', color='white')
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

ax = axes[0,1]; ax.set_facecolor('#111827')
for E, col, lbl in zip(energies, colors, labels):
    d, _, th, _, _ = impact_effects(E)
    ax.loglog(d, th, color=col, linewidth=2, label=lbl)
ax.axhline(y=10, color='#ef4444', linestyle='--', alpha=0.5, label='Ignition threshold')
ax.set_xlabel('Distance (km)', color='white'); ax.set_ylabel('Thermal Flux', color='white')
ax.set_title('Thermal Radiation', color='white')
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

ax = axes[0,2]; ax.set_facecolor('#111827')
d15, op15, _, _, fb15 = impact_effects(15)
theta = np.linspace(0, 2*np.pi, 100)
zones = [('Fireball', fb15, '#ef4444'),
         ('20psi', d15[np.searchsorted(-op15,-20)], '#f59e0b'),
         ('5psi', d15[np.searchsorted(-op15,-5)], '#3b82f6'),
         ('1psi', d15[np.searchsorted(-op15,-1)], '#22c55e')]
for name, r, col in reversed(zones):
    ax.fill(r*np.cos(theta), r*np.sin(theta), alpha=0.3, color=col, label=f'{name}: {r:.1f}km')
ax.set_aspect('equal'); ax.set_title('15 Mt Damage Zones', color='white')
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

ax = axes[1,0]; ax.set_facecolor('#111827')
E_range = np.logspace(-3, 5, 100)
r_5psi = [max(0.01, (E+1e-10)**0.36*2) for E in E_range]
r_fb = [0.06*max(E,1e-10)**0.4 for E in E_range]
ax.loglog(E_range, r_5psi, color='#f59e0b', linewidth=2, label='5psi blast')
ax.loglog(E_range, r_fb, color='#ef4444', linewidth=2, label='Fireball')
ax.set_xlabel('Energy (Mt)', color='white'); ax.set_ylabel('Radius (km)', color='white')
ax.set_title('Damage Radius vs Energy', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

ax = axes[1,1]; ax.set_facecolor('#111827')
d_imp = np.logspace(-1, 4, 100)
freq = 1e3*(d_imp/1000)**(-2.7)/5e8
recurrence = 1/(freq+1e-15)
ax.loglog(d_imp, recurrence, color='#a855f7', linewidth=2)
ax.axhline(y=100, color='white', linestyle=':', alpha=0.3)
ax.set_xlabel('Impactor Diameter (m)', color='white')
ax.set_ylabel('Years Between Impacts', color='white')
ax.set_title('Impact Frequency', color='white')
ax.tick_params(colors='gray')

ax = axes[1,2]; ax.set_facecolor('#111827')
areas = [np.pi*max(0.01,(E+1e-10)**0.36*2)**2 for E in E_range]
risk = np.array([1e3*(d/1000)**(-2.7)/5e8 for d in d_imp]) * np.array([np.pi*max(0.01,(calc_E+1e-10)**0.36*2)**2 for calc_E in [0.5*(4/3*np.pi*(d/2)**3*3500)*(20000)**2/4.184e15 for d in d_imp]])
ax.loglog(d_imp, np.clip(risk, 1e-20, None), color='#22c55e', linewidth=2)
ax.set_xlabel('Impactor Diameter (m)', color='white'); ax.set_ylabel('Annual Risk (km2/yr)', color='white')
ax.set_title('Annualized Risk', color='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Environmental effects computed for 4 energy levels")
for E, lbl in zip(energies, labels):
    d, op, _, _, fb = impact_effects(E)
    idx5 = np.searchsorted(-op, -5)
    print(f"  {lbl}: fireball={fb:.1f}km, 5psi={d[min(idx5,len(d)-1)]:.1f}km")`,
      challenge: `Add a population exposure module: overlay damage zones on a population grid to estimate casualties at different locations.`,
      successHint: `Environmental effects modeling is the core of planetary defense risk assessment. The same physics that destroyed Siberian forest at Tunguska could destroy a major city.`,
    },
    {
      title: `Shock Wave Mapping and Metamorphism Zones`,
      concept: `The shock module computes pressure distribution in the target rock. Starting at the Hugoniot contact pressure (P0 = rho * Us * up), the shock decays as r^(-2.5). Different pressure thresholds trigger different metamorphic features: >2 GPa = fracturing, >10 GPa = PDFs, >35 GPa = diaplectic glass, >50 GPa = melt, >100 GPa = vaporization.

We compute a 2D axisymmetric pressure field and map the zones where each metamorphic feature forms. The resulting map tells a field geologist exactly what to look for at each distance from the impact center.

Post-shock temperature follows from energy partitioning: T ~ P/(rho*Cv). At pressures above 50 GPa, temperatures exceed the melting point of silicates (1400 K), creating impact melt sheets that can persist as geological markers for billions of years.`,
      analogy: `Shock propagation through rock is like a sound wave through a building. At material boundaries, the wave reflects and transmits differently, creating a complex pressure field. Each mineral records the peak pressure it experienced, like a maximum thermometer.`,
      storyConnection: `Underground beneath the Deepor impact, the shock wave would have left a permanent diary in the crystal structure of every mineral it passed through. Finding the right rocks and reading them under a microscope would confirm or deny the impact origin.`,
      checkQuestion: `Two rocks at the same distance show different shock levels. How?`,
      checkAnswer: `Impedance contrasts (soft layer absorbing shock), pre-existing fractures (pore collapse reduces peak pressure), or post-impact rearrangement during crater modification. The crater is not a simple zone of decreasing shock but a complex 3D pressure field.`,
      codeIntro: `Model shock wave propagation and map metamorphic zones around the impact.`,
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

def shock_field(imp_d, imp_v, res=80):
    a = imp_d / 2
    rho_t = 2700; C0 = 5000; s = 1.5
    up = imp_v / 2; Us = C0 + s * up
    P0 = rho_t * Us * up / 1e9  # GPa

    size = a * 25
    x = np.linspace(-size, size, res)
    y = np.linspace(-size, 0, res//2)
    X, Y = np.meshgrid(x, y)
    R = np.sqrt(X**2 + Y**2)
    P = np.where(R > a, P0 * (a / np.maximum(R, a*0.1))**2.5, P0)
    return X, Y, P, P0, a

zones = {'Vaporization': (100, '#a855f7'), 'Melt': (50, '#ef4444'),
         'Diaplectic glass': (35, '#f59e0b'), 'PDFs': (10, '#22c55e'),
         'Fracturing': (2, '#3b82f6')}

X, Y, P, P0, a = shock_field(50, 15000)

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Shock Wave Propagation and Metamorphism', color='white', fontsize=14)

ax = axes[0,0]; ax.set_facecolor('#111827')
im = ax.contourf(X/a, Y/a, np.log10(P+0.001), levels=20, cmap='hot')
ax.set_xlabel('Distance (impactor radii)', color='white')
ax.set_ylabel('Depth', color='white')
ax.set_title('Log10 Pressure (GPa)', color='white')
ax.set_aspect('equal'); ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax, shrink=0.8)

ax = axes[0,1]; ax.set_facecolor('#111827')
P_mid = P[P.shape[0]//2, :]
r_mid = X[0, :] / a
ax.semilogy(r_mid, P_mid, color='white', linewidth=2)
for zn, (pth, col) in zones.items():
    ax.axhline(y=pth, color=col, linestyle='--', alpha=0.5, label=f'{zn} ({pth} GPa)')
ax.set_xlabel('Distance (radii)', color='white'); ax.set_ylabel('Pressure (GPa)', color='white')
ax.set_title('Radial Profile with Zone Thresholds', color='white')
ax.legend(fontsize=5, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

ax = axes[0,2]; ax.set_facecolor('#111827')
T = 300 + P * 1e9 / (2700 * 1000) * 0.3
im = ax.contourf(X/a, Y/a, T, levels=20, cmap='hot')
ax.contour(X/a, Y/a, T, levels=[1400, 3000], colors=['#f59e0b','#ef4444'], linewidths=2)
ax.set_xlabel('Distance', color='white'); ax.set_ylabel('Depth', color='white')
ax.set_title('Post-shock Temperature (K)', color='white')
ax.set_aspect('equal'); ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax, shrink=0.8)

ax = axes[1,0]; ax.set_facecolor('#111827')
for d_imp, col, lbl in [(10,'#22c55e','10m'), (50,'#f59e0b','50m'), (200,'#ef4444','200m')]:
    _, _, P_d, P0_d, a_d = shock_field(d_imp, 20000, 60)
    P_r = P_d[P_d.shape[0]//2, P_d.shape[1]//2:]
    r_norm = np.arange(len(P_r))
    ax.semilogy(r_norm, P_r, color=col, linewidth=2, label=lbl)
ax.set_xlabel('Grid units from center', color='white'); ax.set_ylabel('Pressure (GPa)', color='white')
ax.set_title('Pressure Decay by Impactor Size', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

ax = axes[1,1]; ax.set_facecolor('#111827')
theta = np.linspace(0, 2*np.pi, 100)
for zn, (pth, col) in reversed(list(zones.items())):
    r_z = a * (P0/pth)**(1/2.5) if pth < P0 else a
    ax.fill(r_z*np.cos(theta)/a, r_z*np.sin(theta)/a, alpha=0.3, color=col, label=f'{zn}: {r_z:.0f}m')
ax.set_aspect('equal')
ax.set_title('Shock Zones (plan view)', color='white')
ax.legend(fontsize=5, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

ax = axes[1,2]; ax.set_facecolor('#111827')
ax.axis('off')
txt = f"SHOCK ANALYSIS (50m at 15 km/s)\\n{'='*35}\\n\\n"
txt += f"Contact pressure: {P0:.0f} GPa\\n\\n"
for zn, (pth, col) in zones.items():
    r_z = a * (P0/pth)**(1/2.5) if pth < P0 else 0
    txt += f"{zn} (>{pth} GPa): {r_z:.0f}m\\n"
ax.text(0.05, 0.95, txt, transform=ax.transAxes, fontsize=9, color='white',
        verticalalignment='top', fontfamily='monospace')

plt.tight_layout()
plt.show()

print(f"Contact pressure: {P0:.0f} GPa")
for zn, (pth, _) in zones.items():
    r_z = a * (P0/pth)**(1/2.5) if pth < P0 else 0
    print(f"  {zn}: {r_z:.0f}m radius")`,
      challenge: `Add time-resolved shock simulation: show the pressure pulse passing a fixed point as a function of time, with rise time, peak, and decay.`,
      successHint: `Shock wave modeling connects the violence of impact to the permanent geological record. The pressure field determines crater shape, melt distribution, and metamorphic zones.`,
    },
    {
      title: `Risk Assessment with NEO Population Statistics`,
      concept: `The risk module quantifies impact probability using the near-Earth object size distribution: N(>D) ~ 1000 * (D/1km)^(-2.7). Combined with our damage model, we compute annualized risk = frequency x consequence.

Key result: annualized risk peaks at 30-100m diameter impactors. Smaller ones are too frequent but harmless (fireballs). Larger ones are devastating but too rare. The 30-100m sweet spot is common enough to matter and large enough to cause city-scale damage.

Cumulative probability analysis answers practical questions: what is the chance of a Tunguska-class event in the next 100 years? Answer: about 5-20%, depending on the population model. This is why asteroid detection programs focus on this size range.`,
      analogy: `Risk assessment is like earthquake insurance pricing. You know large earthquakes are rare but devastating, and small ones are common but minor. The premium is based on frequency times damage. Impact risk peaks at intermediate sizes for the same reason insurance premiums peak at moderate earthquake magnitudes.`,
      storyConnection: `The Deepor event was most likely a small body (1-10m), statistically common. Our risk module shows these enter the atmosphere daily to yearly but rarely reach the ground intact.`,
      checkQuestion: `The annual probability of a Chicxulub-scale impact is 1 in 100 million. Does this mean we are safe?`,
      checkAnswer: `No. Impacts follow a Poisson process (memoryless). The fact that 66 million years have passed since the last one does not reduce the probability of the next. Moreover, smaller civilization-threatening events (1km class) have probability 1/500,000 per year, and city-killers (100m class) about 1/10,000 per year.`,
      codeIntro: `Build the risk assessment with NEO population modeling and cumulative probability.`,
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

D = np.logspace(-1, 4, 200)
N_neo = 1e3 * (D/1000)**(-2.7)
freq = N_neo / 5e8

# Damage area (5psi overpressure zone)
def damage(d):
    mass = (4/3)*np.pi*(d/2)**3*3500
    E = 0.5*mass*(20000)**2
    Mt = E/4.184e15
    r = max(0.01, (Mt+1e-10)**0.36*2)
    return np.pi*r**2, Mt

areas = np.array([damage(d)[0] for d in D])
Mts = np.array([damage(d)[1] for d in D])
risk = freq * areas

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Impact Risk Assessment', color='white', fontsize=14)

ax = axes[0,0]; ax.set_facecolor('#111827')
ax.loglog(D, N_neo, color='#22c55e', linewidth=2)
ax.set_xlabel('Diameter (m)', color='white'); ax.set_ylabel('N(>D)', color='white')
ax.set_title('NEO Population', color='white'); ax.tick_params(colors='gray')

ax = axes[0,1]; ax.set_facecolor('#111827')
ax.loglog(D, 1/(freq+1e-20), color='#ef4444', linewidth=2)
ax.axhline(y=100, color='white', linestyle=':', alpha=0.3, label='Lifetime')
ax.axhline(y=1e4, color='white', linestyle='--', alpha=0.3, label='Civilization')
ax.set_xlabel('Diameter (m)', color='white'); ax.set_ylabel('Years between', color='white')
ax.set_title('Recurrence Interval', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

ax = axes[0,2]; ax.set_facecolor('#111827')
ax.loglog(D, risk, color='#a855f7', linewidth=2)
pk = np.argmax(risk)
ax.scatter([D[pk]], [risk[pk]], s=200, marker='*', color='#f59e0b', zorder=5,
           label=f'Peak at {D[pk]:.0f}m')
ax.set_xlabel('Diameter (m)', color='white'); ax.set_ylabel('Annual risk (km2/yr)', color='white')
ax.set_title('Annualized Risk', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

ax = axes[1,0]; ax.set_facecolor('#111827')
for tf, col in [(10,'#22c55e'), (50,'#3b82f6'), (100,'#f59e0b'), (1000,'#ef4444')]:
    cum = 1 - np.exp(-freq*tf)
    ax.semilogx(D, cum*100, color=col, linewidth=2, label=f'{tf} yrs')
ax.set_xlabel('Diameter (m)', color='white'); ax.set_ylabel('Probability (%)', color='white')
ax.set_title('Cumulative Impact Probability', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

ax = axes[1,1]; ax.set_facecolor('#111827')
cats = ['1m\\n(daily)', '10m\\n(yearly)', '30m\\n(century)', '100m\\n(10ky)', '1km\\n(500ky)']
cat_d = [1, 10, 30, 100, 1000]
cat_Mt = [damage(d)[1] for d in cat_d]
cat_colors = ['#22c55e','#22c55e','#f59e0b','#ef4444','#ef4444']
ax.bar(range(len(cats)), [np.log10(mt+1e-20) for mt in cat_Mt], color=cat_colors)
ax.set_xticks(range(len(cats))); ax.set_xticklabels(cats, color='white', fontsize=7)
ax.set_ylabel('log10(Energy Mt)', color='white')
ax.set_title('Impact Categories', color='white'); ax.tick_params(colors='gray')

ax = axes[1,2]; ax.set_facecolor('#111827')
# Detection completeness
detected_frac = np.clip(0.95 * (D/1000)**0.5, 0, 0.95)
residual_risk = risk * (1 - detected_frac)
ax.loglog(D, risk, color='#6b7280', linewidth=2, label='Total risk')
ax.loglog(D, residual_risk, color='#ef4444', linewidth=2, label='Residual (undetected)')
ax.set_xlabel('Diameter (m)', color='white'); ax.set_ylabel('Risk', color='white')
ax.set_title('Risk Reduction from Detection', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("RISK ASSESSMENT")
print("="*50)
print(f"Peak annualized risk at: {D[pk]:.0f}m diameter")
for d in [10, 30, 100, 500, 1000]:
    f = 1e3*(d/1000)**(-2.7)/5e8
    p100 = 1-np.exp(-f*100)
    print(f"  >{d}m in 100yr: {p100*100:.2f}%")`,
      challenge: `Add a deflection assessment: for a given warning time, compute the delta-v needed to deflect the asteroid. Compare kinetic impactor vs gravity tractor approaches.`,
      successHint: `Risk assessment completes the calculator by contextualizing impacts. The key finding: annualized risk peaks at 30-100m, directly informing detection priorities.`,
    },
    {
      title: `Strewn Field Prediction for Meteorite Recovery`,
      concept: `When a meteoroid fragments in the atmosphere, pieces follow different ballistic trajectories based on mass. Heavier fragments travel further downrange (more momentum per unit drag), lighter ones fall shorter. This creates an elliptical strewn field.

The mass-distance relationship is the key: fragment mass increases monotonically with downrange distance. The largest surviving piece lands at the far end of the ellipse. Wind drift adds lateral spread, making the strewn field wider.

For Chelyabinsk (2013), the strewn field was ~100 km long and ~10 km wide, with the 654 kg main mass in Lake Chebarkul at the downrange end. Our model predicts such patterns from entry parameters, enabling search teams to know where to look.`,
      analogy: `Strewn field prediction is like predicting where confetti lands from a rooftop. Heavy pieces fly further, light pieces flutter down nearby, wind pushes everything sideways. The result is an elliptical scatter pattern with big pieces at one end.`,
      storyConnection: `If cameras had recorded the Deepor fireball, we could compute the strewn field and tell search teams exactly where to look. Without this prediction, finding a meteorite in the wetlands would be nearly impossible.`,
      checkQuestion: `A fireball enters from the north at 45 degrees. Where do the largest fragments land?`,
      checkAnswer: `At the south (downrange) end. Larger fragments retain more forward velocity due to higher momentum-to-drag ratio, traveling further along the trajectory. Small fragments decelerate quickly and drop nearly vertically near the fragmentation point. This mass-distance gradient is universal.`,
      codeIntro: `Simulate fragment trajectories with wind and predict the strewn field pattern.`,
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

class StrewnField:
    def __init__(self, vel=18000, angle=45, frag_alt=35000):
        self.v0 = vel; self.angle = np.radians(angle); self.frag_alt = frag_alt

    def gen_fragments(self, total_mass, n=80):
        masses = np.random.pareto(1.5, n) + 0.001
        return np.sort(masses / masses.sum() * total_mass)[::-1]

    def sim_fragment(self, mass, density=3500, wind_sp=10):
        dt = 0.1; h = self.frag_alt; g = 9.81
        r = (3*mass/(4*np.pi*density))**(1/3)
        A = np.pi*r**2; Cd = 1.0
        v_frag = self.v0 * 0.3 * (mass/100)**0.1
        vx = v_frag * np.cos(self.angle)
        vz = -v_frag * np.sin(self.angle)
        vy = 0
        x, y, z = 0, 0, float(h)
        for _ in range(500000):
            if z <= 0: break
            rho = 1.225*np.exp(-z/8500) if z < 100000 else 0
            v = np.sqrt(vx**2+vy**2+vz**2)
            if v > 0 and mass > 0:
                Fd = 0.5*rho*v**2*Cd*A
                vx -= Fd*vx/(mass*v+1e-10)*dt
                vy -= Fd*vy/(mass*v+1e-10)*dt + 0.5*rho*wind_sp*A*Cd/mass*0.1*dt
                vz -= (Fd*vz/(mass*v+1e-10)+g)*dt
            else:
                vz -= g*dt
            x += vx*dt; y += vy*dt; z = max(z+vz*dt, 0)
        return x/1000, y/1000

sf = StrewnField()
frags = sf.gen_fragments(5000, 80)

lx, ly, fm = [], [], []
for mass in frags:
    x, y = sf.sim_fragment(mass, wind_sp=np.random.normal(10,3))
    lx.append(x); ly.append(y); fm.append(mass)
lx = np.array(lx); ly = np.array(ly); fm = np.array(fm)

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Strewn Field Prediction', color='white', fontsize=14)

ax = axes[0,0]; ax.set_facecolor('#111827')
sc = ax.scatter(lx, ly, c=np.log10(fm+0.001), cmap='YlOrRd',
               s=fm/fm.max()*200+5, edgecolors='white', linewidth=0.3)
ax.set_xlabel('Downrange (km)', color='white'); ax.set_ylabel('Crossrange (km)', color='white')
ax.set_title('Strewn Field Map', color='white')
plt.colorbar(sc, ax=ax, shrink=0.8, label='log10(mass)')
ax.tick_params(colors='gray')

ax = axes[0,1]; ax.set_facecolor('#111827')
dist = np.sqrt(lx**2 + ly**2)
ax.scatter(dist, fm, color='#f59e0b', s=20, alpha=0.7)
ax.set_xlabel('Distance from frag point (km)', color='white')
ax.set_ylabel('Fragment Mass (kg)', color='white')
ax.set_title('Mass-Distance Relationship', color='white')
ax.tick_params(colors='gray')

ax = axes[0,2]; ax.set_facecolor('#111827')
ax.hist(np.log10(fm+0.001), bins=20, color='#22c55e', alpha=0.7, edgecolor='white')
ax.set_xlabel('log10(Mass, kg)', color='white'); ax.set_ylabel('Count', color='white')
ax.set_title('Fragment Mass Distribution', color='white')
ax.tick_params(colors='gray')

# Ellipse fit
ax = axes[1,0]; ax.set_facecolor('#111827')
ax.scatter(lx, ly, c=fm, cmap='YlOrRd', s=20, alpha=0.7)
cx, cy = lx.mean(), ly.mean()
cov = np.cov(lx-cx, ly-cy); eigvals, eigvecs = np.linalg.eigh(cov)
a_e, b_e = 2*np.sqrt(eigvals[1]), 2*np.sqrt(eigvals[0])
theta = np.linspace(0, 2*np.pi, 100)
ell_x = cx + a_e*np.cos(theta)*eigvecs[0,1] + b_e*np.sin(theta)*eigvecs[0,0]
ell_y = cy + a_e*np.cos(theta)*eigvecs[1,1] + b_e*np.sin(theta)*eigvecs[1,0]
ax.plot(ell_x, ell_y, '--', color='white', linewidth=2, label=f'{a_e:.1f}x{b_e:.1f} km')
ax.set_title('Search Ellipse', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Priority heat map
ax = axes[1,1]; ax.set_facecolor('#111827')
xg = np.linspace(lx.min()-1, lx.max()+1, 50)
yg = np.linspace(ly.min()-1, ly.max()+1, 50)
XG, YG = np.meshgrid(xg, yg)
prob = np.zeros_like(XG)
for x,y,m in zip(lx,ly,fm):
    prob += m * np.exp(-((XG-x)**2+(YG-y)**2)/0.5**2)
im = ax.contourf(xg, yg, prob, levels=20, cmap='hot')
ax.set_title('Search Priority (hot=look here)', color='white')
ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax, shrink=0.8)

ax = axes[1,2]; ax.set_facecolor('#111827')
ax.axis('off')
txt = f"STREWN FIELD SUMMARY\\n{'='*30}\\n\\n"
txt += f"Fragments: {len(frags)}\\n"
txt += f"Largest: {frags[0]:.1f} kg\\n"
txt += f"Field: {a_e:.1f} x {b_e:.1f} km\\n"
txt += f"Largest at: ({lx[0]:.1f}, {ly[0]:.1f}) km\\n"
ax.text(0.05, 0.95, txt, transform=ax.transAxes, fontsize=10, color='white',
        verticalalignment='top', fontfamily='monospace')

plt.tight_layout()
plt.show()

print(f"Strewn field: {a_e:.1f} x {b_e:.1f} km")
print(f"Largest fragment ({frags[0]:.1f} kg) at ({lx[0]:.1f}, {ly[0]:.1f}) km")`,
      challenge: `Add terrain: if the field overlaps a lake, compute which fragments land in water vs land and the reduced recovery probability for water-landed fragments.`,
      successHint: `Strewn field prediction enables meteorite recovery. Every recovered meteorite started with trajectory computation. This module makes the calculator practically useful for field science.`,
    },
    {
      title: `Deployment: The Complete Impact Crater Calculator`,
      concept: `The final integration combines all modules: entry, crater, shock, environmental effects, risk, and strewn field into a single tool with input validation, Monte Carlo uncertainty, and report generation.

The production system validates inputs (physical constraints on velocity 11.2-72 km/s, density 500-9000 kg/m3, angle 5-90 degrees), propagates uncertainty through the full chain, and produces a human-readable report.

This capstone demonstrates the arc from cosmic physics to deployable tool. NASA and ESA maintain similar calculators for planetary defense. The system you built captures the essential physics while being computationally efficient enough to run Monte Carlo simulations.`,
      analogy: `The complete calculator is like a flight data recorder analysis for cosmic events. Just as investigators reconstruct an accident from black box data, our calculator reconstructs or predicts an impact from impactor properties.`,
      storyConnection: `The star that fell at Deepor can now be fully analyzed end-to-end. Our calculator turns the story into quantified science: from cosmic origin to local impact to permanent geological record.`,
      checkQuestion: `What is the single most uncertain parameter in impact assessment?`,
      checkAnswer: `Density (and therefore mass). We can estimate size from brightness and velocity from orbit, but density ranges from 1500 (rubble pile) to 8000 (iron) kg/m3. This 5x range propagates to ~1.7x range in crater diameter. Radar observations constrain density via thermal inertia, making them crucial for threat assessment.`,
      codeIntro: `Build the complete integrated calculator with validation, Monte Carlo, and reporting.`,
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

class CraterCalc:
    def validate(self, d, rho, v, a):
        errs = []
        if d<0.01 or d>1e5: errs.append(f"Diameter {d}")
        if rho<500 or rho>9000: errs.append(f"Density {rho}")
        if v<11200 or v>72000: errs.append(f"Velocity {v}")
        if a<5 or a>90: errs.append(f"Angle {a}")
        return errs

    def calc(self, d, rho, v, a=45):
        mass = (4/3)*np.pi*(d/2)**3*rho
        surv = min(1, max(0.001, (d/100)**0.8*(rho/3500)**0.3))
        vg = v*surv**0.3 if d>50 else max(100, v*0.01)
        mg = mass*surv; E = 0.5*mg*vg**2; Mt = E/4.184e15
        D_c = max(0, 0.07*E**(1/3.4)) if vg>2000 else 0
        dep = D_c/5 if D_c<4000 else D_c/20
        fb = 0.06*max(Mt,1e-10)**0.4
        b5 = max(0.01,(Mt+1e-10)**0.36*2)
        freq = 1e3*(d/1000)**(-2.7)/5e8
        return dict(d=d,rho=rho,v=v,mass=mass,surv=surv,vg=vg,E=E,Mt=Mt,
                    crater=D_c,depth=dep,fireball=fb,blast5=b5,freq=freq)

    def monte_carlo(self, d, rho, v, a=45, n=300):
        return [self.calc(d*np.random.lognormal(0,.1),rho*np.random.lognormal(0,.15),
                          v*np.random.lognormal(0,.05),np.clip(a+np.random.normal(0,5),5,90))
                for _ in range(n)]

cc = CraterCalc()
r = cc.calc(100, 3500, 20000)
mc = cc.monte_carlo(100, 3500, 20000)

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('IMPACT CRATER CALCULATOR - Complete', color='white', fontsize=14, fontweight='bold')

mc_c = [m['crater'] for m in mc]
mc_Mt = [m['Mt'] for m in mc]

ax = axes[0,0]; ax.set_facecolor('#111827')
ax.hist(mc_c, bins=30, color='#22c55e', alpha=0.7, edgecolor='white')
ax.axvline(np.percentile(mc_c,5), color='white', linestyle=':')
ax.axvline(np.percentile(mc_c,95), color='white', linestyle=':')
ax.axvline(r['crater'], color='#ef4444', linestyle='--', linewidth=2, label='Nominal')
ax.set_xlabel('Crater D (m)', color='white'); ax.set_title('MC: Crater Size', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

ax = axes[0,1]; ax.set_facecolor('#111827')
ax.hist(np.log10(np.array(mc_Mt)+1e-20), bins=30, color='#f59e0b', alpha=0.7, edgecolor='white')
ax.set_xlabel('log10(Mt)', color='white'); ax.set_title('MC: Energy', color='white')
ax.tick_params(colors='gray')

ax = axes[0,2]; ax.set_facecolor('#111827')
scenarios = [('10m',10,3500,20000),('50m',50,3500,20000),('100m',100,3500,20000),
             ('100m Fe',100,7800,25000),('500m',500,3500,20000)]
ns = [s[0] for s in scenarios]; cs = [cc.calc(s[1],s[2],s[3])['crater'] for s in scenarios]
cols = ['#22c55e','#3b82f6','#f59e0b','#ef4444','#a855f7']
ax.barh(ns, cs, color=cols)
for i,v in enumerate(cs): ax.text(v+20,i,f'{v:.0f}m',va='center',color='white',fontsize=8)
ax.set_xlabel('Crater D (m)', color='white'); ax.set_title('Scenarios', color='white')
ax.tick_params(colors='gray')

ax = axes[1,0]; ax.set_facecolor('#111827')
theta = np.linspace(0, 2*np.pi, 100)
for nm,rd,col in [('Crater',r['crater']/2000,'#ef4444'),('Fireball',r['fireball'],'#f59e0b'),
                   ('5psi blast',r['blast5'],'#3b82f6')]:
    ax.fill(rd*np.cos(theta),rd*np.sin(theta),alpha=0.3,color=col,label=f'{nm}: {rd:.1f}km')
ax.set_aspect('equal'); ax.set_title('100m: Damage Zones', color='white')
ax.legend(fontsize=6,facecolor='#1f2937',edgecolor='gray',labelcolor='white')
ax.tick_params(colors='gray')

ax = axes[1,1]; ax.set_facecolor('#111827')
d_r = np.logspace(0,4,100)
surv_r = [cc.calc(d,3500,20000)['surv']*100 for d in d_r]
ax.semilogx(d_r, surv_r, color='#a855f7', linewidth=2)
ax.set_xlabel('Diameter (m)', color='white'); ax.set_ylabel('Survival (%)', color='white')
ax.set_title('Atmospheric Filter', color='white'); ax.tick_params(colors='gray')

ax = axes[1,2]; ax.set_facecolor('#111827')
ax.axis('off')
rpt = f"IMPACT CRATER CALCULATOR v1.0\\n{'='*35}\\n\\n"
rpt += f"Input: {r['d']}m, {r['rho']}kg/m3, {r['v']/1000:.0f}km/s\\n"
rpt += f"Mass: {r['mass']:.2e} kg\\n"
rpt += f"Survived: {r['surv']*100:.1f}%\\n"
rpt += f"Ground vel: {r['vg']/1000:.1f} km/s\\n\\n"
rpt += f"Crater: {r['crater']:.0f}m (95%CI: {np.percentile(mc_c,5):.0f}-{np.percentile(mc_c,95):.0f})\\n"
rpt += f"Energy: {r['Mt']:.1f} Mt\\n"
rpt += f"Fireball: {r['fireball']:.1f} km\\n"
rpt += f"Blast (5psi): {r['blast5']:.1f} km\\n"
rpt += f"Frequency: 1/{1/r['freq']:.0f} yr\\n"
ax.text(0.02,0.98,rpt,transform=ax.transAxes,fontsize=8,color='white',verticalalignment='top',fontfamily='monospace')

plt.tight_layout()
plt.show()

print(rpt)
print("\\nCAPSTONE COMPLETE")
print("="*55)
print("You built an Impact Crater Calculator from scratch:")
print("  1. Atmospheric entry with ablation")
print("  2. Crater scaling with morphology")
print("  3. Shock wave propagation and metamorphism")
print("  4. Environmental effects (blast, thermal)")
print("  5. Risk assessment with NEO statistics")
print("  6. Monte Carlo uncertainty quantification")`,
      challenge: `Add asteroid deflection assessment: compute delta-v needed to miss Earth given years of warning, and compare kinetic impactor vs gravity tractor.`,
      successHint: `You built a complete Impact Crater Calculator from raw physics to deployable tool. This is real planetary defense science — the same tools NASA uses. Portfolio-ready.`,
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (impact physics and meteorite science)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project uses Python with numpy and matplotlib to build a complete Impact Crater Calculator. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cpu className="w-5 h-5" />Load Python + NumPy</>)}
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
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
