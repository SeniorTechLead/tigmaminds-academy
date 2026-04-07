import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function ThangTaLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Martial arts training database — tracking warrior progress',
      concept: `A Thang-Ta academy trains many students across years. Tracking their progress — technique scores, strength measurements, reaction times — requires a **relational database**.

We design tables for:
- **warriors** — student profiles and rank
- **techniques** — catalogue of Thang-Ta moves with difficulty ratings
- **training_sessions** — individual practice records
- **assessments** — periodic skill evaluations

SQL queries let the master answer questions like:
- "Which students improved the most this month?"
- "Which technique has the highest failure rate?"
- "Is there a correlation between strength and technique score?"`,
      analogy: 'A training database is like a coach\'s notebook — but one that can instantly answer any question about any student across years of records. Instead of flipping through pages, you write a SQL query and get the answer in milliseconds.',
      storyConnection: 'In the story, the Thang-Ta master keeps mental track of every student\'s strengths and weaknesses. Our database externalises this knowledge, making it searchable, shareable, and permanent — ensuring the art is passed on accurately.',
      checkQuestion: 'Why store training data in a database rather than a spreadsheet?',
      checkAnswer: 'A spreadsheet works for one student or one table. But when you have 50 students, 30 techniques, and 3 years of daily training data, that is 50x30x365x3 = 1.6 million potential records. Spreadsheets choke on this. Databases handle it effortlessly, with indexing for fast queries and referential integrity to prevent errors.',
      codeIntro: 'Build a Thang-Ta training academy database and analyse student performance.',
      code: `import sqlite3
import numpy as np

db = sqlite3.connect(':memory:')
c = db.cursor()

c.executescript('''
CREATE TABLE warriors (
    id INTEGER PRIMARY KEY, name TEXT, rank TEXT,
    years_training REAL, dominant_hand TEXT
);
CREATE TABLE techniques (
    id INTEGER PRIMARY KEY, name TEXT, category TEXT,
    difficulty INTEGER, description TEXT
);
CREATE TABLE assessments (
    id INTEGER PRIMARY KEY, warrior_id INTEGER, technique_id INTEGER,
    score REAL, speed_rating REAL, power_rating REAL,
    assessment_date TEXT,
    FOREIGN KEY (warrior_id) REFERENCES warriors(id),
    FOREIGN KEY (technique_id) REFERENCES techniques(id)
);
''')

# Populate
warriors = [
    ('Tomba', 'Advanced', 5.0, 'right'), ('Bembem', 'Advanced', 4.0, 'left'),
    ('Chanu', 'Intermediate', 2.5, 'right'), ('Devi', 'Intermediate', 3.0, 'right'),
    ('Ibomcha', 'Beginner', 1.0, 'left'), ('Sanatombi', 'Beginner', 0.5, 'right'),
]
c.executemany('INSERT INTO warriors (name,rank,years_training,dominant_hand) VALUES (?,?,?,?)', warriors)

techniques = [
    ('Overhead Strike', 'attack', 3, 'Vertical downward arc'),
    ('Shield Block', 'defense', 2, 'Lateral deflection'),
    ('Spinning Slash', 'attack', 5, 'Full 360-degree rotation strike'),
    ('Low Sweep', 'attack', 4, 'Ground-level leg targeting arc'),
    ('Cross Parry', 'defense', 3, 'Two-sword cross block'),
    ('Reverse Thrust', 'attack', 4, 'Behind-the-back spear thrust'),
]
c.executemany('INSERT INTO techniques (name,category,difficulty,description) VALUES (?,?,?,?)', techniques)

np.random.seed(42)
for w_id in range(1, 7):
    years = warriors[w_id-1][2]
    for t_id in range(1, 7):
        diff = techniques[t_id-1][2]
        base_score = min(10, 3 + years * 1.2 - diff * 0.3 + np.random.normal(0, 0.8))
        speed = min(10, 2 + years * 0.8 + np.random.normal(0, 0.5))
        power = min(10, 2.5 + years * 0.9 + np.random.normal(0, 0.6))
        c.execute('INSERT INTO assessments (warrior_id,technique_id,score,speed_rating,power_rating,assessment_date) VALUES (?,?,?,?,?,?)',
                  (w_id, t_id, max(1, base_score), max(1, speed), max(1, power), '2024-03-15'))

# Analysis queries
print("=== Thang-Ta Academy Performance Report ===\\\n")

c.execute('''
    SELECT w.name, w.rank, w.years_training,
           ROUND(AVG(a.score),1) as avg_score,
           ROUND(AVG(a.speed_rating),1) as avg_speed,
           ROUND(AVG(a.power_rating),1) as avg_power
    FROM warriors w JOIN assessments a ON w.id = a.warrior_id
    GROUP BY w.id ORDER BY avg_score DESC
''')
print(f"{'Name':<12} {'Rank':<14} {'Years':>5} {'Score':>6} {'Speed':>6} {'Power':>6}")
print("-" * 54)
for row in c.fetchall():
    print(f"{row[0]:<12} {row[1]:<14} {row[2]:>4.1f} {row[3]:>5.1f} {row[4]:>5.1f} {row[5]:>5.1f}")

print("\\\nHardest techniques (lowest avg score):")
c.execute('''
    SELECT t.name, t.difficulty, ROUND(AVG(a.score),1) as avg_score
    FROM techniques t JOIN assessments a ON t.id = a.technique_id
    GROUP BY t.id ORDER BY avg_score ASC LIMIT 3
''')
for row in c.fetchall():
    print(f"  {row[0]}: difficulty={row[1]}, avg_score={row[2]}")

db.close()`,
      challenge: 'Add a monthly assessment system — insert scores for Jan, Feb, and Mar. Write a query to find which warrior improved the most between Jan and Mar.',
      successHint: 'Database-driven analytics is how modern sports academies track athlete development. You just built one for an ancient martial art.',
    },
    {
      title: 'Technique classification algorithm — pattern recognition',
      concept: `Can we build an algorithm that identifies which Thang-Ta technique a warrior is performing based on sensor data? This is a **classification** problem.

Given measurements like:
- Maximum angular velocity
- Total arc angle
- Strike duration
- Peak acceleration

We use the **k-nearest neighbours (kNN)** algorithm:
1. Store labelled examples of each technique
2. For a new, unknown movement, find the k most similar stored examples
3. The majority label among those k neighbours is our prediction

We implement kNN from scratch and store all training data in SQLite.`,
      analogy: 'kNN is like identifying a bird by comparing it to a field guide. You look at the features (size, colour, beak shape) and find the most similar birds in your guide. If 4 of the 5 most similar birds are sparrows, you call it a sparrow. kNN does the same thing with numbers instead of pictures.',
      storyConnection: 'Imagine a future where Thang-Ta students wear motion sensors during practice. The system automatically identifies each technique and provides instant feedback — "That was classified as a Spinning Slash with 85% confidence." This is the technology we are building.',
      checkQuestion: 'Why use k=5 neighbours instead of k=1?',
      checkAnswer: 'k=1 is sensitive to noise — one mislabelled example leads to wrong predictions. k=5 requires a majority, which is more robust. However, too large a k (like k=50) would blur the boundaries between techniques, classifying everything as the most common technique. k=5 is a common balance between noise robustness and decision sharpness.',
      codeIntro: 'Build a kNN technique classifier for Thang-Ta movements.',
      code: `import sqlite3
import numpy as np

db = sqlite3.connect(':memory:')
c = db.cursor()

c.executescript('''
CREATE TABLE training_data (
    id INTEGER PRIMARY KEY,
    technique TEXT,
    max_omega REAL, arc_angle REAL, duration REAL, peak_accel REAL
);
CREATE TABLE predictions (
    id INTEGER PRIMARY KEY,
    true_label TEXT, predicted_label TEXT, confidence REAL,
    correct INTEGER
);
''')

np.random.seed(42)
techniques = {
    'Overhead Strike':  {'omega': (15, 3), 'arc': (180, 20), 'dur': (0.4, 0.05), 'accel': (200, 30)},
    'Shield Block':     {'omega': (8, 2),  'arc': (60, 15),  'dur': (0.2, 0.03), 'accel': (100, 20)},
    'Spinning Slash':   {'omega': (25, 4), 'arc': (360, 30), 'dur': (0.6, 0.08), 'accel': (300, 40)},
    'Low Sweep':        {'omega': (18, 3), 'arc': (150, 25), 'dur': (0.5, 0.06), 'accel': (180, 25)},
    'Reverse Thrust':   {'omega': (12, 3), 'arc': (90, 20),  'dur': (0.35, 0.04), 'accel': (250, 35)},
}

# Generate training data
for tech, params in techniques.items():
    for _ in range(20):
        omega = np.random.normal(params['omega'][0], params['omega'][1])
        arc = np.random.normal(params['arc'][0], params['arc'][1])
        dur = np.random.normal(params['dur'][0], params['dur'][1])
        accel = np.random.normal(params['accel'][0], params['accel'][1])
        c.execute('INSERT INTO training_data (technique,max_omega,arc_angle,duration,peak_accel) VALUES (?,?,?,?,?)',
                  (tech, omega, arc, dur, accel))

def knn_classify(features, k=5):
    """Classify using k-nearest neighbours from database."""
    c.execute('SELECT technique, max_omega, arc_angle, duration, peak_accel FROM training_data')
    rows = c.fetchall()

    # Normalise features
    all_features = np.array([[r[1], r[2], r[3]*100, r[4]] for r in rows])
    query = np.array([features[0], features[1], features[2]*100, features[3]])

    distances = np.sqrt(np.sum((all_features - query)**2, axis=1))
    nearest_idx = np.argsort(distances)[:k]

    labels = [rows[i][0] for i in nearest_idx]
    unique, counts = np.unique(labels, return_counts=True)
    best = unique[np.argmax(counts)]
    confidence = np.max(counts) / k
    return best, confidence

# Test with new data
print("=== Thang-Ta Technique Classifier (kNN, k=5) ===\\\n")
print(f"{'True Label':<20} {'Predicted':<20} {'Conf':>5} {'Result'}")
print("-" * 55)

correct = 0
total = 0
for tech, params in techniques.items():
    for _ in range(5):
        omega = np.random.normal(params['omega'][0], params['omega'][1])
        arc = np.random.normal(params['arc'][0], params['arc'][1])
        dur = np.random.normal(params['dur'][0], params['dur'][1])
        accel = np.random.normal(params['accel'][0], params['accel'][1])

        pred, conf = knn_classify([omega, arc, dur, accel])
        is_correct = pred == tech
        correct += is_correct
        total += 1

        c.execute('INSERT INTO predictions (true_label,predicted_label,confidence,correct) VALUES (?,?,?,?)',
                  (tech, pred, conf, int(is_correct)))
        print(f"{tech:<20} {pred:<20} {conf:>4.0%} {'OK' if is_correct else 'MISS'}")

print(f"\\\nAccuracy: {correct}/{total} = {correct/total:.0%}")

c.execute('SELECT true_label, SUM(correct), COUNT(*) FROM predictions GROUP BY true_label')
print("\\\nPer-technique accuracy:")
for label, corr, tot in c.fetchall():
    print(f"  {label}: {corr}/{tot} ({corr/tot:.0%})")

db.close()`,
      challenge: 'Add a 6th technique "Cross Parry" with different parameters. Does the classifier still work well? What happens if two techniques have very similar parameters?',
      successHint: 'You just built a machine learning classifier from scratch. kNN is a foundational algorithm — simple but powerful. Modern motion recognition uses the same principles with neural networks.',
    },
    {
      title: 'Tournament bracket algorithm — managing competitions',
      concept: `A Thang-Ta tournament needs a **bracket system** to pair fighters, track results, and determine the champion. This is a **binary tree** problem.

For N competitors in a single-elimination tournament:
- Number of rounds: ceil(log2(N))
- Number of matches: N - 1
- Byes needed if N is not a power of 2: next_power_of_2(N) - N

We implement this as a recursive algorithm that:
1. Seeds fighters by rank
2. Pairs them (1 vs N, 2 vs N-1, etc.)
3. Simulates matches based on skill ratings
4. Advances winners
5. Stores all results in SQLite`,
      analogy: 'A tournament bracket is like a family tree drawn upside down. Start with many "leaves" (competitors) at the bottom. Each pair produces one "parent" (winner). Those winners pair up again, producing grandparents. Eventually, only one "ancestor" remains — the champion.',
      storyConnection: 'The story describes the annual Thang-Ta championship in Imphal, where warriors from across Manipur compete. The bracket system ensures fair pairings and a definitive champion. Our algorithm automates what tournament organisers have done by hand for centuries.',
      checkQuestion: 'In a 12-person tournament, how many byes are needed and who gets them?',
      checkAnswer: 'Next power of 2 above 12 is 16. Byes needed: 16 - 12 = 4. The top 4 seeds get byes (they skip round 1 and go straight to round 2). This rewards higher-ranked warriors and ensures the bracket works mathematically.',
      codeIntro: 'Build a complete tournament bracket system with seeding, simulation, and results tracking.',
      code: `import sqlite3
import numpy as np

db = sqlite3.connect(':memory:')
c = db.cursor()

c.executescript('''
CREATE TABLE fighters (
    id INTEGER PRIMARY KEY, name TEXT, rank INTEGER, skill_rating REAL
);
CREATE TABLE matches (
    id INTEGER PRIMARY KEY, round INTEGER, match_num INTEGER,
    fighter1_id INTEGER, fighter2_id INTEGER,
    winner_id INTEGER, score TEXT,
    FOREIGN KEY (fighter1_id) REFERENCES fighters(id),
    FOREIGN KEY (fighter2_id) REFERENCES fighters(id)
);
''')

# 12 fighters with skill ratings
fighters = [
    ('Tomba Singh', 1, 95), ('Bembem Devi', 2, 92),
    ('Chanu Kumar', 3, 88), ('Ibomcha Meitei', 4, 85),
    ('Sanatombi Devi', 5, 83), ('Naobi Singh', 6, 80),
    ('Thoiba Meitei', 7, 78), ('Laishram Devi', 8, 75),
    ('Premjit Singh', 9, 72), ('Memcha Devi', 10, 70),
    ('Rojit Kumar', 11, 68), ('Bimola Singh', 12, 65),
]
for name, rank, skill in fighters:
    c.execute('INSERT INTO fighters (name,rank,skill_rating) VALUES (?,?,?)', (name, rank, skill))

np.random.seed(42)

def simulate_match(f1_id, f2_id, round_num, match_num):
    """Simulate a match based on skill ratings with randomness."""
    c.execute('SELECT name, skill_rating FROM fighters WHERE id=?', (f1_id,))
    n1, s1 = c.fetchone()
    c.execute('SELECT name, skill_rating FROM fighters WHERE id=?', (f2_id,))
    n2, s2 = c.fetchone()

    # Higher skill = higher win probability, but upsets happen
    p1 = s1 / (s1 + s2) + np.random.normal(0, 0.05)
    winner_id = f1_id if p1 > 0.5 else f2_id
    # Generate a realistic score
    w_points = np.random.randint(3, 6)
    l_points = np.random.randint(0, w_points)
    score = f"{w_points}-{l_points}"

    c.execute('INSERT INTO matches (round,match_num,fighter1_id,fighter2_id,winner_id,score) VALUES (?,?,?,?,?,?)',
              (round_num, match_num, f1_id, f2_id, winner_id, score))
    return winner_id

# Single elimination bracket with seeding
n = len(fighters)
next_pow2 = 1
while next_pow2 < n:
    next_pow2 *= 2
n_byes = next_pow2 - n
n_rounds = int(np.log2(next_pow2))

print(f"=== Thang-Ta Championship — {n} Fighters ===")
print(f"Rounds: {n_rounds}, Byes: {n_byes}\\\n")

# Seed order: 1vN, 2v(N-1), etc.
seeds = list(range(1, n + 1))
current_round = seeds[:]

# Round 1: bottom seeds fight, top seeds get byes
byes = seeds[:n_byes]
playing = seeds[n_byes:]

print(f"Round 1 byes: seeds {byes}")
round_winners = list(byes)  # bye winners auto-advance
match_num = 0

# Pair remaining fighters
for i in range(len(playing) // 2):
    f1 = playing[i]
    f2 = playing[-(i+1)]
    match_num += 1
    winner = simulate_match(f1, f2, 1, match_num)
    round_winners.append(winner)

# Subsequent rounds
for rnd in range(2, n_rounds + 1):
    c.execute(f'''SELECT m.fighter1_id, f1.name, m.fighter2_id, f2.name, m.winner_id, fw.name, m.score
               FROM matches m
               JOIN fighters f1 ON m.fighter1_id=f1.id
               JOIN fighters f2 ON m.fighter2_id=f2.id
               JOIN fighters fw ON m.winner_id=fw.id
               WHERE m.round={rnd-1}''')
    print(f"\\\nRound {rnd-1} results:")
    for row in c.fetchall():
        marker = '*' if row[4] == row[0] else ' '
        print(f"  {row[1]:>20}{marker} vs {row[3]:<20}{'*' if row[4]==row[2] else ' '} Score: {row[6]}")

    next_winners = []
    for i in range(0, len(round_winners), 2):
        if i + 1 < len(round_winners):
            match_num += 1
            winner = simulate_match(round_winners[i], round_winners[i+1], rnd, match_num)
            next_winners.append(winner)
        else:
            next_winners.append(round_winners[i])
    round_winners = next_winners

# Final results
c.execute('''SELECT f1.name, f2.name, fw.name, m.score
           FROM matches m
           JOIN fighters f1 ON m.fighter1_id=f1.id
           JOIN fighters f2 ON m.fighter2_id=f2.id
           JOIN fighters fw ON m.winner_id=fw.id
           ORDER BY m.round DESC, m.match_num DESC LIMIT 1''')
final = c.fetchone()
print(f"\\\n{'='*40}")
print(f"FINAL: {final[0]} vs {final[1]}")
print(f"CHAMPION: {final[2]} ({final[3]})")

c.execute('SELECT COUNT(*) FROM matches')
print(f"\\\nTotal matches played: {c.fetchone()[0]}")

db.close()`,
      challenge: 'Add a double-elimination format where a fighter must lose twice to be eliminated. This requires a "losers bracket" — a second chance for first-round losers.',
      successHint: 'Tournament algorithms are used in sports, gaming (matchmaking), and even sorting algorithms (tournament sort). The binary tree structure is fundamental to computer science.',
    },
    {
      title: 'Weapon design optimiser — engineering the perfect sword',
      concept: `Designing the optimal Thang-Ta sword is a **multi-objective optimisation** problem. We want to simultaneously:
- **Maximise** tip speed (for lethality)
- **Minimise** moment of inertia (for agility)
- **Maximise** durability (thicker cross-section)
- **Place** the centre of percussion at the right spot

These objectives **conflict**: a longer sword has higher tip speed but higher inertia. A thicker sword is more durable but heavier.

We use a **Pareto front** to find designs where no objective can be improved without worsening another. Designs on the Pareto front are all "optimal" — the choice between them depends on the warrior's fighting style.`,
      analogy: 'A Pareto front is like choosing a car. No car is best at everything: a sports car is fast but uncomfortable, an SUV is spacious but slow, a sedan is balanced. The Pareto front shows you the best trade-offs — you pick the one that matches your priorities.',
      storyConnection: 'The story describes how different Thang-Ta schools favour different sword designs — some prefer long, light blades for speed, others prefer shorter, heavier blades for power. The Pareto front shows that both choices are equally valid — just optimal for different objectives.',
      checkQuestion: 'Can a design exist that is better than everything on the Pareto front?',
      checkAnswer: 'No — by definition, the Pareto front contains all designs where no objective can be improved without worsening another. If a design were better in every objective, the current front would not be the true Pareto front. However, discovering new materials or techniques can shift the entire front, making previously impossible designs feasible.',
      codeIntro: 'Optimise Thang-Ta sword design using multi-objective analysis and Pareto fronts.',
      code: `import sqlite3
import numpy as np

db = sqlite3.connect(':memory:')
c = db.cursor()

c.executescript('''
CREATE TABLE designs (
    id INTEGER PRIMARY KEY,
    length REAL, width REAL, thickness REAL, material TEXT,
    mass REAL, tip_speed REAL, agility REAL, durability REAL,
    cop_position REAL, pareto_optimal INTEGER DEFAULT 0
);
''')

np.random.seed(42)

materials = {
    'Bronze': {'density': 8900, 'strength': 300},
    'Iron':   {'density': 7870, 'strength': 500},
    'Steel':  {'density': 7850, 'strength': 800},
}

# Generate 500 random sword designs
designs = []
for i in range(500):
    length = np.random.uniform(0.5, 1.2)      # metres
    width = np.random.uniform(0.03, 0.06)      # metres
    thickness = np.random.uniform(0.003, 0.008) # metres
    material = np.random.choice(list(materials.keys()))
    mat = materials[material]

    volume = length * width * thickness
    mass = volume * mat['density']
    I = (1.0/3) * mass * length**2

    omega = 20.0  # fixed spin rate for comparison
    tip_speed = omega * length
    agility = 1.0 / I * 10  # higher = more agile
    durability = thickness * mat['strength'] / 100
    cop = (2.0/3) * length  # centre of percussion

    designs.append((length, width, thickness, material, mass, tip_speed, agility, durability, cop))
    c.execute('INSERT INTO designs (length,width,thickness,material,mass,tip_speed,agility,durability,cop_position) VALUES (?,?,?,?,?,?,?,?,?)',
              (length, width, thickness, material, mass, tip_speed, agility, durability, cop))

# Find Pareto front (tip_speed vs agility — the main trade-off)
c.execute('SELECT id, tip_speed, agility FROM designs')
all_designs = c.fetchall()
ids = [d[0] for d in all_designs]
speeds = np.array([d[1] for d in all_designs])
agilities = np.array([d[2] for d in all_designs])

pareto_ids = []
for i in range(len(ids)):
    dominated = False
    for j in range(len(ids)):
        if i != j and speeds[j] >= speeds[i] and agilities[j] >= agilities[i]:
            if speeds[j] > speeds[i] or agilities[j] > agilities[i]:
                dominated = True
                break
    if not dominated:
        pareto_ids.append(ids[i])
        c.execute('UPDATE designs SET pareto_optimal=1 WHERE id=?', (ids[i],))

import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 5))
for ax in (ax1, ax2):
    ax.set_facecolor('#1f2937')
fig.patch.set_facecolor('#1f2937')

pareto_mask = np.array([ids[i] in pareto_ids for i in range(len(ids))])
ax1.scatter(speeds[~pareto_mask], agilities[~pareto_mask], c='#6b7280', s=10, alpha=0.3, label='Dominated')
ax1.scatter(speeds[pareto_mask], agilities[pareto_mask], c='#ef4444', s=30, zorder=5, label=f'Pareto front ({sum(pareto_mask)})')

# Sort pareto front for line
pf_speeds = speeds[pareto_mask]
pf_agilities = agilities[pareto_mask]
sort_idx = np.argsort(pf_speeds)
ax1.plot(pf_speeds[sort_idx], pf_agilities[sort_idx], color='#ef4444', linewidth=2, alpha=0.7)

ax1.set_title('Pareto Front: Speed vs Agility', color='white', fontsize=12, fontweight='bold')
ax1.set_xlabel('Tip Speed (m/s)', color='white')
ax1.set_ylabel('Agility Score', color='white')
ax1.tick_params(colors='white')
ax1.legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white')
ax1.grid(True, alpha=0.2, color='white')

# Best designs by material
c.execute('''SELECT material, COUNT(*), ROUND(AVG(tip_speed),1), ROUND(AVG(agility),1),
             SUM(pareto_optimal)
             FROM designs GROUP BY material''')
mat_data = c.fetchall()
x_pos = np.arange(len(mat_data))
bar_width = 0.35
ax2.bar(x_pos - bar_width/2, [d[2] for d in mat_data], bar_width, color='#34d399', label='Avg Speed')
ax2.bar(x_pos + bar_width/2, [d[3] for d in mat_data], bar_width, color='#f59e0b', label='Avg Agility')
ax2.set_xticks(x_pos)
ax2.set_xticklabels([d[0] for d in mat_data])
ax2.set_title('Performance by Material', color='white', fontsize=12, fontweight='bold')
ax2.tick_params(colors='white')
ax2.legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white')

plt.tight_layout()
plt.savefig('pareto.png', dpi=100, bbox_inches='tight', facecolor='#1f2937')
plt.show()

print(f"Total designs: {len(ids)}")
print(f"Pareto-optimal: {len(pareto_ids)} ({len(pareto_ids)/len(ids)*100:.1f}%)")
print("\\\nBest Pareto designs:")
c.execute('''SELECT length, material, mass, tip_speed, agility, durability
             FROM designs WHERE pareto_optimal=1
             ORDER BY tip_speed DESC LIMIT 5''')
print(f"{'Length':>7} {'Material':<8} {'Mass':>5} {'Speed':>6} {'Agile':>6} {'Durable':>8}")
for row in c.fetchall():
    print(f"{row[0]:>6.2f}m {row[1]:<8} {row[2]:>4.2f} {row[3]:>5.1f} {row[4]:>5.1f} {row[5]:>7.2f}")

db.close()`,
      challenge: 'Add a third objective: durability. Find the 3D Pareto front. How many designs are Pareto-optimal when considering all three objectives versus just two?',
      successHint: 'Multi-objective optimisation with Pareto fronts is used in engineering design, financial portfolio management, and machine learning hyperparameter tuning. You just applied it to weapon engineering.',
    },
    {
      title: 'Full combat simulation — strategy, physics, and data',
      concept: `The capstone project integrates everything: rotational physics, biomechanics, database storage, and algorithmic decision-making into a **combat simulation**.

Two AI warriors fight using:
- Physics-based attack and defence (angular momentum, energy transfer)
- Strategy algorithm (choose technique based on opponent's position)
- Real-time state tracking in SQLite
- Statistical analysis of the outcome

This is a simplified version of how video game combat engines work — and how real sports analysis combines physics with strategy.`,
      analogy: 'A combat simulation is like a chess engine that also understands physics. Chess engines evaluate positions and choose moves strategically. Our simulation does the same, but each "move" involves real physics calculations — angular velocities, impact forces, and energy transfers.',
      storyConnection: 'The story ends with a grand tournament that the protagonist watches, analysing each fighter\'s technique and strategy. Our simulation lets us run that tournament thousands of times, discovering which strategies and techniques lead to victory.',
      checkQuestion: 'Why is a physics-based combat simulation more realistic than a simple random number generator?',
      checkAnswer: 'Random outcomes ignore physics. In reality, a faster technique beats a slower one if timed correctly, a heavier weapon transfers more energy, and fatigue reduces performance over time. Physics-based simulation captures these relationships, producing outcomes that match what would actually happen — not just random chance.',
      codeIntro: 'Build a complete Thang-Ta combat simulation with physics, strategy, and database tracking.',
      code: `import sqlite3
import numpy as np

db = sqlite3.connect(':memory:')
c = db.cursor()

c.executescript('''
CREATE TABLE combat_log (
    id INTEGER PRIMARY KEY, round INTEGER,
    attacker TEXT, technique TEXT,
    attack_speed REAL, attack_power REAL,
    defender TEXT, defence_type TEXT,
    damage REAL, result TEXT
);
CREATE TABLE combat_summary (
    fighter TEXT, wins INTEGER, losses INTEGER,
    total_damage_dealt REAL, total_damage_taken REAL,
    favourite_technique TEXT
);
''')

np.random.seed(42)

class Fighter:
    def __init__(self, name, skill, strength, speed, stamina):
        self.name = name
        self.skill = skill
        self.strength = strength
        self.speed = speed
        self.stamina = stamina
        self.max_stamina = stamina
        self.health = 100.0
        self.techniques_used = {}

    def choose_technique(self, opponent_distance):
        """Strategy: choose technique based on distance and stamina."""
        if self.stamina < 20:
            return 'Shield Block', 8, 3    # conserve energy
        if opponent_distance < 0.5:
            return 'Reverse Thrust', 12, 8
        if opponent_distance > 1.2:
            return 'Spinning Slash', 25, 12
        if np.random.random() < 0.6:
            return 'Overhead Strike', 18, 10
        return 'Low Sweep', 15, 9

    def attack(self, technique, omega, power_base):
        """Calculate attack physics."""
        I = 0.085  # sword moment of inertia
        KE = 0.5 * I * omega**2
        # Skill modifies effective power
        effective_power = power_base * (self.skill / 100) * (self.stamina / self.max_stamina)
        self.stamina = max(0, self.stamina - 5)
        self.techniques_used[technique] = self.techniques_used.get(technique, 0) + 1
        return KE, effective_power

    def defend(self, incoming_power):
        """Calculate defence outcome."""
        block_chance = 0.3 + 0.4 * (self.skill / 100) * (self.stamina / self.max_stamina)
        if np.random.random() < block_chance:
            damage = incoming_power * 0.2
            self.stamina = max(0, self.stamina - 3)
            return damage, 'BLOCKED'
        else:
            damage = incoming_power * 0.8
            self.stamina = max(0, self.stamina - 2)
            return damage, 'HIT'

def simulate_combat(f1, f2, max_rounds=20):
    """Simulate a full combat between two fighters."""
    for rnd in range(1, max_rounds + 1):
        distance = np.random.uniform(0.3, 1.5)

        # Fighter 1 attacks
        tech, omega, power = f1.choose_technique(distance)
        KE, eff_power = f1.attack(tech, omega, power)
        damage, result = f2.defend(eff_power)
        f2.health -= damage

        c.execute('INSERT INTO combat_log (round,attacker,technique,attack_speed,attack_power,defender,defence_type,damage,result) VALUES (?,?,?,?,?,?,?,?,?)',
                  (rnd, f1.name, tech, omega, eff_power, f2.name, 'auto', damage, result))

        if f2.health <= 0:
            return f1.name, rnd

        # Fighter 2 attacks
        tech, omega, power = f2.choose_technique(distance)
        KE, eff_power = f2.attack(tech, omega, power)
        damage, result = f1.defend(eff_power)
        f1.health -= damage

        c.execute('INSERT INTO combat_log (round,attacker,technique,attack_speed,attack_power,defender,defence_type,damage,result) VALUES (?,?,?,?,?,?,?,?,?)',
                  (rnd, f2.name, tech, omega, eff_power, f1.name, 'auto', damage, result))

        if f1.health <= 0:
            return f2.name, rnd

        # Stamina recovery between rounds
        f1.stamina = min(f1.max_stamina, f1.stamina + 2)
        f2.stamina = min(f2.max_stamina, f2.stamina + 2)

    return (f1.name if f1.health > f2.health else f2.name), max_rounds

# Run tournament
print("=== Thang-Ta Combat Simulation ===\\\n")
fighters_config = [
    ("Tomba (Power)", 85, 90, 70, 80),
    ("Bembem (Speed)", 80, 70, 95, 75),
    ("Chanu (Tank)", 75, 80, 65, 100),
    ("Devi (Skill)", 95, 75, 80, 70),
]

wins = {name: 0 for name, *_ in fighters_config}
for i in range(len(fighters_config)):
    for j in range(i+1, len(fighters_config)):
        for trial in range(5):  # best of 5
            f1 = Fighter(*fighters_config[i])
            f2 = Fighter(*fighters_config[j])
            winner, rounds = simulate_combat(f1, f2)
            wins[winner] += 1
            if trial == 0:
                print(f"{f1.name} vs {f2.name}: {winner} wins in {rounds} rounds")

print("\\\n--- Win Totals ---")
for name, w in sorted(wins.items(), key=lambda x: -x[1]):
    print(f"  {name}: {w} wins")

# Technique effectiveness
c.execute('''SELECT technique, COUNT(*) as uses,
             SUM(CASE WHEN result='HIT' THEN 1 ELSE 0 END) as hits,
             ROUND(AVG(damage),1) as avg_dmg
             FROM combat_log GROUP BY technique ORDER BY avg_dmg DESC''')
print("\\\n--- Technique Effectiveness ---")
print(f"{'Technique':<20} {'Uses':>5} {'Hits':>5} {'Hit%':>5} {'AvgDmg':>7}")
for tech, uses, hits, avg_dmg in c.fetchall():
    print(f"{tech:<20} {uses:>5} {hits:>5} {hits/uses*100:>4.0f}% {avg_dmg:>6.1f}")

db.close()`,
      challenge: 'Add a "fatigue system" where fighters slow down after taking damage. Injured fighters (health < 50) should have reduced skill and speed. How does this change the tournament outcomes?',
      successHint: 'You just built a physics-based game engine with AI strategy, database logging, and statistical analysis. This is the foundation of sports simulation, game development, and tactical planning systems.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Combat Systems & Data Engineering</span>
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
