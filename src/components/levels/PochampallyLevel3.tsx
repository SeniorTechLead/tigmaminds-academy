import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function PochampallyLevel3() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Hamming(7,4) — the elegant error-correcting code',
      concept: `Richard Hamming invented his code in 1950 after being frustrated that his Bell Labs computer kept crashing due to single-bit errors. The **Hamming(7,4)** code encodes 4 data bits into 7 bits by adding 3 parity bits. It can **detect and correct any single-bit error** with a code rate of 4/7 = 57% — far better than triple repetition's 33%.

The key insight: place parity bits at positions that are powers of 2 (positions 1, 2, 4). Each parity bit covers a specific set of data positions determined by the binary representation of the position number. Parity bit 1 covers all positions whose binary representation has a 1 in the last digit. Parity bit 2 covers positions with a 1 in the second-to-last digit. And so on.

When an error occurs, the pattern of parity check failures (called the **syndrome**) directly gives the binary position number of the error. If parity checks 1 and 2 fail but check 4 passes, the syndrome is 011 in binary = position 3. Flip bit 3 and the error is corrected.

📚 *The syndrome is the result of all parity checks. In Hamming(7,4), the syndrome is a 3-bit number. If the syndrome is 000, there is no error. Otherwise, the syndrome gives the position of the error.*`,
      analogy: 'Imagine you have 7 friends standing in a line, and one of them is lying. You ask three questions, each to a different subset of friends. The pattern of truthful/untruthful answers uniquely identifies the liar. Hamming codes work the same way: three parity checks, each covering a different subset of bits, uniquely identify the errored bit.',
      storyConnection: 'A Pochampally textile with 4 pattern threads and 3 check threads per unit can self-correct any single-thread error. The check threads are woven at positions 1, 2, and 4 in each 7-thread group. A quality inspector does not need to compare against the original design — just checking the three parity conditions reveals and fixes any mistake.',
      checkQuestion: 'In Hamming(7,4), parity check 1 covers positions {1,3,5,7}. Parity check 2 covers {2,3,6,7}. Parity check 4 covers {4,5,6,7}. If the received word is 1011011 and parity checks 1 and 4 fail, where is the error?',
      checkAnswer: 'Syndrome = check1 failed (1) + check2 passed (0) + check4 failed (1) = binary 101 = position 5. The bit at position 5 is wrong. Flip it: 1011011 becomes 1011111. (Position numbering starts at 1.)',
      codeIntro: 'Implement the Hamming(7,4) encoder and decoder with syndrome-based error correction.',
      code: `# Hamming(7,4) — single error correcting code

def hamming_encode(data_bits):
    """
    Encode 4 data bits into 7-bit Hamming codeword.
    Positions: p1 p2 d1 p4 d2 d3 d4
    (p = parity, d = data)
    """
    d1, d2, d3, d4 = data_bits

    # Parity bits (even parity)
    p1 = d1 ^ d2 ^ d4      # covers positions 1,3,5,7
    p2 = d1 ^ d3 ^ d4      # covers positions 2,3,6,7
    p4 = d2 ^ d3 ^ d4      # covers positions 4,5,6,7

    return [p1, p2, d1, p4, d2, d3, d4]

def hamming_decode(codeword):
    """
    Decode a 7-bit Hamming codeword.
    Returns (data_bits, error_position, corrected).
    """
    p1, p2, d1, p4, d2, d3, d4 = codeword

    # Syndrome calculation
    s1 = p1 ^ d1 ^ d2 ^ d4    # check positions 1,3,5,7
    s2 = p2 ^ d1 ^ d3 ^ d4    # check positions 2,3,6,7
    s4 = p4 ^ d2 ^ d3 ^ d4    # check positions 4,5,6,7

    syndrome = s1 * 1 + s2 * 2 + s4 * 4

    corrected = list(codeword)
    if syndrome > 0:
        # Syndrome gives the 1-indexed position of the error
        corrected[syndrome - 1] ^= 1  # flip the errored bit

    data = [corrected[2], corrected[4], corrected[5], corrected[6]]
    return data, syndrome, corrected

# Encode all possible 4-bit data words
print("=== Hamming(7,4) Encoding Table ===")
print(f"{'Data':<8} {'Codeword':<12} {'Weight':>7}")
print("-" * 29)

for i in range(16):
    data = [(i >> 3) & 1, (i >> 2) & 1, (i >> 1) & 1, i & 1]
    codeword = hamming_encode(data)
    weight = sum(codeword)
    data_str = "".join(str(b) for b in data)
    code_str = "".join(str(b) for b in codeword)
    print(f"{data_str:<8} {code_str:<12} {weight:>7}")

print()
print("=== Error Correction Demo ===")
data = [1, 0, 1, 1]
codeword = hamming_encode(data)
print(f"Original data: {''.join(str(b) for b in data)}")
print(f"Encoded:       {''.join(str(b) for b in codeword)}")
print()

# Test error at each position
print(f"{'Error pos':<11} {'Received':<11} {'Syndrome':>9} {'Decoded':<9} {'Correct?':>9}")
print("-" * 52)

for pos in range(7):
    received = codeword.copy()
    received[pos] ^= 1  # flip one bit
    decoded, syndrome, corrected = hamming_decode(received)
    is_correct = decoded == data
    print(f"  pos {pos+1:<5} {''.join(str(b) for b in received):<11} "
          f"{syndrome:>9} {''.join(str(b) for b in decoded):<9} "
          f"{'YES' if is_correct else 'NO':>9}")

print()
# No error case
decoded, syndrome, _ = hamming_decode(codeword)
print(f"No error:  {''.join(str(b) for b in codeword):<11} "
      f"{syndrome:>9} {''.join(str(b) for b in decoded):<9} "
      f"{'YES' if decoded == data else 'NO':>9}")

print()
print(f"Code rate: 4/7 = {4/7:.1%}")
print("Hamming(7,4) corrects ANY single-bit error!")`,
      challenge: 'Introduce TWO errors in the same codeword (flip 2 bits). What does the syndrome point to? Does the decoder "correct" to the right data? (Hint: it will not — it will miscorrect. This is why Hamming(7,4) is a single-error-correcting code.)',
      successHint: 'The Hamming code is used in ECC (Error-Correcting Code) memory in servers, where single-bit errors from cosmic rays must be corrected silently. Every data center in the world runs on Hamming-coded memory. You just built the same algorithm.',
    },
    {
      title: 'Systematic Hamming codes — separating data from check bits',
      concept: `In the standard Hamming(7,4) code, data bits and parity bits are interleaved, which is inconvenient. A **systematic** code keeps all data bits together and appends the parity bits at the end. The encoding and decoding use **matrix multiplication** over GF(2) (binary arithmetic where 1+1=0).

The **generator matrix G** converts data bits to codewords: codeword = data * G (mod 2). The **parity-check matrix H** checks for errors: syndrome = H * received^T (mod 2). If the syndrome is zero, no error. Otherwise, the syndrome column matches the column of H corresponding to the error position.

This matrix formulation is powerful because it generalizes: by designing different G and H matrices, you can create codes with any desired error-correcting capability. Hamming codes, BCH codes, Reed-Solomon codes, and LDPC codes all use this matrix framework.

📚 *GF(2) is the binary field: {0, 1} with addition = XOR and multiplication = AND. Matrix operations over GF(2) are just like regular matrix operations but with XOR replacing addition.*`,
      analogy: 'Think of a recipe (the generator matrix) and a checklist (the parity-check matrix). The recipe transforms ingredients (data) into a dish (codeword). The checklist verifies the dish is correct. If the checklist fails, the pattern of failures tells you exactly which ingredient went wrong.',
      storyConnection: 'The matrix formulation of coding is like a weaving pattern expressed as a grid of instructions. The generator matrix is the master pattern card that tells the loom how to produce the correct weave. The parity-check matrix is the quality control card that verifies the weave is correct. Pochampally cooperatives use similar structured instruction systems for consistency across multiple weavers.',
      checkQuestion: 'In a systematic code, the codeword for data [1,0,1,1] starts with [1,0,1,1,...]. If the generator matrix adds 3 parity bits, what is the codeword length?',
      checkAnswer: '4 data bits + 3 parity bits = 7 bits total. The first 4 bits of the codeword are always the original data, making decoding trivial when there are no errors — just take the first 4 bits.',
      codeIntro: 'Implement Hamming codes using generator and parity-check matrices.',
      code: `import numpy as np

# Systematic Hamming code using matrices over GF(2)

def gf2_matmul(A, B):
    """Matrix multiplication over GF(2) (binary field)"""
    result = np.dot(A, B) % 2
    return result.astype(int)

# Hamming(7,4) systematic generator matrix
# G = [I4 | P] where I4 is 4x4 identity, P is parity sub-matrix
G = np.array([
    [1, 0, 0, 0, 1, 1, 0],
    [0, 1, 0, 0, 1, 0, 1],
    [0, 0, 1, 0, 0, 1, 1],
    [0, 0, 0, 1, 1, 1, 1],
], dtype=int)

# Parity-check matrix
# H = [P^T | I3]
H = np.array([
    [1, 1, 0, 1, 1, 0, 0],
    [1, 0, 1, 1, 0, 1, 0],
    [0, 1, 1, 1, 0, 0, 1],
], dtype=int)

print("=== Generator Matrix G ===")
for row in G:
    print("  " + " ".join(str(b) for b in row))
print()

print("=== Parity-Check Matrix H ===")
for row in H:
    print("  " + " ".join(str(b) for b in row))
print()

# Verify: G * H^T = 0 (valid generator/check pair)
product = gf2_matmul(G, H.T)
print(f"G * H^T = 0? {np.all(product == 0)} (must be True for valid code)")
print()

# Encode using matrix multiplication
def encode(data_bits):
    d = np.array(data_bits, dtype=int).reshape(1, 4)
    return gf2_matmul(d, G).flatten()

def decode(received):
    r = np.array(received, dtype=int).reshape(7, 1)
    syndrome = gf2_matmul(H, r).flatten()
    error_pos = -1

    if np.any(syndrome):
        # Find which column of H matches the syndrome
        for col in range(7):
            if np.array_equal(H[:, col], syndrome):
                error_pos = col
                break

    corrected = np.array(received, dtype=int).copy()
    if error_pos >= 0:
        corrected[error_pos] ^= 1

    return corrected[:4].tolist(), int(np.sum(syndrome * [1, 2, 4])), error_pos

# Encode all 16 possible data words
print("=== Systematic Encoding ===")
print(f"{'Data':<8} {'Codeword':<10} {'Data part':<10} {'Check part':<10}")
print("-" * 40)

for i in range(16):
    data = [(i >> 3) & 1, (i >> 2) & 1, (i >> 1) & 1, i & 1]
    codeword = encode(data)
    d_str = "".join(str(b) for b in data)
    c_str = "".join(str(b) for b in codeword)
    print(f"{d_str:<8} {c_str:<10} {c_str[:4]:<10} {c_str[4:]:<10}")

print()
# Error correction test
data = [1, 0, 1, 1]
codeword = encode(data)
print(f"=== Correction Test: data = {''.join(str(b) for b in data)} ===")
print(f"Codeword: {''.join(str(b) for b in codeword)}")
print()

for pos in range(7):
    received = codeword.copy()
    received[pos] ^= 1
    decoded, syndrome, err_pos = decode(received.tolist())
    ok = decoded == data
    print(f"  Error at {pos}: syndrome={syndrome} -> fix pos {err_pos}: "
          f"{''.join(str(b) for b in decoded)} {'OK' if ok else 'FAIL'}")`,
      challenge: 'Extend to Hamming(15,11) which encodes 11 data bits into 15 bits using 4 parity checks. Build the 11x15 generator matrix and 4x15 parity-check matrix. What is the code rate? (Hint: 11/15 = 73% — much better than 7,4 at 57%.)',
      successHint: 'Matrix-based coding is the framework for ALL modern error-correcting codes. 5G networks use LDPC codes, deep space probes use turbo codes, and QR codes use Reed-Solomon codes — all defined by their generator and parity-check matrices, exactly as you just implemented.',
    },
    {
      title: 'Reed-Solomon concepts — correcting burst errors',
      concept: `Hamming codes correct single-bit errors, but real-world errors often come in **bursts** — a scratch on a CD damages many consecutive bits, a lightning strike corrupts many consecutive bytes. **Reed-Solomon (RS) codes** are designed to correct burst errors by working on **symbols** (groups of bits) rather than individual bits.

An RS code operates on symbols of m bits each (typically m=8, so each symbol is a byte). RS(n,k) encodes k data symbols into n symbols by adding n-k check symbols. It can correct up to (n-k)/2 symbol errors — regardless of how many bits are wrong within each symbol.

For example, RS(255,223) encodes 223 data bytes into 255 bytes, adding 32 check bytes. It can correct up to 16 byte errors — even if all 8 bits of each errored byte are wrong. This is why CDs and DVDs can play even when scratched: the RS code corrects the burst of damaged bytes.

📚 *A burst error corrupts multiple consecutive bits. A Hamming code can only correct 1-bit errors, so a 3-bit burst error would defeat it. Reed-Solomon corrects bursts by treating each group of bits as a single symbol — if any bits in a symbol are wrong, the whole symbol is counted as one error.*`,
      analogy: 'Imagine a book where pages can be torn out. A Hamming code is like proofreading letter by letter — it catches one wrong letter but fails if a whole page is damaged. Reed-Solomon is like having a summary card for each chapter — if an entire page is damaged (burst error), the summary card lets you reconstruct the missing text.',
      storyConnection: 'In Pochampally weaving, a burst error might be an entire row of incorrect ties — perhaps the weaver lost their place and repeated the wrong pattern for several rows. A Hamming code on individual threads would fail catastrophically. But a Reed-Solomon-like approach that groups threads into symbols and adds check-rows could correct the entire burst, recovering the intended pattern.',
      checkQuestion: 'RS(15,11) corrects up to (15-11)/2 = 2 symbol errors. If each symbol is 4 bits, what is the maximum number of BIT errors it can correct if all errors are in 2 symbols?',
      checkAnswer: 'Each symbol is 4 bits, and 2 symbols can be corrected. In the worst case, all 4 bits in each symbol are wrong: 2 * 4 = 8 bit errors corrected. A Hamming code of the same size would only correct 1 bit error.',
      codeIntro: 'Demonstrate Reed-Solomon concepts using a simplified symbol-based error-correcting code.',
      code: `# Reed-Solomon concepts — symbol-based error correction

import numpy as np

class SimpleReedSolomon:
    """
    Simplified RS-like code operating on integer symbols.
    This demonstrates the concept without full Galois field arithmetic.
    Uses modular arithmetic as a simplified stand-in.
    """

    def __init__(self, n_total, k_data, field_size=256):
        self.n = n_total
        self.k = k_data
        self.redundancy = n_total - k_data
        self.t = self.redundancy // 2  # correction capability
        self.field = field_size

    def encode(self, data_symbols):
        """Add check symbols using weighted sums (simplified)."""
        if len(data_symbols) != self.k:
            raise ValueError("Data must be k symbols")

        check_symbols = []
        for i in range(self.redundancy):
            check = 0
            for j, d in enumerate(data_symbols):
                weight = pow(j + 1, i + 1, self.field)
                check = (check + d * weight) % self.field
            check_symbols.append(check)

        return data_symbols + check_symbols

    def detect_errors(self, received):
        """Check if received codeword has errors."""
        data = received[:self.k]
        received_checks = received[self.k:]

        expected_checks = []
        for i in range(self.redundancy):
            check = 0
            for j, d in enumerate(data):
                weight = pow(j + 1, i + 1, self.field)
                check = (check + d * weight) % self.field
            expected_checks.append(check)

        syndromes = [(r - e) % self.field for r, e in zip(received_checks, expected_checks)]
        return syndromes

# Create a simplified RS code
rs = SimpleReedSolomon(n_total=10, k_data=6, field_size=256)

print("=== Reed-Solomon Concepts ===")
print(f"Code: RS({rs.n},{rs.k})")
print(f"Data symbols: {rs.k}")
print(f"Check symbols: {rs.redundancy}")
print(f"Correction capability: {rs.t} symbol errors")
print(f"Code rate: {rs.k}/{rs.n} = {rs.k/rs.n:.0%}")
print()

# Encode a message (as byte values)
data = [80, 79, 67, 72, 65, 77]  # "POCHAM" in ASCII
codeword = rs.encode(data)
print(f"Data: {data}")
print(f"Data as text: {''.join(chr(d) for d in data)}")
print(f"Codeword: {codeword}")
print(f"Check symbols: {codeword[rs.k:]}")
print()

# Check clean codeword
syndromes = rs.detect_errors(codeword)
print(f"Syndromes (no error): {syndromes}")
print(f"All zero? {all(s == 0 for s in syndromes)}")
print()

# Single symbol error
print("=== Error Detection ===")
for pos in range(rs.k):
    corrupted = codeword.copy()
    corrupted[pos] = (corrupted[pos] + 42) % 256  # corrupt one symbol
    syndromes = rs.detect_errors(corrupted)
    nonzero = sum(1 for s in syndromes if s != 0)
    print(f"  Error at symbol {pos}: {nonzero} non-zero syndromes -> DETECTED")

print()
# Burst error (multiple consecutive symbols)
print("=== Burst Error Detection ===")
for burst_len in range(1, rs.redundancy + 1):
    corrupted = codeword.copy()
    for i in range(burst_len):
        corrupted[i] = (corrupted[i] + 10 * (i + 1)) % 256
    syndromes = rs.detect_errors(corrupted)
    nonzero = sum(1 for s in syndromes if s != 0)
    can_correct = burst_len <= rs.t
    print(f"  Burst of {burst_len} symbols: {nonzero} non-zero syndromes | "
          f"Correctable: {'YES' if can_correct else 'NO'}")

print()
# Compare with bit-level Hamming
print("=== RS vs Hamming for Burst Errors ===")
print(f"{'Burst size':<14} {'Hamming(7,4)':>13} {'RS(10,6)':>10}")
print("-" * 39)
for burst in [1, 2, 3, 4, 8, 16]:
    hamming = "Corrects" if burst == 1 else "FAILS"
    reed = "Corrects" if burst <= rs.t else "Detects" if burst <= rs.redundancy else "FAILS"
    print(f"{burst:>4} bits/syms  {hamming:>13} {reed:>10}")`,
      challenge: 'CDs use RS(255,223) which corrects up to 16 byte errors. A typical scratch damages about 1000 bytes. How is this possible? (Hint: CDs use interleaving — the bytes on disc are shuffled so that a physical scratch damages non-consecutive codewords. Research "cross-interleaved Reed-Solomon coding" or CIRC.)',
      successHint: 'Reed-Solomon codes are everywhere: CDs, DVDs, Blu-ray, QR codes, digital television (DVB), deep space communication (Voyager probes), and data storage (RAID 6). You just learned the principles behind the code that lets you read a scratched CD.',
    },
    {
      title: 'Information theory — the limits of error correction',
      concept: `Claude Shannon's **Channel Coding Theorem** (1948) proves that for any noisy channel, there exists a code that can achieve arbitrarily low error rates — as long as the code rate is below the **channel capacity**. This is the most surprising result in information theory: reliable communication is possible over unreliable channels.

The **channel capacity** C = 1 - H(p), where H(p) = -p*log2(p) - (1-p)*log2(1-p) is the binary entropy of the error probability p. For a channel that flips each bit with probability 10%, the capacity is about 0.531 — meaning any code with rate below 53.1% can theoretically achieve near-perfect reliability.

**Entropy** H is the average information content of a random variable. A fair coin has H = 1 bit (maximum uncertainty). A biased coin (90% heads) has H = 0.47 bits (less uncertainty). Entropy measures the fundamental limit of data compression: you cannot compress data below its entropy.

📚 *Shannon's theorems establish two fundamental limits: (1) you cannot compress data below its entropy (source coding theorem), and (2) you can communicate reliably at any rate below channel capacity (channel coding theorem). Together, they define the field of information theory.*`,
      analogy: 'Imagine a highway with a speed limit. Shannon proved that every noisy channel has a "speed limit" (capacity) — you can communicate reliably at any speed below the limit, but not above it. The remarkable part: the speed limit is nonzero even for very noisy channels. You can always find a way to communicate, as long as you are patient enough (use a lower code rate).',
      storyConnection: 'A Pochampally textile transmission channel might have a 5% error rate (5% of threads are accidentally tied or untied incorrectly). Shannon theory tells us the capacity of this channel is 0.714 — so any encoding scheme with rate below 71.4% can theoretically achieve error-free transmission. Our Hamming(7,4) at 57% rate is well below this limit, so it is theoretically capable of reliable communication.',
      checkQuestion: 'A channel flips bits with probability p = 0.01 (1% error rate). Using the formula C = 1 - H(p), what is the approximate channel capacity?',
      checkAnswer: 'H(0.01) = -0.01 * log2(0.01) - 0.99 * log2(0.99) = 0.01 * 6.64 + 0.99 * 0.0145 = 0.0664 + 0.0144 = 0.0808. C = 1 - 0.0808 = 0.919. So a 1% error channel can support code rates up to 91.9% with reliable communication.',
      codeIntro: 'Compute channel capacity, entropy, and explore the fundamental limits of error correction.',
      code: `import numpy as np

# Information Theory — fundamental limits

def binary_entropy(p):
    """Binary entropy function H(p)"""
    if p <= 0 or p >= 1:
        return 0
    return -p * np.log2(p) - (1 - p) * np.log2(1 - p)

def channel_capacity_bsc(p):
    """Capacity of Binary Symmetric Channel with error prob p"""
    return 1 - binary_entropy(p)

# Channel capacity vs error probability
print("=== Binary Symmetric Channel Capacity ===")
print(f"{'Error Rate':>12} {'Entropy H(p)':>13} {'Capacity C':>11} {'Max Code Rate':>14}")
print("-" * 52)

for p in [0.001, 0.01, 0.05, 0.10, 0.15, 0.20, 0.30, 0.40, 0.50]:
    h = binary_entropy(p)
    c = channel_capacity_bsc(p)
    print(f"{p:>12.3f} {h:>13.4f} {c:>11.4f} {c:>12.1%}")

print()
print("At p=0.5 (random noise), capacity = 0: no communication possible.")
print("At p=0.01, capacity = 0.92: very efficient codes work!")
print()

# Compare our codes against the Shannon limit
print("=== Our Codes vs Shannon Limit ===")
p_error = 0.05
capacity = channel_capacity_bsc(p_error)

codes = [
    ("Uncoded", 1.000),
    ("Triple repetition", 1/3),
    ("Hamming(7,4)", 4/7),
    ("Hamming(15,11)", 11/15),
    ("RS(255,223)", 223/255),
    ("Shannon limit", capacity),
]

print(f"Channel error rate: {p_error:.0%}")
print(f"Shannon capacity: {capacity:.4f}")
print()
print(f"{'Code':<22} {'Rate':>8} {'vs Capacity':>12} {'Status':>10}")
print("-" * 54)

for name, rate in codes:
    gap = rate - capacity
    if name == "Shannon limit":
        status = "LIMIT"
    elif rate <= capacity:
        status = "feasible"
    else:
        status = "over limit"
    print(f"{name:<22} {rate:>8.3f} {gap:>+11.3f} {status:>10}")

print()
# Entropy of a source (data compression limit)
print("=== Source Entropy (Compression Limit) ===")
print("How much can we compress a Pochampally pattern?")
print()

# A pattern where dyed threads appear with probability p
for p_dyed in [0.1, 0.2, 0.3, 0.5, 0.7, 0.9]:
    h = binary_entropy(p_dyed)
    # For 1000 bits of pattern, minimum compressed size:
    min_bits = 1000 * h
    compression = min_bits / 1000
    print(f"  P(dyed) = {p_dyed:.1f}: H = {h:.3f} bits/thread | "
          f"1000 threads compress to >= {min_bits:.0f} bits ({compression:.0%})")

print()
print("A 50/50 pattern (max entropy) cannot be compressed at all!")
print("A mostly-white pattern (low entropy) compresses very well.")`,
      challenge: 'For a channel with p = 0.10, the capacity is about 0.531. Design a repetition code that operates below this capacity. What is the minimum number of repetitions needed? (Hint: rate = 1/n, so n >= 1/0.531 = 1.88, meaning you need at least n=2 repetitions. But does rate-1/2 repetition actually correct errors at p=0.10?)',
      successHint: 'Shannon information theory is one of the great intellectual achievements of the 20th century. It underlies all digital communication, data compression, cryptography, and machine learning. The entropy function H(p) that you just computed is the most important function in information science.',
    },
    {
      title: 'Interleaving — spreading errors across codewords',
      concept: `Even powerful error-correcting codes have limits. Hamming(7,4) corrects 1 error per codeword. If a burst error hits 3 consecutive bits, two of those bits might be in the same codeword — causing an uncorrectable double error. **Interleaving** solves this by rearranging bits from multiple codewords so that consecutive bits belong to different codewords.

Imagine 4 Hamming(7,4) codewords: A=[a1,a2,...,a7], B=[b1,...,b7], C=[c1,...,c7], D=[d1,...,d7]. Without interleaving, they are transmitted as AABBCCDD. A 3-bit burst corrupts 3 bits in one codeword — uncorrectable. With interleaving, transmission order is a1,b1,c1,d1,a2,b2,c2,d2,... Now a 4-bit burst corrupts 1 bit in each of 4 different codewords — each correctable!

The **interleaving depth** is the number of codewords shuffled together. Depth d means a burst of d errors is spread to at most 1 error per codeword. Combined with a t-error-correcting code, the system can handle bursts up to d*t errors.

📚 *Interleaving does not add any redundancy — it just rearranges the transmission order. It transforms burst errors into scattered errors, which existing codes handle much better. The cost is increased latency: you must buffer d codewords before transmitting.*`,
      analogy: 'Imagine dealing cards to 4 players from a deck. If 3 consecutive cards are damaged, each player gets at most 1 damaged card. Interleaving works the same way: "dealing" bits from multiple codewords to different positions in the transmitted stream ensures that consecutive damage affects different codewords.',
      storyConnection: 'In Pochampally weaving, interleaving would mean weaving threads from different pattern rows in an alternating sequence. If the weaver makes errors on 4 consecutive threads, each error falls in a different row pattern unit — and each unit error-correcting code can handle its single mistake. This is exactly how CDs work: data is interleaved before writing to disc.',
      checkQuestion: 'You have 5 Hamming(7,4) codewords and use interleaving depth 5. What is the maximum burst error length that can be corrected?',
      checkAnswer: 'Each codeword corrects 1 error. Interleaving depth 5 spreads a burst across 5 codewords. Maximum correctable burst = 5 * 1 = 5 consecutive bit errors.',
      codeIntro: 'Implement interleaving and demonstrate how it converts burst errors into correctable scattered errors.',
      code: `import numpy as np

# Interleaving — converting burst errors to scattered errors

def interleave(codewords):
    """Interleave multiple codewords: take one bit from each in round-robin."""
    depth = len(codewords)
    length = len(codewords[0])
    interleaved = []
    for col in range(length):
        for row in range(depth):
            interleaved.append(codewords[row][col])
    return interleaved

def deinterleave(stream, depth, codeword_length):
    """Reverse the interleaving — separate back into individual codewords."""
    codewords = [[] for _ in range(depth)]
    for i, bit in enumerate(stream):
        row = i % depth
        codewords[row].append(bit)
    return codewords

def hamming_encode(data):
    d1, d2, d3, d4 = data
    p1 = d1 ^ d2 ^ d4
    p2 = d1 ^ d3 ^ d4
    p4 = d2 ^ d3 ^ d4
    return [p1, p2, d1, p4, d2, d3, d4]

def hamming_decode(codeword):
    p1, p2, d1, p4, d2, d3, d4 = codeword
    s1 = p1 ^ d1 ^ d2 ^ d4
    s2 = p2 ^ d1 ^ d3 ^ d4
    s4 = p4 ^ d2 ^ d3 ^ d4
    syndrome = s1 + s2 * 2 + s4 * 4
    corrected = list(codeword)
    if syndrome > 0 and syndrome <= 7:
        corrected[syndrome - 1] ^= 1
    return [corrected[2], corrected[4], corrected[5], corrected[6]], syndrome

# Create 4 Hamming codewords
data_blocks = [[1,0,1,1], [0,1,1,0], [1,1,0,1], [0,0,1,0]]
codewords = [hamming_encode(d) for d in data_blocks]

depth = len(codewords)
print("=== Interleaving Demo ===")
print(f"Depth: {depth} codewords of length 7")
print()

for i, (data, code) in enumerate(zip(data_blocks, codewords)):
    print(f"  CW{i}: data={''.join(str(b) for b in data)} -> code={''.join(str(b) for b in code)}")

# Without interleaving
print()
print("=== Without Interleaving ===")
flat = []
for cw in codewords:
    flat.extend(cw)
print(f"Transmitted: {''.join(str(b) for b in flat)}")

# Burst error at positions 3-6 (4 consecutive bits, all in CW0 and CW1)
burst_start = 3
burst_len = 4
corrupted = flat.copy()
for i in range(burst_start, burst_start + burst_len):
    corrupted[i] ^= 1
print(f"Burst error: {''.join(str(b) for b in corrupted)}")

# Decode without interleaving
print("Decoding without interleaving:")
for i in range(depth):
    cw = corrupted[i*7:(i+1)*7]
    decoded, syndrome = hamming_decode(cw)
    errors_in_cw = sum(1 for a, b in zip(cw, codewords[i]) if a != b)
    ok = decoded == data_blocks[i]
    print(f"  CW{i}: {errors_in_cw} errors, syndrome={syndrome}, "
          f"decoded={''.join(str(b) for b in decoded)} {'OK' if ok else 'FAIL'}")

# With interleaving
print()
print("=== With Interleaving ===")
interleaved = interleave(codewords)
print(f"Transmitted: {''.join(str(b) for b in interleaved)}")

# Same burst error
corrupted_i = interleaved.copy()
for i in range(burst_start, burst_start + burst_len):
    corrupted_i[i] ^= 1
print(f"Burst error: {''.join(str(b) for b in corrupted_i)}")

# Deinterleave and decode
recovered = deinterleave(corrupted_i, depth, 7)
print("Decoding with interleaving:")
all_ok = True
for i in range(depth):
    errors_in_cw = sum(1 for a, b in zip(recovered[i], codewords[i]) if a != b)
    decoded, syndrome = hamming_decode(recovered[i])
    ok = decoded == data_blocks[i]
    all_ok = all_ok and ok
    print(f"  CW{i}: {errors_in_cw} error(s), syndrome={syndrome}, "
          f"decoded={''.join(str(b) for b in decoded)} {'OK' if ok else 'FAIL'}")

print()
print(f"Without interleaving: burst of {burst_len} -> UNCORRECTABLE")
print(f"With interleaving depth {depth}: burst of {burst_len} -> ALL CORRECTED")
print(f"Max correctable burst = depth * correction_per_cw = {depth} * 1 = {depth}")`,
      challenge: 'Increase the interleaving depth to 8 (use 8 codewords) and test with a burst error of length 8. Does it correct? Now try a burst of length 9 with depth 8 — what happens? This shows the exact limit of interleaving.',
      successHint: 'Interleaving is used in virtually every digital communication system: CDs, DVDs, Wi-Fi, 4G/5G, satellite links, and deep space communication. The CD audio standard (Red Book) uses cross-interleaved Reed-Solomon coding (CIRC) with interleaving depth 109 — enough to correct a 2.4mm scratch on the disc surface.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Researcher
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Hamming codes, Reed-Solomon, and information theory</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises implement Hamming codes, explore Reed-Solomon concepts, and information theory.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {loadProgress}</>) : (<><Sparkles className="w-5 h-5" /> Load Python</>)}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson
            key={i}
            id={`L3-${i + 1}`}
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
