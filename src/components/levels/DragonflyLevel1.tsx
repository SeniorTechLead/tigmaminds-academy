import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function DragonflyLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Pixels — what a computer sees instead of a picture',
      concept: `When you look at a photo of a paddy field, you see green rice, brown earth, blue sky. But a computer doesn't see any of that. It sees a **grid of numbers**.

Every digital image is a grid of tiny colored squares called **pixels**. Each pixel has three numbers: how much **Red**, **Green**, and **Blue** light to mix. These three values (each from 0 to 255) can create any color:
- (255, 0, 0) = pure red
- (0, 255, 0) = pure green
- (0, 0, 255) = pure blue
- (0, 0, 0) = black (no light)
- (255, 255, 255) = white (all light)

A typical photo might be 1920 × 1080 pixels — that's over **2 million** tiny colored squares. The dragonfly Nila saw the world through compound eyes with thousands of lenses. A camera does the same with millions of pixels.`,
      analogy: 'Think of a mosaic. From far away, you see a face or a landscape. Up close, it\'s just tiny colored tiles. A digital image works the same way — millions of colored tiles (pixels) that your brain assembles into a picture. Computer vision is teaching a machine to do what your brain does automatically.',
      storyConnection: 'Nila the dragonfly had compound eyes — each eye contains up to 30,000 individual lenses called ommatidia. Each one captures a tiny piece of the scene, like a pixel. Her brain fused them into a single, panoramic view. A drone camera does exactly the same thing with a digital sensor.',
      checkQuestion: 'A pixel has RGB values (0, 150, 0). What color is it? What about (150, 150, 0)?',
      checkAnswer: '(0, 150, 0) is a medium green — no red, moderate green, no blue. (150, 150, 0) is yellow-ish — equal red and green with no blue. Red + Green = Yellow in light mixing (this is different from paint mixing!).',
      codeIntro: 'Create a tiny image from scratch using just numbers.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Create a tiny 5x5 image — each pixel has 3 values (R, G, B)
# Values range from 0 (dark) to 255 (bright)
image = np.zeros((5, 5, 3), dtype=np.uint8)

# Set some pixels by hand
image[0, 0] = [255, 0, 0]    # top-left: red
image[0, 4] = [0, 0, 255]    # top-right: blue
image[2, 2] = [0, 255, 0]    # center: green
image[4, 0] = [255, 255, 0]  # bottom-left: yellow
image[4, 4] = [255, 255, 255] # bottom-right: white

fig, ax = plt.subplots(figsize=(5, 5))
fig.patch.set_facecolor('#1f2937')
ax.imshow(image)
ax.set_title('A 5×5 image — each square is one pixel', color='white')
ax.tick_params(colors='gray')
plt.tight_layout()
plt.show()

print("Image shape:", image.shape)
print("  5 rows × 5 columns × 3 color channels (RGB)")
print()
print("Top-left pixel:", image[0, 0], "= red")
print("Center pixel:", image[2, 2], "= green")`,
      challenge: 'Set image[1, 1] to [255, 128, 0] — that\'s orange. Can you make a diagonal stripe of one color?',
      successHint: 'You just created a digital image from pure numbers. Every photo, every drone image, every satellite map is just this — a grid of RGB values — at a much larger scale.',
      practice: [
        {
          label: 'Reinforce',
          prompt: 'Create a 10×10 image that\'s entirely one color (your choice). What shape does the array need to be?',
          starterCode: `import numpy as np\nimport matplotlib.pyplot as plt\n\n# Create a 10x10 image, all one color\nimage = np.full((10, 10, 3), fill_value=[???, ???, ???], dtype=np.uint8)\n\nfig, ax = plt.subplots(figsize=(4, 4))\nfig.patch.set_facecolor('#1f2937')\nax.imshow(image)\nax.set_title('My solid color image', color='white')\nplt.tight_layout()\nplt.show()\n\nprint("Shape:", image.shape)`,
          hint: 'Replace the ??? with RGB values 0-255. Try [100, 200, 50] for a nice green.',
        },
        {
          label: 'Apply',
          prompt: 'Create a 10×10 image with the top half green (healthy rice) and bottom half brown (soil).',
          starterCode: `import numpy as np\nimport matplotlib.pyplot as plt\n\nimage = np.zeros((10, 10, 3), dtype=np.uint8)\n\n# Top 5 rows: green (healthy rice)\nimage[:5, :] = [34, 139, 34]\n\n# Bottom 5 rows: brown (soil)\nimage[5:, :] = [139, 90, 43]\n\nfig, ax = plt.subplots(figsize=(4, 4))\nfig.patch.set_facecolor('#1f2937')\nax.imshow(image)\nax.set_title('Paddy field from above', color='white')\nplt.tight_layout()\nplt.show()`,
        },
        {
          label: 'Challenge',
          prompt: 'What\'s the total number of values needed to store a 1920×1080 photo? Calculate it.',
          starterCode: `width = 1920\nheight = 1080\nchannels = 3  # R, G, B\n\ntotal_pixels = width * height\ntotal_values = total_pixels * channels\ntotal_megabytes = total_values / (1024 * 1024)\n\nprint(f"Pixels: {total_pixels:,}")\nprint(f"Total RGB values: {total_values:,}")\nprint(f"Raw size: {total_megabytes:.1f} MB")\nprint()\nprint("That's why photos are compressed (JPEG, WebP)")`,
          hint: 'Each pixel needs 3 numbers (RGB), each stored as 1 byte.',
        },
      ],
    },
    {
      title: 'Color channels — seeing the world in layers',
      concept: `A color image is really **three images stacked on top of each other** — one for red, one for green, one for blue. These are called **color channels**.

Separating an image into its channels is incredibly useful for detection. In a paddy field photo:
- The **green channel** is bright where rice is healthy
- The **red channel** is bright where soil is exposed or plants are stressed
- The **blue channel** captures sky and water

Scientists use a related trick called **NDVI** (Normalized Difference Vegetation Index): they compare how much red vs. near-infrared light a plant reflects. Healthy plants absorb red light and reflect infrared. Stressed plants do the opposite. This is how drones detect crop disease from the air.`,
      analogy: 'Color channels are like looking at the world through tinted glasses. Red glasses show only where red things are. Green glasses show only where green things are. Each pair reveals different information. A drone with special cameras sees the same scene in many "channels" — including invisible ones like infrared.',
      storyConnection: 'Nila the dragonfly could see ultraviolet light that humans can\'t — an extra color channel that revealed patterns on flowers invisible to our eyes. Agricultural drones do the same with infrared cameras, seeing plant health that the naked eye misses.',
      checkQuestion: 'In a paddy field image, which color channel (R, G, or B) would be brightest in the areas where rice is healthy and green?',
      checkAnswer: 'The green channel. Healthy rice leaves reflect green light strongly (that\'s why they look green to us). The red channel would be darker there because plants absorb red light for photosynthesis.',
      codeIntro: 'Generate a synthetic paddy field image and split it into RGB channels.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Create a synthetic 50x50 paddy field
np.random.seed(42)
field = np.zeros((50, 50, 3), dtype=np.uint8)

# Healthy rice (top-left quadrant): bright green
field[:25, :25] = [30 + np.random.randint(0, 20, (25, 25)),
                   120 + np.random.randint(0, 40, (25, 25)),
                   20 + np.random.randint(0, 15, (25, 25))]

# Stressed rice (top-right): yellowish
field[:25, 25:] = [140 + np.random.randint(0, 30, (25, 25)),
                   130 + np.random.randint(0, 20, (25, 25)),
                   40 + np.random.randint(0, 15, (25, 25))]

# Soil (bottom-left): brown
field[25:, :25] = [120 + np.random.randint(0, 30, (25, 25)),
                   80 + np.random.randint(0, 20, (25, 25)),
                   50 + np.random.randint(0, 15, (25, 25))]

# Water (bottom-right): blue-grey
field[25:, 25:] = [40 + np.random.randint(0, 15, (25, 25)),
                   50 + np.random.randint(0, 20, (25, 25)),
                   100 + np.random.randint(0, 40, (25, 25))]

# Show original + 3 channels
fig, axes = plt.subplots(1, 4, figsize=(12, 3))
fig.patch.set_facecolor('#1f2937')

titles = ['Full Color', 'Red Channel', 'Green Channel', 'Blue Channel']
cmaps = [None, 'Reds', 'Greens', 'Blues']

for ax, title, ch, cmap in zip(axes, titles, [None, 0, 1, 2], cmaps):
    if ch is None:
        ax.imshow(field)
    else:
        ax.imshow(field[:, :, ch], cmap=cmap, vmin=0, vmax=255)
    ax.set_title(title, color='white', fontsize=9)
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray', labelsize=6)

plt.tight_layout()
plt.show()

print("Healthy rice: bright in Green, dim in Red")
print("Stressed rice: bright in both Red AND Green (= yellow)")
print("Soil: moderate Red, less Green")
print("Water: brightest in Blue channel")`,
      challenge: 'The green channel alone can roughly tell you where healthy plants are. What threshold would you pick? Try: bright green > 120 in the green channel.',
      successHint: 'Splitting into channels is the first step in computer vision. Drones do this with infrared channels to detect crop health invisible to the eye.',
      practice: [
        {
          label: 'Reinforce',
          prompt: 'Extract just the green channel and display it as a grayscale heatmap. Where is it brightest?',
          starterCode: `import numpy as np\nimport matplotlib.pyplot as plt\n\nnp.random.seed(42)\nfield = np.zeros((50, 50, 3), dtype=np.uint8)\nfield[:25, :25] = [30, 140, 20]  # healthy green\nfield[:25, 25:] = [140, 130, 40]  # stressed yellow\nfield[25:, :25] = [120, 80, 50]  # soil brown\nfield[25:, 25:] = [40, 50, 100]  # water blue\n\ngreen_channel = field[:, :, 1]  # index 1 = green\n\nfig, ax = plt.subplots(figsize=(5, 5))\nfig.patch.set_facecolor('#1f2937')\nax.imshow(green_channel, cmap='Greens', vmin=0, vmax=255)\nax.set_title('Green channel only', color='white')\nax.tick_params(colors='gray')\nplt.tight_layout()\nplt.show()\n\nprint("Brightest area:", np.max(green_channel))\nprint("Darkest area:", np.min(green_channel))`,
        },
        {
          label: 'Apply',
          prompt: 'Compute a simple "vegetation index": green / (red + green + blue). Where is it highest?',
          starterCode: `import numpy as np\nimport matplotlib.pyplot as plt\n\nnp.random.seed(42)\nfield = np.zeros((50, 50, 3), dtype=np.float32)\nfield[:25, :25] = [30, 140, 20]  # healthy\nfield[:25, 25:] = [140, 130, 40]  # stressed\nfield[25:, :25] = [120, 80, 50]  # soil\nfield[25:, 25:] = [40, 50, 100]  # water\n\ntotal = field[:,:,0] + field[:,:,1] + field[:,:,2] + 1  # +1 to avoid /0\nveg_index = field[:,:,1] / total  # green / total\n\nfig, ax = plt.subplots(figsize=(5, 5))\nfig.patch.set_facecolor('#1f2937')\nim = ax.imshow(veg_index, cmap='RdYlGn', vmin=0, vmax=0.8)\nax.set_title('Vegetation Index (green/total)', color='white')\nax.tick_params(colors='gray')\nplt.colorbar(im, ax=ax, shrink=0.8)\nplt.tight_layout()\nplt.show()`,
          hint: 'A high ratio of green to total light means the pixel is probably a plant. This is a simplified version of NDVI.',
        },
        {
          label: 'Challenge',
          prompt: 'Create a binary mask: mark pixels as "healthy" (1) if green > 100 and red < 80, else "not healthy" (0).',
          starterCode: `import numpy as np\nimport matplotlib.pyplot as plt\n\nnp.random.seed(42)\nfield = np.zeros((50, 50, 3), dtype=np.uint8)\nfield[:25, :25] = [30, 140, 20]\nfield[:25, 25:] = [140, 130, 40]\nfield[25:, :25] = [120, 80, 50]\nfield[25:, 25:] = [40, 50, 100]\n\n# Binary mask: healthy if green > 100 AND red < 80\nhealthy = (field[:,:,1] > 100) & (field[:,:,0] < 80)\n\nfig, (ax1, ax2) = plt.subplots(1, 2, figsize=(8, 4))\nfig.patch.set_facecolor('#1f2937')\nax1.imshow(field)\nax1.set_title('Original', color='white')\nax2.imshow(healthy, cmap='Greens')\nax2.set_title('Healthy mask', color='white')\nfor ax in [ax1, ax2]: ax.tick_params(colors='gray')\nplt.tight_layout()\nplt.show()\n\npercent = np.sum(healthy) / healthy.size * 100\nprint(f"Healthy pixels: {np.sum(healthy)} / {healthy.size} ({percent:.1f}%)")`,
          hint: 'This is exactly how real crop health systems work — threshold on color channels to classify each pixel.',
        },
      ],
    },
    {
      title: 'Thresholds — the simplest way to detect something',
      concept: `To detect something in an image, you need a **rule** that separates what you're looking for from everything else. The simplest rule is a **threshold**: if a pixel's value is above a certain number, it's one thing; below, it's another.

For example: "If a pixel's green value is above 120, it's probably a plant. Otherwise, it's soil or water." This creates a **binary mask** — a black-and-white image where white pixels are what you detected and black pixels are everything else.

Thresholds are crude but powerful. They work well when the thing you're looking for has a distinctive color (like green plants on brown soil). They fail when colors overlap (like stressed yellow plants vs. sandy soil). That's when you need smarter techniques — which is what Level 2 introduces.`,
      analogy: 'A threshold is like a height requirement at an amusement park. "You must be this tall to ride." Everyone above the line gets in, everyone below doesn\'t. Simple, fast, but it can\'t account for anything except height — just like a color threshold can\'t account for texture or shape.',
      storyConnection: 'Nila the dragonfly didn\'t need complex AI to find pests. She used simple rules: if it moves and it\'s the right size, catch it. If it\'s on a rice stalk, look closer. Thresholds in computer vision work the same way — fast, simple rules that filter out most of the noise.',
      checkQuestion: 'If you threshold the green channel at 120, and a stressed plant has a green value of 115, what happens?',
      checkAnswer: 'It gets classified as "not a plant" — a false negative. The threshold is too high. This is the fundamental trade-off: set it lower to catch more plants (but also catch some non-plants), or higher to be more precise (but miss some plants).',
      codeIntro: 'Apply different thresholds to the same image and see how results change.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Create a more realistic paddy field with gradients
np.random.seed(42)
field = np.zeros((80, 80, 3), dtype=np.uint8)

# Healthy rice (scattered patches)
for _ in range(8):
    x, y = np.random.randint(5, 70, 2)
    s = np.random.randint(8, 15)
    field[y:y+s, x:x+s] = [20+np.random.randint(20), 100+np.random.randint(60), 15+np.random.randint(20)]

# Background: brown soil with noise
for i in range(80):
    for j in range(80):
        if field[i, j, 1] < 50:  # not already green
            field[i, j] = [100+np.random.randint(40), 70+np.random.randint(30), 40+np.random.randint(20)]

# Try 3 different thresholds
fig, axes = plt.subplots(1, 4, figsize=(12, 3))
fig.patch.set_facecolor('#1f2937')

axes[0].imshow(field)
axes[0].set_title('Original', color='white', fontsize=9)

for ax, thresh in zip(axes[1:], [80, 110, 140]):
    mask = field[:, :, 1] > thresh
    ax.imshow(mask, cmap='Greens')
    detected = np.sum(mask)
    ax.set_title(f'Green > {thresh}\\\n({detected} pixels)', color='white', fontsize=9)

for ax in axes:
    ax.tick_params(colors='gray', labelsize=6)

plt.suptitle('Effect of threshold on detection', color='white', fontsize=11)
plt.tight_layout()
plt.show()

print("Low threshold (80): catches everything, including some soil")
print("Medium threshold (110): good balance")
print("High threshold (140): misses faint green patches")`,
      challenge: 'What threshold gives the best result? There\'s no single right answer — it depends on what\'s more important: catching all plants (low threshold) or avoiding false alarms (high threshold).',
      successHint: 'You just learned the core trade-off in all detection systems — sensitivity vs. specificity. Every AI system, from medical imaging to self-driving cars, deals with this same balance.',
      practice: [
        {
          label: 'Reinforce',
          prompt: 'Try thresholding the red channel instead. What does red > 100 detect?',
          starterCode: `import numpy as np\nimport matplotlib.pyplot as plt\n\nnp.random.seed(42)\nfield = np.zeros((50, 50, 3), dtype=np.uint8)\nfield[:25, :25] = [30, 140, 20]  # healthy\nfield[:25, 25:] = [140, 130, 40]  # stressed\nfield[25:, :25] = [120, 80, 50]  # soil\nfield[25:, 25:] = [40, 50, 100]  # water\n\nred_mask = field[:,:,0] > 100\n\nfig, (ax1, ax2) = plt.subplots(1, 2, figsize=(8, 4))\nfig.patch.set_facecolor('#1f2937')\nax1.imshow(field)\nax1.set_title('Original', color='white')\nax2.imshow(red_mask, cmap='Reds')\nax2.set_title('Red > 100', color='white')\nfor ax in [ax1, ax2]: ax.tick_params(colors='gray')\nplt.tight_layout()\nplt.show()`,
        },
        {
          label: 'Apply',
          prompt: 'Combine two thresholds: detect pixels where green > 100 AND red < 80 (healthy plants only, not stressed ones).',
          starterCode: `import numpy as np\nimport matplotlib.pyplot as plt\n\nnp.random.seed(42)\nfield = np.zeros((50, 50, 3), dtype=np.uint8)\nfield[:25, :25] = [30, 140, 20]\nfield[:25, 25:] = [140, 130, 40]\nfield[25:, :25] = [120, 80, 50]\nfield[25:, 25:] = [40, 50, 100]\n\nhealthy_only = (field[:,:,1] > 100) & (field[:,:,0] < 80)\n\nfig, ax = plt.subplots(figsize=(5, 5))\nfig.patch.set_facecolor('#1f2937')\nax.imshow(healthy_only, cmap='Greens')\nax.set_title('Healthy plants only (green>100 AND red<80)', color='white', fontsize=9)\nax.tick_params(colors='gray')\nplt.tight_layout()\nplt.show()\n\nprint("Combining thresholds = more precise detection")`,
        },
        {
          label: 'Challenge',
          prompt: 'Count the percentage of the field that\'s healthy, stressed, soil, and water using threshold rules.',
          starterCode: `import numpy as np\n\nnp.random.seed(42)\nfield = np.zeros((50, 50, 3), dtype=np.uint8)\nfield[:25, :25] = [30, 140, 20]\nfield[:25, 25:] = [140, 130, 40]\nfield[25:, :25] = [120, 80, 50]\nfield[25:, 25:] = [40, 50, 100]\n\ntotal = 50 * 50\nhealthy = np.sum((field[:,:,1] > 100) & (field[:,:,0] < 80))\nstressed = np.sum((field[:,:,1] > 100) & (field[:,:,0] > 80))\nsoil = np.sum((field[:,:,0] > 100) & (field[:,:,1] < 100))\nwater = np.sum(field[:,:,2] > 80)\n\nprint(f"Healthy: {healthy/total*100:.1f}%")\nprint(f"Stressed: {stressed/total*100:.1f}%")\nprint(f"Soil: {soil/total*100:.1f}%")\nprint(f"Water: {water/total*100:.1f}%")\nprint(f"Total: {(healthy+stressed+soil+water)/total*100:.1f}%")`,
          hint: 'The total might not add to 100% — some pixels could match multiple rules or none. That\'s why real classifiers assign each pixel to exactly one category.',
        },
      ],
    },
    {
      title: 'Image arrays — how NumPy handles photos',
      concept: `In Level 1 of the Elephant story, you used NumPy arrays as 1D lists (a signal over time). Images are **3D arrays**: height × width × channels. A 100×100 color image is an array of shape \`(100, 100, 3)\`.

NumPy's power is that you can operate on **every pixel at once**. Instead of looping through millions of pixels one by one, you write \`image[:, :, 1] > 120\` and NumPy checks all pixels simultaneously. This is called **vectorization** — it's why Python with NumPy can process images fast enough for real-time drone use.

The shape tells you everything:
- \`(100, 100, 3)\` → 100 rows, 100 columns, 3 color channels
- \`(100, 100)\` → grayscale (1 channel, no color)
- \`(3, 100, 100)\` → channels-first format (used by some AI frameworks)`,
      analogy: 'If a 1D array is a row of mailboxes, a 2D array is a grid of apartment mailboxes (rows × columns), and a 3D array is three grids stacked: one for red mail, one for green mail, one for blue mail. NumPy lets you say "open every mailbox on floor 2" in one instruction instead of visiting them one by one.',
      storyConnection: 'When Nila scanned a paddy field, she processed thousands of visual inputs simultaneously — her compound brain was doing biological vectorization. A drone\'s onboard computer does the same with NumPy: process the entire image at once, not pixel by pixel.',
      checkQuestion: 'An image has shape (480, 640, 3). How many total pixels does it have? How many total numbers are stored?',
      checkAnswer: '480 × 640 = 307,200 pixels. Each pixel has 3 values (RGB), so 307,200 × 3 = 921,600 total numbers. That\'s nearly a million values — and NumPy processes them all in one operation.',
      codeIntro: 'Create images of different shapes and manipulate them with NumPy operations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Create a gradient image using NumPy broadcasting
height, width = 100, 150

# Red increases left to right
red = np.tile(np.linspace(0, 255, width), (height, 1)).astype(np.uint8)

# Green increases top to bottom
green = np.tile(np.linspace(0, 255, height), (width, 1)).T.astype(np.uint8)

# Blue is constant
blue = np.full((height, width), 100, dtype=np.uint8)

# Stack into a color image
image = np.stack([red, green, blue], axis=2)

fig, axes = plt.subplots(1, 3, figsize=(12, 3))
fig.patch.set_facecolor('#1f2937')

axes[0].imshow(image)
axes[0].set_title(f'Color gradient {image.shape}', color='white', fontsize=9)

# Flip vertically — one operation on entire array
flipped = image[::-1, :, :]
axes[1].imshow(flipped)
axes[1].set_title('Flipped (image[::-1])', color='white', fontsize=9)

# Crop center — array slicing
h, w = image.shape[:2]
cropped = image[h//4:3*h//4, w//4:3*w//4]
axes[2].imshow(cropped)
axes[2].set_title(f'Cropped {cropped.shape}', color='white', fontsize=9)

for ax in axes:
    ax.tick_params(colors='gray', labelsize=6)

plt.tight_layout()
plt.show()

print(f"Original shape: {image.shape}")
print(f"Flipped shape: {flipped.shape} (same size, pixels rearranged)")
print(f"Cropped shape: {cropped.shape} (smaller)")`,
      challenge: 'Try image[:, ::-1, :] — what does flipping the second axis do? And image[:, :, ::-1] flips the color channels (RGB → BGR).',
      successHint: 'You can flip, crop, rotate, and transform any image with array operations. No loops needed. This is the foundation for all image processing in computer vision.',
      practice: [
        {
          label: 'Reinforce',
          prompt: 'Create a 200×200 image and draw a red square in the center (rows 75-125, cols 75-125).',
          starterCode: `import numpy as np\nimport matplotlib.pyplot as plt\n\nimage = np.zeros((200, 200, 3), dtype=np.uint8)\nimage[75:125, 75:125] = [255, 0, 0]  # red square\n\nfig, ax = plt.subplots(figsize=(4, 4))\nfig.patch.set_facecolor('#1f2937')\nax.imshow(image)\nax.set_title('Red square on black', color='white')\nax.tick_params(colors='gray')\nplt.tight_layout()\nplt.show()`,
        },
        {
          label: 'Apply',
          prompt: 'Brighten an image by adding 50 to every pixel. What happens when values exceed 255?',
          starterCode: `import numpy as np\nimport matplotlib.pyplot as plt\n\nnp.random.seed(42)\nimage = np.random.randint(50, 200, (50, 50, 3), dtype=np.uint8)\n\n# Brighten by adding 50 (with clipping to 0-255)\nbrighter = np.clip(image.astype(np.int16) + 50, 0, 255).astype(np.uint8)\n\nfig, (ax1, ax2) = plt.subplots(1, 2, figsize=(8, 4))\nfig.patch.set_facecolor('#1f2937')\nax1.imshow(image)\nax1.set_title('Original', color='white')\nax2.imshow(brighter)\nax2.set_title('Brightened (+50)', color='white')\nfor ax in [ax1, ax2]: ax.tick_params(colors='gray')\nplt.tight_layout()\nplt.show()`,
          hint: 'np.clip() prevents overflow — without it, 250 + 50 = 300 would wrap around to 44 (uint8 overflow). Always clip when doing image math.',
        },
        {
          label: 'Challenge',
          prompt: 'Convert a color image to grayscale using the formula: gray = 0.299×R + 0.587×G + 0.114×B',
          starterCode: `import numpy as np\nimport matplotlib.pyplot as plt\n\nnp.random.seed(42)\nimage = np.random.randint(0, 255, (50, 50, 3), dtype=np.uint8)\n\n# Convert to grayscale using human perception weights\ngray = (0.299 * image[:,:,0] + 0.587 * image[:,:,1] + 0.114 * image[:,:,2]).astype(np.uint8)\n\nfig, (ax1, ax2) = plt.subplots(1, 2, figsize=(8, 4))\nfig.patch.set_facecolor('#1f2937')\nax1.imshow(image)\nax1.set_title(f'Color {image.shape}', color='white')\nax2.imshow(gray, cmap='gray')\nax2.set_title(f'Grayscale {gray.shape}', color='white')\nfor ax in [ax1, ax2]: ax.tick_params(colors='gray')\nplt.tight_layout()\nplt.show()\n\nprint("Why 0.587 for green? Human eyes are most sensitive to green.")\nprint("This formula matches how we actually perceive brightness.")`,
          hint: 'The weights aren\'t equal because human eyes are more sensitive to green light than red or blue. This is the ITU-R BT.601 standard.',
        },
      ],
    },
    {
      title: 'Counting and measuring — from pixels to answers',
      concept: `Detecting pixels is step one. But a farmer doesn't want to know "3,847 pixels are brown." They want to know "**15% of my field is stressed — the northeast corner needs water.**"

Going from raw pixel counts to useful answers requires:
1. **Count** — how many pixels match your rule
2. **Percentage** — what fraction of the total image
3. **Location** — where in the image are the detections
4. **Area** — if you know the real-world scale (e.g., 1 pixel = 10cm), convert pixel count to square meters

This is the output layer of a computer vision system: the part that turns numbers into decisions a human can act on.`,
      analogy: 'It\'s like the difference between a thermometer and a weather report. The thermometer gives you a number (38°C). The weather report says "it\'s dangerously hot — stay indoors and drink water." Computer vision gives you pixel counts. Your code turns those counts into actionable recommendations.',
      storyConnection: 'When Nila finished her patrol, the result wasn\'t "I ate 347 insects." The result was "the field is safe for another day." Bonti didn\'t need the raw data — she needed the conclusion. A drone system works the same way: process millions of pixels, output one sentence.',
      checkQuestion: 'A 1000×1000 drone image covers a 100m × 100m field. Each pixel represents how much real area?',
      checkAnswer: '100m ÷ 1000 pixels = 0.1m per pixel. Each pixel covers 0.1m × 0.1m = 0.01 square meters (100 cm²). If 5,000 pixels are detected as "stressed", that\'s 5,000 × 0.01 = 50 square meters of stressed crop.',
      codeIntro: 'Analyze a synthetic drone image and generate a field health report.',
      code: `import numpy as np

# Simulate a 200x200 drone image of a paddy field
np.random.seed(42)
field = np.zeros((200, 200, 3), dtype=np.uint8)

# Healthy rice (60% of field)
field[:120, :] = [25, 130, 15]
field[:120, :] += np.random.randint(0, 30, (120, 200, 3), dtype=np.uint8)

# Stressed patch (northeast corner, ~15%)
field[:60, 140:] = [150, 120, 30]
field[:60, 140:] += np.random.randint(0, 20, (60, 60, 3), dtype=np.uint8)

# Soil/bare (bottom, ~25%)
field[120:, :] = [110, 75, 45]
field[120:, :] += np.random.randint(0, 25, (80, 200, 3), dtype=np.uint8)

# Classify each pixel
healthy = (field[:,:,1] > 100) & (field[:,:,0] < 80)
stressed = (field[:,:,1] > 90) & (field[:,:,0] > 100)
bare = (field[:,:,0] > 90) & (field[:,:,1] < 100)

total = 200 * 200
field_size_m2 = 100 * 100  # 100m x 100m real field
px_area = field_size_m2 / total  # m² per pixel

print("=" * 40)
print("  DRONE FIELD HEALTH REPORT")
print("=" * 40)
print(f"  Field size: 100m × 100m ({field_size_m2:,} m²)")
print(f"  Image resolution: 200 × 200 ({total:,} pixels)")
print(f"  Pixel scale: {px_area:.2f} m² per pixel")
print()
print(f"  Healthy crop:  {np.sum(healthy)/total*100:5.1f}%  ({np.sum(healthy)*px_area:,.0f} m²)")
print(f"  Stressed crop: {np.sum(stressed)/total*100:5.1f}%  ({np.sum(stressed)*px_area:,.0f} m²)")
print(f"  Bare soil:     {np.sum(bare)/total*100:5.1f}%  ({np.sum(bare)*px_area:,.0f} m²)")
print()

if np.sum(stressed) / total > 0.1:
    print("  ⚠ WARNING: >10% of field is stressed")
    # Find where stressed pixels are concentrated
    stressed_rows = np.where(stressed)[0]
    stressed_cols = np.where(stressed)[1]
    print(f"  Location: rows {np.min(stressed_rows)}-{np.max(stressed_rows)}, cols {np.min(stressed_cols)}-{np.max(stressed_cols)}")
    print("  Recommendation: Check irrigation in northeast sector")
else:
    print("  ✓ Field health is normal")`,
      challenge: 'Add a "water" category to the report. Modify the field to include a pond in the corner and detect it with blue channel thresholds.',
      successHint: 'You just built a complete drone analysis pipeline: capture image → classify pixels → measure areas → generate report with recommendations. This is real precision agriculture.',
      practice: [
        {
          label: 'Reinforce',
          prompt: 'Change the stress threshold and see how the report changes. What happens if you\'re more strict (red > 130)?',
          starterCode: `import numpy as np\n\nnp.random.seed(42)\nfield = np.zeros((200, 200, 3), dtype=np.uint8)\nfield[:120, :] = [25, 130, 15]  # healthy\nfield[:60, 140:] = [150, 120, 30]  # stressed\nfield[120:, :] = [110, 75, 45]  # soil\n\n# Try different stress thresholds\nfor red_thresh in [100, 120, 140, 160]:\n    stressed = (field[:,:,1] > 90) & (field[:,:,0] > red_thresh)\n    pct = np.sum(stressed) / (200*200) * 100\n    print(f"Red > {red_thresh}: {pct:.1f}% detected as stressed")`,
        },
        {
          label: 'Apply',
          prompt: 'Generate a color-coded map where healthy=green, stressed=yellow, soil=brown.',
          starterCode: `import numpy as np\nimport matplotlib.pyplot as plt\n\nnp.random.seed(42)\nfield = np.zeros((200, 200, 3), dtype=np.uint8)\nfield[:120, :] = [25, 130, 15]\nfield[:60, 140:] = [150, 120, 30]\nfield[120:, :] = [110, 75, 45]\n\nhealthy = (field[:,:,1] > 100) & (field[:,:,0] < 80)\nstressed = (field[:,:,1] > 90) & (field[:,:,0] > 100)\n\n# Create color-coded output\nreport_map = np.zeros((200, 200, 3), dtype=np.uint8)\nreport_map[healthy] = [0, 200, 0]    # green\nreport_map[stressed] = [255, 200, 0]  # yellow\nreport_map[~healthy & ~stressed] = [139, 90, 43]  # brown\n\nfig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4))\nfig.patch.set_facecolor('#1f2937')\nax1.imshow(field)\nax1.set_title('Drone image', color='white')\nax2.imshow(report_map)\nax2.set_title('Health classification', color='white')\nfor ax in [ax1, ax2]: ax.tick_params(colors='gray')\nplt.tight_layout()\nplt.show()`,
        },
        {
          label: 'Challenge',
          prompt: 'A real drone image is 4000×3000. If the field is 200m × 150m, calculate the pixel scale and detect stressed area in m².',
          starterCode: `# No actual image — just the math\nimg_width = 4000  # pixels\nimg_height = 3000\nfield_width = 200  # meters\nfield_height = 150\n\npx_width = field_width / img_width  # meters per pixel (horizontal)\npx_height = field_height / img_height\npx_area = px_width * px_height  # m² per pixel\n\nprint(f"Pixel resolution: {px_width*100:.1f}cm × {px_height*100:.1f}cm")\nprint(f"Pixel area: {px_area*10000:.1f} cm²")\nprint()\n\n# If 450,000 pixels are classified as stressed:\nstressed_pixels = 450_000\nstressed_m2 = stressed_pixels * px_area\nstressed_pct = stressed_pixels / (img_width * img_height) * 100\n\nprint(f"Stressed pixels: {stressed_pixels:,}")\nprint(f"Stressed area: {stressed_m2:,.0f} m² ({stressed_m2/10000:.2f} hectares)")\nprint(f"Stressed percentage: {stressed_pct:.1f}%")`,
          hint: 'A hectare is 10,000 m². Farmers think in hectares, not pixels.',
        },
      ],
    },
    {
      title: 'Edge detection — finding boundaries',
      concept: `So far we've classified pixels by color. But sometimes what matters isn't color — it's **shape**. Where does one thing end and another begin? Where's the edge of the field? The boundary of a pest swarm?

**Edge detection** finds pixels where the image changes sharply — where bright meets dark, or one color meets another. The simplest approach: for each pixel, compare it to its neighbor. If the difference is large, it's an edge.

This is computed using a **kernel** — a small grid of numbers that slides across the image. The Sobel kernel, for example, calculates the difference between left and right neighbors (horizontal edges) or top and bottom (vertical edges). The combined result highlights all boundaries in the image.

Edge detection is used everywhere: in self-driving cars (lane detection), medical imaging (tumor boundaries), and agriculture (field boundary mapping, pest cluster detection).`,
      analogy: 'Run your finger across a table until you reach the edge. You detect the edge not because of what the table looks like, but because of the sudden *change* — flat surface suddenly drops to nothing. Edge detection in images works the same way: it finds where pixel values change suddenly.',
      storyConnection: 'Nila didn\'t just see colors — she detected motion, boundaries, and shapes. When a stem borer sits on a rice stalk, its body creates an edge against the green background. Nila\'s brain detected that edge and swooped in. Edge detection is the computational version of her hunting instinct.',
      checkQuestion: 'In a smooth gradient (slowly changing from dark to light), would edge detection find any edges?',
      checkAnswer: 'No, or very faint ones. Edge detection responds to *sudden* changes, not gradual ones. A smooth gradient has small pixel-to-pixel differences. A sharp boundary (e.g., a leaf against sky) has large differences. That\'s the whole point — edges are where things change abruptly.',
      codeIntro: 'Apply edge detection to a synthetic paddy field image.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Create a field with clear boundaries
np.random.seed(42)
field = np.zeros((100, 100), dtype=np.float32)

# Rice patches (bright)
field[10:40, 10:45] = 0.8
field[50:85, 30:70] = 0.7
field[20:50, 60:90] = 0.9

# Add some noise
field += np.random.normal(0, 0.05, field.shape)

# Simple edge detection: difference from neighbors
# Horizontal edges (left-right difference)
edges_h = np.abs(np.diff(field, axis=1))
# Vertical edges (top-bottom difference)
edges_v = np.abs(np.diff(field, axis=0))

# Combine (pad to same size)
edges_h_padded = np.pad(edges_h, ((0,0),(0,1)))
edges_v_padded = np.pad(edges_v, ((0,1),(0,0)))
edges = np.sqrt(edges_h_padded**2 + edges_v_padded**2)

fig, axes = plt.subplots(1, 3, figsize=(12, 4))
fig.patch.set_facecolor('#1f2937')

axes[0].imshow(field, cmap='Greens', vmin=0, vmax=1)
axes[0].set_title('Paddy field (grayscale)', color='white', fontsize=9)

axes[1].imshow(edges, cmap='hot', vmin=0, vmax=0.5)
axes[1].set_title('Edges detected', color='white', fontsize=9)

# Threshold the edges to get clean boundaries
clean_edges = edges > 0.15
axes[2].imshow(clean_edges, cmap='gray')
axes[2].set_title('Clean boundaries', color='white', fontsize=9)

for ax in axes:
    ax.tick_params(colors='gray', labelsize=6)

plt.tight_layout()
plt.show()

print("np.diff() computes the difference between neighboring pixels")
print("Large difference = edge (boundary between regions)")
print("Small difference = smooth area (inside a region)")`,
      challenge: 'Change the edge threshold from 0.15 to 0.05 — you\'ll see more edges (including noise). Then try 0.3 — only the strongest edges survive. Same sensitivity trade-off as before.',
      successHint: 'Edge detection + color thresholds together give you both what something is (color) and where it is (edges). Level 2 combines these into a real classifier.',
      practice: [
        {
          label: 'Reinforce',
          prompt: 'Apply edge detection to just the horizontal direction (np.diff along axis=1). What does it show?',
          starterCode: `import numpy as np\nimport matplotlib.pyplot as plt\n\nfield = np.zeros((100, 100), dtype=np.float32)\nfield[20:60, 20:80] = 0.8  # one big rectangle\n\nedges_h = np.abs(np.diff(field, axis=1))\n\nfig, (ax1, ax2) = plt.subplots(1, 2, figsize=(8, 4))\nfig.patch.set_facecolor('#1f2937')\nax1.imshow(field, cmap='Greens')\nax1.set_title('Original', color='white')\nax2.imshow(edges_h, cmap='hot')\nax2.set_title('Horizontal edges only', color='white')\nfor ax in [ax1, ax2]: ax.tick_params(colors='gray')\nplt.tight_layout()\nplt.show()\n\nprint("Only the LEFT and RIGHT edges are detected")\nprint("Top and bottom edges are horizontal = no left-right change")`,
        },
        {
          label: 'Apply',
          prompt: 'Count how many edge pixels exist — this tells you how complex the shape is.',
          starterCode: `import numpy as np\n\n# Simple square\nsquare = np.zeros((100, 100), dtype=np.float32)\nsquare[20:80, 20:80] = 1.0\n\n# Complex shape (many small patches)\ncomplex_shape = np.zeros((100, 100), dtype=np.float32)\nfor _ in range(20):\n    x, y = np.random.randint(5, 90, 2)\n    s = np.random.randint(3, 10)\n    complex_shape[y:y+s, x:x+s] = 1.0\n\nfor name, img in [("Square", square), ("Complex", complex_shape)]:\n    eh = np.abs(np.diff(img, axis=1))\n    ev = np.abs(np.diff(img, axis=0))\n    edges = np.sqrt(np.pad(eh,((0,0),(0,1)))**2 + np.pad(ev,((0,1),(0,0)))**2)\n    edge_count = np.sum(edges > 0.3)\n    print(f"{name}: {edge_count} edge pixels (complexity)")`,
          hint: 'More edge pixels = more complex boundary. This metric can detect pest swarm clusters vs. uniform healthy crop.',
        },
        {
          label: 'Challenge',
          prompt: 'Combine edge detection with color detection: find the edges of healthy green patches specifically.',
          starterCode: `import numpy as np\nimport matplotlib.pyplot as plt\n\nnp.random.seed(42)\nfield = np.zeros((100, 100, 3), dtype=np.uint8)\nfield[10:40, 10:45] = [20, 150, 15]  # green patch 1\nfield[50:85, 30:70] = [130, 80, 40]  # brown soil\nfield[20:50, 60:90] = [25, 140, 20]  # green patch 2\n\n# Step 1: detect green pixels\ngreen_mask = (field[:,:,1] > 100) & (field[:,:,0] < 80)\n\n# Step 2: find edges of the green mask\neh = np.abs(np.diff(green_mask.astype(float), axis=1))\nev = np.abs(np.diff(green_mask.astype(float), axis=0))\nedges = np.sqrt(np.pad(eh,((0,0),(0,1)))**2 + np.pad(ev,((0,1),(0,0)))**2) > 0.3\n\nfig, axes = plt.subplots(1, 3, figsize=(12, 4))\nfig.patch.set_facecolor('#1f2937')\naxes[0].imshow(field)\naxes[0].set_title('Original', color='white')\naxes[1].imshow(green_mask, cmap='Greens')\naxes[1].set_title('Green detection', color='white')\naxes[2].imshow(edges, cmap='gray')\naxes[2].set_title('Green patch boundaries', color='white')\nfor ax in axes: ax.tick_params(colors='gray')\nplt.tight_layout()\nplt.show()`,
          hint: 'Edge detection on a binary mask gives you the outline of detected regions — this is how drones map field boundaries.',
        },
      ],
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" />
          Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">No coding experience needed</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises run real Python in your browser. Click below to start — it takes about 10 seconds to load.
          </p>
          <button
            onClick={loadPyodide}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors"
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>
            ) : (
              <><Sparkles className="w-5 h-5" />Load Python Environment</>
            )}
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
            practice={lesson.practice}
           
           
           
          />
        ))}
      </div>
    </div>
  );
}
