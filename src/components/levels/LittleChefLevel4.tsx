import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function LittleChefLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: "Capstone Design: Recipe Nutrition Analyzer — from ingredients to health insights",
      concept: "The capstone builds a complete Recipe Nutrition Analyzer that takes any list of ingredients and quantities, computes comprehensive nutritional profiles, scores against dietary guidelines, identifies nutritional gaps, and recommends ingredient substitutions to improve health outcomes. The six stages mirror a real food science laboratory pipeline.",
      analogy: "Building the analyzer is like developing a complete health check system: intake (ingredient entry), testing (nutrient calculation), diagnosis (comparison to guidelines), treatment plan (substitution recommendations), and follow-up (optimized recipe). Each stage builds on the previous.",
      storyConnection: "The little chef grandmother said \"know what you cook and why.\" The analyzer provides that knowledge computationally — every ingredient contribution quantified, every nutritional gap identified, every substitution justified by data.",
      checkQuestion: "Why analyze per-serving rather than per-recipe?",
      checkAnswer: "A recipe for 8 servings has 8x the total nutrients of one serving, but a person eats one serving. Per-serving analysis tells you what one person actually receives, which is what matters for dietary comparison against RDI values. Total recipe analysis is misleading for nutrition planning.",
      codeIntro: "Build Stage 1: ingredient database with comprehensive nutrient profiles.",
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Stage 1: Ingredient Database

class NutrientDB:
    """Comprehensive ingredient nutrient database."""
    
    NUTRIENTS = ['calories', 'protein', 'carbs', 'fat', 'fiber',
                 'iron', 'calcium', 'zinc', 'vitA', 'vitC', 'vitB12', 'folate']
    UNITS = {'calories': 'kcal', 'protein': 'g', 'carbs': 'g', 'fat': 'g',
             'fiber': 'g', 'iron': 'mg', 'calcium': 'mg', 'zinc': 'mg',
             'vitA': 'mcg', 'vitC': 'mg', 'vitB12': 'mcg', 'folate': 'mcg'}
    RDI = {'calories': 2000, 'protein': 50, 'carbs': 300, 'fat': 65,
           'fiber': 25, 'iron': 18, 'calcium': 1000, 'zinc': 11,
           'vitA': 900, 'vitC': 90, 'vitB12': 2.4, 'folate': 400}
    
    def __init__(self):
        self.foods = {
            'Rice (white)': [130, 2.7, 28, 0.3, 0.4, 0.2, 10, 0.5, 0, 0, 0, 2],
            'Rice (brown)': [112, 2.6, 24, 0.9, 1.8, 0.5, 10, 0.6, 0, 0, 0, 4],
            'Fish (rohu)': [80, 17, 0, 1.4, 0, 1.0, 100, 0.5, 15, 0, 2.0, 10],
            'Chicken': [165, 31, 0, 3.6, 0, 0.9, 11, 1.0, 6, 0, 0.3, 4],
            'Lentils': [116, 9, 20, 0.4, 8, 3.3, 19, 1.3, 2, 1.5, 0, 180],
            'Spinach': [23, 2.9, 3.6, 0.4, 2.2, 2.7, 99, 0.5, 469, 28, 0, 194],
            'Potato': [77, 2, 17, 0.1, 2.2, 0.8, 12, 0.3, 0, 19.7, 0, 15],
            'Egg': [155, 13, 1.1, 11, 0, 1.8, 56, 1.1, 160, 0, 1.1, 47],
            'Milk': [42, 3.4, 5, 1, 0, 0, 125, 0.4, 46, 0, 0.5, 5],
            'Banana': [89, 1.1, 23, 0.3, 2.6, 0.3, 5, 0.2, 3, 8.7, 0, 20],
            'Tomato': [18, 0.9, 3.9, 0.2, 1.2, 0.3, 10, 0.2, 42, 14, 0, 15],
            'Onion': [40, 1.1, 9.3, 0.1, 1.7, 0.2, 23, 0.2, 0, 7.4, 0, 19],
            'Mustard oil': [884, 0, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0],
        }
    
    def get_nutrients(self, food_name, grams):
        if food_name not in self.foods:
            return None
        values = np.array(self.foods[food_name]) * grams / 100
        return dict(zip(self.NUTRIENTS, values))
    
    def analyze_recipe(self, recipe, servings=1):
        total = {n: 0 for n in self.NUTRIENTS}
        for food, grams in recipe.items():
            nutrients = self.get_nutrients(food, grams)
            if nutrients:
                for k, v in nutrients.items():
                    total[k] += v
        per_serving = {k: v/servings for k, v in total.items()}
        rdi_pct = {k: per_serving[k]/self.RDI[k]*100 for k in self.NUTRIENTS}
        return total, per_serving, rdi_pct

db = NutrientDB()

# Test with a sample recipe
recipe = {'Rice (white)': 300, 'Fish (rohu)': 200, 'Spinach': 100,
          'Onion': 50, 'Mustard oil': 15, 'Tomato': 50}
total, per_serving, rdi = db.analyze_recipe(recipe, servings=2)

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Macros
ax0 = axes[0, 0]
macros = ['protein', 'carbs', 'fat', 'fiber']
vals = [per_serving[m] for m in macros]
colors_m = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7']
ax0.bar(macros, vals, color=colors_m)
ax0.set_ylabel('Grams per serving', color='white')
ax0.set_title(f"Macronutrients ({per_serving['calories']:.0f} kcal/serving)", color='white', fontsize=11)
for label in ax0.get_xticklabels(): label.set_color('white')

# RDI coverage
ax1 = axes[0, 1]
rdi_keys = ['protein', 'iron', 'calcium', 'vitA', 'vitC', 'vitB12', 'folate']
rdi_vals = [min(rdi[k], 200) for k in rdi_keys]
bar_c = ['#22c55e' if v >= 80 else '#f59e0b' if v >= 40 else '#ef4444' for v in rdi_vals]
ax1.barh(rdi_keys, rdi_vals, color=bar_c)
ax1.axvline(100, color='white', linestyle='--', alpha=0.5)
ax1.set_xlabel('% RDI per serving', color='white')
ax1.set_title('Nutrient coverage', color='white', fontsize=11)
for label in ax1.get_yticklabels(): label.set_color('white'); label.set_fontsize(8)

# Calorie breakdown
ax2 = axes[1, 0]
p_cal = per_serving['protein'] * 4
c_cal = per_serving['carbs'] * 4
f_cal = per_serving['fat'] * 9
sizes = [p_cal, c_cal, f_cal]
labels = [f'Protein\
{p_cal:.0f} kcal', f'Carbs\
{c_cal:.0f} kcal', f'Fat\
{f_cal:.0f} kcal']
ax2.pie(sizes, labels=labels, colors=['#22c55e', '#3b82f6', '#f59e0b'],
        textprops={'color': 'white', 'fontsize': 9}, autopct='%1.0f%%')
ax2.set_title('Caloric distribution', color='white', fontsize=11)

# Database summary
ax3 = axes[1, 1]
ax3.axis('off')
db_text = "NUTRIENT DATABASE\
" + "=" * 40 + "\
"
db_text += f"Foods: {len(db.foods)}\
"
db_text += f"Nutrients tracked: {len(db.NUTRIENTS)}\
\
"
db_text += "Sample recipe (per serving):\
"
for food, grams in recipe.items():
    db_text += f"  {food}: {grams/2:.0f}g\
"
db_text += f"\
Total: {per_serving['calories']:.0f} kcal\
"
db_text += f"Protein: {per_serving['protein']:.1f}g ({rdi['protein']:.0f}% RDI)\
"
db_text += f"Iron: {per_serving['iron']:.1f}mg ({rdi['iron']:.0f}% RDI)\
"
db_text += f"Vit C: {per_serving['vitC']:.1f}mg ({rdi['vitC']:.0f}% RDI)"

ax3.text(0.05, 0.95, db_text, transform=ax3.transAxes, color='#22c55e',
    fontsize=9, va='top', fontfamily='monospace',
    bbox=dict(boxstyle='round,pad=0.5', facecolor='#0d1117', edgecolor='#22c55e', alpha=0.8))

plt.tight_layout()
plt.show()

print("STAGE 1 COMPLETE: Nutrient Database")
print(f"  {len(db.foods)} foods, {len(db.NUTRIENTS)} nutrients per food")
print(f"  Recipe analysis functional with RDI scoring")`,
      challenge: "Add a \"cooking loss\" factor: some nutrients degrade during cooking (vitamin C loses ~30% when boiled). Implement nutrient-specific cooking loss multipliers and compare raw vs cooked nutritional profiles.",
      successHint: "Stage 1 complete — the nutrient database and basic analysis pipeline are functional.",
    },
    {
      title: "Stage 2: Nutritional gap analysis and dietary scoring",
      concept: "Stage 2 identifies nutritional gaps — nutrients where intake falls significantly below RDI — and computes a comprehensive dietary quality score. The scoring system weights deficiencies more heavily than excesses because a 50% shortfall in iron is medically more concerning than a 50% excess.",
      analogy: "Gap analysis is like a school report card: you check each subject against the passing grade. Getting 90% in math does not make up for 30% in reading. Each nutrient must independently meet its threshold.",
      storyConnection: "The grandmother knew that rice alone was insufficient — she insisted on fish for protein, greens for iron, and fruit for vitality. Gap analysis formalizes her dietary wisdom into quantified deficiency scores.",
      checkQuestion: "Why weight deficiencies more than excesses?",
      checkAnswer: "Moderate excess of most nutrients is handled by the body (excreted or stored). Deficiency causes functional impairment: iron deficiency causes anemia, vitamin C deficiency causes scurvy. The health cost of 50% under-intake is much greater than 50% over-intake for most nutrients.",
      codeIntro: "Build the gap analyzer with weighted dietary quality scoring and deficiency identification.",
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

RDI = {'calories': 2000, 'protein': 50, 'carbs': 300, 'fat': 65, 'fiber': 25,
       'iron': 18, 'calcium': 1000, 'zinc': 11, 'vitA': 900, 'vitC': 90, 'vitB12': 2.4, 'folate': 400}

def compute_dietary_score(rdi_percentages):
    """Compute weighted dietary quality score (0-100)."""
    scores = []
    deficiencies = []
    for nutrient, pct in rdi_percentages.items():
        if nutrient == 'calories': continue
        if pct < 50:
            scores.append(pct / 100 * 0.5)  # heavily penalized
            deficiencies.append((nutrient, pct))
        elif pct < 80:
            scores.append(0.5 + (pct - 50) / 30 * 0.3)
            deficiencies.append((nutrient, pct))
        elif pct <= 150:
            scores.append(1.0)  # adequate
        else:
            scores.append(max(0.7, 1.0 - (pct - 150) / 200))  # slight penalty for excess
    
    overall = np.mean(scores) * 100 if scores else 0
    deficiencies.sort(key=lambda x: x[1])
    return overall, deficiencies

# Simulate three different daily diets
diets = {
    'Balanced Assamese': {'protein': 95, 'carbs': 85, 'fat': 70, 'fiber': 90,
        'iron': 110, 'calcium': 60, 'zinc': 80, 'vitA': 120, 'vitC': 130, 'vitB12': 90, 'folate': 85},
    'Rice-heavy (low variety)': {'protein': 45, 'carbs': 120, 'fat': 40, 'fiber': 30,
        'iron': 35, 'calcium': 25, 'zinc': 40, 'vitA': 20, 'vitC': 15, 'vitB12': 10, 'folate': 30},
    'Vegetarian diverse': {'protein': 70, 'carbs': 90, 'fat': 65, 'fiber': 120,
        'iron': 80, 'calcium': 75, 'zinc': 60, 'vitA': 150, 'vitC': 180, 'vitB12': 30, 'folate': 140},
}

results = {}
for name, rdi_pct in diets.items():
    score, deficiencies = compute_dietary_score(rdi_pct)
    results[name] = {'score': score, 'deficiencies': deficiencies, 'rdi': rdi_pct}

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Diet quality scores
ax0 = axes[0, 0]
names = list(results.keys())
scores = [results[n]['score'] for n in names]
colors_d = ['#22c55e', '#ef4444', '#f59e0b']
ax0.bar(names, scores, color=colors_d)
ax0.set_ylabel('Dietary quality score', color='white')
ax0.set_title('Overall diet quality (0-100)', color='white', fontsize=11)
ax0.set_ylim(0, 100)
for label in ax0.get_xticklabels(): label.set_color('white'); label.set_fontsize(8); label.set_rotation(15)

# Nutrient radar (as grouped bars)
ax1 = axes[0, 1]
nutrients = ['protein', 'iron', 'calcium', 'vitC', 'vitB12', 'folate']
x = np.arange(len(nutrients))
w = 0.25
for i, (name, color) in enumerate(zip(names, colors_d)):
    vals = [results[name]['rdi'][n] for n in nutrients]
    ax1.bar(x + i*w, vals, w, color=color, label=name)
ax1.axhline(100, color='white', linestyle='--', alpha=0.5)
ax1.set_xticks(x + w)
ax1.set_xticklabels(nutrients, color='white', fontsize=8)
ax1.set_ylabel('% RDI', color='white')
ax1.set_title('Nutrient coverage by diet', color='white', fontsize=11)
ax1.legend(fontsize=7)

# Deficiency heatmap
ax2 = axes[1, 0]
all_nutrients = ['protein', 'iron', 'calcium', 'zinc', 'vitA', 'vitC', 'vitB12', 'folate', 'fiber']
heatmap = np.array([[results[d]['rdi'].get(n, 50) for n in all_nutrients] for d in names])
im = ax2.imshow(heatmap, cmap='RdYlGn', aspect='auto', vmin=0, vmax=150)
ax2.set_xticks(range(len(all_nutrients)))
ax2.set_xticklabels(all_nutrients, color='white', fontsize=7, rotation=45)
ax2.set_yticks(range(len(names)))
ax2.set_yticklabels(names, color='white', fontsize=8)
for i in range(len(names)):
    for j in range(len(all_nutrients)):
        v = heatmap[i,j]
        ax2.text(j, i, f'{v:.0f}', ha='center', va='center', color='white' if v < 60 else 'black', fontsize=7)
ax2.set_title('RDI % heatmap (red=deficient, green=adequate)', color='white', fontsize=10)
plt.colorbar(im, ax=ax2, shrink=0.8)

# Top deficiencies
ax3 = axes[1, 1]
ax3.axis('off')
def_text = "DEFICIENCY REPORT\
" + "=" * 45 + "\
\
"
for name in names:
    score = results[name]['score']
    defs = results[name]['deficiencies']
    grade = 'A' if score > 80 else 'B' if score > 60 else 'C' if score > 40 else 'D'
    def_text += f"{name} (Score: {score:.0f}, Grade: {grade}):\
"
    if defs:
        for nutrient, pct in defs[:3]:
            severity = 'CRITICAL' if pct < 30 else 'LOW' if pct < 60 else 'MARGINAL'
            def_text += f"  {severity}: {nutrient} at {pct:.0f}% RDI\
"
    else:
        def_text += "  No significant deficiencies\
"
    def_text += "\
"

ax3.text(0.05, 0.95, def_text, transform=ax3.transAxes, color='#fbbf24',
    fontsize=8.5, va='top', fontfamily='monospace',
    bbox=dict(boxstyle='round,pad=0.5', facecolor='#0d1117', edgecolor='#fbbf24', alpha=0.8))

plt.tight_layout()
plt.show()

print("STAGE 2 COMPLETE: Dietary Gap Analysis")
for name in names:
    print(f"  {name}: score={results[name]['score']:.0f}, deficiencies={len(results[name]['deficiencies'])}")`,
      challenge: "Compute a \"complementarity score\" between two diets: which diet combination (e.g., lunch from one, dinner from another) gives the best overall daily score?",
      successHint: "Stage 2 complete — dietary gaps are identified and scored.",
    },
    {
      title: "Stage 3: Ingredient substitution engine",
      concept: "When a nutrient gap is identified, the substitution engine recommends ingredient swaps that improve the gap without disrupting the recipe balance. For each deficiency, it searches the database for ingredients rich in that nutrient and computes the optimal swap amount.",
      analogy: "The substitution engine is like a financial advisor rebalancing a portfolio: if you are underweight in bonds (low iron), they suggest selling some stocks (reducing rice) and buying bonds (adding spinach) to meet your target allocation.",
      storyConnection: "The grandmother adjusted recipes by season — more greens in summer, more lentils in winter. The substitution engine does the same based on nutritional data rather than tradition, but the wisdom is the same: adapt to what the body needs.",
      checkQuestion: "Why consider recipe compatibility in substitutions, not just nutrient content?",
      checkAnswer: "Adding liver to a fruit salad provides iron but ruins the recipe. Substitutions must respect culinary categories: swap proteins for proteins, grains for grains, vegetables for vegetables. The engine filters substitution candidates by food category before ranking by nutrient improvement.",
      codeIntro: "Build the substitution engine with category-aware ingredient swaps and improvement scoring.",
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simplified food database with categories
foods = {
    'Rice (white)': {'cat': 'grain', 'iron': 0.2, 'calcium': 10, 'vitC': 0, 'protein': 2.7, 'cal': 130},
    'Rice (brown)': {'cat': 'grain', 'iron': 0.5, 'calcium': 10, 'vitC': 0, 'protein': 2.6, 'cal': 112},
    'Millet': {'cat': 'grain', 'iron': 3.0, 'calcium': 42, 'vitC': 0, 'protein': 3.5, 'cal': 119},
    'Fish': {'cat': 'protein', 'iron': 1.0, 'calcium': 100, 'vitC': 0, 'protein': 17, 'cal': 80},
    'Chicken': {'cat': 'protein', 'iron': 0.9, 'calcium': 11, 'vitC': 0, 'protein': 31, 'cal': 165},
    'Egg': {'cat': 'protein', 'iron': 1.8, 'calcium': 56, 'vitC': 0, 'protein': 13, 'cal': 155},
    'Lentils': {'cat': 'legume', 'iron': 3.3, 'calcium': 19, 'vitC': 1.5, 'protein': 9, 'cal': 116},
    'Spinach': {'cat': 'vegetable', 'iron': 2.7, 'calcium': 99, 'vitC': 28, 'protein': 2.9, 'cal': 23},
    'Potato': {'cat': 'vegetable', 'iron': 0.8, 'calcium': 12, 'vitC': 19.7, 'protein': 2, 'cal': 77},
    'Broccoli': {'cat': 'vegetable', 'iron': 0.7, 'calcium': 47, 'vitC': 89, 'protein': 2.8, 'cal': 34},
    'Tomato': {'cat': 'vegetable', 'iron': 0.3, 'calcium': 10, 'vitC': 14, 'protein': 0.9, 'cal': 18},
    'Amla (gooseberry)': {'cat': 'fruit', 'iron': 0.3, 'calcium': 25, 'vitC': 600, 'protein': 0.5, 'cal': 44},
}

RDI = {'iron': 18, 'calcium': 1000, 'vitC': 90, 'protein': 50}

def find_substitutions(recipe, deficient_nutrient, top_n=5):
    """Find ingredient swaps to address a specific deficiency."""
    current_foods = set(recipe.keys())
    substitutions = []
    
    for food, props in foods.items():
        if food in current_foods:
            continue
        nutrient_per_100g = props[deficient_nutrient]
        if nutrient_per_100g <= 0:
            continue
        
        # Find same-category food in recipe to swap
        swap_target = None
        for existing in current_foods:
            if existing in foods and foods[existing]['cat'] == props['cat']:
                swap_target = existing
                break
        
        improvement = nutrient_per_100g
        if swap_target:
            improvement -= foods[swap_target][deficient_nutrient]
        
        if improvement > 0:
            substitutions.append({
                'add': food,
                'remove': swap_target,
                'improvement': improvement,
                'nutrient_per_100g': nutrient_per_100g,
                'category': props['cat'],
            })
    
    substitutions.sort(key=lambda x: x['improvement'], reverse=True)
    return substitutions[:top_n]

# Original recipe
original = {'Rice (white)': 250, 'Fish': 150, 'Potato': 100, 'Tomato': 50}

# Compute original nutrition
def compute_nutrition(recipe):
    total = {k: 0 for k in RDI}
    for food, grams in recipe.items():
        if food in foods:
            for k in RDI:
                total[k] += foods[food].get(k, 0) * grams / 100
    rdi_pct = {k: total[k]/RDI[k]*100 for k in RDI}
    return total, rdi_pct

orig_total, orig_rdi = compute_nutrition(original)

# Find deficiencies and substitutions
deficiencies = [(k, v) for k, v in orig_rdi.items() if v < 80]
all_subs = {}
for nutrient, pct in deficiencies:
    subs = find_substitutions(original, nutrient)
    all_subs[nutrient] = subs

# Apply best substitution for each deficiency
improved = dict(original)
changes = []
for nutrient, subs in all_subs.items():
    if subs:
        best = subs[0]
        if best['remove'] and best['remove'] in improved:
            amount = improved.pop(best['remove'])
            improved[best['add']] = amount
            changes.append(f"Swap {best['remove']} -> {best['add']} (for {nutrient})")
        elif best['add'] not in improved:
            improved[best['add']] = 80  # add 80g
            changes.append(f"Add {best['add']} 80g (for {nutrient})")

imp_total, imp_rdi = compute_nutrition(improved)

# Plot
fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Before/after comparison
ax0 = axes[0, 0]
nutrients_show = list(RDI.keys())
x = np.arange(len(nutrients_show))
ax0.bar(x - 0.2, [orig_rdi[n] for n in nutrients_show], 0.4, color='#ef4444', label='Original', alpha=0.7)
ax0.bar(x + 0.2, [imp_rdi[n] for n in nutrients_show], 0.4, color='#22c55e', label='Improved', alpha=0.7)
ax0.axhline(100, color='white', linestyle='--', alpha=0.5)
ax0.set_xticks(x)
ax0.set_xticklabels(nutrients_show, color='white', fontsize=9)
ax0.set_ylabel('% RDI', color='white')
ax0.set_title('Before vs after substitution', color='white', fontsize=11)
ax0.legend(fontsize=9)

# Substitution options for iron
ax1 = axes[0, 1]
if 'iron' in all_subs and all_subs['iron']:
    iron_subs = all_subs['iron']
    sub_names = [s['add'] for s in iron_subs]
    sub_vals = [s['nutrient_per_100g'] for s in iron_subs]
    ax1.barh(sub_names, sub_vals, color='#f59e0b')
    ax1.set_xlabel('Iron per 100g (mg)', color='white')
    ax1.set_title('Iron substitution candidates', color='white', fontsize=11)
    for label in ax1.get_yticklabels(): label.set_color('white'); label.set_fontsize(9)

# Recipe comparison
ax2 = axes[1, 0]
orig_items = list(original.items())
imp_items = list(improved.items())
ax2.barh([f[0] for f in orig_items], [f[1] for f in orig_items], color='#ef4444', alpha=0.5, label='Original')
ax2.barh([f[0] for f in imp_items], [f[1] for f in imp_items], color='#22c55e', alpha=0.5, label='Improved')
ax2.set_xlabel('Grams', color='white')
ax2.set_title('Recipe comparison', color='white', fontsize=11)
ax2.legend(fontsize=8)
for label in ax2.get_yticklabels(): label.set_color('white'); label.set_fontsize(8)

# Changes summary
ax3 = axes[1, 1]
ax3.axis('off')
change_text = "SUBSTITUTION REPORT\
" + "=" * 45 + "\
\
"
change_text += "Deficiencies found:\
"
for n, p in deficiencies:
    change_text += f"  {n}: {p:.0f}% RDI\
"
change_text += "\
Changes applied:\
"
for c in changes:
    change_text += f"  {c}\
"
change_text += f"\
Improvement:\
"
for n in RDI:
    delta = imp_rdi[n] - orig_rdi[n]
    if abs(delta) > 1:
        change_text += f"  {n}: {orig_rdi[n]:.0f}% -> {imp_rdi[n]:.0f}% ({'+' if delta>0 else ''}{delta:.0f}%)\
"

ax3.text(0.05, 0.95, change_text, transform=ax3.transAxes, color='#22c55e',
    fontsize=8.5, va='top', fontfamily='monospace',
    bbox=dict(boxstyle='round,pad=0.5', facecolor='#0d1117', edgecolor='#22c55e', alpha=0.8))

plt.tight_layout()
plt.show()

print("STAGE 3 COMPLETE: Substitution Engine")
for c in changes:
    print(f"  {c}")`,
      challenge: "Add a \"dietary restriction\" filter: exclude ingredients that contain allergens (e.g., no eggs for egg allergy, no fish for vegetarian). How do the substitution recommendations change?",
      successHint: "Stage 3 complete — ingredient substitutions are generated and evaluated.",
    },
    {
      title: "Stage 4: Meal plan optimization across multiple meals",
      concept: "Stage 4 extends single-recipe analysis to full-day meal planning. The optimizer distributes nutrient targets across breakfast, lunch, and dinner, allowing each meal to be unbalanced as long as the daily total meets requirements. This flexibility produces more realistic and enjoyable meal plans than requiring every meal to be perfectly balanced.",
      analogy: "Daily meal planning is like a relay race: each runner (meal) does not need to run the same distance. A fast breakfast can cover calories while a nutrient-dense dinner covers micronutrients. The team (day) wins as long as the total distance (daily RDI) is covered.",
      storyConnection: "The little chef family ate light breakfasts and hearty dinners — not every meal was balanced, but the day was. Our optimizer captures this traditional eating pattern mathematically.",
      checkQuestion: "Why optimize daily totals rather than per-meal targets?",
      checkAnswer: "Requiring each meal to meet 33% of every RDI is unnecessarily restrictive and produces boring, repetitive meals. In reality, vitamin C might come mostly from a fruit-heavy breakfast, protein from a fish dinner, and calcium from a milk-based snack. Daily optimization allows natural meal variety while ensuring the total meets health targets.",
      codeIntro: "Build the daily meal plan optimizer with per-meal flexibility and daily constraint satisfaction.",
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simplified meal templates
meal_options = {
    'breakfast': [
        {'name': 'Rice + egg', 'cal': 350, 'protein': 18, 'iron': 2.0, 'vitC': 0, 'calcium': 70},
        {'name': 'Millet porridge + banana', 'cal': 280, 'protein': 8, 'iron': 3.5, 'vitC': 12, 'calcium': 55},
        {'name': 'Bread + milk + fruit', 'cal': 320, 'protein': 12, 'iron': 1.5, 'vitC': 30, 'calcium': 180},
    ],
    'lunch': [
        {'name': 'Fish curry + rice', 'cal': 550, 'protein': 28, 'iron': 2.5, 'vitC': 8, 'calcium': 120},
        {'name': 'Dal + rice + spinach', 'cal': 480, 'protein': 18, 'iron': 6.0, 'vitC': 25, 'calcium': 85},
        {'name': 'Chicken + rice + salad', 'cal': 600, 'protein': 35, 'iron': 2.0, 'vitC': 15, 'calcium': 40},
    ],
    'dinner': [
        {'name': 'Lentil soup + roti + veg', 'cal': 450, 'protein': 16, 'iron': 5.0, 'vitC': 20, 'calcium': 60},
        {'name': 'Fish fry + rice + greens', 'cal': 520, 'protein': 25, 'iron': 3.5, 'vitC': 30, 'calcium': 130},
        {'name': 'Egg curry + rice + amla', 'cal': 480, 'protein': 20, 'iron': 3.0, 'vitC': 120, 'calcium': 90},
    ],
}

RDI = {'cal': 2000, 'protein': 50, 'iron': 18, 'vitC': 90, 'calcium': 1000}

def score_meal_plan(breakfast, lunch, dinner):
    """Score a complete day's meals against RDI."""
    total = {k: 0 for k in RDI}
    for meal in [breakfast, lunch, dinner]:
        for k in total:
            total[k] += meal.get(k, 0)
    
    rdi_pct = {k: total[k]/RDI[k]*100 for k in RDI}
    
    # Score: penalize under-target more than over-target
    score = 0
    for k, pct in rdi_pct.items():
        if k == 'cal':
            score += max(0, 1 - abs(pct - 100) / 30)  # calories should be close to target
        elif pct < 80:
            score += pct / 100  # deficiency penalty
        elif pct <= 150:
            score += 1.0
        else:
            score += 0.8
    
    return score / len(RDI), total, rdi_pct

# --- Find optimal meal plan ---
best_score = 0
best_plan = None
best_details = None
all_plans = []

for b in meal_options['breakfast']:
    for l in meal_options['lunch']:
        for d in meal_options['dinner']:
            score, total, rdi_pct = score_meal_plan(b, l, d)
            all_plans.append({'b': b['name'], 'l': l['name'], 'd': d['name'],
                            'score': score, 'total': total, 'rdi': rdi_pct})
            if score > best_score:
                best_score = score
                best_plan = (b, l, d)
                best_details = {'score': score, 'total': total, 'rdi': rdi_pct}

all_plans.sort(key=lambda x: x['score'], reverse=True)

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Best plan nutrient coverage
ax0 = axes[0, 0]
nutrients = ['protein', 'iron', 'vitC', 'calcium']
vals = [best_details['rdi'][n] for n in nutrients]
bar_c = ['#22c55e' if v >= 80 else '#f59e0b' if v >= 50 else '#ef4444' for v in vals]
ax0.bar(nutrients, vals, color=bar_c)
ax0.axhline(100, color='white', linestyle='--', alpha=0.5, label='100% RDI')
ax0.set_ylabel('% RDI', color='white')
ax0.set_title(f'Best plan (score={best_score:.3f})', color='white', fontsize=11)
ax0.legend(fontsize=8)
for label in ax0.get_xticklabels(): label.set_color('white')

# Meal contribution stacking
ax1 = axes[0, 1]
b, l, d = best_plan
for i, nutrient in enumerate(nutrients):
    b_val = b.get(nutrient, 0) / RDI.get(nutrient, 1) * 100
    l_val = l.get(nutrient, 0) / RDI.get(nutrient, 1) * 100
    d_val = d.get(nutrient, 0) / RDI.get(nutrient, 1) * 100
    ax1.bar(i, b_val, color='#f59e0b', label='Breakfast' if i==0 else '')
    ax1.bar(i, l_val, bottom=b_val, color='#22c55e', label='Lunch' if i==0 else '')
    ax1.bar(i, d_val, bottom=b_val+l_val, color='#3b82f6', label='Dinner' if i==0 else '')
ax1.axhline(100, color='white', linestyle='--', alpha=0.5)
ax1.set_xticks(range(len(nutrients)))
ax1.set_xticklabels(nutrients, color='white')
ax1.set_ylabel('% RDI', color='white')
ax1.set_title('Per-meal contribution to daily RDI', color='white', fontsize=11)
ax1.legend(fontsize=8)

# Score distribution of all plans
ax2 = axes[1, 0]
scores = [p['score'] for p in all_plans]
ax2.hist(scores, bins=15, color='#a855f7', edgecolor='#111827', alpha=0.7)
ax2.axvline(best_score, color='#22c55e', linewidth=2, label=f'Best: {best_score:.3f}')
ax2.set_xlabel('Plan score', color='white')
ax2.set_ylabel('Count', color='white')
ax2.set_title(f'Score distribution ({len(all_plans)} combinations)', color='white', fontsize=11)
ax2.legend(fontsize=9)

# Top 5 plans
ax3 = axes[1, 1]
ax3.axis('off')
plan_text = "TOP 5 MEAL PLANS\
" + "=" * 50 + "\
\
"
for i, p in enumerate(all_plans[:5]):
    plan_text += f"#{i+1} (score={p['score']:.3f}):\
"
    plan_text += f"  B: {p['b']}\
  L: {p['l']}\
  D: {p['d']}\
"
    plan_text += f"  Cal: {p['total']['cal']:.0f}, Protein: {p['rdi']['protein']:.0f}%,"
    plan_text += f" Iron: {p['rdi']['iron']:.0f}%, VitC: {p['rdi']['vitC']:.0f}%\
\
"

ax3.text(0.02, 0.98, plan_text, transform=ax3.transAxes, color='#22c55e',
    fontsize=8, va='top', fontfamily='monospace',
    bbox=dict(boxstyle='round,pad=0.5', facecolor='#0d1117', edgecolor='#22c55e', alpha=0.8))

plt.tight_layout()
plt.show()

print("STAGE 4 COMPLETE: Meal Plan Optimization")
print(f"  Combinations evaluated: {len(all_plans)}")
print(f"  Best plan score: {best_score:.3f}")
print(f"  Best: {best_plan[0]['name']} + {best_plan[1]['name']} + {best_plan[2]['name']}")`,
      challenge: "Add a 7-day planner that maximizes variety (no repeated meals within 3 days) while maintaining daily nutrient targets. How much does the variety constraint reduce the average daily score?",
      successHint: "Stage 4 complete — multi-meal optimization produces realistic, nutritionally complete daily plans.",
    },
    {
      title: "Stage 5: Cooking chemistry integration — predicting flavor and nutrition changes",
      concept: "Stage 5 integrates the Maillard, fermentation, and pH models from Level 3 to predict how cooking processes change both flavor and nutrition. Raw ingredient nutrition differs from cooked: vitamin C degrades with heat, iron bioavailability increases with cooking, Maillard products add antioxidants but also acrylamide at very high temperatures.",
      analogy: "Cooking chemistry integration is like a flight simulator that combines aerodynamics, weather, and engine performance into one prediction. Each model alone gives partial insight; together they predict the complete cooking outcome — flavor, nutrition, and safety.",
      storyConnection: "The little chef knew that overcooking spinach destroyed its \"goodness\" (vitamin C) while undercooking lentils left them indigestible (anti-nutrients not degraded). The integrated model quantifies these trade-offs: cooking time vs. nutrient retention vs. digestibility vs. flavor development.",
      checkQuestion: "Why is \"optimal cooking time\" different for nutrition and flavor?",
      checkAnswer: "Flavor development (Maillard browning) accelerates with longer cooking and higher temperatures. Nutrient retention (especially vitamin C, folate) decreases with cooking time. The optimal cooking time is a compromise: enough time for flavor and anti-nutrient degradation, but not so much that heat-sensitive vitamins are destroyed. This trade-off is recipe-specific and the model quantifies it.",
      codeIntro: "Build the cooking chemistry predictor that models concurrent flavor development and nutrient degradation.",
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Cooking chemistry model ---
def nutrient_retention(time_min, temp_C, nutrient_type):
    """Predict nutrient retention (0-1) during cooking."""
    # Half-lives vary by nutrient and temperature
    half_lives = {
        'vitC': 15 / (1 + 0.05 * max(0, temp_C - 60)),
        'folate': 25 / (1 + 0.03 * max(0, temp_C - 60)),
        'vitB12': 60 / (1 + 0.02 * max(0, temp_C - 80)),
        'iron': 999,   # iron is stable
        'protein': 200,  # protein denatures but retains nutritional value
        'calcium': 999,
    }
    hl = half_lives.get(nutrient_type, 100)
    return max(0.1, np.exp(-0.693 * time_min / hl))

def maillard_score(time_min, temp_C):
    """Flavor development from Maillard reaction (0-1)."""
    rate = 1e15 * np.exp(-120000 / (8.314 * (temp_C + 273.15)))
    score = 1 - np.exp(-rate * time_min * 60)
    return min(1.0, score)

def antinutrient_degradation(time_min, temp_C):
    """Fraction of anti-nutrients (phytate, oxalate) degraded."""
    rate = 0.01 * np.exp(0.05 * max(0, temp_C - 70))
    return min(0.95, 1 - np.exp(-rate * time_min))

# --- Simulate cooking trajectory ---
temps = [80, 100, 150, 200]
time = np.linspace(0, 60, 200)

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Vitamin C retention
ax0 = axes[0, 0]
colors_t = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444']
for T, color in zip(temps, colors_t):
    retention = [nutrient_retention(t, T, 'vitC') * 100 for t in time]
    ax0.plot(time, retention, color=color, linewidth=2, label=f'{T}°C')
ax0.set_xlabel('Cooking time (min)', color='white')
ax0.set_ylabel('Vitamin C retention (%)', color='white')
ax0.set_title('Vitamin C degradation during cooking', color='white', fontsize=11)
ax0.legend(fontsize=9)

# Flavor development
ax1 = axes[0, 1]
for T, color in zip(temps, colors_t):
    flavor = [maillard_score(t, T) * 100 for t in time]
    ax1.plot(time, flavor, color=color, linewidth=2, label=f'{T}°C')
ax1.set_xlabel('Cooking time (min)', color='white')
ax1.set_ylabel('Flavor development (%)', color='white')
ax1.set_title('Maillard browning (flavor)', color='white', fontsize=11)
ax1.legend(fontsize=9)

# Trade-off: nutrition vs flavor at 180°C
ax2 = axes[1, 0]
T = 180
vitc = [nutrient_retention(t, T, 'vitC') * 100 for t in time]
flavor = [maillard_score(t, T) * 100 for t in time]
combined = [0.5 * v + 0.5 * f for v, f in zip(vitc, flavor)]
ax2.plot(time, vitc, color='#22c55e', linewidth=2, label='Vitamin C')
ax2.plot(time, flavor, color='#f59e0b', linewidth=2, label='Flavor')
ax2.plot(time, combined, color='white', linewidth=2, linestyle='--', label='Combined score')
optimal_idx = np.argmax(combined)
ax2.axvline(time[optimal_idx], color='#ef4444', linestyle=':', label=f'Optimal: {time[optimal_idx]:.0f} min')
ax2.set_xlabel('Cooking time (min)', color='white')
ax2.set_ylabel('Score (%)', color='white')
ax2.set_title(f'Nutrition vs flavor trade-off at {T}°C', color='white', fontsize=11)
ax2.legend(fontsize=8)

# Multi-nutrient retention profile
ax3 = axes[1, 1]
nutrients_cook = ['vitC', 'folate', 'vitB12', 'iron', 'protein']
T_cook = 100  # boiling
for nutrient in nutrients_cook:
    ret = [nutrient_retention(t, T_cook, nutrient) * 100 for t in time]
    ax3.plot(time, ret, linewidth=2, label=nutrient)
ax3.set_xlabel('Boiling time (min)', color='white')
ax3.set_ylabel('Retention (%)', color='white')
ax3.set_title(f'Nutrient retention at {T_cook}°C (boiling)', color='white', fontsize=11)
ax3.legend(fontsize=8)

plt.tight_layout()
plt.show()

print(f"Optimal cooking at 180°C: {time[optimal_idx]:.0f} min")
print(f"  Vitamin C retained: {vitc[optimal_idx]:.0f}%")
print(f"  Flavor developed: {flavor[optimal_idx]:.0f}%")
print(f"  Combined score: {combined[optimal_idx]:.0f}%")`,
      challenge: "Add a \"steaming vs boiling\" comparison: steaming retains more water-soluble vitamins because nutrients do not leach into cooking water. Model this by reducing the degradation rate by 40% for steaming. Plot side-by-side retention curves.",
      successHint: "Stage 5 complete — cooking chemistry is integrated with nutrition prediction.",
    },
    {
      title: "Stage 6: Complete Recipe Nutrition Analyzer report",
      concept: "The final stage generates the complete report: ingredient analysis, nutritional profile, gap identification, substitution recommendations, meal plan optimization, and cooking chemistry insights — all in one comprehensive, actionable document.",
      analogy: "The final report is like a complete medical checkup report: blood work (nutrient levels), comparison to healthy ranges (RDI), diagnosis (deficiencies), treatment plan (substitutions), and lifestyle recommendations (cooking methods). Everything a person needs to improve their dietary health.",
      storyConnection: "The little chef grandmother passed down recipes by oral tradition. Our report preserves that wisdom digitally while adding scientific analysis — every recipe documented with its nutritional strengths, weaknesses, and optimization potential.",
      checkQuestion: "Why include cooking method recommendations in a nutrition report?",
      checkAnswer: "The same ingredients cooked differently can have 50% different vitamin content. Steamed spinach retains much more vitamin C than boiled spinach (where vitamins leach into discarded water). Cooking method is as important as ingredient selection for actual nutrient intake. A report without cooking guidance is incomplete.",
      codeIntro: "Generate the comprehensive Recipe Nutrition Analyzer report.",
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

fig = plt.figure(figsize=(16, 18))
fig.patch.set_facecolor('#1f2937')

# Title
ax_t = fig.add_subplot(5, 2, (1, 2))
ax_t.set_facecolor('#0d1117')
ax_t.axis('off')
title = """RECIPE NUTRITION ANALYZER — COMPLETE REPORT
""" + "="*55 + """\
Recipe:    Assamese Fish Curry with Rice and Greens
Servings:  2
Method:    Simmered 25 min at ~95°C

PER SERVING:
  Calories:  485 kcal (24% RDI)
  Protein:   32g (64% RDI) — ADEQUATE
  Iron:      4.2mg (23% RDI) — LOW
  Vitamin C: 22mg (24% RDI) — LOW
  Calcium:   145mg (15% RDI) — DEFICIENT

OVERALL DIETARY SCORE: 62/100 (Grade B)"""

ax_t.text(0.5, 0.5, title, transform=ax_t.transAxes, fontsize=9, fontfamily='monospace',
    color='#22c55e', va='center', ha='center',
    bbox=dict(boxstyle='round,pad=0.8', facecolor='#0d1117', edgecolor='#22c55e'))

# Macronutrient breakdown
ax_m = fig.add_subplot(5, 2, 3)
ax_m.set_facecolor('#111827')
ax_m.tick_params(colors='gray')
sizes = [32*4, 55*4, 18*9]  # protein, carb, fat calories
ax_m.pie(sizes, labels=['Protein\
128 kcal', 'Carbs\
220 kcal', 'Fat\
162 kcal'],
    colors=['#22c55e', '#3b82f6', '#f59e0b'],
    textprops={'color': 'white', 'fontsize': 8}, autopct='%1.0f%%')
ax_m.set_title('Caloric distribution', color='white', fontsize=10)

# RDI coverage
ax_r = fig.add_subplot(5, 2, 4)
ax_r.set_facecolor('#111827')
ax_r.tick_params(colors='gray')
nutrients = ['Protein', 'Iron', 'Calcium', 'Vit C', 'Vit B12', 'Folate', 'Fiber']
rdi_pct = [64, 23, 15, 24, 85, 45, 35]
bar_c = ['#22c55e' if v>=60 else '#f59e0b' if v>=30 else '#ef4444' for v in rdi_pct]
ax_r.barh(nutrients, rdi_pct, color=bar_c)
ax_r.axvline(100, color='white', linestyle='--', alpha=0.5)
ax_r.set_xlabel('% RDI per serving', color='white')
ax_r.set_title('Nutrient coverage', color='white', fontsize=10)
for label in ax_r.get_yticklabels(): label.set_color('white'); label.set_fontsize(8)

# Cooking impact
ax_c = fig.add_subplot(5, 2, (5, 6))
ax_c.set_facecolor('#111827')
ax_c.tick_params(colors='gray')
time = np.linspace(0, 40, 100)
vitc_ret = [100 * np.exp(-0.693 * t / 20) for t in time]
flavor = [100 * (1 - np.exp(-0.1 * t)) for t in time]
ax_c.plot(time, vitc_ret, color='#22c55e', linewidth=2, label='Vitamin C retention')
ax_c.plot(time, flavor, color='#f59e0b', linewidth=2, label='Flavor development')
ax_c.axvline(25, color='#ef4444', linestyle='--', label='Current: 25 min')
ax_c.set_xlabel('Cooking time (min)', color='white')
ax_c.set_ylabel('%', color='white')
ax_c.set_title('Cooking time trade-off (simmering at 95°C)', color='white', fontsize=10)
ax_c.legend(fontsize=8)

# Substitution recommendations
ax_s = fig.add_subplot(5, 2, (7, 8))
ax_s.set_facecolor('#0d1117')
ax_s.axis('off')
sub_text = """SUBSTITUTION RECOMMENDATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. CALCIUM: Add 100g yogurt as side (+125mg calcium, +15% RDI)
   Alternative: Replace potato with 80g broccoli (+47mg calcium)

2. IRON: Replace white rice with millet (+2.8mg iron per serving)
   Alternative: Add 50g spinach to curry (+1.4mg iron)

3. VITAMIN C: Add amla chutney (20g = +120mg vitC, +133% RDI)
   Alternative: Add fresh lime juice at serving (+15mg vitC)

COOKING TIPS:
  - Add spinach in last 3 min to preserve vitamin C
  - Squeeze lime juice AFTER cooking (heat destroys vitC)
  - Soak rice 30 min to reduce phytic acid (improves iron absorption)"""

ax_s.text(0.05, 0.95, sub_text, transform=ax_s.transAxes, fontsize=8.5,
    fontfamily='monospace', color='#e2e8f0', va='top',
    bbox=dict(boxstyle='round,pad=0.5', facecolor='#0d1117', edgecolor='#334155'))

# Limitations
ax_l = fig.add_subplot(5, 2, (9, 10))
ax_l.set_facecolor('#0d1117')
ax_l.axis('off')
lim_text = """METHODOLOGY & LIMITATIONS
━━━━━━━━━━━━━━━━━━━━━━━━
Database: 13 common ingredients, 12 nutrients each
Cooking model: first-order kinetics with temperature dependence
Optimizer: exhaustive search over discretized ingredient amounts

Limitations:
  • Bioavailability not modeled (iron absorption varies 5-35%)
  • Nutrient-nutrient interactions omitted (vitC enhances iron absorption)
  • Individual variation in RDI not captured (age, sex, activity level)
  • Cooking loss estimates are averages; actual loss depends on method details

Pipeline: Recipe Nutrition Analyzer v1.0"""

ax_l.text(0.05, 0.95, lim_text, transform=ax_l.transAxes, fontsize=8.5,
    fontfamily='monospace', color='#fbbf24', va='top',
    bbox=dict(boxstyle='round,pad=0.5', facecolor='#0d1117', edgecolor='#fbbf24', alpha=0.8))

plt.tight_layout()
plt.show()

print()
print("CAPSTONE COMPLETE")
print("=" * 65)
print("You built a Recipe Nutrition Analyzer from scratch:")
print("  1. Ingredient database with 12-nutrient profiles")
print("  2. Dietary gap analysis with weighted quality scoring")
print("  3. Category-aware ingredient substitution engine")
print("  4. Multi-meal daily plan optimization")
print("  5. Cooking chemistry integration (Maillard + nutrient retention)")
print("  6. Comprehensive report with actionable recommendations")
print()
print("Skills demonstrated: food chemistry, nutrition science, optimization,")
print("kinetic modeling, database design, scientific reporting.")`,
      challenge: "Add a \"weekly variety tracker\": across 7 days of meal plans, penalize ingredient repetition and reward diverse food categories. Generate a full week plan that maximizes both nutrition and variety.",
      successHint: "You have completed a full capstone project: from raw ingredients to a comprehensive nutrition report. This is the shape of real food science — combining chemistry, nutrition, and optimization into actionable dietary guidance. The Recipe Nutrition Analyzer is portfolio-ready.",
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (food chemistry and nutrition science)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project uses Python with numpy and matplotlib to build a complete Recipe Nutrition Analyzer. Click to start.</p>
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
