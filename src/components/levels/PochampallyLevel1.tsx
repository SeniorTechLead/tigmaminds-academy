import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function PochampallyLevel1() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Binary encoding — representing patterns as 0s and 1s',
      concept: `In Pochampally Ikat weaving, each thread is either **dyed** or **undyed** at each position. This is a binary choice — exactly like a computer bit that is either **1** (on) or **0** (off). A row of threads becomes a sequence of 0s and 1s, and the entire textile pattern is a **2D binary matrix**.

Binary is the language of all digital systems. Every photo, song, text message, and video on your phone is ultimately stored as a sequence of 0s and 1s. The reason is simple: a switch (transistor) can be reliably in one of two states — on or off. Representing information as binary makes it robust against noise and errors.

A single binary digit is a **bit**. Eight bits form a **byte**, which can represent 2^8 = 256 different values (0 to 255). A Pochampally pattern row that is 8 threads wide can encode 256 possible patterns — enough to represent any letter, digit, or symbol.

📚 *Binary (base 2) uses only digits 0 and 1. Decimal (base 10) uses 0-9. To convert binary to decimal: 1011 = 1×8 + 0×4 + 1×2 + 1×1 = 11. To convert decimal to binary, repeatedly divide by 2 and collect remainders.*`,
      analogy: 'Imagine a row of light switches on a wall. Each switch is either up (1) or down (0). The pattern of switches encodes a message — like a secret code between friends. With 8 switches, you can make 256 different patterns, enough to spell out the entire alphabet plus numbers and symbols.',
      storyConnection: 'Pochampally weavers tie small bundles of threads before dyeing — tied sections resist the dye and stay white (0), while exposed sections absorb the dye and become colored (1). This resist-dyeing technique (ikat) is literally binary encoding: each thread position is either dyed or not dyed, and the pattern emerges from the arrangement of these binary choices.',
      checkQuestion: 'A Pochampally pattern row has 8 threads. The pattern is: dyed, undyed, dyed, dyed, undyed, dyed, undyed, dyed. What is this in binary? What decimal number does it represent?',
      checkAnswer: 'Binary: 10110101. Decimal: 1*128 + 0*64 + 1*32 + 1*16 + 0*8 + 1*4 + 0*2 + 1*1 = 128 + 32 + 16 + 4 + 1 = 181.',
      codeIntro: 'Convert between Pochampally weave patterns and binary numbers.',
      code: `# Binary encoding — patterns as numbers

def pattern_to_binary(pattern):
    """Convert a weave pattern (list of 0s and 1s) to binary string"""
    return "".join(str(b) for b in pattern)

def binary_to_decimal(binary_str):
    """Convert binary string to decimal number"""
    result = 0
    for i, bit in enumerate(reversed(binary_str)):
        result += int(bit) * (2 ** i)
    return result

def decimal_to_binary(n, width=8):
    """Convert decimal to binary string with fixed width"""
    if n == 0:
        return "0" * width
    bits = []
    temp = n
    while temp > 0:
        bits.append(str(temp % 2))
        temp //= 2
    binary = "".join(reversed(bits))
    return binary.zfill(width)

def display_pattern(binary_str, dyed_char="█", undyed_char="░"):
    """Display binary string as a visual weave pattern"""
    return "".join(dyed_char if b == "1" else undyed_char for b in binary_str)

# Example Pochampally patterns (8 threads wide)
patterns = [
    [1, 0, 1, 0, 1, 0, 1, 0],  # alternating
    [1, 1, 0, 0, 1, 1, 0, 0],  # pairs
    [1, 1, 1, 1, 0, 0, 0, 0],  # half-and-half
    [1, 0, 0, 1, 1, 0, 0, 1],  # symmetric
    [1, 1, 1, 0, 0, 1, 1, 1],  # border pattern
]

print("=== Pochampally Pattern Encoder ===")
print(f"{'Pattern':<12} {'Binary':<12} {'Decimal':>8} {'Visual'}")
print("-" * 48)

for pat in patterns:
    binary = pattern_to_binary(pat)
    decimal = binary_to_decimal(binary)
    visual = display_pattern(binary)
    print(f"{str(pat):<12} {binary:<12} {decimal:>8} {visual}")

print()
print("=== Encoding Text as Weave Patterns ===")
message = "IKAT"
print(f"Message: {message}")
print()

for char in message:
    code = ord(char)  # ASCII code
    binary = decimal_to_binary(code)
    visual = display_pattern(binary)
    print(f"  '{char}' = ASCII {code:>3} = {binary} = {visual}")

print()
print(f"Total threads needed: {len(message) * 8} = {len(message)} rows of 8")

# How many unique patterns with N threads?
print()
print("=== Pattern Capacity ===")
for n in range(4, 13):
    total = 2 ** n
    print(f"  {n:>2} threads: {total:>5} unique patterns")`,
      challenge: 'Encode your own name as binary weave patterns (one character per row). How many rows does your name need? If a weaver can tie 8 threads in 5 minutes, how long would it take to encode your full name as a Pochampally pattern?',
      successHint: 'You just learned binary encoding — the foundation of all digital technology. Every file on your computer, every pixel on your screen, every byte sent over the internet is encoded in binary. The Pochampally weaver and the computer chip are doing the same thing: encoding information as patterns of two states.',
    },
    {
      title: 'Bit patterns and repetition — finding structure in weave designs',
      concept: `Pochampally textiles use **repeating patterns** — a small motif is tiled across the fabric. Repetition is a form of **data compression**: instead of specifying every thread individually, the weaver memorizes one **repeat unit** and tiles it.

In computer science, identifying repeating patterns in data is called **pattern matching**. The simplest approach is to check if a sequence is a repetition of a shorter subsequence. If an 8-bit pattern is just a 4-bit pattern repeated twice (like 10101010 = 1010 + 1010), we only need to store 4 bits plus the instruction "repeat 2x."

This is the basis of **lossless compression** — algorithms like ZIP and PNG find repeating patterns and store them compactly. A highly repetitive Pochampally pattern compresses well; a random pattern does not.

📚 *The repeat period of a pattern is the shortest subsequence that, when repeated, reproduces the full pattern. Pattern 110110110 has repeat period 3 (the unit "110" repeated 3 times).*`,
      analogy: 'When you hear a song with a chorus, you do not memorize the lyrics of each repetition separately. You learn the chorus once and remember "it repeats 4 times." Your brain is compressing the information by finding the repeating unit. Data compression algorithms do the same thing — find what repeats and store it once.',
      storyConnection: 'A Pochampally weaver does not design each row from scratch. They learn the repeat unit (called the "bandha") and replicate it across the warp. The complexity of the design is not in the width of the fabric but in the complexity of the bandha. A 16-thread bandha repeated 100 times creates a 1600-thread pattern — but the weaver only had to think about 16 threads.',
      checkQuestion: 'The pattern 01100110011001100110 has 20 bits. What is its repeat period? How many bits would you need to store using run-length encoding of the repeat unit?',
      checkAnswer: 'The repeat unit is 0110 (period = 4), repeated 5 times. To store it: 4 bits for the unit + the number of repetitions (5) = far less than 20 bits. Compression ratio: roughly 4/20 = 20% of the original size.',
      codeIntro: 'Find repeating patterns in weave designs and calculate how much they can be compressed.',
      code: `# Pattern analysis: finding repeats and compression

def find_repeat_period(pattern):
    """Find the shortest repeating unit in a pattern"""
    n = len(pattern)
    for period in range(1, n + 1):
        if n % period == 0:
            unit = pattern[:period]
            # Check if the full pattern is just this unit repeated
            matches = True
            for i in range(period, n, period):
                if pattern[i:i+period] != unit:
                    matches = False
                    break
            if matches:
                return period, unit
    return n, pattern  # no repetition found

def compression_ratio(original_len, period):
    """How much space we save by storing just the repeat unit"""
    # Need to store: the unit (period bits) + repeat count (small number)
    compressed = period + 4  # 4 bits for repeat count (up to 16 repeats)
    return compressed / original_len

# Pochampally textile patterns
textile_rows = [
    "10101010101010101010",  # simple alternating
    "11001100110011001100",  # pairs
    "10110100101101001011",  # complex but repeating
    "11100111001110011100",  # three-one pattern
    "10010110100101101001",  # longer repeat unit
    "11010010011101001001",  # random-looking
]

print("=== Pattern Repeat Analysis ===")
print(f"{'Pattern':<24} {'Period':>7} {'Repeats':>8} {'Ratio':>8} {'Unit'}")
print("-" * 65)

for row in textile_rows:
    period, unit = find_repeat_period(row)
    repeats = len(row) // period
    ratio = compression_ratio(len(row), period)
    print(f"{row:<24} {period:>7} {repeats:>8} {ratio:>7.0%} {unit}")

print()
# Build a simple 2D textile pattern
print("=== 2D Textile Pattern ===")
# Define a 4x4 repeat unit (bandha)
bandha = [
    "1001",
    "0110",
    "0110",
    "1001",
]

print("Repeat unit (bandha):")
for row in bandha:
    visual = "".join("█" if b == "1" else "░" for b in row)
    print(f"  {row}  {visual}")

print()
print("Tiled 3x3:")
for tile_row in range(3):
    for row in bandha:
        full_row = row * 3
        visual = "".join("█" if b == "1" else "░" for b in full_row)
        print(f"  {visual}")

# Count unique patterns possible
print()
print("=== Pattern Complexity ===")
for width in [4, 6, 8]:
    for height in [4, 6, 8]:
        unique = 2 ** (width * height)
        print(f"  {width}x{height} bandha: {unique:>20,} possible patterns")`,
      challenge: 'Create a pattern that LOOKS random but actually has a repeat period of 7 (like "1011001" repeated). Verify with find_repeat_period(). Then create a truly random 20-bit string using: "".join([str(random.randint(0,1)) for _ in range(20)]). What is its repeat period? (Hint: almost certainly 20 — random data does not compress.)',
      successHint: 'Pattern detection and compression are fundamental to computer science. ZIP files, PNG images, and video codecs all work by finding and exploiting repeating patterns. You just built the same analysis that sits at the heart of these technologies.',
    },
    {
      title: 'Algorithms as weaving instructions — step-by-step procedures',
      concept: `An **algorithm** is a precise, step-by-step procedure for accomplishing a task. A Pochampally weaving pattern is, in effect, an algorithm: "For each row, follow this sequence of tie/don't-tie decisions." The weaver executes the algorithm by hand; a computer executes algorithms with transistors.

Every algorithm has **inputs** (the thread colors, the pattern specification), **steps** (tie, dye, weave), and **outputs** (the finished textile). The quality of the algorithm determines the quality of the result — a well-designed algorithm produces the correct pattern efficiently; a poorly designed one wastes thread or produces errors.

We can formalize weaving as a **nested loop**: the outer loop iterates over rows, and the inner loop iterates over columns (thread positions). At each (row, column) position, the algorithm decides: dye (1) or leave undyed (0). This is exactly how computers process 2D images — pixel by pixel, row by row.

📚 *A nested loop is a loop inside a loop. The outer loop runs N times; for each iteration, the inner loop runs M times. Total iterations: N × M. This is how we process 2D structures like grids, images, and textiles.*`,
      analogy: 'A recipe is an algorithm: inputs (ingredients), steps (chop, mix, bake), and output (a cake). If you follow the steps in order, you get the correct result every time. If you skip a step or do them out of order, the cake fails. Weaving patterns and computer programs are the same — precise sequences of instructions that must be followed exactly.',
      storyConnection: 'Pochampally weavers traditionally memorize patterns as oral instructions passed from master to apprentice — "tie three, skip two, tie one, skip four" — essentially reciting an algorithm. A senior weaver can hold hundreds of such patterns in memory. When written down, these instructions look remarkably like simple computer programs.',
      checkQuestion: 'A pattern is 20 columns wide and 30 rows tall. How many tie/no-tie decisions must the weaver make? If each decision takes 2 seconds, how long does one complete pattern take?',
      checkAnswer: '20 * 30 = 600 decisions. At 2 seconds each: 600 * 2 = 1200 seconds = 20 minutes. This is why weavers use repeating patterns — a 4x4 bandha tiled to fill 20x30 means only 16 unique decisions to memorize, not 600.',
      codeIntro: 'Write algorithms that generate weave patterns — from simple stripes to complex geometric designs.',
      code: `# Algorithms as weaving instructions

def generate_pattern(width, height, algorithm):
    """Generate a 2D weave pattern using a given algorithm function.
    algorithm(row, col, width, height) -> 0 or 1
    """
    grid = []
    for row in range(height):
        line = []
        for col in range(width):
            line.append(algorithm(row, col, width, height))
        grid.append(line)
    return grid

def display_grid(grid, label=""):
    if label:
        print(label)
    for row in grid:
        visual = "".join("█" if b else "░" for b in row)
        print(f"  {visual}")
    print()

# Algorithm 1: Vertical stripes
def vertical_stripes(row, col, w, h):
    return col % 2

# Algorithm 2: Checkerboard
def checkerboard(row, col, w, h):
    return (row + col) % 2

# Algorithm 3: Diamond
def diamond(row, col, w, h):
    center_r, center_c = h // 2, w // 2
    distance = abs(row - center_r) + abs(col - center_c)
    return 1 if distance < min(center_r, center_c) else 0

# Algorithm 4: Diagonal zigzag
def zigzag(row, col, w, h):
    return (row + col) % 4 < 2

# Algorithm 5: Concentric rectangles
def concentric(row, col, w, h):
    dist = min(row, col, h - 1 - row, w - 1 - col)
    return dist % 2

width, height = 16, 12

algorithms = [
    ("Vertical Stripes", vertical_stripes),
    ("Checkerboard", checkerboard),
    ("Diamond", diamond),
    ("Zigzag", zigzag),
    ("Concentric Rectangles", concentric),
]

for name, algo in algorithms:
    grid = generate_pattern(width, height, algo)
    # Count ones and zeros
    ones = sum(sum(row) for row in grid)
    total = width * height
    display_grid(grid, name)
    print(f"  Dyed threads: {ones}/{total} ({ones/total*100:.0f}%)")
    print()

# Compare algorithm complexity
print("=== Algorithm Complexity ===")
print(f"{'Algorithm':<25} {'Operations per pixel':>20}")
print("-" * 47)
complexities = [
    ("Vertical stripes", "1 modulo"),
    ("Checkerboard", "1 add + 1 modulo"),
    ("Diamond", "2 subtract + 2 abs + 1 add + 1 compare"),
    ("Zigzag", "1 add + 1 modulo + 1 compare"),
    ("Concentric", "4 subtract + 1 min + 1 modulo"),
]
for name, ops in complexities:
    print(f"  {name:<25} {ops}")`,
      challenge: 'Write an algorithm that generates a Pochampally-style pattern with a central motif surrounded by a border. The border should be 2 threads wide with alternating dyed/undyed. The center should have a different pattern (your choice). Test it at 20x14.',
      successHint: 'You just wrote algorithms that generate visual patterns — the same approach used in computer graphics, procedural texture generation, and generative art. The insight is that a small algorithm (a few lines of code) can produce complex, beautiful patterns when applied across a grid.',
    },
    {
      title: 'Boolean logic — combining conditions in pattern rules',
      concept: `**Boolean logic** is the mathematics of true/false decisions. Every pattern algorithm uses Boolean logic: "if this condition AND that condition, then dye the thread." The three basic Boolean operations are **AND** (both must be true), **OR** (at least one must be true), and **NOT** (flip true to false).

In weaving, Boolean logic lets you combine simple patterns into complex ones. A checkerboard AND a diamond gives you a checkerboard only inside the diamond shape. A stripe OR a border gives you both patterns overlaid. NOT a pattern gives you its negative (swap dyed and undyed).

These three operations — AND, OR, NOT — are sufficient to express ANY logical condition. This is the foundation of digital computing: every circuit in your phone is built from gates that implement AND, OR, and NOT on binary signals.

📚 *Boolean algebra: A AND B is true only when both A and B are true. A OR B is true when at least one is true. NOT A flips the value. These three operations can express any logical function — this is the completeness theorem of Boolean logic.*`,
      analogy: 'Think of a door with two locks. "Key A AND Key B" means you need BOTH keys to open the door. "Key A OR Key B" means either key works. "NOT locked" means the door is already open. Every security system, every login page, every decision in a computer program is built from these three basic operations.',
      storyConnection: 'A Pochampally master weaver combines motifs using implicit Boolean logic: "dye this thread if it is in the border region AND it is an odd position" or "dye if it is in the center medallion OR on a diagonal line." The weavers do not call it Boolean logic, but they are performing the same operations that power every computer chip.',
      checkQuestion: 'Pattern A has a 1 at position (3,5). Pattern B has a 0 at position (3,5). What is A AND B at (3,5)? What is A OR B? What is NOT A?',
      checkAnswer: 'A AND B = 1 AND 0 = 0 (both must be 1). A OR B = 1 OR 0 = 1 (at least one is 1). NOT A = NOT 1 = 0 (flipped).',
      codeIntro: 'Use Boolean operations to combine simple patterns into complex Pochampally designs.',
      code: `# Boolean logic for pattern combination

def make_grid(width, height, func):
    return [[func(r, c, width, height) for c in range(width)] for r in range(height)]

def grid_and(a, b):
    return [[a[r][c] and b[r][c] for c in range(len(a[0]))] for r in range(len(a))]

def grid_or(a, b):
    return [[a[r][c] or b[r][c] for c in range(len(a[0]))] for r in range(len(a))]

def grid_not(a):
    return [[1 - a[r][c] for c in range(len(a[0]))] for r in range(len(a))]

def grid_xor(a, b):
    return [[a[r][c] ^ b[r][c] for c in range(len(a[0]))] for r in range(len(a))]

def show(grid, label=""):
    if label:
        print(label)
    for row in grid:
        print("  " + "".join("█" if b else "░" for b in row))

W, H = 16, 10

# Base patterns
checker = make_grid(W, H, lambda r, c, w, h: (r + c) % 2)
diamond = make_grid(W, H, lambda r, c, w, h: 1 if abs(r - h//2) + abs(c - w//2) < min(h//2, w//2) else 0)
stripes = make_grid(W, H, lambda r, c, w, h: 1 if c % 4 < 2 else 0)
border = make_grid(W, H, lambda r, c, w, h: 1 if r < 2 or r >= h-2 or c < 2 or c >= w-2 else 0)

show(checker, "Checkerboard:")
show(diamond, "Diamond:")
print()

# Boolean combinations
show(grid_and(checker, diamond), "Checker AND Diamond (checker inside diamond):")
print()

show(grid_or(stripes, border), "Stripes OR Border (both overlaid):")
print()

show(grid_xor(checker, diamond), "Checker XOR Diamond (one but not both):")
print()

show(grid_not(diamond), "NOT Diamond (inverted):")
print()

# Complex combination: border + checker inside diamond
inner = grid_and(checker, diamond)
design = grid_or(inner, border)
show(design, "Complex: Border + Checkerboard-in-Diamond:")
print()

# Count operations
print("=== Boolean Logic Truth Table ===")
print(f"{'A':>3} {'B':>3} {'AND':>5} {'OR':>4} {'XOR':>5} {'NOT A':>6}")
print("-" * 28)
for a in [0, 1]:
    for b in [0, 1]:
        print(f"{a:>3} {b:>3} {a and b:>5} {a or b:>4} {a ^ b:>5} {1-a:>6}")

print()
# How many unique 2-input Boolean functions exist?
print("There are exactly 16 unique 2-input Boolean functions.")
print("AND, OR, XOR, NAND, NOR, XNOR are the most common.")
print("Every digital circuit is built from these primitives.")`,
      challenge: 'Create a "Pochampally medallion" using Boolean operations: start with a large diamond, XOR it with a checkerboard (creates a patterned diamond), then OR with a 1-thread border. Display the result at 20x14 and count what percentage of threads are dyed.',
      successHint: 'Boolean logic is the atomic operation of computing. Every transistor in your computer implements a Boolean gate. The patterns you created by combining AND, OR, NOT, and XOR are exactly how graphics processors render images — combining layers of visual information using logical operations.',
    },
    {
      title: 'Encoding and decoding — turning weave patterns into messages',
      concept: `Now that we can represent patterns as binary and manipulate them with logic, we can use weave patterns to **encode messages**. This is the bridge between textile art and information theory: a pattern is not just decorative — it can carry data.

**Encoding** converts a message into a pattern. **Decoding** converts a pattern back into a message. For this to work, both the sender and receiver must agree on the same **encoding scheme** — the mapping between symbols and bit patterns.

The most famous encoding scheme is **ASCII** (American Standard Code for Information Interchange), which maps each character to a 7-bit number. 'A' = 65 = 1000001, 'B' = 66 = 1000010, etc. We can extend this to an "Ikat code" — a mapping optimized for the weaving process.

📚 *An encoding scheme is a mapping between symbols and their binary representations. Different schemes optimize for different goals: ASCII prioritizes standardization, Morse code prioritizes speed for common letters, and Huffman coding prioritizes compression.*`,
      analogy: 'Think of Braille — a system that encodes letters as patterns of raised dots. A blind reader decodes the dots back into letters by touch. The pattern is the medium; the message is the meaning. Pochampally patterns can work the same way — each row of dyed/undyed threads encodes one character of a hidden message.',
      storyConnection: 'Historically, textiles have been used to encode messages. Andean quipu used knotted strings to record numerical data. During wartime, knitting patterns were used to send coded messages across enemy lines. A Pochampally textile with a hidden binary message would be indistinguishable from a normal decorative pattern — the ultimate steganography.',
      checkQuestion: 'Using ASCII, the word "HI" encodes as: H=72=01001000, I=73=01001001. How many threads wide and how many rows tall would you need to weave this message?',
      checkAnswer: 'Each character needs 8 bits (threads wide). "HI" has 2 characters, so 2 rows. The pattern is 8 threads wide and 2 rows tall. For a longer message like "HELLO" you would need 5 rows of 8 threads each.',
      codeIntro: 'Build a complete encoder/decoder that hides messages in Pochampally weave patterns.',
      code: `# Message encoding and decoding in weave patterns

class IkatEncoder:
    """Encode and decode messages as Pochampally weave patterns."""

    def encode_char(self, char):
        """Convert character to 8-bit binary pattern"""
        code = ord(char)
        bits = []
        for i in range(7, -1, -1):
            bits.append((code >> i) & 1)
        return bits

    def decode_char(self, bits):
        """Convert 8-bit pattern back to character"""
        value = 0
        for i, bit in enumerate(bits):
            value += bit * (2 ** (7 - i))
        return chr(value)

    def encode_message(self, message):
        """Convert a string to a 2D weave pattern"""
        pattern = []
        for char in message:
            pattern.append(self.encode_char(char))
        return pattern

    def decode_pattern(self, pattern):
        """Convert a 2D weave pattern back to a string"""
        message = ""
        for row in pattern:
            message += self.decode_char(row)
        return message

    def display_pattern(self, pattern, show_binary=True):
        """Display the pattern visually"""
        for i, row in enumerate(pattern):
            binary = "".join(str(b) for b in row)
            visual = "".join("█" if b else "░" for b in row)
            char = self.decode_char(row)
            if show_binary:
                print(f"  Row {i+1}: {binary} {visual} = '{char}'")
            else:
                print(f"  {visual}")

encoder = IkatEncoder()

# Encode a message
message = "POCHAMPALLY"
print("=== Ikat Message Encoder ===")
print(f"Message: '{message}'")
print(f"Length: {len(message)} characters = {len(message) * 8} bits")
print()

pattern = encoder.encode_message(message)
print("Encoded weave pattern:")
encoder.display_pattern(pattern)

print()

# Decode it back
decoded = encoder.decode_pattern(pattern)
print(f"Decoded message: '{decoded}'")
print(f"Match: {decoded == message}")

print()

# Without labels — looks like a decorative pattern!
print("As a textile (no labels):")
encoder.display_pattern(pattern, show_binary=False)

print()

# Statistics
total_bits = len(message) * 8
ones = sum(sum(row) for row in pattern)
zeros = total_bits - ones
print(f"=== Pattern Statistics ===")
print(f"Total threads: {total_bits}")
print(f"Dyed (1s): {ones} ({ones/total_bits*100:.0f}%)")
print(f"Undyed (0s): {zeros} ({zeros/total_bits*100:.0f}%)")
print(f"Unique patterns needed: {len(set(message))} (unique characters)")

# Show the encoding table for this message
print()
print("=== Character Encoding Table ===")
for char in sorted(set(message)):
    bits = encoder.encode_char(char)
    binary = "".join(str(b) for b in bits)
    decimal = ord(char)
    print(f"  '{char}' = {decimal:>3} = {binary}")`,
      challenge: 'Encode a secret message of your choice. Then intentionally flip one bit (change a 0 to 1 or vice versa) in one row and try to decode it. What happens to the character? This is why error detection is important — one wrong thread changes the entire message.',
      successHint: 'You just built the same encode/decode pipeline that underlies all digital communication. When you send a text message, your phone encodes characters as binary, transmits the bits as radio signals, and the receiver decodes them back to characters. The Pochampally pattern is just a different physical medium for the same process.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Binary patterns and simple algorithms</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises use Python to explore binary encoding, pattern algorithms, and Boolean logic.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {loadProgress}</>) : (<><Sparkles className="w-5 h-5" /> Load Python</>)}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson
            key={i}
            id={`L1-${i + 1}`}
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
