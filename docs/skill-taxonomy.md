# Skill Taxonomy & Filter System

The lessons index page (`/lessons`) has two filter tabs: **By Subject** and **By Skill**. This document covers the **By Skill** hierarchical filter — how it works, what the data looks like, and how to tag new lessons.

---

## The hierarchy

```
Level 1: Discipline    → 5 top-level pills (Programming, Data Science, AI & ML, Scientific Modeling, Electronics)
  Level 2: Skill       → what you learn to do (e.g., Data Analysis, Physics simulation)
    Level 3: Tool      → the specific library or sub-domain (e.g., Pandas, Matplotlib, Optics & light)
```

L3 only appears in the UI when a skill has **2+ tools with lessons**. If there's only one tool, clicking L2 is the final filter.

---

## Current state (130 lessons tagged)

### 1. Programming (130 lessons)

Nearly every lesson uses Python, so this discipline is broad.

| Skill | Tools | Lesson count |
|---|---|---|
| Python | Python 3 | 129 |
| Web Development | HTML/CSS, JavaScript, TypeScript | 1 (Library) |
| Databases | SQL, Data modeling | 1 (Library) |

### 2. Data Science (30 lessons)

Tools are **actual Python libraries** — what students import and use.

| Skill | Tools | Lesson count |
|---|---|---|
| Data Analysis | **Pandas**, **NumPy**, **Statistics** | 23 (Pandas: 23, NumPy: 23, Statistics: 9) |
| Data Visualization | **Matplotlib**, **Seaborn** | 7 (Matplotlib: 7, Seaborn: 2) |

### 3. AI & Machine Learning (5 lessons)

Tools are **actual libraries**.

| Skill | Tools | Lesson count |
|---|---|---|
| Machine Learning | **scikit-learn**, **NumPy** | 2 |
| Computer Vision | **OpenCV**, **NumPy** | 1 |
| Natural Language | **scikit-learn**, **NumPy** | 1 |
| Reinforcement Learning | **NumPy** | 1 |

### 4. Scientific Modeling (91 lessons)

Tools are **simulation sub-domains**, not library names — because these lessons model physics/biology/chemistry concepts, not specific library APIs.

| Skill | Tools | Lesson count |
|---|---|---|
| Physics simulation | Mechanics (11), Optics & light (10), Acoustics & sound (9), Fluid dynamics (6), Thermodynamics (3) | 39 |
| Biological simulation | Population dynamics (17), Plant growth (8), Genetics & evolution (5), Ecosystem modeling (5) | 35 |
| Chemical simulation | Materials science (7), Reactions & kinetics (1) | 8 |
| Earth science simulation | Geological processes (4), Atmospheric models (3), Hydrological models (2) | 9 |

### 5. Electronics & Hardware (3 lessons)

| Skill | Tools | Lesson count |
|---|---|---|
| Arduino | Digital I/O (2), Analog I/O (1) | 3 |
| Circuit Design | Breadboard prototyping (1) | 1 |
| Sensors | Ultrasonic (1), Light sensors (1) | 2 |

---

## Data model

Defined in `src/data/lesson-types.ts`:

```ts
type Discipline = 'Programming' | 'Data Science' | 'AI & Machine Learning' | 'Scientific Modeling' | 'Electronics & Hardware';

interface SkillTag {
  discipline: Discipline;     // Level 1
  skill: string;              // Level 2
  tools?: string[];           // Level 3 — libraries or sub-domains
  application?: string;       // Optional domain context (not shown in filter UI)
}
```

Each lesson has a `skillTags: SkillTag[]` array. A lesson can have multiple tags (e.g., the Firefly lesson has Arduino + Circuit Design + Programming).

The `DISCIPLINES` constant in `src/data/lessons.ts` defines the full hierarchy for the filter UI — it lists every valid skill and tool name.

---

## How to tag a new lesson

1. **Pick the primary discipline** (L1) — what is this lesson mainly about?
2. **Pick 1-2 skills** (L2) — what will the student learn to do?
3. **Pick the tools** (L3):
   - For Data Science / AI: use **actual library names** (Pandas, NumPy, Matplotlib, scikit-learn, OpenCV, Seaborn)
   - For Scientific Modeling: use **simulation sub-domain** (Mechanics, Population dynamics, etc.)
   - For Programming: use **language/framework** (Python 3, HTML/CSS, JavaScript, TypeScript, SQL)
   - For Electronics: use **I/O type or component** (Digital I/O, Analog I/O, Ultrasonic, etc.)
4. **Optionally add `application`** — domain context like "Acoustic analysis" or "Crop monitoring"
5. **Always add a Programming > Python tag** if the lesson uses Python (nearly all do)

### Example

```ts
skillTags: [
  { discipline: 'Data Science', skill: 'Data Analysis', tools: ['Pandas', 'NumPy', 'Statistics'], application: 'Population trends' },
  { discipline: 'Programming', skill: 'Python', tools: ['Python 3'] },
]
```

---

## Tagging rules

1. Each lesson gets **1 primary discipline** (the one that best describes what the lesson teaches)
2. A lesson can have **multiple SkillTag entries** under different disciplines
3. **Don't tag what's incidental** — if a lesson plots one graph as side output, don't tag it Data Visualization
4. **Tools must match the `DISCIPLINES` constant** — if you introduce a new tool, add it there first
5. The `application` field is for search/discovery, not filtering — keep it short and descriptive

---

## UI behavior

- **By Subject tab**: flat list of 22 subject pills, filters by `lesson.subjects`
- **By Skill tab**: hierarchical drill-down, filters by `lesson.skillTags`
- L1 pills always visible (with counts)
- L2 pills appear when an L1 is selected
- L3 pills appear only when the selected L2 skill has 2+ tools with non-zero lesson counts
- Breadcrumbs show the current filter path (e.g., "Data Science > Data Analysis")

---

## Key files

| File | What it does |
|---|---|
| `src/data/lesson-types.ts` | `SkillTag` interface, `Discipline` type |
| `src/data/lessons.ts` | `DISCIPLINES` constant (the full hierarchy), `skillTags` on each lesson |
| `src/data/lessons-mythology.ts` | `skillTags` on mythology lessons |
| `src/pages/LessonsIndexPage.tsx` | Filter UI with drill-down logic |
| `docs/skill-taxonomy.md` | This file |

---

## Legacy fields (still on lessons, not used by filter)

- `toolSkills: Skill[]` — old flat skill tags (Python, Web Development, Arduino & Electronics, etc.)
- `learningTracks: Track[]` — old flat tracks (Programming, AI & Data, Science & Lab, etc.)
- These are kept for backward compatibility but the "By Track" tab has been removed.
