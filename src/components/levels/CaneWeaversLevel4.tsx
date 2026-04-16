import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function CaneWeaversLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Pattern database — cataloguing Tripura\'s weaves',
      concept: `A pattern database stores weave designs with their properties, cultural significance, and structural characteristics. This is how museums and textile archives preserve traditional knowledge digitally.

Tables needed:
- **patterns**: the binary grid, name, origin village, wallpaper group
- **properties**: structural metrics (float length, interlacing, symmetry)
- **cultural_info**: meaning, occasion of use, associated ceremonies
- **similarity**: how similar each pair of patterns is

📚 *We will create a comprehensive pattern database in SQLite and populate it with representative Tripura weave patterns.*`,
      analogy: 'A pattern database is like a botanical garden catalogue — it preserves, classifies, and makes accessible a collection that would otherwise exist only in the memories of ageing practitioners.',
      storyConnection: 'Many traditional Tripura weave patterns are at risk of being lost as younger generations move to cities. A digital catalogue preserves this knowledge permanently and makes it accessible to designers, researchers, and future weavers.',
      checkQuestion: 'Why store the binary grid in the database rather than just a description?',
      checkAnswer: 'Because the binary grid IS the pattern — it can be analysed, compared, and reproduced exactly. Descriptions are ambiguous; grids are precise. You can compute symmetry groups, similarity scores, and structural properties directly from the stored grid.',
      codeIntro: 'Create a comprehensive pattern database for Tripura cane weave designs.',
      code: `import sqlite3
import numpy as np
import json

db = sqlite3.connect(':memory:')
cur = db.cursor()

cur.executescript('''
CREATE TABLE patterns (
    id INTEGER PRIMARY KEY, name TEXT, village TEXT,
    grid_size INTEGER, grid_json TEXT, wallpaper_group TEXT
);
CREATE TABLE properties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pattern_id INTEGER, metric TEXT, value REAL
);
CREATE TABLE cultural_info (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pattern_id INTEGER, field TEXT, info TEXT
);
CREATE TABLE similarity (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pattern_a INTEGER, pattern_b INTEGER, score REAL
);
''')

# Define patterns as rules
def pattern_grid(rule, size=8):
    return [[rule(r, c) for c in range(size)] for r in range(size)]

designs = [
    (1, 'Thambal', 'Agartala', lambda r,c: (r+c)%2, 'p4m', 'Plain weave - everyday baskets', 'Daily use'),
    (2, 'Risa Twill', 'Khowai', lambda r,c: 1 if (r+c)%4<2 else 0, 'p2', 'Traditional risa cloth pattern', 'Festival wear'),
    (3, 'Diamond Star', 'Udaipur', lambda r,c: 1 if (abs(r-4)+abs(c-4))%4<2 else 0, 'pmm', 'Diamond pattern for ceremonial baskets', 'Weddings'),
    (4, 'Zigzag Path', 'Dharmanagar', lambda r,c: 1 if ((r+c) if r%4<2 else (r-c))%4<2 else 0, 'pg', 'Zigzag representing river', 'Decoration'),
    (5, 'Checkerboard', 'Belonia', lambda r,c: 1 if ((r//2)+(c//2))%2==0 else 0, 'p4m', 'Bold checker for storage', 'Storage baskets'),
    (6, 'Dense Weave', 'Ambassa', lambda r,c: 1 if (r*2+c)%3<2 else 0, 'p1', 'Dense pattern for water vessels', 'Utility'),
]

for pid, name, village, rule, group, meaning, occasion in designs:
    grid = pattern_grid(rule)
    grid_json = json.dumps(grid)
    cur.execute('INSERT INTO patterns VALUES (?,?,?,?,?,?)',
                (pid, name, village, 8, grid_json, group))

    # Compute properties
    g = np.array(grid)
    density = float(g.mean())
    max_float = 1
    for r in range(8):
        run = 1
        for c in range(1, 8):
            if g[r,c] == g[r,c-1]: run += 1
            else: run = 1
            max_float = max(max_float, run)

    for metric, value in [('density', density), ('max_float', max_float),
                           ('symmetry_score', float(np.mean(g == np.rot90(g, 2))))]:
        cur.execute('INSERT INTO properties (pattern_id, metric, value) VALUES (?,?,?)',
                    (pid, metric, round(value, 3)))

    cur.execute('INSERT INTO cultural_info (pattern_id, field, info) VALUES (?,?,?)',
                (pid, 'meaning', meaning))
    cur.execute('INSERT INTO cultural_info (pattern_id, field, info) VALUES (?,?,?)',
                (pid, 'occasion', occasion))

# Compute similarity between all pairs
patterns_data = cur.execute('SELECT id, grid_json FROM patterns').fetchall()
for i, (id_a, json_a) in enumerate(patterns_data):
    for j, (id_b, json_b) in enumerate(patterns_data):
        if id_a < id_b:
            ga = np.array(json.loads(json_a))
            gb = np.array(json.loads(json_b))
            sim = float(np.mean(ga == gb))
            cur.execute('INSERT INTO similarity (pattern_a, pattern_b, score) VALUES (?,?,?)',
                        (id_a, id_b, round(sim, 3)))
db.commit()

# Display
print("TRIPURA CANE WEAVE PATTERN DATABASE")
print("=" * 70)
for p in cur.execute('SELECT p.id, p.name, p.village, p.wallpaper_group FROM patterns p'):
    props = {r[0]: r[1] for r in cur.execute('SELECT metric, value FROM properties WHERE pattern_id=?', (p[0],))}
    info = {r[0]: r[1] for r in cur.execute('SELECT field, info FROM cultural_info WHERE pattern_id=?', (p[0],))}
    print(f"\
[{p[0]}] {p[1]} — {p[2]} (Group: {p[3]})")
    print(f"    Density: {props.get('density',0)*100:.0f}% | Max float: {props.get('max_float',0):.0f} | Symmetry: {props.get('symmetry_score',0)*100:.0f}%")
    print(f"    {info.get('meaning','')} | Used for: {info.get('occasion','')}")

# Find most similar pair
best = cur.execute('SELECT pattern_a, pattern_b, score FROM similarity ORDER BY score DESC LIMIT 1').fetchone()
na = cur.execute('SELECT name FROM patterns WHERE id=?', (best[0],)).fetchone()[0]
nb = cur.execute('SELECT name FROM patterns WHERE id=?', (best[1],)).fetchone()[0]
print(f"\
Most similar pair: {na} & {nb} ({best[2]*100:.0f}% match)")`,
      challenge: 'Add a search function: given a target density and symmetry requirement, find the matching patterns. Which pattern best matches "high density, high symmetry"?',
      successHint: 'A pattern database preserves cultural knowledge in a form that can be searched, analysed, and shared globally. This is digital heritage preservation at its most practical.',
    },
    {
      title: 'Pattern search and recommendation engine',
      concept: `Given a desired application (storage basket, decorative mat, ceremonial item), we can **recommend** the best pattern by matching application requirements to pattern properties.

Requirements for different applications:
- **Storage basket**: high interlacing, short floats, high strength
- **Decorative mat**: high visual complexity, good symmetry, moderate density
- **Ceremonial item**: specific cultural pattern, high symmetry, traditional design

The recommendation engine:
1. Scores each pattern against the requirements
2. Ranks patterns by total score
3. Returns the top matches with explanations

📚 *We will build a recommendation engine that queries the database and scores patterns against multi-criteria requirements.*`,
      analogy: 'A recommendation engine is like a knowledgeable shopkeeper who asks what you need, considers all the options, and suggests the perfect match. Our engine does this for weave patterns.',
      storyConnection: 'A young weaver in Tripura learning the craft could use this system to find the right traditional pattern for any occasion — preserving knowledge that might otherwise require years of apprenticeship to acquire.',
      checkQuestion: 'Why use multiple criteria rather than just picking the "strongest" or "prettiest" pattern?',
      checkAnswer: 'Because real design involves trade-offs. The strongest pattern may be ugly; the prettiest may fall apart. Multi-criteria scoring finds the best BALANCE — just as a weaver considers beauty, durability, tradition, and practicality simultaneously.',
      codeIntro: 'Build a pattern recommendation engine for different weaving applications.',
      code: `import sqlite3
import numpy as np
import json

db = sqlite3.connect(':memory:')
cur = db.cursor()

cur.executescript('''
CREATE TABLE patterns (id INTEGER PRIMARY KEY, name TEXT, grid_json TEXT);
CREATE TABLE properties (pattern_id INTEGER, metric TEXT, value REAL);
CREATE TABLE recommendations (id INTEGER PRIMARY KEY AUTOINCREMENT,
    application TEXT, pattern_id INTEGER, score REAL, explanation TEXT);
''')

# Patterns with properties
designs = [
    (1, 'Thambal Plain', lambda r,c: (r+c)%2),
    (2, 'Risa Twill', lambda r,c: 1 if (r+c)%4<2 else 0),
    (3, 'Diamond Star', lambda r,c: 1 if (abs(r-4)+abs(c-4))%4<2 else 0),
    (4, 'Fine Satin', lambda r,c: 1 if (r*2+c)%5==0 else 0),
    (5, 'Bold Checker', lambda r,c: 1 if ((r//2)+(c//2))%2==0 else 0),
    (6, 'Dense Basket', lambda r,c: 1 if (r+c)%3<2 else 0),
    (7, 'Herringbone', lambda r,c: 1 if ((r+c) if r%4<2 else (r-c))%4<2 else 0),
    (8, 'Cross Hatch', lambda r,c: 1 if r%4==0 or c%4==0 else 0),
]

for pid, name, rule in designs:
    grid = [[rule(r,c) for c in range(8)] for r in range(8)]
    g = np.array(grid)
    cur.execute('INSERT INTO patterns VALUES (?,?,?)', (pid, name, json.dumps(grid)))

    # Compute all properties
    density = float(g.mean())
    sym_180 = float(np.mean(g == np.rot90(g, 2)))

    max_float = 1
    for r in range(8):
        run = 1
        for c in range(1, 8):
            if g[r,c] == g[r,c-1]: run += 1
            else: run = 1
            max_float = max(max_float, run)

    interlacing = float(np.sum(np.diff(g, axis=1) != 0)) / (8 * 7)
    blocks = len(set(tuple(g[r:r+2,c:c+2].flatten()) for r in range(7) for c in range(7)))
    complexity = blocks / 16

    for m, v in [('density', density), ('symmetry', sym_180), ('max_float', max_float),
                 ('interlacing', interlacing), ('complexity', complexity)]:
        cur.execute('INSERT INTO properties VALUES (?,?,?)', (pid, m, round(v, 3)))
db.commit()

# Application requirements (weight for each property)
applications = {
    'Storage basket': {
        'density': (0.5, 0.2), 'symmetry': (0.5, 0.1), 'max_float': (2, -0.3),
        'interlacing': (0.5, 0.3), 'complexity': (0.5, 0.1)
    },
    'Decorative mat': {
        'density': (0.5, 0.1), 'symmetry': (0.7, 0.25), 'max_float': (3, -0.1),
        'interlacing': (0.3, 0.1), 'complexity': (0.8, 0.35)
    },
    'Ceremonial gift': {
        'density': (0.5, 0.15), 'symmetry': (0.9, 0.35), 'max_float': (2, -0.2),
        'interlacing': (0.5, 0.1), 'complexity': (0.7, 0.2)
    },
}

print("PATTERN RECOMMENDATIONS")
print("=" * 65)

for app_name, weights in applications.items():
    print(f"\
Application: {app_name}")
    print("-" * 50)

    scores = []
    for p in cur.execute('SELECT id, name FROM patterns'):
        total = 0
        reasons = []
        for metric, (target, weight) in weights.items():
            val = cur.execute('SELECT value FROM properties WHERE pattern_id=? AND metric=?',
                            (p[0], metric)).fetchone()
            if val:
                if weight > 0:
                    contrib = (1 - abs(val[0] - target)) * weight
                else:
                    contrib = (1 - val[0] / 8) * abs(weight)
                total += contrib
                if abs(contrib) > 0.1:
                    reasons.append(f"{metric}={val[0]:.2f}")
        scores.append((total, p[0], p[1], ', '.join(reasons[:3])))

    scores.sort(key=lambda x: -x[0])
    for rank, (score, pid, name, reason) in enumerate(scores[:3], 1):
        cur.execute('INSERT INTO recommendations (application, pattern_id, score, explanation) VALUES (?,?,?,?)',
                    (app_name, pid, round(score, 3), reason))
        print(f"  #{rank}: {name:20s} (score: {score:.3f}) — {reason}")

db.commit()
print(f"\
Total recommendations stored: {cur.execute('SELECT COUNT(*) FROM recommendations').fetchone()[0]}")`,
      challenge: 'Add a "custom" application where the user specifies their own weights. Implement interactive weight adjustment and see how recommendations change.',
      successHint: 'Recommendation engines transform expert knowledge into accessible tools. A young weaver can now get pattern advice that previously required decades of experience.',
    },
    {
      title: 'Pattern generation with constraint satisfaction',
      concept: `Given a set of requirements (symmetry group, density range, max float length), can we **generate** a pattern that satisfies all constraints simultaneously?

This is a **constraint satisfaction problem** (CSP):
- Variables: each cell (0 or 1)
- Constraints: symmetry, density, float length, interlacing

Solving approaches:
- **Backtracking**: try values, backtrack when constraints are violated
- **Random restart**: generate random patterns, keep those that satisfy all constraints
- **Evolutionary**: use GA with constraint penalties

📚 *We will implement a constraint-based pattern generator that creates new designs meeting specified requirements.*`,
      analogy: 'Constraint satisfaction is like Sudoku — you fill cells one at a time, always checking that the rules are not broken. If you get stuck, you backtrack and try a different value. Weave pattern generation works the same way.',
      storyConnection: 'A master weaver mentally solves a constraint problem for every new design — balancing beauty, strength, tradition, and practical requirements. Our algorithm automates this creative process.',
      checkQuestion: 'If we require 4-fold rotation symmetry, how many cells in an 8×8 grid are actually "free" (the rest are determined by symmetry)?',
      checkAnswer: 'Under 4-fold rotation, cells map in groups of 4 (except the centre in odd-sized grids). For 8×8 = 64 cells: 64/4 = 16 independent cells. Setting just 16 cells determines the entire pattern. This dramatically reduces the search space.',
      codeIntro: 'Generate new weave patterns that satisfy multiple design constraints.',
      code: `import numpy as np
import sqlite3

np.random.seed(42)

def enforce_symmetry(grid, sym_type):
    """Enforce symmetry on upper-left quadrant."""
    n = grid.shape[0]
    half = n // 2
    if sym_type == 'p4m':
        for r in range(half):
            for c in range(half):
                v = grid[r, c]
                grid[r, n-1-c] = v
                grid[n-1-r, c] = v
                grid[n-1-r, n-1-c] = v
                grid[c, r] = v
                grid[c, n-1-r] = v
                grid[n-1-c, r] = v
                grid[n-1-c, n-1-r] = v
    elif sym_type == 'pmm':
        for r in range(half):
            for c in range(half):
                v = grid[r, c]
                grid[r, n-1-c] = v
                grid[n-1-r, c] = v
                grid[n-1-r, n-1-c] = v
    elif sym_type == 'p2':
        for r in range(half):
            for c in range(n):
                grid[n-1-r, n-1-c] = grid[r, c]
    return grid

def check_constraints(grid, constraints):
    """Check if grid satisfies all constraints."""
    n = grid.shape[0]
    issues = []

    if 'density' in constraints:
        lo, hi = constraints['density']
        d = grid.mean()
        if d < lo or d > hi:
            issues.append(f"density {d:.2f} outside [{lo},{hi}]")

    if 'max_float' in constraints:
        mf = constraints['max_float']
        for r in range(n):
            run = 1
            for c in range(1, n):
                if grid[r,c] == grid[r,c-1]: run += 1
                else: run = 1
                if run > mf:
                    issues.append(f"float {run} > {mf}")
                    return issues
    return issues

def generate_pattern(size, symmetry, constraints, max_attempts=5000):
    """Generate a random pattern satisfying constraints."""
    best_grid = None
    best_issues = 999

    for attempt in range(max_attempts):
        grid = np.random.randint(0, 2, (size, size))
        grid = enforce_symmetry(grid, symmetry)
        issues = check_constraints(grid, constraints)

        if len(issues) == 0:
            return grid, attempt + 1, []
        if len(issues) < best_issues:
            best_issues = len(issues)
            best_grid = grid.copy()

    return best_grid, max_attempts, check_constraints(best_grid, constraints)

# Generate patterns with different requirements
specs = [
    ('Symmetric basket', 'p4m', {'density': (0.4, 0.6), 'max_float': 3}),
    ('Strong utility', 'pmm', {'density': (0.45, 0.55), 'max_float': 2}),
    ('Decorative', 'p2', {'density': (0.3, 0.7), 'max_float': 5}),
    ('Dense storage', 'pmm', {'density': (0.6, 0.8), 'max_float': 4}),
]

db = sqlite3.connect(':memory:')
cur = db.cursor()
cur.execute('''CREATE TABLE generated (id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT, symmetry TEXT, attempts INTEGER, density REAL, max_float INTEGER, valid INTEGER)''')

print("CONSTRAINT-BASED PATTERN GENERATION")
print("=" * 60)

for name, sym, constraints in specs:
    grid, attempts, issues = generate_pattern(8, sym, constraints)
    valid = len(issues) == 0

    # Display
    print(f"\
{name} (group: {sym}, attempts: {attempts})")
    print(f"  Constraints: {constraints}")
    print(f"  Status: {'VALID' if valid else 'BEST EFFORT (' + str(issues) + ')'}")
    print(f"  Density: {grid.mean():.2f}")

    for row in grid:
        print("  " + " ".join("█" if c else "░" for c in row))

    mf = 1
    for r in range(8):
        run = 1
        for c in range(1, 8):
            if grid[r,c] == grid[r,c-1]: run += 1
            else: run = 1
            mf = max(mf, run)

    cur.execute('INSERT INTO generated (name,symmetry,attempts,density,max_float,valid) VALUES (?,?,?,?,?,?)',
                (name, sym, attempts, round(float(grid.mean()), 3), mf, 1 if valid else 0))

db.commit()
total = cur.execute('SELECT COUNT(*) FROM generated').fetchone()[0]
valid_count = cur.execute('SELECT COUNT(*) FROM generated WHERE valid=1').fetchone()[0]
print(f"\
Generated: {total} patterns, {valid_count} valid")`,
      challenge: 'Add an "aesthetic score" constraint based on block entropy (must be > 2.5 bits). How much harder does generation become with this additional constraint?',
      successHint: 'Constraint satisfaction is how computers solve design problems. From circuit layout to building architecture to weave patterns, the approach is the same: define what you need, and let the algorithm find a solution.',
    },
    {
      title: 'Complete weave design system — the capstone',
      concept: `The capstone project integrates everything into a **complete weave design system**:

1. **Pattern database**: store and retrieve traditional designs
2. **Analysis**: compute symmetry, structural, and complexity properties
3. **Generation**: create new patterns from constraints
4. **Recommendation**: match patterns to applications
5. **Comparison**: find similar patterns and detect plagiarism

This system could serve a weaving cooperative, a museum, or a design school — preserving tradition while enabling innovation.

📚 *We will build the complete integrated system using sqlite3, numpy, and all our pattern analysis tools.*`,
      analogy: 'This system is like a complete design studio for weavers — a library of patterns, tools for analysis, a generator for new ideas, and a recommendation engine for practical decisions. All in one database.',
      storyConnection: 'The cane weavers of Tripura deserve tools that honour their craft while extending its reach. This capstone builds exactly that — a system that preserves traditional patterns, generates new ones, and helps weavers make informed design decisions.',
      checkQuestion: 'How could this system help a weaving cooperative compete in global markets?',
      checkAnswer: 'It could: 1) Certify authenticity of traditional patterns (preventing counterfeits), 2) Generate new patterns that meet international textile standards, 3) Recommend optimal patterns for specific products (bags, mats, fashion), 4) Track which patterns sell best. Data-driven design meets traditional craft.',
      codeIntro: 'Build a complete integrated weave design system for Tripura\'s cane weavers.',
      code: `import sqlite3
import numpy as np
import json

db = sqlite3.connect(':memory:')
cur = db.cursor()

cur.executescript('''
CREATE TABLE catalogue (
    id INTEGER PRIMARY KEY, name TEXT, origin TEXT, category TEXT,
    grid_json TEXT, symmetry_group TEXT,
    density REAL, max_float INTEGER, complexity REAL, strength_score REAL
);
CREATE TABLE applications (
    id INTEGER PRIMARY KEY, name TEXT, min_density REAL, max_float INTEGER,
    min_symmetry REAL, min_strength REAL
);
CREATE TABLE design_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT, pattern_name TEXT, timestamp TEXT, details TEXT
);
''')

# Populate catalogue
def add_pattern(pid, name, origin, category, rule):
    grid = [[rule(r,c) for c in range(8)] for r in range(8)]
    g = np.array(grid)
    density = float(g.mean())
    sym = float(np.mean(g == np.rot90(g, 2)))
    mf = max(max(sum(1 for _ in group) for val, group in
             __import__('itertools').groupby(row)) for row in g)
    blocks = len(set(tuple(g[r:r+2,c:c+2].flatten()) for r in range(7) for c in range(7)))
    complexity = blocks / 16
    strength = (1 - mf/8) * 0.5 + density * 0.3 + sym * 0.2

    group = 'p4m' if sym > 0.9 and np.array_equal(g, g.T) else 'pmm' if sym > 0.9 else 'p2' if sym > 0.7 else 'p1'

    cur.execute('INSERT INTO catalogue VALUES (?,?,?,?,?,?,?,?,?,?)',
                (pid, name, origin, category, json.dumps(grid), group,
                 round(density, 3), int(mf), round(complexity, 3), round(strength, 3)))
    return density, mf, complexity, strength

patterns = [
    (1, 'Thambal', 'Agartala', 'utility', lambda r,c: (r+c)%2),
    (2, 'Risa Classic', 'Khowai', 'textile', lambda r,c: 1 if (r+c)%4<2 else 0),
    (3, 'Star Diamond', 'Udaipur', 'ceremonial', lambda r,c: 1 if (abs(r-4)+abs(c-4))%4<2 else 0),
    (4, 'River Zigzag', 'Dharmanagar', 'decorative', lambda r,c: 1 if ((r+c) if r%4<2 else (r-c))%4<2 else 0),
    (5, 'Bold Check', 'Belonia', 'utility', lambda r,c: 1 if ((r//2)+(c//2))%2==0 else 0),
    (6, 'Fine Mesh', 'Ambassa', 'utility', lambda r,c: 1 if (r+c)%3<2 else 0),
    (7, 'Festival Band', 'Sabroom', 'ceremonial', lambda r,c: 1 if (r*2+c*3)%7<3 else 0),
    (8, 'Mountain Path', 'Jirania', 'decorative', lambda r,c: 1 if (r+c*2)%5<2 else 0),
]

print("TRIPURA CANE WEAVE DESIGN SYSTEM")
print("=" * 70)
print("Loading pattern catalogue...")

for args in patterns:
    d, mf, cx, st = add_pattern(*args)

# Applications
apps = [
    (1, 'Storage basket', 0.45, 2, 0.5, 0.6),
    (2, 'Floor mat', 0.40, 3, 0.6, 0.5),
    (3, 'Gift basket', 0.35, 4, 0.7, 0.4),
    (4, 'Fashion bag', 0.30, 5, 0.5, 0.3),
]
cur.executemany('INSERT INTO applications VALUES (?,?,?,?,?,?)', apps)
db.commit()

# Display catalogue
print(f"\
CATALOGUE ({cur.execute('SELECT COUNT(*) FROM catalogue').fetchone()[0]} patterns)")
print("-" * 70)
print(f"{'Name':<16} {'Origin':<14} {'Cat':<12} {'Group':>5} {'Dens':>5} {'MF':>3} {'Cplx':>5} {'Str':>5}")
print("-" * 70)
for r in cur.execute('SELECT name,origin,category,symmetry_group,density,max_float,complexity,strength_score FROM catalogue ORDER BY strength_score DESC'):
    print(f"{r[0]:<16} {r[1]:<14} {r[2]:<12} {r[3]:>5} {r[4]:>5.2f} {r[5]:>3} {r[6]:>5.2f} {r[7]:>5.2f}")

# Recommendation engine
print("\
RECOMMENDATIONS BY APPLICATION")
print("=" * 70)
for app in cur.execute('SELECT * FROM applications'):
    print(f"\
{app[1]}:")
    matches = cur.execute('''
        SELECT name, density, max_float, strength_score, complexity
        FROM catalogue
        WHERE density >= ? AND max_float <= ?
        AND strength_score >= ?
        ORDER BY strength_score DESC LIMIT 3
    ''', (app[2], app[3], app[5])).fetchall()

    if matches:
        for i, m in enumerate(matches, 1):
            print(f"  #{i}: {m[0]:16s} (density={m[1]:.2f}, strength={m[3]:.2f})")
            cur.execute('INSERT INTO design_log (action,pattern_name,timestamp,details) VALUES (?,?,?,?)',
                        ('recommend', m[0], '2026-04-07', f'For {app[1]}'))
    else:
        print("  No matching patterns. Consider generating a new design.")

# Summary statistics
db.commit()
print(f"\
{'='*70}")
print("SYSTEM SUMMARY")
print(f"Patterns in catalogue: {cur.execute('SELECT COUNT(*) FROM catalogue').fetchone()[0]}")
print(f"Applications defined: {cur.execute('SELECT COUNT(*) FROM applications').fetchone()[0]}")
print(f"Design log entries: {cur.execute('SELECT COUNT(*) FROM design_log').fetchone()[0]}")
groups = cur.execute('SELECT symmetry_group, COUNT(*) FROM catalogue GROUP BY symmetry_group').fetchall()
print(f"Wallpaper groups represented: {', '.join(f'{g[0]}({g[1]})' for g in groups)}")
avg_str = cur.execute('SELECT AVG(strength_score) FROM catalogue').fetchone()[0]
print(f"Average pattern strength: {avg_str:.3f}")`,
      challenge: 'Add a "generate new pattern" feature that creates a design meeting a specific application\'s requirements, adds it to the catalogue, and logs the creation. Run it for all 4 applications.',
      successHint: 'You have built a complete design system that preserves, analyses, recommends, and generates cane weave patterns. This is computational craft — honouring Tripura\'s tradition with the tools of computer science.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Weave Design System</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
