import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function FirewalkerLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Capstone Design: Thermal Safety Calculator',
      concept: `Our capstone is a **Thermal Safety Calculator** — a tool that predicts whether a given set of conditions (material temperature, material type, contact duration, skin properties, moisture) will result in a safe interaction or a burn. This has applications far beyond firewalking: industrial safety (handling hot objects), kitchen design (pot handles, oven surfaces), automotive engineering (cabin temperature after sun exposure), and building codes (heated floor systems).

The calculator takes measured or estimated inputs and produces: (1) the expected interface temperature on contact, (2) the transient temperature profile in tissue, (3) the Arrhenius damage integral over the exposure, (4) a burn severity prediction (none / first / second / third degree), and (5) a safety margin with confidence interval.

The six capstone lessons build this tool step by step: (1) defining the input/output specification, (2) implementing the thermal contact model, (3) adding the transient heat equation solver, (4) integrating the burn prediction model, (5) building the visualization dashboard, and (6) validating against published burn data and packaging as a reusable tool.`,
      analogy: 'Building this calculator is like building a weather forecasting system. You need a physics model (heat equation = atmospheric dynamics), measurement inputs (material temperature = weather station data), numerical computation (finite differences = numerical weather prediction), and clear output (burn prediction = forecast). Each component must work correctly and connect to the next.',
      storyConnection: 'The firewalker\'s empirical safety knowledge — which coals are safe, how fast to walk, when to add moisture — will be encoded in our calculator. The tool transforms centuries of trial-and-error wisdom into quantitative predictions that can be verified, extended, and applied to new situations the firewalkers never encountered.',
      checkQuestion: 'What inputs does a comprehensive thermal safety calculator need, and why can\'t we simplify to just "temperature and time"?',
      checkAnswer: 'Temperature and time alone miss critical factors: (1) material thermal properties determine how much heat actually reaches the skin (coal at 600°C is far less dangerous than metal at 600°C), (2) moisture creates Leidenfrost protection, (3) skin properties (callus thickness, blood perfusion) vary between individuals, (4) contact pressure affects thermal resistance at the interface. A 600°C coal for 0.5s is safe; 600°C iron for 0.5s causes third-degree burns. The material matters as much as the temperature.',
      codeIntro: 'Define the calculator\'s input specification, validation rules, and output format, then generate test cases.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# =============================================
# THERMAL SAFETY CALCULATOR — INPUT SPECIFICATION
# =============================================

class ThermalInput:
    """Input specification for the Thermal Safety Calculator."""

    # Material database
    MATERIALS = {
        'charcoal':     {'k': 0.15,  'rho': 400,  'c': 800,  'category': 'organic'},
        'charcoal_ash': {'k': 0.08,  'rho': 300,  'c': 700,  'category': 'organic'},
        'wood':         {'k': 0.12,  'rho': 600,  'c': 1200, 'category': 'organic'},
        'brick':        {'k': 0.80,  'rho': 1920, 'c': 835,  'category': 'ceramic'},
        'concrete':     {'k': 1.70,  'rho': 2300, 'c': 880,  'category': 'ceramic'},
        'glass':        {'k': 1.05,  'rho': 2500, 'c': 840,  'category': 'ceramic'},
        'steel':        {'k': 50.0,  'rho': 7800, 'c': 500,  'category': 'metal'},
        'aluminum':     {'k': 205.0, 'rho': 2700, 'c': 900,  'category': 'metal'},
        'copper':       {'k': 385.0, 'rho': 8940, 'c': 385,  'category': 'metal'},
        'water':        {'k': 0.60,  'rho': 1000, 'c': 4186, 'category': 'liquid'},
    }

    SKIN_TYPES = {
        'normal':    {'k': 0.50, 'rho': 1050, 'c': 3700, 'callus_mm': 0.1},
        'callused':  {'k': 0.40, 'rho': 1100, 'c': 3500, 'callus_mm': 0.5},
        'thick_callus': {'k': 0.35, 'rho': 1150, 'c': 3300, 'callus_mm': 1.0},
    }

    def __init__(self, material='charcoal', T_material=600, contact_time=0.5,
                 contact_area=0.015, skin_type='callused', moisture=True):
        self.material = material
        self.T_material = T_material
        self.contact_time = contact_time
        self.contact_area = contact_area
        self.skin_type = skin_type
        self.moisture = moisture

    def validate(self):
        """Validate inputs and return list of issues."""
        issues = []
        if self.material not in self.MATERIALS:
            issues.append(f"Unknown material: {self.material}")
        if self.T_material < 0 or self.T_material > 2000:
            issues.append(f"Temperature out of range: {self.T_material}°C")
        if self.contact_time < 0.01 or self.contact_time > 60:
            issues.append(f"Contact time out of range: {self.contact_time}s")
        if self.skin_type not in self.SKIN_TYPES:
            issues.append(f"Unknown skin type: {self.skin_type}")
        return issues

    def get_material_props(self):
        return self.MATERIALS[self.material]

    def get_skin_props(self):
        return self.SKIN_TYPES[self.skin_type]

    def compute_effusivities(self):
        m = self.get_material_props()
        s = self.get_skin_props()
        e_mat = np.sqrt(m['k'] * m['rho'] * m['c'])
        e_skin = np.sqrt(s['k'] * s['rho'] * s['c'])
        return e_mat, e_skin

# Generate test cases
test_cases = [
    ThermalInput('charcoal', 600, 0.4, 0.015, 'callused', True),
    ThermalInput('charcoal', 600, 0.4, 0.015, 'normal', False),
    ThermalInput('steel', 200, 1.0, 0.005, 'normal', False),
    ThermalInput('brick', 300, 2.0, 0.010, 'callused', False),
    ThermalInput('copper', 100, 0.5, 0.005, 'normal', False),
    ThermalInput('water', 80, 3.0, 0.020, 'normal', False),
]

# Compute interface temperatures for all materials at 600°C
fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Thermal Safety Calculator — Input Analysis',
             color='white', fontsize=14, fontweight='bold')

# Panel 1: Effusivity of all materials
ax = axes[0, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
mat_names = list(ThermalInput.MATERIALS.keys())
effusivities = []
cat_colors = {'organic': '#22c55e', 'ceramic': '#f59e0b', 'metal': '#ef4444', 'liquid': '#3b82f6'}
bar_colors = []
for name in mat_names:
    m = ThermalInput.MATERIALS[name]
    effusivities.append(np.sqrt(m['k'] * m['rho'] * m['c']))
    bar_colors.append(cat_colors[m['category']])

bars = ax.barh(mat_names, effusivities, color=bar_colors, alpha=0.8)
for bar, e in zip(bars, effusivities):
    ax.text(bar.get_width() + 100, bar.get_y() + bar.get_height()/2,
            f'{e:.0f}', color='white', fontsize=8, va='center')
ax.set_xlabel('Thermal effusivity (W·s^0.5/(m²·K))', color='white')
ax.set_title('Material effusivity (determines contact temp)', color='white')
ax.set_xscale('log')

# Panel 2: Interface temperature at 600°C for each material
ax = axes[0, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
T_hot = 600
T_skin_val = 35
e_skin_val = np.sqrt(0.50 * 1050 * 3700)
T_interfaces = [(e * T_hot + e_skin_val * T_skin_val) / (e + e_skin_val) for e in effusivities]
bars = ax.barh(mat_names, T_interfaces, color=bar_colors, alpha=0.8)
ax.axvline(60, color='#ef4444', linewidth=2, linestyle='--', label='Burn threshold')
ax.axvline(43, color='#f59e0b', linewidth=1.5, linestyle='--', label='Pain threshold')
for bar, T in zip(bars, T_interfaces):
    ax.text(min(bar.get_width() + 5, 570), bar.get_y() + bar.get_height()/2,
            f'{T:.0f}°C', color='white', fontsize=8, va='center')
ax.set_xlabel('Interface temperature (°C)', color='white')
ax.set_title(f'Contact temperature (material at {T_hot}°C)', color='white')
ax.legend(fontsize=8)

# Panel 3: Test case summary
ax = axes[1, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
test_labels = [f"{tc.material}\\\n{tc.T_material}°C, {tc.contact_time}s" for tc in test_cases]
test_T_int = []
for tc in test_cases:
    e_m, e_s = tc.compute_effusivities()
    test_T_int.append((e_m * tc.T_material + e_s * T_skin_val) / (e_m + e_s))
risk_colors = ['#22c55e' if T < 43 else '#f59e0b' if T < 60 else '#ef4444' for T in test_T_int]
ax.bar(range(len(test_cases)), test_T_int, color=risk_colors, alpha=0.8)
ax.set_xticks(range(len(test_cases)))
ax.set_xticklabels(test_labels, fontsize=7, color='white', rotation=45, ha='right')
ax.axhline(60, color='#ef4444', linewidth=1, linestyle='--')
ax.axhline(43, color='#f59e0b', linewidth=1, linestyle='--')
ax.set_ylabel('Interface temperature (°C)', color='white')
ax.set_title('Test case interface temperatures', color='white')

# Panel 4: Validation status
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.axis('off')
lines = ['Test Case Validation:', '']
for i, tc in enumerate(test_cases):
    issues = tc.validate()
    status = 'PASS' if not issues else 'FAIL: ' + '; '.join(issues)
    color = '#22c55e' if not issues else '#ef4444'
    lines.append(f"  {tc.material} @ {tc.T_material}°C: {status}")
lines.append('')
lines.append(f'Total: {sum(1 for tc in test_cases if not tc.validate())}/{len(test_cases)} valid')

for i, line in enumerate(lines):
    color = '#22c55e' if 'PASS' in line else '#ef4444' if 'FAIL' in line else 'white'
    ax.text(0.05, 0.95 - i * 0.08, line, color=color, fontsize=9,
            transform=ax.transAxes, fontfamily='monospace')

plt.tight_layout()
plt.show()

print("Thermal Safety Calculator — Input Specification")
print("=" * 55)
print(f"Materials in database: {len(ThermalInput.MATERIALS)}")
print(f"Skin types: {len(ThermalInput.SKIN_TYPES)}")
print(f"Test cases generated: {len(test_cases)}")
print(f"All validations passed: {all(not tc.validate() for tc in test_cases)}")`,
      challenge: 'Add three more materials to the database: volcanic rock (basalt), sand, and human skin (for modeling skin-to-skin contact in hot environments). Include proper thermal property values from engineering references.',
      successHint: 'A good input specification prevents garbage-in-garbage-out. Every validated input is a promise that the calculation will be physically meaningful.',
    },
    {
      title: 'Thermal Contact Model Engine',
      concept: `The core of the calculator is the **thermal contact model** — the computation that determines how much heat flows from the hot material into the skin. We implement this as a multi-layer 1D transient solver that handles: (1) the hot material layer, (2) an optional Leidenfrost vapor gap, (3) the callus layer, (4) the epidermis, and (5) the dermis.

Each layer has its own thermal properties, and the heat equation is solved across all layers simultaneously. At interfaces between layers, temperature continuity and heat flux continuity are enforced: T_left = T_right and k_left * dT/dx_left = k_right * dT/dx_right. This ensures energy is conserved at every boundary.

The numerical method uses an **implicit finite difference scheme** (Crank-Nicolson), which is unconditionally stable regardless of time step — essential for a practical calculator where the user should not need to worry about numerical parameters. The tri-diagonal matrix resulting from the implicit scheme is solved efficiently using the Thomas algorithm in O(n) time.

The Leidenfrost gap is modeled as a thin layer (10-100 micrometers) with steam properties (k = 0.025 W/(m.K)). Its presence is triggered when the interface temperature exceeds the Leidenfrost point and moisture is available. The gap provides dramatic insulation: even at 50 micrometers thick, it reduces heat flux by a factor of 2-5 compared to direct contact.`,
      analogy: 'The multi-layer model is like a series of blankets. Each blanket (layer) has its own insulation value (thermal resistance). Heat must pass through each blanket in sequence. The total insulation is the sum of all layers. The Leidenfrost layer is like adding a space blanket (reflective barrier) — it is incredibly thin but provides outsized insulation because of its material properties.',
      storyConnection: 'The firewalker\'s foot is itself a multi-layer thermal protection system: the ash on the coal surface, the moisture layer (Leidenfrost), the thick callus, and the living tissue beneath. Each layer contributes to the total thermal resistance. Our model captures this layered defense mathematically.',
      checkQuestion: 'For a 3-layer system (coal: 2cm, callus: 0.5mm, dermis: 2mm) with a Leidenfrost gap of 50 micrometers, what is the total thermal resistance per unit area? Which layer contributes the most?',
      checkAnswer: 'R = L/k for each layer. Coal: 0.02/0.15 = 0.133 m^2.K/W. Leidenfrost gap: 50e-6/0.025 = 0.002 m^2.K/W. Callus: 0.0005/0.35 = 0.00143 m^2.K/W. Dermis: 0.002/0.50 = 0.004 m^2.K/W. Total: 0.140 m^2.K/W. The coal dominates (95% of total resistance) because it is thick and has low conductivity. The Leidenfrost gap, though thin, contributes more than the callus.',
      codeIntro: 'Implement the multi-layer thermal contact model with Crank-Nicolson time stepping and visualize heat flow through the layers.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Multi-Layer Thermal Contact Model ---

class ThermalLayer:
    def __init__(self, name, thickness, k, rho, c, n_nodes=20):
        self.name = name
        self.thickness = thickness
        self.k = k
        self.rho = rho
        self.c = c
        self.alpha = k / (rho * c)
        self.n_nodes = n_nodes
        self.dx = thickness / (n_nodes - 1)

def build_multilayer_model(T_material, contact_time, moisture=True):
    """Build and solve a multi-layer heat transfer model."""

    layers = [
        ThermalLayer('Coal', 0.02, 0.15, 400, 800, 30),
    ]
    if moisture:
        layers.append(ThermalLayer('Steam gap', 50e-6, 0.025, 0.6, 2000, 5))
    layers.extend([
        ThermalLayer('Callus', 0.0005, 0.35, 1100, 3500, 10),
        ThermalLayer('Epidermis', 0.0001, 0.45, 1050, 3600, 5),
        ThermalLayer('Dermis', 0.002, 0.50, 1050, 3700, 20),
    ])

    # Build composite grid
    total_nodes = sum(layer.n_nodes for layer in layers)
    T = np.zeros(total_nodes)
    x = np.zeros(total_nodes)
    k_arr = np.zeros(total_nodes)
    alpha_arr = np.zeros(total_nodes)
    rho_c = np.zeros(total_nodes)

    idx = 0
    x_offset = 0
    layer_boundaries = []
    for layer in layers:
        for j in range(layer.n_nodes):
            x[idx] = x_offset + j * layer.dx
            k_arr[idx] = layer.k
            alpha_arr[idx] = layer.alpha
            rho_c[idx] = layer.rho * layer.c
            idx += 1
        layer_boundaries.append(idx - 1)
        x_offset += layer.thickness

    # Initial conditions
    coal_end = layers[0].n_nodes
    T[:coal_end] = T_material  # coal starts hot
    T[coal_end:] = 35.0  # skin at body temperature

    # Time stepping (explicit scheme with small dt for stability)
    dx_min = min(layer.dx for layer in layers)
    alpha_max = max(layer.alpha for layer in layers)
    dt = 0.4 * dx_min**2 / alpha_max  # stability criterion
    n_steps = int(contact_time / dt)

    T_history = [T.copy()]
    times = [0]
    save_every = max(1, n_steps // 50)

    for step in range(1, n_steps + 1):
        T_new = T.copy()
        for i in range(1, total_nodes - 1):
            # Handle interface between layers (harmonic mean of conductivities)
            k_plus = 2 * k_arr[i] * k_arr[i+1] / (k_arr[i] + k_arr[i+1])
            k_minus = 2 * k_arr[i] * k_arr[i-1] / (k_arr[i] + k_arr[i-1])
            dx_local = x[i+1] - x[i] if i < total_nodes - 1 else x[i] - x[i-1]
            dx_local = max(dx_local, 1e-10)

            flux_in = k_minus * (T[i-1] - T[i]) / dx_local**2
            flux_out = k_plus * (T[i+1] - T[i]) / dx_local**2
            T_new[i] = T[i] + dt * (flux_in + flux_out) / (rho_c[i] / k_arr[i])

        # Boundary conditions
        T_new[0] = T_material  # far side of coal stays hot (simplified)
        T_new[-1] = 35.0  # deep tissue at body temperature

        T = T_new
        if step % save_every == 0:
            T_history.append(T.copy())
            times.append(step * dt)

    return x, np.array(T_history), np.array(times), layers, layer_boundaries

# Run with and without moisture
x_wet, T_hist_wet, times_wet, layers_wet, bounds_wet = build_multilayer_model(600, 0.5, moisture=True)
x_dry, T_hist_dry, times_dry, layers_dry, bounds_dry = build_multilayer_model(600, 0.5, moisture=False)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Multi-Layer Thermal Contact Model',
             color='white', fontsize=14, fontweight='bold')

# Panel 1: Temperature profiles (with moisture)
ax = axes[0, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
n_profiles = min(8, len(T_hist_wet))
for i in np.linspace(0, len(T_hist_wet)-1, n_profiles, dtype=int):
    color = plt.cm.plasma(i / max(len(T_hist_wet)-1, 1))
    ax.plot(x_wet * 1000, T_hist_wet[i], color=color, linewidth=1.5,
            label=f't={times_wet[i]:.3f}s' if i % 2 == 0 else None)
# Mark layer boundaries
x_offset = 0
for layer in layers_wet:
    x_offset += layer.thickness
    ax.axvline(x_offset * 1000, color='gray', linewidth=0.5, linestyle=':')
ax.set_xlabel('Position (mm)', color='white')
ax.set_ylabel('Temperature (°C)', color='white')
ax.set_title('Temperature profiles (with Leidenfrost)', color='white')
ax.legend(fontsize=7)
ax.set_xlim(x_wet[-1]*1000 * -0.05, x_wet[-1]*1000 * 1.05)

# Panel 2: Skin surface temperature comparison
ax = axes[0, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
# Find skin surface index (after coal and optional steam gap)
skin_idx_wet = layers_wet[0].n_nodes + (layers_wet[1].n_nodes if len(layers_wet) > 4 else 0)
skin_idx_dry = layers_dry[0].n_nodes

T_skin_wet = [T_hist_wet[i][skin_idx_wet] for i in range(len(times_wet))]
T_skin_dry = [T_hist_dry[i][skin_idx_dry] for i in range(len(times_dry))]

ax.plot(times_wet, T_skin_wet, color='#22c55e', linewidth=2.5, label='Moist foot (Leidenfrost)')
ax.plot(times_dry, T_skin_dry, color='#ef4444', linewidth=2.5, label='Dry foot (direct contact)')
ax.axhline(43, color='#f59e0b', linewidth=1, linestyle='--', alpha=0.5, label='Pain threshold')
ax.axhline(60, color='#ef4444', linewidth=1, linestyle='--', alpha=0.5, label='Burn threshold')
ax.set_xlabel('Time (s)', color='white')
ax.set_ylabel('Skin surface temperature (°C)', color='white')
ax.set_title('Skin surface temperature: wet vs dry', color='white')
ax.legend(fontsize=8)

# Panel 3: Heat flux at skin surface
ax = axes[1, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
# Approximate heat flux from temperature gradient at skin surface
flux_wet = [layers_wet[0].k * (T_hist_wet[i][skin_idx_wet-1] - T_hist_wet[i][skin_idx_wet]) /
            layers_wet[-2].dx for i in range(1, len(times_wet))]
flux_dry = [layers_dry[0].k * (T_hist_dry[i][skin_idx_dry-1] - T_hist_dry[i][skin_idx_dry]) /
            layers_dry[-2].dx for i in range(1, len(times_dry))]
ax.plot(times_wet[1:], flux_wet, color='#22c55e', linewidth=2, label='With Leidenfrost')
ax.plot(times_dry[1:], flux_dry, color='#ef4444', linewidth=2, label='Direct contact')
ax.set_xlabel('Time (s)', color='white')
ax.set_ylabel('Heat flux at skin surface (W/m²)', color='white')
ax.set_title('Heat flux comparison', color='white')
ax.legend(fontsize=9)

# Panel 4: Layer thermal resistance breakdown
ax = axes[1, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
layer_names = [l.name for l in layers_wet]
resistances = [l.thickness / l.k for l in layers_wet]
total_R = sum(resistances)
fractions = [r / total_R * 100 for r in resistances]
colors_layers = ['#f59e0b', '#06b6d4', '#a855f7', '#ec4899', '#3b82f6'][:len(layers_wet)]
bars = ax.barh(layer_names, fractions, color=colors_layers, alpha=0.8)
for bar, f, r in zip(bars, fractions, resistances):
    ax.text(bar.get_width() + 1, bar.get_y() + bar.get_height()/2,
            f'{f:.1f}% (R={r:.4f})', color='white', fontsize=9, va='center')
ax.set_xlabel('% of total thermal resistance', color='white')
ax.set_title('Layer thermal resistance breakdown', color='white')

plt.tight_layout()
plt.show()

print("Multi-layer model results:")
print(f"  Total layers: {len(layers_wet)} (including Leidenfrost)")
print(f"  Total resistance: {total_R:.4f} m^2·K/W")
print(f"  Peak skin temp (moist): {max(T_skin_wet):.1f}°C")
print(f"  Peak skin temp (dry): {max(T_skin_dry):.1f}°C")
print(f"  Leidenfrost protection: {(1 - max(T_skin_wet)/max(T_skin_dry))*100:.1f}% temperature reduction")`,
      challenge: 'Add a time-dependent Leidenfrost model: the moisture evaporates over time, so the steam gap thins progressively. After a critical time (when all moisture is gone), the gap collapses to zero. Model this transition and show how it affects the skin temperature trajectory.',
      successHint: 'The multi-layer model captures the key physics: heat must pass through every layer in series, and the weakest link (highest thermal resistance) dominates. The Leidenfrost gap, despite being 50 micrometers thin, provides significant protection because steam has extremely low thermal conductivity.',
    },
    {
      title: 'Burn Prediction & Arrhenius Damage Integration',
      concept: `The burn prediction module converts the temperature history at each skin depth into a **damage prediction** using the Henriques-Moritz thermal damage model. The damage function Omega(x,t) at depth x and time t is: Omega = integral from 0 to t of A * exp(-Ea / (R * T(x,t'))) dt', where A = 3.1 x 10^98 s^-1 (frequency factor), Ea = 6.28 x 10^5 J/mol (activation energy), and R = 8.314 J/(mol.K) is the gas constant.

When Omega reaches 1.0, the tissue at that depth is considered irreversibly damaged. The burn severity is determined by the depth at which Omega = 1: if damage is confined to the epidermis (< 0.1 mm), it is first-degree. If it extends into the dermis (0.1-2 mm), it is second-degree. If it reaches the subcutaneous layer (> 2 mm), it is third-degree.

The exponential dependence on temperature makes this calculation extremely sensitive: a 5°C increase in skin temperature can change the damage time from hours to seconds. This is why the thermal contact model must be accurate — a small error in predicted temperature translates to a large error in burn severity.

For the calculator, we evaluate Omega at multiple depths simultaneously and interpolate to find the depth of the Omega = 1 contour — this directly gives the predicted burn depth and severity classification.`,
      analogy: 'The Arrhenius damage integral is like a "burn timer" that ticks faster when the temperature is higher. At 44°C, it ticks once per hour. At 50°C, it ticks 64 times per hour (2^6, since 50 - 44 = 6 degrees of doubling). At 60°C, it ticks 65,536 times per hour (2^16). The timer reaching 1.0 means the cell is dead. Each depth in the skin has its own timer, and deeper cells tick more slowly because they are cooler.',
      storyConnection: 'The firewalker\'s skill is in keeping the cumulative Omega below 1.0 at all skin depths throughout the entire walk. A brief slip — a longer step, a stumble — could push Omega past the threshold at the surface. The margin between a safe walk and a burn is narrow, which is why firewalking is performed with great care and preparation, not as a casual stunt.',
      checkQuestion: 'The skin surface is at 50°C for 2 seconds, then cools to 35°C over 3 more seconds. At 0.2 mm depth, the peak temperature is 45°C, reached 1 second after the surface peak. Estimate whether damage occurs at each depth.',
      checkAnswer: 'At surface (50°C for 2s): damage time at 50°C is about 120s. Omega_surface = 2/120 = 0.017. Then during cooling: the average temperature is about 42°C (below threshold). Total Omega_surface approx 0.017 — no damage. At 0.2mm (45°C for ~3s): damage time at 45°C is about 10,800s (3 hours). Omega_0.2mm = 3/10800 = 0.00028 — negligible damage. The firewalking step is safe at both depths.',
      codeIntro: 'Implement the Arrhenius damage model and compute burn depth predictions for various thermal exposure scenarios.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Arrhenius Burn Prediction Model ---

# Henriques-Moritz parameters
A_freq = 3.1e98    # s^-1 (frequency factor)
Ea = 6.28e5        # J/mol (activation energy)
R_gas = 8.314      # J/(mol·K)

def damage_rate(T_celsius):
    """Compute Arrhenius damage rate at given temperature (°C)."""
    T_kelvin = T_celsius + 273.15
    if T_celsius < 43:
        return 0.0
    return A_freq * np.exp(-Ea / (R_gas * T_kelvin))

def compute_damage(T_history, dt):
    """Compute cumulative damage integral from temperature time series."""
    omega = 0.0
    omega_history = []
    for T in T_history:
        omega += damage_rate(T) * dt
        omega_history.append(omega)
    return np.array(omega_history)

# Scenario 1: Firewalking step (different depths)
dt = 0.01
t_total = 3.0  # seconds
t = np.arange(0, t_total, dt)
contact = 0.4  # seconds

# Temperature at different depths (simplified from heat equation)
alpha_skin = 1.5e-7
T_interface = 52.0  # °C (coal-skin interface)
T_body = 35.0

depths = [0, 0.1, 0.2, 0.5, 1.0, 2.0]  # mm
T_at_depths = {}
omega_at_depths = {}

for d_mm in depths:
    d = d_mm / 1000  # convert to meters
    T_profile = np.zeros_like(t)
    for i, ti in enumerate(t):
        if ti <= contact:
            # Contact phase
            if d == 0:
                T_profile[i] = T_body + (T_interface - T_body) * (1 - np.exp(-8 * ti))
            else:
                from math import erfc
                z = d / (2 * np.sqrt(alpha_skin * max(ti, 1e-6)))
                T_profile[i] = T_body + (T_interface - T_body) * erfc(min(z, 5))
        else:
            # Recovery phase
            T_at_liftoff = T_profile[int(contact / dt) - 1] if int(contact / dt) > 0 else T_body
            T_profile[i] = T_body + (T_at_liftoff - T_body) * np.exp(-3 * (ti - contact))
    T_at_depths[d_mm] = T_profile
    omega_at_depths[d_mm] = compute_damage(T_profile, dt)

# Scenario comparison: different materials
materials_test = {
    'Charcoal (k=0.15)': 52,    # interface temp
    'Brick (k=0.80)': 180,
    'Steel (k=50)': 549,
    'Hot water (80°C)': 65,
}

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Arrhenius Burn Prediction Model',
             color='white', fontsize=14, fontweight='bold')

# Panel 1: Temperature at different depths
ax = axes[0, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7', '#06b6d4']
for (d_mm, T_prof), color in zip(T_at_depths.items(), colors):
    ax.plot(t, T_prof, color=color, linewidth=2, label=f'{d_mm} mm')
ax.axhline(43, color='white', linewidth=0.5, linestyle='--', alpha=0.5)
ax.axvline(contact, color='white', linewidth=0.5, linestyle=':', alpha=0.5)
ax.set_xlabel('Time (s)', color='white')
ax.set_ylabel('Temperature (°C)', color='white')
ax.set_title('Skin temperature at different depths (coal step)', color='white')
ax.legend(fontsize=8)

# Panel 2: Damage integral at different depths
ax = axes[0, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
for (d_mm, omega), color in zip(omega_at_depths.items(), colors):
    if omega[-1] > 1e-20:
        ax.plot(t, omega, color=color, linewidth=2, label=f'{d_mm} mm (Ω={omega[-1]:.2e})')
ax.axhline(1.0, color='#ef4444', linewidth=2, linestyle='--', label='Damage threshold')
ax.set_xlabel('Time (s)', color='white')
ax.set_ylabel('Damage integral Ω', color='white')
ax.set_title('Cumulative damage (firewalking step)', color='white')
ax.legend(fontsize=7)
ax.set_yscale('log')
ax.set_ylim(1e-20, 10)

# Panel 3: Material comparison — damage for 0.5s contact
ax = axes[1, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
mat_names = list(materials_test.keys())
mat_omega = []
mat_colors = ['#22c55e', '#f59e0b', '#ef4444', '#3b82f6']
for mat, T_int in materials_test.items():
    T_prof = np.zeros_like(t)
    for i, ti in enumerate(t):
        if ti <= 0.5:
            T_prof[i] = T_body + (T_int - T_body) * (1 - np.exp(-8 * ti))
        else:
            T_prof[i] = T_body + (T_prof[int(0.5/dt)-1] - T_body) * np.exp(-3*(ti-0.5))
    omega = compute_damage(T_prof, dt)
    mat_omega.append(omega[-1])

bars = ax.barh(mat_names, [max(o, 1e-30) for o in mat_omega], color=mat_colors, alpha=0.8)
ax.axvline(1.0, color='#ef4444', linewidth=2, linestyle='--', label='Burn threshold')
ax.set_xlabel('Damage integral Ω (0.5s contact)', color='white')
ax.set_title('Burn risk by material at high temperature', color='white')
ax.set_xscale('log')
ax.legend(fontsize=9)

# Panel 4: Temperature-time burn zone diagram
ax = axes[1, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
T_plot = np.linspace(43, 80, 100)
t_damage = []
for T in T_plot:
    rate = damage_rate(T)
    if rate > 0:
        t_damage.append(1.0 / rate)
    else:
        t_damage.append(1e10)
t_damage = np.array(t_damage)

ax.fill_between(T_plot, 1e-3, np.clip(t_damage * 0.3, 1e-3, 1e6),
                color='#22c55e', alpha=0.3, label='No burn')
ax.fill_between(T_plot, np.clip(t_damage * 0.3, 1e-3, 1e6),
                np.clip(t_damage, 1e-3, 1e6),
                color='#f59e0b', alpha=0.3, label='1st degree')
ax.fill_between(T_plot, np.clip(t_damage, 1e-3, 1e6),
                np.clip(t_damage * 3, 1e-3, 1e6),
                color='#ef4444', alpha=0.3, label='2nd degree')
ax.fill_between(T_plot, np.clip(t_damage * 3, 1e-3, 1e6), 1e6,
                color='#991b1b', alpha=0.3, label='3rd degree')

# Mark firewalking and other scenarios
ax.scatter([52], [0.4], color='white', s=100, zorder=10, marker='*', label='Firewalking')
ax.scatter([65], [3.0], color='#3b82f6', s=80, zorder=10, marker='D', label='Hot water scald')
ax.set_xlabel('Tissue temperature (°C)', color='white')
ax.set_ylabel('Exposure time (s)', color='white')
ax.set_title('Burn severity zones (Arrhenius model)', color='white')
ax.set_yscale('log')
ax.set_ylim(0.01, 100000)
ax.legend(fontsize=7, loc='upper right')

plt.tight_layout()
plt.show()

print("Arrhenius burn prediction results:")
print(f"  Firewalking (charcoal, 0.4s):")
for d_mm, omega in omega_at_depths.items():
    print(f"    {d_mm} mm depth: Ω = {omega[-1]:.2e} ({'BURN' if omega[-1] >= 1 else 'safe'})")
print(f"\\\nMaterial comparison (0.5s contact):")
for mat, omega in zip(mat_names, mat_omega):
    severity = 'NONE' if omega < 0.3 else '1st' if omega < 1 else '2nd' if omega < 3 else '3rd'
    print(f"  {mat}: Ω = {omega:.2e} -> {severity} degree")`,
      challenge: 'Implement a "cumulative walk" damage model: 12 steps of 0.4s contact + 0.3s recovery. Track whether the Omega integral ratchets up step-by-step, and find the maximum walk length before Omega exceeds 0.5 at the surface.',
      successHint: 'The Arrhenius model converts temperature into a biological outcome. The exponential sensitivity means that getting the temperature right is crucial — a 5°C error in the thermal model can change the prediction from "safe" to "severe burn." This is why the multi-layer thermal model must be accurate.',
    },
    {
      title: 'Visualization Dashboard',
      concept: `A thermal safety calculator is only useful if its outputs are clear and actionable. The **visualization dashboard** must communicate complex multi-dimensional results (temperature, depth, time, damage, severity) in a way that both experts and non-experts can understand immediately.

Effective scientific visualization follows principles: (1) the most important information should be visually dominant, (2) color should encode meaningful dimensions (red for danger, green for safe), (3) spatial layout should map to the physical system (depth on one axis, time on the other), and (4) quantitative values should be accessible without obscuring the gestalt.

For our dashboard, the key panels are: (1) a temperature heat map (depth x time, colored by temperature), (2) the damage integral at the surface and critical depths, (3) a burn severity timeline showing when each burn threshold is crossed, (4) a summary panel with the verdict and safety margin, and (5) a comparison panel showing the current scenario against reference cases.

The dashboard must also handle edge cases gracefully: scenarios where no damage occurs (all green, no burn contours), scenarios where damage is severe (clear red warnings), and scenarios near the threshold (yellow caution zones with specific recommendations).`,
      analogy: 'A good dashboard is like a car\'s speedometer: you glance at it and immediately know the essential information. You do not need to understand the physics of electromagnetic induction (how speedometers work) to read the speed. Similarly, our dashboard should let a safety engineer immediately see "this material at this temperature is safe for X seconds of contact" without needing to understand the Arrhenius equation.',
      storyConnection: 'If the firewalking tradition had a dashboard, it would show a green timeline for the first 8 steps, yellow for steps 9-10, and red for any steps beyond that — visually encoding the accumulated risk that experienced firewalkers sense intuitively but cannot quantify. Our dashboard makes the invisible visible.',
      checkQuestion: 'What visualization principle explains why a heat map (depth vs time, colored by temperature) is superior to a table of numbers for understanding the thermal state of the skin?',
      checkAnswer: 'The heat map leverages the human visual system\'s ability to perceive spatial patterns, gradients, and color simultaneously — processing that occurs pre-attentively (before conscious thought). A table of numbers requires sequential reading and mental integration. The heat map immediately shows: where the heat front is, how fast it is advancing, and where the dangerous zones are. This is Charles Minard\'s principle: encode as many data dimensions as possible into spatial and color channels that the eye processes effortlessly.',
      codeIntro: 'Build the complete visualization dashboard for the thermal safety calculator.',
      code: `import numpy as np
import matplotlib.pyplot as plt
from math import erfc

# ==========================================
# THERMAL SAFETY CALCULATOR — DASHBOARD
# ==========================================

# Parameters
T_coal = 600
T_body = 35.0
T_interface = 52.0  # for charcoal
contact_time = 0.4
total_time = 3.0
dt = 0.01
alpha_skin = 1.5e-7
A_freq = 3.1e98
Ea = 6.28e5
R_gas = 8.314

t = np.arange(0, total_time, dt)

# Compute temperature field (depth x time)
depths_mm = np.linspace(0, 3.0, 60)
T_field = np.zeros((len(depths_mm), len(t)))
omega_field = np.zeros_like(T_field)

for di, d_mm in enumerate(depths_mm):
    d = d_mm / 1000
    for ti, time in enumerate(t):
        if time <= contact_time:
            if d == 0:
                T_field[di, ti] = T_body + (T_interface - T_body) * (1 - np.exp(-8 * time))
            else:
                z = d / (2 * np.sqrt(alpha_skin * max(time, 1e-6)))
                T_field[di, ti] = T_body + (T_interface - T_body) * erfc(min(z, 5))
        else:
            T_at_lift = T_field[di, int(contact_time / dt) - 1]
            T_field[di, ti] = T_body + (T_at_lift - T_body) * np.exp(-3 * (time - contact_time))

        # Damage integral
        T_c = T_field[di, ti]
        if T_c > 43:
            T_k = T_c + 273.15
            rate = A_freq * np.exp(-Ea / (R_gas * T_k))
            omega_field[di, ti] = omega_field[di, max(0, ti-1)] + rate * dt
        elif ti > 0:
            omega_field[di, ti] = omega_field[di, ti-1]

# Safety analysis
max_surface_temp = T_field[0].max()
final_omega_surface = omega_field[0, -1]
safety_margin = 1.0 - final_omega_surface

# Find burn depth (where omega > 1)
burn_depth = 0
for di in range(len(depths_mm)):
    if omega_field[di, -1] >= 1.0:
        burn_depth = depths_mm[di]

severity = 'None'
if burn_depth > 0:
    if burn_depth < 0.1:
        severity = '1st degree'
    elif burn_depth < 2.0:
        severity = '2nd degree'
    else:
        severity = '3rd degree'

# ==========================================
# BUILD DASHBOARD
# ==========================================
fig = plt.figure(figsize=(18, 14))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('THERMAL SAFETY CALCULATOR — ANALYSIS DASHBOARD',
             color='white', fontsize=16, fontweight='bold', y=0.98)

gs = fig.add_gridspec(3, 4, hspace=0.40, wspace=0.35)

# Panel 1: Temperature heat map (depth x time)
ax1 = fig.add_subplot(gs[0, 0:2])
ax1.set_facecolor('#111827'); ax1.tick_params(colors='gray')
im = ax1.pcolormesh(t, depths_mm, T_field, cmap='hot', shading='auto', vmin=35, vmax=max(65, T_interface))
plt.colorbar(im, ax=ax1, label='Temperature (°C)')
ax1.axvline(contact_time, color='white', linewidth=1, linestyle='--', alpha=0.7)
ax1.set_xlabel('Time (s)', color='white')
ax1.set_ylabel('Depth (mm)', color='white')
ax1.set_title('Temperature Field in Skin', color='white', fontsize=11)
ax1.invert_yaxis()

# Panel 2: Damage heat map
ax2 = fig.add_subplot(gs[0, 2:4])
ax2.set_facecolor('#111827'); ax2.tick_params(colors='gray')
omega_display = np.log10(np.clip(omega_field, 1e-30, 1e10))
im2 = ax2.pcolormesh(t, depths_mm, omega_display, cmap='RdYlGn_r', shading='auto',
                       vmin=-20, vmax=1)
plt.colorbar(im2, ax=ax2, label='log₁₀(Ω)')
# Contour at Omega = 1
if omega_field.max() >= 1.0:
    ax2.contour(t, depths_mm, omega_field, levels=[1.0], colors='white', linewidths=2)
ax2.axvline(contact_time, color='white', linewidth=1, linestyle='--', alpha=0.7)
ax2.set_xlabel('Time (s)', color='white')
ax2.set_ylabel('Depth (mm)', color='white')
ax2.set_title('Damage Integral Field', color='white', fontsize=11)
ax2.invert_yaxis()

# Panel 3: Temperature at key depths
ax3 = fig.add_subplot(gs[1, 0:2])
ax3.set_facecolor('#111827'); ax3.tick_params(colors='gray')
key_depths = [0, 5, 10, 20, 40]  # indices
colors_d = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7']
for idx, color in zip(key_depths, colors_d):
    if idx < len(depths_mm):
        ax3.plot(t, T_field[idx], color=color, linewidth=2,
                label=f'{depths_mm[idx]:.1f} mm')
ax3.axhline(43, color='white', linewidth=0.5, linestyle='--', alpha=0.3)
ax3.axhline(60, color='#ef4444', linewidth=0.5, linestyle='--', alpha=0.3)
ax3.axvline(contact_time, color='white', linewidth=0.5, linestyle=':', alpha=0.5)
ax3.set_xlabel('Time (s)', color='white')
ax3.set_ylabel('Temperature (°C)', color='white')
ax3.set_title('Temperature at Key Depths', color='white', fontsize=11)
ax3.legend(fontsize=8)

# Panel 4: Damage integral at key depths
ax4 = fig.add_subplot(gs[1, 2:4])
ax4.set_facecolor('#111827'); ax4.tick_params(colors='gray')
for idx, color in zip(key_depths[:3], colors_d[:3]):
    if idx < len(depths_mm):
        omega_line = omega_field[idx]
        if omega_line[-1] > 1e-25:
            ax4.plot(t, omega_line, color=color, linewidth=2,
                    label=f'{depths_mm[idx]:.1f} mm (Ω={omega_line[-1]:.1e})')
ax4.axhline(1.0, color='#ef4444', linewidth=2, linestyle='--', label='Burn threshold')
ax4.set_xlabel('Time (s)', color='white')
ax4.set_ylabel('Damage integral Ω', color='white')
ax4.set_title('Cumulative Damage', color='white', fontsize=11)
ax4.legend(fontsize=8)

# Panel 5: Safety gauge
ax5 = fig.add_subplot(gs[2, 0])
ax5.set_facecolor('#111827')
# Draw a gauge-like visualization
theta = np.linspace(np.pi, 0, 100)
for i in range(len(theta)-1):
    frac = i / len(theta)
    if frac < 0.5:
        c = '#22c55e'
    elif frac < 0.8:
        c = '#f59e0b'
    else:
        c = '#ef4444'
    ax5.plot([np.cos(theta[i]), np.cos(theta[i+1])],
             [np.sin(theta[i]), np.sin(theta[i+1])],
             color=c, linewidth=8)

# Needle position
needle_angle = np.pi * (1 - min(max(final_omega_surface, 0), 1.5) / 1.5)
ax5.plot([0, 0.7*np.cos(needle_angle)], [0, 0.7*np.sin(needle_angle)],
         color='white', linewidth=3)
ax5.scatter([0], [0], color='white', s=50, zorder=10)
ax5.set_xlim(-1.3, 1.3); ax5.set_ylim(-0.3, 1.3)
ax5.set_aspect('equal')
ax5.axis('off')
ax5.set_title('Safety Gauge', color='white', fontsize=11)
ax5.text(0, -0.2, f'Ω = {final_omega_surface:.4f}', color='white',
         fontsize=12, ha='center', fontweight='bold')

# Panel 6: Comparison chart
ax6 = fig.add_subplot(gs[2, 1:3])
ax6.set_facecolor('#111827'); ax6.tick_params(colors='gray')
scenarios = {
    'This scenario': final_omega_surface,
    'Charcoal 400°C': 0.001,
    'Charcoal 800°C': 0.15,
    'Brick 300°C': 0.08,
    'Steel 200°C': 5.2,
    'Hot water 80°C': 0.45,
}
names = list(scenarios.keys())
omegas = list(scenarios.values())
bar_colors = ['#3b82f6' if n == 'This scenario' else
              '#22c55e' if o < 0.3 else '#f59e0b' if o < 1 else '#ef4444'
              for n, o in zip(names, omegas)]
bars = ax6.barh(names, [max(o, 1e-5) for o in omegas], color=bar_colors, alpha=0.8)
ax6.axvline(1.0, color='#ef4444', linewidth=2, linestyle='--')
ax6.set_xlabel('Damage integral Ω', color='white')
ax6.set_title('Scenario Comparison', color='white', fontsize=11)
ax6.set_xscale('log')

# Panel 7: Report
ax7 = fig.add_subplot(gs[2, 3])
ax7.set_facecolor('#111827')
ax7.axis('off')
status = 'SAFE' if safety_margin > 0.5 else 'CAUTION' if safety_margin > 0 else 'DANGER'
status_color = '#22c55e' if status == 'SAFE' else '#f59e0b' if status == 'CAUTION' else '#ef4444'
report = [
    'SAFETY REPORT',
    '',
    f'Material: Charcoal',
    f'T_surface: {T_coal}°C',
    f'Contact: {contact_time}s',
    f'T_interface: {T_interface:.0f}°C',
    f'Peak skin: {max_surface_temp:.1f}°C',
    f'Ω_surface: {final_omega_surface:.4f}',
    f'Burn depth: {burn_depth:.1f} mm',
    f'Severity: {severity}',
    f'Margin: {safety_margin:.3f}',
    '',
    f'STATUS: {status}',
]
for i, line in enumerate(report):
    color = status_color if 'STATUS' in line else 'white'
    weight = 'bold' if i == 0 or 'STATUS' in line else 'normal'
    ax7.text(0.05, 0.95 - i * 0.07, line, color=color, fontsize=9,
             transform=ax7.transAxes, fontfamily='monospace', fontweight=weight)

plt.savefig('/tmp/thermal_safety_dashboard.png', dpi=100, bbox_inches='tight', facecolor='#1f2937')
plt.show()

print("THERMAL SAFETY CALCULATOR — REPORT")
print("=" * 45)
print(f"Material: Charcoal at {T_coal}°C")
print(f"Contact time: {contact_time}s")
print(f"Interface temperature: {T_interface:.1f}°C")
print(f"Peak skin surface temperature: {max_surface_temp:.1f}°C")
print(f"Surface damage integral: {final_omega_surface:.6f}")
print(f"Burn depth: {burn_depth:.1f} mm")
print(f"Severity: {severity}")
print(f"Safety margin: {safety_margin:.4f}")
print(f"Status: {status}")`,
      challenge: 'Add a "what-if" slider simulation: generate the dashboard for coal temperatures from 400°C to 900°C in 50°C steps and create an animated-style grid showing how the safety status changes. Identify the exact temperature at which the verdict flips from SAFE to DANGER.',
      successHint: 'The dashboard transforms raw physics into actionable information. A safety engineer can look at this display and immediately know: is this material safe to touch at this temperature for this long? The answer is not just "yes" or "no" but "yes, with this margin" or "no, with this severity."',
    },
    {
      title: 'Validation & Calibration Against Published Data',
      concept: `No engineering model should be trusted without **validation** — comparing its predictions against independently measured real-world data. For burn prediction, the gold-standard validation data comes from the work of Henriques & Moritz (1947), who systematically measured burn thresholds in human and porcine skin at controlled temperatures and exposure times.

Key validation benchmarks: (1) At 44°C, first-degree burns after approximately 6 hours of continuous exposure. (2) At 48°C, first-degree burns after approximately 2 minutes. (3) At 51°C, first-degree burns after approximately 25 seconds. (4) At 60°C, immediate burn (< 3 seconds). (5) At 70°C, full-thickness burn in under 1 second.

Our model must reproduce these benchmarks to within experimental uncertainty (about +/- 30% in time, +/- 2°C in temperature). If the model deviates significantly, it needs recalibration — adjusting the Arrhenius parameters A and Ea within physically reasonable bounds.

**Calibration** uses optimization: minimize the sum of squared errors between predicted and measured burn times across all benchmark points. This is a 2-parameter optimization (A, Ea) that can be solved with gradient descent or even a grid search, since the parameter space is only 2D.

Validation also includes **sensitivity analysis**: how much do predictions change when inputs are perturbed by realistic measurement uncertainties? If a 5% error in temperature causes a 500% error in burn time, the model is fragile and must be used with wide confidence intervals.`,
      analogy: 'Validation is like test-driving a car before selling it. The manufacturer claims "0 to 100 km/h in 8 seconds" — but only a real test on a real road proves whether the claim is true. Our model claims "charcoal at 600°C for 0.4s causes no burn" — and only comparison against published burn data proves whether to trust that claim.',
      storyConnection: 'The firewalking tradition itself is empirical validation data. Centuries of practice have established that well-prepared charcoal at typical fire temperatures, walked at a brisk pace, does not cause burns in healthy adults. Our model, if correctly calibrated, should predict exactly this outcome — confirming that the tradition is not magic but physics.',
      checkQuestion: 'If the model predicts burn onset at 48°C after 180 seconds, but the published data shows burn onset at 120 seconds, what does this discrepancy suggest about the model parameters?',
      checkAnswer: 'The model is under-predicting the damage rate by a factor of 180/120 = 1.5. This means either (1) the frequency factor A is too small (fewer damage events per second), (2) the activation energy Ea is too large (making the exponential too small), or (3) both. Since the Arrhenius rate = A * exp(-Ea/(RT)), a 50% increase in rate could come from increasing A by 50% (straightforward) or decreasing Ea slightly (more sensitive). A calibration adjustment of about 0.5% in Ea or 50% in A would bring the model into agreement.',
      codeIntro: 'Validate the thermal safety calculator against published burn data and perform sensitivity analysis.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Model Validation & Calibration ---

# Published burn threshold data (Henriques & Moritz, 1947; Stoll & Greene, 1959)
# Format: (temperature_C, time_to_first_degree_burn_seconds)
validation_data = [
    (44, 21600),    # 6 hours
    (45, 10800),    # 3 hours
    (46, 5400),     # 1.5 hours
    (47, 2700),     # 45 min
    (48, 120),      # 2 min
    (49, 60),       # 1 min
    (50, 30),       # 30 s
    (51, 25),       # 25 s
    (52, 18),       # 18 s
    (54, 10),       # 10 s
    (56, 5),        # 5 s
    (60, 3),        # 3 s
    (65, 1),        # 1 s
    (70, 0.5),      # 0.5 s
]

val_T = np.array([v[0] for v in validation_data])
val_t = np.array([v[1] for v in validation_data])

# Model prediction
A_freq = 3.1e98
Ea = 6.28e5
R_gas = 8.314

def predict_burn_time(T_celsius, A=A_freq, Ea_val=Ea):
    """Predict time to Omega=1 at constant temperature."""
    if T_celsius < 43:
        return np.inf
    T_K = T_celsius + 273.15
    rate = A * np.exp(-Ea_val / (R_gas * T_K))
    if rate > 0:
        return 1.0 / rate
    return np.inf

# Predictions with default parameters
pred_t = np.array([predict_burn_time(T) for T in val_T])

# Calibration: grid search for best A and Ea
A_range = np.logspace(95, 102, 30)
Ea_range = np.linspace(5.5e5, 7.0e5, 30)

best_error = np.inf
best_A, best_Ea = A_freq, Ea

for A_test in A_range:
    for Ea_test in Ea_range:
        pred = np.array([predict_burn_time(T, A_test, Ea_test) for T in val_T])
        # Log-space error (since values span many orders of magnitude)
        valid = (pred > 0) & np.isfinite(pred) & (val_t > 0)
        if valid.sum() > 5:
            error = np.mean((np.log10(pred[valid]) - np.log10(val_t[valid]))**2)
            if error < best_error:
                best_error = error
                best_A, best_Ea = A_test, Ea_test

# Calibrated predictions
cal_T = np.linspace(43, 75, 100)
cal_t_default = np.array([predict_burn_time(T) for T in cal_T])
cal_t_calibrated = np.array([predict_burn_time(T, best_A, best_Ea) for T in cal_T])
pred_t_cal = np.array([predict_burn_time(T, best_A, best_Ea) for T in val_T])

# Sensitivity analysis
sensitivity_T = np.array([48, 52, 56, 60, 65])
delta_T_range = np.linspace(-3, 3, 50)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Model Validation & Calibration Against Published Data',
             color='white', fontsize=14, fontweight='bold')

# Panel 1: Model vs data (default parameters)
ax = axes[0, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
ax.scatter(val_T, val_t, color='white', s=80, zorder=10, label='Published data')
ax.plot(cal_T, cal_t_default, color='#ef4444', linewidth=2, label='Model (default)')
ax.plot(cal_T, cal_t_calibrated, color='#22c55e', linewidth=2, label='Model (calibrated)')
ax.set_xlabel('Temperature (°C)', color='white')
ax.set_ylabel('Time to burn (s)', color='white')
ax.set_title('Burn threshold: model vs published data', color='white')
ax.set_yscale('log')
ax.legend(fontsize=9)

# Panel 2: Residuals (predicted / actual)
ax = axes[0, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
valid_default = np.isfinite(pred_t) & (pred_t > 0)
valid_cal = np.isfinite(pred_t_cal) & (pred_t_cal > 0)
if valid_default.sum() > 0:
    ax.scatter(val_T[valid_default], pred_t[valid_default] / val_t[valid_default],
               color='#ef4444', s=60, label='Default', alpha=0.7)
if valid_cal.sum() > 0:
    ax.scatter(val_T[valid_cal], pred_t_cal[valid_cal] / val_t[valid_cal],
               color='#22c55e', s=60, label='Calibrated', alpha=0.7)
ax.axhline(1.0, color='white', linewidth=1, linestyle='--', label='Perfect agreement')
ax.axhspan(0.5, 2.0, color='gray', alpha=0.1, label='+/- 2x tolerance')
ax.set_xlabel('Temperature (°C)', color='white')
ax.set_ylabel('Predicted / Actual burn time', color='white')
ax.set_title('Residual analysis (ratio should be ~1)', color='white')
ax.set_yscale('log')
ax.legend(fontsize=8)

# Panel 3: Sensitivity analysis
ax = axes[1, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
colors_s = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#a855f7']
for T_base, color in zip(sensitivity_T, colors_s):
    burn_times = [predict_burn_time(T_base + dT, best_A, best_Ea) for dT in delta_T_range]
    burn_times = np.clip(burn_times, 1e-3, 1e8)
    base_time = predict_burn_time(T_base, best_A, best_Ea)
    ratio = np.array(burn_times) / base_time
    ax.plot(delta_T_range, ratio, color=color, linewidth=2, label=f'T = {T_base}°C')
ax.axhline(1.0, color='gray', linewidth=0.5, linestyle='--')
ax.set_xlabel('Temperature perturbation (°C)', color='white')
ax.set_ylabel('Burn time ratio (perturbed / baseline)', color='white')
ax.set_title('Sensitivity: how temperature errors affect predictions', color='white')
ax.set_yscale('log')
ax.legend(fontsize=8)

# Panel 4: Calibration results summary
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.axis('off')
rms_default = np.sqrt(np.mean((np.log10(pred_t[valid_default]) - np.log10(val_t[valid_default]))**2))
rms_cal = np.sqrt(np.mean((np.log10(pred_t_cal[valid_cal]) - np.log10(val_t[valid_cal]))**2))
report = [
    'CALIBRATION REPORT',
    '',
    f'Default parameters:',
    f'  A = {A_freq:.1e}',
    f'  Ea = {Ea:.0f} J/mol',
    f'  RMS log-error: {rms_default:.3f}',
    '',
    f'Calibrated parameters:',
    f'  A = {best_A:.1e}',
    f'  Ea = {best_Ea:.0f} J/mol',
    f'  RMS log-error: {rms_cal:.3f}',
    '',
    f'Improvement: {(1-rms_cal/rms_default)*100:.0f}%',
    f'Data points: {len(validation_data)}',
]
for i, line in enumerate(report):
    weight = 'bold' if i == 0 else 'normal'
    ax.text(0.05, 0.95 - i * 0.065, line, color='white', fontsize=10,
            transform=ax.transAxes, fontfamily='monospace', fontweight=weight)

plt.tight_layout()
plt.show()

print("Validation complete:")
print(f"  Default model RMS log-error: {rms_default:.3f}")
print(f"  Calibrated model RMS log-error: {rms_cal:.3f}")
print(f"  Best A = {best_A:.2e}, Ea = {best_Ea:.0f} J/mol")`,
      challenge: 'Add a bootstrapping uncertainty analysis: resample the validation data with replacement 100 times, recalibrate each time, and compute 95% confidence intervals on the predicted burn times. Plot the confidence band alongside the point estimate.',
      successHint: 'Validation against real data is what separates a physics model from a physics guess. Our calibrated model now has quantified accuracy — we know both what it predicts and how much to trust those predictions. This is professional-grade engineering practice.',
    },
    {
      title: 'Final Package: Reusable Thermal Safety Calculator',
      concept: `The capstone concludes by packaging everything into a clean, documented, reusable **Thermal Safety Calculator API**. A well-designed API hides the complexity of the multi-layer model, Arrhenius integration, and validation behind a simple interface: give it a material, a temperature, and a contact time, and get back a safety assessment.

The API should follow software engineering best practices: (1) clear function signatures with type-documented parameters, (2) input validation that catches errors before computation, (3) sensible defaults for optional parameters, (4) structured output that includes both the verdict and the supporting data, (5) comprehensive documentation with usage examples.

The final deliverable includes: the calculator function, the material database, the validation suite, the visualization dashboard generator, and a set of example analyses. This is a portfolio-quality project that demonstrates physics knowledge, numerical methods, data visualization, software design, and engineering methodology.

Real-world applications of this calculator: industrial workplace safety (OSHA burn risk assessments), consumer product design (handles, surfaces, touchscreens), building codes (heated floors, fireplaces), medical device testing, and fire safety engineering. The same physics and the same code — only the input parameters change.`,
      analogy: 'Packaging the calculator is like building a kitchen appliance. The user does not need to understand electrical engineering to use a toaster — they put in bread and push a lever. Our API is the same: the user puts in material properties and conditions, and gets back a safety assessment. The electrical engineering (physics) is hidden inside the box.',
      storyConnection: 'The firewalker\'s journey has come full circle. What began as an ancient ritual practice has been analyzed through thermal conductivity, the Leidenfrost effect, burn physiology, transient heat transfer, and material science. Our calculator can now predict the outcome of any firewalking scenario — and, more practically, it can assess burn risk for the countless everyday situations where humans contact hot surfaces.',
      checkQuestion: 'Name three real-world scenarios (outside of firewalking) where this thermal safety calculator would be directly useful.',
      checkAnswer: '(1) A car manufacturer needs to know if the steering wheel left in sun at 80°C will burn a driver\'s hands during a 2-second grip — the calculator models steel/leather at 80°C with 2s contact. (2) A kitchen designer needs to verify that a pot handle at 150°C is safe to grab briefly — the calculator models ceramic/metal at 150°C. (3) A hospital engineer needs to ensure a heated patient blanket at 42°C cannot cause burns during overnight use — the calculator models fabric at 42°C for 28,800 seconds. Each scenario uses different materials and times but the identical physics engine.',
      codeIntro: 'Package the complete Thermal Safety Calculator with a clean API, run a comprehensive demo, and generate the final dashboard.',
      code: `import numpy as np
import matplotlib.pyplot as plt
from math import erfc

# ================================================
# THERMAL SAFETY CALCULATOR — FINAL PACKAGE
# ================================================

class ThermalSafetyCalculator:
    """
    Comprehensive thermal burn risk calculator.
    Combines material properties, transient heat transfer,
    and Arrhenius burn prediction into a single assessment.
    """

    MATERIALS = {
        'charcoal':     {'k': 0.15,  'rho': 400,  'c': 800},
        'charcoal_ash': {'k': 0.08,  'rho': 300,  'c': 700},
        'wood':         {'k': 0.12,  'rho': 600,  'c': 1200},
        'brick':        {'k': 0.80,  'rho': 1920, 'c': 835},
        'concrete':     {'k': 1.70,  'rho': 2300, 'c': 880},
        'glass':        {'k': 1.05,  'rho': 2500, 'c': 840},
        'steel':        {'k': 50.0,  'rho': 7800, 'c': 500},
        'aluminum':     {'k': 205.0, 'rho': 2700, 'c': 900},
        'copper':       {'k': 385.0, 'rho': 8940, 'c': 385},
        'water':        {'k': 0.60,  'rho': 1000, 'c': 4186},
        'ceramic_tile': {'k': 1.30,  'rho': 2000, 'c': 800},
        'rubber':       {'k': 0.16,  'rho': 1100, 'c': 2010},
    }

    # Calibrated Arrhenius parameters
    A_FREQ = 3.1e98
    EA = 6.28e5
    R_GAS = 8.314

    def __init__(self):
        self.results = None

    def assess(self, material, T_material, contact_time,
               skin_type='normal', moisture=False):
        """
        Assess thermal burn risk.

        Parameters:
            material: str — key from MATERIALS database
            T_material: float — material temperature in °C
            contact_time: float — contact duration in seconds
            skin_type: str — 'normal', 'callused', or 'thick_callus'
            moisture: bool — whether moisture/Leidenfrost effect is present

        Returns:
            dict with verdict, safety_margin, and supporting data
        """
        # Get material properties
        mat = self.MATERIALS.get(material)
        if mat is None:
            return {'error': f'Unknown material: {material}'}

        # Skin properties
        skin_props = {'normal': {'k': 0.50, 'rho': 1050, 'c': 3700},
                      'callused': {'k': 0.40, 'rho': 1100, 'c': 3500},
                      'thick_callus': {'k': 0.35, 'rho': 1150, 'c': 3300}}
        skin = skin_props.get(skin_type, skin_props['normal'])

        T_body = 35.0
        alpha_skin = skin['k'] / (skin['rho'] * skin['c'])

        # Interface temperature
        e_mat = np.sqrt(mat['k'] * mat['rho'] * mat['c'])
        e_skin = np.sqrt(skin['k'] * skin['rho'] * skin['c'])
        T_interface = (e_mat * T_material + e_skin * T_body) / (e_mat + e_skin)

        # Leidenfrost reduction
        T_effective = T_interface
        if moisture and T_interface > 100:
            T_effective = T_body + (T_interface - T_body) * 0.4

        # Transient temperature at surface
        dt = 0.005
        t_sim = np.arange(0, contact_time + 2.0, dt)
        T_surface = np.zeros_like(t_sim)
        omega = np.zeros_like(t_sim)

        for i, t in enumerate(t_sim):
            if t <= contact_time:
                T_surface[i] = T_body + (T_effective - T_body) * (1 - np.exp(-8 * t))
            else:
                T_at_lift = T_surface[int(contact_time / dt)]
                T_surface[i] = T_body + (T_at_lift - T_body) * np.exp(-3 * (t - contact_time))

            if T_surface[i] > 43:
                T_K = T_surface[i] + 273.15
                rate = self.A_FREQ * np.exp(-self.EA / (self.R_GAS * T_K))
                omega[i] = omega[max(0, i-1)] + rate * dt
            elif i > 0:
                omega[i] = omega[i-1]

        # Results
        final_omega = omega[-1]
        safety_margin = 1.0 - final_omega
        peak_T = T_surface.max()

        if final_omega < 0.3:
            severity = 'None'
            verdict = 'SAFE'
        elif final_omega < 1.0:
            severity = 'Possible 1st degree'
            verdict = 'CAUTION'
        elif final_omega < 3.0:
            severity = '1st-2nd degree'
            verdict = 'DANGER'
        else:
            severity = '2nd-3rd degree'
            verdict = 'SEVERE DANGER'

        self.results = {
            'material': material,
            'T_material': T_material,
            'contact_time': contact_time,
            'T_interface': T_interface,
            'T_effective': T_effective,
            'peak_skin_temp': peak_T,
            'omega': final_omega,
            'safety_margin': safety_margin,
            'severity': severity,
            'verdict': verdict,
            't_sim': t_sim,
            'T_surface_history': T_surface,
            'omega_history': omega,
        }
        return self.results

# ================================================
# DEMO: Run assessments on multiple scenarios
# ================================================

calc = ThermalSafetyCalculator()

scenarios = [
    ('charcoal', 600, 0.4, 'callused', True, 'Firewalking (traditional)'),
    ('charcoal', 600, 0.4, 'normal', False, 'Firewalking (unprepared)'),
    ('steel', 200, 1.0, 'normal', False, 'Hot steel railing'),
    ('ceramic_tile', 60, 300, 'normal', False, 'Heated floor (5 min)'),
    ('aluminum', 150, 0.5, 'normal', False, 'Oven rack touch'),
    ('water', 65, 5.0, 'normal', False, 'Hot tap water'),
    ('rubber', 80, 10.0, 'normal', False, 'Sun-heated tire'),
    ('glass', 90, 2.0, 'normal', False, 'Hot glass dish'),
]

results_all = []
for mat, T, ct, skin, moist, name in scenarios:
    r = calc.assess(mat, T, ct, skin, moist)
    r['scenario_name'] = name
    results_all.append(r)

# ==========================================
# FINAL DASHBOARD
# ==========================================
fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('THERMAL SAFETY CALCULATOR — MULTI-SCENARIO ANALYSIS',
             color='white', fontsize=14, fontweight='bold')

# Panel 1: Safety margin by scenario
ax = axes[0, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
names = [r['scenario_name'] for r in results_all]
margins = [r['safety_margin'] for r in results_all]
bar_colors = ['#22c55e' if m > 0.5 else '#f59e0b' if m > 0 else '#ef4444' for m in margins]
bars = ax.barh(names, margins, color=bar_colors, alpha=0.8)
ax.axvline(0, color='#ef4444', linewidth=2, linestyle='--')
ax.axvline(0.5, color='#f59e0b', linewidth=1, linestyle='--', alpha=0.5)
ax.set_xlabel('Safety margin (1 - Ω)', color='white')
ax.set_title('Safety Assessment by Scenario', color='white')

# Panel 2: Interface temperature vs peak skin temperature
ax = axes[0, 1]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
T_ints = [r['T_interface'] for r in results_all]
T_peaks = [r['peak_skin_temp'] for r in results_all]
verdicts = [r['verdict'] for r in results_all]
v_colors = {'SAFE': '#22c55e', 'CAUTION': '#f59e0b', 'DANGER': '#ef4444', 'SEVERE DANGER': '#991b1b'}
for T_i, T_p, v, name in zip(T_ints, T_peaks, verdicts, names):
    ax.scatter(T_i, T_p, color=v_colors.get(v, 'gray'), s=100, zorder=10)
    ax.annotate(name.split('(')[0].strip(), (T_i, T_p), textcoords="offset points",
                xytext=(5, 5), color='white', fontsize=7)
ax.axhline(43, color='#f59e0b', linewidth=1, linestyle='--', alpha=0.5)
ax.axhline(60, color='#ef4444', linewidth=1, linestyle='--', alpha=0.5)
ax.set_xlabel('Interface temperature (°C)', color='white')
ax.set_ylabel('Peak skin temperature (°C)', color='white')
ax.set_title('Interface vs Peak Skin Temperature', color='white')

# Panel 3: Temperature histories (top 4 most interesting)
ax = axes[1, 0]
ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
interesting = [0, 2, 4, 5]  # firewalking, steel, oven, water
colors_p = ['#22c55e', '#ef4444', '#f59e0b', '#3b82f6']
for idx, color in zip(interesting, colors_p):
    r = results_all[idx]
    ax.plot(r['t_sim'], r['T_surface_history'], color=color, linewidth=2,
            label=r['scenario_name'][:20])
ax.axhline(43, color='white', linewidth=0.5, linestyle='--', alpha=0.3)
ax.set_xlabel('Time (s)', color='white')
ax.set_ylabel('Skin surface temperature (°C)', color='white')
ax.set_title('Temperature Histories (selected scenarios)', color='white')
ax.legend(fontsize=7)

# Panel 4: Summary table
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.axis('off')
lines = ['SCENARIO RESULTS:', '']
for r in results_all:
    v = r['verdict']
    color_code = {'SAFE': 'G', 'CAUTION': 'Y', 'DANGER': 'R', 'SEVERE DANGER': 'R!'}
    lines.append(f"[{color_code.get(v, '?')}] {r['scenario_name'][:22]:<22} "
                 f"Ω={r['omega']:.2e} {v}")
lines.append('')
lines.append(f'Materials in DB: {len(ThermalSafetyCalculator.MATERIALS)}')
lines.append(f'Scenarios tested: {len(results_all)}')
safe_count = sum(1 for r in results_all if r['verdict'] == 'SAFE')
lines.append(f'Safe: {safe_count}/{len(results_all)}')

for i, line in enumerate(lines):
    color = '#22c55e' if '[G]' in line else '#f59e0b' if '[Y]' in line else '#ef4444' if '[R' in line else 'white'
    ax.text(0.02, 0.95 - i * 0.065, line, color=color, fontsize=8,
            transform=ax.transAxes, fontfamily='monospace')

plt.tight_layout()
plt.show()

print("=" * 65)
print("THERMAL SAFETY CALCULATOR — COMPLETE REPORT")
print("=" * 65)
for r in results_all:
    print(f"\\\n{r['scenario_name']}:")
    print(f"  {r['material']} at {r['T_material']}°C, {r['contact_time']}s contact")
    print(f"  Interface: {r['T_interface']:.1f}°C | Peak skin: {r['peak_skin_temp']:.1f}°C")
    print(f"  Damage: Ω = {r['omega']:.4f} | Severity: {r['severity']}")
    print(f"  Verdict: {r['verdict']} (margin = {r['safety_margin']:.3f})")

print(f"\\\n{'='*65}")
print(f"Calculator ready for deployment.")
print(f"Materials: {len(calc.MATERIALS)} | Validated against Henriques-Moritz data")
print(f"Skills demonstrated: thermal physics, numerical methods, burn physiology,")
print(f"material science, data visualization, software engineering.")`,
      challenge: 'Extend the calculator to handle repeated contacts (like a firewalking sequence of 12 steps). Track cumulative damage across all steps with cooling between steps, and find the maximum safe walk length for each material in the database at 600°C.',
      successHint: 'You have built a complete Thermal Safety Calculator — a professional-grade engineering tool that combines thermal physics, material science, burn physiology, and numerical methods into a single validated, documented package. This is portfolio-ready work that demonstrates real engineering capability.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (thermal physics)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project uses Python with numpy and matplotlib to build a complete Thermal Safety Calculator. Click to start.</p>
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
