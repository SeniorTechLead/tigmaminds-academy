import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function PochampallyLevel2() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Parity bits — the simplest error detection',
      concept: `When a weaver makes a mistake — tying a thread that should be free, or missing one that should be tied — the pattern has an **error**. In digital systems, errors happen when bits flip during transmission (electrical noise, cosmic rays, scratched discs). How do we detect these errors?

The simplest method is a **parity bit** — one extra bit added to each group of data bits. The parity bit is chosen so that the total number of 1s in the group (including the parity bit) is always **even** (even parity) or always **odd** (odd parity). If a single bit flips, the parity changes, and we know an error occurred.

For example, data bits 1011001 have four 1s (even). With even parity, we add parity bit 0 to keep the count even: 10110010. If any single bit flips during transmission, the count becomes odd, and the receiver knows something went wrong.

📚 *Even parity: the total number of 1s (including the parity bit) is always even. Odd parity: the total is always odd. Either convention works as long as sender and receiver agree.*`,
      analogy: 'Imagine counting the number of red marbles in a bag. Before shipping, you write "EVEN" on the bag if the count is even. The receiver counts the red marbles — if the count is odd, a marble must have been lost or added during shipping. The "EVEN" label is the parity bit — it does not tell you WHICH marble is wrong, only that SOMETHING is wrong.',
      storyConnection: 'A Pochampally weaver could add a "check thread" at the end of each row — dyed or undyed to make the total number of dyed threads even. A quality inspector could then quickly count dyed threads in each row and flag any row where the count is odd. This is exactly how computer memory chips detect errors: each byte has a parity bit.',
      checkQuestion: 'Data bits: 1010110. How many 1s? What parity bit do you add for even parity? For odd parity?',
      checkAnswer: 'Count of 1s: 4 (even). For even parity, add 0 (4 is already even). For odd parity, add 1 (making total 5, which is odd). The full codewords are 10101100 (even) and 10101101 (odd).',
      codeIntro: 'Implement parity bit encoding and test whether single-bit errors are detected.',
      code: `# Parity bit — simplest error detection

def count_ones(bits):
    """Count the number of 1s in a bit sequence"""
    return sum(bits)

def add_parity(data_bits, parity_type="even"):
    """Add a parity bit to make total 1s even or odd"""
    ones = count_ones(data_bits)
    if parity_type == "even":
        parity_bit = ones % 2  # 0 if already even, 1 if odd
    else:  # odd
        parity_bit = 1 - (ones % 2)  # 1 if already even, 0 if odd
    return data_bits + [parity_bit]

def check_parity(codeword, parity_type="even"):
    """Check if parity is correct. Returns True if no error detected."""
    ones = count_ones(codeword)
    if parity_type == "even":
        return ones % 2 == 0
    else:
        return ones % 2 == 1

# Demonstrate parity encoding
print("=== Parity Bit Encoding ===")
print()

test_data = [
    [1, 0, 1, 1, 0, 0, 1],
    [0, 1, 0, 0, 1, 1, 0],
    [1, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1],
]

print(f"{'Data bits':<20} {'1s':>4} {'Parity':>8} {'Codeword':<20}")
print("-" * 54)

for data in test_data:
    ones = count_ones(data)
    codeword = add_parity(data, "even")
    data_str = "".join(str(b) for b in data)
    code_str = "".join(str(b) for b in codeword)
    print(f"{data_str:<20} {ones:>4} {codeword[-1]:>8} {code_str}")

print()
print("=== Error Detection Test ===")

# Take one codeword and introduce errors
original = add_parity([1, 0, 1, 1, 0, 0, 1], "even")
print(f"Original codeword: {''.join(str(b) for b in original)}")
print(f"Parity check: {'PASS' if check_parity(original) else 'FAIL'}")
print()

# Single bit errors (always detected)
print("Single-bit errors:")
for pos in range(len(original)):
    corrupted = original.copy()
    corrupted[pos] = 1 - corrupted[pos]  # flip one bit
    passed = check_parity(corrupted)
    status = "PASS (missed!)" if passed else "FAIL (detected)"
    print(f"  Flip bit {pos}: {''.join(str(b) for b in corrupted)} -> {status}")

print()
# Double bit errors (NOT detected by parity!)
print("Double-bit errors:")
for i in range(0, 4):
    j = i + 1
    corrupted = original.copy()
    corrupted[i] = 1 - corrupted[i]
    corrupted[j] = 1 - corrupted[j]
    passed = check_parity(corrupted)
    status = "PASS (missed!)" if passed else "FAIL (detected)"
    print(f"  Flip bits {i},{j}: {''.join(str(b) for b in corrupted)} -> {status}")

print()
print("Parity detects ALL single-bit errors but MISSES double-bit errors.")
print("This is because two flips cancel each other's parity effect.")`,
      challenge: 'Encode the word "IKAT" using ASCII (8 bits per character) with an even parity bit appended to each byte (making 9 bits per row). Then flip one random bit per row and verify that parity catches every error. What percentage of all possible 1-bit errors can parity detect?',
      successHint: 'Parity checking is used in RAM (computer memory), serial communication (RS-232), and disk storage. Every time your computer reads memory, it checks parity. You just implemented the same error detection used billions of times per second in every computer on Earth.',
    },
    {
      title: 'Error detection vs correction — knowing vs fixing',
      concept: `Parity can **detect** a single-bit error, but it cannot **correct** it — it tells you something is wrong but not which bit flipped. To correct errors, we need more redundancy.

The simplest error-correcting code is **triple repetition**: send each bit three times. If the bit is 1, send 111. If 0, send 000. The receiver uses **majority voting** — if it receives 110, two out of three are 1, so the original bit was probably 1. This corrects any single-bit error.

The cost is high: for every 1 bit of data, you send 3 bits total. The **code rate** is 1/3 — only 33% of the transmitted data is useful information. Better error-correcting codes achieve much higher code rates while still correcting errors.

📚 *Code rate = data bits / total bits. A rate-1/3 code carries 1 bit of information per 3 transmitted bits. A rate-1/2 code carries 1 per 2. Higher rate = more efficient. The challenge is achieving high rate while still correcting errors.*`,
      analogy: 'Imagine telling someone a phone number over a noisy phone line. You could say each digit three times: "five five five, two two two, eight eight eight." If the listener hears "five five four," they know the "four" is wrong and the digit is "five." The repetition lets them correct errors, but the message takes three times as long.',
      storyConnection: 'In Pochampally weaving, a crucial pattern might be woven three rows deep: each row of the motif appears three times. If one thread is wrong in one copy, the other two copies reveal the correct pattern. Weavers call this "insurance rows." Computer scientists call it triple modular redundancy — different names for the same principle.',
      checkQuestion: 'You use triple repetition to send the bits 1 0 1. The transmitted codeword is 111 000 111. During transmission it becomes 111 010 111. What does the receiver decode? Was the error corrected?',
      checkAnswer: 'Group 1: 111 -> majority is 1. Group 2: 010 -> majority is 0. Group 3: 111 -> majority is 1. Decoded: 1 0 1 — correct! The single error in group 2 was corrected by majority vote.',
      codeIntro: 'Implement triple repetition coding and compare detection vs correction capabilities.',
      code: `import random

# Error detection vs error correction

def triple_encode(data_bits):
    """Encode each bit by repeating it 3 times"""
    encoded = []
    for bit in data_bits:
        encoded.extend([bit, bit, bit])
    return encoded

def triple_decode(codeword):
    """Decode by majority voting on each group of 3"""
    decoded = []
    corrections = 0
    for i in range(0, len(codeword), 3):
        group = codeword[i:i+3]
        ones = sum(group)
        if ones >= 2:
            decoded.append(1)
        else:
            decoded.append(0)
        # Check if correction was needed
        if not all(b == group[0] for b in group):
            corrections += 1
    return decoded, corrections

def add_noise(bits, error_rate):
    """Flip each bit with given probability"""
    noisy = bits.copy()
    errors = 0
    for i in range(len(noisy)):
        if random.random() < error_rate:
            noisy[i] = 1 - noisy[i]
            errors += 1
    return noisy, errors

random.seed(42)

# Original message
data = [1, 0, 1, 1, 0, 0, 1, 0]
print(f"Original data: {''.join(str(b) for b in data)}")
print(f"Data bits: {len(data)}")
print()

# Triple repetition encoding
encoded = triple_encode(data)
print(f"Encoded:  {''.join(str(b) for b in encoded)}")
print(f"Encoded bits: {len(encoded)}")
print(f"Code rate: {len(data)}/{len(encoded)} = {len(data)/len(encoded):.2f}")
print()

# Test with different error rates
print("=== Error Correction Performance ===")
print(f"{'Error Rate':>11} {'Errors':>8} {'Corrected':>10} {'Result':>10} {'Match':>6}")
print("-" * 48)

for error_rate in [0.0, 0.05, 0.10, 0.15, 0.20, 0.30]:
    successes = 0
    trials = 100
    total_errors = 0
    total_corrections = 0

    for _ in range(trials):
        encoded = triple_encode(data)
        noisy, errors = add_noise(encoded, error_rate)
        decoded, corrections = triple_decode(noisy)
        total_errors += errors
        total_corrections += corrections
        if decoded == data:
            successes += 1

    avg_errors = total_errors / trials
    print(f"{error_rate:>10.0%} {avg_errors:>8.1f} {total_corrections/trials:>10.1f} "
          f"{successes:>8}% {'ok' if successes > 90 else 'BAD'}")

print()
# Compare with parity only (detect but not correct)
print("=== Comparison: Parity vs Triple Repetition ===")
print(f"{'Method':<22} {'Rate':>6} {'Detect 1-bit':>13} {'Correct 1-bit':>14} {'Overhead':>9}")
print("-" * 66)
print(f"{'No protection':<22} {'1.00':>6} {'No':>13} {'No':>14} {'0%':>9}")
print(f"{'Even parity':<22} {'0.88':>6} {'Yes':>13} {'No':>14} {'14%':>9}")
print(f"{'Triple repetition':<22} {'0.33':>6} {'Yes':>13} {'Yes':>14} {'200%':>9}")
print()
print("Triple repetition is reliable but wasteful.")
print("Can we do better? (Spoiler: Hamming codes, next level!)")`,
      challenge: 'Implement quintuple repetition (5 copies). What is its code rate? Test it at the same error rates. At what error rate does quintuple start failing? Compare: triple fails at ~15% error rate, quintuple should survive higher rates.',
      successHint: 'You just explored the fundamental tradeoff in coding theory: more redundancy means better error correction but lower efficiency. Richard Hamming invented a brilliant code that corrects single-bit errors with far less redundancy than triple repetition — and that is exactly what you will build in Level 3.',
    },
    {
      title: 'Hamming distance — measuring how different two patterns are',
      concept: `The **Hamming distance** between two binary strings is the number of positions where the bits differ. For example, 1011001 and 1010011 differ in positions 4 and 5 (counting from left), so their Hamming distance is 2.

Hamming distance is crucial for error detection and correction: if the minimum Hamming distance between any two valid codewords is **d**, then the code can **detect** up to d-1 errors and **correct** up to (d-1)/2 errors (integer division).

For even parity, the minimum distance between valid codewords is 2 (any two valid codewords differ in at least 2 positions). So parity can detect 2-1 = 1 error. For triple repetition, the minimum distance is 3 (000 vs 111 differ in all 3 positions). So it can correct (3-1)/2 = 1 error.

📚 *Hamming distance d between strings a and b: count positions where a[i] != b[i]. Minimum Hamming distance of a code: the smallest distance between any pair of valid codewords. This determines the code's error-handling capability.*`,
      analogy: 'Think of cities on a map. If two cities are 100 km apart, a traveler who drifts 30 km off course is still clearly closer to their starting city. But if the cities are only 10 km apart, a 30 km drift could put you past the destination. Hamming distance is the "distance" between codewords — the larger the distance, the more "drift" (errors) can occur before you confuse one codeword for another.',
      storyConnection: 'In a Pochampally textile, two rows that look similar (small Hamming distance) are easily confused by a weaver. If the pattern uses codes that are far apart in Hamming distance, a weaver who makes a small mistake still produces a pattern that is clearly "wrong" — it does not accidentally become a different valid pattern. This is the same principle used in QR codes and barcodes.',
      checkQuestion: 'Codewords: 000, 011, 101, 110. What is the minimum Hamming distance between any pair?',
      checkAnswer: 'Distance between 000 and 011 = 2. Between 000 and 101 = 2. Between 000 and 110 = 2. Between 011 and 101 = 2. Between 011 and 110 = 2. Between 101 and 110 = 2. Minimum distance = 2. This code can detect 1 error but cannot correct any errors.',
      codeIntro: 'Calculate Hamming distances and explore how distance determines error-handling capability.',
      code: `# Hamming distance — measuring pattern differences

def hamming_distance(a, b):
    """Count positions where a and b differ"""
    if len(a) != len(b):
        raise ValueError("Strings must be same length")
    return sum(1 for x, y in zip(a, b) if x != y)

def min_hamming_distance(codewords):
    """Find the minimum Hamming distance in a set of codewords"""
    min_dist = float("inf")
    min_pair = None
    for i in range(len(codewords)):
        for j in range(i + 1, len(codewords)):
            d = hamming_distance(codewords[i], codewords[j])
            if d < min_dist:
                min_dist = d
                min_pair = (codewords[i], codewords[j])
    return min_dist, min_pair

# Example: raw 3-bit codes (no error protection)
raw_codes = ["000", "001", "010", "011", "100", "101", "110", "111"]
d_raw, pair_raw = min_hamming_distance(raw_codes)
print("=== Raw 3-bit codes (no protection) ===")
print(f"Codewords: {len(raw_codes)}")
print(f"Minimum distance: {d_raw}")
print(f"Closest pair: {pair_raw[0]} and {pair_raw[1]}")
print(f"Can detect: {d_raw - 1} errors | Can correct: {(d_raw - 1) // 2} errors")
print()

# Even parity codes (4 bits: 3 data + 1 parity)
parity_codes = []
for i in range(8):
    bits = format(i, "03b")
    parity = str(bits.count("1") % 2)
    parity_codes.append(bits + parity)

d_par, pair_par = min_hamming_distance(parity_codes)
print("=== Even parity codes (3 data + 1 parity) ===")
print(f"Codewords: {parity_codes}")
print(f"Minimum distance: {d_par}")
print(f"Closest pair: {pair_par[0]} and {pair_par[1]}")
print(f"Can detect: {d_par - 1} errors | Can correct: {(d_par - 1) // 2} errors")
print()

# Triple repetition codes
triple_codes = ["000000000", "111111111"]  # only 2 codewords for 1 data bit
# For 2 data bits:
triple_codes_2 = ["000000", "000111", "111000", "111111"]
d_tri, pair_tri = min_hamming_distance(triple_codes_2)
print("=== Triple repetition (2 data bits) ===")
print(f"Codewords: {triple_codes_2}")
print(f"Minimum distance: {d_tri}")
print(f"Can detect: {d_tri - 1} errors | Can correct: {(d_tri - 1) // 2} errors")
print()

# Hamming distance matrix
print("=== Distance Matrix (parity codes) ===")
print(f"{'':>6}", end="")
for c in parity_codes:
    print(f"{c:>6}", end="")
print()

for i, c1 in enumerate(parity_codes):
    print(f"{c1:>6}", end="")
    for j, c2 in enumerate(parity_codes):
        d = hamming_distance(c1, c2)
        print(f"{d:>6}", end="")
    print()

print()
print("=== Fundamental Theorem ===")
print("Min distance d -> detect d-1 errors, correct floor((d-1)/2) errors")
for d in range(1, 8):
    detect = d - 1
    correct = (d - 1) // 2
    print(f"  d = {d}: detect {detect}, correct {correct}")`,
      challenge: 'Design a code with exactly 4 codewords of length 5 that has minimum Hamming distance 3. (Hint: start with 00000 and find three more words each at distance >= 3 from all others.) Verify your code can correct 1 error.',
      successHint: 'Hamming distance is the mathematical foundation of all error-correcting codes — from the simple parity bit to the advanced LDPC codes used in 5G mobile networks. Understanding distance is understanding the fundamental limit of reliable communication.',
    },
    {
      title: 'Checksums — detecting errors in larger data blocks',
      concept: `A **checksum** is a value computed from a block of data that serves as a fingerprint. The sender computes the checksum and appends it to the data. The receiver recomputes the checksum from the received data and compares — if they match, the data is likely correct; if not, an error occurred.

The simplest checksum is the **sum of all bytes modulo 256**: add up all the data values, take the remainder when divided by 256, and that is the checksum. More robust checksums use polynomial division (CRC), cryptographic hashing (SHA-256), or other mathematical operations.

Checksums are used everywhere: network packets, file downloads, credit card numbers (the Luhn algorithm), ISBNs (book identification numbers), and barcode validation. Each application uses a checksum designed for its specific error patterns.

📚 *A checksum summarizes a data block as a short fixed-size value. Good checksums: small changes in data produce large changes in the checksum (avalanche effect). Bad checksums: different data blocks can produce the same checksum (collision).*`,
      analogy: 'When a teacher counts students before and after a field trip — 28 going, 28 returning — the count is a checksum. It does not tell you WHO might have been swapped, but it tells you whether everyone is accounted for. If the count is 27, you know something is wrong.',
      storyConnection: 'A Pochampally quality inspector could compute a checksum for each textile section: count the total number of dyed threads in a 10x10 block. If the expected count is 47 and the actual count is 45, two threads are wrong somewhere in that block. The checksum narrows down the location of errors, even if it cannot pinpoint individual threads.',
      checkQuestion: 'A data block contains bytes [72, 101, 108, 108, 111]. What is the checksum (sum modulo 256)?',
      checkAnswer: '72 + 101 + 108 + 108 + 111 = 500. 500 mod 256 = 244. The checksum is 244. If the receiver computes a different value, at least one byte was corrupted.',
      codeIntro: 'Implement several checksum algorithms and test their error detection capabilities.',
      code: `# Checksums — fingerprinting data blocks

def simple_checksum(data, modulus=256):
    """Sum of all values modulo the modulus"""
    return sum(data) % modulus

def xor_checksum(data):
    """XOR all bytes together"""
    result = 0
    for byte in data:
        result ^= byte
    return result

def fletcher16(data):
    """Fletcher-16 checksum — better than simple sum"""
    sum1 = 0
    sum2 = 0
    for byte in data:
        sum1 = (sum1 + byte) % 255
        sum2 = (sum2 + sum1) % 255
    return (sum2 << 8) | sum1

def internet_checksum(data):
    """Simplified Internet checksum (RFC 1071)"""
    total = 0
    for byte in data:
        total += byte
    # Fold carry bits
    while total > 0xFF:
        total = (total & 0xFF) + (total >> 8)
    return (~total) & 0xFF

# Test message: "POCHAMPALLY" as ASCII values
message = "POCHAMPALLY"
data = [ord(c) for c in message]

print("=== Checksum Comparison ===")
print(f"Message: '{message}'")
print(f"Data: {data}")
print()

checksums = {
    "Simple sum mod 256": simple_checksum(data),
    "XOR": xor_checksum(data),
    "Fletcher-16": fletcher16(data),
    "Internet checksum": internet_checksum(data),
}

for name, value in checksums.items():
    print(f"  {name:<22} = {value:>6} (0x{value:04X})")

print()
print("=== Error Detection Test ===")
# Introduce single-byte errors and check which checksums catch them
import random
random.seed(42)

methods = {
    "Simple sum": simple_checksum,
    "XOR": xor_checksum,
    "Fletcher-16": fletcher16,
}

original_checksums = {name: func(data) for name, func in methods.items()}

num_tests = 1000
results = {name: 0 for name in methods}

for _ in range(num_tests):
    # Corrupt one random byte by a random amount
    corrupted = data.copy()
    pos = random.randint(0, len(data) - 1)
    corrupted[pos] = (corrupted[pos] + random.randint(1, 255)) % 256

    for name, func in methods.items():
        new_checksum = func(corrupted)
        if new_checksum != original_checksums[name]:
            results[name] += 1

print(f"{'Method':<22} {'Detected':>10} {'Rate':>8}")
print("-" * 42)
for name in methods:
    rate = results[name] / num_tests * 100
    print(f"{name:<22} {results[name]:>7}/{num_tests} {rate:>6.1f}%")

print()
# Weakness: swap two bytes
print("=== Swap Detection ===")
swapped = data.copy()
swapped[0], swapped[1] = swapped[1], swapped[0]
print(f"Original:  {data[:5]}...")
print(f"Swapped:   {swapped[:5]}...")
for name, func in methods.items():
    orig = func(data)
    swap = func(swapped)
    detected = "DETECTED" if orig != swap else "MISSED"
    print(f"  {name}: {detected}")

print()
print("Simple sum misses swaps (a+b = b+a). Fletcher-16 catches them!")`,
      challenge: 'Implement a "row checksum" for a Pochampally textile: for each row of 8 bits, compute the XOR checksum. Then for each column, compute another checksum. This creates a "checksum grid" that can localize errors to a specific row AND column. Test it by flipping one bit — can you identify the exact position?',
      successHint: 'Checksums guard the integrity of virtually all digital data. When you download a file, the browser checks its checksum. When your phone receives a text, the network verifies its checksum. The Fletcher-16 and Internet checksum algorithms you implemented are used in real network protocols (TCP/IP).',
    },
    {
      title: 'Rectangular parity — detecting AND locating errors',
      concept: `What if we arrange data in a 2D grid and add parity bits to both **rows** and **columns**? The row parities detect which row has an error. The column parities detect which column. The intersection identifies the **exact bit** that flipped.

This is called a **rectangular parity code** or **product code**. It is the simplest code that can both detect and locate a single-bit error. The cost: for an m x n data grid, you need m + n + 1 extra parity bits (row parities + column parities + a corner parity bit).

For a Pochampally textile section of 8 rows x 8 columns = 64 data bits, you add 8 row parities + 8 column parities + 1 corner = 17 extra bits. Code rate = 64/81 = 79%. Much better than triple repetition at 33%.

📚 *A product code applies a simple code (like parity) independently to rows and columns. The two dimensions of checking interact to give error-locating capability that neither dimension has alone. This is an early example of a principle used in modern turbo codes and LDPC codes.*`,
      analogy: 'Imagine a classroom with students in rows and columns. The teacher asks students in each row to count how many are wearing red. Then students in each column count. If row 3 reports the wrong count and column 5 reports the wrong count, the student at position (3, 5) must be the one who changed shirts. The two dimensions of counting locate the culprit.',
      storyConnection: 'A Pochampally textile is naturally a 2D grid — rows are warp threads and columns are weft threads. Adding parity threads at the edges of the textile (one extra thread per row and per column) creates a built-in error detection system. A quality inspector could spot exactly which intersection has a weaving mistake by checking the row and column parities.',
      checkQuestion: 'In a 4x4 data grid with rectangular parity, how many total bits including parities? What is the code rate?',
      checkAnswer: 'Data: 4*4 = 16 bits. Row parities: 4. Column parities: 4. Corner parity: 1. Total: 25 bits. Code rate: 16/25 = 64%. This is much better than triple repetition (33%) and can still locate a single-bit error.',
      codeIntro: 'Build a rectangular parity encoder that detects and locates single-bit errors.',
      code: `# Rectangular parity — 2D error detection and location

def encode_rectangular(data_grid):
    """Add row parities, column parities, and corner parity."""
    rows = len(data_grid)
    cols = len(data_grid[0])

    # Add row parity (last column)
    encoded = []
    for row in data_grid:
        row_parity = sum(row) % 2
        encoded.append(row + [row_parity])

    # Add column parities (last row)
    col_parities = []
    for c in range(cols):
        col_sum = sum(data_grid[r][c] for r in range(rows))
        col_parities.append(col_sum % 2)

    # Corner parity (parity of parities)
    corner = sum(col_parities) % 2
    col_parities.append(corner)
    encoded.append(col_parities)

    return encoded

def check_rectangular(encoded):
    """Check rectangular parity. Returns (error_row, error_col) or None."""
    rows = len(encoded)
    cols = len(encoded[0])

    # Check each row parity
    bad_rows = []
    for r in range(rows):
        if sum(encoded[r]) % 2 != 0:
            bad_rows.append(r)

    # Check each column parity
    bad_cols = []
    for c in range(cols):
        col_sum = sum(encoded[r][c] for r in range(rows))
        if col_sum % 2 != 0:
            bad_cols.append(c)

    if not bad_rows and not bad_cols:
        return None  # No error
    elif len(bad_rows) == 1 and len(bad_cols) == 1:
        return (bad_rows[0], bad_cols[0])  # Error located!
    else:
        return "multiple_errors"

def display_grid(grid, error_pos=None, label=""):
    if label:
        print(label)
    rows, cols = len(grid), len(grid[0])
    for r in range(rows):
        line = "  "
        for c in range(cols):
            if error_pos and (r, c) == error_pos:
                line += "[" + str(grid[r][c]) + "]"
            elif r == rows - 1 or c == cols - 1:
                line += " " + str(grid[r][c]) + " "
            else:
                line += " " + str(grid[r][c]) + " "
        label_str = " <- parity row" if r == rows - 1 else ""
        print(line + label_str)
    print("  " + "".join(" ^ " for _ in range(cols)))
    print("  " + "parity columns".center(cols * 3))

# Create a 4x4 data grid (Pochampally pattern)
data = [
    [1, 0, 1, 1],
    [0, 1, 0, 1],
    [1, 1, 0, 0],
    [1, 0, 1, 0],
]

encoded = encode_rectangular(data)
print("=== Rectangular Parity Encoding ===")
display_grid(encoded)
print()

# Verify no errors
result = check_rectangular(encoded)
print(f"Error check: {'Clean!' if result is None else result}")
print()

# Introduce a single-bit error
print("=== Introducing Error at (1, 2) ===")
corrupted = [row.copy() for row in encoded]
corrupted[1][2] = 1 - corrupted[1][2]  # flip bit
display_grid(corrupted, error_pos=(1, 2))
print()

error_loc = check_rectangular(corrupted)
if error_loc and error_loc != "multiple_errors":
    print(f"Error detected at row {error_loc[0]}, col {error_loc[1]}")
    print(f"Original value: {encoded[error_loc[0]][error_loc[1]]}")
    print(f"Corrupted value: {corrupted[error_loc[0]][error_loc[1]]}")
    # Correct it!
    corrected = [row.copy() for row in corrupted]
    r, c = error_loc
    corrected[r][c] = 1 - corrected[r][c]
    verify = check_rectangular(corrected)
    print(f"After correction: {'Clean!' if verify is None else verify}")

print()
# Code rate analysis
data_bits = 4 * 4
total_bits = 5 * 5
print(f"=== Code Rate ===")
print(f"Data bits: {data_bits}")
print(f"Total bits: {total_bits}")
print(f"Overhead bits: {total_bits - data_bits}")
print(f"Code rate: {data_bits}/{total_bits} = {data_bits/total_bits:.1%}")`,
      challenge: 'Expand the grid to 8x8 data (with parity making it 9x9). Introduce TWO errors at random positions. Can the rectangular parity code detect both? Can it correctly locate them? (Hint: two errors may cause 0 or 2 bad rows and columns — the code can detect the problem but may not locate both errors correctly.)',
      successHint: 'Rectangular parity is used in RAID storage systems (disk arrays), memory error correction (ECC RAM), and two-dimensional barcodes (QR codes use a similar principle). You just built the same 2D error-checking that protects your data when a hard drive has a bad sector.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Error detection, parity, and Hamming distance</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises use Python to implement parity checking, checksums, and error detection.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {loadProgress}</>) : (<><Sparkles className="w-5 h-5" /> Load Python</>)}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson
            key={i}
            id={`L2-${i + 1}`}
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
