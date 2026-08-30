import PptxGenJS from 'pptxgenjs';
import { theme } from '../config.mjs';
import { encodeAnimName, injectAnimations } from './anim-xml.mjs';

function textOpts(item) {
  const o = {
    x: item.x,
    y: item.y,
    w: item.w,
    h: item.h,
    fontFace: item.fontFace ?? theme.font,
    fontSize: item.fontSize ?? 14,
    color: item.color ?? theme.white,
    bold: item.bold ?? false,
    italic: item.italic ?? false,
    align: item.align ?? 'left',
    valign: item.valign ?? 'top',
    wrap: item.wrap ?? true,
    isTextBox: true,
    margin: 0,
  };
  if (item.charSpacing !== undefined) o.charSpacing = item.charSpacing;
  if (item.lineSpacingMultiple !== undefined) o.lineSpacingMultiple = item.lineSpacingMultiple;
  if (item.shadow) o.shadow = item.shadow;
  if (item.anim) o.objectName = encodeAnimName(item.anim);
  return o;
}

function shapeOpts(item) {
  const o = { x: item.x, y: item.y, w: item.w, h: item.h };
  if (item.fill) o.fill = item.fill;
  if (item.line) o.line = item.line;
  if (item.rotate !== undefined) o.rotate = item.rotate;
  if (item.flipV) o.flipV = true;
  if (item.flipH) o.flipH = true;
  if (item.rectRadius !== undefined) o.rectRadius = item.rectRadius;
  if (item.shadow) o.shadow = item.shadow;
  if (item.anim) o.objectName = encodeAnimName(item.anim);
  return o;
}

export async function renderPptx(deck, meta) {
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = meta.author;
  pptx.company = meta.author;
  pptx.title = meta.title;
  pptx.subject = meta.subject;
  pptx.theme = { headFontFace: theme.font, bodyFontFace: theme.font };

  for (const slide of deck.slides) {
    const s = pptx.addSlide();
    s.background = { color: slide.bg };

    for (const item of slide.items) {
      if (item.kind === 'shape') {
        s.addShape(item.shape, shapeOpts(item));
      } else if (item.kind === 'text') {
        s.addText(item.text, textOpts(item));
      } else if (item.kind === 'image') {
        const o = {
          path: item.path,
          x: item.x,
          y: item.y,
          w: item.w,
          h: item.h,
        };
        if (item.sizing) o.sizing = item.sizing;
        if (item.rounding) o.rounding = true;
        if (item.anim) o.objectName = encodeAnimName(item.anim);
        s.addImage(o);
      }
    }
  }

  const raw = await pptx.write({ outputType: 'nodebuffer' });
  return injectAnimations(raw, deck.slides.map((s) => s.transition));
}
