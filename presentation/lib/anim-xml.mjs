import JSZip from 'jszip';
import { XMLValidator } from 'fast-xml-parser';

// pptxgenjs has no animation support, so animations are injected straight into
// the generated PresentationML. Each animated shape carries its schedule in its
// `objectName` (see encodeAnimName) and is matched back to its numeric shape id
// after the package is written.

const NAME_RE = /^z(\d{1,3})(c?)_([a-z0-9]+)_(\d+)$/;

export function encodeAnimName({ step, click = false, effect = 'fade', delay = 0 }) {
  return `z${String(step).padStart(2, '0')}${click ? 'c' : ''}_${effect}_${Math.round(delay)}`;
}

const DEG = 60000;

// presetID / presetSubtype only drive the label shown in PowerPoint's animation
// pane; the visible motion comes from the behaviour list.
const EFFECTS = {
  fade: { presetID: 10, subtype: 0, dur: 600, behaviors: ['fade'] },
  fadeslow: { presetID: 10, subtype: 0, dur: 1300, behaviors: ['fade'] },
  fadefast: { presetID: 10, subtype: 0, dur: 350, behaviors: ['fade'] },
  zoom: { presetID: 23, subtype: 16, dur: 700, behaviors: ['fade', 'scaleUp'] },
  zoomout: { presetID: 23, subtype: 16, dur: 900, behaviors: ['fade', 'scaleDown'] },
  pop: { presetID: 23, subtype: 16, dur: 420, behaviors: ['fade', 'scaleUp'] },
  floatup: { presetID: 42, subtype: 0, dur: 750, behaviors: ['fade', 'riseUp'] },
  floatdown: { presetID: 42, subtype: 0, dur: 750, behaviors: ['fade', 'riseDown'] },
  flyup: { presetID: 2, subtype: 4, dur: 800, behaviors: ['fromBottom'] },
  flyleft: { presetID: 2, subtype: 8, dur: 750, behaviors: ['fade', 'fromLeft'] },
  flyright: { presetID: 2, subtype: 2, dur: 750, behaviors: ['fade', 'fromRight'] },
  wipeup: { presetID: 22, subtype: 4, dur: 650, behaviors: ['wipeUp'] },
  wiperight: { presetID: 22, subtype: 8, dur: 800, behaviors: ['wipeRight'] },
  spin: { presetID: 18, subtype: 0, dur: 950, behaviors: ['fade', 'scaleUp', 'rot360'] },
  grow: { presetID: 33, subtype: 0, dur: 850, behaviors: ['fade', 'scaleUp', 'rot180'] },
  drop: { presetID: 2, subtype: 1, dur: 1100, behaviors: ['fade', 'fromTop', 'rot360'] },
};

export const EFFECT_NAMES = Object.keys(EFFECTS);

function attrDur(effect) {
  return EFFECTS[effect]?.dur ?? 600;
}

function behaviorXml(kind, spid, dur, id) {
  const tgt = `<p:tgtEl><p:spTgt spid="${spid}"/></p:tgtEl>`;
  const motion = (attr, from, to) =>
    `<p:anim calcmode="lin" valueType="num">` +
    `<p:cBhvr additive="base">` +
    `<p:cTn id="${id}" dur="${dur}" fill="hold"/>` +
    tgt +
    `<p:attrNameLst><p:attrName>${attr}</p:attrName></p:attrNameLst>` +
    `</p:cBhvr>` +
    `<p:tavLst>` +
    `<p:tav tm="0"><p:val><p:strVal val="${from}"/></p:val></p:tav>` +
    `<p:tav tm="100000"><p:val><p:strVal val="${to}"/></p:val></p:tav>` +
    `</p:tavLst>` +
    `</p:anim>`;
  const scale = (fx, fy) =>
    `<p:animScale>` +
    `<p:cBhvr><p:cTn id="${id}" dur="${dur}" fill="hold"/>${tgt}</p:cBhvr>` +
    `<p:from x="${fx}" y="${fy}"/><p:to x="100000" y="100000"/>` +
    `</p:animScale>`;
  const rot = (by) =>
    `<p:animRot by="${by}">` +
    `<p:cBhvr><p:cTn id="${id}" dur="${dur}" fill="hold"/>${tgt}</p:cBhvr>` +
    `</p:animRot>`;
  const filter = (f) =>
    `<p:animEffect transition="in" filter="${f}">` +
    `<p:cBhvr><p:cTn id="${id}" dur="${dur}"/>${tgt}</p:cBhvr>` +
    `</p:animEffect>`;

  switch (kind) {
    case 'fade':
      return filter('fade');
    case 'wipeUp':
      return filter('wipe(up)');
    case 'wipeRight':
      return filter('wipe(right)');
    case 'scaleUp':
      return scale(0, 0);
    case 'scaleDown':
      return scale(280000, 280000);
    case 'riseUp':
      return motion('ppt_y', '#ppt_y+.07', '#ppt_y');
    case 'riseDown':
      return motion('ppt_y', '#ppt_y-.07', '#ppt_y');
    case 'fromBottom':
      return motion('ppt_y', '1+#ppt_h/2', '#ppt_y');
    case 'fromTop':
      return motion('ppt_y', '0-#ppt_h', '#ppt_y');
    case 'fromLeft':
      return motion('ppt_x', '0-#ppt_w/2', '#ppt_x');
    case 'fromRight':
      return motion('ppt_x', '1+#ppt_w/2', '#ppt_x');
    case 'rot360':
      return rot(360 * DEG);
    case 'rot180':
      return rot(180 * DEG);
    default:
      return filter('fade');
  }
}

function effectXml(anim, ids, nodeType) {
  const spec = EFFECTS[anim.effect] ?? EFFECTS.fade;
  const dur = spec.dur;
  const parts = [
    `<p:set>` +
      `<p:cBhvr>` +
      `<p:cTn id="${ids.next()}" dur="1" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst></p:cTn>` +
      `<p:tgtEl><p:spTgt spid="${anim.spid}"/></p:tgtEl>` +
      `<p:attrNameLst><p:attrName>style.visibility</p:attrName></p:attrNameLst>` +
      `</p:cBhvr>` +
      `<p:to><p:strVal val="visible"/></p:to>` +
      `</p:set>`,
  ];
  for (const b of spec.behaviors) parts.push(behaviorXml(b, anim.spid, dur, ids.next()));

  return (
    `<p:par>` +
    `<p:cTn id="${ids.next()}" presetID="${spec.presetID}" presetClass="entr"` +
    ` presetSubtype="${spec.subtype}" fill="hold" grpId="0" nodeType="${nodeType}">` +
    `<p:stCondLst><p:cond delay="${anim.delay}"/></p:stCondLst>` +
    `<p:childTnLst>${parts.join('')}</p:childTnLst>` +
    `</p:cTn>` +
    `</p:par>`
  );
}

// One step = a set of shapes that animate together. Steps play one after the
// other; a step flagged `click` waits for the presenter.
function stepXml(step, ids) {
  const startDelay = step.click ? 'indefinite' : '0';
  const leadType = step.click ? 'clickEffect' : 'afterEffect';
  const effects = step.anims
    .map((a, i) => effectXml(a, ids, i === 0 ? leadType : 'withEffect'))
    .join('');

  const innerId = ids.next();
  const outerId = ids.next();
  return (
    `<p:par><p:cTn id="${outerId}" fill="hold">` +
    `<p:stCondLst><p:cond delay="${startDelay}"/></p:stCondLst>` +
    `<p:childTnLst>` +
    `<p:par><p:cTn id="${innerId}" fill="hold">` +
    `<p:stCondLst><p:cond delay="0"/></p:stCondLst>` +
    `<p:childTnLst>${effects}</p:childTnLst>` +
    `</p:cTn></p:par>` +
    `</p:childTnLst>` +
    `</p:cTn></p:par>`
  );
}

function timingXml(anims) {
  if (!anims.length) return '';

  const byStep = new Map();
  for (const a of anims) {
    if (!byStep.has(a.step)) byStep.set(a.step, { step: a.step, click: a.click, anims: [] });
    const g = byStep.get(a.step);
    g.click = g.click || a.click;
    g.anims.push(a);
  }
  const steps = [...byStep.values()].sort((a, b) => a.step - b.step);
  for (const s of steps) s.anims.sort((a, b) => a.delay - b.delay || a.spid - b.spid);

  let counter = 2;
  const ids = { next: () => ++counter };
  const body = steps.map((s) => stepXml(s, ids)).join('');

  return (
    `<p:timing><p:tnLst>` +
    `<p:par><p:cTn id="1" dur="indefinite" restart="never" nodeType="tmRoot"><p:childTnLst>` +
    `<p:seq concurrent="1" nextAc="seek">` +
    `<p:cTn id="2" dur="indefinite" nodeType="mainSeq"><p:childTnLst>${body}</p:childTnLst></p:cTn>` +
    `<p:prevCondLst><p:cond evt="onPrev" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:prevCondLst>` +
    `<p:nextCondLst><p:cond evt="onNext" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:nextCondLst>` +
    `</p:seq>` +
    `</p:childTnLst></p:cTn></p:par>` +
    `</p:tnLst></p:timing>`
  );
}

const TRANSITIONS = {
  fade: '<p:fade/>',
  dissolve: '<p:dissolve/>',
  circle: '<p:circle/>',
  wedge: '<p:wedge/>',
  wheel: '<p:wheel spokes="8"/>',
  newsflash: '<p:newsflash/>',
  zoomin: '<p:zoom dir="in"/>',
  zoomout: '<p:zoom dir="out"/>',
  pushup: '<p:push dir="u"/>',
  pushleft: '<p:push dir="l"/>',
  coverup: '<p:cover dir="u"/>',
  wipeup: '<p:wipe dir="u"/>',
  splitv: '<p:split orient="vert" dir="out"/>',
};

export const TRANSITION_NAMES = Object.keys(TRANSITIONS);

function transitionXml(name, speed = 'slow') {
  const inner = TRANSITIONS[name];
  if (!inner) return '';
  return `<p:transition spd="${speed}">${inner}</p:transition>`;
}

function readAnims(slideXml) {
  const anims = [];
  const re = /<p:cNvPr\s+id="(\d+)"\s+name="([^"]*)"/g;
  let m;
  while ((m = re.exec(slideXml)) !== null) {
    const parsed = NAME_RE.exec(m[2]);
    if (!parsed) continue;
    anims.push({
      spid: Number(m[1]),
      step: Number(parsed[1]),
      click: parsed[2] === 'c',
      effect: parsed[3],
      delay: Number(parsed[4]),
    });
  }
  return anims;
}

export async function injectAnimations(pptxBuffer, transitions) {
  const zip = await JSZip.loadAsync(pptxBuffer);

  const slideFiles = Object.keys(zip.files)
    .filter((f) => /^ppt\/slides\/slide\d+\.xml$/.test(f))
    .sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]));

  const report = [];

  for (let i = 0; i < slideFiles.length; i++) {
    const file = slideFiles[i];
    let xml = await zip.file(file).async('string');

    const anims = readAnims(xml);
    const unknown = anims.filter((a) => !EFFECTS[a.effect]).map((a) => a.effect);
    if (unknown.length) throw new Error(`${file}: unknown effect(s) ${[...new Set(unknown)].join(', ')}`);

    const transition = transitions[i] ?? 'fade';
    if (!TRANSITIONS[transition]) throw new Error(`${file}: unknown transition "${transition}"`);

    const inject = transitionXml(transition) + timingXml(anims);
    if (!xml.includes('</p:sld>')) throw new Error(`${file}: missing </p:sld>`);
    xml = xml.replace('</p:sld>', `${inject}</p:sld>`);

    const check = XMLValidator.validate(xml);
    if (check !== true) throw new Error(`${file}: invalid XML after injection - ${check.err?.msg}`);

    zip.file(file, xml);
    report.push({ slide: i + 1, shapes: anims.length, steps: new Set(anims.map((a) => a.step)).size, transition });
  }

  const out = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });
  return { buffer: out, report };
}
