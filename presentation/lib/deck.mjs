import { theme } from '../config.mjs';

export const SLIDE_W = 13.333;
export const SLIDE_H = 7.5;

export class Slide {
  constructor(transition = 'fade', bg = theme.bg) {
    this.transition = transition;
    this.bg = bg;
    this.items = [];
  }

  shape(shape, opts) {
    this.items.push({ kind: 'shape', shape, ...opts });
    return this;
  }

  text(text, opts) {
    this.items.push({ kind: 'text', text, ...opts });
    return this;
  }

  image(opts) {
    this.items.push({ kind: 'image', ...opts });
    return this;
  }
}

export class Deck {
  constructor() {
    this.slides = [];
  }

  add(transition = 'fade', bg = theme.bg) {
    const s = new Slide(transition, bg);
    this.slides.push(s);
    return s;
  }
}

export const anim = (step, effect = 'fade', delay = 0, click = false) => ({ step, effect, delay, click });

// ---------------------------------------------------------------- components

export function backdrop(s, { glow = true, grid = true } = {}) {
  s.shape('rect', { x: 0, y: 0, w: SLIDE_W, h: SLIDE_H, fill: { color: s.bg } });

  if (glow) {
    s.shape('ellipse', {
      x: SLIDE_W - 4.2,
      y: -2.6,
      w: 7.4,
      h: 7.4,
      fill: { color: theme.accent, transparency: 90 },
    });
    s.shape('ellipse', {
      x: -3.2,
      y: SLIDE_H - 3.6,
      w: 6.8,
      h: 6.8,
      fill: { color: theme.gold, transparency: 92 },
    });
  }

  if (grid) {
    s.shape('rect', { x: 0, y: 0, w: SLIDE_W, h: 0.09, fill: { color: theme.gold } });
    s.shape('rect', { x: 0, y: SLIDE_H - 0.055, w: SLIDE_W, h: 0.055, fill: { color: theme.accent } });
  }
}

export function heading(s, { kicker, title, step = 1 }) {
  if (kicker) {
    s.text(kicker, {
      x: 0.75,
      y: 0.5,
      w: 11.8,
      h: 0.36,
      fontSize: 13,
      bold: true,
      color: theme.gold,
      charSpacing: 3.5,
      anim: anim(step, 'flyleft', 0),
    });
  }
  s.text(title, {
    x: 0.75,
    y: 0.86,
    w: 11.8,
    h: 0.78,
    fontSize: 36,
    bold: true,
    color: theme.white,
    anim: anim(step, 'floatup', 120),
  });
  s.shape('rect', {
    x: 0.78,
    y: 1.7,
    w: 1.9,
    h: 0.07,
    fill: { color: theme.accent },
    anim: anim(step, 'wiperight', 260),
  });
}

export function footer(s, { left, right, step = 1 }) {
  if (left) {
    s.text(left, {
      x: 0.75,
      y: SLIDE_H - 0.72,
      w: 7.5,
      h: 0.34,
      fontSize: 10.5,
      color: theme.muted,
      charSpacing: 1.4,
      anim: anim(step, 'fadefast', 0),
    });
  }
  if (right) {
    s.text(right, {
      x: SLIDE_W - 5.05,
      y: SLIDE_H - 0.72,
      w: 4.3,
      h: 0.34,
      fontSize: 10.5,
      color: theme.muted,
      align: 'right',
      charSpacing: 1.4,
      anim: anim(step, 'fadefast', 0),
    });
  }
}

const CONFETTI_SHAPES = ['rect', 'ellipse', 'triangle', 'star5', 'diamond'];
const CONFETTI_COLORS = [theme.gold, theme.accent, theme.accentSoft, theme.goldSoft, 'FFFFFF', '60A5FA'];

// Deterministic pseudo-random so every rebuild produces the same deck.
function rng(seed) {
  let x = seed;
  return () => {
    x = (x * 1103515245 + 12345) & 0x7fffffff;
    return x / 0x7fffffff;
  };
}

export function confetti(
  s,
  { count = 26, step = 2, seed = 7, band = 3.1, top = 0.18, xMin = 0.3, xMax = SLIDE_W - 0.6, spread = 120 } = {}
) {
  const r = rng(seed);
  for (let i = 0; i < count; i++) {
    const shape = CONFETTI_SHAPES[Math.floor(r() * CONFETTI_SHAPES.length)];
    const size = 0.1 + r() * 0.19;
    s.shape(shape, {
      x: xMin + r() * Math.max(0.1, xMax - xMin),
      y: top + r() * band,
      w: size,
      h: shape === 'rect' ? size * 0.5 : size,
      rotate: Math.floor(r() * 360),
      fill: { color: CONFETTI_COLORS[Math.floor(r() * CONFETTI_COLORS.length)], transparency: 12 },
      anim: anim(step, 'drop', Math.round(i * (spread / 2) + r() * spread)),
    });
  }
}

export function trophy(s, { cx, y, step = 3, scale = 1 } = {}) {
  const k = (v) => v * scale;
  const g = theme.gold;
  const gd = theme.goldDark;

  s.shape('star8', {
    x: cx - k(2.35),
    y: y - k(0.55),
    w: k(4.7),
    h: k(4.7),
    fill: { color: theme.gold, transparency: 78 },
    anim: anim(step, 'spin', 0),
  });
  s.shape('ellipse', {
    x: cx - k(1.55),
    y: y + k(0.05),
    w: k(3.1),
    h: k(3.1),
    fill: { color: theme.accent, transparency: 68 },
    anim: anim(step, 'zoom', 60),
  });

  s.shape('donut', {
    x: cx - k(1.16),
    y: y + k(0.34),
    w: k(0.62),
    h: k(0.8),
    fill: { color: gd },
    anim: anim(step, 'flyleft', 180),
  });
  s.shape('donut', {
    x: cx + k(0.54),
    y: y + k(0.34),
    w: k(0.62),
    h: k(0.8),
    fill: { color: gd },
    anim: anim(step, 'flyright', 180),
  });

  s.shape('trapezoid', {
    x: cx - k(0.8),
    y: y + k(0.3),
    w: k(1.6),
    h: k(1.2),
    flipV: true,
    fill: { color: g },
    anim: anim(step, 'zoom', 120),
  });
  s.shape('roundRect', {
    x: cx - k(0.95),
    y: y + k(0.2),
    w: k(1.9),
    h: k(0.24),
    rectRadius: 0.1,
    fill: { color: theme.goldSoft },
    anim: anim(step, 'zoom', 140),
  });
  s.shape('star5', {
    x: cx - k(0.28),
    y: y + k(0.6),
    w: k(0.56),
    h: k(0.56),
    fill: { color: '8A5A00' },
    anim: anim(step, 'spin', 320),
  });

  s.shape('rect', {
    x: cx - k(0.17),
    y: y + k(1.48),
    w: k(0.34),
    h: k(0.4),
    fill: { color: gd },
    anim: anim(step, 'wipeup', 200),
  });
  s.shape('trapezoid', {
    x: cx - k(0.5),
    y: y + k(1.86),
    w: k(1.0),
    h: k(0.28),
    fill: { color: g },
    anim: anim(step, 'wipeup', 240),
  });
  s.shape('roundRect', {
    x: cx - k(0.78),
    y: y + k(2.12),
    w: k(1.56),
    h: k(0.24),
    rectRadius: 0.08,
    fill: { color: gd },
    anim: anim(step, 'wipeup', 280),
  });
}

// Three-step podium with the current place lit up; fills the right side of the
// runner-up / third-place slides.
export function podiumBars(s, { place, step = 4, x0 = 9.35, baseline = 5.68 } = {}) {
  const bars = [
    { n: 2, h: 1.62, color: theme.silver },
    { n: 1, h: 2.24, color: theme.gold },
    { n: 3, h: 1.18, color: theme.bronze },
  ];
  const w = 0.92;
  const gap = 0.18;

  s.shape('rect', {
    x: x0 - 0.18,
    y: baseline,
    w: bars.length * w + (bars.length - 1) * gap + 0.36,
    h: 0.05,
    fill: { color: theme.line },
    anim: anim(step, 'wiperight', 0),
  });

  bars.forEach((b, i) => {
    const on = b.n === place;
    const x = x0 + i * (w + gap);
    s.shape('rect', {
      x,
      y: baseline - b.h,
      w,
      h: b.h,
      fill: { color: b.color, transparency: on ? 0 : 78 },
      anim: anim(step, 'wipeup', 120 + i * 130),
    });
    s.text(String(b.n), {
      x,
      y: baseline - b.h + 0.12,
      w,
      h: 0.5,
      align: 'center',
      fontSize: 19,
      bold: true,
      color: on ? '15100A' : theme.muted,
      anim: anim(step, 'fade', 220 + i * 130),
    });
  });
}

export function initialsOf(name) {
  const clean = name.replace(/\([^)]*\)/g, '').trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function cleanName(name) {
  return name.replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim();
}

export function isLead(name) {
  return /team lead/i.test(name);
}

export function memberCard(s, member, { x, y, w, h, step, delay = 0, effect = 'flyup', photo, accent }) {
  const ring = accent ?? theme.gold;
  const av = h - 0.44;

  s.shape('roundRect', {
    x,
    y,
    w,
    h,
    rectRadius: 0.12,
    fill: { color: theme.card },
    line: { color: theme.line, width: 1 },
    anim: anim(step, effect, delay),
  });
  s.shape('rect', {
    x,
    y: y + 0.16,
    w: 0.075,
    h: h - 0.32,
    fill: { color: ring },
    anim: anim(step, effect, delay + 30),
  });

  const avX = x + 0.3;
  const avY = y + 0.22;
  if (photo) {
    s.image({
      path: photo,
      x: avX,
      y: avY,
      w: av,
      h: av,
      rounding: true,
      sizing: { type: 'cover', w: av, h: av },
      anim: anim(step, 'zoom', delay + 60),
    });
    s.shape('ellipse', {
      x: avX - 0.05,
      y: avY - 0.05,
      w: av + 0.1,
      h: av + 0.1,
      fill: { color: 'FFFFFF', transparency: 100 },
      line: { color: ring, width: 2 },
      anim: anim(step, 'zoom', delay + 60),
    });
  } else {
    s.shape('ellipse', {
      x: avX,
      y: avY,
      w: av,
      h: av,
      fill: { color: theme.cardAlt },
      line: { color: ring, width: 2 },
      anim: anim(step, 'zoom', delay + 60),
    });
    s.text(initialsOf(member.name), {
      x: avX,
      y: avY,
      w: av,
      h: av,
      align: 'center',
      valign: 'middle',
      fontSize: 15,
      bold: true,
      color: theme.goldSoft,
      anim: anim(step, 'zoom', delay + 60),
    });
  }

  const tx = avX + av + 0.26;
  const tw = w - (tx - x) - 0.28;
  const lead = isLead(member.name);

  s.text(cleanName(member.name), {
    x: tx,
    y: y + 0.24,
    w: tw,
    h: 0.38,
    fontSize: 16.5,
    bold: true,
    color: theme.white,
    anim: anim(step, effect, delay + 80),
  });
  s.text(lead ? 'TEAM LEAD' : 'TEAM MEMBER', {
    x: tx,
    y: y + 0.62,
    w: tw,
    h: 0.26,
    fontSize: 9,
    bold: true,
    charSpacing: 2,
    color: lead ? theme.gold : theme.muted,
    anim: anim(step, effect, delay + 100),
  });
  s.text(member.college, {
    x: tx,
    y: y + 0.87,
    w: tw,
    h: 0.42,
    fontSize: 11,
    color: theme.silver,
    anim: anim(step, effect, delay + 120),
  });
}

// Compact avatar + name row, used where a full member card grid is too heavy.
export function memberChips(s, members, { y, step, delay = 0, accent, size = 0.78, centerX = SLIDE_W / 2 }) {
  const ring = accent ?? theme.gold;
  const gap = 0.55;
  const total = members.length * size + (members.length - 1) * gap;
  const x0 = centerX - total / 2;

  members.forEach((m, i) => {
    const x = x0 + i * (size + gap);
    const d = delay + i * 120;
    s.shape('ellipse', {
      x,
      y,
      w: size,
      h: size,
      fill: { color: theme.card },
      line: { color: ring, width: 2 },
      anim: anim(step, 'zoom', d),
    });
    s.text(initialsOf(m.name), {
      x,
      y,
      w: size,
      h: size,
      align: 'center',
      valign: 'middle',
      fontSize: 13,
      bold: true,
      color: ring,
      anim: anim(step, 'zoom', d),
    });
    s.text(cleanName(m.name), {
      x: x - (gap + 0.1) / 2,
      y: y + size + 0.1,
      w: size + gap + 0.1,
      h: 0.5,
      align: 'center',
      fontSize: 9.5,
      color: isLead(m.name) ? theme.goldSoft : theme.silver,
      anim: anim(step, 'fade', d + 60),
    });
  });
}

// Member cards laid out to fit whatever team size we are given (2-4 typical).
export function memberGrid(s, members, { step, top = 2.55, effect = 'flyup', photos = {}, accent } = {}) {
  const n = members.length;
  const two = n >= 4;
  const cols = two ? 2 : 1;
  const w = two ? 5.72 : 8.6;
  const x0 = two ? 0.72 : (SLIDE_W - w) / 2;
  const gapX = 6.17;
  const rows = Math.ceil(n / cols);
  const avail = SLIDE_H - top - 0.95;
  const h = Math.min(1.55, (avail - (rows - 1) * 0.22) / rows);
  const gapY = h + 0.22;

  members.forEach((m, i) => {
    const col = two ? i % 2 : 0;
    const row = two ? Math.floor(i / 2) : i;
    memberCard(s, m, {
      x: x0 + col * gapX,
      y: top + row * gapY,
      w,
      h,
      step,
      delay: i * 150,
      effect,
      photo: photos[cleanName(m.name)],
      accent,
    });
  });
}
