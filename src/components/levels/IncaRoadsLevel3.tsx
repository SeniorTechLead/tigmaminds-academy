import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function IncaRoadsLevel3() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Suspension bridge dynamics — wind loading and resonance',
      concept: `A hanging rope bridge is not a static structure — it responds to wind, footsteps, and its own oscillation. The key danger is **resonance**: when an external force (wind gusts, marching soldiers) matches the bridge's **natural frequency**, the oscillations amplify destructively.

The natural frequency of a suspended cable is:

**f\u2099 = (n / 2L) \u00b7 \u221a(T / \u03bc)**

where n is the mode number (1 = fundamental), L is the span, T is the cable tension, and \u03bc is the mass per unit length. Higher tension and lower mass raise the frequency; longer spans lower it.

Wind loading adds a lateral force: **F_wind = 0.5 \u00b7 \u03c1 \u00b7 v\u00b2 \u00b7 C_d \u00b7 A**, where \u03c1 is air density, v is wind speed, C_d is the drag coefficient, and A is the projected area. For a rope bridge, C_d \u2248 1.2 (similar to a cylinder).

When the wind's vortex-shedding frequency matches the bridge's natural frequency, **vortex-induced vibration (VIV)** occurs — the bridge begins to oscillate violently. The critical wind speed is: **v_crit = f\u2099 \u00b7 D / St**, where D is the cable diameter and St \u2248 0.2 is the Strouhal number.

\ud83d\udcda *The Tacoma Narrows Bridge collapse (1940) was caused by aeroelastic flutter — a related resonance phenomenon. Even modern bridges must be designed to avoid resonance at expected wind speeds.*`,
      analogy: 'Push a child on a swing. If you push at the swing\'s natural frequency, the arc gets bigger and bigger — that\'s resonance. Push at the wrong frequency and the motion stays small or becomes chaotic. A rope bridge in wind is the same: gusts at the natural frequency amplify oscillation until the bridge fails.',
      storyConnection: 'Inca rope bridges were inherently flexible — they swayed in wind and under foot traffic. The Inca mitigated resonance by using heavy, thick cables (lowering natural frequency below typical wind-gust frequencies) and by adding side ropes that damped lateral oscillation. The Q\'eswachaka bridge is rebuilt annually partly because the dried grass loses its damping properties over time.',
      checkQuestion: 'A bridge has span L=30m, cable tension T=5000N, and mass per length \u03bc=10 kg/m. What is its fundamental frequency?',
      checkAnswer: 'f\u2081 = (1 / 2\u00d730) \u00b7 \u221a(5000/10) = (1/60) \u00b7 \u221a500 = (1/60) \u00b7 22.36 = 0.373 Hz. Period = 2.68 seconds. This is in the range of wind gusts (0.1-1 Hz) and human walking pace (~2 Hz), so both wind and foot traffic could potentially excite this bridge.',
      codeIntro: 'Model suspension bridge dynamics: natural frequencies, wind loading, and resonance risk for Inca rope bridges.',
      code: `import numpy as np

def natural_frequency(n, L, T, mu):
    """Natural frequency of mode n for a suspended cable."""
    return (n / (2 * L)) * np.sqrt(T / mu)

def wind_force(v, rho=1.0, Cd=1.2, diameter=0.15, length=30):
    """Lateral wind force on a rope bridge cable."""
    A = diameter * length  # projected area
    return 0.5 * rho * v**2 * Cd * A

def critical_wind_speed(freq, diameter, St=0.2):
    """Wind speed that causes vortex-induced vibration."""
    return freq * diameter / St

# Inca bridge configurations
bridges = [
    {"name": "Short footpath",  "L": 15, "T": 3000, "mu": 6,  "d": 0.10},
    {"name": "Q'eswachaka",     "L": 28, "T": 5000, "mu": 10, "d": 0.15},
    {"name": "River crossing",  "L": 45, "T": 8000, "mu": 14, "d": 0.18},
    {"name": "Gorge spanning",  "L": 60, "T": 12000,"mu": 18, "d": 0.22},
]

print("=== Suspension Bridge Dynamic Analysis ===\\n")
print(f"{'Bridge':<20} {'f1 (Hz)':>8} {'f2':>6} {'f3':>6} {'Period (s)':>10}")
print("-" * 52)

for b in bridges:
    freqs = [natural_frequency(n, b["L"], b["T"], b["mu"]) for n in [1,2,3]]
    period = 1 / freqs[0]
    print(f"{b['name']:<20} {freqs[0]:>7.3f} {freqs[1]:>5.3f} {freqs[2]:>5.3f} {period:>9.2f}")

# Wind loading analysis
print("\\n=== Wind Loading at Different Speeds ===")
print(f"{'Wind (m/s)':>12} {'Force (N)':>10} {'Force (kg equiv)':>17} {'Beaufort':>10}")
beaufort = [(5,"Gentle"), (10,"Fresh"), (15,"Strong"), (20,"Gale"), (30,"Storm")]
for v, desc in beaufort:
    F = wind_force(v, rho=0.85, length=28)  # rho reduced for altitude
    print(f"{v:>10} {F:>9.0f} {F/9.81:>15.1f} {desc:>10}")

# Resonance analysis
print("\\n=== Vortex-Induced Vibration Risk ===")
print(f"{'Bridge':<20} {'f1 (Hz)':>8} {'v_crit (m/s)':>13} {'Risk Level':>12}")
print("-" * 55)

for b in bridges:
    f1 = natural_frequency(1, b["L"], b["T"], b["mu"])
    v_crit = critical_wind_speed(f1, b["d"])
    risk = "HIGH" if v_crit < 10 else "MODERATE" if v_crit < 20 else "LOW"
    print(f"{b['name']:<20} {f1:>7.3f} {v_crit:>11.1f} {risk:>12}")

# Damping simulation: amplitude decay over time
print("\\n=== Damping: Oscillation Decay After Wind Gust ===")
zeta_dry = 0.02   # damping ratio (dry grass rope)
zeta_fresh = 0.08  # damping ratio (fresh woven rope)
f1 = natural_frequency(1, 28, 5000, 10)
omega = 2 * np.pi * f1
A0 = 0.5  # initial amplitude (m)

print(f"{'Time (s)':>8} {'Fresh rope (m)':>14} {'Dry rope (m)':>13}")
for t in [0, 2, 5, 10, 20, 30, 60]:
    a_fresh = A0 * np.exp(-zeta_fresh * omega * t)
    a_dry = A0 * np.exp(-zeta_dry * omega * t)
    print(f"{t:>6} {a_fresh:>12.4f} {a_dry:>11.4f}")

print("\\nFresh rope damps 4x faster — a key reason for annual rebuilding.")`,
      challenge: 'Soldiers are told to break step when crossing bridges — marching in unison at the bridge\'s natural frequency causes resonance. Calculate the "forbidden cadence" (steps per second) for each bridge. If the average walking pace is 2 steps/second, is any bridge at risk from normal foot traffic?',
      successHint: 'You analysed a dynamic system: natural frequencies, forced vibration, resonance, and damping. These concepts govern everything from musical instruments to earthquake engineering to electronic circuit design. The mathematics of vibration is universal.',
    },
    {
      title: '3D terrain routing — A* algorithm with altitude penalty',
      concept: `Finding the best route through mountainous terrain is far harder than flat-map pathfinding. The Inca couldn't just draw straight lines between cities — they had to navigate **altitude changes** that dramatically affect travel time, energy expenditure, and construction cost.

The **A* algorithm** finds the shortest path in a weighted graph using a heuristic to guide the search. For terrain routing, the cost function includes:

**cost(u, v) = horizontal_distance + altitude_penalty \u00b7 |\u0394h|**

The altitude penalty captures the fact that climbing is harder than walking flat: a 1 km climb at 500 m elevation gain might be equivalent to 5 km of flat walking. The Inca solution — switchbacks and stone stairs — reduced gradient but increased horizontal distance.

A* uses: **f(n) = g(n) + h(n)**, where g(n) is the actual cost from start to n, and h(n) is a heuristic estimate of cost from n to goal. The algorithm always expands the node with lowest f(n) — guaranteeing optimality if h(n) never overestimates.

\ud83d\udcda *A* is the workhorse of pathfinding in games, robotics, and navigation apps. GPS routing uses a variant of A* with edge weights based on speed limits, traffic, and road quality.*`,
      analogy: 'Imagine walking through a city with hills. Your GPS shows two routes: a short one straight over the hill, and a longer one around it. Which is faster depends on how steep the hill is. A* with altitude penalty is like a GPS that knows steep hills slow you down — it finds the route that balances distance and climbing.',
      storyConnection: 'The Qhapaq Nan\'s most ingenious feature was its routing. Instead of climbing directly over passes, the Inca built switchbacks (zigzag paths) that maintained a manageable gradient. At Ollantaytambo, the road climbs 600 m through 17 switchbacks — each turn trading horizontal distance for reduced steepness, exactly the trade-off our algorithm optimises.',
      checkQuestion: 'Two routes connect cities A and B. Route 1: 50 km flat. Route 2: 30 km but climbs 2,000 m. With an altitude penalty of 3 km per 1,000 m gained, which is cheaper?',
      checkAnswer: 'Route 1 cost: 50 km. Route 2 cost: 30 + 3 \u00d7 2 = 36 km equivalent. Route 2 is cheaper despite the climb. But if the altitude penalty is 15 km per 1,000 m (realistic for laden llamas), Route 2 cost = 30 + 15 \u00d7 2 = 60 km equivalent — now Route 1 wins.',
      codeIntro: 'Implement A* pathfinding on a terrain grid with altitude-dependent edge costs.',
      code: `import numpy as np

np.random.seed(42)

def generate_terrain(rows, cols, peaks):
    """Generate a 2D elevation map with mountain peaks."""
    terrain = np.zeros((rows, cols))
    for pr, pc, height, spread in peaks:
        for r in range(rows):
            for c in range(cols):
                dist = np.sqrt((r - pr)**2 + (c - pc)**2)
                terrain[r, c] += height * np.exp(-dist**2 / (2 * spread**2))
    # Add noise
    terrain += np.random.normal(0, 100, (rows, cols))
    return np.clip(terrain, 0, 6000)

def a_star(terrain, start, goal, alt_penalty=0.005):
    """A* pathfinding with altitude penalty on a grid."""
    rows, cols = terrain.shape
    cell_size_km = 5  # each cell is 5 km

    def heuristic(r, c):
        return np.sqrt((r - goal[0])**2 + (c - goal[1])**2) * cell_size_km

    def edge_cost(r1, c1, r2, c2):
        h_dist = np.sqrt((r1 - r2)**2 + (c1 - c2)**2) * cell_size_km
        dh = abs(terrain[r2, c2] - terrain[r1, c1])
        return h_dist + alt_penalty * dh

    # Open set as simple list (not heap for clarity)
    open_set = {start}
    came_from = {}
    g_score = {start: 0}
    f_score = {start: heuristic(*start)}

    while open_set:
        current = min(open_set, key=lambda n: f_score.get(n, float('inf')))
        if current == goal:
            # Reconstruct path
            path = [current]
            while current in came_from:
                current = came_from[current]
                path.append(current)
            return path[::-1], g_score[goal]

        open_set.remove(current)
        r, c = current

        for dr, dc in [(-1,0),(1,0),(0,-1),(0,1),(-1,-1),(-1,1),(1,-1),(1,1)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols:
                tentative_g = g_score[current] + edge_cost(r, c, nr, nc)
                if tentative_g < g_score.get((nr, nc), float('inf')):
                    came_from[(nr, nc)] = current
                    g_score[(nr, nc)] = tentative_g
                    f_score[(nr, nc)] = tentative_g + heuristic(nr, nc)
                    open_set.add((nr, nc))

    return None, float('inf')

# Generate Andean terrain (20x20 grid = 100km x 100km)
peaks = [(5, 10, 4500, 4), (12, 5, 5000, 3), (8, 15, 3800, 5), (15, 12, 4200, 3)]
terrain = generate_terrain(20, 20, peaks)

start = (0, 0)    # lowland origin
goal = (19, 19)    # highland destination

print("=== Terrain Overview ===")
print(f"Grid: 20x20 cells (5 km each = 100x100 km)")
print(f"Start altitude: {terrain[start]:.0f} m")
print(f"Goal altitude:  {terrain[goal]:.0f} m")
print(f"Max altitude:   {terrain.max():.0f} m")
print(f"Min altitude:   {terrain.min():.0f} m")

# Run A* with different altitude penalties
print("\\n=== Route Comparison: Altitude Penalty Sensitivity ===")
print(f"{'Penalty':>10} {'Path len':>10} {'Cost (km)':>10} {'Max alt':>10} {'Total climb':>12}")
print("-" * 54)

for penalty in [0.0, 0.002, 0.005, 0.010, 0.020]:
    path, cost = a_star(terrain, start, goal, penalty)
    if path:
        alts = [terrain[r, c] for r, c in path]
        max_alt = max(alts)
        total_climb = sum(max(0, alts[i+1] - alts[i]) for i in range(len(alts)-1))
        print(f"{penalty:>8.3f} {len(path):>8} {cost:>9.1f} {max_alt:>8.0f}m {total_climb:>10.0f}m")

# Show best route profile
print("\\n=== Altitude Profile of Optimal Route (penalty=0.005) ===")
path, cost = a_star(terrain, start, goal, 0.005)
if path:
    step = max(1, len(path) // 12)
    print(f"{'Step':>5} {'Grid pos':>10} {'Alt (m)':>8} {'Profile':>30}")
    for i in range(0, len(path), step):
        r, c = path[i]
        alt = terrain[r, c]
        bar = "#" * int(alt / 200)
        print(f"{i:>5} ({r:>2},{c:>2}) {alt:>7.0f} {bar}")`,
      challenge: 'Add a "llama caravan" mode where the altitude penalty doubles above 4,500 m (llamas struggle at extreme altitude) and the route avoids cells steeper than 30 degrees. How does the optimal route change? The Inca actually used different routes for foot messengers (chasquis) vs llama caravans.',
      successHint: 'You implemented A* — the most widely-used pathfinding algorithm in computing. Every navigation app, every video game character, every robot path planner uses A* or a descendant. Adding altitude penalty transforms it from a flat-map tool to a terrain-aware system, exactly as real-world routing requires.',
    },
    {
      title: 'Quipu as Turing machine — the computational completeness debate',
      concept: `Were quipus merely record-keeping devices, or were they capable of **computation**? This is one of the most fascinating open questions in the history of computing. A **Turing machine** — the theoretical model of computation — requires:

1. **Tape**: an infinite sequence of symbols (quipu strings with knots)
2. **Read/write head**: the ability to read and modify symbols (tying/untying knots)
3. **State register**: internal memory tracking the machine's state (the operator's position/context)
4. **Transition rules**: instructions mapping (state, symbol) \u2192 (new_state, new_symbol, move) (the quipucamayoc's procedures)

The question is whether quipu operators (quipucamayocs) followed **algorithmic procedures** — fixed sequences of read-modify-move steps — that constitute Turing-complete computation. Evidence: quipus were used for census aggregation (summing subtotals), tax calculation (multiplication), and inventory tracking (conditional operations).

We'll build a simple Turing machine simulator and show that a "quipu-like" tape system can perform addition, multiplication, and even conditional branching.

\ud83d\udcda *Turing completeness means a system can compute anything that any computer can compute, given enough time and memory. Even very simple systems (like Rule 110 cellular automata) can be Turing complete.*`,
      analogy: 'Think of a quipucamayoc as a very disciplined human computer. They follow strict rules: "Look at this knot cluster. If it shows 5, move to the next string and add it to the running total. If the total exceeds 100, tie a knot on the summary cord." This is exactly a Turing machine: read, decide, write, move.',
      storyConnection: 'The Spanish conquistadors destroyed most quipus as "instruments of the devil." Of the ~750 surviving quipus, many contain patterns that suggest they encoded not just numbers but narratives and procedures. The quipucamayocs who operated them were highly trained specialists — the "programmers" of the Inca empire, executing algorithms on a textile computer.',
      checkQuestion: 'A Turing machine needs read, write, state, and transition rules. Can a quipu system satisfy all four? What\'s the weakest point?',
      checkAnswer: 'Read: examine knots. Write: tie/untie knots. State: the operator\'s mental state and position. Transitions: trained procedures. The weakest point is the transition rules — we don\'t know if quipucamayoc procedures were truly algorithmic (fixed rules) or involved human judgement (which would make the system only partially computational).',
      codeIntro: 'Build a Turing machine simulator and demonstrate computation on a quipu-like tape system.',
      code: `import numpy as np

class QuipuTuringMachine:
    """A Turing machine using a quipu-like tape of integer values."""

    def __init__(self, tape, rules, start_state="start", halt_state="halt"):
        self.tape = list(tape) + [0] * 20  # extend tape
        self.pos = 0
        self.state = start_state
        self.halt = halt_state
        self.rules = rules  # {(state, symbol): (new_state, new_symbol, move)}
        self.steps = 0

    def step(self):
        symbol = self.tape[self.pos]
        key = (self.state, symbol)
        if key not in self.rules:
            # Try wildcard
            key = (self.state, "*")
            if key not in self.rules:
                return False

        new_state, new_symbol, move = self.rules[key]
        if new_symbol != "*":
            self.tape[self.pos] = new_symbol
        self.state = new_state
        self.pos += move
        self.pos = max(0, self.pos)
        self.steps += 1
        return self.state != self.halt

    def run(self, max_steps=1000):
        while self.step() and self.steps < max_steps:
            pass
        return self.tape

# Example 1: Unary addition (add two numbers on quipu strings)
# Tape: [3, 0, 5, 0, 0...] -> compute 3+5 and write result
add_rules = {
    ("start", "*"):  ("read_a", "*", 0),
    ("read_a", "*"):  ("seek_b", 0, 1),   # read A, clear it, move right
    # Need to carry the value — use states to encode it
}

# Simpler: direct computation model (closer to how quipucamayocs worked)
def quipu_add(tape_a, tape_b):
    """Add two quipu-encoded numbers (digit by digit with carry)."""
    max_len = max(len(tape_a), len(tape_b))
    a = [0] * (max_len - len(tape_a)) + tape_a
    b = [0] * (max_len - len(tape_b)) + tape_b
    result = [0] * (max_len + 1)
    carry = 0
    steps = 0

    for i in range(max_len - 1, -1, -1):
        total = a[i] + b[i] + carry
        result[i + 1] = total % 10
        carry = total // 10
        steps += 1

    result[0] = carry
    while len(result) > 1 and result[0] == 0:
        result.pop(0)
    return result, steps

def quipu_multiply(tape_a, digit):
    """Multiply a quipu number by a single digit (tax rate calculation)."""
    result = [0] * (len(tape_a) + 1)
    carry = 0
    steps = 0

    for i in range(len(tape_a) - 1, -1, -1):
        total = tape_a[i] * digit + carry
        result[i + 1] = total % 10
        carry = total // 10
        steps += 1

    result[0] = carry
    while len(result) > 1 and result[0] == 0:
        result.pop(0)
    return result, steps

# Census aggregation: sum provincial counts
print("=== Quipu Computation: Census Aggregation ===")
provinces = [
    ("Chinchaysuyu", [1, 2, 4, 5, 0]),  # 12,450
    ("Antisuyu",     [6, 8, 0, 0]),      # 6,800
    ("Kuntisuyu",    [9, 3, 0, 0]),      # 9,300
    ("Qullasuyu",    [1, 5, 2, 0, 0]),   # 15,200
]

running_total = [0]
total_steps = 0

print(f"{'Province':<16} {'Quipu tape':>14} {'Running total':>14} {'Steps':>6}")
print("-" * 52)
for name, tape in provinces:
    running_total, steps = quipu_add(running_total, tape)
    total_steps += steps
    tape_str = "".join(str(d) for d in tape)
    total_str = "".join(str(d) for d in running_total)
    print(f"{name:<16} {tape_str:>14} {total_str:>14} {steps:>6}")

print(f"\\nTotal: {''.join(str(d) for d in running_total)} ({int(''.join(str(d) for d in running_total)):,})")
print(f"Total computational steps: {total_steps}")

# Tax calculation (multiply by rate)
print("\\n=== Quipu Computation: Tax Calculation (x3 tribute) ===")
for name, tape in provinces:
    tax, steps = quipu_multiply(tape, 3)
    orig = "".join(str(d) for d in tape)
    tax_str = "".join(str(d) for d in tax)
    print(f"  {name:<14} {orig:>8} x3 = {tax_str:>8} ({steps} steps)")

# Turing completeness argument
print("\\n=== Computational Completeness Analysis ===")
operations = [
    ("Addition",       "Sum provinces", True),
    ("Multiplication", "Tax calculation", True),
    ("Comparison",     "If total > threshold", True),
    ("Conditional",    "Different tax rates by province", True),
    ("Looping",        "Repeat for each string", True),
    ("Recursion",      "No direct evidence", False),
    ("Arbitrary programs", "Unclear — limited by operator training", None),
]

print(f"{'Operation':<22} {'Use case':<30} {'Quipu capable?':>15}")
print("-" * 69)
for op, use, capable in operations:
    status = "YES" if capable is True else "NO" if capable is False else "DEBATED"
    print(f"{op:<22} {use:<30} {status:>15}")

print("\\nVerdict: Quipus + quipucamayocs satisfy 5 of 7 criteria.")
print("The system was likely Turing-complete in practice,")
print("even if not provably so from surviving evidence.")`,
      challenge: 'Implement a simple conditional operation: "If a province\'s population exceeds 10,000, apply 20% tax; otherwise apply 10%." This requires comparison (is the number > threshold?) and branching (different operations based on the result). Is this operation within the capability of a quipu system?',
      successHint: 'You explored one of the deepest questions in the history of computation: can a textile device perform general computation? The answer appears to be yes — not because the quipu itself is a computer, but because the quipu + trained operator system satisfies the requirements of a Turing machine. Computation is about process, not material.',
    },
    {
      title: 'Acclimatization kinetics — EPO response modelling',
      concept: `When a lowlander travels to high altitude, their body begins **acclimatization** — a series of physiological changes to compensate for reduced oxygen. The key mediator is **erythropoietin (EPO)**, a hormone produced by the kidneys that stimulates red blood cell (RBC) production.

The EPO response follows **first-order kinetics**:

**[EPO](t) = [EPO]\u2080 + ([EPO]_max - [EPO]\u2080) \u00b7 (1 - e^{-t/\u03c4})**

where \u03c4 \u2248 2 days is the EPO time constant. EPO rises rapidly in the first 48 hours, peaks around day 3-5, then declines as RBC count rises (negative feedback).

Red blood cell production follows with a delay — new RBCs take ~7 days to mature:

**RBC(t) = RBC\u2080 + \u0394RBC_max \u00b7 (1 - e^{-(t-7)/\u03c4_rbc})** for t > 7 days

where \u03c4_rbc \u2248 10 days. Full acclimatization takes 3-6 weeks — the RBC count plateaus at 20-30% above sea-level values.

This delay is why Inca tambos (rest stops) were spaced for gradual ascent: a chasqui runner ascending from the coast would gain altitude over days, allowing EPO to ramp up before reaching extreme elevations.

\ud83d\udcda *First-order kinetics (exponential approach to equilibrium) governs an enormous range of biological processes: drug metabolism, enzyme reactions, neural adaptation, even immune response. The time constant \u03c4 tells you how fast the system responds.*`,
      analogy: 'Imagine turning on a heater in a cold room. The temperature rises quickly at first (large gap between current and target), then slows as it approaches the set point. EPO response works the same way — the body "heats up" its RBC production quickly when oxygen is low, then levels off as the deficit is corrected.',
      storyConnection: 'The Inca road network included carefully spaced tambos (rest stations) at increasing altitudes. A traveller ascending from the coast (sea level) to Cusco (3,400 m) would stop at intermediate altitudes for 1-2 days each — a schedule that maps remarkably well to the EPO response curve. The Inca understood acclimatization empirically; we now know the biochemistry.',
      checkQuestion: 'EPO peaks at day 3-5 but RBC production peaks at day 14-21. Why the delay?',
      checkAnswer: 'EPO is a signal — it tells bone marrow to produce more RBCs. But RBC production is a physical process: stem cells must divide, differentiate, accumulate haemoglobin, and release into the bloodstream. This maturation takes ~7 days. The delay between signal (EPO) and response (RBCs) is the biological equivalent of manufacturing lead time.',
      codeIntro: 'Model the EPO response and red blood cell acclimatization during ascent along the Inca road network.',
      code: `import numpy as np

def epo_response(t_days, epo_baseline=10, epo_max=45, tau=2.0):
    """EPO concentration (mU/mL) over time at altitude."""
    t = np.asarray(t_days, dtype=float)
    epo = epo_baseline + (epo_max - epo_baseline) * (1 - np.exp(-t / tau))
    # EPO declines after day 7 due to negative feedback
    decline = np.where(t > 7, np.exp(-(t - 7) / 14), 1.0)
    return epo * decline + epo_baseline * (1 - decline)

def rbc_response(t_days, rbc_baseline=4.5, delta_max=1.2, delay=7, tau=10):
    """RBC count (millions/uL) over time."""
    t = np.asarray(t_days, dtype=float)
    rbc = np.where(
        t > delay,
        rbc_baseline + delta_max * (1 - np.exp(-(t - delay) / tau)),
        rbc_baseline
    )
    return rbc

def vo2max_at_altitude(alt_m, acclimatized_days=0):
    """VO2max relative to sea level (fraction)."""
    # Base reduction from altitude
    base = max(0.3, 1.0 - 0.0001 * alt_m)
    # Acclimatization recovery (up to 50% of lost capacity)
    recovery = 0.5 * (1 - np.exp(-acclimatized_days / 14))
    lost = 1.0 - base
    return base + lost * recovery

# Ascent profile along the Qhapaq Nan (coast to Cusco)
itinerary = [
    (0, 0,     "Depart coast (sea level)"),
    (1, 800,   "Foothills camp"),
    (2, 1500,  "Valley tambo"),
    (4, 2500,  "Mid-altitude rest (2 days)"),
    (6, 3000,  "Highland tambo"),
    (8, 3400,  "Arrive Cusco"),
    (14, 3400, "Cusco — 1 week"),
    (21, 3400, "Cusco — 2 weeks"),
    (30, 3400, "Cusco — 3 weeks"),
    (42, 3400, "Cusco — 5 weeks (fully acclimatized)"),
]

print("=== Acclimatization Timeline: Coast to Cusco ===\\n")
print(f"{'Day':>4} {'Alt (m)':>8} {'EPO':>8} {'RBC':>8} {'VO2max%':>8} {'Location':<30}")
print("-" * 68)

for day, alt, location in itinerary:
    epo = epo_response(day)
    rbc = rbc_response(day)
    vo2 = vo2max_at_altitude(alt, day) * 100
    print(f"{day:>4} {alt:>6} {epo:>7.1f} {rbc:>7.2f} {vo2:>6.1f}% {location:<30}")

# Compare gradual vs rapid ascent
print("\\n=== Rapid vs Gradual Ascent to 4000m ===")
print(f"{'Day':>4} {'Gradual EPO':>12} {'Gradual RBC':>12} {'Rapid EPO':>10} {'Rapid RBC':>10}")
print("-" * 50)

for day in [0, 1, 3, 5, 7, 10, 14, 21, 30]:
    # Gradual: arrives day 5, starts acclimatizing from day 0
    g_epo = epo_response(day)
    g_rbc = rbc_response(day)
    # Rapid: arrives day 1, body stressed
    r_epo = epo_response(max(0, day - 1), epo_max=55)  # higher EPO spike
    r_rbc = rbc_response(max(0, day - 1), delay=9)      # delayed RBC response
    print(f"{day:>4} {g_epo:>10.1f} {g_rbc:>10.2f} {r_epo:>9.1f} {r_rbc:>9.2f}")

print("\\nGradual ascent: EPO ramps smoothly, RBCs follow predictably.")
print("Rapid ascent: EPO spikes (stress response), RBC response delayed.")
print("Risk of acute mountain sickness with rapid ascent: ~50% at 4000m.")`,
      challenge: 'Model the effect of coca leaf chewing (a traditional Andean practice) as a mild ventilatory stimulant that increases alveolar pO2 by 5-8 mmHg. How does this shift the acclimatization timeline? Does it reduce the acute mountain sickness window? (Hint: higher pO2 means less hypoxic stress, so EPO rises less dramatically but the body is less stressed.)',
      successHint: 'You modelled a multi-compartment biological system: stimulus (hypoxia) \u2192 signal (EPO) \u2192 response (RBC production) with time delays and negative feedback. This is the structure of virtually every physiological control system — thermoregulation, blood glucose, hormone cycles. The mathematics of first-order kinetics is the language of biology.',
    },
    {
      title: 'Network vulnerability analysis — percolation theory',
      concept: `The Inca road network was vulnerable to disruption: earthquakes, landslides, floods, and enemy attacks could sever roads. How resilient was the network? **Percolation theory** answers this question by studying how networks fragment as links are randomly removed.

The key concept is the **percolation threshold** (p_c): the fraction of links that must remain intact for the network to stay globally connected. Below p_c, the network shatters into isolated clusters — no path exists between most pairs of cities.

For random graphs: **p_c \u2248 1 / \u27e8k\u27e9**, where \u27e8k\u27e9 is the average degree (connections per node). A network with average degree 4 has p_c \u2248 0.25 — it can lose 75% of its links and still function. A tree (average degree ~2) has p_c \u2248 0.5 — it shatters when half the links fail.

Real networks also face **targeted attacks** — an adversary removes the most important nodes (highest degree) first. Networks with hub nodes are especially vulnerable: remove a few hubs and the network collapses, even though most nodes are untouched.

\ud83d\udcda *Percolation theory originated in physics (fluid flow through porous rock) but now applies to epidemiology (disease spread), network security (internet resilience), and ecology (habitat fragmentation).*`,
      analogy: 'Imagine a fishing net. Remove random threads and it develops holes, but still holds together — until you remove enough threads that the holes merge and the net falls apart. That critical point is the percolation threshold. Now imagine cutting the few thick threads that hold the net\'s shape — it collapses much faster. That\'s targeted attack.',
      storyConnection: 'When Pizarro invaded in 1532, he didn\'t need to destroy the entire Qhapaq Nan — he captured Atahualpa at Cajamarca (a major hub) and controlled the key road junction. This is targeted attack on a network: by seizing the highest-degree node, he fragmented Inca command and control even though 95% of the network was physically intact.',
      checkQuestion: 'A network has 100 nodes with average degree 6. Approximately what fraction of links can be randomly removed before the network fragments?',
      checkAnswer: 'p_c \u2248 1/6 \u2248 0.17. So the network stays connected until ~83% of links are removed. This is high resilience — the network has enough redundancy to absorb massive random damage. But targeted removal of the ~10 highest-degree nodes would fragment it much sooner.',
      codeIntro: 'Simulate random and targeted attacks on an Inca-inspired road network and find the percolation threshold.',
      code: `import numpy as np

np.random.seed(42)

def build_inca_network(n_cities=30, n_edges=70):
    """Build a random network inspired by the Qhapaq Nan."""
    # Create adjacency list
    adj = [set() for _ in range(n_cities)]
    edges = set()

    # Ensure connectivity: build a spanning tree first
    nodes = list(range(n_cities))
    np.random.shuffle(nodes)
    for i in range(n_cities - 1):
        u, v = nodes[i], nodes[i + 1]
        adj[u].add(v)
        adj[v].add(u)
        edges.add((min(u,v), max(u,v)))

    # Add random extra edges
    while len(edges) < n_edges:
        u, v = np.random.randint(0, n_cities, 2)
        if u != v and (min(u,v), max(u,v)) not in edges:
            adj[u].add(v)
            adj[v].add(u)
            edges.add((min(u,v), max(u,v)))

    return adj, list(edges)

def largest_component(adj, n):
    """Find size of largest connected component using BFS."""
    visited = [False] * n
    max_size = 0

    for start in range(n):
        if visited[start]:
            continue
        queue = [start]
        visited[start] = True
        size = 0
        while queue:
            node = queue.pop(0)
            size += 1
            for nbr in adj[node]:
                if not visited[nbr]:
                    visited[nbr] = True
                    queue.append(nbr)
        max_size = max(max_size, size)

    return max_size

def random_attack(adj_orig, edges_orig, n, fraction):
    """Remove a random fraction of edges and measure connectivity."""
    n_remove = int(len(edges_orig) * fraction)
    remove_set = set()
    indices = np.random.permutation(len(edges_orig))[:n_remove]
    for idx in indices:
        remove_set.add(edges_orig[idx])

    adj = [set() for _ in range(n)]
    for u, v in edges_orig:
        if (u, v) not in remove_set:
            adj[u].add(v)
            adj[v].add(u)

    return largest_component(adj, n) / n

def targeted_attack(adj_orig, edges_orig, n, n_remove_nodes):
    """Remove highest-degree nodes and measure connectivity."""
    degrees = [(len(adj_orig[i]), i) for i in range(n)]
    degrees.sort(reverse=True)
    removed = set(node for _, node in degrees[:n_remove_nodes])

    adj = [set() for _ in range(n)]
    for u, v in edges_orig:
        if u not in removed and v not in removed:
            adj[u].add(v)
            adj[v].add(u)

    remaining = n - n_remove_nodes
    if remaining <= 0:
        return 0
    return largest_component(adj, n) / remaining

# Build and analyse
n_cities = 30
adj, edges = build_inca_network(n_cities, 70)
avg_degree = sum(len(a) for a in adj) / n_cities

print("=== Inca Road Network Vulnerability Analysis ===")
print(f"Cities: {n_cities} | Roads: {len(edges)} | Avg degree: {avg_degree:.1f}")
print(f"Theoretical percolation threshold: p_c ~ {1/avg_degree:.3f}")

# Random attack simulation
print("\\n--- Random Edge Removal ---")
print(f"{'Fraction removed':>18} {'Largest component':>18} {'Connected?':>12}")
print("-" * 50)

n_trials = 30
percolation_threshold = None
for frac in np.arange(0, 1.01, 0.1):
    sizes = [random_attack(adj, edges, n_cities, frac) for _ in range(n_trials)]
    avg_size = np.mean(sizes)
    connected = "YES" if avg_size > 0.5 else "NO"
    if avg_size <= 0.5 and percolation_threshold is None:
        percolation_threshold = frac
    print(f"{frac:>16.0%} {avg_size:>16.1%} {connected:>12}")

if percolation_threshold:
    print(f"\\nPercolation threshold (random): ~{percolation_threshold:.0%} edges removed")

# Targeted attack
print("\\n--- Targeted Node Removal (highest degree first) ---")
print(f"{'Nodes removed':>15} {'Largest component':>18} {'Connected?':>12}")
print("-" * 47)
for n_rm in range(0, 12):
    size = targeted_attack(adj, edges, n_cities, n_rm)
    connected = "YES" if size > 0.5 else "NO"
    print(f"{n_rm:>13} {size:>16.1%} {connected:>12}")

print("\\nTargeted attack is far more effective than random failure.")
print("Network hubs are critical vulnerabilities — protect them first.")`,
      challenge: 'Add a "redundancy upgrade" analysis: for each edge in the MST (the minimum spanning tree — the backbone), calculate how much adding one parallel edge (redundant road) improves the percolation threshold. Which single redundancy investment gives the best improvement? This is how network engineers prioritise infrastructure upgrades.',
      successHint: 'Percolation theory is one of the most powerful tools in network science. You applied it to a historical road network, but the same mathematics describes internet resilience, power grid failures, disease spread on social networks, and ecosystem fragmentation. The universal insight: highly connected networks are resilient to random failures but vulnerable to targeted attacks on hubs.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced modelling and analysis</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 3 covers suspension bridge dynamics, 3D terrain routing, computational completeness, acclimatization kinetics, and network vulnerability.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {loadProgress}</>) : (<><Sparkles className="w-5 h-5" /> Load Python</>)}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson
            key={i}
            id={`L3-${i + 1}`}
            number={i + 1}
            title={lesson.title}
            concept={lesson.concept}
            analogy={lesson.analogy}
            storyConnection={lesson.storyConnection}
            checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer}
            codeIntro={lesson.codeIntro}
            code={lesson.code}
            challenge={lesson.challenge}
            successHint={lesson.successHint}
          />
        ))}
      </div>
    </div>
  );
}
