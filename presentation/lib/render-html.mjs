import fs from 'node:fs';
import path from 'node:path';
import { theme } from '../config.mjs';
import { SLIDE_W, SLIDE_H } from './deck.mjs';

const PX = 96;
const PT = 96 / 72;

// Durations must match the pptx effect table so the preview is faithful.
const DUR = {
  fade: 600,
  fadeslow: 1300,
  fadefast: 350,
  zoom: 700,
  zoomout: 900,
  pop: 420,
  floatup: 750,
  floatdown: 750,
  flyup: 800,
  flyleft: 750,
  flyright: 750,
  wipeup: 650,
  wiperight: 800,
  spin: 950,
  grow: 850,
  drop: 1100,
};

function starPolygon(points, innerRatio) {
  const pts = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? 0.5 : 0.5 * innerRatio;
    const a = (Math.PI * i) / points - Math.PI / 2;
    pts.push(`${(50 + r * 100 * Math.cos(a)).toFixed(1)}% ${(50 + r * 100 * Math.sin(a)).toFixed(1)}%`);
  }
  return `polygon(${pts.join(', ')})`;
}

const CLIP = {
  triangle: 'polygon(50% 0%, 100% 100%, 0% 100%)',
  diamond: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
  star4: starPolygon(4, 0.38),
  star5: starPolygon(5, 0.48),
  star8: starPolygon(8, 0.62),
  trapezoid: 'polygon(22% 0%, 78% 0%, 100% 100%, 0% 100%)',
  trapezoidFlip: 'polygon(0% 0%, 100% 0%, 78% 100%, 22% 100%)',
};

function rgba(hex, transparency = 0) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${(1 - transparency / 100).toFixed(3)})`;
}

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function dataUri(file) {
  const ext = path.extname(file).slice(1).toLowerCase();
  const mime = ext === 'svg' ? 'image/svg+xml' : ext === 'jpg' ? 'image/jpeg' : `image/${ext}`;
  return `data:${mime};base64,${fs.readFileSync(file).toString('base64')}`;
}

function box(item) {
  return `left:${(item.x * PX).toFixed(2)}px;top:${(item.y * PX).toFixed(2)}px;` +
    `width:${(item.w * PX).toFixed(2)}px;height:${(item.h * PX).toFixed(2)}px;`;
}

function animAttrs(item) {
  if (!item.anim) return '';
  const a = item.anim;
  return ` data-step="${a.step}" data-effect="${a.effect}" data-delay="${a.delay}"` +
    ` data-dur="${DUR[a.effect] ?? 600}"${a.click ? ' data-click="1"' : ''}`;
}

function renderShape(item) {
  const s = [];
  const shape = item.shape;

  if (item.fill) s.push(`background:${rgba(item.fill.color, item.fill.transparency ?? 0)}`);
  if (item.line) s.push(`border:${item.line.width ?? 1}px solid ${rgba(item.line.color, 0)};box-sizing:border-box`);

  if (shape === 'ellipse') s.push('border-radius:50%');
  else if (shape === 'roundRect') s.push(`border-radius:${((item.rectRadius ?? 0.1) * PX).toFixed(1)}px`);
  else if (shape === 'donut') {
    const bw = Math.min(item.w, item.h) * PX * 0.26;
    s.length = 0;
    s.push(`border-radius:50%;background:transparent;box-sizing:border-box`);
    s.push(`border:${bw.toFixed(1)}px solid ${rgba(item.fill?.color ?? 'FFFFFF', item.fill?.transparency ?? 0)}`);
  } else if (CLIP[shape]) {
    s.push(`clip-path:${item.flipV && shape === 'trapezoid' ? CLIP.trapezoidFlip : CLIP[shape]}`);
  }

  const wrap = `transform:rotate(${item.rotate ?? 0}deg);`;
  return `<div class="it" style="${box(item)}${wrap}">` +
    `<div class="an" style="${s.join(';')}"${animAttrs(item)}></div></div>`;
}

function runsHtml(item) {
  const base = {
    fontSize: item.fontSize ?? 14,
    bold: item.bold ?? false,
    italic: item.italic ?? false,
    color: item.color ?? theme.white,
    charSpacing: item.charSpacing,
  };
  const runs = Array.isArray(item.text) ? item.text : [{ text: item.text }];
  let html = '';
  for (const r of runs) {
    const o = { ...base, ...(r.options ?? {}) };
    const st = [
      `font-size:${(o.fontSize * PT).toFixed(2)}px`,
      `color:#${(o.color ?? theme.white).replace('#', '')}`,
      `font-weight:${o.bold ? 800 : 400}`,
    ];
    if (o.italic) st.push('font-style:italic');
    if (o.charSpacing !== undefined) st.push(`letter-spacing:${(o.charSpacing * PT).toFixed(2)}px`);
    html += `<span style="${st.join(';')}">${esc(r.text ?? '')}</span>`;
    if (r.options?.breakLine) html += '<br/>';
  }
  return html;
}

function renderText(item) {
  const justify =
    item.valign === 'middle' ? 'center' : item.valign === 'bottom' ? 'flex-end' : 'flex-start';
  const alignItems = item.align === 'center' ? 'center' : item.align === 'right' ? 'flex-end' : 'flex-start';
  const st = [
    'display:flex',
    'flex-direction:column',
    `justify-content:${justify}`,
    `align-items:${alignItems}`,
    `text-align:${item.align ?? 'left'}`,
    `line-height:${item.lineSpacingMultiple ?? 1.18}`,
  ];
  return `<div class="it" style="${box(item)}">` +
    `<div class="an tx" style="${st.join(';')}"${animAttrs(item)}><div>${runsHtml(item)}</div></div></div>`;
}

function renderImage(item, resolve) {
  const src = resolve(item.path);
  if (!src) return '';
  const fit = item.rounding ? 'cover' : 'contain';
  const radius = item.rounding ? 'border-radius:50%;' : '';
  return `<div class="it" style="${box(item)}">` +
    `<div class="an"${animAttrs(item)}>` +
    `<img src="${src}" style="width:100%;height:100%;object-fit:${fit};${radius}"/></div></div>`;
}

export function renderHtml(deck, meta) {
  const cache = new Map();
  const resolve = (p) => {
    if (!p) return '';
    if (!cache.has(p)) {
      try {
        cache.set(p, dataUri(p));
      } catch {
        cache.set(p, '');
      }
    }
    return cache.get(p);
  };

  const slides = deck.slides
    .map((slide, i) => {
      const body = slide.items
        .map((item) =>
          item.kind === 'shape'
            ? renderShape(item)
            : item.kind === 'text'
              ? renderText(item)
              : renderImage(item, resolve)
        )
        .join('\n      ');
      return `    <section class="slide" data-i="${i}" data-transition="${slide.transition}" style="background:#${slide.bg}">\n      ${body}\n    </section>`;
    })
    .join('\n');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${esc(meta.title)}</title>
<style>
  *{margin:0;padding:0;box-sizing:content-box}
  html,body{height:100%;background:#05070f;overflow:hidden;
    font-family:"Segoe UI",Inter,system-ui,-apple-system,sans-serif}
  #stage{position:absolute;left:50%;top:50%;width:${SLIDE_W * PX}px;height:${SLIDE_H * PX}px;
    transform-origin:center center;box-shadow:0 30px 90px rgba(0,0,0,.7)}
  .slide{position:absolute;inset:0;overflow:hidden;display:none}
  .slide.active{display:block}
  .slide.enter{animation:slideIn .55s ease both}
  .it{position:absolute}
  .an{width:100%;height:100%;opacity:0}
  .an.done{opacity:1}
  .tx{white-space:pre-wrap;word-break:break-word}
  @keyframes slideIn{from{opacity:0}to{opacity:1}}
  @keyframes fade{from{opacity:0}to{opacity:1}}
  @keyframes fadeslow{from{opacity:0}to{opacity:1}}
  @keyframes fadefast{from{opacity:0}to{opacity:1}}
  @keyframes zoom{from{opacity:0;transform:scale(.01)}to{opacity:1;transform:scale(1)}}
  @keyframes zoomout{from{opacity:0;transform:scale(2.8)}to{opacity:1;transform:scale(1)}}
  @keyframes pop{from{opacity:0;transform:scale(.2)}60%{opacity:1;transform:scale(1.08)}to{opacity:1;transform:scale(1)}}
  @keyframes floatup{from{opacity:0;transform:translateY(50px)}to{opacity:1;transform:translateY(0)}}
  @keyframes floatdown{from{opacity:0;transform:translateY(-50px)}to{opacity:1;transform:translateY(0)}}
  @keyframes flyup{from{opacity:0;transform:translateY(380px)}to{opacity:1;transform:translateY(0)}}
  @keyframes flyleft{from{opacity:0;transform:translateX(-340px)}to{opacity:1;transform:translateX(0)}}
  @keyframes flyright{from{opacity:0;transform:translateX(340px)}to{opacity:1;transform:translateX(0)}}
  @keyframes wipeup{from{opacity:1;clip-path:inset(100% 0 0 0)}to{opacity:1;clip-path:inset(0 0 0 0)}}
  @keyframes wiperight{from{opacity:1;clip-path:inset(0 100% 0 0)}to{opacity:1;clip-path:inset(0 0 0 0)}}
  @keyframes spin{from{opacity:0;transform:scale(.01) rotate(0)}to{opacity:1;transform:scale(1) rotate(360deg)}}
  @keyframes grow{from{opacity:0;transform:scale(.01) rotate(0)}to{opacity:1;transform:scale(1) rotate(180deg)}}
  @keyframes drop{from{opacity:0;transform:translateY(-240px) rotate(0)}to{opacity:1;transform:translateY(0) rotate(360deg)}}
  #hint{position:fixed;left:0;right:0;bottom:14px;text-align:center;color:#5d6a8c;font-size:12px;
    letter-spacing:1.5px;text-transform:uppercase;pointer-events:none}
  #num{position:fixed;right:18px;top:14px;color:#5d6a8c;font-size:12px;letter-spacing:1px}
  #cue{position:fixed;left:50%;bottom:44px;transform:translateX(-50%);color:#FFC857;font-size:12px;
    letter-spacing:2px;text-transform:uppercase;opacity:0;transition:opacity .3s}
  #cue.on{opacity:1;animation:pulse 1.4s ease-in-out infinite}
  @keyframes pulse{0%,100%{opacity:.35}50%{opacity:1}}
</style>
</head>
<body>
<div id="stage">
${slides}
</div>
<div id="num"></div>
<div id="cue">click to reveal</div>
<div id="hint">space / &rarr; advance &nbsp;·&nbsp; &larr; back &nbsp;·&nbsp; f fullscreen</div>
<script>
const stage = document.getElementById('stage');
const slides = [...document.querySelectorAll('.slide')];
const cue = document.getElementById('cue');
const num = document.getElementById('num');
const SW = ${SLIDE_W * PX}, SH = ${SLIDE_H * PX};

function fit(){
  const s = Math.min(window.innerWidth / SW, (window.innerHeight - 60) / SH);
  stage.style.transform = 'translate(-50%,-50%) scale(' + s + ')';
}
window.addEventListener('resize', fit); fit();

let idx = 0, token = 0, gate = null, running = false;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function reset(el){
  el.querySelectorAll('.an').forEach(n => {
    n.style.animation = 'none';
    n.classList.remove('done');
    n.style.opacity = n.dataset.step ? '0' : '1';
  });
}

function fire(n){
  n.style.animation = n.dataset.effect + ' ' + n.dataset.dur + 'ms cubic-bezier(.22,.68,.28,1) both';
  n.classList.add('done');
}

function finishAll(el){
  el.querySelectorAll('.an[data-step]').forEach(n => {
    n.style.animation = 'none';
    n.style.opacity = '1';
    n.classList.add('done');
  });
}

async function play(el, myToken){
  running = true;
  const nodes = [...el.querySelectorAll('.an[data-step]')];
  const map = new Map();
  for (const n of nodes){
    const k = +n.dataset.step;
    if (!map.has(k)) map.set(k, { click:false, nodes:[] });
    const g = map.get(k);
    if (n.dataset.click) g.click = true;
    g.nodes.push(n);
  }
  for (const k of [...map.keys()].sort((a,b)=>a-b)){
    const g = map.get(k);
    if (g.click){
      cue.classList.add('on');
      await new Promise(res => { gate = res; });
      cue.classList.remove('on');
      if (myToken !== token) return;
    }
    let end = 0;
    for (const n of g.nodes){
      const d = +n.dataset.delay, du = +n.dataset.dur;
      end = Math.max(end, d + du);
      setTimeout(() => { if (myToken === token) fire(n); }, d);
    }
    await sleep(end + 30);
    if (myToken !== token) return;
  }
  running = false;
}

function show(i){
  token++;
  gate = null;
  running = false;
  cue.classList.remove('on');
  idx = Math.max(0, Math.min(slides.length - 1, i));
  slides.forEach(s => { s.classList.remove('active','enter'); });
  const el = slides[idx];
  reset(el);
  el.classList.add('active','enter');
  num.textContent = (idx + 1) + ' / ' + slides.length;
  play(el, token);
}

function advance(){
  if (gate){ const g = gate; gate = null; g(); return; }
  if (running){ token++; finishAll(slides[idx]); running = false; return; }
  if (idx < slides.length - 1) show(idx + 1);
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown' || e.key === 'Enter'){ e.preventDefault(); advance(); }
  else if (e.key === 'ArrowLeft' || e.key === 'PageUp'){ e.preventDefault(); show(idx - 1); }
  else if (e.key === 'Home') show(0);
  else if (e.key === 'End') show(slides.length - 1);
  else if (e.key === 'f') document.documentElement.requestFullscreen?.();
});
document.addEventListener('click', advance);

const qs = new URLSearchParams(location.search);
const start = Math.max(0, Math.min(slides.length - 1, (+qs.get('s') || 1) - 1));
show(start);
if (qs.get('still')) { token++; finishAll(slides[start]); running = false; cue.classList.remove('on'); }
</script>
</body>
</html>`;
}
