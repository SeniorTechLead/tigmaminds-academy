import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';
import ElephantPipelineDiagram from '../diagrams/ElephantPipelineDiagram';
import ElephantFeatureVectorDiagram from '../diagrams/ElephantFeatureVectorDiagram';
import ElephantKNNVoteDiagram from '../diagrams/ElephantKNNVoteDiagram';
import ElephantConfusionMatrixDiagram from '../diagrams/ElephantConfusionMatrixDiagram';
import ElephantCrossValDiagram from '../diagrams/ElephantCrossValDiagram';
import ElephantDeployDiagram from '../diagrams/ElephantDeployDiagram';

export default function ElephantLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Project Design: Elephant Rumble Classifier Pipeline',
      concept: `In Level 3 you learned feature engineering and train/test splits using elephant audio data. Now you build the complete system: a production-grade Elephant Rumble Classifier that takes raw audio and outputs a mood prediction with confidence scores.

Elephants produce at least six distinct vocalization types, each encoding emotional state: **rumbles** (contact, reassurance — low frequency 14-35 Hz), **trumpets** (excitement, alarm — broadband 300-3000 Hz), **roars** (aggression — mid-frequency with strong harmonics), **barks** (playfulness — short staccato bursts), **cries** (distress — high fundamental with wavering pitch), and **snorts** (contentment — broadband noise, no tonal structure).

Our classifier pipeline has four stages. First, **audio ingestion**: loading and preprocessing raw recordings (resampling, normalization, silence removal). Second, **feature extraction**: computing a feature vector from each clip using spectral, temporal, and cepstral features. Third, **classification**: training a model to map feature vectors to mood labels, with probability calibration. Fourth, **evaluation**: confusion matrix analysis, per-class precision/recall, and identification of failure modes. By the end of this capstone you will have a deployable system that a conservation team could use in the field.`,
      analogy: 'Building this classifier is like training a new field researcher to identify elephant moods. You do not just hand them a textbook — you play hundreds of recordings, teach them what to listen for (feature extraction), quiz them with clips they have never heard (train/test split), grade their answers (confusion matrix), and identify which calls they confuse most often (error analysis). Only after this full pipeline are they ready for fieldwork.',
      storyConnection: 'The girl who spoke to elephants had years of immersive experience to develop her intuition about elephant mood. Our classifier replicates that intuition computationally — extracting the same acoustic cues she uses (pitch, rhythm, intensity, timbre) and learning the same category boundaries. The difference is that our system can be deployed on dozens of monitoring stations simultaneously, scaling one person\'s expertise across an entire elephant corridor.',
      checkQuestion: 'Why do we need at least six mood categories rather than a simple binary "calm vs. agitated" classifier?',
      checkAnswer: 'Different moods require different conservation responses. A contact rumble (calm) needs no intervention. A distress cry requires immediate investigation. An aggression roar near a village border triggers a conflict-prevention protocol. A binary classifier would conflate alarm trumpets with playful barks, both being "agitated." Fine-grained classification enables fine-grained response — which is essential for effective wildlife management.',
      codeIntro: 'Define six elephant moods, synthesize audio for each, and build the dataset.',
      code: `import numpy as np

np.random.seed(42)
sr = 8000; dur = 2; n = sr * dur
t = np.linspace(0, dur, n, endpoint=False)

# 6 moods: each has a base frequency + envelope shape
MOODS = {
    'contact_rumble': (22, 'sustained'),
    'alarm_trumpet':  (800, 'attack'),
    'aggression_roar':(150, 'crescendo'),
    'playful_bark':   (400, 'staccato'),
    'distress_cry':   (500, 'wavering'),
    'content_snort':  (0, 'noise'),
}

def make_envelope(kind, n):
    te = np.linspace(0, 1, n)
    if kind == 'sustained': return 0.8 + 0.2*np.sin(2*np.pi*0.5*te)
    if kind == 'attack':    return np.exp(-3*te) * (1 - np.exp(-50*te))
    if kind == 'crescendo': return te**1.5
    if kind == 'staccato':  return (np.sin(2*np.pi*4*te) > 0).astype(float)
    if kind == 'wavering':  return 0.5 + 0.5*np.sin(2*np.pi*3*te)
    return np.exp(-8*te)  # noise/burst

def synthesize(mood, variation=0.15):
    freq, env_type = MOODS[mood]
    fv = 1 + np.random.uniform(-variation, variation)
    sig = np.sin(2*np.pi*freq*fv*t) if freq > 0 else np.zeros(n)
    sig += 0.1*np.random.randn(n)
    sig *= make_envelope(env_type, n)
    return sig / (np.abs(sig).max() + 1e-10) * 0.9

# Generate 30 clips per mood = 180 total
clips, labels = [], []
for mood in MOODS:
    for _ in range(30):
        clips.append(synthesize(mood))
        labels.append(mood)

X_raw = np.array(clips)
y = np.array(labels)
print(f"Dataset: {len(y)} clips × {n} samples each")
print(f"Moods: {list(MOODS.keys())}")
print(f"30 clips per mood, each with random variation")
print("\
Stage 1 complete: synthetic dataset ready for feature extraction.")`,
      challenge: 'Add a seventh mood category: "greeting_rumble" — similar to contact_rumble but with a rising pitch (frequency modulation). Synthesize it and visually confirm it looks different from the flat contact_rumble.',
      successHint: 'A well-defined taxonomy and realistic synthetic data are the foundation of any classification system. In real conservation work, these categories come from decades of ethological research. Your synthetic data captures the essential acoustic distinctions that a classifier needs to learn.',
    },
    {
      title: 'Feature Extraction: From Waveforms to Feature Vectors',
      concept: `Raw audio is too high-dimensional for direct classification. A 2-second clip at 22050 Hz contains 44,100 numbers. We need to compress this into a small, informative feature vector — typically 10-20 numbers that capture what matters about the sound.

The most powerful features for animal vocalization classification are:

**Spectral features** (what frequencies are present):
- **Spectral centroid**: center of mass of the frequency spectrum. Rumbles have low centroids (~30 Hz); trumpets have high centroids (~1000 Hz).
- **Spectral bandwidth**: spread of frequencies. Pure tones have narrow bandwidth; noisy calls have wide bandwidth.
- **Spectral rolloff**: frequency below which 85% of energy sits.

**Temporal features** (how the sound evolves over time):
- **RMS energy**: overall loudness of the signal.
- **Zero-crossing rate (ZCR)**: how often the signal crosses zero. High for noise, low for tonal sounds.
- **Envelope variance**: how much the amplitude changes over time. Staccato barks have high variance; sustained rumbles have low variance.

**Cepstral features** (compact representation of spectral shape):
- **MFCCs (Mel-Frequency Cepstral Coefficients)**: the standard feature for audio classification. They capture the shape of the spectral envelope on a perceptually-motivated frequency scale. We compute a simplified version using the DCT of the log-magnitude spectrum.

Together, these features create a compact "fingerprint" of each vocalization that a classifier can learn to distinguish.`,
      analogy: 'Feature extraction is like a wine sommelier describing a wine. They do not describe every molecule — they note color, aroma, body, tannins, acidity, finish. These six descriptors are enough to distinguish a Cabernet from a Pinot Noir. Our spectral features are the acoustic equivalent — a compact description that captures what makes each elephant call unique.',
      storyConnection: 'When the girl listened to the elephants, she did not process 22,050 air pressure measurements per second consciously. Her auditory system automatically extracted features: pitch (spectral centroid), loudness (RMS), roughness (bandwidth), and temporal pattern (envelope). Our feature extraction pipeline replicates this biological signal processing in code.',
      checkQuestion: 'Why would using only the spectral centroid be insufficient to distinguish a distress cry from a playful bark, even though they have different fundamental frequencies?',
      checkAnswer: 'Both calls have moderate fundamental frequencies (400-500 Hz), so their spectral centroids could overlap. The key difference is temporal: barks are staccato (high envelope variance, short bursts) while cries are wavering (sinusoidal amplitude modulation). You need temporal features like envelope variance and ZCR to separate them. This is why multi-dimensional feature vectors outperform any single feature.',
      codeIntro: 'Extract 8 acoustic features from each clip — compressing 16,000 samples into 8 numbers.',
      code: `import numpy as np

# Reuse synthesize from Lesson 1 (run that first)
np.random.seed(42)
sr = 8000; dur = 2; n = sr*dur; t = np.linspace(0, dur, n, endpoint=False)
MOODS = {'contact_rumble':(22,'sustained'), 'alarm_trumpet':(800,'attack'),
         'aggression_roar':(150,'crescendo'), 'playful_bark':(400,'staccato'),
         'distress_cry':(500,'wavering'), 'content_snort':(0,'noise')}

def make_env(kind, n):
    te = np.linspace(0,1,n)
    if kind=='sustained': return 0.8+0.2*np.sin(2*np.pi*0.5*te)
    if kind=='attack': return np.exp(-3*te)*(1-np.exp(-50*te))
    if kind=='crescendo': return te**1.5
    if kind=='staccato': return (np.sin(2*np.pi*4*te)>0).astype(float)
    if kind=='wavering': return 0.5+0.5*np.sin(2*np.pi*3*te)
    return np.exp(-8*te)

def synth(mood):
    f, env = MOODS[mood]; fv = 1+np.random.uniform(-0.15,0.15)
    s = np.sin(2*np.pi*f*fv*t) if f>0 else np.zeros(n)
    s += 0.1*np.random.randn(n); s *= make_env(env,n)
    return s/(np.abs(s).max()+1e-10)*0.9

def extract(sig):
    frame = sig[n//2-512:n//2+512] * np.hanning(1024)
    spec = np.abs(np.fft.rfft(frame))
    freqs = np.fft.rfftfreq(1024, 1/sr)
    p = spec / (spec.sum()+1e-10)
    centroid = (freqs * p).sum()
    bw = np.sqrt(((freqs - centroid)**2 * p).sum())
    rolloff = freqs[min(np.searchsorted(np.cumsum(spec), 0.85*spec.sum()), len(freqs)-1)]
    rms = np.sqrt(np.mean(sig**2))
    zcr = np.mean(np.abs(np.diff(np.sign(sig)))) / 2
    # Envelope variance (how much volume fluctuates)
    frames = [np.sqrt(np.mean(sig[i*800:(i+1)*800]**2)) for i in range(n//800)]
    env_var = np.var(frames) if frames else 0
    return [centroid, bw, rolloff, rms, zcr, env_var]

# Build feature matrix: 30 clips × 6 moods = 180 samples, 6 features each
X, y = [], []
for mood in MOODS:
    for _ in range(30):
        X.append(extract(synth(mood))); y.append(mood)
X = np.array(X); y = np.array(y)

# Standardize
X = (X - X.mean(axis=0)) / (X.std(axis=0) + 1e-10)

names = ['Centroid','Bandwidth','Rolloff','RMS','ZCR','EnvVar']
print(f"Feature matrix: {X.shape[0]} clips × {X.shape[1]} features")
print(f"\
{'Feature':<12} {'Mean':>8} {'Std':>8}")
for i, nm in enumerate(names):
    print(f"{nm:<12} {X[:,i].mean():>8.2f} {X[:,i].std():>8.2f}")
print("\
16,000 samples per clip → 6 numbers. That's feature engineering.")`,
      challenge: 'Add spectral flatness as a 9th feature: the geometric mean of the spectrum divided by the arithmetic mean. This measures how "noise-like" vs "tonal" a sound is. Does it help distinguish content_snort from other categories?',
      successHint: 'Eight features compress 44,100 raw samples into 8 informative numbers — a 5,500x compression with minimal information loss for classification. The feature space visualization shows that moods cluster in distinct regions, which is exactly what a classifier needs.',
    },
    {
      title: 'Building the Classifier: K-Nearest Neighbors from Scratch',
      concept: `With features extracted, we need an algorithm that learns the mapping from feature vectors to mood labels. We will implement **K-Nearest Neighbors (KNN)** from scratch — it is conceptually simple but surprisingly effective, and understanding it deeply prepares you for more complex algorithms.

**How KNN works:**
1. Store all training examples (feature vectors + labels) in memory.
2. When a new sample arrives, compute its **distance** to every training example.
3. Find the **K closest** training examples (the "neighbors").
4. The predicted label is the **majority vote** among those K neighbors.
5. The **confidence** is the fraction of neighbors voting for the winning label.

**Key design decisions:**
- **Distance metric**: Euclidean distance is standard, but for audio features with different scales, we must standardize first. Manhattan distance (L1) is more robust to outliers.
- **K value**: Too small (K=1) overfits to noise — one mislabeled training example corrupts predictions. Too large (K=50) oversmooths — distant, irrelevant examples dilute the vote. Cross-validation finds the sweet spot.
- **Weighted voting**: Instead of equal votes, weight each neighbor by 1/distance — closer neighbors have more influence.

**Why KNN before neural networks?** KNN has zero training time, is fully interpretable (you can inspect which neighbors drove the decision), and requires no gradient descent. It is the ideal baseline classifier — if KNN works well, the features are good. If it fails, no algorithm will save bad features.`,
      analogy: 'KNN is like asking your neighbors for restaurant recommendations. If the 5 people closest to your house all recommend the same Thai place, it is probably good. But if you ask your 50 nearest neighbors (including people in the next town), their recommendations dilute into noise. K controls how local your polling is.',
      storyConnection: 'The girl who spoke to elephants learned by association. When she heard a new sound, she compared it to every sound she remembered (her "training set"), found the most similar ones, and concluded the new sound meant the same thing. This is exactly KNN — classify by similarity to stored examples. Her years of experience gave her a large, diverse training set.',
      checkQuestion: 'With K=1 and a training set containing one mislabeled example (a rumble accidentally labeled as a trumpet), what happens when a new rumble arrives that is closest to the mislabeled example?',
      checkAnswer: 'It gets classified as a trumpet — completely wrong. With K=1, a single mislabeled neighbor is fatal. With K=5, the four correctly-labeled rumble neighbors would outvote the one mislabeled example. This is why K>1 provides robustness to label noise. In field data, mislabeling is common (recorders malfunction, annotations are ambiguous), so robustness matters.',
      codeIntro: 'Build KNN for 6 moods, test different K values, and find the best.',
      code: `import numpy as np

# Assumes X (features) and y (labels) from Lesson 2
# Regenerate quickly if running standalone:
np.random.seed(42)
sr=8000; n=16000; t=np.linspace(0,2,n)
MOODS={'rumble':(22,'sus'),'trumpet':(800,'atk'),'roar':(150,'cres'),
       'bark':(400,'stac'),'cry':(500,'wav'),'snort':(0,'noise')}
def _s(mood):
    f,_=MOODS[mood]; fv=1+np.random.uniform(-.15,.15)
    s=np.sin(2*np.pi*f*fv*t) if f>0 else np.zeros(n)
    return s+0.1*np.random.randn(n)
def _f(sig):
    sp=np.abs(np.fft.rfft(sig[:1024]*np.hanning(1024)))
    fq=np.fft.rfftfreq(1024,1/sr); p=sp/(sp.sum()+1e-10)
    c=(fq*p).sum(); bw=np.sqrt(((fq-c)**2*p).sum())
    return [c, bw, np.sqrt(np.mean(sig**2)), np.mean(np.abs(np.diff(np.sign(sig))))/2]

X,y=[],[]
for mood in MOODS:
    for _ in range(30): X.append(_f(_s(mood))); y.append(mood)
X=np.array(X); y=np.array(y)
X=(X-X.mean(0))/(X.std(0)+1e-10)

# Split 75/25
idx=np.random.permutation(len(y)); sp=int(.75*len(y))
Xtr,Xte,ytr,yte = X[idx[:sp]],X[idx[sp:]],y[idx[:sp]],y[idx[sp:]]

def knn(Xtr, ytr, x, k=5):
    d = np.sqrt(np.sum((Xtr-x)**2, axis=1))
    nn = ytr[np.argsort(d)[:k]]
    cls, cnt = np.unique(nn, return_counts=True)
    return cls[np.argmax(cnt)]

# Try different k values
for k in [1, 3, 5, 7, 11]:
    tr = np.mean([knn(Xtr,ytr,x,k)==l for x,l in zip(Xtr,ytr)])
    te = np.mean([knn(Xtr,ytr,x,k)==l for x,l in zip(Xte,yte)])
    print(f"k={k:2d}  train={tr:.1%}  test={te:.1%}")

print("\
Small k → overfits. Large k → underfits. Cross-validate to find the sweet spot.")`,
      challenge: 'Implement Manhattan distance (L1 norm) as an alternative to Euclidean distance. Compare test accuracy. Which works better for this dataset, and why might that be?',
      successHint: 'KNN is the ultimate interpretable baseline. When it achieves high accuracy, it proves the features are well-separated. When it fails, it tells you exactly where — you can inspect the misclassified neighbors to understand confusion patterns.',
    },
    {
      title: 'Confusion Matrix Analysis: Understanding Failure Modes',
      concept: `Overall accuracy is a dangerous metric. A classifier that is 90% accurate sounds great — but what if it never detects distress calls? In conservation, missing a distress call could mean an injured elephant goes unrescued. Missing an aggression warning near a village could mean a deadly human-elephant conflict.

The **confusion matrix** reveals what accuracy hides. It is an N x N grid where rows represent true labels and columns represent predicted labels. Each cell (i, j) counts how many samples with true label i were predicted as label j. The diagonal shows correct predictions; off-diagonal cells show errors.

From the confusion matrix, we compute **per-class metrics**:
- **Precision** for class C: of all samples PREDICTED as C, what fraction truly are C? Low precision means many false alarms.
- **Recall** for class C: of all samples that truly ARE C, what fraction were correctly predicted? Low recall means many missed detections.
- **F1 score**: harmonic mean of precision and recall — balances both.

In conservation, recall for distress_cry and aggression_roar matters more than precision — you would rather investigate a false alarm than miss a real emergency. This is called **asymmetric cost**, and it changes how you evaluate and tune the classifier.`,
      analogy: 'A confusion matrix is like a teacher reviewing exam answers category by category. Instead of saying "the class got 85% overall," the teacher notes: "everyone got algebra right, but 40% confused sine and cosine, and nobody could do integration." That detailed breakdown reveals exactly where to focus remedial teaching — which is much more useful than the aggregate score.',
      storyConnection: 'If the girl who spoke to elephants confused a distress cry with a playful bark, the consequences would be severe — she might ignore a calf in danger. The confusion matrix quantifies exactly this risk: how often does the system confuse safety-critical categories? In her case, years of practice drove the confusion rate to near zero. Our classifier aims for the same reliability.',
      checkQuestion: 'A classifier has 95% recall for alarm_trumpet but only 60% precision. What does this mean in practice for a ranger station receiving alerts?',
      checkAnswer: 'The ranger station catches 95% of real alarm trumpets (high recall — very few emergencies are missed). But 40% of the alerts it sends are false alarms (low precision — other sounds misclassified as trumpets). The rangers would be dispatched frequently for non-emergencies, leading to alert fatigue. The fix is either better features to reduce false positives, or a confirmation step where a second model verifies the alert.',
      codeIntro: 'Build a confusion matrix and compute precision/recall per mood — which confusions are dangerous?',
      code: `import numpy as np

# Use data from Lesson 3 (regenerate if standalone)
np.random.seed(42)
moods = ['rumble','trumpet','roar','bark','cry','snort']
n_cls = len(moods)

# Simulate predictions: mostly correct, some confusions
n_test = 30  # per class
y_true = np.repeat(moods, n_test)
# Simulate a decent classifier (85% correct, specific confusions)
y_pred = y_true.copy()
rng = np.random.RandomState(42)
for i in range(len(y_pred)):
    if rng.random() < 0.15:  # 15% error rate
        y_pred[i] = rng.choice(moods)

# Build confusion matrix
cm = np.zeros((n_cls, n_cls), dtype=int)
for t, p in zip(y_true, y_pred):
    cm[moods.index(t), moods.index(p)] += 1

# Per-class precision, recall, F1
print(f"{'Mood':<10} {'Prec':>6} {'Recall':>6} {'F1':>6}")
print("-" * 30)
for i, mood in enumerate(moods):
    tp = cm[i,i]; fp = cm[:,i].sum()-tp; fn = cm[i,:].sum()-tp
    prec = tp/(tp+fp) if tp+fp else 0
    rec = tp/(tp+fn) if tp+fn else 0
    f1 = 2*prec*rec/(prec+rec) if prec+rec else 0
    print(f"{mood:<10} {prec:>6.2f} {rec:>6.2f} {f1:>6.2f}")

print(f"\
Overall accuracy: {np.trace(cm)/cm.sum():.1%}")

# Find worst confusions
cm_off = cm.copy(); np.fill_diagonal(cm_off, 0)
print("\
Worst confusions:")
for _ in range(3):
    i, j = np.unravel_index(cm_off.argmax(), cm_off.shape)
    if cm_off[i,j] > 0:
        print(f"  {moods[i]} → {moods[j]}: {cm_off[i,j]} errors")
        cm_off[i,j] = 0

print("\
For conservation: low recall on 'cry' = missed distress calls.")`,
      challenge: 'Compute a "conservation risk score" by weighting misclassifications asymmetrically: confusing distress_cry or aggression_roar with a benign class costs 10x more than other errors. Report the weighted error rate alongside the unweighted one.',
      successHint: 'The confusion matrix is the most important evaluation tool in applied ML. It reveals not just how often the model is wrong, but HOW it is wrong — which errors are dangerous, which are benign, and where to focus improvement efforts.',
    },
    {
      title: 'Cross-Validation and Model Comparison',
      concept: `A single train/test split gives you one number. But how reliable is that number? If you happened to put all the easy examples in the test set, accuracy looks inflated. If all the hard examples landed there, accuracy looks deflated. You need to measure **stability**.

**K-fold cross-validation** solves this:
1. Shuffle the data and split it into K equal folds (e.g., K=5).
2. For each fold i: train on all folds EXCEPT i, test on fold i.
3. You get K accuracy scores. Report the **mean** and **standard deviation**.
4. The mean estimates true performance; the std tells you how much it varies.

This also enables fair **model comparison**. To compare KNN vs a different classifier, run both through the same K folds. The model with higher mean accuracy (or F1) wins — but only if the difference exceeds the standard deviation. A difference of 1% with std=5% is meaningless; a difference of 8% with std=2% is significant.

We will also implement a simple **centroid classifier** as a second model: compute the mean feature vector for each class in the training set, then classify new samples by nearest centroid. It is much faster than KNN (no need to store all training data) but less flexible (assumes spherical class boundaries).`,
      analogy: 'K-fold cross-validation is like testing a student with 5 different exams instead of one. If they score 90, 88, 92, 87, 91, you are confident they are an A student (mean=89.6, low variance). If they score 95, 60, 85, 40, 90, the average is 74 but the variance is huge — their performance is unstable and you cannot trust the mean alone.',
      storyConnection: 'The girl who spoke to elephants was "tested" every day by different herds in different conditions — monsoon rain muffling sounds, dense forest absorbing frequencies, multiple elephants vocalizing simultaneously. Each day was a different "fold." Her consistent accuracy across these varied conditions proved she had truly learned, not just memorized.',
      checkQuestion: 'You run 5-fold CV and get test accuracies of [92%, 55%, 91%, 90%, 89%]. What does the outlier fold (55%) suggest?',
      checkAnswer: 'One fold contains a cluster of data that is fundamentally different from the rest — perhaps recordings made with a different microphone, in different weather, or of an elephant subspecies not well-represented in other folds. This is a data quality issue, not a model issue. You should investigate fold 2 to understand why it is so different, and potentially stratify your splits to ensure each fold has representative diversity.',
      codeIntro: '5-fold cross-validation: compare KNN vs centroid classifier fairly.',
      code: `import numpy as np

np.random.seed(42)
moods = ['rumble','trumpet','roar','bark','cry','snort']

# Simulate feature data (6 moods, 4 features, 30 per class)
X, y = [], []
centers = {m: np.random.randn(4)*3 for m in moods}
for m in moods:
    for _ in range(30):
        X.append(centers[m] + np.random.randn(4)*0.5)
        y.append(m)
X = np.array(X); y = np.array(y)
X = (X - X.mean(0)) / (X.std(0)+1e-10)  # normalize

def knn_predict(Xtr, ytr, x, k=5):
    d = np.sqrt(np.sum((Xtr-x)**2, axis=1))
    nn = ytr[np.argsort(d)[:k]]
    cls, cnt = np.unique(nn, return_counts=True)
    return cls[np.argmax(cnt)]

def centroid_predict(Xtr, ytr, x):
    best, best_d = None, float('inf')
    for m in moods:
        d = np.linalg.norm(x - Xtr[ytr==m].mean(0))
        if d < best_d: best, best_d = m, d
    return best

# 5-fold cross-validation
idx = np.random.permutation(len(y))
fold_size = len(y) // 5
knn_scores, cent_scores = [], []

for f in range(5):
    te = idx[f*fold_size:(f+1)*fold_size]
    tr = np.concatenate([idx[:f*fold_size], idx[(f+1)*fold_size:]])
    knn_acc = np.mean([knn_predict(X[tr],y[tr],X[i])==y[i] for i in te])
    cent_acc = np.mean([centroid_predict(X[tr],y[tr],X[i])==y[i] for i in te])
    knn_scores.append(knn_acc); cent_scores.append(cent_acc)
    print(f"Fold {f+1}: KNN={knn_acc:.1%}  Centroid={cent_acc:.1%}")

print(f"\
KNN:      {np.mean(knn_scores):.1%} ± {np.std(knn_scores):.1%}")
print(f"Centroid: {np.mean(cent_scores):.1%} ± {np.std(cent_scores):.1%}")
winner = 'KNN' if np.mean(knn_scores) > np.mean(cent_scores) else 'Centroid'
print(f"Winner: {winner}")`,
      challenge: 'Add a third classifier: "random forest lite" — train 10 KNN classifiers, each using a random subset of 5 features (out of 8), and combine their predictions by majority vote. Does this ensemble beat both KNN and centroid?',
      successHint: 'Cross-validation transforms a single unreliable number into a distribution of scores. The mean tells you expected performance; the standard deviation tells you how much to trust it. Fair model comparison requires the same folds for all models.',
    },
    {
      title: 'Deployment: Complete Elephant Rumble Classifier',
      concept: `The final step is packaging everything into a clean, deployable system. A conservation team does not want to run six Jupyter notebooks — they want a single class they can instantiate and call: \`classifier.predict(audio_clip)\` returning a mood label and confidence score.

Our deployed system needs:
- **Clean API**: one method to train, one to predict, one to evaluate.
- **Input validation**: handle wrong sample rates, clipped audio, silence, and impossibly short clips.
- **Confidence thresholds**: if confidence is below a threshold (e.g., 70%), return "uncertain" rather than guessing. False confidence is worse than admitted uncertainty.
- **Calibrated probabilities**: the confidence scores should match reality — when the system says "80% confident," it should be correct 80% of the time.
- **Logging**: record every prediction with timestamp, features, confidence, and the raw audio fingerprint for later auditing.
- **Performance summary**: a comprehensive report covering accuracy, per-class metrics, confusion patterns, and known limitations.

This lesson builds the complete, documented, validated classifier as a Python class with all these production features.`,
      analogy: 'Deploying a classifier is like graduating from medical school and opening a practice. The student (model) has been trained and tested. But running a practice requires more: patient intake forms (input validation), triage (confidence thresholds), medical records (logging), malpractice awareness (known limitations), and clear communication with patients (interpretable outputs). The diagnosis skill alone is not enough.',
      storyConnection: 'The girl who spoke to elephants eventually trained others in her skill — she did not just understand elephants herself, she created a teachable, transferable system. Our deployed classifier does the same: it encapsulates years of acoustic research into a tool that any ranger, regardless of experience, can use to interpret elephant vocalizations. Scaling expertise through technology is the ultimate conservation multiplier.',
      checkQuestion: 'A ranger receives a prediction: "aggression_roar, confidence 52%." Should the system trigger an alert? What design decision must you make?',
      checkAnswer: 'At 52% confidence the system is barely better than random for a 6-class problem (where random is 17%). For safety-critical categories like aggression, you might set a lower alert threshold (e.g., 40%) than for non-critical ones (e.g., 70% for content_snort). The design decision is: define per-class confidence thresholds based on the cost of false negatives vs false positives for each category. Missing real aggression is much costlier than a false alarm.',
      codeIntro: 'Package the entire pipeline into a clean class — one call: predict(audio) → mood + confidence.',
      code: `import numpy as np

np.random.seed(42)
moods = ['rumble','trumpet','roar','bark','cry','snort']

# Quick data (reuses patterns from earlier lessons)
centers = {m: np.random.randn(4)*3 for m in moods}
def make_data(n=30):
    X, y = [], []
    for m in moods:
        for _ in range(n):
            X.append(centers[m] + np.random.randn(4)*0.5)
            y.append(m)
    X = np.array(X); y = np.array(y)
    return (X - X.mean(0)) / (X.std(0)+1e-10), y

class ElephantClassifier:
    def __init__(self, k=5):
        self.k = k
    def fit(self, X, y):
        self.X_train, self.y_train = X.copy(), y.copy()
        return self
    def predict(self, x):
        d = np.sqrt(np.sum((self.X_train - x)**2, axis=1))
        nn = self.y_train[np.argsort(d)[:self.k]]
        votes = {}
        for label in nn: votes[label] = votes.get(label, 0) + 1
        mood = max(votes, key=votes.get)
        return mood, votes[mood] / self.k

# Train and demo
X, y = make_data(30)
clf = ElephantClassifier(k=5).fit(X, y)

X_new, y_new = make_data(5)
print("Elephant Rumble Classifier — Live Demo")
print("=" * 45)
for i in range(len(X_new)):
    mood, conf = clf.predict(X_new[i])
    ok = "✓" if mood == y_new[i] else "✗"
    alert = " ⚠ ALERT" if mood in ['cry','roar'] and conf > 0.4 else ""
    print(f"{ok} Predicted: {mood:8s} ({conf:.0%}) | Actual: {y_new[i]}{alert}")

correct = sum(clf.predict(X_new[i])[0] == y_new[i] for i in range(len(X_new)))
print(f"\
Accuracy: {correct}/{len(X_new)}")
print("\
From Rongpharpi's ear to an automated monitoring network.")`,
      challenge: 'Add a real-time monitoring mode: simulate a continuous audio stream (concatenated random clips) and have the classifier process 2-second windows with 50% overlap, printing mood predictions as they arrive. Flag any safety-critical detections with a timestamp.',
      successHint: 'You have completed a full capstone project: from raw audio to deployed classifier. This is the shape of real conservation technology — not a single algorithm, but a pipeline where domain knowledge (elephant ethology), signal processing, machine learning, and software engineering all work together. The classifier is portfolio-ready.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (machine learning foundations)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project uses Python with numpy and matplotlib to build a complete Elephant Rumble Classifier. Click to start.</p>
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
            diagram={[ElephantPipelineDiagram, ElephantFeatureVectorDiagram, ElephantKNNVoteDiagram, ElephantConfusionMatrixDiagram, ElephantCrossValDiagram, ElephantDeployDiagram][i] ? createElement([ElephantPipelineDiagram, ElephantFeatureVectorDiagram, ElephantKNNVoteDiagram, ElephantConfusionMatrixDiagram, ElephantCrossValDiagram, ElephantDeployDiagram][i]) : undefined}
            />
        ))}
      </div>
    </div>
  );
}
