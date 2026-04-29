/**
 * Bipin — Tara's recurring friend across reference diagrams.
 * Same age (~12), friendly cartoon style, blue palette.
 * Visual signatures: blue cap + lighter skin tone + t-shirt and shorts.
 *
 * Same usage pattern as Tara: positioned <g> inside a parent SVG, origin at feet.
 */
import type { CSSProperties } from 'react';

export type BipinPose =
  | 'standing'
  | 'lookingUp'
  | 'lookingDown'
  | 'pointing'
  | 'walking'
  | 'measuring'    // crouched with hands on a measuring tape
  | 'thinking';

interface BipinProps {
  x?: number;
  y?: number;
  scale?: number;
  flip?: boolean;
  pose?: BipinPose;
  style?: CSSProperties;
}

const SKIN = '#e8b894';        // slightly lighter warm tone than Tara
const HAIR = '#1f1410';
const SHIRT = '#3b82f6';       // bright blue t-shirt
const SHIRT_DARK = '#1d4ed8';
const SHORTS = '#1e293b';      // dark slate shorts
const CAP = '#1e40af';         // navy blue cap
const STROKE = '#1f2937';

export default function Bipin({
  x = 0, y = 0, scale = 1, flip = false, pose = 'standing', style,
}: BipinProps) {
  const transform = `translate(${x}, ${y}) scale(${flip ? -scale : scale}, ${scale})`;
  return (
    <g transform={transform} style={style}>
      <BipinBody pose={pose} />
    </g>
  );
}

function BipinBody({ pose }: { pose: BipinPose }) {
  const headTilt = pose === 'lookingUp' ? -22 : pose === 'lookingDown' ? 18 : 0;
  const eyeDir = pose === 'lookingUp' ? 'up' : pose === 'lookingDown' ? 'down' : 'forward';

  if (pose === 'measuring') {
    // Special crouched pose
    return <BipinCrouching />;
  }

  return (
    <g>
      {/* Legs — shorts (shorter than Tara's leggings) */}
      {pose === 'walking' ? (
        <>
          <path d="M -4 0 L 2 -28 L 5 -28 L -1 0 Z" fill={SHORTS} stroke={STROKE} strokeWidth="1" strokeLinejoin="round" />
          <path d="M 4 0 L -2 -28 L 1 -28 L 7 0 Z" fill={SHORTS} stroke={STROKE} strokeWidth="1" strokeLinejoin="round" />
          {/* Visible bare lower legs (calves) */}
          <line x1="3" y1="-28" x2="6" y2="-12" stroke={SKIN} strokeWidth="4.5" strokeLinecap="round" />
          <line x1="-3" y1="-28" x2="-6" y2="-12" stroke={SKIN} strokeWidth="4.5" strokeLinecap="round" />
        </>
      ) : (
        <>
          {/* Shorts */}
          <rect x="-7" y="-44" width="6" height="14" rx="2" fill={SHORTS} stroke={STROKE} strokeWidth="1" />
          <rect x="1" y="-44" width="6" height="14" rx="2" fill={SHORTS} stroke={STROKE} strokeWidth="1" />
          {/* Bare calves */}
          <rect x="-6.5" y="-30" width="5" height="28" rx="2" fill={SKIN} stroke={STROKE} strokeWidth="0.8" />
          <rect x="1.5" y="-30" width="5" height="28" rx="2" fill={SKIN} stroke={STROKE} strokeWidth="0.8" />
        </>
      )}

      {/* Shoes */}
      <ellipse cx={pose === 'walking' ? 4 : -4} cy="-1" rx="5" ry="2.5" fill={STROKE} />
      <ellipse cx={pose === 'walking' ? -2 : 4} cy="-1" rx="5" ry="2.5" fill={STROKE} />

      {/* Torso — t-shirt, slightly fitted */}
      <path
        d="M -12 -44 L -10 -68 L 10 -68 L 12 -44 Z"
        fill={SHIRT} stroke={STROKE} strokeWidth="1.2" strokeLinejoin="round"
      />
      {/* T-shirt collar (round neck) */}
      <path d="M -5 -68 Q 0 -64 5 -68" fill="none" stroke={SHIRT_DARK} strokeWidth="1.2" />
      {/* T-shirt detail line */}
      <line x1="-2" y1="-60" x2="2" y2="-60" stroke="white" strokeWidth="1.5" opacity="0.7" />
      <line x1="-3" y1="-56" x2="3" y2="-56" stroke="white" strokeWidth="1.5" opacity="0.7" />

      <Arms pose={pose} />

      {/* Neck */}
      <rect x="-3" y="-72" width="6" height="6" fill={SKIN} stroke={STROKE} strokeWidth="0.8" />

      {/* Head group — rotates as a unit for tilt */}
      <g transform={`rotate(${headTilt}, 0, -72)`}>
        {/* Head */}
        <ellipse cx="0" cy="-86" rx="13" ry="14.5" fill={SKIN} stroke={STROKE} strokeWidth="1.2" />

        {/* Hair — short, peeking out from under cap */}
        <path
          d="M -13 -88 Q -10 -94 -6 -94 M 13 -88 Q 10 -94 6 -94"
          fill="none" stroke={HAIR} strokeWidth="2" strokeLinecap="round"
        />
        {/* Sideburn hints */}
        <path d="M -12 -86 L -12 -82" stroke={HAIR} strokeWidth="2" strokeLinecap="round" />
        <path d="M 12 -86 L 12 -82" stroke={HAIR} strokeWidth="2" strokeLinecap="round" />

        {/* Cap — sits on top of head, brim facing forward */}
        <path
          d="M -13 -97 Q -13 -103 0 -103 Q 13 -103 13 -97 L 13 -94 L -13 -94 Z"
          fill={CAP} stroke={STROKE} strokeWidth="1.2" strokeLinejoin="round"
        />
        {/* Cap brim (visor) */}
        <path
          d="M -2 -94 Q 0 -90 12 -90 L 13 -94 Z"
          fill={CAP} stroke={STROKE} strokeWidth="1" strokeLinejoin="round"
        />
        {/* Cap front emblem — small star or dot */}
        <circle cx="0" cy="-99" r="1.5" fill="white" opacity="0.9" />

        {/* Eyes */}
        <Eyes dir={eyeDir} />

        {/* Eyebrows */}
        <path d={`M -8 ${eyeDir === 'up' ? -94 : -92} Q -5 ${eyeDir === 'up' ? -96 : -93} -2 ${eyeDir === 'up' ? -94 : -92}`} fill="none" stroke={HAIR} strokeWidth="1.5" strokeLinecap="round" />
        <path d={`M 2 ${eyeDir === 'up' ? -94 : -92} Q 5 ${eyeDir === 'up' ? -96 : -93} 8 ${eyeDir === 'up' ? -94 : -92}`} fill="none" stroke={HAIR} strokeWidth="1.5" strokeLinecap="round" />

        {/* Mouth */}
        <path
          d={pose === 'lookingUp' || pose === 'pointing' ? "M -3 -80 Q 0 -76 3 -80" : "M -2 -80 Q 0 -78 2 -80"}
          fill="none" stroke={STROKE} strokeWidth="1.2" strokeLinecap="round"
        />
      </g>
    </g>
  );
}

function BipinCrouching() {
  // Crouched, working with hands at ground level — for measuring tape scenes
  return (
    <g>
      {/* Back leg (folded) */}
      <path d="M -8 0 L -10 -10 L 0 -16 L 2 -8 Z" fill={SHORTS} stroke={STROKE} strokeWidth="1" strokeLinejoin="round" />
      {/* Front leg (kneeling) */}
      <path d="M 4 0 L 8 -8 L 12 -22 L 8 -22 Z" fill={SHORTS} stroke={STROKE} strokeWidth="1" strokeLinejoin="round" />
      {/* Visible knees */}
      <circle cx="10" cy="-22" r="3" fill={SKIN} stroke={STROKE} strokeWidth="0.8" />

      {/* Torso — leaning forward */}
      <path d="M -10 -22 L -4 -42 L 14 -42 L 16 -22 Z" fill={SHIRT} stroke={STROKE} strokeWidth="1.2" strokeLinejoin="round" />

      {/* Arm reaching down */}
      <path d="M 14 -42 L 22 -32 L 28 -18" fill="none" stroke={SHIRT} strokeWidth="6" strokeLinecap="round" />
      <circle cx="28" cy="-18" r="3" fill={SKIN} stroke={STROKE} strokeWidth="0.8" />
      {/* Other arm bracing */}
      <path d="M -10 -22 L -2 -10 L 4 -8" fill="none" stroke={SHIRT} strokeWidth="6" strokeLinecap="round" />
      <circle cx="4" cy="-8" r="3" fill={SKIN} stroke={STROKE} strokeWidth="0.8" />

      {/* Head — looking down */}
      <g transform="rotate(20, 5, -42)">
        <ellipse cx="5" cy="-54" rx="11" ry="12" fill={SKIN} stroke={STROKE} strokeWidth="1.2" />
        {/* Cap on tilted head */}
        <path d="M -6 -64 Q -6 -69 5 -69 Q 16 -69 16 -64 L 16 -62 L -6 -62 Z" fill={CAP} stroke={STROKE} strokeWidth="1.2" />
        <path d="M 4 -62 Q 5 -58 14 -58 L 16 -62 Z" fill={CAP} stroke={STROKE} strokeWidth="1" />
        {/* Eyes (closed/concentrating) */}
        <path d="M 1 -56 L 4 -56 M 7 -56 L 10 -56" stroke={STROKE} strokeWidth="1.5" strokeLinecap="round" />
        {/* Mouth */}
        <line x1="3" y1="-50" x2="7" y2="-50" stroke={STROKE} strokeWidth="1" />
      </g>
    </g>
  );
}

function Eyes({ dir }: { dir: 'forward' | 'up' | 'down' }) {
  const pupilDy = dir === 'up' ? -1.5 : dir === 'down' ? 1.5 : 0;
  return (
    <g>
      <ellipse cx="-5" cy="-89" rx="2.5" ry="2.8" fill="white" stroke={STROKE} strokeWidth="0.8" />
      <ellipse cx="5" cy="-89" rx="2.5" ry="2.8" fill="white" stroke={STROKE} strokeWidth="0.8" />
      <circle cx={-5} cy={-89 + pupilDy} r="1.3" fill={STROKE} />
      <circle cx={5} cy={-89 + pupilDy} r="1.3" fill={STROKE} />
      <circle cx={-4.5} cy={-89.5 + pupilDy} r="0.4" fill="white" />
      <circle cx={5.5} cy={-89.5 + pupilDy} r="0.4" fill="white" />
    </g>
  );
}

function Arms({ pose }: { pose: BipinPose }) {
  const shirtFill = SHIRT;
  const skinFill = SKIN;

  if (pose === 'lookingUp') {
    return (
      <g>
        <path d="M -10 -66 L -14 -50 L -16 -38" fill="none" stroke={shirtFill} strokeWidth="6" strokeLinecap="round" />
        <circle cx="-16" cy="-38" r="3.5" fill={skinFill} stroke={STROKE} strokeWidth="0.8" />
        {/* Right arm raised */}
        <path d="M 10 -66 L 16 -78 L 10 -90" fill="none" stroke={shirtFill} strokeWidth="6" strokeLinecap="round" />
        <circle cx="10" cy="-90" r="3.5" fill={skinFill} stroke={STROKE} strokeWidth="0.8" />
      </g>
    );
  }

  if (pose === 'pointing') {
    return (
      <g>
        <path d="M -10 -66 L -14 -50 L -16 -38" fill="none" stroke={shirtFill} strokeWidth="6" strokeLinecap="round" />
        <circle cx="-16" cy="-38" r="3.5" fill={skinFill} stroke={STROKE} strokeWidth="0.8" />
        {/* Pointing arm */}
        <path d="M 10 -66 L 22 -68 L 32 -64" fill="none" stroke={shirtFill} strokeWidth="6" strokeLinecap="round" />
        <circle cx="32" cy="-64" r="3" fill={skinFill} stroke={STROKE} strokeWidth="0.8" />
        <line x1="32" y1="-64" x2="38" y2="-63" stroke={skinFill} strokeWidth="2.2" strokeLinecap="round" />
      </g>
    );
  }

  if (pose === 'lookingDown') {
    return (
      <g>
        <path d="M -10 -66 L -14 -56 L -10 -46" fill="none" stroke={shirtFill} strokeWidth="6" strokeLinecap="round" />
        <circle cx="-10" cy="-46" r="3" fill={skinFill} stroke={STROKE} strokeWidth="0.8" />
        <path d="M 10 -66 L 14 -56 L 10 -46" fill="none" stroke={shirtFill} strokeWidth="6" strokeLinecap="round" />
        <circle cx="10" cy="-46" r="3" fill={skinFill} stroke={STROKE} strokeWidth="0.8" />
      </g>
    );
  }

  if (pose === 'thinking') {
    return (
      <g>
        <path d="M -10 -66 L -14 -50 L -16 -38" fill="none" stroke={shirtFill} strokeWidth="6" strokeLinecap="round" />
        <circle cx="-16" cy="-38" r="3.5" fill={skinFill} stroke={STROKE} strokeWidth="0.8" />
        <path d="M 10 -66 L 8 -76 L 2 -78" fill="none" stroke={shirtFill} strokeWidth="6" strokeLinecap="round" />
        <circle cx="2" cy="-78" r="3" fill={skinFill} stroke={STROKE} strokeWidth="0.8" />
      </g>
    );
  }

  if (pose === 'walking') {
    return (
      <g>
        <path d="M -10 -66 L -6 -54 L -2 -42" fill="none" stroke={shirtFill} strokeWidth="6" strokeLinecap="round" />
        <circle cx="-2" cy="-42" r="3.5" fill={skinFill} stroke={STROKE} strokeWidth="0.8" />
        <path d="M 10 -66 L 6 -54 L 2 -42" fill="none" stroke={shirtFill} strokeWidth="6" strokeLinecap="round" />
        <circle cx="2" cy="-42" r="3.5" fill={skinFill} stroke={STROKE} strokeWidth="0.8" />
      </g>
    );
  }

  return (
    <g>
      <path d="M -10 -66 L -13 -50 L -14 -38" fill="none" stroke={shirtFill} strokeWidth="6" strokeLinecap="round" />
      <circle cx="-14" cy="-38" r="3.5" fill={skinFill} stroke={STROKE} strokeWidth="0.8" />
      <path d="M 10 -66 L 13 -50 L 14 -38" fill="none" stroke={shirtFill} strokeWidth="6" strokeLinecap="round" />
      <circle cx="14" cy="-38" r="3.5" fill={skinFill} stroke={STROKE} strokeWidth="0.8" />
    </g>
  );
}
