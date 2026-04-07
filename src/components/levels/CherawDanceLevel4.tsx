import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function CherawDanceLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Designing a rhythm pattern database',
      concept: `A rhythm pattern database stores, searches, and analyzes musical patterns. We need tables for:

- **patterns**: stores the rhythm as a binary string (1=hit, 0=rest)
- **performances**: records of actual Cheraw performances (tempo, duration, dancers)
- **pattern_analysis**: computed metrics (syncopation, density, complexity)

The **schema** design must support queries like:
- "Find all patterns at 90 BPM with high syncopation"
- "Which pattern has the best dancer safety record?"
- "What is the average complexity by tempo range?"

We use **SQLite** — a lightweight database that runs inside Python with no server needed. SQL (Structured Query Language) lets us ask precise questions of the data.

📚 *sqlite3 is built into Python. \`conn.execute(sql)\` runs a query, \`conn.executemany(sql, data)\` inserts many rows efficiently.*`,
      analogy: 'A database is like a well-organized filing cabinet. Each table is a drawer, each row is a folder, and each column is a label on the folder. SQL is the filing clerk who can instantly find "all folders from 2024 with a red label" — queries that would take hours to do manually.',
      storyConnection: 'Preserving Cheraw dance traditions means documenting the rhythm patterns passed down through generations. A database lets ethnomusicologists catalog thousands of patterns, compare regional variations, and identify which patterns are unique to specific Mizo communities.',
      checkQuestion: 'Why use a relational database instead of a simple CSV file for rhythm patterns?',
      checkAnswer: 'A CSV file cannot enforce data integrity (like ensuring tempo > 0), cannot efficiently query subsets (like "all triplet patterns"), and cannot relate tables (like linking patterns to performances). A relational database with SQL provides all three: constraints, queries, and joins.',
      codeIntro: 'Create a SQLite database for Cheraw rhythm patterns with proper schema design.',
      code: `import sqlite3
import json

conn = sqlite3.connect(':memory:')
c = conn.cursor()

# Create schema
c.executescript('''
CREATE TABLE patterns (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    beats_per_bar INTEGER NOT NULL,
    subdivisions INTEGER NOT NULL,
    pattern TEXT NOT NULL,
    tempo_bpm INTEGER NOT NULL,
    difficulty TEXT CHECK(difficulty IN ('beginner','intermediate','advanced','master')),
    region TEXT DEFAULT 'Mizoram'
);

CREATE TABLE performances (
    id INTEGER PRIMARY KEY,
    pattern_id INTEGER REFERENCES patterns(id),
    date TEXT NOT NULL,
    num_dancers INTEGER NOT NULL,
    num_holders INTEGER NOT NULL,
    duration_sec INTEGER NOT NULL,
    incidents INTEGER DEFAULT 0
);

CREATE TABLE pattern_metrics (
    pattern_id INTEGER PRIMARY KEY REFERENCES patterns(id),
    density REAL,
    syncopation_score REAL,
    complexity_index REAL
);
''')

# Insert sample patterns
patterns = [
    ('Basic Cheraw', 4, 4, '1001100110011001', 80, 'beginner'),
    ('Double Step', 4, 4, '1010101010101010', 90, 'intermediate'),
    ('Triplet Flow', 3, 3, '101101101', 90, 'intermediate'),
    ('Syncopated', 4, 4, '1001011010010110', 100, 'advanced'),
    ('Cross Rhythm', 4, 6, '100100101001001010010010', 100, 'advanced'),
    ('Master Pattern', 4, 4, '1011010110110101', 120, 'master'),
    ('Festival Opening', 4, 4, '1000100010001000', 70, 'beginner'),
    ('Warrior Dance', 4, 4, '1110111011101110', 110, 'advanced'),
]

for p in patterns:
    c.execute('INSERT INTO patterns (name,beats_per_bar,subdivisions,pattern,tempo_bpm,difficulty) VALUES (?,?,?,?,?,?)', p)

# Compute metrics
for row in c.execute('SELECT id, pattern, beats_per_bar, subdivisions FROM patterns').fetchall():
    pid, pat, bpb, sub = row
    hits = pat.count('1')
    density = hits / len(pat)
    # Syncopation: hits on off-beats
    offbeat_hits = sum(1 for i, ch in enumerate(pat) if ch == '1' and i % sub != 0)
    syncopation = offbeat_hits / max(hits, 1)
    complexity = density * (1 + syncopation) * (sub / 4)
    c.execute('INSERT INTO pattern_metrics VALUES (?,?,?,?)',
              (pid, round(density, 3), round(syncopation, 3), round(complexity, 3)))

conn.commit()

# Query results
print("All patterns with metrics:")
print(f"{'Name':<20} {'BPM':>4} {'Density':>8} {'Sync':>6} {'Complex':>8} {'Diff':<12}")
print("-" * 65)
for row in c.execute('''
    SELECT p.name, p.tempo_bpm, m.density, m.syncopation_score, m.complexity_index, p.difficulty
    FROM patterns p JOIN pattern_metrics m ON p.id = m.pattern_id
    ORDER BY m.complexity_index
'''):
    print(f"{row[0]:<20} {row[1]:>4} {row[2]:>8.3f} {row[3]:>6.3f} {row[4]:>8.3f} {row[5]:<12}")

conn.close()`,
      challenge: 'Add a query that finds the average complexity by difficulty level. Which difficulty level has the highest average? Add a new "expert" pattern and verify it appears in the results.',
      successHint: 'You designed a real database schema with proper foreign keys, constraints, and computed metrics. This is how professional software stores and queries structured data — from music libraries to scientific databases.',
    },
    {
      title: 'Performance tracking and safety analysis',
      concept: `With a database of performances, we can analyze **safety metrics**: which patterns, tempos, and conditions lead to incidents (foot catches, mistimed steps).

Key safety metrics:
- **Incident rate**: incidents per 100 performances
- **Safety score**: weighted combination of factors
- **Risk factors**: tempo, pattern complexity, number of dancers, experience level

We use **SQL aggregation** (GROUP BY, AVG, COUNT) to compute statistics across many performances. **Window functions** let us rank patterns by safety.

Statistical analysis can reveal non-obvious relationships: perhaps a moderately complex pattern at 90 BPM is actually safer than a simple pattern at 120 BPM, because dancers concentrate more on the complex one.

📚 *SQL's GROUP BY with aggregate functions (AVG, SUM, COUNT) is equivalent to pandas' groupby — but runs directly in the database, often faster than loading all data into Python.*`,
      analogy: 'Safety analysis is like a hospital tracking patient outcomes. You record every procedure, note any complications, and then analyze which conditions (surgeon experience, procedure type, time of day) correlate with better outcomes. The database is the hospital record system; SQL queries are the epidemiological studies.',
      storyConnection: 'Cheraw has evolved its safety practices over centuries through oral tradition — experienced performers know which patterns are safe at which tempos. A database approach formalizes this wisdom, making it accessible to new performers and preserving it for future generations.',
      checkQuestion: 'Why might a simple incident count be misleading as a safety metric?',
      checkAnswer: 'A pattern performed 1000 times with 5 incidents (0.5% rate) is safer than one performed 10 times with 1 incident (10% rate), even though 5 > 1. We need incident rate (incidents per performance), not raw count. We also need to control for confounding variables like performer experience.',
      codeIntro: 'Build a performance database with safety tracking and analyze which conditions are safest.',
      code: `import sqlite3
import random

random.seed(42)
conn = sqlite3.connect(':memory:')
c = conn.cursor()

c.executescript('''
CREATE TABLE patterns (
    id INTEGER PRIMARY KEY, name TEXT, tempo_bpm INTEGER,
    complexity REAL, difficulty TEXT
);
CREATE TABLE performances (
    id INTEGER PRIMARY KEY, pattern_id INTEGER, dancers INTEGER,
    holder_experience TEXT, duration_min REAL, incidents INTEGER,
    FOREIGN KEY (pattern_id) REFERENCES patterns(id)
);
''')

# Insert patterns
pats = [
    (1, 'Basic Step', 80, 0.3, 'beginner'),
    (2, 'Double Step', 90, 0.5, 'intermediate'),
    (3, 'Cross Rhythm', 100, 0.7, 'advanced'),
    (4, 'Syncopated', 110, 0.8, 'advanced'),
    (5, 'Master Flow', 120, 0.9, 'master'),
]
c.executemany('INSERT INTO patterns VALUES (?,?,?,?,?)', pats)

# Generate 500 simulated performances
exp_levels = ['novice', 'trained', 'experienced', 'master']
for i in range(500):
    pid = random.choice([1,1,1,2,2,2,3,3,4,5])  # weighted
    dancers = random.randint(2, 8)
    exp = random.choice(exp_levels)
    duration = random.uniform(2, 10)

    pat = [p for p in pats if p[0] == pid][0]
    # Incident probability based on complexity, tempo, experience
    exp_factor = {'novice': 2.0, 'trained': 1.0, 'experienced': 0.5, 'master': 0.2}
    base_risk = pat[3] * (pat[2] / 100) * exp_factor[exp] * 0.08
    incidents = 1 if random.random() < base_risk else 0

    c.execute('INSERT INTO performances (pattern_id, dancers, holder_experience, duration_min, incidents) VALUES (?,?,?,?,?)',
              (pid, dancers, exp, round(duration, 1), incidents))

conn.commit()

# Safety analysis
print("SAFETY ANALYSIS — Cheraw Dance Performances (500 records)")
print("=" * 70)

print("\\nIncident Rate by Pattern:")
print(f"{'Pattern':<15} {'Performances':>12} {'Incidents':>10} {'Rate':>8}")
print("-" * 50)
for row in c.execute('''
    SELECT p.name, COUNT(*) as n, SUM(pe.incidents) as inc,
           ROUND(100.0 * SUM(pe.incidents) / COUNT(*), 1) as rate
    FROM performances pe JOIN patterns p ON pe.pattern_id = p.id
    GROUP BY p.id ORDER BY rate
'''):
    print(f"{row[0]:<15} {row[1]:>12} {row[2]:>10} {row[3]:>7.1f}%")

print("\\nIncident Rate by Holder Experience:")
print(f"{'Experience':<15} {'Performances':>12} {'Rate':>8}")
print("-" * 38)
for row in c.execute('''
    SELECT holder_experience, COUNT(*),
           ROUND(100.0 * SUM(incidents) / COUNT(*), 1)
    FROM performances GROUP BY holder_experience ORDER BY 3
'''):
    print(f"{row[0]:<15} {row[1]:>12} {row[2]:>7.1f}%")

print("\\nHighest risk combination (pattern + experience):")
for row in c.execute('''
    SELECT p.name, pe.holder_experience, COUNT(*),
           ROUND(100.0 * SUM(pe.incidents) / COUNT(*), 1) as rate
    FROM performances pe JOIN patterns p ON pe.pattern_id = p.id
    GROUP BY p.id, pe.holder_experience HAVING COUNT(*) >= 5
    ORDER BY rate DESC LIMIT 3
'''):
    print(f"  {row[0]} + {row[1]}: {row[3]}% incident rate ({row[2]} performances)")

conn.close()`,
      challenge: 'Add a "time_of_day" column (morning, afternoon, evening) to performances. Generate data where evening performances have slightly higher incident rates (fatigue effect). Can your SQL query detect this pattern?',
      successHint: 'You built a performance analytics system using SQL. This is exactly how sports analytics, medical safety tracking, and quality assurance systems work — collecting data, computing metrics, and revealing patterns that guide better decisions.',
    },
    {
      title: 'Rhythm generation algorithm',
      concept: `Can we algorithmically generate new Cheraw patterns? The **Euclidean rhythm algorithm** distributes k hits evenly across n positions:

\`E(k, n)\` = distribute k hits across n slots as evenly as possible

Examples:
- E(3, 8) = [10010010] — Cuban tresillo
- E(4, 12) = [100100100100] — Afro-Cuban 12/8
- E(5, 8) = [10110110] — West African bell pattern

This algorithm, discovered by Bjorklund (2003), is mathematically equivalent to Euclid's GCD algorithm from 300 BCE. It produces many rhythms found in world music traditions.

We can score patterns on:
- **Evenness**: how uniformly distributed the hits are
- **Syncopation**: how many hits fall on weak beats
- **Danceability**: combination of tempo and pattern density

📚 *Recursive algorithms break a problem into smaller subproblems. The Euclidean rhythm algorithm recursively distributes remainder hits, just as Euclid's algorithm recursively computes GCD.*`,
      analogy: 'The Euclidean rhythm algorithm is like distributing candies fairly among children. If you have 5 candies for 8 children, you cannot give each child 5/8 of a candy. Instead, you give 5 children one candy each, spacing them as evenly as possible around the circle. The algorithm decides the optimal spacing.',
      storyConnection: 'While Cheraw patterns are traditionally learned from elders, new patterns are also created for competitions and festivals. An algorithm that generates mathematically optimal rhythms could inspire new choreography — the computer does not replace tradition but expands the palette of possibilities.',
      checkQuestion: 'Why does the Euclidean algorithm produce rhythms that sound "good" to humans?',
      checkAnswer: 'The Euclidean algorithm maximizes evenness — hits are as uniformly distributed as possible. Human perception is naturally attuned to even distributions (they are predictable and easy to entrain to). The slight irregularities from non-integer division create just enough syncopation to be interesting without being confusing.',
      codeIntro: 'Implement the Euclidean rhythm algorithm and generate novel Cheraw dance patterns.',
      code: `import sqlite3

def euclidean_rhythm(hits, steps):
    """Generate a Euclidean rhythm pattern using Bjorklund's algorithm."""
    if hits >= steps:
        return [1] * steps
    if hits == 0:
        return [0] * steps

    groups = [[1]] * hits + [[0]] * (steps - hits)

    while True:
        remainder = len(groups) - hits
        if remainder <= 1:
            break
        new_groups = []
        for i in range(min(hits, remainder)):
            new_groups.append(groups[i] + groups[hits + i])
        # Remaining groups
        for i in range(min(hits, remainder), hits):
            new_groups.append(groups[i])
        if remainder > hits:
            for i in range(hits + hits, len(groups)):
                new_groups.append(groups[i])
        groups = new_groups
        hits = min(hits, remainder)
        if hits <= 1:
            break

    return [bit for group in groups for bit in group]

def pattern_to_str(pattern):
    return ''.join(str(b) for b in pattern)

def syncopation_score(pattern, subdivisions=4):
    hits_on_offbeat = sum(1 for i, b in enumerate(pattern) if b == 1 and i % subdivisions != 0)
    total_hits = sum(pattern)
    return round(hits_on_offbeat / max(total_hits, 1), 3)

# Generate and store patterns in database
conn = sqlite3.connect(':memory:')
c = conn.cursor()
c.execute('''CREATE TABLE generated_patterns (
    id INTEGER PRIMARY KEY, hits INTEGER, steps INTEGER,
    pattern TEXT, density REAL, syncopation REAL, name TEXT
)''')

print("Euclidean Rhythm Generator for Cheraw Dance")
print("=" * 55)

for steps in [8, 12, 16]:
    print(f"\\n--- {steps}-step patterns ---")
    for hits in range(2, steps):
        pattern = euclidean_rhythm(hits, steps)
        pat_str = pattern_to_str(pattern)
        density = sum(pattern) / len(pattern)
        sync = syncopation_score(pattern)

        # Visual representation
        visual = ''.join('●' if b else '○' for b in pattern)

        # Name based on known patterns
        name = f"E({hits},{steps})"
        if (hits, steps) == (3, 8): name += " (tresillo)"
        elif (hits, steps) == (5, 8): name += " (West African)"
        elif (hits, steps) == (7, 12): name += " (West African 12/8)"

        c.execute('INSERT INTO generated_patterns (hits, steps, pattern, density, syncopation, name) VALUES (?,?,?,?,?,?)',
                  (hits, steps, pat_str, round(density, 3), sync, name))

        if density >= 0.3 and density <= 0.7:  # danceable range
            print(f"  {name:<25} {visual}  sync={sync:.2f}")

# Find optimal patterns for Cheraw
print("\\nBest patterns for Cheraw (density 0.4-0.6, medium syncopation):")
for row in c.execute('''
    SELECT name, pattern, density, syncopation FROM generated_patterns
    WHERE density BETWEEN 0.4 AND 0.6 AND syncopation BETWEEN 0.2 AND 0.6
    ORDER BY syncopation LIMIT 5
'''):
    visual = ''.join('●' if c == '1' else '○' for c in row[1])
    print(f"  {row[0]:<25} {visual}  density={row[2]:.2f} sync={row[3]:.2f}")

conn.close()`,
      challenge: 'Add a "danceability" score that combines density, syncopation, and evenness. Find the top 3 most danceable patterns for each step count. Do any match traditional Cheraw patterns?',
      successHint: 'You implemented a real music generation algorithm and stored results in a database. The Euclidean rhythm algorithm connects ancient Greek mathematics to modern computational musicology — and to the living tradition of Cheraw dance.',
    },
    {
      title: 'Cheraw choreography optimizer',
      concept: `Given a rhythm pattern and a set of dancers, how do we assign the **optimal footwork sequence**? This is a **constraint satisfaction problem**:

Constraints:
- Each dancer must step through the bamboo gap during the "open" phase
- No two dancers can be in the same gap simultaneously
- Transitions between gaps must be physically possible (limited step distance)
- The choreography should be aesthetically pleasing (symmetric, flowing)

We model this as a **graph search** problem:
- **Nodes**: (dancer_position, time_step) pairs
- **Edges**: valid movements (step forward, step backward, stay)
- **Cost**: penalty for unsafe timing + aesthetic preference

Finding the optimal path is similar to pathfinding algorithms used in robotics and game AI.

📚 *We combine databases (storing patterns and solutions), algorithms (graph search), and physics (timing constraints) into one integrated system.*`,
      analogy: 'Choreography optimization is like traffic routing. Each dancer is a car, each bamboo gap is an intersection with a traffic light (open/closed). The optimizer finds routes where every car passes through green lights, no two cars collide, and the overall flow is smooth. GPS navigation does this with millions of roads — we do it with bamboo poles.',
      storyConnection: 'Traditional Cheraw choreography is passed from master to student through demonstration. But for new patterns — especially complex ones with many dancers — computational optimization can explore far more possibilities than human intuition alone, potentially discovering beautiful formations no one has tried.',
      checkQuestion: 'Why is choreography optimization NP-hard in general, and how do we handle that?',
      checkAnswer: 'With D dancers and T time steps, the search space is O(positions^D × T) — exponential in the number of dancers. For real performances (6+ dancers, 100+ beats), exact solutions are intractable. We use heuristic approaches: greedy assignment, simulated annealing, or genetic algorithms to find good (not necessarily perfect) solutions.',
      codeIntro: 'Build a complete Cheraw choreography system: pattern database, physics simulation, and optimization.',
      code: `import sqlite3
import random

random.seed(42)

conn = sqlite3.connect(':memory:')
c = conn.cursor()

c.executescript('''
CREATE TABLE choreographies (
    id INTEGER PRIMARY KEY,
    pattern TEXT, tempo_bpm INTEGER, num_dancers INTEGER,
    num_poles INTEGER, solution TEXT, safety_score REAL,
    aesthetic_score REAL, total_score REAL
);
''')

def is_gap_open(pattern, time_step, pole_idx):
    """Check if a specific bamboo gap is open at a given time step."""
    idx = (time_step + pole_idx) % len(pattern)
    return pattern[idx] == '1'

def simulate_choreography(pattern, num_dancers, num_poles, num_beats):
    """Greedy choreography: assign dancers to safe positions each beat."""
    positions = list(range(num_dancers))  # initial positions
    history = [positions[:]]
    safety_violations = 0
    smooth_score = 0

    for beat in range(1, num_beats):
        new_positions = []
        occupied = set()

        for d in range(num_dancers):
            current = positions[d]
            # Try: stay, move forward, move backward
            candidates = [current, current + 1, current - 1]
            best = current
            best_score = -100

            for pos in candidates:
                if pos < 0 or pos >= num_poles:
                    continue
                if pos in occupied:
                    continue
                score = 0
                if is_gap_open(pattern, beat, pos):
                    score += 10  # safe
                else:
                    score -= 20  # dangerous!
                # Prefer forward movement
                if pos > current:
                    score += 2
                # Penalize large jumps
                score -= abs(pos - current) * 0.5

                if score > best_score:
                    best_score = score
                    best = pos

            if not is_gap_open(pattern, beat, best):
                safety_violations += 1

            new_positions.append(best)
            occupied.add(best)

            # Smoothness: small movements are better
            smooth_score += max(0, 3 - abs(best - current))

        positions = new_positions
        history.append(positions[:])

    return history, safety_violations, smooth_score

# Test with different configurations
patterns = ['10011001', '10101010', '10110110', '10010110']
pattern_names = ['Basic', 'Alternating', 'African Bell', 'Syncopated']
num_beats = 16

print("CHERAW CHOREOGRAPHY OPTIMIZER")
print("=" * 65)

for pat, name in zip(patterns, pattern_names):
    for n_dancers in [2, 3, 4]:
        n_poles = 6
        history, violations, smooth = simulate_choreography(pat, n_dancers, n_poles, num_beats)

        safety_pct = 100 * (1 - violations / (num_beats * n_dancers))
        aesthetic = smooth / (num_beats * n_dancers) * 100
        total = safety_pct * 0.7 + aesthetic * 0.3

        c.execute('INSERT INTO choreographies (pattern, tempo_bpm, num_dancers, num_poles, solution, safety_score, aesthetic_score, total_score) VALUES (?,?,?,?,?,?,?,?)',
                  (pat, 90, n_dancers, n_poles, str(history), round(safety_pct, 1), round(aesthetic, 1), round(total, 1)))

conn.commit()

# Find best choreographies
print(f"\\n{'Pattern':<15} {'Dancers':>8} {'Safety':>8} {'Beauty':>8} {'Total':>8}")
print("-" * 52)
for row in c.execute('''
    SELECT pattern, num_dancers, safety_score, aesthetic_score, total_score
    FROM choreographies ORDER BY total_score DESC LIMIT 10
'''):
    pname = pattern_names[patterns.index(row[0])] if row[0] in patterns else row[0]
    print(f"{pname:<15} {row[1]:>8} {row[2]:>7.1f}% {row[3]:>7.1f}% {row[4]:>7.1f}%")

# Visualize best choreography
print("\\nBest choreography visualization (top-down view):")
best = c.execute('SELECT pattern, num_dancers, solution FROM choreographies ORDER BY total_score DESC LIMIT 1').fetchone()
history = eval(best[2])
print(f"Pattern: {best[0]}, Dancers: {best[1]}")
for beat, positions in enumerate(history[:8]):
    row = ['·'] * 6
    for d, pos in enumerate(positions):
        if 0 <= pos < 6:
            row[pos] = str(d + 1)
    gap_status = ''.join('▓' if best[0][(beat + p) % len(best[0])] == '1' else '░' for p in range(6))
    print(f"  Beat {beat:2d}: |{'|'.join(row)}|  gaps: {gap_status}")

conn.close()`,
      challenge: 'Implement a simple simulated annealing optimizer: randomly modify dancer positions and accept changes that improve the score (or occasionally accept worse changes to escape local optima). Does it find better choreographies than the greedy approach?',
      successHint: 'You built a complete computational choreography system combining databases, physics constraints, and optimization algorithms. This is a simplified version of how animation studios plan complex crowd scenes and how robotics labs coordinate multi-agent systems.',
    },
    {
      title: 'Full Cheraw simulation engine',
      concept: `The capstone project combines everything: physics simulation, pattern generation, database storage, safety analysis, and choreography optimization into one integrated engine.

Architecture:
1. **Pattern Generator** (Euclidean algorithm) creates candidate patterns
2. **Physics Engine** (harmonic oscillator) simulates bamboo motion
3. **Choreography Optimizer** assigns dancer movements
4. **Safety Analyzer** scores each configuration
5. **Database** stores everything for comparison

This is a **full-stack** application: data layer (SQLite), logic layer (algorithms), and presentation layer (formatted output). Professional software always separates these concerns.

📚 *Bringing together multiple algorithms and data structures into a coherent system is the essence of software engineering. Each piece is simple; the art is in the integration.*`,
      analogy: 'Building this engine is like designing a car. The engine (physics simulation), transmission (pattern generator), steering (choreography), brakes (safety analysis), and dashboard (database/output) are each simple mechanisms. But making them work together smoothly — that is engineering.',
      storyConnection: 'This simulation engine is a digital twin of the Cheraw dance: a computational model that captures the essential physics, timing, and human factors. It could be used to train new dancers, preserve traditional patterns, or design performances for festivals — bridging computational science and living culture.',
      checkQuestion: 'What is the most important design decision in a system that combines simulation, optimization, and databases?',
      checkAnswer: 'The interface between components. Each module must have clear inputs and outputs: the physics engine outputs position vs. time, the optimizer reads that to determine safe windows, and the database stores both. If interfaces are well-defined, each module can be improved independently — the hallmark of good engineering.',
      codeIntro: 'Build the complete Cheraw dance simulation engine as an integrated system.',
      code: `import sqlite3
import numpy as np
import random

random.seed(42)
np.random.seed(42)

conn = sqlite3.connect(':memory:')
c = conn.cursor()

c.executescript('''
CREATE TABLE simulations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pattern TEXT, tempo_bpm INTEGER, amplitude_cm REAL,
    damping REAL, num_dancers INTEGER,
    max_gap_velocity REAL, safe_window_pct REAL,
    safety_rating TEXT, recommended INTEGER DEFAULT 0
);
''')

def euclidean_rhythm(k, n):
    if k >= n: return [1]*n
    if k == 0: return [0]*n
    groups = [[1]]*k + [[0]]*(n-k)
    while len(groups) > k + 1:
        remainder = len(groups) - k
        new = [groups[i] + groups[k+i] for i in range(min(k, remainder))]
        new += groups[min(k, remainder):k]
        if remainder > k:
            new += groups[k+k:]
        groups = new
        k = min(k, remainder)
    return [b for g in groups for b in g]

def simulate_physics(bpm, amplitude, damping, duration=2.0):
    dt = 0.001
    freq = bpm / 60
    t = np.arange(0, duration, dt)
    x = amplitude * np.sin(2 * np.pi * freq * t)
    x *= np.exp(-damping * t / 10)  # light damping over duration
    v = np.gradient(x, dt)
    return t, x, v

# Run simulation sweep
configs = []
for bpm in [70, 80, 90, 100, 110, 120]:
    for hits in [3, 4, 5]:
        steps = 8
        pattern = euclidean_rhythm(hits, steps)
        pat_str = ''.join(str(b) for b in pattern)

        for amp in [20, 30, 40]:
            for damp in [0.1, 0.3, 0.5]:
                t, x, v = simulate_physics(bpm, amp, damp)

                max_v = np.max(np.abs(v)) / 100  # cm/s to m/s
                safe_mask = np.abs(x) > amp * 0.5
                safe_pct = np.sum(safe_mask) / len(x) * 100

                if safe_pct > 60 and max_v < 3:
                    rating = "SAFE"
                elif safe_pct > 40 and max_v < 5:
                    rating = "MODERATE"
                else:
                    rating = "RISKY"

                for nd in [2, 4]:
                    recommended = 1 if rating == "SAFE" and nd <= 3 else 0
                    c.execute('''INSERT INTO simulations
                        (pattern, tempo_bpm, amplitude_cm, damping, num_dancers,
                         max_gap_velocity, safe_window_pct, safety_rating, recommended)
                        VALUES (?,?,?,?,?,?,?,?,?)''',
                        (pat_str, bpm, amp, damp, nd,
                         round(max_v, 2), round(safe_pct, 1), rating, recommended))

conn.commit()

# Analysis
total = c.execute('SELECT COUNT(*) FROM simulations').fetchone()[0]
print(f"CHERAW SIMULATION ENGINE — {total} configurations tested")
print("=" * 60)

print("\\nSafety breakdown:")
for row in c.execute('''SELECT safety_rating, COUNT(*),
    ROUND(AVG(safe_window_pct),1), ROUND(AVG(max_gap_velocity),2)
    FROM simulations GROUP BY safety_rating ORDER BY 2 DESC'''):
    print(f"  {row[0]:<10}: {row[1]:>4} configs, avg safe window {row[2]}%, avg velocity {row[3]} m/s")

print("\\nBest configurations (SAFE, recommended):")
print(f"  {'Pattern':<10} {'BPM':>4} {'Amp':>4} {'Damp':>5} {'D':>2} {'Window':>7} {'Vel':>5}")
print("  " + "-" * 45)
for row in c.execute('''SELECT pattern, tempo_bpm, amplitude_cm, damping,
    num_dancers, safe_window_pct, max_gap_velocity
    FROM simulations WHERE recommended = 1
    ORDER BY safe_window_pct DESC LIMIT 8'''):
    print(f"  {row[0]:<10} {row[1]:>4} {row[2]:>4.0f} {row[3]:>5.1f} {row[4]:>2} {row[5]:>6.1f}% {row[6]:>5.2f}")

print("\\nRiskiest tempo:")
for row in c.execute('''SELECT tempo_bpm, COUNT(*),
    ROUND(100.0*SUM(CASE WHEN safety_rating='RISKY' THEN 1 ELSE 0 END)/COUNT(*),1)
    FROM simulations GROUP BY tempo_bpm ORDER BY 3 DESC LIMIT 1'''):
    print(f"  {row[0]} BPM: {row[2]}% of configurations rated RISKY")

conn.close()
print("\\nSimulation complete. Physics + patterns + database = full Cheraw engine.")`,
      challenge: 'Add a "performer_fatigue" model: over a 5-minute performance, the holders gradually increase damping and decrease amplitude. At what point does the safety rating transition from SAFE to MODERATE? This models real-world performance degradation.',
      successHint: 'You built a complete simulation engine integrating physics, algorithms, and databases. This capstone demonstrates that software engineering is about composition: combining simple, well-tested components into systems that solve complex problems. The Cheraw dance, a centuries-old tradition, meets computational science.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Database-Driven Rhythm Engineering</span>
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
          <MiniLesson key={i} id={`L4-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint} />
        ))}
      </div>
    </div>
  );
}
