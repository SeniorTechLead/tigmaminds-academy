/**
 * Bipin — Tara's recurring friend across reference diagrams.
 * Same age (~12), friendly cartoon style. School-uniform look.
 * Visual signatures: side-parted black hair with forehead fringe,
 * white short-sleeve shirt + navy school shorts + small red tie.
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
const SHIRT = '#ffffff';       // white school shirt
const SHIRT_SHADOW = '#cbd5e1'; // soft grey for shadows / collar
const TIE = '#dc2626';         // red school tie
const TIE_DARK = '#7f1d1d';
const SHORTS = '#1e3a5f';      // navy school shorts
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

      {/* Torso — white school shirt, slightly fitted */}
      <path
        d="M -12 -44 L -10 -68 L 10 -68 L 12 -44 Z"
        fill={SHIRT} stroke={STROKE} strokeWidth="1.2" strokeLinejoin="round"
      />
      {/* Shirt collar — V-shape lapels */}
      <path d="M -7 -68 L -3 -62 L 0 -64 L 3 -62 L 7 -68"
        fill={SHIRT} stroke={STROKE} strokeWidth="1.1" strokeLinejoin="round" />
      {/* Tie — knot below the collar */}
      <path d="M -3 -62 L 3 -62 L 4 -58 L 0 -56 L -4 -58 Z" fill={TIE} stroke={TIE_DARK} strokeWidth="0.8" />
      {/* Tie body */}
      <path d="M -3 -56 L 3 -56 L 2 -42 L 0 -38 L -2 -42 Z" fill={TIE} stroke={TIE_DARK} strokeWidth="0.8" />
      {/* Shirt buttons — tiny dots */}
      <circle cx="0" cy="-46" r="0.6" fill={SHIRT_SHADOW} />
      {/* Shirt sleeve cuff hint — short sleeve crease */}
      <line x1="-12" y1="-58" x2="-9" y2="-58" stroke={SHIRT_SHADOW} strokeWidth="0.5" opacity="0.6" />
      <line x1="9" y1="-58" x2="12" y2="-58" stroke={SHIRT_SHADOW} strokeWidth="0.5" opacity="0.6" />

      <Arms pose={pose} />

      {/* Neck */}
      <rect x="-3" y="-72" width="6" height="6" fill={SKIN} stroke={STROKE} strokeWidth="0.8" />

      {/* Head group — rotates as a unit for tilt */}
      <g transform={`rotate(${headTilt}, 0, -72)`}>
        {/* Head */}
        <ellipse cx="0" cy="-86" rx="13" ry="14.5" fill={SKIN} stroke={STROKE} strokeWidth="1.2" />

        {/* Hair — short, side-parted with forehead fringe.
            Crown is fully covered; a fringe sweeps from the left part across the forehead to the right.
            The right side has a clear part-line. No cap. */}
        <path
          d="M -13 -88 Q -13 -101 -2 -103 Q 11 -103 13 -94 Q 13 -97 11 -97 Q 7 -97 4 -95 Q 0 -94 -4 -94 Q -8 -94 -13 -88 Z"
          fill={HAIR} stroke={STROKE} strokeWidth="0.9" strokeLinejoin="round"
        />
        {/* The fringe — sweeps from left part over forehead */}
        <path
          d="M -8 -98 Q -3 -97 5 -94 Q 8 -93 9 -90"
          fill="none" stroke={HAIR} strokeWidth="2" strokeLinecap="round"
        />
        {/* Side parting — small gap line on the left */}
        <line x1="-7" y1="-100" x2="-7" y2="-95" stroke={SKIN} strokeWidth="1" />
        {/* Sideburns / temple hair */}
        <path d="M -13 -86 Q -13 -82 -11 -78" fill="none" stroke={HAIR} strokeWidth="2" strokeLinecap="round" />
        <path d="M 13 -86 Q 13 -82 11 -78" fill="none" stroke={HAIR} strokeWidth="2" strokeLinecap="round" />

        {/* Eyes */}
        <Eyes dir={eyeDir} />

        {/* Eyebrows — slightly thicker than Tara's, more masculine */}
        <path d={`M -9 ${eyeDir === 'up' ? -94 : -92} Q -6 ${eyeDir === 'up' ? -96 : -93.5} -3 ${eyeDir === 'up' ? -94 : -92}`} fill="none" stroke={HAIR} strokeWidth="1.7" strokeLinecap="round" />
        <path d={`M 3 ${eyeDir === 'up' ? -94 : -92} Q 6 ${eyeDir === 'up' ? -96 : -93.5} 9 ${eyeDir === 'up' ? -94 : -92}`} fill="none" stroke={HAIR} strokeWidth="1.7" strokeLinecap="round" />

        {/* Small nose hint */}
        <path d="M 0 -84 Q 1 -82 0 -81" fill="none" stroke={STROKE} strokeWidth="0.7" strokeLinecap="round" opacity="0.6" />

        {/* Mouth */}
        <path
          d={pose === 'lookingUp' || pose === 'pointing' ? "M -3 -78 Q 0 -75 3 -78" : "M -2 -78 Q 0 -76 2 -78"}
          fill="none" stroke="#7c2d12" strokeWidth="1.3" strokeLinecap="round"
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

      {/* Arm reaching down — outlined */}
      <path d="M 14 -42 L 22 -32 L 28 -18" fill="none" stroke={STROKE} strokeWidth="7.4" strokeLinecap="round" />
      <path d="M 14 -42 L 22 -32 L 28 -18" fill="none" stroke={SHIRT} strokeWidth="6" strokeLinecap="round" />
      <circle cx="28" cy="-18" r="3" fill={SKIN} stroke={STROKE} strokeWidth="0.8" />
      {/* Other arm bracing */}
      <path d="M -10 -22 L -2 -10 L 4 -8" fill="none" stroke={STROKE} strokeWidth="7.4" strokeLinecap="round" />
      <path d="M -10 -22 L -2 -10 L 4 -8" fill="none" stroke={SHIRT} strokeWidth="6" strokeLinecap="round" />
      <circle cx="4" cy="-8" r="3" fill={SKIN} stroke={STROKE} strokeWidth="0.8" />

      {/* Head — looking down */}
      <g transform="rotate(20, 5, -42)">
        <ellipse cx="5" cy="-54" rx="11" ry="12" fill={SKIN} stroke={STROKE} strokeWidth="1.2" />
        {/* Hair — short, side-parted (tilted view) */}
        <path d="M -5 -60 Q -5 -67 5 -68 Q 16 -67 16 -60 L 14 -62 Q 8 -62 4 -60 Q -2 -60 -5 -60 Z"
          fill={HAIR} stroke={STROKE} strokeWidth="0.9" />
        {/* Eyes (closed/concentrating) */}
        <path d="M 1 -56 L 4 -56 M 7 -56 L 10 -56" stroke={STROKE} strokeWidth="1.5" strokeLinecap="round" />
        {/* Mouth */}
        <line x1="3" y1="-50" x2="7" y2="-50" stroke={STROKE} strokeWidth="1" />
      </g>
    </g>
  );
}

function Eyes({ dir }: { dir: 'forward' | 'up' | 'down' }) {
  const pupilDy = dir === 'up' ? -1.6 : dir === 'down' ? 1.6 : 0;
  return (
    <g>
      <ellipse cx="-5.5" cy="-89" rx="3" ry="3.2" fill="white" stroke={STROKE} strokeWidth="0.9" />
      <ellipse cx="5.5" cy="-89" rx="3" ry="3.2" fill="white" stroke={STROKE} strokeWidth="0.9" />
      <circle cx={-5.5} cy={-89 + pupilDy} r="1.7" fill="#1f1410" />
      <circle cx={5.5} cy={-89 + pupilDy} r="1.7" fill="#1f1410" />
      <circle cx={-5} cy={-89.5 + pupilDy} r="0.6" fill="white" />
      <circle cx={6} cy={-89.5 + pupilDy} r="0.6" fill="white" />
    </g>
  );
}

function Arms({ pose }: { pose: BipinPose }) {
  // The shirt is white, so arms drawn as plain white strokes would be invisible.
  // Use double-stroke trick: a slightly thicker dark stroke underneath, then
  // the white shirt stroke on top. This gives every arm a clear black outline.
  const shirtFill = SHIRT;
  const skinFill = SKIN;
  const armPath = (d: string, k: string | number) => (
    <g key={k}>
      <path d={d} fill="none" stroke={shirtFill} strokeWidth="6" strokeLinecap="round" />
      <path d={d} fill="none" stroke={shirtFill} strokeWidth="6" strokeLinecap="round" />
    </g>
  );

  if (pose === 'lookingUp') {
    return (
      <g>
        {armPath("M -10 -66 L -14 -50 L -16 -38", 'L')}
        <circle cx="-16" cy="-38" r="3.5" fill={skinFill} stroke={STROKE} strokeWidth="0.8" />
        {/* Right arm raised */}
        {armPath("M 10 -66 L 16 -78 L 10 -90", 'R')}
        <circle cx="10" cy="-90" r="3.5" fill={skinFill} stroke={STROKE} strokeWidth="0.8" />
      </g>
    );
  }

  if (pose === 'pointing') {
    return (
      <g>
        {armPath("M -10 -66 L -14 -50 L -16 -38", 'L')}
        <circle cx="-16" cy="-38" r="3.5" fill={skinFill} stroke={STROKE} strokeWidth="0.8" />
        {/* Pointing arm */}
        {armPath("M 10 -66 L 22 -68 L 32 -64", 'R')}
        <circle cx="32" cy="-64" r="3" fill={skinFill} stroke={STROKE} strokeWidth="0.8" />
        <line x1="32" y1="-64" x2="38" y2="-63" stroke={skinFill} strokeWidth="2.2" strokeLinecap="round" />
      </g>
    );
  }

  if (pose === 'lookingDown') {
    return (
      <g>
        {armPath("M -10 -66 L -14 -56 L -10 -46", 'L')}
        <circle cx="-10" cy="-46" r="3" fill={skinFill} stroke={STROKE} strokeWidth="0.8" />
        {armPath("M 10 -66 L 14 -56 L 10 -46", 'R')}
        <circle cx="10" cy="-46" r="3" fill={skinFill} stroke={STROKE} strokeWidth="0.8" />
      </g>
    );
  }

  if (pose === 'thinking') {
    return (
      <g>
        {armPath("M -10 -66 L -14 -50 L -16 -38", 'L')}
        <circle cx="-16" cy="-38" r="3.5" fill={skinFill} stroke={STROKE} strokeWidth="0.8" />
        {armPath("M 10 -66 L 8 -76 L 2 -78", 'R')}
        <circle cx="2" cy="-78" r="3" fill={skinFill} stroke={STROKE} strokeWidth="0.8" />
      </g>
    );
  }

  if (pose === 'walking') {
    return (
      <g>
        {armPath("M -10 -66 L -6 -54 L -2 -42", 'L')}
        <circle cx="-2" cy="-42" r="3.5" fill={skinFill} stroke={STROKE} strokeWidth="0.8" />
        {armPath("M 10 -66 L 6 -54 L 2 -42", 'R')}
        <circle cx="2" cy="-42" r="3.5" fill={skinFill} stroke={STROKE} strokeWidth="0.8" />
      </g>
    );
  }

  return (
    <g>
      {armPath("M -10 -66 L -13 -50 L -14 -38", 'L')}
      <circle cx="-14" cy="-38" r="3.5" fill={skinFill} stroke={STROKE} strokeWidth="0.8" />
      {armPath("M 10 -66 L 13 -50 L 14 -38", 'R')}
      <circle cx="14" cy="-38" r="3.5" fill={skinFill} stroke={STROKE} strokeWidth="0.8" />
    </g>
  );
}
