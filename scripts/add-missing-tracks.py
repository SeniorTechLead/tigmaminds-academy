#!/usr/bin/env python3
"""Add toolSkills and learningTracks to the 19 compact entries that lack them."""
import re

STEM_MAP = {
    'language': (['Web Development', 'AI & Data'], ['JavaScript', 'HTML/CSS', 'Python']),
    'communication': (['Web Development', 'AI & Data'], ['JavaScript', 'HTML/CSS', 'Python']),
    'botany': (['Science & Lab'], ['Python', 'Lab Skills']),
    'aquatic': (['Science & Lab'], ['Python', 'Lab Skills']),
    'light pollution': (['Programming', 'Science & Lab'], ['Python', 'NumPy', 'Matplotlib', 'Data Analysis']),
    'astronomy': (['Programming', 'Science & Lab'], ['Python', 'NumPy', 'Matplotlib', 'Data Analysis']),
    'fishing technology': (['Robotics & Electronics', 'Science & Lab'], ['Arduino', 'Circuit Design', 'Python']),
    'genetics': (['AI & Data', 'Science & Lab'], ['Python', 'Data Analysis', 'Machine Learning']),
    'species identity': (['AI & Data', 'Science & Lab'], ['Python', 'Data Analysis', 'Machine Learning']),
    'paper engineering': (['Robotics & Electronics', 'Science & Lab'], ['Arduino', 'Circuit Design', 'Python']),
    'medicin': (['Science & Lab'], ['Python', 'Lab Skills']),
    'pharmac': (['Science & Lab'], ['Python', 'Lab Skills']),
    'evolution': (['Science & Lab', 'AI & Data'], ['Python', 'Lab Skills', 'Data Analysis']),
    'body plan': (['Science & Lab', 'AI & Data'], ['Python', 'Lab Skills', 'Data Analysis']),
    'economics': (['Web Development', 'Programming'], ['JavaScript', 'HTML/CSS', 'Python', 'Data Analysis']),
    'trade': (['Web Development', 'Programming'], ['JavaScript', 'HTML/CSS', 'Python', 'Data Analysis']),
    'market': (['Web Development', 'Programming'], ['JavaScript', 'HTML/CSS', 'Python', 'Data Analysis']),
    'wildlife corridor': (['AI & Data', 'Science & Lab'], ['Python', 'Data Analysis', 'Machine Learning']),
    'sustainable': (['AI & Data', 'Science & Lab'], ['Python', 'Data Analysis', 'Matplotlib']),
    'cloud seeding': (['AI & Data', 'Science & Lab'], ['Python', 'Data Analysis', 'Matplotlib']),
    'weather': (['AI & Data', 'Programming'], ['Python', 'Data Analysis', 'Matplotlib']),
    'bridge engineering': (['Robotics & Electronics', 'Science & Lab'], ['Arduino', 'Circuit Design', 'Python']),
    'sound': (['Programming', 'Science & Lab'], ['Python', 'NumPy', 'Matplotlib']),
    'reflection': (['Programming', 'Science & Lab'], ['Python', 'NumPy', 'Matplotlib']),
    'fluid': (['Programming', 'Science & Lab'], ['Python', 'NumPy', 'Matplotlib']),
    'mechanic': (['Programming', 'Science & Lab'], ['Python', 'NumPy', 'Matplotlib']),
    'epiphyte': (['Science & Lab'], ['Python', 'Lab Skills']),
    'symbiosis': (['Science & Lab'], ['Python', 'Lab Skills']),
    'urban geography': (['Web Development', 'Programming'], ['JavaScript', 'HTML/CSS', 'Python']),
    'etymology': (['Web Development', 'Programming'], ['JavaScript', 'HTML/CSS', 'Python']),
    'storytelling': (['Web Development', 'Programming'], ['JavaScript', 'HTML/CSS']),
    'narrative': (['Web Development', 'Programming'], ['JavaScript', 'HTML/CSS']),
}

with open('src/data/lessons.ts', 'r') as f:
    content = f.read()

slug_positions = [(m.group(1), m.start()) for m in re.finditer(r"slug:\s*'([^']+)'", content)]

# Find entries missing learningTracks, add fields after 'subjects' line
additions = []  # (position_to_insert, text_to_insert)

for i, (slug, pos) in enumerate(slug_positions):
    boundary = slug_positions[i+1][1] if i+1 < len(slug_positions) else len(content)
    entry = content[pos:boundary]

    if 'learningTracks' in entry:
        continue

    # Find stem title
    stem_match = re.search(r"stem:\s*\{[^}]*?title:\s*'([^']*?)'", entry)
    stem = stem_match.group(1).lower() if stem_match else ''

    # Determine tracks/skills
    best_tracks = set()
    best_skills = set()
    for keyword, (t, s) in STEM_MAP.items():
        if keyword in stem:
            best_tracks.update(t)
            best_skills.update(s)
    if not best_tracks:
        best_tracks = {'Science & Lab', 'Programming'}
        best_skills = {'Python', 'Lab Skills'}

    tracks = sorted(best_tracks)
    skills = sorted(best_skills)
    tracks_str = ', '.join(f"'{t}' as Track" for t in tracks)
    skills_str = ', '.join(f"'{s}' as Skill" for s in skills)

    # Find 'subjects:' line and insert after it (or after estimatedHours)
    # These compact entries have format: subjects: [...], estimatedHours: 12, playground: '...' as const,
    # Insert toolSkills and learningTracks after subjects
    subj_match = re.search(r"subjects:\s*\[[^\]]*\]", entry)
    if subj_match:
        insert_pos = pos + subj_match.end()
        insert_text = f",\n    toolSkills: [{skills_str}],\n    learningTracks: [{tracks_str}]"
        additions.append((insert_pos, insert_text))
        print(f"  {slug}: {tracks} (stem: {stem[:40]})")

# Apply additions backwards
additions.sort(key=lambda x: x[0], reverse=True)
for insert_pos, insert_text in additions:
    content = content[:insert_pos] + insert_text + content[insert_pos:]

with open('src/data/lessons.ts', 'w') as f:
    f.write(content)

print(f"\nAdded fields to {len(additions)} entries")

# Verify
with open('src/data/lessons.ts') as f:
    verify = f.read()
print("\nFinal track counts in file:")
for t in ['Programming', 'AI & Data', 'Robotics & Electronics', 'Web Development', 'Science & Lab']:
    count = verify.count(f"'{t}' as Track")
    print(f"  {t}: {count}")
