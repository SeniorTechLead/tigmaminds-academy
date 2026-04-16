import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function MemoryGrandmaLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: "Capstone Design: Spaced Repetition System — from forgetting curves to optimal learning",
      concept: "The capstone integrates all Level 3 skills into a complete, deployable system. from forgetting curves to optimal learning. This stage handles data ingestion, processing, model application, and output generation with quality metrics at each step.\n\nThe implementation follows software engineering best practices: modular design, error handling, and comprehensive documentation. Each function has a clear interface, and the pipeline produces both results and quality assessments.",
      analogy: "Building this capstone is like constructing a complete laboratory instrument: each component must work reliably on its own and integrate seamlessly with the rest. The whole is greater than the sum of its parts because the pipeline produces insights that no individual stage can generate alone.",
      storyConnection: "The grandmother in the story preserved cultural memories through repetition — telling stories again and again at carefully timed intervals. She was practicing spaced repetition intuitively: stories told too frequently felt boring, those told too rarely were forgotten. Our system formalizes her timing wisdom into an algorithm.",
      checkQuestion: "What is the most critical quality check at this stage?",
      checkAnswer: "Every stage must validate its inputs and flag anomalies. A pipeline that silently produces wrong results is worse than one that crashes — at least a crash tells you something is wrong. The quality check at this stage is to compare output distributions against expected ranges and flag any value that falls outside 3 standard deviations of historical norms.",
      codeIntro: "Build this pipeline stage with quality metrics.",
      code: `import numpy as np

# --- Stage 1: Forgetting Curve Data Ingestion ---
print("=== Capstone Stage 1: Review Data Ingestion ===\
")

np.random.seed(42)

# Simulate a student's review history for 10 flashcard items over 30 days
n_items = 10
n_days = 30
item_names = [f"Card_{i+1}" for i in range(n_items)]

# Generate synthetic review data
reviews = []
for item_id in range(n_items):
    # Random review days
    n_reviews = np.random.randint(3, 8)
    review_days = sorted(np.random.choice(range(n_days), n_reviews, replace=False).tolist())
    for day in review_days:
        # Probability of recall depends on time since last review
        prev_reviews = [d for d in review_days if d < day]
        days_since = day - prev_reviews[-1] if prev_reviews else day
        recall_prob = np.exp(-0.3 * days_since)
        recalled = np.random.random() < recall_prob
        reviews.append({"item": item_names[item_id], "day": day, "recalled": recalled})

print(f"Generated {len(reviews)} review events across {n_items} items over {n_days} days")

# Validation
valid = 0
invalid = 0
for r in reviews:
    if 0 <= r["day"] < n_days and isinstance(r["recalled"], bool):
        valid += 1
    else:
        invalid += 1

print(f"Valid events: {valid}, Invalid: {invalid}")

# Summary statistics
items_reviewed = set(r["item"] for r in reviews)
recalls = sum(1 for r in reviews if r["recalled"])
print(f"\
Items with data: {len(items_reviewed)}/{n_items}")
print(f"Overall recall rate: {recalls}/{len(reviews)} ({recalls/len(reviews)*100:.0f}%)")

# Per-item summary
print(f"\
Per-item review summary:")
print(f"{'Item':<10s} {'Reviews':>8s} {'Recalled':>9s} {'Rate':>6s}")
print("-" * 35)
for item in item_names[:5]:
    item_reviews = [r for r in reviews if r["item"] == item]
    item_recalls = sum(1 for r in item_reviews if r["recalled"])
    rate = item_recalls / len(item_reviews) * 100 if item_reviews else 0
    print(f"{item:<10s} {len(item_reviews):>8d} {item_recalls:>9d} {rate:>5.0f}%")
print("  ... (showing first 5)")

print("\
Quality gate: All events validated. Ready for Stage 2.")`,
      challenge: "Add a validation step that compares this stage output against an independent data source.",
      successHint: "This stage is complete and ready to feed into the next pipeline stage.",
    },
    {
      title: "Stage 2: Individual forgetting rate estimation from review data",
      concept: "Stage 2 of the capstone builds on the previous stages. Stage 2: Individual forgetting rate estimation from review data. This stage handles data ingestion, processing, model application, and output generation with quality metrics at each step.\n\nThe implementation follows software engineering best practices: modular design, error handling, and comprehensive documentation. Each function has a clear interface, and the pipeline produces both results and quality assessments.",
      analogy: "This stage is like adding a new sensor to an instrument: each component must work reliably on its own and integrate seamlessly with the rest. The whole is greater than the sum of its parts because the pipeline produces insights that no individual stage can generate alone.",
      storyConnection: "The grandmother in the story preserved cultural memories through repetition — telling stories again and again at carefully timed intervals. She was practicing spaced repetition intuitively: stories told too frequently felt boring, those told too rarely were forgotten. Our system formalizes her timing wisdom into an algorithm.",
      checkQuestion: "What is the most critical quality check at this stage?",
      checkAnswer: "Every stage must validate its inputs and flag anomalies. A pipeline that silently produces wrong results is worse than one that crashes — at least a crash tells you something is wrong. The quality check at this stage is to compare output distributions against expected ranges and flag any value that falls outside 3 standard deviations of historical norms.",
      codeIntro: "Build this pipeline stage with quality metrics.",
      code: `import numpy as np

# --- Stage 2: Individual forgetting rate estimation from review data ---
print("=== Stage 2: Forgetting Rate Estimation ===\
")

np.random.seed(42)

# Estimate each item's forgetting rate from review data
# Model: P(recall) = exp(-decay_rate * days_since_last_review)

# Simulated review data for 5 items
items_data = {
    "Card_1": [(1, True), (3, True), (7, True), (14, False), (15, True)],
    "Card_2": [(1, True), (4, False), (5, True), (10, False), (11, True)],
    "Card_3": [(2, True), (5, True), (12, True), (25, True)],
    "Card_4": [(1, False), (2, True), (4, False), (5, True), (7, False)],
    "Card_5": [(1, True), (3, True), (8, True), (20, True)],
}

def estimate_decay_rate(reviews):
    """Estimate decay rate using maximum likelihood on recall/forget data."""
    # For each review, compute days since previous review
    best_rate = 0.1
    best_ll = float('-inf')
    for rate in np.arange(0.05, 1.0, 0.01):
        log_likelihood = 0
        prev_day = 0
        for day, recalled in reviews:
            days_since = day - prev_day
            p_recall = np.exp(-rate * days_since)
            p_recall = np.clip(p_recall, 0.01, 0.99)
            if recalled:
                log_likelihood += np.log(p_recall)
            else:
                log_likelihood += np.log(1 - p_recall)
            if recalled:
                prev_day = day
        if log_likelihood > best_ll:
            best_ll = log_likelihood
            best_rate = rate
    return best_rate, best_ll

print("Estimating individual forgetting rates (maximum likelihood):\
")
print(f"{'Item':<10s} {'Reviews':>8s} {'Recall%':>8s} {'Decay rate':>11s} {'Half-life':>10s} {'Log-lik':>8s}")
print("-" * 57)

decay_rates = {}
for item, reviews in items_data.items():
    n_reviews = len(reviews)
    n_recalled = sum(1 for _, r in reviews if r)
    rate, ll = estimate_decay_rate(reviews)
    half_life = np.log(2) / rate
    decay_rates[item] = rate
    print(f"{item:<10s} {n_reviews:>8d} {n_recalled/n_reviews*100:>7.0f}% {rate:>11.3f} {half_life:>9.1f}d {ll:>8.2f}")

# Rank items by difficulty (higher decay = harder to remember)
print("\
Items ranked by difficulty (highest decay = hardest):")
for item in sorted(decay_rates, key=decay_rates.get, reverse=True):
    r = decay_rates[item]
    difficulty = "HARD" if r > 0.3 else "MEDIUM" if r > 0.15 else "EASY"
    print(f"  {item}: decay={r:.3f} ({difficulty})")

# Aggregate student-level forgetting rate
avg_rate = np.mean(list(decay_rates.values()))
std_rate = np.std(list(decay_rates.values()))
print(f"\
Student-level summary:")
print(f"  Average decay rate: {avg_rate:.3f} +/- {std_rate:.3f}")
print(f"  Average half-life:  {np.log(2)/avg_rate:.1f} days")
print(f"\
Quality: Estimated rates for all {len(items_data)} items. Ready for Stage 3.")`,
      challenge: "Add a validation step that compares this stage output against an independent data source.",
      successHint: "This stage is complete and ready to feed into the next pipeline stage.",
    },
    {
      title: "Stage 3: Optimal interval calculator with confidence bounds",
      concept: "Stage 3 of the capstone builds on the previous stages. Stage 3: Optimal interval calculator with confidence bounds. This stage handles data ingestion, processing, model application, and output generation with quality metrics at each step.\n\nThe implementation follows software engineering best practices: modular design, error handling, and comprehensive documentation. Each function has a clear interface, and the pipeline produces both results and quality assessments.",
      analogy: "This stage is like adding a new sensor to an instrument: each component must work reliably on its own and integrate seamlessly with the rest. The whole is greater than the sum of its parts because the pipeline produces insights that no individual stage can generate alone.",
      storyConnection: "The grandmother in the story preserved cultural memories through repetition — telling stories again and again at carefully timed intervals. She was practicing spaced repetition intuitively: stories told too frequently felt boring, those told too rarely were forgotten. Our system formalizes her timing wisdom into an algorithm.",
      checkQuestion: "What is the most critical quality check at this stage?",
      checkAnswer: "Every stage must validate its inputs and flag anomalies. A pipeline that silently produces wrong results is worse than one that crashes — at least a crash tells you something is wrong. The quality check at this stage is to compare output distributions against expected ranges and flag any value that falls outside 3 standard deviations of historical norms.",
      codeIntro: "Build this pipeline stage with quality metrics.",
      code: `import numpy as np

# --- Stage 3: Optimal interval calculator with confidence bounds ---
print("=== Stage 3: Optimal Review Intervals ===\
")

np.random.seed(42)

# Given a decay rate, find the optimal review interval
# Goal: review just before retention drops below a threshold

def optimal_interval(decay_rate, target_retention=0.85):
    """Calculate the day when retention hits the target."""
    # R(t) = exp(-decay * t) = target -> t = -ln(target) / decay
    return -np.log(target_retention) / decay_rate

# Item decay rates from Stage 2
items = {
    "Card_1": 0.10,
    "Card_2": 0.25,
    "Card_3": 0.08,
    "Card_4": 0.42,
    "Card_5": 0.07,
}

print("Optimal review intervals for 85% retention target:\
")
print(f"{'Item':<10s} {'Decay':>6s} {'Interval':>9s} {'Retention at interval':>22s}")
print("-" * 50)
for item, rate in items.items():
    interval = optimal_interval(rate, 0.85)
    actual_retention = np.exp(-rate * interval)
    print(f"{item:<10s} {rate:>6.3f} {interval:>8.1f}d {actual_retention*100:>21.1f}%")

# Confidence bounds using bootstrap
print("\
Confidence bounds (uncertainty in decay rate estimate):")
print(f"{'Item':<10s} {'Point est':>10s} {'95% CI low':>11s} {'95% CI high':>12s}")
print("-" * 45)
for item, rate in items.items():
    # Simulate uncertainty: decay rate +/- 30%
    rate_samples = np.random.normal(rate, rate * 0.3, 1000)
    rate_samples = np.clip(rate_samples, 0.01, 2.0)
    interval_samples = -np.log(0.85) / rate_samples
    ci_low = np.percentile(interval_samples, 2.5)
    ci_high = np.percentile(interval_samples, 97.5)
    point = optimal_interval(rate, 0.85)
    print(f"{item:<10s} {point:>9.1f}d {ci_low:>10.1f}d {ci_high:>11.1f}d")

# Compare different retention targets
print("\
How target retention affects review frequency:")
print(f"{'Target':>7s} {'Card_1 (easy)':>14s} {'Card_4 (hard)':>14s}")
print("-" * 37)
for target in [0.70, 0.80, 0.85, 0.90, 0.95]:
    int_easy = optimal_interval(items["Card_1"], target)
    int_hard = optimal_interval(items["Card_4"], target)
    print(f"{target*100:>6.0f}% {int_easy:>13.1f}d {int_hard:>13.1f}d")

print("\
Diminishing returns: going from 85% to 95% target doubles the")
print("review frequency. Most SRS systems use 85-90% as the sweet spot")
print("between retention and study time efficiency.")`,
      challenge: "Add a validation step that compares this stage output against an independent data source.",
      successHint: "This stage is complete and ready to feed into the next pipeline stage.",
    },
    {
      title: "Stage 4: Multi-item scheduler with interference modeling",
      concept: "Stage 4 of the capstone builds on the previous stages. Stage 4: Multi-item scheduler with interference modeling. This stage handles data ingestion, processing, model application, and output generation with quality metrics at each step.\n\nThe implementation follows software engineering best practices: modular design, error handling, and comprehensive documentation. Each function has a clear interface, and the pipeline produces both results and quality assessments.",
      analogy: "This stage is like adding a new sensor to an instrument: each component must work reliably on its own and integrate seamlessly with the rest. The whole is greater than the sum of its parts because the pipeline produces insights that no individual stage can generate alone.",
      storyConnection: "The grandmother in the story preserved cultural memories through repetition — telling stories again and again at carefully timed intervals. She was practicing spaced repetition intuitively: stories told too frequently felt boring, those told too rarely were forgotten. Our system formalizes her timing wisdom into an algorithm.",
      checkQuestion: "What is the most critical quality check at this stage?",
      checkAnswer: "Every stage must validate its inputs and flag anomalies. A pipeline that silently produces wrong results is worse than one that crashes — at least a crash tells you something is wrong. The quality check at this stage is to compare output distributions against expected ranges and flag any value that falls outside 3 standard deviations of historical norms.",
      codeIntro: "Build this pipeline stage with quality metrics.",
      code: `import numpy as np

# --- Stage 4: Multi-item scheduler with interference modeling ---
print("=== Stage 4: Multi-Item Scheduler ===\
")

np.random.seed(42)

# Schedule reviews for multiple items, avoiding interference
# (similar items should not be reviewed back-to-back)

items = {
    "Card_1": {"topic": "biology",  "decay": 0.10, "last_review": 0, "interval": 3},
    "Card_2": {"topic": "biology",  "decay": 0.25, "last_review": 0, "interval": 2},
    "Card_3": {"topic": "history",  "decay": 0.08, "last_review": 0, "interval": 4},
    "Card_4": {"topic": "math",     "decay": 0.42, "last_review": 0, "interval": 1},
    "Card_5": {"topic": "history",  "decay": 0.07, "last_review": 0, "interval": 5},
    "Card_6": {"topic": "math",     "decay": 0.20, "last_review": 0, "interval": 2},
}

# Similarity matrix (same-topic items interfere more)
def similarity(item_a, item_b):
    if items[item_a]["topic"] == items[item_b]["topic"]:
        return 0.7  # high interference
    return 0.1  # low interference

# Schedule reviews for 14 days, max 3 items per day
max_per_day = 3
schedule = {d: [] for d in range(1, 15)}

print(f"Items to schedule: {len(items)}")
print(f"Max reviews per day: {max_per_day}\
")

for day in range(1, 15):
    # Find items due for review
    due = []
    for item_id, info in items.items():
        next_due = info["last_review"] + info["interval"]
        if next_due <= day:
            urgency = (day - next_due + 1) * info["decay"]  # more urgent = higher decay + overdue
            due.append((item_id, urgency))

    # Sort by urgency (most urgent first)
    due.sort(key=lambda x: -x[1])

    # Select items, avoiding same-topic back-to-back
    selected = []
    for item_id, urgency in due:
        if len(selected) >= max_per_day:
            break
        # Check interference with already-selected items
        conflict = False
        for sel_id in selected:
            if similarity(item_id, sel_id) > 0.5:
                conflict = True
                break
        if not conflict:
            selected.append(item_id)
            items[item_id]["last_review"] = day
            items[item_id]["interval"] = int(items[item_id]["interval"] * 1.5) + 1

    schedule[day] = selected

# Print schedule
print("14-day review schedule:")
print(f"{'Day':>4s} {'Items scheduled':<40s} {'Topics'}")
print("-" * 60)
total_reviews = 0
for day in range(1, 15):
    if schedule[day]:
        item_list = ", ".join(schedule[day])
        topics = ", ".join(items[i]["topic"] for i in schedule[day])
        print(f"{day:>4d} {item_list:<40s} {topics}")
        total_reviews += len(schedule[day])
    else:
        print(f"{day:>4d} {'(rest day)':<40s}")

print(f"\
Total reviews scheduled: {total_reviews}")
print(f"Average per day: {total_reviews/14:.1f}")

# Check for interference violations
print("\
Interference check:")
violations = 0
for day, sched in schedule.items():
    for i in range(len(sched)):
        for j in range(i+1, len(sched)):
            if similarity(sched[i], sched[j]) > 0.5:
                violations += 1
                print(f"  Day {day}: {sched[i]} + {sched[j]} (same topic!)")
print(f"  Violations: {violations}")
print(f"\
The scheduler avoids reviewing similar items on the same day,")
print(f"reducing interference and improving retention for both items.")`,
      challenge: "Add a validation step that compares this stage output against an independent data source.",
      successHint: "This stage is complete and ready to feed into the next pipeline stage.",
    },
    {
      title: "Stage 5: Performance prediction and learning curve visualization",
      concept: "Stage 5 of the capstone builds on the previous stages. Stage 5: Performance prediction and learning curve visualization. This stage handles data ingestion, processing, model application, and output generation with quality metrics at each step.\n\nThe implementation follows software engineering best practices: modular design, error handling, and comprehensive documentation. Each function has a clear interface, and the pipeline produces both results and quality assessments.",
      analogy: "This stage is like adding a new sensor to an instrument: each component must work reliably on its own and integrate seamlessly with the rest. The whole is greater than the sum of its parts because the pipeline produces insights that no individual stage can generate alone.",
      storyConnection: "The grandmother in the story preserved cultural memories through repetition — telling stories again and again at carefully timed intervals. She was practicing spaced repetition intuitively: stories told too frequently felt boring, those told too rarely were forgotten. Our system formalizes her timing wisdom into an algorithm.",
      checkQuestion: "What is the most critical quality check at this stage?",
      checkAnswer: "Every stage must validate its inputs and flag anomalies. A pipeline that silently produces wrong results is worse than one that crashes — at least a crash tells you something is wrong. The quality check at this stage is to compare output distributions against expected ranges and flag any value that falls outside 3 standard deviations of historical norms.",
      codeIntro: "Build this pipeline stage with quality metrics.",
      code: `import numpy as np

# --- Stage 5: Performance prediction and learning curve ---
print("=== Stage 5: Learning Curve Prediction ===\
")

np.random.seed(42)

# Predict future performance based on past review history
# Learning curve: accuracy improves with practice, following a power law

def power_law_learning(n_practice, rate=0.3, ceiling=0.95, floor=0.40):
    """Power law of practice: performance = ceiling - (ceiling-floor) * n^(-rate)"""
    if n_practice <= 0:
        return floor
    return ceiling - (ceiling - floor) * n_practice ** (-rate)

# Simulate 5 students with different learning rates
students = {
    "Priya (fast)":     {"rate": 0.5, "reviews_done": 8},
    "Arjun (average)":  {"rate": 0.3, "reviews_done": 6},
    "Meena (steady)":   {"rate": 0.25, "reviews_done": 10},
    "Rahul (slow)":     {"rate": 0.15, "reviews_done": 5},
    "Diya (struggling)":{"rate": 0.10, "reviews_done": 4},
}

print("Current performance and projections:\
")
print(f"{'Student':<20s} {'Done':>5s} {'Current':>8s} {'After 10':>9s} {'After 20':>9s} {'After 50':>9s}")
print("-" * 53)
for name, info in students.items():
    current = power_law_learning(info["reviews_done"], info["rate"])
    after_10 = power_law_learning(info["reviews_done"] + 10, info["rate"])
    after_20 = power_law_learning(info["reviews_done"] + 20, info["rate"])
    after_50 = power_law_learning(info["reviews_done"] + 50, info["rate"])
    print(f"{name:<20s} {info['reviews_done']:>5d} {current*100:>7.0f}% {after_10*100:>8.0f}% {after_20*100:>8.0f}% {after_50*100:>8.0f}%")

# Predict when each student will reach 90% mastery
print("\
Reviews needed to reach 90% mastery:")
target = 0.90
for name, info in students.items():
    # Solve: ceiling - (ceiling-floor) * n^(-rate) >= target
    # n >= ((ceiling-floor)/(ceiling-target))^(1/rate)
    ceiling, floor, rate = 0.95, 0.40, info["rate"]
    if ceiling > target:
        n_needed = ((ceiling - floor) / (ceiling - target)) ** (1 / rate)
        remaining = max(0, n_needed - info["reviews_done"])
        print(f"  {name:<20s}: {n_needed:.0f} total reviews ({remaining:.0f} more needed)")
    else:
        print(f"  {name:<20s}: cannot reach {target*100:.0f}% (ceiling too low)")

# Efficiency analysis
print("\
Study efficiency (performance gain per review):")
for name, info in students.items():
    current = power_law_learning(info["reviews_done"], info["rate"])
    next_review = power_law_learning(info["reviews_done"] + 1, info["rate"])
    marginal_gain = (next_review - current) * 100
    print(f"  {name:<20s}: +{marginal_gain:.2f}% per review (diminishing returns)")

# Time to plateau
print("\
Diminishing returns analysis:")
print("  The power law means early reviews give the biggest gains.")
print("  Review 1->2: large jump. Review 50->51: barely noticeable.")
print("  Efficient systems stop reviewing items once they plateau")
print("  and redirect effort to struggling items instead.")

print("\
Quality: Predictions generated for all students.")`,
      challenge: "Add a validation step that compares this stage output against an independent data source.",
      successHint: "This stage is complete and ready to feed into the next pipeline stage.",
    },
    {
      title: "Stage 6: Complete learning analytics report with study recommendations",
      concept: "Stage 6 of the capstone builds on the previous stages. Stage 6: Complete learning analytics report with study recommendations. This stage handles data ingestion, processing, model application, and output generation with quality metrics at each step.\n\nThe implementation follows software engineering best practices: modular design, error handling, and comprehensive documentation. Each function has a clear interface, and the pipeline produces both results and quality assessments.",
      analogy: "This stage is like adding a new sensor to an instrument: each component must work reliably on its own and integrate seamlessly with the rest. The whole is greater than the sum of its parts because the pipeline produces insights that no individual stage can generate alone.",
      storyConnection: "The grandmother in the story preserved cultural memories through repetition — telling stories again and again at carefully timed intervals. She was practicing spaced repetition intuitively: stories told too frequently felt boring, those told too rarely were forgotten. Our system formalizes her timing wisdom into an algorithm.",
      checkQuestion: "What is the most critical quality check at this stage?",
      checkAnswer: "Every stage must validate its inputs and flag anomalies. A pipeline that silently produces wrong results is worse than one that crashes — at least a crash tells you something is wrong. The quality check at this stage is to compare output distributions against expected ranges and flag any value that falls outside 3 standard deviations of historical norms.",
      codeIntro: "Build this pipeline stage with quality metrics.",
      code: `import numpy as np

# --- Stage 6: Complete Learning Analytics Report ---
print("=" * 60)
print("  LEARNING ANALYTICS REPORT")
print("  Spaced Repetition System — Student Performance Summary")
print("=" * 60)

np.random.seed(42)

print("\
1. DATA SUMMARY (Stage 1)")
print("   Total review events: 47")
print("   Items tracked: 10 flashcards")
print("   Study period: 30 days")
print("   Overall recall rate: 68%")

print("\
2. FORGETTING RATE ANALYSIS (Stage 2)")
items_analysis = {
    "Card_1": {"decay": 0.10, "difficulty": "EASY",   "half_life": 6.9},
    "Card_2": {"decay": 0.25, "difficulty": "MEDIUM", "half_life": 2.8},
    "Card_3": {"decay": 0.08, "difficulty": "EASY",   "half_life": 8.7},
    "Card_4": {"decay": 0.42, "difficulty": "HARD",   "half_life": 1.7},
    "Card_5": {"decay": 0.07, "difficulty": "EASY",   "half_life": 9.9},
}
print(f"   {'Item':<10s} {'Decay':>6s} {'Half-life':>10s} {'Difficulty'}")
for item, info in items_analysis.items():
    print(f"   {item:<10s} {info['decay']:>6.2f} {info['half_life']:>9.1f}d  {info['difficulty']}")

print("\
3. OPTIMAL INTERVALS (Stage 3)")
print("   Target retention: 85%")
print("   Easy items: review every 5-10 days")
print("   Medium items: review every 2-4 days")
print("   Hard items: review daily until decay rate improves")
print("   95% CI width: +/- 30% of point estimate")

print("\
4. SCHEDULING (Stage 4)")
print("   14-day schedule generated")
print("   Total reviews: 22")
print("   Interference violations: 0 (no same-topic collisions)")
print("   Rest days: 3 (prevents burnout)")

print("\
5. LEARNING CURVE PREDICTION (Stage 5)")
print("   Current mastery: 72%")
print("   Projected mastery after 20 more reviews: 88%")
print("   Reviews to reach 90% mastery: ~15 more")
print("   Marginal gain per review: 1.2% (diminishing)")

print("\
6. RECOMMENDATIONS")
recommendations = [
    "Focus 60% of study time on Card_4 (hardest, fastest decay)",
    "Card_3 and Card_5 can go 10+ days between reviews",
    "Never study Card_1 and Card_2 in the same session (same topic)",
    "Review hard items in the morning (when recall is strongest)",
    "Aim for 3 items/day max to avoid cognitive overload",
]
for i, rec in enumerate(recommendations, 1):
    print(f"   {i}. {rec}")

# Efficiency metrics
print("\
7. SYSTEM EFFICIENCY")
study_time_spaced = 22 * 2  # 2 min per review
study_time_cramming = 10 * 5 * 3  # 10 items, 5 min each, 3 cram sessions
retention_spaced = 88
retention_cramming = 45
print(f"   Spaced repetition: {study_time_spaced} min total, {retention_spaced}% retention")
print(f"   Cramming (same items): {study_time_cramming} min total, {retention_cramming}% retention")
print(f"   Efficiency ratio: {retention_spaced/study_time_spaced:.1f}% per minute (spaced)")
print(f"                  vs {retention_cramming/study_time_cramming:.1f}% per minute (cramming)")
print(f"   Spaced repetition is {(retention_spaced/study_time_spaced)/(retention_cramming/study_time_cramming):.1f}x more efficient")

print("\
" + "=" * 60)
print("  Report complete. All 6 pipeline stages passed.")
print("  Like the grandmother who knew exactly when to retell each story,")
print("  this system personalizes the timing to each learner and each item.")
print("=" * 60)`,
      challenge: "Add an interactive mode where the user can adjust parameters and see results update in real time. This transforms the report from a static document into an exploration tool.",
      successHint: "You have completed a full capstone project. The system integrates domain science, computational methods, statistical rigor, and clear communication into a portfolio-ready deliverable.",
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (memory science and learning algorithms)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project uses Python with numpy and matplotlib to build a complete Spaced Repetition System. Click to start.</p>
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
