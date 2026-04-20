import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'machine-learning',
  title: 'Machine Learning',
  category: 'ai',
  tags: ['math', 'data-science'],
  keywords: ['gaussian', 'multivariate', 'normal distribution', 'gradient descent', 'linear algebra', 'probability', 'loss function', 'backpropagation', 'eigenvalue', 'covariance matrix', 'KL divergence', 'cross-entropy', 'softmax', 'confusion matrix', 'precision', 'recall', 'PCA'],
  icon: '🤖',
  tagline: 'Teach computers to learn from examples — not by writing rules, but by showing patterns.',
  relatedStories: ['girl-who-spoke-to-elephants', 'dragonfly-and-the-paddy-field', 'golden-deer-of-kamakhya', 'dancing-deer-of-loktak-lake', 'clouded-leopard'],

  understand: [
    {
      title: 'The Two Ways to Solve a Problem',
      beginnerContent:
        'Click the buttons in the diagram above. Toggle between "Rules" and "Examples" — same problem (dog vs cat), two fundamentally different ways to solve it. The rule-based approach is what programmers did for decades. The example-based approach is machine learning.\n\n' +
        'You want a computer to tell dogs apart from cats in photographs. There are two approaches.\n\n' +
        '**Approach 1 — Write the rules yourself.** You code: "If it has pointed ears AND a short snout ' +
        'AND slit pupils, it\'s a cat." But dogs can have pointed ears too. Cats can have round pupils. ' +
        'Some dogs are small and fluffy, some cats are large and sleek. Your rules need hundreds of ' +
        'exceptions, and they still fail on unusual breeds. The problem is too messy for hand-written rules.\n\n' +
        '**Approach 2 — Show examples and let the computer figure it out.** You give the computer 10,000 ' +
        'photos, each labelled "dog" or "cat." It examines all of them, finds the patterns that distinguish ' +
        'dogs from cats, and builds its own internal rules — rules too subtle and numerous for any human to ' +
        'write by hand. Then it classifies new photos it has never seen.\n\n' +
        'That second approach is **machine learning**. Instead of writing rules, you provide examples ' +
        'and the computer discovers the rules itself.\n\n' +
        '*In the Elephant story, Rongpharpi does exactly this — she learned to classify elephant moods ' +
        'not from a textbook but from hundreds of examples, matching vibrations to outcomes. In the ' +
        'Dragonfly story, a drone classifies crop health from images the same way. ML formalises the ' +
        'process both of them use.*',
      intermediateContent:
        'The ML pipeline: (1) Collect data → (2) Clean/preprocess → (3) Split train/test (80/20) → (4) Choose model → (5) Train → (6) Evaluate → (7) Tune hyperparameters → (8) Deploy. **Overfitting**: model memorizes training data but fails on new data. Signs: high training accuracy, low test accuracy. Remedies: more data, simpler model, regularization, dropout. **Underfitting**: model too simple. The learning curve (plot accuracy vs training set size) diagnoses which problem you have.',
      advancedContent:
        '**The bias-variance tradeoff — the fundamental tension in ML:**\n\n' +
        'Every model\'s expected error decomposes into three parts:\n' +
        '**Total Error = Bias² + Variance + Irreducible Noise**\n\n' +
        '| Term | What it means | When it\'s high |\n' +
        '|---|---|---|\n' +
        '| **Bias** | Error from oversimplifying | Model too simple (linear model on curved data) |\n' +
        '| **Variance** | Error from sensitivity to specific training data | Model too complex (memorizes noise) |\n' +
        '| **Noise** | Randomness in the data itself | Cannot be reduced by any model |\n\n' +
        '**Concrete example:** You classify elephant moods. A linear model draws a straight line — always gets ~70% ' +
        '(high bias, misses the curve). A k-NN with k=1 memorizes every training rumble — gets 100% on training, 60% on test ' +
        '(high variance, overfits to noise). The sweet spot: k=5 gets 85% on both (balanced).\n\n' +
        '**How regularization helps:** L2 regularization adds λ × Σwᵢ² to the loss function. Large weights (which create sharp, ' +
        'noisy decision boundaries) get penalized. The model settles on smaller, smoother weights. λ controls the tradeoff: ' +
        'λ = 0 → no regularization (risk overfitting), λ = ∞ → all weights zero (underfitting). Cross-validation finds the best λ.\n\n' +
        '**The No Free Lunch theorem:** No single algorithm is best for all problems. Linear models win on small, clean data. ' +
        'Random forests win on messy tabular data. Neural networks win on images and text. Domain knowledge — not algorithm hype — ' +
        'should guide your choice.',
      diagram: 'DogVsCatDiagram',
    },
    {
      title: 'The Postman Who Sorts by Feel',
      beginnerContent:
        'Try sorting the parcels in the diagram above. Each one has features — weight, size, shape. You drop it in the right bag based on what you feel. No rulebook, just patterns you\'ve learned over time. That\'s how human classification works — and machine learning classifiers do exactly the same thing, just with numbers instead of hands.\n\n' +
        'Here is a simpler example that makes classification physical.\n\n' +
        'A postman in Shillong gets a pile of parcels every morning. He needs to sort them into ' +
        'three bags: the **bike pouch** (for letters), the **shoulder bag** (small packages), and the ' +
        '**truck crate** (heavy deliveries). There are no labels saying which bag — he has to decide ' +
        'by picking each one up.\n\n' +
        'He grabs a parcel. Flat, light, flexible — letter, bike pouch. Next: small, heavy, rigid — ' +
        'box, shoulder bag. Next: large, heavy — truck. He is classifying based on what he **feels**: ' +
        'weight, size, shape, flexibility. These are his **features** — measurable properties he uses ' +
        'to make a decision.\n\n' +
        'Nobody wrote him a rulebook. After sorting thousands of parcels, he just *knows*. A large ' +
        'envelope that is heavier than usual? That is the tricky case — it sits right on the boundary ' +
        'between bike pouch and shoulder bag. Sometimes he gets it wrong. Those fuzzy boundaries ' +
        'are exactly where ML classifiers struggle too.\n\n' +
        'Now imagine teaching a computer to do the postman\'s job. You give it the weight, length, ' +
        'width, and flexibility of 10,000 past parcels, each labelled with the correct bag. The ' +
        'computer finds the boundaries between the three categories in that 4-dimensional feature space — ' +
        'boundaries the postman learned by feel, but the computer learns from data.\n\n' +
        '*In the Postman of the Hills story, the postal worker navigates Meghalaya\'s steep terrain. ' +
        'Sorting parcels is the classification problem; choosing the best delivery route is the ' +
        'optimisation problem — both are core ML applications.*',
      intermediateContent:
        'Classification assigns items to categories: spam/not-spam, cat/dog, elephant/rhino. Regression predicts continuous values: temperature tomorrow, elephant weight from height. The difference matters because they use different loss functions: classification minimizes misclassification rate (or cross-entropy), regression minimizes squared error. A classifier\'s output is a category label (or probability per category); a regressor\'s output is a number. Some algorithms (decision trees, neural networks) can do both.',
      advancedContent:
        '**Decision boundaries — what each algorithm actually draws:**\n\n' +
        'Every classifier learns a boundary in feature space. The shape of that boundary determines what the model can and cannot learn:\n\n' +
        '| Algorithm | Boundary shape | Strength | Weakness |\n' +
        '|---|---|---|---|\n' +
        '| Linear (logistic regression) | Straight line / flat plane | Fast, interpretable, few parameters | Can\'t separate curved or nested classes |\n' +
        '| Decision tree | Axis-aligned rectangles (staircase pattern) | Handles non-linear data, interpretable rules | Overfits, boundaries always parallel to axes |\n' +
        '| k-NN | Irregular, adapts to local data density | No training needed, any shape | Slow at prediction, sensitive to noise |\n' +
        '| Neural network | Arbitrarily complex curves | Can learn ANY boundary | Needs lots of data, hard to interpret |\n\n' +
        '**The universal approximation theorem:** A neural network with a single hidden layer of sufficient width can approximate ANY ' +
        'continuous function to arbitrary accuracy. This sounds magical, but the theorem has two crucial gaps:\n' +
        '1. "Sufficient width" — it says nothing about HOW many neurons you need. For some functions, the required width is astronomically large.\n' +
        '2. It says nothing about whether gradient descent can FIND the right weights. The function exists in theory; finding it in practice is the hard part.\n\n' +
        'This is why deep networks (many layers) work better than wide-shallow ones in practice — depth creates compositional features ' +
        '(edges → textures → parts → objects) that are exponentially more efficient than trying to do everything in one layer.',
      diagram: 'PostmanSortingDiagram',
    },
    {
      title: 'How a Child Learns "Dog" — And Why It Matters',
      beginnerContent:
        'A two-year-old has never read a zoology textbook. Nobody gives her a 50-page definition ' +
        'of "dog." Instead, her parents point at dogs and say "dog!", point at cats and say ' +
        '"kitty!" After dozens of examples, something remarkable happens: she sees a breed she ' +
        'has never encountered — a tiny Chihuahua, nothing like the Labrador next door — and ' +
        'confidently says "dog!"\n\n' +
        'How? She was not memorising individual dogs. She was unconsciously extracting **features** — ' +
        'floppy ears, wet nose, four legs, tail that wags when excited, barks instead of meows — and ' +
        'learning which features matter most. She figured out that colour does not matter (dogs come ' +
        'in every colour), size barely matters, but "barks" and "wags tail at people" are almost ' +
        'perfect predictors.\n\n' +
        'She was also learning **weights** — how much each feature should count. "Has fur" gets low ' +
        'weight because cats also have fur. "Barks" gets high weight because almost nothing else barks. ' +
        'She built an internal classifier — a mental model that takes features as input and outputs ' +
        '"dog" or "not dog." She did this without knowing any maths, any code, or any theory.\n\n' +
        '**Machine learning is the formalisation of exactly this process.** Instead of a child\'s brain, ' +
        'we use an algorithm. Instead of pointing and saying "dog!", we give the algorithm labelled data. ' +
        'The rest is the same: extract features, learn weights, classify new examples.',
      intermediateContent:
        'Supervised learning provides labeled examples: (input, correct_output) pairs. The model adjusts its internal parameters to minimize the difference between its predictions and the correct outputs. This is analogous to a teacher showing flashcards with pictures (inputs) and names (labels). With enough examples, the model generalizes — it correctly labels inputs it has never seen before. The critical question is: did it learn the concept, or just memorize the examples?',
      advancedContent:
        '**Unsupervised learning — finding structure without answers:**\n\n' +
        'In supervised learning, every example has a label. In unsupervised learning, you have data but no labels — ' +
        'the algorithm must discover structure on its own.\n\n' +
        '**K-means clustering (step by step):**\n' +
        '1. Choose K (number of clusters). Place K random "centroids" in feature space.\n' +
        '2. Assign each data point to the nearest centroid.\n' +
        '3. Move each centroid to the mean of its assigned points.\n' +
        '4. Repeat steps 2-3 until centroids stop moving.\n\n' +
        'Example: 500 unlabeled elephant GPS positions cluster into K=3 groups → the algorithm discovers "watering hole," ' +
        '"feeding ground," and "resting area" without ever being told these categories exist.\n\n' +
        '**Self-supervised learning — creating your own labels:**\n' +
        'BERT takes a sentence like "The elephant [MASK] because it was frightened." It hides (masks) a random word and tries to predict it ("ran"). ' +
        'The correct answer is already in the data — no human labeling needed. After training on billions of sentences, ' +
        'BERT\'s internal representations encode grammar, meaning, and even reasoning.\n\n' +
        '**Contrastive learning (SimCLR) for images:**\n' +
        'Take one elephant photo. Create two augmented versions (crop, rotate, color-shift). Train the network to produce SIMILAR embeddings ' +
        'for the two augmentations but DIFFERENT embeddings from other images. The network learns "what makes an elephant look like an elephant" ' +
        'without a single label. After this pretraining, fine-tuning with just 10 labeled images per species can match the accuracy of training from scratch with 1,000.',
    },
    {
      title: 'Features — The Lightbulb Moment',
      beginnerContent:
        'Here is where everything clicks. When the child sees a golden retriever, her brain does not ' +
        'process the entire image at once. It breaks the animal down into **features** — measurable ' +
        'properties she can compare across animals:\n\n' +
        '• **Size**: large? small? medium?\n' +
        '• **Ears**: floppy? pointed? round?\n' +
        '• **Sound**: barks? meows? silent?\n' +
        '• **Tail**: wags at humans? stays still? bushy?\n' +
        '• **Nose**: wet? dry?\n\n' +
        'Not all features are equal. "Has four legs" is shared by dogs, cats, foxes, and stuffed ' +
        'animals — it does not help distinguish them. "Barks" is almost unique to dogs. The child ' +
        'implicitly gives each feature a **weight** — how much it should count toward the decision. ' +
        'High-weight features (barks, wags at humans) do most of the work. Low-weight features ' +
        '(has fur, four legs) are nearly useless on their own.\n\n' +
        'This is EXACTLY what a machine learning model does. You feed it features (numbers describing ' +
        'each example), and the training process automatically learns which features matter and how much. ' +
        'A model trained on elephant data might discover that **frequency** is the single most important ' +
        'feature for classifying mood — just like "barks" is the single most important feature for ' +
        'classifying dogs.\n\n' +
        'Try the interactive below — toggle features on and off and watch how the classifier\'s accuracy ' +
        'changes. Some features are nearly worthless. Others are critical. The model has to figure this ' +
        'out from examples alone.',
      intermediateContent:
        '**Feature engineering — transforming raw data into model inputs:**\n\n' +
        '| Raw data | Engineered features |\n' +
        '|----------|--------------------|\n' +
        '| GPS coordinates | distance_to_water, vegetation_density |\n' +
        '| Timestamp | time_of_day, season, day_of_week |\n' +
        '| Species name ("Asian") | One-hot: [1, 0] (Asian) or [0, 1] (African) |\n\n' +
        '**Feature scaling** — models work better when features are on the same scale:\n\n' +
        '| Method | Formula | Result |\n' +
        '|--------|---------|--------|\n' +
        '| StandardScaler | (x − mean) / std | Mean = 0, std = 1 |\n' +
        '| MinMaxScaler | (x − min) / (max − min) | Range 0 to 1 |\n\n' +
        '**Gradient descent** — how the model learns the right weights:\n\n' +
        '[diagram:GradientDescentDiagram]\n\n' +
        '`w_new = w_old − learning_rate × ∂loss/∂w`\n\n' +
        '| Learning rate | What happens |\n' +
        '|--------------|-------------|\n' +
        '| Too high | Overshoots — loss bounces around and diverges |\n' +
        '| Too low | Tiny steps — takes forever to converge |\n' +
        '| Just right | Steady descent toward the minimum |\n\n' +
        '**Feature selection** removes irrelevant inputs that add noise without improving predictions.',
      advancedContent:
        '**Transfer learning — why you rarely train from scratch:**\n\n' +
        '| Step | What happens |\n' +
        '|------|-------------|\n' +
        '| 1. Start with pretrained model | ResNet/EfficientNet trained on ImageNet (14M images, 1000 categories) |\n' +
        '| 2. Freeze early layers | They already know edges, textures, shapes — keep that knowledge |\n' +
        '| 3. Replace final layer | Swap 1000-class output with your 3-class output (Asian, African, juvenile) |\n' +
        '| 4. Train on your data | Only 500 photos needed — frozen layers provide features, your data teaches classification |\n\n' +
        '**SHAP values — explaining individual predictions:**\n\n' +
        'Your model says this rumble is "danger." Why?\n\n' +
        '[diagram:SHAPWaterfallDiagram]\n\n' +
        '| Feature | Value | Contribution | Why |\n' +
        '|---------|-------|-------------|-----|\n' +
        '| Base (average) | — | 33% danger | Starting point |\n' +
        '| Frequency | 45 Hz | **+25%** | Low frequency → danger signal |\n' +
        '| Pulse rate | 3.8/s | **+22%** | Fast pulses → urgency |\n' +
        '| Amplitude | 1.2 | **+12%** | Loud → danger |\n' +
        '| **Final** | | **92% danger** | Sum of all contributions |\n\n' +
        'SHAP values are based on cooperative game theory (Shapley, 1953 Nobel laureate). Three guarantees:\n\n' +
        '- Contributions **sum to the prediction** (nothing hidden)\n' +
        '- Identical features get **identical values** (fair)\n' +
        '- Irrelevant features get **zero** (no noise)\n\n' +
        'This makes SHAP the gold standard for model interpretability — regulators (GDPR "right to explanation") increasingly require them.\n\n' +
        '**Domain surprise:** SHAP often reveals that time-of-day matters more than GPS location in wildlife tracking — because animal behavior follows circadian rhythms. The model quantified what domain experts already knew.',
      diagram: 'FeatureWeightsDiagram',
    },
    {
      title: 'From Child to Computer — The Feature Vector',
      beginnerContent:
        'The child processes features intuitively. A computer needs them as numbers. In the Elephant ' +
        'story, each recorded rumble becomes a **feature vector** — a list of numbers:\n\n' +
        '**[frequency = 80, pulse_rate = 0.5, amplitude = 0.7]**\n\n' +
        'That is the elephant equivalent of describing a dog as [size = large, ears = floppy, barks = yes]. ' +
        'Each rumble is a point in a space where the axes are the features. Calm rumbles cluster in one ' +
        'region of this space (low frequency, slow pulses). Nervous rumbles cluster in another (high ' +
        'frequency, fast pulses). Danger signals cluster in a third.\n\n' +
        'The model\'s job is to learn where the boundaries between these clusters lie — so that when ' +
        'a NEW rumble arrives, it can look at which cluster the new point falls in and predict the mood.',
      intermediateContent:
        'A feature vector is a list of numbers describing an observation. For an elephant: [weight_kg, height_m, tusk_length_cm, ear_area_m2, age_years] = [4500, 2.8, 60, 1.2, 25]. Each number is a dimension in feature space — this elephant is a point in 5D space. Similar elephants are nearby points; different species are far apart. Feature engineering chooses which measurements matter: tusk_length distinguishes Asian from African elephants, but tail_length probably does not. Good features make classification easy; poor features make it impossible regardless of the algorithm.',
      advancedContent:
        '**PCA — Principal Component Analysis, step by step:**\n\n' +
        'You have 50 features describing each elephant. Many are correlated (height and weight move together). PCA finds the directions of maximum variance and projects the data onto them.\n\n' +
        '[diagram:PCAStepsDiagram]\n\n' +
        '| Step | What it does | Why |\n' +
        '|------|-------------|-----|\n' +
        '| 1. Center | Subtract the mean of each feature | Moves the data cloud to the origin |\n' +
        '| 2. Covariance matrix | Compute the 50×50 matrix of how each feature varies with every other | Captures all pairwise relationships |\n' +
        '| 3. Eigenvectors | Find the directions of maximum variance | These are the principal components |\n' +
        '| 4. Sort | Rank eigenvectors by eigenvalue (how much variance each captures) | Top 2-3 capture most of the information |\n' +
        '| 5. Project | Map all data onto the top 2-3 directions | 50D → 2D with minimal information loss |\n\n' +
        'If the first two components capture 85% of variance, you have compressed 50 dimensions into 2 with only 15% information loss.\n\n' +
        '**t-SNE and UMAP — for visualization, not analysis:**\n\n' +
        '| Method | Preserves | Best for | Limitation |\n' +
        '|--------|-----------|----------|------------|\n' +
        '| PCA | Global structure (big distances) | Dimensionality reduction, analysis | Misses nonlinear patterns |\n' +
        '| t-SNE | Local neighborhoods | Visualizing clusters | Cluster distances are meaningless |\n' +
        '| UMAP | Local + some global | Visualizing + faster than t-SNE | Still not for distance analysis |\n\n' +
        'Use t-SNE/UMAP to visualize clusters and outliers **before** training — but do not draw conclusions about distances between clusters.\n\n' +
        '**Deep learning\'s automatic feature hierarchy:**\n\n' +
        '[diagram:CNNFeatureHierarchyDiagram]\n\n' +
        'A CNN trained on wildlife camera trap images builds its own features:\n\n' +
        '| Layer | What it detects | Equivalent human task |\n' +
        '|-------|----------------|---------------------|\n' +
        '| Layer 1 | Edges, textures (fur patterns, vegetation) | "I see lines and patterns" |\n' +
        '| Layer 2 | Parts (ears, trunks, tails, legs) | "I see body parts" |\n' +
        '| Layer 3 | Whole objects (elephant, rhino, deer) | "That\'s an elephant!" |\n\n' +
        'This hierarchy emerges **automatically** from the data — no human engineer picks the features. This is why deep learning dominates image and audio tasks.',
      diagram: 'FeatureExtractionDiagram',
    },
    {
      title: 'Labels — The Teacher\'s Answer Key',
      beginnerContent:
        'Features are the descriptions. **Labels** are the correct answers. When the child\'s parent ' +
        'points and says "dog!" — that is a label. In the elephant study, a wildlife expert listens ' +
        'to each recording and writes down the mood: "calm", "nervous", or "danger." That is the label.\n\n' +
        'Together, features + labels form a **training example**:\n\n' +
        '| Frequency | Pulse rate | Amplitude | **Label** |\n' +
        '|-----------|-----------|-----------|----------|\n' +
        '| 80 Hz | 0.5 | 0.7 | **calm** |\n' +
        '| 120 Hz | 2.1 | 0.9 | **nervous** |\n' +
        '| 45 Hz | 3.8 | 1.2 | **danger** |\n\n' +
        'You need many such examples — the more, the better the model learns. This is called ' +
        '**supervised learning**: the model is supervised by the labels, like a student supervised ' +
        'by a teacher who provides correct answers during practice.',
      intermediateContent:
        'In supervised learning, each training example has a **label** — the correct answer the model should learn to predict. For classification: labels are categories (elephant, rhino, deer). For regression: labels are numbers (weight: 4500 kg). Labels can be hard to obtain: labeling 10,000 camera trap images requires human experts to examine each one. **Active learning** selects the most informative unlabeled examples for human annotation, reducing labeling effort by 50-80%. **Weak supervision** uses heuristic labeling functions (if image is near water AND large body → probably elephant) to generate approximate labels at scale.',
      advancedContent:
        '**The ceiling on model accuracy — human disagreement:**\n\n' +
        'Two experts listen to the same elephant rumble. One labels it "nervous," the other "calm." They disagree 15% of the time. ' +
        'No model can reliably exceed 85% accuracy on this task — the labels themselves are noisy. ' +
        'Cohen\'s kappa measures this: κ = (observed agreement − chance agreement) / (1 − chance agreement). ' +
        'κ > 0.8 = strong agreement. κ < 0.6 = task is ambiguous and model accuracy has a low ceiling.\n\n' +
        '**Handling noisy labels:**\n' +
        '- **Co-teaching:** Train two models simultaneously. Each model selects "clean" training examples for the other ' +
        '(samples where both models agree on the label). Noisy labels are implicitly discarded.\n' +
        '- **Label smoothing:** Instead of training on hard labels [1, 0, 0], use soft labels [0.9, 0.05, 0.05]. ' +
        'This prevents the model from becoming overconfident on potentially mislabeled examples.\n\n' +
        '**Semi-supervised learning — using unlabeled data:**\n' +
        'You have 50 labeled camera trap images and 10,000 unlabeled ones. FixMatch combines two ideas:\n' +
        '1. For a labeled image: train normally (compute loss, update weights)\n' +
        '2. For an unlabeled image: augment it weakly (flip/crop). If the model is >95% confident in its prediction, ' +
        'use that prediction as a "pseudo-label." Then augment the same image strongly (color distort, cutout) ' +
        'and train on it with the pseudo-label.\n\n' +
        'Result: near-supervised accuracy with 7 labeled images per class — because the unlabeled data teaches the model about the structure of the input space.',
    },
    {
      title: 'Training vs Testing — Why You Hide the Exam',
      beginnerContent:
        'Drag the split slider in the diagram above. Watch training and test portions change. Every model you ever build follows this exact pattern: train on one set of examples, test on another the model has never seen. Why? Because the whole point is to predict NEW data — not just memorize old answers.\n\n' +
        'Imagine a student who gets a perfect score on every homework assignment — because she copied ' +
        'the answer key. Has she learned anything? To find out, you give her a test with questions ' +
        'she has never seen. That is the difference between training and testing.\n\n' +
        'You split your data into two parts. The **training set** (typically 80% of your data) is what ' +
        'the model learns from. The **test set** (20%) is hidden during training and used only at the ' +
        'end to evaluate. If the model scores 95% on training data but 55% on test data, it ' +
        'memorised rather than learned — that is called **overfitting**.\n\n' +
        'The wall between training and test data is sacred. Break it (by accidentally letting the model ' +
        'see test answers) and your evaluation is worthless. This is the most common mistake in ML.',
      intermediateContent:
        'The train-test split prevents self-deception. If you evaluate on the same data you trained on, a model that memorized everything scores 100% — but fails on new data. The standard split: 80% train, 20% test. Never let the model see test data during training. **Cross-validation** (k-fold): divide data into k parts, train on k-1, test on 1, rotate k times. Average the k scores for a robust estimate. 5-fold or 10-fold is standard. Stratified splits ensure each fold has the same class proportions as the full dataset.',
      advancedContent:
        '**Data leakage — the silent killer of ML projects:**\n\n' +
        'Your model gets 99% accuracy in development but 60% in production. The likely cause: information from the test set leaked into training.\n\n' +
        '**Three common leakage sources:**\n' +
        '1. **Preprocessing before splitting:** You compute mean/std on the FULL dataset (including test), then normalize. ' +
        'The test set\'s statistics influenced training. Fix: split first, fit scaler on train only, then transform both.\n' +
        '2. **Feature selection on the full dataset:** You find the top 10 features using all data, including test. ' +
        'Those features were selected partly because they fit the test data. Fix: feature selection inside cross-validation.\n' +
        '3. **Duplicate data in both sets:** Two camera trap photos of the same elephant 1 second apart are nearly identical. ' +
        'If one is in train and the other in test, the model "memorizes" the elephant. Fix: deduplicate or group by individual before splitting.\n\n' +
        '**Time series leakage:** If you randomly shuffle weather data and split 80/20, some Tuesday data ends up in training ' +
        'and the preceding Monday in test — the model "knows the future." Fix: chronological split (train on Jan-Oct, test on Nov-Dec).\n\n' +
        '**Production drift:** Once deployed, the world changes. Data drift: camera angles change after sensor replacement. ' +
        'Concept drift: a new elephant species enters the reserve. Monitor prediction confidence over time — ' +
        'if average confidence drops or predictions shift, trigger retraining with fresh data.',
      diagram: 'TrainTestSplitDiagram',
    },
    {
      title: 'K-Nearest Neighbors — The Simplest Classifier',
      beginnerContent:
        'Click a point in the diagram above to classify it. K-NN draws lines to its K closest labelled neighbors; the point inherits the majority class. Change K to see how the decision boundary shifts. This is literally the whole algorithm — no training, no math beyond distance, no fancy techniques. And yet it works.\n\n' +
        'Now you know features, labels, and train/test splits. How does the actual classification work?\n\n' +
        'K-Nearest Neighbors is the simplest algorithm and the one you build in the Elephant story. ' +
        'When a new rumble arrives (a point in feature space), k-NN does three things:\n\n' +
        '1. **Measure distance** from the new point to every training point (using Euclidean distance — ' +
        'the straight-line distance in feature space)\n' +
        '2. **Pick the K closest** training points (the "neighbors")\n' +
        '3. **Majority vote** — if 2 of 3 neighbors are "calm", the new point is classified as "calm"\n\n' +
        'That is the entire algorithm. No equations to solve, no weights to optimise. Just: "who are ' +
        'the closest examples I have already seen, and what were they labelled?"\n\n' +
        'K is the one choice you make. K=1 means "copy the nearest example" (brittle, overfits). ' +
        'K=15 means "take a wide vote" (smoother, but might blur boundaries). The Elephant story ' +
        'lets you try different K values and see how accuracy changes.',
      intermediateContent:
        'KNN algorithm: for a new data point, (1) compute distance to all training points, (2) find the k closest, (3) majority vote determines the class. Distance metric matters: Euclidean (straight line), Manhattan (city blocks), cosine (angle between vectors — common for text). k=1 is noisy (single neighbor decides), k=too large includes distant irrelevant points. Typical: k=5 or k=√n. Feature scaling is critical: if weight is 3000-5000 and height is 1-3, distance is dominated by weight. Standardize first.',
      advancedContent:
        '**Why k-NN is slow and how to fix it:**\n\n' +
        'k-NN has NO training phase — it simply stores all training data. At prediction time, it computes distance to every stored point: O(n × d) per query. ' +
        'For n = 1 million points in d = 100 dimensions, that is 100 million operations per prediction.\n\n' +
        '**KD-trees — divide and conquer in feature space:**\n' +
        'A KD-tree recursively splits the space along one feature at a time (like a decision tree, but for proximity search). ' +
        'Query time drops to O(d × log n) — for 1 million points, ~20 comparisons instead of 1 million. ' +
        'But in high dimensions (d > 20), KD-trees degrade to brute force because every split becomes ineffective (curse of dimensionality).\n\n' +
        '**Approximate nearest neighbors (ANN) for billion-scale:**\n' +
        'Spotify recommends songs from a catalog of 100 million tracks. Exact k-NN is impossible at this scale. ' +
        'ANN methods trade exact results for 100× speedup:\n' +
        '- **FAISS** (Facebook): Compresses vectors with product quantization, searches only nearby clusters. Query time: ~1 ms for 1 billion vectors.\n' +
        '- **Annoy** (Spotify): Builds a forest of random projection trees. Each tree splits the space with random hyperplanes. At query time, search multiple trees and merge results.\n\n' +
        'The accuracy tradeoff: ANN finds the true nearest neighbor ~95% of the time (the other 5% are very close neighbors). ' +
        'For recommendations and image search, this is perfectly acceptable — the 2nd-nearest neighbor is almost as good.',
      diagram: 'KNNClassificationDiagram',
    },
    {
      title: 'Overfitting — When Memorising Beats Learning',
      beginnerContent:
        'Back to the child learning dogs. Imagine she has only seen 3 dogs — all golden retrievers. ' +
        'She concludes: "dogs are golden." When she sees a black Labrador, she says "not a dog." ' +
        'She overfitted to her tiny training set.\n\n' +
        'ML models do the same thing. With K=1, the model memorises every single training point and ' +
        'creates a tiny "zone" around each one. Any noise in the training data (a mislabelled example, ' +
        'a sensor glitch) creates a wrong zone that misleads future predictions. The model scores ' +
        '100% on training data but poorly on test data.\n\n' +
        'The cure: more diverse training data, larger K values, and always evaluating on a test set ' +
        'the model has never seen.',
      intermediateContent:
        'Overfitting signs: training accuracy is high but test accuracy is much lower — the gap between them indicates the degree of overfitting. A model that achieves 99% training accuracy but only 60% test accuracy has memorized the training data. Remedies: (1) more training data, (2) simpler model (fewer parameters), (3) regularization (add a penalty for large weights), (4) dropout (randomly disable neurons during training), (5) early stopping (stop training when validation loss starts increasing).',
      advancedContent:
        '**Learning curves — your diagnostic tool for overfitting vs underfitting:**\n\n' +
        'Plot model accuracy (y-axis) vs training set size (x-axis) for BOTH training and test sets:\n\n' +
        '**Pattern 1 — High variance (overfitting):**\n' +
        '- Training accuracy: 98% (nearly perfect)\n' +
        '- Test accuracy: 65% (large gap)\n' +
        '- The gap narrows as you add more training data\n' +
        '- Fix: get more data, simplify model, add regularization, try dropout\n\n' +
        '**Pattern 2 — High bias (underfitting):**\n' +
        '- Training accuracy: 72%\n' +
        '- Test accuracy: 70% (small gap, but both are bad)\n' +
        '- More data does NOT help — both curves plateau at low accuracy\n' +
        '- Fix: more complex model, add features, train longer, reduce regularization\n\n' +
        '**Ensemble methods — systematic fixes:**\n' +
        '- **Bagging** (Random Forest): Train many models on random subsets of data, average their predictions. ' +
        'Each model overfits differently → averaging cancels the noise. Reduces variance.\n' +
        '- **Boosting** (XGBoost): Train models sequentially. Each new model focuses on the examples the previous models got WRONG. ' +
        'Gradually fills in the mistakes. Reduces bias.\n\n' +
        'In practice, gradient boosting (XGBoost, LightGBM) wins most Kaggle competitions on tabular data. ' +
        'Random forests are harder to misconfigure and a safer default for beginners.',
    },
    {
      title: 'Accuracy, Precision, Recall — Did It Actually Work?',
      beginnerContent:
        '[diagram:PrecisionRecallDiagram]\n\n' +
        '**Accuracy** = correct predictions / total predictions. If the model classifies 90 of 100 ' +
        'rumbles correctly, accuracy is 90%.\n\n' +
        'But accuracy can lie. If 95% of rumbles are "calm", a model that ALWAYS guesses "calm" gets ' +
        '95% accuracy — while missing every single danger signal. For elephant safety, missing a danger ' +
        'signal is catastrophic.\n\n' +
        '**Precision** (for "danger"): of everything the model CALLED danger, how many actually were? ' +
        'High precision = few false alarms.\n\n' +
        '**Recall** (for "danger"): of everything that WAS danger, how many did the model catch? ' +
        'High recall = few missed threats.\n\n' +
        'For conservation, recall on "danger" matters most. A false alarm (precision error) means rangers ' +
        'investigate nothing. A missed danger (recall error) means an elephant herd crashes into a village.',
      intermediateContent:
        '**The metrics — what each one measures:**\n\n' +
        '| Metric | Formula | Answers the question | Danger |\n' +
        '|--------|---------|---------------------|--------|\n' +
        '| Accuracy | (TP + TN) / total | How often is the model right overall? | Misleading when classes are imbalanced |\n' +
        '| Precision | TP / (TP + FP) | Of everything called "danger," how many really were? | Low = too many false alarms |\n' +
        '| Recall | TP / (TP + FN) | Of everything that WAS danger, how many did we catch? | Low = missed real threats |\n' +
        '| F1 Score | 2 × (P × R) / (P + R) | Balance between precision and recall | Harmonic mean — both must be high |\n\n' +
        '**The imbalance trap:** 99% of camera trap images are "not elephant." A model that always says "not elephant" gets 99% accuracy — while detecting zero elephants. Accuracy lies. Precision and recall don\'t.\n\n' +
        '**For conservation:** High recall is critical — missing a real elephant (or danger signal) is far worse than a false alarm.',
      advancedContent:
        '**ROC curves — understanding the threshold tradeoff:**\n\n' +
        'Your model outputs a probability (say, 73% chance this is a danger signal). You choose a threshold to decide: ' +
        'above 50%? Above 80%? The threshold changes the precision-recall balance.\n\n' +
        '**How the ROC curve works:**\n' +
        'At threshold 0%: everything is labeled "danger" → TPR = 100% (catch all real dangers), FPR = 100% (every calm signal is a false alarm).\n' +
        'At threshold 100%: nothing is labeled "danger" → TPR = 0%, FPR = 0%.\n' +
        'Between: each threshold gives a different (FPR, TPR) point. Plot them all → ROC curve.\n\n' +
        '**AUC interpretation:**\n' +
        '- AUC = 1.0: perfect separation (a threshold exists where TPR = 100% and FPR = 0%)\n' +
        '- AUC = 0.5: random guessing (the curve follows the diagonal)\n' +
        '- AUC = 0.85: good model. Interpretation: pick a random danger signal and a random calm signal. There is an 85% chance the model assigns a higher probability to the danger signal.\n\n' +
        '**When to use precision-recall curves instead:**\n' +
        'ROC curves can be misleading when classes are imbalanced. If 99% of signals are calm, even a high FPR means few actual false alarms in absolute terms — ' +
        'the ROC looks great. Precision-recall curves expose this by focusing on the rare class.\n\n' +
        '**Choosing the threshold is a business decision:** In conservation (danger detection), set threshold low → high recall (catch every threat), accept false alarms. ' +
        'In spam filtering, set threshold high → high precision (never lose real email), accept some spam slipping through.',
    },
    {
      title: 'The Confusion Matrix — Where Mistakes Live',
      beginnerContent:
        '[diagram:ConfusionMatrixDiagram]\n\n' +
        'A **confusion matrix** is a table showing exactly where the model gets confused. Rows are ' +
        'actual labels, columns are predicted labels. The diagonal shows correct predictions; ' +
        'off-diagonal cells show specific mistakes.\n\n' +
        'In the Elephant story, the 3×3 matrix might show that the model confuses "nervous" with ' +
        '"danger" (their frequency ranges overlap) but never confuses "calm" with "danger" (they are ' +
        'far apart in feature space). That tells you exactly what to fix — maybe add a new feature ' +
        '(duration of the rumble?) that separates nervous from danger.\n\n' +
        'This is how real ML engineers work: train → evaluate → read the confusion matrix → improve → ' +
        'repeat until the model is reliable enough for deployment.',
      intermediateContent:
        '**Reading the matrix — a worked example:**\n\n' +
        '| | Predicted: Elephant | Predicted: Rhino | Predicted: Deer | Accuracy |\n' +
        '|---|---|---|---|---|\n' +
        '| **Actual: Elephant** | **85** ✓ | 10 | 5 | 85% |\n' +
        '| **Actual: Rhino** | 3 | **15** ✓ | 2 | 75% |\n' +
        '| **Actual: Deer** | 2 | 3 | **75** ✓ | 94% |\n\n' +
        '**Reading this:** The model confuses elephants with rhinos 10 times (they look similar from behind). It rarely confuses deer with anything (distinct body shape).\n\n' +
        '**Normalize by row** to get per-class accuracy rates — each row should sum to 100%. Classes with low row-accuracy need better features.',
      advancedContent:
        '**Multi-class averaging — which metric to report:**\n\n' +
        'With 3 classes (elephant 100 examples, rhino 20, deer 80), per-class precision might be [0.95, 0.70, 0.90]. ' +
        'How do you report a single number?\n\n' +
        '| Method | Calculation | Result | Use when… |\n' +
        '|---|---|---|---|\n' +
        '| **Macro** | (0.95 + 0.70 + 0.90) / 3 | 0.85 | All classes equally important (conservation: rare rhino matters as much as common elephant) |\n' +
        '| **Weighted** | (0.95×100 + 0.70×20 + 0.90×80) / 200 | 0.91 | Performance proportional to class frequency |\n' +
        '| **Micro** | Pool all TP/FP globally | 0.90 | Dominated by majority class — can hide poor performance on rare classes |\n\n' +
        '**Cohen\'s kappa — is your model better than random?**\n' +
        'If 80% of signals are "calm," a model that always guesses "calm" gets 80% accuracy but κ = 0 (no better than chance). ' +
        'κ = (observed accuracy − chance accuracy) / (1 − chance accuracy). κ > 0.8 means strong agreement beyond chance.\n\n' +
        '**Multi-label vs multi-class:** Multi-class = exactly ONE label per image (elephant OR rhino OR deer). ' +
        'Multi-label = multiple labels per image (elephant AND near water AND nighttime). A camera trap image can trigger all three. ' +
        'Hamming loss = fraction of labels wrong: if the model predicts [elephant: yes, water: yes, night: no] but truth is [elephant: yes, water: no, night: no], ' +
        'Hamming loss = 1/3 (one label wrong out of three).',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match the ML term to its meaning',
          pairs: [
            ['Features', 'Measurable properties describing each example (e.g., frequency, pulse rate)'],
            ['Labels', 'The correct answers the model learns to predict (e.g., calm, nervous, danger)'],
            ['Training set', 'The 80% of examples the model learns from'],
            ['Test set', 'The 20% of examples hidden during training — the honest exam'],
            ['Overfitting', 'Memorising training data instead of learning general patterns'],
            ['Confusion matrix', 'A table showing exactly which classes the model confuses'],
          ],
        },
      },
    },
    {
      title: 'From Elephants to Everything',
      beginnerContent:
        'The pattern you just learned — features → labels → train → test → evaluate → improve — ' +
        'is the same pattern behind:\n\n' +
        '• **Image recognition**: features = pixel values, labels = "cat"/"dog"/"car". Your phone ' +
        'uses this to sort photos.\n' +
        '• **Spam filters**: features = word frequencies, labels = "spam"/"not spam". Gmail processes ' +
        'billions of emails this way.\n' +
        '• **Medical diagnosis**: features = blood test results, labels = "healthy"/"at risk". Models ' +
        'can detect cancers that human doctors miss.\n' +
        '• **Self-driving cars**: features = camera pixels + lidar distances, labels = "pedestrian"/' +
        '"bicycle"/"traffic sign". The stakes are life and death.\n' +
        '• **Wildlife conservation**: features = camera trap images, labels = species. The Elephant ' +
        'Listening Project at Cornell uses ML to monitor elephant populations across Africa.\n\n' +
        'Every one of these systems was built by someone who understood features, labels, training, ' +
        'testing, and evaluation — exactly what you are learning.',
      intermediateContent:
        'ML applications across domains: **Computer Vision** — image classification, object detection, face recognition, medical imaging (detecting tumors in X-rays). **Natural Language Processing** — translation, sentiment analysis, chatbots, text summarization. **Audio** — speech recognition, music recommendation, species identification from calls. **Tabular data** — fraud detection, credit scoring, weather prediction. **Robotics** — navigation, grasping, autonomous driving. The same fundamental algorithms (neural networks, trees, SVMs) adapt to all these domains through appropriate feature engineering and architecture choices.',
      advancedContent:
        '**The ML deployment pipeline — from notebook to production:**\n\n' +
        '| Stage | What happens | Tools |\n' +
        '|---|---|---|\n' +
        '| 1. Train | Train on historical data, track experiments | MLflow, Weights & Biases |\n' +
        '| 2. Validate | Test on held-out set, check for leakage | Cross-validation, stratified splits |\n' +
        '| 3. A/B test | Deploy to 5% of users, compare against current system | Feature flags, statistical significance |\n' +
        '| 4. Rollout | Gradually increase traffic (5% → 25% → 100%) | Kubernetes, load balancers |\n' +
        '| 5. Monitor | Track prediction confidence, accuracy, latency | Grafana, custom dashboards |\n' +
        '| 6. Retrain | When drift is detected, retrain on recent data | Automated pipelines (Kubeflow) |\n\n' +
        '**Edge deployment — running ML on a drone or phone:**\n' +
        'A wildlife drone cannot stream video to a cloud server (no internet in the forest). The model must run ON the drone.\n\n' +
        '**Model compression techniques:**\n' +
        '- **Quantization:** Replace 32-bit floating-point weights with 8-bit integers. Model size: 400 MB → 100 MB. ' +
        'Speed: 2-4× faster. Accuracy loss: <1%. This is how ML runs on phones.\n' +
        '- **Pruning:** Remove weights close to zero (they contribute almost nothing). A typical neural network is 90% zeros after pruning — ' +
        'sparse matrix operations skip the zeros entirely.\n' +
        '- **Knowledge distillation:** Train a large "teacher" model (ResNet-152, 230 MB). Then train a small "student" model (MobileNet, 14 MB) ' +
        'to mimic the teacher\'s outputs. The student learns the teacher\'s "dark knowledge" — subtle probability distributions over classes — ' +
        'and achieves 95% of the teacher\'s accuracy at 1/16th the size.',
    },
    // ── Beyond k-NN: Other Algorithms (visual) ──────────────
    {
      title: 'Decision Trees — Asking Yes/No Questions',
      beginnerContent:
        'A decision tree works like 20 Questions. It asks a series of yes/no questions about ' +
        'features, and each answer narrows down the possibilities until it reaches a classification.\n\n' +
        '"Is the weight over 100 kg?" → Yes → "Does it have a trunk?" → Yes → **Elephant.**\n\n' +
        'Each question splits the data into two groups. The algorithm picks questions that ' +
        'separate classes as cleanly as possible — the most informative question goes first. ' +
        'The result is a flowchart you can follow from top to bottom.\n\n' +
        'Decision trees are powerful because they are **interpretable** — you can see exactly ' +
        'why the model made each decision. A doctor using a decision tree model can explain ' +
        'to a patient: "your blood pressure is above 140, your age is above 60, and your ' +
        'cholesterol is elevated — the model recommends further testing." Try classifying ' +
        'animals in the interactive tree below.',
      intermediateContent:
        'A decision tree asks a sequence of binary questions to classify data. At each node, it picks the feature and threshold that best separates the classes. "Best" is measured by information gain (decrease in entropy) or Gini impurity. For elephant classification: "Is weight > 4000 kg?" → Yes branch: "Is ear area > 1.5 m²?" → African. Trees are interpretable — you can follow the decision path for any prediction. But single trees overfit easily — deep trees memorize training data.',
      advancedContent:
        '**Random Forest — how averaging cures overfitting:**\n\n' +
        'A single decision tree overfits easily (it memorizes training noise). A random forest builds 100-1000 trees, each different:\n' +
        '1. Each tree trains on a random 63% of data (bootstrap sample — sampling with replacement)\n' +
        '2. At each split, only a random subset of features is considered (√d features for classification)\n' +
        '3. For a new prediction, all trees vote. Majority wins.\n\n' +
        'Each tree overfits in a DIFFERENT way (different data, different features). Averaging cancels the noise — like asking 100 people to estimate a jar of marbles. Individual guesses are wild, but the average is remarkably accurate.\n\n' +
        '**Gradient Boosting — sequentially fixing mistakes:**\n' +
        '1. Tree 1: Fits the data, gets some predictions wrong\n' +
        '2. Tree 2: Fits the RESIDUALS (errors) of Tree 1 — focusing on what Tree 1 got wrong\n' +
        '3. Tree 3: Fits the residuals of Trees 1+2 combined\n' +
        '4. Final prediction = Tree 1 + 0.1×Tree 2 + 0.1×Tree 3 + … (the 0.1 learning rate prevents overfitting)\n\n' +
        'XGBoost and LightGBM are optimized implementations. On tabular data (spreadsheet-like), they consistently beat neural networks — ' +
        'this is why Kaggle competitions on tabular data are dominated by gradient boosting, not deep learning.\n\n' +
        '**Feature importance from trees:** Count how often each feature is used for splitting across all trees, ' +
        'weighted by the impurity reduction at each split. The top features are the ones the forest relies on most.',
      diagram: 'DecisionTreeDiagram',
    },
    {
      title: 'The Gaussian Distribution — The Shape of Uncertainty',
      beginnerContent:
        'When you measure anything natural — heights of students, sensor readings from elephants, ' +
        'temperatures across a week — and plot how often each value occurs, the shape almost always ' +
        'looks like a bell. Most values cluster near the average, and extreme values are rare.\n\n' +
        'This "bell curve" is the **Gaussian (normal) distribution**, and it is the single most ' +
        'important shape in all of statistics and machine learning. Two numbers fully describe it: ' +
        'the **mean** (μ, the center) and the **standard deviation** (σ, the spread).\n\n' +
        'With two variables (say, frequency and amplitude of elephant rumbles), the Gaussian becomes ' +
        'a 3D hill viewed from above as contour ellipses. If the variables are **correlated** (high ' +
        'frequency tends to come with high amplitude), the ellipses tilt. Understanding this shape ' +
        'is essential — almost every ML algorithm assumes or builds on Gaussian distributions.',
      intermediateContent:
        'The univariate Gaussian PDF is f(x) = (1/σ√2π) × e^(-(x-μ)²/2σ²). The key insight: 68% of data falls within ±1σ of the mean, 95% within ±2σ, and 99.7% within ±3σ (the "68-95-99.7 rule"). For two variables, the bivariate Gaussian introduces a **correlation coefficient** ρ that controls how the ellipse tilts. When ρ=0, variables are independent and the contours are axis-aligned. The covariance matrix Σ encodes both the spread (σ values) and the correlation (ρ). Its eigenvectors are the principal axes of the ellipse — the "natural" directions of the data.',
      advancedContent:
        '**The multivariate Gaussian — from 1D bell to nD ellipsoid:**\n\n' +
        'In 1D: f(x) = (1/σ√2π) exp(-(x-μ)²/2σ²). The exponent -(x-μ)²/2σ² measures "how many standard deviations from the mean."\n\n' +
        'In k dimensions, this generalizes to:\n' +
        'f(x) = (2π)^(-k/2) |Σ|^(-1/2) exp(-½(x-μ)ᵀ Σ⁻¹ (x-μ))\n\n' +
        'The key quantity is the **Mahalanobis distance**: D² = (x-μ)ᵀ Σ⁻¹ (x-μ). It replaces (x-μ)²/σ² from 1D.\n\n' +
        '**Why Mahalanobis, not Euclidean?**\n' +
        'Elephant weight varies by 1000s of kg; ear width by cm. Euclidean distance is dominated by weight. ' +
        'Mahalanobis accounts for scale AND correlation: it stretches/rotates the space so all features contribute equally. ' +
        'Points at equal Mahalanobis distance form ellipsoids (the contour lines).\n\n' +
        '**The connection to PCA:**\n' +
        'PCA diagonalizes the covariance matrix: Σ = PDP^T, where P is the eigenvector matrix and D contains eigenvalues. ' +
        'In the rotated coordinate system, the Gaussian is axis-aligned — each dimension is independent. ' +
        'The eigenvalues are the variance along each principal direction. Large eigenvalue → data stretches far in that direction → important. ' +
        'Small eigenvalue → data is thin → can be discarded (dimensionality reduction).\n\n' +
        '**Where this appears in ML:** Gaussian Naive Bayes assumes Σ is diagonal (features independent). ' +
        'Gaussian Mixture Models allow arbitrary Σ per cluster. ' +
        'The loss function of a Variational Autoencoder penalizes deviation from a standard Gaussian — forcing the latent space to be smooth and continuous.',
      interactive: { type: 'gaussian-explorer' as const, props: {} },
    },
    {
      title: 'Contour Plots — Seeing Probability from Above',
      beginnerContent:
        'A contour plot is what you get when you look straight down at a 3D surface. If you have ever ' +
        'used a hiking trail map with elevation lines, you already understand contour plots.\n\n' +
        'In ML, the "mountain" is a probability distribution. The peak is where data points are most ' +
        'likely to appear. The contour lines mark equal-probability boundaries — like elevation rings ' +
        'on a mountain. When a classifier says "95% confident," it means the data point falls inside ' +
        'the innermost contour ring of its predicted class.\n\n' +
        'The shape of the contour tells you about the data: circular contours mean two features are ' +
        'independent. Tilted ellipses mean they are correlated. A narrow ellipse along one axis means ' +
        'most of the variation is in that direction — which is exactly what PCA finds.',
      intermediateContent:
        'Decision boundaries in Gaussian classifiers follow from equating the log-likelihoods of two classes: log p(x|class A) = log p(x|class B). For equal covariance matrices, this simplifies to a **linear boundary** (LDA). For unequal covariances, the boundary becomes **quadratic** (QDA) — a curve that follows the shape of the contours. Gaussian Mixture Models allow each class to have multiple Gaussian components, creating complex multi-modal decision regions.',
      advancedContent:
        '**KL divergence — measuring how different two distributions are:**\n\n' +
        'You have two Gaussian models for elephant weight: model P (from a 2020 survey) and model Q (from a 2025 survey). ' +
        'How different are they? KL divergence measures this.\n\n' +
        'For two univariate Gaussians: KL(P||Q) = log(σ_Q/σ_P) + (σ_P² + (μ_P−μ_Q)²)/(2σ_Q²) − ½\n\n' +
        '**Worked example:** P: μ=4000, σ=500. Q: μ=4200, σ=600.\n' +
        'KL(P||Q) = log(600/500) + (250000 + 40000)/720000 − 0.5 = 0.182 + 0.403 − 0.5 = **0.085 nats**\n' +
        'Small KL → the distributions are similar. Large KL → they differ significantly.\n\n' +
        '**Warning: KL is NOT symmetric.** KL(P||Q) ≠ KL(Q||P). KL(P||Q) asks "how surprised would I be by data from P if I expected Q?" ' +
        'This asymmetry matters: in variational inference, KL(approximate || true) tends to underestimate uncertainty (the approximate distribution is too narrow), ' +
        'while KL(true || approximate) tends to spread too wide.\n\n' +
        '**Where this shows up in practice:**\n' +
        '- **Variational Autoencoders:** The loss = reconstruction error + KL(learned distribution || standard Gaussian). ' +
        'The KL term keeps the latent space organized.\n' +
        '- **Normalizing flows:** Start with a simple Gaussian. Warp it through a series of invertible transformations. ' +
        'Each transformation bends the contour lines into more complex shapes. The final distribution can match any target — ' +
        'the contour plot evolves from perfect circles to arbitrarily complex curves, step by step.',
      interactive: { type: 'contour-explainer' as const, props: {} },
    },
    {
      title: 'Linear Classifiers — Drawing a Line Between Classes',
      beginnerContent:
        'The simplest classifier just draws a straight line (in 2D) or a flat plane (in higher ' +
        'dimensions) between the classes. Everything on one side is "calm," everything on the ' +
        'other is "nervous."\n\n' +
        'This works beautifully when classes are neatly separated — calm rumbles cluster in one ' +
        'corner of feature space, nervous rumbles in another, and a straight boundary between ' +
        'them captures the difference.\n\n' +
        'But some problems are not linearly separable. Imagine calm rumbles surrounded by a ring ' +
        'of nervous rumbles — no single straight line can separate them. You need a **curved ' +
        'boundary**. That is exactly what neural networks learn to draw.',
      intermediateContent:
        'A linear classifier draws a straight boundary: w₁x₁ + w₂x₂ + b = 0. Points on one side are class A, the other side class B. The weights w₁, w₂ determine the boundary\'s angle; the bias b shifts it. Logistic regression uses the sigmoid function σ(z) = 1/(1+e^(-z)) to convert the linear score to a probability: P(class=1) = σ(w·x + b). Training minimizes cross-entropy loss: L = -Σ[y·log(ŷ) + (1-y)·log(1-ŷ)]. Linear classifiers are fast, interpretable, and work well when classes are linearly separable.',
      advancedContent:
        '**Support Vector Machines — finding the widest possible boundary:**\n\n' +
        'Many lines can separate two classes. SVM finds the one with the **maximum margin** — the largest gap between the boundary and the nearest data points (called support vectors).\n\n' +
        '**Why margin matters:** A wide margin means the model is confident — small perturbations in the data won\'t change the classification. A narrow margin means the model is on a knife-edge.\n\n' +
        '**The kernel trick — when data isn\'t linearly separable:**\n' +
        'Imagine calm rumbles in a circle surrounded by a ring of danger rumbles. No straight line can separate them. ' +
        'The kernel trick adds a new dimension: z = x² + y². In this 3D space, the calm cluster rises into a hill ' +
        'while danger stays flat — now a horizontal plane separates them.\n\n' +
        'The brilliant part: the RBF kernel K(x,y) = exp(-γ||x-y||²) computes dot products in an INFINITE-dimensional space ' +
        'without ever constructing the coordinates. The algorithm only needs dot products between points, not the points themselves.\n\n' +
        '**When to use SVMs:**\n' +
        '| Scenario | SVM vs alternatives |\n' +
        '|---|---|\n' +
        '| Small dataset (<10K samples), clear margin | SVM often wins |\n' +
        '| Text classification (high dimensions, sparse) | Linear SVM is surprisingly effective |\n' +
        '| Large dataset, complex patterns | Neural networks or gradient boosting usually win |\n' +
        '| Need probability outputs | SVM gives distances to boundary, not probabilities (Platt scaling can convert, but adds complexity) |',
      diagram: 'LinearClassifierDiagram',
    },
    {
      title: 'Neural Networks — Learning Any Boundary',
      beginnerContent:
        'A neural network is layers of simple mathematical units (neurons) connected by weighted ' +
        'links. Each neuron takes inputs, multiplies them by weights, adds them up, and passes ' +
        'the result through a function that decides whether to "fire."\n\n' +
        'The input layer receives features (frequency, pulse rate, amplitude). Hidden layers ' +
        'transform these features into increasingly abstract representations — the first hidden ' +
        'layer might detect "is the frequency high?", the second might combine that with pulse ' +
        'rate to detect "is this a nervous pattern?" The output layer produces the final ' +
        'classification.\n\n' +
        '**Training** adjusts every weight in the network to minimise errors. The network starts ' +
        'with random weights (guessing), sees an example, checks if it was right, and nudges ' +
        'weights in the direction that would have been more correct. After thousands of examples, ' +
        'the weights converge on values that classify accurately.\n\n' +
        'Tap an output node below to see which connections are strongest — which features matter ' +
        'most for each mood.',
      intermediateContent:
        'A neural network chains layers of linear transformations with nonlinear activations. Layer output: y = activation(W·x + b). Common activations: ReLU (max(0, x) — simple, fast, standard), sigmoid (squashes to 0-1, used for output probabilities), softmax (multi-class probabilities). A 2-layer network: input → hidden layer (64 neurons, ReLU) → output layer (num_classes, softmax). Training uses backpropagation: compute loss, propagate gradients backward through all layers, update weights via gradient descent.',
      advancedContent:
        '**Deep learning architectures — which one for which data:**\n\n' +
        '| Architecture | How it works | Best for | Key insight |\n' +
        '|---|---|---|---|\n' +
        '| **CNN** | Small filters (3×3) slide across the image, detecting patterns at each location | Images, video, spectrogram audio | Translation invariance — a cat in the corner is the same cat in the center |\n' +
        '| **RNN/LSTM** | Processes one time step at a time, passing a hidden state forward | Time series, sensor data | Memory — the hidden state carries information from earlier in the sequence |\n' +
        '| **Transformer** | Every element attends to every other element simultaneously | Text, translation, code, long sequences | Parallelism + long-range attention (no forgetting distant context) |\n\n' +
        '**Generative models — creating new data:**\n\n' +
        '**GANs (Generative Adversarial Networks):**\n' +
        '- Generator: creates fake images from random noise\n' +
        '- Discriminator: tries to distinguish fake from real\n' +
        '- They train against each other. The generator gets better at fooling the discriminator; the discriminator gets better at catching fakes.\n' +
        '- Result: the generator produces images indistinguishable from real data.\n' +
        '- Problem: training is unstable (mode collapse — generator learns to produce only one type of image).\n\n' +
        '**Diffusion models (DALL-E, Stable Diffusion):**\n' +
        '- Forward: gradually add noise to a real image until it becomes pure static (100 steps)\n' +
        '- Reverse: train a neural network to predict and remove one step of noise at a time\n' +
        '- Generation: start from pure noise, denoise 100 times → photorealistic image\n' +
        '- More stable than GANs, higher quality, but slower to generate (many denoising steps).',
      diagram: 'NeuralNetworkDiagram',
    },
    {
      title: 'Transformers — How Modern AI Understands Language',
      beginnerContent:
        'Every AI language model you have heard of — ChatGPT, Google Translate, GitHub Copilot — ' +
        'runs on an architecture called the **transformer**, introduced in 2017.\n\n' +
        'The key innovation is **self-attention**. When processing a sentence, every word looks ' +
        'at every other word and decides how much attention to pay to each one. In the sentence ' +
        '"The elephant rumbled because **it** was nervous," the word "it" needs to figure out ' +
        'what it refers to. Through attention, "it" learns to attend strongly to "elephant" — ' +
        'not "rumbled" or "because."\n\n' +
        'This is fundamentally different from older approaches that processed words one at a time, ' +
        'left to right. Transformers process **all words simultaneously**, using attention weights ' +
        'to understand relationships between any pair of words regardless of distance.\n\n' +
        'A transformer trained on billions of sentences learns not just grammar but reasoning, ' +
        'translation, summarisation, and even code generation — all from the same architecture. ' +
        'The model you might use to chat with an AI assistant was trained this way.\n\n' +
        'Click a word below to see its attention pattern — which other words it focuses on to ' +
        'understand context.',
      intermediateContent:
        '**How self-attention works — step by step:**\n\n' +
        '[diagram:TransformerAttentionDiagram]\n\n' +
        'Each token "looks at" every other token to decide what is relevant:\n\n' +
        '| Step | What happens | Intuition |\n' +
        '|------|-------------|----------|\n' +
        '| 1. Project | Each token becomes three vectors: **Q** (query), **K** (key), **V** (value) | Q = "what am I looking for?", K = "what do I contain?", V = "what info do I carry?" |\n' +
        '| 2. Score | Compute Q·K between every pair of tokens | High score = these two tokens are relevant to each other |\n' +
        '| 3. Scale | Divide by √d (dimension size) | Prevents scores from getting too large |\n' +
        '| 4. Softmax | Convert scores to weights that sum to 1 | Now each token has a "probability distribution" over all others |\n' +
        '| 5. Weighted sum | Multiply weights × V and sum | Each token\'s output is a blend of information from relevant tokens |\n\n' +
        '**The formula:** Attention(Q, K, V) = softmax(QKᵀ / √d) × V\n\n' +
        '**Concrete example — how "it" resolves to "elephant":**\n\n' +
        'Sentence: "The elephant rumbled because **it** was nervous."\n\n' +
        '| Step | What "it" does | Result |\n' +
        '|------|---------------|--------|\n' +
        '| 1. Query | "it" asks: "What do I refer to?" | Q_it = [0.8, -0.2, 0.5, ...] |\n' +
        '| 2. Keys | Every word answers: "Here\'s what I am" | K_elephant = [0.7, -0.1, 0.6, ...] |\n' +
        '| 3. Score | Q_it · K_elephant = **high** (similar!) | Score = 4.2 |\n' +
        '| | Q_it · K_rumbled = low (different) | Score = 0.8 |\n' +
        '| 4. Softmax | Convert scores to weights | elephant: **0.72**, rumbled: 0.05, ... |\n' +
        '| 5. Output | Weighted sum of V vectors | "it" now carries elephant\'s meaning |\n\n' +
        '**Multi-head attention** — why one attention isn\'t enough:\n\n' +
        '| Head | What it learns to focus on | Example |\n' +
        '|------|--------------------------|--------|\n' +
        '| Head 1 | Grammar/syntax | "it" → "elephant" (subject reference) |\n' +
        '| Head 2 | Meaning/semantics | "nervous" → "rumbled" (cause-effect) |\n' +
        '| Head 3 | Position/distance | Adjacent words attend to each other |\n' +
        '| Head 4 | Coreference | Pronouns → their antecedents |\n\n' +
        'All heads run in parallel, then their outputs are concatenated and projected. Different heads capture different types of relationships simultaneously.\n\n' +
        '**The full transformer block:**\n\n' +
        '| Stage | What it does |\n' +
        '|-------|-------------|\n' +
        '| Input embedding | Convert words to vectors |\n' +
        '| Positional encoding | Add position information (word order) |\n' +
        '| Multi-head attention | Each word attends to every other word |\n' +
        '| Feed-forward network | Process each position independently |\n' +
        '| Layer normalization | Stabilize training |\n' +
        '| Repeat N times | Stack these blocks — deeper = more reasoning |',
      advancedContent:
        '**Scaling laws — why bigger models keep getting smarter:**\n\n' +
        'Transformer performance follows predictable power laws:\n' +
        '- Loss ∝ 1/N^0.07 (N = number of parameters)\n' +
        '- Loss ∝ 1/D^0.10 (D = dataset size in tokens)\n' +
        '- Loss ∝ 1/C^0.05 (C = compute budget in FLOPS)\n\n' +
        'Double the parameters → loss drops by ~5%. This is why labs scale models from millions to billions to trillions of parameters — ' +
        'the returns are diminishing but predictable.\n\n' +
        '**Emergent abilities — qualitative jumps at scale:**\n' +
        'Small models (100M parameters): autocomplete, simple grammar. Medium (1B): coherent paragraphs. Large (100B+): ' +
        'chain-of-thought reasoning, arithmetic, code generation, in-context learning (performing tasks from a few examples in the prompt, ' +
        'without any weight updates). These abilities appear suddenly — they are absent at smaller scales and "emerge" past certain thresholds.\n\n' +
        '**Fine-tuning for alignment:**\n' +
        '1. **RLHF:** Show the model two responses to the same question. A human rates which is better. ' +
        'Train a "reward model" on these preferences, then fine-tune the language model to maximize the reward. ' +
        'This is how chat models learn to be helpful, harmless, and honest.\n\n' +
        '2. **LoRA (Low-Rank Adaptation):** Full fine-tuning updates all weights (billions of parameters, huge GPU memory). ' +
        'LoRA freezes the original weights and adds tiny trainable matrices (rank 4-16) at each layer. ' +
        'These matrices learn the task-specific adjustment. Result: 10× less GPU memory, similar performance.',
      diagram: 'TransformerAttentionDiagram',
    },
  ],

  build: [
    {
      title: 'Preparing Data with scikit-learn',
      beginnerContent:
        'Before training, you split your data into training and testing sets, and scale features to similar ranges.',
      code: `from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import numpy as np

# Example: elephant sightings with features
# [weight_kg, height_cm, footprint_cm]
X = np.array([
  [4500, 280, 45], [4200, 270, 43], [3800, 260, 40],
  [30, 60, 8], [35, 55, 7], [28, 50, 6],      # dogs
  [5, 25, 3], [4, 22, 2], [6, 28, 3],          # cats
])
y = np.array(["elephant","elephant","elephant",
            "dog","dog","dog",
            "cat","cat","cat"])

# Split: 70% train, 30% test
X_train, X_test, y_train, y_test = train_test_split(
  X, y, test_size=0.3, random_state=42
)

# Scale features to mean=0, std=1
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)  # use same scaling`,
    },
    {
      title: 'K-Nearest Neighbors',
      beginnerContent:
        'KNN classifies a new sample by looking at the K closest training samples and taking a majority vote.',
      code: `from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score

# Train
knn = KNeighborsClassifier(n_neighbors=3)
knn.fit(X_train, y_train)

# Predict
predictions = knn.predict(X_test)
print("Predictions:", predictions)
print("Accuracy:", accuracy_score(y_test, predictions))

# Predict a single new animal
new_animal = scaler.transform([[4000, 265, 42]])
print("New animal is a:", knn.predict(new_animal)[0])`,
    },
    {
      title: 'Decision Trees',
      beginnerContent:
        'A decision tree asks yes/no questions about features, branching like a flowchart until it reaches an answer.',
      code: `from sklearn.tree import DecisionTreeClassifier, export_text

# Train
tree = DecisionTreeClassifier(max_depth=3, random_state=42)
tree.fit(X_train, y_train)

# See the rules it learned
print(export_text(tree, feature_names=["weight","height","footprint"]))

# Evaluate
score = tree.score(X_test, y_test)
print(f"Test accuracy: {score:.0%}")`,
    },
    {
      title: 'Evaluating a Model',
      beginnerContent:
        'Accuracy alone can be misleading. A confusion matrix and classification report show per-class performance.',
      code: `from sklearn.metrics import classification_report, confusion_matrix

predictions = tree.predict(X_test)

print("Confusion Matrix:")
print(confusion_matrix(y_test, predictions))

print("\\nClassification Report:")
print(classification_report(y_test, predictions))
# Shows precision, recall, and f1-score for each class`,
    },
    {
      title: 'Training a Simple Neural Network',
      beginnerContent:
        'For more complex patterns, a neural network (multi-layer perceptron) can learn non-linear boundaries.',
      code: `from sklearn.neural_network import MLPClassifier

mlp = MLPClassifier(
  hidden_layer_sizes=(16, 8),   # two hidden layers
  max_iter=500,
  random_state=42,
)
mlp.fit(X_train, y_train)

print("MLP accuracy:", mlp.score(X_test, y_test))

# Neural nets need more data and tuning, but can
# capture patterns that KNN and trees miss.`,
    },
    {
      title: 'Cross-Validation',
      beginnerContent:
        'Instead of a single train/test split, cross-validation tests the model multiple times on different slices.',
      code: `from sklearn.model_selection import cross_val_score

scores = cross_val_score(
  KNeighborsClassifier(n_neighbors=3),
  X, y, cv=3, scoring="accuracy"
)
print(f"CV scores: {scores}")
print(f"Mean: {scores.mean():.2%} ± {scores.std():.2%}")
# More reliable estimate of real-world performance`,
    },
    {
      title: 'Building a Confusion Matrix',
      beginnerContent:
        'A confusion matrix is a table that shows exactly where your model gets confused. Rows ' +
        'represent the true labels, columns represent the predicted labels. Each cell tells you ' +
        'how many times a true class was predicted as another class. For our 3-class elephant ' +
        'classifier, you get a 3x3 grid: correct predictions sit on the diagonal (top-left to ' +
        'bottom-right), and off-diagonal cells reveal mistakes.',
      code: `from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import confusion_matrix, ConfusionMatrixDisplay
import matplotlib.pyplot as plt
import numpy as np

# --- Setup: same data and model from earlier ---
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

X = np.array([
  [4500, 280, 45], [4200, 270, 43], [3800, 260, 40],
  [4600, 285, 46], [4100, 268, 42],                   # elephants
  [30, 60, 8], [35, 55, 7], [28, 50, 6],
  [33, 58, 9], [27, 52, 7],                            # dogs
  [5, 25, 3], [4, 22, 2], [6, 28, 3],
  [5, 24, 3], [4, 23, 2],                              # cats
])
y = np.array([
  "elephant","elephant","elephant","elephant","elephant",
  "dog","dog","dog","dog","dog",
  "cat","cat","cat","cat","cat",
])

X_train, X_test, y_train, y_test = train_test_split(
  X, y, test_size=0.3, random_state=42
)
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

knn = KNeighborsClassifier(n_neighbors=3)
knn.fit(X_train, y_train)
predictions = knn.predict(X_test)

# --- Build the confusion matrix ---
labels = ["cat", "dog", "elephant"]
cm = confusion_matrix(y_test, predictions, labels=labels)

print("Confusion Matrix:")
print(cm)
# Each row = true class, each column = predicted class
# Diagonal = correct predictions

# --- How to read the 3x3 grid ---
for i, true_label in enumerate(labels):
  for j, pred_label in enumerate(labels):
      count = cm[i][j]
      if count > 0:
          if i == j:
              print(f"  {count}x {true_label} correctly classified")
          else:
              print(f"  {count}x {true_label} misclassified as {pred_label}")

# --- Visual display ---
disp = ConfusionMatrixDisplay(cm, display_labels=labels)
disp.plot(cmap="Blues", values_format="d")
plt.title("Elephant Classifier — Confusion Matrix")
plt.tight_layout()
plt.savefig("confusion_matrix.png", dpi=150)
plt.show()`,
    },
  ],
};
