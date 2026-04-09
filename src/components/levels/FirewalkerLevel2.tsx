import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function FirewalkerLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Laws of thermodynamics — the rules energy must obey',
      concept: `The **laws of thermodynamics** are the most fundamental rules in physics. They govern everything from stars to steam engines to living cells.

**Zeroth Law**: if A is in thermal equilibrium with B, and B with C, then A is in equilibrium with C. (This is why thermometers work — the thermometer reaches equilibrium with your body, then you read it.)

**First Law** (Conservation of Energy): energy cannot be created or destroyed, only converted from one form to another.
- **ΔU = Q - W**
- ΔU = change in internal energy
- Q = heat added to the system
- W = work done by the system
- A firewalker's foot gains internal energy (Q in) but also loses some (radiation out). Net ΔU determines whether tissue is damaged.

**Second Law** (Entropy always increases): heat flows spontaneously from hot to cold, never the reverse. You need to do work to move heat from cold to hot (that's what a refrigerator does).
- The efficiency of ANY heat engine is limited: η ≤ 1 - T_cold/T_hot (Carnot limit)

**Third Law**: as temperature approaches absolute zero (0 K = -273.15°C), entropy approaches a minimum. You can never actually reach absolute zero.`,
      analogy: 'The laws of thermodynamics are like the rules of a card game. First Law: the total number of cards never changes (conservation). Second Law: cards naturally tend toward disorder (entropy) — you have to work to sort them. Third Law: you can never get a perfectly sorted deck in finite time. Zeroth Law: if two players agree their hands are equivalent, any third player with an equivalent hand matches both.',
      storyConnection: 'The Firewalker\'s Daughter could not cheat the laws of thermodynamics. The First Law demanded that every joule of heat entering her feet was either stored (raising tissue temperature) or removed (conducted away, radiated out). The Second Law guaranteed that heat would flow from hot coals to cool feet — never the reverse. She worked within these laws, not against them.',
      checkQuestion: 'A steam engine operates between a hot reservoir at 500°C (773 K) and a cold reservoir at 25°C (298 K). What is the maximum possible efficiency?',
      checkAnswer: 'Carnot efficiency: η = 1 - T_cold/T_hot = 1 - 298/773 = 1 - 0.386 = 0.614 or 61.4%. No real engine can exceed this. Actual steam turbines achieve ~40% efficiency — about 65% of the theoretical maximum. The remaining energy is "wasted" as heat discharged to the cold reservoir (Second Law demands this).',
      codeIntro: 'Visualize the laws of thermodynamics with energy flow diagrams and efficiency limits.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Carnot efficiency as a function of temperature difference
T_cold = 298  # K (25°C)
T_hot = np.linspace(300, 2000, 100)  # K

carnot_efficiency = 1 - T_cold / T_hot

# Real engine efficiencies (approximate)
real_engines = {
    'Car engine': (600, 0.25),
    'Diesel engine': (800, 0.35),
    'Coal power plant': (850, 0.33),
    'Gas turbine': (1500, 0.40),
    'Combined cycle': (1500, 0.60),
    'Nuclear': (600, 0.33),
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Carnot efficiency curve
ax1.set_facecolor('#111827')
ax1.plot(T_hot - 273.15, carnot_efficiency * 100, color='#22c55e', linewidth=2, label='Carnot limit (maximum)')
ax1.fill_between(T_hot - 273.15, carnot_efficiency * 100, alpha=0.1, color='#22c55e')

for name, (T, eff) in real_engines.items():
    ax1.plot(T - 273.15, eff * 100, 'o', markersize=8, zorder=5)
    ax1.annotate(f'{name}\\n({eff*100:.0f}%)', xy=(T-273.15, eff*100),
                xytext=(10, -15), textcoords='offset points',
                color='white', fontsize=7)

ax1.set_xlabel('Hot reservoir temperature (°C)', color='white')
ax1.set_ylabel('Efficiency (%)', color='white')
ax1.set_title('Carnot Efficiency: The Unbeatable Limit', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', labelcolor='white')
ax1.tick_params(colors='gray')

# Energy flow (Sankey-style) for a heat engine
ax2.set_facecolor('#111827')

# Simple energy balance: Q_hot = W + Q_cold
Q_hot = 100  # units
efficiency = 0.35
W = Q_hot * efficiency
Q_cold = Q_hot - W

# Draw boxes
boxes = [
    ('Hot reservoir\\n(fuel)', 0.1, 0.7, 0.2, 0.2, '#ef4444'),
    ('Engine', 0.4, 0.5, 0.2, 0.2, '#f59e0b'),
    ('Useful work', 0.75, 0.7, 0.2, 0.15, '#22c55e'),
    ('Cold reservoir\\n(environment)', 0.75, 0.2, 0.2, 0.15, '#3b82f6'),
]

for label, x, y, w, h, color in boxes:
    rect = plt.Rectangle((x, y), w, h, facecolor=color, alpha=0.3, edgecolor=color, linewidth=2)
    ax2.add_patch(rect)
    ax2.text(x + w/2, y + h/2, label, ha='center', va='center', color='white', fontsize=9)

# Arrows
arrow_props = dict(arrowstyle='->', color='white', linewidth=2)
ax2.annotate('', xy=(0.4, 0.6), xytext=(0.3, 0.7), arrowprops=arrow_props)
ax2.annotate('', xy=(0.75, 0.75), xytext=(0.6, 0.65), arrowprops=arrow_props)
ax2.annotate('', xy=(0.75, 0.3), xytext=(0.6, 0.5), arrowprops=arrow_props)

ax2.text(0.35, 0.72, f'Q_hot = {Q_hot}', color='#ef4444', fontsize=10)
ax2.text(0.68, 0.78, f'W = {W:.0f}', color='#22c55e', fontsize=10)
ax2.text(0.68, 0.42, f'Q_cold = {Q_cold:.0f}', color='#3b82f6', fontsize=10)
ax2.text(0.5, 0.35, f'η = {efficiency*100:.0f}%\\n(Carnot: {(1-298/850)*100:.0f}%)',
        color='white', fontsize=11, ha='center',
        bbox=dict(boxstyle='round', facecolor='#1f2937', edgecolor='#f59e0b'))

ax2.set_xlim(0, 1)
ax2.set_ylim(0, 1)
ax2.set_title('Energy Flow: First Law (conservation)', color='white', fontsize=13)
ax2.axis('off')

plt.tight_layout()
plt.show()

print("Laws of Thermodynamics summary:")
print("  0th: Thermal equilibrium is transitive (thermometers work)")
print("  1st: Energy is conserved: Q_in = W_out + Q_waste")
print("  2nd: Heat flows hot→cold; max efficiency = Carnot limit")
print("  3rd: Absolute zero is unreachable")
print()
print(f"At a coal power plant (T_hot=577°C):")
print(f"  Carnot limit: {(1-298/850)*100:.1f}%")
print(f"  Actual efficiency: ~33%")
print(f"  For every 100J of coal burned: 33J electricity, 67J waste heat")`,
      challenge: 'A Carnot engine operates between 1000°C and 25°C. It produces 1 MW of power. How much heat must be extracted from the hot reservoir per second? How much waste heat goes to the cold reservoir? (Hint: efficiency first, then Q_hot = W / η.)',
      successHint: 'The laws of thermodynamics are the bedrock of physics and engineering. They tell you what is possible, what is impossible, and what is the best you can theoretically achieve. Every engine, power plant, refrigerator, and living organism obeys these laws without exception.',
    },
    {
      title: 'Heat engines — turning heat into motion',
      concept: `A **heat engine** converts thermal energy into mechanical work. Every car, power plant, and jet engine is a heat engine.

**Basic cycle:**
1. Heat is absorbed from a hot source (burning fuel, nuclear reaction, solar heat)
2. Some heat is converted to work (pushing a piston, spinning a turbine)
3. Remaining heat is rejected to a cold sink (exhaust, cooling tower, atmosphere)

**Major heat engine cycles:**
- **Otto cycle** (gasoline engines): 4 strokes — intake, compression, power, exhaust. η ≈ 25-30%
- **Diesel cycle**: similar but fuel ignites from compression alone (no spark plug). η ≈ 35-40%
- **Rankine cycle** (steam turbines): water → steam → turbine → condenser. Used in most power plants. η ≈ 33-40%
- **Brayton cycle** (gas turbines): compress air → burn fuel → expand through turbine. Used in jet engines. η ≈ 30-40%
- **Combined cycle**: Brayton + Rankine (waste heat from gas turbine generates steam for a second turbine). η ≈ 60%

**Key insight**: the Second Law limits ALL heat engines. No matter how clever the design, you always waste some heat. The best we can do is approach the Carnot limit — and real engines always fall short due to friction, heat losses, and incomplete combustion.

The firewalker's body is, in a sense, a reverse heat engine — it's trying to REJECT heat (keep cool) rather than extract work from it.`,
      analogy: 'A heat engine is like a waterfall powering a water wheel. Heat flows "downhill" from hot to cold, just as water flows downhill from high to low. The engine captures some of this flow and converts it to useful work (spinning the wheel). But you can never capture ALL the flow — some water always reaches the bottom. The "height" of the waterfall is the temperature difference.',
      storyConnection: 'The Firewalker\'s Daughter\'s ancestors used fire long before they understood thermodynamics. But the principles were there: heat from the fire could boil water (Rankine cycle), turn a spit (mechanical work), or forge metal (thermal processing). Every use of fire is a heat engine in disguise.',
      checkQuestion: 'A car engine is only 25% efficient. Where does the other 75% of the fuel\'s energy go?',
      checkAnswer: 'About 30% exits as hot exhaust gas, 30% is removed by the cooling system (radiator), and 15% is lost to friction, pumping losses, and accessories. The exhaust heat is mandated by the Second Law (you must reject heat to a cold reservoir). Some of the cooling and friction losses are engineering limitations that could theoretically be reduced, but the exhaust heat loss is fundamental.',
      codeIntro: 'Simulate and compare the Otto and Diesel engine cycles on a P-V diagram.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Otto cycle (gasoline engine) P-V diagram
# Simplified: 4 processes

gamma = 1.4  # heat capacity ratio for air
r = 8  # compression ratio (Otto)
r_diesel = 18  # compression ratio (Diesel)
rc = 2.5  # cutoff ratio (Diesel)

# Otto cycle
V1_otto = 1.0  # arbitrary units (max volume)
V2_otto = V1_otto / r  # compressed volume
P1_otto = 1.0  # atmospheric

# Process 1→2: Isentropic compression
# Process 2→3: Constant volume heat addition
# Process 3→4: Isentropic expansion
# Process 4→1: Constant volume heat rejection

P2_otto = P1_otto * r**gamma
P3_otto = P2_otto * 3  # heat addition ratio
P4_otto = P3_otto * (V2_otto/V1_otto)**gamma

# Generate curves
n_points = 100
# 1→2 compression
V_12 = np.linspace(V1_otto, V2_otto, n_points)
P_12 = P1_otto * (V1_otto / V_12)**gamma

# 2→3 constant volume
V_23 = np.array([V2_otto, V2_otto])
P_23 = np.array([P2_otto, P3_otto])

# 3→4 expansion
V_34 = np.linspace(V2_otto, V1_otto, n_points)
P_34 = P3_otto * (V2_otto / V_34)**gamma

# 4→1 constant volume
V_41 = np.array([V1_otto, V1_otto])
P_41 = np.array([P4_otto, P1_otto])

# Diesel cycle
V1_d = 1.0
V2_d = V1_d / r_diesel
V3_d = V2_d * rc  # cutoff volume

P1_d = 1.0
P2_d = P1_d * r_diesel**gamma
P3_d = P2_d  # constant pressure
P4_d = P3_d * (V3_d/V1_d)**gamma

V_12d = np.linspace(V1_d, V2_d, n_points)
P_12d = P1_d * (V1_d / V_12d)**gamma
V_23d = np.linspace(V2_d, V3_d, n_points)
P_23d = np.ones(n_points) * P2_d
V_34d = np.linspace(V3_d, V1_d, n_points)
P_34d = P3_d * (V3_d / V_34d)**gamma

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5))
fig.patch.set_facecolor('#1f2937')

# Otto cycle
ax1.set_facecolor('#111827')
ax1.plot(V_12, P_12, color='#3b82f6', linewidth=2, label='1→2 Compression')
ax1.plot(V_23, P_23, color='#ef4444', linewidth=2, label='2→3 Heat in')
ax1.plot(V_34, P_34, color='#22c55e', linewidth=2, label='3→4 Expansion (POWER)')
ax1.plot(V_41, P_41, color='#f59e0b', linewidth=2, label='4→1 Heat out')

# Fill work area
V_cycle = np.concatenate([V_12, V_23, V_34[::-1], V_41[::-1]])
P_cycle = np.concatenate([P_12, P_23, P_34[::-1], P_41[::-1]])

ax1.set_xlabel('Volume (relative)', color='white')
ax1.set_ylabel('Pressure (relative)', color='white')
ax1.set_title(f'Otto Cycle (compression ratio = {r})', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Diesel cycle
ax2.set_facecolor('#111827')
ax2.plot(V_12d, P_12d, color='#3b82f6', linewidth=2, label='1→2 Compression')
ax2.plot(V_23d, P_23d, color='#ef4444', linewidth=2, label='2→3 Heat in (const P)')
ax2.plot(V_34d, P_34d, color='#22c55e', linewidth=2, label='3→4 Expansion (POWER)')
ax2.plot([V1_d, V1_d], [P4_d, P1_d], color='#f59e0b', linewidth=2, label='4→1 Heat out')

ax2.set_xlabel('Volume (relative)', color='white')
ax2.set_ylabel('Pressure (relative)', color='white')
ax2.set_title(f'Diesel Cycle (compression ratio = {r_diesel})', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

# Calculate efficiencies
eta_otto = 1 - 1/r**(gamma-1)
eta_diesel = 1 - (1/r_diesel**(gamma-1)) * (rc**gamma - 1) / (gamma * (rc - 1))

print(f"Theoretical efficiencies:")
print(f"  Otto cycle (r={r}): {eta_otto*100:.1f}%")
print(f"  Diesel cycle (r={r_diesel}): {eta_diesel*100:.1f}%")
print()
print(f"Diesel is more efficient because higher compression ratio")
print(f"(limited in Otto by spark knock / pre-ignition)")
print()
print(f"The enclosed area on the P-V diagram = net work output.")
print(f"Larger area = more work per cycle = more power.")`,
      challenge: 'What if we increase the Otto cycle compression ratio from 8 to 12? Calculate the new efficiency. Why can\'t we just keep increasing the ratio? (Hint: research "engine knock.")',
      successHint: 'Heat engines are the machines that powered the Industrial Revolution and still generate 80% of the world\'s electricity. Understanding their cycles is understanding the technology that shapes civilization.',
    },
    {
      title: 'Entropy — the arrow of time',
      concept: `**Entropy** (S) is a measure of disorder or, more precisely, the number of ways a system can be arranged (microstates) while looking the same from the outside (macrostate).

**The Second Law restated**: the total entropy of an isolated system always increases or stays the same. It never decreases. This is the only law of physics that distinguishes past from future — the "arrow of time."

**Entropy in everyday life:**
- A hot cup of coffee cools down (entropy increases). A cold cup never spontaneously heats up.
- An egg breaks easily (entropy increases). A broken egg never reassembles.
- A room gets messy over time (entropy increases). It never cleans itself.
- Fuel burns to CO₂ and water (entropy increases). CO₂ and water never spontaneously become fuel.

**Entropy change:** ΔS = Q / T (at constant temperature)
- Adding heat to a cold object increases entropy more than adding the same heat to a hot object
- This is why heat flows from hot to cold — it maximizes the total entropy gain

**Information and entropy**: Claude Shannon proved that entropy in physics and entropy in information theory are mathematically identical. Data compression, error correction, and encryption all use entropy.

**Firewalking**: the heat flowing from coals to feet increases the universe's entropy. The coals lose entropy (they cool), the feet gain entropy (they warm). But the net change is positive — as the Second Law demands.`,
      analogy: 'Entropy is like shuffling a deck of cards. A new, sorted deck is low entropy (one specific arrangement out of trillions). After shuffling, it\'s high entropy (one of many random arrangements). You can shuffle forever and never return to the sorted order — not because it\'s impossible, but because it\'s astronomically unlikely. The universe is a deck that\'s been shuffled since the Big Bang.',
      storyConnection: 'The Firewalker\'s Daughter could not reverse the flow of heat from coal to foot any more than she could unscramble an egg. The Second Law is absolute. Her skill was not in defying entropy but in managing the RATE of entropy increase — keeping the heat transfer slow enough, brief enough, that her body could handle the change.',
      checkQuestion: 'A refrigerator moves heat from cold (inside, 4°C) to hot (kitchen, 25°C). This seems to violate the Second Law (heat going from cold to hot). Why doesn\'t it?',
      checkAnswer: 'The refrigerator uses electrical work to force heat "uphill." The electricity was generated by a power plant that produced MORE entropy than the refrigerator reduces. Total entropy of the universe still increases: the decrease inside the fridge is more than offset by the increase at the power plant. The Second Law applies to the TOTAL system — local decreases in entropy are fine as long as they\'re paid for by larger increases elsewhere.',
      codeIntro: 'Simulate entropy and demonstrate why the arrow of time points one way.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulation: gas molecules in a box (ideal gas)
# Start: all molecules on the left side (low entropy)
# Watch them spread out (entropy increases)

n_particles = 200
n_steps = 500
box_width = 100

# Initialize all particles on the left
positions = np.random.uniform(0, box_width/4, (n_particles, 2))
positions[:, 1] = np.random.uniform(0, box_width, n_particles)

# Track entropy metric: how evenly distributed are particles?
# Divide box into 10 columns, count particles in each
n_bins = 10
entropy_history = []

def calc_entropy(pos, n_bins, box_width):
    """Calculate spatial entropy from particle positions"""
    counts, _ = np.histogram(pos[:, 0], bins=n_bins, range=(0, box_width))
    probs = counts / counts.sum()
    probs = probs[probs > 0]  # avoid log(0)
    return -np.sum(probs * np.log(probs))

max_entropy = np.log(n_bins)  # maximum possible (uniform distribution)

# Simulate random walk
snapshots = []
for step in range(n_steps):
    # Random walk: each particle moves randomly
    positions += np.random.normal(0, 2, positions.shape)
    # Reflect off walls
    positions = np.clip(positions, 0, box_width)

    entropy = calc_entropy(positions, n_bins, box_width)
    entropy_history.append(entropy)

    if step in [0, 10, 50, 200, 499]:
        snapshots.append((step, positions.copy()))

fig, axes = plt.subplots(2, 3, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

# Snapshots of particle positions
for idx, (step, pos) in enumerate(snapshots):
    ax = axes[0][idx] if idx < 3 else axes[1][idx-3]
    ax.set_facecolor('#111827')
    ax.scatter(pos[:, 0], pos[:, 1], s=3, color='#22c55e', alpha=0.6)
    ax.set_xlim(0, box_width)
    ax.set_ylim(0, box_width)
    ax.set_title(f'Step {step} (S = {entropy_history[step]:.2f})', color='white', fontsize=10)
    ax.set_aspect('equal')
    ax.tick_params(colors='gray')

# Entropy over time
ax_entropy = axes[1][2]
ax_entropy.set_facecolor('#111827')
ax_entropy.plot(entropy_history, color='#f59e0b', linewidth=1.5)
ax_entropy.axhline(max_entropy, color='#22c55e', linestyle='--', linewidth=1,
                   label=f'Max entropy (uniform) = {max_entropy:.2f}')
ax_entropy.set_xlabel('Time steps', color='white')
ax_entropy.set_ylabel('Entropy (S)', color='white')
ax_entropy.set_title('Entropy Always Increases', color='white', fontsize=11)
ax_entropy.legend(facecolor='#1f2937', labelcolor='white', fontsize=8)
ax_entropy.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Entropy simulation:")
print(f"  Initial entropy: {entropy_history[0]:.3f} (particles clustered)")
print(f"  Final entropy:   {entropy_history[-1]:.3f} (particles spread out)")
print(f"  Maximum entropy: {max_entropy:.3f} (perfectly uniform)")
print()
print("The particles NEVER return to the clustered state.")
print("This is the arrow of time: entropy increases, always.")
print("A universe where entropy decreases would look like a movie playing backward.")`,
      challenge: 'Run the simulation 1000 times and track whether entropy ever decreases significantly (by more than 10%) for even a single step. Plot a histogram of step-to-step entropy changes. Verify that decreases are tiny and rare.',
      successHint: 'Entropy is the deepest concept in thermodynamics. It connects physics to information theory, to statistics, to the arrow of time itself. Understanding entropy means understanding why the universe runs forward, not backward — and why the Firewalker\'s coal bed will never spontaneously reheat.',
    },
    {
      title: 'Thermal equilibrium — everything reaches the same temperature',
      concept: `**Thermal equilibrium** is the state where all parts of a system reach the same temperature, and no heat flows. It is the final state toward which all thermal processes march.

**Newton's Law of Cooling**: the rate of cooling is proportional to the temperature difference between the object and its surroundings:
**dT/dt = -h × (T - T_environment)**

This gives an exponential decay:
**T(t) = T_env + (T_initial - T_env) × e^(-ht)**

Where h depends on:
- Surface area (larger → cools faster)
- Thermal properties of the material and surrounding fluid
- Whether convection is natural (still air) or forced (fan, wind)

**Applications:**
- **Forensic science**: body cooling rate estimates time of death
- **Food safety**: how quickly must hot food cool to prevent bacterial growth?
- **Engineering**: how long until an engine reaches operating temperature?
- **Climate**: how fast does the ocean absorb excess atmospheric heat?

**Firewalking**: the coal bed is in a cooling curve. At the start of the ceremony, coals may be 600°C. By the time the last walker crosses, they've cooled to 350°C. Timing matters — the first walker faces the most danger.`,
      analogy: 'Thermal equilibrium is like mixing paint. Drop red paint (hot object) into a bucket of blue (cold surroundings). At first, red and blue are distinct. But mixing (heat transfer) is relentless, and eventually everything becomes a uniform purple (equilibrium temperature). You can\'t unmix it — the Second Law again.',
      storyConnection: 'After the firewalking ceremony, the Firewalker\'s Daughter returned to see the coal pit at dawn. The coals were dark and cool — they had reached thermal equilibrium with the morning air. The same physics that made the walk dangerous at night made the pit harmless by morning. Equilibrium is the universe\'s default state; everything else is temporary.',
      checkQuestion: 'A cup of tea at 80°C sits in a room at 20°C. After 5 minutes it\'s 60°C. How long until it reaches 40°C? (Hint: it\'s not another 5 minutes — Newton\'s cooling law is exponential, not linear.)',
      checkAnswer: 'Using Newton\'s cooling: at t=5, T=60°C. So 60 = 20 + (80-20)e^(-5h). Solving: e^(-5h) = 40/60 = 0.667, h = -ln(0.667)/5 = 0.081. For T=40°C: 40 = 20 + 60e^(-0.081t). e^(-0.081t) = 20/60 = 0.333. t = -ln(0.333)/0.081 = 13.6 minutes. So another 8.6 minutes after the 5-minute mark. Cooling slows as the temperature difference shrinks.',
      codeIntro: 'Simulate Newton\'s law of cooling for different objects and conditions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Newton's Law of Cooling: T(t) = T_env + (T0 - T_env) * exp(-h*t)
T_env = 25  # room temperature (°C)
time = np.linspace(0, 120, 200)  # minutes

# Different objects cooling in the same room
objects = {
    'Cup of tea': {'T0': 85, 'h': 0.05, 'color': '#ef4444'},
    'Hot pan (iron)': {'T0': 200, 'h': 0.02, 'color': '#f59e0b'},
    'Coal bed': {'T0': 500, 'h': 0.01, 'color': '#a855f7'},
    'Hot soup (bowl)': {'T0': 70, 'h': 0.03, 'color': '#22c55e'},
    'Laptop battery': {'T0': 50, 'h': 0.08, 'color': '#3b82f6'},
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

# Cooling curves
ax1.set_facecolor('#111827')
for name, props in objects.items():
    T = T_env + (props['T0'] - T_env) * np.exp(-props['h'] * time)
    ax1.plot(time, T, color=props['color'], linewidth=2, label=f'{name} ({props["T0"]}°C)')

ax1.axhline(T_env, color='#6b7280', linestyle='--', linewidth=1, label=f'Room temp ({T_env}°C)')
ax1.set_xlabel('Time (minutes)', color='white')
ax1.set_ylabel('Temperature (°C)', color='white')
ax1.set_title("Newton's Law of Cooling", color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Cooling rate (derivative) vs temperature difference
ax2.set_facecolor('#111827')
for name, props in objects.items():
    T = T_env + (props['T0'] - T_env) * np.exp(-props['h'] * time)
    delta_T = T - T_env
    cooling_rate = props['h'] * delta_T  # °C per minute
    ax2.plot(delta_T, cooling_rate, color=props['color'], linewidth=2, label=name)

ax2.set_xlabel('Temperature difference ΔT (°C)', color='white')
ax2.set_ylabel('Cooling rate (°C/min)', color='white')
ax2.set_title('Cooling Rate is Proportional to ΔT', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

# Time to cool to specific thresholds
print("Time to cool to safe touch (50°C):")
for name, props in objects.items():
    if props['T0'] > 50:
        t_safe = -np.log((50 - T_env) / (props['T0'] - T_env)) / props['h']
        print(f"  {name:20s}: {t_safe:.1f} minutes")
    else:
        print(f"  {name:20s}: already below 50°C")

print()
print("The key insight: objects that start hotter take longer to cool,")
print("but the RATE of cooling also starts higher.")
print("The exponential decay means the last few degrees take the longest.")`,
      challenge: 'A forensic investigator finds a body at 28°C in a room at 20°C. Normal body temperature is 37°C. Using Newton\'s cooling law with h=0.015/min, estimate the time of death. This is how real forensic science works.',
      successHint: 'Thermal equilibrium is the universe\'s destination. Everything cools (or warms) until it matches its surroundings. Newton\'s law of cooling gives us the math to predict the journey — from firewalking safety to forensic time-of-death estimates.',
    },
    {
      title: 'Insulation design — engineering against heat loss',
      concept: `**Thermal insulation** slows heat transfer to keep things hot (or cold). Designing effective insulation requires understanding all three heat transfer modes.

**The R-value** measures insulation effectiveness:
**R = L / k** (thermal resistance per unit area)
- L = thickness (m)
- k = thermal conductivity (W/m·K)
- Higher R = better insulation

**Total R-value for multiple layers:**
**R_total = R1 + R2 + R3 + ...**
(Like resistors in series — resistances add up)

**Heat flow through insulation:**
**Q = A × ΔT / R_total**

**Design principles:**
- **Trap still air**: moving air convects heat away. Still air in small pockets is one of the best insulators (down jackets, foam, fiberglass)
- **Reflective barriers**: block radiation with low-emissivity surfaces (foil-backed insulation)
- **Vapor barriers**: moisture destroys insulation effectiveness (wet fiberglass conducts 10× more than dry)
- **Thermal bridging**: a metal screw through insulation creates a "highway" for heat — the weakest link dominates

**Building insulation in NE India:**
- Walls: brick (R=0.5) + air gap (R=0.2) + plaster (R=0.1) = R=0.8 (poor)
- Adding 5cm foam: R=0.8 + 1.25 = R=2.05 (2.5× better)
- Assam-style bamboo walls with mud plaster actually perform well: bamboo is naturally insulating`,
      analogy: 'Designing insulation is like dressing for winter. One thick layer (jacket) is okay, but multiple thin layers (base layer + fleece + windbreaker) are better because air gets trapped between layers. A reflective emergency blanket (radiation blocker) on the outside helps most. And if any layer gets wet, you lose — just like wet insulation.',
      storyConnection: 'The Firewalker\'s Daughter would later build homes in her village. She applied what she learned from fire: the walls that kept heat OUT in summer could keep heat IN during winter. She used double-layered bamboo walls with dried grass between them — trapped air, low conductivity, natural materials. She was an insulation engineer without the title.',
      checkQuestion: 'A house loses heat through its walls (35%), roof (25%), windows (15%), floor (15%), and air leaks (10%). Where should you invest first in insulation?',
      checkAnswer: 'Walls (35%) — the largest loss channel. But the most cost-effective improvement is often air leaks (10%) — sealing gaps is cheap and eliminates convective heat loss entirely. Next: the roof (hot air rises, so roof insulation has an outsized impact per dollar). Windows are expensive to replace, and floors are hard to access. The optimal strategy maximizes R-value gain per dollar spent, not per percentage of loss.',
      codeIntro: 'Design and compare insulation systems by calculating total R-values and heat loss.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Building insulation comparison
# Standard NE India house vs well-insulated house

# Material R-values (m²·K/W per cm of thickness)
materials = {
    'Brick': 0.01,        # R per cm
    'Concrete': 0.005,
    'Bamboo': 0.02,
    'Wood': 0.08,
    'Fiberglass': 0.25,
    'Foam board': 0.25,
    'Aerogel': 0.65,
    'Still air': 0.15,
    'Glass (window)': 0.01,
}

# Wall configurations (material, thickness in cm)
configs = {
    'Bare brick': [('Brick', 23)],
    'Brick + plaster': [('Brick', 23), ('Concrete', 2)],
    'Brick + foam': [('Brick', 23), ('Foam board', 5)],
    'Bamboo double': [('Bamboo', 3), ('Still air', 5), ('Bamboo', 3)],
    'Insulated frame': [('Wood', 2), ('Fiberglass', 10), ('Wood', 2)],
}

# Calculate R-values
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# R-value comparison
ax1.set_facecolor('#111827')
config_names = list(configs.keys())
r_values = []
for name, layers in configs.items():
    r_total = sum(materials[mat] * thick for mat, thick in layers)
    r_values.append(r_total)

colors_bar = ['#ef4444', '#f59e0b', '#3b82f6', '#22c55e', '#a855f7']
bars = ax1.bar(config_names, r_values, color=colors_bar, edgecolor='none')

for bar, r in zip(bars, r_values):
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.05,
            f'R = {r:.2f}', ha='center', color='white', fontsize=9)

ax1.set_ylabel('Total R-value (m²·K/W)', color='white')
ax1.set_title('Wall Insulation R-Values', color='white', fontsize=13)
ax1.tick_params(colors='gray')
plt.setp(ax1.get_xticklabels(), rotation=20, ha='right', color='white', fontsize=8)

# Heat loss for a whole house (simplified)
ax2.set_facecolor('#111827')
# House: 100 m² walls, 80 m² roof, 80 m² floor, 15 m² windows
# ΔT = 15°C (25°C outside, 10°C in winter... or vice versa)
delta_T = 15
wall_area = 100
roof_area = 80
floor_area = 80
window_area = 15

# Standard house
standard = {
    'Walls': wall_area * delta_T / 0.23,
    'Roof': roof_area * delta_T / 0.15,
    'Floor': floor_area * delta_T / 0.20,
    'Windows': window_area * delta_T / 0.05,
    'Air leaks': 500,
}

# Insulated house
insulated = {
    'Walls': wall_area * delta_T / 2.5,
    'Roof': roof_area * delta_T / 3.0,
    'Floor': floor_area * delta_T / 1.5,
    'Windows': window_area * delta_T / 0.3,
    'Air leaks': 100,
}

x = np.arange(len(standard))
w = 0.35
component_colors = ['#ef4444', '#f59e0b', '#3b82f6', '#22c55e', '#a855f7']

bars1 = ax2.bar(x - w/2, list(standard.values()), w, color=component_colors, alpha=0.5, label='Standard house')
bars2 = ax2.bar(x + w/2, list(insulated.values()), w, color=component_colors, alpha=0.9, label='Insulated house')

ax2.set_xticks(x)
ax2.set_xticklabels(list(standard.keys()), color='white', fontsize=9)
ax2.set_ylabel('Heat loss (Watts)', color='white')
ax2.set_title('Heat Loss by Component (ΔT = 15°C)', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

total_standard = sum(standard.values())
total_insulated = sum(insulated.values())
print(f"Total heat loss:")
print(f"  Standard house:  {total_standard:,.0f} W ({total_standard*24*180/1000:.0f} kWh/winter)")
print(f"  Insulated house: {total_insulated:,.0f} W ({total_insulated*24*180/1000:.0f} kWh/winter)")
print(f"  Reduction: {(1-total_insulated/total_standard)*100:.0f}%")
print()
print("The insulated house uses 1/5th the energy for heating.")
print("Insulation is the single most cost-effective energy investment.")`,
      challenge: 'Design the most cost-effective insulation upgrade for the standard house. Budget: Rs 50,000. Costs: foam wall insulation = Rs 200/m², roof insulation = Rs 150/m², double-glazed windows = Rs 3,000/m², air sealing = Rs 5,000 total. What combination of upgrades minimizes total heat loss within the budget?',
      successHint: 'Insulation design is applied thermodynamics. The same physics that the Firewalker\'s Daughter used to survive hot coals — low conductivity, trapped air, brief contact — is what keeps billions of people comfortable in buildings worldwide.',
    },
    {
      title: 'Thermal imaging applications — seeing heat',
      concept: `Every object above absolute zero emits **infrared radiation** (heat). A **thermal camera** detects this radiation and converts it into a visible image where colors represent temperatures.

**How thermal cameras work:**
- A microbolometer array (like a digital camera sensor) detects infrared radiation (wavelengths 8-14 μm)
- Each pixel measures the temperature of the object it "sees"
- Software maps temperatures to colors (typically: blue = cold, red = hot, white = very hot)
- Resolution: typically 320×240 to 640×480 pixels (much lower than visible cameras)

**Applications:**

1. **Building inspection**: find heat leaks, missing insulation, moisture damage
2. **Electrical maintenance**: hot spots on power lines or circuit boards indicate faults
3. **Medical diagnosis**: inflammation, blood flow problems, fever screening
4. **Firefighting**: see through smoke, find fire hotspots, locate people
5. **Wildlife research**: count animals at night, track migration
6. **Industrial**: monitor furnaces, kilns, pipelines, machinery bearing temperatures
7. **Military/security**: night vision, target detection

**Key physics:**
- **Stefan-Boltzmann Law**: power emitted = ε × σ × A × T⁴
  - Total radiation increases as the FOURTH POWER of temperature
  - Doubling the temperature (K) increases radiation 16×
- **Wien's Law**: peak wavelength = 2,898 / T(K) μm
  - Room temperature objects (~300 K): peak at ~10 μm (far infrared)
  - Glowing coals (~800 K): peak at ~3.6 μm (shifts toward visible red)`,
      analogy: 'A thermal camera is like heat-vision goggles from science fiction, except they\'re real and available for $200. Where a regular camera captures reflected visible light, a thermal camera captures emitted infrared light. Everything "glows" in infrared — warm objects glow brighter. It\'s like the whole world is covered in temperature-sensitive paint.',
      storyConnection: 'If the Firewalker\'s Daughter had a thermal camera, she could have mapped the exact temperature of every coal before walking. She\'d see hot spots (still-burning coals) and cool spots (ash-covered, safer). She\'d see the heat dissipating from her own feet after each step. Thermal imaging turns the invisible danger of heat into visible, actionable data.',
      checkQuestion: 'A thermal camera image shows a building wall that is mostly blue (cold) with a bright yellow stripe. What could cause this?',
      checkAnswer: 'The yellow stripe indicates heat escaping through that part of the wall. Most likely causes: (1) Missing insulation behind the wall at that location. (2) A thermal bridge — a metal beam or concrete column that conducts heat from inside to outside. (3) A hot water pipe running inside the wall. (4) An air leak (gap in the building envelope). Thermal imaging makes these invisible problems immediately visible.',
      codeIntro: 'Simulate thermal images and demonstrate the Stefan-Boltzmann radiation law.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Stefan-Boltzmann Law: P = ε * σ * A * T^4
sigma = 5.67e-8  # W/(m²·K⁴)

# 1. Radiation power vs temperature
T_range = np.linspace(200, 1500, 200)  # Kelvin
P_range = sigma * T_range**4  # W/m²

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

# Radiation power curve
ax1.set_facecolor('#111827')
ax1.plot(T_range - 273.15, P_range / 1000, color='#ef4444', linewidth=2)
ax1.fill_between(T_range - 273.15, P_range / 1000, alpha=0.1, color='#ef4444')

# Mark key temperatures
key_temps = [
    (25, 'Room temp', '#3b82f6'),
    (37, 'Body temp', '#22c55e'),
    (100, 'Boiling water', '#f59e0b'),
    (500, 'Firewalking coals', '#ef4444'),
    (1000, 'Molten steel', '#a855f7'),
]
for T_C, label, color in key_temps:
    T_K = T_C + 273.15
    P = sigma * T_K**4
    ax1.plot(T_C, P/1000, 'o', color=color, markersize=8, zorder=5)
    ax1.annotate(f'{label}\\n{P/1000:.1f} kW/m²', xy=(T_C, P/1000),
                xytext=(10, 10), textcoords='offset points',
                color=color, fontsize=8)

ax1.set_xlabel('Temperature (°C)', color='white')
ax1.set_ylabel('Radiated power (kW/m²)', color='white')
ax1.set_title('Stefan-Boltzmann Law: Radiation ∝ T⁴', color='white', fontsize=13)
ax1.tick_params(colors='gray')

# Simulated thermal image of a building
ax2.set_facecolor('#111827')
np.random.seed(42)

# Create a building thermal image
image = np.ones((50, 80)) * 10  # base: cold wall (10°C)

# Windows (warmer — heat escaping)
image[5:15, 10:25] = 15
image[5:15, 35:50] = 15
image[5:15, 55:70] = 15
image[25:35, 10:25] = 15
image[25:35, 35:50] = 15
image[25:35, 55:70] = 15

# Thermal bridge (metal beam)
image[20:22, :] = 18

# Hot spot (insulation gap)
image[30:38, 60:72] = 22

# Door (warm — heat leak)
image[38:50, 33:45] = 17

# Add noise
image += np.random.normal(0, 0.5, image.shape)

im = ax2.imshow(image, cmap='inferno', vmin=5, vmax=25, aspect='auto')
plt.colorbar(im, ax=ax2, label='Temperature (°C)')
ax2.set_title('Simulated Thermal Image: Building Facade', color='white', fontsize=12)
ax2.tick_params(colors='gray')

# Annotate problems
ax2.annotate('Thermal bridge', xy=(40, 21), xytext=(60, 18),
            color='white', fontsize=8, arrowprops=dict(arrowstyle='->', color='white'))
ax2.annotate('Insulation gap!', xy=(66, 34), xytext=(72, 42),
            color='#f59e0b', fontsize=8, fontweight='bold',
            arrowprops=dict(arrowstyle='->', color='#f59e0b'))

plt.tight_layout()
plt.show()

print("Stefan-Boltzmann radiation law: P = σ × T⁴")
print()
print("Radiation power at key temperatures:")
for T_C, label, _ in key_temps:
    T_K = T_C + 273.15
    P = sigma * T_K**4
    print(f"  {label:20s} ({T_C}°C): {P:>10,.0f} W/m²")
print()
print(f"Firewalking coals radiate {sigma*(773)**4 / sigma*(310)**4:.0f}× more")
print("than a human body. This is why you feel the heat from meters away.")
print()
print("Thermal imaging applications:")
print("  Building: find heat leaks, missing insulation, moisture")
print("  Medical: detect inflammation, fever, circulation problems")
print("  Industrial: monitor equipment for overheating")
print("  Wildlife: count animals at night without disturbing them")`,
      challenge: 'Wien\'s displacement law: peak wavelength = 2898 / T(K). At what temperature does an object\'s peak radiation shift into the visible spectrum (wavelength < 0.7 μm, i.e., red light)? This is the temperature at which objects begin to "glow red." Calculate it.',
      successHint: 'From the laws of thermodynamics to heat engines to entropy to equilibrium to insulation to thermal imaging — you now have the complete framework of thermal physics. The Firewalker\'s Daughter\'s walk was the first lesson; engineering the modern world with thermal science is the destination.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Builds on Level 1 thermal physics foundations</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for thermodynamics simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
            />
        ))}
      </div>
    </div>
  );
}
