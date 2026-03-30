#!/usr/bin/env python3
"""
Fix learningTracks and toolSkills assignments for all 109 stories.
Uses explicit mapping based on stem title → what tools students use to learn it.
"""
import re

# [SAME MAPPINGS as before - abbreviated for clarity in the file]
STEM_MAP = {
    'tracking': (['AI & Data', 'Programming'], ['Python', 'NumPy', 'Data Analysis', 'Machine Learning', 'Matplotlib']),
    'citizen science': (['AI & Data', 'Programming'], ['Python', 'Data Analysis', 'Matplotlib']),
    'data collection': (['AI & Data', 'Programming'], ['Python', 'Data Analysis', 'Matplotlib']),
    'classification': (['AI & Data', 'Programming'], ['Python', 'Machine Learning', 'Data Analysis']),
    'taxonomy': (['AI & Data', 'Programming'], ['Python', 'Machine Learning', 'Data Analysis']),
    'neuroscience': (['AI & Data', 'Science & Lab'], ['Python', 'Data Analysis', 'Matplotlib']),
    'memory': (['AI & Data', 'Science & Lab'], ['Python', 'Data Analysis', 'Matplotlib']),
    'pattern': (['AI & Data', 'Programming'], ['Python', 'NumPy', 'Matplotlib']),
    'genetics': (['AI & Data', 'Science & Lab'], ['Python', 'Data Analysis', 'Machine Learning']),
    'morphology': (['AI & Data', 'Science & Lab'], ['Python', 'Data Analysis', 'Machine Learning']),
    'genetic': (['AI & Data', 'Science & Lab'], ['Python', 'Data Analysis', 'Machine Learning']),
    'species identity': (['AI & Data', 'Science & Lab'], ['Python', 'Data Analysis', 'Machine Learning']),
    'cloud seeding': (['AI & Data', 'Science & Lab'], ['Python', 'Data Analysis', 'Matplotlib']),
    'climate': (['AI & Data', 'Science & Lab'], ['Python', 'Data Analysis', 'Matplotlib']),
    'jet stream': (['AI & Data', 'Science & Lab'], ['Python', 'Data Analysis', 'Matplotlib']),
    'fire cycle': (['AI & Data', 'Science & Lab'], ['Python', 'Data Analysis', 'Matplotlib']),
    'carbon sequestration': (['AI & Data', 'Science & Lab'], ['Python', 'Data Analysis', 'Matplotlib']),
    'conservation': (['AI & Data', 'Science & Lab'], ['Python', 'Data Analysis', 'Machine Learning']),
    'wildlife corridor': (['AI & Data', 'Science & Lab'], ['Python', 'Data Analysis', 'Machine Learning']),
    'sustainable': (['AI & Data', 'Science & Lab'], ['Python', 'Data Analysis', 'Matplotlib']),
    'bioluminescence': (['Robotics & Electronics', 'Science & Lab'], ['Arduino', 'Circuit Design', 'Python']),
    'energy & light': (['Robotics & Electronics', 'Science & Lab'], ['Arduino', 'Circuit Design', 'Python']),
    'light technology': (['Robotics & Electronics', 'Science & Lab'], ['Arduino', 'Circuit Design', 'Python']),
    'sonar': (['Robotics & Electronics', 'AI & Data'], ['Arduino', 'Circuit Design', 'Python', 'Data Analysis']),
    'sensor': (['Robotics & Electronics', 'Programming'], ['Arduino', 'Circuit Design', 'Python']),
    'thermoregulation': (['Robotics & Electronics', 'Science & Lab'], ['Arduino', 'Circuit Design', 'Python']),
    'mechanical engineering': (['Robotics & Electronics', 'Science & Lab'], ['Arduino', 'Circuit Design', 'Python']),
    'railway': (['Robotics & Electronics', 'Science & Lab'], ['Arduino', 'Circuit Design', 'Python']),
    'bridge engineering': (['Robotics & Electronics', 'Science & Lab'], ['Arduino', 'Circuit Design', 'Python']),
    'nanostructure': (['Robotics & Electronics', 'Science & Lab'], ['Arduino', 'Circuit Design', 'Python']),
    'structural color': (['Robotics & Electronics', 'Science & Lab'], ['Arduino', 'Circuit Design', 'Python']),
    'heat transfer': (['Robotics & Electronics', 'Science & Lab'], ['Arduino', 'Circuit Design', 'Python']),
    'thermal': (['Robotics & Electronics', 'Science & Lab'], ['Arduino', 'Circuit Design', 'Python']),
    'night vision': (['Robotics & Electronics', 'Science & Lab'], ['Arduino', 'Circuit Design', 'Python']),
    'fishing technology': (['Robotics & Electronics', 'Science & Lab'], ['Arduino', 'Circuit Design', 'Python']),
    'paper engineering': (['Robotics & Electronics', 'Science & Lab'], ['Arduino', 'Circuit Design', 'Python']),
    'gis': (['Web Development', 'Programming'], ['JavaScript', 'HTML/CSS', 'Python']),
    'cartography': (['Web Development', 'Programming'], ['JavaScript', 'HTML/CSS', 'Python']),
    'geography & map': (['Web Development', 'Programming'], ['JavaScript', 'HTML/CSS', 'Python']),
    'urban geography': (['Web Development', 'Programming'], ['JavaScript', 'HTML/CSS', 'Python']),
    'etymology': (['Web Development', 'Programming'], ['JavaScript', 'HTML/CSS', 'Python']),
    'economics': (['Web Development', 'Programming'], ['JavaScript', 'HTML/CSS', 'Python', 'Data Analysis']),
    'market': (['Web Development', 'Programming'], ['JavaScript', 'HTML/CSS', 'Python', 'Data Analysis']),
    'trade': (['Web Development', 'Programming'], ['JavaScript', 'HTML/CSS', 'Python', 'Data Analysis']),
    'supply chain': (['Web Development', 'Programming'], ['JavaScript', 'HTML/CSS', 'Python', 'Data Analysis']),
    'logistics': (['Web Development', 'Programming'], ['JavaScript', 'HTML/CSS', 'Python']),
    'optimization': (['Web Development', 'Programming'], ['JavaScript', 'HTML/CSS', 'Python']),
    'archaeology': (['Web Development', 'Science & Lab'], ['JavaScript', 'HTML/CSS', 'Python']),
    'dating method': (['Web Development', 'Science & Lab'], ['JavaScript', 'HTML/CSS', 'Python']),
    'storytelling': (['Web Development', 'Programming'], ['JavaScript', 'HTML/CSS']),
    'narrative': (['Web Development', 'Programming'], ['JavaScript', 'HTML/CSS']),
    'language': (['Web Development', 'AI & Data'], ['JavaScript', 'HTML/CSS', 'Python']),
    'communication': (['Web Development', 'Science & Lab'], ['JavaScript', 'HTML/CSS', 'Python']),
    'aerodynamics': (['Programming', 'Science & Lab'], ['Python', 'NumPy', 'Matplotlib']),
    'gliding': (['Programming', 'Science & Lab'], ['Python', 'NumPy', 'Matplotlib']),
    'flight': (['Programming', 'Science & Lab'], ['Python', 'NumPy', 'Matplotlib']),
    'fluid': (['Programming', 'Science & Lab'], ['Python', 'NumPy', 'Matplotlib']),
    'buoyancy': (['Programming', 'Science & Lab'], ['Python', 'NumPy', 'Matplotlib']),
    'biomechanics': (['Programming', 'Science & Lab'], ['Python', 'NumPy', 'Matplotlib']),
    'speed': (['Programming', 'Science & Lab'], ['Python', 'NumPy', 'Matplotlib']),
    'acceleration': (['Programming', 'Science & Lab'], ['Python', 'NumPy', 'Matplotlib']),
    'resonance': (['Programming', 'Science & Lab'], ['Python', 'NumPy', 'Matplotlib']),
    'harmonics': (['Programming', 'Science & Lab'], ['Python', 'NumPy', 'Matplotlib']),
    'vibration': (['Programming', 'Science & Lab'], ['Python', 'NumPy', 'Matplotlib']),
    'percussion': (['Programming', 'Science & Lab'], ['Python', 'NumPy', 'Matplotlib']),
    'music theory': (['Programming', 'Science & Lab'], ['Python', 'NumPy', 'Matplotlib']),
    'acoustic': (['Programming', 'Science & Lab'], ['Python', 'NumPy', 'Matplotlib']),
    'sound': (['Programming', 'Science & Lab'], ['Python', 'NumPy', 'Matplotlib']),
    'optics': (['Programming', 'Science & Lab'], ['Python', 'NumPy', 'Matplotlib']),
    'scattering': (['Programming', 'Science & Lab'], ['Python', 'NumPy', 'Matplotlib']),
    'iridescence': (['Programming', 'Science & Lab'], ['Python', 'NumPy', 'Matplotlib']),
    'color science': (['Programming', 'Science & Lab'], ['Python', 'NumPy', 'Matplotlib']),
    'pigment': (['Programming', 'Science & Lab'], ['Python', 'NumPy', 'Matplotlib']),
    'dye': (['Programming', 'Science & Lab'], ['Python', 'NumPy', 'Matplotlib']),
    'mathematics': (['Programming', 'Science & Lab'], ['Python', 'NumPy', 'Matplotlib']),
    'weaving': (['Programming', 'Science & Lab'], ['Python', 'NumPy', 'Matplotlib']),
    'geometry': (['Programming', 'Science & Lab'], ['Python', 'NumPy', 'Matplotlib']),
    'astronomy': (['Programming', 'Science & Lab'], ['Python', 'NumPy', 'Matplotlib', 'Data Analysis']),
    'light pollution': (['Programming', 'Science & Lab'], ['Python', 'NumPy', 'Matplotlib', 'Data Analysis']),
    'meteorite': (['Programming', 'Science & Lab'], ['Python', 'NumPy', 'Matplotlib']),
    'erosion': (['Programming', 'Science & Lab'], ['Python', 'NumPy', 'Matplotlib']),
    'geomorphology': (['Programming', 'Science & Lab'], ['Python', 'NumPy', 'Matplotlib']),
    'plate tectonic': (['Programming', 'Science & Lab'], ['Python', 'NumPy', 'Matplotlib']),
    'geology': (['Programming', 'Science & Lab'], ['Python', 'NumPy', 'Matplotlib']),
    'storm': (['Programming', 'AI & Data'], ['Python', 'NumPy', 'Matplotlib', 'Data Analysis']),
    'altitude': (['Programming', 'Science & Lab'], ['Python', 'NumPy', 'Matplotlib']),
    'mountain physics': (['Programming', 'Science & Lab'], ['Python', 'NumPy', 'Matplotlib']),
    'biology': (['Science & Lab'], ['Python', 'Lab Skills']),
    'longevity': (['Science & Lab'], ['Python', 'Lab Skills']),
    'anatomy': (['Science & Lab'], ['Python', 'Lab Skills']),
    'sensory': (['Science & Lab', 'AI & Data'], ['Python', 'Lab Skills', 'Data Analysis']),
    'entomology': (['Science & Lab'], ['Python', 'Lab Skills']),
    'bee': (['Science & Lab'], ['Python', 'Lab Skills']),
    'pollination': (['Science & Lab'], ['Python', 'Lab Skills']),
    'carnivorous': (['Science & Lab'], ['Python', 'Lab Skills']),
    'adaptation': (['Science & Lab'], ['Python', 'Lab Skills']),
    'plant growth': (['Science & Lab'], ['Python', 'Lab Skills', 'Matplotlib']),
    'cell biology': (['Science & Lab'], ['Python', 'Lab Skills', 'Matplotlib']),
    'hormone': (['Science & Lab'], ['Python', 'Lab Skills']),
    'wood science': (['Science & Lab'], ['Python', 'Lab Skills']),
    'material': (['Science & Lab', 'Robotics & Electronics'], ['Python', 'Lab Skills']),
    'ceramics': (['Science & Lab'], ['Python', 'Lab Skills']),
    'amphibian': (['Science & Lab'], ['Python', 'Lab Skills']),
    'ornithology': (['Science & Lab'], ['Python', 'Lab Skills']),
    'evolution': (['Science & Lab', 'AI & Data'], ['Python', 'Lab Skills', 'Data Analysis']),
    'camouflage': (['Science & Lab', 'AI & Data'], ['Python', 'Lab Skills', 'Data Analysis']),
    'domestication': (['Science & Lab'], ['Python', 'Lab Skills']),
    'breeding': (['Science & Lab', 'AI & Data'], ['Python', 'Lab Skills', 'Data Analysis']),
    'circadian': (['Science & Lab'], ['Python', 'Lab Skills', 'Matplotlib']),
    'dispersal': (['Science & Lab'], ['Python', 'Lab Skills']),
    'seed bank': (['Science & Lab', 'AI & Data'], ['Python', 'Lab Skills', 'Data Analysis']),
    'preservation': (['Science & Lab', 'AI & Data'], ['Python', 'Lab Skills', 'Data Analysis']),
    'food science': (['Science & Lab'], ['Python', 'Lab Skills']),
    'cooking': (['Science & Lab'], ['Python', 'Lab Skills']),
    'food chemistry': (['Science & Lab'], ['Python', 'Lab Skills']),
    'silk': (['Science & Lab'], ['Python', 'Lab Skills']),
    'textile': (['Science & Lab'], ['Python', 'Lab Skills']),
    'botany': (['Science & Lab'], ['Python', 'Lab Skills']),
    'aquatic': (['Science & Lab'], ['Python', 'Lab Skills']),
    'epiphyte': (['Science & Lab'], ['Python', 'Lab Skills']),
    'symbiosis': (['Science & Lab'], ['Python', 'Lab Skills']),
    'agriculture': (['Science & Lab'], ['Python', 'Lab Skills']),
    'crop': (['Science & Lab'], ['Python', 'Lab Skills']),
    'reforestation': (['Science & Lab', 'AI & Data'], ['Python', 'Lab Skills', 'Data Analysis']),
    'medicin': (['Science & Lab'], ['Python', 'Lab Skills']),
    'pharmac': (['Science & Lab'], ['Python', 'Lab Skills']),
    'primatology': (['Science & Lab'], ['Python', 'Lab Skills']),
    'canopy': (['Science & Lab'], ['Python', 'Lab Skills']),
    'animal behavior': (['Science & Lab'], ['Python', 'Lab Skills']),
    'signaling': (['Science & Lab', 'AI & Data'], ['Python', 'Lab Skills', 'Data Analysis']),
    'fish biology': (['Science & Lab'], ['Python', 'Lab Skills']),
    'aquatic ecosystem': (['Science & Lab'], ['Python', 'Lab Skills']),
    'grassland ecology': (['Science & Lab', 'AI & Data'], ['Python', 'Lab Skills', 'Data Analysis']),
}

SLUG_OVERRIDES = {
    'girl-who-spoke-to-elephants': (['AI & Data', 'Programming'], ['Python', 'NumPy', 'Data Analysis', 'Machine Learning', 'Matplotlib']),
    'firefly-festival-of-majuli': (['Robotics & Electronics', 'Science & Lab'], ['Arduino', 'Circuit Design', 'Python']),
    'river-dolphins-secret': (['Robotics & Electronics', 'AI & Data'], ['Arduino', 'Circuit Design', 'Python', 'Data Analysis']),
    'boy-who-built-a-library': (['Web Development', 'Programming'], ['JavaScript', 'HTML/CSS', 'Python']),
    'dragonfly-and-the-paddy-field': (['AI & Data', 'Programming'], ['Python', 'Machine Learning', 'NumPy', 'Matplotlib', 'Data Analysis']),
    'why-the-muga-silk-is-golden': (['Science & Lab', 'Programming'], ['Python', 'Lab Skills', 'Matplotlib']),
    'tejimola-the-girl-who-became-a-plant': (['Science & Lab', 'Programming'], ['Python', 'Lab Skills', 'Matplotlib']),
    'golden-deer-of-kamakhya': (['AI & Data', 'Science & Lab'], ['Python', 'Data Analysis', 'Machine Learning', 'Matplotlib']),
    'boy-who-talked-to-clouds': (['AI & Data', 'Programming'], ['Python', 'Data Analysis', 'Matplotlib', 'NumPy']),
    'how-majuli-island-was-born': (['Programming', 'Science & Lab'], ['Python', 'NumPy', 'Matplotlib']),
    'bamboo-flute-of-nagaland': (['Programming', 'Science & Lab'], ['Python', 'NumPy', 'Matplotlib']),
    'dancing-deer-of-loktak-lake': (['AI & Data', 'Science & Lab'], ['Python', 'Data Analysis', 'Machine Learning']),
    'bridge-that-grew': (['Robotics & Electronics', 'Science & Lab'], ['Arduino', 'Circuit Design', 'Python']),
}

with open('src/data/lessons.ts', 'r') as f:
    content = f.read()

# Find ALL slug positions
slug_positions = [(m.group(1), m.start()) for m in re.finditer(r"slug:\s*'([^']+)'", content)]

print(f"Found {len(slug_positions)} stories\n")

# For each entry, find its boundary (next slug position or end of file)
track_counts = {}
skill_counts = {}

# Work BACKWARDS to avoid position shifts
replacements = []  # (start, end, new_text) tuples

for i, (slug, pos) in enumerate(slug_positions):
    # Boundary: next slug or end of file
    if i + 1 < len(slug_positions):
        boundary = slug_positions[i + 1][1]
    else:
        boundary = len(content)

    entry_text = content[pos:boundary]

    # Find stem title
    stem_match = re.search(r"stem:\s*\{[^}]*?title:\s*'([^']*?)'", entry_text)
    stem_title = stem_match.group(1).lower() if stem_match else ''

    # Determine tracks and skills
    if slug in SLUG_OVERRIDES:
        tracks, skills = SLUG_OVERRIDES[slug]
    else:
        best_tracks = set()
        best_skills = set()
        for keyword, (t, s) in STEM_MAP.items():
            if keyword in stem_title:
                best_tracks.update(t)
                best_skills.update(s)
        if not best_tracks:
            best_tracks = {'Science & Lab', 'Programming'}
            best_skills = {'Python', 'Lab Skills'}
        tracks = sorted(best_tracks)
        skills = sorted(best_skills)

    for t in tracks:
        track_counts[t] = track_counts.get(t, 0) + 1
    for s in skills:
        skill_counts[s] = skill_counts.get(s, 0) + 1

    tracks_str = ', '.join(f"'{t}' as Track" for t in tracks)
    skills_str = ', '.join(f"'{s}' as Skill" for s in skills)

    # Find and queue replacements within this entry only
    lt_match = re.search(r"learningTracks:\s*\[[^\]]*\]", entry_text)
    ts_match = re.search(r"toolSkills:\s*\[[^\]]*\]", entry_text)

    if lt_match:
        abs_start = pos + lt_match.start()
        abs_end = pos + lt_match.end()
        replacements.append((abs_start, abs_end, f"learningTracks: [{tracks_str}]"))

    if ts_match:
        abs_start = pos + ts_match.start()
        abs_end = pos + ts_match.end()
        replacements.append((abs_start, abs_end, f"toolSkills: [{skills_str}]"))

# Sort by position descending and apply
replacements.sort(key=lambda x: x[0], reverse=True)
for start, end, new_text in replacements:
    content = content[:start] + new_text + content[end:]

print("Track distribution:")
for t in ['Programming', 'AI & Data', 'Robotics & Electronics', 'Web Development', 'Science & Lab']:
    print(f"  {t}: {track_counts.get(t, 0)}")

print("\nSkill distribution:")
for s in sorted(skill_counts.keys()):
    print(f"  {s}: {skill_counts[s]}")

with open('src/data/lessons.ts', 'w') as f:
    f.write(content)

# Verify by re-reading
with open('src/data/lessons.ts') as f:
    verify = f.read()
print("\nVerification (actual counts in file):")
for t in ['Programming', 'AI & Data', 'Robotics & Electronics', 'Web Development', 'Science & Lab']:
    count = verify.count(f"'{t}' as Track")
    print(f"  {t}: {count}")

print("\nDone!")
