import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function TalkingParrotLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'What is language? — signals, symbols, and syntax',
      concept: `The parrot of Hajo could mimic human words perfectly. But did it understand them? This is one of the deepest questions in language science. **Language** is a system of symbols (words) combined according to rules (grammar) to convey meaning.

Three key components of any language:
- **Phonology**: the sounds (or gestures) used — parrots can reproduce human phonemes with remarkable accuracy
- **Syntax**: the rules for combining words — "the parrot ate the seed" vs. "the seed ate the parrot"
- **Semantics**: the meaning behind the symbols — this is where parrots likely fall short

Human language is **recursive**: we can embed sentences inside sentences ("The parrot that the boy who lived in Hajo trained spoke Assamese"). No animal communication system has true recursion — this may be what makes human language unique.`,
      analogy: 'Language is like a code. Phonemes are the individual bits (0s and 1s). Words are bytes (groups of bits that mean something). Grammar is the protocol (rules for how bytes are arranged). Without the protocol, raw data is meaningless — just like random words without grammar are gibberish.',
      storyConnection: 'The parrot of Hajo amazed everyone because it spoke human words. But parrots are pattern matchers, not meaning makers. They map sounds to rewards, not sounds to concepts. The story invites us to ask: what is the difference between speaking and understanding?',
      checkQuestion: 'A parrot says "Polly wants a cracker" whenever it sees a cracker. Does the parrot understand the sentence?',
      checkAnswer: 'Probably not in the human sense. The parrot has learned an association: see cracker → produce sound → get cracker. This is stimulus-response learning, not semantic understanding. A human child saying the same sentence understands "wants" as a mental state, "a" as an article, and "cracker" as a category. The parrot likely treats the whole phrase as one indivisible sound-unit.',
      codeIntro: 'Model information content in language using character frequency analysis.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Analyze character frequencies in two languages
english = "the parrot of hajo could speak in many tongues and all who heard it were amazed"
assamese_transliterated = "hajor lurar katha koi thoka suga soriahbor monot asorjo logaise"

def char_freq(text):
    text = text.lower().replace(' ', '')
    chars = sorted(set(text))
    freqs = [text.count(c) / len(text) for c in chars]
    return chars, freqs

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 7))
fig.patch.set_facecolor('#1f2937')

chars_e, freqs_e = char_freq(english)
ax1.set_facecolor('#111827')
ax1.bar(chars_e, freqs_e, color='#22c55e', alpha=0.8)
ax1.set_title('English: Character Frequency', color='white', fontsize=12)
ax1.set_ylabel('Frequency', color='white')
ax1.tick_params(colors='gray')

chars_a, freqs_a = char_freq(assamese_transliterated)
ax2.set_facecolor('#111827')
ax2.bar(chars_a, freqs_a, color='#3b82f6', alpha=0.8)
ax2.set_title('Assamese (transliterated): Character Frequency', color='white', fontsize=12)
ax2.set_ylabel('Frequency', color='white')
ax2.set_xlabel('Character', color='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

# Calculate entropy (information content)
def entropy(text):
    text = text.lower().replace(' ', '')
    n = len(text)
    probs = [text.count(c)/n for c in set(text)]
    return -sum(p * np.log2(p) for p in probs if p > 0)

print(f"English entropy: {entropy(english):.2f} bits/character")
print(f"Assamese entropy: {entropy(assamese_transliterated):.2f} bits/character")
print()
print("Higher entropy = more information per character.")
print("Languages with more unique characters tend to have higher entropy.")`,
      challenge: 'Add a third language sample (Hindi, Spanish, or any language you know). How does its entropy compare? What does entropy tell us about how efficiently a language uses its alphabet?',
      successHint: 'Shannon entropy measures how much information each character carries. This is the foundation of information theory — the math behind all digital communication.',
    },
    {
      title: 'Sound production — how parrots and humans make speech',
      concept: `Parrots are among the few animals that can mimic human speech. How? Humans produce speech using the **larynx** (voice box) and shape sounds with the tongue, lips, and palate. Parrots have a **syrinx** — a vocal organ at the base of the trachea — plus a thick, flexible tongue.

The physics of sound production:
- **Vibrating membranes** in the syrinx (or vocal cords in humans) create sound waves
- **Resonance chambers** (throat, mouth, nasal cavity) amplify certain frequencies
- **Articulators** (tongue, beak/lips) shape the final sound

The key difference: parrots can produce two independent sounds simultaneously (the syrinx has two sides). Humans have one larynx. A parrot can literally harmonize with itself.

Sound is a pressure wave. Frequency determines pitch (measured in Hz). Amplitude determines volume. The shape of the resonance chambers determines **timbre** — why a parrot saying "hello" sounds different from a human saying "hello."`,
      analogy: 'Sound production is like a musical instrument. The vibrating element (vocal cords or syrinx membrane) is like a guitar string. The resonance chamber (throat) is like the guitar body. The articulators (tongue, lips) are like the guitarist\'s fingers on the fretboard, shaping each note. A parrot is like a guitar with two separate necks.',
      storyConnection: 'The parrot of Hajo was famous because its mimicry was so convincing that people forgot they were hearing a bird. The physics explains why: parrots can match human frequency ranges (85-255 Hz for adults) and reproduce formant patterns that our brains interpret as speech.',
      checkQuestion: 'Why can parrots mimic speech but dogs cannot, even though dogs can hear and understand many words?',
      checkAnswer: 'Dogs lack the vocal anatomy for speech. Their larynx and tongue cannot produce the precise formant patterns of human vowels and consonants. Parrots have a syrinx with fine muscular control and a thick, manipulable tongue — essentially the hardware for speech. Dogs have the hearing (input) but not the vocal tract (output).',
      codeIntro: 'Visualize sound waves and how different frequencies combine to create vowel sounds.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Generate basic sound waves for vowel formants
t = np.linspace(0, 0.01, 1000)  # 10ms window

# Vowel "ah" (like in "parrot"): F1=700Hz, F2=1200Hz
f1_ah, f2_ah = 700, 1200
# Vowel "ee" (like in "speak"): F1=300Hz, F2=2300Hz
f1_ee, f2_ee = 300, 2300

def make_vowel(t, f1, f2):
    return 0.7 * np.sin(2 * np.pi * f1 * t) + 0.3 * np.sin(2 * np.pi * f2 * t)

wave_ah = make_vowel(t, f1_ah, f2_ah)
wave_ee = make_vowel(t, f1_ee, f2_ee)

fig, axes = plt.subplots(2, 2, figsize=(12, 7))
fig.patch.set_facecolor('#1f2937')

# "ah" waveform
axes[0,0].set_facecolor('#111827')
axes[0,0].plot(t*1000, wave_ah, color='#22c55e', linewidth=1)
axes[0,0].set_title('Vowel "ah" — waveform', color='white', fontsize=11)
axes[0,0].set_xlabel('Time (ms)', color='white')
axes[0,0].tick_params(colors='gray')

# "ee" waveform
axes[0,1].set_facecolor('#111827')
axes[0,1].plot(t*1000, wave_ee, color='#3b82f6', linewidth=1)
axes[0,1].set_title('Vowel "ee" — waveform', color='white', fontsize=11)
axes[0,1].set_xlabel('Time (ms)', color='white')
axes[0,1].tick_params(colors='gray')

# Frequency spectrum "ah"
freqs = np.fft.rfftfreq(len(t), t[1]-t[0])
fft_ah = np.abs(np.fft.rfft(wave_ah))
axes[1,0].set_facecolor('#111827')
axes[1,0].plot(freqs[:200], fft_ah[:200], color='#22c55e', linewidth=2)
axes[1,0].set_title('"ah" frequency spectrum', color='white', fontsize=11)
axes[1,0].set_xlabel('Frequency (Hz)', color='white')
axes[1,0].tick_params(colors='gray')
axes[1,0].axvline(700, color='#f59e0b', linestyle='--', alpha=0.7, label='F1=700Hz')
axes[1,0].axvline(1200, color='#ef4444', linestyle='--', alpha=0.7, label='F2=1200Hz')
axes[1,0].legend(facecolor='#1f2937', labelcolor='white', fontsize=8)

# Frequency spectrum "ee"
fft_ee = np.abs(np.fft.rfft(wave_ee))
axes[1,1].set_facecolor('#111827')
axes[1,1].plot(freqs[:300], fft_ee[:300], color='#3b82f6', linewidth=2)
axes[1,1].set_title('"ee" frequency spectrum', color='white', fontsize=11)
axes[1,1].set_xlabel('Frequency (Hz)', color='white')
axes[1,1].tick_params(colors='gray')
axes[1,1].axvline(300, color='#f59e0b', linestyle='--', alpha=0.7, label='F1=300Hz')
axes[1,1].axvline(2300, color='#ef4444', linestyle='--', alpha=0.7, label='F2=2300Hz')
axes[1,1].legend(facecolor='#1f2937', labelcolor='white', fontsize=8)

plt.tight_layout()
plt.show()

print("Vowels are defined by their formant frequencies:")
print(f"  'ah': F1={f1_ah}Hz, F2={f2_ah}Hz")
print(f"  'ee': F1={f1_ee}Hz, F2={f2_ee}Hz")
print()
print("Your brain identifies vowels by the RATIO of formants,")
print("not the absolute frequency. That's why children, adults,")
print("and parrots can all say the same vowel at different pitches.")`,
      challenge: 'Create a third vowel "oo" (F1=300Hz, F2=800Hz). Plot its waveform and spectrum. How does it compare visually to "ah" and "ee"?',
      successHint: 'Every vowel in every language is defined by just 2-3 formant frequencies. Speech recognition software (Siri, Alexa) works by detecting these exact patterns — the same math as above, running in real time.',
    },
    {
      title: 'Zipf\'s Law — the hidden pattern in all languages',
      concept: `In any language — English, Assamese, Mandarin, Swahili — the most common word appears roughly twice as often as the second most common word, three times as often as the third, and so on. This is **Zipf's Law**:

**frequency ∝ 1/rank**

The top 10 English words (the, be, to, of, and, a, in, that, have, I) account for about 25% of all words in any English text. The top 100 words cover about 50%.

This isn't just true for languages. Zipf's Law appears in:
- City populations (largest city is ~2× the second largest)
- Website traffic (top site gets ~2× the visits of the second)
- Species abundance in ecosystems

Why? The leading theory involves **least effort**: speakers want to use short, common words (effort saving), but listeners need diverse vocabulary (clarity). The Zipf distribution is the equilibrium between these competing pressures.`,
      analogy: 'Zipf\'s Law is like wealth distribution. A few words are extremely "rich" (used millions of times), while most words are "poor" (used rarely). The word "the" is the billionaire of English — it owns about 7% of all word usage. Just as a few companies dominate the economy, a few words dominate any text.',
      storyConnection: 'If we analyzed every word the parrot of Hajo spoke, we would find Zipf\'s Law in its vocabulary too — because the parrot learned from human speech, which follows Zipf. The parrot, without knowing it, absorbed the mathematical structure of human language simply by mimicking it.',
      checkQuestion: 'If the most common word in a text appears 1000 times, approximately how many times does the 10th most common word appear, according to Zipf\'s Law?',
      checkAnswer: 'About 100 times. Zipf\'s Law says frequency ≈ C/rank, where C is a constant. If rank 1 has frequency 1000, then rank 10 has frequency 1000/10 = 100. Rank 100 would have about 10 occurrences. This inverse relationship holds remarkably well across all natural languages.',
      codeIntro: 'Verify Zipf\'s Law by analyzing word frequencies in a sample text.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Sample text (from Assamese folktale tradition, in English)
text = """
the parrot sat on the branch of the old banyan tree in hajo and spoke
to every traveler who passed by the road the parrot knew the names of
all the merchants and all the farmers and all the fishermen who came
to the market the parrot would call out their names and the travelers
would stop and marvel at the bird that could speak like a human being
the old priest of the temple said the parrot had been blessed by the
goddess and that the words it spoke were not just words but prayers
that carried the hopes of all the people of hajo to the heavens above
the parrot spoke in many tongues and understood the language of the
wind and the rain and the river and the mountains and all who heard
the parrot speak knew that language was the greatest gift of all
"""

# Count word frequencies
words = text.lower().split()
word_counts = {}
for w in words:
    w = w.strip('.,;:!?"\'')
    if w:
        word_counts[w] = word_counts.get(w, 0) + 1

# Sort by frequency
sorted_words = sorted(word_counts.items(), key=lambda x: -x[1])
ranks = np.arange(1, len(sorted_words) + 1)
frequencies = np.array([c for _, c in sorted_words])

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# Linear scale
ax1.set_facecolor('#111827')
ax1.bar(ranks[:20], frequencies[:20], color='#22c55e', alpha=0.8)
ax1.set_xticks(ranks[:20])
ax1.set_xticklabels([w for w, _ in sorted_words[:20]], rotation=45, ha='right', color='white', fontsize=8)
ax1.set_title('Top 20 Words by Frequency', color='white', fontsize=12)
ax1.set_ylabel('Count', color='white')
ax1.tick_params(colors='gray')

# Log-log scale (Zipf's Law should be a straight line)
ax2.set_facecolor('#111827')
ax2.loglog(ranks, frequencies, 'o', color='#22c55e', markersize=4, alpha=0.7)
# Theoretical Zipf line
zipf_line = frequencies[0] / ranks
ax2.loglog(ranks, zipf_line, '--', color='#f59e0b', linewidth=2, label='Zipf prediction')
ax2.set_title('Zipf\\'s Law: Log-Log Plot', color='white', fontsize=12)
ax2.set_xlabel('Rank (log)', color='white')
ax2.set_ylabel('Frequency (log)', color='white')
ax2.legend(facecolor='#1f2937', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Top 10 words:")
for i, (word, count) in enumerate(sorted_words[:10], 1):
    expected = frequencies[0] / i
    print(f"  Rank {i}: '{word}' — count={count}, Zipf predicts={expected:.1f}")`,
      challenge: 'Replace the text with a paragraph in another language (or a longer English text). Does Zipf\'s Law still hold? Try pasting a Wikipedia article and see how well the log-log plot fits a straight line.',
      successHint: 'Zipf\'s Law is one of the most reliable patterns in all of linguistics. It emerges naturally from any sufficiently large body of text — a universal fingerprint of human communication.',
    },
    {
      title: 'The anatomy of bird calls — frequency, duration, and meaning',
      concept: `The parrot of Hajo spoke human words, but in the wild, parrots have their own complex communication system. Bird calls encode meaning through several acoustic parameters:

- **Frequency** (pitch): alarm calls are typically high-pitched (>4 kHz); contact calls are lower
- **Duration**: short, sharp calls signal danger; longer, melodic sequences attract mates
- **Repetition rate**: rapid repetition = urgency; slow repetition = contentment
- **Frequency modulation**: rising pitch = alarm; falling pitch = all-clear

Parrots in particular have **flock-specific dialects**. A flock of parrots in one forest will have subtly different calls from a flock 50 km away — just like human regional accents. Young parrots learn their flock's dialect during a critical period, similar to how human children learn language.

Research by Karl Berg showed that parrot parents name their chicks with specific call signatures before the chicks can even vocalize. These "names" are used for the rest of the bird's life.`,
      analogy: 'Bird communication is like a simple programming language. There are a limited number of "commands" (call types), each with defined parameters (pitch, duration, repetition). Human language is like a general-purpose programming language — it can express anything. Bird calls are like a domain-specific language — limited but efficient for their specific needs.',
      storyConnection: 'The parrot of Hajo was remarkable because it crossed the boundary between bird communication and human language. In reality, parrots sit at the intersection — they have their own rich communication system AND the ability to produce human speech sounds. They are natural bilinguists.',
      checkQuestion: 'If parrot parents "name" their chicks with unique call signatures, what does this tell us about the nature of parrot communication?',
      checkAnswer: 'It suggests parrot communication has arbitrary symbols — a call signature assigned to a chick is not an imitation of the chick\'s sounds but an arbitrary label chosen by the parent. This is one of the key features of true language: arbitrary symbol-referent mapping. It doesn\'t prove parrots have language, but it shows their communication is more language-like than previously thought.',
      codeIntro: 'Generate and visualize different bird call types as waveforms.',
      code: `import numpy as np
import matplotlib.pyplot as plt

t = np.linspace(0, 1, 8000)  # 1 second, 8kHz sample rate

# Alarm call: short, high-pitched, repeated
def alarm_call(t):
    signal = np.zeros_like(t)
    for start in [0.0, 0.15, 0.30, 0.45]:
        mask = (t >= start) & (t < start + 0.08)
        signal[mask] = np.sin(2 * np.pi * 4000 * t[mask]) * np.exp(-20*(t[mask]-start))
    return signal

# Contact call: longer, lower, melodic
def contact_call(t):
    freq = 1500 + 500 * np.sin(2 * np.pi * 3 * t)  # frequency modulation
    return 0.6 * np.sin(2 * np.pi * freq * t) * np.exp(-0.5*t)

# Song (mate attraction): complex, long
def song_call(t):
    f1 = 2000 + 1000 * np.sin(2 * np.pi * 5 * t)
    f2 = 3000 + 500 * np.cos(2 * np.pi * 3 * t)
    envelope = 0.5 * (1 + np.sin(2 * np.pi * 2 * t))
    return 0.5 * (np.sin(2*np.pi*f1*t) + 0.5*np.sin(2*np.pi*f2*t)) * envelope * np.exp(-0.3*t)

calls = [('Alarm call', alarm_call, '#ef4444'),
         ('Contact call', contact_call, '#22c55e'),
         ('Song', song_call, '#3b82f6')]

fig, axes = plt.subplots(3, 2, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

for i, (name, func, color) in enumerate(calls):
    signal = func(t)

    # Waveform
    axes[i,0].set_facecolor('#111827')
    axes[i,0].plot(t[:2000], signal[:2000], color=color, linewidth=0.5)
    axes[i,0].set_title(f'{name} — waveform', color='white', fontsize=10)
    axes[i,0].set_ylabel('Amplitude', color='white')
    axes[i,0].tick_params(colors='gray')

    # Spectrum
    fft = np.abs(np.fft.rfft(signal))
    freqs = np.fft.rfftfreq(len(t), 1/8000)
    axes[i,1].set_facecolor('#111827')
    axes[i,1].plot(freqs[:500], fft[:500], color=color, linewidth=1.5)
    axes[i,1].set_title(f'{name} — spectrum', color='white', fontsize=10)
    axes[i,1].set_ylabel('Magnitude', color='white')
    axes[i,1].tick_params(colors='gray')

axes[2,0].set_xlabel('Time (s)', color='white')
axes[2,1].set_xlabel('Frequency (Hz)', color='white')

plt.tight_layout()
plt.show()

print("Call type    | Frequency | Duration | Repetition | Meaning")
print("-" * 65)
print("Alarm       | High 4kHz | Short    | Rapid      | Danger!")
print("Contact     | Med 1.5kHz| Medium   | Single     | I'm here")
print("Song        | Variable  | Long     | Complex    | Mate me")`,
      challenge: 'Create a fourth call type: a "food discovery" call. It should be medium pitch, moderate duration, with 2-3 repetitions. What parameters would you choose and why?',
      successHint: 'Bird call analysis is a real field called bioacoustics. Researchers use exactly these techniques — waveform analysis, spectrograms, and frequency decomposition — to study wild bird communication.',
    },
    {
      title: 'Information theory — measuring the content of a message',
      concept: `Claude Shannon, the father of information theory, asked a revolutionary question in 1948: **How do you measure the amount of information in a message?**

His answer: information is related to **surprise**. A message that tells you something you already expected carries little information. A message that tells you something unexpected carries a lot.

Formally: **Information = -log₂(probability)** (measured in bits)

If the parrot says "hello" every single time (probability = 1.0), the information content is -log₂(1) = 0 bits. You already knew what it would say.

If the parrot randomly chooses from 8 different greetings with equal probability, each greeting carries -log₂(1/8) = 3 bits of information.

**Entropy** is the average information per message in a communication system:
H = -Σ p(x) log₂ p(x))

This single equation underlies all of digital communication — from text messages to video streaming to the internet itself.`,
      analogy: 'Information is like news. If someone tells you "the sun rose today," that\'s not news — you expected it. Zero information. If someone tells you "it snowed in Guwahati in July," that\'s very surprising — lots of information. Shannon formalized this intuition into a precise mathematical quantity.',
      storyConnection: 'If the parrot of Hajo always repeated the same phrases, people would quickly lose interest — low entropy, low information. The parrot was famous precisely because it was unpredictable — it seemed to respond differently to different people. High entropy communication is engaging; low entropy is boring.',
      checkQuestion: 'A coin flip gives 1 bit of information (two equally likely outcomes). How many bits does a single die roll give?',
      checkAnswer: 'log₂(6) ≈ 2.58 bits. Six equally likely outcomes, each with probability 1/6. Information = -log₂(1/6) = log₂(6) ≈ 2.58 bits. A die roll is more informative than a coin flip because there are more possible outcomes. A 20-sided die gives log₂(20) ≈ 4.32 bits.',
      codeIntro: 'Calculate and visualize information content for different probability distributions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Information content vs probability
probs = np.linspace(0.01, 1.0, 100)
info_bits = -np.log2(probs)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# Information vs probability
ax1.set_facecolor('#111827')
ax1.plot(probs, info_bits, color='#22c55e', linewidth=2)
ax1.set_xlabel('Probability of event', color='white')
ax1.set_ylabel('Information (bits)', color='white')
ax1.set_title('Information = Surprise', color='white', fontsize=12)
ax1.tick_params(colors='gray')

# Mark key points
points = [(1.0, 0, 'Certain (0 bits)'), (0.5, 1, 'Coin flip (1 bit)'),
          (1/6, 2.58, 'Die roll (2.58)'), (1/52, 5.7, 'Card draw (5.7)')]
for px, py, label in points:
    ax1.plot(px, py, 'o', color='#f59e0b', markersize=8)
    ax1.annotate(label, xy=(px, py), xytext=(px+0.05, py+0.3), color='#f59e0b', fontsize=9)

# Entropy for different vocabulary sizes
ax2.set_facecolor('#111827')
vocab_sizes = [2, 4, 8, 16, 32, 64, 128, 256]
entropies_uniform = [np.log2(n) for n in vocab_sizes]
entropies_zipf = []
for n in vocab_sizes:
    ranks = np.arange(1, n+1)
    probs_zipf = (1/ranks) / np.sum(1/ranks)
    h = -np.sum(probs_zipf * np.log2(probs_zipf))
    entropies_zipf.append(h)

ax2.plot(vocab_sizes, entropies_uniform, 'o-', color='#22c55e', linewidth=2, label='Uniform distribution')
ax2.plot(vocab_sizes, entropies_zipf, 's-', color='#3b82f6', linewidth=2, label='Zipf distribution')
ax2.set_xlabel('Vocabulary size', color='white')
ax2.set_ylabel('Entropy (bits/word)', color='white')
ax2.set_title('Entropy vs Vocabulary Size', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Key insight: Zipf-distributed vocabulary has LESS entropy")
print("than uniform vocabulary of the same size.")
print()
print("This means natural language is NOT maximally efficient.")
print("We trade efficiency for ease of processing — common words")
print("are short and easy to produce, even if that reduces entropy.")`,
      challenge: 'Calculate the entropy of the English alphabet (26 letters) under two distributions: uniform (all letters equally likely) and actual English frequencies. Which has higher entropy and why?',
      successHint: 'Shannon\'s information theory is the mathematical foundation of the entire digital age. Every time you send a text, stream a video, or talk to a voice assistant, Shannon\'s entropy equation is at work behind the scenes.',
    },
    {
      title: 'Natural Language Processing — teaching machines to understand words',
      concept: `The parrot of Hajo could produce human words. Can a computer do the same — and can it go further and actually *understand* them? This is the goal of **Natural Language Processing (NLP)**.

Key NLP tasks:
- **Tokenization**: splitting text into words or subwords ("The parrot spoke" → ["The", "parrot", "spoke"])
- **Part-of-speech tagging**: identifying word types (noun, verb, adjective)
- **Named entity recognition**: finding proper nouns (Hajo = place, parrot = not a name here)
- **Sentiment analysis**: is a text positive, negative, or neutral?
- **Machine translation**: converting between languages

The simplest NLP technique is the **bag of words** model: represent each text as a vector of word counts, ignoring word order. This is crude (it can't distinguish "dog bites man" from "man bites dog") but surprisingly effective for many tasks.

Modern NLP uses **neural networks** (transformers) that process word order, context, and meaning simultaneously. These models power ChatGPT, Google Translate, and voice assistants.`,
      analogy: 'Bag-of-words NLP is like reading a recipe by looking at the ingredient list but ignoring the instructions. You can tell it\'s a cake (flour, sugar, eggs) but not how to make it. Transformer-based NLP reads the full recipe — ingredients AND instructions — and understands the order matters.',
      storyConnection: 'The parrot of Hajo mimicked without understanding — a biological bag-of-words model. It could reproduce the "ingredients" of speech (individual words) without grasping the "recipe" (meaning). Modern AI models aim to do what the parrot could not: move from mimicry to comprehension.',
      checkQuestion: 'A bag-of-words model treats "The parrot spoke to the priest" and "The priest spoke to the parrot" as identical. Why is this a problem?',
      checkAnswer: 'The two sentences have different meanings — who is speaking to whom matters. Bag-of-words ignores word order, so it cannot capture this distinction. This is why order-aware models (RNNs, transformers) were developed. Word order carries meaning in all human languages, even relatively free-order ones like Latin or Assamese.',
      codeIntro: 'Build a simple bag-of-words model and compute document similarity.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Three short texts
texts = [
    "the parrot spoke words of wisdom to the travelers on the road",
    "the bird sang a beautiful song in the morning light",
    "the merchant traded spices and silk on the ancient road"
]
labels = ["Parrot text", "Bird song text", "Merchant text"]

# Build vocabulary
all_words = set()
for text in texts:
    all_words.update(text.lower().split())
vocab = sorted(all_words)

# Create bag-of-words vectors
def bow_vector(text, vocab):
    words = text.lower().split()
    return np.array([words.count(w) for w in vocab])

vectors = np.array([bow_vector(t, vocab) for t in texts])

# Compute cosine similarity
def cosine_sim(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

sim_matrix = np.zeros((3, 3))
for i in range(3):
    for j in range(3):
        sim_matrix[i][j] = cosine_sim(vectors[i], vectors[j])

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5))
fig.patch.set_facecolor('#1f2937')

# Similarity heatmap
ax1.set_facecolor('#111827')
im = ax1.imshow(sim_matrix, cmap='Greens', vmin=0, vmax=1)
ax1.set_xticks([0,1,2])
ax1.set_yticks([0,1,2])
ax1.set_xticklabels(labels, color='white', fontsize=9, rotation=30, ha='right')
ax1.set_yticklabels(labels, color='white', fontsize=9)
ax1.set_title('Cosine Similarity (Bag of Words)', color='white', fontsize=12)
for i in range(3):
    for j in range(3):
        ax1.text(j, i, f'{sim_matrix[i,j]:.2f}', ha='center', va='center', color='white', fontsize=12)
plt.colorbar(im, ax=ax1)

# Word frequency comparison
top_words = sorted(range(len(vocab)), key=lambda i: sum(vectors[:,i]), reverse=True)[:12]
x = np.arange(len(top_words))
width = 0.25
colors = ['#22c55e', '#3b82f6', '#f59e0b']

ax2.set_facecolor('#111827')
for idx, (label, color) in enumerate(zip(labels, colors)):
    vals = [vectors[idx][w] for w in top_words]
    ax2.bar(x + idx*width, vals, width, label=label, color=color, alpha=0.8)

ax2.set_xticks(x + width)
ax2.set_xticklabels([vocab[i] for i in top_words], color='white', fontsize=8, rotation=45, ha='right')
ax2.set_title('Word Counts per Document', color='white', fontsize=12)
ax2.set_ylabel('Count', color='white')
ax2.legend(facecolor='#1f2937', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Cosine similarity results:")
for i in range(3):
    for j in range(i+1, 3):
        print(f"  {labels[i]} vs {labels[j]}: {sim_matrix[i,j]:.3f}")
print()
print("Texts about similar topics have higher similarity scores.")
print("This is the foundation of search engines and recommendation systems.")`,
      challenge: 'Add a fourth text about a parrot and compute similarities. Does the model correctly identify it as most similar to the first text? What happens if you add the same text twice?',
      successHint: 'From sounds to words to information to computation — you have traced the full arc from a parrot\'s mimicry to the foundations of modern AI. Level 2 dives deeper into neural networks and how machines learn language patterns.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">No prior experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for language simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L1-${i + 1}`} number={i + 1}
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
