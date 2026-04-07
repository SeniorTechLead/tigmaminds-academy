import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function PoloManipurLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Polo match database — tracking every play',
      concept: `A professional polo match generates hundreds of data points: hits, passes, goals, fouls, distances, speeds. Storing this in **SQLite** enables deep analysis.

Tables:
- **matches** — date, teams, venue, result
- **players** — name, team, position, stats
- **plays** — each action: who, what, where, when, outcome
- **goals** — scorer, assister, distance, angle, speed

SQL queries answer coaching questions:
- "Which player has the highest goal conversion rate?"
- "From what distance are goals most likely?"
- "Which team formation produces the most shots on goal?"`,
      analogy: 'A play-by-play database is like a video replay that you can search with words. Instead of rewinding footage to find "all goals from the right side," you write a SQL query and get instant results from 100 matches.',
      storyConnection: 'The story describes how modern analytics transformed Manipuri polo. Teams that embraced data analysis — tracking every play, every shot, every position — gained a competitive edge. The database is the foundation of sports analytics.',
      checkQuestion: 'Why track unsuccessful plays (missed shots, turnovers) in addition to goals?',
      checkAnswer: 'Unsuccessful plays reveal weaknesses. A player with a 10% shot accuracy from 30m needs to move closer before shooting. A team that loses possession 60% of the time in midfield needs better passing. Failures are more informative than successes for improvement.',
      codeIntro: 'Build a polo match analytics database and perform coaching analysis.',
      code: `import sqlite3
import numpy as np

db = sqlite3.connect(':memory:')
c = db.cursor()

c.executescript('''
CREATE TABLE players (
    id INTEGER PRIMARY KEY, name TEXT, team TEXT,
    position TEXT, skill_rating REAL
);
CREATE TABLE plays (
    id INTEGER PRIMARY KEY, match_id INTEGER, chukker INTEGER,
    player_id INTEGER, action TEXT, x_pos REAL, y_pos REAL,
    speed REAL, outcome TEXT, timestamp REAL
);
CREATE TABLE goals (
    id INTEGER PRIMARY KEY, play_id INTEGER, scorer_id INTEGER,
    distance REAL, angle_deg REAL, ball_speed REAL
);
''')

np.random.seed(42)

# Teams
teams = {
    'Manipur': [('Tomba', 'forward', 85), ('Ibomcha', 'forward', 80),
                ('Chanu', 'midfield', 78), ('Devi', 'defender', 82)],
    'Assam':   [('Kalita', 'forward', 78), ('Borah', 'forward', 75),
                ('Gogoi', 'midfield', 80), ('Das', 'defender', 77)],
}

for team, players in teams.items():
    for name, pos, skill in players:
        c.execute('INSERT INTO players (name,team,position,skill_rating) VALUES (?,?,?,?)',
                  (name, team, pos, skill))

# Simulate 4 chukkers
field_length, field_width = 275, 145  # metres
play_id = 0

for chukker in range(1, 5):
    for t in range(30):
        # Random player action
        pid = np.random.randint(1, 9)
        c.execute('SELECT name, team, skill_rating FROM players WHERE id=?', (pid,))
        name, team, skill = c.fetchone()

        x = np.random.uniform(0, field_length)
        y = np.random.uniform(0, field_width)
        speed = np.random.uniform(5, 40)
        actions = ['hit', 'pass', 'dribble', 'tackle', 'shot']
        weights = [0.3, 0.25, 0.2, 0.15, 0.1]
        action = np.random.choice(actions, p=weights)

        # Outcome depends on skill and action
        success_prob = skill/100 * (0.8 if action in ('hit','pass') else 0.5 if action == 'shot' else 0.6)
        outcome = 'success' if np.random.random() < success_prob else 'fail'

        play_id += 1
        c.execute('INSERT INTO plays VALUES (?,1,?,?,?,?,?,?,?,?)',
                  (play_id, chukker, pid, action, x, y, speed, outcome, t))

        # Goals from successful shots near goal
        if action == 'shot' and outcome == 'success':
            goal_x = 0 if team == 'Manipur' else field_length
            dist = abs(x - goal_x)
            if dist < 80 and np.random.random() < (1 - dist/100):
                angle = np.degrees(np.arctan2(abs(y - field_width/2), dist))
                c.execute('INSERT INTO goals (play_id,scorer_id,distance,angle_deg,ball_speed) VALUES (?,?,?,?,?)',
                          (play_id, pid, dist, angle, speed))

# Analytics
print("=== Polo Match Analytics ===\\\n")

c.execute('''SELECT p.name, p.team, COUNT(*) as actions,
             SUM(CASE WHEN pl.outcome='success' THEN 1 ELSE 0 END) as successes,
             ROUND(AVG(pl.speed),1) as avg_speed
             FROM players p JOIN plays pl ON p.id=pl.player_id
             GROUP BY p.id ORDER BY successes DESC''')
print(f"{'Player':<12} {'Team':<10} {'Actions':>8} {'Success':>8} {'Rate':>6} {'AvgSpd':>7}")
print("-" * 55)
for row in c.fetchall():
    rate = row[3]/row[2]*100 if row[2] > 0 else 0
    print(f"{row[0]:<12} {row[1]:<10} {row[2]:>8} {row[3]:>8} {rate:>5.0f}% {row[4]:>6.1f}")

c.execute('''SELECT p.name, g.distance, g.angle_deg, g.ball_speed
             FROM goals g JOIN players p ON g.scorer_id=p.id ORDER BY g.distance''')
goals = c.fetchall()
print(f"\\\nGoals scored: {len(goals)}")
for name, dist, angle, speed in goals:
    print(f"  {name}: {dist:.0f}m, {angle:.0f}°, {speed:.0f} m/s")

c.execute("SELECT action, COUNT(*), SUM(CASE WHEN outcome='success' THEN 1 ELSE 0 END) FROM plays GROUP BY action ORDER BY COUNT(*) DESC")
print("\\\nAction breakdown:")
for action, total, success in c.fetchall():
    print(f"  {action:<10}: {total} attempts, {success} success ({success/total*100:.0f}%)")

db.close()`,
      challenge: 'Add a "heat map" query: divide the field into 10x10 grid zones and count successful actions in each zone. Which zones are the most productive?',
      successHint: 'Sports analytics databases are used by every professional sports team. You just built the foundation of a polo analytics platform — the same architecture used in football, cricket, and basketball analytics.',
    },
    {
      title: 'Physics engine — real-time ball trajectory calculator',
      concept: `A **physics engine** calculates ball trajectories in real time, accounting for:
- Initial conditions (speed, angle, spin)
- Air drag (velocity-dependent)
- Ground bouncing (coefficient of restitution)
- Rolling friction (after landing)

The engine stores every trajectory in the database for post-match analysis. It runs the same Euler integration we built earlier, but packaged as a reusable class.

This is how video game engines work — and how real sports analysis tools predict ball paths.`,
      analogy: 'A physics engine is like a crystal ball that uses math instead of magic. Give it the initial conditions (how hard and at what angle the ball was hit), and it predicts exactly where the ball will go — accounting for air, bounce, and friction.',
      storyConnection: 'The story imagines a future where Manipuri polo uses real-time ball tracking and trajectory prediction. The technology is coming — and the physics engine is its core. Every predicted trajectory uses the same equations the students have been learning.',
      checkQuestion: 'Why does a physics engine need to account for bouncing?',
      checkAnswer: 'A polo ball often bounces several times before stopping. Each bounce loses energy (coefficient of restitution < 1) and changes the trajectory. Ignoring bounces would predict the ball stopping at the first landing point — which can be 20-30m short of where it actually ends up after bouncing and rolling.',
      codeIntro: 'Build a polo ball physics engine with drag, bouncing, and rolling.',
      code: `import sqlite3
import numpy as np

db = sqlite3.connect(':memory:')
c = db.cursor()

c.executescript('''
CREATE TABLE trajectories (
    id INTEGER PRIMARY KEY, shot_id INTEGER,
    x REAL, y REAL, z REAL, vx REAL, vy REAL, vz REAL,
    time REAL, phase TEXT
);
CREATE TABLE shot_summary (
    shot_id INTEGER, total_distance REAL, max_height REAL,
    n_bounces INTEGER, final_x REAL, flight_time REAL
);
''')

class PoloBallEngine:
    def __init__(self):
        self.g = 9.8
        self.m = 0.13
        self.r = 0.038
        self.Cd = 0.47
        self.rho = 1.2
        self.A = np.pi * self.r**2
        self.e_bounce = 0.5   # coefficient of restitution for ground
        self.mu_roll = 0.15   # rolling friction
        self.dt = 0.002

    def simulate(self, v0, angle_deg, shot_id=1):
        theta = np.radians(angle_deg)
        vx, vy, vz = v0 * np.cos(theta), 0, v0 * np.sin(theta)
        x, y, z = 0, 0, 0
        t = 0
        bounces = 0
        max_height = 0
        phase = 'flight'
        points = []

        for step in range(50000):
            v = np.sqrt(vx**2 + vy**2 + vz**2)
            if v < 0.1 and z < 0.01:
                break

            if phase == 'flight':
                F_drag = 0.5 * self.Cd * self.rho * self.A * v**2
                if v > 0:
                    ax = -F_drag * vx / (self.m * v)
                    ay = -F_drag * vy / (self.m * v)
                    az = -self.g - F_drag * vz / (self.m * v)
                else:
                    ax, ay, az = 0, 0, -self.g

                vx += ax * self.dt
                vy += ay * self.dt
                vz += az * self.dt
                x += vx * self.dt
                y += vy * self.dt
                z += vz * self.dt

                max_height = max(max_height, z)

                if z <= 0 and vz < 0:
                    z = 0
                    vz = -vz * self.e_bounce
                    vx *= 0.9  # friction on bounce
                    bounces += 1
                    if abs(vz) < 0.5:
                        phase = 'rolling'
                        vz = 0

            elif phase == 'rolling':
                v_ground = np.sqrt(vx**2 + vy**2)
                if v_ground > 0.1:
                    F_friction = self.mu_roll * self.m * self.g
                    ax = -F_friction * vx / (self.m * v_ground)
                    ay = -F_friction * vy / (self.m * v_ground)
                    vx += ax * self.dt
                    vy += ay * self.dt
                    x += vx * self.dt
                    y += vy * self.dt
                else:
                    break

            t += self.dt
            if step % 10 == 0:
                points.append((shot_id, x, y, z, vx, vy, vz, t, phase))

        c.executemany('INSERT INTO trajectories (shot_id,x,y,z,vx,vy,vz,time,phase) VALUES (?,?,?,?,?,?,?,?,?)', points)
        c.execute('INSERT INTO shot_summary VALUES (?,?,?,?,?,?)',
                  (shot_id, x, max_height, bounces, x, t))
        return x, max_height, bounces, t

engine = PoloBallEngine()

print("=== Polo Ball Physics Engine ===\\\n")
print(f"{'Shot':>4} {'Speed':>6} {'Angle':>6} {'Range':>7} {'Height':>7} {'Bounces':>8} {'Time':>6}")
print("-" * 50)

for i, (v0, angle) in enumerate([(25, 15), (30, 20), (35, 25), (40, 30), (30, 45)]):
    dist, height, bounces, time = engine.simulate(v0, angle, i+1)
    print(f"{i+1:>4} {v0:>4}m/s {angle:>4}° {dist:>6.1f}m {height:>6.1f}m {bounces:>8} {time:>5.1f}s")

# Query database for analysis
c.execute('SELECT shot_id, COUNT(*), MAX(z), MAX(x) FROM trajectories GROUP BY shot_id')
print("\\\nTrajectory data stored:")
for sid, points, max_z, max_x in c.fetchall():
    print(f"  Shot {sid}: {points} data points, max height {max_z:.1f}m, distance {max_x:.1f}m")

c.execute('SELECT phase, COUNT(*) FROM trajectories GROUP BY phase')
print("\\\nPhase breakdown:")
for phase, count in c.fetchall():
    print(f"  {phase}: {count} data points")

db.close()`,
      challenge: 'Add spin: a backspin ball bounces higher and shorter, while topspin bounces lower and farther. Modify the bounce logic to account for spin direction.',
      successHint: 'You just built a physics engine — the core technology behind every sports simulation, video game, and motion prediction system. The same architecture powers FIFA, Madden, and real-time sports analytics.',
    },
    {
      title: 'Team strategy optimiser — formation and positioning',
      concept: `Polo team strategy can be optimised using algorithms. Given 4 players per team and a field of 275m x 145m, where should each player be positioned to maximise scoring chances while minimising defensive risk?

This is a **spatial optimisation** problem. We model it by:
1. Defining a scoring probability function (closer to goal = higher probability)
2. Defining a defensive coverage function (positions that block shots)
3. Finding the formation that maximises the difference (offence - defence vulnerability)

We use a **grid search** over possible formations, evaluating each with our scoring model, and store results in SQLite.`,
      analogy: 'Formation optimisation is like arranging security cameras in a building. Each camera covers a cone of vision. You want to position them so no blind spots exist while maximising coverage of high-value areas. Players on a polo field work the same way — each covers a zone.',
      storyConnection: 'The story describes how Manipur\'s traditional "diamond" formation was analysed mathematically and found to be near-optimal. Centuries of tactical evolution had converged on what the algorithm confirms — a beautiful example of human intuition matching mathematical optimisation.',
      checkQuestion: 'Why does polo use 4 players instead of 5 or 6?',
      checkAnswer: 'With fewer players, each must cover more field — increasing the importance of horse speed and riding skill (Manipur\'s strengths). More players would reduce the open space and favour passing over riding. The number 4 creates a balance between individual skill and team coordination. It also keeps the field from being too crowded for galloping horses.',
      codeIntro: 'Optimise polo team formation using spatial analysis and database tracking.',
      code: `import sqlite3
import numpy as np

db = sqlite3.connect(':memory:')
c = db.cursor()

c.executescript('''
CREATE TABLE formations (
    id INTEGER PRIMARY KEY, name TEXT,
    p1_x REAL, p1_y REAL, p2_x REAL, p2_y REAL,
    p3_x REAL, p3_y REAL, p4_x REAL, p4_y REAL,
    offence_score REAL, defence_score REAL, total_score REAL
);
''')

field_L, field_W = 275, 145
goal_x = field_L  # attacking toward right

def scoring_potential(positions):
    """How well can this formation create scoring chances?"""
    score = 0
    for x, y in positions:
        dist_to_goal = np.sqrt((x - goal_x)**2 + (y - field_W/2)**2)
        # Closer to goal = higher scoring potential
        score += max(0, 100 - dist_to_goal * 0.5)
        # Spread bonus (wider formation = harder to defend)
    ys = [p[1] for p in positions]
    spread = max(ys) - min(ys)
    score += spread * 0.3
    return score

def defensive_coverage(positions):
    """How well does this formation cover defensive responsibilities?"""
    score = 0
    for x, y in positions:
        # Coverage of own half
        if x < field_L / 2:
            score += 20
        # Coverage of centre
        dist_to_centre = abs(y - field_W/2)
        score += max(0, 10 - dist_to_centre * 0.1)
    # Depth: spread along x-axis prevents counterattacks
    xs = [p[0] for p in positions]
    depth = max(xs) - min(xs)
    score += depth * 0.2
    return score

# Test formations
formations = {
    'Diamond': [(200, 72), (140, 30), (140, 115), (80, 72)],
    'Line': [(180, 30), (180, 55), (180, 90), (180, 115)],
    'Box': [(180, 40), (180, 105), (100, 40), (100, 105)],
    'Arrow': [(220, 72), (160, 40), (160, 105), (90, 72)],
    'V-Shape': [(120, 72), (170, 30), (170, 115), (220, 72)],
    'Stacked': [(210, 60), (210, 85), (140, 60), (140, 85)],
}

np.random.seed(42)
print("=== Polo Formation Analysis ===\\\n")
print(f"{'Formation':<12} {'Offence':>8} {'Defence':>8} {'Total':>7}")
print("-" * 38)

best_total = 0
best_name = ''

for name, positions in formations.items():
    off = scoring_potential(positions)
    defe = defensive_coverage(positions)
    total = off * 0.6 + defe * 0.4  # weight offence slightly more

    p = positions
    c.execute('INSERT INTO formations (name,p1_x,p1_y,p2_x,p2_y,p3_x,p3_y,p4_x,p4_y,offence_score,defence_score,total_score) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
              (name, p[0][0],p[0][1], p[1][0],p[1][1], p[2][0],p[2][1], p[3][0],p[3][1], off, defe, total))

    print(f"{name:<12} {off:>7.1f} {defe:>7.1f} {total:>6.1f}")

    if total > best_total:
        best_total = total
        best_name = name

print(f"\\\nOptimal formation: {best_name} (score: {best_total:.1f})")

# Monte Carlo improvement: random perturbations of the best
best_positions = list(formations[best_name])
improved_score = best_total

for trial in range(1000):
    perturbed = [(x + np.random.normal(0, 15), np.clip(y + np.random.normal(0, 10), 10, 135))
                 for x, y in best_positions]
    perturbed = [(np.clip(x, 20, 250), y) for x, y in perturbed]
    off = scoring_potential(perturbed)
    defe = defensive_coverage(perturbed)
    total = off * 0.6 + defe * 0.4
    if total > improved_score:
        improved_score = total
        best_positions = perturbed

print(f"\\\nAfter 1000 random improvements:")
print(f"  Score: {best_total:.1f} → {improved_score:.1f} (+{(improved_score-best_total)/best_total*100:.1f}%)")
print(f"  Optimal positions:")
for i, (x, y) in enumerate(best_positions):
    role = ['Forward', 'Wing L', 'Wing R', 'Defender'][i]
    print(f"    {role}: ({x:.0f}, {y:.0f})")

db.close()`,
      challenge: 'Add opponent positions and model the interaction: a defender near an attacker reduces scoring potential. Find the formation that maximises score against a specific defensive setup.',
      successHint: 'Spatial optimisation is used in military strategy, logistics, network design, and sports analytics. You just built a tactical analysis tool for one of the world\'s oldest team sports.',
    },
    {
      title: 'Complete match simulation — the full polo engine',
      concept: `The capstone integrates all components into a complete polo match simulator:
- Physics engine (ball trajectories with drag and bounce)
- Player models (skill, speed, positioning)
- Strategy AI (formation, shot selection)
- Database logging (every play tracked)
- Statistical analysis (post-match report)

This is a production-quality sports simulation framework — the same architecture used by professional sports analytics companies.`,
      analogy: 'The complete match simulator is like a movie director creating a film. The physics engine provides the set and props (how balls and horses move). The player AI provides the actors (what decisions they make). The database provides the script supervisor (tracking every take). The analysis provides the editor (making sense of it all).',
      storyConnection: 'The story ends with a dream: that one day, young Manipuri polo players will train with simulations — practising thousands of matches before stepping onto the field. Our simulator makes this dream technically possible. The birthplace of polo could become the birthplace of polo analytics.',
      checkQuestion: 'What is the most important validation test for a match simulator?',
      checkAnswer: 'Compare simulated statistics (goals per match, shot accuracy, possession time) against real match data. If the simulation produces 15 goals per match when real matches average 8, the model is wrong. Statistical validation against real data is the gold standard for any simulation.',
      codeIntro: 'Run a complete polo match simulation with all systems integrated.',
      code: `import sqlite3
import numpy as np

db = sqlite3.connect(':memory:')
c = db.cursor()

c.executescript('''
CREATE TABLE match_info (id INTEGER PRIMARY KEY, team_a TEXT, team_b TEXT, venue TEXT);
CREATE TABLE match_plays (
    id INTEGER PRIMARY KEY, chukker INTEGER, time_s REAL,
    team TEXT, player TEXT, action TEXT,
    ball_x REAL, ball_y REAL, ball_speed REAL,
    outcome TEXT, goal INTEGER DEFAULT 0
);
CREATE TABLE match_stats (team TEXT, stat TEXT, value REAL);
''')

np.random.seed(42)
c.execute("INSERT INTO match_info VALUES (1, 'Manipur XI', 'Bengal XI', 'Imphal Polo Ground')")

class Player:
    def __init__(self, name, team, skill, speed):
        self.name = name
        self.team = team
        self.skill = skill
        self.speed = speed

teams = {
    'Manipur XI': [Player('Tomba', 'Manipur XI', 85, 12),
                   Player('Ibomcha', 'Manipur XI', 80, 11),
                   Player('Chanu', 'Manipur XI', 78, 13),
                   Player('Sanatombi', 'Manipur XI', 82, 11)],
    'Bengal XI':  [Player('Roy', 'Bengal XI', 80, 11),
                   Player('Sen', 'Bengal XI', 76, 12),
                   Player('Ghosh', 'Bengal XI', 79, 10),
                   Player('Dutta', 'Bengal XI', 75, 11)],
}

field_L, field_W = 275, 145
score = {'Manipur XI': 0, 'Bengal XI': 0}
stats = {'Manipur XI': {'shots': 0, 'hits': 0, 'passes': 0, 'possession': 0},
         'Bengal XI':  {'shots': 0, 'hits': 0, 'passes': 0, 'possession': 0}}

play_id = 0
ball_x, ball_y = field_L/2, field_W/2
possession_team = 'Manipur XI'

print("=== Sagol Kangjei — Full Match Simulation ===")
print(f"Manipur XI vs Bengal XI at Imphal Polo Ground\\\n")

for chukker in range(1, 5):
    chukker_goals_a, chukker_goals_b = 0, 0

    for t in range(60):  # 60 time steps per chukker
        time_s = (chukker - 1) * 420 + t * 7  # ~7 min chukkers

        # Select active player
        team_players = teams[possession_team]
        player = team_players[np.random.randint(len(team_players))]
        stats[possession_team]['possession'] += 1

        # Decide action based on position
        goal_x = field_L if possession_team == 'Manipur XI' else 0
        dist_to_goal = abs(ball_x - goal_x)

        if dist_to_goal < 50 and np.random.random() < 0.4:
            action = 'shot'
            stats[possession_team]['shots'] += 1
        elif np.random.random() < 0.5:
            action = 'hit'
            stats[possession_team]['hits'] += 1
        else:
            action = 'pass'
            stats[possession_team]['passes'] += 1

        # Outcome
        success_prob = player.skill / 100 * (0.7 if action == 'hit' else 0.4 if action == 'shot' else 0.65)
        outcome = 'success' if np.random.random() < success_prob else 'turnover'

        goal = 0
        if action == 'shot' and outcome == 'success':
            goal_prob = max(0, (80 - dist_to_goal) / 100) * player.skill / 100
            if np.random.random() < goal_prob:
                goal = 1
                score[possession_team] += 1
                if possession_team == 'Manipur XI':
                    chukker_goals_a += 1
                else:
                    chukker_goals_b += 1

        # Update ball position
        if outcome == 'success':
            move = player.speed * np.random.uniform(2, 8)
            direction = 1 if goal_x == field_L else -1
            ball_x = np.clip(ball_x + direction * move * np.random.uniform(0.5, 1.5), 0, field_L)
            ball_y = np.clip(ball_y + np.random.normal(0, 15), 0, field_W)
            ball_speed = np.random.uniform(15, 40)
        else:
            possession_team = 'Bengal XI' if possession_team == 'Manipur XI' else 'Manipur XI'
            ball_speed = np.random.uniform(5, 15)

        play_id += 1
        c.execute('INSERT INTO match_plays VALUES (?,?,?,?,?,?,?,?,?,?,?)',
                  (play_id, chukker, time_s, possession_team, player.name,
                   action, ball_x, ball_y, ball_speed, outcome, goal))

    print(f"Chukker {chukker}: Manipur {score['Manipur XI']} - {score['Bengal XI']} Bengal"
          f"  (this chukker: {chukker_goals_a}-{chukker_goals_b})")

# Store stats
for team, team_stats in stats.items():
    for stat, value in team_stats.items():
        c.execute('INSERT INTO match_stats VALUES (?,?,?)', (team, stat, value))

print(f"\\\n{'='*40}")
print(f"FINAL: Manipur XI {score['Manipur XI']} - {score['Bengal XI']} Bengal XI")
print(f"{'='*40}")

# Post-match analysis
print("\\\n--- Match Statistics ---")
c.execute('SELECT team, stat, value FROM match_stats ORDER BY team, stat')
current_team = ''
for team, stat, value in c.fetchall():
    if team != current_team:
        print(f"\\\n  {team}:")
        current_team = team
    print(f"    {stat}: {value:.0f}")

c.execute('''SELECT player, team, COUNT(*) as actions,
             SUM(CASE WHEN outcome='success' THEN 1 ELSE 0 END) as successes,
             SUM(goal) as goals
             FROM match_plays GROUP BY player ORDER BY goals DESC, successes DESC''')
print("\\\n--- Player Performance ---")
print(f"{'Player':<12} {'Team':<12} {'Actions':>8} {'Success%':>9} {'Goals':>6}")
for name, team, actions, succ, goals in c.fetchall():
    print(f"{name:<12} {team:<12} {actions:>8} {succ/actions*100:>8.0f}% {goals:>6}")

c.execute('''SELECT action, COUNT(*), SUM(goal), ROUND(AVG(ball_speed),1)
             FROM match_plays WHERE action='shot' GROUP BY team''')
print("\\\n--- Shooting Analysis ---")
for row in c.fetchall():
    print(f"  {row[0]}: {row[1]} shots, {row[2]} goals ({row[2]/row[1]*100:.0f}% conversion), avg speed {row[3]} m/s")

db.close()`,
      challenge: 'Run 100 matches and build a win probability model. What is each team\'s true win percentage? Does the team with higher average skill always win?',
      successHint: 'You have built a complete sports simulation engine — from physics to strategy to data analytics. This is the capstone of computational sports science, applied to the world\'s oldest equestrian sport, born in Manipur.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Sports Analytics & Simulation</span>
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
