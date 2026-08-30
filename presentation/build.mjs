import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { awards, memberPhotos, extraTeams, options, theme } from './config.mjs';
import {
  Deck,
  SLIDE_W,
  SLIDE_H,
  anim,
  backdrop,
  heading,
  footer,
  confetti,
  trophy,
  memberGrid,
  memberChips,
  podiumBars,
  cleanName,
} from './lib/deck.mjs';
import { renderPptx } from './lib/render-pptx.mjs';
import { renderHtml } from './lib/render-html.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(here, '..');

const event = JSON.parse(fs.readFileSync(path.join(projectRoot, 'src/data/hackathon.json'), 'utf8'));
const roster = JSON.parse(
  fs.readFileSync(path.join(projectRoot, 'src/data/hackathon-venue-teams.json'), 'utf8')
);

const EVENT_NAME = 'TigmaMinds Academy Hackathon 2026';

// ------------------------------------------------------------------ data prep

function findTeam(name) {
  if (!name) return null;
  const key = String(name).trim().toLowerCase();
  const hit = roster.find((t) => t.teamName.trim().toLowerCase() === key);
  if (hit) return hit;
  const extra = Object.entries(extraTeams).find(([k]) => k.trim().toLowerCase() === key);
  if (extra) return { teamName: extra[0], members: extra[1] };
  return null;
}

function resolveAward(entry, role) {
  if (!entry?.team) return null;
  const team = findTeam(entry.team);
  if (!team) {
    const known = roster.map((t) => t.teamName).join(', ');
    throw new Error(
      `${role}: team "${entry.team}" is not in hackathon-venue-teams.json.\n` +
        `Either fix the spelling or add it to extraTeams in config.mjs.\nKnown teams: ${known}`
    );
  }
  const colleges = [...new Set(team.members.map((m) => m.college))];
  return {
    ...entry,
    teamName: team.teamName,
    members: team.members,
    college: colleges.length === 1 ? colleges[0] : colleges.join(' · '),
    names: team.members.map((m) => cleanName(m.name)).join('  ·  '),
  };
}

const winner = resolveAward(awards.winner, 'winner');
const runnerUp = resolveAward(awards.runnerUp, 'runnerUp');
const third = resolveAward(awards.secondRunnerUp, 'secondRunnerUp');

if (!winner) throw new Error('config.mjs: awards.winner.team is required.');

const stats = {
  teams: roster.length,
  builders: roster.reduce((n, t) => n + t.members.length, 0),
  colleges: new Set(roster.flatMap((t) => t.members.map((m) => m.college))).size,
};

function asset(rel) {
  if (!rel) return '';
  const abs = path.resolve(here, rel);
  return fs.existsSync(abs) ? abs : '';
}

const logo = asset(options.logo);
const photos = Object.fromEntries(
  Object.entries(memberPhotos)
    .map(([name, rel]) => [cleanName(name), asset(rel)])
    .filter(([, p]) => p)
);

const missingPhotos = Object.entries(memberPhotos).filter(([, rel]) => !asset(rel));

// -------------------------------------------------------------------- slides

const deck = new Deck();
const revealClick = options.clickToReveal;

function titleSlide() {
  const s = deck.add('fade');
  backdrop(s, { glow: true, grid: true });
  confetti(s, { count: 22, step: 4, seed: 11, top: 0.2, band: 1.55, spread: 90 });

  if (logo) {
    s.image({
      path: logo,
      x: (SLIDE_W - 1.35) / 2,
      y: 0.78,
      w: 1.35,
      h: 1.35,
      sizing: { type: 'contain', w: 1.35, h: 1.35 },
      anim: anim(1, 'zoom', 0),
    });
  }

  s.text('TIGMAMINDS ACADEMY', {
    x: 1.5,
    y: 2.26,
    w: SLIDE_W - 3,
    h: 0.38,
    align: 'center',
    fontSize: 15,
    bold: true,
    color: theme.gold,
    charSpacing: 7,
    anim: anim(1, 'fade', 200),
  });
  s.text('HACKATHON 2026', {
    x: 0.8,
    y: 2.66,
    w: SLIDE_W - 1.6,
    h: 1.15,
    align: 'center',
    fontSize: 64,
    bold: true,
    color: theme.white,
    anim: anim(2, 'zoomout', 0),
  });
  s.shape('rect', {
    x: (SLIDE_W - 2.6) / 2,
    y: 3.86,
    w: 2.6,
    h: 0.07,
    fill: { color: theme.accent },
    anim: anim(2, 'wiperight', 260),
  });
  s.text('WINNERS ANNOUNCEMENT', {
    x: 1.2,
    y: 4.06,
    w: SLIDE_W - 2.4,
    h: 0.62,
    align: 'center',
    fontSize: 30,
    bold: true,
    color: theme.gold,
    charSpacing: 5,
    anim: anim(3, 'floatup', 0),
  });
  s.text(`${event.location}   ·   ${event.dates}   ·   In-Person Finale`, {
    x: 1.2,
    y: 4.86,
    w: SLIDE_W - 2.4,
    h: 0.36,
    align: 'center',
    fontSize: 14,
    color: theme.silver,
    charSpacing: 1.6,
    anim: anim(3, 'fade', 200),
  });

  const bw = 4.5;
  s.shape('roundRect', {
    x: (SLIDE_W - bw) / 2,
    y: 5.44,
    w: bw,
    h: 0.66,
    rectRadius: 0.33,
    fill: { color: theme.card },
    line: { color: theme.gold, width: 1.5 },
    anim: anim(3, 'zoom', 340),
  });
  s.text(`PRIZE POOL  ·  ${event.prizePool}`, {
    x: (SLIDE_W - bw) / 2,
    y: 5.44,
    w: bw,
    h: 0.66,
    align: 'center',
    valign: 'middle',
    fontSize: 15,
    bold: true,
    color: theme.goldSoft,
    charSpacing: 2,
    anim: anim(3, 'zoom', 340),
  });

  footer(s, { left: `${stats.teams} teams  ·  ${stats.builders} builders  ·  ${stats.colleges} institutions`, right: options.website, step: 5 });
  return s;
}

function statsSlide() {
  const s = deck.add('pushup');
  backdrop(s);
  heading(s, { kicker: 'THE JOURNEY', title: 'Hackathon 2026 by the numbers' });

  const cards = [
    { v: String(stats.teams), l: 'TEAMS', sub: 'Qualified for the Guwahati finale' },
    { v: String(stats.builders), l: 'BUILDERS', sub: 'Students, freshers and recent passouts' },
    { v: String(stats.colleges), l: 'INSTITUTIONS', sub: 'Universities and colleges represented' },
    { v: '48', l: 'HOURS', sub: 'Non-stop prototype building' },
    { v: '₹1L', l: 'PRIZE POOL', sub: `${event.prizePool} across categories` },
  ];

  const w = 2.34;
  const gap = 0.36;
  const total = cards.length * w + (cards.length - 1) * gap;
  const x0 = (SLIDE_W - total) / 2;
  const y = 2.3;
  const h = 2.28;

  cards.forEach((c, i) => {
    const x = x0 + i * (w + gap);
    const d = i * 130;
    s.shape('roundRect', {
      x,
      y,
      w,
      h,
      rectRadius: 0.14,
      fill: { color: theme.card },
      line: { color: theme.line, width: 1 },
      anim: anim(2, 'flyup', d),
    });
    s.shape('rect', {
      x,
      y,
      w,
      h: 0.1,
      fill: { color: i % 2 ? theme.accent : theme.gold },
      anim: anim(2, 'wiperight', d + 60),
    });
    s.text(c.v, {
      x,
      y: y + 0.32,
      w,
      h: 0.9,
      align: 'center',
      fontSize: 42,
      bold: true,
      color: theme.gold,
      anim: anim(2, 'zoom', d + 120),
    });
    s.text(c.l, {
      x,
      y: y + 1.24,
      w,
      h: 0.3,
      align: 'center',
      fontSize: 12,
      bold: true,
      color: theme.white,
      charSpacing: 2.4,
      anim: anim(2, 'fade', d + 170),
    });
    s.text(c.sub, {
      x: x + 0.2,
      y: y + 1.6,
      w: w - 0.4,
      h: 0.6,
      align: 'center',
      fontSize: 10.5,
      color: theme.muted,
      anim: anim(2, 'fade', d + 210),
    });
  });

  const themes = (event.theme.split(':')[1] ?? '')
    .split(',')
    .map((t) => t.replace(/\bor\b/i, '').replace(/\.\s*$/, '').trim())
    .filter(Boolean);

  if (themes.length) {
    s.text('THE EIGHT QUALIFIER THEMES', {
      x: 0.78,
      y: 4.88,
      w: 8,
      h: 0.3,
      fontSize: 11.5,
      bold: true,
      color: theme.gold,
      charSpacing: 3.5,
      anim: anim(3, 'fade', 0),
    });

    const cols = 4;
    const cw = (11.8 - (cols - 1) * 0.18) / cols;
    themes.forEach((t, i) => {
      const x = 0.78 + (i % cols) * (cw + 0.18);
      const cy = 5.28 + Math.floor(i / cols) * 0.56;
      s.shape('roundRect', {
        x,
        y: cy,
        w: cw,
        h: 0.46,
        rectRadius: 0.23,
        fill: { color: theme.bgAlt },
        line: { color: theme.line, width: 1 },
        anim: anim(3, 'fadefast', 80 + i * 60),
      });
      s.text(t, {
        x: x + 0.12,
        y: cy,
        w: cw - 0.24,
        h: 0.46,
        align: 'center',
        valign: 'middle',
        fontSize: 10.5,
        color: theme.silver,
        anim: anim(3, 'fadefast', 80 + i * 60),
      });
    });
  }

  footer(s, { left: EVENT_NAME, right: 'Guwahati, Assam', step: 4 });
  return s;
}

function judgingSlide() {
  const s = deck.add('wipeup');
  backdrop(s);
  heading(s, { kicker: 'HOW WINNERS WERE DECIDED', title: 'The judging criteria' });

  const rows = event.judgingCriteria;
  const max = Math.max(...rows.map((r) => parseInt(r.weightage, 10)));
  const barX = 5.6;
  const barMax = 5.9;
  const y0 = 2.5;
  const gapY = 0.8;

  rows.forEach((r, i) => {
    const pct = parseInt(r.weightage, 10);
    const y = y0 + i * gapY;
    const d = i * 140;
    s.text(r.criteria, {
      x: 0.85,
      y,
      w: 4.6,
      h: 0.5,
      valign: 'middle',
      fontSize: 17,
      bold: true,
      color: theme.white,
      anim: anim(2, 'flyleft', d),
    });
    s.shape('roundRect', {
      x: barX,
      y: y + 0.13,
      w: barMax,
      h: 0.25,
      rectRadius: 0.125,
      fill: { color: theme.card },
      anim: anim(2, 'fadefast', d),
    });
    s.shape('roundRect', {
      x: barX,
      y: y + 0.13,
      w: barMax * (pct / max),
      h: 0.25,
      rectRadius: 0.125,
      fill: { color: i % 2 ? theme.accent : theme.gold },
      anim: anim(2, 'wiperight', d + 80),
    });
    s.text(r.weightage, {
      x: barX + barMax + 0.24,
      y,
      w: 1.0,
      h: 0.5,
      valign: 'middle',
      align: 'right',
      fontSize: 16,
      bold: true,
      color: theme.goldSoft,
      anim: anim(2, 'fade', d + 140),
    });
  });

  s.text(event.finalEvaluation, {
    x: 0.85,
    y: 6.35,
    w: 11.6,
    h: 0.4,
    fontSize: 12,
    italic: true,
    color: theme.muted,
    anim: anim(3, 'fade', 0),
  });
  return s;
}

function finalistsSlide() {
  const s = deck.add('dissolve');
  backdrop(s, { glow: true, grid: true });
  heading(s, { kicker: 'THE FINALISTS', title: `All ${stats.teams} teams that made it to Guwahati` });

  const cols = 4;
  const w = 2.9;
  const h = 0.66;
  const gapX = 0.18;
  const gapY = 0.17;
  const x0 = (SLIDE_W - (cols * w + (cols - 1) * gapX)) / 2;
  const y0 = 2.35;

  roster.forEach((t, i) => {
    const x = x0 + (i % cols) * (w + gapX);
    const y = y0 + Math.floor(i / cols) * (h + gapY);
    const d = i * 55;
    s.shape('roundRect', {
      x,
      y,
      w,
      h,
      rectRadius: 0.1,
      fill: { color: theme.card },
      line: { color: theme.line, width: 1 },
      anim: anim(2, 'fadefast', d),
    });
    s.shape('ellipse', {
      x: x + 0.22,
      y: y + 0.235,
      w: 0.19,
      h: 0.19,
      fill: { color: i % 2 ? theme.accent : theme.gold },
      anim: anim(2, 'zoom', d + 40),
    });
    s.text(t.teamName, {
      x: x + 0.55,
      y,
      w: w - 1.05,
      h,
      valign: 'middle',
      fontSize: 13,
      bold: true,
      color: theme.white,
      anim: anim(2, 'fadefast', d + 40),
    });
    s.text(`${t.members.length}`, {
      x: x + w - 0.52,
      y,
      w: 0.34,
      h,
      valign: 'middle',
      align: 'right',
      fontSize: 11,
      color: theme.muted,
      anim: anim(2, 'fadefast', d + 60),
    });
  });

  footer(s, { left: 'Every team shipped a working prototype in 48 hours', right: `${stats.builders} builders`, step: 3 });
  return s;
}

function resultsDividerSlide() {
  const s = deck.add('zoomin');
  backdrop(s, { glow: true, grid: true });

  s.text('THE MOMENT OF TRUTH', {
    x: 1.2,
    y: 2.3,
    w: SLIDE_W - 2.4,
    h: 0.4,
    align: 'center',
    fontSize: 15,
    bold: true,
    color: theme.gold,
    charSpacing: 7,
    anim: anim(1, 'fade', 0),
  });
  s.text('THE RESULTS ARE IN', {
    x: 0.8,
    y: 2.78,
    w: SLIDE_W - 1.6,
    h: 1.3,
    align: 'center',
    fontSize: 58,
    bold: true,
    color: theme.white,
    anim: anim(2, 'zoomout', 0),
  });
  s.text(
    'Judged on innovation and creativity, technical implementation, problem-solving and impact,\nfunctionality of the prototype, and the final presentation.',
    {
      x: 2.2,
      y: 4.2,
      w: SLIDE_W - 4.4,
      h: 0.9,
      align: 'center',
      fontSize: 15,
      color: theme.silver,
      lineSpacingMultiple: 1.4,
      anim: anim(3, 'fade', 0),
    }
  );

  const dots = 3;
  const dw = 0.22;
  const dg = 0.16;
  const dx = (SLIDE_W - (dots * dw + (dots - 1) * dg)) / 2;
  for (let i = 0; i < dots; i++) {
    s.shape('ellipse', {
      x: dx + i * (dw + dg),
      y: 5.5,
      w: dw,
      h: dw,
      fill: { color: theme.accent },
      anim: anim(4, 'pop', i * 260),
    });
  }
  return s;
}

function suspenseSlide() {
  const s = deck.add('newsflash');
  backdrop(s, { glow: true, grid: true });
  confetti(s, { count: 14, step: 4, seed: 29, top: 0.25, band: 1.3, spread: 110 });

  s.text('ONE TEAM STOOD ABOVE THE REST', {
    x: 1.2,
    y: 2.45,
    w: SLIDE_W - 2.4,
    h: 0.4,
    align: 'center',
    fontSize: 15,
    bold: true,
    color: theme.silver,
    charSpacing: 6,
    anim: anim(1, 'fade', 0),
  });
  s.text('AND THE WINNER IS…', {
    x: 0.7,
    y: 2.95,
    w: SLIDE_W - 1.4,
    h: 1.5,
    align: 'center',
    fontSize: 62,
    bold: true,
    color: theme.gold,
    anim: anim(2, 'zoom', 0),
  });

  const dots = 3;
  const dw = 0.24;
  const dg = 0.18;
  const dx = (SLIDE_W - (dots * dw + (dots - 1) * dg)) / 2;
  for (let i = 0; i < dots; i++) {
    s.shape('ellipse', {
      x: dx + i * (dw + dg),
      y: 4.75,
      w: dw,
      h: dw,
      fill: { color: theme.white },
      anim: anim(3, 'pop', i * 300),
    });
  }
  return s;
}

function podiumSlide(award, { place, label, accent, medal, transition, rank }) {
  const s = deck.add(transition);
  backdrop(s);
  heading(s, { kicker: `AWARD  ·  ${place}`, title: label });

  const mx = 1.1;
  const my = 2.6;
  const mw = 2.55;

  s.shape('ellipse', {
    x: mx - 0.22,
    y: my - 0.22,
    w: mw + 0.44,
    h: mw + 0.44,
    fill: { color: accent, transparency: 76 },
    anim: anim(2, 'zoom', 0),
  });
  s.shape('ellipse', {
    x: mx,
    y: my,
    w: mw,
    h: mw,
    fill: { color: theme.card },
    line: { color: accent, width: 4 },
    anim: anim(2, 'spin', 60),
  });
  s.text(medal, {
    x: mx,
    y: my,
    w: mw,
    h: mw,
    align: 'center',
    valign: 'middle',
    fontSize: 92,
    bold: true,
    color: accent,
    anim: anim(2, 'zoom', 180),
  });

  const tx = 4.35;
  const tw = SLIDE_W - tx - 0.85;

  s.text('TEAM', {
    x: tx,
    y: 2.72,
    w: tw,
    h: 0.32,
    fontSize: 12.5,
    bold: true,
    color: accent,
    charSpacing: 5,
    anim: anim(3, 'fade', 0),
  });
  s.text(award.teamName, {
    x: tx,
    y: 3.04,
    w: tw,
    h: 1.12,
    fontSize: 46,
    bold: true,
    color: theme.white,
    anim: anim(3, 'zoomout', 120, revealClick),
  });
  s.shape('rect', {
    x: tx + 0.03,
    y: 4.22,
    w: 2.1,
    h: 0.06,
    fill: { color: accent },
    anim: anim(3, 'wiperight', 320),
  });

  let y = 4.46;
  if (award.projectName) {
    s.text(award.projectName, {
      x: tx,
      y,
      w: tw,
      h: 0.42,
      fontSize: 18,
      bold: true,
      color: theme.goldSoft,
      anim: anim(4, 'fade', 0),
    });
    y += 0.46;
  }
  if (award.projectTagline) {
    s.text(award.projectTagline, {
      x: tx,
      y,
      w: tw,
      h: 0.4,
      fontSize: 13,
      italic: true,
      color: theme.muted,
      anim: anim(4, 'fade', 80),
    });
    y += 0.44;
  }
  s.text(award.college, {
    x: tx,
    y,
    w: tw,
    h: 0.38,
    fontSize: 14,
    color: theme.silver,
    anim: anim(4, 'fade', 120),
  });

  s.text('TEAM MEMBERS', {
    x: tx,
    y: 4.98,
    w: tw,
    h: 0.28,
    fontSize: 10.5,
    bold: true,
    color: theme.muted,
    charSpacing: 3,
    anim: anim(5, 'fade', 0),
  });
  memberChips(s, award.members, { y: 5.34, step: 5, delay: 60, accent, centerX: tx + 2.45 });

  podiumBars(s, { place: rank, step: 6 });

  footer(s, { left: EVENT_NAME, right: `${place} · Guwahati Finale`, step: 7 });
  return s;
}

function winnerSlide() {
  const s = deck.add('zoomin');
  backdrop(s, { glow: true, grid: true });
  confetti(s, { count: 14, step: 5, seed: 3, top: 0.3, band: 5.85, xMin: 0.22, xMax: 1.35, spread: 130 });
  confetti(s, { count: 14, step: 5, seed: 17, top: 0.3, band: 5.85, xMin: 12.35, xMax: 13.0, spread: 130 });
  confetti(s, { count: 12, step: 5, seed: 41, top: 0.22, band: 0.85, xMin: 2.2, xMax: 12.0, spread: 110 });

  trophy(s, { cx: 3.15, y: 1.55, step: 2, scale: 1.02 });

  const tx = 6.15;
  const tw = SLIDE_W - tx - 1.2;

  s.text('CHAMPIONS  ·  HACKATHON 2026', {
    x: tx,
    y: 1.95,
    w: tw,
    h: 0.36,
    fontSize: 13.5,
    bold: true,
    color: theme.gold,
    charSpacing: 5,
    anim: anim(3, 'fade', 0),
  });
  s.text('WINNER', {
    x: tx,
    y: 2.28,
    w: tw,
    h: 0.66,
    fontSize: 26,
    bold: true,
    color: theme.goldSoft,
    charSpacing: 9,
    anim: anim(3, 'wiperight', 150),
  });
  s.text(winner.teamName, {
    x: tx,
    y: 2.98,
    w: tw,
    h: 1.35,
    fontSize: 50,
    bold: true,
    color: theme.white,
    anim: anim(4, 'zoomout', 0, revealClick),
  });
  s.shape('rect', {
    x: tx + 0.03,
    y: 4.36,
    w: 2.4,
    h: 0.07,
    fill: { color: theme.accent },
    anim: anim(4, 'wiperight', 260),
  });

  let y = 4.6;
  if (winner.projectName) {
    s.text(winner.projectName, {
      x: tx,
      y,
      w: tw,
      h: 0.44,
      fontSize: 19,
      bold: true,
      color: theme.goldSoft,
      anim: anim(6, 'fade', 0),
    });
    y += 0.48;
  }
  if (winner.projectTagline) {
    s.text(winner.projectTagline, {
      x: tx,
      y,
      w: tw,
      h: 0.4,
      fontSize: 13,
      italic: true,
      color: theme.muted,
      anim: anim(6, 'fade', 80),
    });
    y += 0.44;
  }
  s.text(winner.college, {
    x: tx,
    y,
    w: tw,
    h: 0.38,
    fontSize: 14.5,
    color: theme.silver,
    anim: anim(6, 'fade', 120),
  });
  s.text(winner.names, {
    x: tx,
    y: y + 0.42,
    w: tw,
    h: 0.75,
    fontSize: 12.5,
    color: theme.muted,
    anim: anim(6, 'fade', 200),
  });

  const bw = 3.5;
  s.shape('roundRect', {
    x: tx,
    y: 6.06,
    w: bw,
    h: 0.62,
    rectRadius: 0.31,
    fill: { color: theme.gold },
    anim: anim(6, 'pop', 320),
  });
  s.text('FIRST PLACE', {
    x: tx,
    y: 6.06,
    w: bw,
    h: 0.62,
    align: 'center',
    valign: 'middle',
    fontSize: 15,
    bold: true,
    color: '1A1203',
    charSpacing: 4,
    anim: anim(6, 'pop', 320),
  });

  const photo = asset(winner.photo);
  if (photo) {
    s.image({
      path: photo,
      x: 1.3,
      y: 4.55,
      w: 3.7,
      h: 1.95,
      sizing: { type: 'cover', w: 3.7, h: 1.95 },
      anim: anim(6, 'floatup', 0),
    });
    s.shape('rect', {
      x: 1.3,
      y: 4.55,
      w: 3.7,
      h: 0.06,
      fill: { color: theme.gold },
      anim: anim(6, 'wiperight', 120),
    });
  } else {
    s.text(`${stats.teams} teams  ·  48 hours  ·  1 champion`, {
      x: 0.9,
      y: 4.62,
      w: 4.5,
      h: 0.4,
      align: 'center',
      fontSize: 13,
      bold: true,
      color: theme.goldSoft,
      charSpacing: 2.2,
      anim: anim(6, 'fade', 400),
    });
    s.text(`${event.location}  ·  ${event.dates}`, {
      x: 0.9,
      y: 5.02,
      w: 4.5,
      h: 0.36,
      align: 'center',
      fontSize: 11.5,
      color: theme.muted,
      anim: anim(6, 'fade', 460),
    });
  }
  return s;
}

function teamSlide(award, { kicker, accent, transition, top = 2.55 }) {
  const s = deck.add(transition);
  backdrop(s);
  heading(s, { kicker, title: award.teamName });
  memberGrid(s, award.members, { step: 2, top, effect: 'flyup', photos, accent });
  footer(s, {
    left: award.college,
    right: `${award.members.length} members`,
    step: 3,
  });
  return s;
}

function specialMentionSlide(sm) {
  const s = deck.add('splitv');
  backdrop(s);
  heading(s, { kicker: 'SPECIAL RECOGNITION', title: sm.title ?? 'Special Award' });

  const bw = 8.6;
  const bx = (SLIDE_W - bw) / 2;
  s.shape('roundRect', {
    x: bx,
    y: 2.85,
    w: bw,
    h: 2.1,
    rectRadius: 0.18,
    fill: { color: theme.card },
    line: { color: theme.accent, width: 2 },
    anim: anim(2, 'zoom', 0),
  });
  s.text(sm.team, {
    x: bx,
    y: 3.1,
    w: bw,
    h: 1.0,
    align: 'center',
    fontSize: 42,
    bold: true,
    color: theme.white,
    anim: anim(2, 'zoomout', 150, revealClick),
  });
  const t = findTeam(sm.team);
  if (t) {
    s.text(t.members.map((m) => cleanName(m.name)).join('  ·  '), {
      x: bx + 0.4,
      y: 4.16,
      w: bw - 0.8,
      h: 0.6,
      align: 'center',
      fontSize: 13,
      color: theme.silver,
      anim: anim(3, 'fade', 0),
    });
  }
  footer(s, { left: EVENT_NAME, right: 'Special Award', step: 4 });
  return s;
}

function thankYouSlide() {
  const s = deck.add('fade');
  backdrop(s, { glow: true, grid: true });
  confetti(s, { count: 20, step: 4, seed: 61, top: 0.25, band: 1.5, spread: 100 });

  if (logo) {
    s.image({
      path: logo,
      x: (SLIDE_W - 1.1) / 2,
      y: 0.95,
      w: 1.1,
      h: 1.1,
      sizing: { type: 'contain', w: 1.1, h: 1.1 },
      anim: anim(1, 'zoom', 0),
    });
  }

  s.text('Congratulations!', {
    x: 0.8,
    y: 2.35,
    w: SLIDE_W - 1.6,
    h: 1.05,
    align: 'center',
    fontSize: 52,
    bold: true,
    color: theme.gold,
    anim: anim(2, 'zoomout', 0),
  });
  s.text(
    `To all ${stats.builders} builders from ${stats.colleges} institutions who spent 48 hours turning an idea\ninto a working prototype — thank you for making Hackathon 2026 what it was.`,
    {
      x: 2.1,
      y: 3.55,
      w: SLIDE_W - 4.2,
      h: 1.0,
      align: 'center',
      fontSize: 16,
      color: theme.silver,
      lineSpacingMultiple: 1.4,
      anim: anim(3, 'fade', 0),
    }
  );

  const chips = ['Participation certificates for all', 'Mentor appreciation certificates', 'Goodies & mentorship'];
  const cw = 3.65;
  const cg = 0.3;
  const cx0 = (SLIDE_W - (chips.length * cw + (chips.length - 1) * cg)) / 2;
  chips.forEach((c, i) => {
    const x = cx0 + i * (cw + cg);
    s.shape('roundRect', {
      x,
      y: 4.85,
      w: cw,
      h: 0.66,
      rectRadius: 0.33,
      fill: { color: theme.card },
      line: { color: theme.line, width: 1 },
      anim: anim(3, 'flyup', 200 + i * 140),
    });
    s.text(c, {
      x,
      y: 4.85,
      w: cw,
      h: 0.66,
      align: 'center',
      valign: 'middle',
      fontSize: 12.5,
      color: theme.goldSoft,
      anim: anim(3, 'flyup', 200 + i * 140),
    });
  });

  s.text(`${options.contactEmail}   ·   ${options.website}`, {
    x: 1.2,
    y: 6.0,
    w: SLIDE_W - 2.4,
    h: 0.4,
    align: 'center',
    fontSize: 13.5,
    color: theme.muted,
    charSpacing: 2,
    anim: anim(5, 'fade', 0),
  });
  return s;
}

// ------------------------------------------------------------------- assemble

titleSlide();
if (options.includeStatsSlide) statsSlide();
if (options.includeJudgingSlide) judgingSlide();
if (options.includeAllTeamsSlide) finalistsSlide();
if (options.includeSuspenseSlides) resultsDividerSlide();

if (third) {
  podiumSlide(third, {
    place: 'THIRD PLACE',
    label: '2nd Runner-Up',
    accent: theme.bronze,
    medal: '3',
    transition: 'coverup',
    rank: 3,
  });
  teamSlide(third, { kicker: 'THE TEAM', accent: theme.bronze, transition: 'pushleft' });
}

if (runnerUp) {
  podiumSlide(runnerUp, {
    place: 'SECOND PLACE',
    label: 'Runner-Up',
    accent: theme.silver,
    medal: '2',
    transition: 'coverup',
    rank: 2,
  });
  teamSlide(runnerUp, { kicker: 'THE RUNNER-UP TEAM', accent: theme.silver, transition: 'pushleft' });
}

if (options.includeSuspenseSlides) suspenseSlide();
winnerSlide();
teamSlide(winner, { kicker: 'MEET THE CHAMPIONS', accent: theme.gold, transition: 'pushleft' });

if (awards.specialMention?.team) specialMentionSlide(awards.specialMention);
if (options.includeThankYouSlide) thankYouSlide();

// -------------------------------------------------------------------- outputs

const outDir = path.join(here, 'out');
fs.mkdirSync(outDir, { recursive: true });

const meta = {
  title: `${EVENT_NAME} — Winners`,
  subject: `Winner announcement: ${winner.teamName}`,
  author: event.organizedBy,
};

const { buffer, report } = await renderPptx(deck, meta);
const pptxPath = path.join(outDir, `${options.outputName}.pptx`);
fs.writeFileSync(pptxPath, buffer);

let htmlPath = '';
if (options.buildHtmlPreview) {
  htmlPath = path.join(outDir, `${options.outputName}.html`);
  fs.writeFileSync(htmlPath, renderHtml(deck, meta));
}

const totalShapes = deck.slides.reduce((n, s) => n + s.items.length, 0);
const animated = report.reduce((n, r) => n + r.shapes, 0);

console.log(`\n  ${EVENT_NAME} — Winners deck\n`);
console.log(`  Winner      : ${winner.teamName} (${winner.members.length} members)`);
if (runnerUp) console.log(`  Runner-up   : ${runnerUp.teamName} (${runnerUp.members.length} members)`);
if (third) console.log(`  Third place : ${third.teamName} (${third.members.length} members)`);
console.log(`\n  Slides      : ${deck.slides.length}`);
console.log(`  Shapes      : ${totalShapes} (${animated} animated)`);
console.log(`  Transitions : ${report.map((r) => r.transition).join(', ')}`);
console.log(`\n  PPTX        : ${path.relative(projectRoot, pptxPath)}`);
if (htmlPath) console.log(`  Preview     : ${path.relative(projectRoot, htmlPath)}`);
if (missingPhotos.length) {
  console.log(`\n  Note: photo file(s) not found, using initials instead:`);
  for (const [name, rel] of missingPhotos) console.log(`    - ${name} -> ${rel}`);
}
console.log('');
for (const r of report) {
  console.log(`  slide ${String(r.slide).padStart(2)}  ${String(r.shapes).padStart(3)} anim shapes  ${r.steps} steps  ${r.transition}`);
}
console.log('');
