import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function PithaLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Capstone Design: Fermentation Process Optimizer',
      concept: `In Level 3 you learned microbial kinetics, lactic acid dynamics, starch gelatinization, CO₂ gas dynamics, enzyme kinetics, and sensory modeling. Now you integrate these into a Fermentation Process Optimizer — a system that predicts fermentation outcomes from input conditions and finds the optimal parameters for a target flavor profile.

The optimizer has four modules: (1) **Parameter input** — initial conditions (temperature, starter culture size, rice variety, water ratio). (2) **Simulation engine** — coupled ODEs for microbial growth, enzyme activity, acid production, pH dynamics, gas production, and starch breakdown running simultaneously. (3) **Sensory prediction** — mapping chemical concentrations at any time point to perceived flavor intensities. (4) **Optimization** — searching the parameter space to find conditions that maximize a quality objective function.

This is a real-world application of computational modeling: food scientists at companies use exactly these tools to optimize fermentation processes for consistency, safety, and flavor.`,
      analogy: 'The Fermentation Process Optimizer is like a flight simulator for food science. Instead of crashing real planes (wasting real ingredients), you simulate thousands of fermentation runs in seconds, testing different temperatures, starter sizes, and timing without ever touching a kitchen. Once you find the optimal conditions in simulation, you run one real experiment to validate.',
      storyConnection: 'Grandmother optimized her pitha recipe over decades of trial and error, passing knowledge through generations. Our optimizer does the same thing in seconds — exploring thousands of parameter combinations to find what grandmother found by intuition. The computer does not replace grandmother; it explains why her recipe works and suggests how to adapt it to different conditions.',
      checkQuestion: 'Why do we need coupled ODEs rather than independent models for each variable?',
      checkAnswer: 'Because everything is connected. Bacterial growth rate depends on glucose concentration, which depends on amylase activity, which depends on pH, which depends on lactic acid concentration, which depends on bacterial growth rate — it is a circular chain of dependencies. Solving each independently would miss these feedbacks. For example, modeling acid production without modeling its inhibitory effect on growth would overpredict both acid and bacteria. The coupled system captures these self-regulating dynamics.',
      codeIntro: 'Build the integrated simulation engine that couples all fermentation processes.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# ============================================================
# FERMENTATION PROCESS OPTIMIZER — Module 1: Simulation Engine
# ============================================================

class FermentationSimulator:
    """Coupled ODE solver for pitha fermentation."""

    def __init__(self):
        self.dt = 0.005  # hours
        self.results = None

    def simulate(self, duration=16, temp_C=30, N0=1e6, starch0=50,
                 water_ratio=2.0, amylase_mult=1.0):
        """Run complete fermentation simulation."""
        steps = int(duration / self.dt)
        time = np.linspace(0, duration, steps)

        # State variables
        state = {
            'bacteria': np.zeros(steps),
            'starch': np.zeros(steps),
            'dextrins': np.zeros(steps),
            'glucose': np.zeros(steps),
            'lactic_acid': np.zeros(steps),
            'acetic_acid': np.zeros(steps),
            'CO2_total': np.zeros(steps),
            'CO2_gas': np.zeros(steps),
            'ethanol': np.zeros(steps),
            'pH': np.zeros(steps),
            'volume_ratio': np.zeros(steps),
            'amino_acids': np.zeros(steps),
        }

        # Initial conditions
        state['bacteria'][0] = N0
        state['starch'][0] = starch0 / water_ratio
        state['glucose'][0] = 2.0 / water_ratio
        state['pH'][0] = 6.5
        state['volume_ratio'][0] = 1.0

        # Temperature-dependent parameters
        mu_max = 0.85 * np.exp(-0.05 * (temp_C - 30)**2)
        Vmax_alpha = 5.0 * amylase_mult * np.exp(-0.03 * (temp_C - 35)**2)
        Vmax_gluco = 2.0 * amylase_mult * np.exp(-0.03 * (temp_C - 40)**2)

        # Henry's law for CO2
        kH = 0.034 * np.exp(2400 * (1/(temp_C + 273.15) - 1/298.15))

        for i in range(1, steps):
            s = {k: v[i-1] for k, v in state.items()}
            dt = self.dt

            # Enzyme activities (pH dependent)
            act_alpha = np.exp(-0.5 * ((s['pH'] - 6.5) / 1.5)**2)
            act_gluco = np.exp(-0.5 * ((s['pH'] - 4.5) / 1.5)**2)

            # Starch -> dextrins (alpha-amylase)
            v_alpha = Vmax_alpha * act_alpha * s['starch'] / (8 + s['starch'])
            v_alpha *= 10 / (10 + s['dextrins'])

            # Dextrins -> glucose (glucoamylase)
            v_gluco = Vmax_gluco * act_gluco * s['dextrins'] / (3 + s['dextrins'])
            v_gluco *= 20 / (20 + s['glucose'])

            # Bacterial growth (Monod with inhibitions)
            mu = mu_max * s['glucose'] / (0.5 + s['glucose'])
            mu *= 15 / (15 + s['lactic_acid'])  # product inhibition
            mu *= 1 / (1 + 10**(3.5 - s['pH']))  # pH inhibition

            # Mass balances
            dN = mu * s['bacteria'] * dt
            consumed = mu * s['bacteria'] / 1e8 * dt

            state['starch'][i] = max(s['starch'] - v_alpha * dt, 0)
            state['dextrins'][i] = max(s['dextrins'] + v_alpha * dt - v_gluco * dt, 0)
            state['glucose'][i] = max(s['glucose'] + v_gluco * dt - consumed, 0)
            state['bacteria'][i] = s['bacteria'] + dN
            state['lactic_acid'][i] = s['lactic_acid'] + consumed * 0.8
            state['acetic_acid'][i] = s['acetic_acid'] + consumed * 0.05
            state['ethanol'][i] = s['ethanol'] + consumed * 0.05
            state['amino_acids'][i] = s['amino_acids'] + 0.001 * dt
            state['CO2_total'][i] = s['CO2_total'] + consumed * 0.15 / 44
            state['CO2_gas'][i] = max(state['CO2_total'][i] - kH, 0)

            # pH
            total_acid = state['lactic_acid'][i] + 0.8 * state['acetic_acid'][i]
            state['pH'][i] = max(6.5 - total_acid * 0.15, 3.0)

            # Volume
            T_K = temp_C + 273.15
            gas_vol = state['CO2_gas'][i] * 0.0821 * T_K
            state['volume_ratio'][i] = 1.0 + gas_vol * 0.7

        self.results = {'time': time, **state}
        return self.results

# Run standard simulation
sim = FermentationSimulator()
results = sim.simulate(duration=16, temp_C=30, N0=1e6, starch0=50)

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Fermentation Process Optimizer — Simulation Engine', color='white', fontsize=14)

t = results['time']

ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.semilogy(t, results['bacteria'], color='#22c55e', linewidth=2)
ax.set_xlabel('Time (h)', color='white')
ax.set_ylabel('Bacteria (CFU/mL)', color='white')
ax.set_title('Microbial Growth', color='white')
ax.tick_params(colors='gray')

ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.plot(t, results['starch'], color='#a855f7', linewidth=2, label='Starch')
ax.plot(t, results['dextrins'], color='#f59e0b', linewidth=2, label='Dextrins')
ax.plot(t, results['glucose'], color='#22c55e', linewidth=2, label='Glucose')
ax.set_xlabel('Time (h)', color='white')
ax.set_ylabel('Concentration (g/L)', color='white')
ax.set_title('Carbohydrate Cascade', color='white')
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.plot(t, results['lactic_acid'], color='#ef4444', linewidth=2, label='Lactic acid')
ax.plot(t, results['acetic_acid'] * 5, color='#f59e0b', linewidth=2, label='Acetic acid (x5)')
ax2 = ax.twinx()
ax2.plot(t, results['pH'], color='#3b82f6', linewidth=2, label='pH')
ax.set_xlabel('Time (h)', color='white')
ax.set_ylabel('Acid (g/L)', color='white')
ax2.set_ylabel('pH', color='#3b82f6')
ax.set_title('Acid Production & pH', color='white')
ax.legend(fontsize=7, loc='center left', facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray'); ax2.tick_params(colors='gray')

ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.plot(t, (results['volume_ratio'] - 1) * 100, color='#22c55e', linewidth=2)
ax.set_xlabel('Time (h)', color='white')
ax.set_ylabel('Volume Rise (%)', color='white')
ax.set_title('Batter Rising', color='white')
ax.tick_params(colors='gray')

ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.plot(t, results['CO2_total'] * 1000, color='#3b82f6', linewidth=2, label='Total CO₂')
ax.plot(t, results['CO2_gas'] * 1000, color='#f59e0b', linewidth=2, label='Gas phase')
ax.set_xlabel('Time (h)', color='white')
ax.set_ylabel('CO₂ (mmol/L)', color='white')
ax.set_title('CO₂ Dynamics', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.plot(t, results['ethanol'], color='#a855f7', linewidth=2, label='Ethanol')
ax.plot(t, results['amino_acids'] * 10, color='#22c55e', linewidth=2, label='Amino acids (x10)')
ax.set_xlabel('Time (h)', color='white')
ax.set_ylabel('Concentration (g/L)', color='white')
ax.set_title('Minor Products', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("SIMULATION ENGINE — Standard Run (30°C, 16h)")
print(f"  Final bacteria: {results['bacteria'][-1]:.2e} CFU/mL")
print(f"  Starch remaining: {results['starch'][-1]:.1f} g/L")
print(f"  Final pH: {results['pH'][-1]:.2f}")
print(f"  Lactic acid: {results['lactic_acid'][-1]:.1f} g/L")
print(f"  Volume rise: {(results['volume_ratio'][-1]-1)*100:.0f}%")`,
      challenge: 'Add a yeast compartment with its own growth kinetics. Yeast grows slower (generation time 90 min) but produces ethanol and CO₂. Model the competition between LAB and yeast for glucose.',
      successHint: 'The simulation engine is the heart of the optimizer. By coupling all processes into a single system of ODEs, we capture the emergent behavior that no individual model could predict — like the enzyme relay triggered by pH drop, or the self-limiting nature of acid production.',
    },
    {
      title: 'Sensory Prediction Module',
      concept: `Module 2 maps the simulator's chemical outputs to perceived flavor. This is the bridge between chemistry and human experience.

We use Stevens' power law for each taste dimension, cross-modal interactions for taste enhancement/suppression, and a weighted quality function that defines "good pitha."

The sensory model must handle **temporal dynamics**: flavor changes continuously during fermentation, and the optimal stopping time depends on the target flavor profile. A quality score function Q(t) reaches a maximum at the optimal fermentation time.

We also model **batch-to-batch variation**: even with identical initial conditions, natural variation in starter culture composition, ambient temperature fluctuations, and rice starch content creates a distribution of outcomes. The optimizer must find conditions that are not just optimal on average but **robust** — producing good results even with moderate variation.`,
      analogy: 'The sensory prediction module is like a wine critic\'s palate translated into equations. The critic tastes a wine and says "blackberry, vanilla, too much tannin." Our model takes chemical concentrations and says "sour=7.2, sweet=3.8, bitter=1.5, quality=8.1." Both are doing the same thing — mapping chemistry to perception — but the mathematical version can process thousands of samples per second.',
      storyConnection: 'Grandmother\'s taste test — a quick sample of the batter to check if it is ready — is the manual version of our sensory prediction module. She has calibrated her palate over decades. Our model replicates that calibration mathematically, making the knowledge transferable to anyone.',
      checkQuestion: 'Why is robustness more important than optimality in food process optimization?',
      checkAnswer: 'Because real-world conditions vary. A process that produces perfect pitha at exactly 30.0°C but terrible pitha at 29°C or 31°C is useless — kitchens do not have laboratory-grade temperature control. A robust process produces good (not perfect) pitha across a 5°C range. This is the engineering principle of "tolerance design": optimize for consistency, not just peak performance.',
      codeIntro: 'Build the sensory prediction module and map chemical concentrations to flavor scores.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# ============================================================
# FERMENTATION PROCESS OPTIMIZER — Module 2: Sensory Prediction
# ============================================================

class SensoryPredictor:
    """Maps chemical concentrations to perceived flavor."""

    def __init__(self):
        self.taste_params = {
            'sour':   {'threshold': 2.0, 'power': 0.85, 'max': 10},
            'sweet':  {'threshold': 3.0, 'power': 1.3, 'max': 10},
            'umami':  {'threshold': 0.05, 'power': 0.7, 'max': 10},
            'bitter': {'threshold': 0.5, 'power': 0.6, 'max': 10},
            'buttery': {'threshold': 0.5, 'power': 0.9, 'max': 10},
        }
        # Quality weights (what makes good pitha)
        self.quality_weights = {
            'sour': 0.30,
            'sweet': 0.25,
            'umami': 0.20,
            'buttery': 0.15,
            'bitter': -0.20,
        }
        # Target intensities for "perfect pitha"
        self.targets = {'sour': 6.0, 'sweet': 4.0, 'umami': 3.0, 'buttery': 2.0, 'bitter': 0.5}

    def _intensity(self, conc, taste):
        p = self.taste_params[taste]
        ratio = conc / p['threshold']
        return np.clip(p['max'] * ratio**p['power'] / (1 + ratio**p['power']), 0, p['max'])

    def predict(self, lactic_acid, glucose, amino_acids, ethanol, acetic_acid, diacetyl=None):
        """Predict sensory scores from chemical concentrations."""
        if diacetyl is None:
            diacetyl = lactic_acid * 0.01  # approximate

        intensities = {
            'sour': self._intensity(lactic_acid + 0.8 * acetic_acid, 'sour'),
            'sweet': self._intensity(glucose, 'sweet'),
            'umami': self._intensity(amino_acids, 'umami'),
            'bitter': self._intensity(0.1 * ethanol + 0.02 * lactic_acid, 'bitter'),
            'buttery': self._intensity(diacetyl, 'buttery'),
        }
        return intensities

    def quality_score(self, intensities):
        """Compute overall quality as proximity to target profile."""
        distance = sum((intensities[k] - self.targets[k])**2 for k in self.targets)
        return 10 * np.exp(-distance / 50)  # 0-10 scale

    def quality_weighted(self, intensities):
        """Weighted sum quality (alternative metric)."""
        score = sum(self.quality_weights[k] * intensities[k] for k in self.quality_weights)
        return max(0, min(10, score))

# --- Simplified fermentation simulation ---
def quick_sim(duration=16, temp=30, N0=1e6, starch0=50):
    dt = 0.01; steps = int(duration/dt); t = np.linspace(0, duration, steps)
    mu_max = 0.85 * np.exp(-0.05*(temp-30)**2)
    N = np.zeros(steps); S = np.zeros(steps); G = np.zeros(steps)
    LA = np.zeros(steps); AA = np.zeros(steps); Et = np.zeros(steps); Am = np.zeros(steps)
    N[0]=N0; S[0]=starch0; G[0]=2.0
    for i in range(1, steps):
        mu = mu_max * G[i-1]/(0.5+G[i-1]) * 15/(15+LA[i-1])
        dN = mu*N[i-1]*dt; cons = mu*N[i-1]/1e8*dt
        amyl = 3.0*S[i-1]/(8+S[i-1])*dt
        N[i]=N[i-1]+dN; S[i]=max(S[i-1]-amyl,0)
        G[i]=max(G[i-1]+amyl*0.8-cons,0)
        LA[i]=LA[i-1]+cons*0.8; AA[i]=AA[i-1]+cons*0.05
        Et[i]=Et[i-1]+cons*0.05; Am[i]=Am[i-1]+0.001*dt
    return t, LA, G, Am, Et, AA

predictor = SensoryPredictor()
t, LA, G, Am, Et, AA = quick_sim()

# Compute sensory profiles over time
sour_t = np.array([predictor.predict(LA[i],G[i],Am[i],Et[i],AA[i])['sour'] for i in range(len(t))])
sweet_t = np.array([predictor.predict(LA[i],G[i],Am[i],Et[i],AA[i])['sweet'] for i in range(len(t))])
umami_t = np.array([predictor.predict(LA[i],G[i],Am[i],Et[i],AA[i])['umami'] for i in range(len(t))])
bitter_t = np.array([predictor.predict(LA[i],G[i],Am[i],Et[i],AA[i])['bitter'] for i in range(len(t))])
quality_t = np.array([predictor.quality_score(predictor.predict(LA[i],G[i],Am[i],Et[i],AA[i]))
                       for i in range(len(t))])
quality_w = np.array([predictor.quality_weighted(predictor.predict(LA[i],G[i],Am[i],Et[i],AA[i]))
                       for i in range(len(t))])

# --- Robustness analysis ---
n_sims = 50
quality_traces = []
for _ in range(n_sims):
    temp_var = 30 + np.random.normal(0, 2)
    N0_var = 10**(6 + np.random.normal(0, 0.3))
    starch_var = 50 + np.random.normal(0, 5)
    t_v, LA_v, G_v, Am_v, Et_v, AA_v = quick_sim(temp=temp_var, N0=N0_var, starch0=starch_var)
    q_v = [predictor.quality_score(predictor.predict(LA_v[i],G_v[i],Am_v[i],Et_v[i],AA_v[i]))
           for i in range(len(t_v))]
    quality_traces.append(q_v)
quality_traces = np.array(quality_traces)

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Fermentation Process Optimizer — Sensory Prediction', color='white', fontsize=14)

ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.plot(t, sour_t, color='#ef4444', linewidth=2, label='Sour')
ax.plot(t, sweet_t, color='#22c55e', linewidth=2, label='Sweet')
ax.plot(t, umami_t, color='#3b82f6', linewidth=2, label='Umami')
ax.plot(t, bitter_t, color='#a855f7', linewidth=2, label='Bitter')
ax.set_xlabel('Time (h)', color='white')
ax.set_ylabel('Perceived Intensity (0-10)', color='white')
ax.set_title('Sensory Profile Over Time', color='white')
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.plot(t, quality_t, color='#22c55e', linewidth=2, label='Target proximity')
ax.plot(t, quality_w, color='#f59e0b', linewidth=2, label='Weighted sum')
opt_t1 = t[np.argmax(quality_t)]
opt_t2 = t[np.argmax(quality_w)]
ax.axvline(x=opt_t1, color='#22c55e', linestyle='--', alpha=0.5)
ax.axvline(x=opt_t2, color='#f59e0b', linestyle='--', alpha=0.5)
ax.set_xlabel('Time (h)', color='white')
ax.set_ylabel('Quality Score (0-10)', color='white')
ax.set_title(f'Quality Scores (opt: {opt_t1:.1f}h / {opt_t2:.1f}h)', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

ax = axes[0, 2]
ax.set_facecolor('#111827')
for trace in quality_traces[:20]:
    ax.plot(t, trace, color='#22c55e', alpha=0.15, linewidth=0.8)
mean_q = quality_traces.mean(axis=0)
std_q = quality_traces.std(axis=0)
ax.plot(t, mean_q, color='#22c55e', linewidth=2, label='Mean')
ax.fill_between(t, mean_q - std_q, mean_q + std_q, color='#22c55e', alpha=0.2, label='±1 std')
ax.set_xlabel('Time (h)', color='white')
ax.set_ylabel('Quality Score', color='white')
ax.set_title('Robustness: 50 Random Batches', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Radar chart of optimal profile
ax = axes[1, 0]
ax.set_facecolor('#111827')
opt_idx = np.argmax(quality_t)
opt_profile = predictor.predict(LA[opt_idx], G[opt_idx], Am[opt_idx], Et[opt_idx], AA[opt_idx])
categories = list(opt_profile.keys())
values = [opt_profile[k] for k in categories]
target_vals = [predictor.targets[k] for k in categories]
n_cats = len(categories)
angles = np.linspace(0, 2*np.pi, n_cats, endpoint=False).tolist()
angles += angles[:1]
values += values[:1]
target_vals += target_vals[:1]
ax.plot(angles, values, 'o-', color='#22c55e', linewidth=2, label='Optimal')
ax.fill(angles, values, alpha=0.1, color='#22c55e')
ax.plot(angles, target_vals, 'o--', color='#f59e0b', linewidth=2, label='Target')
ax.set_xticks(angles[:-1])
ax.set_xticklabels(categories, color='white', fontsize=8)
ax.set_title('Optimal vs Target Profile', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Temperature sensitivity
ax = axes[1, 1]
ax.set_facecolor('#111827')
temps = np.linspace(20, 40, 20)
opt_times = []
opt_qualities = []
for temp in temps:
    t_t, LA_t, G_t, Am_t, Et_t, AA_t = quick_sim(temp=temp)
    q_t = [predictor.quality_score(predictor.predict(LA_t[i],G_t[i],Am_t[i],Et_t[i],AA_t[i]))
           for i in range(len(t_t))]
    opt_times.append(t_t[np.argmax(q_t)])
    opt_qualities.append(max(q_t))
ax.plot(temps, opt_times, 'o-', color='#3b82f6', linewidth=2, label='Optimal time')
ax2 = ax.twinx()
ax2.plot(temps, opt_qualities, 's-', color='#22c55e', linewidth=2, label='Peak quality')
ax.set_xlabel('Temperature (°C)', color='white')
ax.set_ylabel('Optimal Time (h)', color='#3b82f6')
ax2.set_ylabel('Peak Quality', color='#22c55e')
ax.set_title('Temperature vs Optimal Fermentation', color='white')
ax.tick_params(colors='gray'); ax2.tick_params(colors='gray')

# Quality landscape (temp x time)
ax = axes[1, 2]
ax.set_facecolor('#111827')
temp_grid = np.linspace(20, 40, 30)
time_grid = np.linspace(4, 16, 30)
quality_landscape = np.zeros((30, 30))
for ti, temp in enumerate(temp_grid):
    t_g, LA_g, G_g, Am_g, Et_g, AA_g = quick_sim(temp=temp)
    for tj, target_time in enumerate(time_grid):
        idx = min(int(target_time / 16 * len(t_g)), len(t_g)-1)
        profile = predictor.predict(LA_g[idx], G_g[idx], Am_g[idx], Et_g[idx], AA_g[idx])
        quality_landscape[tj, ti] = predictor.quality_score(profile)
im = ax.contourf(temp_grid, time_grid, quality_landscape, levels=20, cmap='RdYlGn')
ax.set_xlabel('Temperature (°C)', color='white')
ax.set_ylabel('Fermentation Time (h)', color='white')
ax.set_title('Quality Landscape (bright=good)', color='white')
ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax, shrink=0.8)

plt.tight_layout()
plt.show()

print("SENSORY PREDICTION MODULE")
print(f"  Optimal fermentation time: {t[opt_idx]:.1f} hours")
print(f"  Peak quality score: {quality_t[opt_idx]:.2f}/10")
print(f"  Flavor at optimum: {', '.join(f'{k}={v:.1f}' for k,v in opt_profile.items())}")`,
      challenge: 'Add a "preference dial" that lets the user slide between "tangy" (more weight on sour) and "mild" (more weight on sweet, less on sour). Show how the optimal fermentation time shifts.',
      successHint: 'The sensory prediction module bridges the gap between chemistry and human experience. In real food science, sensory panels of trained tasters calibrate models like this — our simplified version captures the essential behavior.',
    },
    {
      title: 'Parameter Optimization via Grid Search',
      concept: `Module 3 searches the parameter space to find the best fermentation conditions. The search space has multiple dimensions: temperature (20-40°C), starter culture size (10⁴-10⁸ CFU/mL), fermentation time (4-20 hours), water ratio (1.5-3.0), and amylase addition (0.5-2.0x normal).

A **grid search** evaluates the quality function at every combination of parameter values on a discrete grid. With 10 levels per dimension and 5 dimensions, this means 10⁵ = 100,000 simulations. Each simulation takes milliseconds in our simplified model, making grid search feasible.

We also compute a **robustness score** at each grid point by running 10 simulations with random perturbations. The final score is: Score = mean(quality) - lambda × std(quality), where lambda controls the trade-off between optimality and robustness. Higher lambda favors more robust (but possibly less optimal) conditions.

This is a standard approach in **robust design optimization** (Taguchi method), widely used in manufacturing and food processing.`,
      analogy: 'Grid search is like a systematic taste test at a food fair. You try every combination of rice variety, soaking time, and cooking temperature on a grid, scoring each one. It is exhaustive (you try everything) but guaranteed to find the best combination. The robustness score adds realism: you also taste each combination when the cook is slightly inaccurate, and favor recipes that taste good even with imprecise execution.',
      storyConnection: 'Grandmother refined her recipe over a lifetime of experiments. Grid search does the same thing in minutes, testing every plausible combination systematically. But grandmother also learned which variations were forgiving and which were finicky — that is the robustness dimension of our search.',
      checkQuestion: 'Why might the most robust parameter combination NOT be the globally optimal one?',
      checkAnswer: 'The global optimum might sit on a "narrow peak" — a parameter combination where tiny deviations cause large quality drops. Imagine a recipe that is perfect at exactly 32.7°C but terrible at 32°C or 33°C. The robust optimum might be at 28°C where quality is slightly lower on average but consistent across 26-30°C. In practice, the robust solution is more valuable because kitchen conditions are never perfectly controlled. Robustness trades peak performance for reliability.',
      codeIntro: 'Implement grid search optimization with robustness analysis over the fermentation parameter space.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# ============================================================
# FERMENTATION PROCESS OPTIMIZER — Module 3: Optimization
# ============================================================

def quick_sim_opt(duration=16, temp=30, N0=1e6, starch0=50):
    dt = 0.02; steps = int(duration/dt)
    mu_max = 0.85 * np.exp(-0.05*(temp-30)**2)
    N, S, G, LA, AA, Et, Am = N0, starch0, 2.0, 0.0, 0.0, 0.0, 0.0
    for _ in range(steps):
        mu = mu_max * G/(0.5+G) * 15/(15+LA)
        dN = mu*N*dt; cons = mu*N/1e8*dt
        amyl = 3.0*S/(8+S)*dt
        N += dN; S = max(S-amyl, 0); G = max(G+amyl*0.8-cons, 0)
        LA += cons*0.8; AA += cons*0.05; Et += cons*0.05; Am += 0.001*dt
    return LA, G, Am, Et, AA

def quality_func(LA, G, Am, Et, AA):
    """Compute quality score from final chemical state."""
    def intensity(c, thr, pwr, mx=10):
        r = c/thr
        return min(mx, mx * r**pwr / (1 + r**pwr))
    sour = intensity(LA + 0.8*AA, 2.0, 0.85)
    sweet = intensity(G, 3.0, 1.3)
    umami = intensity(Am, 0.05, 0.7)
    bitter = intensity(0.1*Et + 0.02*LA, 0.5, 0.6)
    # Target proximity
    dist = (sour-6)**2 + (sweet-4)**2 + (umami-3)**2 + (bitter-0.5)**2
    return 10 * np.exp(-dist/50)

# --- Grid search ---
temp_grid = np.linspace(22, 38, 15)
time_grid = np.linspace(6, 16, 12)
N0_grid = np.logspace(4, 8, 8)

print("Running grid search (15 x 12 x 8 = 1440 combinations)...")

best_score = 0
best_params = {}
all_scores = np.zeros((len(temp_grid), len(time_grid)))
best_N0_for_display = 1e6

for ni, N0 in enumerate(N0_grid):
    for ti, temp in enumerate(temp_grid):
        for di, dur in enumerate(time_grid):
            LA, G, Am, Et, AA = quick_sim_opt(duration=dur, temp=temp, N0=N0)
            score = quality_func(LA, G, Am, Et, AA)
            if N0 == N0_grid[3]:  # store for 2D visualization
                all_scores[ti, di] = max(all_scores[ti, di], score)
            if score > best_score:
                best_score = score
                best_params = {'temp': temp, 'duration': dur, 'N0': N0}

print(f"Best: temp={best_params['temp']:.1f}°C, time={best_params['duration']:.1f}h, "
      f"N0={best_params['N0']:.0e}, quality={best_score:.3f}")

# --- Robustness analysis at top 5 grid points ---
top_configs = [
    {'temp': best_params['temp'], 'duration': best_params['duration'], 'N0': best_params['N0']},
    {'temp': 28, 'duration': 10, 'N0': 1e6},
    {'temp': 30, 'duration': 12, 'N0': 1e7},
    {'temp': 32, 'duration': 10, 'N0': 1e6},
    {'temp': 26, 'duration': 14, 'N0': 1e5},
]

robustness_results = []
for config in top_configs:
    scores = []
    for _ in range(30):
        t_var = config['temp'] + np.random.normal(0, 2)
        d_var = config['duration'] + np.random.normal(0, 1)
        n_var = config['N0'] * 10**np.random.normal(0, 0.3)
        LA, G, Am, Et, AA = quick_sim_opt(duration=max(4, d_var), temp=t_var, N0=n_var)
        scores.append(quality_func(LA, G, Am, Et, AA))
    robustness_results.append({
        'config': config,
        'mean': np.mean(scores),
        'std': np.std(scores),
        'robust_score': np.mean(scores) - 1.0 * np.std(scores),
        'scores': scores,
    })

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Fermentation Process Optimizer — Parameter Search', color='white', fontsize=14)

# Quality landscape
ax = axes[0, 0]
ax.set_facecolor('#111827')
im = ax.contourf(time_grid, temp_grid, all_scores, levels=20, cmap='RdYlGn')
ax.scatter([best_params['duration']], [best_params['temp']], s=200, marker='*',
          color='white', zorder=5, label='Global optimum')
ax.set_xlabel('Fermentation Time (h)', color='white')
ax.set_ylabel('Temperature (°C)', color='white')
ax.set_title('Quality Landscape', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax, shrink=0.8)

# N0 effect
ax = axes[0, 1]
ax.set_facecolor('#111827')
for N0 in [1e4, 1e5, 1e6, 1e7, 1e8]:
    scores_n = []
    for dur in time_grid:
        LA, G, Am, Et, AA = quick_sim_opt(duration=dur, temp=30, N0=N0)
        scores_n.append(quality_func(LA, G, Am, Et, AA))
    ax.plot(time_grid, scores_n, 'o-', linewidth=1.5, markersize=3, label=f'N₀={N0:.0e}')
ax.set_xlabel('Fermentation Time (h)', color='white')
ax.set_ylabel('Quality Score', color='white')
ax.set_title('Starter Culture Size Effect', color='white')
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Robustness comparison
ax = axes[0, 2]
ax.set_facecolor('#111827')
labels = [f"{r['config']['temp']:.0f}°C/{r['config']['duration']:.0f}h" for r in robustness_results]
means = [r['mean'] for r in robustness_results]
stds = [r['std'] for r in robustness_results]
robust = [r['robust_score'] for r in robustness_results]
x_pos = range(len(labels))
ax.bar(x_pos, means, yerr=stds, color='#3b82f6', alpha=0.7, capsize=5, label='Mean ± std')
ax.plot(x_pos, robust, 'D', color='#f59e0b', markersize=8, label='Robust score')
ax.set_xticks(x_pos)
ax.set_xticklabels(labels, rotation=30, color='white', fontsize=7)
ax.set_ylabel('Quality Score', color='white')
ax.set_title('Robustness Analysis', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Distribution of quality for each config
ax = axes[1, 0]
ax.set_facecolor('#111827')
colors_box = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7']
bp = ax.boxplot([r['scores'] for r in robustness_results], patch_artist=True)
for patch, col in zip(bp['boxes'], colors_box):
    patch.set_facecolor(col); patch.set_alpha(0.5)
for element in ['whiskers', 'caps', 'medians']:
    for line in bp[element]:
        line.set_color('white')
ax.set_xticklabels(labels, rotation=30, color='white', fontsize=7)
ax.set_ylabel('Quality Score', color='white')
ax.set_title('Quality Distribution Under Noise', color='white')
ax.tick_params(colors='gray')

# Pareto front: optimality vs robustness
ax = axes[1, 1]
ax.set_facecolor('#111827')
for i, r in enumerate(robustness_results):
    ax.scatter([r['mean']], [r['std']], s=100, color=colors_box[i], zorder=5,
              label=labels[i], edgecolors='white')
ax.set_xlabel('Mean Quality (higher = better)', color='white')
ax.set_ylabel('Quality Std (lower = more robust)', color='white')
ax.set_title('Pareto Front: Quality vs Consistency', color='white')
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Sensitivity analysis
ax = axes[1, 2]
ax.set_facecolor('#111827')
base_LA, base_G, base_Am, base_Et, base_AA = quick_sim_opt(
    duration=best_params['duration'], temp=best_params['temp'], N0=best_params['N0'])
base_q = quality_func(base_LA, base_G, base_Am, base_Et, base_AA)

perturbations = np.linspace(-20, 20, 50)  # percent change
param_names = ['Temperature', 'Duration', 'Starter (log)']
for pi, (pname, base_val) in enumerate(zip(param_names,
    [best_params['temp'], best_params['duration'], np.log10(best_params['N0'])])):
    sens = []
    for pct in perturbations:
        if pname == 'Temperature':
            LA, G, Am, Et, AA = quick_sim_opt(temp=base_val*(1+pct/100),
                duration=best_params['duration'], N0=best_params['N0'])
        elif pname == 'Duration':
            LA, G, Am, Et, AA = quick_sim_opt(duration=max(4, base_val*(1+pct/100)),
                temp=best_params['temp'], N0=best_params['N0'])
        else:
            LA, G, Am, Et, AA = quick_sim_opt(N0=10**(base_val+pct/100),
                temp=best_params['temp'], duration=best_params['duration'])
        sens.append(quality_func(LA, G, Am, Et, AA))
    ax.plot(perturbations, sens, linewidth=2, label=pname)
ax.axhline(y=base_q, color='white', linestyle='--', alpha=0.3)
ax.set_xlabel('Parameter Change (%)', color='white')
ax.set_ylabel('Quality Score', color='white')
ax.set_title('Sensitivity Analysis', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

best_robust = max(robustness_results, key=lambda r: r['robust_score'])
print("\
OPTIMIZATION RESULTS")
print("=" * 60)
print(f"Global optimum: {best_params['temp']:.1f}°C, {best_params['duration']:.1f}h, "
      f"N0={best_params['N0']:.0e} -> Q={best_score:.3f}")
print(f"Most robust:    {best_robust['config']['temp']:.0f}°C, {best_robust['config']['duration']:.0f}h -> "
      f"mean={best_robust['mean']:.3f}, std={best_robust['std']:.3f}")`,
      challenge: 'Implement a simple genetic algorithm: start with 20 random parameter sets, evaluate quality, keep the top 50%, mutate them to create 20 new candidates, repeat for 10 generations. Compare the result with grid search.',
      successHint: 'Grid search is brute-force but guaranteed to find the optimum within its resolution. For 3-4 parameters it is practical; for 10+ parameters, smarter methods (genetic algorithms, Bayesian optimization) are needed. The robustness analysis is the most valuable output — it tells you which parameters matter and which can be approximate.',
    },
    {
      title: 'Quality Control and Process Monitoring',
      concept: `Module 4 implements real-time process monitoring. In a production setting, you cannot wait until the end to check if fermentation went well — you need **in-process measurements** that predict the final quality early enough to intervene.

**Statistical Process Control (SPC)** uses control charts to track process variables over time. For each variable (pH, temperature, bacterial count), we define:
- **Center line**: the target value
- **Upper/Lower Control Limits (UCL/LCL)**: typically set at mean ± 3σ from historical data
- **Warning limits**: at mean ± 2σ

A process is "in control" when all measurements fall within the control limits AND show no systematic patterns (trends, cycles, or runs). A single point outside 3σ, or 7 consecutive points on one side of the center line, signals a problem.

For pitha fermentation, the key monitoring variables are:
1. **pH at 4 hours**: should be 5.5-6.0 (early indicator of active fermentation)
2. **pH at 8 hours**: should be 4.5-5.0 (mid-point check)
3. **Volume increase at 6 hours**: should be >10% (gas production indicator)
4. **Final pH**: should be 3.8-4.5 (safety and flavor)`,
      analogy: 'SPC is like a car dashboard. You do not wait until the engine seizes to check the oil pressure — warning lights alert you early. Similarly, checking pH at the 4-hour mark is like checking oil pressure: a reading outside the expected range means something is wrong (wrong temperature? dead starter culture?) and you can fix it before the whole batch is ruined.',
      storyConnection: 'Grandmother checks the batter at specific times during fermentation — a quick sniff, a poke, a taste. Each check is an in-process measurement. She knows what "right" looks and smells like at each stage. Our SPC system formalizes this intuition into quantitative control charts with precise accept/reject criteria.',
      checkQuestion: 'Why are control limits set at 3σ rather than 2σ or 4σ?',
      checkAnswer: 'It is a trade-off between false alarms and missed problems. At 2σ, about 5% of points from a perfectly good process will randomly fall outside limits (false alarms — you investigate but find nothing wrong). At 4σ, only 0.006% trigger false alarms, but you might miss real problems because the limits are too wide. 3σ (0.27% false alarm rate, or about 1 in 370 points) is the traditional compromise. In food production, where investigating a false alarm costs time but missing a real problem costs an entire batch, 3σ is a reasonable balance.',
      codeIntro: 'Build a process monitoring system with control charts and early warning indicators.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# ============================================================
# FERMENTATION PROCESS OPTIMIZER — Module 4: Quality Control
# ============================================================

class ProcessMonitor:
    """Statistical Process Control for pitha fermentation."""

    def __init__(self):
        self.specs = {
            'pH_4h': {'target': 5.8, 'UCL': 6.2, 'LCL': 5.3},
            'pH_8h': {'target': 4.8, 'UCL': 5.2, 'LCL': 4.3},
            'pH_final': {'target': 4.1, 'UCL': 4.5, 'LCL': 3.6},
            'rise_6h': {'target': 15, 'UCL': 35, 'LCL': 5},
        }

    def evaluate_batch(self, pH_4h, pH_8h, pH_final, rise_6h):
        """Evaluate a single batch against specifications."""
        results = {}
        for name, val in [('pH_4h', pH_4h), ('pH_8h', pH_8h),
                          ('pH_final', pH_final), ('rise_6h', rise_6h)]:
            spec = self.specs[name]
            in_spec = spec['LCL'] <= val <= spec['UCL']
            deviation = (val - spec['target']) / (spec['UCL'] - spec['target'])
            results[name] = {'value': val, 'in_spec': in_spec, 'deviation': deviation}
        overall = all(r['in_spec'] for r in results.values())
        return results, overall

# --- Simulate 100 batches with varying quality ---
n_batches = 100
monitor = ProcessMonitor()

# Normal batches (80%), problematic (15%), failed (5%)
pH_4h_all = np.concatenate([
    np.random.normal(5.8, 0.2, 80),
    np.random.normal(6.3, 0.3, 15),
    np.random.normal(6.8, 0.2, 5),
])
pH_8h_all = np.concatenate([
    np.random.normal(4.8, 0.2, 80),
    np.random.normal(5.3, 0.3, 15),
    np.random.normal(5.8, 0.3, 5),
])
pH_final_all = np.concatenate([
    np.random.normal(4.1, 0.15, 80),
    np.random.normal(4.6, 0.2, 15),
    np.random.normal(5.2, 0.2, 5),
])
rise_6h_all = np.concatenate([
    np.random.normal(15, 4, 80),
    np.random.normal(8, 3, 15),
    np.random.normal(3, 2, 5),
])

# Evaluate all batches
pass_fail = []
for i in range(n_batches):
    _, ok = monitor.evaluate_batch(pH_4h_all[i], pH_8h_all[i], pH_final_all[i], rise_6h_all[i])
    pass_fail.append(ok)
pass_fail = np.array(pass_fail)

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Fermentation Process Optimizer — Quality Control', color='white', fontsize=14)

# --- pH at 4h control chart ---
ax = axes[0, 0]
ax.set_facecolor('#111827')
spec = monitor.specs['pH_4h']
ax.plot(range(n_batches), pH_4h_all, 'o', markersize=4,
       color=np.where(pass_fail, '#22c55e', '#ef4444'))
ax.axhline(y=spec['target'], color='white', linewidth=2, label='Target')
ax.axhline(y=spec['UCL'], color='#ef4444', linestyle='--', label='UCL')
ax.axhline(y=spec['LCL'], color='#ef4444', linestyle='--', label='LCL')
ax.fill_between(range(n_batches), spec['LCL'], spec['UCL'], alpha=0.05, color='white')
ax.set_xlabel('Batch #', color='white')
ax.set_ylabel('pH at 4h', color='white')
ax.set_title('Control Chart: pH at 4 Hours', color='white')
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- Volume rise control chart ---
ax = axes[0, 1]
ax.set_facecolor('#111827')
spec = monitor.specs['rise_6h']
colors_batch = ['#22c55e' if rise_6h_all[i] >= spec['LCL'] and rise_6h_all[i] <= spec['UCL']
                else '#ef4444' for i in range(n_batches)]
ax.bar(range(n_batches), rise_6h_all, color=colors_batch, alpha=0.7, width=1)
ax.axhline(y=spec['target'], color='white', linewidth=2)
ax.axhline(y=spec['UCL'], color='#ef4444', linestyle='--')
ax.axhline(y=spec['LCL'], color='#ef4444', linestyle='--')
ax.set_xlabel('Batch #', color='white')
ax.set_ylabel('Volume Rise at 6h (%)', color='white')
ax.set_title('Control Chart: Batter Rising', color='white')
ax.tick_params(colors='gray')

# --- Pass/Fail summary ---
ax = axes[0, 2]
ax.set_facecolor('#111827')
n_pass = pass_fail.sum()
n_fail = n_batches - n_pass
ax.pie([n_pass, n_fail], labels=[f'Pass ({n_pass})', f'Fail ({n_fail})'],
       colors=['#22c55e', '#ef4444'], autopct='%1.0f%%',
       textprops={'color': 'white', 'fontsize': 12})
ax.set_title('Batch Pass/Fail Rate', color='white')

# --- Correlation: pH_4h predicts final quality ---
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.scatter(pH_4h_all[pass_fail], pH_final_all[pass_fail], color='#22c55e', s=20, alpha=0.7, label='Pass')
ax.scatter(pH_4h_all[~pass_fail], pH_final_all[~pass_fail], color='#ef4444', s=40, alpha=0.9, label='Fail')
# Decision boundary
ax.axvline(x=6.2, color='#f59e0b', linestyle='--', label='pH 4h threshold')
ax.axhline(y=4.5, color='#f59e0b', linestyle=':', label='pH final threshold')
ax.set_xlabel('pH at 4 hours', color='white')
ax.set_ylabel('Final pH', color='white')
ax.set_title('Early Prediction: pH at 4h vs Final pH', color='white')
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- CUSUM chart (cumulative sum for trend detection) ---
ax = axes[1, 1]
ax.set_facecolor('#111827')
target_pH = 4.1
cusum_pos = np.zeros(n_batches)
cusum_neg = np.zeros(n_batches)
k = 0.15  # allowance
h = 3.0   # decision interval
for i in range(1, n_batches):
    cusum_pos[i] = max(0, cusum_pos[i-1] + (pH_final_all[i] - target_pH) - k)
    cusum_neg[i] = max(0, cusum_neg[i-1] - (pH_final_all[i] - target_pH) - k)
ax.plot(range(n_batches), cusum_pos, color='#ef4444', linewidth=1.5, label='CUSUM+ (upward shift)')
ax.plot(range(n_batches), cusum_neg, color='#3b82f6', linewidth=1.5, label='CUSUM- (downward shift)')
ax.axhline(y=h, color='#ef4444', linestyle='--', alpha=0.5, label=f'Alarm threshold (h={h})')
ax.set_xlabel('Batch #', color='white')
ax.set_ylabel('CUSUM Statistic', color='white')
ax.set_title('CUSUM Chart: Detecting Process Drift', color='white')
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- Process capability ---
ax = axes[1, 2]
ax.set_facecolor('#111827')
good_pH = pH_final_all[pass_fail]
mu_ph = good_pH.mean()
sigma_ph = good_pH.std()
USL = 4.5; LSL = 3.6
Cp = (USL - LSL) / (6 * sigma_ph)
Cpk = min((USL - mu_ph) / (3 * sigma_ph), (mu_ph - LSL) / (3 * sigma_ph))

x_hist = np.linspace(3.0, 5.5, 100)
pdf = 1/(sigma_ph*np.sqrt(2*np.pi)) * np.exp(-0.5*((x_hist-mu_ph)/sigma_ph)**2)
ax.hist(pH_final_all, bins=20, density=True, alpha=0.4, color='#3b82f6')
ax.plot(x_hist, pdf, color='#22c55e', linewidth=2)
ax.axvline(x=USL, color='#ef4444', linewidth=2, linestyle='--', label=f'USL={USL}')
ax.axvline(x=LSL, color='#ef4444', linewidth=2, linestyle='--', label=f'LSL={LSL}')
ax.set_xlabel('Final pH', color='white')
ax.set_ylabel('Density', color='white')
ax.set_title(f'Process Capability: Cp={Cp:.2f}, Cpk={Cpk:.2f}', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("QUALITY CONTROL SUMMARY")
print("=" * 50)
print(f"Batches: {n_batches} total, {n_pass} pass ({n_pass/n_batches:.0%}), {n_fail} fail")
print(f"Process capability: Cp={Cp:.2f}, Cpk={Cpk:.2f}")
print(f"  Cp > 1.33: process is capable")
print(f"  Cpk > 1.0: process is centered within specs")
alarm_batches = np.where((cusum_pos > h) | (cusum_neg > h))[0]
if len(alarm_batches) > 0:
    print(f"CUSUM alarm triggered at batch(es): {alarm_batches}")
else:
    print("No CUSUM alarms — process is stable")`,
      challenge: 'Add a "corrective action recommender": when pH at 4h is too high (fermentation too slow), suggest raising temperature by X degrees or adding fresh starter. Compute the recommended correction magnitude.',
      successHint: 'SPC transforms food production from art to engineering. Control charts, CUSUM charts, and process capability indices are used in every modern food factory. The key insight is monitoring trends, not just individual points — a gradual drift caught at batch 20 is better than a failure caught at batch 50.',
    },
    {
      title: 'Recipe Adaptation and Regional Variation',
      concept: `The final module addresses the practical question: how do you adapt grandmother's recipe for different conditions? Different rice varieties, different climates, different preferences — the optimizer must handle all of these.

**Transfer learning** in the culinary context: if you have optimized fermentation for Bora rice in Assam (humid, 30°C ambient), how do you quickly adapt for Sona Masoori in Hyderabad (drier, 35°C ambient) or Jasmine rice in Thailand? The underlying biochemistry is the same, but the parameters shift.

Key regional variables:
- **Rice starch content**: waxy rice (2% amylose) vs long-grain (28% amylose) — affects gelatinization and sugar availability
- **Ambient temperature**: tropical (28-35°C) vs temperate (15-25°C) — affects growth rate
- **Humidity**: affects water evaporation from uncovered batter
- **Available starter cultures**: commercial vs traditional (different microbial communities)

The optimizer re-runs with adjusted parameters and outputs adapted recipes: "For your conditions, ferment at X°C for Y hours with Z grams of starter per kg of rice."`,
      analogy: 'Recipe adaptation is like translating a book. The story (biochemistry) stays the same, but the language (parameters) changes. A good translator preserves meaning while adapting to the new language. Our optimizer preserves the target flavor while adapting to new rice varieties, temperatures, and conditions. The pitha should taste like grandmother\'s no matter where or what rice you use.',
      storyConnection: 'Grandmother\'s recipe works perfectly in her kitchen because she has unconsciously optimized for her specific rice, her specific temperature, and her specific starter culture. The adaptation module generalizes her genius — making her recipe work in any kitchen, with any rice, at any temperature. Her knowledge becomes universal.',
      checkQuestion: 'A cook in Delhi (winter, 15°C ambient) follows grandmother\'s Assam recipe (optimized for 30°C) exactly. What goes wrong and how should they adapt?',
      checkAnswer: 'At 15°C, bacterial growth rate is roughly 10x slower (Arrhenius). The batter barely rises in 12 hours. The cook should either: (1) find a warmer spot (near a heater, in an oven with just the light on), (2) extend fermentation to 24-36 hours, (3) increase starter culture by 10x to compensate for slower growth, or (4) use a combination. Option 1 is simplest if available. The optimizer would find the optimal combination for 15°C conditions.',
      codeIntro: 'Build the recipe adaptation module that adjusts fermentation parameters for different conditions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# ============================================================
# FERMENTATION PROCESS OPTIMIZER — Module 5: Recipe Adaptation
# ============================================================

class RecipeAdapter:
    """Adapts pitha recipe for different conditions."""

    def __init__(self):
        self.rice_varieties = {
            'Bora (Assam)': {'amylose': 15, 'starch': 50, 'gelat_temp': 68},
            'Joha (Assam)': {'amylose': 22, 'starch': 48, 'gelat_temp': 72},
            'Waxy Sticky': {'amylose': 2, 'starch': 55, 'gelat_temp': 62},
            'Sona Masoori': {'amylose': 24, 'starch': 45, 'gelat_temp': 73},
            'Jasmine': {'amylose': 18, 'starch': 47, 'gelat_temp': 70},
            'Basmati': {'amylose': 28, 'starch': 42, 'gelat_temp': 75},
        }

    def sim_with_rice(self, rice_name, temp, duration, N0=1e6):
        rice = self.rice_varieties[rice_name]
        starch = rice['starch']
        # Higher amylose = slower enzyme access = slower sugar release
        amylase_factor = 1.0 - 0.01 * (rice['amylose'] - 15)

        dt = 0.02; steps = int(duration/dt)
        mu_max = 0.85 * np.exp(-0.05*(temp-30)**2) * amylase_factor
        N, S, G, LA = N0, float(starch), 2.0, 0.0
        for _ in range(steps):
            mu = mu_max * G/(0.5+G) * 15/(15+LA)
            cons = mu*N/1e8*dt
            amyl = 3.0*amylase_factor*S/(8+S)*dt
            N += mu*N*dt; S = max(S-amyl, 0); G = max(G+amyl*0.8-cons, 0)
            LA += cons*0.8
        pH_final = max(6.5 - LA*0.15, 3.0)
        # Quality
        sour = min(10, 10*(LA/2)**0.85/(1+(LA/2)**0.85))
        sweet = min(10, 10*(G/3)**1.3/(1+(G/3)**1.3))
        dist = (sour-6)**2 + (sweet-4)**2
        quality = 10 * np.exp(-dist/50)
        return {'pH': pH_final, 'LA': LA, 'glucose': G, 'quality': quality, 'sour': sour, 'sweet': sweet}

    def optimize_for_conditions(self, rice_name, ambient_temp):
        """Find optimal fermentation time and adjustments."""
        best_q = 0
        best_dur = 8
        best_N0 = 1e6
        for dur in np.linspace(4, 24, 40):
            for n0_exp in np.linspace(4, 8, 10):
                result = self.sim_with_rice(rice_name, ambient_temp, dur, N0=10**n0_exp)
                if result['quality'] > best_q:
                    best_q = result['quality']
                    best_dur = dur
                    best_N0 = 10**n0_exp
        return best_dur, best_N0, best_q

adapter = RecipeAdapter()

# --- Optimize for each rice variety at different temperatures ---
temps = [20, 25, 30, 35]
rice_names = list(adapter.rice_varieties.keys())

results_grid = {}
for rice in rice_names:
    results_grid[rice] = {}
    for temp in temps:
        dur, N0, q = adapter.optimize_for_conditions(rice, temp)
        results_grid[rice][temp] = {'duration': dur, 'N0': N0, 'quality': q}

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Fermentation Process Optimizer — Recipe Adaptation', color='white', fontsize=14)

# --- Optimal time by rice and temperature ---
ax = axes[0, 0]
ax.set_facecolor('#111827')
colors_rice = plt.cm.Set2(np.linspace(0, 1, len(rice_names)))
for i, rice in enumerate(rice_names):
    durations = [results_grid[rice][t]['duration'] for t in temps]
    ax.plot(temps, durations, 'o-', color=colors_rice[i], linewidth=2, markersize=6,
            label=rice.split('(')[0].strip())
ax.set_xlabel('Ambient Temperature (°C)', color='white')
ax.set_ylabel('Optimal Fermentation Time (h)', color='white')
ax.set_title('Adapted Fermentation Time', color='white')
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- Quality achievable by rice variety ---
ax = axes[0, 1]
ax.set_facecolor('#111827')
for i, rice in enumerate(rice_names):
    qualities = [results_grid[rice][t]['quality'] for t in temps]
    ax.plot(temps, qualities, 'o-', color=colors_rice[i], linewidth=2, markersize=6,
            label=rice.split('(')[0].strip())
ax.set_xlabel('Ambient Temperature (°C)', color='white')
ax.set_ylabel('Achievable Quality (0-10)', color='white')
ax.set_title('Quality by Rice Variety', color='white')
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- Starter culture recommendation ---
ax = axes[0, 2]
ax.set_facecolor('#111827')
for i, rice in enumerate(rice_names):
    n0s = [np.log10(results_grid[rice][t]['N0']) for t in temps]
    ax.plot(temps, n0s, 'o-', color=colors_rice[i], linewidth=2, markersize=6,
            label=rice.split('(')[0].strip())
ax.set_xlabel('Ambient Temperature (°C)', color='white')
ax.set_ylabel('Optimal Starter (log₁₀ CFU/mL)', color='white')
ax.set_title('Starter Culture Recommendation', color='white')
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- Rice variety comparison at 30°C ---
ax = axes[1, 0]
ax.set_facecolor('#111827')
time_range = np.linspace(4, 20, 50)
for i, rice in enumerate(rice_names):
    q_curve = [adapter.sim_with_rice(rice, 30, d)['quality'] for d in time_range]
    ax.plot(time_range, q_curve, color=colors_rice[i], linewidth=2,
            label=rice.split('(')[0].strip())
ax.set_xlabel('Fermentation Time (h)', color='white')
ax.set_ylabel('Quality', color='white')
ax.set_title('Quality Curves at 30°C by Rice Variety', color='white')
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# --- Amylose content effect ---
ax = axes[1, 1]
ax.set_facecolor('#111827')
amylose_vals = [adapter.rice_varieties[r]['amylose'] for r in rice_names]
qual_30 = [results_grid[r][30]['quality'] for r in rice_names]
dur_30 = [results_grid[r][30]['duration'] for r in rice_names]
ax.scatter(amylose_vals, qual_30, s=100, c=[colors_rice[i] for i in range(len(rice_names))],
          edgecolors='white', zorder=5)
for i, rice in enumerate(rice_names):
    ax.annotate(rice.split('(')[0].strip()[:8], (amylose_vals[i], qual_30[i]),
               xytext=(5,5), textcoords='offset points', color='white', fontsize=7)
ax.set_xlabel('Amylose Content (%)', color='white')
ax.set_ylabel('Achievable Quality at 30°C', color='white')
ax.set_title('Amylose vs Fermentation Quality', color='white')
ax.tick_params(colors='gray')

# --- Recipe card ---
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.axis('off')
recipe = "ADAPTED RECIPE CARD\
" + "=" * 40 + "\
\
"
for rice in rice_names[:4]:
    r = results_grid[rice][30]
    recipe += f"{rice}:\
"
    recipe += f"  Ferment: {r['duration']:.0f}h at 30°C\
"
    recipe += f"  Starter: {r['N0']:.0e} CFU/mL\
"
    recipe += f"  Expected quality: {r['quality']:.1f}/10\
\
"
ax.text(0.05, 0.95, recipe, transform=ax.transAxes, fontsize=9, color='white',
        verticalalignment='top', fontfamily='monospace')

plt.tight_layout()
plt.show()

print("RECIPE ADAPTATION COMPLETE")
print("=" * 60)
print(f"\
{'Rice Variety':<18} {'Temp':>5} {'Time(h)':>8} {'Starter':>10} {'Quality':>8}")
print("-" * 51)
for rice in rice_names:
    for temp in [25, 30, 35]:
        r = results_grid[rice][temp]
        print(f"{rice[:17]:<18} {temp:>4}°C {r['duration']:>7.0f} {r['N0']:>10.0e} {r['quality']:>8.2f}")`,
      challenge: 'Add altitude adaptation: at higher altitudes, atmospheric pressure is lower, which affects CO₂ solubility and water boiling point. Adjust the model for elevations from sea level to 3000m and show how the recipe changes.',
      successHint: 'Recipe adaptation is where the optimizer becomes practically useful. Anyone can make pitha with the exact same rice and kitchen as grandmother. The real value is making equivalent pitha with different ingredients in a different climate — that requires understanding the underlying science deeply enough to transfer it.',
    },
    {
      title: 'Deployment: The Complete Fermentation Process Optimizer',
      concept: `The final step integrates all modules into a single Fermentation Process Optimizer with a clean API. The system accepts input conditions, simulates the fermentation, predicts the sensory profile, optimizes parameters, monitors quality, and adapts recipes — all in one pipeline.

This capstone demonstrates the complete arc from grandmother's intuitive recipe to a computational tool that any food scientist can use. The optimizer does not replace tradition — it explains, extends, and preserves it. By encoding grandmother's knowledge in mathematical models, we ensure it survives and spreads even if the oral tradition is interrupted.

The production system needs: (1) input validation (reject impossible conditions), (2) simulation with uncertainty quantification, (3) sensory prediction with confidence intervals, (4) optimization with robustness guarantees, and (5) a human-readable report.`,
      analogy: 'The complete optimizer is like a GPS navigation system for cooking. You tell it where you are (your ingredients, kitchen, climate) and where you want to go (grandmother\'s pitha flavor), and it calculates the route (recipe parameters). If conditions change en route (temperature drops overnight), it recalculates. The destination — perfect pitha — stays the same.',
      storyConnection: 'Grandmother\'s pitha recipe is a treasure of Assamese culture. By encoding it in a computational model, we do not diminish it — we honor it. The optimizer reveals the deep science behind every step: the microbiology of fermentation, the chemistry of starch, the physics of gas bubbles, the psychology of taste. Grandmother always knew it worked. Now we know why.',
      checkQuestion: 'If the optimizer could perfectly replicate grandmother\'s pitha every time, would that make grandmother obsolete?',
      checkAnswer: 'No. The optimizer captures the quantifiable aspects of pitha-making — temperature, time, pH, acid concentration. But grandmother brings unquantifiable qualities: the social experience of making pitha together, the cultural meaning of traditional preparation, the ability to improvise when something unexpected happens, and the continuous innovation that creates new varieties. The optimizer preserves and extends her knowledge; it does not replace her creative and cultural role.',
      codeIntro: 'Integrate all modules into the complete Fermentation Process Optimizer with a unified pipeline.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# ============================================================
# FERMENTATION PROCESS OPTIMIZER — Complete System
# ============================================================

class FermentationOptimizer:
    """Complete fermentation process optimizer for pitha."""

    def __init__(self):
        self.rice_db = {
            'Bora': {'amylose': 15, 'starch': 50},
            'Joha': {'amylose': 22, 'starch': 48},
            'Waxy': {'amylose': 2, 'starch': 55},
        }

    def validate_inputs(self, rice, temp, duration, N0):
        errors = []
        if rice not in self.rice_db:
            errors.append(f"Unknown rice: {rice}. Options: {list(self.rice_db.keys())}")
        if not 10 <= temp <= 50:
            errors.append(f"Temperature {temp}°C out of range [10, 50]")
        if not 2 <= duration <= 48:
            errors.append(f"Duration {duration}h out of range [2, 48]")
        if not 1e2 <= N0 <= 1e10:
            errors.append(f"Starter {N0:.0e} out of range [1e2, 1e10]")
        return errors

    def simulate(self, rice, temp, duration, N0):
        params = self.rice_db[rice]
        factor = 1.0 - 0.01*(params['amylose'] - 15)
        dt = 0.02; steps = int(duration/dt)
        t = np.linspace(0, duration, steps)
        mu_max = 0.85 * np.exp(-0.05*(temp-30)**2) * factor

        N = np.zeros(steps); S = np.zeros(steps); G = np.zeros(steps)
        LA = np.zeros(steps); pH_arr = np.zeros(steps)
        CO2 = np.zeros(steps); vol = np.zeros(steps)
        N[0]=N0; S[0]=params['starch']; G[0]=2.0; pH_arr[0]=6.5; vol[0]=1.0

        for i in range(1, steps):
            mu = mu_max*G[i-1]/(0.5+G[i-1])*15/(15+LA[i-1])
            cons = mu*N[i-1]/1e8*dt; amyl = 3.0*factor*S[i-1]/(8+S[i-1])*dt
            N[i]=N[i-1]+mu*N[i-1]*dt; S[i]=max(S[i-1]-amyl,0)
            G[i]=max(G[i-1]+amyl*0.8-cons,0); LA[i]=LA[i-1]+cons*0.8
            pH_arr[i]=max(6.5-LA[i]*0.15,3.0); CO2[i]=CO2[i-1]+cons*0.15/44
            kH=0.034*np.exp(2400*(1/(temp+273.15)-1/298.15))
            gas=max(CO2[i]-kH,0); vol[i]=1+gas*0.0821*(temp+273.15)*0.7

        return {'time': t, 'bacteria': N, 'starch': S, 'glucose': G,
                'lactic_acid': LA, 'pH': pH_arr, 'CO2': CO2, 'volume': vol}

    def predict_flavor(self, LA, G):
        def inten(c, thr, pwr):
            r=c/thr; return min(10, 10*r**pwr/(1+r**pwr))
        sour = inten(LA, 2.0, 0.85)
        sweet = inten(G, 3.0, 1.3)
        dist = (sour-6)**2 + (sweet-4)**2
        quality = 10*np.exp(-dist/50)
        return {'sour': sour, 'sweet': sweet, 'quality': quality}

    def optimize(self, rice, temp, n_grid=20):
        best_q = 0; best_dur = 8; best_N0 = 1e6
        for dur in np.linspace(4, 24, n_grid):
            for n0_exp in np.linspace(4, 8, n_grid//2):
                r = self.simulate(rice, temp, dur, 10**n0_exp)
                f = self.predict_flavor(r['lactic_acid'][-1], r['glucose'][-1])
                if f['quality'] > best_q:
                    best_q=f['quality']; best_dur=dur; best_N0=10**n0_exp
        return best_dur, best_N0, best_q

    def generate_report(self, rice, temp, duration, N0, sim_results, flavor):
        lines = [
            "=" * 55,
            "  FERMENTATION PROCESS OPTIMIZER — REPORT",
            "=" * 55,
            f"\
Rice variety: {rice} (amylose {self.rice_db[rice]['amylose']}%)",
            f"Temperature: {temp}°C",
            f"Duration: {duration:.1f} hours",
            f"Starter culture: {N0:.0e} CFU/mL",
            f"\
--- SIMULATION RESULTS ---",
            f"Final pH: {sim_results['pH'][-1]:.2f}",
            f"Lactic acid: {sim_results['lactic_acid'][-1]:.1f} g/L",
            f"Residual sugar: {sim_results['glucose'][-1]:.1f} g/L",
            f"Volume rise: {(sim_results['volume'][-1]-1)*100:.0f}%",
            f"\
--- FLAVOR PREDICTION ---",
            f"Sour intensity: {flavor['sour']:.1f}/10",
            f"Sweet intensity: {flavor['sweet']:.1f}/10",
            f"Overall quality: {flavor['quality']:.1f}/10",
        ]
        return "\
".join(lines)

# ============================================================
# RUN COMPLETE PIPELINE
# ============================================================
opt = FermentationOptimizer()

# Optimize for Bora rice at 30°C
best_dur, best_N0, best_q = opt.optimize('Bora', 30)
print(f"Optimized: {best_dur:.1f}h, N0={best_N0:.0e}, quality={best_q:.2f}")

# Validate and simulate
errors = opt.validate_inputs('Bora', 30, best_dur, best_N0)
print(f"Validation: {'PASSED' if not errors else errors}")

results = opt.simulate('Bora', 30, best_dur, best_N0)
flavor = opt.predict_flavor(results['lactic_acid'][-1], results['glucose'][-1])
report = opt.generate_report('Bora', 30, best_dur, best_N0, results, flavor)

# Compare all three rice varieties
fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('FERMENTATION PROCESS OPTIMIZER — Complete Results', color='white', fontsize=14, fontweight='bold')

t = results['time']
colors_v = {'Bora': '#22c55e', 'Joha': '#3b82f6', 'Waxy': '#f59e0b'}

# Multi-rice comparison
ax = axes[0, 0]
ax.set_facecolor('#111827')
for rice, col in colors_v.items():
    d, n, q = opt.optimize(rice, 30)
    r = opt.simulate(rice, 30, d, n)
    ax.plot(r['time'], r['pH'], color=col, linewidth=2, label=f'{rice} ({d:.0f}h)')
ax.axhline(y=4.5, color='white', linestyle='--', alpha=0.3)
ax.set_xlabel('Time (h)', color='white')
ax.set_ylabel('pH', color='white')
ax.set_title('pH Trajectory (optimized for each rice)', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Optimized results
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.semilogy(t, results['bacteria'], color='#22c55e', linewidth=2, label='Bacteria')
ax2 = ax.twinx()
ax2.plot(t, results['lactic_acid'], color='#ef4444', linewidth=2, label='Lactic acid')
ax.set_xlabel('Time (h)', color='white')
ax.set_ylabel('Bacteria (CFU/mL)', color='#22c55e')
ax2.set_ylabel('Lactic acid (g/L)', color='#ef4444')
ax.set_title('Optimized Bora Fermentation', color='white')
ax.tick_params(colors='gray'); ax2.tick_params(colors='gray')

# Volume and CO2
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.plot(t, (results['volume']-1)*100, color='#22c55e', linewidth=2, label='Volume rise')
ax2 = ax.twinx()
ax2.plot(t, results['CO2']*1000, color='#3b82f6', linewidth=2, label='CO₂')
ax.set_xlabel('Time (h)', color='white')
ax.set_ylabel('Volume Rise (%)', color='#22c55e')
ax2.set_ylabel('CO₂ (mmol/L)', color='#3b82f6')
ax.set_title('Gas Dynamics', color='white')
ax.tick_params(colors='gray'); ax2.tick_params(colors='gray')

# Quality comparison across temperatures
ax = axes[1, 0]
ax.set_facecolor('#111827')
temps_test = np.linspace(18, 40, 25)
for rice, col in colors_v.items():
    qs = []
    for tmp in temps_test:
        _, _, q = opt.optimize(rice, tmp)
        qs.append(q)
    ax.plot(temps_test, qs, 'o-', color=col, linewidth=2, markersize=3, label=rice)
ax.set_xlabel('Temperature (°C)', color='white')
ax.set_ylabel('Achievable Quality', color='white')
ax.set_title('Quality vs Temperature by Rice', color='white')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Robustness check
ax = axes[1, 1]
ax.set_facecolor('#111827')
n_robust = 40
for rice, col in colors_v.items():
    d, n, _ = opt.optimize(rice, 30)
    robust_q = []
    for _ in range(n_robust):
        tmp_v = 30 + np.random.normal(0, 2)
        dur_v = d + np.random.normal(0, 1)
        n0_v = n * 10**np.random.normal(0, 0.3)
        r = opt.simulate(rice, tmp_v, max(4, dur_v), n0_v)
        f = opt.predict_flavor(r['lactic_acid'][-1], r['glucose'][-1])
        robust_q.append(f['quality'])
    ax.hist(robust_q, bins=15, alpha=0.4, color=col, label=f'{rice} (μ={np.mean(robust_q):.1f})')
ax.set_xlabel('Quality Score', color='white')
ax.set_ylabel('Frequency', color='white')
ax.set_title('Robustness: Quality Under Noise', color='white')
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Report
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.axis('off')
ax.text(0.02, 0.98, report, transform=ax.transAxes, fontsize=7.5, color='white',
        verticalalignment='top', fontfamily='monospace')

plt.tight_layout()
plt.show()

print()
print(report)
print()
print("CAPSTONE COMPLETE")
print("=" * 55)
print("You built a Fermentation Process Optimizer from scratch:")
print("  1. Coupled ODE simulation (growth + enzymes + acid + gas)")
print("  2. Sensory prediction (Stevens' power law + quality scoring)")
print("  3. Grid search optimization with robustness analysis")
print("  4. Statistical process control (control charts + CUSUM)")
print("  5. Recipe adaptation for different rice varieties + climates")
print("  6. Integrated pipeline with validation and reporting")
print()
print("Skills: microbiology, biochemistry, food science, ODE modeling,")
print("optimization, statistical process control, sensory science.")`,
      challenge: 'Add a "grandmother mode": feed the optimizer a set of taste-test results from real pitha batches (scored by a human taster) and use them to calibrate the sensory prediction model via least-squares fitting. This closes the loop between computational prediction and human judgment.',
      successHint: 'You have completed a full capstone project: from microbial kinetics to a deployable Fermentation Process Optimizer. This system encodes grandmother\'s culinary wisdom in mathematical models that can be shared, adapted, and optimized computationally. The pitha recipe is now preserved not just in memory but in code.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (fermentation science and modeling)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project uses Python with numpy and matplotlib to build a complete Fermentation Process Optimizer. Click to start.</p>
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
            />
        ))}
      </div>
    </div>
  );
}
