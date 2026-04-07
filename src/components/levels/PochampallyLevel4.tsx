import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function PochampallyLevel4() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Build a Hamming encoder/decoder engine',
      concept: `In this capstone, you will build a complete, configurable Hamming code engine that supports any valid Hamming code size: (7,4), (15,11), (31,26), and beyond. The engine automatically computes the correct number of parity bits, builds the generator and parity-check matrices, encodes data, and corrects single-bit errors.

The general Hamming code Hamming(2^r - 1, 2^r - 1 - r) uses r parity bits to protect 2^r - 1 - r data bits in a codeword of length 2^r - 1. As r increases, the code rate improves: r=3 gives rate 4/7=57%, r=4 gives 11/15=73%, r=5 gives 26/31=84%.

The parity-check matrix H has r rows and 2^r - 1 columns, where column j is the binary representation of j. The syndrome of a received word is H * received^T — if nonzero, the syndrome itself is the binary address of the errored bit.

📚 *The beauty of Hamming codes: the syndrome directly encodes the error location in binary. No search is needed — just read the syndrome as a binary number and flip that bit. This is as elegant as error correction gets.*`,
      analogy: 'Think of an address system for a city. Each house has a unique binary address (like 0101 = house 5). If you are told "there is a fire at address 0101," you go directly to house 5. The Hamming syndrome is an address — it tells you exactly which bit is on fire.',
      storyConnection: 'A Pochampally textile factory producing thousands of meters of patterned fabric needs automated quality control. Your Hamming engine could be integrated into a loom that adds check threads and a scanner that reads the finished textile, computes syndromes, and automatically flags (or even corrects) defects.',
      checkQuestion: 'For r=5, the Hamming code is (31,26). How many data bits? How many parity bits? What is the code rate?',
      checkAnswer: 'Data bits: 26. Parity bits: 5. Total: 31. Code rate: 26/31 = 83.9%. Compare to Hamming(7,4) at 57% — larger codes are much more efficient.',
      codeIntro: 'Build a general-purpose Hamming code engine that works for any valid code size.',
      code: `import numpy as np

class HammingEngine:
    """General Hamming code encoder/decoder for any r >= 2."""

    def __init__(self, r):
        self.r = r
        self.n = (1 << r) - 1       # 2^r - 1
        self.k = self.n - r          # data bits
        self._build_matrices()

    def _build_matrices(self):
        """Build parity-check matrix H and generator matrix G."""
        # H: columns are binary representations of 1 to n
        self.H = np.zeros((self.r, self.n), dtype=int)
        for j in range(1, self.n + 1):
            for i in range(self.r):
                self.H[i, j-1] = (j >> i) & 1

        # Separate data and parity positions
        parity_positions = set(1 << i for i in range(self.r))
        self.data_cols = [j for j in range(self.n) if (j + 1) not in parity_positions]
        self.parity_cols = [j for j in range(self.n) if (j + 1) in parity_positions]

    def encode(self, data_bits):
        """Encode k data bits into n-bit codeword."""
        if len(data_bits) != self.k:
            raise ValueError("Need exactly " + str(self.k) + " data bits")

        codeword = [0] * self.n
        # Place data bits
        for i, col in enumerate(self.data_cols):
            codeword[col] = data_bits[i]

        # Compute parity bits
        for i, col in enumerate(self.parity_cols):
            parity = 0
            check_bit = 1 << i
            for j in range(self.n):
                if (j + 1) & check_bit and j != col:
                    parity ^= codeword[j]
            codeword[col] = parity

        return codeword

    def decode(self, received):
        """Decode received word, correcting single-bit errors."""
        r = np.array(received, dtype=int)
        syndrome = np.dot(self.H, r) % 2
        error_pos = sum(syndrome[i] * (1 << i) for i in range(self.r))

        corrected = list(received)
        if error_pos > 0 and error_pos <= self.n:
            corrected[error_pos - 1] ^= 1

        data = [corrected[col] for col in self.data_cols]
        return data, error_pos

# Test different Hamming code sizes
print("=== Hamming Code Engine ===")
print()

for r in range(2, 6):
    eng = HammingEngine(r)
    print(f"Hamming({eng.n},{eng.k}): r={r}, rate={eng.k/eng.n:.1%}")

print()

# Detailed test with Hamming(15,11)
engine = HammingEngine(4)
print(f"=== Detailed Test: Hamming({engine.n},{engine.k}) ===")
print(f"Data bits: {engine.k} | Parity bits: {engine.r} | Total: {engine.n}")
print()

# Encode a message
data = [1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0]
codeword = engine.encode(data)
print(f"Data:     {''.join(str(b) for b in data)}")
print(f"Codeword: {''.join(str(b) for b in codeword)}")
print()

# Test correction at every position
errors_fixed = 0
for pos in range(engine.n):
    received = codeword.copy()
    received[pos] ^= 1
    decoded, syndrome = engine.decode(received)
    if decoded == data:
        errors_fixed += 1

print(f"Single-bit errors corrected: {errors_fixed}/{engine.n} "
      f"({'ALL' if errors_fixed == engine.n else 'SOME'})")

# No-error case
decoded, syndrome = engine.decode(codeword)
print(f"No error: syndrome={syndrome}, correct={decoded == data}")

print()
# Throughput analysis
print("=== Code Efficiency Comparison ===")
print(f"{'Code':<18} {'Data':>6} {'Total':>7} {'Rate':>7} {'Overhead':>9}")
print("-" * 49)
for r in range(2, 8):
    n = (1 << r) - 1
    k = n - r
    rate = k / n
    overhead = (n - k) / k * 100
    print(f"Hamming({n},{k}){'':>{8-len(str(n))-len(str(k))}} "
          f"{k:>6} {n:>7} {rate:>6.1%} {overhead:>7.1f}%")`,
      challenge: 'Encode a 26-bit message using Hamming(31,26). Introduce errors at 3 different positions one at a time and verify each is corrected. Then introduce 2 simultaneous errors — does the decoder miscorrect? What does it think the error position is?',
      successHint: 'You built a general-purpose error-correcting code engine. This same architecture powers ECC memory in every server, the error correction in flash storage (SSDs), and the Hamming code layers in modern concatenated coding schemes.',
    },
    {
      title: 'Build a noisy channel simulator',
      concept: `A **noisy channel** is any medium that can introduce errors during data transmission — a scratched DVD, a noisy phone line, a flaky WiFi connection. To test error-correcting codes, we need to simulate channels with controlled noise.

The **Binary Symmetric Channel (BSC)** is the simplest model: each bit is independently flipped with probability p. The **burst error channel** flips consecutive runs of bits. The **erasure channel** randomly "loses" bits (replacing them with a "?" symbol). Each channel model matches different real-world scenarios.

Your simulator will generate random data, encode it, transmit through a noisy channel, decode, and measure the **bit error rate (BER)** — the fraction of data bits that are wrong after decoding. By sweeping the channel error probability, you can plot the BER curve and see the "coding gain" — how much the code improves reliability.

📚 *Bit Error Rate (BER) = number of incorrectly decoded bits / total data bits. A good code has a steep BER curve: as channel quality improves slightly, the BER drops dramatically — this is called the "waterfall" region.*`,
      analogy: 'Think of a noisy channel as a game of telephone with a long chain of people. Each person might mishear a word. The channel error rate is how often each person gets a word wrong. Error-correcting codes are like adding spell-check at each step — even if a word is garbled, the context (redundancy) lets the next person figure out what was meant.',
      storyConnection: 'A Pochampally textile is a physical channel — the weaver is the encoder, the fabric is the medium, and the buyer is the receiver. Environmental factors (humidity affecting dye, thread tension variations) introduce "noise." By measuring the error rate of real textiles and comparing with the theoretical capacity, we can determine whether the weaving process is operating near its fundamental limit.',
      checkQuestion: 'A BSC with p=0.1 transmits 1000 bits. On average, how many bits are flipped? If using Hamming(7,4), how many codewords are needed for 1000 data bits?',
      checkAnswer: 'Expected flipped bits: 1000 * 0.1 = 100. For 1000 data bits with Hamming(7,4): each codeword carries 4 data bits, so 1000/4 = 250 codewords (each 7 bits). Total transmitted: 250 * 7 = 1750 bits. Expected errors: 1750 * 0.1 = 175 bit flips across 250 codewords = 0.7 errors per codeword on average. Since Hamming corrects only 1 error, many codewords will have 2+ errors and fail.',
      codeIntro: 'Build a channel simulator and measure error-correcting code performance.',
      code: `import numpy as np

class ChannelSimulator:
    """Simulate noisy channels for testing error-correcting codes."""

    def bsc(self, bits, p):
        """Binary Symmetric Channel: flip each bit with probability p."""
        noisy = list(bits)
        flipped = 0
        for i in range(len(noisy)):
            if np.random.random() < p:
                noisy[i] ^= 1
                flipped += 1
        return noisy, flipped

    def burst_channel(self, bits, burst_prob, burst_length):
        """Channel that introduces burst errors."""
        noisy = list(bits)
        i = 0
        bursts = 0
        while i < len(noisy):
            if np.random.random() < burst_prob:
                for j in range(min(burst_length, len(noisy) - i)):
                    noisy[i + j] ^= 1
                i += burst_length
                bursts += 1
            else:
                i += 1
        return noisy, bursts

class HammingCodec:
    """Hamming(7,4) encoder/decoder."""

    def encode_block(self, d):
        d1, d2, d3, d4 = d
        p1 = d1 ^ d2 ^ d4
        p2 = d1 ^ d3 ^ d4
        p4 = d2 ^ d3 ^ d4
        return [p1, p2, d1, p4, d2, d3, d4]

    def decode_block(self, r):
        p1, p2, d1, p4, d2, d3, d4 = r
        s = (p1 ^ d1 ^ d2 ^ d4) + 2 * (p2 ^ d1 ^ d3 ^ d4) + 4 * (p4 ^ d2 ^ d3 ^ d4)
        c = list(r)
        if 0 < s <= 7:
            c[s - 1] ^= 1
        return [c[2], c[4], c[5], c[6]]

    def encode(self, data):
        padded = list(data)
        while len(padded) % 4 != 0:
            padded.append(0)
        encoded = []
        for i in range(0, len(padded), 4):
            encoded.extend(self.encode_block(padded[i:i+4]))
        return encoded, len(data)

    def decode(self, received, original_len):
        decoded = []
        for i in range(0, len(received), 7):
            decoded.extend(self.decode_block(received[i:i+7]))
        return decoded[:original_len]

# Run simulation
np.random.seed(42)
channel = ChannelSimulator()
codec = HammingCodec()

data_length = 400
data = [np.random.randint(0, 2) for _ in range(data_length)]

print("=== Channel Simulation: Hamming(7,4) ===")
print(f"Data length: {data_length} bits")
print()

print(f"{'Channel p':>10} {'Bit errors':>11} {'Uncoded BER':>12} {'Coded BER':>10} {'Gain':>8}")
print("-" * 53)

for p in [0.001, 0.005, 0.01, 0.02, 0.05, 0.10, 0.15, 0.20]:
    uncoded_errors = 0
    coded_errors = 0
    trials = 50

    for _ in range(trials):
        # Uncoded
        noisy_uncoded, _ = channel.bsc(data, p)
        uncoded_errors += sum(a != b for a, b in zip(data, noisy_uncoded))

        # Coded
        encoded, orig_len = codec.encode(data)
        noisy_coded, _ = channel.bsc(encoded, p)
        decoded = codec.decode(noisy_coded, orig_len)
        coded_errors += sum(a != b for a, b in zip(data, decoded))

    uncoded_ber = uncoded_errors / (trials * data_length)
    coded_ber = coded_errors / (trials * data_length)
    gain = uncoded_ber / coded_ber if coded_ber > 0 else float('inf')
    gain_str = "inf" if gain > 1000 else str(round(gain, 1)) + "x"

    print(f"{p:>10.3f} {uncoded_errors/trials:>11.1f} {uncoded_ber:>12.4f} "
          f"{coded_ber:>10.4f} {gain_str:>8}")

print()
print("At low error rates, Hamming reduces BER dramatically.")
print("At high rates (>10%), the code cannot keep up — too many")
print("double errors per codeword for single-error correction.")`,
      challenge: 'Add the burst_channel to the comparison. Use burst_prob=0.02 and burst_length=3. How does Hamming(7,4) perform against burst errors vs random errors at the same overall bit error rate? (Hint: bursts are worse because they concentrate errors in single codewords.)',
      successHint: 'Channel simulation is how every communications standard is validated before deployment. Engineers at Qualcomm, Nokia, and SpaceX run exactly these simulations to verify that their codes work before building the hardware. You just used the same methodology.',
    },
    {
      title: 'Build a textile pattern transmission system',
      concept: `Now you will combine everything into a complete **textile pattern transmission system**: encode a Pochampally design as binary, protect it with error-correcting codes, transmit through a noisy channel, decode, and verify the result matches the original.

The system pipeline is: (1) represent the 2D pattern as a binary stream, (2) segment into blocks matching the code's data length, (3) encode each block, (4) optionally interleave, (5) transmit through a noisy channel, (6) deinterleave, (7) decode each block, (8) reconstruct the 2D pattern, (9) compare with original.

This is exactly how digital images are transmitted over noisy channels — JPEG images sent over satellite links, photos transmitted from Mars rovers, or patterns sent to digital looms. The only difference is the specific encoding scheme and channel model.

📚 *A complete communication system has three layers: source coding (compress the data), channel coding (add error protection), and modulation (convert bits to physical signals). You are building the middle layer — channel coding — which is the most mathematically rich.*`,
      analogy: 'Think of sending a painting by mail. You photograph the painting (source coding), wrap it in bubble wrap (channel coding/error protection), and ship it (channel). The recipient unwraps the bubble wrap (decoding) and views the photo (reconstruction). If the package was damaged in transit, the bubble wrap absorbed the impact and the photo is intact.',
      storyConnection: 'Imagine a future where Pochampally patterns are designed on a computer in Hyderabad and transmitted digitally to automated looms in the village of Pochampally. The channel (internet connection) may have errors. Your transmission system ensures that the pattern arriving at the loom exactly matches the designer intent — no threads out of place.',
      checkQuestion: 'A 16x16 pattern has 256 bits. Using Hamming(7,4), how many codewords and total transmitted bits? What is the transmission overhead?',
      checkAnswer: '256 / 4 = 64 codewords. Total bits: 64 * 7 = 448. Overhead: (448 - 256) / 256 = 75%. The pattern needs 75% more bits for error protection.',
      codeIntro: 'Build a complete pattern transmission system with encoding, noise, and error correction.',
      code: `import numpy as np

class PatternTransmitter:
    """Complete system for transmitting Pochampally patterns over noisy channels."""

    def __init__(self):
        pass

    def pattern_to_bits(self, pattern):
        """Flatten 2D pattern to 1D bit stream."""
        rows = len(pattern)
        cols = len(pattern[0])
        bits = []
        for row in pattern:
            bits.extend(row)
        return bits, rows, cols

    def bits_to_pattern(self, bits, rows, cols):
        """Reconstruct 2D pattern from bit stream."""
        pattern = []
        for r in range(rows):
            pattern.append(bits[r * cols:(r + 1) * cols])
        return pattern

    def hamming_encode_block(self, d):
        d1, d2, d3, d4 = d
        p1 = d1 ^ d2 ^ d4
        p2 = d1 ^ d3 ^ d4
        p4 = d2 ^ d3 ^ d4
        return [p1, p2, d1, p4, d2, d3, d4]

    def hamming_decode_block(self, r):
        p1, p2, d1, p4, d2, d3, d4 = r
        s = (p1^d1^d2^d4) + 2*(p2^d1^d3^d4) + 4*(p4^d2^d3^d4)
        c = list(r)
        if 0 < s <= 7:
            c[s-1] ^= 1
        return [c[2], c[4], c[5], c[6]]

    def encode(self, bits):
        padded = list(bits)
        while len(padded) % 4 != 0:
            padded.append(0)
        encoded = []
        for i in range(0, len(padded), 4):
            encoded.extend(self.hamming_encode_block(padded[i:i+4]))
        return encoded

    def decode(self, received, original_len):
        decoded = []
        for i in range(0, len(received), 7):
            decoded.extend(self.hamming_decode_block(received[i:i+7]))
        return decoded[:original_len]

    def add_noise(self, bits, error_rate):
        noisy = list(bits)
        for i in range(len(noisy)):
            if np.random.random() < error_rate:
                noisy[i] ^= 1
        return noisy

    def display(self, pattern, label=""):
        if label:
            print(label)
        for row in pattern:
            print("  " + "".join("█" if b else "░" for b in row))

    def compare(self, original, received):
        errors = 0
        total = 0
        for r1, r2 in zip(original, received):
            for b1, b2 in zip(r1, r2):
                total += 1
                if b1 != b2:
                    errors += 1
        return errors, total

# Create a Pochampally pattern
np.random.seed(42)
size = 12

# Diamond pattern
pattern = []
for r in range(size):
    row = []
    for c in range(size):
        dist = abs(r - size//2) + abs(c - size//2)
        row.append(1 if dist < size//2 else (r + c) % 2)
    pattern.append(row)

tx = PatternTransmitter()

tx.display(pattern, "Original Pattern:")
print()

# Convert to bits
bits, rows, cols = tx.pattern_to_bits(pattern)
print(f"Pattern: {rows}x{cols} = {len(bits)} bits")

# Test at different error rates
for error_rate in [0.01, 0.05, 0.10]:
    print(f"\\n{'='*50}")
    print(f"Channel error rate: {error_rate:.0%}")

    # Uncoded transmission
    noisy_bits = tx.add_noise(bits, error_rate)
    uncoded_pattern = tx.bits_to_pattern(noisy_bits, rows, cols)
    uncoded_errors, total = tx.compare(pattern, uncoded_pattern)

    # Coded transmission
    encoded = tx.encode(bits)
    noisy_encoded = tx.add_noise(encoded, error_rate)
    decoded_bits = tx.decode(noisy_encoded, len(bits))
    coded_pattern = tx.bits_to_pattern(decoded_bits, rows, cols)
    coded_errors, _ = tx.compare(pattern, coded_pattern)

    print(f"Transmitted bits: {len(bits)} uncoded, {len(encoded)} coded")
    print(f"Uncoded errors: {uncoded_errors}/{total} = {uncoded_errors/total:.1%}")
    print(f"Coded errors:   {coded_errors}/{total} = {coded_errors/total:.1%}")
    improvement = "perfect" if coded_errors == 0 else str(round(uncoded_errors / max(coded_errors, 1), 1)) + "x better"
    print(f"Improvement: {improvement}")
    print()
    tx.display(coded_pattern, "Received (coded):")`,
      challenge: 'Add interleaving (depth 4) between encoding and transmission. Test with burst errors (burst_prob=0.05, burst_length=4). Compare the received pattern with and without interleaving. How many pattern errors does interleaving prevent?',
      successHint: 'You built a complete digital communication system from scratch — the same architecture used by every device that transmits data: phones, satellites, WiFi routers, Bluetooth earbuds. The pipeline of source coding, channel coding, transmission, and decoding is universal.',
    },
    {
      title: 'Performance analysis — coding gain and BER curves',
      concept: `The ultimate measure of an error-correcting code is its **BER curve** — a plot of output Bit Error Rate versus channel error probability. A good code has a steep "waterfall" region where BER drops sharply. The **coding gain** is how much better the coded BER is compared to uncoded at the same channel quality.

Professional communications engineers characterize codes by: (1) BER vs channel error rate, (2) coding gain at target BER (e.g., how much better is coded at BER = 10^-6?), (3) the "waterfall" threshold (the channel quality where coding starts to help), and (4) the "error floor" (the residual BER even at very good channel quality, caused by rare uncorrectable error patterns).

For Hamming(7,4), the BER can be computed analytically: a codeword fails when 2 or more of its 7 bits are wrong. The probability of uncorrectable error is 1 - P(0 errors) - P(1 error) = 1 - (1-p)^7 - 7p(1-p)^6, where p is the bit error probability.

📚 *The waterfall region of a BER curve is where the code transitions from "barely helps" to "eliminates almost all errors." Finding this region is the key to choosing the right code for a given channel quality.*`,
      analogy: 'Think of a dam. Below a certain water level (good channel), the dam holds perfectly — zero flooding (zero BER). As water rises (channel gets worse), there is a critical level where water starts to overtop — this is the waterfall threshold. Beyond that, flooding increases rapidly. The BER curve looks exactly like this: flat at zero, then a sharp rise at the threshold.',
      storyConnection: 'For a Pochampally textile production line, the BER curve tells the factory manager: "If your per-thread error rate is below 2%, the Hamming code eliminates virtually all defects. Above 5%, you need either a stronger code or better-trained weavers." This quantitative approach transforms quality control from guesswork to engineering.',
      checkQuestion: 'At channel error rate p=0.05, what is the probability that a Hamming(7,4) codeword has exactly 2 errors (and therefore fails)?',
      checkAnswer: 'P(exactly 2 errors) = C(7,2) * 0.05^2 * 0.95^5 = 21 * 0.0025 * 0.7738 = 0.0406 = about 4%. So roughly 1 in 25 codewords will have an uncorrectable error at 5% channel noise.',
      codeIntro: 'Compute BER curves analytically and by simulation, and analyze coding gain.',
      code: `import numpy as np
from math import comb, factorial

# BER curve analysis for error-correcting codes

def binomial_prob(n, k, p):
    """Probability of exactly k successes in n trials with prob p."""
    return comb(n, k) * (p ** k) * ((1 - p) ** (n - k))

def uncoded_ber(p):
    """BER without coding = channel error rate."""
    return p

def hamming74_ber(p):
    """Analytical BER for Hamming(7,4)."""
    # Codeword error prob: P(2+ errors in 7 bits)
    p_correct = sum(binomial_prob(7, k, p) for k in range(2))
    p_codeword_error = 1 - p_correct

    # When codeword fails, on average ~2 of 4 data bits are wrong
    # (miscorrection flips a bit, plus the original errors)
    # Approximate: each data bit wrong with prob ~ p_codeword_error * 0.5
    ber = p_codeword_error * 3 / 7  # approximate data BER
    return min(ber, 0.5)

def hamming1511_ber(p):
    """Analytical BER for Hamming(15,11)."""
    p_correct = sum(binomial_prob(15, k, p) for k in range(2))
    p_codeword_error = 1 - p_correct
    ber = p_codeword_error * 3 / 15
    return min(ber, 0.5)

def triple_rep_ber(p):
    """BER for triple repetition code."""
    # Fails when 2+ of 3 bits are wrong
    p_fail = binomial_prob(3, 2, p) + binomial_prob(3, 3, p)
    return p_fail

# Compute BER curves
print("=== BER Curve Data ===")
print(f"{'Channel p':>10} {'Uncoded':>10} {'Triple':>10} {'Ham(7,4)':>10} {'Ham(15,11)':>12}")
print("-" * 54)

channel_ps = [0.001, 0.002, 0.005, 0.01, 0.02, 0.03, 0.05, 0.07, 0.10, 0.15, 0.20]

for p in channel_ps:
    unc = uncoded_ber(p)
    tri = triple_rep_ber(p)
    h74 = hamming74_ber(p)
    h1511 = hamming1511_ber(p)
    print(f"{p:>10.3f} {unc:>10.6f} {tri:>10.6f} {h74:>10.6f} {h1511:>12.6f}")

print()
# Coding gain analysis
print("=== Coding Gain at Target BER ===")
target_bers = [0.01, 0.001, 0.0001]

for target in target_bers:
    print(f"\\nTarget BER = {target}")
    # Find channel p where each code achieves this BER
    for p_test in np.linspace(0.001, 0.4, 1000):
        if uncoded_ber(p_test) >= target:
            p_uncoded = p_test
            break

    for p_test in np.linspace(0.001, 0.4, 1000):
        if hamming74_ber(p_test) >= target:
            p_h74 = p_test
            break

    print(f"  Uncoded: needs channel p < {p_uncoded:.3f}")
    print(f"  Ham(7,4): works up to channel p = {p_h74:.3f}")
    print(f"  Gain: code works at {p_h74/p_uncoded:.1f}x worse channel quality")

print()
# Simulation verification
print("=== Simulation Verification (1000 codewords) ===")
np.random.seed(42)
n_codewords = 1000

for p in [0.01, 0.05, 0.10]:
    errors_uncoded = 0
    errors_coded = 0
    total_data_bits = n_codewords * 4

    for _ in range(n_codewords):
        data = [np.random.randint(0, 2) for _ in range(4)]

        # Uncoded
        noisy = [b ^ (1 if np.random.random() < p else 0) for b in data]
        errors_uncoded += sum(a != b for a, b in zip(data, noisy))

        # Hamming(7,4)
        d1, d2, d3, d4 = data
        cw = [d1^d2^d4, d1^d3^d4, d1, d2^d3^d4, d2, d3, d4]
        noisy_cw = [b ^ (1 if np.random.random() < p else 0) for b in cw]
        p1,p2,dd1,p4,dd2,dd3,dd4 = noisy_cw
        s = (p1^dd1^dd2^dd4) + 2*(p2^dd1^dd3^dd4) + 4*(p4^dd2^dd3^dd4)
        c = list(noisy_cw)
        if 0 < s <= 7:
            c[s-1] ^= 1
        decoded = [c[2], c[4], c[5], c[6]]
        errors_coded += sum(a != b for a, b in zip(data, decoded))

    sim_unc = errors_uncoded / total_data_bits
    sim_cod = errors_coded / total_data_bits
    ana_unc = p
    ana_cod = hamming74_ber(p)
    print(f"p={p:.2f}: Sim uncoded={sim_unc:.4f} (theory={ana_unc:.4f}) | "
          f"Sim coded={sim_cod:.4f} (theory={ana_cod:.4f})")`,
      challenge: 'Compute the BER curve for a Hamming(31,26) code (r=5). At what channel error rate does it achieve BER < 0.001? Compare this threshold with Hamming(7,4) and Hamming(15,11). Which code would you choose for a channel with p=0.03?',
      successHint: 'BER analysis is the standard method for evaluating any communication system. Every wireless standard (WiFi, 5G, Bluetooth), every storage standard (SSD, HDD), and every space communication link is designed by computing BER curves exactly as you just did. You now have the tools to evaluate any error-correcting code quantitatively.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Capstone
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Build an error-correcting encoder/decoder</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These capstone exercises build a complete error-correcting communication system.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {loadProgress}</>) : (<><Sparkles className="w-5 h-5" /> Load Python</>)}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson
            key={i}
            id={`L4-${i + 1}`}
            number={i + 1}
            title={lesson.title}
            concept={lesson.concept}
            analogy={lesson.analogy}
            storyConnection={lesson.storyConnection}
            checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer}
            codeIntro={lesson.codeIntro}
            code={lesson.code}
            challenge={lesson.challenge}
            successHint={lesson.successHint}
          />
        ))}
      </div>
    </div>
  );
}
